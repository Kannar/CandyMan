function addStaticProperties(object, density, friction, restitution)
{
   //Fixture def
   object.fixDef = new b2FixtureDef;
   object.fixDef.density = density || 1.0;
   object.fixDef.friction = friction || 0.5;
   object.fixDef.restitution = restitution || 0.4;
   
   object.bodyDef = new b2BodyDef;

   object.bodyDef.type = b2Body.b2_staticBody;
   object.bodyDef.position.x = object.x;
   object.bodyDef.position.y = object.y;
   object.fixDef.shape = new b2PolygonShape;
   object.fixDef.shape.SetAsBox(object.width, object.height);

   return world.CreateBody(object.bodyDef).CreateFixture(object.fixDef);
}
