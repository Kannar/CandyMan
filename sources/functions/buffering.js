function loadRessources(table)
{
	var _decalX = 0;

	for(var i = 0; i < table.length; i++)
	{
		var _img = new Image();
		_img.src = table[i].src;

		backContext.drawImage(_img, _decalX, 0);

		_decalX += table[i].width;
	}

	loadDone = true;
}

var ressources = [
		
];