module.exports = {
    "NATV": {
        "kind": {
            "category": "NATV",
            "type": "LTTANK",
            "name": "Strike Car"
        },
        "upkeep": 5,
        "cost": 100,
        "hp": 20,
        "actionPoints": 140,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-neutral",
            "offset": 32
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "NTNK",
            "prev": null
        }
    },
    "NTNK": {
        "kind": {
            "category": "NTNK",
            "type": "TANK",
            "name": "Tank"
        },
        "upkeep": 10,
        "cost": 200,
        "hp": 50,
        "actionPoints": 100,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-neutral",
            "offset": 32
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "NGRV",
            "prev": "NATV"
        }
    },
    "NGRV": {
        "kind": {
            "category": "NGRV",
            "type": "SQUAD",
            "name": "Grav Bike"
        },
        "upkeep": 10,
        "cost": 200,
        "hp": 20,
        "actionPoints": 180,
        "movement": "HOVER",
        "display": {
            "tiles": "unit-neutral",
            "offset": 32
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "NROC",
            "prev": "NTNK"
        }
    },
    "NROC": {
        "kind": {
            "category": "NROC",
            "type": "LONGRANGE",
            "name": "Launcher"
        },
        "upkeep": 15,
        "cost": 600,
        "hp": 20,
        "actionPoints": 80,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-neutral",
            "offset": 32
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": null,
            "prev": "NGRV"
        }
    },
    "HSQU": {
        "kind": {
            "category": "HSQU",
            "type": "SQUAD",
            "name": "Squad"
        },
        "upkeep": 123,
        "cost": 123,
        "hp": 123,
        "actionPoints": 123,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-human",
            "offset": 32
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "HRAN",
            "prev": null
        }
    },
    "HRAN": {
        "kind": {
            "category": "HRAN",
            "type": "TROOP",
            "name": "Ranger"
        },
        "upkeep": 123,
        "cost": 123,
        "hp": 123,
        "actionPoints": 123,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-human",
            "offset": 72
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "HATV",
            "prev": "HSQU"
        }
    },
    "HATV": {
        "kind": {
            "category": "HATV",
            "type": "LTTANK",
            "name": "L.A.V"
        },
        "upkeep": 123,
        "cost": 123,
        "hp": 123,
        "actionPoints": 123,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-human",
            "offset": 8
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "HART",
            "prev": "HRAN"
        }
    },
    "HART": {
        "kind": {
            "category": "HART",
            "type": "LONGRANGE",
            "name": "Artillery",
        },
        "upkeep": 123,
        "cost": 123,
        "hp": 123,
        "actionPoints": 123,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-human",
            "offset": 0
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "HBUG",
            "prev": "HATV"
        }
    },
    "HBUG": {
        "kind": {
            "category": "HBUG",
            "type": "UNIQUE1",
            "name": "Buggy"
        },
        "upkeep": 123,
        "cost": 123,
        "hp": 123,
        "actionPoints": 123,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-human",
            "offset": 48
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "HTNK",
            "prev": "HART"
        }
    },
    "HTNK": {
        "kind": {
            "category": "HTNK",
            "type": "TANK",
            "name": "Tank"
        },
        "upkeep": 123,
        "cost": 123,
        "hp": 123,
        "actionPoints": 123,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-human",
            "offset": 40
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "HSPE",
            "prev": "HBUG"
        }
    },
    "HSPE": {
        "kind": {
            "category": "HSPE",
            "type": "LTGRAV",
            "name": "Speeder"
        },
        "upkeep": 123,
        "cost": 123,
        "hp": 123,
        "actionPoints": 123,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-human",
            "offset": 16
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "HGRV",
            "prev": "HTNK"
        }
    },
    "HGRV": {
        "kind": {
            "category": "HGRV",
            "type": "HEAVYGRAV",
            "name": "Grav Tank"
        },
        "upkeep": 123,
        "cost": 123,
        "hp": 123,
        "actionPoints": 123,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-human",
            "offset": 24
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "HGUN",
            "prev": "HSPE"
        }
    },
    "HGUN": {
        "kind": {
            "category": "HGUN",
            "type": "LONGRANGEHOVER",
            "name": "GunShip"
        },
        "upkeep": 123,
        "cost": 123,
        "hp": 123,
        "actionPoints": 123,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-human",
            "offset": 64
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": null,
            "prev": "HGRV"
        }
    },
    "ASQD": {
        "kind": {
            "category": "ASQD",
            "type": "SQUAD",
            "name": "Trooper"
        },
        "upkeep": 2,
        "cost": 30,
        "hp": 15,
        "actionPoints": 50,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-alien",
            "offset": 40
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "ASNI",
            "prev": null
        }
    },
    "ASNI": {
        "kind": {
            "category": "ASNI",
            "type": "TROOP",
            "name": "Sniper"
        },
        "upkeep": 3,
        "cost": 60,
        "hp": 20,
        "actionPoints": 70,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-alien",
            "offset": 72
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "ALTK",
            "prev": "ASQD"
        }
    },
    "ALTK": {
        "kind": {
            "category": "ALTK",
            "type": "LTTANK",
            "name": "Light Tank"
        },
        "upkeep": 10,
        "cost": 150,
        "hp": 30,
        "actionPoints": 100,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-alien",
            "offset": 8
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "APLA",
            "prev": "ASNI"
        }
    },
    "APLA": {
        "kind": {
            "category": "APLA",
            "type": "LONGRANGE",
            "name": "Artillery"
        },
        "upkeep": 25,
        "cost": 500,
        "hp": 30,
        "actionPoints": 50,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-alien",
            "offset": 32
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "AGRV",
            "prev": "ALTK"
        }
    },
    "AGRV": {
        "kind": {
            "category": "AGRV",
            "type": "HEAVYGRAV",
            "name": "Hover Tank"
        },
        "upkeep": 15,
        "cost": 300,
        "hp": 60,
        "actionPoints": 100,
        "movement": "HOVER",
        "display": {
            "tiles": "unit-alien",
            "offset": 48
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "AFLY",
            "prev": "APLA"
        }
    },
    "AFLY": {
        "kind": {
            "category": "AFLY",
            "type": "LTGRAV",
            "name": "Flyer"
        },
        "upkeep": 15,
        "cost": 300,
        "hp": 30,
        "actionPoints": 140,
        "movement": "HOVER",
        "display": {
            "tiles": "unit-alien",
            "offset": 0
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "AMDT",
            "prev": "AGRV"
        }
    },
    "AMDT": {
        "kind": {
            "category": "AMDT",
            "type": "TANK",
            "name": "Tank"
        },
        "upkeep": 15,
        "cost": 300,
        "hp": 75,
        "actionPoints": 70,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-alien",
            "offset": 16
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "ASUP",
            "prev": "AFLY"
        }
    },
    "ASUP": {
        "kind": {
            "category": "ASUP",
            "type": "LONGRANGEHOVER",
            "name": "S.H.O.G"
        },
        "upkeep": 30,
        "cost": 600,
        "hp": 75,
        "actionPoints": 100,
        "movement": "HOVER",
        "display": {
            "tiles": "unit-alien",
            "offset": 64
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": "AMEG",
            "prev": "AMDT"
        }
    },
    "AMEG": {
        "kind": {
            "category": "AMEG",
            "type": "UNIQUE1",
            "name": "Mega Tank"
        },
        "upkeep": 30,
        "cost": 600,
        "hp": 90,
        "actionPoints": 70,
        "movement": "GROUND",
        "display": {
            "tiles": "unit-alien",
            "offset": 24
        },
        "weapons": {
            "light": {
                "name": "PLASMA LAUNCHER",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            },
            "heavy": {
                "name": "EXPLOSIVE MINE",
                "range": 4,
                "damage": {
                    "contact": 15,
                    "close": 4,
                    "far": 0
                },
                "precision": 1,
                "percentActionPoints": 35
            }
        },
        "encyclopedia": {
            "next": null,
            "prev": "ASUP"
        }
    }
}
