
SceneJS.createNode({
    type: "scene",
    id: "theScene1",
    canvasId: "theCanvas1",
    loggingElementId: "theLoggingDiv",

    nodes: [
    
        {
            type: "lookAt",
            id: "lookAt",
            eye:  { x: 3,  y: 2,  z: 7 },
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
                        near: 0.01,
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
                            baseColor:      { r: 1.0, g: 0.5, b: 0.2 },
                            specularColor:  { r: 1.0, g: 0.5, b: 0.2 },
                            specular:       0.3,
                            shine:          1.0,

                            nodes: [

                                {
                                    type: "box",
                                    xSize: 1.0,
                                    ySize: 1.0,
                                    zSize: 1.0
                                }
                            ]
                        },
                        
                        {
                            type: "renderer",
                            lineWidth: 1.0,
                            
                            nodes: [

                                { 
                                    type: "material",
                                    baseColor:      { r: 0.0, g: 1.0, b: 0.2 },
                                    emit:           1.0,
                            
                                    nodes: [

                                        {
                                            type: "geometry",
                                            primitive: "line-loop",

                                            positions: [
                                                -2, -2,  0,
                                                 2, -2,  0,
                                                 2,  2,  0,
                                                -2,  2,  0,
                                                -2, -2,  0
                                            ],

                                            indices : [ 0, 1, 2, 3, 4 ]
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
            eye:  { x: 3,  y: 2,  z: 7 },
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
                        near: 0.01,
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
                            baseColor:      { r: 1.0, g: 0.5, b: 0.2 },
                            specularColor:  { r: 1.0, g: 0.5, b: 0.2 },
                            specular:       0.3,
                            shine:          1.0,

                            nodes: [

                                {
                                    type: "box",
                                    xSize: 1.0,
                                    ySize: 1.0,
                                    zSize: 1.0
                                }
                            ]
                        },
                        
                        {
                            type: "renderer",
                            lineWidth: 2.0,
                            
                            nodes: [

                                { 
                                    type: "material",
                                    baseColor:      { r: 0.0, g: 1.0, b: 0.2 },
                                    emit:           1.0,
                            
                                    nodes: [

                                        {
                                            type: "geometry",
                                            primitive: "line-loop",

                                            positions: [
                                                -2, -2,  0,
                                                 2, -2,  0,
                                                 2,  2,  0,
                                                -2,  2,  0,
                                                -2, -2,  0
                                            ],

                                            indices : [ 0, 1, 2, 3, 4 ]
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
            eye:  { x: 3,  y: 2,  z: 7 },
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
                        near: 0.01,
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
                            baseColor:      { r: 1.0, g: 0.5, b: 0.2 },
                            specularColor:  { r: 1.0, g: 0.5, b: 0.2 },
                            specular:       0.3,
                            shine:          1.0,

                            nodes: [

                                {
                                    type: "box",
                                    xSize: 1.0,
                                    ySize: 1.0,
                                    zSize: 1.0
                                }
                            ]
                        },
                        
                        {
                            type: "renderer",
                            lineWidth: 5.0,
                            
                            nodes: [

                                { 
                                    type: "material",
                                    baseColor:      { r: 0.0, g: 1.0, b: 0.2 },
                                    emit:           1.0,
                            
                                    nodes: [

                                        {
                                            type: "geometry",
                                            primitive: "line-loop",

                                            positions: [
                                                -2, -2,  0,
                                                 2, -2,  0,
                                                 2,  2,  0,
                                                -2,  2,  0,
                                                -2, -2,  0
                                            ],

                                            indices : [ 0, 1, 2, 3, 4 ]
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
            eye:  { x: 3,  y: 2,  z: 7 },
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
                        near: 0.01,
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
                            baseColor:      { r: 1.0, g: 0.5, b: 0.2 },
                            specularColor:  { r: 1.0, g: 0.5, b: 0.2 },
                            specular:       0.3,
                            shine:          1.0,

                            nodes: [

                                {
                                    type: "box",
                                    xSize: 1.0,
                                    ySize: 1.0,
                                    zSize: 1.0
                                }
                            ]
                        },
                        
                        {
                            type: "renderer",
                            lineWidth: 10.0,
                            
                            nodes: [

                                { 
                                    type: "material",
                                    baseColor:      { r: 0.0, g: 1.0, b: 0.2 },
                                    emit:           1.0,
                            
                                    nodes: [

                                        {
                                            type: "geometry",
                                            primitive: "line-loop",

                                            positions: [
                                                -2, -2,  0,
                                                 2, -2,  0,
                                                 2,  2,  0,
                                                -2,  2,  0,
                                                -2, -2,  0
                                            ],

                                            indices : [ 0, 1, 2, 3, 4 ]
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

var scene1 = SceneJS.withNode("theScene1").start();
var scene2 = SceneJS.withNode("theScene2").start();
var scene3 = SceneJS.withNode("theScene3").start();
var scene4 = SceneJS.withNode("theScene4").start();
