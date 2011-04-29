
SceneJS.createNode({
    type: "scene",
    id: "theScene",
    canvasId: "theCanvas",
    loggingElementId: "theLoggingDiv",

    nodes: [
    
        {
            type: "lookAt",
            id: "lookAt",
            eye:  { x: 0.01, y: 0.01,  z: 0.01 },
            look: { x: 0,  y: 0,  z: 0  },
            up:   { x: 0,  y: 1,  z: 0  },

            nodes: [

                {
                    type: "camera",
                    id: "camera",
                    optics: {
                        type: "perspective",
                        fovy: 50.0,
                        aspect: 1.43,
                        near: 0.0001,
                        far: 100,
                    },

                    nodes: [
                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: 1.0, g: 1.0, b: 1.0 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: 1.0, y: 0.5, z: -1.0 }
                        },
                        {
                            type: "light",
                            mode:                   "dir",
                            color:                  { r: 1.0, g: 1.0, b: 1.0 },
                            diffuse:                true,
                            specular:               true,
                            dir:                    { x: -1.0, y: -0.5, z: 1.0 }
                        },
                        
                        { 
                            type: "material",
                            baseColor:      { r: 1.0, g: 1.0, b: 1.0 },
                            specularColor:  { r: 1.0, g: 1.0, b: 1.0 },
                            specular:       0.1 ,
                            shine:          1.0,

                            nodes: [

                                {
                                    type: "texture",
                                    layers: [ 
                                        { 
                                            uri: "images/solarpanel1.jpg",
                                            applyTo: "baseColor",
                                            blendMode: "multiply" ,
                                            wrapS: "repeat",
                                            wrapT: "repeat",
                                        } 
                                    ],
                                    nodes: [
                                        {
                                            type: "box",
                                            xSize: 0.002,
                                            ySize: 0.002,
                                            zSize: 0.002
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
});

SceneJS.setDebugConfigs({
    compilation : {
        enabled : true
    }
});

var scene = SceneJS.withNode("theScene");

scene.start();
