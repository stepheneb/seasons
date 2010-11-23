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
            type: "lookAt",
            eye : { x: 0, y: 0.2, z: -600.0 },
            look : { x : 0.0, y : -1.0, z : 0 },
            up : { x: 0.0, y: 1.0, z: 0.0 },
 
            nodes: [
                {
                    type: "camera",
                    optics: {
                        type: "perspective",
                        fovy : 60.0,
                        aspect : 1.43,
                        near : 0.10,
                        far : 100000.0
                    },
 
                    nodes: [
 
                        /* Integrate our sky sphere, which is defined in sky-sphere.js
                         */
                        {
                            type : "instance",
                            target :"sky-sphere"
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
                                            id: "myQuaternion",
                                            x: 0.0, y: 0.0, z: 0.0, angle: 0.0,
                                            
                                            rotations: [ { x : 0, y : 0, z : 1, angle : -23.5 } ],
                                            // nodes: [ { type: "sphere" } ]
                                            
                                            
                                            nodes: [

                                                {
                                                    type : "instance",
                                                    target :"earth-axis"
                                                },

                                                /** Textures images are loaded asynchronously and won't render
                                                * immediately. On first traversal, they start loading their image,
                                                * which they collect on a subsequent traversal.
                                                */
                                                {
                                                    type: "texture",

                                                    id: "earthTexture",

                                                    /* A texture can have multiple layers, each applying an
                                                    * image to a different material reflection component.
                                                    * This layer applies the Zod image to the diffuse
                                                    * component, with animated scaling.
                                                    */
                                                    layers: [

                                                        { 
                                                            uri:"images/lat-long-grid-invert-1440x720-15.png",
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
   
                                                        /* Specify the amounts of ambient, diffuse and specular
                                                         * lights our object reflects
                                                         */
                                                        {
                                                            type: "material",
                                                            baseColor:      { r: 0.6, g: 0.6, b: 0.6 },
                                                            specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                                            specular:       0.0,
                                                            shine:          2.0,
   
                                                            nodes: [
   
                                                                {
                                                                    type: "translate",
                                                                    x: 0,
                                                                    y: 0,
                                                                    z: 0,
   
                                                                    nodes: [
  
                                                                        {
    
                                                                            type: "scale",
                                                                            x: 200.0,
                                                                            y: 200.0,
                                                                            z: 200.0,
                                                                
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
                        },

                        // Interpolates the Earth spin - this node could be anywhere in the scene
                        {
                            type: "interpolator",
                            target: "spin",
                            targetProperty: "angle",
                            // over 1000 seconds rotate 360 degrees 20 times
                            // keys: [0.0, 5],
                            // values: [0.0, 45]
                            keys: [0.0, 1000],
                            values: [0.0, 360.0*50]
                        }
                    ]
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
        pitch += (event.clientY - lastY) * -0.2;

        SceneJS.withNode("yaw").set("angle", yaw);
        SceneJS.withNode("pitch").set("angle", pitch);

        SceneJS.withNode("theScene").render();

        lastX = event.clientX;
        lastY = event.clientY;
    }
}

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

