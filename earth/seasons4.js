
function getRadioSelection(form_element) {
    for(var i = 0; i < form_element.elements.length; i++) {
        if (form_element.elements[i].checked) {
            return form_element.elements[i].value;
        }
    }
    return false;
};

var selected_city = document.getElementById("selected-city");
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
    city_option.textContent = city.name + ', ' + city.country;
    selected_city.appendChild(city_option);
};

function selectedCityHandler() {
    var city_index = Number(selected_city.value);
    var city = active_cities[city_index];
    var city_location = city.location;
    setLatitude(city_location.signed_latitude);
    setLongitude(city_location.signed_longitude);
};

selected_city.onchange = selectedCityHandler;

var choose_month = document.getElementById("choose-month");

function chooseMonthHandler(event) {
    var month = choose_month.value;
    // for(var i = 0; i < choose_month.elements.length; i++) {
    //     if (choose_month.elements[i].value === month) {
    //         choose_month.elements[i].checked = true;
    //     } else {
    //         choose_month.elements[i].checked = false;
    //     }
    // }
    // scene3._timeOfYearChange(month);
};

choose_month.onchange = chooseMonthHandler;

var choose_tilt = document.getElementById("choose-tilt");
var earth_tilt_quaternion = SceneJS.withNode("earth-tilt-quaternion");

function chooseTiltHandler(event) {
    var tilt = getRadioSelection(event.currentTarget);
    switch (tilt) {
        case "yes":
            earth_tilt_quaternion.set("rotation", { x : 0, y : 0, z : 1, angle : 23.45 });
            earth.tilt = 23.45;
            break;

        case "no":
            earth_tilt_quaternion.set("rotation", { x : 0, y : 0, z : 1, angle : 0 });
            earth.tilt = 0;
            break;
    };
    infoLabel();
};

choose_tilt.onchange = chooseTiltHandler;
