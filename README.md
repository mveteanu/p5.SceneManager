p5.js SceneManager
==================

p5.js SceneManager helps you create p5.js sketches with multiple states / scenes.
Each scene is a like a sketch within the main sketch. You focus on creating
the scene like a regular sketch and SceneManager ensure scene switching
routing the main setup(), draw(), mousePressed(), etc. events to the 
appropriate current scene.

Instead of putting all your code in the main setup() and draw() like this:

```JavaScript
function setup() {

}

function draw() {

}
```

... you put each scene code in the setup() and draw() methods of individual Scene classes:

```JavaScript
function Intro()
{
    this.setup = function() {
    }

    this.draw = function() {
    }

    this.keyPressed = function() {
        // On key press, switch to the Game scene
        this.sceneManager.showScene( Game );
    }
}

function Game()
{
    this.setup = function() {
    }

    this.draw = function() {
    }
}
```

The SceneManager will provide you with methods necesary to switch to the appropriate scene and route the main p5.js events to your defined events.

Source Code
-----------

Source code is located in [lib/scenemanager.js](lib/scenemanager.js)


Demo Code
---------

For demo please check sample.html, sample_instance.html and game.html


Online demo
-----------

You can try online the SceneManager and the above demo code at:
[http://www.vmasoft.net/](http://www.vmasoft.net/)

- [sample.html](http://www.vmasoft.net/p5/sample.html)
- [sample_instance.html](http://www.vmasoft.net/p5/sample_instance.html)
- [game.html](http://www.vmasoft.net/p5/game.html)

