function FatBlob(x, y)
{
	this.anchorsPoints = [];

	// this.center = new AnchorPoint({
	// 		x: (x),
	// 		y: (y),
	// 		radius: (5/30),
	// 		density: 0.1,
	// 		tag: "player"
	// 	});
	
	this.center = new Body({
		x: x,
		y: y,
		width: 40/30,
		height: 75/30,
		density: 0.1,
		tag: {tag:"player"}
		});

	this.center.jointList = [];

	/*************************/
	this.scales = [5, 10, 20, 30];
	this.currentScale = 0;

	this.changeCenterScale = function()
	{
		if(this.currentScale < this.scales.length-1)
			this.currentScale += 1;
		else
			this.currentScale = 0;

		console.log(this.currentScale);

		var pos = {};
		pos.x = this.center.GetBody().GetWorldCenter().x;
		pos.y = this.center.GetBody().GetWorldCenter().y;

		var _body = this.center.m_body;
		world.DestroyBody(_body);

		for(var i = 0; i < this.center.jointList.length; i++)
		{
			world.DestroyJoint(this.center.jointList[i]);
		}

		this.center = new Body({
			x: pos.x,
			y: pos.y,
			width: this.scales[this.currentScale]/30,
			height: this.scales[this.currentScale]/30,
			density: 0.1,
			tag: {tag:"player"}
		});

		this.center.jointList = [];
		this.linkCenterToAnchors();
	}

	/*************************/

	this.linksAnchor = function()	//Springy link
	{
		for(var i = 0; i < this.anchorsPoints.length; i++)
		{
			if(i < this.anchorsPoints.length-1)
			{
				var a = this.anchorsPoints[i];
				var b = this.anchorsPoints[i+1];

				linkTo(a, b, 1, 2);
			}
			else
			{
				linkTo(this.anchorsPoints[i], this.anchorsPoints[0], 1, 2);
			}
		}
	}

	this.linksAnchor2 = function()
	{
		for(var i = 0; i < this.anchorsPoints.length; i++)
		{
			if(i % 2 == 0)	//Si i est paire
			{
				if(i < this.anchorsPoints.length-2)
				{
					linkTo(this.anchorsPoints[i], this.anchorsPoints[i+2], 1, 2);
				}
				else
				{
					linkTo(this.anchorsPoints[i], this.anchorsPoints[0], 1, 2);
				}
			}
			else	//Si i est impaire
			{
				if(i < this.anchorsPoints.length-1)
				{
					linkTo(this.anchorsPoints[i], this.anchorsPoints[i+2], 1, 2);
				}
				else
				{
					linkTo(this.anchorsPoints[i], this.anchorsPoints[1], 1, 2);
				}
			}
		}
	}

	this.linksAnchor3 = function()
	{
		for(var i = 0; i < this.anchorsPoints.length; i++)
		{
			if(i < this.anchorsPoints.length-3)
			{
				linkTo(this.anchorsPoints[i], this.anchorsPoints[i+3], 1, 2);
			}
			else if(i < this.anchorsPoints.length-2)
			{
				linkTo(this.anchorsPoints[i], this.anchorsPoints[0], 1, 2);
			}
			else if(i < this.anchorsPoints.length-1)
			{
				linkTo(this.anchorsPoints[i], this.anchorsPoints[1], 1, 2);
			}
			else
			{
				linkTo(this.anchorsPoints[i], this.anchorsPoints[2], 1, 2);
			}
		}
	}

	this.linksAnchor4 = function()
	{
		for(var i = 0; i < this.anchorsPoints.length; i++)
		{
			if(i < this.anchorsPoints.length-4)
			{
				linkTo(this.anchorsPoints[i], this.anchorsPoints[i+4], 1, 2);
			}
			else if(i < this.anchorsPoints.length-3)
			{
				linkTo(this.anchorsPoints[i], this.anchorsPoints[0], 1, 2);
			}
			else if(i < this.anchorsPoints.length-2)
			{
				linkTo(this.anchorsPoints[i], this.anchorsPoints[1], 1, 2);
			}
			else if(i < this.anchorsPoints.length-1)
			{
				linkTo(this.anchorsPoints[i], this.anchorsPoints[2], 1, 2);
			}
			else
			{
				linkTo(this.anchorsPoints[i], this.anchorsPoints[3], 1, 2);
			}
		}
	}

	this.linkCenterToAnchors = function()
	{
		for(var i = 0; i < this.anchorsPoints.length; i++)
		{
			this.center.jointList.push(linkTo(this.center, this.anchorsPoints[i], 0.05, 2.5, (40/30)));
		}
	}

	// this.addAnchorPoint();
	// this.linksAnchor();
	// this.linksAnchor2();
	// this.linkCenterToAnchors();

	/****************************/

	this.calcPos = function(angle)	//Calcul des coordonnées du point sur le cercle
	{
		var x = Math.cos(angle);
		var y = Math.sin(angle);

		return	{x: x, y: y};
	}

	this.drawAnchorsPointsCircle = function(r, nbPts)	//Fonction de création des points
	{
		for(var i = 0; i < nbPts; i++)
		{
			var angle = Math.PI * ((360/nbPts)*i) / 180;	//En radian

			var pos = this.calcPos(angle);

			this.anchorsPoints.push(new AnchorPoint({
				x: ((pos.x*r)+(x*30))/30,
				y: ((pos.y*r)+(y*30))/30,
				radius: (2/30),
				density: 0.5,
				tag: {tag:"player"}
			}));
		}
	}

	// this.drawAnchorsPointsCircle(40, 20);	//Création des points d'ancrages (dont le nombre doit être un multiple de 8)
	// this.linksAnchor();		//Premier reliage des points à l'aide de jointures de type "springey" (élastique), on relit les points en faisant le tour
	// this.linksAnchor2();	//Second reliage des points avec des jointures "solid", tout les 2 points
	// this.linksAnchor3();
	// // this.linksAnchor4();
	// this.linkCenterToAnchors();
/******************************/

	this.linkSidesS = function(n)
	{		
		revoluteJoint(this.anchorsPoints[n], this.center, 2, 2);
	}

	this.drawAnchorsPointsSquareBis = function()
	{
		var _x = x - (50)/30;
		var _y = y - (70)/30;

		for(var i = 0; i < 4; i++)
		{
			for(var j = 0; j < 5; j++)	//En haut
			{
				switch(i)
				{
					case 0:
						this.anchorsPoints.push(new AnchorPoint({
						x: _x + (j*(100/5))/30,
						y: _y,
						radius: (5/30),
						density: 0,
						tag: "player"
					}));
						if(j == 0)
							this.linkSidesS(this.anchorsPoints.length-1);
					break;

					case 1:
						this.anchorsPoints.push(new AnchorPoint({
						x: _x + (100/30),
						y: _y + (j*(140/5)/30),
						radius: (5/30),
						density: 0,
						tag: "player"
					}));
						if(j == 0)
							this.linkSidesS(this.anchorsPoints.length-1);
					break;

					case 2:
						this.anchorsPoints.push(new AnchorPoint({
						x: (_x + 100/30) - (j*(100/5))/30,
						y: _y + (140/30),
						radius: (5/30),
						density: 0,
						tag: "player"
					}));
						if(j == 0)
							this.linkSidesS(this.anchorsPoints.length-1);
					break;

					case 3:
						this.anchorsPoints.push(new AnchorPoint({
						x: _x,
						y: (_y + 140/30) - (j*(140/5))/30,
						radius: (5/30),
						density: 0,
						tag: "player"
					}));
						if(j == 0)
							this.linkSidesS(this.anchorsPoints.length-1);
					break;
				}
			}
		}		
	}

	this.linksAnchorS = function()
	{
		for(var i = 0; i < this.anchorsPoints.length; i++)
		{	
			if(i < this.anchorsPoints.length-1)
			{
				var a = this.anchorsPoints[i];
				var b = this.anchorsPoints[i+1];

				linkTo(a, b, 10, 2);
			}
			else
			{
				linkTo(this.anchorsPoints[i], this.anchorsPoints[0], 10, 2);
			}
		}
	}

	this.linkCenterToAnchorsS = function()
	{
		for(var i = 0; i < this.anchorsPoints.length; i++)
		{
			this.center.jointList.push(linkTo(this.center, this.anchorsPoints[i], 2, 2, 35/30));
		}
	}

	this.drawAnchorsPointsSquareBis();
	this.linksAnchorS();
	this.linksAnchor2();	//Second reliage des points avec des jointures "solid", tout les 2 points
	this.linksAnchor3();
	this.linkCenterToAnchorsS();
/******************************/
	this.blockRotations = function()
	{
		for(var i=0; i < this.anchorsPoints.length; i++)
		{
			// this.anchorsPoints[i].GetBody().SetFixedRotation(true);
		}

		this.center.GetBody().SetFixedRotation(true);
	}
	this.blockRotations();
/******************************/
	this.update = function()
	{
		this.move();
		this.jump();
		this.crouch();
		// this.render();
	}

	this.texture = new Image();
	this.texture.src = "medias/texture.jpg";

	this.render = function()
	{
		context.save();
		context.lineWidth = 3;
		context.beginPath((this.anchorsPoints[0].m_body.x*30), (this.anchorsPoints[0].m_body.y*30));
		context.strokeStyle = "rgb(50, 125, 50)";
		context.moveTo((this.anchorsPoints[0].m_body.m_sweep.c.x*30), (this.anchorsPoints[0].m_body.m_sweep.c.y*30));

		for(var i = 0; i < this.anchorsPoints.length; i++)
		{
			if(i < this.anchorsPoints.length-1)
			{
				context.lineTo((this.anchorsPoints[i+1].m_body.m_sweep.c.x*30), (this.anchorsPoints[i+1].m_body.m_sweep.c.y*30));
				context.stroke();
			}
			else
			{
				context.lineTo((this.anchorsPoints[0].m_body.m_sweep.c.x*30), (this.anchorsPoints[0].m_body.m_sweep.c.y*30));
				context.stroke();
			}
		}

		context.closePath();
		context.clip();

		var imgSize = this.calcRapport();

		// context.drawImage(this.texture, 0, 0, 350, 225, (this.center.m_body.m_sweep.c.x*30) - 150 - ((imgSize.width*225*2)/100)/2, (this.center.m_body.m_sweep.c.y*30) - 112 - ((imgSize.height*225*2)/100)/2, 350+((imgSize.width*2*225)/100), 225+((imgSize.height*2*225)/100));
		context.fillStyle = "rgb(100, 255, 100)";
		context.fillRect((this.center.m_body.m_sweep.c.x*30) - 150, (this.center.m_body.m_sweep.c.y*30) - 112, 350, 225);
		context.restore();
	}

	this.calcRapport = function()
	{
		var rapport = {};
		var dist = Math.sqrt(sqr((this.anchorsPoints[0].m_body.m_sweep.c.x)-(this.anchorsPoints[this.anchorsPoints.length/2].m_body.m_sweep.c.x)) + 
							sqr((this.anchorsPoints[0].m_body.m_sweep.c.y)-(this.anchorsPoints[this.anchorsPoints.length/2].m_body.m_sweep.c.y)));

		rapport.height = Math.abs(((150 - (dist*30))/150)*30);

		dist = Math.sqrt(sqr((this.anchorsPoints[(this.anchorsPoints.length/4)*3].m_body.m_sweep.c.x)-(this.anchorsPoints[this.anchorsPoints.length/4].m_body.m_sweep.c.x)) + 
							sqr((this.anchorsPoints[(this.anchorsPoints.length/4)*3].m_body.m_sweep.c.y)-(this.anchorsPoints[this.anchorsPoints.length/4].m_body.m_sweep.c.y)));
		rapport.width = Math.abs(((150 - (dist*30))/150)*30);

		return rapport;
	}

	this.goLeft = false;
	this.goRight = false;
	this.goUp = false;
	this.crouching = false;

	this.move = function()
	{
		if(this.goLeft)
		{
			for(var i = 0; i < this.anchorsPoints.length; i++)
			{
				this.anchorsPoints[i].GetBody().ApplyImpulse(new b2Vec2(-0.01, 0), this.anchorsPoints[i].GetBody().GetWorldCenter());
			}

			this.center.GetBody().ApplyImpulse(new b2Vec2(-1, 0), this.center.GetBody().GetWorldCenter());
		}
		else if(this.goRight)
		{
			for(var i = 0; i < this.anchorsPoints.length; i++)
			{
				this.anchorsPoints[i].GetBody().ApplyImpulse(new b2Vec2(0.01, 0), this.anchorsPoints[i].GetBody().GetWorldCenter());
			}

			this.center.GetBody().ApplyImpulse(new b2Vec2(1, 0), this.center.GetBody().GetWorldCenter());
		}
	}

	this.jump = function()
	{
		if(this.goUp)
		{
			for(var i = 0; i < this.anchorsPoints.length; i++)
			{
				this.anchorsPoints[i].GetBody().ApplyImpulse(new b2Vec2(0, -0.1), this.anchorsPoints[i].GetBody().GetWorldCenter());
			}

			// this.center.GetBody().ApplyImpulse(new b2Vec2(0, -1), this.center.GetBody().GetWorldCenter());

			this.goUp = false;
		}
	}

	this.crouch = function()
	{
		if(this.crouching)
		{
			this.center.GetBody().ApplyImpulse(new b2Vec2(0, 0.5), this.center.GetBody().GetWorldCenter());
		}
	}

/************************************/
}

/***********************************/

var AnchorPoint = function(object)
{
	bodyDef = new b2BodyDef;
   	fixDef = new b2FixtureDef;
   	fixDef.density = object.density || 1.0;
   	fixDef.friction = object.friction || 1.0;
   	fixDef.restitution = object.restitution || 0.4;
	fixDef.filter.categoryBits = categories.player;
	fixDef.filter.maskBits = masks.player;

   	fixDef.shape = new b2CircleShape(object.radius);

   	bodyDef.type = b2Body.b2_dynamicBody;
   	bodyDef.position.x = object.x;
   	bodyDef.position.y = object.y;
   	bodyDef.userData = object.tag;

   	return world.CreateBody(bodyDef).CreateFixture(fixDef);
}

var Body = function(object)
{
	bodyDef = new b2BodyDef;
   fixDef = new b2FixtureDef;
   fixDef.density = object.density || 1.0;
   fixDef.friction = object.friction || 0.5;
   fixDef.restitution = object.restitution || 0.4;
	fixDef.filter.categoryBits = categories.player;
	fixDef.filter.maskBits = masks.player;

   fixDef.shape = new b2PolygonShape;
   fixDef.shape.SetAsBox(object.width, object.height);

   bodyDef.type = b2Body.b2_dynamicBody;
   bodyDef.position.x = object.x;
   bodyDef.position.y = object.y;
   bodyDef.userData = object.tag;

   return world.CreateBody(bodyDef).CreateFixture(fixDef);
}

function linkTo(i, j, dRatio, fHz, length)	//Elastic Joint
{
	var def = new Box2D.Dynamics.Joints.b2DistanceJointDef();
    def.Initialize(i.m_body,
    				j.m_body,
                   	i.m_body.GetWorldCenter(),
                   	j.m_body.GetWorldCenter());
    def.dampingRatio = dRatio || 0.05;
    def.frequencyHz = fHz || 1;
    def.collideConnected = true;

    if(length)
    {
    	def.length = length;
    }
  
    var joint = world.CreateJoint(def);

	return joint;
}

function solidLink(i, j)	//Solid Joint
{
	var def = new Box2D.Dynamics.Joints.b2DistanceJointDef();
    def.Initialize(i.m_body,
    				j.m_body,
                   	i.m_body.GetWorldCenter(),
                   	j.m_body.GetWorldCenter());
    var joint = world.CreateJoint(def);

	return joint;
}

function prismaticJoint(i,j)	//Prismatic Joint
{
	var def = new Box2D.Dynamics.Joints.b2PrismaticJointDef();

    def.Initialize(i.m_body,
    				j.m_body,
                   	i.m_body.GetWorldCenter(),
                   	j.m_body.GetWorldCenter());

    // def.enableLimit = true;
    // def.lowerTranslation = 50/30;
    // def.upperTranslation = 100/30;

    var joint = world.CreateJoint(def);

	return joint;
}

function revoluteJoint(i, j)
{
	var def = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
           def.Initialize(i.m_body,
                 j.m_body,
                 i.m_body.GetWorldCenter());

   	var joint = world.CreateJoint(def);

         return joint;
}