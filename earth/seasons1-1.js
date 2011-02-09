SceneJS.createNode({
    
    type: "scene",
    id: "theScene",
    canvasId: "theCanvas",
    loggingElementId: "theLoggingDiv",
    
    nodes: [

        {
            type: "library",

            nodes: [
                {
                    type: "camera",
                    id: "theCamera",
                    optics: {
                        type: "perspective",
                        fovy : 45.0,
                        aspect : 1.365,
                        near : earth_diameter_km,
                        far : milky_way_apparent_radius * 10,
                    },

                    nodes: [
                    
                        
                        // Integrate our sky sphere, which is defined in sky-sphere.js
                        {
                            type : "instance",
                            target :"sky-sphere"
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
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: 3.0, g: 3.0, b: 3.0 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 1.0, y: 0.0, z: 1.0 }
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
                                    type   : "instance",
                                    target : "earth-circle-orbit-sun-line"
                                }
                                
                              ]
                        },

                        {
                            type: "quaternion",
                            id: "x",
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
            id: "lookAt",
            eye : { x: 0, y: earth_orbital_radius_km * 3, z: earth_orbital_radius_km * 0.3 },
            look : { x : earth_orbital_radius_km, y : 0.0, z : 0.0 },
            up : { x: 0.0, y: 0.0, z: 1.0 },
            nodes: [ { type: "instance", target: "theCamera" } ]
        }
    ]
});

/*----------------------------------------------------------------------
 * Scene rendering loop and mouse handler stuff follows
 *---------------------------------------------------------------------*/

var earth_yaw = normalized_initial_earth_eye.x;
var earth_pitch = normalized_initial_earth_eye.y;

var sun_yaw =   initial_sun_eye.x;
var sun_pitch = initial_sun_eye.y;

var lastX;
var lastY;
var dragging = false;

var canvas = document.getElementById("theCanvas");

function setAspectRatio(camera, canvas) {
    var optics = SceneJS.withNode(camera).get("optics");
    optics.aspect = canvas.clientWidth/canvas.clientHeight;
    SceneJS.withNode(camera).set("optics", optics);
}

setAspectRatio("theCamera", canvas);

var circle_orbital_path = document.getElementById("circle-orbital-path");
var orbital_grid = document.getElementById("orbital-grid");
var orbit_grid_selector = SceneJS.withNode("orbit-grid-selector");

var time_of_year_buttons = document.getElementById("radio-time-of-year");
var perspective_buttons  = document.getElementById("radio-perspective");

var seasonal_rotations = {};
seasonal_rotations.jun = { x :  0,  y : 0,  z : -1,  angle : 23.44 };
seasonal_rotations.sep = { x :  1,  y : 0,  z :  0,  angle : 23.44 };
seasonal_rotations.dec = { x :  0,  y : 0,  z :  1,  angle : 23.44 };
seasonal_rotations.mar = { x : -1,  y : 0,  z :  0,  angle : 23.44 };

var earth_postion = SceneJS.withNode("earth-position");
var earth_sun_line_rotation = SceneJS.withNode("earth-sun-line-rotation");
var earth_sun_line_translation = SceneJS.withNode("earth-sun-line-translation");

var choose_month = document.getElementById("choose-month");
var month;
for(var i = 0; i < choose_month.elements.length; i++)
    if (choose_month.elements[i].checked) month = choose_month.elements[i].value;

function timeOfYearChange() {
  for(var i = 0; i < this.elements.length; i++)
      if (this.elements[i].checked) month = this.elements[i].value;
  var new_location = earth_circle_location_by_month(month);
  earth_postion.set({ x: new_location[0], y: 0, z: new_location[2] });
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
  // earth_sun_line_geometry.set("positions", [new_location[0], new_location[1], 0, earth_orbital_radius_km, 0.0, 0.0]);
}

choose_month.onchange = timeOfYearChange;
choose_month.onchange();

// Orbital Paths Indicators

function circleOrbitalPathChange() {
  if (circle_orbital_path.checked) {
      SceneJS.withNode("earthCircleOrbitSelector").set("selection", [2]);
  } else {
      SceneJS.withNode("earthCircleOrbitSelector").set("selection", [0]);
  }
}

circle_orbital_path.onchange = circleOrbitalPathChange;
circle_orbital_path.onchange();

SceneJS.withNode("earthEllipseOrbitSelector").set("selection", [2]);

// Orbital Grid

function orbitalGridChange() {
  if (orbital_grid.checked) {
      orbit_grid_selector.set("selection", [2]);
  } else {
      orbit_grid_selector.set("selection", [0]);
  }
}

orbital_grid.onchange = orbitalGridChange;
orbital_grid.onchange();

// Perspective Frame

var choose_view = document.getElementById("choose-view");
var view_selection;

function perspectiveChange() {
    var look = SceneJS.withNode("lookAt")
    for(var i = 0; i < this.elements.length; i++)
        if (this.elements[i].checked) view_selection = this.elements[i].value;
    switch(view_selection) {
        case "top":
        look.set("eye",  initial_sun_eye_top );
        look.set("look", { x: sun_x_pos, y : 0.0, z : 0.0 } );
        look.set("up",  { x: 0.0, y: 1.0, z: 0.0 } );
        break;
        
        case "side":
        look.set("eye",  initial_sun_eye_side );
        look.set("look", { x: sun_x_pos, y : 0.0, z : 0.0 } );
        look.set("up",  { x: 0.0, y: 1.0, z: 0.0 } );
        break;
  }
  sun_yaw =   0;
  sun_pitch = 0;
  SceneJS.withNode("theScene").start();
}

choose_view.onchange = perspectiveChange;
choose_view.onchange();

function mouseDown(event) {
    lastX = event.clientX;
    lastY = event.clientY;
    dragging = true;
}

function mouseUp() {
    dragging = false;
}

function mouseOut() {
    dragging = false;
}

/* On a mouse drag, we'll re-render the scene, passing in
 * incremented angles in each time.
 */
function mouseMove(event) {
    if (dragging) {
        var look, eye, eye4, eye4dup, neweye;

        var up_downQ, up_downQM, left_rightQ, left_rightQM;

        var f, up_down_axis, angle, new_yaw, new_pitch;
        
        new_yaw = (event.clientX - lastX) * -0.2;
        new_pitch = (event.clientY - lastY) * 0.2;
        
        lastX = event.clientX;
        lastY = event.clientY;

        look = SceneJS.withNode("lookAt");

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

canvas.addEventListener('mousedown', mouseDown, true);
canvas.addEventListener('mousemove', mouseMove, true);
canvas.addEventListener('mouseup', mouseUp, true);
canvas.addEventListener('mouseout', mouseOut, true);

SceneJS.withNode("earthTextureSelector").set("selection", [1]);

window.render = function() {
    SceneJS.withNode("theScene").start();
};

SceneJS.bind("error", function() {
    window.clearInterval(pInterval);
});

SceneJS.bind("reset", function() {
    window.clearInterval(pInterval);
});

var pInterval = setInterval("window.render()", 30);

var zBufferDepth = 0;

SceneJS.withNode("theScene").bind("loading-status", 
    function(event) {
        if (zBufferDepth == 0) {
            zBufferDepth = SceneJS.withNode("theScene").get("ZBufferDepth");
            var mesg = "using webgl context with Z-buffer depth of: " + zBufferDepth + " bits";
            SceneJS._loggingModule.info(mesg);            
        }
    });
