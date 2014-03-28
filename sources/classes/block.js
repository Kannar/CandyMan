var Block = function(prop)
{
	this.x = prop.x;
	this.y = prop.y;

	this.width = prop.width;
	this.height = prop.height || prop.width;

	this.tag = prop.tag || "none";

	this.collider = new BlockCollider({
		x: this.x,
		y: this.y,
		width: this.width,
		height: this.height,
		tag: {tag: this.tag, obj: this},
		restitution: prop.restitution
	});

	this.render = function()
	{
		mainContext.fillStyle = "rgb(25, 25, 100)";
		mainContext.fillRect((this.x-(this.width))*30, (this.y-(this.height))*30, this.width*30*2, this.height*30*2);
	}
}

function BlockCollider(properties)
{
	fixDef = new b2FixtureDef;
	fixDef.density = properties.density || 1.0;
	fixDef.friction = properties.friction || 0.5;
	fixDef.restitution = properties.restitution || 0;
	fixDef.filter.categoryBits = categories.scene;
	fixDef.filter.maskBits = masks.scene;

	bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.x = properties.x;
	bodyDef.position.y = properties.y;
	bodyDef.userData = properties.tag;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(properties.width, properties.height);

	return world.CreateBody(bodyDef).CreateFixture(fixDef);
}