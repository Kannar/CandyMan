/***********************************************
*   Collider(object):
*       object = {
*       **************************
*       *    Minimun requis      *
*       **************************
*           x = position x,
*           y = position y,
*           width = largeur (ou radius si shape = "circle"),
*           height = hauteur || width,
*           shape = "circle" ou "square",
*           type = "static", "dynamic" ou "kinematic",
*       **************************
*           category = categorie de l'objet pour mask de bit (par ex: categories.player),
*           mask = mask de l'objet (par ex: masks.player),
*           data = {"tag", parent du collider, etc..},
*           density = densité de l'objet,
*           friction = friction de l'objet,
*           restitution = restitution de l'objet,
*           sensor = true ou false, dit si l'objet à une physique
*   }
***********************************************/
var Collider = function(object)
{
    fixDef = new b2FixtureDef;
    fixDef.density = object.density || 0.7;
    fixDef.restitution = object.restitution || 0.3;
    fixDef.friction = object.friction || 1.0;
    fixDef.filter.categoryBits = object.category;
    fixDef.filter.maskBits = object.mask;
    fixDef.isSensor = object.sensor || false;

    /****Choix de la forme****/
    if(object.shape == "circle")
        fixDef.shape = new b2CircleShape(object.width/30);
    else if(object.shape == "square")
    {
        var _height = object.height || object.width;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(object.width/30, _height/30)
    }
    else
    {
        console.warn("This shape: '"+object.shape+"' doesn't exist");
        return;
    }
    /*************************/

    bodyDef = new b2BodyDef;

    /*****Choix du type d'élément****/
    if(object.type == "static")
        bodyDef.type = b2Body.b2_staticBody;
    else if(object.type == "dynamic")
        bodyDef.type = b2Body.b2_dynamicBody;
    else if(object.type == "kinematic")
        bodyDef.type = b2Body.b2_kinematicBody;
    else
    {
        console.warn("Type "+object.type+" doesn't exist");
        return;
    }
    /********************************/

    bodyDef.position.x = object.x/30;
    bodyDef.position.y = object.y/30;
    bodyDef.userData = object.data;

    return world.CreateBody(bodyDef).CreateFixture(fixDef);
}

var Polygon = function(object)
{
    fixDef = new b2FixtureDef;
    fixDef.density = object.density || 0.7;
    fixDef.restitution = object.restitution || 0.3;
    fixDef.friction = object.friction || 1.0;
    fixDef.shape = new b2PolygonShape;

    var _verticesDatas = [{ x: 0, y: 0 }, {x: 1, y: 0}, {x: 0, y:1}];
    var _polygonVertices = [];

    for (var i = 0; i < _verticesDatas.length; i++) 
    {
        var _vec = new b2Vec2();
        _vec.Set(_verticesDatas[i].x, _verticesDatas[i].y);
        _polygonVertices[i] = _vec;
    }

    fixDef.shape.SetAsArray(_polygonVertices, _polygonVertices.length);

    bodyDef = new b2BodyDef;
    bodyDef.userData = object.data;

    /*****Choix du type d'élément****/
    if(object.type == "static")
        bodyDef.type = b2Body.b2_staticBody;
    else if(object.type == "dynamic")
        bodyDef.type = b2Body.b2_dynamicBody;
    else if(object.type == "kinematic")
        bodyDef.type = b2Body.b2_kinematicBody;

    bodyDef.position.x = object.x/30;
    bodyDef.position.y = object.y/30;

    return world.CreateBody(bodyDef).CreateFixture(fixDef);
}