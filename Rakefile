
wise4_dist = 'wise4/dist'
wise4_dist_node_seasons = 'wise4/dist/node/seasons'

wise4_node = 'wise4/node'


# stylesheets = %w{ stylesheets/video-js.css stylesheets/table.css stylesheets/style.css stylesheets/rangeinput.css stylesheets/flotr.css  }

namespace :wise4 do
  desc "generate wise4 step in: #{File.expand_path(wise4_dist_node_seasons)}"
  task :generate_step do
    rm_rf(wise4_dist) if File.exists?(wise4_dist)
    mkdir_p(wise4_dist_node_seasons)
    cp_r(wise4_node + '/.', wise4_dist_node_seasons)
    cp_r('stylesheets', wise4_dist_node_seasons)
    cp_r(%w{ stylesheets images lib earth}, wise4_dist_node_seasons)
  end
end  

# cp_r('stylesheets', 'lib', 'images', 'lib', wise4_dist_node)
# cp_r(%w{ stylesheets/ lib/, images/, earth/ }, wise4_dist_node)
