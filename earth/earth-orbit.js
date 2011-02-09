
//  Circular Orbit

var earth_circle_orbit_segments = 1024;

var circle = function(scale) {
    var points = [];
    var pi2 = Math.PI * 2;
    var increment = pi2 / earth_circle_orbit_segments;
    var angle = 0;
    if (typeof(scale) === "number") {
        for (var i = 0; i < earth_circle_orbit_segments; i++, angle += increment) {
            points.push(Math.sin(angle) * scale, 0, Math.cos(angle) * scale);
        }
    } else {
        for (var i = 0; i < earth_circle_orbit_segments; i++, angle += increment) {
            points.push(Math.sin(angle), 0, Math.cos(angle));
        }
    }
    return points;
}

var earth_circle_orbit_positions = circle(earth_orbital_radius_km);
var earth_circle_orbit_indices = [];
for (var i = 0; i < earth_circle_orbit_segments; i++) { earth_circle_orbit_indices.push(i) };

var earth_circle_location_by_month = function(month) {
    var day2 = 0;
    var loc = [earth_circle_orbit_positions[day2], earth_circle_orbit_positions[day2 + 1]];
    switch(month) {
        case "dec":
        day2 = 182 * 3;
        loc = [earth_circle_orbit_positions[day2] + earth_orbital_radius_km, 0, earth_circle_orbit_positions[day2 + 2]];
        break;
        case "mar":
        day2 = 273 * 3;
        loc = [earth_circle_orbit_positions[day2] + earth_orbital_radius_km, 0, earth_circle_orbit_positions[day2 + 2]];
        break;
        case "jun":
        day2 = 0;
        loc = [earth_circle_orbit_positions[day2] + earth_orbital_radius_km, 0, earth_circle_orbit_positions[day2 + 2]];
        break;
        case "sep":
        day2 = 91 * 3;
        loc = [earth_circle_orbit_positions[day2] + earth_orbital_radius_km, 0, earth_circle_orbit_positions[day2 + 2]];
        break;
    }
    return loc;
}

var earthCircleOrbit = SceneJS.createNode({
    type: "library",    
    nodes: [
        {
            id: "earthCircleOrbit",
            type: "translate",
            x: sun_x_pos,
            y: 0,
            z: 0,
            nodes: [ 
                {
                    type: "scale",
                    x: 1,
                    y: 1,
                    z: 1,
                    nodes: [ 
                    
                        {
                            type: "node",
                            
                            flags: {
                                transparent: true
                            },
                            
                            nodes: [
                                { 
                    
                                    type: "material",
                    
                                    baseColor:          { r: 1.0, g: 0.8, b: 0.1 },
                                    specularColor:      { r: 1.0, g: 0.8, b: 0.1 },
                                    specular:           1.0,
                                    shine:              2.0,
                                    emit:               2.0,
                                    alpha:              0.4,
                    
                                    nodes: [
                            
                                        {

                                            type: "selector",
                                            id: "earthCircleOrbitSelector",
                                            selection: [1],
                                            nodes: [ 

                                                {  },
                                        
                                                {
                            
                                                    type: "disk", 
                                                    id: "earth-in-space-circular-orbital-path" ,                                         
                                                    radius: earth_orbital_radius_km,
                                                    innerRadius : earth_orbital_radius_km - 0.2,
                                                    height: earth_diameter_km / 49,
                                                    rings: 360
                                                },
                                    
                                                {
                            
                                                    type: "disk",                                           
                                                    id: "sun-earth-circular-orbital-path" ,                                         
                                                    radius: earth_orbital_radius_km,
                                                    innerRadius : earth_orbital_radius_km - (earth_diameter_km * 50),
                                                    height: earth_diameter_km * 99,
                                                    rings: 360
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

//  Elliptical Orbit

var earth_ellipse_orbit_segments = 1024;

var ellipse = function(scale) {
    var points = [];
    var pi2 = Math.PI * 2;
    var increment = pi2 / earth_ellipse_orbit_segments;
    var angle = 0;
    if (typeof(scale) === "number") {
        for (var i = 0; i < earth_ellipse_orbit_segments; i++, angle += increment) {
            points.push(Math.sin(angle) * scale, 0, Math.cos(angle) * scale);
        }
    } else {
        for (var i = 0; i < earth_ellipse_orbit_segments; i++, angle += increment) {
            points.push(Math.sin(angle), 0, Math.cos(angle));
        }
    }
    return points;
}

var earth_ellipse_orbit_positions = circle(earth_orbital_radius_km);
var earth_ellipse_orbit_indices = [];
for (var i = 0; i < earth_circle_orbit_segments; i++) { earth_ellipse_orbit_indices.push(i) };

var earth_ellipse_location_by_month = function(month) {
    var day2 = 0;
    var loc = [earth_circle_orbit_positions[day2], earth_circle_orbit_positions[day2 + 1]];
    switch(month) {
        case "dec":
        day2 = 182 * 2;
        loc = [earth_circle_orbit_positions[day2], earth_circle_orbit_positions[day2 + 1]];
        break;
        case "mar":
        day2 = 273 * 2;
        loc = [earth_circle_orbit_positions[day2], earth_circle_orbit_positions[day2 + 1]];
        break;
        case "jun":
        day2 = 0;
        loc = [earth_circle_orbit_positions[day2], earth_circle_orbit_positions[day2 + 1]];
        break;
        case "sep":
        day2 = 91 * 2;
        loc = [earth_circle_orbit_positions[day2], earth_circle_orbit_positions[day2 + 1]];
        break;
    }
    return loc;
}

var earthEllipseOrbit = SceneJS.createNode({
    type: "library",    
    nodes: [
        {
            id: "earthEllipseOrbit",
            type: "translate",
            x: sun_x_pos,
            y: 0,
            z: 0,
            nodes: [ 
                {
                    type: "scale",
                    x: 1,
                    y: 1,
                    z: 1,
                    nodes: [ 
                    
                        {
                            type: "node",
                            
                            flags: {
                                transparent: true
                            },
                            
                            nodes: [

                                { 
                    
                                    type: "material",

                                    baseColor:          { r: 0.1, g: 0.8, b: 2.0 },
                                    specularColor:      { r: 0.1, g: 0.8, b: 2.0 },
                                    specular:           1.0,
                                    shine:              2.0,
                                    emit:               2.0,
                                    alpha:              0.4,

                                    nodes: [
                            
                                        {

                                            type: "selector",
                                            id: "earthEllipseOrbitSelector",
                                            selection: [2],
                                            nodes: [ 

                                                {  },

                                                {
                                                                    
                                                    type: "disk", 
                                                    id: "earth-in-space-elliptical-orbital-path" ,                                         
                                                    radius: earth_orbital_radius_km,
                                                    semiMajorAxis: earthOrbitData.semiMajorAxis,
                                                    innerRadius : earth_orbital_radius_km - 0.4,
                                                    height: earth_diameter_km / 50,
                                                    rings: 360
                                                },
                                                                            
                                                {
                                                                    
                                                    type: "disk",                                           
                                                    id: "sun-earth-elliptical-orbital-path" ,                                         
                                                    radius: earth_orbital_radius_km,
                                                    semiMajorAxis: earthOrbitData.semiMajorAxis,
                                                    innerRadius : earth_orbital_radius_km - (earth_diameter_km * 50),
                                                    height: earth_diameter_km * 50,
                                                    rings: 360
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
