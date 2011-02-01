SceneJS.createNode({
    
    type: "scene",
    id: "theScene1",
    canvasId: "theCanvas1",
    loggingElementId: "theLoggingDiv1",
    
    nodes: [

        {
            type: "library",

            nodes: [
                {
                    type: "camera",
                    id: "theCamera1",
                    optics: {
                        type: "perspective",
                        fovy : 45.0,
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

                        // Integrate our earth circular orbit, which is defined in earth-orbit.js
                        {
                            type : "instance",
                            target :"earthCircleOrbit"
                        },

                        // Integrate our earth elliptical orbit, which is defined in earth-orbit.js
                        {
                            type : "instance",
                            target :"earthEllipseOrbit"
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
                            type: "material",
                            baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
                            specularColor:  { r: 1.0, g: 1.0, b: 1.0 },
                            specular:       1.0,
                            shine:          2.0,
                            emit:           1.0,

                            nodes: [
                            
                                {
                                    type : "instance",
                                    target :"earth-circle-orbit-sun-line"
                                }
                            ]
                        },

                        {
                            type: "quaternion",
                            id: "earthRotationalAxisQuaternion1",
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

        {
            type: "lookAt", 
            id: "lookAt1",
            eye : { x: 0, y: 0, z: earth_diameter_km * -3 },
            look : { x : 0, y : 0.0, z : 0.0 },
            up : { x: 0.0, y: 1.0, z: 0.0 },
            nodes: [ { type: "instance", target: "theCamera1" } ]
        }
    ]
});

/*----------------------------------------------------------------------
 * Canvas 1
 *---------------------------------------------------------------------*/

SceneJS.createNode({
    
    type: "scene",
    id: "theScene3",
    canvasId: "theCanvas3",
    loggingElementId: "theLoggingDiv3",
    
    nodes: [

        {
            type: "library",

            nodes: [

                {
                    type: "camera",
                    id: "theCamera3",
                    optics: {
                        type: "perspective",
                        fovy : 50.0,
                        aspect : 1.43,
                        near : 0.10,
                        far : milky_way_apparent_radius * 1.1,
                    },

                    nodes: [

                        // First simulate the milky-way with a stationary background sphere
                        {
                            type: "stationary",    
                            id: "sky-sphere3",

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
                            id: "earthRotationalAxisQuaternion3",
                            x: 0.0, y: 0.0, z: 0.0, angle: 0.0,

                            rotations: [ { x : 0, y : 0, z : 1, angle : -23.44 } ],

                            nodes: [

                                {

                                    type: "selector",
                                    id: "earthTextureSelector3",
                                    selection: [1],
                                    nodes: [

                                        {
                                            id: "earthTemperatureTextureSelector3",
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
                                                    nodes: [ { type : "instance", target : "earth-sphere2"  } ]

                                                },

                                                // selection [1], June
                                                {
                                                    type: "texture",
                                                    layers: [
                                                        { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                        { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                        { uri:"images/temperature/grads-temperature-2009-06.png", blendMode: "multiply" }
                                                    ],
                                                    nodes: [ { type : "instance", target : "earth-sphere2"  } ]

                                                },

                                                // selection [2], September
                                                {
                                                    type: "texture",
                                                    layers: [
                                                        { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                        { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                        { uri:"images/temperature/grads-temperature-2009-09.png", blendMode: "multiply" }
                                                    ],
                                                    nodes: [ { type : "instance", target : "earth-sphere2"  } ]

                                                },


                                                // selection [3], December
                                                {
                                                    type: "texture",
                                                    layers: [
                                                        { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                        { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                        { uri:"images/temperature/grads-temperature-2009-12.png", blendMode: "multiply" }
                                                    ],
                                                    nodes: [ { type : "instance", target : "earth-sphere2"  } ]

                                                }                                
                                            ]
                                        },

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

                                                /* Specify the amounts of ambient, diffuse and specular
                                                 * lights our object reflects
                                                 */
                                                {
                                                    id : "earth-sphere3",
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
                                                                    x: earth_diameter_km,
                                                                    y: earth_diameter_km,
                                                                    z: earth_diameter_km,

                                                                    nodes: [

                                                                        {

                                                                            type: "rotate",
                                                                            id: 'spin3',
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
                        // {
                        //     type: "interpolator",
                        //     target: "spin1",
                        //     targetProperty: "angle",
                        //     // over 1600 seconds rotate 360 degrees 20 times
                        //     keys: [0.0, 1600],
                        //     values: [0.0, 360.0*50]
                        // }
                    ]
                }
            ]
        },
        {
            type: "lookAt", 
            id: "lookAt3",
            eye : { x: earth_x_pos, y: 0, z: earth_diameter_km * -3 },
            look : { x : earth_x_pos, y : 0.0, z : 0.0 },
            up : { x: 0.0, y: 1.0, z: 0.0 },

            nodes: [ 
        
                { 
                    type: "instance", 
                    target: "theCamera3"
                } 
            ]
        }
    ]
});

/*----------------------------------------------------------------------
 * Canvas 4
 *---------------------------------------------------------------------*/

SceneJS.createNode({
    
    type: "scene",
    id: "theScene4",
    canvasId: "theCanvas4",
    loggingElementId: "theLoggingDiv4",
    
    nodes: [

        {
            type: "library",

            nodes: [

                {
                    type: "camera",
                    id: "theCamera4",
                    optics: {
                        type: "perspective",
                        fovy : 50.0,
                        aspect : 1.43,
                        near : 0.10,
                        far : milky_way_apparent_radius * 1.1,
                    },

                    nodes: [

                        // First simulate the milky-way with a stationary background sphere
                        {
                            type: "stationary",    
                            id: "sky-sphere4",

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
                            id: "earthRotationalAxisQuaternion4",
                            x: 0.0, y: 0.0, z: 0.0, angle: 0.0,

                            rotations: [ { x : 0, y : 0, z : 1, angle : -23.44 } ],

                            nodes: [

                                {

                                    type: "selector",
                                    id: "earthTextureSelector4",
                                    selection: [1],
                                    nodes: [

                                        {
                                            id: "earthTemperatureTextureSelector4",
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
                                                    nodes: [ { type : "instance", target : "earth-sphere2"  } ]

                                                },

                                                // selection [1], June
                                                {
                                                    type: "texture",
                                                    layers: [
                                                        { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                        { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                        { uri:"images/temperature/grads-temperature-2009-06.png", blendMode: "multiply" }
                                                    ],
                                                    nodes: [ { type : "instance", target : "earth-sphere2"  } ]

                                                },

                                                // selection [2], September
                                                {
                                                    type: "texture",
                                                    layers: [
                                                        { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                        { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                        { uri:"images/temperature/grads-temperature-2009-09.png", blendMode: "multiply" }
                                                    ],
                                                    nodes: [ { type : "instance", target : "earth-sphere2"  } ]

                                                },


                                                // selection [3], December
                                                {
                                                    type: "texture",
                                                    layers: [
                                                        { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                        { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                        { uri:"images/temperature/grads-temperature-2009-12.png", blendMode: "multiply" }
                                                    ],
                                                    nodes: [ { type : "instance", target : "earth-sphere2"  } ]

                                                }                                
                                            ]
                                        },

                                        {

                                            id: "earth-terrain-texture4",
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
                                                    id : "earth-sphere4",
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
                                                                    x: earth_diameter_km,
                                                                    y: earth_diameter_km,
                                                                    z: earth_diameter_km,

                                                                    nodes: [

                                                                        {

                                                                            type: "rotate",
                                                                            id: 'spin4',
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
        },
        {
            type: "lookAt", 
            id: "lookAt4",
            eye : { x: earth_x_pos, y: earth_diameter_km * 3, z: 0 },
            look : { x : earth_x_pos, y : 0.0, z : 0.0 },
            up : { x: 0.0, y: 0.0, z: 1.0 },

            nodes: [ 
        
                { 
                    type: "instance", 
                    target: "theCamera4"
                } 
            ]
        }
    ]
});




/*----------------------------------------------------------------------
 * Scene rendering loop and mouse handler stuff follows
 *---------------------------------------------------------------------*/
var yaw1 = 0;
var pitch1 = 0;
var lastX1;
var lastY1;
var dragging1 = false;

var yaw3 = 0;
var pitch3 = 0;
var lastX3;
var lastY3;
var dragging3 = false;

var canvas1 = document.getElementById("theCanvas1");
var canvas3 = document.getElementById("theCanvas3");
var canvas4 = document.getElementById("theCanvas4");

function setAspectRatio(camera, canvas) {
    var optics = SceneJS.withNode(camera).get("optics");
    optics.aspect = canvas.clientWidth/canvas.clientHeight;
    SceneJS.withNode(camera).set("optics", optics);
    dragging1 = false;
}

setAspectRatio("theCamera1", canvas1);
setAspectRatio("theCamera3", canvas3);
setAspectRatio("theCamera4", canvas4);

var earth_surface = document.getElementById("earth_surface");
var perspective = document.getElementById("perspective");

var circle_orbital_path = document.getElementById("circle-orbital-path");
var ellipse_orbital_path = document.getElementById("ellipse-orbital-path");

// Time of year changes inclination of Earths orbit with respect to the orbital plane

var time_of_year = document.getElementById("time_of_year");
var color_map = document.getElementById("temperature-color-map");
color_map.style.display='none';

var seasonal_rotations = {};
seasonal_rotations.jun = { x :  0,  y : 0,  z : -1,  angle : 23.44 };
seasonal_rotations.sep = { x :  1,  y : 0,  z :  0,  angle : 23.44 };
seasonal_rotations.dec = { x :  0,  y : 0,  z :  1,  angle : 23.44 };
seasonal_rotations.mar = { x : -1,  y : 0,  z :  0,  angle : 23.44 };

var earth_postion = SceneJS.withNode("earth-position");
var earth_sun_line_geometry = SceneJS.withNode("earth-circle-orbit-sun-line-geometry");

function setTemperatureTexture(month) {
    switch (month) {
        case 'mar' : 
            SceneJS.withNode("earthTemperatureTextureSelector").set("selection", [0]); 
            SceneJS.withNode("earthTemperatureTextureSelector3").set("selection", [0]); 
            SceneJS.withNode("earthTemperatureTextureSelector4").set("selection", [0]); 
            break;
        case 'jun' : 
            SceneJS.withNode("earthTemperatureTextureSelector").set("selection", [1]); 
            SceneJS.withNode("earthTemperatureTextureSelector3").set("selection", [1]); 
            SceneJS.withNode("earthTemperatureTextureSelector4").set("selection", [1]); 
            break;
        case 'sep' : 
            SceneJS.withNode("earthTemperatureTextureSelector").set("selection", [2]); 
            SceneJS.withNode("earthTemperatureTextureSelector3").set("selection", [2]); 
            SceneJS.withNode("earthTemperatureTextureSelector4").set("selection", [2]); 
            break;
        case 'dec' : 
            SceneJS.withNode("earthTemperatureTextureSelector").set("selection", [3]); 
            SceneJS.withNode("earthTemperatureTextureSelector3").set("selection", [3]); 
            SceneJS.withNode("earthTemperatureTextureSelector4").set("selection", [3]); 
            break;
    };    
}

function timeOfYearChange() {
  var month = this.value;
  SceneJS.Message.sendMessage({ 
    command: "update", 
    target: "earthRotationalAxisQuaternion1", 
    set: { rotation: seasonal_rotations[month] }
  });
  SceneJS.Message.sendMessage({ 
    command: "update", 
    target: "earthRotationalAxisQuaternion3", 
    set: { rotation: seasonal_rotations[month] }
  });
  SceneJS.Message.sendMessage({ 
    command: "update", 
    target: "earthRotationalAxisQuaternion4", 
    set: { rotation: seasonal_rotations[month] }
  });
  setTemperatureTexture(month);
  if (earth_surface.value === 'terrain') {
      SceneJS.withNode("earthTextureSelector").set("selection", [1]);
      SceneJS.withNode("earthTextureSelector3").set("selection", [1]);
      SceneJS.withNode("earthTextureSelector4").set("selection", [1]);
  } else {
      SceneJS.withNode("earthTextureSelector").set("selection", [0]);
      SceneJS.withNode("earthTextureSelector3").set("selection", [1]);
      SceneJS.withNode("earthTextureSelector4").set("selection", [1]);
  }
  // earth_sun_line_geometry.set("positions", [new_location[0], new_location[1], 0, earth_orbital_radius_km, 0.0, 0.0]);
}

time_of_year.onchange = timeOfYearChange;
time_of_year.onchange();

// Orbital Paths Indicators

function circleOrbitalPathChange() {
  if (circle_orbital_path.checked) {
      SceneJS.withNode("earthCircleOrbitSelector").set("selection", [1]);
  } else {
      SceneJS.withNode("earthCircleOrbitSelector").set("selection", [0]);
  }
}

circle_orbital_path.onchange = circleOrbitalPathChange;
circle_orbital_path.onchange();

// Perspective Frame

function perspectiveChange() {
    var look = SceneJS.withNode("lookAt1")
    switch(this.value) {
       case "top":
        look.set("eye",  { x: 0, y: earth_orbital_radius_km * 3, z: earth_orbital_radius_km * 0.3 } );
        look.set("look", { x : earth_orbital_radius_km, y : 0.0, z : 0.0 } );
        break;
      case "side":
       look.set("eye",  { x: 0, y: earth_orbital_radius_km * 0.3, z: earth_orbital_radius_km * -2.5 } );
       look.set("look", { x : earth_orbital_radius_km, y : 0.0, z : 0.0 } );
       break;
  }
  // SceneJS.withNode("theScene1").render();
}

perspective.onchange = perspectiveChange;
perspective.onchange();

function mouseDown1(event) {
    lastX1 = event.clientX;
    lastY1 = event.clientY;
    dragging1 = true;
}

function mouseUp1() {
    dragging1 = false;
}

function mouseOut1() {
    dragging1 = false;
}

/* On a mouse drag, we'll re-render the scene, passing in
 * incremented angles in each time.
 */
function mouseMove1(event) {
    if (dragging1) {
        var look, eye, eye4, eye4dup, neweye, up_down, up_downQ, left_right, left_rightQ, f, up_down_axis, angle;
        yaw1 = (event.clientX - lastX1);
        pitch1 = (event.clientY - lastY1);

        lastX1 = event.clientX;
        lastY1 = event.clientY;

        look = SceneJS.withNode("lookAt1");
        eye = look.get("eye");
        eye4 = [eye.x, eye.y, eye.z, 1];

        left_rightQ = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle : yaw1 * -0.2 });
        left_right = left_rightQ.getMatrix();

        neweye = SceneJS._math_mulMat4v4(left_right, eye4);
        console.log("drag   yaw1: " + yaw1 + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2]);

        eye4 = SceneJS._math_dupMat4(neweye);
        f = 1.0 / SceneJS._math_lenVec4(eye4);
        eye4dup = SceneJS._math_dupMat4(eye4);
        up_down_axis = SceneJS._math_mulVec4Scalar(eye4dup, f);
        up_downQ = new SceneJS.Quaternion({ x : up_down_axis[2], y : 0, z : up_down_axis[0], angle : pitch1 * -0.2 });
        angle = up_downQ.getRotation().angle;
        up_down = up_downQ.getMatrix();

        neweye = SceneJS._math_mulMat4v4(up_down, eye4);
        console.log("drag pitch1: " + pitch1 + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2] + ", angle: " + angle);

        look.set("eye", { x: neweye[0], y: neweye[1], z: neweye[2] });
        // SceneJS.withNode("theScene1").render();
        eye = look.get("eye");
        console.log("");

    }
}

canvas1.addEventListener('mousedown', mouseDown1, true);
canvas1.addEventListener('mousemove', mouseMove1, true);
canvas1.addEventListener('mouseup', mouseUp1, true);
canvas1.addEventListener('mouseout', mouseOut1, true);

// SceneJS.withNode("earthTextureSelector").set("selection", [0]);
// SceneJS.withNode("earthTextureSelector3").set("selection", [0]);
// SceneJS.withNode("earthTextureSelector4").set("selection", [0]);

SceneJS.withNode("earthEllipseOrbitSelector").set("selection", [1]);

window.render = function() {
    SceneJS.withNode("theScene1").render();
    SceneJS.withNode("theScene3").render();
    SceneJS.withNode("theScene4").render();
};

SceneJS.bind("error", function() {
    window.clearInterval(pInterval);
});

SceneJS.bind("reset", function() {
    window.clearInterval(pInterval);
});

var pInterval = setInterval("window.render()", 30);
