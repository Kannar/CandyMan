function keyDown(event)
{
	switch(event.keyCode)
	{
		//DEBUG
		// case 32:
		// 	player.changeStateBis();
		// break;

		case 37:		//Gauche
			player.goLeft = true;
			player.direction = {name: "left", decalAnimY: 1};
		break;

		case 39: 	//Droite
			player.goRight = true;
			player.direction = {name: "right", decalAnimY: 0};
		break;

		case 38: 	//Haut
			player.goUp = true;
		break;

		case 40: 	//Haut
			player.crouching = true;
		break;
	}
}

function keyUp(event)
{
	switch(event.keyCode)
	{
		case 37:		//Gauche
			player.goLeft = false;
			player.stopMove = true;
			player.canMove = true;
		break;

		case 39: 	//Droite
			player.goRight = false;
			player.stopMove = true;
			player.canMove = true;
		break;

		case 38: 	//Haut
			player.goUp = false;
		break;

		case 40: 	//Haut
			player.crouching = false;
		break;
	}
}
/************************
*	Input: à finir
*	inputTypes => table (nom des events, ex: mouse)
************************/
// var inputClavier = {};

// 	inputClavier.inputList = {
// 		39: console.log("toto")
// 	};

// inputClavier.initListeners = function()
// {
// 	addEventListener("keydown", function(event){
// 		this.execute(event.keyCode);
// 	});

// 	// addEventListener();
// }

// inputClavier.execute = function(index)
// {
// 	return this.inputList.index;
// }