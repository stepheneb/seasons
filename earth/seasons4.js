

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
    var mon = getRadioSelection(event.currentTarget);
    setEarthPositionByMon(mon)
};

choose_month.onchange = chooseMonthHandler;

var choose_tilt = document.getElementById("choose-tilt");
var earth_tilt_quaternion = SceneJS.withNode("earth-tilt-quaternion");

function chooseTiltHandler() {
    var tilt = getRadioSelection(choose_tilt);
    switch (tilt) {
        case "yes":
            earth.tilt = orbitalTilt;
            break;

        case "no":
            earth.tilt = 0;
            break;
    };
    earth_tilt_quat = quat4.axisAngleDegreesCreate(0, 0, 1,  earth.tilt);
    earth_tilt_mat4 = quat4.toMat4(earth_tilt_quat);
    earth_tilt_quaternion.set("rotation", { 
        x: earth_tilt_axis[0], 
        y: earth_tilt_axis[1], 
        z: earth_tilt_axis[2],
        angle : earth.tilt });
    infoLabel();
};

choose_tilt.onchange = chooseTiltHandler;
chooseTiltHandler();

