var earthOrbit = SceneJS.createNode({

    type: "library",
    
    nodes: [
        {
            id: "earth-orbit",
            type: "translate",
            x: 0,
            y: 0,
            z: 0,

            nodes: [ 
                { 
                    type: "geometry",
                    primitive: "line-loop",
                    
                    positions : [
                        0.0, 0.0, 0.0,
                        earth_diameter_km * 3, 0, 0,
                        earth_diameter_km * 3, 0, earth_diameter_km * 3,
                        0, 0, earth_diameter_km * 3
                    ]
                } 
            ]
        }
    ]
});
