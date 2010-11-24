/**
 * adapted from SceneJS Examples
 *
 */

SceneJS.createNode({
    
    type: "scene",
    id: "theScene",
    canvasId: "theCanvas",
    loggingElementId: "theLoggingDiv",
    
    nodes: [

        {
            type: "library",
    
            nodes: [
                {
                    type: "camera",
                    id: "theCamera",
                    optics: {
                        type: "perspective",
                        fovy : 70.0,
                        aspect : 1.43,
                        near : 0.10,
                        far : milky_way_apparent_radius * 1.1,
                    },

                    nodes: [

                        // Integrate our sky sphere, which is defined in sky-sphere.js
                        {
                            type : "instance",
                            target :"sky-sphere"
                        },

                        // Integrate our sun, which is defined in sun.js
                        {
                            type : "instance",
                            target :"sun"
                        },


                        // Integrate our earth orbit, which is defined in earth-orbit.js
                        {
                            type : "instance",
                            target :"earthOrbit"
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
                            type: "rotate",
                            id: "pitch",
                            angle: 0.0,
                            x : 1.0,

                            nodes: [

                                {
                                    type: "rotate",
                                    id: "yaw",
                                    angle: 0.0,
                                    y : 1.0,
                            
                                    nodes: [
                                
                                        {
                                            type: "quaternion",
                                            id: "earthRotationalAxisQuaternion",
                                            x: 0.0, y: 0.0, z: 0.0, angle: 0.0,
                                    
                                            rotations: [ { x : 0, y : 0, z : 1, angle : -23.5 } ],

                                            nodes: [

                                                {
                                                    type : "instance",
                                                    target :"earth-axis"
                                                },

                                                {
                                                    type : "instance",
                                                    target :"earth"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },

                        // Interpolates the Earth spin - this node could be anywhere in the scene
                        {
                            type: "interpolator",
                            target: "spin",
                            targetProperty: "angle",
                            // over 1000 seconds rotate 360 degrees 20 times
                            keys: [0.0, 1000],
                            values: [0.0, 360.0*50]
                        }
                    ]
                }
            ]
        },
        
        {
            
            type: "selector",
            id: "mySelector",
            selection: [0],
            nodes: [
                {
                    type: "lookAt",
                    eye : { x: 0,                      y: earth_diameter_km, z: earth_diameter_km * -4.5 },
                    look : { x : 0.0, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },
                    nodes: [ { type: "instance", target: "theCamera" } ]
                },
                {
                    type: "lookAt",
                    eye : { x: earth_diameter_km * -2, y: earth_diameter_km, z: earth_diameter_km * -4 },
                    look : { x : 0.0, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },
                    nodes: [ { type: "instance", target: "theCamera" } ]
                },
                {
                    type: "lookAt",
                    eye : { x: earth_diameter_km * -4, y: earth_diameter_km, z: earth_diameter_km * -2 },
                    look : { x : 0.0, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },
                    nodes: [ { type: "instance", target: "theCamera" } ]
                },
                {
                    type: "lookAt",
                    eye : { x: earth_diameter_km * -5, y: earth_diameter_km, z: earth_diameter_km * 0 },
                    look : { x : 0.0, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },
                    nodes: [ { type: "instance", target: "theCamera" } ]
                },
                {
                    type: "lookAt",
                    eye : { x: earth_diameter_km * -4, y: earth_diameter_km, z: earth_diameter_km * 2 },
                    look : { x : 0.0, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },
                    nodes: [ { type: "instance", target: "theCamera" } ]
                },
                {
                    type: "lookAt",
                    eye : { x: earth_diameter_km * -2, y: earth_diameter_km, z: earth_diameter_km * 4 },
                    look : { x : 0.0, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },
                    nodes: [ { type: "instance", target: "theCamera" } ]
                },
                {
                    type: "lookAt",
                    eye : { x: 0,                      y: earth_diameter_km, z: earth_diameter_km * 4.5 },
                    look : { x : 0.0, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },
                    nodes: [ { type: "instance", target: "theCamera" } ]
                },
                
                {
                    type: "lookAt",
                    eye : { x: earth_diameter_km * 2, y: earth_diameter_km, z: earth_diameter_km * 4 },
                    look : { x : 0.0, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },
                    nodes: [ { type: "instance", target: "theCamera" } ]
                },
                {
                    type: "lookAt",
                    eye : { x: earth_diameter_km * 4, y: earth_diameter_km, z: earth_diameter_km * 2 },
                    look : { x : 0.0, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },
                    nodes: [ { type: "instance", target: "theCamera" } ]
                },
                {
                    type: "lookAt",
                    eye : { x: earth_diameter_km * 4.5, y: earth_diameter_km, z: earth_diameter_km * 0 },
                    look : { x : 0.0, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },
                    nodes: [ { type: "instance", target: "theCamera" } ]
                },
                {
                    type: "lookAt",
                    eye : { x: earth_diameter_km * 4, y: earth_diameter_km, z: earth_diameter_km * -2 },
                    look : { x : 0.0, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },
                    nodes: [ { type: "instance", target: "theCamera" } ]
                },
                {
                    type: "lookAt",
                    eye : { x: earth_diameter_km * 2, y: earth_diameter_km, z: earth_diameter_km * -4 },
                    look : { x : 0.0, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },
                    nodes: [ { type: "instance", target: "theCamera" } ]
                },
                {
                    type: "lookAt",
                    eye : { x: earth_diameter_km * 2, y: earth_diameter_km, z: earth_diameter_km * -20 },
                    look : { x : 0.0, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },
                    nodes: [ { type: "instance", target: "theCamera" } ]
                },
                {
                    type: "lookAt",
                    eye : { x: earth_diameter_km * 2, y: earth_diameter_km, z: earth_diameter_km * -40 },
                    look : { x : 0.0, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },
                    nodes: [ { type: "instance", target: "theCamera" } ]
                },
                {
                    type: "lookAt",
                    eye : { x: earth_diameter_km * 2, y: earth_diameter_km, z: earth_diameter_km * -60 },
                    look : { x : 0.0, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },
                    nodes: [ { type: "instance", target: "theCamera" } ]
                },
                {
                    type: "lookAt",
                    eye : { x: earth_orbital_radius_km, y: earth_orbital_radius_km * 1.8, z: 0 },
                    look : { x : earth_orbital_radius_km, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 0.0, z: 1.0 },
                    nodes: [ { type: "instance", target: "theCamera" } ]
                }
            ]
        }
    ]
});

/*----------------------------------------------------------------------
 * Scene rendering loop and mouse handler stuff follows
 *---------------------------------------------------------------------*/
var yaw = 0;
var pitch = 0;
var lastX;
var lastY;
var dragging = false;

var activeView = 0;

var canvas = document.getElementById("theCanvas");

function mouseDown(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    dragging = true;
}

function mouseUp() {
    dragging = false;
}

function mouseOut() {
    dragging = false;
}

/* On a mouse drag, we'll re-render the scene, passing in
 * incremented angles in each time.
 */
function mouseMove(event) {
    if (dragging) {
        // yaw += (event.clientX - lastX) * 0.1;
        // pitch += (event.clientY - lastY) * -0.2;

        SceneJS.withNode("yaw").set("angle", yaw);
        SceneJS.withNode("pitch").set("angle", pitch);

        SceneJS.withNode("theScene").render();

        lastX = event.clientX;
        lastY = event.clientY;
    }
}

function mouseClick() {
    activeView = (activeView + 1) % 16;

    SceneJS.withNode("mySelector").set("selection", [activeView]);

    SceneJS.withNode("theScene").render();
}

canvas.addEventListener('click', mouseClick, true);

canvas.addEventListener('mousedown', mouseDown, true);
canvas.addEventListener('mousemove', mouseMove, true);
canvas.addEventListener('mouseup', mouseUp, true);
canvas.addEventListener('mouseout', mouseOut, true);

window.render = function() {

    SceneJS.withNode("pitch").set("angle", pitch);
    SceneJS.withNode("yaw").set("angle", yaw);

    SceneJS.withNode("theScene").render();

};

SceneJS.bind("error", function() {
    window.clearInterval(pInterval);
});

SceneJS.bind("reset", function() {
    window.clearInterval(pInterval);
});

var pInterval = setInterval("window.render()", 20);

