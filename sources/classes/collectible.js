var Collectible = function(params)
{
    this.x = params.x;
    this.y = params.y;

    this.dataType = params.dataType;

    this.type = params.type;

    this.width = this.dataType.width;
    this.height = this.dataType.height;

    this.skin = images_obj[this.dataType.skin];

    this.poper = params.poper;

    this.tag = params.tag || "collectible";

    this.toDestroy = false;

    this.currentFrameAnim = 0;
    this.timeAnim = 0;
    this.render = function()
    {
        // mainContext.fillStyle = this.type.color;
        // mainContext.fillRect(this.x-this.width, this.y-this.height, this.width*2, this.height*2);

        if(this.timeAnim == 12)
        {
            // console.log(this.currentFrameAnim, ", "+this.dataType.frame);

            if(this.currentFrameAnim < this.dataType.frames -1)
            {
                this.currentFrameAnim = this.currentFrameAnim + 1;
            }
            else
            {
                this.currentFrameAnim = 0;
            }

            this.timeAnim = 0;
        }
        else
        {
            this.timeAnim = this.timeAnim + 1;
        }
        
        mainContext.drawImage(this.skin, this.currentFrameAnim*this.dataType.skinWidth, 0, this.dataType.skinWidth, this.dataType.skinHeight, this.x, this.y, this.width, this.height);        
    }

    this.collider = new Collider({
        x: this.x + this.width/2,
        y: this.y + this.height/2,
        width: this.width/2,
        height: this.height/2,
        data: {tag: this.tag, obj: this},
        shape: "square",
        type: "kinematic",
        category: categories.collectibles,
        mask: masks.collectibles,
        sensor: true
    });

    this.preCollide = function(who)
    {
        switch (who.tag)
        {
            
        }
    }

    this.onCollide = function(who)
    {
        switch (who.tag)
        {
            case "player":
               this.toDestroy = true;
            break;
        }
    }

    this.endCollide = function(who)
    {
        switch (who.tag)
        {
            
        }
    }

    this.postCollide = function(who)
    {
        switch (who.tag)
        {
            
        }
    }
}

/******************************
*   Collectible poper
******************************/
var CandyPoper = function(params)
{
    this.x = params.x;
    this.y = params.y;

    this.type = params.type

    this.popNewCandy = function()
    {
        collectibles.push(new Collectible({x: this.x, y: this.y, type: this.type, dataType: collectibles_data[this.type], poper: this}));
    }

    this.popNewCandy();
}