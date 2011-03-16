
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
    radius: earth_diameter / 2,
    tilt: 23.45,
    day_number: initial_day_number,
    rotation: initial_earth_rotation,
    km: km / (earth_diameter / 2),
    meter: meter / (earth_diameter / 2)
};

var dark_side_light = 0.25;
var max_pitch = 85;

var distance = earth.radius * 3;

var surface_line_width = earth.radius / 200;

// San Francisco: 38, 122

var latitude  = 0;
var longitude = -90;

var yaw      = -10;
var pitch    = -10;
var rotation = 0;

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
var initial_eye_vec4;
var initial_eye;

function update_initial_eye(d) {
    if (d < (earth.radius * 1.5)) d = earth.radius * 1.5;
    distance = d;
    initial_eye_quat = SceneJS._math_angleAxisQuaternion(1, 0, 0, 0);
    initial_eye_mat4 = SceneJS._math_newMat4FromQuaternion(initial_eye_quat);
    initial_eye_vec4 = SceneJS._math_mulMat4v4(initial_eye_mat4, [0, 0,  distance, 1]);
    initial_eye =      { 
        x: initial_eye_vec4[0] + earth.pos.x,
        y: initial_eye_vec4[1] + earth.pos.y,
        z: initial_eye_vec4[2] + earth.pos.z
    };
}

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
                        near: 0.10,
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
                                                    type: "material",
                                                    baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
                                                    specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                                    specular:       0.0,
                                                    shine:          0.0,
                                                    emit:           1.0,
    
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
                            type: "light",
                            mode:                   "point",
                            pos:                    sun.pos,
                            color:                  { r: 3.0, g: 3.0, b: 3.0 },
                            diffuse:                true,
                            specular:               true,
                            constantAttenuation: 1.0,
                            quadraticAttenuation: 0.0,
                            linearAttenuation: 0.0
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
                                        }
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
                                
                                // Sun Rays
                                
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
                                                earth.pos.y + Math.sin((latitude - earth.tilt)  * deg2rad) * earth.radius, 
                                                earth.pos.z + Math.sin(-longitude * deg2rad) * earth.radius 
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
                            x: earth.pos.x,
                            y: earth.pos.y,
                            z: earth.pos.z,

                            nodes: [
                            
                                {
                                    type: "boundingBox",

                                    xmin: -earth.radius * 10,
                                    ymin: -earth.radius * 10,
                                    zmin: -earth.radius * 10,
                                    xmax:  earth.radius * 10,
                                    ymax:  earth.radius * 10,
                                    zmax:  earth.radius * 10,

                                    // level-of-detail selection with this boundingBox
                                    // two representations at different sizes:
                                    levels: [
                                        1,    // level 1
                                        200     // level 2
                                    ],

                                    nodes:[

                                        // level 1 - a dot
                                        {
                                            type: "material",
                                            baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
                                            specularColor:  { r: 1.0, g: 1.0, b: 1.0 },
                                            specular:       1.0,
                                            shine:          2.0,

                                            nodes: [

                                                {
                                                    type: "geometry",
                                                    primitive: "lines",

                                                    positions: [0, 0, 0, 0, 0, 0],
                                                    indices :  [0, 1]
                                                }
                                            ]
                                        },
                                        
                                        // level 2, everything else
                                        
                                        {
                                            type: "node",
                                            
                                            nodes: [

                                                // Square Grid
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

                                                // Rose Grid
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
                                                    x: 0.0, y: 0.0, z: 1.0, angle: earth.tilt, 
        
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
                                                                            y: earth.radius * Math.sin(latitude * deg2rad),
                                                                            z: 0,

                                                                            nodes: [

                                                                                {
                                                                                    type: "scale", 
                                                                                    id: "latitude-scale",
                                                                                    x: Math.cos(latitude * deg2rad),
                                                                                    z: Math.cos(latitude * deg2rad),
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

                                                                                                // 1: on: sun rlatitude hour markers

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
                                                                                            angle: longitude + 90,

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

                                                                                    id: "earth-terrain-texture3",
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
                                                                                        { type: "sphere" }
                                                                                    ]
                                                                                },
                                                                                
                                                                                
                                                                                {
                                                                                    type: "node",
                                                                                    flags: {
                                                                                        transparent: true
                                                                                    },

                                                                                    nodes: [

                                                                                        { 
                                                                                            type: "material",
                                                                                            baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
                                                                                            specularColor:  { r: 1.0, g: 1.0, b: 1.0 },
                                                                                            specular:       10,
                                                                                            shine:          0.1,
                                                                                            alpha:          0.4,

                                                                                            nodes: [

                                                                                                {
                                                                                                    type: "quaternion",
                                                                                                    x: 0.0, y: 0.0, z: 1.0, angle: 90.0,

                                                                                                    nodes: [
                                                                                                        {

                                                                                                            type: "quaternion",
                                                                                                            id: "earth-surface-location-longitude",
                                                                                                            x: -1.0, y: 0.0, z: 0.0, angle: longitude,

                                                                                                            nodes: [
                                                                                                                {

                                                                                                                    type: "quaternion",
                                                                                                                    id: "earth-surface-location-latitude",
                                                                                                                    x: 0.0, y: 0.0, z: -1.0, angle: latitude,

                                                                                                                    nodes: [
                                                                                                                        {

                                                                                                                            type: "translate",
                                                                                                                            x: 0,
                                                                                                                            y: 1 + earth.km,
                                                                                                                            z: 0,

                                                                                                                            nodes: [
                                                                                                                                {
                                                                                                                                    type: "disk",
                                                                                                                                    radius: 100 * earth.km,
                                                                                                                                    height: 10 * earth.km,
                                                                                                                                    rings: 48
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

SceneJS.setDebugConfigs({
    compilation : {
        enabled : false
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

var earth_rotation = document.getElementById("earth-rotation");

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
// Surface View Handler
//

function lat_long_to_cartesian(lat, lon, r) {
    r = r || 1;
    return [r * Math.cos(lat * deg2rad) * Math.cos(lon * deg2rad),
            r * Math.sin(lat * deg2rad),
            r * Math.cos(lat * deg2rad) * Math.sin(lon * deg2rad)]
}

function lat_long_to_global_cartesian(lat, lon, r) {
    r = r || 1;
    var lat_lon = lat_long_to_cartesian(lat, lon + earth.rotation, r);
    var quat = SceneJS._math_angleAxisQuaternion(0, 0, 1, earth.tilt);
    var mat4 = SceneJS._math_newMat4FromQuaternion(quat);
    var vec4 = SceneJS._math_mulMat4v4(mat4, [lat_lon[0], lat_lon[1],  lat_lon[2], 1]);
    var global_lat_lon = [
        vec4[0] * -earth.radius + earth.pos.x,
        vec4[1] * -earth.radius + earth.pos.y,
        vec4[2] * earth.radius + earth.pos.z];
    return global_lat_lon;
}

function look_at_direction(unit_vec) {
    var far = [unit_vec[0] * milky_way_apparent_radius, 
        unit_vec[1] * milky_way_apparent_radius, 
        unit_vec[2] * milky_way_apparent_radius];
    look_at.set("look", { x: far[0], y: far[1], z: far[2] });
}

function surface() {
    var dir = lat_long_to_cartesian(latitude, longitude);
    var loc = lat_long_to_global_cartesian(latitude, longitude, 1 + earth.km);
    look_at.set("eye", { x: loc[0],  y: -loc[1],  z: loc[2] });
    look_at_direction([sun.pos.x, sun.pos.y, sun.pos.z]);
    look_at.set("up", { x: -dir[0],  y: dir[1],  z: dir[2] });
    var optics = camera.get("optics");
    optics.fovy = 70;
    // optics.near = 0.01;
    camera.set("optics", optics);
    latitude_line_selector.set("selection",  [0]);
    longitude_line_selector.set("selection", [0]);
};

function earth_in_space() {
    var optics = camera.get("optics");
    optics.fovy = 50;
    optics.near = 0.10;
    camera.set("optics", optics);
    look_at.set("up", { x: 0.0, y: 1.0, z: 0.0 });
    updateLookAt();
    latitude_line_selector.set("selection",  [1]);
    longitude_line_selector.set("selection", [1]);
};

var surface_view = document.getElementById("surface-view");

function surfaceViewHandler() {
    if (surface_view.checked) {
        surface();
    } else {
        earth_in_space();
    };
};

surface_view.onchange = surfaceViewHandler;
surfaceViewHandler();

//
// Animation
//

function sampleAnimate(t) {
    sampleTime = new Date().getTime();
    if (keepAnimating) requestAnimFrame(sampleAnimate);
    if (sampleTime > nextAnimationTime) {
        nextAnimationTime = nextAnimationTime + updateInterval;
        if (sampleTime > nextAnimationTime) nextAnimationTime = sampleTime + updateInterval;
        if (earth_rotation.checked) {
            angle.set("angle", earth.rotation += 0.25);
        }
        sampleRender();
        if (debug_view.checked) debugLabel();
        infoLabel();
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
        setLongitude(longitude);
        debugLabel();
        controlsLabel();
        infoLabel();
        updateLookAt();
    }
});

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();

requestAnimFrame(sampleAnimate);

//
// Mouse handling
//

var lastX;
var lastY;
var dragging = false;

var the_canvas = document.getElementById("theCanvas");

function mouseDown(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    dragging = true;
}

function mouseUp() {
    dragging = false;
}

function updateLookAt() {
    var yaw_quat =  SceneJS._math_angleAxisQuaternion(0, 1, 0, yaw);
    var yaw_mat4 = SceneJS._math_newMat4FromQuaternion(yaw_quat);
    if (pitch > max_pitch)  pitch =  max_pitch;
    if (pitch < -max_pitch) pitch = -max_pitch;
    var pitch_quat =  SceneJS._math_angleAxisQuaternion(yaw_mat4[0], yaw_mat4[1], yaw_mat4[2], pitch);
    var result_quat = SceneJS._math_mulQuaternions(pitch_quat, yaw_quat)
    var result_mat4 = SceneJS._math_newMat4FromQuaternion(result_quat);
    var neweye = SceneJS._math_mulMat4v4(result_mat4, initial_eye_vec4);
    look_at.set("eye", { 
        x: neweye[0] + earth.pos.x, 
        y: neweye[1] + earth.pos.y, 
        z: neweye[2] + earth.pos.z 
    });
    var rot_quat = SceneJS._math_angleAxisQuaternion(0, 1, 0, rotation); 
    var rot_mat4 = SceneJS._math_newMat4FromQuaternion(rot_quat);
    var new_look = SceneJS._math_mulMat4v4(rot_mat4, neweye);
    new_look[0] = (neweye[0] - new_look[0]) + earth.pos.x;
    new_look[1] = (neweye[1] - new_look[1]) + earth.pos.y;
    new_look[2] = (neweye[2] - new_look[2]) + earth.pos.z;
    look_at.set("look", { x: new_look[0], y: new_look[1], z: new_look[2] });
    debugLabel();
};


function setLatitude(lat) {
    latitude = lat;
    latitude_translate.set({ x: 0, y: earth.radius * Math.sin(latitude * deg2rad), z: 0 });
    var scale = Math.cos(latitude * deg2rad);
    latitude_scale.set({ x: scale, y: 1.0, z: scale });
    earth_surface_location_latitude.set("rotation", { x: 0.0, y: 0.0, z: -1.0, angle : lat });
    
    infoLabel();
};

function incrementLatitude() {
    latitude += 1;
    if (latitude > 90) latitude = 90;
    setLatitude(latitude);
};

function decrementLatitude() {
    latitude -= 1;
    if (latitude < -90) latitude = -90;
    setLatitude(latitude);
};

function setLongitude(lon) {
    longitude = lon;
    longitude_rotation.set({ angle: longitude + 90 });
    earth_surface_location_longitude.set("rotation", { x: -1.0, y: 0.0, z: 0.0, angle : lon });
    infoLabel();
};

function incrementLongitude() {
    longitude += 1;
    if (longitude > 180) longitude -= 360;
    setLongitude(longitude);
};

function decrementLongitude() {
    longitude -= 1;
    if (longitude < -179) longitude += 360;
    setLongitude(longitude);
};

function mouseMove(event) {
    if (dragging) {
        
        yaw   += (event.clientX - lastX) * -0.2;
        pitch += (event.clientY - lastY) * -0.2;
        lastX = event.clientX;
        lastY = event.clientY;

        updateLookAt();

        if (!keepAnimating) requestAnimFrame(sampleAnimate);
    }
}

the_canvas.addEventListener('mousedown', mouseDown, true);
the_canvas.addEventListener('mousemove', mouseMove, true);
the_canvas.addEventListener('mouseup', mouseUp, true);

function handleArrowKeys(evt) {
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
                    rotation += 2; 
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
                    rotation -= 2; 
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

document.onkeydown = handleArrowKeys;

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
// DebugLabel
//

var debug_label   = document.getElementById("debug-label");
var debug_view   = document.getElementById("debug-view");
var debug_content = document.getElementById("debug-content");

function debugLabel() {
    if (debug_label) {
        if (debug_view.checked) {
            debug_label.style.opacity = 0.8;
            debug_content.style.display = null;
        } else {
            debug_content.style.display = "none";
            debug_label.style.opacity = null;
        };

        var labelStr = "";
        labelStr += sprintf("Pitch: %4.1f, Yaw:  %4.1f<br>", pitch, yaw);
        labelStr += sprintf("Rot:  %4.1f, Distance: %4.1f<br>", rotation, distance);
        var eye = look_at.get("eye");
        labelStr += sprintf("Eye:  x: %4.1f y: %4.1f z: %4.1f<br>", eye.x, eye.y, eye.z);
        var look = look_at.get("look");
        labelStr += sprintf("Look:  x: %4.1f y: %4.1f z: %4.1f<br>", look.x, look.y, look.z);
        var up = look_at.get("up");
        labelStr += sprintf("Up  x: %4.1f y: %4.1f z: %4.1f<br>", up.x, up.y, up.z);

        labelStr += sprintf("Angle: %4.1f, Radius: %4.1f<br>", angle.get().angle, earth.radius);
        
        debug_content.innerHTML = labelStr;

        var canvas_properties = the_canvas.getBoundingClientRect();
        var container_properties = container.getBoundingClientRect();
        debug_label.style.top = canvas_properties.top + window.pageYOffset + canvas_properties.height - debug_label.offsetHeight - 24 + "px"
        debug_label.style.left = canvas_properties.right - elementGetX(document.getElementById("content")) - debug_label.offsetWidth + "px";
    };
};

debug_view.onchange = debugLabel;

//
// InfoLabel
//

function angleToDecimalTime(ang) {
    return ((ang % 360 * 2 / 30) + 12) % 24;
};

function angleToTimeStr24(ang) {
    var time = angleToDecimalTime(ang);
    var time_hours = Math.floor(time);
    var time_min = Math.floor((time % 1) * 60)
    return time_hours + ":" + sprintf("%02f", time_min);
};

function angleToTimeStr12(ang) {
    var time = angleToDecimalTime(ang);
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

function angleToTimeStr(ang) {
    if (time_24h.checked) {
        return angleToTimeStr24(ang)
    } else {
        return angleToTimeStr12(ang)
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

function solar_radiation(alt) {
    var result = solar_flux() * Math.sin(alt * deg2rad) * SOLAR_FACTOR_AM1;
    return result < 0 ? 0 : result; 
};

// http://en.wikipedia.org/wiki/Airmass#CITEREFPickering2002
function air_mass(alt) {
    var h;
    if (alt !== undefined) {
        h = alt;
    } else {
        var earth_rot = angle.get("angle");
        h = solar_altitude(latitude, longitude, earth_rot);
    };
    return 1/(Math.sin((h + 244/(165 + Math.pow(47 * h, 1.1))) * deg2rad))
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

        var altitude = Math.acos(Math.cos((latitude - earth.tilt)  * deg2rad) * Math.cos((angle.get("angle") - longitude) * deg2rad)) * rad2deg;

        earth.pos.y + Math.sin((latitude - earth.tilt)  * deg2rad) * earth.radius, 
        earth.pos.z + Math.sin(-longitude * deg2rad) * earth.radius 
        
        var solar_alt = solar_altitude(latitude, longitude);
        var solar_rad = solar_radiation(solar_alt);

        var labelStr = "";
        labelStr += "Date: " + date_by_day_number[earth.day_number] + ", ";
        // labelStr += sprintf("Sol. Constant:  %4.1f W/m2", solar_flux()) + ", ";
        labelStr += sprintf("Lat: %4.1f, Long:  %4.1f", latitude, longitude) + ", ";
        labelStr += "Time: " + angleToTimeStr(angle.get().angle - longitude) + ", ";
        labelStr += sprintf("Sun Altitude: %2.1f&deg;", solar_alt) + ", ";
        labelStr += sprintf("Solar Radiation: %2.1f  W/m2", solar_rad);

        info_content.innerHTML = labelStr;

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
        // controls_label.style.left = canvas_properties.right - elementGetX(document.getElementById("content")) - controls_label.offsetWidth + "px";
        // var labelStr = "controls";
        // controls_label.innerHTML = labelStr;
    };
};

