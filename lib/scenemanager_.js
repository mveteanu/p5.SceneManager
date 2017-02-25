//
// Draft test of using SceneManager to run multiple scenes in parallel
//
function SceneManager_()
{
    this.scenes = [];
    this.visibleScenes = [];

    this.addScene = function( fnScene )
    {
        var oScene = new fnScene( this );

        var scene = { fnScene: fnScene, 
                      oScene: oScene, 
                      hasSetup: oScene.hasOwnProperty("setup"),
                      hasDraw: oScene.hasOwnProperty("draw"),
                      hasMousePressed: oScene.hasOwnProperty("mousePressed"),
                      setupExecuted: false
                    }; 

        this.scenes.push( scene );

        return scene;
    }

    this.findScene = function( fnScene )
    {
        for(var i = 0; i < this.scenes.length; i++)
        {
            var o = this.scenes[i]; 
            if ( o.fnScene == fnScene )
                return o;
        }

        return null;
    }

    this.showScene = function( fnScene )
    {
        this.showScenes( [fnScene] );
    }

    this.showScenes = function( arFnScenes )
    {
        this.visibleScenes = [];
        
        for(var i = 0; i < arFnScenes.length; i++)
        {
            var fnScene = arFnScenes[i];
            var scene = this.findScene( fnScene );

            if ( scene == null )
                scene = this.addScene( fnScene );

            this.visibleScenes.push( scene );
        }
    }

    this.draw = function()
    {
        if ( this.visibleScenes.length == 0 )
            return;

        for(var i = 0; i < this.visibleScenes.length; i++ )
        {
            var scene = this.visibleScenes[i];

            if ( scene.hasSetup && !scene.setupExecuted )
            {
                scene.oScene.setup();
                scene.setupExecuted = true;
            }
        
            if ( scene.hasDraw )
            {
                scene.oScene.draw();
            }
        }
    }

    this.mousePressed = function()
    {
        if ( this.visibleScenes.length == 0 )
            return;

        for(var i = 0; i < this.visibleScenes.length; i++ )
        {
            var scene = this.visibleScenes[i];
            
            if ( scene.hasMousePressed )
            {
                scene.oScene.mousePressed();
            }
        }
    }
}

