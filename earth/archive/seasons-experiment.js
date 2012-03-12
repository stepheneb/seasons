//
// city data experiment table and graph
//

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
var choose_month = document.getElementById("choose-month");

function updateMonth() {
    var month = selected_city_month.value;
    for(var i = 0; i < choose_month.elements.length; i++) {
        if (choose_month.elements[i].value === month) {
            choose_month.elements[i].checked = true;
        } else {
            choose_month.elements[i].checked = false;
        }
    }
    scene3._timeOfYearChange(month);
};

selected_city_month.onchange = updateMonth;

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
    select.name = 'season_city_' + city_element_id;
    select.id = 'season_city_' + city_element_id; 
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
    SortableTable.load();
    return false;
}

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
