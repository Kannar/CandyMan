/********************************************
*   Pièges:
*       -Fixe
*       -Mobile
********************************************/
var Trap = function(params)
{
    this.x = params.x;
    this.y = params.y;

    this.dataType = params.dataType;

    this.image = images_obj[this.dataType.skinName];

    this.width = this.dataType.width;
    this.height = this.dataType.height;

    this.centerX = this.x + this.width/2;
    this.centerY = this.y + this.height/2;

    this.collider = new Collider({
        x: this.x + this.width/2,
        y: this.y + this.height/2,
        width: this.width/2,
        height: this.height/2,
        data: {tag: "trap", obj: this},
        shape: "square",
        category: categories.scene,
        mask: masks.scene,
        type: this.dataType.colliderType,
        restitution: 0.001
    });

    this.update = function()
    {
        this.render();
    }

    this.updatePos = function()
    {
        this.x = this.collider.GetBody().GetPosition().x*30 - this.width/2;
        this.y = this.collider.GetBody().GetPosition().y*30 - this.height/2;

        this.centerX = this.collider.GetBody().GetPosition().x*30;
        this.centerY = this.collider.GetBody().GetPosition().y*30;
    }

    this.render = function()
    {
        backContext.fillStyle = "rgb(255, 10, 10)";
        backContext.fillRect(this.x, this.y, this.width, this.height);

        //Draw image
    }
}

var TrapMovable = function(params)
{
    this.x = params.x;
    this.y = params.y;

    this.sens = params.properties.sens;
    this.dist = params.properties.dist;

    this.dataType = params.dataType;

    this.speed = 5;

    // this.image = images_obj[this.dataType.name];

    this.width = this.dataType.width;
    this.height = this.dataType.height;

    this.centerX = this.x + this.width/2;
    this.centerY = this.y + this.height/2;

    this.collider = new Collider({
        x: this.x + this.width/2,
        y: this.y + this.height/2,
        width: this.width/2,
        height: this.height/2,
        data: {tag: "trap", obj: this},
        shape: "square",
        category: categories.scene,
        mask: masks.scene,
        type: this.dataType.colliderType,
        restitution: 0.001
    });

    this.collider.GetBody().SetSleepingAllowed(false);

    this.update = function()
    {
        this.checkCurrentDistDone();
        this.updatePos();
        this.render();
    }

    this.updatePos = function()
    {
        this.x = this.collider.GetBody().GetPosition().x*30 - this.width/2;
        this.y = this.collider.GetBody().GetPosition().y*30 - this.height/2;

        this.centerX = this.collider.GetBody().GetPosition().x*30;
        this.centerY = this.collider.GetBody().GetPosition().y*30;
    }

    this.render = function()
    {
        mainContext.fillStyle = "rgb(255, 10, 10)";
        mainContext.fillRect(this.x, this.y, this.width, this.height);

        //Draw image
    }

    this.changeSens = function()
    {
        if(this.sens == "top")
        {
            this.collider.GetBody().GetLinearVelocity().y = this.speed;
            this.sens = "bot";
        }
        else if(this.sens == "bot")
        {
            this.collider.GetBody().GetLinearVelocity().y = -this.speed;
            this.sens = "top";
        }

        this.distDone = 0;
    }

    this.distDone = 0;
    this.checkCurrentDistDone = function()
    {
        if(this.sens == "top")
        {
            this.collider.GetBody().GetLinearVelocity().y = this.speed;
        }
        else if(this.sens == "bot")
        {
            this.collider.GetBody().GetLinearVelocity().y = -this.speed;
        }

        this.distDone = this.distDone + this.speed;

        if((this.distDone) >= this.dist)
        {
            this.changeSens();
        }
    }

    //On init le déplacement
    if(this.sens == "top")
    {
        this.collider.GetBody().GetLinearVelocity().y = -this.speed;
    }
    else if(this.sens == "bot")
    {
        this.collider.GetBody().GetLinearVelocity().y = this.speed;
    }
}