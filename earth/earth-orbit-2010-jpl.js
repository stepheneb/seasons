
var earth_jpl_2010_orbit_data = earth_ephemerides_geometry(earth_orbital_radius_km);

SceneJS.createNode({

    type: "library",
    
    nodes: [
        
        {
            type: "material",
            id: "earth-orbit-2010-jpl",
            baseColor:      { r: 1.0, g: 0.1, b: 0.1 },
            specularColor:  { r: 1.0, g: 0.1, b: 0.1 },
            specular:       5.0,
            shine:          5.0,
            emit:           1.0,

            nodes: [

                {
                    type: "translate",
                    x: 0,
                    y: 0,
                    z: 0,

                    nodes : [

                        {
                            type: "rotate",
                            angle: 90,
                            y : 1.0,

                            nodes: [
                            
                                {
                                    type: "rotate",
                                    angle: 23.45,
                                    x : 1.0,

                                    nodes: [
                    
                                        {
                                            type: "scale",
                                            x: 1,
                                            y: 1,
                                            z: 1,

                                            nodes: [
                                        
                                                {
                                                    type: "geometry",
                                                    primitive: "line-loop",

                                                    positions: earth_jpl_2010_orbit_data.positions,
                                                    indices : earth_jpl_2010_orbit_data.indices
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
