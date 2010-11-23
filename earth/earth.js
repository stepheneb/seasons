
var earth = SceneJS.createNode({

    id: "earth",
    type: "texture",

    /* A texture can have multiple layers, each applying an
    * image to a different material reflection component.
    * This layer applies the Zod image to the diffuse
    * component, with animated scaling.
    */
    layers: [

        { 
            uri:"images/lat-long-grid-invert-units-1440x720-15.png",
            blendMode: "add"
        },

        { 
            uri:"images/earth3.jpg",

            minFilter: "linear",
            magFilter: "linear",
            wrapS: "repeat",
            wrapT: "repeat",
            isDepth: false,
            depthMode:"luminance",
            depthCompareMode: "compareRToTexture",
            depthCompareFunc: "lequal",
            flipY: false,
            width: 1,
            height: 1,
            internalFormat:"lequal",
            sourceFormat:"alpha",
            sourceType: "unsignedByte",
            applyTo:"baseColor",
            blendMode: "multiply",

            /* Texture rotation angle in degrees
             */
            rotate: 180.0,

            /* Texture translation offset
             */
            translate : {
                x: 0,
                y: 0
            },

            /* Texture scale factors
             */
            scale : {
                x: -1.0,
                y: 1.0
            }
        }

    ],

    nodes: [

        /* Specify the amounts of ambient, diffuse and specular
         * lights our object reflects
         */
        {
            type: "material",
            baseColor:      { r: 0.6, g: 0.6, b: 0.6 },
            specularColor:  { r: 0.0, g: 0.0, b: 0.0 },
            specular:       0.0,
            shine:          2.0,

            nodes: [

                {
                    type: "translate",
                    x: 0,
                    y: 0,
                    z: 0,

                    nodes: [

                        {

                            type: "scale",
                            x: earth_diameter_km,
                            y: earth_diameter_km,
                            z: earth_diameter_km,
                
                            nodes: [
                
                                {
                                                                                          
                                    type: "rotate",
                                    id: 'spin',
                                    angle: 0,
                                    y: 1.0,
                    
                                    nodes: [ { type: "sphere" } ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});