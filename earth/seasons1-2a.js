
SceneJS.createNode({
    id: "EarthPointerSprite",
    type: "billboard",
    nodes: [
        {
            type: "texture",
            layers: [ { uri: "images/earth-arrow.png" } ],
            nodes: [
            
                {
                    type: "node",
                    
                    flags: {
                        transparent: true
                    },
                    
                    nodes: [
                    
                        {
                    
                            type: "material",
                            specular: 0.0,
                            emit: 10,
                        
                            nodes: [
                                {
                                    type: "quad",
                                    xSize: sun_radius_km * 20, ySize: sun_radius_km * 20,
                                }
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
    id: "theScene1",
    canvasId: "theCanvas1",
    loggingElementId: "theLoggingDiv1",
    
    nodes: [

        {
            type: "library",

            nodes: [
                {
                    type: "camera",
                    id: "theCamera1",
                    optics: {
                        type: "perspective",
                        fovy : 45.0,
                        aspect : 1.43,
                        near : earth_view_small_offset,
                        far : milky_way_apparent_radius * 10,
                    },

                    nodes: [
                    
                        
                        // Integrate our sky sphere, which is defined in sky-sphere.js
                        
                        {
                            type: "rotate",
                            id: "earth1-milkyway-rotation",
                            angle: 0,
                            y: 1.0,
                            
                            nodes: [
                                {
                                    type : "instance",
                                    target :"sky-sphere"
                                },
                            ]
                        },
                        

                        // Integrate our sun, which is defined in sun.js
                        {
                            type : "instance",
                            target :"sun"
                        },

                        // Integrate our earth circular orbit, which is defined in earth-orbit.js
                        {
                            type : "instance",
                            target :"earthCircleOrbit"
                        },

                        // Integrate our earth elliptical orbit, which is defined in earth-orbit.js
                        {
                            type : "instance",
                            target :"earthEllipseOrbit"
                        },

                        {
                            type   : "instance",
                            target : "orbit-grid"
                        },


                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: 3.0, g: 3.0, b: 3.0 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 1.0, y: 0.0, z: 0.0 }
                        },
                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: 0.1, g: 0.1, b: 0.1 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 0.0, y: 1.0, z: -1.0 }
                        },
                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: 0.1, g: 0.1, b: 0.1 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: -1.0, y: 0.0, z: -1.0 }
                        },

                        {
                            type: "material",
                            baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
                            specularColor:  { r: 1.0, g: 1.0, b: 1.0 },
                            specular:       1.0,
                            shine:          2.0,
                            emit:           1.0,

                            nodes: [
                            
                                {
                                    type : "instance",
                                    target :"earth-circle-orbit-sun-line"
                                }
                            ]
                        },
                        
                        {
                            type: "translate",
                            id: "earth-label",
                            x: earth_x_pos, y: sun_radius_km * 10.5, z: 0,
                            nodes: [
                                {
                                    type: "instance",
                                    target: "EarthPointerSprite"
                                }
                            ]
                        },

                        {
                            type: "quaternion",
                            id: "earthRotationalAxisQuaternion1",
                            x: 0.0, y: 0.0, z: 0.0, angle: 0.0,
                    
                            rotations: [ { x : 0, y : 0, z : 1, angle : -23.5 } ],

                            nodes: [

                                {
                                    type : "instance",
                                    target :"earth-axis"
                                },

                                {
                                    type : "instance",
                                    target :"earth"
                                }
                            ]
                        }
                    ]
                }
            ]
        },

        {
            type: "lookAt", 
            id: "lookAt1",
            eye : initial_earth_eye,
            look : { x : earth_x_pos, y : 0.0, z : 0.0 },
            up : { x: 0.0, y: 1.0, z: 0.0 },
            nodes: [ { type: "instance", target: "theCamera1" } ]
        }
    ]
});

/*----------------------------------------------------------------------
 * Canvas 3
 *---------------------------------------------------------------------*/

SceneJS.createNode({
    
    type: "scene",
    id: "theScene3",
    canvasId: "theCanvas3",
    loggingElementId: "theLoggingDiv3",
    
    nodes: [

        {
            type: "library",

            nodes: [

                {
                    type: "camera",
                    id: "theCamera3",
                    optics: {
                        type: "perspective",
                        fovy : 50.0,
                        aspect : 1.43,
                        near : earth_view_small_offset,
                        far : milky_way_apparent_radius * 10,
                    },

                    nodes: [
                    
                        {
                            type: "rotate",
                            id: "earth3-milkyway-rotation",
                            angle: 0,
                            y: 1.0,
                            
                            nodes: [

                                // First simulate the milky-way with a stationary background sphere
                                {
                                    type: "stationary",    
                                    id: "sky-sphere3",

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
                                }
                            ]
                        },
                        
                        {

                            id: "sun",
                            type: "material",
                            baseColor:      { r: 1.0, g: 0.95, b: 0.6 },
                            specularColor:  { r: 1.0, g: 0.95, b: 0.6 },
                            specular:       2.0,
                            shine:          2.0,
                            emit:           1.0,

                            nodes: [

                                {
                                    type: "translate",
                                    x: sun_x_pos,
                                    y: 0,
                                    z: 0,

                                    nodes: [
                                        {
                                            type: "scale",
                                            x: sun_radius_km,
                                            y: sun_radius_km,
                                            z: sun_radius_km,

                                            nodes: [  { type: "sphere", slices: 60, rings: 60 } ]

                                        }
                                    ]
                                }
                            ]
                        },
                        
                        {
                            type: "material",
                            baseColor:      { r: 1.0, g: 0.3, b: 0.1 },
                            specularColor:  { r: 1.0, g: 0.3, b: 0.1 },
                            specular:       1.0,
                            shine:          2.0,
                            emit:           1.0,
                        
                            nodes: [

                                {
                                    type: "geometry",
                                    primitive: "line-loop",

                                    positions: [
                                         sun_x_pos,     0.0,    0.0,
                                         earth_x_pos,   0.0,    0.0
                                    ],

                                    indices : [ 0, 1 ]

                                }
                            ]
                        },
 
                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: 3.0, g: 3.0, b: 3.0 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 1.0, y: 0.0, z: 0.0 }
                        },
                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: 0.1, g: 0.1, b: 0.1 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 0.0, y: 1.0, z: -1.0 }
                        },
                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: 0.1, g: 0.1, b: 0.1 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: -1.0, y: 0.0, z: -1.0 }
                        },
                        
                        {
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
                                                            type: "instance",
                                                            target: "earth-in-space-elliptical-orbital-path"
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
                            baseColor:      { r: 0.4, g: 0.6, b: 0.4 },
                            specularColor:  { r: 0.4, g: 0.6, b: 0.4 },
                            specular:       1.0,
                            shine:          2.0,
                            emit:           1.0,

                            nodes: [

                                {
                                    type: "translate",
                                    x: sun_x_pos,
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
                                                    id: "earth3-orbit-grid-selector",
                                                    selection: [0],
                                                    nodes: [ 

                                                        // 0: off

                                                        {  },

                                                        // 1: on: orbit grid for Earth view

                                                        {
                                                            type: "geometry",
                                                            primitive: "lines",

                                                            positions: orbit_grid_earth_positions,
                                                            indices : orbit_grid_earth_indices

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
                            type: "translate",
                            id : "earth3-position",
                            x: earth_x_pos,
                            y: 0,
                            z: 0,
                        
                            nodes: [

                                {
                                    type: "quaternion",
                                    id: "earthRotationalAxisQuaternion3",
                                    x: 0.0, y: 0.0, z: 0.0, angle: 0.0,

                                    rotations: [ { x : 0, y : 0, z : 1, angle : -23.44 } ],

                                    nodes: [

                                        {

                                            type: "selector",
                                            id: "earthTextureSelector3",
                                            selection: [1],
                                            nodes: [

                                                {
                                                    id: "earthTemperatureTextureSelector3",
                                                    type: "selector",
                                                    selection: [0],
                                                    nodes: [


                                                        // selection [0], March
                                                        {
                                                            type: "texture",
                                                            layers: [
                                                                { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                                { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                                { uri:"images/temperature/grads-temperature-2009-03.png", blendMode: "multiply" }
                                                            ],
                                                            nodes: [ { type : "instance", target : "earth-sphere3"  } ]

                                                        },

                                                        // selection [1], June
                                                        {
                                                            type: "texture",
                                                            layers: [
                                                                { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                                { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                                { uri:"images/temperature/grads-temperature-2009-06.png", blendMode: "multiply" }
                                                            ],
                                                            nodes: [ { type : "instance", target : "earth-sphere3"  } ]
                                                
                                                        },

                                                        // selection [2], September
                                                        {
                                                            type: "texture",
                                                            layers: [
                                                                { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                                { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                                { uri:"images/temperature/grads-temperature-2009-09.png", blendMode: "multiply" }
                                                            ],
                                                            nodes: [ { type : "instance", target : "earth-sphere3"  } ]

                                                        },


                                                        // selection [3], December
                                                        {
                                                            type: "texture",
                                                            layers: [
                                                                { uri:"images/earth-continental-outline-edges-invert.png", blendMode: "multiply" },
                                                                { uri:"images/lat-long-grid-invert-units-1440x720-15.png", blendMode: "add" },
                                                                { uri:"images/temperature/grads-temperature-2009-12.png", blendMode: "multiply" }
                                                            ],
                                                            nodes: [ { type : "instance", target : "earth-sphere3"  } ]

                                                        }                                
                                                    ]
                                                },

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

                                                        /* Specify the amounts of ambient, diffuse and specular
                                                         * lights our object reflects
                                                         */
                                                        {
                                                            id : "earth-sphere3",
                                                            type: "material",
                                                            baseColor:      { r: 0.6, g: 0.6, b: 0.6 },
                                                            specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
                                                            specular:       0.0,
                                                            shine:          2.0,

                                                            nodes: [

                                                                {

                                                                    type: "scale",
                                                                    x: earth_radius_km,
                                                                    y: earth_radius_km,
                                                                    z: earth_radius_km,

                                                                    nodes: [

                                                                        {

                                                                            type: "rotate",
                                                                            id: 'earth-rotation3',
                                                                            angle: 0,
                                                                            y: 1.0,

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
                        }
                    ]
                }
            ]
        },
        {
            type: "lookAt", 
            id: "lookAt3",
            eye : initial_earth_eye,
            look : { x : earth_x_pos, y : 0, z : 0.0 },
            up : { x: 0.0, y: 1.0, z: 0.0 },

            nodes: [ 
        
                { 
                    type: "instance", 
                    target: "theCamera3"
                } 
            ]
        }
    ]
});

/*----------------------------------------------------------------------
 * Scene rendering loop and mouse handler stuff follows
 *---------------------------------------------------------------------*/

var earth_yaw = normalized_initial_earth_eye.x;
var earth_pitch = normalized_initial_earth_eye.y;

var earth_yaw3 = normalized_initial_earth_eye.x;
var earth_pitch3 = normalized_initial_earth_eye.y;

var sun_yaw =   initial_sun_eye.x;
var sun_pitch = initial_sun_eye.y;

var lastX1;
var lastY1;
var dragging1 = false;

var lastX3;
var lastY3;

var yaw3 = 0;
var pitch3 = 0;
var lastX3;
var lastY3;
var dragging3 = false;

var canvas1 = document.getElementById("theCanvas1");
var canvas3 = document.getElementById("theCanvas3");


function setAspectRatio(camera, canvas) {
    var optics = SceneJS.withNode(camera).get("optics");
    optics.aspect = canvas.clientWidth/canvas.clientHeight;
    SceneJS.withNode(camera).set("optics", optics);
}

setAspectRatio("theCamera1", canvas1);
setAspectRatio("theCamera3", canvas3);

function setCamera(camera, settings) {
    var optics = SceneJS.withNode(camera).get("optics");
    for(prop in settings) optics[prop] = settings[prop];
    SceneJS.withNode(camera).set("optics", optics);
}

setCamera("theCamera1", initial_sun_camera);
setCamera("theCamera3", initial_earth_camera);

var earth_surface = document.getElementById("earth_surface");
var perspective = document.getElementById("perspective");

// var circle_orbital_path = document.getElementById("circle-orbital-path");
var orbital_grid = document.getElementById("orbital-grid");

var solar_radiation_graph = document.getElementById("solar-radiation-graph");
var sun_earth_distance_graph = document.getElementById("sun-earth-distance-graph");

var orbit_grid_selector = SceneJS.withNode("orbit-grid-selector");
var earth3_orbit_grid_selector = SceneJS.withNode("earth3-orbit-grid-selector");

var earth_label = SceneJS.withNode("earth-label");

var time_of_year_buttons = document.getElementById("radio-time-of-year");



var look1 = SceneJS.withNode("lookAt1")
var look3 = SceneJS.withNode("lookAt3")


// Time of year changes inclination of Earths orbit with respect to the orbital plane

var time_of_year = document.getElementById("time_of_year");
var color_map = document.getElementById("temperature-color-map");
if (color_map) color_map.style.display='none';

var simulation_controls = document.getElementById("simulation-controls");
simulation_controls.style.display='none';

var selected_city_latitude = document.getElementById("selected-city-latitude");
var city_option;
var active_cities = [];
var city, city_location;

for (var c = 0; c < cities.length; c++) {
    if (cities[c].active) active_cities.push(cities[c]);
};

for (var i = 0; i < active_cities.length; i++) {
    city_option = document.createElement('option');
    city = active_cities[i];
    city_location = city.location;
    city_option.value = i;
    city_option.textContent = city.name + ', ' + city.country + ', ' + 
        sprintf("%2.0f", city_location.latitude) + ' degrees ' + city_location.lat_dir;
    selected_city_latitude.appendChild(city_option);
}

var select_city_month = document.getElementById("select-city-month");
var selected_city_month = document.getElementById("selected-city-month");

var city_latitude_temperature = document.getElementById("city-latitude-temperature");
var city_latitude_temperature_label = document.getElementById("city-latitude-temperature-label");
var city_latitude_temperature_prediction = document.getElementById("city-latitude-temperature-prediction");

var city_data_table = document.getElementById("city-data-table");
var city_data_table_body = document.getElementById("city-data-table-body");

var month_data = {
    "jan": { index:  0, num:   1, short_name: 'Jan', long_name: 'January' },
    "feb": { index:  1, num:   2, short_name: 'Feb', long_name: 'February' },
    "mar": { index:  2, num:   3, short_name: 'Mar', long_name: 'March' },
    "apr": { index:  3, num:   4, short_name: 'Apr', long_name: 'April' },
    "may": { index:  4, num:   5, short_name: 'May', long_name: 'May' },
    "jun": { index:  5, num:   6, short_name: 'Jun', long_name: 'June' },
    "jul": { index:  6, num:   7, short_name: 'Jul', long_name: 'July' },
    "aug": { index:  7, num:   8, short_name: 'Aug', long_name: 'August' },
    "sep": { index:  8, num:   9, short_name: 'Sep', long_name: 'September' },
    "oct": { index:  9, num:  10, short_name: 'Oct', long_name: 'October' },
    "nov": { index: 10, num:  11, short_name: 'Nov', long_name: 'Novemeber' },
    "dec": { index: 11, num:  12, short_name: 'Dec', long_name: 'December' }
};

var month_names = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

var seasons = ["Fall", "Winter", "Spring", "Summer"];

var table_row, table_data;

var graph_checkbox_callbacks = {};

var city_data_to_plot = [];
for (var i = 0; i < active_cities.length; i++) {
    city_data_to_plot.push({});
    var city_data = city_data_to_plot[i];
    var city = active_cities[i];
    city_data.label = city.name;
    city_data.lines = { show: true };
    city_data.points = { show: true };
    city_data.data = [];
    for (var m = 0; m < 12; m++) {
        city_data.data.push([m, null]);
    };
};

var city_x_axis_tics = [];
for (var i = 0; i < 12; i++) {
    city_x_axis_tics.push([i, month_data[month_names[i]].long_name]);
};

function addExperimentData() {
    if (selected_city_latitude.value == 'city ...' || 
        selected_city_month.value == 'month ...' ||
        city_latitude_temperature_prediction.value == '') {
        return false;
    }
    var city_index = Number(selected_city_latitude.value);
    var city = active_cities[city_index];
    var city_location = city.location;
    var month = month_data[selected_city_month.value];
    var city_element_id = 'city_' + city_index + '_' + selected_city_month.value;
    
    // if the City/Month row already exists in the 
    // data table return without adding a new one
    if (document.getElementById(city_element_id)) return false;
    
    table_row = document.createElement('tr');
    table_data = document.createElement('td');
    table_data.innerText = city.name;
    table_row.appendChild(table_data);

    table_data = document.createElement('td');
    table_data.innerText = month.short_name;
    table_row.appendChild(table_data);

    table_data = document.createElement('td');
    var ave_temp = city.average_temperatures[month.index];
    if (use_fahrenheit) ave_temp = ave_temp * 9 / 5 + 32;
    table_data.innerText = sprintf("%3.1f", ave_temp);
    table_row.appendChild(table_data);

    table_data = document.createElement('td');
    table_data.innerText = city_latitude_temperature_prediction.value;
    table_row.appendChild(table_data);

    table_data = document.createElement('td');
    var select, option;
    select = document.createElement('select');
    select.name = 'season_city_' + city_element_id;
    select.id = 'season_city_' + city_element_id; 
    for (i = 0; i < seasons.length; i++) {
        option = document.createElement('option');
        option.value = seasons[i];
        option.innerText = seasons[i];
        select.appendChild(option);
    };
    option = document.createElement('option');
    option.value = "I'm not sure";
    option.innerText = "I'm not sure";
    select.appendChild(option);
    table_data.appendChild(select);
    table_row.appendChild(table_data);

    
    // <select id="selected-city-month" name="selected-city-month">
    //   <option disabled selected>date ...</option>
    //   <option value="dec">Dec 21</option>
    //   <option value="mar">Mar 21</option>
    //   <option value="jun">Jun 21</option>
    //   <option value="sep">Sep 21</option>
    // </select>

    table_data = document.createElement('td');
    var graph_checkbox = document.createElement('input');
    graph_checkbox.id = city_element_id;    
    graph_checkbox.type = "checkbox";
    table_data.appendChild(graph_checkbox);
    table_row.appendChild(table_data);

    var graph_checkbox_callback = function(event) {
        var id_parts = this.id.split(/_/)
        var city_index = id_parts[1];
        var city_data = city_data_to_plot[city_index];
        var city = active_cities[city_index];
        var city_location = city.location;
        var month = month_data[id_parts[2]];
        var temperature = city.average_temperatures[month.index];
        if (use_fahrenheit) temperature = temperature * 9 / 5 + 32;
        if (this.checked) {
            city_data.data[month.index] = [month.index, temperature]
        } else {
            city_data.data[month.index] = [month.index, null]
        };
        plotCityData();
    };
    
    graph_checkbox_callbacks[graph_checkbox.id] = graph_checkbox_callback;
    graph_checkbox.onchange = graph_checkbox_callback;

    city_data_table_body.appendChild(table_row);
    return false;
}

city_latitude_temperature.onsubmit = addExperimentData;


var use_fahrenheit = true;

if (use_fahrenheit) {
    city_latitude_temperature_label.innerText = 
    city_latitude_temperature_label.innerText.replace(/(C|F)$/, 'F')
} else {
    city_latitude_temperature_label.innerText = 
    city_latitude_temperature_label.innerText.replace(/(C|F)$/, 'C')    
}

var y_axis = { title: 'Temperature deg C', min: -30, max: 60 };
var graph_degree_string = "deg C";

if (use_fahrenheit) {
    graph_degree_string = "deg F"
    y_axis.title = 'Temperature deg F';
    y_axis.min = y_axis.min * 9 / 5 + 32;
    y_axis.max = y_axis.max * 9 / 5 + 32;
}


function plotCityData() {
    var f = Flotr.draw($('theCanvas4'), city_data_to_plot, 
      {
        xaxis:{ 
          labelsAngle: 60, 
          ticks: city_x_axis_tics,
          title: 'Month', 
          noTics: city_x_axis_tics.length,
          min: 0, max: city_x_axis_tics.length - 1,
        },
        yaxis: y_axis,
        title: "Average Monthly Temperatures",
        grid:{ verticalLines: true, backgroundColor: 'white' },
        HtmlText: false,
        legend: { position: 'nw', margin: 1, backgroundOpacity: 0.1 },
        mouse:{
          track: true,
          lineColor: 'purple',
          relative: true,
          position: 'nw',
          sensibility: 1, // => The smaller this value, the more precise you've to point
          trackDecimals: 1,
          trackFormatter: function(obj) { 
            return obj.series.label + ': ' + month_data[month_names[Number(obj.x)]].short_name +  ', ' + obj.y + ' ' + graph_degree_string;
          }
        },
        crosshair:{ mode: 'xy' }
      }
    );
};

plotCityData();


var seasonal_rotations = {};
seasonal_rotations.jun = { x :  0,  y : 0,  z : -1,  angle : 23.44 };
seasonal_rotations.sep = { x :  1,  y : 0,  z :  0,  angle : 23.44 };
seasonal_rotations.dec = { x :  0,  y : 0,  z :  1,  angle : 23.44 };
seasonal_rotations.mar = { x : -1,  y : 0,  z :  0,  angle : 23.44 };

var earth_postion = SceneJS.withNode("earth-position");

var earth_sun_line_rotation = SceneJS.withNode("earth-sun-line-rotation");
var earth_sun_line_translation = SceneJS.withNode("earth-sun-line-translation");

var earth3_milkyway_rotation = SceneJS.withNode("earth3-milkyway-rotation");

function setTemperatureTexture(month) {
    switch (month) {
    case 'mar' : 
        SceneJS.withNode("earthTemperatureTextureSelector3").set("selection", [0]);
        break;
        
    case 'jun' : 
        SceneJS.withNode("earthTemperatureTextureSelector3").set("selection", [1]);
        break;

    case 'sep' : 
        SceneJS.withNode("earthTemperatureTextureSelector3").set("selection", [2]); 
        break;

    case 'dec' : 
        SceneJS.withNode("earthTemperatureTextureSelector3").set("selection", [3]); 
        break;
    };    
}

var earth3_milkyway_rotation = SceneJS.withNode("earth3-milkyway-rotation");

function setMilkyWayRotation(month) {
    switch (month) {
        case 'mar' : 
            earth3_milkyway_rotation.set("angle", 270);            
            break;

        case 'jun' : 
            earth3_milkyway_rotation.set("angle", 0);
            break;

        case 'sep' : 
            earth3_milkyway_rotation.set("angle", 90);
            break;

        case 'dec' : 
            earth3_milkyway_rotation.set("angle", 180);
            break;
    };
}


var earth_sun_line_rotation = SceneJS.withNode("earth-sun-line-rotation");
var earth_sun_line_translation = SceneJS.withNode("earth-sun-line-translation");
var earth_sun_line_selector = SceneJS.withNode("earthSunLineSelector");

function earth_sun_line(month, view) {
    var new_location = earth_circle_location_by_month(month);
    switch(view) {
        case "orbit":
        switch(month) {
            case "jun":
            earth_sun_line_rotation.set("angle", 180);
            earth_sun_line_translation.set({ x: -earth_orbital_radius_km / 2 , y: 0.0, z: 0 });
            break;
            case "sep":
            earth_sun_line_rotation.set("angle", 90);
            earth_sun_line_translation.set({ x: sun_x_pos, y: 0.0, z: earth_orbital_radius_km / 2 });
            break;
            case "dec":
            earth_sun_line_rotation.set("angle", 0);
            earth_sun_line_translation.set({ x: earth_orbital_radius_km / 2 , y: 0.0, z: 0 });
            break;
            case "mar":
            earth_sun_line_rotation.set("angle", 270);
            earth_sun_line_translation.set({ x: sun_x_pos, y: 0.0, z: -earth_orbital_radius_km / 2 });
            break;
        }
        SceneJS.Message.sendMessage({ 
          command: "update", 
          target: "earthRotationalAxisQuaternion", 
          set: { rotation: seasonal_rotations[month] }
        });
    }
}

var choose_month = document.getElementById("choose-month");
var month;
for(var i = 0; i < choose_month.elements.length; i++)
    if (choose_month.elements[i].checked) month = choose_month.elements[i].value;


var earth3_position = SceneJS.withNode("earth3-position");

var get_earth3_postion = function() {
    var ep = earth3_position.get();
    return [ep.x, ep.y, ep.z];
}

var set_earth3_postion = function(newpos) {
    earth3_position.set({ x: newpos[0], y: newpos[1], z: newpos[2] })
}

var get_normalized_earth3_eye = function(look_at) {
    var normalized_eye = {};
    var eye = look_at.get("eye");
    var ep = earth3_position.get();
    normalized_eye.x = eye.x - ep.x;
    normalized_eye.y = eye.y - ep.y;
    normalized_eye.z = eye.z - ep.z;
    return normalized_eye;
}

var set_normalized_earth3_eye = function(look_at, normalized_eye) {
    var eye = {}
    var ep = earth3_position.get();
    eye.x = normalized_eye.x + ep.x;
    eye.y = normalized_eye.y + ep.y;
    eye.z = normalized_eye.z + ep.z;
    var eye = look_at.set("eye", eye);
}

var update_earth3_look_at = function(look_at, normalized_eye) {
    var eye = {};
    var ep = earth3_position.get();
    eye.x = normalized_eye.x + ep.x;
    eye.y = normalized_eye.y + ep.y;
    eye.z = normalized_eye.z + ep.z;

    look_at.set("look", ep );
    look_at.set("eye",  eye );
}


function chooseMonthChange() {
    var current_month = month;
    for(var i = 0; i < this.elements.length; i++) {
        if (this.elements[i].checked) month = this.elements[i].value;        
    }

    set_earth_postion(earth_ellipse_location_by_month(month));
    set_earth3_postion(earth_ellipse_location_by_month(month));
    update_earth3_look_at(look3, normalized_initial_earth_eye_side);

    // set_earth_sun_line(month, look_at_selection);
    // setTemperatureTexture(month);
    // SceneJS.Message.sendMessage({ 
    //   command: "update", 
    //   target: "earthRotationalAxisQuaternion", 
    //   set: { rotation: seasonal_rotations[month] }
    // });
    // if (earth_surface === 'terrain') {
    //     SceneJS.withNode("earthTextureSelector").set("selection", [1]);
    // } else {
    //     SceneJS.withNode("earthTextureSelector").set("selection", [0]);
    // }
    setMilkyWayRotation(month);

    var ep = get_earth_postion();
    earth_label.set({ x: ep[0], z: ep[2] });
}

choose_month.onchange = chooseMonthChange;
choose_month.onchange();

// Texture mapping onto the Earth's surface

function earthSurfaceChange() {
  var new_surface = this.value;
  if (new_surface === 'terrain') {
      SceneJS.withNode("earthTextureSelector3").set("selection", [1]);
      color_map.style.display='none';
  } else {
      SceneJS.withNode("earthTextureSelector3").set("selection", [0]);
      setTemperatureTexture(month);
      color_map.style.display='inline';  
  }
}

if (color_map) {
    earth_surface.onchange = earthSurfaceChange;
    earth_surface.onchange();
};

// Orbital Paths Indicators

function circleOrbitalPathChange() {
  if (circle_orbital_path.checked) {
      SceneJS.withNode("earthCircleOrbitSelector").set("selection", [2]);
  } else {
      SceneJS.withNode("earthCircleOrbitSelector").set("selection", [0]);
  }
}

SceneJS.withNode("earthCircleOrbitSelector").set("selection", [0])


// Orbital Grid

function orbitalGridChange() {
  if (orbital_grid.checked) {
      orbit_grid_selector.set("selection", [2]);
      earth3_orbit_grid_selector.set("selection", [1])
  } else {
      orbit_grid_selector.set("selection", [0]);
      earth3_orbit_grid_selector.set("selection", [0]);
  }
}

orbital_grid.onchange = orbitalGridChange;
orbital_grid.onchange();

// Perspective Frame

var choose_view = document.getElementById("choose-view");
var view_selection;

function perspectiveChange() {
    for(var i = 0; i < this.elements.length; i++)
        if (this.elements[i].checked) view_selection = this.elements[i].value;
    switch(view_selection) {
        case "top":
        look1.set("eye",  initial_sun_eye_top );
        look1.set("look", { x: sun_x_pos, y : 0.0, z : 0.0 } );
        look1.set("up",  { x: 0.0, y: 1.0, z: 0.0 } );

        look3.set("eye",  initial_earth_eye_top );
        look3.set("look", { x: earth_x_pos, y : 0.0, z : 0.0 } );
        look3.set("up",  { x: 0.0, y: 1.0, z: 0.0 } );
        break;

        case "side":
        look1.set("eye",  initial_sun_eye_side );
        look1.set("look", { x: sun_x_pos, y : 0.0, z : 0.0 } );
        look1.set("up",  { x: 0.0, y: 1.0, z: 0.0 } );

        look3.set("eye",  initial_earth_eye_side );
        look3.set("look", { x: earth_x_pos, y : 0.0, z : 0.0 } );
        look3.set("up",  { x: 0.0, y: 1.0, z: 0.0 } );
        break;
  }
  sun_yaw =   0;
  sun_pitch = 0;
  SceneJS.withNode("theScene1").render();
  SceneJS.withNode("theScene3").render();
}

choose_view.onchange = perspectiveChange;
choose_view.onchange();

function mouseDown1(event) {
    lastX1 = event.clientX;
    lastY1 = event.clientY;
    dragging1 = true;
}

function mouseUp1() {
    dragging1 = false;
}

function mouseOut1() {
    dragging1 = false;
}

/* On a mouse drag, we'll re-render the scene, passing in
 * incremented angles in each time.
 */
function mouseMove1(event) {
    if (dragging1) {
        var look, eye, eye4, eye4dup, neweye;

        var up_downQ, up_downQM, left_rightQ, left_rightQM;

        var f, up_down_axis, angle, new_yaw, new_pitch;
        
        new_yaw = (event.clientX - lastX1) * -0.2;
        new_pitch = (event.clientY - lastY1) * 0.2;
        
        lastX1 = event.clientX;
        lastY1 = event.clientY;

        look = SceneJS.withNode("lookAt1");

        sun_yaw += new_yaw;
        sun_pitch += new_pitch;

        switch(view_selection) {
            case "top":
                eye4 = [initial_sun_eye_top.x, initial_sun_eye_top.y, initial_sun_eye_top.z, 1];
                break;
            case "side":
                eye4 = [initial_sun_eye_side.x, initial_sun_eye_side.y, initial_sun_eye_side.z, 1];
                break;
        }

        left_rightQ = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle : sun_yaw });
        left_rightQM = left_rightQ.getMatrix();

        neweye = SceneJS._math_mulMat4v4(left_rightQM, eye4);
        console.log("dragging: yaw: " + sun_yaw + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2]);

        eye4 = SceneJS._math_dupMat4(neweye);
        eye4dup = SceneJS._math_dupMat4(eye4);

        up_downQ = new SceneJS.Quaternion({ x : left_rightQM[0], y : 0, z : left_rightQM[2], angle : sun_pitch });
        up_downQM = up_downQ.getMatrix();

        neweye = SceneJS._math_mulMat4v4(up_downQM, eye4);

        console.log("dragging: pitch: " + sun_pitch + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2] );

        look.set("eye", { x: neweye[0], y: neweye[1], z: neweye[2] });
        // SceneJS.withNode("theScene").start();
        eye = look.get("eye");
        console.log("");
        
        //
        //
        
        look3 = SceneJS.withNode("lookAt3");
        
        var look_at_selection = "earth";

        switch(look_at_selection) {
            case "orbit":
            sun_yaw += new_yaw;
            sun_pitch += new_pitch;
            eye4 = [initial_sun_eye.x, initial_sun_eye.y, initial_sun_eye.z, 1];

            left_rightQ = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle : sun_yaw });
            left_rightQM = left_rightQ.getMatrix();

            neweye = SceneJS._math_mulMat4v4(left_rightQM, eye4);
            console.log("dragging: yaw: " + sun_yaw + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2]);

            eye4 = SceneJS._math_dupMat4(neweye);
            eye4dup = SceneJS._math_dupMat4(eye4);

            up_downQ = new SceneJS.Quaternion({ x : left_rightQM[0], y : 0, z : left_rightQM[2], angle : sun_pitch });
            up_downQM = up_downQ.getMatrix();

            neweye = SceneJS._math_mulMat4v4(up_downQM, eye4);

            console.log("dragging: pitch: " + sun_pitch + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2] );
            break;

            case 'earth':
            earth_yaw3   += new_yaw;
            earth_pitch3 += new_pitch;
            
            
            switch(view_selection) {
                case "top":
                    eye4 = [normalized_initial_earth_eye_top.x, 
                        normalized_initial_earth_eye_top.y, 
                        normalized_initial_earth_eye_top.z, 1];
                    break;
                case "side":
                    eye4 = [normalized_initial_earth_eye_side.x, 
                        normalized_initial_earth_eye_side.y, 
                        normalized_initial_earth_eye_side.z, 1];
                    break;
            }
            
            eye4 = [normalized_initial_earth_eye.x, normalized_initial_earth_eye.y, normalized_initial_earth_eye.z, 1];

            left_rightQ = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle : earth_yaw3 });
            left_rightQM = left_rightQ.getMatrix();

            neweye = SceneJS._math_mulMat4v4(left_rightQM, eye4);
            console.log("dragging: yaw: " + earth_yaw3 + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2]);

            eye4 = SceneJS._math_dupMat4(neweye);
            eye4dup = SceneJS._math_dupMat4(eye4);

            up_downQ = new SceneJS.Quaternion({ x : left_rightQM[0], y : 0, z : left_rightQM[2], angle : earth_pitch3 });
            up_downQM = up_downQ.getMatrix();

            neweye = SceneJS._math_mulMat4v4(up_downQM, eye4);

            console.log("dragging: pitch: " + earth_pitch3 + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2] );

            neweye[0] = neweye[0] + earth_x_pos;
            break;
        }

        look3.set("eye", { x: neweye[0], y: neweye[1], z: neweye[2] });
        // SceneJS.withNode("theScene").start();
        eye = look3.get("eye");
        console.log("");
        
    }
}

canvas1.addEventListener('mousedown', mouseDown1, true);
canvas1.addEventListener('mousemove', mouseMove1, true);
canvas1.addEventListener('mouseup', mouseUp1, true);
canvas1.addEventListener('mouseout', mouseOut1, true);


function mouseDown3(event) {
    lastX3 = event.clientX;
    lastY3 = event.clientY;
    dragging3 = true;
}

function mouseUp3() {
    dragging3 = false;
}

function mouseOut3() {
    dragging3 = false;
}

/* On a mouse drag, we'll re-render the scene, passing in
 * incremented angles in each time.
 */
function mouseMove3(event) {
    if (dragging3) {

        var look3, eye, eye4, eye4dup, neweye;

        var up_downQ, up_downQM, left_rightQ, left_rightQM;

        var f, up_down_axis, angle, new_yaw, new_pitch;
        
        new_yaw = (event.clientX - lastX3) * -0.2;
        new_pitch = (event.clientY - lastY3) * 0.2;
        
        lastX3 = event.clientX;
        lastY3 = event.clientY;

        look3 = SceneJS.withNode("lookAt3");
        
        var look_at_selection = "earth";

        switch(look_at_selection) {
            case "orbit":
            sun_yaw += new_yaw;
            sun_pitch += new_pitch;
            eye4 = [initial_sun_eye.x, initial_sun_eye.y, initial_sun_eye.z, 1];

            left_rightQ = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle : sun_yaw });
            left_rightQM = left_rightQ.getMatrix();

            neweye = SceneJS._math_mulMat4v4(left_rightQM, eye4);
            console.log("dragging: yaw: " + sun_yaw + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2]);

            eye4 = SceneJS._math_dupMat4(neweye);
            eye4dup = SceneJS._math_dupMat4(eye4);

            up_downQ = new SceneJS.Quaternion({ x : left_rightQM[0], y : 0, z : left_rightQM[2], angle : sun_pitch });
            up_downQM = up_downQ.getMatrix();

            neweye = SceneJS._math_mulMat4v4(up_downQM, eye4);

            console.log("dragging: pitch: " + sun_pitch + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2] );
            break;

            case 'earth':
            earth_yaw3   += new_yaw;
            earth_pitch3 += new_pitch;
            
            
            switch(view_selection) {
                case "top":
                    eye4 = [normalized_initial_earth_eye_top.x, 
                        normalized_initial_earth_eye_top.y, 
                        normalized_initial_earth_eye_top.z, 1];
                    break;
                case "side":
                    eye4 = [normalized_initial_earth_eye_side.x, 
                        normalized_initial_earth_eye_side.y, 
                        normalized_initial_earth_eye_side.z, 1];
                    break;
            }
            
            eye4 = [normalized_initial_earth_eye.x, normalized_initial_earth_eye.y, normalized_initial_earth_eye.z, 1];

            left_rightQ = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle : earth_yaw3 });
            left_rightQM = left_rightQ.getMatrix();

            neweye = SceneJS._math_mulMat4v4(left_rightQM, eye4);
            console.log("dragging: yaw: " + earth_yaw3 + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2]);

            eye4 = SceneJS._math_dupMat4(neweye);
            eye4dup = SceneJS._math_dupMat4(eye4);

            up_downQ = new SceneJS.Quaternion({ x : left_rightQM[0], y : 0, z : left_rightQM[2], angle : earth_pitch3 });
            up_downQM = up_downQ.getMatrix();

            neweye = SceneJS._math_mulMat4v4(up_downQM, eye4);

            console.log("dragging: pitch: " + earth_pitch3 + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2] );

            neweye[0] = neweye[0] + earth_x_pos;
            break;
        }

        look3.set("eye", { x: neweye[0], y: neweye[1], z: neweye[2] });
        // SceneJS.withNode("theScene").start();
        eye = look3.get("eye");
        console.log("");
        
        
        
        //
        //

        look = SceneJS.withNode("lookAt1");

        sun_yaw += new_yaw;
        sun_pitch += new_pitch;

        switch(view_selection) {
            case "top":
                eye4 = [initial_sun_eye_top.x, initial_sun_eye_top.y, initial_sun_eye_top.z, 1];
                break;
            case "side":
                eye4 = [initial_sun_eye_side.x, initial_sun_eye_side.y, initial_sun_eye_side.z, 1];
                break;
        }

        left_rightQ = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle : sun_yaw });
        left_rightQM = left_rightQ.getMatrix();

        neweye = SceneJS._math_mulMat4v4(left_rightQM, eye4);
        console.log("dragging: yaw: " + sun_yaw + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2]);

        eye4 = SceneJS._math_dupMat4(neweye);
        eye4dup = SceneJS._math_dupMat4(eye4);

        up_downQ = new SceneJS.Quaternion({ x : left_rightQM[0], y : 0, z : left_rightQM[2], angle : sun_pitch });
        up_downQM = up_downQ.getMatrix();

        neweye = SceneJS._math_mulMat4v4(up_downQM, eye4);

        console.log("dragging: pitch: " + sun_pitch + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2] );

        look.set("eye", { x: neweye[0], y: neweye[1], z: neweye[2] });
        // SceneJS.withNode("theScene").start();
        eye = look.get("eye");
        console.log("");
        
    }
}

canvas3.addEventListener('mousedown', mouseDown3, true);
canvas3.addEventListener('mousemove', mouseMove3, true);
canvas3.addEventListener('mouseup',     mouseUp3, true);
canvas3.addEventListener('mouseout',   mouseOut3, true);

// SceneJS.withNode("earthTextureSelector").set("selection", [0]);
// SceneJS.withNode("earthTextureSelector3").set("selection", [0]);
// SceneJS.withNode("earthTextureSelector4").set("selection", [0]);
// 
// SceneJS.withNode("earthEllipseOrbitSelector").set("selection", [2]);

window.render = function() {
    SceneJS.withNode("theScene1").render();
    SceneJS.withNode("theScene3").render();
    // earth_rotation.checked
    if (true) {
        var earth_angle = SceneJS.withNode("earth-rotation3").get("angle");
        SceneJS.withNode("earth-rotation3").set("angle", earth_angle+0.15);
    }
    
};

SceneJS.bind("error", function() {
    window.clearInterval(pInterval);
});

SceneJS.bind("reset", function() {
    window.clearInterval(pInterval);
});

var pInterval = setInterval("window.render()", 30);

var zBufferDepth = 0;

SceneJS.withNode("theScene1").bind("loading-status", 
    function(event) {
        if (zBufferDepth == 0) {
            zBufferDepth = SceneJS.withNode("theScene1").get("ZBufferDepth");
            var mesg = "using webgl context with Z-buffer depth of: " + zBufferDepth + " bits";
            SceneJS._loggingModule.info(mesg);            
        }
});

// var show_graph = document.getElementById("show-graph");

var dark_green = '#355506';

function plotSolarRadiationAndEarthDistanceGraph() {
    var d1 = [];
    var d2 = [];
    
    for(var i = 0; i < 12; i++) {
        d1.push([i + 1, earth_ephemerides_solar_constant_by_month(monthNamesShort[i])]);
        d2.push([i + 1, 
            earth_ephemerides_distance_from_sun_by_month(monthNamesShort[i]) / 1000000 / factor]);
    }

    var f = Flotr.draw(
        $('theCanvas4'),[ 
        {data:d1, label:'W/m2', lines: {show: false}, points: {show: true}}, 
        {data:d2, label:'Million km', yaxis:2, lines: {show: false}, points: {show: true}}, 

        ],{
            title: "Earth's Solar Radiation and Distance from the Sun",
            subtitle: "Solar Radiation Measured outside the atmosphere.",
            xaxis:{
                ticks: [1, 3, 6, 9, 12],
                // tickFormatter: function(n){ return '('+n+')'; }, // => displays tick values between brackets.
                tickFormatter: function(n) { 
                    var ticlabel = monthNamesShort[Number(n - 1)];
                    return ticlabel 
                }, // => displays tick values between brackets.
                min: 1,
                max: 12,
                labelsAngle: 45,
                title: 'Season'
            },
            yaxis:{
                ticks: [1300, 1350, 1400, 1450, 1500],
                min: 1300,
                max: 1500,
                title: 'Solar Radiation (W/m2)'
            },
            y2axis: {
                color: dark_green, 
                ticks: [140, 145, 150, 155, 160],
                min: 140,
                max: 160, 
                title: 'Distance from Sun (Million km)'
            },
			grid:{
				verticalLines: true,
				backgroundColor: 'white'
			},
			
            HtmlText: false,
            legend: {
                position: 'nw'
            },
            
            mouse:{
				track: true,
				lineColor: 'purple',
				relative: true,
				position: 'nw',
				sensibility: 1, // => The smaller this value, the more precise you've to point
				trackDecimals: 1,
                trackFormatter: function(obj) {
                    var monthName = monthNamesShort[Number(obj.x - 1)];
                    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
                    return  monthName + ', ' + obj.y + ' ' +obj.series.label;;
                }
			},
			crosshair:{
				mode: 'xy'
			}
        });
};

function plotSolarRadiationGraph() {
    var d1 = [];
    var d2 = [[0,0]];
    
    for(var i = 0; i < 12; i++) {
        d1.push([i + 1, earth_ephemerides_solar_constant_by_month(monthNamesShort[i])]);
        // d2.push([i + 1, 
        //     earth_ephemerides_distance_from_sun_by_month(monthNamesShort[i]) / 1000000 / factor]);
    }

    var f = Flotr.draw(
        $('theCanvas4'),[ 
        {data:d1, label:'W/m2', lines: {show: false}, points: {show: true}}, 
        {data:d2, label:'Million km', yaxis:2, lines: {show: false}, points: {show: true}}, 

        ],{
            title: "Earth's Solar Radiation",
            subtitle: "Solar Radiation Measured outside the atmosphere.",
            xaxis:{
                ticks: [1, 3, 6, 9, 12],
                tickFormatter: function(n) { 
                    var ticlabel = monthNamesShort[Number(n - 1)];
                    return ticlabel 
                },
                min: 1,
                max: 12,
                labelsAngle: 45,
                title: 'Season'
            },
            yaxis:{
                ticks: [1300, 1350, 1400, 1450, 1500],
                min: 1300,
                max: 1500,
                title: 'Solar Radiation (W/m2)'
            },
            y2axis: {
                color: dark_green, 
                ticks: [140, 145, 150, 155, 160],
                min: 140,
                max: 160, 
                title: 'Distance from Sun (Million km)'
            },
			grid:{
				verticalLines: true,
				backgroundColor: 'white'
			},
			
            HtmlText: false,
            legend: {
                position: 'nw'
            },
            
            mouse:{
				track: true,
				lineColor: 'purple',
				relative: true,
				position: 'nw',
				sensibility: 1, // => The smaller this value, the more precise you've to point
				trackDecimals: 1,
                trackFormatter: function(obj) { 
                    var monthName = monthNamesShort[Number(obj.x - 1)];
                    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
                    return  monthName + ', ' + obj.y + ' ' +obj.series.label;;
                }
			},
			crosshair:{
				mode: 'xy'
			}
        });
};

function plotEarthDistanceGraph() {
    var d1 = [[0,0]];
    var d2 = [];
    
    for(var i = 0; i < 12; i++) {
        // d1.push([i + 1, earth_ephemerides_solar_constant_by_month(monthNamesShort[i])]);
        d2.push([i + 1, 
            earth_ephemerides_distance_from_sun_by_month(monthNamesShort[i]) / 1000000 / factor]);
    }

    var f = Flotr.draw(
        $('theCanvas4'),[ 
        {data:d1, label:'W/m2', lines: {show: false}, points: {show: true}}, 
        {data:d2, label:'Million km', yaxis:2, lines: {show: false}, points: {show: true}}, 

        ],{
            title: "Earth's distance from the Sun",
            subtitle: "Measured in Millions of kms",
            xaxis:{
                ticks: [1, 3, 6, 9, 12],
                tickFormatter: function(n) { 
                    var ticlabel = monthNamesShort[Number(n - 1)];
                    return ticlabel 
                },
                min: 1,
                max: 12,
                labelsAngle: 45,
                title: 'Season'
            },
            yaxis:{
                ticks: [1300, 1350, 1400, 1450, 1500],
                min: 1300,
                max: 1500,
                title: 'Solar Radiation (W/m2)'
            },
            y2axis: {
                color: dark_green, 
                ticks: [140, 145, 150, 155, 160],
                min: 140,
                max: 160, 
                title: 'Distance from Sun (Million km)'
            },
			grid:{
				verticalLines: true,
				backgroundColor: 'white'
			},
			
            HtmlText: false,
            legend: {
                position: 'nw'
            },
            
            mouse:{
				track: true,
				lineColor: 'purple',
				relative: true,
				position: 'nw',
				sensibility: 1, // => The smaller this value, the more precise you've to point
				trackDecimals: 1,
                trackFormatter: function(obj) { 
                    var monthName = monthNamesShort[Number(obj.x - 1)];
                    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
                    return  monthName + ', ' + obj.y + ' ' +obj.series.label;;
                }
			},
			crosshair:{
				mode: 'xy'
			}
        });
};


function plotNothingGraph() {
    var d1 = [[0,0]];
    var d2 = [[0,0]];

    var f = Flotr.draw(
        $('theCanvas4'),[ 
        {data:d1, label:'W/m2', lines: {show: false}, points: {show: true}}, 
        {data:d2, label:'Million km', yaxis:2, lines: {show: false}, points: {show: true}}, 

        ],{
            title: "Earth's Solar Radiation and Distance from the Sun",
            subtitle: "Solar Radiation Measured outside the atmosphere.",
            xaxis:{
                ticks: [1, 3, 6, 9, 12],
                // tickFormatter: function(n){ return '('+n+')'; }, // => displays tick values between brackets.
                tickFormatter: function(n) { 
                    var ticlabel = monthNamesShort[Number(n - 1)];
                    return ticlabel 
                }, // => displays tick values between brackets.
                min: 1,
                max: 12,
                labelsAngle: 45,
                title: 'Season'
            },
            yaxis:{
                ticks: [1300, 1350, 1400, 1450, 1500],
                min: 1300,
                max: 1500,
                title: 'Solar Radiation (W/m2)'
            },
            y2axis: {
                color: dark_green, 
                ticks: [140, 145, 150, 155, 160],
                min: 140,
                max: 160, 
                title: 'Distance from Sun (Million km)'
            },
			grid:{
				verticalLines: true,
				backgroundColor: 'white'
			},
			
            HtmlText: false,
            legend: {
                position: 'nw'
            },
            
            mouse:{
				track: true,
				lineColor: 'purple',
				relative: true,
				position: 'nw',
				sensibility: 1, // => The smaller this value, the more precise you've to point
				trackDecimals: 0,
                trackFormatter: function(obj) { 
                    var monthName = monthNamesShort[Number(obj.x - 1)];
                    monthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
                    return  monthName + ', ' + obj.y + ' ' +obj.series.label;;
                }
			},
			crosshair:{
				mode: 'xy'
			}
        });
};

// Graph selection

function showGraphChange() {
    if (solar_radiation_graph.checked && sun_earth_distance_graph.checked) {
        plotSolarRadiationAndEarthDistanceGraph();
    } else if (solar_radiation_graph.checked) {
        plotSolarRadiationGraph();
    } else if (sun_earth_distance_graph.checked) {
        plotEarthDistanceGraph();
    } else {
        plotNothingGraph();
    }
}

// show_graph.onchange = showGraphChange;
// show_graph.onchange();




var scaleCanvas = function(canvas, width, height) {
    if (width && height) {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width+"px";
        canvas.style.height = height+"px";

        var oSaveCtx = canvas.getContext("2d");

        oSaveCtx.drawImage(oCanvas, 0, 0, oCanvas.width, oCanvas.height, 0, 0, iWidth, iHeight);
        return oSaveCanvas;
    }
    return oCanvas;
}
function takeSnapshot() {
    var png = canvas3.toDataURL();
    var aspect = canvas3.clientWidth / canvas3.clientHeight;
    var s1_full = document.getElementById("s1-full");
    s1_full.src = png;
    s1_full.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.height = 64;
        canvas.width = 64 * aspect;
        var context = canvas.getContext('2d');
        context.drawImage(s1_full, 0, 0, 64 * aspect, 64);
        var png_small = canvas.toDataURL();
        var s1_small = document.getElementById("s1-small");
        s1_small.src = png_small;
    }
}

if (document.getElementById("editor")) {
    var editor = ace.edit("editor");
    var session = editor.getSession();
    var renderer = editor.renderer;
    renderer.setShowGutter(false);
    session.setUseWrapMode(true);
}

