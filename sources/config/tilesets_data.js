/***************************
*
*   Data des tilesets
*
***************************/
/***************************
*   Niveau 3
***************************/
var specialTiles3 = [
    {
        data: 1,    //La première case de l'objet (graphiquement parlant)
        colliders: [ //Le(s) collider(s) du-dit objet
            {
                x: 16,
                y: 32,
                width: 304,
                height: 32,
                tag: "floor"
            }
        ]
    },
    {
        data: 12,
        colliders: [
            {
                x: 0,
                y: 16,
                width: 192,
                height: 32,
                tag: "floor"
            }
        ]
    },
    {
        data: 32,
        colliders: [
            {
                x: 0,
                y: 16,
                width: 192,
                height: 32,
                tag: "floor"
            }
        ]
    },
    {
        data: 52,
        colliders: [
            {
                x: 0,
                y: 16,
                width: 192,
                height: 32,
                tag: "floor"
            }
        ]
    },
    {
        data: 162,
        colliders: [
            {
                x: 20,
                y: -22,
                width: 102,
                height: 32,
                tag: "floor"
            }
        ]
    },
    {
        data: 72,
        colliders: [
            {
                x: 0,
                y: 16,
                width: 192,
                height: 32,
                tag: "floor"
            }
        ]
    },
    {
        data: 43,
        colliders: [
            {
                x: 0,
                y: 8,
                width: 240,
                height: 36,
                tag: "floor"
            }
        ]
    },
    {
        data: 63,
        colliders: [
            {
                x: 0,
                y: 8,
                width: 240,
                height: 36,
                tag: "floor"
            }
        ]
    },
    {
        data: 83,
        colliders: [
            {
                x: 0,
                y: 8,
                width: 240,
                height: 36,
                tag: "floor"
            }
        ]
    },
    {
        data: 103,
        colliders: [
            {
                x: 0,
                y: 8,
                width: 240,
                height: 36,
                tag: "floor"
            }
        ]
    },
    {
        data: 125,
        colliders: [
            {
                x: 16,
                y: 32,
                width: 304,
                height: 32,
                tag: "floor"
            },
            {
                x: 48,
                y: 64,
                width: 256,
                height: 32,
                tag: "floor"
            },
            {
                x: 80,
                y: 96,
                width: 192,
                height: 32,
                tag: "floor"
            },
            {
                x: 96,
                y: 128,
                width: 168,
                height: 16,
                tag: "floor"
            }
        ]
    },
    {
        data: 181,
        colliders: [
            {
                x: 24,
                y: 16,
                width: 128,
                height: 160,
                tag: "wall"
            }
        ]
    },
    {
        data: 145,
        colliders: [
            {
                x: 28,
                y: -12,
                width: 276,
                height: 16,
                tag: "floor"
            },
            {
                x: 44,
                y: 4,
                width: 256,
                height: 16,
                tag: "floor"
            },
            {
                x: 60,
                y: 20,
                width: 239,
                height: 16,
                tag: "floor"
            }
        ]
    },
    {
        data: 8,
        colliders: [
            {
                x: 8,
                y: 0,
                width: 64,
                height: 192,
                tag: "wall"
            }
        ]
    },
    {
        data: 16,
        colliders: [
            {
                x: 0,
                y: 0,
                width: 96,
                height: 96,
                tag: "wall"
            }
        ]
    },
    {
        data: 56,
        colliders: [
            {
                x: 0,
                y: 0,
                width: 96,
                height: 96,
                tag: "floor"
            }
        ]
    },
    {
        data: 95,
        colliders: [
            {
                x: 0,
                y: 0,
                width: 96,
                height: 96,
                tag: "floor"
            }
        ]
    },
    {
        data: 97,
        colliders: [
            {
                x: 0,
                y: 0,
                width: 96,
                height: 96,
                tag: "wall"
            }
        ]
    },
    {
        data: 122,
        colliders: [
            {
                x: 0,
                y: 6,
                width: 144,
                height: 36,
                tag: "floor"
            }
        ]
    },
    {
        data: 226,
        colliders: [
            {
                x: 16,
                y: -14,
                width: 632,
                height: 96,
                tag: "floor"
            }
        ]
    }
];

//All blocks
var tiles3_data = 
{
    "floor": ["floor"],
    "wall": ["wall"],
    "breakable": ["breakable"],
    "deco": ["deco", 2, 3, 4, 5, 6, 7, 241, 242, 243, 244, 361, 362, 363, 364],
    "empty": ["empty"]
}