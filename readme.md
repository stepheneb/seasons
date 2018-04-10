Seasons visualizations using WebGL
==================================

These are deployed here: http://stepheneb.github.io/seasons/index.html

To run locally: ```ruby -run -e httpd . -p 9090``` and open http://localhost:9090/index.html

The code for integrating this work as a WISE4 step is located here: wise4/node.

There are rake tasks for generating and locally deploying the WISE4 step version of seasons.

* rake wise4:generate_step

   generate WISE4 step in: ./wise4/dist/node/seasons

* rake wise4:copy_step_to_local_vle

  copy WISE4 seasons step to local vle: $CATALINA_HOME/webapps/vlewrapper/vle/node/seasons

The copy_step_to_local_vle task is useful for testing the seasons step if you have a local instance of WISE4 running.

See: https://code.google.com/p/wise4/wiki/StableWISEDeploymentModel

These three Seasons Activities all now support persistence to json:

1. [Investigation 1: What Temperature Patterns Do You See?](http://visual-demos.dev.concord.org/seasons/earth/seasons1-2a.html)
2. [Investigation 2: What Is the Shape of Earth's Orbit?](http://visual-demos.dev.concord.org/seasons/earth/seasons1-1.html)
3. [Investigation 3: How Does Earth’s Tilt Affect Temperature?](http://visual-demos.dev.concord.org/seasons/earth/seasons1-3.html)


When any one of these activities are loaded a seasons_activity object is created with ```toJSON()``` and ```fromJSON()``` methods:

Startup activity and save initial state:

    a1 = seasons_activity.toJSON()

Add rows to experiment table, manipulate your view of the Earth and save a new state:

    a2 = seasons_activity.toJSON()

Restore initial activity state: the experiment table and graph will be empty and the position of the Earth will be as it was when the visualization first started.

    seasons_activity.fromJSON(a1)

Restore second activity state: the experiment table and graph will be filled as before and the position of the Earth will be as it was when the state was saved the second time.

    seasons_activity.fromJSON(a2)
