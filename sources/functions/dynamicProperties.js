function addBoxDynamicProperties(object, density, friction, restitution)
{
   object.bodyDef = new b2BodyDef;
   object.fixDef = new b2FixtureDef;
   object.fixDef.density = density || 1.0;
   object.fixDef.friction = friction || 0.5;
   object.fixDef.restitution = restitution || 0.4;

   object.fixDef.shape = new b2PolygonShape;
   object.fixDef.shape.SetAsBox(object.width, object.height);

   object.bodyDef.type = b2Body.b2_dynamicBody;
   object.bodyDef.position.x = object.x;
   object.bodyDef.position.y = object.y;

   return world.CreateBody(object.bodyDef).CreateFixture(object.fixDef);
}

function addCircleDynamicProperties(object, density, friction, restitution)
{
   object.bodyDef = new b2BodyDef;
   object.fixDef = new b2FixtureDef;
   object.fixDef.density = density || 1.0;
   object.fixDef.friction = friction || 0.5;
   object.fixDef.restitution = restitution || 0.4;

   object.fixDef.shape = new b2CircleShape(object.radius);

   object.bodyDef.type = b2Body.b2_dynamicBody;
   object.bodyDef.position.x = object.x;
   object.bodyDef.position.y = object.y;

   return world.CreateBody(object.bodyDef).CreateFixture(object.fixDef);
}