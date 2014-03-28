//Fonctions de synchronisation d'affichage
window.requestAnimFrame = 	(
	function(){
		return  window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function(callback, element){
			window.setTimeout(callback, 1000 / 5);
		};
	}
)();

window.onload = initLoad;

/***********************
	Init général
***********************/
function initLoad()
{
	initCanvas();
	state = "loading";

	images_obj = loadImages(images_src);

	initGame();

	gameloop();
}

function initGame()
{
	initWorldBox2D(45);
	setDebugBox2D(false);
	setStats();

	currentLevel_data = level1_part1_data;
	currentLevel = new Level(currentLevel_data, tiles3_data, specialTiles3);

	player = new Player({x: 70, y: 1300, state: "normal"});
	camera = new Camera();
	UI = new UIState();

	contactListener = new ContactListener(beginCollisionToDo, beginCollisionToDo);
	world.SetContactListener(contactListener.listener);

	state = "run";
}

/*********************
	Init Canvas
*********************/
function initCanvas()
{
	mainCanvas  = document.getElementById("mainCanvas");
	mainContext = mainCanvas.getContext("2d");

	mainCanvas.width  = sceneWidth;		//levelTest.width*levelTest.tileheight;			//A changer selon level
	mainCanvas.height = sceneHeight;		//levelTest.height*levelTest.tileheight;			//Tout pareil

	mainCanvas.style.height = sceneHeight;

	mainCanvasWidth = mainCanvas.width;
	mainCanvasHeight = mainCanvas.height;

	backCanvas  = document.getElementById("backCanvas");
	backContext = backCanvas.getContext("2d");

	backCanvas.width  = mainCanvasWidth;
	backCanvas.height = mainCanvasHeight;

	foreCanvas  = document.getElementById("foreCanvas");
	foreContext = foreCanvas.getContext("2d");

	foreCanvas.width  = mainCanvasWidth;
	foreCanvas.height = mainCanvasHeight;

	uiCanvas = document.getElementById("uiCanvas");
	uiContext = uiCanvas.getContext("2d");

	uiCanvas.width = 1024;
	uiCanvas.height = 600;
}

/*********************
	Inits Box2D
*********************/
function initWorldBox2D(gravity)
{
	world = new b2World(
        new b2Vec2(0, gravity),    //gravity
        true                 //allow sleep
    );
}

function setDebugBox2D(bool)
{
	if(bool)
	{
		var debugDraw = new b2DebugDraw();
         debugDraw.SetSprite(document.getElementById("mainCanvas").getContext("2d"));
         debugDraw.SetDrawScale(30);
         debugDraw.SetFillAlpha(0.3);
         debugDraw.SetLineThickness(1.0);
         debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
         world.SetDebugDraw(debugDraw);
	}
}
/*********************
	Stats
*********************/
function setStats()
{
	stats = new Stats();
	stats.setMode(0); // 0: fps, 1: ms

	// Align top-left
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.left = '0px';
	stats.domElement.style.top = '0px';

	document.body.appendChild( stats.domElement );
}
/********************
	Inits Objets
********************/
