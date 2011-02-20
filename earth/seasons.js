(function() {

var seasons = {};
var root = this;
seasons.VERSION = '0.1.0';

//
// Utilities ...
//

function bind(scope, fn) {
    return function () {
        fn.apply(scope, arguments);
    };
}


function getRadioSelection (form_element) {
    for(var i = 0; i < form_element.elements.length; i++) {
        if (form_element.elements[i].checked) {
            return form_element.elements[i].value;
        }
    }
    return false;
}

//
// The Main Object: seasons.Scene

seasons.Scene = function(options) {
    if (!options) options = {};

    // Setting up the scene ...
    
    this.scene              = SceneJS.withNode(options.theScene || "theScene");
    this.camera             = SceneJS.withNode(options.camera || "theCamera");
    this.canvas             = document.getElementById(options.canvas || "theCanvas");
    this.canvas_properties  = this.canvas.getBoundingClientRect();
    this.optics             = this.camera.get("optics");

    this.setAspectRatio();

    this.look               = SceneJS.withNode(options.lookAt || "lookAt");
    
    this.circleOrbit        = SceneJS.withNode("earthCircleOrbitSelector");
    this.orbitGridSelector  = SceneJS.withNode("orbit-grid-selector");
    
    this.look_at_selection  = (options.look_at_selection || 'orbit');
    
    this.earth_info_label   = document.getElementById("earth-info-label");

    this.earth_postion      = SceneJS.withNode(options.earth_postion || "earth-position");
    this.earth_sun_line_rotation    = SceneJS.withNode(options.earth_sun_line_rotation || "earth-sun-line-rotation");
    this.earth_sun_line_translation = SceneJS.withNode(options.earth_sun_line_translation || "earth-sun-line-translation");

    this.ellipseOrbitSelector = SceneJS.withNode(options.ellipseOrbitSelector || "earthEllipseOrbitSelector");
    this.earthTextureSelector = SceneJS.withNode(options.earthTextureSelector || "earthTextureSelector");

    this.sun_yaw =   0;
    this.sun_pitch = 0;

    // Setting up callbacks for ...
    var self = this;
    
    // Selecting a Perspective: top, side 
    this.choose_view = document.getElementById(options.choose_view || "choose-view");
    this.view_selection = getRadioSelection(this.choose_view);
    this.choose_view.onchange = (function() {
        return function() {
            self.perspectiveChange(this);
        }
    })();
    this.choose_view.onchange();
    
    // Selecting the time of year: jun, sep, dec, mar
    this.choose_month = document.getElementById(options.choose_month || "choose-month");
    this.month = getRadioSelection(this.choose_month);
    this.choose_month.onchange = (function() {
        return function() {
            self.timeOfYearChange(this);
        }
    })();
    this.choose_month.onchange();

    // Circular Orbital Path selector ...
    this.circle_orbit = document.getElementById(options.circle_orbit || "circle-orbit");
    this.circle_orbit.onchange = (function() {
        return function() {
            self.circleOrbitPathChange(this);
        }
    })();
    this.circle_orbit.onchange();
    
    // Orbital Grid selector ...
    this.orbital_grid = document.getElementById(options.orbital_grid || "orbital-grid");
    this.orbital_grid.onchange = (function() {
        return function() {
            self.orbitalGridChange(this);
        }
    })();
    this.orbital_grid.onchange();

    //
    // Rendering bits ...
    //
    
    this.earthLabel();
    this.ellipseOrbitSelector.set("selection", [2]);
    this.earthTextureSelector.set("selection", [1]);

    //
    // Mouse interaction bits ...
    //
    
    this.earth_yaw          = normalized_initial_earth_eye.x;
    this.earth_pitch        = normalized_initial_earth_eye.y;

    this.sun_yaw            = initial_sun_eye.x;
    this.sun_pitch          = initial_sun_eye.y;

    this.lastX;
    this.lastY;

    this.dragging           = false;

    this.canvas.addEventListener('mousedown', (function() {
        return function(event) {
            self.mouseDown(event, this);
        }
    })(), true);

    this.canvas.addEventListener('mouseup', (function() {
        return function(event) {
            self.mouseDown(event, this);
        }
    })(), true);

    this.canvas.addEventListener('mouseout', (function() {
        return function(event) {
            self.mouseOut(event, this);
        }
    })(), true);

    this.canvas.addEventListener('mousemove', (function() {
        return function(event) {
            self.mouseMove(event, this);
        }
    })(), true);
    
};


seasons.Scene.prototype.mouseDown = function(event, element) {
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.dragging = true;
}

seasons.Scene.prototype.mouseUp = function(event, element) {
    this.dragging = false;
}


seasons.Scene.prototype.mouseOut = function(event, element) {
    this.dragging = false;
}


seasons.Scene.prototype.mouseMove = function(event, element) {
    if (this.dragging) {

        var look, eye, eye4, eye4dup, neweye;
        var up_downQ, up_downQM, left_rightQ, left_rightQM;
        var f, up_down_axis, angle, new_yaw, new_pitch;
        
        new_yaw = (event.clientX - this.lastX) * -0.2;
        new_pitch = (event.clientY - this.lastY) * -0.2;
        
        this.lastX = event.clientX;
        this.lastY = event.clientY;

        look = this.look;

        this.sun_yaw += new_yaw;
        this.sun_pitch += new_pitch;
        
        switch(this.view_selection) {
            case "top":
                eye4 = [initial_sun_eye_top.x, initial_sun_eye_top.y, initial_sun_eye_top.z, 1];
                break;
            case "side":
                eye4 = [initial_sun_eye_side.x, initial_sun_eye_side.y, initial_sun_eye_side.z, 1];
                break;
        }

        left_rightQ = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle : this.sun_yaw });
        left_rightQM = left_rightQ.getMatrix();

        neweye = SceneJS._math_mulMat4v4(left_rightQM, eye4);
        console.log("dragging: yaw: " + this.sun_yaw + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2]);

        eye4 = SceneJS._math_dupMat4(neweye);
        eye4dup = SceneJS._math_dupMat4(eye4);

        up_downQ = new SceneJS.Quaternion({ x : left_rightQM[0], y : 0, z : left_rightQM[2], angle : this.sun_pitch });
        up_downQM = up_downQ.getMatrix();

        neweye = SceneJS._math_mulMat4v4(up_downQM, eye4);

        console.log("dragging: pitch: " + this.sun_pitch + ", eye: x: " + neweye[0] + " y: " + neweye[1] + " z: " + neweye[2] );

        look.set("eye", { x: neweye[0], y: neweye[1], z: neweye[2] });
        eye = look.get("eye");
        console.log("");
    }
}


seasons.Scene.prototype.earthLabel = function() {
    this.earth_info_label.style.top = this.canvas_properties.top + 10 + "px";
    this.earth_info_label.style.left = this.canvas_properties.left + 0 + "px";
    var epos = get_earth_postion();
    var edist = earth_ellipse_distance_from_sun_by_month(this.month);
    var solar_flux = earth_ephemerides_solar_constant_by_month(this.month);
    var labelStr = "";
    labelStr += sprintf("Earth Distance: %6.0f km<br>", edist / factor);
    labelStr += sprintf("Solar Radiation:  %4.1f W/m2<br>", solar_flux);
    labelStr += "<br>";
    labelStr += sprintf("WebGL: x: %6.0f y: %6.0f z: %6.0f", epos[0], epos[1], epos[2]);
    this.earth_info_label.innerHTML = labelStr;
}


seasons.Scene.prototype.setAspectRatio = function() {
    this.optics.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.set("optics", this.optics);
}


seasons.Scene.prototype.setCamera = function(settings) {
    for(prop in settings) this.optics[prop] = settings[prop];
    this.camera.set("optics", optics);
}


seasons.Scene.prototype.perspectiveChange = function(form_element) {
    this.view_selection = getRadioSelection(form_element);
    // for(var i = 0; i < form_element.elements.length; i++)
    //     if (form_element.elements[i].checked) this.view_selection = form_element.elements[i].value;
    switch(this.view_selection) {
        case "top":
        this.look.set("eye",  initial_sun_eye_top );
        this.look.set("look", { x: sun_x_pos, y : 0.0, z : 0.0 } );
        this.look.set("up",   { x: 0.0, y: 1.0, z: 0.0 } );
        break;

        case "side":
        this.look.set("eye",  initial_sun_eye_side );
        this.look.set("look", { x: sun_x_pos, y : 0.0, z : 0.0 } );
        this.look.set("up",   { x: 0.0, y: 1.0, z: 0.0 } );
        break;
  }
  this.scene.render();
}

// 
// seasons.Scene.seasonal_rotations = {
//     // seasonal_rotations.dec = { x :  0,  y : 0,  z :  1,  angle : -23.44 };
//     // seasonal_rotations.mar = { x :  1,  y : 0,  z :  0,  angle : 23.44 };
//     jun: { x :  0,  y : 0,  z :  1,  angle : 23.44 },
//     sep: { x :  0,  y : 0,  z :  1,  angle : 23.44 },
//     dec: { x :  0,  y : 0,  z :  1,  angle : 23.44 },
//     mar: { x :  0,  y : 0,  z :  1,  angle : 23.44 }
// }



seasons.Scene.prototype.timeOfYearChange = function(form_element) {
  for(var i = 0; i < form_element.elements.length; i++)
      if (form_element.elements[i].checked) this.month = form_element.elements[i].value;
  this.earth_location = earth_circle_location_by_month(this.month);
  this.earth_postion.set({ x: this.earth_location[0], y: 0, z: this.earth_location[2] });
  switch(this.month) {
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


// Orbital Paths Indicators

seasons.Scene.prototype.circleOrbitPathChange = function(checkbox) {
  if (checkbox.checked) {
      switch(this.look_at_selection) {
         case "orbit": this.circleOrbit.set("selection", [2]);
          break;
         case 'earth': this.circleOrbit.set("selection", [1]);
          SceneJS.withNode("earthCircleOrbitSelector").set("selection", [1]);
          break;
      }
  } else {
      this.circleOrbit.set("selection", [0]);
  }
}


// Orbital Grid

seasons.Scene.prototype.orbitalGridChange = function(checkbox) {
  if (checkbox.checked) {
      this.orbitGridSelector.set("selection", [2]);
  } else {
      this.orbitGridSelector.set("selection", [0]);
  }
}


// export namespace
if (root !== 'undefined') root.seasons = seasons;
})();
