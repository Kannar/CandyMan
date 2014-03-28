var Blob = function(prop)
{
	this.body = [];

	this.instantiateBody = function()
	{
		this.body.push(
			new BlobHead({
				x: prop.x/30,
				y: prop.y/30,
				radius: 25/30,
				density: 0.1
		}));

		this.body.push(
			new BlobPart({
				x: (prop.x-40)/30,
				y: (prop.y+25)/30,
				radius: 15/30
			}));

		this.body.push(
			new BlobPart({
				x: (prop.x+40)/30,
				y: (prop.y+25)/30,
				radius: 15/30
			}));

		this.body.push(
			new BlobPart({
				x: (prop.x-40)/30,
				y: (prop.y+40)/30,
				radius: 15/30
			}));

		this.body.push(
			new BlobPart({
				x: (prop.x+40)/30,
				y: (prop.y+40)/30,
				radius: 15/30
			}));

		this.body.push(
			new BlobPart({
				x: (prop.x)/30,
				y: (prop.y+40)/30,
				radius: 15/30
			}));

		this.body.push(
			new BlobPart({
				x: (prop.x+40)/30,
				y: (prop.y+60)/30,
				radius: 10/30
			}));

		this.body.push(
			new BlobPart({
				x: (prop.x-40)/30,
				y: (prop.y+60)/30,
				radius: 10/30
			}));
	}

	this.update = function()
	{
		this.move();
		this.jump();
	}

	this.goLeft = false;
	this.goRight = false;
	this.goUp = false;

	this.move = function()
	{
		if(this.goLeft)
		{
			this.body[0].GetBody().ApplyImpulse(new b2Vec2(-0.6, 0), this.body[0].GetBody().GetWorldCenter());
		}
		else if(this.goRight)
		{
			this.body[0].GetBody().ApplyImpulse(new b2Vec2(0.6, 0), this.body[0].GetBody().GetWorldCenter());
		}
	}

	this.jump = function()
	{
		if(this.goUp)
		{
			for(var i=0; i < this.body.length; i++)
			{
				this.body[i].GetBody().ApplyImpulse(new b2Vec2(0, -3), this.body[0].GetBody().GetWorldCenter());
			}

			this.goUp = false;
		}
	}

	/************************/
	this.jointBodies2 = function(i, j) //Solid
	{
		var def = new Box2D.Dynamics.Joints.b2DistanceJointDef();
        def.Initialize(this.body[i].m_body,
        				this.body[j].m_body,
                       	this.body[i].m_body.GetWorldCenter(),
                       	this.body[j].m_body.GetWorldCenter());
         var joint = world.CreateJoint(def);

    	return joint;
	}

	this.jointBodies3 = function(i, j)	//Springy
	{
		var def = new Box2D.Dynamics.Joints.b2DistanceJointDef();
        def.Initialize(this.body[i].m_body,
        				this.body[j].m_body,
                       	this.body[i].m_body.GetWorldCenter(),
                       	this.body[j].m_body.GetWorldCenter());
        def.dampingRatio = 0.05;
        def.frequencyHz = 1;
        var joint = world.CreateJoint(def);

    	return joint;
	}

	this.instantiateBody();

	this.jointBodies2(0, 1);
	this.jointBodies2(0, 2);
	this.jointBodies2(0, 3);
	this.jointBodies2(0, 4);
	this.jointBodies2(0, 5);
	this.jointBodies2(0, 6);
	this.jointBodies2(0, 7);
	/************************************/
}

var BlobHead = function(prop)
{
	this.bodyDef = new b2BodyDef;
   	this.fixDef = new b2FixtureDef;
   	this.fixDef.density = prop.density || 1.0;
 	this.fixDef.friction = prop.friction || 0.5;
 	this.fixDef.restitution = prop.restitution || 0.1;

   	this.fixDef.shape = new b2CircleShape(prop.radius);

   	this.bodyDef.type = b2Body.b2_dynamicBody;
   	this.bodyDef.position.x = prop.x;
   	this.bodyDef.position.y = prop.y;

   	var properties = world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);

   	properties.update = function()
   	{

   	}

   	properties.draw = function()
   	{
   		var pos = properties.GetBody().GetPosition();

		context.beginPath();
		context.fillStyle = 'rgba(255, 255, 255, 1)';
		context.arc((pos.x*30), (pos.y*30), (prop.radius*30),0,2*Math.PI);
		context.fill();
   	}

   	return properties;
}

var BlobPart = function(prop)
{
	this.bodyDef = new b2BodyDef;
   	this.fixDef = new b2FixtureDef;
   	this.fixDef.density = prop.density || 1.0;
 	this.fixDef.friction = prop.friction || 0.5;
 	this.fixDef.restitution = prop.restitution || 0.1;

   	this.fixDef.shape = new b2CircleShape(prop.radius);

   	this.bodyDef.type = b2Body.b2_dynamicBody;
   	this.bodyDef.position.x = prop.x;
   	this.bodyDef.position.y = prop.y;

   	var properties = world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);

   	properties.update = function()
   	{

   	}

   	properties.draw = function()
   	{
   		
   	}

   	return properties;
}