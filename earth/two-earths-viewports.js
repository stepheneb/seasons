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
                                                    nodes: [ { type : "instance", target : "earth-sphere"  } ]

                                                },

                                                // selection [1], June
                                                {
                                                    type: "texture",
                                                    layers: [
                                                        { uri:"images/earth-continental-outline-edges-invert-copy.png", blendMode: "multiply" },
                                                        { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                        { uri:"images/temperature/grads-temperature-2009-06.png", blendMode: "multiply" }
                                                    ],
                                                    nodes: [ { type : "instance", target : "earth-sphere"  } ]

                                                },

                                                // selection [2], September
                                                {
                                                    type: "texture",
                                                    layers: [
                                                        { uri:"images/earth-continental-outline-edges-invert-copy.png", blendMode: "multiply" },
                                                        { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                        { uri:"images/temperature/grads-temperature-2009-09.png", blendMode: "multiply" }
                                                    ],
                                                    nodes: [ { type : "instance", target : "earth-sphere"  } ]

                                                },


                                                // selection [3], December
                                                {
                                                    type: "texture",
                                                    layers: [
                                                        { uri:"images/earth-continental-outline-edges-invert-copy.png", blendMode: "multiply" },
                                                        { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                        { uri:"images/temperature/grads-temperature-2009-12.png", blendMode: "multiply" }
                                                    ],
                                                    nodes: [ { type : "instance", target : "earth-sphere"  } ]

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

                                                /* Specify the amounts of ambient, diffuse and specular
                                                 * lights our object reflects
                                                 */
                                                {
                                                    id : "earth-sphere",
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
                        },
                        {
                            type: "interpolator",
                            target: "spin",
                            targetProperty: "angle",
                            // over 1600 seconds rotate 360 degrees 20 times
                            keys: [0.0, 1600],
                            values: [0.0, 360.0*50]
                        }
                    ]
                }
            ]
        },

        /*==================================================================================
         * Our first renderer node, with default values defined for all properties.
         * ================================================================================*/

        {
            type: "renderer",
        
            /*----------------------------------------
             Miscelleneous settings
             -----------------------------------------*/

            /* Specifies which buffers are cleared for each frame
             */
            clear: {
                depth : true,
                color : true,
                stencil: false
            },

            /* Specify clear values for the colour buffers
             */
            clearColor: {
                r: 0,
                g : 0,
                b : 0
            },

            /* Viewport defaults to canvas extents - but I'll set some
             * values to show what the properties are
             */
            viewport: {
                x : 0,
                y : 350,
                width: 515,
                height: 350
            },

            /* Set the width of rasterised lines
             */
            lineWidth: 1,


            /*----------------------------------------
             Blending
             -----------------------------------------*/

            /* Enable or disable blending
             */
            enableBlend: false,

            /* Set the blend color
             */
            blendColor: {
                r: 0.0,
                g: 0.0,
                b: 0.0,
                a: 1.0
            },

            /* Specify the equation used for both the RGB blend equation and the Alpha blend equation.
             * Accepted values are: func_add, func_subtract, func_reverse_subtract
             */
            blendEquation: "funcAdd",

            /* Set the RGB and alpha blend equations separately
             */
            blendEquationSeperate: {
                rgb: "funcAdd",
                alpha: "funcAdd"
            },

            /* Specify pixel arithmetic. Accepted values for sfactor and dfactor are:
             * zero, one, src_color, src_alpha, constant_color, one_minus_src_alpha,
             * one_minus_src_color, one_minus_constant_color, one_minus_constant_alpha,
             * dts_color, dst_alpha, one_minus_dst_alpha, one_minus_dst_color
             */
            blendFunc: {
                sfactor: "one",
                dfactor: 'one'
            },

            /* Set the RGB and alpha blend functions separately
             */
            blendFuncSeperate: {
                srcRGB: "one",
                dstRGB: "one",
                srcAlpha: "one",
                dstAlpha: "one"
            },


            /*----------------------------------------
             Depth buffer
             -----------------------------------------*/

            /* Enable/disable depth testing
             */
            enableDepthTest:true,

            /* Specify the value used for depth buffer comparisons. Accepted values are: never, less, equal,
             * lequal, greater, notequal, gequal, always
             */
            depthFunc: "lequal",

            /* Enable/disable writing into the depth buffer
             */
            depthMask: true,

            /* Specify mapping of depth values from normalised device coordinates to window coordinates
             */
            depthRange: {
                zNear: 0,
                zFar: 1
            },

            /* Specify the clear value for the depth buffer
             */
            clearDepth: 1.0,
        
            nodes: [

                {

                    type: "lookAt", 
                    id: "firstLookAt",
                    eye : { x: earth_x_pos, y: 0, z: earth_radius_km * -3 },
                    look : { x : earth_x_pos, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },

                    nodes: [ 
                
                        { 
                            type: "instance", 
                            target: "theCamera"
                        } 
                    ]
                }
            ]
        },
        
        /*==================================================================================
         * Our second renderer node, with default values defined for all properties.
         * ================================================================================*/

        {
            type: "renderer",
        
            /*----------------------------------------
             Miscelleneous settings
             -----------------------------------------*/

            /* Specifies which buffers are cleared for each frame
             */
            clear: {
                depth : true,
                color : true,
                stencil: false
            },

            /* Specify clear values for the colour buffers
             */
            clearColor: {
                r: 0,
                g : 0,
                b : 0
            },

            /* Viewport defaults to canvas extents - but I'll set some
             * values to show what the properties are
             */
            viewport: {
                x : 515,
                y : 350,
                width: 515,
                height: 350
            },

            /* Set the width of rasterised lines
             */
            lineWidth: 1,


            /*----------------------------------------
             Blending
             -----------------------------------------*/

            /* Enable or disable blending
             */
            enableBlend: false,

            /* Set the blend color
             */
            blendColor: {
                r: 0.0,
                g: 0.0,
                b: 0.0,
                a: 1.0
            },

            /* Specify the equation used for both the RGB blend equation and the Alpha blend equation.
             * Accepted values are: func_add, func_subtract, func_reverse_subtract
             */
            blendEquation: "funcAdd",

            /* Set the RGB and alpha blend equations separately
             */
            blendEquationSeperate: {
                rgb: "funcAdd",
                alpha: "funcAdd"
            },

            /* Specify pixel arithmetic. Accepted values for sfactor and dfactor are:
             * zero, one, src_color, src_alpha, constant_color, one_minus_src_alpha,
             * one_minus_src_color, one_minus_constant_color, one_minus_constant_alpha,
             * dts_color, dst_alpha, one_minus_dst_alpha, one_minus_dst_color
             */
            blendFunc: {
                sfactor: "one",
                dfactor: 'one'
            },

            /* Set the RGB and alpha blend functions separately
             */
            blendFuncSeperate: {
                srcRGB: "one",
                dstRGB: "one",
                srcAlpha: "one",
                dstAlpha: "one"
            },


            /*----------------------------------------
             Depth buffer
             -----------------------------------------*/

            /* Enable/disable depth testing
             */
            enableDepthTest:true,

            /* Specify the value used for depth buffer comparisons. Accepted values are: never, less, equal,
             * lequal, greater, notequal, gequal, always
             */
            depthFunc: "lequal",

            /* Enable/disable writing into the depth buffer
             */
            depthMask: true,

            /* Specify mapping of depth values from normalised device coordinates to window coordinates
             */
            depthRange: {
                zNear: 0,
                zFar: 1
            },

            /* Specify the clear value for the depth buffer
             */
            clearDepth: 1.0,
        
            nodes: [

                {

                    type: "lookAt", 
                    id: "secondLookAt",
                    eye : { x: earth_x_pos, y: 0, z: earth_radius_km * -3 },
                    look : { x : earth_x_pos, y : 0.0, z : 0.0 },
                    up : { x: 0.0, y: 1.0, z: 0.0 },

                    nodes: [ 
                
                        { 
                            type: "instance", 
                            target: "theCamera"
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

var activeView = 0;

var canvas = document.getElementById("theCanvas");
var earth_surface = document.getElementById("earth_surface");

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
        var look, eye, eye4, eye4dup, neweye, up_down, up_downQ, left_right, left_rightQ, f, up_down_axis, angle;
        yaw = (event.clientX - lastX);
        pitch = (event.clientY - lastY);

        lastX = event.clientX;
        lastY = event.clientY;

        look = SceneJS.withNode("secondLookAt");
        eye = look.get("eye");
        eye4 = [eye.x, eye.y, eye.z, 1];

        left_rightQ = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle : yaw * -0.2 });
        left_right = left_rightQ.getMatrix();

        neweye = SceneJS._math_mulMat4v4(left_right, eye4);
        // console.log("drag   yaw: " + yaw + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2]);

        eye4 = SceneJS._math_dupMat4(neweye);
        f = 1.0 / SceneJS._math_lenVec4(eye4);
        eye4dup = SceneJS._math_dupMat4(eye4);
        up_down_axis = SceneJS._math_mulVec4Scalar(eye4dup, f);
        up_downQ = new SceneJS.Quaternion({ x : up_down_axis[2], y : 0, z : up_down_axis[0], angle : pitch * -0.2 });
        angle = up_downQ.getRotation().angle;
        up_down = up_downQ.getMatrix();

        neweye = SceneJS._math_mulMat4v4(up_down, eye4);
        // console.log("drag pitch: " + pitch + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2] + ", angle: " + angle);

        look.set("eye", { x: neweye[0], y: neweye[1], z: neweye[2] });
        SceneJS.withNode("theScene").render();
        eye = look.get("eye");
        // console.log("");

    }
}

canvas.addEventListener('mousedown', mouseDown, true);
canvas.addEventListener('mousemove', mouseMove, true);
canvas.addEventListener('mouseup', mouseUp, true);
canvas.addEventListener('mouseout', mouseOut, true);

window.render = function() {

    SceneJS.withNode("theScene").render();

};

SceneJS.bind("error", function() {
    window.clearInterval(pInterval);
});

SceneJS.bind("reset", function() {
    window.clearInterval(pInterval);
});

var pInterval = setInterval("window.render()", 20);

var zBufferDepth = 0;

SceneJS.withNode("theScene").bind("loading-status", 
    function(event) {
        if (zBufferDepth == 0) {
            zBufferDepth = SceneJS.withNode("theScene").get("ZBufferDepth");
            var mesg = "using webgl context with Z-buffer depth of: " + zBufferDepth + " bits";
            SceneJS._loggingModule.info(mesg);            
        }
    });
