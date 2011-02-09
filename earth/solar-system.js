/**
 * adapted from SceneJS Examples
 *
 */

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
                        aspect : 1.43,
                        near : 0.10,
                        far : milky_way_apparent_radius * 10,
                    },

                    nodes: [
                    
                        
                        // Integrate our sky sphere, which is defined in sky-sphere.js

                        {
                            type: "rotate",
                            id: "earth-milkyway-rotation",
                            angle: 0,
                            y: 1.0,
                            
                            nodes: [
                                
                                {
                                    type : "instance",
                                    target :"sky-sphere"
                                }
                            ]
                        },
                        
                        // Integrate our sun, which is defined in sun.js

                        {
                            type : "instance",
                            target :"sun"
                        },

                        // Integrate our earth orbit, which is defined in earth-orbit.js
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
                            type   : "instance",
                            target : "earth-circle-orbit-sun-line"
                        },
                        
                        {
                            type : "instance",
                            target :"earth"
                        }
                    ]
                }
            ]
        },

        {
            type: "lookAt", 
            id: "lookAt",
            eye : normalized_initial_earth_eye,
            look : { x : 0, y : 0.0, z : 0.0 },
            up : { x: 0.0, y: 1.0, z: 0.0 },
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

var activeView = 0;

var canvas = document.getElementById("theCanvas");

function setAspectRatio(camera, canvas) {
    var optics = SceneJS.withNode(camera).get("optics");
    optics.aspect = canvas.clientWidth/canvas.clientHeight;
    SceneJS.withNode(camera).set("optics", optics);
}

setAspectRatio("theCamera", canvas);

function setFieldOfView(camera, fovy) {
    var optics = SceneJS.withNode(camera).get("optics");
    optics.fovy = fovy;
    SceneJS.withNode(camera).set("optics", optics);
}

var choose_look_at = document.getElementById("choose-look-at");
var look_at_selection;
for(var i = 0; i < choose_look_at.elements.length; i++) {
    if (choose_look_at.elements[i].checked) {
        look_at_selection = choose_look_at.elements[i].value;
    }
}
var look_at = SceneJS.withNode("lookAt");

var orbital_path = document.getElementById("orbital_path");
var earth_rotation = document.getElementById("earth_rotation");

var circle_orbital_path = document.getElementById("circle-orbital-path");
var orbital_grid = document.getElementById("orbital-grid");
var orbit_grid_selector = SceneJS.withNode("orbit-grid-selector");

// var color_map = document.getElementById("temperature-color-map");
// color_map.style.display='none';

var seasonal_rotations = {};
seasonal_rotations.jun = { x :  0,  y : 0,  z : -1,  angle : 23.44 };
seasonal_rotations.sep = { x :  1,  y : 0,  z :  0,  angle : 23.44 };
seasonal_rotations.dec = { x :  0,  y : 0,  z :  1,  angle : 23.44 };
seasonal_rotations.mar = { x : -1,  y : 0,  z :  0,  angle : 23.44 };

function setTemperatureTexture(month) {
    switch (month) {
    case 'mar' : 
        SceneJS.withNode("earthTemperatureTextureSelector").set("selection", [5]);
        earth_milkyway_rotation.set("angle", 270);            
        break;
        
    case 'jun' : 
        SceneJS.withNode("earthTemperatureTextureSelector").set("selection", [8]);
        earth_milkyway_rotation.set("angle", 0);
        break;

    case 'sep' : 
        SceneJS.withNode("earthTemperatureTextureSelector").set("selection", [11]); 
        earth_milkyway_rotation.set("angle", 90);
        break;

    case 'dec' : 
        SceneJS.withNode("earthTemperatureTextureSelector").set("selection", [2]); 
        earth_milkyway_rotation.set("angle", 180);
        break;
    };    
}

var earth_milkyway_rotation = SceneJS.withNode("earth-milkyway-rotation");

function setMilkyWayRotation(month) {
    switch(look_at_selection) {
        case "orbit":
        earth_milkyway_rotation.set("angle", 0);
        break;

        case 'earth':
        switch (month) {
            case 'mar' : 
                earth_milkyway_rotation.set("angle", 270);            
                break;

            case 'jun' : 
                earth_milkyway_rotation.set("angle", 0);
                break;

            case 'sep' : 
                earth_milkyway_rotation.set("angle", 90);
                break;

            case 'dec' : 
                earth_milkyway_rotation.set("angle", 180);
                break;
        };
        break;

        case "surface":
        break;
    }
}

// Texture mapping onto the Earth's surface

var choose_earth_surface = document.getElementById("choose-earth-surface");
var earth_surface;
for(var i = 0; i < choose_earth_surface.elements.length; i++) {
    if (choose_earth_surface.elements[i].checked) {
        earth_surface = choose_earth_surface.elements[i].value;
    }
}

function earthSurfaceChange() {
    for(var i = 0; i < this.elements.length; i++) {
        if (this.elements[i].checked) {
            earth_surface = this.elements[i].value;        
        }
    }
    if (earth_surface === 'terrain') {
        SceneJS.withNode("earthTextureSelector").set("selection", [1]);
        // color_map.style.display='none';
    } else {
        SceneJS.withNode("earthTextureSelector").set("selection", [0]);
        setTemperatureTexture(month);
        // color_map.style.display='inline';  
    }
}

choose_earth_surface.onchange = earthSurfaceChange;
choose_earth_surface.onchange();

var earth_postion = SceneJS.withNode("earth-position");
var earth_axis_position = SceneJS.withNode("earth-axis-position");

var earth_scale = SceneJS.withNode("earth-scale");

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
for(var i = 0; i < choose_month.elements.length; i++) {
    if (choose_month.elements[i].checked) {
        month = choose_month.elements[i].value;    
    }
}

function chooseMonthChange() {
    for(var i = 0; i < this.elements.length; i++)
        if (this.elements[i].checked) month = this.elements[i].value;
    earth_sun_line(month, look_at_selection);
    setTemperatureTexture(month);
    SceneJS.Message.sendMessage({ 
      command: "update", 
      target: "earthRotationalAxisQuaternion", 
      set: { rotation: seasonal_rotations[month] }
    });
    if (earth_surface === 'terrain') {
        SceneJS.withNode("earthTextureSelector").set("selection", [1]);
    } else {
        SceneJS.withNode("earthTextureSelector").set("selection", [0]);
    }
    setMilkyWayRotation(month);
}

choose_month.onchange = chooseMonthChange;
choose_month.onchange();

function orbitalPathChange() {
  if (orbital_path.checked) {
      switch(look_at_selection) {
         case "orbit":
          SceneJS.withNode("earthEllipseOrbitSelector").set("selection", [2]);
          break;
         case 'earth':
          SceneJS.withNode("earthEllipseOrbitSelector").set("selection", [1]);
          break;
      }
  } else {
      SceneJS.withNode("earthEllipseOrbitSelector").set("selection", [0]);
  }
}

orbital_path.onchange = orbitalPathChange;
orbital_path.onchange();

// Orbital Paths Indicators

function circleOrbitalPathChange() {
  if (circle_orbital_path.checked) {
      switch(look_at_selection) {
         case "orbit":
          SceneJS.withNode("earthCircleOrbitSelector").set("selection", [2]);
          break;
         case 'earth':
          SceneJS.withNode("earthCircleOrbitSelector").set("selection", [1]);
          break;
      }
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
      switch(look_at_selection) {
         case "orbit":
          orbit_grid_selector.set("selection", [2]);
          break;
         case 'earth':
          orbit_grid_selector.set("selection", [1]);
          break;
      }
  } else {
      orbit_grid_selector.set("selection", [0]);
  }
}

orbital_grid.onchange = orbitalGridChange;
orbital_grid.onchange();

// Earth Rotation

// function earthRotationChange() {
//   if (earth_rotation.checked) {
//       SceneJS.withNode("earth-rotation").set("angle", 180);
//   } else {
//       SceneJS.withNode("earth-rotation").set("angle", 0);
//   }
// }
// 
// earth_rotation.onchange = earthRotationChange;
// earth_rotation.onchange();

// Reference Frame

function chooseLookAt() {
    for(var i = 0; i < this.elements.length; i++) {
        if (this.elements[i].checked) look_at_selection = this.elements[i].value;
    }
    // var new_location = earth_circle_location_by_month(month);
    // earth_postion.set({ x: new_location[0], y: 0, z: new_location[2] });
    // earth_axis_position.set({ x: new_location[0], y: 0, z: new_location[2] });

    // reference_frame.value = look_at_selection;
    switch(look_at_selection) {
        case "orbit":
        look_at.set("eye",  initial_sun_eye );
        look_at.set("look", { x : sun_x_pos, y : 0.0, z : 0.0 } );
        orbital_path.checked = true;
        earth_sun_line_selector.set("selection", [0]);
        setFieldOfView("theCamera", 40.0);
        choose_month.onchange();
        setMilkyWayRotation(month);
        break;

        case 'earth':
        earth_rotation.checked=true
        look_at.set("eye",  initial_earth_eye );
        look_at.set("look", { x : earth_x_pos, y : 0.0, z : 0.0 } );
        orbital_path.checked = true;
        earth_sun_line_selector.set("selection", [1]);
        setFieldOfView("theCamera", 45.0);
        setMilkyWayRotation(month);
        break;

        case "surface":
        earth_rotation.checked=false
        look_at.set("eye", { x : earth_diameter_km, y : 0.0, z : 0.0 } );
        look_at.set("look", { x : earth_orbital_radius_km, y : 0.0, z : 0.0 } );
        setMilkyWayRotation(month);
        break;
    }
    orbital_path.onchange();
    orbitalGridChange();
}

choose_look_at.onchange = chooseLookAt;
choose_look_at.onchange();

var upQM    = new SceneJS.Quaternion({ x : 1, y : 0, z : 0, angle :  15 }).getMatrix();
var downQM  = new SceneJS.Quaternion({ x : 1, y : 0, z : 0, angle : -15 }).getMatrix();
var rightQM = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle :  15 }).getMatrix();
var leftQM  = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle : -15 }).getMatrix();

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
            earth_yaw   += new_yaw;
            earth_pitch += new_pitch;
            eye4 = [normalized_initial_earth_eye.x, normalized_initial_earth_eye.y, normalized_initial_earth_eye.z, 1];

            left_rightQ = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle : earth_yaw });
            left_rightQM = left_rightQ.getMatrix();

            neweye = SceneJS._math_mulMat4v4(left_rightQM, eye4);
            console.log("dragging: yaw: " + earth_yaw + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2]);

            eye4 = SceneJS._math_dupMat4(neweye);
            eye4dup = SceneJS._math_dupMat4(eye4);

            up_downQ = new SceneJS.Quaternion({ x : left_rightQM[0], y : 0, z : left_rightQM[2], angle : earth_pitch });
            up_downQM = up_downQ.getMatrix();

            neweye = SceneJS._math_mulMat4v4(up_downQM, eye4);

            console.log("dragging: pitch: " + earth_pitch + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2] );

            neweye[0] = neweye[0] + earth_x_pos;
            break;
        }


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

window.render = function() {
    SceneJS.withNode("theScene").start();
    if (earth_rotation.checked) {
        var earth_angle = SceneJS.withNode("earth-rotation").get("angle");
        SceneJS.withNode("earth-rotation").set("angle", earth_angle+0.15);
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

SceneJS.withNode("theScene").bind("loading-status", 
    function(event) {
        if (zBufferDepth == 0) {
            zBufferDepth = SceneJS.withNode("theScene").get("ZBufferDepth");
            var mesg = "using webgl context with Z-buffer depth of: " + zBufferDepth + " bits";
            SceneJS._loggingModule.info(mesg);            
        }
    });
