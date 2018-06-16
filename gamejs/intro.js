function Intro()
{
    this.draw = function()
    {
        image( this.sceneManager.bkImage, 0, 0);

        drawIntroScreen();        
    }

    this.keyPressed = function()
    {
        if ( key == '1' || key == '2' )
        {
            // Invoke the Game scene passing as argument the string '1' or '2'
            this.sceneManager.showScene( Game, key );
        }
    }

    function drawIntroScreen()
    {
        var ball = { x : width / 2, y : height / 2, size : height / 2 };
        
        textSize(24);
        textAlign(CENTER);
        fill("yellow");
        text("Catch the falling balls", width / 2, 50);

        ellipse( ball.x, ball.y, ball.size );

        fill("black");
        textSize(12);

        text("Press key 1 or 2 to select\nhow do you want to operate your mouse:", width / 2, height / 2 - 30);
        text("[1] - Point to catch", width / 2, height / 2 + 20);
        text("[2] - Click to catch", width / 2, height / 2 + 50);


        if ( Math.floor(frameCount / 30) % 2 == 0 ) 
        {
            text("Select mode to start game...", width / 2, height - 20);
        }

        if ( dist( mouseX, mouseY, ball.x, ball.y ) < ball.size / 2  )
        {
            noFill();
            ellipse( ball.x, ball.y, ball.size + 10 );
        }
    }

}
