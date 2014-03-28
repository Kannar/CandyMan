function Player(properties)
{
	this.x = properties.x;
	this.y = properties.y;

	this.skin = new Image();
	this.skin.src = "medias/player.png";
	this.animX = 0;
	this.animY = 0;

	this.direction = {name: "right", decalAnimY: 0};

	this.life = 3;

	this.anchorsPoints = [];

	this.normalProp = {
		name : "normal",
		center :{width: 30, height: 35},
		color: "rgb(50, 255, 50)",
		decalAnimY: 0
	};

	this.solidProp = {
		name: "solid",
		center :{width: 30, height: 35},
		color: "rgb(50, 225, 100)",
		decalAnimY: 1
	};

	this.humideProp = {
		name: "humide",
		center :{width: 30, height: 35},
		color: "rgb(10, 100, 10)",
		decalAnimY: 2
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

	this.leftDetector;	//Pour détécter le mur
	this.rightDetector;	//Idem
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
		this.courbJump();
		// this.crouch();
		this.updatePos();
		this.render();

		if(this.state.name == "humide")
			this.detectionIfOnAWall();
		else if(this.state.name == "liquid")
			this.raycastSaveBlob();

		// 	this.updateDetectors();

		this.detectionIfGrounded();	//Detection du sol et conséquences

		if(!this.onGround)
			this.canChangeState = false;

		this.timerCurrent();

		this.checkNeedChange();

		if(this.y > sceneHeight)
			window.location.reload();
	}

	this.nextState = null;
	this.checkNeedChange = function()
	{
		if(this.nextState != null)
		{
			if(this.nextState == "humide")
				this.changeStateHumide();
			else if(this.nextState == "solid")
				this.changeStateSolid();
			else if(this.nextState == "liquid")
				this.changeStateLiquid();
			else if(this.nextState == "normal")
				this.changeStateNormal();
		}

		this.nextState = null;
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
		mainContext.save();
		mainContext.lineWidth = 3;
		mainContext.beginPath((this.anchorsPoints[0].m_body.x*30), (this.anchorsPoints[0].m_body.y*30));
		mainContext.strokeStyle = "rgb(50, 125, 50)";
		mainContext.moveTo((this.anchorsPoints[0].m_body.m_sweep.c.x*30), (this.anchorsPoints[0].m_body.m_sweep.c.y*30));

		for(var i = 0; i < this.anchorsPoints.length; i++)
		{
			if(i < this.anchorsPoints.length-1)
			{
				mainContext.lineTo((this.anchorsPoints[i+1].m_body.m_sweep.c.x*30), (this.anchorsPoints[i+1].m_body.m_sweep.c.y*30));
				mainContext.stroke();
			}
			else
			{
				mainContext.lineTo((this.anchorsPoints[0].m_body.m_sweep.c.x*30), (this.anchorsPoints[0].m_body.m_sweep.c.y*30));
				mainContext.stroke();
			}
		}

		mainContext.closePath();
		mainContext.clip();

		var imgSize = this.calcRapport();
		
		mainContext.fillStyle = this.state.color;
		mainContext.fillRect((this.center.m_body.m_sweep.c.x*30) - 150, (this.center.m_body.m_sweep.c.y*30) - 112, 350, 225);
		mainContext.restore();
	}

	this.otherRender = function()
	{
		mainContext.fillStyle = this.state.color;
		mainContext.fillRect(this.x - (this.state.center.width), this.y - (this.state.center.height), this.state.center.width*2, this.state.center.height*2);

		// this.animation();
	}

	this.onAnimIdle = true;
	this.animation = function()
	{
		// if(this.onAnimWalk)
		// 	mainContext
		if(this.onAnimIdle)
		{
			mainContext.drawImage(this.skin, this.animX*379.5, (this.state.decalAnimY + this.direction.decalAnimY)*508.8, 379.5, 508.8, this.x - 37, this.y - 45, 86, 100);
		}
	}
/**********************************/
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
	*	Timer on special 
	*	state
	************************/
	this.timeOnState = 15*60;
	this.currentTimeOnState = 0;
	this.currentStatePoper;

	this.timerCurrent = function()
	{
		if(this.state.name != "normal")
		{
			if(this.currentTimeOnState == 0)
			{
				this.currentTimeOnState = 15*60;
			}
			else if(this.currentTimeOnState > 1)
			{
				this.currentTimeOnState = this.currentTimeOnState - 1;
			}
			else if(this.currentTimeOnState == 1)
			{
				this.nextState = "normal";

				this.currentTimeOnState = 0;

				this.currentStatePoper.popNewCandy();
			}
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
			restitution: 0.001,
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

	this.updateDetectors = function()	//On update la pos des detecteurs de murs
	{
		this.rightDetector.collider.GetBody().GetPosition().x = this.center.GetBody().GetPosition().x - (this.humideProp.center.width/30);
		this.rightDetector.collider.GetBody().GetPosition().y = this.center.GetBody().GetPosition().y;

		this.leftDetector.collider.GetBody().GetPosition().x = this.center.GetBody().GetPosition().x + (this.humideProp.center.width/30);
		this.leftDetector.collider.GetBody().GetPosition().y = this.center.GetBody().GetPosition().y;
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
			tag: {tag:"center", obj: this}
		});

		this.jointList = [];

		this.drawAnchorsPointsLiquid(this.state.rayon, this.state.nbAnchors);	//Création des points d'ancrages (dont le nombre doit être un multiple de 8)
		this.linksAnchor(2.5);		//Premier reliage des points à l'aide de jointures de type "springey" (élastique), on relit les points en faisant le tour
		this.linksAnchor2(1.5);	//Second reliage des points avec des jointures "solid", tout les 2 points
		this.linksAnchor3(1.5);
		// this.linksAnchor4(1);
		this.linkCenterToAnchors(6);
		// console.log(this.skinColliders);

		this.blockRotations();
	}

	this.calcPos = function(angle)	//Calcul des coordonnées du point sur le cercle
	{
		var x = Math.cos(angle);
		var y = Math.sin(angle);

		return	{x: x, y: y};
	}

	this.stockDiffPos = [];	//Variable de stockage des différence de position entre anchors et center
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

			var _center = {x: this.center.GetBody().GetPosition().x, y: this.center.GetBody().GetPosition().y};

			var _x = this.anchorsPoints[this.anchorsPoints.length-1].GetBody().GetPosition().x - _center.x;
			var _y = this.anchorsPoints[this.anchorsPoints.length-1].GetBody().GetPosition().y - _center.y;

			this.stockDiffPos.push({x: _x, y: _y});
		}
	}

	this.displayAnchorsPos = function()
	{
		for(var i=0; i<this.anchorsPoints.length; i++)
		{
			console.log(i+"= x: "+(this.center.GetBody().GetPosition().x - this.anchorsPoints[i].GetBody().GetPosition().x)+", y: "+(this.center.GetBody().GetPosition().y - this.anchorsPoints[i].GetBody().GetPosition().y));
		}
	}

	this.skinColliders = [];
	this.drawSkin = function()	//Pour créer des colliders qui servent de "peau" entre chaques points
	{
		for(var i = 0; i < this.anchorsPoints.length; i++)
		{
			var _pos = {};
			var _angle = {};
			var _width;

			var _currentPos;
			var _nextPos;

			_currentPos = this.anchorsPoints[i];

			if(i < this.anchorsPoints.length-1)
			{
				_nextPos = this.anchorsPoints[i+1];
			}
			else if(i == this.anchorsPoints.length-1)
			{
				_nextPos = this.anchorsPoints[0];
			}

			_pos.x = _currentPos.GetBody().GetPosition().x + (_nextPos.GetBody().GetPosition().x - _currentPos.GetBody().GetPosition().x);
			_pos.y = _currentPos.GetBody().GetPosition().y + (_nextPos.GetBody().GetPosition().y - _currentPos.GetBody().GetPosition().y);

			_width = m_dist(_currentPos, _nextPos);

			_angle = m_angleRad(_currentPos, _nextPos);

			this.skinColliders.push(new Collider({
				x: _pos.x*30,
				y: _pos.y*30,
				width: _width*30,
				height: 1/30,
				shape: "square",
				type: "dynamic",
				data: {tag: "", parent: null},
				mask: masks.player,
				category: categories.player
			}));

			console.table(this.skinColliders);
			//this.skinColliders[this.skinColliders.length-1].GetBody().SetAngle(_angle);

			// solidLink(_currentPos, this.skinColliders[this.skinColliders.length-1]);	//Avec le premier point
			// solidLink(this.skinColliders[this.skinColliders.length-1], _nextPos);	//Avec le second point
		}
	}

	this.firstPoint;	//Variables de stockage du premier point
	this.secondPoint;	//Variables de stockage du second point
	this.raycastSaveBlob = function()	//Pour surveiller que le blob ne parte pas en cacahuète
	{
		for(var i = 0; i < this.anchorsPoints.length; i++)
		{
			var _current;
			var _currentPos;

			var _next;
			var _nextPos;

			_current = this.anchorsPoints[i];
			_currentPos = this.anchorsPoints[i].GetBody().GetPosition();

			if(i < this.anchorsPoints.length-1)
			{
				_next = this.anchorsPoints[i+1];
				_nextPos = this.anchorsPoints[i+1].GetBody().GetPosition();
			}
			else if(i == this.anchorsPoints.length-1)
			{
				_next = this.anchorsPoints[0];
				_nextPos = this.anchorsPoints[0].GetBody().GetPosition();
			}

			this.firstPoint = _current;
			this.secondPoint = _next;

			world.RayCast(this.callbackSaveBlob, _currentPos, _nextPos);
		}
	}

	this.callbackSaveBlob = function(element)	//Callback pour save la forme du blob
	{
		if(element.GetBody().GetUserData().tag == "center")	//il faut différencier celui qu'on regarde et les autres
		{
			// player.changeStateLiquid();
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

	this.newLinkCenterToAnchors = function()
	{
		for(var i=0; i<this.stockDiffPos.length; i++)
		{
			//Calculer axe entre les 2 pts, max 1(ex: new b2Vec2(1, 0.5));
			if(i%4 == 0)
			{
				var _axis = {};

				_axis.x = this.stockDiffPos[i].x;
				_axis.y = this.stockDiffPos[i].y;

				var _greater = m_compareN(_axis.x, _axis.y);

				_axis.x = _axis.x/_greater;
				_axis.y = _axis.y/_greater;

				this.jointList.push(prismaticJoint(this.anchorsPoints[i], this.center, -1, 1, new b2Vec2(1, 0)));
			}
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

			// if(this.state.name == "humide")
			// {
			// 	var _leftDetectorVel = this.leftDetector.GetBody().GetLinearVelocity();
			// 	var _rightDetectorVel = this.rightDetector.GetBody().GetLinearVelocity();
			// }

			if(this.goLeft)
			{
				if(this.state.name == "liquid")
					vel.x = -25;
				else if(this.state.name == "humide")
				{
					vel.x = -10;
					// _leftDetectorVel.x = -10;
					// _rightDetectorVel.x = -10;
				}
				else
					vel.x = -10
			}
			else if(this.goRight)
			{
	    		if(this.state.name == "liquid")
					vel.x = 25;
				else if(this.state.name == "humide")
				{
					vel.x = 10;
					// _leftDetectorVel.x = 10;
					// _rightDetectorVel.x = 10;					
				}
				else
					vel.x = 10
			}
			else if(this.stopMove && !this.goLeft && !this.goRight && this.onGround)
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
				else if(this.state.name == "humide")
				{
					vel.x = 0;
					// _leftDetectorVel.x = 0;
					// _rightDetectorVel.x = 0;					
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
	// this.onGround = false;
	this.onWall = false;

	this.wallJump = function(sens)
	{
		this.center.GetBody().ApplyImpulse(new b2Vec2(200*sens, -200),this.center.GetBody().GetWorldCenter());
	}

	this.jump = function()
	{
		if(this.state.name != "liquid" && this.goUp && this.canJump)
		{
			this.center.GetBody().ApplyImpulse(new b2Vec2(0, -100),this.center.GetBody().GetWorldCenter()); 

			// this.onGround = false;
            this.canJump = false;
		}
	}

	this.courbJump = function()
	{
		var _vel = this.center.GetBody().GetLinearVelocity();

		if(_vel.y > 0 && !this.onGround)
		{
			// _vel.y += 1;

			if(_vel.x > 0)
			{
				_vel.x -= 0.2;
			}
			else if(_vel.x < 0)
			{
				_vel.x += 0.2;
			}
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
			case "collectible":
				if(who.obj.type != "life")
				{
					this.nextState = who.obj.type;
					this.currentStatePoper = who.obj.poper;
				}
				// else
				// 	this.gainLife

				who.obj.toDestroy = true;
			break;

			case "floor":
				if((this.y + this.state.center.height/2 < who.obj.y) && ((this.x + this.state.center.width/2 > (who.obj.x - who.obj.width)) || (this.x - this.state.center.width/2 < who.obj.x + who.obj.width)))
				{
					// this.canJump = true;
					this.canMove = true;
					// this.onGround = true;
					this.onWall = false;
				}
			break;

			case "breakable":
				this.canJump = true;
				this.canMove = true;
				this.onGround = true;
			break;

			case "wall":
			break;

			case "trap":
				this.takeDamage(who.obj);
				this.goLeft = false;
				this.goRight = false;
			break;
		}
	}

	this.endCollide = function(who)
	{
		switch (who.tag)
		{
			case "floor":
				// this.canJump = false;
			break;

			case "wall":
				
			break;

			case "trap":
				this.canMove = true;
			break;
		}
	}

	this.postCollide = function(who)
	{
		switch (who.tag)
		{
			case "trap":
				this.canMove = true;
			break;
		}
	}
/*****************************/
//Raycast sol
this.detectionIfGrounded = function()
{
	player.onGround = false;	//Obliger d'utiliser la variable global du joueur, un peu salace recherche d'une soluce
	player.canJump = false;		//Idem

	world.RayCast(this.raycastCallbackFoot, new b2Vec2(this.center.GetBody().GetPosition().x, this.center.GetBody().GetPosition().y), new b2Vec2(this.center.GetBody().GetPosition().x - 30/30, this.center.GetBody().GetPosition().y + 36/30));	//Valeure de décalages en dur a remettre propre
	world.RayCast(this.raycastCallbackFoot, new b2Vec2(this.center.GetBody().GetPosition().x, this.center.GetBody().GetPosition().y), new b2Vec2(this.center.GetBody().GetPosition().x + 30/30, this.center.GetBody().GetPosition().y + 36/30));	//Valeure de décalages en dur a remettre propre

	if(!player.onGround)
	{
		for(var i=0; i<movablePlateforms.length; i=i+1)
		{
			if(movablePlateforms[i].playerOn)
			{
				movablePlateforms[i].stopMovePlayer();

				movablePlateforms[i].playerOn = false;

				break;
			}
		}
	}
}

this.onMovablePlateform = false;
this.raycastCallbackFoot = function(element, point)
{
	player.onGround = true;	//Idem bis

	if(!this.goUp)
		player.canJump = true;	//Idem ter

	if(element.GetBody().GetUserData().tag == "movablePlateform")
	{
		player.onMovablePlateform = true;
	}
	else
	{
		if(player.onMovablePlateform)	//A finir pour plateformes mobiles
		{
			for(var i=0; i<movablePlateforms.length; i=i+1)
			{
				if(movablePlateforms[i].playerOn)
				{
					movablePlateforms[i].stopMovePlayer();

					movablePlateforms[i].playerOn = false;

					break;
				}
			}

			player.onMovablePlateform = false;
		}
	}
}

//Raycast Walljump
this.detectionIfOnAWall = function()
{
	player.onWall = false;

	world.RayCast(this.raycastWallLeftCallback, new b2Vec2(this.center.GetBody().GetPosition().x, this.center.GetBody().GetPosition().y - 10/30), new b2Vec2(this.center.GetBody().GetPosition().x - 30.5/30, this.center.GetBody().GetPosition().y - 10/30));
	world.RayCast(this.raycastWallLeftCallback, new b2Vec2(this.center.GetBody().GetPosition().x, this.center.GetBody().GetPosition().y + 10/30), new b2Vec2(this.center.GetBody().GetPosition().x - 30.5/30, this.center.GetBody().GetPosition().y + 10/30));

	world.RayCast(this.raycastWallRightCallback, new b2Vec2(this.center.GetBody().GetPosition().x, this.center.GetBody().GetPosition().y - 10/30), new b2Vec2(this.center.GetBody().GetPosition().x + 30.5/30, this.center.GetBody().GetPosition().y - 10/30));
	world.RayCast(this.raycastWallRightCallback, new b2Vec2(this.center.GetBody().GetPosition().x, this.center.GetBody().GetPosition().y + 10/30), new b2Vec2(this.center.GetBody().GetPosition().x + 30.5/30, this.center.GetBody().GetPosition().y + 10/30));
}

this.raycastWallLeftCallback = function(element)
{
	if(element.GetBody().GetUserData().tag == "wall" || element.GetBody().GetUserData().tag == "floor")
	{
		player.onWall = true;

		if(!player.goUp && !player.crouching && !player.goRight)
			player.center.GetBody().ApplyImpulse(new b2Vec2(-50, 0), player.center.GetBody().GetPosition());
	}
	
	if(player.onWall && player.goUp)
	{
		player.center.GetBody().ApplyImpulse(new b2Vec2(100 + (-player.center.GetBody().GetLinearVelocity().x), -100), player.center.GetBody().GetPosition());
		player.goUp = false;
		player.onWall = false;
	}
}

this.raycastWallRightCallback = function(element)
{
	if(element.GetBody().GetUserData().tag == "wall" || element.GetBody().GetUserData().tag == "floor")
	{
		player.onWall = true;

		if(!player.goUp && !player.crouching && !player.goLeft)
			player.center.GetBody().ApplyImpulse(new b2Vec2(50, 0), player.center.GetBody().GetPosition());
	}
	
	if(player.onWall && player.goUp)
	{
		player.center.GetBody().GetLinearVelocity().x = 0;
		player.center.GetBody().ApplyImpulse(new b2Vec2(-100 + (-player.center.GetBody().GetLinearVelocity().x), -100), player.center.GetBody().GetPosition());
		player.goUp = false;
		player.onWall = false;
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

/*****************************/
	/*****************************
	*	Gestion de la santé 
	*	et blessures
	*****************************/
	//Réaction au blessures
	this.takeDamage = function(ennemy)
	{
		//On baisse la santé du joueur
		this.life = this.life - 1;

		//Animation
			//Anim a mettre là

		//Projection
		this.canMove = false;

		this.center.GetBody().GetLinearVelocity().x = 0;
		this.center.GetBody().GetLinearVelocity().y = 0;

		if(this.state.name != "liquid")
		{
			if(ennemy.x <= this.x)
				this.center.GetBody().ApplyImpulse(new b2Vec2(55, -55), this.center.GetBody().GetPosition());
			else
				this.center.GetBody().ApplyImpulse(new b2Vec2(-55, -55), this.center.GetBody().GetPosition());
		}
		else
		{
			if(ennemy.x <= this.x)
			{
				for(var i=0; i < this.anchorsPoints.length; i=i+1)
				{
					this.anchorsPoints[i].GetBody().ApplyImpulse(new b2Vec2(0.01, -0.015), this.center.GetBody().GetPosition());
				}
			}
			else
			{
				for(var i=0; i < this.anchorsPoints.length; i=i+1)
				{
					this.anchorsPoints[i].GetBody().ApplyImpulse(new b2Vec2(-0.01, -0.015), this.center.GetBody().GetPosition());
				}
			}
		}

		if(this.life <= 0)
			window.location.reload();
	}

	//Checkage de l'état de santé du joueur et action en conséquence
	this.checkIfAlive = function()
	{
		//On regarde la vie
		if(this.life <= 0)
		{
			//On bloque les controls
			//On lance l'anim de mort avec un callback pour le restart
		}
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

//Prismatic joint
function prismaticJoint(i, j, minT, maxT, axis)
{
	var def = new Box2D.Dynamics.Joints.b2PrismaticJointDef();

	def.Initialize(i.m_body, j.m_body, i.m_body.GetPosition(), axis);

	// def.localAnchorA = i.m_body.GetPosition();
	// def.localAnchorB = j.m_body.GetPosition();
	def.lowerTranslation = minT;
	def.upperTranslation = maxT;
	def.enableLimit = true;

	var joint = world.CreateJoint(def);
	return joint;
}

var animPlayer_data = [	//Remettre au propre et complet une fois toutes les anims données par les GA
{
	name: "idle",
	beginX: 0,
	beginY: 0
},
{
	name: "jump",	//Pour l"instant on laisse de côté les sprites n'étant pas adaptés
	beginX: 0,
	beginY: 0
},
{
	name: "walk",
	beginX: -1
}];