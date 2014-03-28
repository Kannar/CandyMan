var Camera = function()
{
	var _wrapper = document.getElementById("wrapper");

	this.currentDecal ={x: 0, y: 0};
	this.maxDecal = {x: 0, y: 0};

	this.camPos = //Position de la caméra, on prend en point de référence le centre de l'écran de jeu
	{
		origin: {x:400, y:300},	//Position du point d'origine
		current:{x:400, y:300}	//Position actuelle
	}

	this.focus = "player";	//Objet sur lequel la camera se fixe, par défaut on focus le joueur

	this.situationData = situationsFocusData;

	this.render = function()	//Viseur du focus
	{
		mainContext.fillStyle = "rgb(255, 255, 255)";
		mainContext.fillRect(this.camPos.current.x - 5, this.camPos.current.y - 5, 10, 10);
	}

	this.update = function()
	{
		_wrapper.scrollLeft = this.camPos.current.x - 512;
		_wrapper.scrollTop = this.camPos.current.y - 400;

		// this.decalManager();
		this.followFocus();

		// this.render();	//Sert à voir le centre du focuss
	}

	this.focusPlayer = function()
	{
		if(player.center.GetBody())
		{			
			this.camPos.current.x = (player.center.GetBody().GetWorldCenter().x*30) + this.currentDecal.x;
			this.camPos.current.y = (player.center.GetBody().GetWorldCenter().y*30) + this.currentDecal.y;
		}
	}

	this.onFocusSituation = false;
	this.beforeFocusSituation = true;
	this._add;	//Signe de la valeure à incrémenter
	this.currentCamPurcent;

	this.focusSituation = function()
	{
		if(this.beforeFocusSituation)
		{
			this._add = this.checkSens(this.camPos.current, this.situationData[0]);
			// currentCanvasHeight = 600;
			// canvas.style.height = this.situationData[0].canvasHeight;
			this.beforeFocusSituation = false;
			this.onFocusSituation = true;
		}
		else if(this.onFocusSituation)
		{
			if(this.camPos.current.x <= (this.situationData[0].x - 10) || this.camPos.current.x >= (this.situationData[0].x + 10))
			{
				this.camPos.current.x = (this._add.x * 3) + (this.camPos.current.x);
			}

			if(this.camPos.current.y <= (this.situationData[0].y - 10) || this.camPos.current.y >= (this.situationData[0].y + 10))
			{
				this.camPos.current.y = (this._add.y * 3) + (this.camPos.current.y);
			}		
		}
	}

//On regarde la distance entre 2 point afin de savoir dans quel sens aller afin d'être en focus, retourne un objet{x: , y: }

	this.checkSens = function(a, b)	
	{
		var _x;
		var _y;

		if(a.x - b.x <= 0)
			_x = 1;
		else
			_x = -1;

		if(a.y - b.y <= 0)
			_y = 1;
		else
			_y = -1;

		return {x: _x, y: _y};
		
	}

	this.followFocus = function()
	{
		switch(this.focus)
		{
			case "player":
				this.focusPlayer();
			break;

			case "situation":
				this.focusSituation();
			break;
		}
	}

	this.decalManager = function()	//Gestion du décalage dela caméra si besoin
	{
		//X

		//Y
		if(!player.onGround)
		{
			if(player.center.GetBody().GetLinearVelocity().y != 0)
			{
				this.currentDecal.y = this.currentDecal.y + 1;
			}
		}
		else
		{
			if(this.currentDecal.y > 0)
			{
				this.currentDecal.y = this.currentDecal.y - 6;
			}

			if(this.currentDecal.y < 0)
				this.currentDecal.y = 0;
		}
	}
}