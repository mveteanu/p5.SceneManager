//
// p5 SceneManager helps you create p5.js sketches with multiple states / scenes
// Each scene is a like a sketch within the main sketch. You focus on creating
// the scene like a regular sketch and SceneManager ensure scene switching
// routing the main setup(), draw(), mousePressed(), etc. events to the 
// appropriate current scene.
//
// Author: Marian Veteanu
// http://github.com/mveteanu
//
function SceneManager(p)
{
    this.scenes = [];
    this.scene = null;
    
    // Wire relevant p5.js events, except setup()
    // If you don't call this method, you need to manually wire events
    this.wire = function()
    {
        var me = this;
        var o = p != null ? p : window;

        o.draw = function(){ me.draw(); };
        o.mouseClicked = function(){ me.mouseClicked(); };
        o.mousePressed = function(){ me.mousePressed(); };
        o.mouseReleased = function(){ me.mouseReleased(); };
        o.mouseMoved = function(){ me.mouseMoved(); };
        o.mouseDragged = function(){ me.mouseDragged(); };
        o.doubleClicked = function(){ me.doubleClicked(); };
        o.mouseWheel = function() { me.mouseWheel(); };
        o.keyPressed = function(){ me.keyPressed(); };
        o.keyReleased = function(){ me.keyReleased(); };
        o.keyTyped = function(){ me.keyTyped(); };
        o.touchStarted = function(){ me.touchStarted();  };
        o.touchMoved = function(){ me.touchMoved();  };
        o.touchEnded = function(){ me.touchEnded();  };
        o.deviceMoved = function(){ me.deviceMoved();  };
        o.deviceTurned = function(){ me.deviceTurned();  };
        o.deviceShaken = function(){ me.deviceShaken();  };
        
        return me;
    }


    // Add a scene to the collection
    // You need to add all the scenes if intend to call .showNextScene()
    this.addScene = function( fnScene )
    {
        var oScene = new fnScene(p);

        // inject p as a property of the scene
        this.p = p;
        
        // inject sceneManager as a property of the scene
        oScene.sceneManager = this;

        var o = {   fnScene: fnScene, 
                    oScene: oScene,
                    hasSetup : "setup" in oScene,
                    hasEnter : "enter" in oScene,
                    hasDraw : "draw" in oScene,
                    hasKeyPressed : "keyPressed" in oScene,
                    hasKeyReleased : "keyReleased" in oScene,
                    hasKeyTyped : "keyTyped" in oScene,
                    hasMouseClicked : "mouseClicked" in oScene,
                    hasMousePressed : "mousePressed" in oScene,
                    hasMouseReleased: "mouseReleased" in oScene,
                    hasMouseMoved : "mouseMoved" in oScene,
                    hasMouseDragged : "mouseDragged" in oScene,
                    hasDoubleClicked : "doubleClicked" in oScene,
                    hasMouseWheel : "mouseWheel" in oScene,
                    hasTouchStarted : "touchStarted" in oScene,
                    hasTouchMoved : "touchMoved" in oScene,
                    hasTouchEnded : "touchEnded" in oScene,
                    hasDeviceMoved : "deviceMoved" in oScene,
                    hasDeviceTurned : "deviceTurned" in oScene,
                    hasDeviceShaken : "deviceShaken" in oScene,
                    setupExecuted : false,
                    enterExecuted : false };

        this.scenes.push(o);
        return o;
    }

    // Return the index of a scene in the internal collection
    this.findSceneIndex = function( fnScene )
    {
        for(var i = 0; i < this.scenes.length; i++)
        {
            var o = this.scenes[i]; 
            if ( o.fnScene == fnScene )
                return i;
        }

        return -1;
    }

    // Return a scene object wrapper
    this.findScene = function( fnScene )
    {
        var i = this.findSceneIndex( fnScene );
        return i >= 0 ? this.scenes[i] : null;
    }

    // Returns true if the current displayed scene is fnScene
    this.isCurrent = function ( fnScene )
    {
        if ( this.scene == null )
            return false;

        return this.scene.fnScene == fnScene;
    }

    // Show a scene based on the function name
    // Optionally you can send arguments to the scene
    // Arguments will be retrieved in the scene via .sceneArgs property
    this.showScene = function( fnScene, sceneArgs )
    {
        var o = this.findScene( fnScene );

        if ( o == null )
            o = this.addScene( fnScene );
        
        // Re-arm the enter function at each show of the scene
        o.enterExecuted = false;

        this.scene = o;

        // inject sceneArgs as a property of the scene
        o.oScene.sceneArgs = sceneArgs;
    }

    // Show the next scene in the collection
    // Useful if implementing demo applications 
    // where you want to advance scenes automatically
    this.showNextScene = function( sceneArgs )
    {
        if ( this.scenes.length == 0 )
            return;

        var nextSceneIndex = 0;

        if ( this.scene != null )
        {
            // search current scene... 
            // can be optimized to avoid searching current scene...
            var i = this.findSceneIndex( this.scene.fnScene );
            nextSceneIndex = i < this.scenes.length - 1 ? i + 1 : 0;
        }

        var nextScene = this.scenes[nextSceneIndex];
        this.showScene( nextScene.fnScene, sceneArgs );
    }
    
    // This is the SceneManager .draw() method
    // This will dispatch the main draw() to the 
    // current scene draw() method
    this.draw = function()
    {
        // take the current scene in a variable to protect it in case
        // it gets changed by the user code in the events such as setup()...
        var currScene = this.scene;
        
        if ( currScene == null )
            return;

        if ( currScene.hasSetup && !currScene.setupExecuted  )
        {
            currScene.oScene.setup();
            currScene.setupExecuted = true;
        }

        if ( currScene.hasEnter && !currScene.enterExecuted  )
        {
            currScene.oScene.enter();
            currScene.enterExecuted = true;
        }

        if ( currScene.hasDraw )
        {
            currScene.oScene.draw();
        }
    }


    // This will dispatch .keyPressed() to the
    // current scene .keyPressed() method
    this.keyPressed = function()
    {
        var currScene = this.scene;
        
        if ( currScene == null )
            return;

        if ( currScene.hasKeyPressed )
        {
            currScene.oScene.keyPressed();
        }
    }


    this.keyReleased = function()
    {
        var currScene = this.scene;
        
        if ( currScene == null )
            return;

        if ( currScene.hasKeyReleased )
        {
            currScene.oScene.keyReleased();
        }
    }


    this.keyTyped = function()
    {
        var currScene = this.scene;
        
        if ( currScene == null )
            return;

        if ( currScene.hasKeyTyped )
        {
            currScene.oScene.keyTyped();
        }
    }


    // This will dispatch .mouseClicked() to the 
    // current scene .mouseClicked() method
    this.mouseClicked = function()
    {
        var currScene = this.scene;

        if ( currScene == null )
            return;

        if ( currScene.hasMouseClicked )
        {
            currScene.oScene.mouseClicked();
        }
    }
   
    this.mousePressed = function()
    {
        var currScene = this.scene;

        if ( currScene == null )
            return;

        if ( currScene.hasMousePressed )
        {
            currScene.oScene.mousePressed();
        }
    }

    this.mouseReleased = function()
    {
        var currScene = this.scene;

        if ( currScene == null )
            return;

        if ( currScene.hasMouseReleased )
        {
            currScene.oScene.mouseReleased();
        }
    }

    this.mouseMoved = function()
    {
        var currScene = this.scene;

        if ( currScene == null )
            return;

        if ( currScene.hasMouseMoved )
        {
            currScene.oScene.mouseMoved();
        }
    }

    this.mouseDragged = function()
    {
        var currScene = this.scene;

        if ( currScene == null )
            return;

        if ( currScene.hasMouseDragged )
        {
            currScene.oScene.mouseDragged();
        }
    }

    this.doubleClicked = function()
    {
        var currScene = this.scene;

        if ( currScene == null )
            return;

        if ( currScene.hasDoubleClicked )
        {
            currScene.oScene.doubleClicked();
        }
    }

    this.mouseWheel = function()
    {
        var currScene = this.scene;

        if ( currScene == null )
            return;

        if ( currScene.hasMouseWheel )
        {
            currScene.oScene.mouseWheel();
        }
    }

    this.touchStarted = function()
    {
        var currScene = this.scene;

        if ( currScene == null )
            return;

        if ( currScene.hasTouchStarted )
        {
            currScene.oScene.touchStarted();
        }
    }

    this.touchMoved = function()
    {
        var currScene = this.scene;

        if ( currScene == null )
            return;

        if ( currScene.hasTouchMoved )
        {
            currScene.oScene.touchMoved();
        }
    }

    this.touchEnded = function()
    {
        var currScene = this.scene;

        if ( currScene == null )
            return;

        if ( currScene.hasTouchEnded )
        {
            currScene.oScene.touchEnded();
        }
    }



    this.deviceMoved = function()
    {
        var currScene = this.scene;

        if ( currScene == null )
            return;

        if ( currScene.hasDeviceMoved )
        {
            currScene.oScene.deviceMoved();
        }
    }

    this.deviceTurned = function()
    {
        var currScene = this.scene;

        if ( currScene == null )
            return;

        if ( currScene.hasDeviceTurned )
        {
            currScene.oScene.deviceTurned();
        }
    }

    this.deviceShaken = function()
    {
        var currScene = this.scene;

        if ( currScene == null )
            return;

        if ( currScene.hasDeviceShaken )
        {
            currScene.oScene.deviceShaken();
        }
    }


}
