function Level(level, tilesData, specialTiles)
{
	this.width = level.width;
	this.height = level.height;
	this.tileSize = level.tileheight;
	this.data = level.layers[0].data;

	currentSpritesheet = images_obj.tileset3;	//A modifier

	this.tiles = [];	//Tiles (le rendu graphique)
	this.hColliders = [];	//Colliders horizontaux temporaires
	this.colliders = [];	//Colliders finaux
	this.blocks = [];	//Blocs temporaires

	this.events = {};

	this.layersRender = {	//tiles pour le rendu
		back: [],
		mid: [],
		fore: []
	};

	/****************************************
	*
	*	Construction du niveau
	*
	****************************************/
	this.constructLevel = function()
	{
		for(var i = 0; i< level.layers.length; i++)
		{
			if(level.layers[i].type == "tilelayer")
			{
				if(level.layers[i].name == "Mid")	//Seul les tiles du midground possèdent des colliders
				{
					this.createTiles(i, this.layersRender.mid, backContext);
					// this.createBlocks(this.layersRender.mid);
					this.createHorizontalCollider();
					this.createVerticalCollider();
                    this.setSpecialBlocks();
				}
				else if(level.layers[i].name == "Back")	//Ces tiles servent juste de déco en arrière plan
				{
					this.createTiles(i, this.layersRender.back, backContext);
				}
				else if(level.layers[i].name == "Fore")	//Ces tiles servent juste de déco en arrière plan
				{
					this.createTiles(i, this.layersRender.fore, foreContext);
				}
			}
			else if(level.layers[i].type == "objectgroup")
			{
				if(level.layers[i].name == "Events")	//Evènements
				{
					this.setEvents(i);
				}
				else if(level.layers[i].name == "Traps")	//Pièges
				{
					this.setTraps(i);
				}
				else if(level.layers[i].name == "Ennemies")	//Ennemis
				{
					//Insert ennemies here..
				}
				else if(level.layers[i].name == "Collectibles")	//Collectibles
				{
					this.setCollectibles(i);
				}
				else if(level.layers[i].name == "Breakables")	//Collectibles
				{
					this.setBreakables(i);
				}
				else if(level.layers[i].name == "MovablePlateforms")	//Collectibles
				{
					this.setMovablePlateforms(i);
				}
			}
		}
	}

	/***************************************
	*
	*	Set des objets
	*
	***************************************/
		/***********************************
		*	Events
		***********************************/
	this.setEvents = function(index)
	{
		for(var i = 0; i < level.layers[index].objects.length; i++)
		{
			var _current = level.layers[index].objects[i];

			switch(_current.name)
			{
				case "depart":
					this.events.depart = {x: _current.x, y: _current.y};
				break;
			}
		}
	}
		/************************************
		*	Movable Plateform
		************************************/
	this.setMovablePlateforms = function(index)
	{
		for(var i = 0; i < level.layers[index].objects.length; i++)
		{
			var _current = level.layers[index].objects[i];

			movablePlateforms.push(new MovablePlateform({x: _current.x, y: _current.y, properties: _current.properties}));
		}
	}
		/***********************************
		*	Collectibles
		***********************************/
	this.setCollectibles = function(index)
	{
		for(var i = 0; i < level.layers[index].objects.length; i++)
		{
			var _current = level.layers[index].objects[i];

			if(_current.name == "life")
				collectibles.push(new Collectible({x: _current.x, y: _current.y, type: "life", dataType: collectibles_data["life"]}))
			else
				collectiblePopers.push(new CandyPoper({x: _current.x, y: _current.y, type: _current.name}));

				// case "solid":
				// 	collectibles.push(new Collectible({x: _current.x, y: _current.y, type: "solid", dataType: collectibles_data["solid"]}));
				// break;
				// case "liquid":
				// 	collectibles.push(new Collectible({x: _current.x, y: _current.y, type: "liquid", dataType: collectibles_data["liquid"]}));
				// break;
				// case "humid":
				// 	collectibles.push(new Collectible({x: _current.x, y: _current.y, type: "humide", dataType: collectibles_data["humide"]}));
				// break;
				// case "life":
					
			
		}
	}
		/***********************************
		*	Pièges
		***********************************/
	this.setTraps = function(index)
	{
		for(var i = 0; i < level.layers[index].objects.length; i=i+1)
		{
			var _current = level.layers[index].objects[i];

				if(_current.name == "pike")
					traps.push(new Trap({x: _current.x, y: _current.y, dataType: traps_data[0]}));
				else if(_current.name == "movable")
					traps.push(new TrapMovable({x: _current.x, y: _current.y, dataType: traps_data[1], properties: _current.properties}));
		}
	}
		/***********************************
		*	Cassables
		***********************************/
	this.setBreakables = function(index)
	{
		for(var i = 0; i < level.layers[index].objects.length; i++)
		{
			var _current = level.layers[index].objects[i];

			console.log(_current.name);

			switch(_current.name)
			{
				case "wall":
					breakables.push(new Breakable({x: _current.x, y: _current.y, width: _current.width, height: _current.height}));
				break;
			}
		}
	}
	/***************************************
	*
	*	Création des tiles
	*
	***************************************/
	this.createTiles = function(index, table, context)	//Création des tiles (graphique)
	{
		for(var i = 0; i < level.layers[index].data.length; i++)
		{
			var _sourceX = ((level.layers[index].data[i]%20) - 1)*this.tileSize;	//20 = largeur et hauteur de la spritesheet en tiles
			var _sourceY = ((Math.floor(level.layers[index].data[i]/20))*this.tileSize);

			var _x = (i%this.width)*this.tileSize;
			var _y = (Math.floor(i/this.width)*this.tileSize);

			var _tag;
			for(tag in tilesData)
			{
				for(var j = 0; j < tilesData[tag].length; j ++)
				{
					if(tilesData[tag][j] == level.layers[index].data[i])
					{
						_tag = tilesData[tag][0];
					}
				}
			}

			if(level.layers[index].data[i] != 0)
			{
				table.push(new Tile({
					x: _x,
					y: _y,
					sourceX: _sourceX,
					sourceY: _sourceY,
					width: this.tileSize,
					sourceW: this.tileSize,
					data: level.layers[index].data[i],
					tag: _tag || "none",
					context: context
				}));
			}
		}
	}
	/******************************************/

	/*******************************************
	*
	*	Création des colliders
	*
	*******************************************/
	this.setSpecialBlocks = function()
    {
        for(var j = 0; j < this.layersRender.mid.length; j++)   //On regarde uniquement dans mid car c'est le seul layer à posséder des colliders
        {
            for(var i=0; i<specialTiles.length; i++)
            {
                if(specialTiles[i].data == this.layersRender.mid[j].data)
                {
                    var _current = specialTiles[i];

                    for(var k=0; k<_current.colliders.length; k++)
                    {
                        this.colliders.push(new Collider({
                            x: this.layersRender.mid[j].x + _current.colliders[k].x + (_current.colliders[k].width/2),
                            y: this.layersRender.mid[j].y + _current.colliders[k].y + (_current.colliders[k].height/2),
                            width: (_current.colliders[k].width)/2,
                            height: (_current.colliders[k].height)/2,
                            shape: "square",
                            type: "static",
                            mask: masks.scene,
                            restitution: 0.001,
                            category: categories.scene,
                            data: {tag: _current.colliders[k].tag, 
                                obj: {x: this.layersRender.mid[j].x + _current.colliders[k].x,
                                        y: this.layersRender.mid[j].y + _current.colliders[k].y,
                                        width: _current.colliders[k].width,
                                        height: _current.colliders[k].height}}
                        }));
                    }
                }                    
            }
        }
    }

	this.createBlocks = function(table)	//Création des blocks temporaires (à l'unité)
	{
		for(var i = 0; i < table.length; i++)
		{
			var _current = table[i];

			if(_current.data != 0)
			{
				this.blocks.push(new LevelCollider({
					x:(_current.x + _current.width/2)/30,
					y:(_current.y + _current.height/2)/30,
					width: _current.width/60,
					height: _current.height/60,
					tag: _current.tag
				}));
			}

			_isSpecial = false;
		}
	}

	this.createHorizontalCollider = function()	//Création des colliders horizontaux ("premier assemblage des blocks")
	{
		var _checkedBlocks = [];	//Tableau de stockage temporaire des blocks que l'on est en train d'assembler
		var _toDestroy = [];
		var _alsoAWall = [];
		var _alsoUsed = [];
		var _canBeUsed = true;
		var _wrong = false;
		var _nb = 1;

		var _x;
		var _y;
		var _width;
		var _height;

		for(var i = 0; i < this.blocks.length; i++)
		{
			if(i == 0)
			{
				_checkedBlocks.push(this.blocks[i]);
			}
			else if((this.blocks[i].GetBody().GetUserData().tag == _checkedBlocks[_checkedBlocks.length-1].GetBody().GetUserData().tag) && 
				(Math.round((this.blocks[i].GetBody().GetPosition().x - _checkedBlocks[_checkedBlocks.length-1].GetBody().GetPosition().x)*30) == this.tileSize) &&
				((Math.round((this.blocks[i].GetBody().GetPosition().y - _checkedBlocks[_checkedBlocks.length-1].GetBody().GetPosition().y)*30) == 0)))
			{
				_checkedBlocks.push(this.blocks[i]);
			}
			else if(_checkedBlocks.length > 0)
			{
				//On crée le collider horizontal
				_width = (_checkedBlocks.length * this.tileSize)/30/2;
				_x = (_checkedBlocks[0].GetBody().GetPosition().x) + _width - ((this.tileSize/2)/30);
				_y = _checkedBlocks[0].GetBody().GetPosition().y;

				if(_checkedBlocks[0].GetBody().GetUserData().tag == "breakeable")
				{
					breakables.push(new Breakable({
						x: _x,
						y: _y,
						width: _width,
						height: this.tileSize/30/2,
						tag: _checkedBlocks[0].GetBody().GetUserData().tag
					}));

					// this.colliders[this.colliders.length-1].id = this.colliders.length-1;
				}
				else
				{
					this.hColliders.push(new LevelCollider({
						x: _x,
						y: _y,
						width: _width,
						height: this.tileSize/30/2,
						tag: _checkedBlocks[0].GetBody().GetUserData().tag
					}));
				}
				
				this.hColliders[this.hColliders.length-1].width = _width;

				//On détruit les blocks temporaires
				for(var j = 0; j < _checkedBlocks.length; j++)
				{
					world.DestroyBody(_checkedBlocks[j].GetBody());
				}
				
				//On vide le tableau de bloque temporaires
				_checkedBlocks = [];

				_checkedBlocks.push(this.blocks[i]);
			}
		}

		if(_checkedBlocks.length > 0)
		{
			//On crée le collider horizontal
			_width = (_checkedBlocks.length * this.tileSize)/30/2;
			_x = (_checkedBlocks[0].GetBody().GetPosition().x) + _width - ((this.tileSize/2)/30);
			_y = _checkedBlocks[0].GetBody().GetPosition().y;

			if(_checkedBlocks[0].GetBody().GetUserData().tag == "breakeable")
			{
				breakables.push(new Breakable({
					x: _x,
					y: _y,
					width: _width,
					height: this.tileSize/30/2,
					tag: _checkedBlocks[0].GetBody().GetUserData().tag
				}));

				// this.colliders[this.colliders.length-1].id = this.colliders.length-1;
			}
			else
			{
				this.hColliders.push(new LevelCollider({
					x: _x,
					y: _y,
					width: _width,
					height: this.tileSize/30/2,
					tag: _checkedBlocks[0].GetBody().GetUserData().tag
				}));
			}
			
			this.hColliders[this.hColliders.length-1].width = _width;

			//On détruit les blocks temporaires
			for(var j = 0; j < _checkedBlocks.length; j++)
			{
				world.DestroyBody(_checkedBlocks[j].GetBody());
			}
		}

		_checkedBlocks = [];
	}

	this.createVerticalCollider = function()
	{
		var _alsoDone = [];

		for(var i = 0;  i < this.hColliders.length; i++)
		{
			var _toAdd = [];    //Raz du tableau temporaire des colliders à merge

            var _next = {};
            _next.x = (this.hColliders[i].GetBody().GetWorldCenter().x*30);
            _next.y = (this.hColliders[i].GetBody().GetWorldCenter().y*30) + (this.tileSize);

            if(!this.checkIfInTable(i, _alsoDone))   //Si le collider n'a pas été traité
            {
                _toAdd.push(i); //On push de base les premiers quitte à faire un collider solo

                for(var j = 0; j < this.hColliders.length; j++) //On regarde parmis les autres qui est collé à celui-là
                {
                    if((j !== i) && (!this.checkIfInTable(j, _alsoDone)) && ((this.hColliders[j].GetBody().GetWorldCenter().x*30 == _next.x)) && (this.hColliders[j].width == this.hColliders[_toAdd[0]].width))
                    {
                        if((Math.round(this.hColliders[j].GetBody().GetWorldCenter().y*30) == Math.round((this.hColliders[i].GetBody().GetWorldCenter().y*30) + (_toAdd.length*this.tileSize))))
                        {
                            _toAdd.push(j); //On met dans un tableau tout les colliders qui ont le même x
                            _alsoDone.push(j);
                        }
                    }
                }
            }

            if(_toAdd.length > 0)
            {
                var _x = this.hColliders[_toAdd[0]].GetBody().GetWorldCenter().x;
                var _height = (_toAdd.length*this.tileSize)/2/30;
                var _y = (this.hColliders[_toAdd[0]].GetBody().GetWorldCenter().y) + _height - ((this.tileSize/2)/30);

				this.colliders.push(new LevelCollider({
					x: _x,
					y: _y,
					width: this.hColliders[_toAdd[0]].width,
					height: _height,
					tag: this.hColliders[_toAdd[0]].GetBody().GetUserData().tag
				}));
			}

			_alsoDone.push(i);
			_toAdd = [];
		}

		 this.destroyEveryBodyInTable(this.hColliders);
	}

	/**********************************************/

	/**********************************************
	*
	*	Utils
	*
	**********************************************/
    this.checkIfInTable = function(id, table)   //Vérifie si une variable se trouve dans un tableau
    {
        for(var _i = 0; _i < table.length; _i++)
        {
            if(table[_i] === id)
            {
                return true;
            }
        }

        return false;
    }

    this.destroyEveryBodyInTable = function(table)  //Detruit tout les body d'un tableau et le vide
    {
        for(var _i = 0; _i < table.length; _i++)
        {
            world.DestroyBody(table[_i].GetBody());
        }

        table = [];
    }

	this.render = function()
	{
		// mainContext.drawImage(hiddenCanvas, 0, 0);
	}

	this.constructLevel();
}

/***********************************************
*	Data des tiles
***********************************************/
var refTiles =	//Références des types de tiles selon leur IDs
{
	"floor": ["floor", 31, 32, 33, 91, 92],
	"wall": ["wall", 46, 48, 106, 107],
	"breakeable": ["breakeable", 65, 66],
	"block": ["block", 47],
    "empty": ["empty", 0]
}

var Tile = function(properties)
{
	this.x = properties.x;
	this.y = properties.y;
	this.width = properties.width;
	this.height = properties.height || properties.width;

	this.sourceX = properties.sourceX;
	this.sourceY = properties.sourceY;
	this.sourceW = properties.sourceW;
	this.sourceH = properties.sourceH || properties.sourceW;

	this.data = properties.data;

	this.tag = properties.tag || "none";

	this.context = properties.context;

	this.render = function()
	{
		this.context.drawImage(currentSpritesheet, this.sourceX, this.sourceY, this.sourceW, this.sourceH, this.x, this.y, this.width, this.height);
	}
}

var LevelCollider = function(prop)	//Nom provisoire, test, équivalent à BlockCollider (block.js) correspond à des blocks statiques
{
	fixDef = new b2FixtureDef;
	fixDef.density = prop.density || 1.0;
	fixDef.friction = prop.friction || 0.5;
	fixDef.restitution = prop.restitution || 0;
	fixDef.filter.categoryBits = categories.scene;
	fixDef.filter.maskBits = masks.scene;

	bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.x = prop.x;
	bodyDef.position.y = prop.y;
	bodyDef.userData = {tag: prop.tag, obj: this};
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(prop.width, prop.height);

	this.x = prop.x*30;
	this.y = prop.y*30;
	this.width = prop.width*30;
	this.height = prop.height*30;

	return world.CreateBody(bodyDef).CreateFixture(fixDef);
}