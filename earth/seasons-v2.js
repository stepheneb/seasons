var use_diffuse_correction   = document.getElementById("use-diffuse-correction") || { checked: true, onchange: null };
var use_airmass = document.getElementById("use-airmass") || { checked: true, onchange: null  };
var time_24h =  document.getElementById("time-24h") || { checked: false, onchange: null };
var graph_view   = document.getElementById("graph-view") || { checked: false, onchange: null };
var earth_rose_grid = document.getElementById("earth-rose-grid") || { checked: false, onchange: null };
var sun_grid = document.getElementById("sun-grid") || { checked: false, onchange: null };
var sunrise_set = document.getElementById("sun-rise-set") || { checked: false, onchange: null };
var sun_earth_line = document.getElementById("sun-earth-line") || { checked: false, onchange: null };
var backlight = document.getElementById("backlight") || { checked: false, onchange: null  };
var use_horizontal_flux   = document.getElementById("use-horizontal-flux") || { checked: true, onchange: null };
var sun_earth_line = document.getElementById("sun-earth-line");
var sun_noon_midnight = document.getElementById("sun-noon-midnight") || { checked: false, onchange: null };
var lat_hour_markers = document.getElementById("lat-hour-markers") || { checked: false, onchange: null };
var sun_rays = document.getElementById("sun-rays") || { checked: false, onchange: null };
var surface_view = document.getElementById("surface-view") || { checked: false, onchange: null };
var debug_view   = document.getElementById("debug-view") || { checked: false, onchange: null };


var solar_altitude_graph = document.getElementById("solar-altitude-graph") || 
    { checked: false, onchange: null, style: { display: null } };
var solar_radiation_latitude_graph = document.getElementById("solar-radiation-latitude-graph") || 
    { checked: false, onchange: null, style: { display: null } };
var solar_radiation_longitude_graph = document.getElementById("solar-radiation-longitude-graph") ||
    { checked: false, onchange: null, style: { display: null } };

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
var sqrt2 = Math.sqrt(2);
var orbitalTilt = 23.45;

var AU = 149597870.691;

var scale_factor = 1000;

var sun_diameter =         1392000.0 / scale_factor;
var earth_diameter =         12742.0 / scale_factor;
var earth_orbital_radius =        AU / scale_factor;

var km =                     1.0 / scale_factor;
var meter =                   km / 1000;

var earth_orbital_radius = au2km / scale_factor;

var milky_way_apparent_radius = earth_orbital_radius * 10;

var jun_day_number = day_number_by_month['jun'];
var sep_day_number = day_number_by_month['sep'];
var dec_day_number = day_number_by_month['dec'];
var mar_day_number = day_number_by_month['mar'];

var earth_pos_jun_vec3 = earth_ephemerides_location_by_day_number(jun_day_number);
var earth_pos_sep_vec3 = earth_ephemerides_location_by_day_number(sep_day_number);
var earth_pos_dec_vec3 = earth_ephemerides_location_by_day_number(dec_day_number);
var earth_pos_mar_vec3 = earth_ephemerides_location_by_day_number(mar_day_number);

var earth_pos_jun_normalized_vec3 = []; vec3.normalize(earth_pos_jun_vec3, earth_pos_jun_normalized_vec3);
var earth_pos_sep_normalized_vec3 = []; vec3.normalize(earth_pos_sep_vec3, earth_pos_sep_normalized_vec3);
var earth_pos_dec_normalized_vec3 = []; vec3.normalize(earth_pos_dec_vec3, earth_pos_dec_normalized_vec3);
var earth_pos_mar_normalized_vec3 = []; vec3.normalize(earth_pos_mar_vec3, earth_pos_mar_normalized_vec3);

var initial_day_number = jun_day_number;
var initial_earth_pos_vec3 = earth_pos_jun_vec3;

// var up = []; vec3.cross(earth_pos_jun_normalized_vec3, earth_pos_mar_normalized_vec3, up);
var up = [0, 1, 0]

var earth_tilt_axis = [1, 0, 0];
// var earth_tilt_axis = vec3.normalize(earth_ephemerides_location_by_month('sep'));

var sun = {
    pos: { x: 0, y: 0, z: 0 },
    radius: sun_diameter / 2
};

var initial_earth_rotation = 0;

var earth = {
    pos: {
        x: initial_earth_pos_vec3[0],
        y: initial_earth_pos_vec3[1],
        z: initial_earth_pos_vec3[2]
    },
    distance: earth_ephemerides_distance_from_sun_by_day_number(initial_day_number),
    radius:  earth_diameter / 2,
    tilt: orbitalTilt,
    // tilt_axis: { x: 1, y: 0, z: 0 },
    tilt_axis: { x: earth_tilt_axis[0], y: earth_tilt_axis[1], z: earth_tilt_axis[2] },
    day_number: initial_day_number,
    month: 'jun',
    rotation: initial_earth_rotation,
    km: km / (earth_diameter / 2),
    meter: meter / (earth_diameter / 2)
};

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
    distance: 200 * km * surface_earth_scale_factor,
    min_distance: 10 * km * surface_earth_scale_factor,
    lookat_yaw: 0,
    lookat_pitch: 0,
    min_height: 10 *  meter * surface_earth_scale_factor,
    height: 10 *  meter * surface_earth_scale_factor,
    max_pitch: 85,
    km: km * surface_earth_scale_factor,
    meter: meter * surface_earth_scale_factor,
    flagpole: {
        radius: 5 *  meter * surface_earth_scale_factor,
        height: 100 *  meter * surface_earth_scale_factor,
        pos: { x: 0, y: 0, z: 0 },
        material: {
            day: {
                baseColor:      { r: 0.5, g: 0.5, b: 0.5 },
                specularColor:  { r: 0.5, g: 0.5, b: 0.5 },
                specular:       0.5,
                shine:          0.001,
                emit:           0
            },
            night: {
                baseColor:      { r: 0.1, g: 0.1, b: 0.1 },
                specularColor:  { r: 0.1, g: 0.1, b: 0.1 },
                specular:       0.001,
                shine:          0.001,
                emit:           0.0
            }
        }
    },
    disk: {
        width: 500 * earth.km,
        height: earth.km,
        material: {
            day: {
                baseColor:      { r: 0.01, g: 0.1, b: 0.0 },
                specularColor:  { r: 0.01, g: 0.1, b: 0.0 },
                specular:       0.0001,
                shine:          0.0001,
                emit:           0
            },
            night: {
                baseColor:      { r: 0.01, g: 0.5, b: 0.0 },
                specularColor:  { r: 0.01, g: 0.5, b: 0.0 },
                specular:       0.5,
                shine:          0.5,
                emit:           0.0
                // baseColor:      { r: 0.01, g: 0.2, b: 0.0 },
                // specularColor:  { r: 0.01, g: 0.2, b: 0.0 },
                // specular:       0.05,
                // shine:          0.05,
                // emit:           0.5
            }
        }
    }
};


var bubble_gnomon_radius = 40000 * surface.flagpole.radius;
var bubble_gnomon_length = bubble_gnomon_radius * 2.5;
var bubble_gnomon_width  = bubble_gnomon_radius / 10;
var gnomon_label_size = bubble_gnomon_width * surface_earth_scale_factor * 0.001;


var earth_tilt_quat = quat4.axisVecAngleDegreesCreate(earth_tilt_axis,  earth.tilt);

// var earth_tilt_quat = quat4.axisAngleDegreesCreate(0, 0, 1,  earth.tilt);
// var earth_tilt_quat_sjs = SceneJS._math_angleAxisQuaternion(0, 0, 1,  earth.tilt);

// var earth_tilt_axis = []; vec3.cross(earth_pos_jun_normalized_vec3, up, earth_tilt_axis);

var jun_orbit_correction_degrees = Math.acos(vec3.dot([0, earth_pos_sep_normalized_vec3[1], -1], earth_pos_jun_normalized_vec3)) * rad2deg;
var jun_orbit_correction_quat = quat4.axisVecAngleDegreesCreate(up, jun_orbit_correction_degrees);
var jun_orbit_correction_mat4 = [];
quat4.toMat4(jun_orbit_correction_quat, jun_orbit_correction_mat4);

var sep_orbit_correction_degrees = Math.acos(vec3.dot([1, earth_pos_sep_normalized_vec3[1], 0], earth_pos_sep_normalized_vec3)) * rad2deg;
var sep_orbit_correction_quat = quat4.axisVecAngleDegreesCreate(up, sep_orbit_correction_degrees);
var sep_orbit_correction_mat4 = [];
quat4.toMat4(sep_orbit_correction_quat, sep_orbit_correction_mat4);

var dec_orbit_correction_degrees = Math.acos(vec3.dot([0, earth_pos_dec_normalized_vec3[1], 1], earth_pos_dec_normalized_vec3)) * rad2deg;
var dec_orbit_correction_quat = quat4.axisVecAngleDegreesCreate(up, -dec_orbit_correction_degrees);
var dec_orbit_correction_mat4 = [];
quat4.toMat4(dec_orbit_correction_quat, dec_orbit_correction_mat4);

var mar_orbit_correction_degrees = Math.acos(vec3.dot([-1, earth_pos_mar_normalized_vec3[1], 0], earth_pos_mar_normalized_vec3)) * rad2deg;
var mar_orbit_correction_quat = quat4.axisVecAngleDegreesCreate(up, -mar_orbit_correction_degrees);
var mar_orbit_correction_mat4 = [];
quat4.toMat4(mar_orbit_correction_quat, mar_orbit_correction_mat4);

var orbit_correction_degrees = Math.acos(vec3.dot([1, 0, 0], earth_pos_jun_normalized_vec3)) * rad2deg;
var orbit_correction_quat = quat4.axisVecAngleDegreesCreate(up, orbit_correction_degrees);
var orbit_correction_mat4 = [];
quat4.toMat4(orbit_correction_quat, orbit_correction_mat4);

var dark_side_light = 0.1;
var max_pitch = 85;

var distance = earth.radius * 3;
// var distance = 9.6;

var yaw      =  270;
var pitch    = -1;

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

function update_initial_eye() {
    initial_eye_quat = quat4.axisAngleDegreesCreate(1, 0, 0, 0);
    initial_eye_mat4 = quat4.toMat4(initial_eye_quat);
    mat4.multiplyVec3(initial_eye_mat4, [0, 0,  distance], initial_eye_vec3);
    initial_eye =      { 
        x: initial_eye_vec3[0] + earth.pos.x,
        y: initial_eye_vec3[1] + earth.pos.y,
        z: initial_eye_vec3[2] + earth.pos.z
    };
};

update_initial_eye();

SceneJS.createNode({
    id: "x-label",
    type: "billboard",
    nodes: [
        {
            type: "texture",
            layers: [ { uri: "images/x3.jpg", blendMode: "add" } ],
            nodes: [
                { type: "node", flags: {  transparent: true },
                    nodes: [ 
                        { type: "material", specular: 0.0, emit: 10,
                            nodes: [
                                { type: "quad", xSize: gnomon_label_size, ySize: gnomon_label_size }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});

SceneJS.createNode({
    id: "y-label",
    type: "billboard",
    nodes: [
        {
            type: "texture",
            layers: [ { uri: "images/y3.jpg", blendMode: "add" } ],
            nodes: [
                { type: "node", flags: {  transparent: true },
                    nodes: [ 
                        { type: "material", specular: 0.0, emit: 10,
                            nodes: [
                                { type: "quad", xSize: gnomon_label_size, ySize: gnomon_label_size }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});

SceneJS.createNode({
    id: "z-label",
    type: "billboard",
    nodes: [
        {
            type: "texture",
            layers: [ { uri: "images/z3.jpg", blendMode: "add" } ],
            nodes: [
                { type: "node", flags: {  transparent: true },
                    nodes: [ 
                        { type: "material", specular: 0.0, emit: 10,
                            nodes: [
                                { type: "quad", xSize: gnomon_label_size, ySize: gnomon_label_size }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});

SceneJS.createNode({
    id: "east-label",
    type: "billboard",
    nodes: [
        {
            type: "texture",
            layers: [ { uri: "images/east3.jpg", blendMode: "add" } ],
            nodes: [
                { type: "node", flags: {  transparent: true },
                    nodes: [ 
                        { type: "material", specular: 0.0, emit: 10,
                            nodes: [
                                // { type: "quad", xSize: 300, ySize: 100.0 }
                                // { type: "quad", xSize: 3.0, ySize: 1.0 }
                                { type: "quad", xSize: surface.flagpole.height * 3, ySize: surface.flagpole.height }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});

SceneJS.createNode({
    id: "north-label",
    type: "billboard",
    nodes: [
        {
            type: "texture",
            layers: [ { uri: "images/north3.jpg", blendMode: "add" } ],
            nodes: [
                { type: "node", flags: {  transparent: true },
                    nodes: [ 
                        { type: "material", specular: 0.0, emit: 10,
                            nodes: [
                                { type: "quad", xSize: 0.0, ySize: 0.1 }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});

SceneJS.createNode({
    id: "west-label",
    type: "billboard",
    nodes: [
        {
            type: "texture",
            layers: [ { uri: "images/west3.jpg", blendMode: "add" } ],
            nodes: [
                { type: "node", flags: {  transparent: true },
                    nodes: [ 
                        { type: "material", specular: 0.0, emit: 10,
                            nodes: [
                                { type: "quad", xSize: 0.3, ySize: 0.1 }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});

SceneJS.createNode({
    id: "south-label",
    type: "billboard",
    nodes: [
        {
            type: "texture",
            layers: [ { uri: "images/south3.jpg", blendMode: "add" } ],
            nodes: [
                { type: "node", flags: {  transparent: true },
                    nodes: [ 
                        { type: "material", specular: 0.0, emit: 10,
                            nodes: [
                                { type: "quad", xSize: 0.3, ySize: 0.1 }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});

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
            up:   { x: up[0], y: up[1], z: up[2] },

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
                            type: "quaternion",
                            id: "backlight-quaternion",
                            x: 0, y: 1, z: 0,
                            angle: 0,
                            
                            nodes: [
                            
                                {
                                    type: "translate",
                                    x: earth_orbital_radius * 1.5, 
                                    y: earth_orbital_radius * 1.5, 
                                    z: earth_orbital_radius * 1.5,
                                    
                                    nodes: [

                                        {
                                            type: "light",
                                            id:   "backlight-node1",
                                            mode:                   "point",
                                            pos:                    { x: -1 * earth_orbital_radius, y: 0, z: 0 },
                                            color:                  { r: 1.0, g: 1.0, b: 1.0 },
                                            diffuse:                true,
                                            specular:               true,
                                            constantAttenuation:    1.0,
                                            quadraticAttenuation:   0.0,
                                            linearAttenuation:      0.0
                                        },

                                        {
                                            type: "light",
                                            id:   "backlight-node2",
                                            mode:                   "point",
                                            pos:                    { x: 1 * earth_orbital_radius, y: 0, z: 0  },
                                            color:                  { r: 1.0, g: 1.0, b: 1.0 },
                                            diffuse:                true,
                                            specular:               true,
                                            constantAttenuation:    1.0,
                                            quadraticAttenuation:   0.0,
                                            linearAttenuation:      0.0
                                        }
                                    ]
                                }
                            ]
                        },

                        // surface lookat bubble
                        
                        // bubble
                        {
                            type: "translate",
                            id: "surface-lookat-bubble-pos",
                            x: sun.pos.x,
                            y: sun.pos.y,
                            z: sun.pos.z,

                            nodes: [
                                {
                                    type: "scale",
                                    id: "surface-lookat-bubble-scale",
                                    // x: 0.001,
                                    // y: 0.001,
                                    // z: 0.001,
                                    // x: surface.meter * 500,
                                    // y: surface.meter * 500,
                                    // z: surface.meter * 500,
                                    
                                    nodes: [

                                        {
                                            type: "selector",
                                            id: "surface-lookat-bubble-selector",
                                            selection: [0],
                                            nodes: [ 

                                                // 0: off

                                                {  },

                                                // 1: on:

                                                {
                                                    type: "node",
                                                    flags: { transparent: true },
                                                    
                                                    nodes: [  
                                                    
                                                        {
                                                            type: "material",
                                                            baseColor:      { r: 1.0, g: 0.05, b: 0.05 },
                                                            specularColor:  { r: 1.0, g: 0.05, b: 0.05 },
                                                            specular: 0.0, shine: 0.1, emit: 0.5, alpha: 0.5,
                                                            nodes: [ { type: "sphere", slices: 48, rings: 48, radius: bubble_gnomon_radius } ]
                                                        },
                                                        {
                                                            type: "material",
                                                            baseColor:      { r: 1.0, g: 0.05, b: 0.05 },
                                                            specularColor:  { r: 1.0, g: 0.05, b: 0.05 },
                                                            specular: 0.0, shine: 0.1, emit: 0.5, alpha: 0.5,
                                                            nodes: [ 
                                                                {
                                                                    type: "translate", x: bubble_gnomon_length, y: 0.0, z: 0.0,
                                                                    nodes: [ { type: "cube", xSize: bubble_gnomon_length, ySize: bubble_gnomon_width, zSize: bubble_gnomon_width } ]
                                                                }
                                                            ]
                                                        },

                                                        {
                                                            type: "material",
                                                            baseColor:      { r: 0.05, g: 1.0, b: 0.05 },
                                                            specularColor:  { r: 0.05, g: 1.0, b: 0.05 },
                                                            specular: 0.0, shine: 0.1, emit: 0.5, alpha: 0.5,
                                                            nodes: [ 
                                                                {
                                                                    type: "translate", x: 0.0, y: bubble_gnomon_length, z: 0.0,
                                                                    nodes: [ { type: "cube", xSize: bubble_gnomon_width, ySize: bubble_gnomon_length, zSize: bubble_gnomon_width } ]
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            type: "material",
                                                            baseColor:      { r: 0.05, g: 0.05, b: 1.0 },
                                                            specularColor:  { r: 0.05, g: 0.05, b: 1.0 },
                                                            specular: 0.0, shine: 0.1, emit: 0.5, alpha: 0.5,
                                                            nodes: [ 
                                                                {
                                                                    type: "translate", x: 0.0, y: 0.0, z: bubble_gnomon_length,
                                                                    nodes: [ { type: "cube", xSize: bubble_gnomon_width, ySize: bubble_gnomon_width, zSize: bubble_gnomon_length } ]
                                                                }
                                                            ]
                                                        },
                                                        
                                                        {
                                                            // type: "node",
                                                            type: "material",
                                                            // baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
                                                            // specularColor:  { r: 1.0, g: 1.0, b: 1.0 },
                                                            // specular: 1.0, shine: 1.0, 
                                                            // emit: 0.5, alpha: 0.1,
                                                            
                                                            nodes: [
                                                                {
                                                                    type: "translate",
                                                                    x: bubble_gnomon_length * 2.2,  y: 0, z: 0,
                                                                    nodes: [ { type: "instance", target: "x-label" } ]
                                                                },
                                                                {
                                                                    type: "translate",
                                                                    x: 0,  y: bubble_gnomon_length * 2.2, z: 0,
                                                                    nodes: [ { type: "instance", target: "y-label" } ]
                                                                },
                                                                {
                                                                    type: "translate",
                                                                    x: 0,  y: 0, z: bubble_gnomon_length * 2.2,
                                                                    nodes: [ { type: "instance", target: "z-label" } ]
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

                                        // 1: June 21
                                        {
                                            type: "geometry",
                                            primitive: "lines",

                                            positions: [
                                                sun.pos.x, sun.pos.y, sun.pos.z,
                                                earth_pos_jun_vec3[0], earth_pos_jun_vec3[1], earth_pos_jun_vec3[2]
                                            ],

                                            indices : [ 0, 1 ]

                                        },

                                        // 2: Sep 21
                                        {
                                            type: "geometry",
                                            primitive: "lines",

                                            positions: [
                                                sun.pos.x, sun.pos.y, sun.pos.z,
                                                earth_pos_sep_vec3[0], earth_pos_sep_vec3[1], earth_pos_sep_vec3[2]
                                            ],

                                            indices : [ 0, 1 ]

                                        },

                                        // 3: Dec 21
                                        {
                                            type: "geometry",
                                            primitive: "lines",

                                            positions: [
                                                sun.pos.x, sun.pos.y, sun.pos.z,
                                                earth_pos_dec_vec3[0], earth_pos_dec_vec3[1], earth_pos_dec_vec3[2]
                                            ],

                                            indices : [ 0, 1 ]

                                        },

                                        // 4: Mar 21
                                        {
                                            type: "geometry",
                                            primitive: "lines",

                                            positions: [
                                                sun.pos.x, sun.pos.y, sun.pos.z,
                                                earth_pos_mar_vec3[0], earth_pos_mar_vec3[1], earth_pos_mar_vec3[2]
                                            ],

                                            indices : [ 0, 1 ]

                                        },
                                        
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
                                            type: "matrix",
                                            id: "orbit-matrix-node",
                                            elements: jun_orbit_correction_mat4,
                                    
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
                                                                    id: "noon-midnight-selector",
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
                                                                                    id: "noon-midnight-rotation",
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
                                                                    id: "sunrise-set-selector",
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
                                                                                    id: "sunrise-set-rotation",
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
                                                    id:   "earth-tilt-quaternion",
                                                    x: 1, y: 0, z: 0,
                                                    // x: earth_tilt_axis[0], 
                                                    // y: earth_tilt_axis[1], 
                                                    // z: earth_tilt_axis[2],
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
                                                            type: "rotate", 
                                                            id: "day-of-year-angle-node", 
                                                            angle: 90,
                                                            x: 0.0,
                                                            y: 1.0,
                                                            z: 0.0,
                                                            
                                                            nodes: [
                            
                                                                { 
                                                                    type: "rotate",
                                                                    id: "rotation", 
                                                                    angle: initial_earth_rotation, 
                                                                    y: 1.0,
                            
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
                                                                                            baseColor:      { r: 0.0, g: 0.2, b: 1.0 },
                                                                                            specularColor:  { r: 0.0, g: 0.2, b: 1.0 },
                                                                                            specular:       1.0,
                                                                                            shine:          1.0,
                                                                                            alpha:          0.5,
                                                                                            emit:           0.0,

                                                                                            nodes: [

                                                                                                {
                                                                                                    type: "scale", 
                                                                                                    x: earth.radius * 1.05, 
                                                                                                    y: earth.radius * 1.05, 
                                                                                                    z: earth.radius * 1.05,

                                                                                                    nodes: [

                                                                                                        { 
                                                                                                            type: "sphere",
                                                                                                            slices: 128, rings: 128 
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
                                                                                            flags: { transparent: false },

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
                                                                                                                            y: 1 + surface.min_height - surface.disk.height / 2,
                                                                                                                            z: 0,
                                                                                                                            
                                                                                                                            nodes: [
                                                                                                                                {
                                                                                                                                    type: "selector",
                                                                                                                                    id: "surface-disc-selector",
                                                                                                                                    selection: [0],

                                                                                                                                    nodes: [ 

                                                                                                                                        // 0: Earth in Space View
                                                                                                                                        {
                                                                                                                                            type: "material",
                                                                                                                                            id:   "surface-disk-material",
                                                                                                                                            baseColor:      { r: 0.1, g: 0.6, b: 0.0 },
                                                                                                                                            specularColor:  { r: 0.1, g: 0.6, b: 0.0 },

                                                                                                                                            specular:       0.05,
                                                                                                                                            shine:          0.01,
                                                                                                                                            emit:           0.5,

                                                                                                                                            nodes: [
                                                                                                                                                {
                                                                                                                                                    type: "disk",
                                                                                                                                                    radius: earth.radius / 400,
                                                                                                                                                    height: surface.disk.height,
                                                                                                                                                    rings: 24
                                                                                                                                                }
                                                                                                                                            ]
                                                                                                                                        },

                                                                                                                                        // 1: Surface View
                                                                                                                                    
                                                                                                                                        {
                                                                                                                                            
                                                                                                                                            nodes: [
                                                                                                                                                { 
                                                                                                                                                    type: "material",
                                                                                                                                                    id:   "surface-disk-material",
                                                                                                                                                    baseColor:      { r: 0.01, g: 0.2, b: 0.0 },
                                                                                                                                                    specularColor:  { r: 0.01, g: 0.2, b: 0.0 },

                                                                                                                                                    specular:       0.05,
                                                                                                                                                    shine:          0.0001,

                                                                                                                                                    nodes: [
                                                                                                                                                        {
                                                                                                                                                            type: "disk",
                                                                                                                                                            radius: surface.disk.width,
                                                                                                                                                            height: surface.disk.height,
                                                                                                                                                            rings: 48
                                                                                                                                                        }
                                                                                                                                                    ]
                                                                                                                                                },
                                                                                                                                                
                                                                                                                                                {
                                                                                                                                                    type: "translate",
                                                                                                                                                    x: 0,
                                                                                                                                                    y: surface.disk.height / 2,
                                                                                                                                                    z: 0,
                                                                                                                                                    
                                                                                                                                                    nodes: [
                                                                                                                                                        {
                                                                                                                                                            type: "translate",
                                                                                                                                                            x: 0,  y: surface.flagpole.height, z: 0,
                                                                                                                                                            nodes: [ { type: "instance", target: "east-label" } ]
                                                                                                                                                        },

                                                                                                                                                        // {
                                                                                                                                                        //     type: "translate",
                                                                                                                                                        //     x: 0,  y: 0, z: surface.disk.width,
                                                                                                                                                        //     nodes: [ { type: "instance", target: "north-label" } ]
                                                                                                                                                        // },
                                                                                                                                                        // 
                                                                                                                                                        // {
                                                                                                                                                        //     type: "translate",
                                                                                                                                                        //     x: -surface.disk.width,  y: 0, z: 0,
                                                                                                                                                        //     nodes: [ { type: "instance", target: "west-label" } ]
                                                                                                                                                        // },
                                                                                                                                                        // 
                                                                                                                                                        // {
                                                                                                                                                        //     type: "translate",
                                                                                                                                                        //     x: 0,  y: 0, z: surface.disk.width,
                                                                                                                                                        //     nodes: [ { type: "instance", target: "south-label" } ]
                                                                                                                                                        // },

                                                                                                                                                        {
                                                                                                                                                            type: "node",
                                                                                                                                                            flags: { transparent: true },

                                                                                                                                                            nodes: [
                                                                                                                                                                { 
                                                                                                                                                                    type: "material",
                                                                                                                                                                    baseColor:      { r: 0.5, g: 0.05, b: 0.05 },
                                                                                                                                                                    specularColor:  { r: 0.5, g: 0.05, b: 0.05 },

                                                                                                                                                                    specular:       0.5,
                                                                                                                                                                    shine:          0.1,
                                                                                                                                                                    emit:           0.5,
                                                                                                                                                                    alpha:          0.5,

                                                                                                                                                                    nodes: [

                                                                                                                                                                        {
                                                                                                                                                                            type: "translate",
                                                                                                                                                                            x: 0,
                                                                                                                                                                            y: surface.flagpole.height / 200,
                                                                                                                                                                            z: 0,

                                                                                                                                                                            nodes: [

                                                                                                                                                                                {
                                                                                                                                                                                    type: "rotate",
                                                                                                                                                                                    angle: 90,
                                                                                                                                                                                    x: 1.0,

                                                                                                                                                                                    nodes: [

                                                                                                                                                                                        {
                                                                                                                                                                                            type: "quad",
                                                                                                                                                                                            xSize: surface.disk.width,
                                                                                                                                                                                            ySize: 0.5 * earth.km
                                                                                                                                                                                        }
                                                                                                                                                                                    ]
                                                                                                                                                                                },

                                                                                                                                                                                {
                                                                                                                                                                                    type: "rotate",
                                                                                                                                                                                    angle: 90,
                                                                                                                                                                                    y: 1.0,

                                                                                                                                                                                    nodes: [
                                                                                                                                                                                        {
                                                                                                                                                                                            type: "rotate",
                                                                                                                                                                                            angle: 90,
                                                                                                                                                                                            x: 1.0,

                                                                                                                                                                                            nodes: [
                                                                                                                                                                                                {
                                                                                                                                                                                                    type: "quad",
                                                                                                                                                                                                    xSize: surface.disk.width,
                                                                                                                                                                                                    ySize: 0.5 * earth.km
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
                                                                                                                                                            type: "material",
                                                                                                                                                            id:   "flagpole-material",
                                                                                                                                                            baseColor:      { r: 0.5, g: 0.5, b: 0.5 },
                                                                                                                                                            specularColor:  { r: 0.5, g: 0.5, b: 0.5 },
                                                                                                                                                            specular:       0.5,
                                                                                                                                                            shine:          0.001,

                                                                                                                                                            nodes: [

                                                                                                                                                                {

                                                                                                                                                                    type: "translate",
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
                                                                                                                                                        },
                                                                                                                                                        
                                                                                                                                                        // Solar Panel
                                                                                                                                                        {
                                                                                                                                                            type: "translate",
                                                                                                                                                            x: surface.flagpole.height * 1.5,
                                                                                                                                                            y: 0,
                                                                                                                                                            z: 0,

                                                                                                                                                            nodes: [
                                                                                                                                                            
                                                                                                                                                                { 
                                                                                                                                                                    type: "material",
                                                                                                                                                                    baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
                                                                                                                                                                    specularColor:  { r: 1.0, g: 1.0, b: 1.0 },
                                                                                                                                                                    specular:       0.1 ,
                                                                                                                                                                    shine:          1.0,

                                                                                                                                                                    nodes: [

                                                                                                                                                                        {
                                                                                                                                                                            type: "texture",
                                                                                                                                                                            layers: [ 
                                                                                                                                                                                { 
                                                                                                                                                                                    uri: "images/solarpanel1.jpg",
                                                                                                                                                                                    applyTo: "baseColor",
                                                                                                                                                                                    blendMode: "multiply" ,
                                                                                                                                                                                    wrapS: "repeat",
                                                                                                                                                                                    wrapT: "repeat",
                                                                                                                                                                                } 
                                                                                                                                                                            ],
                                                                                                                                                                            nodes: [
                                                                                                                                                                                {
                                                                                                                                                                                    type: "box",
                                                                                                                                                                                    xSize: surface.flagpole.height / 2,
                                                                                                                                                                                    ySize: surface.flagpole.radius / 4,
                                                                                                                                                                                    zSize: surface.flagpole.height / 2
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
var backlight_node1 =  SceneJS.withNode("backlight-node1");
var backlight_node2 =  SceneJS.withNode("backlight-node2");
var backlight_quaternion =  SceneJS.withNode("backlight-quaternion");

function backLightHandler() {
    var colors;
    if (backlight.checked) {
        colors = { r: 1.0, g: 1.0, b: 1.0 };
    } else {
        colors = { r: dark_side_light, g: dark_side_light, b: dark_side_light };
    };
    backlight_node1.set("color", colors);
    backlight_node2.set("color", colors);
};

backlight.onchange = backLightHandler;
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

var sun_earth_line_selector =  SceneJS.withNode("sun-earth-line-selector");

function sunEarthLineHandler() {
    if (sun_earth_line.checked) {
        switch (earth.day_number) {
        case day_number_by_month.jun: 
            sun_earth_line_selector.set("selection", [1]);
            break;
        case day_number_by_month.sep: 
            sun_earth_line_selector.set("selection", [2]);
            break;
        case day_number_by_month.dec: 
            sun_earth_line_selector.set("selection", [3]);
            break;
        case day_number_by_month.mar: 
            sun_earth_line_selector.set("selection", [4]);
            break;
        default:
            sun_earth_line_selector.set("selection", [0]);
            break;
        };
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
var sunrise_set_selector =  SceneJS.withNode("sunrise-set-selector");
var sunrise_set_rotation =  SceneJS.withNode("sunrise-set-rotation");

function sunRiseSetHandler() {
    if (sunrise_set.checked) {
        sunrise_set_selector.set("selection", [1]);
    } else {
        sunrise_set_selector.set("selection", [0]);
    };
};

sunrise_set.onchange = sunRiseSetHandler;
sunRiseSetHandler();

//
// Sun noon/midnight surface indicator Handler
//

var noon_midnight_selector =  SceneJS.withNode("noon-midnight-selector");
var noon_midnight_rotation =  SceneJS.withNode("noon-midnight-rotation");

function noonMidnightHandler() {
    if (sun_noon_midnight.checked) {
        noon_midnight_selector.set("selection", [1]);
    } else {
        noon_midnight_selector.set("selection", [0]);
    };
};

sun_noon_midnight.onchange = noonMidnightHandler;
noonMidnightHandler();

//
// Latitude hour markers Handler
//
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

var day_of_year_angle_by_mon = {
    jun: 90,
    sep: 0,
    dec: 270,
    mar: 180
};

var yaw_angle_by_mon = {
    jun: 270,
    sep: 180,
    dec: 90,
    mar: 0
};

var day_of_year_angle = day_of_year_angle_by_mon['jun'];
var day_of_year_angle_node = SceneJS.withNode("day-of-year-angle-node");

var earth_pos_normalized_vec3 = [];

var orbit_matrix_node = SceneJS.withNode("orbit-matrix-node");

function setEarthPositionByMon(mon) {
    var yaw_difference = yaw - yaw_angle_by_mon[earth.month];
    earth.month = mon;
    var day_number = day_number_by_month[mon];
    earth.day_number = day_number;
    
    switch (mon) {
        case 'jun':
            pos = earth_pos_jun_vec3;
            vec3.set(earth_pos_jun_normalized_vec3, earth_pos_normalized_vec3);
            orbit_correction_degrees = Math.acos(vec3.dot([1, 0, 0], earth_pos_normalized_vec3)) * rad2deg;
            orbit_correction_quat = quat4.axisVecAngleDegreesCreate(up, orbit_correction_degrees);
            orbit_correction_mat4 = [];
            quat4.toMat4(orbit_correction_quat, orbit_correction_mat4);
            orbit_matrix_node.set("elements", jun_orbit_correction_mat4);
            sunrise_set_rotation.set({ angle: 90, x: 0, y: 0, z: -1 });
            day_of_year_angle = 90;
            day_of_year_angle_node.set({ angle: day_of_year_angle, x: 0, y: 1, z: 0 });
            break;
        case 'sep':
            pos = earth_pos_sep_vec3;
            vec3.set(earth_pos_sep_normalized_vec3, earth_pos_normalized_vec3);
            orbit_correction_degrees = Math.acos(vec3.dot([1, 0, 0], earth_pos_normalized_vec3)) * rad2deg;
            orbit_correction_quat = quat4.axisVecAngleDegreesCreate(up, orbit_correction_degrees);
            orbit_correction_mat4 = [];
            quat4.toMat4(orbit_correction_quat, orbit_correction_mat4);
            orbit_matrix_node.set("elements", sep_orbit_correction_mat4);
            sunrise_set_rotation.set({ angle: 90, x: 1, y: 0, z: 0 });
            day_of_year_angle = 0;
            day_of_year_angle_node.set({ angle: day_of_year_angle, x: 0, y: 1, z: 0 });
            break;
        case 'dec':
            pos = earth_pos_dec_vec3;
            vec3.set(earth_pos_dec_normalized_vec3, earth_pos_normalized_vec3);
            orbit_correction_degrees = 360 - (Math.acos(vec3.dot([1, 0, 0], earth_pos_normalized_vec3)) * rad2deg);
            orbit_correction_quat = quat4.axisVecAngleDegreesCreate(up, orbit_correction_degrees);
            orbit_correction_mat4 = [];
            quat4.toMat4(orbit_correction_quat, orbit_correction_mat4);
            orbit_matrix_node.set("elements", dec_orbit_correction_mat4);
            sunrise_set_rotation.set({ angle: 90, x: 0, y: 0, z: -1 });
            day_of_year_angle = 270;
            day_of_year_angle_node.set({ angle: day_of_year_angle, x: 0, y: 1, z: 0 });
            break;
        case 'mar':
            pos = earth_pos_mar_vec3;
            vec3.set(earth_pos_mar_normalized_vec3, earth_pos_normalized_vec3);
            orbit_correction_degrees = (Math.acos(vec3.dot([1, 0, 0], earth_pos_normalized_vec3)) * rad2deg);
            orbit_correction_quat = quat4.axisVecAngleDegreesCreate(up, orbit_correction_degrees);
            orbit_correction_mat4 = [];
            quat4.toMat4(orbit_correction_quat, orbit_correction_mat4);
            orbit_matrix_node.set("elements", mar_orbit_correction_mat4);
            sunrise_set_rotation.set({ angle: 90, x: 1, y: 0, z: 0 });
            day_of_year_angle = 180;
            day_of_year_angle_node.set({ angle: day_of_year_angle, x: 0, y: 1, z: 0 });
            break;
    };
    earth.pos = { x: pos[0], y: pos[1], z: pos[2] };
    earth_sub_graph.set(earth.pos);

    backlight_quaternion.set("rotation", { x:0, y:1, z: 0, angle: yaw_angle_by_mon[mon] - 135 });

    yaw = yaw_angle_by_mon[mon];
    incrementYaw(yaw_difference);
    sunEarthLineHandler();
};

var sun_light                 = SceneJS.withNode("sun-light");
var sun_material              = SceneJS.withNode("sun-material");
var milky_way_material        = SceneJS.withNode("milky-way-material");

var earth_atmosphere_selector = SceneJS.withNode("earth-atmosphere-selector");
var atmosphere_material       = SceneJS.withNode("atmosphere-material");
var atmosphere_transparent    = SceneJS.withNode("atmosphere-transparent");

var surface_disk_material = SceneJS.withNode("surface-disk-material");
var flagpole_material = SceneJS.withNode("flagpole-material");

var surface_disc_selector = SceneJS.withNode("surface-disc-selector");

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
    
    // setEarthPositionByDay(earth.day_number)
    var optics = camera.get("optics");
    optics.fovy = 50;
    optics.near = 0.10;
    camera.set("optics", optics);
    latitude_line_selector.set("selection",  [1]);
    longitude_line_selector.set("selection", [1]);
    surface_disc_selector.set("selection", [0]);

    if (was_earth_grid_checked) {
        earth_grid.checked = true;
        earthGridHandler();
        was_earth_grid_checked = false;
    };

    if (was_sunrise_set_checked) {
        sunrise_set.checked = true;
        sunRiseSetHandler();
        was_sunrise_set_checked = false;
    };

    if (was_sun_earth_line_checked) {
        sun_earth_line.checked = true;
        sunEarthLineHandler();
        was_sun_earth_line_checked = false;
    };

    look_at.set("up", { x: up[0], y: up[1], z: up[2] });
};

//
// Earth in Space Handling
//
function updateEarthInSpaceLookAt() {
    // first handle yaw and pitch for our lookAt-arcball navigation around Earth
    // background: http://rainwarrior.thenoos.net/dragon/arcball.html
    
    
    var yaw_quat =  quat4.axisAngleDegreesCreate(0, 1, 0, yaw);
    var yaw_mat4 = quat4.toMat4(yaw_quat);

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

function lat_long_to_cartesian(lat, lon, r) {
    r = r || 1;
    return [-r * Math.cos(lat * deg2rad) * Math.cos(lon * deg2rad),
             r * Math.sin(lat * deg2rad),
            -r * Math.cos(lat * deg2rad) * Math.sin(lon * deg2rad), 1]
}

function lat_long_to_cartesian_corrected_for_tilt(lat, lon, r) {
    r = r || 1;
    var lat_lon = lat_long_to_cartesian(lat, lon - earth.rotation, r);
    // var v3 = vec3.create();

    var q2 = [];
    var v2 = [];

    switch (earth.month) {
        case 'jun': q2 = quat4.axisVecAngleDegreesCreate([0, 0, 1], earth.tilt); break;
        case 'sep': q2 = quat4.axisVecAngleDegreesCreate([1, 0, 0], earth.tilt); break;
        case 'dec': q2 = quat4.axisVecAngleDegreesCreate([0, 0, 1], -earth.tilt); break;
        case 'mar': q2 = quat4.axisVecAngleDegreesCreate([1, 0, 0], -earth.tilt); break;
    };

    // var q2 = quat4.axisVecAngleDegreesCreate(earth_tilt_axis, earth.tilt);

    // var q2 = quat4.axisVecAngleDegreesCreate([0, 0, 1], earth.tilt);

    quat4.multiplyVec3(q2, lat_lon, v2)

    // mat4.multiplyVec3(orbit_correction_mat4, v2);

    return v2;

    // quat4.multiplyVec3(earth_tilt_quat, lat_lon, v2);
    // var v3  = [];
    // var m4 = SceneJS._math_newMat4FromQuaternion(earth_tilt_quat_sjs);
    // var v4 = SceneJS._math_mulMat4v4(m4, [lat_lon[0], lat_lon[1], lat_lon[2], 1])
    // return v3;
};

function lat_long_to_global_cartesian(lat, lon, r) {
    r = r || 1;
    var q2 = [];
    var v2 = [];

    var lat_lon = lat_long_to_cartesian(lat, lon - earth.rotation, r);

    // var q2 = quat4.axisVecAngleDegreesCreate([0, 0, 1], earth.tilt);
    // vec3.scale(lat_lon, earth.radius);
    // mat4.multiplyVec3(orbit_correction_mat4, lat_lon);
    // quat4.multiplyVec3(q2, lat_lon)
    // vec3.add(lat_lon, [earth.pos.x, earth.pos.y, earth.pos.z] )
    // return lat_lon;

    switch (earth.month) {
        case 'jun': q2 = quat4.axisVecAngleDegreesCreate([0, 0, 1], earth.tilt); break;
        case 'sep': q2 = quat4.axisVecAngleDegreesCreate([1, 0, 0], earth.tilt); break;
        case 'dec': q2 = quat4.axisVecAngleDegreesCreate([0, 0, 1], -earth.tilt); break;
        case 'mar': q2 = quat4.axisVecAngleDegreesCreate([1, 0, 0], -earth.tilt); break;
    };

    // var q2 = quat4.axisVecAngleDegreesCreate([0, 0, 1], earth.tilt);
    quat4.multiplyVec3(q2, lat_lon)
    vec3.scale(lat_lon, earth.radius);
    mat4.multiplyVec3(orbit_correction_mat4, lat_lon);
    vec3.add(lat_lon, [earth.pos.x, earth.pos.y, earth.pos.z] )
    return lat_lon;
    

    // var q2 = quat4.axisVecAngleDegreesCreate(earth_tilt_axis, earth.tilt);

    // var q2 = quat4.axisVecAngleDegreesCreate([0, 0, 1], earth.tilt);
    // quat4.multiplyVec3(q2, lat_lon, v2)
    // var global_lat_lon = vec3.create();
    // vec3.scale(v2, earth.radius, global_lat_lon);
    // mat4.multiplyVec3(orbit_correction_mat4, global_lat_lon);
    // vec3.add(global_lat_lon, [earth.pos.x, earth.pos.y, earth.pos.z] )
    // return global_lat_lon;

};

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
    quat4.multiplyVec3(orbit_correction_quat, surface_up_minus_90_vec3);
    vec3.cross(surface_up_vec3, surface_up_minus_90_vec3, surface_cross_vec3);
    return surface_cross_vec3;
};

function calculateSurfaceEyeUpLook() {
    
    // calculate unit vector from center of Earth to surface location
    surface_dir_vec3 = lat_long_to_cartesian_corrected_for_tilt(surface.latitude, surface.longitude);
    
    // quat4.multiplyVec3(earth_orbit_correction_quat, surface_dir_vec3);
    quat4.multiplyVec3(orbit_correction_quat, surface_dir_vec3);
    
    // generate an up axis direction vector for the lookAt (integrates tilt)
    surface_up_vec3 = vec3.create(surface_dir_vec3);

    flagpole_global = lat_long_to_global_cartesian(surface.latitude, surface.longitude, 1.0 + (surface.min_height + surface.flagpole.height / 2));
    // flagpole_global[1] += 0.05;
    // flagpole_global[2] -= 9;
    x = (earth.radius + surface.min_height + surface.flagpole.height / 2) / earth.radius;

    // generate an appropriate offset from the flagpole using the cross-product of the
    // current surface_up with the surface_up vector rotated 90 degrees northward
    calculate_surface_cross();
    vec3.scale(surface_cross_vec3, surface.distance * 10000 * surface.meter, surface_eye_vec3);    
    vec3.add(flagpole_global, surface_eye_vec3, surface_eye_global);

    surface_look_global = vec3.create(flagpole_global);
    
    var lookat = {
        eye:  { x: surface_eye_global[0],  y: surface_eye_global[1],  z: surface_eye_global[2]  },
        up:   { x: surface_up_vec3[0],     y: surface_up_vec3[1],     z: surface_up_vec3[2]     },
        look: { x: surface_look_global[0], y: surface_look_global[1], z: surface_look_global[2] },
    }
    return lookat;
};

function calculateSurfacePitchAxis(up, yaw) {
    var pitch_axis = [];
    var yaw_normalized = vec3.normalize(yaw);
    vec3.cross(up, yaw, pitch_axis);
    return pitch_axis;
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
    
    vec3.scale(surface_cross_vec3, surface.distance * 10000 * surface.meter, surface_eye_vec3);    

    // calculate a yaw quaternion for rotation left-right around the lookAt point
    var yaw_quat = quat4.axisVecAngleDegreesCreate(surface_up_vec3, surface.yaw);
    
    // calculate a yaw vector for calculating a pitch axis
    var yaw_vec3 = []; quat4.multiplyVec3(yaw_quat, surface_eye_vec3, yaw_vec3);
    
    // calculate a pitch axis and quat for rotation up-down around the lookAt point
    var pitch_axis = calculateSurfacePitchAxis(surface_up_vec3, yaw_vec3);
    var pitch_quat =  quat4.axisVecAngleDegreesCreate(pitch_axis, -surface.pitch);

    // combine the yaw and pitch quats and apply to the initial surface_eye
    quat4.multiply(pitch_quat, yaw_quat, result_quat);
    quat4.multiplyVec3(result_quat, surface_eye_vec3, new_surface_eye_vec3);

    // update the global surface eye
    vec3.add(surface_look_global, new_surface_eye_vec3, new_surface_eye_global);
    look_at.set("eye", { x: new_surface_eye_global[0],  y: new_surface_eye_global[1],  z: new_surface_eye_global[2] });

    // calculate pitch and yaw rotation of where you are looking at in the surface POV
    var lookat_pitch_quat = quat4.axisVecAngleDegreesCreate(pitch_axis, -surface.lookat_pitch); 
    quat4.multiplyVec3(lookat_pitch_quat, new_surface_eye_vec3, new_surface_look_vec3);
    var lookat_yaw_quat = quat4.axisVecAngleDegreesCreate(surface_up_vec3, surface.lookat_yaw); 
    quat4.multiplyVec3(lookat_yaw_quat, new_surface_eye_vec3, new_surface_look_vec3);

    // combine the lookat pitch and yaw quats and apply to the initial surface lookAt
    quat4.multiply(lookat_pitch_quat, lookat_yaw_quat, result_quat);

    quat4.multiplyVec3(result_quat, new_surface_eye_vec3, new_surface_look_vec3);
    vec3.subtract(new_surface_eye_vec3, new_surface_look_vec3, new_surface_look_vec3);
    vec3.add(surface_look_global, new_surface_look_vec3, new_surface_look_global);
    lookat.look = { x: new_surface_look_global[0],  y: new_surface_look_global[1],  z: new_surface_look_global[2] };

    look_at.set("look",  lookat.look);
    if (debug_view.checked) {
        surface_lookat_bubble_pos.set(lookat.look);
    };
    debugLabel();
};

var was_earth_grid_checked = earth_grid.checked;
var was_sunrise_set_checked = sunrise_set.checked;
var was_sun_earth_line_checked = sun_earth_line.checked;

var surface_lookat_bubble_selector = SceneJS.withNode("surface-lookat-bubble-selector");
var surface_lookat_bubble_pos = SceneJS.withNode("surface-lookat-bubble-pos");
var surface_lookat_bubble_scale = SceneJS.withNode("surface-lookat-bubble-scale");

function setupSurfaceView() {
    
    was_earth_grid_checked = earth_grid.checked;
    earth_grid.checked = false;
    earthGridHandler();

    was_sunrise_set_checked = sunrise_set.checked;
    sunrise_set.checked = false;
    sunRiseSetHandler();

    was_sun_earth_line_checked = sun_earth_line.checked;
    sun_earth_line.checked = false;
    sunEarthLineHandler();

    milky_way_material.set("emit", 0.8);

    sun_material.set("specular", 1.0);
    sun_material.set("shine", 1.0);
    sun_material.set("emit", 10.0);

    atmosphere_material.set("specular", 1.0);
    atmosphere_material.set("shine", 1.0);
    atmosphere_material.set("emit", 0.9);

    surface_disc_selector.set("selection", [1]);
    
    earth_atmosphere_selector.set("selection", [1]);
    earth.radius = earth_diameter * surface_earth_scale_factor / 2;
    // earth.km = km / earth.radius;
    // earth.meter = meter / earth.radius;
    earth_sub_graph_scale.set({ 
        x: surface_earth_scale_factor, 
        y: surface_earth_scale_factor, 
        z: surface_earth_scale_factor
    });
    
    var surface_300m = surface.meter * 300;
    surface_lookat_bubble_scale.set({ x: surface_300m, y: surface_300m, z: surface_300m });
    // earth_sub_graph._targetNode._setDirty();
    var optics = camera.get("optics");
    optics.fovy = 50;
    optics.near = 0.10;
    camera.set("optics", optics);
    latitude_line_selector.set("selection",  [0]);
    longitude_line_selector.set("selection", [0]);

    // update the scenegraph lookAt
    var lookat = calculateSurfaceEyeUpLook();
    look_at.set("eye", lookat.eye);
    look_at.set("up", lookat.up);
    look_at.set("look",  lookat.look)

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

setEarthPositionByMon('jun');
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

function incrementYaw(num) {
    yaw += num;
    yaw = modulo(yaw, 360);
    return yaw;
};

function incrementPitch(num) {
    pitch += num;
    if (pitch > max_pitch)  pitch =  max_pitch;
    if (pitch < -max_pitch) pitch = -max_pitch;
    return pitch;
};

function incrementLookatYaw(num) {
    lookat_yaw += num;
    lookat_yaw = modulo(lookat_yaw, 360);
    return lookat_yaw;
};

function incrementSurfaceYaw(num) {
    surface.yaw += num;
    surface.yaw = modulo(surface.yaw, 360);
    return surface.yaw;
};

function incrementSurfacePitch(num) {
    surface.pitch += num;
    if (surface.pitch > max_pitch)  surface.pitch =  max_pitch;
    if (surface.pitch < -max_pitch) surface.pitch = -max_pitch;
    return surface.pitch;
};

function incrementSurfaceLookatYaw(num) {
    surface.lookat_yaw += num;
    surface.lookat_yaw = modulo(surface.lookat_yaw, 360);
    return surface.lookat_yaw;
};

function incrementSurfaceLookatPitch(num) {
    surface.lookat_pitch -= num;
    if (surface.lookat_pitch > max_pitch)  surface.lookat_pitch =  max_pitch;
    if (surface.lookat_pitch < -max_pitch) surface.lookat_pitch = -max_pitch;
    return surface.lookat_pitch;
};

function mouseDown(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    dragging = true;
}

function mouseUp() {
    dragging = false;
}

function modulo(num, mod) {
    if (num < 0) {
        num = mod - (Math.abs(num) % mod);
    };
    num = num % mod;
    return num;
};

function mouseMove(event) {
    if (dragging) {
        
        if (surface_view.checked) {
            // surface.yaw   += (event.clientX - lastX) * -0.2;
            // surface.lookat_pitch -= (event.clientY - lastY) * -0.2;
            surface.yaw          = incrementSurfaceYaw((event.clientX - lastX) * -0.2);
            surface.lookat_pitch = incrementSurfaceLookatPitch((event.clientY - lastY) * -0.2);
        } else {
            // yaw   += (event.clientX - lastX) * -0.2;
            // pitch += (event.clientY - lastY) * -0.2;
            yaw   = incrementYaw((event.clientX - lastX) * -0.2);
            pitch = incrementPitch((event.clientY - lastY) * -0.2);
        };
        lastX = event.clientX;
        lastY = event.clientY;

        updateLookAt();

        if (!keepAnimating) requestAnimFrame(sampleAnimate);
    }
}

function mouseWheel(event) {
    var delta = 0;
    if (!event) event = window.event;
    if (event.wheelDelta) {
        delta = event.wheelDelta / 120;
        if (window.opera) delta = -delta;
    } else if (event.detail) {
        delta = -event.detail / 3;
    }
    if (surface_view.checked) {
        if (delta > 0) {
            incrementSurfaceDistance();
        } else {
            decrementSurfaceDistance();
        };
    } else {
        if (delta > 0) {
            incrementDistance();
        } else {
            decrementDistance();
        };
    };
    updateLookAt();
    if (!keepAnimating) {
        requestAnimFrame(sampleAnimate);
    };
    if (event.preventDefault) {
        event.preventDefault();
    };
    event.returnValue = false;
};

var distanceIncrementFactor = 30;
var distanceIincrement = distance / distanceIncrementFactor;

function setDistance(d) {
    if (d < (earth.radius * 1.5)) d = earth.radius * 1.5;
    distance = d;
    return distance;
};

function incrementDistance() {
    distanceIincrement = distance / distanceIncrementFactor;
    setDistance(distance + distanceIincrement);
    update_initial_eye();
};

function decrementDistance() {
    distanceIincrement = distance / distanceIncrementFactor;
    setDistance(distance - distanceIincrement);
    update_initial_eye();
};

the_canvas.addEventListener('mousedown', mouseDown, true);
the_canvas.addEventListener('mousemove', mouseMove, true);
the_canvas.addEventListener('mouseup', mouseUp, true);
the_canvas.addEventListener('mousewheel', mouseWheel, true);

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
                    incrementLookatYaw(2);
                    evt.preventDefault();
                } else {
                    incrementYaw(-2); 
                    updateLookAt();
                    evt.preventDefault();
                }
                break;

            case 38:                                    // up arrow
                if (evt.ctrlKey) {
                    decrementDistance();
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
                    incrementPitch(-2);
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
                    incrementLookatYaw(-2);
                    updateLookAt();
                    evt.preventDefault();
                } else {
                    incrementYaw(2); 
                    updateLookAt();
                    evt.preventDefault();
                }
                break;

            case 40:                                    // down arrow
                if (evt.ctrlKey) {
                    incrementDistance();
                    evt.preventDefault();
                } else if (evt.altKey) {
                    decrementLatitude(); 
                    evt.preventDefault();
                } else if (evt.metaKey) {
                    evt.preventDefault();
                } else if (evt.shiftKey) {
                    evt.preventDefault();
                } else {
                    incrementPitch(2); 
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
    surface.distance -= Math.log(surface.distance + surface.min_distance * 2) / 10;
    if (surface.distance < surface.min_distance) {
        surface.distance = surface.min_distance;
    };
};

function incrementSurfaceDistance() {
    surface.distance += Math.log(surface.distance + surface.min_distance * 2) / 10;
    if (debug_view.checked) {
        if (surface.distance > surface.max_distance * 100) {
            surface.distance = surface.max_distance * 100;
        };
    } else {
        if (surface.distance > surface.max_distance) {
            surface.distance = surface.max_distance;
        };
    };
};

function handleArrowKeysSurfaceView(evt) {
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
                    incrementSurfaceLookatYaw(2);
                    evt.preventDefault();
                } else {
                    incrementSurfaceYaw(-2);                   // left arrow
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
                    incrementSurfacePitch(2);
                    evt.preventDefault();
                } else {
                    incrementSurfaceLookatPitch(2); 
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
                    incrementSurfaceLookatYaw(-2); 
                    evt.preventDefault();
                } else {
                    incrementSurfaceYaw(2); 
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
                    incrementSurfacePitch(-2);
                    evt.preventDefault();
                } else {
                    incrementSurfaceLookatPitch(-2); 
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
var debug_content = document.getElementById("debug-content");

function debugLabel() {
    if (debug_label) {
        if (debug_view.checked) {
            debug_label.style.opacity = 0.6;
            debug_content.style.display = null;
            surface_lookat_bubble_selector.set("selection", [1]);
        } else {
            debug_content.style.display = "none";
            debug_label.style.opacity = null;
            surface_lookat_bubble_selector.set("selection", [0]);
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
        labelStr += sprintf("Yaw:  %3.0f, Pitch: %4.1f<br>", yaw, pitch);
        labelStr += sprintf("LookAt Yaw:  %4.1f<br>", lookat_yaw);
        labelStr += sprintf("Rot:  %4.1f, Day angle: %3.3f<br>", earth.rotation, day_of_year_angle);
        labelStr += sprintf("Angle: %4.1f, Radius: %4.1f, Dist: %4.1f<br>", angle.get().angle, earth.radius, distance);
        labelStr += "<br><hr><br>";

        labelStr += "<b>Surface</b><br />";
        labelStr += sprintf("Yaw:  %4.1f, Pitch: %4.1f<br>", surface.yaw, surface.pitch);
        labelStr += sprintf("LookAt Yaw:  %4.1f, Pitch: %3.1f<br>", surface.lookat_yaw, surface.lookat_pitch);
        labelStr += sprintf("Distance-surface: %3.3f (x radius)<br>", surface.distance);
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
        labelStr += sprintf("Up  x: %1.5f y: %1.5f z: %1.5f<br>", up.x, up.y, up.z);
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
    var corrected_tilt = Math.sin(day_of_year_angle * deg2rad) * earth.tilt;
    var center   = lat_long_to_cartesian(corrected_tilt, earth.rotation);

    var loc      = lat_long_to_cartesian(lat, lon);
    var xd = center[0] - loc[0];
    var yd = center[1] - loc[1];
    var zd = center[2] - loc[2];
    var d1 = Math.sqrt(xd * xd + yd * yd + zd * zd);
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



// var use_diffuse_correction   = document.getElementById("use-diffuse-correction") || { checked: true, onchange: null };

function useDiffuseCorrectionHandler() {
    clear_solar_radiation_latitude_data();
    clear_solar_radiation_longitude_data();
};

use_diffuse_correction.onchange = useDiffuseCorrectionHandler;

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
            r: Math.max(0, (Math.log(radiation.red   / 10) * 2 + 16) / 4),
            g: Math.max(0, (Math.log(radiation.green / 10) * 2 + 16) / 4),
            b: Math.max(0, (Math.log(radiation.blue  / 10) * 2 + 16) / 4)
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
    if (alt >= 0) {
        if (surface_view.checked) {
            flags.transparent = true;
        };
        if (use_airmass.checked) {
            radiation = spectralSolarRadiation(alt);
            if (surface_view.checked) {
                // day time material settings
                // atmosphere_material.set("alpha", 0.8);
                var alpha = (1 - (1/Math.exp(radiation.total/2))) * 0.5;
                if (alpha > 0.5) alpha = 0.5;
                atmosphere_material.set("alpha", alpha);
                atmosphere_material.set("emit", alpha);
                milky_way_material.set("emit", (alpha - 0.5) * -0.5);                
                surface_disk_material.set(surface.disk.material.day);
                flagpole_material.set(surface.flagpole.material.day);
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
            // night time material settings
            flags.transparent = true;
            atmosphere_material.set("alpha", 0);
            milky_way_material.set("emit", 0.8);
            surface_disk_material.set(surface.disk.material.night);
            flagpole_material.set(surface.flagpole.material.night);
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

        earth.pos.y + Math.sin((surface.latitude - earth.tilt)  * deg2rad) * earth.radius, 
        earth.pos.z + Math.sin(-surface.longitude * deg2rad) * earth.radius 
        
        var solar_alt = solar_altitude(surface.latitude, surface.longitude);
        var solar_rad = solarRadiation(solar_alt);

        var labelStr = "";
        labelStr += "Date: " + date_by_day_number[earth.day_number] + ", ";
        labelStr += earthRotationToTimeStr(earth.rotation - surface.longitude) + ", ";
        // labelStr += sprintf("Sol. Constant:  %4.1f W/m2", solar_flux()) + ", ";
        labelStr += sprintf("Lat: %4.1f, Long:  %4.1f", surface.latitude, surface.longitude) + ", ";
        labelStr += "<br />";
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
        controls_label.style.top = canvas_properties.top + window.pageYOffset + 90 + "px";
        controls_label.style.left = elementGetX(the_canvas) - elementGetX(document.getElementById("content")) + 15 + "px";
    };
};

//
// Info Graph
//
var info_graph   = document.getElementById("info-graph");

var graph_width = 150;
var graph_height = 120;

//
// Graph Dom Elements ...
//

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
        radiation_lat_graph_canvas.height = 1;
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
