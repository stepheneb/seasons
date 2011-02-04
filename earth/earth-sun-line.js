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
                    type: "translate", // Example translation
                    id: "earth-sun-line-translation",
                    x: earth_orbital_radius_km,
                    y: 0.0,
                    z: earth_orbital_radius_km / 2,

                    nodes : [

                        {

                            type: "rotate",
                            id: "earth-sun-line-rotation",
                            angle: 270.0,
                            y : 1.0,

                            nodes: [

                                {
                                    type: "scale",  // Example scaling
                                    x: earth_orbital_radius_km / 2,
                                    y: earth_diameter_km*50,
                                    z: earth_diameter_km*50,

                                    nodes: [
                                        
                                        { 
                                        
                                            type: "box",
                                        
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