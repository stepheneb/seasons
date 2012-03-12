//
// Seasons Experiment Table
//

seasons.ExperimentTable = function(options) {
    this.version = options.version;
    this.scenes = options.scenes;
};

seasons.ExperimentTable.prototype.toJSON = function() {
    return { 
        version: this.version,
        scenes: this.scenes
    };
};

seasons.ExperimentTable.prototype.fromJSON = function(state) {
    switch (state.version) {
        case 1.1:
        this.scenes.scene.fromJSON(state.scenes.scene)
        break;

        case 1.2:
        this.scenes.scene1.fromJSON(state.scenes.scene1)
        this.scenes.scene3.fromJSON(state.scenes.scene3)
        break;

        case 1.3:
        this.scenes.scene1.fromJSON(state.scenes.scene1)
        this.scenes.scene3.fromJSON(state.scenes.scene3)
        break;
    }
};


//
// city data experiment table and graph
//

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

var choose_month = document.getElementById("choose-month");

var selected_city_latitude = document.getElementById("selected-city-latitude");
var city_option;
var active_cities = [];
var city, city_location;

// FIXME: refactor access to key
for (var c = 0; c < cities.length; c++) {
    var this_city = cities[c];
    this_city.key = this_city.name.replace(/\W/, '_') + '_' + c + '_' + this_city.location.latitude + '_' + this_city.location.longitude;
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

var city_latitude_temperature = document.getElementById("city-latitude-temperature");
var city_latitude_temperature_label = document.getElementById("city-latitude-temperature-label");
var city_latitude_temperature_prediction = document.getElementById("city-latitude-temperature-prediction");

var selected_city_latitude = document.getElementById("selected-city-latitude");

function updateLatitudeLineAndCity() {
    var city_index = Number(selected_city_latitude.value);
    var city = active_cities[city_index];
    var city_location = city.location;
    scene3.latitude_line.setLatitude(city_location.signed_latitude);
    scene3.earth_surface_location.setLocation(city_location.signed_latitude, city_location.signed_longitude)
};

selected_city_latitude.onchange = updateLatitudeLineAndCity;

var city_data_table = document.getElementById("city-data-table");
var city_data_table_body = document.getElementById("city-data-table-body");

var table_row, table_data;

var graph_checkbox_callbacks = {};

var city_data_to_plot = [];
for (var i = 0; i < active_cities.length; i++) {
    city_data_to_plot.push({});
    var city_data = city_data_to_plot[i];
    var city = active_cities[i];
    city_data.label = city.name;
    city_data.color = city.color;
    city_data.lines = { show: true };
    city_data.points = { show: true };
    city_data.data = [];
    for (var m = 0; m < 12; m++) {
        city_data.data.push([m, null]);
    };
};

var city_x_axis_tics = [];
for (var i = 0; i < 12; i++) {
    var shifted_index = (i + 1) % 12;
    city_x_axis_tics.push([i , month_data[month_names[shifted_index]].long_name]);
};

var table_row_index = 0;

function addExperimentData() {
    if (selected_city_latitude.value == 'city ...' ||
        city_latitude_temperature_prediction.value == '') {
        return false;
    }
    var city_index = Number(selected_city_latitude.value);
    var city = active_cities[city_index];
    var city_location = city.location;

    var the_month = scene1.month;
    var month = month_data[the_month];
    
    // FIXME: refactor so this can be changed without affecting _graph_checkbox_callback
    // 0: "Fairbanks"
    // 1: "0"
    // 2: "64.51"
    // 3: "147.43"
    // 4: "jun"
    var city_element_id = city.key + '_' + the_month;
    
    // if the City/Month row already exists in the 
    // data table return without adding a new one
    if (document.getElementById(city_element_id)) return false;
    
    table_row = document.createElement('tr');
    table_row.id = city_element_id;
    
    table_row_index++;
    table_data = document.createElement('td');
    table_data.textContent = table_row_index;
    table_row.appendChild(table_data);
    
    table_data = document.createElement('td');
    table_data.textContent = city.name;
    table_row.appendChild(table_data);

    table_data = document.createElement('td');
    table_data.textContent = month.short_name;
    table_row.appendChild(table_data);

    table_data = document.createElement('td');
    var ave_temp = city.average_temperatures[month.index];
    if (use_fahrenheit) ave_temp = ave_temp * 9 / 5 + 32;
    table_data.textContent = sprintf("%3.1f", ave_temp);
    table_row.appendChild(table_data);

    table_data = document.createElement('td');
    table_data.textContent = city_latitude_temperature_prediction.value;
    table_row.appendChild(table_data);

    table_data = document.createElement('td');
    var select, option;
    select = document.createElement('select');
    select.name = 'season_' + city_element_id;
    select.id = 'season_' + city_element_id; 

    option = document.createElement('option');
    option.disabled = true;
    option.textContent = "choose...";
    select.appendChild(option);

    for (i = 0; i < seasons.length; i++) {
        option = document.createElement('option');
        option.value = seasons[i];
        option.textContent = seasons[i];
        select.appendChild(option);
    };
    option = document.createElement('option');
    option.value = "I'm not sure";
    option.textContent = "I'm not sure";
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
    graph_checkbox.id = 'graph_' + city_element_id;    
    graph_checkbox.type = "checkbox";
    graph_checkbox.checked = true;
    table_data.appendChild(graph_checkbox);
    table_row.appendChild(table_data);

    var graph_checkbox_callback = function(event) {
        _graph_checkbox_callback(this);
    };

    graph_checkbox_callbacks[graph_checkbox.id] = graph_checkbox_callback;
    graph_checkbox.onchange = graph_checkbox_callback;
    _graph_checkbox_callback(graph_checkbox);

    city_data_table_body.appendChild(table_row);
    SortableTable.load();
    return false;
}

// 0: "graph"
// 1: "Fairbanks"
// 2: "0"
// 3: "64.51"
// 4: "147.43"
// 5: "jun"
function _graph_checkbox_callback(element) {
    var graph_id_parts = element.id.split(/_/)
    var city_index = graph_id_parts[2];
    var city_data = city_data_to_plot[city_index];
    var city = active_cities[city_index];
    var city_location = city.location;
    var month = month_data[graph_id_parts[5]];
    var temperature = city.average_temperatures[month.index];
    if (use_fahrenheit) temperature = temperature * 9 / 5 + 32;
    var shifted_index = month.index - 1;
    if (element.checked) {
        city_data.data[shifted_index] = [shifted_index, temperature]
    } else {
        city_data.data[shifted_index] = [shifted_index, null]
    };
    plotCityData();
};

city_latitude_temperature.onsubmit = addExperimentData;

//
// Graphs ...
//

var use_fahrenheit = true;

if (use_fahrenheit) {
    city_latitude_temperature_label.textContent = 
    city_latitude_temperature_label.textContent.replace(/(C|F)$/, 'F')
} else {
    city_latitude_temperature_label.textContent = 
    city_latitude_temperature_label.textContent.replace(/(C|F)$/, 'C')    
}

var y_axis = { title: 'Temperature deg F', min: -20, max: 80 };
var graph_degree_string = "deg F";

if (!use_fahrenheit) {
    graph_degree_string = "deg F"
    y_axis.title = 'Temperature deg C';
    y_axis.min = -30;
    y_axis.max = 30;
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
        legend: false,
        // legend: { position: 'nw', margin: 1, backgroundOpacity: 0.1 },
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

var city_color_keys = document.getElementById("city-color-keys");

function generateCityColorKeys() {
    // remove the existing list
    var color_key_list = document.getElementById("color-key-list");
    city_color_keys.removeChild(color_key_list);

    // create a new color-key-list
    var color_key_list = document.createElement('ul');
    // color_key_list.className = "vlist";
    color_key_list.id = "color-key-list";

    for (var i = 0; i < active_cities.length; i++) {
        var city = active_cities[i];

        // create a list item
        var color_key_item = document.createElement('li');

        // create and add a colored patch
        var color_patch = document.createElement('div');
        color_patch.className = "colorKeyPatch";
        color_patch.style.backgroundColor = city.color;
        color_key_item.appendChild(color_patch);
        
        // add the city name
        var city_name = document.createElement('span');
        city_name.textContent = city.name;
        color_key_item.appendChild(city_name);
        
        // add the new list item to the list
        color_key_list.appendChild(color_key_item);
    }
    // insert the new color key list into the document
    city_color_keys.appendChild(color_key_list);
};

generateCityColorKeys();
