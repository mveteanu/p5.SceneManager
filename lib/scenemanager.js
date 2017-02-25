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
        o.mousePressed = function(){ me.mousePressed(); };
        o.keyPressed = function(){ me.keyPressed(); };

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
                    hasMousePressed : "mousePressed" in oScene,
                    hasKeyPressed : "keyPressed" in oScene,
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
        if ( this.scene == null )
            return;

        if ( this.scene.hasSetup && !this.scene.setupExecuted  )
        {
            this.scene.oScene.setup();
            this.scene.setupExecuted = true;
        }

        if ( this.scene.hasEnter && !this.scene.enterExecuted  )
        {
            this.scene.oScene.enter();
            this.scene.enterExecuted = true;
        }

        if ( this.scene.hasDraw )
        {
            this.scene.oScene.draw();
        }
    }

    // This will dispatch .mousePressed() to the 
    // current scene .mousePressed() method
    this.mousePressed = function()
    {
        if ( this.scene == null )
            return;

        if ( this.scene.hasMousePressed )
        {
            this.scene.oScene.mousePressed();
        }
    }

    // This will dispatch .keyPressed() to the
    // current scene .keyPressed() method
    this.keyPressed = function()
    {
        if ( this.scene == null )
            return;

        if ( this.scene.hasKeyPressed )
        {
            this.scene.oScene.keyPressed();
        }
    }
}
