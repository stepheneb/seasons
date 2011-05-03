
wise4_dist = 'wise4/dist'
wise4_dist_node_seasons = 'wise4/dist/node/seasons'

wise4_node = 'wise4/node'

catalina_home = ENV['CATALINA_HOME']
wise4_vle_seasons_node_path = '/webapps/vlewrapper/vle/node/seasons'

namespace :wise4 do
  desc "generate WISE4 step in: #{File.expand_path(wise4_dist_node_seasons)}"
  task :generate_step do
    rm_rf(wise4_dist) if File.exists?(wise4_dist)
    mkdir_p(wise4_dist_node_seasons)
    cp_r(wise4_node + '/.', wise4_dist_node_seasons)
    cp_r('stylesheets', wise4_dist_node_seasons)
    cp_r(%w{ stylesheets images lib earth}, wise4_dist_node_seasons)
  end
  
  desc "copy WISE4 seasons step to local vle: $CATALINA_HOME#{wise4_vle_seasons_node_path}"
  task :copy_step_to_local_vle => [ :generate_step ] do
    rm_rf(wise4_vle_seasons_node_path) if File.exists?(wise4_vle_seasons_node_path)
    mkdir(wise4_vle_seasons_node_path)
    cp_r(wise4_dist_node_seasons + '/.', wise4_vle_seasons_node_path)
  end
end
