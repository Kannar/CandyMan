/*********************************
	Listener de collision
*********************************/
function ContactListener(pre, begin, end, post)
{
	this.toDoPre = pre;	//Tableaux de correspondances entre différents tags avec action a effectuer
	this.toDoBegin = begin;
	this.toDoEnd = end;
	this.toDoPost = post;

	this.listener = Box2D.Dynamics.b2ContactListener;
	var once = false;

	this.listener.PreSolve = function(contact)
	{
		var _done = false;

		for(var i = 0; i < preCollisionToDo.length; i++)
		{
			if(contact.GetFixtureA().GetBody().GetUserData().tag == preCollisionToDo[i].tag)
			{
				for(var j = 0; j < preCollisionToDo[i].otherTag.length; j++)
				{
					if(contact.GetFixtureB().GetBody().GetUserData().tag == preCollisionToDo[i].otherTag[j])
					{
						contact.GetFixtureB().GetBody().GetUserData().obj.preCollide(contact.GetFixtureA().GetBody().GetUserData());
					}
				}
			}
		}

		if(!_done)
		{
			for(var i = 0; i < preCollisionToDo.length; i++)
			{
				if(contact.GetFixtureB().GetBody().GetUserData().tag == preCollisionToDo[i].tag)
				{
					for(var j = 0; j < beginCollisionToDo[i].otherTag.length; j++)
					{
						if(contact.GetFixtureA().GetBody().GetUserData().tag == preCollisionToDo[i].otherTag[j])
						{
							contact.GetFixtureA().GetBody().GetUserData().obj.preCollide(contact.GetFixtureB().GetBody().GetUserData());
						}
					}
				}
			}
		}
	}

	this.listener.BeginContact = function(contact)
	{
		var _done = false;

		for(var i = 0; i < beginCollisionToDo.length; i++)
		{
			if(contact.GetFixtureA().GetBody().GetUserData().tag == beginCollisionToDo[i].tag)
			{
				for(var j = 0; j < beginCollisionToDo[i].otherTag.length; j++)
				{
					if(contact.GetFixtureB().GetBody().GetUserData().tag == beginCollisionToDo[i].otherTag[j])
					{
						contact.GetFixtureB().GetBody().GetUserData().obj.onCollide(contact.GetFixtureA().GetBody().GetUserData());
					}
				}
			}
		}

		if(!_done)
		{
			for(var i = 0; i < beginCollisionToDo.length; i++)
			{
				if(contact.GetFixtureB().GetBody().GetUserData().tag == beginCollisionToDo[i].tag)
				{
					for(var j = 0; j < beginCollisionToDo[i].otherTag.length; j++)
					{
						if(contact.GetFixtureA().GetBody().GetUserData().tag == beginCollisionToDo[i].otherTag[j])
						{
							contact.GetFixtureA().GetBody().GetUserData().obj.onCollide(contact.GetFixtureB().GetBody().GetUserData());
						}
					}
				}
			}
		}
	}

	this.listener.EndContact = function(contact)
	{
		var _done = false;

		for(var i = 0; i < endCollisionToDo.length; i++)
		{
			if(contact.GetFixtureA().GetBody().GetUserData().tag == endCollisionToDo[i].tag)
			{
				for(var j = 0; j < endCollisionToDo[i].otherTag.length; j++)
				{
					if(contact.GetFixtureB().GetBody().GetUserData().tag == endCollisionToDo[i].otherTag[j])
					{
						contact.GetFixtureB().GetBody().GetUserData().obj.endCollide(contact.GetFixtureA().GetBody().GetUserData());
					}
				}
			}
		}

		if(!_done)
		{
			for(var i = 0; i < endCollisionToDo.length; i++)
			{
				if(contact.GetFixtureB().GetBody().GetUserData().tag == endCollisionToDo[i].tag)
				{
					for(var j = 0; j < endCollisionToDo[i].otherTag.length; j++)
					{
						if(contact.GetFixtureA().GetBody().GetUserData().tag == endCollisionToDo[i].otherTag[j])
						{
							contact.GetFixtureA().GetBody().GetUserData().obj.endCollide(contact.GetFixtureB().GetBody().GetUserData());
						}
					}
				}
			}
		}
	}

	this.listener.PostSolve = function(contact)
	{
		var _done = false;

		for(var i = 0; i < postCollisionToDo.length; i++)
		{
			if(contact.GetFixtureA().GetBody().GetUserData().tag == postCollisionToDo[i].tag)
			{
				for(var j = 0; j < postCollisionToDo[i].otherTag.length; j++)
				{
					if(contact.GetFixtureB().GetBody().GetUserData().tag == postCollisionToDo[i].otherTag[j])
					{
						contact.GetFixtureB().GetBody().GetUserData().obj.postCollide(contact.GetFixtureA().GetBody().GetUserData());
					}
				}
			}
		}

		if(!_done)
		{
			for(var i = 0; i < postCollisionToDo.length; i++)
			{
				if(contact.GetFixtureB().GetBody().GetUserData().tag == postCollisionToDo[i].tag)
				{
					for(var j = 0; j < postCollisionToDo[i].otherTag.length; j++)
					{
						if(contact.GetFixtureA().GetBody().GetUserData().tag == postCollisionToDo[i].otherTag[j])
						{
							contact.GetFixtureA().GetBody().GetUserData().obj.postCollide(contact.GetFixtureB().GetBody().GetUserData());
						}
					}
				}
			}
		}
	}
}

/*******************************
	Data des collisions
*******************************/
var preCollisionToDo = 
[
	{
		tag: "player",
		otherTag: ["trigger"]
	}
];

var beginCollisionToDo = 
[
	{
		tag: "floor",
		otherTag: ["player"]
	},
	{
		tag: "trap",
		otherTag: ["player"]
	},
	{
		tag: "block",
		otherTag: ["player"]
	},
	{
		tag: "movablePlateform",
		otherTag: ["player"]
	},
	{
		tag: "player",
		otherTag: ["movablePlateform"]
	},
	{
		tag: "wall",
		otherTag: ["player"]
	},
	{
		tag: "wall",
		otherTag: ["detector"]
	},
	{
		tag: "player",
		otherTag: ["collectible"]
	},
	{
		tag: "player",
		otherTag: ["breakable"]
	},
	{
		tag: "collectible",
		otherTag :["player"]
	}
];

var endCollisionToDo = 
[
	{
		tag: "block",
		otherTag: ["player"]
	},
	{
		tag: "wall",
		otherTag: ["player"]
	}
]

var postCollisionToDo = 
[
	{
		tag: "floor",
		otherTag: ["player"]
	},
	{
		tag: "wall",
		otherTag: ["player"]
	}
]