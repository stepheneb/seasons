
var LatitudeLine = function(parentNodeId) {
 
    /* IDs for nodes in our subgraph
     */
    const LATITUDE_LINE_NODE_ID = "latitude-line";
  
    /* Create the subgraph
     */
    SceneJS.withNode(parentNodeId).add("node",  
    
    {
         type: "node",
         id: LATITUDE_LINE_NODE_ID,
                
         flags: {
             transparent: false
         },
         
         nodes: [

             { 
                 type: "material",

                 baseColor:          { r: 0.1, g: 0.8, b: 2.0 },
                 specularColor:      { r: 0.1, g: 0.8, b: 2.0 },
                 specular:           1.0,
                 shine:              2.0,
                 emit:               2.0,
                 alpha:              0.4,

                 nodes: [
         
                     {
                         type: "disk",
                         radius: earth_diameter_km ,
                         // radius: earth_diameter_km / 2 + earth_orbit_line_size_med,
                         // innerRadius : earth_diameter_km / 2,
                         height: earth_orbit_line_size_med * 5,
                         rings: 360
                     }
                ]
            }
        ]
    });
 
    /* Get reference to the node for use later
     */
    this._latitudeLineNode = SceneJS.withNode(LATITUDE_LINE_NODE_ID);
};

