var deg2rad = Math.PI/180;

var scale_factor = 1000;

var sun_diameter = 1392000.0 / scale_factor;
var earth_diameter = 12742.0 / scale_factor;
var earth_orbital_radius = 150000000.0 / scale_factor;

var milky_way_apparent_radius = earth_orbital_radius * 10;


var sun = {
    pos: { x: 0, y: 0, z: 0 },
    radius: sun_diameter / 2
};

var earth = {
    pos: { x: earth_orbital_radius, y: 0, z: 0 },
    radius: earth_diameter / 2,
    tilt: 23.5
};

var dark_side_light = 0.25;

var distance = earth.radius * 3;

var latitude  = 52;
var longitude = 0;

var yaw      = -20;
var pitch    = -10;
var rotation = 0;

//
// Square Grid
//

var square_grid = function(scale, segments) {
    var points = [];
    var p;
    var grid_increment = scale * 2 / segments;
    for (var i = 0; i <= segments; i++) {
        p = i * grid_increment - scale;
        points.push(p, 0, -scale);
        points.push(p, 0, +scale);
        points.push(-scale, 0, p);
        points.push(+scale, 0, p);
    }
    return points;
}


var earth_grid_positions = square_grid(earth.radius * 3, 30);
var earth_grid_indices = [];
var earth_grid_points = earth_grid_positions.length / 3;
for (var i = 0; i < earth_grid_points; i++) { earth_grid_indices.push(i) };

//
// Rose Grid
//

var rose_grid = function(scale, segments) {
    var points = [];
    var x, z, rangle;
    var angle_increment = 360 / segments;
    for (var angle = 0; angle <= 180; angle += angle_increment) {
        rangle = angle * deg2rad;
        x = Math.sin(rangle) * scale;
        z = Math.cos(rangle) * scale;
        points.push(x, 0, z);
        points.push(-x, 0, -z);
    }
    return points;
}

var earth_rose_scale = earth.radius * 1.5;
var earth_rose_grid_positions = rose_grid(earth_rose_scale, 24);
var earth_rose_grid_indices = [];
var earth_rose_grid_points = earth_rose_grid_positions.length / 3;
for (var i = 0; i < earth_rose_grid_points; i += 2) { 
    earth_rose_grid_indices.push(i, i+1);
};

//
// Sun Rays
//

var sun_rays = function() {
    var points = [];
    var x, y, z, rangle;
    var density = 12;
    var angle_distance = Math.PI * earth.radius / density;
    var angle_increment;
    points.push(sun.pos.x, sun.pos.y, sun.pos.z);
    for (var radius = earth.radius; radius > 0; radius -= angle_distance) {
        angle_increment = 360 / (Math.PI * radius) / angle_distance
        for (var angle = 0; angle <= 180; angle += angle_increment) {
            rangle = angle * deg2rad;
            y = Math.sin(rangle) * radius;
            z = Math.cos(rangle) * radius;
            points.push(earth.pos.x,  y,  z);
            points.push(earth.pos.x, -y, -z);
        }
    }
    return points;
}


var sun_ray_positions = sun_rays();
var sun_ray_indices = [];
var sun_ray_points = sun_ray_positions.length / 3 - 1;
for (var i = 0; i < sun_ray_points; i++) { 
    sun_ray_indices.push(0, i);
};


//
// Initial lookAt: eye
//

var initial_eye_quat;
var initial_eye_mat4;
var initial_eye_vec4;
var initial_eye;

function update_initial_eye(d) {
    if (d < (earth.radius * 1.5)) d = earth.radius * 1.5;
    distance = d;
    initial_eye_quat = SceneJS._math_angleAxisQuaternion(1, 0, 0, 0);
    initial_eye_mat4 = SceneJS._math_newMat4FromQuaternion(initial_eye_quat);
    initial_eye_vec4 = SceneJS._math_mulMat4v4(initial_eye_mat4, [0, 0,  distance, 1]);
    initial_eye =      { 
        x: initial_eye_vec4[0] + earth.pos.x,
        y: initial_eye_vec4[1] + earth.pos.y,
        z: initial_eye_vec4[2] + earth.pos.z
    };
}

update_initial_eye(distance);

SceneJS.createNode({
    type: "scene",
    id: "theScene",
    canvasId: "theCanvas",
    loggingElementId: "theLoggingDiv",

    nodes: [
    
        {
            type: "lookAt",
            id: "lookAt",
            eye:  initial_eye,
            look: earth.pos,
            up:   { x: 0.0, y: 1.0, z: 0.0 },

            nodes: [

                {
                    type: "camera",
                    id: "camera",
                    optics: {
                        type: "perspective",
                        fovy: 50.0,
                        aspect: 1.43,
                        near: 0.10,
                        far: milky_way_apparent_radius * 10,
                    },

                    nodes: [

                        // Simulate the milky-way with a stationary background sphere
                        {
                            type: "stationary",    
    
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
                            mode:                   "point",
                            pos:                    sun.pos,
                            color:                  { r: 3.0, g: 3.0, b: 3.0 },
                            diffuse:                true,
                            specular:               true,
                            constantAttenuation: 1.0,
                            quadraticAttenuation: 0.0,
                            linearAttenuation: 0.0
                        },

                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: dark_side_light, g: dark_side_light, b: dark_side_light },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 1.0, y: 0.0, z: -0.75 }
                        },
        
                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: dark_side_light, g: dark_side_light, b: dark_side_light },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 1.0, y: 0.0, z: 0.75 }
                        },

                        // Sun and related objects
                        {

                            id: "sun",
                            type: "material",
                            baseColor:      { r: 1.0, g: 0.95, b: 0.8 },
                            specularColor:  { r: 1.0, g: 0.95, b: 0.8 },
                            specular:       2.0,
                            shine:          2.0,
                            emit:           1.0,

                            nodes: [

                                // Sun
                                {
                                    type: "translate",
                                    x: sun.pos.x,
                                    y: sun.pos.y,
                                    z: sun.pos.z,

                                    nodes: [
                                        {
                                            type: "scale",
                                            x: sun_diameter,
                                            y: sun_diameter,
                                            z: sun_diameter,

                                            nodes: [  { type: "sphere", slices: 60, rings: 60 } ]
                                        }
                                    ]
                                },
                                
                                // Sun-Earth line
                                {

                                    type: "selector",
                                    id: "sun-earth-line-selector",
                                    selection: [0],
                                    nodes: [ 

                                        // 0: off
                                        {  },

                                        // 1: on
                                        {
                                            type: "geometry",
                                            primitive: "lines",

                                            positions: [
                                                sun.pos.x, sun.pos.y, sun.pos.z,
                                                earth.pos.x, earth.pos.y, earth.pos.z 
                                            ],

                                            indices : [ 0, 1 ]

                                        }
                                    ]
                                },
                                
                                // Sun Rays
                                {
                                    type: "selector",
                                    id: "sun-rays-selector",
                                    selection: [0],
                                    nodes: [ 

                                        // 0: off
                                        {  },

                                        // 1: on
                                        {
                                            type: "geometry",
                                            primitive: "lines",

                                            positions: sun_ray_positions,
                                            indices :  sun_ray_indices
                                        }
                                    ]
                                },
                                
                                // Sun-Earth Surface Line
                                {
                                    type: "selector",
                                    id: "sun-surface-line-selector",
                                    selection: [0],
                                    nodes: [ 

                                        // 0: off
                                        {  },

                                        // 1: on
                                        {
                                            type: "geometry",
                                            primitive: "lines",

                                            positions: [
                                                sun.pos.x, sun.pos.y, sun.pos.z,

                                                earth.pos.x, 
                                                earth.pos.y + Math.sin((latitude - earth.tilt)  * deg2rad) * earth.radius, 
                                                earth.pos.z + Math.sin(-longitude * deg2rad) * earth.radius 
                                            ],

                                            indices : [ 0, 1 ]
                                        }
                                    ]
                                }
                            ]
                        },

                        // Earth and other objects that are referenced from Earth's location.
                        {
                            type: "translate",
                            x: earth.pos.x,
                            y: earth.pos.y,
                            z: earth.pos.z,

                            nodes: [
                            
                                // Square Grid
                                {
                                    type: "material",
                                    baseColor:      { r: 0.3, g: 0.7, b: 0.3 },
                                    specularColor:  { r: 0.3, g: 0.7, b: 0.3 },
                                    specular:       1.0,
                                    shine:          2.0,
                                    emit:           1.0,

                                    nodes: [

                                        {
                                            type: "scale",
                                            x: 1,
                                            y: 1,
                                            z: 1,

                                            nodes: [

                                                {

                                                    type: "selector",
                                                    id: "earth-grid-selector",
                                                    selection: [1],
                                                    nodes: [ 

                                                        // 0: off

                                                        {  },

                                                        // 1: on: quare grid for Earth view

                                                        {
                                                            nodes: [

                                                                {
                                                                    type: "geometry",
                                                                    primitive: "lines",

                                                                    positions: earth_grid_positions,
                                                                    indices : earth_grid_indices
                                                                },

                                                                // Latitude-like line in the ecliptic plane
                                                                {
                                                                    type: "disk",
                                                                    radius: earth.radius * 1.002,
                                                                    innerRadius: earth.radius * 1.001,
                                                                    height: earth.radius / 300,
                                                                    rings: 128
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },

                                // Rose Grid
                                {
                                    type: "material",
                                    baseColor:      { r: 0.9, g: 0.8, b: 0.1 },
                                    specularColor:  { r: 0.9, g: 0.8, b: 0.1 },
                                    specular:       1.0,
                                    shine:          2.0,
                                    emit:           1.0,

                                    nodes: [

                                        {
                                            type: "scale",
                                            x: 1,
                                            y: 1,
                                            z: 1,

                                            nodes: [

                                                {

                                                    type: "selector",
                                                    id: "earth-rose-grid-selector",
                                                    selection: [0],
                                                    nodes: [ 

                                                        // 0: off

                                                        {  },

                                                        // 1: on: rose grid for Earth view

                                                        {
                                                            nodes: [

                                                                {
                                                                    type: "geometry",
                                                                    primitive: "lines",

                                                                    positions: earth_rose_grid_positions,
                                                                    indices : earth_rose_grid_indices
                                                                },

                                                                // Latitude-like line in the ecliptic plane
                                                                {
                                                                    type: "disk",
                                                                    radius: earth.radius * 1.002,
                                                                    innerRadius: earth.radius * 1.001,
                                                                    height: earth.radius / 300,
                                                                    rings: 128
                                                                },

                                                                {
                                                                    type: "disk",
                                                                    radius: earth_rose_scale,
                                                                    innerRadius: earth_rose_scale - 0.001,
                                                                    height: earth.radius / 300,
                                                                    rings: 128
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
                                    type: "quaternion",
                                    x: 0.0, y: 0.0, z: 1.0, angle: earth.tilt, 
        
                                    nodes: [
                            
                                        { 
                                            type: "rotate", id: "rotation", angle: 0, y: 1.0,
                                    
                                            nodes: [
                                
                                                // Latitude and Longitude Lines
                                                { 
                                                    type: "material",
                                                    baseColor:      { r: 1.0, g: 0.02, b: 0.02 },
                                                    specularColor:  { r: 1.0, g: 0.02, b: 0.02 },
                                                    specular:       1.0,
                                                    shine:          1.0,
                                                    emit:           1.0,

                                                    nodes: [

                                                        // Latitude Line
                                                        {
                                                            type: "translate",
                                                            id: "latitude-translate",
                                                            x: 0,
                                                            y: earth.radius * Math.sin(latitude * deg2rad),
                                                            z: 0,

                                                            nodes: [

                                                                {
                                                                    type: "scale", 
                                                                    id: "latitude-scale",
                                                                    x: Math.cos(latitude * deg2rad),
                                                                    z: Math.cos(latitude * deg2rad),
                                                                    y: 1.0,

                                                                    nodes: [

                                                                        {
                                                                            type: "disk",
                                                                            radius: earth.radius * 1.005,
                                                                            innerRadius: earth.radius * 1.004,
                                                                            height: earth.radius / 200,
                                                                            rings: 128
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        },
                                                
                                                        // Longitude Line
                                                        {
                                                            type: "rotate", 
                                                            x: 0.0,
                                                            z: 1.0,
                                                            y: 0.0,
                                                            angle: -90,

                                                            nodes: [

                                                                {
                                                                    type: "rotate", 
                                                                    id: "longitude-rotation",
                                                                    x: 1.0,
                                                                    z: 0.0,
                                                                    y: 0.0,
                                                                    angle: longitude + 90,

                                                                    nodes: [

                                                                        {
                                                                            type: "disk",
                                                                            radius: earth.radius * 1.005,
                                                                            innerRadius: earth.radius * 1.004,
                                                                            height: earth.radius / 200,
                                                                            rings: 128,
                                                                            sweep: 0.5,
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                        
                                                // Earth
                                                {
                                                    type: "material",
                                                    baseColor:      { r: 0.50, g: 0.50, b: 0.50 },
                                                    specularColor:  { r: 0.15, g: 0.15, b: 0.15 },
                                                    specular:       0.00,
                                                    shine:          0.5,

                                                    nodes: [

                                                        {
                                                            type: "scale", x: earth.radius, y: earth.radius, z: earth.radius,

                                                            nodes: [
                                            
                                                                {

                                                                    id: "earth-terrain-texture3",
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
                                                                        { type: "sphere" }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
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
        enabled : false
    }
});

var angle = SceneJS.withNode("rotation")
var scene = SceneJS.withNode("theScene")

function sampleRender() {
    scene.render();
};

var updateRate = 30;
var updateInterval = 1000/updateRate;
var nextAnimationTime = new Date().getTime(); + updateInterval;
var keepAnimating = true;

var earth_rotation = document.getElementById("earth-rotation");

//
// Earth Square Grid Handler
//
var earth_grid = document.getElementById("earth-grid");
var earth_grid_selector =  SceneJS.withNode("earth-grid-selector");

function earthGridHandler() {
    if (earth_grid.checked) {
        earth_grid_selector.set("selection", [1]);
    } else {
        earth_grid_selector.set("selection", [0]);
    };
};

earth_grid.onchange = earthGridHandler;
earthGridHandler();

//
// Earth Rose Grid Handler
//
var earth_rose_grid = document.getElementById("earth-rose-grid");
var earth_rose_grid_selector =  SceneJS.withNode("earth-rose-grid-selector");

function earthRoseGridHandler() {
    if (earth_rose_grid.checked) {
        earth_rose_grid_selector.set("selection", [1]);
    } else {
        earth_rose_grid_selector.set("selection", [0]);
    };
};

earth_rose_grid.onchange = earthRoseGridHandler;
earthRoseGridHandler();

//
// Sun-Earth Line Handler
//
var sun_earth_line = document.getElementById("sun-earth-line");
var sun_earth_line_selector =  SceneJS.withNode("sun-earth-line-selector");

function sunEarthLineHandler() {
    if (sun_earth_line.checked) {
        sun_earth_line_selector.set("selection", [1]);
    } else {
        sun_earth_line_selector.set("selection", [0]);
    };
};

sun_earth_line.onchange = sunEarthLineHandler;
sunEarthLineHandler();

//
// Sun-Earth Surface Line Handler
//
var sun_surface_line = document.getElementById("sun-surface-line");
var sun_surface_line_selector =  SceneJS.withNode("sun-surface-line-selector");

function sunSurfaceLineHandler() {
    if (sun_surface_line.checked) {
        sun_surface_line_selector.set("selection", [1]);
    } else {
        sun_surface_line_selector.set("selection", [0]);
    };
};

sun_surface_line.onchange = sunSurfaceLineHandler;
sunSurfaceLineHandler();

//
// Sun Rays Line Handler
//
var sun_rays = document.getElementById("sun-rays");
var sun_rays_selector =  SceneJS.withNode("sun-rays-selector");

function sunRaysHandler() {
    if (sun_rays.checked) {
        sun_rays_selector.set("selection", [1]);
    } else {
        sun_rays_selector.set("selection", [0]);
    };
};

sun_rays.onchange = sunRaysHandler;
sunRaysHandler();

//
// Animation
//

function sampleAnimate(t) {
    sampleTime = new Date().getTime();
    if (keepAnimating) requestAnimFrame(sampleAnimate);
    if (sampleTime > nextAnimationTime) {
        nextAnimationTime = nextAnimationTime + updateInterval;
        if (sampleTime > nextAnimationTime) nextAnimationTime = sampleTime + updateInterval;
        if (earth_rotation.checked) {
            angle.set("angle", angle.get("angle") + 0.25);
        }
        sampleRender();
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
        setLongitude(longitude);
        debugLabel();
        controlsLabel();
        infoLabel();
        updateLookAt();
    }
});

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();

requestAnimFrame(sampleAnimate);

//
// Mouse handling
//

var lastX;
var lastY;
var dragging = false;

var look_at = SceneJS.withNode("lookAt");
var camera = SceneJS.withNode("camera");

var latitude_translate = SceneJS.withNode("latitude-translate");
var latitude_scale     = SceneJS.withNode("latitude-scale");

var longitude_rotation = SceneJS.withNode("longitude-rotation");

var the_canvas = document.getElementById("theCanvas");

function mouseDown(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    dragging = true;
}

function mouseUp() {
    dragging = false;
}

function updateLookAt() {
    var yaw_quat =  SceneJS._math_angleAxisQuaternion(0, 1, 0, yaw);
    var yaw_mat4 = SceneJS._math_newMat4FromQuaternion(yaw_quat);
    if (pitch > 80)  pitch =  80;
    if (pitch < -80) pitch = -80;
    var pitch_quat =  SceneJS._math_angleAxisQuaternion(yaw_mat4[0], yaw_mat4[1], yaw_mat4[2], pitch);
    var result_quat = SceneJS._math_mulQuaternions(pitch_quat, yaw_quat)
    var result_mat4 = SceneJS._math_newMat4FromQuaternion(result_quat);
    var neweye = SceneJS._math_mulMat4v4(result_mat4, initial_eye_vec4);
    look_at.set("eye", { 
        x: neweye[0] + earth.pos.x, 
        y: neweye[1] + earth.pos.y, 
        z: neweye[2] + earth.pos.z 
    });
    var rot_quat = SceneJS._math_angleAxisQuaternion(0, 1, 0, rotation); 
    var rot_mat4 = SceneJS._math_newMat4FromQuaternion(rot_quat);
    var new_look = SceneJS._math_mulMat4v4(rot_mat4, neweye);
    new_look[0] = (neweye[0] - new_look[0]) + earth.pos.x;
    new_look[1] = (neweye[1] - new_look[1]) + earth.pos.y;
    new_look[2] = (neweye[2] - new_look[2]) + earth.pos.z;
    look_at.set("look", { x: new_look[0], y: new_look[1], z: new_look[2] });
    debugLabel();
};

function setLatitude(lat) {
    latitude = lat;
    latitude_translate.set({ x: 0, y: earth.radius * Math.sin(latitude * deg2rad), z: 0 });
    var scale = Math.cos(latitude * deg2rad);
    latitude_scale.set({ x: scale, y: 1.0, z: scale });
    infoLabel();
};

function incrementLatitude() {
    latitude += 1;
    if (latitude > 90) latitude = 90;
    setLatitude(latitude);
};

function decrementLatitude() {
    latitude -= 1;
    if (latitude < -90) latitude = -90;
    setLatitude(latitude);
};

function setLongitude(lon) {
    longitude = lon;
    longitude_rotation.set({ angle: longitude + 90 });
    infoLabel();
};

function incrementLongitude() {
    longitude += 1;
    if (longitude > 180) longitude -= 360;
    setLongitude(longitude);
};

function decrementLongitude() {
    longitude -= 1;
    if (longitude < -179) longitude += 360;
    setLongitude(longitude);
};

function mouseMove(event) {
    if (dragging) {
        
        yaw   += (event.clientX - lastX) * -0.2;
        pitch += (event.clientY - lastY) * -0.2;
        lastX = event.clientX;
        lastY = event.clientY;

        updateLookAt();

        if (!keepAnimating) requestAnimFrame(sampleAnimate);
    }
}

the_canvas.addEventListener('mousedown', mouseDown, true);
the_canvas.addEventListener('mousemove', mouseMove, true);
the_canvas.addEventListener('mouseup', mouseUp, true);

function handleArrowKeys(evt) {
    var distanceIncrementFactor = 40;
    evt = (evt) ? evt : ((window.event) ? event : null); 
    if (evt) {
        switch (evt.keyCode) {
            case 37:                                    // left arrow
                if (evt.ctrlKey) {
                    // evt.preventDefault();
                } else if (evt.metaKey) {
                    evt.preventDefault();
                } else if (evt.altKey) {
                    incrementLongitude(); 
                    evt.preventDefault();
                } else if (evt.shiftKey) {
                    rotation += 2; 
                    updateLookAt();
                    evt.preventDefault();
                } else {
                    yaw -= 2; 
                    updateLookAt();
                    evt.preventDefault();
                }
                break;

            case 38:                                    // up arrow
                if (evt.ctrlKey) {
                    var increment = distance / distanceIncrementFactor;
                    update_initial_eye(distance - increment);
                    updateLookAt();
                    evt.preventDefault();
                } else if (evt.altKey) {
                    incrementLatitude(); 
                    evt.preventDefault();
                } else if (evt.metaKey) {
                    evt.preventDefault();
                } else if (evt.shiftKey) {
                    evt.preventDefault();
                } else {
                    pitch -= 2; 
                    updateLookAt();
                    evt.preventDefault();
                }
                break;

            case 39:                                    // right arrow
                if (evt.ctrlKey) {
                    // evt.preventDefault();
                } else if (evt.metaKey) {
                    evt.preventDefault();
                } else if (evt.altKey) {
                    decrementLongitude(); 
                    evt.preventDefault();
                } else if (evt.shiftKey) {
                    rotation -= 2; 
                    updateLookAt();
                    evt.preventDefault();
                } else {
                    yaw += 2; 
                    updateLookAt();
                    evt.preventDefault();
                }
                break;

            case 40:                                    // down arrow
                if (evt.ctrlKey) {
                    var increment = distance / distanceIncrementFactor;
                    update_initial_eye(distance + increment);
                    updateLookAt();
                    evt.preventDefault();
                } else if (evt.altKey) {
                    decrementLatitude(); 
                    evt.preventDefault();
                } else if (evt.metaKey) {
                    evt.preventDefault();
                } else if (evt.shiftKey) {
                    evt.preventDefault();
                } else {
                    pitch += 2; 
                    updateLookAt();
                    evt.preventDefault();
                }
                break;
        };
    };
};

document.onkeydown = handleArrowKeys;

//
// UI Overlaying WebGL canvas
//

function elementGetX(el) {
    var xpos = 0;
    while( el != null ) {
        xpos += el.offsetLeft;
        el = el.offsetParent;
    }
    return xpos;
};

function elementGetY(el) {
    var ypos = 0;
    while( el != null ) {
        ypos += el.offsetTop;
        el = el.offsetParent;
    }
    return ypos;
};

var container = document.getElementById("container");

//
// DebugLabel
//

var debug_label   = document.getElementById("debug-label");
var debug_view   = document.getElementById("debug-view");
var debug_content = document.getElementById("debug-content");

function debugLabel() {
    if (debug_label) {
        if (debug_view.checked) {
            debug_label.style.opacity = 0.8;
            debug_content.style.display = null;
        } else {
            debug_content.style.display = "none";
            debug_label.style.opacity = null;
        };

        var labelStr = "";
        labelStr += sprintf("Pitch: %4.1f, Yaw:  %4.1f<br>", pitch, yaw);
        labelStr += sprintf("Rot:  %4.1f, Distance: %4.1f<br>", rotation, distance);
        var eye = look_at.get("eye");
        labelStr += sprintf("Eye:  x: %4.1f y: %4.1f z: %4.1f<br>", eye.x, eye.y, eye.z);
        var look = look_at.get("look");
        labelStr += sprintf("Look:  x: %4.1f y: %4.1f z: %4.1f<br>", look.x, look.y, look.z);
        var up = look_at.get("up");
        labelStr += sprintf("Up  x: %4.1f y: %4.1f z: %4.1f<br>", up.x, up.y, up.z);

        labelStr += sprintf("Radius: %4.1f<br>", earth.radius);
        
        debug_content.innerHTML = labelStr;

        var canvas_properties = the_canvas.getBoundingClientRect();
        var container_properties = container.getBoundingClientRect();
        debug_label.style.top = canvas_properties.top + window.pageYOffset + canvas_properties.height - debug_label.offsetHeight - 24 + "px"
        debug_label.style.left = canvas_properties.right - elementGetX(document.getElementById("content")) - debug_label.offsetWidth + "px";
    };
};

debug_view.onchange = debugLabel;

//
// InfoLabel
//

var info_label   = document.getElementById("info-label");
var info_view   = document.getElementById("info-view");
var info_content = document.getElementById("info-content");

function infoLabel() {
    if (info_label) {
        if (info_view.checked) {
            info_label.style.opacity = 0.8;
            info_content.style.display = null;
        } else {
            info_content.style.display = "none";
            info_label.style.opacity = null;
        };

        var labelStr = "";
        labelStr += sprintf("Latitude: %4.1f, Longitude:  %4.1f<br>", latitude, longitude);
        info_content.innerHTML = labelStr;

        var canvas_properties = the_canvas.getBoundingClientRect();
        var container_properties = container.getBoundingClientRect();
        info_label.style.top = canvas_properties.top + window.pageYOffset + 5 + "px";
        info_label.style.left = elementGetX(the_canvas) - elementGetX(document.getElementById("content")) + 15 + "px";
    };
};

info_view.onchange = infoLabel;

//
// ControlsLabel
//

var controls_label = document.getElementById("controls-label");

function controlsLabel() {
    if (controls_label) {
        var canvas_properties = the_canvas.getBoundingClientRect();
        var container_properties = container.getBoundingClientRect();
        controls_label.style.top = canvas_properties.top + window.pageYOffset + 5 + "px";
        controls_label.style.left = canvas_properties.right - elementGetX(document.getElementById("content")) - controls_label.offsetWidth + "px";
        // var labelStr = "controls";
        // controls_label.innerHTML = labelStr;
    };
};

