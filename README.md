p5.js SceneManager
==================

p5.js SceneManager helps you create [p5.js](https://github.com/processing/p5.js) sketches with multiple states / scenes.
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
// Intro scene constructor function
function Intro()
{
    this.setup = function() {
    }

    this.draw = function() {
    }

    this.keyPressed = function() {
        // switch the scene
        this.sceneManager.showScene( Game );
    }
}

// Main games scene constructor function
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
[http://www.vmasoft.net/p5/](http://www.vmasoft.net/p5/)

- [sample.html](http://www.vmasoft.net/p5/sample.html)
- [sample_instance.html](http://www.vmasoft.net/p5/sample_instance.html)
- [game.html](http://www.vmasoft.net/p5/game.html)


Future development
------------------

The library can be further extended with features such as:
- routing of more / all events to the appropriate scene class
- running of multiple scenes in parallel (overlapped)
- running of multiple scenes in parallel in individual areas of a bigger canvas

If you are interested in these features, please open an issue here on GitHub.

VMA
