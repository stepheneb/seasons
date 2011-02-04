
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
            x: earth_orbital_radius_km,
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
                    
                            type: "material",
                    
                            baseColor:          { r: 1.0, g: 0.8, b: 0.1 },
                            specularColor:      { r: 1.0, g: 0.8, b: 0.1 },
                            specular:           0.5,
                            shine:              2.0,
                            emit:               1.0,
                    
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
                                            inner_radius : earth_orbital_radius_km - 0.2,
                                            height: earth_diameter_km / 49,
                                            rings: 360
                                        },
                                    
                                        {
                            
                                            type: "disk",                                           
                                            id: "sun-earth-circular-orbital-path" ,                                         
                                            radius: earth_orbital_radius_km,
                                            inner_radius : earth_orbital_radius_km - (earth_diameter_km * 50),
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
});

//  Elliptical Orbit

var deg2rad = Math.PI/180;
var min2rad = Math.PI/(180*60);
var sec2rad = Math.PI/(180*60*60);
var rad2deg = 180/Math.PI;
var au2km = 149597870.7;
var earthMass = 5.9736e24;        // km
var earthRadius = 6378.1;         // km
var earthOrbitalPeriod = 365.256363004; // days
var earthRotationPeriod = 0.99726968;   // days
var t_day = 0.0001;

var earthOrbitData = {
  aphelion: 1.01671388,
  perihelion: 0.98329134,
  semiMajorAxis: 1.00000261,
  radius: 1.00,
  period: 1.00,
  inclination: 7.25*deg2rad,
  eccentricity : 0.01671123,
  longitude : 348.73936*deg2rad,
  argument : 114.20783*deg2rad
}

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
            x: earth_orbital_radius_km,
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
                    
                            type: "material",

                            baseColor:          { r: 0.1, g: 0.8, b: 2.0 },
                            specularColor:      { r: 0.1, g: 0.8, b: 2.0 },
                            specular:           1.0,
                            shine:              2.0,
                            emit:               2.0,

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
                                            inner_radius : earth_orbital_radius_km - 0.2,
                                            height: earth_diameter_km / 50,
                                            rings: 360
                                        },
                                                                            
                                        {
                                                                    
                                            type: "disk",                                           
                                            id: "sun-earth-elliptical-orbital-path" ,                                         
                                            radius: earth_orbital_radius_km,
                                            semiMajorAxis: earthOrbitData.semiMajorAxis,
                                            inner_radius : earth_orbital_radius_km - (earth_diameter_km * 50),
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
});
