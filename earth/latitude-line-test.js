var deg2rad = Math.PI/180;

var radius = 6;
var dark_side = 0.3;
var latitude = 42;
var distance = 15;

var milky_way_apparent_radius = 1000;

var initial_eye_quat = SceneJS._math_angleAxisQuaternion(1, 0, 0, 0);
var initial_eye_mat4 = SceneJS._math_newMat4FromQuaternion(initial_eye_quat);
var initial_eye_vec4 = SceneJS._math_mulMat4v4(initial_eye_mat4, [0, 0, distance, 1]);
var initial_eye =      { x: initial_eye_vec4[0], y: initial_eye_vec4[1], z: initial_eye_vec4[2] };

function update_initial_eye(d) {
    if (d < (radius + 2)) d = radius + 1;
    distance = d;
    initial_eye_quat = SceneJS._math_angleAxisQuaternion(1, 0, 0, 0);
    initial_eye_mat4 = SceneJS._math_newMat4FromQuaternion(initial_eye_quat);
    initial_eye_vec4 = SceneJS._math_mulMat4v4(initial_eye_mat4, [0, 0, distance, 1]);
    initial_eye =      { x: initial_eye_vec4[0], y: initial_eye_vec4[1], z: initial_eye_vec4[2] };
}

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
            look: { x: 0.0, y: 0.0, z: 0.0 },
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
                            pos:                    { x: -100, y: 0, z: 0 },
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
                            color:                  { r: dark_side, g: dark_side, b: dark_side },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 1.0, y: 0.0, z: -0.75 }
                        },
        
                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: dark_side, g: dark_side, b: dark_side },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 1.0, y: 0.0, z: 0.75 }
                        },

                        {
                            type: "translate",
                            x: 0,
                            y: 0,
                            z: 0,
                
                            nodes: [
                
                                {
                                    type: "quaternion",
                                    x: 0.0, y: 0.0, z: 1.0, angle: 23.5, 
                
                                    nodes: [
                                    
                                        // Earth
                                        {
                                            type: "material",
                                            baseColor:      { r: 0.45, g: 0.45, b: 0.45 },
                                            specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                            specular:       0.0,
                                            shine:          2.0,

                                            nodes: [

                                                {
                                                    type: "scale", x: radius, y: radius, z: radius,

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
                                                                { 
                                                                    type: "rotate", id: "rotation", angle: 180, y: 1.0,
                                                                    nodes: [  { type: "sphere" } ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },

                                        // Latitude Line
                                        { 
                                            type: "material",
                                            baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
                                            specularColor:  { r: 1.0, g: 1.0, b: 1.0 },
                                            specular:       1.0,
                                            shine:          1.0,
                                            emit: 10.0,

                                            nodes: [
                                            
                                                {
                                                    type: "translate",
                                                    id: "latitude-translate",
                                                    x: 0,
                                                    y: radius * Math.sin(latitude * deg2rad),
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
                                                                    radius: radius * 1.005,
                                                                    innerRadius: radius * 1.004,
                                                                    height: radius/100,
                                                                    rings: 128
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

function sampleAnimate(t) {
    sampleTime = new Date().getTime();
    if (keepAnimating) requestAnimFrame(sampleAnimate);
    if (sampleTime > nextAnimationTime) {
        nextAnimationTime = nextAnimationTime + updateInterval;
        if (sampleTime > nextAnimationTime) nextAnimationTime = sampleTime + updateInterval;
        angle.set("angle", angle.get("angle") + 0.25);
        // yaw = yaw + 0.25;
        // var neweye = newEye2(yaw);
        // look_at.set("eye", { x: neweye[0], y: neweye[1], z: neweye[2] });
        sampleRender();
    }
};

SceneJS.bind("error", function() {
    keepAnimating = false;
});

SceneJS.bind("reset", function() {
    keepAnimating = false;
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

var yaw = 0;
var pitch = 0;
var rotation = 0;

var lastX;
var lastY;
var dragging = false;

var look_at = SceneJS.withNode("lookAt");
var camera = SceneJS.withNode("camera");

var latitude_translate = SceneJS.withNode("latitude-translate");
var latitude_scale     = SceneJS.withNode("latitude-scale");

var the_canvas = document.getElementById("theCanvas");

function mouseDown(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    dragging = true;
}

function mouseUp() {
    dragging = false;
}

// function newEye(yaw, pitch) {
//     var new_eye_quat =  SceneJS._math_angleAxisQuaternion(0, 1, 0, yaw);
//     var new_eye_mat4 = SceneJS._math_newMat4FromQuaternion(new_eye_quat);
//     var neweye = SceneJS._math_mulMat4v4(new_eye_mat4, initial_eye_vec4);
//     if (pitch > 80)  pitch =  80;
//     if (pitch < -80) pitch = -80;
//     var up_down_quat =  SceneJS._math_angleAxisQuaternion(new_eye_mat4[0], 0, new_eye_mat4[2], pitch);
//     var up_down_mat4 = SceneJS._math_newMat4FromQuaternion(up_down_quat);
//     neweye = SceneJS._math_mulMat4v4(up_down_mat4, neweye);
//     return neweye;
// };


// function newEye(yaw, pitch) {
//     var yaw_quat =  SceneJS._math_angleAxisQuaternion(0, 1, 0, yaw);
//     var yaw_mat4 = SceneJS._math_newMat4FromQuaternion(yaw_quat);
//     if (pitch > 80)  pitch =  80;
//     if (pitch < -80) pitch = -80;
//     var pitch_quat =  SceneJS._math_angleAxisQuaternion(yaw_mat4[0], 0, yaw_mat4[2], pitch);
//     var result_quat = SceneJS._math_mulQuaternions(pitch_quat, yaw_quat)
//     var result_mat4 = SceneJS._math_newMat4FromQuaternion(result_quat);
//     var neweye = SceneJS._math_mulMat4v4(result_mat4, initial_eye_vec4);
//     return neweye;
// };
// 

function updateLookAt() {
    var yaw_quat =  SceneJS._math_angleAxisQuaternion(0, 1, 0, yaw);
    var yaw_mat4 = SceneJS._math_newMat4FromQuaternion(yaw_quat);
    if (pitch > 80)  pitch =  80;
    if (pitch < -80) pitch = -80;
    var pitch_quat =  SceneJS._math_angleAxisQuaternion(yaw_mat4[0], 0, yaw_mat4[2], pitch);
    var result_quat = SceneJS._math_mulQuaternions(pitch_quat, yaw_quat)
    var result_mat4 = SceneJS._math_newMat4FromQuaternion(result_quat);
    var neweye = SceneJS._math_mulMat4v4(result_mat4, initial_eye_vec4);
    look_at.set("eye", { x: neweye[0], y: neweye[1], z: neweye[2] });
    var rot_quat = SceneJS._math_angleAxisQuaternion(0, 1, 0, rotation); 
    var rot_mat4 = SceneJS._math_newMat4FromQuaternion(rot_quat);
    var new_look = SceneJS._math_mulMat4v4(rot_mat4, neweye);
    new_look[0] = neweye[0] - new_look[0];
    new_look[1] = neweye[1] - new_look[1];
    new_look[2] = neweye[2] - new_look[2];
    look_at.set("look", { x: new_look[0], y: new_look[1], z: new_look[2] });
    infoLabel();
};

// function update_look_at(neweye) {
//     look_at.set("eye", { x: neweye[0], y: neweye[1], z: neweye[2] });
// };

function setLatitude(latitude) {
    latitude_translate.set({ x: 0, y: radius * Math.sin(latitude * deg2rad), z: 0 });
    var scale = Math.cos(latitude * deg2rad);
    latitude_scale.set({ x: scale, y: 1.0, z: scale });
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
                if (evt.metaKey || evt.ctrlKey) {
                    // evt.preventDefault();
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
                if (evt.metaKey || evt.ctrlKey) {
                    var increment = distance / distanceIncrementFactor;
                    update_initial_eye(distance - increment);
                    updateLookAt();
                    evt.preventDefault();
                } else if (evt.altKey) {
                    incrementLatitude(); 
                    evt.preventDefault();
                } else {
                    pitch -= 1; 
                    updateLookAt();
                    evt.preventDefault();
                }
                break;

            case 39:                                    // right arrow
                if (evt.metaKey || evt.ctrlKey) {
                    // evt.preventDefault();
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
                if (evt.metaKey || evt.ctrlKey) {
                    var increment = distance / distanceIncrementFactor;
                    update_initial_eye(distance + increment);
                    updateLookAt();
                    evt.preventDefault();
                } else if (evt.altKey) {
                    decrementLatitude(); 
                    evt.preventDefault();
                } else {
                    pitch += 1; 
                    updateLookAt();
                    evt.preventDefault();
                }
                break;
        };
    };
};

document.onkeydown = handleArrowKeys;

//
// InfoLabel
//

var info_label = document.getElementById("info-label");
var container = document.getElementById("container");

function infoLabel() {
    var getY = function getY(el) {
        var ypos = 0;
        while( el != null ) {
            ypos += el.offsetTop;
            el = el.offsetParent;
        }
        return ypos;
    };
    var getX = function getX(el) {
        var xpos = 0;
        while( el != null ) {
            xpos += el.offsetLeft;
            el = el.offsetParent;
        }
        return xpos;
    };

    if (info_label) {
        var canvas_properties = the_canvas.getBoundingClientRect();
        var container_properties = container.getBoundingClientRect();
        info_label.style.top = canvas_properties.top + window.pageYOffset + 5 + "px";
        info_label.style.left = canvas_properties.left + getX(the_canvas) + window.pageXOffset + 5 + "px";
        // info_label.style.left = getX(this.canvas) + 5 + "px";
        // info_label.style.left = "5px";
        // info_label.style.top = getY(this.canvas) + 5 + "px";
        info_label.style.left = getX(the_canvas) - getX(document.getElementById("content")) + 15 + "px";
        var labelStr = "";
        labelStr += sprintf("Pitch: %4.1f<br>", pitch);
        labelStr += sprintf("Yaw:  %4.1f<br>", yaw);
        labelStr += sprintf("Rot:  %4.1f<br>", rotation);
        var eye = look_at.get("eye");
        labelStr += sprintf("Eye:  x: %4.1f y: %4.1f z: %4.1f<br>", eye.x, eye.y, eye.z);
        var look = look_at.get("look");
        labelStr += sprintf("Look:  x: %4.1f y: %4.1f z: %4.1f<br>", look.x, look.y, look.z);
        var up = look_at.get("up");
        labelStr += sprintf("Up  x: %4.1f y: %4.1f z: %4.1f<br>", up.x, up.y, up.z);
        info_label.innerHTML = labelStr;
    };
};

infoLabel();
