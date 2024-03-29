type ResearchKey = "energy-efficiency" | "armour" | "speed" | "weapon-damage" | "rate-of-fire" | "rocketry";
interface ResearchValue {
    required: number
    name: string
    effect: number
}

const data: Record<ResearchKey, ResearchValue[]> = {
    "energy-efficiency": [
        {
            "required": 0,
            "name": "Level 1",
            "effect": 0
        },
        {
            "required": 100,
            "name": "Level 2",
            "effect": 10
        },
        {
            "required": 200,
            "name": "Level 3",
            "effect": 20
        },
        {
            "required": 300,
            "name": "Level 4",
            "effect": 30
        },
        {
            "required": 400,
            "name": "Level 5",
            "effect": 40
        },
        {
            "required": 500,
            "name": "Level 6",
            "effect": 50
        },
        {
            "required": 600,
            "name": "Level 7",
            "effect": 60
        },
        {
            "required": 700,
            "name": "Level 8",
            "effect": 70
        },
        {
            "required": 800,
            "name": "Level 9",
            "effect": 80
        },
        {
            "required": 900,
            "name": "Level 10",
            "effect": 90
        }
    ],
    "armour": [
        {
            "required": 0,
            "name": "Level 1",
            "effect": 0
        },
        {
            "required": 100,
            "name": "Level 2",
            "effect": 20
        },
        {
            "required": 200,
            "name": "Level 3",
            "effect": 30
        },
        {
            "required": 300,
            "name": "Level 4",
            "effect": 40
        },
        {
            "required": 400,
            "name": "Level 5",
            "effect": 50
        },
        {
            "required": 500,
            "name": "Level 6",
            "effect": 60
        },
        {
            "required": 600,
            "name": "Level 7",
            "effect": 70
        },
        {
            "required": 700,
            "name": "Level 8",
            "effect": 80
        },
        {
            "required": 800,
            "name": "Level 9",
            "effect": 90
        },
        {
            "required": 900,
            "name": "Level 10",
            "effect": 100
        }
    ],
    "speed": [
        {
            "required": 0,
            "name": "Level 1",
            "effect": 0
        },
        {
            "required": 100,
            "name": "Level 2",
            "effect": 10
        },
        {
            "required": 200,
            "name": "Level 3",
            "effect": 15
        },
        {
            "required": 300,
            "name": "Level 4",
            "effect": 20
        },
        {
            "required": 400,
            "name": "Level 5",
            "effect": 25
        },
        {
            "required": 500,
            "name": "Level 6",
            "effect": 30
        },
        {
            "required": 600,
            "name": "Level 7",
            "effect": 35
        },
        {
            "required": 700,
            "name": "Level 8",
            "effect": 40
        },
        {
            "required": 800,
            "name": "Level 9",
            "effect": 45
        },
        {
            "required": 900,
            "name": "Level 10",
            "effect": 50
        }
    ],
    "weapon-damage": [
        {
            "required": 0,
            "name": "Level 1",
            "effect": 0
        },
        {
            "required": 100,
            "name": "Level 2",
            "effect": 20
        },
        {
            "required": 200,
            "name": "Level 3",
            "effect": 30
        },
        {
            "required": 300,
            "name": "Level 4",
            "effect": 40
        },
        {
            "required": 400,
            "name": "Level 5",
            "effect": 50
        },
        {
            "required": 500,
            "name": "Level 6",
            "effect": 60
        },
        {
            "required": 600,
            "name": "Level 7",
            "effect": 70
        },
        {
            "required": 700,
            "name": "Level 8",
            "effect": 80
        },
        {
            "required": 800,
            "name": "Level 9",
            "effect": 90
        },
        {
            "required": 900,
            "name": "Level 10",
            "effect": 100
        }
    ],
    "rate-of-fire": [
        {
            "required": 0,
            "name": "Level 1",
            "effect": 0
        },
        {
            "required": 100,
            "name": "Level 2",
            "effect": 10
        },
        {
            "required": 200,
            "name": "Level 3",
            "effect": 15
        },
        {
            "required": 300,
            "name": "Level 4",
            "effect": 20
        },
        {
            "required": 400,
            "name": "Level 5",
            "effect": 25
        },
        {
            "required": 500,
            "name": "Level 6",
            "effect": 30
        },
        {
            "required": 600,
            "name": "Level 7",
            "effect": 35
        },
        {
            "required": 700,
            "name": "Level 8",
            "effect": 40
        },
        {
            "required": 800,
            "name": "Level 9",
            "effect": 45
        },
        {
            "required": 900,
            "name": "Level 10",
            "effect": 50
        }
    ],
    "rocketry": [
        {
            "required": 0,
            "name": "Level 1",
            "effect": 0
        },
        {
            "required": 100,
            "name": "Level 2",
            "effect": 15
        },
        {
            "required": 200,
            "name": "Level 3",
            "effect": 30
        },
        {
            "required": 300,
            "name": "Level 4",
            "effect": 45
        },
        {
            "required": 400,
            "name": "Level 5",
            "effect": 60
        },
        {
            "required": 500,
            "name": "Level 6",
            "effect": 75
        },
        {
            "required": 600,
            "name": "Level 7",
            "effect": 90
        },
        {
            "required": 700,
            "name": "Level 8",
            "effect": 105
        },
        {
            "required": 800,
            "name": "Level 9",
            "effect": 120
        },
        {
            "required": 900,
            "name": "Level 10",
            "effect": 135
        }
    ]
};

export { ResearchKey, ResearchValue, data as ResearchData };
