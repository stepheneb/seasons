
// Orbit Grid

var orbit_grid_segments = 10;

var grid = function(scale) {
    var points = [];
    var p;
    var grid_increment = scale * 2 / orbit_grid_segments;
    for (var i = 0; i <= orbit_grid_segments; i++) {
        p = i * grid_increment - scale;
        points.push(p, 0, -scale);
        points.push(p, 0, +scale);
        points.push(-scale, 0, p);
        points.push(+scale, 0, p);
    }
    return points;
}

var orbit_grid_positions = grid(earth_orbital_radius_km);
var orbit_grid_indices = [];
var orbit_grid_lines = orbit_grid_positions.length / 3;
for (var i = 0; i < orbit_grid_lines; i++) { orbit_grid_indices.push(i) };

var orbit_lines = []

var orbitGrid = SceneJS.createNode({

    type: "library",
    
    nodes: [
        
        {
            type: "material",
            id: "orbit-grid",
            baseColor:      { r: 0.4, g: 0.6, b: 0.4 },
            specularColor:  { r: 0.4, g: 0.6, b: 0.4 },
            specular:       1.0,
            shine:          2.0,
            emit:           1.0,

            nodes: [
            
                {
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

                                    type: "selector",
                                    id: "orbit-grid-selector",
                                    selection: [1],
                                    nodes: [ 
                        
                                        // 0: off
                         
                                        {  },
                                    
                                        // 1: on
                        
                                        {
                                            type: "geometry",
                                            id: "orbit-grid-geometry",
                                            primitive: "lines",

                                            positions: orbit_grid_positions,

                                            indices : orbit_grid_indices

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