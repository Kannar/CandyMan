/***************************************
*	Gameloop principale
***************************************/
function gameloop()
{	
	switch(state)
	{
		case "pause":
			pause();
		break;

		case "loading":
			loading();
		break;

		case "run":
			run();
		break;
	}

	frame += 1;
	
	requestAnimFrame(gameloop);
}

/*************************************
*	Loop de jeu
*************************************/
var once = true;
function run()
{
	stats.begin();

	mainContext.clearRect(camera.camPos.current.x - 612, camera.camPos.current.y - 500, 1224, 1000);
	uiContext.clearRect(0, 0, 1024, 600);

	world.Step(
	    1 / 60,   //frame-rate
	    10,       //velocity iterations
	    10       //position iterations
	);

	world.DrawDebugData();
	world.ClearForces();

	if(once && frame == 3)
	{
		for(var i = 0; i < currentLevel.layersRender.back.length; i++)
		{
			currentLevel.layersRender.back[i].render();
		}
		for(var i = 0; i < currentLevel.layersRender.mid.length; i++)
		{
			currentLevel.layersRender.mid[i].render();
		}
		for(var i = 0; i < currentLevel.layersRender.fore.length; i++)
		{
			currentLevel.layersRender.fore[i].render();
		}

		once = false;
	}

	if(player)
		player.update();

	for(var i = 0; i < movablePlateforms.length; i++)
	{
		movablePlateforms[i].update();
	}

	for(var i = 0; i < breakables.length; i++)
	{
		breakables[i].update();
	}

	for(var i = 0; i < collectibles.length; i++)
	{
		collectibles[i].render();
	}

	for(var i = 0; i < traps.length; i++)
	{
		traps[i].update();
	}


	// triggers[0].update();

	UI.renderTimer();

	camera.update();

	garbageCollector();

	stats.end();
}

/***********************************
*	Loop loading
***********************************/
function loading()
{
	mainContext.clearRect(0, 0, mainCanvasWidth, mainCanvasHeight);

	mainContext.fillStyle = "rgb(255, 255, 255)";

	mainContext.fillText("LOADING...", (mainCanvasWidth/2)-50, mainCanvasHeight/2, 100);

	if(loadDone)
	{
		mainContext.fillText("DONE !", (mainCanvasWidth/2)-42, (mainCanvasHeight/2)+50, 100);

		initGame();
	}
}

function pause()
{

}

function garbageCollector()
{
	for(var i=0; i<checkToGarbage.length; i++)
	{
		for(var j = 0; j<checkToGarbage[i].length; j++)
		{
			if(checkToGarbage[i][j].toDestroy)
			{
				world.DestroyBody(checkToGarbage[i][j].collider.GetBody());
				checkToGarbage[i].splice(j, 1);
			}
		}
	}
}