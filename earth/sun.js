var sun = SceneJS.createNode({

    type: "library",
    
    nodes: [
        {
    
            id: "sun",
            type: "material",
            baseColor:      { r: 1.0, g: 0.95, b: 0.6 },
            specularColor:  { r: 1.0, g: 0.95, b: 0.6 },
            specular:       2.0,
            shine:          2.0,
    
            nodes: [

                {
                    type: "translate",
                    x: earth_orbital_radius_km,
                    y: 0,
                    z: 0,

                    nodes: [
                        {
                            type: "scale",
                            x: sun_diameter_km,
                            y: sun_diameter_km,
                            z: sun_diameter_km,

                            nodes: [ { type: "sphere", slices: 60, rings: 60 } ]
                        }
                    ]
                }
            ]
        }
    ]
});
