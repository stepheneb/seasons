
var sun_diameter_km_actual = 1392000.0;
var earth_diameter_km_actual = 12742.0;
var earth_orbital_radius_km_actual = 150000000.0;

var factor = 0.001

var sun_diameter_km = sun_diameter_km_actual * factor;
var earth_diameter_km = earth_diameter_km_actual * factor;
var earth_orbital_radius_km = earth_orbital_radius_km_actual * factor;
var milky_way_apparent_radius = earth_orbital_radius_km * 10;

var earth_x_pos = -earth_orbital_radius_km;
var sun_x_pos = 0;

var normalized_initial_earth_eye = { x: 0, y: earth_diameter_km / 10, z: earth_diameter_km * -3 };

var initial_earth_eye = { x: earth_x_pos, y: earth_diameter_km / 10, z: earth_diameter_km * -3 };

var initial_sun_eye = { x: sun_x_pos, y: earth_orbital_radius_km * 0.3, z: earth_orbital_radius_km * -3.0 };
var initial_sun_eye_side = initial_sun_eye;
var initial_sun_eye_top = { x: sun_x_pos, y: earth_orbital_radius_km * 3, z: earth_orbital_radius_km / -25 }

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
