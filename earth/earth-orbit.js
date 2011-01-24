
var earth_orbit_segments = 1024;

var circle = function(scale) {
    var points = [];
    var pi2 = Math.PI * 2;
    var increment = pi2 / earth_orbit_segments;
    var angle = 0;
    if (typeof(scale) === "number") {
        for (var i = 0; i < earth_orbit_segments; i++, angle += increment) {
            points.push(Math.sin(angle) * scale, 0, Math.cos(angle) * scale);
        }
    } else {
        for (var i = 0; i < earth_orbit_segments; i++, angle += increment) {
            points.push(Math.sin(angle), 0, Math.cos(angle));
        }
    }
    return points;
}

var earth_orbit_positions = circle(earth_orbital_radius_km);
var earth_orbit_indices = [];
for (var i = 0; i < earth_orbit_segments; i++) { earth_orbit_indices.push(i) };

var earthOrbit = SceneJS.createNode({
    type: "library",    
    nodes: [
        {
            id: "earthOrbit",
            type: "translate",
            x: earth_orbital_radius_km,
            y: 0,
            z: 0,
            nodes: [ 
                {
                    type: "scale",
                    x: 1,
                    y: 0,
                    z: 1,
                    nodes: [ 
                        { 
                    
                            type: "material",
                    
                            baseColor:          { r: 0.1, g: 0.7, b: 1.0 },
                            specularColor:      { r: 0.1, g: 0.7, b: 1.0 },
                            specular:           1.0,
                            shine:              1.0,
                            emit:               1.0,
                    
                            nodes: [
                            
                                {

                                    type: "selector",
                                    id: "earthOrbitSelector",
                                    selection: [1],
                                    nodes: [ 

                                        {  },
                                
                                        {

                                            type: "geometry",
                                            id: "earthOrbitGeometry",
                                            primitive: "line-loop",

                                            positions: earth_orbit_positions,
                                            indices: earth_orbit_indices
                                            
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
