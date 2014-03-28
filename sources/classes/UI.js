var UIState = function()
{
	this.toDisplay = "Normal";
	this.color = "rgb(255, 255, 255)";

	this.skinFore = images_obj.fore_gauge;
	this.skinBack = images_obj.back_gauge;

	this.skinLife = {
		"1" : "life1",
		"2" : "life2",
		"3" : "life3"
	};

	this.displayState = function(what)
	{
		switch (what)
		{
			case "normal":
				this.toDisplay = "Normal";
				this.color = "rgb(255, 255, 255)";
			break;

			case "liquid":
				this.toDisplay = "Liquide";
				this.color = "rgb(50, 255, 50)";
			break;

			case "solid":
				this.toDisplay = "Solide";
				this.color = "rgb(50, 225, 100)";
			break;

			case "humide":
				this.toDisplay = "Humide";
				this.color = "rgb(10, 100, 10)";
			break;
		}

		document.getElementById("UI_state").innerHTML = this.toDisplay;
		document.getElementById("UI_state").style.color = this.color;
	}

	this.render = function(pos)
	{
		
	}

	this.widthGaugeSrc = 2322;
	this.widthGaugeUI = 232;
	this.renderTimer = function()
	{
		this.calcSizeGauge();
		this.renderLifePlayer();

		//Back
		uiContext.drawImage(this.skinBack, 0, 0, 2322, 857, 50, 50, 232, 85);

		//Fore
		uiContext.drawImage(this.skinFore, 0, 0, this.widthGaugeSrc*this.pourc/100, 857, 50, 50, this.widthGaugeUI*this.pourc/100, 85);
	}

	this.pourc = 100;
	this.calcSizeGauge = function()
	{
		this.pourc = player.currentTimeOnState*100/player.timeOnState;
	}

	this.renderLifePlayer = function()
	{
		if(player.life == 3)
			uiContext.drawImage(images_obj["life3"], 0, 0, 2322, 857, 50, 50, 232, 85);
		else if(player.life == 2)
			uiContext.drawImage(images_obj["life2"], 0, 0, 2322, 857, 50, 50, 232, 85);
		else
			uiContext.drawImage(images_obj["life1"], 0, 0, 2322, 857, 50, 50, 232, 85);
	}
}