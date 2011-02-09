var earthSunLine = SceneJS.createNode({

    type: "library",
    
    nodes: [
        
        {
            type: "material",
            id: "earth-circle-orbit-sun-line",
            baseColor:      { r: 1.0, g: 0.3, b: 0.1 },
            specularColor:  { r: 1.0, g: 0.3, b: 0.1 },
            specular:       1.0,
            shine:          2.0,
            emit:           1.0,

            nodes: [
                            
                {
                    type: "selector",
                    id: "earthSunLineSelector",
                    selection: [0],

                    nodes: [

                        {

                            type: "translate", // Example translation
                            id: "earth-sun-line-translation",
                            x: 0,
                            y: 0.0,
                            z: earth_x_pos / 2,

                            nodes : [

                                {

                                    type: "rotate",
                                    id: "earth-sun-line-rotation",
                                    angle: 270.0,
                                    y : 1.0,

                                    nodes: [
                            
                                        {

                                            type: "scale",
                                            x: earth_orbital_radius_km / 2,
                                            y: earth_diameter_km * 20,
                                            z: earth_diameter_km * 40,

                                            nodes: [

                                                { 

                                                    type: "box",

                                                },
                                            ]
                                        },
                                    ]
                                }
                            ]
                        },
                        
                        // {
                        // 
                        //     type: "translate", // Example translation
                        //     id: "earth-sun-line-translation",
                        //     x: earth_x_pos / 2,
                        //     y: 0.0,
                        //     z: 0.0,
                        // 
                        //     nodes : [
                        // 
                        //         // {
                        //         // 
                        //         //     type: "rotate",
                        //         //     id: "earth-sun-line-rotation",
                        //         //     angle: 0.0,
                        //         //     y : 0.0,
                        //         // 
                        //         //     nodes: [
                        //     
                        //                 {
                        // 
                        //                     type: "scale",
                        //                     x: earth_x_pos,
                        //                     y: earth_diameter_km * 100,
                        //                     z: earth_diameter_km * 100,
                        // 
                        //                     nodes: [
                        // 
                        //                         { 
                        // 
                        //                             type: "box",
                        // 
                        //                         },
                        //                     ]
                        //                 }
                        //         //     ]
                        //         // }
                        //     ]
                        // },
                        
                        {
                            type: "geometry",
                            primitive: "line-loop",

                            positions: [
                                 sun_x_pos,     0.0,    0.0,
                                 earth_x_pos,   0.0,    0.0
                            ],

                            indices : [ 0, 1 ]

                        },
                    ]
                }
            ]
        }
    ]
});
