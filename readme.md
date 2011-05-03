Seasons visualizations using WebGL
==================================

These are deployed here: http://visual-demos.dev.concord.org/seasons/index.html

The code for integrating this work as a WISE4 step is located here: wise4/node.

There are rake tasks for generating and locally deploying the WISE4 step version of seasons.

* rake wise4:generate_step
  generate WISE4 step in: /Users/stephen/dev/test/visual-demos-git/seasons/wise4/dist/node/seasons
* rake wise4:copy_step_to_local_vle
  copy WISE4 seasons step to local vle: $CATALINA_HOME/webapps/vlewrapper/vle/node/seasons

The copy_step_to_local_vle task is useful for testing the seasons step if you have a local instance of WISE4 running.

See: https://code.google.com/p/wise4/wiki/StableWISEDeploymentModel
