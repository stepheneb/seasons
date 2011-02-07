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
                    id: "earth-position",
                    x: earth_x_pos,
                    y: 0,
                    z: 0,

                    nodes: [

                        {
                            type: "quaternion",
                            id: "earthRotationalAxisQuaternion",
                            x: 0.0, y: 0.0, z: 0.0, angle: 0.0,

                            rotations: [ { x : 0, y : 0, z : 1, angle : -23.5 } ],
                        
                            nodes: [

                                {
                                    type: "scale",
                                    id: "earth-scale",
                                    x: earth_diameter_km,
                                    y: earth_diameter_km,
                                    z: earth_diameter_km,

                                    nodes: [

                                        {
                                            type: "rotate",
                                            id: 'earth-rotation',
                                            angle: 0,
                                            y: 1.0,

                                            nodes: [ 

                                                { type: "sphere", id: "esphere" },

                                            ]
                                        }
                                    ]
                                },
                            
                                {
                                    type: "texture",
                                
                                    nodes: [
                                
                                        {
                                            type: "selector",
                                            id: "earthAxisSelector",
                                            selection: [1],

                                            nodes: [
                                        
                                                // 0: no axis indicator
                                                { },

                                                // 1: display axis indicator
                                                {
                                            
                                                    type: "scale",
                                                    x: earth_diameter_km * 0.02,
                                                    y: earth_diameter_km * 1.2,
                                                    z: earth_diameter_km * 0.02,

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
});