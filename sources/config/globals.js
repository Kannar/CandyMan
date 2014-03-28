/************************
	Canvas
************************/
var mainCanvas;
var mainContext;

var backCanvas;
var backContext;

var foreCanvas;
var foreContext;

var uiCanvas;
var uiContext;

var camWidth = 800;
var camHeight = 600;

var currentCanvasHeight = 1000;

var sceneWidth = 9600;
var sceneHeight = 2400;

var categories = { 
      scene: 0x0001,
      player: 0x0002,
      trigger: 0x0004,
      collectibles: 0x0008
};


var masks = {
      player: categories.trigger | categories.scene | categories.collectibles,
      trigger: categories.player | categories.scene,
      collectibles: categories.player | categories.scene,
      scene: -1
};
/***********************/
var state = "splash";
var loadDone = false;
var currentLevel;
var currentSpritesheet;
var UI;
/***********************
	Box 2D
***********************/
var world;
var b2Vec2 = Box2D.Common.Math.b2Vec2
            ,  b2BodyDef = Box2D.Dynamics.b2BodyDef
            ,  b2Body = Box2D.Dynamics.b2Body
            ,  b2FixtureDef = Box2D.Dynamics.b2FixtureDef
            ,  b2Fixture = Box2D.Dynamics.b2Fixture
            ,  b2World = Box2D.Dynamics.b2World
            ,  b2MassData = Box2D.Collision.Shapes.b2MassData
            ,  b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
            ,  b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
            ,  b2DebugDraw = Box2D.Dynamics.b2DebugDraw
            ;

/*********************
	Objets
*********************/
var walls = [];

var liquid = [];

var breakables = [];

var traps = [];

var triggers = [];

var movablePlateforms = [];

var currentLevel_data;

var blob;

var camera;

var stats;

var frame = 0;

var contactListener;

var collectibles = [];

var collectiblePopers = [];

var checkToGarbage = [collectibles, breakables];

// var input = InputClavier();
/********************
*     Functions
********************/
//Fonction carré
function sqr(x)
{
      return x*x;
}