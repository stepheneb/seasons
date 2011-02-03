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
                            type : "instance",
                            target :"sky-sphere"
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
                                    type: "geometry",
                                    primitive: "line-loop",

                                    positions: [
                                         0.0,                       0.0,    0.0,
                                         earth_orbital_radius_km,   0.0,    0.0
                                    ],

                                    indices : [ 0, 1 ]

                                }
                            ]
                        },

                        {
                            type: "quaternion",
                            id: "earthRotationalAxisQuaternion",
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
            eye : { x: 0, y: 0, z: earth_diameter_km * -3 },
            look : { x : 0, y : 0.0, z : 0.0 },
            up : { x: 0.0, y: 1.0, z: 0.0 },
            nodes: [ { type: "instance", target: "theCamera" } ]
        }
    ]
});

/*----------------------------------------------------------------------
 * Scene rendering loop and mouse handler stuff follows
 *---------------------------------------------------------------------*/
var yaw = 0;
var pitch = 0;
var lastX;
var lastY;
var dragging = false;

var activeView = 0;

var canvas = document.getElementById("theCanvas");

var reference_frame = document.getElementById("reference_frame");
var earth_surface = document.getElementById("earth_surface");
var orbital_path = document.getElementById("orbital_path");
var earth_rotation = document.getElementById("earth_rotation");


// Time of year changes inclination of Earths orbit with respect to the orbital plane

var time_of_year = document.getElementById("time_of_year");
var color_map = document.getElementById("temperature-color-map");
color_map.style.display='none';

var seasonal_rotations = {};
seasonal_rotations.jun = { x :  0,  y : 0,  z : -1,  angle : 23.44 };
seasonal_rotations.sep = { x :  1,  y : 0,  z :  0,  angle : 23.44 };
seasonal_rotations.dec = { x :  0,  y : 0,  z :  1,  angle : 23.44 };
seasonal_rotations.mar = { x : -1,  y : 0,  z :  0,  angle : 23.44 };

function setTemperatureTexture(month) {
    switch (month) {
        case 'jun' : SceneJS.withNode("earthTemperatureTextureSelector").set("selection", [5]); break;
        case 'sep' : SceneJS.withNode("earthTemperatureTextureSelector").set("selection", [8]); break;
        case 'dec' : SceneJS.withNode("earthTemperatureTextureSelector").set("selection", [11]); break;
        case 'mar' : SceneJS.withNode("earthTemperatureTextureSelector").set("selection", [2]); break;
    };    
}

function timeOfYearChange() {
  var month = this.value;
  SceneJS.Message.sendMessage({ 
    command: "update", 
    target: "earthRotationalAxisQuaternion", 
    set: { rotation: seasonal_rotations[month] }
  });
  setTemperatureTexture(month);
  if (earth_surface.value === 'terrain') {
      SceneJS.withNode("earthTextureSelector").set("selection", [1]);
  } else {
      SceneJS.withNode("earthTextureSelector").set("selection", [0]);
  }
}

time_of_year.onchange = timeOfYearChange;
time_of_year.onchange();

// Texture mapping onto the Earth's surface

function earthSurfaceChange() {
  var new_surface = this.value;
  if (new_surface === 'terrain') {
      SceneJS.withNode("earthTextureSelector").set("selection", [1]);
      color_map.style.display='none';
  } else {
      SceneJS.withNode("earthTextureSelector").set("selection", [0]);
      setTemperatureTexture(time_of_year.value);
      color_map.style.display='inline';  
  }
}

earth_surface.onchange = earthSurfaceChange;
earth_surface.onchange();

// Orbital Path Indicator

function orbitalPathChange() {
  if (orbital_path.checked) {
      SceneJS.withNode("earthCircleOrbitSelector").set("selection", [1]);
  } else {
      SceneJS.withNode("earthCircleOrbitSelector").set("selection", [0]);
  }
}

orbital_path.onchange = orbitalPathChange;
orbital_path.onchange();

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

function referenceFrameChange() {
    var look = SceneJS.withNode("lookAt")
    switch(this.value) {
       case "orbit":
        look.set("eye",  { x: 0, y: earth_orbital_radius_km * 0.3, z: earth_orbital_radius_km * -2.5 } );
        look.set("look", { x : earth_orbital_radius_km, y : 0.0, z : 0.0 } );
        orbital_path.checked = true;
        orbital_path.onchange();
        break;
 
       case 'earth':
        earth_rotation.checked=true
        look.set("eye",  { x: 0, y: 0, z: earth_diameter_km * -3 } );
        look.set("look", { x : 0, y : 0.0, z : 0.0 } );
        orbital_path.checked = true;
        orbital_path.onchange();
        break;

       case "low-orbit":
        look.set("eye",  { x: 0, y: 0, z: earth_diameter_km * -1.3 } );
        look.set("look",{ x : 0, y : 0.0, z : 0.0 } );
        break;

       case "surface":
        earth_rotation.checked=false
        look.set("eye", { x : earth_diameter_km, y : 0.0, z : 0.0 } );
        look.set("look", { x : earth_orbital_radius_km, y : 0.0, z : 0.0 } );
        break;
  }
  // SceneJS.withNode("theScene").start();
}

reference_frame.onchange = referenceFrameChange;
reference_frame.onchange();

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
        var look, eye, eye4, eye4dup, neweye, up_down, up_downQ, left_right, left_rightQ, f, up_down_axis, angle;
        yaw = (event.clientX - lastX);
        pitch = (event.clientY - lastY);

        lastX = event.clientX;
        lastY = event.clientY;

        look = SceneJS.withNode("lookAt");
        eye = look.get("eye");
        eye4 = [eye.x, eye.y, eye.z, 1];

        left_rightQ = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle : yaw * -0.2 });
        left_right = left_rightQ.getMatrix();

        neweye = SceneJS._math_mulMat4v4(left_right, eye4);
        console.log("drag   yaw: " + yaw + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2]);

        eye4 = SceneJS._math_dupMat4(neweye);
        f = 1.0 / SceneJS._math_lenVec4(eye4);
        eye4dup = SceneJS._math_dupMat4(eye4);
        up_down_axis = SceneJS._math_mulVec4Scalar(eye4dup, f);
        up_downQ = new SceneJS.Quaternion({ x : up_down_axis[2], y : 0, z : up_down_axis[0], angle : pitch * -0.2 });
        angle = up_downQ.getRotation().angle;
        up_down = up_downQ.getMatrix();

        neweye = SceneJS._math_mulMat4v4(up_down, eye4);
        console.log("drag pitch: " + pitch + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2] + ", angle: " + angle);

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
