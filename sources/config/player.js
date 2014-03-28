function Player(properties)
{
	this.x = properties.x;
	this.y = properties.y;

	this.anchorsPoints = [];

	this.normalProp = {
		name : "normal",
		center :{width: 30, height: 35},
		color: "rgb(50, 255, 50)"
	};

	this.solidProp = {
		name: "solid",
		center :{width: 30, height: 35},
		color: "rgb(50, 225, 100)"
	};

	this.humideProp = {
		name: "humide",
		center :{width: 30, height: 35},
		color: "rgb(10, 100, 10)"
	};

	this.liquidProp = {
		name: "liquid",
		center :{width: 10, height: 10},
		nbAnchors: 20,
		rayon: 45,
		color: "rgb(50, 255, 50)"
	};

	this.state = this.normalProp;

	this.center;
/*******************************
	Fonctions basiques
*******************************/
	//Initialisation
	this.init = function()
	{
		this.changeState(this.state);
		this.blockRotations();
	}

	//Update
	this.update = function()
	{
		this.move();
		this.jump();
		// this.crouch();
		this.updatePos();
		this.render();

		if(!this.onGround)
			this.canChangeState = false;
	}

	//Update de la position du center, pour simplifier l'utilisation des valeurs
	this.updatePos = function()
	{
		if(!this.renderPause)
		{
			this.x = this.center.GetBody().GetWorldCenter().x * 30;
			this.y =  this.center.GetBody().GetWorldCenter().y * 30;
		}
	}

	this.renderPause = false;	//Pour mettre en pause le render le temps de changer l'objet
	//Render
	this.render = function()
	{
		if(!this.renderPause)
		{
			if(this.state.name == "liquid")
				this.liquidRender();
			else
				this.otherRender();
		}	
	}

	this.liquidRender = function()
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

		
		context.fillStyle = this.state.color;
		context.fillRect((this.center.m_body.m_sweep.c.x*30) - 150, (this.center.m_body.m_sweep.c.y*30) - 112, 350, 225);
		context.restore();
	}

	this.otherRender = function()
	{
		context.fillStyle = this.state.color;
		context.fillRect(this.x - (this.state.center.width), this.y - (this.state.center.height), this.state.center.width*2, this.state.center.height*2);
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

/*******************************
	Etats
*******************************/
	/************************
		Changement de 
		l'état (temporaire)
	************************/
	this.statesBis = [this.normalProp, this.liquidProp, this.solidProp, this.humideProp];
	this.currentStateBis = 0;
	this.canChangeState = true;

	this.changeStateBis = function()	//Pour le test, afin de passer plus simplement entre chaque états
	{
		if(this.currentStateBis < this.statesBis.length-1)
			this.currentStateBis += 1;
		else
			this.currentStateBis = 0;

		this.renderPause = true;

		if(this.center)
		{
			world.DestroyBody(this.center.GetBody());
		}

		switch(this.statesBis[this.currentStateBis])
		{
			case this.normalProp:
				this.state = this.statesBis[this.currentStateBis];
				this.setNormal();
				this.center.GetBody().SetSleepingAllowed(false);
				this.renderPause = false;
			break;

			case this.humideProp:
				this.state = this.statesBis[this.currentStateBis];
				this.setHumide();
				this.center.GetBody().SetSleepingAllowed(false);
				this.renderPause = false;
			break;

			case this.solidProp:
				this.state = this.statesBis[this.currentStateBis];

				for(var i = 0; i < this.jointList.length; i++)
				{
					world.DestroyJoint(this.jointList[i]);
				}

				for(var i = 0; i < this.anchorsPoints.length; i++)
				{
					var _body = this.anchorsPoints[i].GetBody();

					world.DestroyBody(_body);
				}

				this.setSolid();
				this.center.GetBody().SetSleepingAllowed(false);
				this.renderPause = false;
			break;

			case this.liquidProp:
				this.jointList = [];
				this.anchorsPoints = [];
				this.center = {};
				this.state = this.statesBis[this.currentStateBis];
				this.setLiquid();
				this.center.GetBody().SetSleepingAllowed(false);
				this.renderPause = false;
			break;
		}

		UI.displayState(this.state.name);
	}

	this.jointList = [];
	this.anchorsPoints = [];

	this.changeStateNormal = function()
	{
		
		this.renderPause = true;

		if(this.center)
		{
			world.DestroyBody(this.center.GetBody());
		}

		if (this.jointList.length > 0 && this.anchorsPoints.length > 0)
			{
				for(var i = 0; i < this.jointList.length; i++)
				{
					world.DestroyJoint(this.jointList[i]);
				}

				for(var i = 0; i < this.anchorsPoints.length; i++)
				{
					var _body = this.anchorsPoints[i].GetBody();

					world.DestroyBody(_body);
				}
			}
		this.state = this.normalProp;
		this.setNormal();
		this.center.GetBody().SetSleepingAllowed(false);
		this.renderPause = false;

		UI.displayState(this.state.name);
	}

this.changeStateHumide = function()
	{
		
		this.renderPause = true;

		if(this.center)
		{
			world.DestroyBody(this.center.GetBody());
		}

		if (this.jointList.length > 0 && this.anchorsPoints.length > 0)
			{
				for(var i = 0; i < this.jointList.length; i++)
				{
					world.DestroyJoint(this.jointList[i]);
				}

				for(var i = 0; i < this.anchorsPoints.length; i++)
				{
					var _body = this.anchorsPoints[i].GetBody();

					world.DestroyBody(_body);
				}
			}
		this.state = this.humideProp;
		this.setHumide();
		this.center.GetBody().SetSleepingAllowed(false);
		this.renderPause = false;

		UI.displayState(this.state.name);
	}

this.changeStateSolid = function()
	{
		
		this.renderPause = true;

		if(this.center)
		{
			world.DestroyBody(this.center.GetBody());
		}

		if (this.jointList.length > 0 && this.anchorsPoints.length > 0)
			{
				for(var i = 0; i < this.jointList.length; i++)
				{
					world.DestroyJoint(this.jointList[i]);
				}

				for(var i = 0; i < this.anchorsPoints.length; i++)
				{
					var _body = this.anchorsPoints[i].GetBody();

					world.DestroyBody(_body);
				}
			}
			this.state = this.solidProp;
			this.setSolid();
			this.center.GetBody().SetSleepingAllowed(false);
			this.renderPause = false;


		UI.displayState(this.state.name);
	}

this.changeStateLiquid = function()
{
		
	this.renderPause = true;

	if(this.center)
	{
		world.DestroyBody(this.center.GetBody());
	}
			this.state = this.liquidProp;
			this.jointList = [];
			this.anchorsPoints = [];
			this.center = {};
			this.setLiquid();
			this.center.GetBody().SetSleepingAllowed(false);
			this.renderPause = false;


		UI.displayState(this.state.name);
	}
	
	/************************
		Changement de 
		l'état
	************************/
	this.changeState = function(etat)
	{
		this.renderPause = true;

		if(this.center)
		{
			world.DestroyBody(this.center.GetBody());
		}

		this.state = etat;

		switch(etat.name)
		{
			case "normal":
				this.setNormal();
				this.center.GetBody().SetSleepingAllowed(false);
				this.renderPause = false;
			break;

			case "humide":
				this.setHumide();
				this.center.GetBody().SetSleepingAllowed(false);
				this.renderPause = false;
			break;

			case "solid":
				this.setSolid();
				this.center.GetBody().SetSleepingAllowed(false);
				this.renderPause = false;
			break;

			case "liquid":
				this.setLiquid();
				this.center.GetBody().SetSleepingAllowed(false);
				this.renderPause = false;
			break;
		}
	}
	/***********************/	
	/************************
		Normal
	************************/
	this.setNormal = function()
	{
		this.center = new Body({
			x: this.x/30,
			y: this.y/30,
			width: this.normalProp.center.width/30,
			height: this.normalProp.center.height/30,
			density: 1.5,
			tag: {tag:"player", obj: this}
		});

		this.blockRotations();
	}
	/***********************/
	/************************
		Solid
	************************/
	this.setSolid = function()
	{
		this.center = new Body({
			x: this.x/30,
			y: this.y/30,
			width: this.solidProp.center.width/30,
			height: this.solidProp.center.height/30,
			density: 1.5,
			tag: {tag:"player", obj: this}
		});

		this.blockRotations();
	}
	/***********************/
	/************************
		Humide
	************************/
	this.setHumide = function()
	{
		this.center = new Body({
			x: this.x/30,
			y: this.y/30,
			width: this.humideProp.center.width/30,
			height: this.humideProp.center.height/30,
			density: 1.5,
			tag: {tag:"player", obj: this},
			friction: 0.8
		});

		this.blockRotations();
	}

	this.checkSideWall = function(param)	//Check de quelle coté est le mur pour le wall jump en humide
	{
		var _pos = {};

		_pos.x = param.obj.x*30;
		_pos.y = param.obj.y*30;

		if(this.x < _pos.x)
		{
			return 1;
		}
		else(this.x > _pos.x)
		{
			return -1;
		}
	}
	/************************
		Liquid
	************************/
	this.setLiquid = function()
	{
		this.center = new Body({
			x: this.x/30,
			y: this.y/30,
			width: this.liquidProp.center.width/30,
			height: this.liquidProp.center.height/30,
			density: 0.001,
			tag: {tag:"player", obj: this}
		});

		this.jointList = [];

		this.drawAnchorsPointsLiquid(this.state.rayon, this.state.nbAnchors);	//Création des points d'ancrages (dont le nombre doit être un multiple de 8)
		this.linksAnchor(2.5);		//Premier reliage des points à l'aide de jointures de type "springey" (élastique), on relit les points en faisant le tour
		this.linksAnchor2(1.5);	//Second reliage des points avec des jointures "solid", tout les 2 points
		this.linksAnchor3(1.5);
		// this.linksAnchor4(1);
		this.linkCenterToAnchors(6);

		this.blockRotations();
	}

	this.calcPos = function(angle)	//Calcul des coordonnées du point sur le cercle
	{
		var x = Math.cos(angle);
		var y = Math.sin(angle);

		return	{x: x, y: y};
	}

	this.drawAnchorsPointsLiquid = function(r, nbPts)	//Fonction de création des points
	{
		for(var i = 0; i < nbPts; i++)
		{
			var angle = Math.PI * ((360/nbPts)*i) / 180;	//En radian

			var pos = this.calcPos(angle);

			if(i == (nbPts/4))
			{
				this.anchorsPoints.push(new AnchorPoint({
					x: ((pos.x*r)+(this.x))/30,
					y: (((pos.y*r)+(this.y)) - 10)/30,
					radius: (5/30),
					density: 0.02,
					tag: {tag:"player", obj: this}
				}));
			}
			else
			{
				this.anchorsPoints.push(new AnchorPoint({
					x: ((pos.x*r)+(this.x))/30,
					y: ((pos.y*r)+(this.y))/30,
					radius: (5/30),
					density: 0.02,
					tag: {tag:"player", obj: this}
				}));
			}		
		}
	}

	this.linksAnchor = function(damp)	//Springy link
	{
		for(var i = 0; i < this.anchorsPoints.length; i++)
		{
			if(i < this.anchorsPoints.length-1)
			{
				var a = this.anchorsPoints[i];
				var b = this.anchorsPoints[i+1];

				this.jointList.push(linkTo(a, b, 1, 2));
			}
			else
			{
				this.jointList.push(linkTo(this.anchorsPoints[i], this.anchorsPoints[0], 0.1, damp));
			}
		}
	}

	this.linksAnchor2 = function(damp)
	{
		for(var i = 0; i < this.anchorsPoints.length; i++)
		{
			if(i % 2 == 0)	//Si i est paire
			{
				if(i < this.anchorsPoints.length-2)
				{
					this.jointList.push(linkTo(this.anchorsPoints[i], this.anchorsPoints[i+2], 0.2, damp));
				}
				else
				{
					this.jointList.push(linkTo(this.anchorsPoints[i], this.anchorsPoints[0], 0.2, damp));
				}
			}
			else	//Si i est impaire
			{
				if(i < this.anchorsPoints.length-1)
				{
					this.jointList.push(linkTo(this.anchorsPoints[i], this.anchorsPoints[i+2], 0.2, damp));
				}
				else
				{
					this.jointList.push(linkTo(this.anchorsPoints[i], this.anchorsPoints[1], 0.2, damp));
				}
			}
		}
	}

	this.linksAnchor3 = function(damp)
	{
		for(var i = 0; i < this.anchorsPoints.length; i++)
		{
			if(i < this.anchorsPoints.length-3)
			{
				this.jointList.push(linkTo(this.anchorsPoints[i], this.anchorsPoints[i+3], 2, damp));
			}
			else if(i < this.anchorsPoints.length-2)
			{
				this.jointList.push(linkTo(this.anchorsPoints[i], this.anchorsPoints[0],2, damp));
			}
			else if(i < this.anchorsPoints.length-1)
			{
				this.jointList.push(linkTo(this.anchorsPoints[i], this.anchorsPoints[1], 2, damp));
			}
			else
			{
				this.jointList.push(linkTo(this.anchorsPoints[i], this.anchorsPoints[2], 2, damp));
			}
		}
	}

	this.linksAnchor4 = function(damp)
	{
		for(var i = 0; i < this.anchorsPoints.length; i++)
		{
			if(i < this.anchorsPoints.length-4)
			{
				this.jointList.push(linkTo(this.anchorsPoints[i], this.anchorsPoints[i+4], 2.5, damp));
			}
			else if(i < this.anchorsPoints.length-3)
			{
				this.jointList.push(linkTo(this.anchorsPoints[i], this.anchorsPoints[0], 2.5, damp));
			}
			else if(i < this.anchorsPoints.length-2)
			{
				this.jointList.push(linkTo(this.anchorsPoints[i], this.anchorsPoints[1], 2.5, damp));
			}
			else if(i < this.anchorsPoints.length-1)
			{
				this.jointList.push(linkTo(this.anchorsPoints[i], this.anchorsPoints[2], 2.5, damp));
			}
			else
			{
				this.jointList.push(linkTo(this.anchorsPoints[i], this.anchorsPoints[3], 2.5, damp));
			}
		}
	}
/******************************/
/*******************************
	Gestion des points
	 d'ancrages
*******************************/
	//Destruction de tout les points d'ancrages
	this.destroyAnchorsPoints = function()
	{
		for(var i = 0; i < this.anchorsPoints.length; i++)
		{
			var _body = this.anchorsPoints[i].GetBody();

			world.DestroyBody(_body);
		}
	}

	//Link de tout les pionts d'ancrage avec le centre
	this.linkCenterToAnchors = function(damp)
	{
		for(var i = 0; i < this.anchorsPoints.length; i++)
		{
			this.jointList.push(linkTo(this.center, this.anchorsPoints[i], 2.5, damp, (this.state.rayon/30)));
		}
	}
/******************************/
/******************************
	Gestion mouvements
******************************/
	this.goLeft = false;
	this.goRight = false;
	this.stopMove = false;
	this.canMove = true;

	this.move = function()
	{
		if(this.canMove)
		{
			var vel = this.center.GetBody().GetLinearVelocity();

			if(this.goLeft)
			{
				if(this.state.name == "liquid")
					vel.x = -25;
				else
					vel.x = -10
			}
			else if(this.goRight)
			{
	    		if(this.state.name == "liquid")
					vel.x = 25;
				else
					vel.x = 10
			}
			else if(this.stopMove)
			{
				if(this.state.name == "solid")	//Si on est solide (gelé) on glisse
				{
					if(vel.x < -1)
						vel.x += 1;
					else if(vel.x > 1)
						vel.x -= 1;
					else
						vel.x = 0;
				}
				else
				{
					vel.x = 0;
				}				
			}
		}		
	}

	this.goUp = false;
	this.canJump = false;
	this.onGround = false;
	this.onWall = false;

	this.wallJump = function(sens)
	{
		this.center.GetBody().ApplyImpulse(new b2Vec2(150*sens, -450),this.center.GetBody().GetWorldCenter());
	}

	this.jump = function()
	{
		if(this.state.name == "liquid")
		{
			if(this.goUp && this.canJump)
			{
				for(var i = 0; i < this.anchorsPoints.length; i++)
				{
					this.anchorsPoints[i].GetBody().ApplyImpulse(new b2Vec2(0, -0.025), this.anchorsPoints[i].GetBody().GetWorldCenter());
				}

				this.onGround = false;
		        this.canJump = false;
				this.goUp = false;
			}
		}
		else if(this.goUp && this.canJump)
		{
			this.center.GetBody().ApplyImpulse(new b2Vec2(0, -100),this.center.GetBody().GetWorldCenter()); 

			this.onGround = false;
            this.canJump = false;
			this.goUp = false;
		}
	}
/*****************************/
/*****************************
	Gestion des collisions
*****************************/
	this.preCollide = function(who)
	{
		switch (who.tag)
		{
			case "wall":
				this.alsoColled = true;
			break;
		}
	}

	this.onCollide = function(who)
	{
		switch (who.tag)
		{
			case "floor":
				this.canJump = true;
				this.canMove = true;
				this.onGround = true;
				this.onWall = false;
				this.canChangeState = true;
			break;

			case "brekable":
				this.canJump = true;
				this.canMove = true;
				this.onGround = true;
			break;

			case "wall":
				this.canChangeState = false;
				if(this.state.name == "humide")
				{
					this.onWall = true;
					this.canJump = true;

					var _sens = this.checkSideWall(who);

					if(this.alsoColled)
					{
						if(_sens == -1)
						{
							this.canMove = true;
							this.goLeft = true;
							if(this.goRight || this.crouching)
							{
								this.goLeft = false;
							}
						}
						else if(_sens == 1)
						{
							this.canMove = true;
							this.goRight = true;
							if(this.goLeft || this.crouching)
							{
								this.goRight = false;
							}
						}

						if(this.goUp)
						{
							this.canMove = false;
							this.goLeft = false;
							this.goRight = false;
							this.wallJump(_sens);
							this.canJump = false;
						}
					}
				}
			break;
		}
	}

	this.endCollide = function(who)
	{
		switch (who.tag)
		{
			case "floor":
				this.canJump = false;
				this.canChangeState = false;
			break;

			case "wall":
				this.canChangeState = true;
			break;
		}
	}

	this.postCollide = function(who)
	{
		switch (who.tag)
		{
			case "wall":

			break;
		}
	}
/*****************************/
	//Blockage de la rotation des blocs
	this.blockRotations = function()
	{
		// for(var i=0; i < this.anchorsPoints.length; i++)
		// {
		// 	this.anchorsPoints[i].GetBody().SetFixedRotation(true);
		// }

		this.center.GetBody().SetFixedRotation(true);
	}
	/*****Init*****/
	this.init();
}
/**********************************
	Objets B2D
**********************************/
//Points d'ancrages
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
//Center du perso
var Body = function(object)
{
	bodyDef = new b2BodyDef;
   fixDef = new b2FixtureDef;
   fixDef.density = object.density || 1.0;
   fixDef.friction = object.friction || 0;
   fixDef.restitution = object.restitution || 0;
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
//Jointure elastic
function linkTo(i, j, dRatio, fHz, length)
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
//Jointure solid
function solidLink(i, j)
{
	var def = new Box2D.Dynamics.Joints.b2DistanceJointDef();
    def.Initialize(i.m_body,
    				j.m_body,
                   	i.m_body.GetWorldCenter(),
                   	j.m_body.GetWorldCenter());
    var joint = world.CreateJoint(def);

	return joint;
}
//Jointure revolute
function revoluteJoint(i, j)
{
	var def = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
           def.Initialize(i.m_body,
                 j.m_body,
                 i.m_body.GetWorldCenter());

   	var joint = world.CreateJoint(def);

         return joint;
}