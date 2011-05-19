
SceneJS.createNode({
    type: "scene",
    id: "theScene1",
    canvasId: "theCanvas1",
    loggingElementId: "theLoggingDiv",

    nodes: [
    
        {
            type: "lookAt",
            id: "lookAt",
            eye:  { x: 5,  y: 5,  z: 5 },
            look: { x: 0,  y: 0,  z: 0  },
            up:   { x: 0,  y: 1,  z: 0  },

            nodes: [

                {
                    type: "camera",
                    id: "camera",
                    optics: {
                        type: "perspective",
                        fovy: 50.0,
                        aspect: 1.29,
                        near: 0.1,
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
                                            uri: "../earth/images/solarpanel1.jpg",
                                            applyTo: "baseColor",
                                            blendMode: "multiply" ,
                                            wrapS: "repeat",
                                            wrapT: "repeat",
                                        } 
                                    ],
                                    nodes: [
                                        {
                                            type: "box",
                                            xSize: 2,
                                            ySize: 2,
                                            zSize: 2
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

SceneJS.createNode({
    type: "scene",
    id: "theScene2",
    canvasId: "theCanvas2",
    loggingElementId: "theLoggingDiv",

    nodes: [
    
        {
            type: "lookAt",
            id: "lookAt",
            eye:  { x: 0.5, y: 0.5,  z: 0.5 },
            look: { x: 0,  y: 0,  z: 0  },
            up:   { x: 0,  y: 1,  z: 0  },

            nodes: [

                {
                    type: "camera",
                    id: "camera",
                    optics: {
                        type: "perspective",
                        fovy: 50.0,
                        aspect: 1.29,
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
                                            uri: "../earth/images/solarpanel1.jpg",
                                            applyTo: "baseColor",
                                            blendMode: "multiply" ,
                                            wrapS: "repeat",
                                            wrapT: "repeat",
                                        } 
                                    ],
                                    nodes: [
                                        {
                                            type: "box",
                                            xSize: 0.2,
                                            ySize: 0.2,
                                            zSize: 0.2
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

SceneJS.createNode({
    type: "scene",
    id: "theScene3",
    canvasId: "theCanvas3",
    loggingElementId: "theLoggingDiv",

    nodes: [
    
        {
            type: "lookAt",
            id: "lookAt",
            eye:  { x: 0.05, y: 0.05,  z: 0.05 },
            look: { x: 0,  y: 0,  z: 0  },
            up:   { x: 0,  y: 1,  z: 0  },

            nodes: [

                {
                    type: "camera",
                    id: "camera",
                    optics: {
                        type: "perspective",
                        fovy: 50.0,
                        aspect: 1.29,
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
                                            uri: "../earth/images/solarpanel1.jpg",
                                            applyTo: "baseColor",
                                            blendMode: "multiply" ,
                                            wrapS: "repeat",
                                            wrapT: "repeat",
                                        } 
                                    ],
                                    nodes: [
                                        {
                                            type: "box",
                                            xSize: 0.02,
                                            ySize: 0.02,
                                            zSize: 0.02
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

SceneJS.createNode({
    type: "scene",
    id: "theScene4",
    canvasId: "theCanvas4",
    loggingElementId: "theLoggingDiv",

    nodes: [
    
        {
            type: "lookAt",
            id: "lookAt",
            eye:  { x: 0.005, y: 0.005,  z: 0.005 },
            look: { x: 0,  y: 0,  z: 0  },
            up:   { x: 0,  y: 1,  z: 0  },

            nodes: [

                {
                    type: "camera",
                    id: "camera",
                    optics: {
                        type: "perspective",
                        fovy: 50.0,
                        aspect: 1.29,
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
                                            uri: "../earth/images/solarpanel1.jpg",
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

SceneJS.withNode("theScene1").start();
SceneJS.withNode("theScene2").start();
SceneJS.withNode("theScene3").start();
SceneJS.withNode("theScene4").start();
