function Trigger(properties)	//Trigger pour camera
{
	this.x = properties.x;
	this.y = properties.y;

	this.width = 15/30;
	this.height = properties.height;

	this.tag = "trigger";

	this.collider = new TriggerCollider({
		x: this.x,
		y: this.y,
		width: this.width,
		height: this.height,
		tag: {tag : this.tag, obj: this}
	});

	this.alsoTrigged = false;

	this.onTrigger = false;

	this.update = function()
	{
		this.destroyCollider();
	}
/*************************
	Collisions
*************************/
	this.preCollide = function(who)
	{
		switch (who.tag)
		{
			case "player":
				this.onTrigger = true;
			break;
		}
	}

	this.onCollide = function(who)
	{
		
	}

	this.endCollide = function(who)
	{

	}

	this.postCollide = function(who)
	{
		
	}
/************************/
	this.destroyCollider = function()
	{
		if(this.onTrigger)
		{
			if(!this.alsoTrigged)
			{
				world.DestroyBody(this.collider.GetBody());
				this.createNewCollider(-250);
				camera.focus = "situation";
				this.alsoTrigged = true;
			}
			else
			{				
				world.DestroyBody(this.collider.GetBody());
				this.createNewCollider(0);
				camera.focus = "player";
				this.alsoTrigged = false;
			}

			this.onTrigger = false;
		}
	}

	this.createNewCollider = function(decalX)
	{
		this.collider = new TriggerCollider({
			x: this.x + (decalX/30),
			y: this.y,
			width: this.width,
			height: this.height,
			tag: {tag : this.tag, obj: this}
	});
	}
}

function TriggerCollider(properties)
{
	fixDef = new b2FixtureDef;
	fixDef.density = properties.density || 1.0;
	fixDef.friction = properties.friction || 0.5;
	fixDef.restitution = properties.restitution || 0.4;
	fixDef.filter.categoryBits = categories.trigger;
	fixDef.filter.maskBits = masks.trigger;

	bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.x = properties.x;
	bodyDef.position.y = properties.y;
	bodyDef.userData = properties.tag;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(properties.width, properties.height);

	return world.CreateBody(bodyDef).CreateFixture(fixDef);
}