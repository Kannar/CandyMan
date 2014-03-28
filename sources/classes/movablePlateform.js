var MovablePlateform = function(params)
{
    this.x = params.x;
    this.y = params.y;

    this.direction = params.properties.direction;
    this.dist = params.properties.dist;

    // this.dataType = params.dataType;

    this.skin = images_obj.tileset3;
    this.srcX = 48*2;
    this.srcY = 48*4;
    this.srcW = 48*5;
    this.srcH = 48;

    this.speed = 5;

    this.width = 240;
    this.height = 36;

    this.collider = new Collider({
        x: this.x + this.width/2,
        y: this.y + this.height/2,
        width: this.width/2,
        height: this.height/2,
        data: {tag: "movablePlateform", obj: this},
        shape: "square",
        type: "kinematic",
        restitution: 0.001,
        category: categories.scene,
        mask: masks.scene
    });

    this.update = function()
    {
        this.move();
        this.updatePlayerSpeed();
        this.updatePos();
        this.render();
    }

    this.render = function()
    {
        mainContext.fillStyle = "rgb(255, 10, 10)";
        mainContext.fillRect(this.x, this.y, this.width, this.height);

        mainContext.drawImage(this.skin, this.srcX, this.srcY, this.srcW, this.srcH, this.x, this.y-8, this.srcW, this.srcH);
    }

    this.updatePos = function()
    {
        this.x = this.collider.GetBody().GetPosition().x*30 - this.width/2;
        this.y = this.collider.GetBody().GetPosition().y*30 - this.height/2;

        this.centerX = this.collider.GetBody().GetPosition().x*30;
        this.centerY = this.collider.GetBody().GetPosition().y*30;
    }

    this.move = function()
    {
        if(this.direction == "vertical")
        {
            this.moveVertical();
        }
        else
        {
            this.moveHorizontal();
        }
    }

    this.distDone = 0;
    this.back = false;
    this.moveVertical = function()
    {
        if(!this.back)
        {
            this.collider.GetBody().GetLinearVelocity().y = this.speed;
        }
        else if(this.back)
        {
            this.collider.GetBody().GetLinearVelocity().y = -this.speed;
        }

        this.distDone = this.distDone + this.speed;

        if((this.distDone) >= this.dist)
        {
            if(!this.back)
                this.back = true;
            else
                this.back = false;

            this.distDone = 0;
        }
    }

    this.moveHorizontal = function()
    {
        if(!this.back)
        {
            this.collider.GetBody().GetLinearVelocity().x = this.speed;
        }
        else if(this.back)
        {
            this.collider.GetBody().GetLinearVelocity().x = -this.speed;
        }

        this.distDone = this.distDone + this.speed;

        if((this.distDone) >= this.dist)
        {
            if(!this.back)
                this.back = true;
            else
                this.back = false;

            this.distDone = 0;
        }
    }

    this.playerOn = false;
    this.updatePlayerSpeed = function()
    {
        if(this.playerOn)
        {
            if(this.direction == "vertical")
            {
                if(!this.back)
                {
                    player.center.GetBody().GetLinearVelocity().y = player.center.GetBody().GetLinearVelocity().y - 5;
                }
                else
                {
                    player.center.GetBody().GetLinearVelocity().y = player.center.GetBody().GetLinearVelocity().y + 5;
                }
            }
            else
            {
                if(!this.back)
                {
                    player.center.GetBody().GetLinearVelocity().x = player.center.GetBody().GetLinearVelocity().x + 5;
                }
                else
                {
                    player.center.GetBody().GetLinearVelocity().x = player.center.GetBody().GetLinearVelocity().x - 5;
                }
            }
        }
    }

    this.stopMovePlayer = function()
    {
        if(this.direction == "vertical")
        {
            if(!this.back)
            {
                player.center.GetBody().GetLinearVelocity().y = player.center.GetBody().GetLinearVelocity().y + 5;
            }
            else
            {
                player.center.GetBody().GetLinearVelocity().y = player.center.GetBody().GetLinearVelocity().y - 5;
            }
        }
        else
        {
            if(!this.back)
            {
                player.center.GetBody().GetLinearVelocity().x = player.center.GetBody().GetLinearVelocity().x - 5;
            }
            else
            {
                player.center.GetBody().GetLinearVelocity().x = player.center.GetBody().GetLinearVelocity().x + 5;
            }
        }
    }

    if(this.direction == "vertical")
    {
        this.moveVertical();
    }
    else
    {
        this.moveHorizontal();
    }

    /******************************
    *   Collision
    ******************************/
    this.preCollide = function(who)
    {

    }

    this.onCollide = function(who)
    {
        switch(who.tag)
        {
            case "player":
                this.playerOn = true;
            break;
        }
    }

    this.endCollide = function(who)
    {
        switch(who.tag)
        {
            case "player":
                this.playerOn = false;
            break;
        }
    }

    this.postCollide = function(who)
    {
        switch(who.tag)
        {
            case "player":
                this.playerOn = false;
            break;
        }
    }
}