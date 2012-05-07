var spaceship = SceneJS.createNode({
    type: "library",
    nodes: [
        {
            id: "spaceship",
            type: "translate",
            nodes: [
                {
                    type: "scale",
                    x: 1.0,
                    y: 1.0,
                    z: 2.0,
                    nodes: [
                        {
                            type: "material",
                            baseColor:      { r: 0.1, g: 0.8, b: 0.2 },
                            specularColor:  { r: 0.1, g: 0.8, b: 0.2 },
                            specular:       0.3,
                            shine:          1.0,
                            nodes: [
                                {
                                    type: "sphere",
                                    slices: 30,
                                    rings: 30,
                                    semiMajorAxis: 2
                                }
                            ]
                        }
                    ]
                },
                {
                    type: "translate",
                    x: 2.0,
                    y: 0.0,
                    z: 0.0,
                    nodes: [
                        {
                            type: "scale",
                            x: 0.5,
                            y: 0.5,
                            z: 0.5,
                            nodes: [
                                {
                                    type: "rotate",
                                    angle: 90,
                                    z: 1.0,
                                    nodes: [
                                        {
                                            type: "material",
                                            baseColor:      { r: 1.0, g: 0.1, b: 0.1 },
                                            specularColor:  { r: 1.0, g: 0.1, b: 0.1 },
                                            specular:       0.3,
                                            shine:          1.0,
                                            nodes: [
                                                {
                                                    type: "disk",
                                                    radius: 1,
                                                    height: 0.8,
                                                    rings: 12
                                                }
                                            ]
                                        }
                                    ]
                                },
                            ]
                        }
                    ]
                },
                {
                    type: "translate",
                    x: 2.0,
                    y: 0.0,
                    z: 0.0,
                    nodes: [
                        {
                            type: "scale",
                            x: 0.2,
                            y: 0.2,
                            z: 0.3,
                            nodes: [
                                {
                                    type: "material",
                                    baseColor:      { r: 1.0, g: 0.4, b: 0.2 },
                                    specularColor:  { r: 1.0, g: 0.4, b: 0.2 },
                                    specular:       1.0,
                                    shine:          2.0,
                                    emit:           1.0,
                                    nodes: [
                                        {
                                            type: "rotate",
                                            angle: 0,
                                            z: 1.0,
                                            nodes: [
                                                {
                                                    type: "sphere",
                                                    slices: 30,
                                                    rings: 30,
                                                    semiMajorAxis: 10
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "scale",
                            x: 0.1,
                            y: 0.1,
                            z: 0.25,
                            nodes: [
                                {
                                    type: "material",
                                    baseColor:      { r: 1.0, g: 0.4, b: 0.2 },
                                    specularColor:  { r: 1.0, g: 0.4, b: 0.2 },
                                    specular:       1.0,
                                    shine:          2.0,
                                    emit:           0.5,
                                    nodes: [
                                        {
                                            type: "rotate",
                                            angle: 20,
                                            z: 1.0,
                                            nodes: [
                                                {
                                                    type: "sphere",
                                                    slices: 30,
                                                    rings: 30,
                                                    semiMajorAxis: 10
                                                }
                                            ]
                                        },
                                        {
                                            type: "rotate",
                                            angle: -20,
                                            z: 1.0,
                                            nodes: [
                                                {
                                                    type: "sphere",
                                                    slices: 30,
                                                    rings: 30,
                                                    semiMajorAxis: 10
                                                }
                                            ]
                                        },
                                        {
                                            type: "rotate",
                                            angle: 20,
                                            y: 1.0,
                                            nodes: [
                                                {
                                                    type: "sphere",
                                                    slices: 30,
                                                    rings: 30,
                                                    semiMajorAxis: 10
                                                }
                                            ]
                                        },
                                        {
                                            type: "rotate",
                                            angle: -20,
                                            y: 1.0,
                                            nodes: [
                                                {
                                                    type: "sphere",
                                                    slices: 30,
                                                    rings: 30,
                                                    semiMajorAxis: 10
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
})

SceneJS.createNode({
    type: "scene",
    id: "theScene",
    canvasId: "theCanvas",
    loggingElementId: "theLoggingDiv",

    nodes: [

        {
            type: "lookAt",
            id: "lookAt",
            eye:  { x: 3,  y: 2,  z: 7 },
            look: { x: 0,  y: 0,  z: 0  },
            up:   { x: 0,  y: 1,  z: 0  },

            nodes: [

                {
                    type: "camera",
                    id: "camera",
                    optics: {
                        type: "perspective",
                        fovy: 50.0,
                        aspect: 1.29,
                        near: 0.01,
                        far: 100
                    },

                    nodes: [
                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: 1.0, g: 1.0, b: 1.0 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 1.0, y: 0.5, z: -1.0 }
                        },
                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: 1.0, g: 1.0, b: 1.0 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: -1.0, y: -0.5, z: 1.0 }
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
                                            type: "instance",
                                            target: "spaceship"
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
var lastX;
var lastY;
var dragging = false;


SceneJS.withNode("theScene").render();

var canvas = document.getElementById("theCanvas");

function mouseDown(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    dragging = true;
}

function mouseUp() {
    dragging = false;
}

/* On a mouse drag, we'll re-render the scene, passing in
 * incremented angles in each time.
 */
function mouseMove(event) {
    if (dragging) {
        yaw += (event.clientX - lastX) * 0.5;
        pitch += (event.clientY - lastY) * 0.5;

        SceneJS.withNode("yaw").set("angle", yaw);
        SceneJS.withNode("pitch").set("angle", pitch);

        lastX = event.clientX;
        lastY = event.clientY;
    }
}

canvas.addEventListener('mousedown', mouseDown, true);
canvas.addEventListener('mousemove', mouseMove, true);
canvas.addEventListener('mouseup', mouseUp, true);

var scene1 = SceneJS.withNode("theScene").start();
