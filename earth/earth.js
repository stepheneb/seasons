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
           eye : { x: 0, y: 2, z: -22},
           look : { x : 0.0, y : -1.0, z : 0 },
           up : { x: 0.0, y: 1.0, z: 0.0 },

           nodes: [
               {
                   type: "camera",
                   optics: {
                       type: "perspective",
                       fovy : 60.0,
                       aspect : 1.47,
                       near : 0.10,
                       far : 1000.0
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
                           color:                  { r: 0.5, g: 0.5, b: 0.5 },
                           diffuse:                true,
                           specular:               true,
                           dir:                    { x: 1.0, y: 1.0, z: -1.0 }
                       },
                       {
                           type: "light",
                           mode:                   "dir",
                           color:                  { r: 0.5, g: 0.5, b: 0.5 },
                           diffuse:                true,
                           specular:               true,
                           dir:                    { x: 0.0, y: 1.0, z: -1.0 }
                       },
                       {
                           type: "light",
                           mode:                   "dir",
                           color:                  { r: 0.5, g: 0.5, b: 0.5 },
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
                                               uri:"images/earth2.jpg",
                                               
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
                                                   x: 1.0,
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
                                                 specularColor:  { r: 0.2, g: 0.2, b: 0.2 },
                                                 specular:       0.0,
                                                 shine:          2.0,

                                                 nodes: [

                                                     {
                                                         type: "translate",
                                                         x: 0,
                                                         y: 0,
                                                         z: -12 ,

                                                         nodes: [

                                                            {

                                                                type: "scale",
                                                                x: 1.0,
                                                                y: 1.0,
                                                                z: 1.0,
                                                                nodes: [
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
});

/*----------------------------------------------------------------------
 * Scene rendering loop and mouse handler stuff follows
 *---------------------------------------------------------------------*/
var yaw = 0;
var pitch = 0;
var lastX;
var lastY;
var dragging = false;

var texAngle = 0.0;
var texScale = 1.0;

/* For texture animation
 */
var timeLast = (new Date()).getTime();

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
        yaw += (event.clientX - lastX) * 0.1;
        pitch += (event.clientY - lastY) * -0.1;

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

window.render = function() {

    SceneJS.withNode("pitch").set("angle", pitch);
    SceneJS.withNode("yaw").set("angle", yaw);

    SceneJS.withNode("theScene").render();

    texAngle += 0.4;
    texScale = (texScale + 0.01) % 10.0;

};

SceneJS.bind("error", function() {
    window.clearInterval(pInterval);
});

SceneJS.bind("reset", function() {
    window.clearInterval(pInterval);
});

var pInterval = setInterval("window.render()", 10);

