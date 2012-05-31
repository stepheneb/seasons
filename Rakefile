
wise4_dist = 'wise4/dist'
wise4_dist_node_seasons2 = 'wise4/dist/node/seasons2'

wise4_node = 'wise4/node'
wise4_icons = 'wise4/icons'

catalina_home = ENV['CATALINA_HOME']
seasons2_node_path = '/webapps/vlewrapper/vle/node/seasons2'

files = [
  "earth/images/earth-arrow.png",
  "earth/images/earth3.jpg",
  "earth/images/earth3-monochrome.jpg",
  "earth/images/lat-long-grid-invert-units-1440x720-15.png",
  "earth/images/milky_way_panorama_3000x1500.jpg",
  "earth/images/sun-arrow.png",
  "earth/javascript/cities.js",
  "earth/javascript/earth-axis.js",
  "earth/javascript/earth-orbit.js",
  "earth/javascript/earth-sphere.js",
  "earth/javascript/earth-sun-line.js",
  "earth/javascript/earth-surface-location-indicator.js",
  "earth/javascript/earth.js",
  "earth/javascript/jpl-earth-ephemerides.js",
  "earth/javascript/latitude-line.js",
  "earth/javascript/orbit-grid.js",
  "earth/javascript/seasons.js",
  "earth/javascript/seasons1-1.js",
  "earth/javascript/seasons1-2.js",
  "earth/javascript/seasons1-3.js",
  "earth/javascript/seasons1-4.js",
  "earth/javascript/sky-sphere.js",
  "earth/javascript/solar-system-data.js",
  "earth/javascript/spaceship.js",
  "earth/javascript/sun.js",
  "earth/blank.cur",
  "earth/seasons1-1.html",
  "earth/seasons1-2-lite.html",
  "earth/seasons1-2.html",
  "earth/seasons1-3-lite.html",
  "earth/seasons1-3.html",
  "earth/seasons1-4-lite.html",
  "earth/seasons1-4.html",
  "images/tablesort/down.gif",
  "lib/flotr/flotr.debug-0.2.0-test.js",
  "lib/flotr/lib/canvas2image.js",
  "lib/flotr/lib/canvastext.js",
  "lib/flotr/lib/prototype.js",
  "lib/glmatrix.js",
  "lib/modernizr-1.6.js",
  "lib/scenejs-0.8.0/scenejs.js",
  "lib/sprintf.js",
  "lib/table/fastinit.js",
  "lib/table/tablesort.js",
  "stylesheets/box-shadow.png",
  "stylesheets/flotr.css",
  "stylesheets/style.css",
  "stylesheets/table.css",
  "stylesheets/video-js.css"
]

namespace :wise4 do
  desc "generate WISE4 step in: #{File.expand_path(wise4_dist_node_seasons2)}"
  task :generate_step do
    rm_rf(wise4_dist) if File.exists?(wise4_dist)
    mkdir_p(wise4_dist_node_seasons2)
    cp_r(wise4_node + '/.', wise4_dist_node_seasons2)
    cp_r(wise4_icons, wise4_dist_node_seasons2)
    files.each do |file|
      dest_path = wise4_dist_node_seasons2 + '/' + File.dirname(file)
      mkdir_p(dest_path)
      cp(file, dest_path)
    end
  end

  desc "copy WISE4 seasons2 step to local vle: $CATALINA_HOME#{seasons2_node_path}"
  task :copy_step_to_local_vle => [ :generate_step ] do
    if catalina_home
      wise4_vle_seasons2_node_path = catalina_home + seasons2_node_path
      rm_rf(wise4_vle_seasons2_node_path) if File.exists?(wise4_vle_seasons2_node_path)
      mkdir(wise4_vle_seasons2_node_path)
      cp_r(wise4_dist_node_seasons2 + '/.', wise4_vle_seasons2_node_path)
    else
      raise "\n*** $CATALINA_HOME must be defined in your environment to use this task.\n"
    end
  end
end
