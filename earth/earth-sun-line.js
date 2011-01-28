var earthSunLine = SceneJS.createNode({

    type: "library",
    
    nodes: [
        
        {
            type: "material",
            id: "earth-circle-orbit-sun-line",
            baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
            specularColor:  { r: 1.0, g: 1.0, b: 1.0 },
            specular:       1.0,
            shine:          2.0,
            emit:           1.0,

            nodes: [
            
                {

                    type: "selector",
                    id: "earth-circle-orbit-sun-line-selector",
                    selection: [1],
                    nodes: [ 

                        {  },
                
                        // 1: jun
                        
                        {
                            type: "geometry",
                            id: "earth-circle-orbit-sun-line-geometry",
                            primitive: "line-loop",

                            positions: [
                                 0.0,                       0.0,    0.0,
                                 earth_orbital_radius_km,   0.0,    0.0
                            ],

                            indices : [ 0, 1 ]

                        },
                        
                        // 2: sep
                        
                        {
                            type: "geometry",
                            id: "earth-circle-orbit-sun-line-geometry",
                            primitive: "line-loop",

                            positions: [
                                 229470.5437029441, 0, 127218.05172049465,
                                 earth_orbital_radius_km,   0.0,    0.0
                            ],

                            indices : [ 0, 1 ]

                        },
                        
                        // 3: dec
                        
                        {
                            type: "geometry",
                            id: "earth-circle-orbit-sun-line-geometry",
                            primitive: "line-loop",

                            positions: [
                                 284801.1698540929, 0, 65792.43578077952,
                                 earth_orbital_radius_km,   0.0,    0.0
                            ],

                            indices : [ 0, 1 ]

                        },
                        
                        // 4: mar
                        
                        {
                            type: "geometry",
                            id: "earth-circle-orbit-sun-line-geometry",
                            primitive: "line-loop",

                            positions: [
                                 299184.6856101384, 0, -15618.245080807495,
                                 earth_orbital_radius_km,   0.0,    0.0
                            ],

                            indices : [ 0, 1 ]

                        }

                    ]
                }
            ]
        }
    ]
});