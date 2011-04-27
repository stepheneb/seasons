
// some constants
var deg2rad = Math.PI/180;
var min2rad = Math.PI/(180*60);
var sec2rad = Math.PI/(180*60*60);
var rad2deg = 180/Math.PI;
var au2km = 149597870.691;
var earthMass = 5.9736e24;        // km
var earthRadius = 6378.1;         // km
var earthOrbitalPeriod = 365.256363004; // days
var earthRotationPeriod = 0.99726968;   // days
var twoPI  = Math.PI * 2;
var fourPI = Math.PI * 4;

var scale_factor = 1000;

var sun_diameter =     1392000.0 / scale_factor;
var earth_diameter =     12742.0 / scale_factor;
var km =                     1.0 / scale_factor;
var meter =                   km / 1000;

var earth_orbital_radius = au2km / scale_factor;

var milky_way_apparent_radius = earth_orbital_radius * 10;

var sun = {
    pos: { x: 0, y: 0, z: 0 },
    radius: sun_diameter / 2
};

var initial_day_number = day_number_by_month['jun'];

var initial_earth_rotation = 0;

var earth = {
    pos: {
        x: earth_ephemerides_distance_from_sun_by_day_number(initial_day_number),
        y: 0,
        z: 0
    },
    distance: earth_ephemerides_distance_from_sun_by_day_number(initial_day_number),
    radius:  earth_diameter / 2,
    tilt: 23.45,
    day_number: initial_day_number,
    rotation: initial_earth_rotation,
    km: km / (earth_diameter / 2),
    meter: meter / (earth_diameter / 2)
};

// San Francisco: 38, 122

var surface_line_width = earth.radius / 200;
var surface_earth_scale_factor = 100;

var surface = {
    // latitude: 38,
    // longitude: 122,
    latitude: 0,
    longitude: 90,
    yaw: 0,
    pitch: 0,
    distance: 3,
    lookat_yaw: 0,
    lookat_pitch: 0,
    min_height: 0.001,
    height: 0.001,
    max_pitch: 85,
    km: km * surface_earth_scale_factor,
    meter: meter * surface_earth_scale_factor,
    flagpole: {
        radius: 1 *  meter * surface_earth_scale_factor,
        height: 25 *  meter * surface_earth_scale_factor,
        pos: { x: 0, y: 0, z: 0 }
    }
};

var dark_side_light = 0.25;
var max_pitch = 85;

var distance = earth.radius * 3;

var yaw      =  -130;
var pitch    = -15;

var lookat_yaw = 0;

//
// Square Grid
//

var square_grid = function(scale, segments) {
    var points = [];
    var p;
    var grid_increment = scale * 2 / segments;
    for (var i = 0; i <= segments; i++) {
        p = i * grid_increment - scale;
        points.push(p, 0, -scale);
        points.push(p, 0, +scale);
        points.push(-scale, 0, p);
        points.push(+scale, 0, p);
    }
    return points;
}

var earth_grid_positions = square_grid(earth.radius * 3, 30);
var earth_grid_indices = [];
var earth_grid_points = earth_grid_positions.length / 3;
for (var i = 0; i < earth_grid_points; i++) { earth_grid_indices.push(i) };

var sun_grid_positions = square_grid(sun.radius * 6, 30);
var sun_grid_indices = [];
var sun_grid_points = sun_grid_positions.length / 3;
for (var i = 0; i < sun_grid_points; i++) { sun_grid_indices.push(i) };

//
// Rose Grid
//

var rose_grid = function(scale, segments) {
    var points = [];
    var x, z, rangle;
    var angle_increment = 360 / segments;
    points.push(0, 0, 0);
    for (var angle = 0; angle <= 180; angle += angle_increment) {
        rangle = angle * deg2rad;
        x = Math.sin(rangle) * scale;
        z = Math.cos(rangle) * scale;
        points.push(x, 0, z);
        points.push(-x, 0, -z);
    }
    return points;
}

var earth_rose_scale = earth.radius * 1.5;
var earth_rose_grid_positions = rose_grid(earth_rose_scale, 24);
var earth_rose_grid_indices = [];
var earth_rose_grid_points = earth_rose_grid_positions.length / 3;
for (var i = 1; i < earth_rose_grid_points; i += 2) { 
    earth_rose_grid_indices.push(i, i+1);
};


var latitude_rose_scale = earth.radius * 1.25;
var latitude_rose_grid_positions = rose_grid(latitude_rose_scale, 24);
var latitude_rose_grid_indices = [];
var latitude_rose_grid_points = latitude_rose_grid_positions.length / 3;
for (var i = 1; i < latitude_rose_grid_points; i += 2) { 
    latitude_rose_grid_indices.push(0, i, 0, i+1);
};

//
// Sun Rays
//

var sun_rays = function() {
    var points = [];
    var x, y, z, rangle;
    var density = 36;
    var angle_distance = Math.PI * earth.radius / density;
    var angle_increment;
    var angle = 0;
    points.push(sun.pos.x, sun.pos.y, sun.pos.z);
    for (var radius = earth.radius; radius > 0; radius -= angle_distance) {
        angle_increment = 360 / ((Math.PI * radius) / angle_distance);
        for (var a = angle; a <= 180; a += angle_increment) {
            rangle = a * deg2rad;
            y = Math.sin(rangle) * radius;
            z = Math.cos(rangle) * radius;
            points.push(earth.pos.x,  y,  z);
            points.push(earth.pos.x, -y, -z);
        }
        angle = a % 180;
    }
    return points;
}


var sun_ray_positions = sun_rays();
var sun_ray_indices = [];
var sun_ray_points = sun_ray_positions.length / 3 - 1;
for (var i = 0; i < sun_ray_points; i++) { 
    sun_ray_indices.push(0, i);
};


//
// Initial lookAt: eye
//

var initial_eye_quat;
var initial_eye_mat4;
var initial_eye_vec3 = vec3.create();
var initial_eye = {};

function update_initial_eye(d) {
    if (d < (earth.radius * 1.5)) d = earth.radius * 1.5;
    distance = d;
    initial_eye_quat = quat4.axisAngleDegreesCreate(1, 0, 0, 0);
    initial_eye_mat4 = quat4.toMat4(initial_eye_quat);
    mat4.multiplyVec3(initial_eye_mat4, [0, 0,  distance], initial_eye_vec3);
    initial_eye =      { 
        x: initial_eye_vec3[0] + earth.pos.x,
        y: initial_eye_vec3[1] + earth.pos.y,
        z: initial_eye_vec3[2] + earth.pos.z
    };
};

update_initial_eye(distance);

SceneJS.createNode({
    type: "scene",
    id: "theScene",
    canvasId: "theCanvas",
    loggingElementId: "theLoggingDiv",

    nodes: [
    
        {
            type: "lookAt",
            id: "lookAt",
            eye:  initial_eye,
            look: earth.pos,
            up:   { x: 0.0, y: 1.0, z: 0.0 },

            nodes: [

                {
                    type: "camera",
                    id: "camera",
                    optics: {
                        type: "perspective",
                        fovy: 50.0,
                        aspect: 1.43,
                        near: 0.05,
                        far: milky_way_apparent_radius * 10,
                    },

                    nodes: [

                        // Milky-way with a stationary background sphere
                        {
                            type: "stationary",    
    
                            nodes: [
    
                                // Size of sky sphere
                                {
                                    type: "scale",
                                    x: milky_way_apparent_radius,
                                    y: milky_way_apparent_radius,
                                    z: milky_way_apparent_radius,
                                    nodes: [
    
                                        // Starry texture
                                        {
                                            type: "texture",
                                            layers: [
                                                {
                                                    uri: "images/milky_way_panorama_3000x1500.jpg",
                                                    wrapS: "clampToEdge",
                                                    wrapT: "clampToEdge",
                                                    applyTo:"baseColor",
                                                    blendMode:"multiply"
                                                }
                                            ],
                                            nodes: [
    
                                                // Material for texture to apply to
                                                {
                                                    type:           "material",
                                                    id:             "milky-way-material",
                                                    baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
                                                    specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                                    specular:       0.0,
                                                    shine:          0.0,
                                                    emit:           0.5,
    
                                                    nodes: [
    
                                                        // Tilt the milky way a little bit
                                                        {
                                                            type: "rotate",
                                                            z: 1,
                                                            angle: 45.0,
                                                            nodes: [
    
                                                                // Sphere geometry
                                                                {
                                                                    type: "sphere"
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
                        },

                        // Lights, one bright directional source for the Sun, two others much
                        // dimmer to give some illumination to the dark side of the Earth
                        {
                            type:                   "light",
                            id:                     "sun-light",
                            mode:                   "point",
                            pos:                    sun.pos,
                            color:                  { r: 3.0, g: 3.0, b: 3.0 },
                            diffuse:                true,
                            specular:               true,
                            constantAttenuation:    1.0,
                            quadraticAttenuation:   0.0,
                            linearAttenuation:      0.0
                        },

                        {
                            type: "light",
                            id:   "back-light1",
                            mode:                   "dir",
                            color:                  { r: dark_side_light, g: dark_side_light, b: dark_side_light },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 1.0, y: 0.0, z: -0.75 }
                        },
        
                        {
                            type: "light",
                            id:   "back-light2",
                            mode:                   "dir",
                            color:                  { r: dark_side_light, g: dark_side_light, b: dark_side_light },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 1.0, y: 0.0, z: 0.75 }
                        },

                        // Sun and related objects
                        {

                            type: "material",
                            id:             "sun-material",
                            baseColor:      { r: 1.0, g: 0.95, b: 0.8 },
                            specularColor:  { r: 1.0, g: 0.95, b: 0.8 },
                            specular:       2.0,
                            shine:          2.0,
                            emit:           1.0,

                            nodes: [

                                // Sun
                                {
                                    type: "translate",
                                    x: sun.pos.x,
                                    y: sun.pos.y,
                                    z: sun.pos.z,

                                    nodes: [
                                        {
                                            type: "scale",
                                            x: sun_diameter,
                                            y: sun_diameter,
                                            z: sun_diameter,

                                            nodes: [  { type: "sphere", slices: 60, rings: 60 } ]
                                        },
                                        
                                        // Sun Square Grid
                                        {
                                            type: "material",
                                            baseColor:      { r: 0.3, g: 0.7, b: 0.3 },
                                            specularColor:  { r: 0.3, g: 0.7, b: 0.3 },
                                            specular:       0.8,
                                            shine:          0.8,
                                            emit:           0.8,

                                            nodes: [

                                                {
                                                    type: "scale",
                                                    x: 1,
                                                    y: 1,
                                                    z: 1,

                                                    nodes: [

                                                        {

                                                            type: "selector",
                                                            id: "sun-grid-selector",
                                                            selection: [1],
                                                            nodes: [ 

                                                                // 0: off

                                                                {  },

                                                                // 1: on: square grid for Sun view

                                                                {
                                                                    nodes: [

                                                                        {
                                                                            type: "geometry",
                                                                            primitive: "lines",

                                                                            positions: sun_grid_positions,
                                                                            indices : sun_grid_indices
                                                                        },
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        
                                    ]
                                },
                                
                                // Sun-Earth line
                                {

                                    type: "selector",
                                    id: "sun-earth-line-selector",
                                    selection: [0],
                                    nodes: [ 

                                        // 0: off
                                        {  },

                                        // 1: on
                                        {
                                            type: "geometry",
                                            primitive: "lines",

                                            positions: [
                                                sun.pos.x, sun.pos.y, sun.pos.z,
                                                earth.pos.x, earth.pos.y, earth.pos.z 
                                            ],

                                            indices : [ 0, 1 ]

                                        }
                                    ]
                                },
                                
                                // Many Sun Rays
                                
                                {
                                    type: "node",

                                    flags: {
                                        transparent: true
                                    },

                                    nodes: [
                                        { 

                                            type: "material",
                                            baseColor:      { r: 1.0, g: 0.95, b: 0.8 },
                                            specularColor:  { r: 1.0, g: 0.95, b: 0.8 },
                                            specular:       2.0,
                                            shine:          2.0,
                                            emit:           1.0,
                                            alpha:          0.6,

                                            nodes: [
                                
                                                {
                                                    type: "selector",
                                                    id: "sun-rays-selector",
                                                    selection: [0],
                                                    nodes: [ 

                                                        // 0: off
                                                        {  },

                                                        // 1: on
                                                        {
                                                            type: "geometry",
                                                            primitive: "lines",

                                                            positions: sun_ray_positions,
                                                            indices :  sun_ray_indices
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                
                                // Sun-Earth Surface Line
                                {
                                    type: "selector",
                                    id: "sun-surface-line-selector",
                                    selection: [0],
                                    nodes: [ 

                                        // 0: off
                                        {  },

                                        // 1: on
                                        
                                        {
                                            type: "geometry",
                                            primitive: "lines",

                                            positions: [
                                                sun.pos.x, sun.pos.y, sun.pos.z,

                                                earth.pos.x, 
                                                earth.pos.y + Math.sin((surface.latitude - earth.tilt)  * deg2rad) * earth.radius, 
                                                earth.pos.z + Math.sin(-surface.longitude * deg2rad) * earth.radius 
                                            ],

                                            indices : [ 0, 1 ]
                                        }
                                    ]
                                }
                            ]
                        },

                        // Earth and other objects that are referenced from Earth's location.
                        {
                            type: "translate",
                            id: "earth-sub-graph",
                            x: earth.pos.x,
                            y: earth.pos.y,
                            z: earth.pos.z,

                            nodes: [
                            
                                {
                                    type: "scale",
                                    id: "earth-sub-graph-scale",
                                    x: 1,
                                    y: 1,
                                    z: 1,
                                
                                    nodes: [
                            
                                        {
                                            type: "node",
                                    
                                            nodes: [

                                                // Earth Square Grid
                                                {
                                                    type: "material",
                                                    baseColor:      { r: 0.3, g: 0.7, b: 0.3 },
                                                    specularColor:  { r: 0.3, g: 0.7, b: 0.3 },
                                                    specular:       0.8,
                                                    shine:          0.8,
                                                    emit:           0.8,

                                                    nodes: [

                                                        {
                                                            type: "scale",
                                                            x: 1,
                                                            y: 1,
                                                            z: 1,

                                                            nodes: [

                                                                {

                                                                    type: "selector",
                                                                    id: "earth-grid-selector",
                                                                    selection: [1],
                                                                    nodes: [ 

                                                                        // 0: off

                                                                        {  },

                                                                        // 1: on: square grid for Earth view

                                                                        {
                                                                            nodes: [

                                                                                {
                                                                                    type: "geometry",
                                                                                    primitive: "lines",

                                                                                    positions: earth_grid_positions,
                                                                                    indices : earth_grid_indices
                                                                                },

                                                                                // Latitude-like line in the ecliptic plane
                                                                                {
                                                                                    type: "disk",
                                                                                    radius: earth.radius + surface_line_width,
                                                                                    innerRadius: earth.radius,
                                                                                    height: surface_line_width,
                                                                                    rings: 128
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },

                                                // Earth Rose Grid
                                                {
                                                    type: "material",
                                                    baseColor:      { r: 0.9, g: 0.8, b: 0.1 },
                                                    specularColor:  { r: 0.9, g: 0.8, b: 0.1 },
                                                    specular:       1.0,
                                                    shine:          2.0,
                                                    emit:           1.0,

                                                    nodes: [

                                                        {
                                                            type: "scale",
                                                            x: 1,
                                                            y: 1,
                                                            z: 1,

                                                            nodes: [

                                                                {

                                                                    type: "selector",
                                                                    id: "earth-rose-grid-selector",
                                                                    selection: [0],
                                                                    nodes: [ 

                                                                        // 0: off

                                                                        {  },

                                                                        // 1: on: rose grid for Earth view

                                                                        {
                                                                            nodes: [

                                                                                {
                                                                                    type: "geometry",
                                                                                    primitive: "lines",

                                                                                    positions: earth_rose_grid_positions,
                                                                                    indices : earth_rose_grid_indices
                                                                                },

                                                                                // Latitude-like line in the ecliptic plane
                                                                                {
                                                                                    type: "disk",
                                                                                    radius: earth.radius + surface_line_width,
                                                                                    innerRadius: earth.radius,
                                                                                    height: surface_line_width,
                                                                                    rings: 128
                                                                                },

                                                                                {
                                                                                    type: "disk",
                                                                                    radius: earth_rose_scale,
                                                                                    innerRadius: earth_rose_scale - 0.001,
                                                                                    height: surface_line_width,
                                                                                    rings: 128
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                        
                                                // Longitude-like circle-line in the noon-midnight plane
                                                {
                                                    type: "node",

                                                    flags: {
                                                        transparent: true
                                                    },

                                                    nodes: [
                            
                                                        // Longitude-like circle-line in the noon-midnight plane
                                                        { 
                                                            type: "material",
                                                            baseColor:      { r: 0.6, g: 0.5, b: 0.02 },
                                                            specularColor:  { r: 0.6, g: 0.5, b: 0.02 },
                                                            specular:       1.0,
                                                            shine:          1.0,
                                                            emit:           0.5,
                                                            alpha:          0.6,

                                                            nodes: [
                            
                                                                {
                                                                    type: "selector",
                                                                    id: "sun-noon-midnight-selector",
                                                                    selection: [0],
                                                                    nodes: [ 

                                                                        // 0: off

                                                                        {  },

                                                                        // 1: on: sun noon-midnight indicator

                                                                        {
                                                                            type: "rotate", 
                                                                            x: 0.0,
                                                                            z: 0.0,
                                                                            y: 1.0,
                                                                            angle: 0,

                                                                            nodes: [

                                                                                {
                                                                                    type: "rotate", 
                                                                                    x: 1.0,
                                                                                    z: 0.0,
                                                                                    y: 0.0,
                                                                                    angle: 90,

                                                                                    nodes: [

                                                                                        {
                                                                                            type: "disk",
                                                                                            radius: earth.radius + surface_line_width * 2,
                                                                                            innerRadius: earth.radius + surface_line_width,
                                                                                            height: surface_line_width,
                                                                                            rings: 128
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        },

                                                        // Longitude-like circle-line in the dawn-dusk plane
                                                        { 
                                                            type: "material",
                                                            baseColor:      { r: 0.6, g: 0.02, b: 0.5 },
                                                            specularColor:  { r: 0.6, g: 0.02, b: 0.5 },
                                                            specular:       1.0,
                                                            shine:          1.0,
                                                            emit:           0.5,
                                                            alpha:          0.3,

                                                            nodes: [
                            
                                                                {
                                                                    type: "selector",
                                                                    id: "sun-rise-set-selector",
                                                                    selection: [0],
                                                                    nodes: [ 

                                                                        // 0: off

                                                                        {  },

                                                                        // 1: on: sun rise/set indicator

                                                                        {
                                                                            type: "rotate", 
                                                                            x: 0.0,
                                                                            z: 0.0,
                                                                            y: 1.0,
                                                                            angle: 90,

                                                                            nodes: [

                                                                                {
                                                                                    type: "rotate", 
                                                                                    x: 1.0,
                                                                                    z: 0.0,
                                                                                    y: 0.0,
                                                                                    angle: 90,

                                                                                    nodes: [

                                                                                        {
                                                                                            type: "disk",
                                                                                            radius: earth.radius + surface_line_width * 2,
                                                                                            innerRadius: earth.radius + surface_line_width,
                                                                                            height: surface_line_width,
                                                                                            rings: 128
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
                                                },

                                                // Everything under this node will be tilted 23.5 degrees
                                                {
                                                    type: "quaternion",
                                                    x: 0.0, y: 0.0, z: 1.0, 
                                                    angle: earth.tilt, 

                                                    nodes: [
                            
                                                        // Adjustable Latitude Line
                                                        { 
                                                            type: "material",
                                                            baseColor:      { r: 1.0, g: 0.02, b: 0.02 },
                                                            specularColor:  { r: 1.0, g: 0.02, b: 0.02 },
                                                            specular:       1.0,
                                                            shine:          1.0,
                                                            emit:           1.0,

                                                            nodes: [

                                                                // Latitude Line
                                                                {
                                                                    type: "selector",
                                                                    id: "latitude-line-selector",
                                                                    selection: [1],
                                                                    nodes: [ 

                                                                        // 0: off

                                                                        {  },

                                                                        {
                                                                            type: "translate",
                                                                            id: "latitude-translate",
                                                                            x: 0,
                                                                            y: earth.radius * Math.sin(surface.latitude * deg2rad),
                                                                            z: 0,

                                                                            nodes: [

                                                                                {
                                                                                    type: "scale", 
                                                                                    id: "latitude-scale",
                                                                                    x: Math.cos(surface.latitude * deg2rad),
                                                                                    z: Math.cos(surface.latitude * deg2rad),
                                                                                    y: 1.0,

                                                                                    nodes: [

                                                                                        {
                                                                                            type: "disk",
                                                                                            radius: earth.radius + surface_line_width,
                                                                                            innerRadius: earth.radius,
                                                                                            height: surface_line_width,
                                                                                            rings: 128
                                                                                        },
                                                    
                                                                                        {
                                                                                            type: "selector",
                                                                                            id: "lat-hour-markers-selector",
                                                                                            selection: [0],
                                                                                            nodes: [ 

                                                                                                // 0: off

                                                                                                {  },

                                                                                                // 1: on: latitude hour markers

                                                                                                {
                                                                                                     type: "geometry",
                                                                                                     primitive: "lines",

                                                                                                     positions: latitude_rose_grid_positions,
                                                                                                     indices : latitude_rose_grid_indices
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
                                                        },
                    
                                                        { 
                                                            type: "rotate", id: "rotation", angle: initial_earth_rotation, y: 1.0,
                            
                                                            nodes: [
                        
                                                                // Adjustable Longitude Line
                                                                {
                                                                    type: "selector",
                                                                    id: "longitude-line-selector",
                                                                    selection: [1],
                                                                    nodes: [ 

                                                                        // 0: off

                                                                        {  },

                                                                        { 
                                                                            type: "material",
                                                                            baseColor:      { r: 1.0, g: 0.02, b: 0.02 },
                                                                            specularColor:  { r: 1.0, g: 0.02, b: 0.02 },
                                                                            specular:       1.0,
                                                                            shine:          1.0,
                                                                            emit:           1.0,

                                                                            nodes: [

                                                                                // Longitude Line
                                                                                {
                                                                                    type: "rotate", 
                                                                                    x: 0.0,
                                                                                    z: 1.0,
                                                                                    y: 0.0,
                                                                                    angle: -90,

                                                                                    nodes: [

                                                                                        {
                                                                                            type: "rotate", 
                                                                                            id: "longitude-rotation",
                                                                                            x: 1.0,
                                                                                            z: 0.0,
                                                                                            y: 0.0,
                                                                                            angle: surface.longitude + 90,

                                                                                            nodes: [

                                                                                                {
                                                                                                    type: "disk",
                                                                                                    radius: earth.radius + surface_line_width,
                                                                                                    innerRadius: earth.radius,
                                                                                                    height: surface_line_width,
                                                                                                    rings: 128,
                                                                                                    sweep: 0.5,
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                },
                                                                
                                                                // Earth's atmosphere
                                                                {
                                                                    type: "selector",
                                                                    id: "earth-atmosphere-selector",
                                                                    selection: [0],
                                                                    nodes: [ 

                                                                        // 0: off

                                                                        {  },

                                                                        {
                                                                            type: "node",
                                                                            id:            "atmosphere-transparent",
                                                                            flags: {
                                                                                transparent: true
                                                                            },
                                                                        
                                                                            nodes: [

                                                                                {
                                                                                    type:          "material",
                                                                                    id:            "atmosphere-material",
                                                                                    baseColor:      { r: 0.0, g: 0.5, b: 1.0 },
                                                                                    specularColor:  { r: 0.0, g: 0.5, b: 1.0 },
                                                                                    specular:       1.0,
                                                                                    shine:          1.0,
                                                                                    alpha:          0.5,
                                                                                    emit:           0.0,

                                                                                    nodes: [

                                                                                        {
                                                                                            type: "scale", 
                                                                                            x: earth.radius * 1.1, 
                                                                                            y: earth.radius * 1.1, 
                                                                                            z: earth.radius * 1.1,

                                                                                            nodes: [

                                                                                                { 
                                                                                                    type: "sphere",
                                                                                                    slices: 256, rings: 128 
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                },

                                                                // Earth and it's texture layers
                                                                {
                                                                    type: "material",
                                                                    baseColor:      { r: 0.50, g: 0.50, b: 0.50 },
                                                                    specularColor:  { r: 0.15, g: 0.15, b: 0.15 },
                                                                    specular:       0.00,
                                                                    shine:          0.5,

                                                                    nodes: [

                                                                        {
                                                                            type: "scale", x: earth.radius, y: earth.radius, z: earth.radius,

                                                                            nodes: [
                                    
                                                                                {

                                                                                    id: "earth-terrain-texture",
                                                                                    type: "texture",
                                                                                    layers: [

                                                                                        { 
                                                                                           uri:"images/lat-long-grid-invert-units-1440x720-15.png",
                                                                                           blendMode: "add",
                                                                                        
                                                                                        },

                                                                                        { 
                                                                                            uri:"images/earth3.jpg",

                                                                                            minFilter: "linear",
                                                                                            magFilter: "linear",
                                                                                            wrapS: "repeat",
                                                                                            wrapT: "repeat",
                                                                                            isDepth: false,
                                                                                            depthMode:"luminance",
                                                                                            depthCompareMode: "compareRToTexture",
                                                                                            depthCompareFunc: "lequal",
                                                                                            flipY: false,
                                                                                            width: 1,
                                                                                            height: 1,
                                                                                            internalFormat:"lequal",
                                                                                            sourceFormat:"alpha",
                                                                                            sourceType: "unsignedByte",
                                                                                            applyTo:"baseColor",
                                                                                            blendMode: "multiply",

                                                                                            /* Texture rotation angle in degrees
                                                                                             */
                                                                                            rotate: 180.0,

                                                                                            /* Texture translation offset
                                                                                             */
                                                                                            translate : {
                                                                                                x: 0,
                                                                                                y: 0
                                                                                            },

                                                                                            /* Texture scale factors
                                                                                             */
                                                                                            scale : {
                                                                                                x: -1.0,
                                                                                                y: 1.0
                                                                                            }
                                                                                        }
                                                                                    ],
                                                    
                                                                                    nodes: [ 
                                                                                        { 
                                                                                            type: "sphere",
                                                                                            slices: 256, rings: 128 
                                                                                        }
                                                                                    ]
                                                                                },
                                                                        
                                                                        
                                                                                // Earth Surface Indicator
                                                                                {
                                                                                    type: "node",
                                                                                    flags: {
                                                                                        transparent: false
                                                                                    },

                                                                                    nodes: [

                                                                                        {
                                                                                            type: "quaternion",
                                                                                            x: 0.0, y: 0.0, z: 1.0, angle: 90.0,

                                                                                            nodes: [
                                                                                                {

                                                                                                    type: "quaternion",
                                                                                                    id: "earth-surface-location-longitude",
                                                                                                    x: -1.0, y: 0.0, z: 0.0, angle: surface.longitude,

                                                                                                    nodes: [

                                                                                                        {

                                                                                                            type: "quaternion",
                                                                                                            id: "earth-surface-location-latitude",
                                                                                                            x: 0.0, y: 0.0, z: -1.0, angle: surface.latitude,

                                                                                                            nodes: [

                                                                                                                {

                                                                                                                    type: "translate",
                                                                                                                    x: 0,
                                                                                                                    y: 1 + surface.min_height / 2,
                                                                                                                    z: 0,

                                                                                                                    nodes: [

                                                                                                                        { 
                                                                                                                            type: "material",
                                                                                                                            baseColor:      { r: 0.01, g: 0.2, b: 0.0 },
                                                                                                                            specularColor:  { r: 0.01, g: 0.2, b: 0.0 },

                                                                                                                            specular:       0.5,
                                                                                                                            shine:          0.001,

                                                                                                                            nodes: [

                                                                                                                                {
                                                                                                                                    type: "disk",
                                                                                                                                    radius: 200 * earth.km,
                                                                                                                                    height: surface.min_height / 2,
                                                                                                                                    rings: 48

                                                                                                                                    // type: "cube",
                                                                                                                                    // xSize: 100 * earth.km,
                                                                                                                                    // ySize: surface.min_height / 2,
                                                                                                                                    // zSize: 100 * earth.km

                                                                                                                                }
                                                                                                                            ]
                                                                                                                        },

                                                                                                                        { 
                                                                                                                            type: "material",
                                                                                                                            baseColor:      { r: 0.5, g: 0.5, b: 0.5 },
                                                                                                                            specularColor:  { r: 0.5, g: 0.5, b: 0.5 },

                                                                                                                            specular:       0.5,
                                                                                                                            shine:          0.001,

                                                                                                                            nodes: [

                                                                                                                                {

                                                                                                                                    type: "translate",
                                                                                                                                    // x: 0 + surface.min_height * 1,
                                                                                                                                    // y: 1 + surface.min_height + 2.5 * earth.km,
                                                                                                                                    // z: 0 + surface.min_height * 5,

                                                                                                                                    x: surface.meter * 0,
                                                                                                                                    y: surface.flagpole.height / 2,
                                                                                                                                    z: surface.meter * 0,

                                                                                                                                    nodes: [
                                                                                                                                        {
                                                                                                                                            type: "disk",
                                                                                                                                            radius: surface.flagpole.radius,
                                                                                                                                            height: surface.flagpole.height
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
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
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
                        }
                    ]
                }
            ]
        }
    ]
});

var scenejs_compilation = true;


SceneJS.setDebugConfigs({
    compilation : {
        enabled : scenejs_compilation
    }
});

var angle = SceneJS.withNode("rotation")
var scene = SceneJS.withNode("theScene")

var look_at = SceneJS.withNode("lookAt");
var camera = SceneJS.withNode("camera");

var latitude_translate = SceneJS.withNode("latitude-translate");
var latitude_scale     = SceneJS.withNode("latitude-scale");

var latitude_line_selector =  SceneJS.withNode("latitude-line-selector");
var longitude_line_selector = SceneJS.withNode("longitude-line-selector");

var longitude_rotation = SceneJS.withNode("longitude-rotation");

var earth_surface_location_longitude = SceneJS.withNode("earth-surface-location-longitude");
var earth_surface_location_latitude  = SceneJS.withNode("earth-surface-location-latitude");

function sampleRender() {
    scene.render();
};

var updateRate = 30;
var updateInterval = 1000/updateRate;
var nextAnimationTime = new Date().getTime(); + updateInterval;
var keepAnimating = true;

//
// Back Lighting Handler
//
var back_light = document.getElementById("back-light");
var back_light1 =  SceneJS.withNode("back-light1");
var back_light2 =  SceneJS.withNode("back-light2");

function backLightHandler() {
    var colors;
    if (back_light.checked) {
        colors = { r: 2.0, g: 2.0, b: 2.0 };
    } else {
        colors = { r: dark_side_light, g: dark_side_light, b: dark_side_light };
    };
    back_light1.set("color", colors);
    back_light2.set("color", colors);
};

back_light.onchange = backLightHandler;
backLightHandler();

//
// Earth Rotation Handler
//

var earth_rotation = document.getElementById("earth-rotation");

function earthRotationHandler() {
    if (earth_rotation.checked) {
        clear_solar_radiation_longitude_data();
    } else {
    };
};

earth_rotation.onchange = earthRotationHandler;

//
// Earth Square Grid Handler
//
var earth_grid = document.getElementById("earth-grid");
var earth_grid_selector =  SceneJS.withNode("earth-grid-selector");

function earthGridHandler() {
    if (earth_grid.checked) {
        earth_grid_selector.set("selection", [1]);
    } else {
        earth_grid_selector.set("selection", [0]);
    };
};

earth_grid.onchange = earthGridHandler;
earthGridHandler();

//
// Earth Rose Grid Handler
//
var earth_rose_grid = document.getElementById("earth-rose-grid");
var earth_rose_grid_selector =  SceneJS.withNode("earth-rose-grid-selector");

function earthRoseGridHandler() {
    if (earth_rose_grid.checked) {
        earth_rose_grid_selector.set("selection", [1]);
    } else {
        earth_rose_grid_selector.set("selection", [0]);
    };
};

earth_rose_grid.onchange = earthRoseGridHandler;
earthRoseGridHandler();

//
// Sun Square Grid Handler
//
var sun_grid = document.getElementById("sun-grid");
var sun_grid_selector =  SceneJS.withNode("sun-grid-selector");

function sunGridHandler() {
    if (sun_grid.checked) {
        sun_grid_selector.set("selection", [1]);
    } else {
        sun_grid_selector.set("selection", [0]);
    };
};

sun_grid.onchange = sunGridHandler;
sunGridHandler();

//
// Sun-Earth Line Handler
//
var sun_earth_line = document.getElementById("sun-earth-line");
var sun_earth_line_selector =  SceneJS.withNode("sun-earth-line-selector");

function sunEarthLineHandler() {
    if (sun_earth_line.checked) {
        sun_earth_line_selector.set("selection", [1]);
    } else {
        sun_earth_line_selector.set("selection", [0]);
    };
};

sun_earth_line.onchange = sunEarthLineHandler;
sunEarthLineHandler();

//
// Sun-Earth Surface Line Handler
//
// var sun_surface_line = document.getElementById("sun-surface-line");
// var sun_surface_line_selector =  SceneJS.withNode("sun-surface-line-selector");
// 
// function sunSurfaceLineHandler() {
//     if (sun_surface_line.checked) {
//         sun_surface_line_selector.set("selection", [1]);
//     } else {
//         sun_surface_line_selector.set("selection", [0]);
//     };
// };
// 
// sun_surface_line.onchange = sunSurfaceLineHandler;
// sunSurfaceLineHandler();
// 
//
// Sun rise/set surface indicator Handler
//
var sun_rise_set = document.getElementById("sun-rise-set");
var sun_rise_set_selector =  SceneJS.withNode("sun-rise-set-selector");

function sunRiseSetHandler() {
    if (sun_rise_set.checked) {
        sun_rise_set_selector.set("selection", [1]);
    } else {
        sun_rise_set_selector.set("selection", [0]);
    };
};

sun_rise_set.onchange = sunRiseSetHandler;
sunRiseSetHandler();

//
// Sun noon/midnight surface indicator Handler
//
var sun_noon_midnight = document.getElementById("sun-noon-midnight");
var sun_noon_midnight_selector =  SceneJS.withNode("sun-noon-midnight-selector");

function sunNoonMidnightHandler() {
    if (sun_noon_midnight.checked) {
        sun_noon_midnight_selector.set("selection", [1]);
    } else {
        sun_noon_midnight_selector.set("selection", [0]);
    };
};

sun_noon_midnight.onchange = sunNoonMidnightHandler;
sunNoonMidnightHandler();

//
// Latitude hour markers Handler
//
var lat_hour_markers = document.getElementById("lat-hour-markers");
var lat_hour_markers_selector =  SceneJS.withNode("lat-hour-markers-selector");

function latHourMarkersHandler() {
    if (lat_hour_markers.checked) {
        lat_hour_markers_selector.set("selection", [1]);
    } else {
        lat_hour_markers_selector.set("selection", [0]);
    };
};

lat_hour_markers.onchange = latHourMarkersHandler;
latHourMarkersHandler();

//
// Sun Rays Line Handler
//
var sun_rays = document.getElementById("sun-rays");
var sun_rays_selector =  SceneJS.withNode("sun-rays-selector");

function sunRaysHandler() {
    if (sun_rays.checked) {
        sun_rays_selector.set("selection", [1]);
    } else {
        sun_rays_selector.set("selection", [0]);
    };
};

sun_rays.onchange = sunRaysHandler;
sunRaysHandler();

//
// Managing the Earth and related objects graph ...
//

var earth_sub_graph = SceneJS.withNode("earth-sub-graph");
var earth_sub_graph_scale = SceneJS.withNode("earth-sub-graph-scale");

var sun_light                 = SceneJS.withNode("sun-light");
var sun_material              = SceneJS.withNode("sun-material");
var milky_way_material        = SceneJS.withNode("milky-way-material");

var earth_atmosphere_selector = SceneJS.withNode("earth-atmosphere-selector");
var atmosphere_material       = SceneJS.withNode("atmosphere-material");
var atmosphere_transparent    = SceneJS.withNode("atmosphere-transparent");

// sun-material ...
// baseColor:      { r: 1.0, g: 0.95, b: 0.8 },
// specularColor:  { r: 1.0, g: 0.95, b: 0.8 },
// specular:       2.0,
// shine:          2.0,
// emit:           1.0,

//
// Earth In Space View Setup
//
function setupEarthInSpace() {
    sun_light.set("color", { r: 3.0, g: 3.0, b: 3.0 });
    sun_material.set("baseColor", { r: 1.0, g: 0.95, b: 0.8 });
    sun_material.set("specularColor", { r: 1.0, g: 0.95, b: 0.8 });
    sun_material.set("specular", 2.0);
    sun_material.set("shine", 2.0);
    sun_material.set("emit", 2.0);

    milky_way_material.set("emit", 0.8);


    earth_atmosphere_selector.set("selection", [0]);
    earth.radius = earth_diameter / 2;
    // earth.km = km / earth.radius;
    // earth.meter = meter /earth.radius;
    earth_sub_graph_scale.set({ x: 1, y: 1, z: 1})
    // earth_sub_graph._targetNode._setDirty();
    var optics = camera.get("optics");
    optics.fovy = 50;
    optics.near = 0.10;
    camera.set("optics", optics);
    latitude_line_selector.set("selection",  [1]);
    longitude_line_selector.set("selection", [1]);

    look_at.set("up", { x: 0.0, y: 1.0, z: 0.0 });
};

//
// Earth in Space Handling
//
function updateEarthInSpaceLookAt() {
    // first handle yaw and pitch for our lookAt-arcball navigation around Earth
    // background: http://rainwarrior.thenoos.net/dragon/arcball.html
    var yaw_quat =  quat4.axisAngleDegreesCreate(0, 1, 0, yaw);
    var yaw_mat4 = quat4.toMat4(yaw_quat);

    if (pitch > max_pitch)  pitch =  max_pitch;
    if (pitch < -max_pitch) pitch = -max_pitch;

    var pitch_quat =  quat4.axisAngleDegreesCreate(yaw_mat4[0], yaw_mat4[1], yaw_mat4[2], pitch);
    var result_quat = quat4.create();
    quat4.multiply(pitch_quat, yaw_quat, result_quat);

    var neweye = vec3.create();
    quat4.multiplyVec3(result_quat, initial_eye_vec3, neweye);
    look_at.set("eye", { 
        x: neweye[0] + earth.pos.x, 
        y: neweye[1] + earth.pos.y, 
        z: neweye[2] + earth.pos.z 
    });
    
    // next handle a possible yaw rotation to look left or right of Earth in the ecliptic plane
    var rot_quat = quat4.axisAngleDegreesCreate(0, 1, 0, lookat_yaw); 

    var new_look = vec3.create();
    quat4.multiplyVec3(rot_quat, neweye, new_look);

    // mat4.multiplyVec3(rot_mat4, neweye, new_look);

    new_look[0] = (neweye[0] - new_look[0]) + earth.pos.x;
    new_look[1] = (neweye[1] - new_look[1]) + earth.pos.y;
    new_look[2] = (neweye[2] - new_look[2]) + earth.pos.z;
    look_at.set("look", { x: new_look[0], y: new_look[1], z: new_look[2] });
    debugLabel();
};

//
// Surface View Setup
//

var surface_eye_vec3 = [];
var new_surface_eye_vec3 = [];
var surface_dir_vec3 = [];
var surface_up_vec3 = [];
var surface_look_vec3 = [];
var new_surface_look_vec3 = [];
var surface_up_minus_90_vec3 = [];
var surface_cross_vec3 = [];
var flagpole_global = [];
var surface_eye_global = [];
var new_surface_eye_global = [];
var surface_look_global = [];
var new_surface_look_global = [];

var earth_tilt_quat = quat4.axisAngleDegreesCreate(0.0, 0.0, 1.0,  earth.tilt)
var earth_tilt_mat4 = quat4.toMat4(earth_tilt_quat);

function calculate_surface_cross(lat, lon) {
    if (lat == undefined) {
        var lat = surface.latitude;
        var lon = surface.longitude;
    };
    lat += 90;
    if (lat > 90 ) {
        lat -= surface.latitude * 2;
        lon = -lon;
    } else if (lat < -90) {
        lat -= surface.latitude * 2;
        lon = -lon;        
    };
    surface_up_minus_90_vec3 = lat_long_to_cartesian_corrected_for_tilt(lat, lon);
    vec3.cross(surface_up_vec3, surface_up_minus_90_vec3, surface_cross_vec3);
    return surface_cross_vec3;
};

function lat_long_to_cartesian(lat, lon, r) {
    r = r || 1;
    return [-r * Math.cos(lat * deg2rad) * Math.cos(lon * deg2rad),
             r * Math.sin(lat * deg2rad),
            -r * Math.cos(lat * deg2rad) * Math.sin(lon * deg2rad), 1]
}

function lat_long_to_cartesian_corrected_for_tilt(lat, lon, r) {
    r = r || 1;
    var lat_lon = lat_long_to_cartesian(lat, lon - earth.rotation, r);
    var v3 = vec3.create();
    quat4.multiplyVec3(earth_tilt_quat, lat_lon, v3);
    return v3;
};

function lat_long_to_global_cartesian(lat, lon, r) {
    r = r || 1;
    var lat_lon = lat_long_to_cartesian_corrected_for_tilt(lat, lon, r);
    // var v3 = vec3.create();

    var global_lat_lon = vec3.create();
    vec3.scale(lat_lon, earth.radius, global_lat_lon);
    vec3.add(global_lat_lon, [earth.pos.x, earth.pos.y, earth.pos.z] )

    return global_lat_lon;
};

function look_at_direction(unit_vec) {
    var far = [unit_vec[0] * milky_way_apparent_radius, 
        unit_vec[1] * milky_way_apparent_radius, 
        unit_vec[2] * milky_way_apparent_radius];
    look_at.set("look", { x: far[0], y: far[1], z: far[2] });
}

function calculateSurfaceEyeUpLook(eye_pos_v3) {
    if (eye_pos_v3 == undefined) {
        var eye_pos_v3 = [0, 0, 0];
    };
    
    // calculate unit vector from center of Earth to surface location
    surface_dir_vec3 = lat_long_to_cartesian_corrected_for_tilt(surface.latitude, surface.longitude);
    
    // generate an up axis direction vector for the lookAt (integrates tilt)
    surface_up_vec3 = vec3.create(surface_dir_vec3);

    flagpole_global = lat_long_to_global_cartesian(surface.latitude, surface.longitude, 1.002);
    x = (earth.radius + surface.min_height + surface.flagpole.height / 2) / earth.radius;

    // generate an appropriate offset from the flagpole using the cross-product of the
    // current surface_up with the surface_up vector rotated 90 degrees northward
    calculate_surface_cross();
    vec3.scale(surface_cross_vec3, surface.distance, surface_eye_vec3);    
    vec3.add(flagpole_global, surface_eye_vec3, surface_eye_global);

    surface_look_global = vec3.create(flagpole_global);
    
    var lookat = {
        eye: { x: surface_eye_global[0],  y: surface_eye_global[1],  z: surface_eye_global[2] },
        up: { x: surface_up_vec3[0],  y: surface_up_vec3[1],  z: surface_up_vec3[2] },
        look: { x: surface_look_global[0],  y: surface_look_global[1],  z: surface_look_global[2] },
    }
    return lookat;
};


function setupSurfaceView() {
    sun_material.set("specular", 1.0);
    sun_material.set("shine", 1.0);
    sun_material.set("emit", 10.0);

    atmosphere_material.set("specular", 1.0);
    atmosphere_material.set("shine", 1.0);
    atmosphere_material.set("emit", 0.9);

    earth_atmosphere_selector.set("selection", [1]);
    earth.radius = earth_diameter * 100 / 2;
    // earth.km = km / earth.radius;
    // earth.meter = meter / earth.radius;
    earth_sub_graph_scale.set({ 
        x: surface_earth_scale_factor, 
        y: surface_earth_scale_factor, 
        z: surface_earth_scale_factor
    });
    // earth_sub_graph._targetNode._setDirty();
    var optics = camera.get("optics");
    optics.fovy = 50;
    camera.set("optics", optics);
    latitude_line_selector.set("selection",  [0]);
    longitude_line_selector.set("selection", [0]);

    // update the scenegraph lookAt
    var lookat = calculateSurfaceEyeUpLook();
    look_at.set("eye", lookat.eye);
    look_at.set("up", lookat.up);
    look_at.set("look",  lookat.look)

};


//
// inputs: 
//    surface.yaw, surface.pitch
//    surface.lookat_yaw, surface.lookat_pitch


function updateSurfaceViewLookAt() {
    var result_quat = quat4.create();
    
    // update the scenegraph lookAt
    var lookat = calculateSurfaceEyeUpLook();
    // look_at.set("eye", lookat.eye);
    look_at.set("up", lookat.up);
    look_at.set("look",  lookat.look)

    vec3.scale(surface_cross_vec3, surface.distance, surface_eye_vec3);    

    if (surface.pitch > max_pitch)  surface.pitch =  max_pitch;
    if (surface.pitch < -max_pitch) surface.pitch = -max_pitch;

    var yaw_quat = quat4.axisAngleDegreesCreate(surface_up_vec3[0], surface_up_vec3[1], surface_up_vec3[2], surface.yaw);
    var pitch_quat = quat4.axisAngleDegreesCreate(surface_up_minus_90_vec3[0], surface_up_minus_90_vec3[1], surface_up_minus_90_vec3[2], surface.pitch);
    quat4.multiply(pitch_quat, yaw_quat, result_quat);
    
    quat4.multiplyVec3(result_quat, surface_eye_vec3, new_surface_eye_vec3);
    vec3.add(surface_look_global, new_surface_eye_vec3, new_surface_eye_global);
    look_at.set("eye", { x: new_surface_eye_global[0],  y: new_surface_eye_global[1],  z: new_surface_eye_global[2] });

    // var lookat_yaw_quat = quat4.axisAngleDegreesCreate(surface_up_vec3[0], surface_up_vec3[1], surface_up_vec3[2], surface.yaw);
    // var lookat_pitch_quat = quat4.axisAngleDegreesCreate(surface_up_minus_90_vec3[0], surface_up_minus_90_vec3[1], surface_up_minus_90_vec3[2], surface.pitch);
    // var surface_look_global = [];
    // var new_surface_look_global = [];

    // next handle a possible yaw rotation to to look left or right of the flagpole in the surface POV
    var rot_quat = quat4.axisAngleDegreesCreate(surface_up_vec3[0], surface_up_vec3[1], surface_up_vec3[2], surface.lookat_yaw); 
    
    quat4.multiplyVec3(rot_quat, new_surface_eye_vec3, new_surface_look_vec3);
    vec3.subtract(surface_look_global, new_surface_look_vec3, new_surface_look_global);
    look_at.set("look", { x: new_surface_look_global[0],  y: new_surface_look_global[1],  z: new_surface_look_global[2] });
    debugLabel();
};

function updateLookAt() {
    if (surface_view.checked) {
        updateSurfaceViewLookAt();
    } else {
        updateEarthInSpaceLookAt();
    }
};

//
// Earth In Space/Surface View Handler
//
var surface_view = document.getElementById("surface-view");

function setupViewHandler() {
    if (surface_view.checked) {
        setupSurfaceView();
        updateLookAt();
        document.onkeydown = handleArrowKeysSurfaceView;
    } else {
        setupEarthInSpace();
        updateLookAt();
        document.onkeydown = handleArrowKeysEarthInSpace;
    };
};

surface_view.onchange = setupViewHandler;
setupViewHandler();


//
// General Mouse handling
//

var lastX;
var lastY;
var dragging = false;

var the_canvas = document.getElementById("theCanvas");

function setLatitude(lat) {
    surface.latitude = lat;
    latitude_translate.set({ x: 0, y: earth.radius * Math.sin(surface.latitude * deg2rad), z: 0 });
    var scale = Math.cos(surface.latitude * deg2rad);
    latitude_scale.set({ x: scale, y: 1.0, z: scale });
    earth_surface_location_latitude.set("rotation", { x: 0.0, y: 0.0, z: -1.0, angle : lat });
    $("#latitude-slider").data().rangeinput.setValue(surface.latitude);
    infoLabel();
};

function incrementLatitude() {
    clear_solar_radiation_latitude_data();
    surface.latitude += 1;
    if (surface.latitude > 90) surface.latitude = 90;
    setLatitude(surface.latitude);
};

function decrementLatitude() {
    clear_solar_radiation_latitude_data();
    surface.latitude -= 1;
    if (surface.latitude < -90) surface.latitude = -90;
    setLatitude(surface.latitude);
};

function setLongitude(lon) {
    surface.longitude = lon;
    longitude_rotation.set({ angle: surface.longitude + 90 });
    earth_surface_location_longitude.set("rotation", { x: -1.0, y: 0.0, z: 0.0, angle : lon });
    infoLabel();
};

function incrementLongitude() {
    clear_solar_radiation_longitude_data();
    surface.longitude += 1;
    if (surface.longitude > 180) surface.longitude -= 360;
    setLongitude(surface.longitude);
};

function decrementLongitude() {
    clear_solar_radiation_longitude_data();
    surface.longitude -= 1;
    if (surface.longitude < -179) surface.longitude += 360;
    setLongitude(surface.longitude);
};


function mouseDown(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    dragging = true;
}

function mouseUp() {
    dragging = false;
}

function mouseMove(event) {
    if (dragging) {
        
        if (surface_view.checked) {
            surface.yaw   += (event.clientX - lastX) * -0.2;
            surface.pitch += (event.clientY - lastY) * -0.2;
        } else {
            yaw   += (event.clientX - lastX) * -0.2;
            pitch += (event.clientY - lastY) * -0.2;
        };
        lastX = event.clientX;
        lastY = event.clientY;

        updateLookAt();

        if (!keepAnimating) requestAnimFrame(sampleAnimate);
    }
}

the_canvas.addEventListener('mousedown', mouseDown, true);
the_canvas.addEventListener('mousemove', mouseMove, true);
the_canvas.addEventListener('mouseup', mouseUp, true);

function handleArrowKeysEarthInSpace(evt) {
    var distanceIncrementFactor = 40;
    evt = (evt) ? evt : ((window.event) ? event : null); 
    if (evt) {
        switch (evt.keyCode) {
            case 37:                                    // left arrow
                if (evt.ctrlKey) {
                    // evt.preventDefault();
                } else if (evt.metaKey) {
                    evt.preventDefault();
                } else if (evt.altKey) {
                    incrementLongitude(); 
                    evt.preventDefault();
                } else if (evt.shiftKey) {
                    lookat_yaw += 2; 
                    updateLookAt();
                    evt.preventDefault();
                } else {
                    yaw -= 2; 
                    updateLookAt();
                    evt.preventDefault();
                }
                break;

            case 38:                                    // up arrow
                if (evt.ctrlKey) {
                    var increment = distance / distanceIncrementFactor;
                    update_initial_eye(distance - increment);
                    updateLookAt();
                    evt.preventDefault();
                } else if (evt.altKey) {
                    incrementLatitude(); 
                    evt.preventDefault();
                } else if (evt.metaKey) {
                    evt.preventDefault();
                } else if (evt.shiftKey) {
                    evt.preventDefault();
                } else {
                    pitch -= 2; 
                    updateLookAt();
                    evt.preventDefault();
                }
                break;

            case 39:                                    // right arrow
                if (evt.ctrlKey) {
                    // evt.preventDefault();
                } else if (evt.metaKey) {
                    evt.preventDefault();
                } else if (evt.altKey) {
                    decrementLongitude(); 
                    evt.preventDefault();
                } else if (evt.shiftKey) {
                    lookat_yaw -= 2; 
                    updateLookAt();
                    evt.preventDefault();
                } else {
                    yaw += 2; 
                    updateLookAt();
                    evt.preventDefault();
                }
                break;

            case 40:                                    // down arrow
                if (evt.ctrlKey) {
                    var increment = distance / distanceIncrementFactor;
                    update_initial_eye(distance + increment);
                    updateLookAt();
                    evt.preventDefault();
                } else if (evt.altKey) {
                    decrementLatitude(); 
                    evt.preventDefault();
                } else if (evt.metaKey) {
                    evt.preventDefault();
                } else if (evt.shiftKey) {
                    evt.preventDefault();
                } else {
                    pitch += 2; 
                    updateLookAt();
                    evt.preventDefault();
                }
                break;
        };
    };
};

function update_surface_height(d) {
    if (d >= surface.min_height) {
        surface.height = d;
    }
}

function decrementSurfaceDistance() {
    if (surface.distance > 2) {
        surface.distance -= 0.1;
    };
};

function incrementSurfaceDistance() {
    if (surface.distance < 10) {
        surface.distance += 0.1;
    };    
};

function handleArrowKeysSurfaceView(evt) {
    var distanceIncrementFactor = 30;
    evt = (evt) ? evt : ((window.event) ? event : null); 
    if (evt) {
        switch (evt.keyCode) {
            case 37:                                    // left arrow
                if (evt.ctrlKey) {                      // control left-arrow
                    evt.preventDefault();
                } else if (evt.metaKey) {               // option left-arrow
                    evt.preventDefault();
                } else if (evt.altKey) {                // alt left-arrow
                    incrementLongitude(); 
                    evt.preventDefault();
                } else if (evt.shiftKey) {              // shift left-arrow 
                    surface.lookat_yaw += 2;
                    evt.preventDefault();
                } else {
                    surface.yaw -= 2;                   // left arrow
                    evt.preventDefault();
                }
                updateSurfaceViewLookAt();
                break;

            case 38:                                    // up arrow
                if (evt.ctrlKey) {
                    decrementSurfaceDistance();
                    evt.preventDefault();
                } else if (evt.altKey) {
                    incrementLatitude(); 
                    evt.preventDefault();
                } else if (evt.metaKey) {
                    evt.preventDefault();
                } else if (evt.shiftKey) {
                    surface.lookat_pitch += 2; 
                    evt.preventDefault();
                } else {
                    surface.pitch += 2; 
                    evt.preventDefault();
                }
                updateSurfaceViewLookAt();
                break;

            case 39:                                    // right arrow
                if (evt.ctrlKey) {
                    evt.preventDefault();
                } else if (evt.metaKey) {
                    evt.preventDefault();
                } else if (evt.altKey) {
                    decrementLongitude(); 
                    evt.preventDefault();
                } else if (evt.shiftKey) {
                    surface.lookat_yaw -= 2; 
                    evt.preventDefault();
                } else {
                    surface.yaw += 2; 
                    evt.preventDefault();
                }
                updateSurfaceViewLookAt();
                break;

            case 40:                                    // down arrow
                if (evt.ctrlKey) {
                    incrementSurfaceDistance();
                    evt.preventDefault();
                } else if (evt.altKey) {
                    decrementLatitude(); 
                    evt.preventDefault();
                } else if (evt.metaKey) {
                    evt.preventDefault();
                } else if (evt.shiftKey) {
                    surface.lookat_pitch -= 2; 
                    evt.preventDefault();
                } else {
                    surface.pitch -= 2; 
                    evt.preventDefault();
                }
                updateSurfaceViewLookAt();
                break;
        };
    };
};

//
// UI Overlaying WebGL canvas
//

function elementGetX(el) {
    var xpos = 0;
    while( el != null ) {
        xpos += el.offsetLeft;
        el = el.offsetParent;
    }
    return xpos;
};

function elementGetY(el) {
    var ypos = 0;
    while( el != null ) {
        ypos += el.offsetTop;
        el = el.offsetParent;
    }
    return ypos;
};

var container = document.getElementById("container");

//
// Latitude Slider
//

$(":range").rangeinput();

var latitude_slider_div     = document.getElementById("latitude-slider-div");
var latitude_slider         = document.getElementById("latitude-slider");

function latitudeSlider() {
    var canvas_properties = the_canvas.getBoundingClientRect();
    var container_properties = container.getBoundingClientRect();
    latitude_slider_div.style.top = canvas_properties.top + window.pageYOffset + canvas_properties.height - latitude_slider_div.offsetHeight - 200 + "px"
    latitude_slider_div.style.left = canvas_properties.right - elementGetX(document.getElementById("content")) - latitude_slider_div.offsetWidth + "px";
};

latitudeSlider();

function latitudeSliderHandler() {
    surface.latitude = Number(latitude_slider.value);
    clear_solar_radiation_latitude_data();
    setLatitude(surface.latitude);
    updateLookAt();
};

latitude_slider.onchange = latitudeSliderHandler;

//
// DebugLabel
//

var debug_label   = document.getElementById("debug-label");
var debug_view   = document.getElementById("debug-view");
var debug_content = document.getElementById("debug-content");

function debugLabel() {
    if (debug_label) {
        if (debug_view.checked) {
            debug_label.style.opacity = 0.6;
            debug_content.style.display = null;
        } else {
            debug_content.style.display = "none";
            debug_label.style.opacity = null;
        };

        var eye = look_at.get("eye");
        var look = look_at.get("look");
        var up = look_at.get("up");
        
        var atmos_trans = atmosphere_transparent.get();
        
        var flags = atmosphere_transparent.get('flags');

        var sun_mat =  sun_material.get();
        var atmos = atmosphere_material.get();

        var solar_alt = solar_altitude(surface.latitude, surface.longitude);
        var solar_rad = solarRadiation(solar_alt);
        
        var labelStr = "";

        labelStr += "<b>Sun</b><br />";
        labelStr += sprintf("Pos:  x: %4.1f y: %4.1f z: %4.1f<br>", sun.pos.x, sun.pos.y, sun.pos.z);
        labelStr += sprintf("baseColor:  r: %1.3f g: %1.3f b: %1.3f<br>", sun_mat.baseColor.r, sun_mat.baseColor.g, sun_mat.baseColor.b);
        labelStr += sprintf("Specular: %1.2f, Shine: %1.2f, Emit: %1.2f<br>", sun_mat.specular, sun_mat.shine, sun_mat.emit);
        labelStr += sprintf("Radius: %4.1f, Milkyway emit: %1.2f<br>", sun.radius, milky_way_material.get().emit);
        labelStr += "<br><hr><br>";

        labelStr += "<b>Earth</b><br />";
        labelStr += sprintf("Pos:  x: %4.1f y: %4.1f z: %4.1f<br>", earth.pos.x, earth.pos.y, earth.pos.z);
        labelStr += sprintf("Pitch: %4.1f, Yaw:  %4.1f<br>", pitch, yaw);
        labelStr += sprintf("Rot:  %4.1f<br>", earth.rotation);
        labelStr += sprintf("Angle: %4.1f, Radius: %4.1f<br>", angle.get().angle, earth.radius);
        labelStr += "<br><hr><br>";

        labelStr += "<b>Surface</b><br />";
        labelStr += sprintf("Pitch: %4.1f, Yaw:  %4.1f<br>", surface.pitch, surface.yaw);
        labelStr += sprintf("LookAt Rot:  %4.1f, Pitch: %3.1f<br>", surface.lookat_yaw, surface.lookat_pitch);
        labelStr += sprintf("Distance-surface: %3.3f (x radius)<br>", surface.height);
        labelStr += sprintf("Solar alt: %2.1f, rad: %3.0f  W/m2<br>", solar_alt, solar_rad);
        labelStr += sprintf("earth.km: %1.6f<br>", earth.km);
        labelStr += "<br><hr><br>";

        labelStr += "<b>Atmosphere</b><br />";
        labelStr += sprintf("baseColor:  r: %1.3f g: %1.3f b: %1.3f<br>", atmos.baseColor.r, atmos.baseColor.g, atmos.baseColor.b);
        labelStr += "Transparency: " + flags.transparent + sprintf(", Alpha: %1.2f<br>", atmos.alpha);
        labelStr += sprintf("Specular: %1.2f, Shine: %1.2f, Emit: %1.2f<br>", atmos.specular, atmos.shine, atmos.emit, atmos.alpha);
        labelStr += "<br><hr><br>";

        labelStr += "<b>LookAt</b><br />";
        labelStr += sprintf("Eye:  x: %4.1f y: %4.1f z: %4.1f<br>", eye.x, eye.y, eye.z);
        labelStr += sprintf("Look:  x: %4.1f y: %4.1f z: %4.1f<br>", look.x, look.y, look.z);
        labelStr += sprintf("Up  x: %1.3f y: %1.3f z: %1.3f<br>", up.x, up.y, up.z);
        labelStr += sprintf("Rot: %4.1f, Distance-Earth: %4.1f<br>", lookat_yaw, distance);
        labelStr += "<br><hr><br>";

        labelStr += "SceneJS Compilation: " + scenejs_compilation + '<br>';
        labelStr += "<br><hr><br>";

        debug_content.innerHTML = labelStr;

        var canvas_properties = the_canvas.getBoundingClientRect();
        var container_properties = container.getBoundingClientRect();
        debug_label.style.top = canvas_properties.top + window.pageYOffset + canvas_properties.height - debug_label.offsetHeight - 10 + "px"
        debug_label.style.left = canvas_properties.right - elementGetX(document.getElementById("content")) - debug_label.offsetWidth + "px";
    };
};

debug_view.onchange = debugLabel;

//
// InfoLabel
//

function earthRotationToDecimalTime(rot) {
    return ((rot % 360 * 2 / 30) + 12) % 24;
};

function earthRotationToTimeStr24(rot) {
    var time = earthRotationToDecimalTime(rot);
    var time_hours = Math.floor(time);
    var time_min = Math.floor((time % 1) * 60)
    return time_hours + ":" + sprintf("%02f", time_min);
};

function earthRotationToTimeStr12(rot) {
    var time = earthRotationToDecimalTime(rot);
    var time_hours = Math.floor(time);
    if (time_hours >= 12) {
        am_pm = "PM";
    } else {
        am_pm = "AM";
    }
    if (time_hours == 0) {
        time_hours = 12;
    } else if (time_hours > 12) {
        time_hours -= 12;
    };
    var time_min = Math.floor((time % 1) * 60)
    return sprintf("%2f:%02f", time_hours, time_min) + " " + am_pm;
};

var time_24h =  document.getElementById("time-24h");

function earthRotationToTimeStr(rot) {
    if (time_24h.checked) {
        return earthRotationToTimeStr24(rot)
    } else {
        return earthRotationToTimeStr12(rot)
    }
};

var info_label   = document.getElementById("info-label");
var info_view   = document.getElementById("info-view");
var info_content = document.getElementById("info-content");

function solar_altitude(lat, lon) {
    var center   = lat_long_to_cartesian(earth.tilt, earth.rotation);
    var loc      = lat_long_to_cartesian(lat, lon);
    var xd = center[0] - loc[0];
    var yd = center[1] - loc[1];
    var zd = center[2] - loc[2];
    var d1 = Math.sqrt(xd * xd + yd * yd + zd * zd);
    var sqrt2 = Math.sqrt(2);
    var alt = (Math.asin(d1 / 2) * 2 * rad2deg - 90) * -1;
    return alt
};

function solar_flux() {
    return earth_ephemerides_solar_constant_by_day_number(earth.day_number);
};

function simpleSolarRadiation(alt) {
    var result = solar_flux() * Math.sin(alt * deg2rad) * SOLAR_FACTOR_AM1;
    return result < 0 ? 0 : result; 
};

var use_airmass = document.getElementById("use-airmass");

function useAirMNassHandler() {
    clear_solar_radiation_latitude_data();
    clear_solar_radiation_longitude_data();
};

use_airmass.onchange = useAirMNassHandler;

// http://en.wikipedia.org/wiki/Airmass#CITEREFPickering2002
// function air_mass(alt) {
//     var h;
//     if (alt !== undefined) {
//         h = alt;
//     } else {
//         h = solar_altitude(surface.latitude, longitude, earth.rotation);
//     };
//     return 1/(Math.sin((h + 244/(165 + Math.pow(47 * h, 1.1))) * deg2rad))
// };



var use_diffuse_correction   = document.getElementById("use-diffuse-correction");

function useDiffuseCorrectionxHandler() {
    clear_solar_radiation_latitude_data();
    clear_solar_radiation_longitude_data();
};

use_diffuse_correction.onchange = useDiffuseCorrectionxHandler;

var use_horizontal_flux   = document.getElementById("use-horizontal-flux");

function useHorizontalFluxHandler() {
    clear_solar_radiation_latitude_data();
    clear_solar_radiation_longitude_data();
};

use_horizontal_flux.onchange = useHorizontalFluxHandler;

function spectralSolarRadiation(alt) {
    var radiation, normalized, flags;
    if (use_horizontal_flux.checked) {
        radiation = totalHorizontalDirectInsolation(earth.day_number, alt);
    } else {
        radiation = totalDirectInsolation(earth.day_number, alt);
    };
    if (use_diffuse_correction.checked) {
        radiation.total = radiation.total * DIFFUSE_CORRECTION_FACTOR;
        radiation.red   = radiation.red   * DIFFUSE_CORRECTION_FACTOR;
        radiation.green = radiation.green * DIFFUSE_CORRECTION_FACTOR;
        radiation.blue  = radiation.blue  * DIFFUSE_CORRECTION_FACTOR;
    }
    if (surface_view.checked) {
        normalized = {
            r: radiation.red   / 45,
            g: radiation.green / 45,
            b: radiation.blue  / 45
        };
        sun_light.set("color", normalized);
        sun_material.set("baseColor", normalized);
        sun_material.set("specularColor", normalized);
    };
    return radiation;
};

function solarRadiation(alt) {
    var radiation, rad, flags;
    if (surface_view.checked) {
        flags = atmosphere_transparent.get('flags');
    };
    if (alt > 0) {
        if (surface_view.checked) {
            flags.transparent = true;
        };
        if (use_airmass.checked) {
            radiation = spectralSolarRadiation(alt);
            if (surface_view.checked) {
                // atmosphere_material.set("alpha", 0.8);
                var alpha = (1 - (1/Math.exp(radiation.total/2))) * 0.5;
                if (alpha > 0.5) alpha = 0.5;
                atmosphere_material.set("alpha", alpha);
                atmosphere_material.set("emit", alpha);
                milky_way_material.set("emit", (alpha - 0.5) * -0.5);                
            };
            
            rad = radiation.total;
        } else {
            if (surface_view.checked) {
                atmosphere_material.set("alpha", 0);
            };
            if (use_horizontal_flux.checked) {
                rad = simpleSolarRadiation(alt);
            } else {
                rad = simpleSolarRadiation(90);
            };
        };
    } else {
        if (surface_view.checked) {
            flags.transparent = true;
            atmosphere_material.set("alpha", 0);
            milky_way_material.set("emit", 0.8);
        };
        rad = 0;
    };
    if (surface_view.checked) {
        atmosphere_transparent.set('flags', flags);
    };
    return rad
};

function infoLabel() {
    if (info_label) {
        if (info_view.checked) {
            info_label.style.opacity = 0.8;
            info_content.style.display = null;
        } else {
            info_content.style.display = "none";
            info_label.style.opacity = null;
        };

        var altitude = Math.acos(Math.cos((surface.latitude - earth.tilt)  * deg2rad) * Math.cos((earth.rotation - surface.longitude) * deg2rad)) * rad2deg;

        earth.pos.y + Math.sin((surface.latitude - earth.tilt)  * deg2rad) * earth.radius, 
        earth.pos.z + Math.sin(-surface.longitude * deg2rad) * earth.radius 
        
        var solar_alt = solar_altitude(surface.latitude, surface.longitude);
        var solar_rad = solarRadiation(solar_alt);

        var labelStr = "";
        labelStr += "Date: " + date_by_day_number[earth.day_number] + ", ";
        // labelStr += sprintf("Sol. Constant:  %4.1f W/m2", solar_flux()) + ", ";
        labelStr += sprintf("Lat: %4.1f, Long:  %4.1f", surface.latitude, surface.longitude) + ", ";
        labelStr += "Time: " + earthRotationToTimeStr(earth.rotation - surface.longitude) + ", ";
        labelStr += sprintf("Solar Altitude: %2.1f&deg;", solar_alt) + ", ";
        labelStr += sprintf("Solar Radiation: %2.1f  W/m2", solar_rad);

        info_content.innerHTML = labelStr;

        // positioning the label ...
        var canvas_properties = the_canvas.getBoundingClientRect();
        var container_properties = container.getBoundingClientRect();
        // bottom
        // info_label.style.top = canvas_properties.top + window.pageYOffset + canvas_properties.height - info_label.offsetHeight - 24 + "px";
        info_label.style.top = canvas_properties.top + window.pageYOffset + 5 + "px";
        info_label.style.left = elementGetX(the_canvas) - elementGetX(document.getElementById("content")) + 15 + "px";
    };
};

info_view.onchange = infoLabel;

//
// ControlsLabel
//

var controls_label = document.getElementById("controls-label");

function controlsLabel() {
    if (controls_label) {
        var canvas_properties = the_canvas.getBoundingClientRect();
        var container_properties = container.getBoundingClientRect();
        controls_label.style.top = canvas_properties.top + window.pageYOffset + 45 + "px";
        controls_label.style.left = elementGetX(the_canvas) - elementGetX(document.getElementById("content")) + 15 + "px";
    };
};

//
// Info Graph
//
var info_graph   = document.getElementById("info-graph");
var graph_view   = document.getElementById("graph-view");

var graph_width = 150;
var graph_height = 120;

//
// Graph Dom Elements ...
//
var solar_altitude_graph = document.getElementById("solar-altitude-graph");
var solar_radiation_latitude_graph = document.getElementById("solar-radiation-latitude-graph");
var solar_radiation_longitude_graph = document.getElementById("solar-radiation-longitude-graph");

var altitude_graph_canvas = document.getElementById("altitude-graph-canvas");
var radiation_lat_graph_canvas = document.getElementById("radiation-lat-graph-canvas");
var radiation_lon_graph_canvas = document.getElementById("radiation-lon-graph-canvas");

function infoGraph() {
    if (info_graph) {
        if (graph_view.checked) {
            info_graph.style.opacity = 1.0;
        } else {
            info_graph.style.opacity = null;
        };

        updateSolarAltitudeGraph();
        updateSolarRadiationLatitudeGraph();
        updateSolarRadiationLongitudeGraph();

        // positioning the graph container ...
        var canvas_properties = the_canvas.getBoundingClientRect();
        var container_properties = container.getBoundingClientRect();
        // info_graph.style.top = canvas_properties.top + window.pageYOffset + 5 + "px";
        info_graph.style.top = canvas_properties.top + window.pageYOffset + canvas_properties.height - info_graph.offsetHeight - 10 + "px"
        info_graph.style.left = elementGetX(the_canvas) - elementGetX(document.getElementById("content")) + 15 + "px";
    };
};

graph_view.onchange = infoGraph;

//
// Solar Altitude Graph Handler
//

function drawSolarAltitudeGraph() {
    var alt_ctx = altitude_graph_canvas.getContext('2d');
    alt_ctx.clearRect(0,0,graph_width,graph_height);
    
    var graph_base = graph_height - 15;
    var graph_y_range = graph_base - 20;

    var radius = graph_y_range - 20;
    var indicator_radius = graph_y_range - 10;

    alt_ctx.lineWidth = 2;
    alt_ctx.strokeStyle = "rgba(0,128,0, 1.0)";
    alt_ctx.beginPath();
    alt_ctx.arc(0, graph_base, radius, -Math.PI / 2, 0, false);
    alt_ctx.stroke();

    var solar_alt = solar_altitude(surface.latitude, surface.longitude);
    if (solar_alt >= 0) {
        alt_ctx.lineWidth = 3;
        var x = Math.cos(solar_alt * deg2rad) * indicator_radius;
        var y = Math.sin(solar_alt * deg2rad) * -indicator_radius + graph_base;
        alt_ctx.strokeStyle = "rgba(255,255,0, 1.0)";
        alt_ctx.beginPath();
        alt_ctx.moveTo(0, graph_base);
        alt_ctx.lineTo(x, y);
        alt_ctx.stroke();
    };

    alt_ctx.lineWidth = 2;
    alt_ctx.strokeStyle = "rgba(0,255,0, 1.0)";
    alt_ctx.beginPath();
    alt_ctx.moveTo(radius + 1, graph_base + 1);
    alt_ctx.lineTo(1, graph_base + 1);
    alt_ctx.lineTo(1, graph_base - radius);
    // alt_ctx.closePath();
    alt_ctx.stroke();

    alt_ctx.font = "bold 12px sans-serif";
    alt_ctx.fillStyle = "rgb(255,255,255)";
    alt_ctx.fillText(sprintf("Lat: %3.0f ", surface.latitude) + ", Time: " + earthRotationToTimeStr(earth.rotation - surface.longitude), 0, 12);
    alt_ctx.fillText(sprintf("Solar Altitude: %2.0f degrees", solar_alt), 0, 26);
};

function updateSolarAltitudeGraph() {
    if (solar_altitude_graph.checked) {
        altitude_graph_canvas.width = graph_width;
        altitude_graph_canvas.height = graph_height;
        drawSolarAltitudeGraph();
    } else {
        altitude_graph_canvas.width = 1;
        altitude_graph_canvas.height = 1;
        altitude_graph_canvas.style.display = null;
    };
};

function solarAltitudeGraphHandler() {
    updateSolarAltitudeGraph();
    if (solar_altitude_graph.checked) {
        graph_view.checked = true;
    } else {
        if (solar_radiation_latitude_graph.checked == false) {
            graph_view.checked = false;
        };
    };
    infoGraph();
};

solar_altitude_graph.onchange = solarAltitudeGraphHandler;
solarAltitudeGraphHandler();

//
// Solar Radiation Latitude Graph Handler
//
var solar_radiation_latitude_data = new Array(240);

function clear_solar_radiation_latitude_data() {
    for (var i= 0; i < solar_radiation_latitude_data.length; i++) {
        solar_radiation_latitude_data[i] = 0;
    };
};

clear_solar_radiation_latitude_data();

function total_solar_radiation_latitude_data() {
    var total = 0;
    for (var i= 0; i < solar_radiation_latitude_data.length; i++) {
        total += solar_radiation_latitude_data[i] / 10;
    };
    return total;
};

function drawSolarRadiationLatitudeGraph() {
    var solar_alt = solar_altitude(surface.latitude, surface.longitude);
    var solar_rad = solarRadiation(solar_alt);
    var time = earthRotationToDecimalTime(earth.rotation - surface.longitude);
    var index = Math.round(time * 10);
    solar_radiation_latitude_data[index] = solar_rad;
    
    var rad_lat_ctx = radiation_lat_graph_canvas.getContext('2d');
    rad_lat_ctx.clearRect(0,0,graph_width,graph_height);

    var data_length = solar_radiation_latitude_data.length;
    var graph_base = graph_height - 15;
    var graph_y_range = graph_base - 30;
    
    var x_factor = graph_width / data_length;
    var y_factor = graph_y_range / SOLAR_CONSTANT;

    // data
    rad_lat_ctx.lineWidth = 2;
    var x0, y0, x1, y1;
    for (var x = 0; x < data_length; x++) {
        x0 = x * x_factor;
        y0 = graph_base;
        y1 = solar_radiation_latitude_data[x] * -y_factor + graph_height - 15;
        if (x == index) {
            rad_lat_ctx.strokeStyle = "rgba(255,0,0, 1.0)"; 
        } else {
            rad_lat_ctx.strokeStyle = "rgba(255,255,0, 1.0)";
        };
        
        rad_lat_ctx.beginPath();
        rad_lat_ctx.moveTo(x0, y0);
        rad_lat_ctx.lineTo(x0, y1);
        rad_lat_ctx.stroke();
    }

    // grid lines
    var x_tic_increment = graph_width / 12;

    rad_lat_ctx.beginPath();
    rad_lat_ctx.lineWidth = 1;
    rad_lat_ctx.strokeStyle = "rgba(200, 200, 200, 0.5)";
    var y_grid_value, y_grid_px;
    for (y_grid_value = 250; y_grid_value <= 1000; y_grid_value += 250) {
        y_grid_px = y_grid_value * -y_factor + graph_height - 15;
        rad_lat_ctx.moveTo(0, y_grid_px);
        rad_lat_ctx.lineTo(graph_width, y_grid_px);
    };
    y_grid_px = 1000 * -y_factor + graph_height - (15 + 2);
    for (x = x_tic_increment * 2; x <= graph_width; x += x_tic_increment * 2) {
        rad_lat_ctx.moveTo(x, graph_base);
        rad_lat_ctx.lineTo(x, y_grid_px);
    };
    rad_lat_ctx.stroke();

    // X axis
    rad_lat_ctx.lineWidth = 2;
    rad_lat_ctx.strokeStyle = "rgba(0,255,0, 1.0)";
    rad_lat_ctx.beginPath();
    rad_lat_ctx.moveTo(0, graph_base);
    rad_lat_ctx.lineTo(graph_width, graph_base);

    for (x = x_tic_increment; x < graph_width; x += x_tic_increment) {
        rad_lat_ctx.moveTo(x, graph_base);
        rad_lat_ctx.lineTo(x, graph_base + 3);
    };
    rad_lat_ctx.moveTo(1, graph_base);
    rad_lat_ctx.lineTo(1, graph_base + 5);
    rad_lat_ctx.moveTo(graph_width / 2, graph_base);
    rad_lat_ctx.lineTo(graph_width / 2, graph_base + 5);
    rad_lat_ctx.moveTo(graph_width - 1, graph_base);
    rad_lat_ctx.lineTo(graph_width - 1, graph_base + 5);
    rad_lat_ctx.stroke();

    // Y axis
    rad_lat_ctx.lineWidth = 2;
    rad_lat_ctx.strokeStyle = "rgba(0,255,0, 1.0)";
    rad_lat_ctx.beginPath();
    rad_lat_ctx.moveTo(1, graph_base);
    rad_lat_ctx.lineTo(1, 1000 * -y_factor + graph_height - (15 + 6));
    rad_lat_ctx.stroke();
    for (y_grid_value = 250; y_grid_value <= 1000; y_grid_value += 250) {
        y_grid_px = y_grid_value * -y_factor + graph_height - 15;
        rad_lat_ctx.moveTo(0, y_grid_px);
        rad_lat_ctx.lineTo(4, y_grid_px);
    };
    rad_lat_ctx.stroke();

    rad_lat_ctx.font = "bold 12px sans-serif";
    rad_lat_ctx.fillStyle = "rgb(255,255,255)";
    rad_lat_ctx.fillText(sprintf("Lat: %3.0f ", surface.latitude) + ", Time: " + earthRotationToTimeStr(earth.rotation - surface.longitude), 4, 12);
    rad_lat_ctx.fillText(sprintf("Solar Rad: %3.0f  W/m2", solar_rad), 4, 26);
    rad_lat_ctx.fillText(sprintf("total: %3.1f kWh/m2", total_solar_radiation_latitude_data() / 1000), 4, 40);
    rad_lat_ctx.fillText("noon", graph_width / 2 - 14, graph_height);
};

function updateSolarRadiationLatitudeGraph() {
    if (solar_radiation_latitude_graph.checked) {
        radiation_lat_graph_canvas.width = graph_width;
        radiation_lat_graph_canvas.height = graph_height;
        drawSolarRadiationLatitudeGraph();
    } else {
        radiation_lat_graph_canvas.width = 1;
        radiation_lat_graph_canvas.height =1;
        radiation_lat_graph_canvas.style.display = null;
    };
};

function SolarRadiationLatitudeGraphHandler() {
    updateSolarRadiationLatitudeGraph();
    if (solar_radiation_latitude_graph.checked) {
        graph_view.checked = true;
    } else {
        solar_radiation_latitude_graph.style.display = null;
        if (solar_altitude_graph.checked == false && solar_radiation_longitude_graph.checked == false) {
            graph_view.checked = false;
        };
    };
    infoGraph();
};

solar_radiation_latitude_graph.onchange = SolarRadiationLatitudeGraphHandler;
SolarRadiationLatitudeGraphHandler();

//
// Solar Radiation Longitude Graph Handler
//
var solar_radiation_longitude_data = new Array(180);
var solar_radiation_longitude_data_new = true;

var solar_radiation_longitude_old_data = new Array(180);

var solar_radiation_longitude_data_cleared_count = 0;
var multiple_solar_radiation_longitude_data = false;
var significant_old_solar_radiation_longitude_data = false;

function clear_solar_radiation_longitude_data() {
    var i;
    if (solar_radiation_longitude_data_new) {
        if (solar_radiation_longitude_data_cleared_count && multiple_solar_radiation_longitude_data) {
            for (i= 0; i < solar_radiation_longitude_data.length; i++) {
                solar_radiation_longitude_old_data[i] =  solar_radiation_longitude_data[i];
            };
            significant_old_solar_radiation_longitude_data = true;
        };
        for (i= 0; i < solar_radiation_longitude_data.length; i++) {
            solar_radiation_longitude_data[i] = 0;
        };
        solar_radiation_longitude_data_new = false;
        multiple_solar_radiation_longitude_data = false;
        solar_radiation_longitude_data_cleared_count++;
    }
};

clear_solar_radiation_longitude_data();

function drawSolarRadiationLongitudeGraph() {
    var solar_alt = solar_altitude(surface.latitude, surface.longitude);
    var solar_rad = solarRadiation(solar_alt);
    var time = earthRotationToDecimalTime(earth.rotation - surface.longitude);
    var index = Math.round(surface.latitude + 90);
    solar_radiation_longitude_data[index] = solar_rad;
    if (solar_radiation_longitude_data_new) {
        multiple_solar_radiation_longitude_data = true;
    } else {
        solar_radiation_longitude_data_new = true;
    };
    
    var rad_lon_ctx = radiation_lon_graph_canvas.getContext('2d');
    rad_lon_ctx.clearRect(0,0,graph_width,graph_height);

    var data_length = solar_radiation_longitude_data.length;
    var graph_base = graph_height - 15;
    var graph_y_range = graph_base - 30;
    
    var x_factor = graph_width / data_length;
    var y_factor = graph_y_range / SOLAR_CONSTANT;

    if (significant_old_solar_radiation_longitude_data) {
        rad_lon_ctx.lineWidth = 1;
        rad_lon_ctx.beginPath();
        rad_lon_ctx.strokeStyle = "rgba(255,255,0, 0.5)";
        for (x = 0; x < data_length; x++) {
            x0 = x * x_factor;
            y0 = graph_base;
            y1 = solar_radiation_longitude_old_data[x] * -y_factor + graph_height - 15;
            rad_lon_ctx.moveTo(x0, y1 - 1);
            rad_lon_ctx.lineTo(x0, y1 + 1);
        };
        rad_lon_ctx.stroke();
        rad_lon_ctx.closePath();
    };

    rad_lon_ctx.lineWidth = 2;
    var x, x0, y0, x1, y1;
    for (x = 0; x < data_length; x++) {
        x0 = x * x_factor;
        y0 = graph_base;
        y1 = solar_radiation_longitude_data[x] * -y_factor + graph_height - 15;
        if (x == index) {
            rad_lon_ctx.beginPath();
            rad_lon_ctx.strokeStyle = "rgba(255,0,0, 1.0)";
            rad_lon_ctx.moveTo(x0, y0);
            rad_lon_ctx.lineTo(x0, y1);
            rad_lon_ctx.stroke();
        } else {
            rad_lon_ctx.beginPath();
            rad_lon_ctx.strokeStyle = "rgba(255,255,0, 1.0)";
            rad_lon_ctx.moveTo(x0, y1 - 1);
            rad_lon_ctx.lineTo(x0, y1 + 1);
            rad_lon_ctx.stroke();
        };
    };

    // grid lines
    var x_tic_increment = graph_width / 12;

    rad_lon_ctx.beginPath();
    rad_lon_ctx.lineWidth = 1;
    rad_lon_ctx.strokeStyle = "rgba(200, 200, 200, 0.5)";
    var y_grid_value, y_grid_px;
    for (y_grid_value = 250; y_grid_value <= 1000; y_grid_value += 250) {
        y_grid_px = y_grid_value * -y_factor + graph_height - 15;
        rad_lon_ctx.moveTo(0, y_grid_px);
        rad_lon_ctx.lineTo(graph_width, y_grid_px);
    };
    y_grid_px = 1000 * -y_factor + graph_height - (15 + 2);
    for (x = x_tic_increment * 2; x <= graph_width; x += x_tic_increment * 2) {
        rad_lon_ctx.moveTo(x, graph_base);
        rad_lon_ctx.lineTo(x, y_grid_px);
    };
    rad_lon_ctx.stroke();
    
    // X axis
    rad_lon_ctx.lineWidth = 2;
    rad_lon_ctx.beginPath();
    rad_lon_ctx.strokeStyle = "rgba(0,255,0, 1.0)";
    rad_lon_ctx.moveTo(0, graph_base);
    rad_lon_ctx.lineTo(graph_width, graph_base);
    var x_tic_increment = graph_width / 12;
    for (x = x_tic_increment; x < graph_width; x += x_tic_increment) {
        rad_lon_ctx.moveTo(x, graph_base);
        rad_lon_ctx.lineTo(x, graph_base + 3);
    };
    rad_lon_ctx.moveTo(1, graph_base);
    rad_lon_ctx.lineTo(1, graph_base + 5);
    rad_lon_ctx.moveTo(graph_width / 2, graph_base);
    rad_lon_ctx.lineTo(graph_width / 2, graph_base + 5);
    rad_lon_ctx.moveTo(graph_width - 1, graph_base);
    rad_lon_ctx.lineTo(graph_width - 1, graph_base + 5);
    rad_lon_ctx.stroke();

    // Y axis
    rad_lon_ctx.lineWidth = 2;
    rad_lon_ctx.strokeStyle = "rgba(0,255,0, 1.0)";
    rad_lon_ctx.beginPath();
    rad_lon_ctx.moveTo(1, graph_base);
    rad_lon_ctx.lineTo(1, 1000 * -y_factor + graph_height - (15 + 6));
    rad_lon_ctx.stroke();
    for (y_grid_value = 250; y_grid_value <= 1000; y_grid_value += 250) {
        y_grid_px = y_grid_value * -y_factor + graph_height - 15;
        rad_lon_ctx.moveTo(0, y_grid_px);
        rad_lon_ctx.lineTo(4, y_grid_px);
    };
    rad_lon_ctx.stroke();
    

    rad_lon_ctx.font = "bold 12px sans-serif";
    rad_lon_ctx.fillStyle = "rgb(255,255,255)";
    rad_lon_ctx.fillText(sprintf("Lat: %3.0f ", surface.latitude) + ", Time: " + earthRotationToTimeStr(earth.rotation - surface.longitude), 0, 12);
    rad_lon_ctx.fillText(sprintf("Solar Rad: %3.0f  W/m2", solar_rad), 0, 26);
    rad_lon_ctx.fillText("equator", graph_width / 2 - 18, graph_height);
};

function updateSolarRadiationLongitudeGraph() {
    if (solar_radiation_longitude_graph.checked) {
        radiation_lon_graph_canvas.width = graph_width;
        radiation_lon_graph_canvas.height = graph_height;
        drawSolarRadiationLongitudeGraph();
    } else {
        radiation_lon_graph_canvas.width = 1;
        radiation_lon_graph_canvas.height = 1;
        radiation_lon_graph_canvas.style.display = null;
    };
};

function SolarRadiationLongitudeGraphHandler() {
    updateSolarRadiationLongitudeGraph();
    if (solar_radiation_longitude_graph.checked) {
        graph_view.checked = true;
    } else {
        solar_radiation_longitude_graph.style.display = null;
        if (solar_altitude_graph.checked == false && solar_radiation_latitude_graph.checked == false) {
            graph_view.checked = false;
        };
    };
    infoGraph();
};

solar_radiation_longitude_graph.onchange = SolarRadiationLongitudeGraphHandler;
SolarRadiationLongitudeGraphHandler();


//
// Animation
//

function sampleAnimate(t) {
    sampleTime = new Date().getTime();
    if (sampleTime > nextAnimationTime) {
        nextAnimationTime = nextAnimationTime + updateInterval;
        if (sampleTime > nextAnimationTime) nextAnimationTime = sampleTime + updateInterval;
        if (earth_rotation.checked) {
            angle.set("angle", earth.rotation += 0.25);
            clear_solar_radiation_longitude_data();
        };
        updateLookAt();
        sampleRender();
        if (debug_view.checked) debugLabel();
        infoLabel();
        infoGraph();
    }
};

SceneJS.bind("error", function() {
    keepAnimating = false;
});

SceneJS.bind("reset", function() {
    keepAnimating = false;
});

var displayed = false;

SceneJS.bind("canvas-activated", function() {
    if (!displayed) {
        displayed = true;
        setLongitude(surface.longitude);
        debugLabel();
        controlsLabel();
        infoLabel();
        infoGraph();
    }
});

//
// Startup
//

scene.start({
    idleFunc: function() {
        sampleAnimate();
    }
});

