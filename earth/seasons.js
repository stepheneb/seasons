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

    this.debugging             = (options.debugging || false);

    // Setting up the scene ...
    
    this.scene              = SceneJS.withNode(options.theScene || "theScene");
    this.camera             = SceneJS.withNode(options.camera || "theCamera");
    this.canvas             = document.getElementById(options.canvas || "theCanvas");
    this.optics             = this.camera.get("optics");

    this.linked_scene       = (options.linked_scene || false);

    this.setAspectRatio();

    this.look               = SceneJS.withNode(options.look || "lookAt");
    
    this.circleOrbit        = SceneJS.withNode("earthCircleOrbitSelector");

    this.orbitGridSelector  = SceneJS.withNode(options.orbitGridSelector || "orbit-grid-selector");
    
    this.look_at_selection  = (options.look_at_selection || 'orbit');
    
    this.earth_pointer;
    
    if (options.earth_pointer === false) {
        this.earth_pointer = false;
    } else {
        this.earth_pointer      = SceneJS.withNode(options.earth_pointer || "earth-pointer");
    };

    this.earth_label        = (options.earth_label || false);
    this.earth_info_label   = document.getElementById("earth-info-label");

    this.earth_position      = SceneJS.withNode(options.earth_postion || "earth-position");
    this.earth_sun_line_rotation    = SceneJS.withNode(options.earth_sun_line_rotation || "earth-sun-line-rotation");
    this.earth_sun_line_translation = SceneJS.withNode(options.earth_sun_line_translation || "earth-sun-line-translation");

    this.earth_sun_line_rotation =    SceneJS.withNode(options.earth_sun_line_rotation || "earth-sun-line-rotation");
    this.earth_sun_line_translation = SceneJS.withNode(options.earth_sun_line_translation || "earth-sun-line-translation");
    this.earth_sun_line_scale =       SceneJS.withNode(options.earth_sun_line_scale || "earth-sun-line-scale");

    this.ellipseOrbitSelector = SceneJS.withNode(options.ellipseOrbitSelector || "earthEllipseOrbitSelector");
    this.earthTextureSelector = SceneJS.withNode(options.earthTextureSelector || "earthTextureSelector");

    this.canvas_properties  = function () {
        return this.canvas.getBoundingClientRect();
    };

    this.sun_yaw =   0;
    this.sun_pitch = 0;

    this.earth_yaw =   0;
    this.earth_pitch = 0;

    this.normalized_earth_eye      =   normalized_initial_earth_eye;

    this.normalized_earth_eye_side =   normalized_initial_earth_eye_side;
    this.normalized_earth_eye_top  =   normalized_initial_earth_eye_side;

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
    if (this.circle_orbit) {
        this.circle_orbit.onchange = (function() {
            return function() {
                self.circleOrbitPathChange(this);
            }
        })();
        this.circle_orbit.onchange();
    };
    
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
    this.earthPointer();

    this.ellipseOrbitSelector.set("selection", [2]);
    this.earthTextureSelector.set("selection", [1]);

    //
    // Mouse interaction bits ...
    //
    
    this.earth_lastX;
    this.earth_lastY;

    this.earth_yaw          = normalized_initial_earth_eye.x;
    this.earth_pitch        = normalized_initial_earth_eye.y;

    this.sun_lastX;
    this.sun_lastY;

    this.sun_yaw            = 0;
    this.sun_pitch          = 0;


    this.dragging           = false;

    this.canvas.addEventListener('mousedown', (function() {
        return function(event) {
            self.mouseDown(event, this);
        }
    })(), true);

    this.canvas.addEventListener('mouseup', (function() {
        return function(event) {
            self.mouseUp(event, this);
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

seasons.Scene.prototype.get_earth_postion = function() {
    var ep = this.earth_position.get();
    return [ep.x, ep.y, ep.z];
}

seasons.Scene.prototype.set_earth_postion = function(newpos) {
    this.earth_position.set({ x: newpos[0], y: newpos[1], z: newpos[2] })
}

seasons.Scene.prototype.get_normalized_earth_eye = function() {
    var normalized_eye = {};
    var eye = this.lookat.get("eye");
    var ep = earth_position.get();
    normalized_eye.x = eye.x - ep.x;
    normalized_eye.y = eye.y - ep.y;
    normalized_eye.z = eye.z - ep.z;
    return normalized_eye;
}

seasons.Scene.prototype.set_normalized_earth_eye = function(normalized_eye) {
    var eye = {}
    var ep = earth_position.get();
    eye.x = normalized_eye.x + ep.x;
    eye.y = normalized_eye.y + ep.y;
    eye.z = normalized_eye.z + ep.z;
    var eye = this.look.set("eye", eye);
}

seasons.Scene.prototype.update_earth_look_at = function(normalized_eye) {
    var eye = {};
    var ep = earth_position.get();
    eye.x = normalized_eye.x + ep.x;
    eye.y = normalized_eye.y + ep.y;
    eye.z = normalized_eye.z + ep.z;
    this.look.set("look", ep );
    this.look.set("eye",  eye );
}

seasons.Scene.prototype.mouseDown = function(event, element) {
    switch(this.look_at_selection) {
        case "orbit":
            this.sun_lastX = event.clientX;
            this.sun_lastY = event.clientY;
            break;
            
        case "earth":
            this.earth_lastX = event.clientX;
            this.earth_lastY = event.clientY;
            break;
    }
    this.dragging = true;
}

seasons.Scene.prototype.mouseUp = function(event, element) {
    this.dragging = false;
}


seasons.Scene.prototype.mouseOut = function(event, element) {
    this.dragging = false;
}


seasons.Scene.prototype.mouseMove = function(event, element, new_yaw, new_pitch, linked) {
    if (this.dragging) {

        var look, eye, eye4, eye4dup, neweye;
        var up_downQ, up_downQM, left_rightQ, left_rightQM;
        var f, up_down_axis, angle, new_yaw, new_pitch;
        
        var normalized_eye;

        switch(this.look_at_selection) {
            case "orbit":
                if (!new_yaw) {                                  
                    new_yaw   = (event.clientX - this.sun_lastX) * -0.2;
                    new_pitch = (event.clientY - this.sun_lastY) * -0.2;
                    this.sun_lastX = event.clientX;
                    this.sun_lastY = event.clientY;
                };
                
                // test for NaN
                if (new_yaw !== new_yaw) new_yaw = 0;
                if (new_yaw !== new_yaw) new_pitch = 0;

                this.sun_yaw   += new_yaw;
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
                console.log("dragging: yaw: " + sprintf("%3.0f", this.sun_yaw) + ", eye: x: " + 
                    sprintf("%3.0f", neweye[0]) + " y: " + sprintf("%3.0f", neweye[1]) + " z: " + sprintf("%3.0f", neweye[2]));

                eye4 = SceneJS._math_dupMat4(neweye);
                eye4dup = SceneJS._math_dupMat4(eye4);

                up_downQ = new SceneJS.Quaternion({ x : left_rightQM[0], y : 0, z : left_rightQM[2], angle : this.sun_pitch });
                up_downQM = up_downQ.getMatrix();

                neweye = SceneJS._math_mulMat4v4(up_downQM, eye4);

                console.log("dragging: pitch: " + sprintf("%3.0f", this.sun_pitch) + ", eye: x: " + 
                    sprintf("%3.0f", neweye[0]) + " y: " + sprintf("%3.0f", neweye[1]) + " z: " + sprintf("%3.0f", neweye[2]) );

                this.look.set("eye",  { x: neweye[0], y: neweye[1], z: neweye[2] } );
                break;

            case "earth":
                if (!new_yaw) {
                    new_yaw   = (event.clientX - this.earth_lastX) * -0.2;
                    new_pitch = (event.clientY - this.earth_lastY) * 0.2;

                    this.earth_lastX = event.clientX;
                    this.earth_lastY = event.clientY;
                };
                
                // test for NaN
                if (new_yaw !== new_yaw) new_yaw = 0;
                if (new_yaw !== new_yaw) new_pitch = 0;
        
                normalized_eye = this.normalized_earth_eye;
                
                this.earth_yaw   += new_yaw;
                this.earth_pitch += new_pitch;
            
                eye4 = [normalized_initial_earth_eye_side.x, normalized_initial_earth_eye_side.y, normalized_initial_earth_eye_side.z, 1];

                left_rightQ = new SceneJS.Quaternion({ x : 0, y : 1, z : 0, angle : this.earth_yaw });
                left_rightQM = left_rightQ.getMatrix();

                neweye = SceneJS._math_mulMat4v4(left_rightQM, eye4);

                console.log("dragging: yaw: " + sprintf("%3.0f", this.earth_yaw) + ", eye: x: " + 
                    sprintf("%3.0f", neweye[0]) + " y: " + sprintf("%3.0f", neweye[1]) + " z: " + sprintf("%3.0f", neweye[2]));

                eye4 = SceneJS._math_dupMat4(neweye);
                eye4dup = SceneJS._math_dupMat4(eye4);

                up_downQ = new SceneJS.Quaternion({ x : left_rightQM[0], y : 0, z : left_rightQM[2], angle : this.earth_pitch });
                up_downQM = up_downQ.getMatrix();

                neweye = SceneJS._math_mulMat4v4(up_downQM, eye4);

                console.log("dragging: pitch: " + sprintf("%3.0f", this.earth_pitch) + ", eye: x: " + 
                    sprintf("%3.0f", neweye[0]) + " y: " + sprintf("%3.0f", neweye[1]) + " z: " + sprintf("%3.0f", neweye[2]));

                this.normalized_earth_eye =  { x: neweye[0], y: neweye[1], z: neweye[2] };
                this.set_normalized_earth_eye(this.normalized_earth_eye);
                break;
        };
        
        console.log("");
        this.earthLabel();
        // if (this.linked_scene && !linked) {
        //     this.linked_scene.dragging = true;
        //     this.linked_scene.mouseMove(event, element, new_yaw, new_pitch, true);
        //     this.linked_scene.dragging = false;
        // };
    };
};

seasons.Scene.prototype.earthPointer = function() {
    if (this.earth_pointer) {
        var earth_pos = this.get_earth_postion();
        this.earth_pointer.set({ x: earth_pos[0], y: earth_pos[1], z: earth_pos[2] });

    }
};

seasons.Scene.prototype.earthLabel = function() {
    var getY = function getY(el) {
        var ypos = 0;
        while( el != null ) {
            ypos += el.offsetTop;
            el = el.offsetParent;
        }
        return ypos;
    };
    var getX = function getX(el) {
        var xpos = 0;
        while( el != null ) {
            xpos += el.offsetLeft;
            el = el.offsetParent;
        }
        return xpos;
    };

    if (this.earth_label) {
        this.earth_info_label.style.top = this.canvas_properties().top + window.pageYOffset + 5 + "px";
        // this.earth_info_label.style.left = this.canvas_properties().left + getX(this.canvas) + window.pageXOffset + 5 + "px";
        // this.earth_info_label.style.left = getX(this.canvas) + 5 + "px";
        this.earth_info_label.style.left = getX(this.canvas) - getX(document.getElementById("content")) + 15 + "px";
        // this.earth_info_label.style.left = "5px";
        var edist = earth_ellipse_distance_from_sun_by_month(this.month);
        var solar_flux = earth_ephemerides_solar_constant_by_month(this.month);
        var labelStr = "";
        labelStr += sprintf("Earth Distance: %6.0f km<br>", edist / factor);
        labelStr += sprintf("Solar Radiation:  %4.1f W/m2<br>", solar_flux);
        if (this.debugging) {
            var earth_pos = this.get_earth_postion();
            var eye_pos = this.look.get("eye");
            var look_pos = this.look.get("look");

            labelStr += "<br>debug:";
            labelStr += sprintf("<br>earth x: %6.0f   y: %6.0f   z: %6.0f", earth_pos[0], earth_pos[1], earth_pos[2]);
            labelStr += sprintf("<br>look  x: %6.0f   y: %6.0f   z: %6.0f", look_pos.x, look_pos.y, look_pos.z);
            labelStr += sprintf("<br>eye   x: %6.0f   y: %6.0f   z: %6.0f", eye_pos.x, eye_pos.y, eye_pos.z);

            if ( this.look_at_selection === 'orbit') {
                if (this.earth_pointer) {
                    var lpos = this.earth_pointer.get();
                    labelStr += sprintf("<br>point x: %6.0f y: %6.0f z: %6.0f", lpos.x, lpos.y, lpos.z);
                }
            };
        };
        this.earth_info_label.innerHTML = labelStr;
    };
};


seasons.Scene.prototype.setAspectRatio = function() {
    this.optics.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.set("optics", this.optics);
}


seasons.Scene.prototype.setCamera = function(settings) {
    for(prop in settings) this.optics[prop] = settings[prop];
    this.camera.set("optics", optics);
}


seasons.Scene.prototype.perspectiveChange = function(form_element) {
    this._perspectiveChange(getRadioSelection(form_element));
};

seasons.Scene.prototype._perspectiveChange = function(view_selection) {
    this.view_selection = view_selection;
    switch(this.view_selection) {
        case "top":
        switch(this.look_at_selection) {
            case "orbit":
                this.look.set("eye",  initial_sun_eye_top );
                this.look.set("look", { x: sun_x_pos, y : 0.0, z : 0.0 } );
                this.look.set("up",  { x: 0.0, y: 1.0, z: 0.0 } );
                break;

            case 'earth':
                this.look.set("eye",  initial_earth_eye_top );
                this.look.set("look", { x: earth_x_pos, y : 0.0, z : 0.0 } );
                this.look.set("up",  { x: 0.0, y: 1.0, z: 0.0 } );
            
                this.update_earth_look_at(normalized_initial_earth_eye_top);
                break;

            case "surface" :
            break;
        }
        
        break;

        case "side":
        switch(this.look_at_selection) {
            case "orbit":
                this.look.set("eye",  initial_sun_eye_side );
                this.look.set("look", { x: sun_x_pos, y : 0.0, z : 0.0 } );
                this.look.set("up",   { x: 0.0, y: 1.0, z: 0.0 } );
                break;

            case 'earth':
                this.look.set("eye",  initial_earth_eye_side );
                this.look.set("look", { x: earth_x_pos, y : 0.0, z : 0.0 } );
                this.look.set("up",  { x: 0.0, y: 1.0, z: 0.0 } );
            
                this.update_earth_look_at(normalized_initial_earth_eye_side);
                break;

            case "surface" :
            break;
        }
        
        break;
  }

  if (this.linked_scene) {
      this.linked_scene._perspectiveChange(this.view_selection);
  };
}


seasons.Scene.prototype.setEarthSunLine = function() {
    var scale = {};
    var distance2 = earth_ellipse_distance_from_sun_by_month(this.month) / 2;
    // var distance = earth_ephemerides_datum_by_month('jun').rg * au2km * factor;
    
    switch(month) {
        case "dec":
        this.earth_sun_line_rotation.set("angle", 180);
        this.earth_sun_line_translation.set({ x: -distance2 , y: 0.0, z: 0 });
        scale.x = distance2;
        switch(view) {
            case "orbit":
            scale.y = sun_earth_line_size_large;
            scale.z = sun_earth_line_size_large;
            break;

            case "earth":
            scale.y = sun_earth_line_size_med;
            scale.z = sun_earth_line_size_med;
            break;
        }
        break;

        case "sep":
        this.earth_sun_line_rotation.set("angle", 0);
        this.earth_sun_line_translation.set({ x: sun_x_pos, y: 0.0, z: -distance2 });
        scale.z = distance2;
        switch(view) {
            case "orbit":
            scale.x = sun_earth_line_size_large;
            scale.y = sun_earth_line_size_large;
            break;

            case "earth":
            scale.x = sun_earth_line_size_med;
            scale.y = sun_earth_line_size_med;
            break;
        }
        break;

        case "jun":
        this.earth_sun_line_rotation.set("angle", 0);
        this.earth_sun_line_translation.set({ x: distance2 , y: 0.0, z: 0 });
        scale.x = distance2;
        switch(view) {
            case "orbit":
            scale.y = sun_earth_line_size_large;
            scale.z = sun_earth_line_size_large;
            break;

            case "earth":
            scale.y = sun_earth_line_size_med;
            scale.z = sun_earth_line_size_med;
            break;
        }
        break;

        case "mar":
        this.earth_sun_line_rotation.set("angle", 180);
        this.earth_sun_line_translation.set({ x: sun_x_pos, y: 0.0, z: distance2 });
        scale.z = distance2;
        switch(view) {
            case "orbit":
            scale.x = sun_earth_line_size_large;
            scale.y = sun_earth_line_size_large;
            break;

            case "earth":
            scale.x = sun_earth_line_size_med;
            scale.y = sun_earth_line_size_med;
            break;
        }
        break;
    }
    this.earth_sun_line_scale.set(scale);
}


seasons.Scene.prototype.timeOfYearChange = function(form_element) {
    this._timeOfYearChange(getRadioSelection(form_element));
};

seasons.Scene.prototype._timeOfYearChange = function(month) {
    this.month = month;

    this.set_earth_postion(earth_ellipse_location_by_month(this.month));

    this._perspectiveChange(this.view_selection);
    
    set_earth_sun_line(this.month, this.look_at_selection);
    
    this.earthLabel();
    this.earthPointer();

    if (this.linked_scene) {
        this.linked_scene._timeOfYearChange(month);
    };
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
      switch(this.look_at_selection) {
          case "orbit":
              this.orbitGridSelector.set("selection", [2]);
              break;

          case 'earth':
              this.orbitGridSelector.set("selection", [1]);
              break;

          case "surface" :
          break;
      }
  } else {
      this.orbitGridSelector.set("selection", [0]);
  }

  if (this.linked_scene) {
      this.linked_scene.orbitalGridChange(checkbox);
  };
}


// export namespace
if (root !== 'undefined') root.seasons = seasons;
})();
