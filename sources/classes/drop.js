var Drop = function(prop)
{	
	this.bodyDef = new b2BodyDef;
   	this.fixDef = new b2FixtureDef;
   	this.fixDef.density = prop.density || 1.0;
 	this.fixDef.friction = prop.friction || 0.5;
 	this.fixDef.restitution = prop.restitution || 0.4;

   	this.fixDef.shape = new b2CircleShape(prop.radius);

   	this.bodyDef.type = b2Body.b2_dynamicBody;
   	this.bodyDef.position.x = prop.x;
   	this.bodyDef.position.y = prop.y;

   	var properties = world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);

   	this.easelShape;

	properties.update = function()
	{
		properties.draw();
		properties.drawHidden();
	}

	properties.draw = function()
	{
		var pos = properties.GetBody().GetPosition();

		context.beginPath();
		context.fillStyle = 'rgba(255, 255, 255, 1)';
		context.arc((pos.x*30), (pos.y*30), (prop.radius*30),0,2*Math.PI);
		context.fill();
	}

	properties.drawHidden = function()
	{
		var pos = properties.GetBody().GetPosition();

		//Draw with canvas
		hiddenContext.beginPath();
		hiddenContext.fillStyle = 'rgba(255, 255, 255, 1)';
		hiddenContext.arc((pos.x*30), (pos.y*30), (prop.radius*30),0,2*Math.PI);
		hiddenContext.fill();

		//Draw with EaselJS
		// this.easelShape = new createjs.Shape();
		// this.easelShape.graphics.beginFill("white").drawCircle(0, 0, 10);
		// this.easelShape.x = pos.x*30;
		// this.easelShape.y = pos.y*30;
		// hiddenStage.addChild(this.easelShape);

 		// 	this.easelShape.filters = [blurFilter];
 		// 	var bounds = blurFilter.getBounds();

 		// this.easelShape.cache(-50+bounds.x, -50+bounds.y, 100+bounds.width, 100+bounds.height);
	}

	return properties;
}