var earthSphere = SceneJS.createNode({

    type: "library",
    
    nodes: [

        /* Specify the amounts of ambient, diffuse and specular
         * lights our object reflects
         */
        {
            id : "earth-sphere",
            type: "material",
            baseColor:      { r: 0.45, g: 0.45, b: 0.45 },
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
                            x: earth_diameter_km,
                            y: earth_diameter_km,
                            z: earth_diameter_km,

                            nodes: [

                                {

                                    type: "rotate",
                                    id: 'earth-rotation',
                                    angle: 0,
                                    y: 1.0,

                                    nodes: [ { type: "sphere", id: "esphere" } ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});