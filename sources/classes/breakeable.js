function Breakable(properties)
{
	this.x = properties.x;
	this.y = properties.y;

	this.width = properties.width;
	this.height = properties.height || properties.width;

	this.id = breakables.length;
	this.tag = "breakable";

	this.skin = new Image();

	this.dataType;

	//Set du sens
	if(this.width > this.height)
	{
		this.skin.src = "medias/graphic/objets/breakables/breakable_block_horizontal3.png";
		this.sens = "h";
		this.dataType = breakables_data[0];
		this.nbBricks = this.width/this.dataType.width;
	}
	else
	{
		this.skin.src = "medias/graphic/objets/breakables/breakable_block_vertical3.png";
		this.sens = "v";
		this.dataType = breakables_data[1];
		this.nbBricks = this.height/this.dataType.height;
	}

	this.collider = new Collider({
		x: this.x + this.width/2,
		y: this.y + this.height/2,
		width: this.width/2,
		height: this.height/2,
		shape: "square",
		type: "static",
		category: categories.scene,
		mask: masks.scene,
		data: {tag: this.tag, obj: this},
		restitution: 0.001
	});

	this.toDestroy = false;

	this.render = function()
	{
		// mainContext.fillStyle = "rgb(100, 100, 255)";
		// mainContext.fillRect((this.x-(this.width))*30, (this.y-(this.height))*30, this.width*30*2, this.height*30*2);

		if(this.sens == "h")
		{
			for(var i = 0; i<this.nbBricks; i=i+1)
			{
				mainContext.drawImage(this.skin, this.dataType.skinDecalX, this.dataType.skinDecalY, this.dataType.skinWidth, this.dataType.skinHeight, this.x+(this.dataType.width*i), this.y, this.dataType.width, this.dataType.height);
			}			
		}
		else if(this.sens == "v")
		{
			for(var i = 0; i<this.nbBricks; i=i+1)
			{
				mainContext.drawImage(this.skin, this.dataType.skinDecalX, this.dataType.skinDecalY, this.dataType.skinWidth, this.dataType.skinHeight, this.x, this.y+(this.dataType.height*i), this.dataType.width, this.dataType.height);
			}
		}
	}

	this.update = function()
	{
		this.render();
		this.checkIfDestroyed();
	}
/************************
	Collisions
************************/
	this.preCollide = function(who)
	{
		
	}

	this.onCollide = function(who)
	{
		switch(who.tag)
		{
			case "player":
				if(player.state.name == "solid")
				{
					this.toDestroy = true;
				}
			break;
		}
	}

	this.endCollide = function(who)
	{

	}

	this.postCollide = function(who)
	{

	}
/**********************/

	this.checkIfDestroyed = function()
	{
		if(this.toDestroy)
		{
			world.DestroyBody(this.collider.GetBody());
			breakables.splice(this.id, 1);
		}
	}
}