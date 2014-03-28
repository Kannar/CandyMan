/*********************************
*
*   All Loaders
*
*********************************/
/*********************************
*   Loader de ressources
*********************************/
//Images
function loadImages(imagesTable)
{
    var _images = {};
    var _imagesLoaded = 0;
    var _nbImages = 0;
    // var _nbCurrentProg = 0;

    //On compte le total d'images
    for(var src in imagesTable)
    {
        _nbImages = _nbImages + 1;
    }

    //On les charge
    for(var src in imagesTable)
    {
        _images[src] = new Image(); //On crée l'objet image
        _images[src].src = imagesTable[src];    //On lui donne une source

        _images[src].onload = function(){   //Une fois chargé 
            _imagesLoaded = _imagesLoaded + 1;  //On dit qu'on l'a chargé
        };
    }

    return _images;
}

//Souns
function loadSounds(soundsTable)
{
    // var _sounds = {};
    // var _soundsLoaded = 0;
    // var _nbSounds = 0;

    // //Comptage du nombre de sources
    // for(var src in soundsTable)
    // {
    //     _nbSounds = _nbSounds + 1;
    // }

    // //On les charge
    // for(var src in soundsTable)
    // {
    //     soundsTable[src].onload = function(){
    //         _soundsLoaded = _soundsLoaded + 1;
    //     }

    //     _sounds[src] = new Howl(soundsTable[src]);
    // }

    // return _sounds;
}

/*********************************
*   Loader de level
*********************************/
function loadLevel(level)
{
    //Destruction des objets, ennemis et du joueurs dans le niveau courant
    //Construction du prochain level
    //Création du perso
}