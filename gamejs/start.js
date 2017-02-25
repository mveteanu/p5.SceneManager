var bkImage;

function preload()
{
    bkImage = loadImage("img/bk.jpg");    
}

function setup()
{
    createCanvas(bkImage.width, bkImage.height);

    var mgr = new SceneManager();
    mgr.bkImage = bkImage; // inject bkImage property
    mgr.wire();
    mgr.showScene( Intro );
}
