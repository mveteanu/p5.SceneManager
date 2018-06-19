function Game()
{
    var maxBallsDropped = 10;
    
    var balls;
    var ballsDropped;
    var ballsCaught;
    
    // take this in a local variable to allow easy access to
    // this instace from within local functions
    var me = this;

    this.enter = function()
    {
        textSize(12);
        textAlign(LEFT);

        initGame();
    }

    this.draw = function()
    {
        image( this.sceneManager.bkImage, 0, 0);

        displayBalls(balls);
        updateBalls(balls);

        displayStats();
    }

    this.mousePressed = function()
    {
        var ball = findHitBall(balls);
        if ( ball != null )
        {
            catchBall(ball);
        }
    }

    this.displayGlobalBalls = function()
    {
        displayBalls(balls);
    }

    this.getScore = function()
    {
        return ballsCaught;
    }

    function initGame()
    {
        balls = [];
        ballsDropped = 0;
        ballsCaught = 0;
        
        for(var i = 0; i < 10; i++)
        {
            addBall(balls);
        }
    }

    function catchBall(ball)
    {
        if ( ballsDropped < maxBallsDropped )
        {
            ballsCaught++;
            initBall(ball);
        }
    }

    function displayBalls(arBalls)
    {
        for(var i = 0; i < arBalls.length; i++)
        {
            displayBall( arBalls[i] );
        }
    }

    function displayBall(ball)
    {
        fill(ball.color);
        ellipse(ball.x, ball.y, ball.size);

        if ( dist( mouseX, mouseY, ball.x, ball.y ) < ball.size / 2 )
        {
            noFill();
            ellipse(ball.x, ball.y, ball.size + 5);

            if ( me.sceneArgs == '1' )
            {
                catchBall(ball);
            }
        }
    }

    function displayStats()
    {
        fill("black");
        text( "Caught: " + ballsCaught, 10, height - 40);
        text( "Dropped: " + ballsDropped, 10, height - 20);
    }

    function findHitBall(arBalls)
    {
        for(var i = 0; i < arBalls.length; i++)
        {
            var ball = arBalls[i];
            var mouseDist = dist(mouseX, mouseY, ball.x, ball.y);

            if ( mouseDist < ball.size / 2)
            {
                return ball;
            }
        }

        return null;
    }


    function updateBalls(arBalls)
    {
        for(var i = 0; i < arBalls.length; i++)
        {
            updateBall( arBalls[i] );
        }
    }


    function updateBall(ball)
    {
        ball.y += ball.size / 20 + ballsCaught / 100;

        // test if hits the ground
        if ( ball.y > height )
        {
            ballsDropped++;

            if ( ballsDropped >= maxBallsDropped )
            {
                me.sceneManager.showScene( GameOver );
            }

            // reinit the ball
            initBall(ball);
        }
    }


    function addBall(arBalls)
    {
        var ball = { x : 0, y : 0, color : "", size: 10 };
        initBall(ball);

        arBalls.push(ball);
    }


    function initBall(ball)
    {
        ball.x = random(10, width - 10);
        ball.y = 10;
        ball.color = random(["white", "yellow", "green", "blue", "red"]);
        ball.size = random(10, 30);
    }

}
