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
        const P5Events = [ "mouseClicked", 
                "mousePressed", 
                "mouseReleased", 
                "mouseMoved", 
                "mouseDragged", 
                "doubleClicked", 
                "mouseWheel", 
                "keyPressed", 
                "keyReleased", 
                "keyTyped", 
                "touchStarted", 
                "touchMoved", 
                "touchEnded", 
                "deviceMoved", 
                "deviceTurned", 
                "deviceShaken" ];

        var me = this;
        var o = p != null ? p : window;

        // Wire draw manually for speed reasons...
        o.draw = function(){ me.draw(); };

        // This loop will wire automatically all P5 events to each scene like this:
        // o.mouseClicked = function() { me.handleEvent("mouseClicked"); }
        for(var i = 0; i < P5Events.length; i++)
        {
            let sEvent = P5Events[i]; // let is necesary to set the scope at the level of for
            o[sEvent] = function() { me.handleEvent(sEvent) };
        }
        
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


    // Handle a certain even for a scene... 
    // It is used by the anonymous functions from the wire() function
    this.handleEvent = function(sEvent)
    {
        if ( this.scene == null || this.scene.oScene == null )
            return;

        var fnSceneEvent = this.scene.oScene[sEvent];
        if (fnSceneEvent)
            fnSceneEvent.call(this.scene.oScene);
    }

    // Legacy method... preserved for maintaining compatibility
    this.mousePressed = function()
    {
        this.handleEvent("mousePressed");
    }

    // Legacy method... preserved for maintaining compatibility
    this.keyPressed = function()
    {
        this.handleEvent("keyPressed");
    }

}
