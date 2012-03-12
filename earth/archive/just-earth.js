/**
 * adapted from SceneJS Examples
 *
 */

var earth_diameter_km_actual = 12742.0;
var earth_orbital_radius_km_actual = 150000000.0;

var factor = 0.001

var earth_radius_km = earth_diameter_km_actual * factor;
var earth_orbital_radius_km = earth_orbital_radius_km_actual * factor;
var milky_way_apparent_radius = earth_orbital_radius_km * 10;

var earth_x_pos = 0;

var initial_earth_rotation = 0;

//
// Initial lookAt: eye
//
var distance = earth_radius_km * -3;

//
// Initial lookAt: eye
//
var initial_eye_quat;
var initial_eye_mat4;
var initial_eye_vec3 = vec3.create();
var initial_eye = {};

function update_initial_eye() {
    initial_eye_quat = quat4.axisAngleDegreesCreate(1, 0, 0, 0);
    initial_eye_mat4 = quat4.toMat4(initial_eye_quat);
    mat4.multiplyVec3(initial_eye_mat4, [0, 0,  distance], initial_eye_vec3);
    initial_eye =      { 
        x: initial_eye_vec3[0] + earth_x_pos,
        y: initial_eye_vec3[1] + 0,
        z: initial_eye_vec3[2] + 0
    };
};

update_initial_eye();

SceneJS.createNode({
    
    type: "scene",
    id: "theScene",
    canvasId: "theCanvas",
    loggingElementId: "theLoggingDiv",
    
    nodes: [

        {
            type: "lookAt", 
            id: "lookAt",
            eye : { x: earth_x_pos, y: 0, z: earth_radius_km * -3 },
            look : { x : earth_x_pos, y : 0.0, z : 0.0 },
            up : { x: 0.0, y: 1.0, z: 0.0 },

            nodes: [
            
                {
                    type: "camera",
                    id: "camera",
                    optics: {
                        type: "perspective",
                        fovy : 50.0,
                        aspect : 1.43,
                        near : 0.10,
                        far : milky_way_apparent_radius * 10,
                    },

                    nodes: [
                        
                        // First simulate the milky-way with a stationary background sphere
                        {
                            type: "stationary",    
                            id: "sky-sphere",

                            nodes: [

                                // Size of sky sphere
                                {
                                    type: "scale",
                                    x: milky_way_apparent_radius,
                                    y: milky_way_apparent_radius,
                                    z: milky_way_apparent_radius,
                                    nodes: [

                                        // Starry texture
                                        {
                                            type: "texture",
                                            layers: [
                                                {
                                                    uri: "images/milky_way_panorama_3000x1500.jpg",
                                                    wrapS: "clampToEdge",
                                                    wrapT: "clampToEdge",
                                                    applyTo:"baseColor",
                                                    blendMode:"multiply"
                                                }
                                            ],
                                            nodes: [

                                                // Material for texture to apply to
                                                {
                                                    type: "material",
                                                    baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
                                                    specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                                    specular:       0.0,
                                                    shine:          0.0,
                                                    emit:           1.0,
                                                    nodes: [

                                                        // Tilt the milky way a little bit
                                                        {
                                                            type: "rotate",
                                                            z: 1,
                                                            angle: 45.0,
                                                            nodes: [

                                                                // Sphere geometry
                                                                {
                                                                    type: "sphere"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },

                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: 3.0, g: 3.0, b: 3.0 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 1.0, y: 0.0, z: 0.0 }
                        },
                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: 0.1, g: 0.1, b: 0.1 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 0.0, y: 1.0, z: -1.0 }
                        },
                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: 0.1, g: 0.1, b: 0.1 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: -1.0, y: 0.0, z: -1.0 }
                        },

                        
                        {
                            type: "quaternion",
                            id: "earthRotationalAxisQuaternion",
                            x: 0.0, y: 0.0, z: 0.0, angle: 0.0,

                            rotations: [ { x : 0, y : 0, z : 1, angle : -23.44 } ],

                            nodes: [
                            
                                { 
                                    type: "rotate", id: "rotation", angle: initial_earth_rotation, y: 1.0,

                                    nodes: [

                                        {

                                            type: "selector",
                                            id: "earthTextureSelector",
                                            selection: [1],
                                            nodes: [

                                                {
                                                    id: "earthTemperatureTextureSelector",
                                                    type: "selector",
                                                    selection: [0],
                                                    nodes: [

                                                        // selection [0], March
                                                        {
                                                            type: "texture",
                                                            layers: [
                                                                { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                                { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                                { uri:"images/temperature/grads-temperature-2009-03.png", blendMode: "multiply" }
                                                            ],
                                                            nodes: [
                                                                {
                                                                    type: "material",
                                                                    baseColor:      { r: 0.6, g: 0.6, b: 0.6 },
                                                                    specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                                                    specular:       0.0,
                                                                    shine:          2.0,

                                                                    nodes: [
                                                                        {
                                                                            type: "translate",
                                                                            x: earth_x_pos,
                                                                            y: 0,
                                                                            z: 0,

                                                                            nodes: [

                                                                                {

                                                                                    type: "scale",
                                                                                    x: earth_radius_km,
                                                                                    y: earth_radius_km,
                                                                                    z: earth_radius_km,

                                                                                    nodes: [

                                                                                        {

                                                                                            type: "rotate",
                                                                                            id: 'spin',
                                                                                            angle: 0,
                                                                                            y: 1.0,

                                                                                            nodes: [ { type: "sphere" } ]
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]

                                                        },

                                                        // selection [1], June
                                                        {
                                                            type: "texture",
                                                            layers: [
                                                                { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                                { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                                { uri:"images/temperature/grads-temperature-2009-06.png", blendMode: "multiply" }
                                                            ],
                                                            nodes: [
                                                                {
                                                                    type: "material",
                                                                    baseColor:      { r: 0.6, g: 0.6, b: 0.6 },
                                                                    specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                                                    specular:       0.0,
                                                                    shine:          2.0,

                                                                    nodes: [
                                                                        {
                                                                            type: "translate",
                                                                            x: earth_x_pos,
                                                                            y: 0,
                                                                            z: 0,

                                                                            nodes: [

                                                                                {

                                                                                    type: "scale",
                                                                                    x: earth_radius_km,
                                                                                    y: earth_radius_km,
                                                                                    z: earth_radius_km,

                                                                                    nodes: [

                                                                                        {

                                                                                            type: "rotate",
                                                                                            id: 'spin',
                                                                                            angle: 0,
                                                                                            y: 1.0,

                                                                                            nodes: [ { type: "sphere" } ]
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]

                                                        },

                                                        // selection [2], September
                                                        {
                                                            type: "texture",
                                                            layers: [
                                                                { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                                { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                                { uri:"images/temperature/grads-temperature-2009-09.png", blendMode: "multiply" }
                                                            ],
                                                            nodes: [
                                                                {
                                                                    type: "material",
                                                                    baseColor:      { r: 0.6, g: 0.6, b: 0.6 },
                                                                    specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                                                    specular:       0.0,
                                                                    shine:          2.0,

                                                                    nodes: [
                                                                        {
                                                                            type: "translate",
                                                                            x: earth_x_pos,
                                                                            y: 0,
                                                                            z: 0,

                                                                            nodes: [

                                                                                {

                                                                                    type: "scale",
                                                                                    x: earth_radius_km,
                                                                                    y: earth_radius_km,
                                                                                    z: earth_radius_km,

                                                                                    nodes: [

                                                                                        {

                                                                                            type: "rotate",
                                                                                            id: 'spin',
                                                                                            angle: 0,
                                                                                            y: 1.0,

                                                                                            nodes: [ { type: "sphere" } ]
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]

                                                        },


                                                        // selection [3], December
                                                        {
                                                            type: "texture",
                                                            layers: [
                                                                { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                                { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                                { uri:"images/temperature/grads-temperature-2009-12.png", blendMode: "multiply" }
                                                            ],
                                                            nodes: [
                                                                {
                                                                    type: "material",
                                                                    baseColor:      { r: 0.6, g: 0.6, b: 0.6 },
                                                                    specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                                                    specular:       0.0,
                                                                    shine:          2.0,

                                                                    nodes: [
                                                                        {
                                                                            type: "translate",
                                                                            x: earth_x_pos,
                                                                            y: 0,
                                                                            z: 0,

                                                                            nodes: [

                                                                                {

                                                                                    type: "scale",
                                                                                    x: earth_radius_km,
                                                                                    y: earth_radius_km,
                                                                                    z: earth_radius_km,

                                                                                    nodes: [

                                                                                        {

                                                                                            type: "rotate",
                                                                                            id: 'spin',
                                                                                            angle: 0,
                                                                                            y: 1.0,

                                                                                            nodes: [ { type: "sphere" } ]
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }                                
                                                    ]
                                                },

                                                {

                                                    id: "earth-terrain-texture",
                                                    type: "texture",
                                                    layers: [

                                                        { 
                                                           uri:"images/lat-long-grid-invert-units-1440x720-15.png",
                                                           blendMode: "add",

                                                        },
                                                        { 
                                                            uri:"images/earth3.jpg",

                                                            minFilter: "linear",
                                                            magFilter: "linear",
                                                            wrapS: "repeat",
                                                            wrapT: "repeat",
                                                            isDepth: false,
                                                            depthMode:"luminance",
                                                            depthCompareMode: "compareRToTexture",
                                                            depthCompareFunc: "lequal",
                                                            flipY: false,
                                                            width: 1,
                                                            height: 1,
                                                            internalFormat:"lequal",
                                                            sourceFormat:"alpha",
                                                            sourceType: "unsignedByte",
                                                            applyTo:"baseColor",
                                                            blendMode: "multiply",

                                                            /* Texture rotation angle in degrees
                                                             */
                                                            rotate: 180.0,

                                                            /* Texture translation offset
                                                             */
                                                            translate : {
                                                                x: 0,
                                                                y: 0
                                                            },

                                                            /* Texture scale factors
                                                             */
                                                            scale : {
                                                                x: -1.0,
                                                                y: 1.0
                                                            }
                                                        }
                                                    ],
                                                    
                                                    nodes: [
                                                    
                                                        {
                                                            id: "earth-sphere",
                                                            type: "material",
                                                            baseColor:      { r: 0.6, g: 0.6, b: 0.6 },
                                                            specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                                            specular:       0.0,
                                                            shine:          2.0,
                                                    
                                                            nodes: [
                                                                {
                                                                    type: "translate",
                                                                    x: earth_x_pos,
                                                                    y: 0,
                                                                    z: 0,
                                                    
                                                                    nodes: [
                                                    
                                                                        {
                                                    
                                                                            type: "scale",
                                                                            x: earth_radius_km,
                                                                            y: earth_radius_km,
                                                                            z: earth_radius_km,
                                                    
                                                                            nodes: [
                                                    
                                                                                {
                                                    
                                                                                    type: "rotate",
                                                                                    id: 'spin',
                                                                                    angle: 0,
                                                                                    y: 1.0,
                                                    
                                                                                    nodes: [ { type: "sphere" } ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});

SceneJS.setDebugConfigs({
    compilation : {
        enabled : true
    }
});

/*----------------------------------------------------------------------
 * Scene rendering loop and mouse handler stuff follows
 *---------------------------------------------------------------------*/
var yaw = 0;
var pitch = 0;
var max_pitch = 85;
var earth_rotation = initial_earth_rotation;

var lookat_yaw = 0;

var lastX;
var lastY;
var dragging = false;

var activeView = 0;

var canvas = document.getElementById("theCanvas");
var earth_surface = document.getElementById("earth_surface");
var earth_rotation_checkbox = document.getElementById("earth-rotation");

var scene = SceneJS.withNode("theScene")
var angle = SceneJS.withNode("rotation")

var look_at = SceneJS.withNode("lookAt");
var camera = SceneJS.withNode("camera");


// Time of year changes inclination of Earths orbit with respect to the orbital plane

var time_of_year = document.getElementById("time_of_year");
var color_map = document.getElementById("temperature-color-map");
color_map.style.display='none';

var seasonal_rotations = {};
seasonal_rotations.jun = { x :  0,  y : 0,  z : -1,  angle : 23.44 };
seasonal_rotations.sep = { x :  1,  y : 0,  z :  0,  angle : 23.44 };
seasonal_rotations.dec = { x :  0,  y : 0,  z :  1,  angle : 23.44 };
seasonal_rotations.mar = { x : -1,  y : 0,  z :  0,  angle : 23.44 };

function setTemperatureTexture(month) {
    switch (month) {
        case 'mar' : SceneJS.withNode("earthTemperatureTextureSelector").set("selection", [0]); break;
        case 'jun' : SceneJS.withNode("earthTemperatureTextureSelector").set("selection", [1]); break;
        case 'sep' : SceneJS.withNode("earthTemperatureTextureSelector").set("selection", [2]); break;
        case 'dec' : SceneJS.withNode("earthTemperatureTextureSelector").set("selection", [3]); break;
    };    
}

function timeOfYearChange() {
  var month = this.value;
  SceneJS.Message.sendMessage({ 
    command: "update", 
    target: "earthRotationalAxisQuaternion", 
    set: { rotation: seasonal_rotations[month] }
  });
  setTemperatureTexture(month);
  if (earth_surface.value === 'terrain') {
      SceneJS.withNode("earthTextureSelector").set("selection", [1]);
  } else {
      SceneJS.withNode("earthTextureSelector").set("selection", [0]);
  }
}

time_of_year.onchange = timeOfYearChange;
time_of_year.onchange();

// Texture mapping onto the Earth's surface

function earthSurfaceChange() {
  var new_surface = this.value;
  if (new_surface === 'terrain') {
      SceneJS.withNode("earthTextureSelector").set("selection", [1]);
      color_map.style.display='none';
  } else {
      SceneJS.withNode("earthTextureSelector").set("selection", [0]);
      setTemperatureTexture(time_of_year.value);
      color_map.style.display='inline';  
  }
}

earth_surface.onchange = earthSurfaceChange;
earth_surface.onchange();


function updateLookAt() {
    // first handle yaw and pitch for our lookAt-arcball navigation around Earth
    // background: http://rainwarrior.thenoos.net/dragon/arcball.html
    var yaw_quat =  quat4.axisAngleDegreesCreate(0, 1, 0, yaw);
    var yaw_mat4 = quat4.toMat4(yaw_quat);

    if (pitch > max_pitch)  pitch =  max_pitch;
    if (pitch < -max_pitch) pitch = -max_pitch;

    var pitch_quat =  quat4.axisAngleDegreesCreate(yaw_mat4[0], yaw_mat4[1], yaw_mat4[2], pitch);
    var result_quat = quat4.create();
    quat4.multiply(pitch_quat, yaw_quat, result_quat);

    var neweye = vec3.create();
    quat4.multiplyVec3(result_quat, initial_eye_vec3, neweye);
    look_at.set("eye", { 
        x: neweye[0] + earth_x_pos, 
        y: neweye[1] + 0, 
        z: neweye[2] + 0 
    });
    
    // next handle a possible yaw rotation to look left or right of Earth in the ecliptic plane
    var rot_quat = quat4.axisAngleDegreesCreate(0, 1, 0, lookat_yaw); 

    var new_look = vec3.create();
    quat4.multiplyVec3(rot_quat, neweye, new_look);

    // mat4.multiplyVec3(rot_mat4, neweye, new_look);

    new_look[0] = (neweye[0] - new_look[0]) + earth.pos.x;
    new_look[1] = (neweye[1] - new_look[1]) + earth.pos.y;
    new_look[2] = (neweye[2] - new_look[2]) + earth.pos.z;
    look_at.set("look", { x: new_look[0], y: new_look[1], z: new_look[2] });
};



function mouseDown(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    dragging = true;
}

function mouseUp() {
    dragging = false;
}

function mouseMove(event) {
    if (dragging) {
        
        yaw   += (event.clientX - lastX) * -0.2;
        pitch += (event.clientY - lastY) *  0.2;

        lastX = event.clientX;
        lastY = event.clientY;

        updateLookAt();

        if (!keepAnimating) requestAnimFrame(sampleAnimate);
    }
};

canvas.addEventListener('mousedown', mouseDown, true);
canvas.addEventListener('mousemove', mouseMove, true);
canvas.addEventListener('mouseup', mouseUp, true);


//
// Animation
//

var scene = SceneJS.withNode("theScene");

var updateRate        = 30;
var updateInterval    = 1000/updateRate;
var nextAnimationTime = new Date().getTime(); + updateInterval;
var keepAnimating     = true;

function sampleAnimate(t) {
    sampleTime = new Date().getTime();
    if (sampleTime > nextAnimationTime) {
        nextAnimationTime = nextAnimationTime + updateInterval;
        if (sampleTime > nextAnimationTime) nextAnimationTime = sampleTime + updateInterval;
        if (earth_rotation_checkbox.checked) {
            angle.set("angle", earth_rotation += 0.25);
        };
    }
};

SceneJS.bind("error", function() {
    keepAnimating = false;
});

SceneJS.bind("reset", function() {
    keepAnimating = false;
});

var displayed = false;

SceneJS.bind("canvas-activated", function() {
    if (!displayed) {
        displayed = true;
    }
});

scene.start({
    idleFunc: function() {
        sampleAnimate();
    }
});
