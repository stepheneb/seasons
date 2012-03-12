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
                        far : milky_way_apparent_radius * 10,
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
                            type   : "instance",
                            target : "orbit-grid"
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
            eye : initial_earth_eye,
            look : { x : earth_x_pos, y : 0.0, z : 0.0 },
            up : { x: 0.0, y: 1.0, z: 0.0 },
            nodes: [ { type: "instance", target: "theCamera1" } ]
        }
    ]
});

/*----------------------------------------------------------------------
 * Canvas 3
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
                        far : milky_way_apparent_radius * 10,
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
                            type: "translate",
                            x: sun_x_pos,
                            y: 0,
                            z: 0,
                            nodes: [ 
                                {
                                    type: "scale",
                                    x: 1,
                                    y: 1,
                                    z: 1,
                                    nodes: [ 

                                        {
                                            type: "node",

                                            flags: {
                                                transparent: true
                                            },

                                            nodes: [

                                                { 

                                                    type: "material",

                                                    baseColor:          { r: 0.1, g: 0.8, b: 2.0 },
                                                    specularColor:      { r: 0.1, g: 0.8, b: 2.0 },
                                                    specular:           1.0,
                                                    shine:              2.0,
                                                    emit:               2.0,
                                                    alpha:              0.4,

                                                    nodes: [

                                                        {
                                                            type: "instance",
                                                            target: "earth-in-space-elliptical-orbital-path"
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
                            type: "translate",
                            x: earth_x_pos,
                            y: 0,
                            z: 0,
                        
                            nodes: [

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
                                                            nodes: [ { type : "instance", target : "earth-sphere3"  } ]

                                                        },

                                                        // selection [1], June
                                                        {
                                                            type: "texture",
                                                            layers: [
                                                                { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                                { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                                { uri:"images/temperature/grads-temperature-2009-06.png", blendMode: "multiply" }
                                                            ],
                                                            nodes: [ { type : "instance", target : "earth-sphere3"  } ]
                                                
                                                        },

                                                        // selection [2], September
                                                        {
                                                            type: "texture",
                                                            layers: [
                                                                { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                                { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                                { uri:"images/temperature/grads-temperature-2009-09.png", blendMode: "multiply" }
                                                            ],
                                                            nodes: [ { type : "instance", target : "earth-sphere3"  } ]

                                                        },


                                                        // selection [3], December
                                                        {
                                                            type: "texture",
                                                            layers: [
                                                                { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                                { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                                { uri:"images/temperature/grads-temperature-2009-12.png", blendMode: "multiply" }
                                                            ],
                                                            nodes: [ { type : "instance", target : "earth-sphere3"  } ]

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

                                                                    type: "scale",
                                                                    x: earth_radius_km,
                                                                    y: earth_radius_km,
                                                                    z: earth_radius_km,

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

                        {
                            type: "interpolator",
                            target: "spin3",
                            targetProperty: "angle",
                            // over 1600 seconds rotate 360 degrees 20 times
                            keys: [0.0, 1600],
                            values: [0.0, 360.0*50]
                        }
                    ]
                }
            ]
        },
        {
            type: "lookAt", 
            id: "lookAt3",
            eye : initial_earth_eye,
            look : { x : earth_x_pos, y : 0, z : 0.0 },
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
                        far : milky_way_apparent_radius * 10,
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
                        
                        // {
                        //     type   : "instance",
                        //     target : "earth-circle-orbit-sun-line"
                        // },
                        
                        // Integrate our earth elliptical orbit, which is defined in earth-orbit.js
                        // {
                        //     type : "instance",
                        //     target :"earthEllipseOrbit"
                        // },

                        {
                            type: "translate",
                            x: sun_x_pos,
                            y: 0,
                            z: 0,
                            nodes: [ 
                                {
                                    type: "scale",
                                    x: 1,
                                    y: 1,
                                    z: 1,
                                    nodes: [ 

                                        {
                                            type: "node",

                                            flags: {
                                                transparent: true
                                            },

                                            nodes: [

                                                { 

                                                    type: "material",

                                                    baseColor:          { r: 0.1, g: 0.8, b: 2.0 },
                                                    specularColor:      { r: 0.1, g: 0.8, b: 2.0 },
                                                    specular:           1.0,
                                                    shine:              2.0,
                                                    emit:               2.0,
                                                    alpha:              0.4,

                                                    nodes: [

                                                        {
                                                            type: "instance",
                                                            target: "earth-in-space-elliptical-orbital-path"
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
                        //     type: "translate",
                        //     x: sun_x_pos,
                        //     y: 0,
                        //     z: 0,
                        //     
                        //     nodes: [ 
                        //     
                        //         {
                        //             type: "scale",
                        //             x: 1,
                        //             y: 1,
                        //             z: 1,
                        //             nodes: [ 
                        //                 { 
                        // 
                        //                     type: "material",
                        // 
                        //                     baseColor:          { r: 0.1, g: 0.7, b: 1.0 },
                        //                     specularColor:      { r: 0.1, g: 0.7, b: 1.0 },
                        //                     specular:           1.0,
                        //                     shine:              1.0,
                        //                     emit:               1.0,
                        // 
                        //                     nodes: [
                        //         
                        //                         {                                    
                        //                             type: "disk", 
                        //                             radius: earth_orbital_radius_km,
                        //                             innerRadius : earth_orbital_radius_km - 0.2,
                        //                             height: earth_radius_km / 50,
                        //                             rings: 360
                        //                         }
                        //                     ]
                        //                 }
                        //             ]
                        //         }
                        //     ]
                        // },

                        {
                            type: "translate",
                            x: earth_x_pos,
                            y: 0,
                            z: 0,

                            nodes: [

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
                                                            nodes: [ { type : "instance", target : "earth-sphere4"  } ]

                                                        },

                                                        // selection [1], June
                                                        {
                                                            type: "texture",
                                                            layers: [
                                                                { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                                { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                                { uri:"images/temperature/grads-temperature-2009-06.png", blendMode: "multiply" }
                                                            ],
                                                            nodes: [ { type : "instance", target : "earth-sphere4"  } ]

                                                        },

                                                        // selection [2], September
                                                        {
                                                            type: "texture",
                                                            layers: [
                                                                { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                                { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                                { uri:"images/temperature/grads-temperature-2009-09.png", blendMode: "multiply" }
                                                            ],
                                                            nodes: [ { type : "instance", target : "earth-sphere4"  } ]

                                                        },


                                                        // selection [3], December
                                                        {
                                                            type: "texture",
                                                            layers: [
                                                                { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                                { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                                { uri:"images/temperature/grads-temperature-2009-12.png", blendMode: "multiply" }
                                                            ],
                                                            nodes: [ { type : "instance", target : "earth-sphere4"  } ]

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

                                                                    type: "scale",
                                                                    x: earth_radius_km,
                                                                    y: earth_radius_km,
                                                                    z: earth_radius_km,

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
                        },
                        {
                            type: "interpolator",
                            target: "spin4",
                            targetProperty: "angle",
                            // over 1600 seconds rotate 360 degrees 20 times
                            keys: [0.0, 1600],
                            values: [0.0, 360.0*50]
                        }
                    ]
                }
            ]
        },
        {
            type: "lookAt", 
            id: "lookAt4",
            eye : { x: earth_x_pos, y: earth_radius_km * 3, z: 0 },
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

var earth_yaw = normalized_initial_earth_eye.x;
var earth_pitch = normalized_initial_earth_eye.y;

var sun_yaw =   initial_sun_eye.x;
var sun_pitch = initial_sun_eye.y;

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
}

setAspectRatio("theCamera1", canvas1);
setAspectRatio("theCamera3", canvas3);
setAspectRatio("theCamera4", canvas4);

var earth_surface = document.getElementById("earth_surface");
var perspective = document.getElementById("perspective");

// var circle_orbital_path = document.getElementById("circle-orbital-path");
var orbital_grid = document.getElementById("orbital-grid");
var orbit_grid_selector = SceneJS.withNode("orbit-grid-selector");

var time_of_year_buttons = document.getElementById("radio-time-of-year");

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

var earth_sun_line_rotation = SceneJS.withNode("earth-sun-line-rotation");
var earth_sun_line_translation = SceneJS.withNode("earth-sun-line-translation");

function setTemperatureTexture(month) {
    switch (month) {
        case 'mar' : 
            SceneJS.withNode("earthTemperatureTextureSelector3").set("selection", [0]); 
            SceneJS.withNode("earthTemperatureTextureSelector4").set("selection", [0]); 
            break;
        case 'jun' : 
            SceneJS.withNode("earthTemperatureTextureSelector3").set("selection", [1]); 
            SceneJS.withNode("earthTemperatureTextureSelector4").set("selection", [1]); 
            break;
        case 'sep' : 
            SceneJS.withNode("earthTemperatureTextureSelector3").set("selection", [2]); 
            SceneJS.withNode("earthTemperatureTextureSelector4").set("selection", [2]); 
            break;
        case 'dec' : 
            SceneJS.withNode("earthTemperatureTextureSelector3").set("selection", [3]); 
            SceneJS.withNode("earthTemperatureTextureSelector4").set("selection", [3]); 
            break;
    };    
}

var choose_month = document.getElementById("choose-month");
var month;
for(var i = 0; i < choose_month.elements.length; i++)
    if (choose_month.elements[i].checked) month = choose_month.elements[i].value;




function chooseMonthChange() {
  for(var i = 0; i < this.elements.length; i++)
      if (this.elements[i].checked) month = this.elements[i].value;
  var new_location = earth_circle_location_by_month(month);
  // earth_postion.set({ x: new_location[0], y: 0, z: new_location[2] });
  // earth_axis_position.set({ x: new_location[0], y: 0, z: new_location[2] });

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
      SceneJS.withNode("earthTextureSelector3").set("selection", [1]);
      SceneJS.withNode("earthTextureSelector4").set("selection", [1]);
  } else {
      SceneJS.withNode("earthTextureSelector3").set("selection", [0]);
      SceneJS.withNode("earthTextureSelector4").set("selection", [0]);
  }

  switch(month) {
      case "jun":
      earth_sun_line_rotation.set("angle", 180);
      earth_sun_line_translation.set({ x: -earth_orbital_radius_km / 2 , y: 0.0, z: 0 });
      break;

      case "sep":
      earth_sun_line_rotation.set("angle", 90);
      earth_sun_line_translation.set({ x: sun_x_pos, y: 0.0, z: earth_orbital_radius_km / 2 });
      break;

      case "dec":
      earth_sun_line_rotation.set("angle", 0);
      earth_sun_line_translation.set({ x: earth_orbital_radius_km / 2 , y: 0.0, z: 0 });
      break;

      case "mar":
      earth_sun_line_rotation.set("angle", 270);
      earth_sun_line_translation.set({ x: sun_x_pos, y: 0.0, z: -earth_orbital_radius_km / 2 });
      break;
    }
  
}

choose_month.onchange = chooseMonthChange;
choose_month.onchange();


// Texture mapping onto the Earth's surface

function earthSurfaceChange() {
  var new_surface = this.value;
  if (new_surface === 'terrain') {
      SceneJS.withNode("earthTextureSelector3").set("selection", [1]);
      SceneJS.withNode("earthTextureSelector4").set("selection", [1]);
      color_map.style.display='none';
  } else {
      SceneJS.withNode("earthTextureSelector3").set("selection", [0]);
      SceneJS.withNode("earthTextureSelector4").set("selection", [0]);
      setTemperatureTexture(month);
      color_map.style.display='inline';  
  }
}

earth_surface.onchange = earthSurfaceChange;
earth_surface.onchange();

// Orbital Paths Indicators

function circleOrbitalPathChange() {
  if (circle_orbital_path.checked) {
      SceneJS.withNode("earthCircleOrbitSelector").set("selection", [2]);
  } else {
      SceneJS.withNode("earthCircleOrbitSelector").set("selection", [0]);
  }
}

SceneJS.withNode("earthCircleOrbitSelector").set("selection", [0])

// Orbital Grid

function orbitalGridChange() {
  if (orbital_grid.checked) {
      orbit_grid_selector.set("selection", [2]);
  } else {
      orbit_grid_selector.set("selection", [0]);
  }
}

orbital_grid.onchange = orbitalGridChange;
orbital_grid.onchange();

// Perspective Frame

var choose_view = document.getElementById("choose-view");
var view_selection;

function perspectiveChange() {
    var look = SceneJS.withNode("lookAt1")
    for(var i = 0; i < this.elements.length; i++)
        if (this.elements[i].checked) view_selection = this.elements[i].value;
    switch(view_selection) {
        case "top":
        look.set("eye",  initial_sun_eye_top );
        look.set("look", { x: sun_x_pos, y : 0.0, z : 0.0 } );
        look.set("up",  { x: 0.0, y: 1.0, z: 0.0 } );
        break;

        case "side":
        look.set("eye",  initial_sun_eye_side );
        look.set("look", { x: sun_x_pos, y : 0.0, z : 0.0 } );
        look.set("up",  { x: 0.0, y: 1.0, z: 0.0 } );
        break;
  }
  sun_yaw =   0;
  sun_pitch = 0;
  SceneJS.withNode("theScene1").start();
}

choose_view.onchange = perspectiveChange;
choose_view.onchange();

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
        var look, eye, eye4, eye4dup, neweye;

        var up_downQ, up_downQM, left_rightQ, left_rightQM;

        var f, up_down_axis, angle, new_yaw, new_pitch;
        
        new_yaw = (event.clientX - lastX1) * -0.2;
        new_pitch = (event.clientY - lastY1) * 0.2;
        
        lastX1 = event.clientX;
        lastY1 = event.clientY;

        look = SceneJS.withNode("lookAt1");

        sun_yaw += new_yaw;
        sun_pitch += new_pitch;

        switch(view_selection) {
            case "top":
                eye4 = [initial_sun_eye_top.x, initial_sun_eye_top.y, initial_sun_eye_top.z, 1];
                break;
            case "side":
                eye4 = [initial_sun_eye_side.x, initial_sun_eye_side.y, initial_sun_eye_side.z, 1];
                break;
        }

        left_rightQ = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle : sun_yaw });
        left_rightQM = left_rightQ.getMatrix();

        neweye = SceneJS._math_mulMat4v4(left_rightQM, eye4);
        console.log("dragging: yaw: " + sun_yaw + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2]);

        eye4 = SceneJS._math_dupMat4(neweye);
        eye4dup = SceneJS._math_dupMat4(eye4);

        up_downQ = new SceneJS.Quaternion({ x : left_rightQM[0], y : 0, z : left_rightQM[2], angle : sun_pitch });
        up_downQM = up_downQ.getMatrix();

        neweye = SceneJS._math_mulMat4v4(up_downQM, eye4);

        console.log("dragging: pitch: " + sun_pitch + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2] );

        look.set("eye", { x: neweye[0], y: neweye[1], z: neweye[2] });
        // SceneJS.withNode("theScene").start();
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

SceneJS.withNode("earthEllipseOrbitSelector").set("selection", [2]);

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

var zBufferDepth = 0;

SceneJS.withNode("theScene1").bind("loading-status", 
    function(event) {
        if (zBufferDepth == 0) {
            zBufferDepth = SceneJS.withNode("theScene1").get("ZBufferDepth");
            var mesg = "using webgl context with Z-buffer depth of: " + zBufferDepth + " bits";
            SceneJS._loggingModule.info(mesg);            
        }
    });
