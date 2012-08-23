visualHUD.Collections.HUDPresets = visualHUD.Collections.DictionaryAbstract.extend({
    getData: function() {
        return [
            {
                'name': 'Large HUD',
                'preset': [{
                    "itemType": "general",
                    "cssClass": "lib-element-armor",
                    "label": "Armor indicator",
                    "name": "armorIndicator",
                    "colorRanges": [{
                        "name": "Low",
                        "range": [-999, 25],
                        "color": "FF0000"
                    }, {
                        "name": "Normal",
                        "range": [26, 99],
                        "color": "fccc30"
                    }, {
                        "name": "High",
                        "range": [100, 999],
                        "color": "FFFFFF"
                    }],
                    "iconPosition": "left",
                    "iconSpacing": "5",
                    "iconOpacity": 100,
                    "iconSize": "18",
                    "iconStyle": 0,
                    "textSize": 100,
                    "textOpacity": 100,
                    "textStyle": 3,
                    "teamColors": true,
                    "text": "100",
                    "textColor": "FFFFFF",
                    "coordinates": {
                        "top": 436,
                        "left": 400,
                        "width": 127,
                        "height": 35,
                        "right": 527,
                        "bottom": 471
                    },
                    "iconCoordinates": {
                        "top": 8.5,
                        "left": 0,
                        "width": 18,
                        "height": 18,
                        "right": 18,
                        "bottom": 26.5
                    },
                    "textCoordinates": {
                        "top": 0,
                        "left": 23,
                        "width": 104,
                        "height": 35,
                        "right": 127,
                        "bottom": 35
                    }
                }, {
                    "itemType": "general",
                    "cssClass": "lib-element-ammo",
                    "label": "Ammo indicator",
                    "name": "ammoIndicator",
                    "colorRanges": [{
                        "name": "Low",
                        "range": [-999, 5],
                        "color": "FF0000"
                    }, {
                        "name": "Normal",
                        "range": [5, 99],
                        "color": "FFFFFF"
                    }, {
                        "name": "High",
                        "range": [100, 999],
                        "color": "FFFFFF"
                    }],
                    "iconPosition": "left",
                    "iconSpacing": "0",
                    "iconOpacity": 100,
                    "iconSize": "16",
                    "iconStyle": 0,
                    "textSize": "65",
                    "textOpacity": 100,
                    "textStyle": 3,
                    "teamColors": true,
                    "text": "25",
                    "textColor": "FFFFFF",
                    "coordinates": {
                        "top": 442,
                        "left": 113,
                        "width": 83,
                        "height": 22,
                        "right": 196,
                        "bottom": 464
                    },
                    "iconCoordinates": {
                        "top": 3,
                        "left": 0,
                        "width": 16,
                        "height": 16,
                        "right": 16,
                        "bottom": 19
                    },
                    "textCoordinates": {
                        "top": 0,
                        "left": 16,
                        "width": 67,
                        "height": 22,
                        "right": 83,
                        "bottom": 22
                    }
                }, {
                    "itemType": "general",
                    "cssClass": "lib-element-timer",
                    "label": "Timer",
                    "name": "timer",
                    "iconPosition": "left",
                    "iconSpacing": 10,
                    "iconOpacity": 100,
                    "iconSize": "0",
                    "iconStyle": 0,
                    "textSize": "60",
                    "textOpacity": 100,
                    "textStyle": 3,
                    "teamColors": true,
                    "text": "0:00",
                    "textColor": "FFFFFF",
                    "coordinates": {
                        "top": 3,
                        "left": 250,
                        "width": 72,
                        "height": 21,
                        "right": 322,
                        "bottom": 24
                    },
                    "iconCoordinates": {
                        "top": 0,
                        "left": 0,
                        "width": 0,
                        "height": 0,
                        "right": 0,
                        "bottom": 0
                    },
                    "textCoordinates": {
                        "top": 0,
                        "left": 0,
                        "width": 72,
                        "height": 21,
                        "right": 72,
                        "bottom": 21
                    }
                }, {
                    "itemType": "scoreBox",
                    "cssClass": "lib-element-scorebox",
                    "label": "Scorebox",
                    "name": "scoreBox",
                    "scoreboxStyle": 2,
                    "layout": "vertical",
                    "mode": "ffa",
                    "spacing": 1,
                    "iconSpacing": 10,
                    "coordinates": {
                        "top": 436,
                        "left": 585,
                        "width": 50,
                        "height": 33,
                        "right": 635,
                        "bottom": 469
                    }
                }, {
                    "itemType": "general",
                    "cssClass": "lib-element-powerup",
                    "label": "Powerup timer",
                    "name": "powerupIndicator",
                    "iconPosition": "top",
                    "iconSpacing": 4,
                    "iconOpacity": 100,
                    "iconSize": 24,
                    "iconStyle": 0,
                    "textSize": 55,
                    "textOpacity": 100,
                    "textStyle": 3,
                    "teamColors": true,
                    "text": "32",
                    "layout": "vertical",
                    "textColor": "FFFFFF",
                    "singlePowerup": false,
                    "coordinates": {
                        "top": 240,
                        "left": 571,
                        "width": 62,
                        "height": 28,
                        "right": 633,
                        "bottom": 268
                    },
                    "iconCoordinates": {
                        "top": 0,
                        "left": 0,
                        "width": 24,
                        "height": 24,
                        "right": 24,
                        "bottom": 24
                    },
                    "textCoordinates": {
                        "top": 5,
                        "left": 28,
                        "width": 34,
                        "height": 19,
                        "right": 62,
                        "bottom": 24
                    }
                }, {
                    "itemType": "iconItem",
                    "cssClass": "lib-element-flag",
                    "label": "Flag indicator",
                    "name": "flagIndicator",
                    "iconStyle": "1",
                    "iconSize": "38",
                    "iconOpacity": 100,
                    "coordinates": {
                        "top": 434,
                        "left": 51,
                        "width": 38,
                        "height": 38,
                        "right": 89,
                        "bottom": 472
                    }
                }, {
                    "itemType": "general",
                    "cssClass": "lib-element-health",
                    "label": "Health indicator",
                    "name": "healthIndicator",
                    "colorRanges": [{
                        "name": "Low",
                        "range": [-999, 25],
                        "color": "FF0000"
                    }, {
                        "name": "Normal",
                        "range": [26, 100],
                        "color": "fccc30"
                    }, {
                        "name": "High",
                        "range": [101, 999],
                        "color": "FFFFFF"
                    }],
                    "iconPosition": "left",
                    "iconSpacing": "5",
                    "iconOpacity": 100,
                    "iconSize": "18",
                    "iconStyle": 0,
                    "textSize": 100,
                    "textOpacity": 100,
                    "textStyle": 3,
                    "teamColors": true,
                    "text": "100",
                    "textColor": "fccc30",
                    "coordinates": {
                        "top": 435,
                        "left": 243,
                        "width": 127,
                        "height": 35,
                        "right": 370,
                        "bottom": 470
                    },
                    "iconCoordinates": {
                        "top": 8.5,
                        "left": 0,
                        "width": 18,
                        "height": 18,
                        "right": 18,
                        "bottom": 26.5
                    },
                    "textCoordinates": {
                        "top": 0,
                        "left": 23,
                        "width": 104,
                        "height": 35,
                        "right": 127,
                        "bottom": 35
                    }
                }, {
                    "itemType": "iconItem",
                    "cssClass": "lib-element-ctf-powerup",
                    "label": "CTF powerup indicator",
                    "name": "CTFPowerupIndicator",
                    "iconStyle": 0,
                    "iconSize": 16,
                    "iconOpacity": 100,
                    "coordinates": {
                        "top": 455,
                        "left": 5,
                        "width": 16,
                        "height": 16,
                        "right": 21,
                        "bottom": 471
                    }
                }, {
                    "itemType": "iconItem",
                    "cssClass": "lib-element-player-item",
                    "label": "Usable item indicator",
                    "name": "playerItem",
                    "iconStyle": 0,
                    "iconSize": 16,
                    "iconOpacity": 100,
                    "coordinates": {
                        "top": 435,
                        "left": 5,
                        "width": 16,
                        "height": 16,
                        "right": 21,
                        "bottom": 451
                    }
                }]
            },
            {
                'name': 'Small HUD',
                'preset': [{
                    "itemType": "rect",
                    "name": "rectangleBox",
                    "label": "Rectangle box",
                    "cssClass": "lib-element-rect",
                    "color": "000000",
                    "opacity": "30",
                    "width": "343",
                    "height": "28",
                    "coordinates": {
                        "top": 448,
                        "left": 151,
                        "width": 343,
                        "height": 28,
                        "right": 494,
                        "bottom": 476
                    },
                    "teamColors": true,
                    "borderRadius": "3",
                    "boxStyle": 0
                }, {
                    "itemType": "general",
                    "cssClass": "lib-element-health",
                    "label": "Health indicator",
                    "name": "healthIndicator",
                    "colorRanges": [{
                        "name": "Low",
                        "range": [-999, 25],
                        "color": "FF0000"
                    }, {
                        "name": "Normal",
                        "range": [26, 100],
                        "color": "FFFFFF"
                    }, {
                        "name": "High",
                        "range": [101, 999],
                        "color": "FFFFFF"
                    }],
                    "iconPosition": "left",
                    "iconSpacing": "2",
                    "iconOpacity": 100,
                    "iconSize": "18",
                    "iconStyle": 0,
                    "textSize": "50",
                    "textOpacity": 100,
                    "textStyle": 3,
                    "teamColors": true,
                    "text": "100",
                    "textColor": "FFFFFF",
                    "coordinates": {
                        "top": 453,
                        "left": 199,
                        "width": 72,
                        "height": 18,
                        "right": 271,
                        "bottom": 471
                    },
                    "iconCoordinates": {
                        "top": 0,
                        "left": 0,
                        "width": 18,
                        "height": 18
                    },
                    "textCoordinates": {
                        "top": 0,
                        "left": 20,
                        "width": 52,
                        "height": 18
                    }
                }, {
                    "itemType": "general",
                    "cssClass": "lib-element-armor",
                    "label": "Armor indicator",
                    "name": "armorIndicator",
                    "colorRanges": [{
                        "name": "Low",
                        "range": [-999, 25],
                        "color": "FF0000"
                    }, {
                        "name": "Normal",
                        "range": [26, 100],
                        "color": "FFFFFF"
                    }, {
                        "name": "High",
                        "range": [101, 999],
                        "color": "FFFFFF"
                    }],
                    "iconPosition": "left",
                    "iconSpacing": "2",
                    "iconOpacity": 100,
                    "iconSize": "18",
                    "iconStyle": 0,
                    "textSize": "50",
                    "textOpacity": 100,
                    "textStyle": 3,
                    "teamColors": true,
                    "text": "179",
                    "textColor": "FFFFFF",
                    "coordinates": {
                        "top": 453,
                        "left": 370,
                        "width": 72,
                        "height": 18,
                        "right": 442,
                        "bottom": 471
                    },
                    "iconCoordinates": {
                        "top": 0,
                        "left": 0,
                        "width": 18,
                        "height": 18
                    },
                    "textCoordinates": {
                        "top": 0,
                        "left": 20,
                        "width": 52,
                        "height": 18
                    }
                }, {
                    "itemType": "general",
                    "cssClass": "lib-element-ammo",
                    "label": "Ammo indicator",
                    "name": "ammoIndicator",
                    "colorRanges": [{
                        "name": "Low",
                        "range": [-999, 5],
                        "color": "FF0000"
                    }, {
                        "name": "Normal",
                        "range": [6, 100],
                        "color": "FFFFFF"
                    }, {
                        "name": "High",
                        "range": [101, 999],
                        "color": "FFFFFF"
                    }],
                    "iconPosition": "left",
                    "iconSpacing": "2",
                    "iconOpacity": 100,
                    "iconSize": "18",
                    "iconStyle": 0,
                    "textSize": "45",
                    "textOpacity": 100,
                    "textStyle": 3,
                    "teamColors": true,
                    "text": "25",
                    "textColor": "FFFFFF",
                    "coordinates": {
                        "top": 453,
                        "left": 286,
                        "width": 67,
                        "height": 18,
                        "right": 353,
                        "bottom": 471
                    },
                    "iconCoordinates": {
                        "top": 0,
                        "left": 0,
                        "width": 18,
                        "height": 18
                    },
                    "textCoordinates": {
                        "top": 1,
                        "left": 20,
                        "width": 47,
                        "height": 16
                    }
                }, {
                    "itemType": "general",
                    "cssClass": "lib-element-powerup",
                    "label": "Powerup timer",
                    "name": "powerupIndicator",
                    "iconPosition": "top",
                    "iconSpacing": "0",
                    "iconOpacity": 100,
                    "iconSize": "32",
                    "iconStyle": 0,
                    "textSize": 55,
                    "textOpacity": 100,
                    "textStyle": 3,
                    "teamColors": true,
                    "text": "32",
                    "layout": "vertical",
                    "textColor": "FFFFFF",
                    "singlePowerup": false,
                    "coordinates": {
                        "top": 222,
                        "left": 566,
                        "width": 62,
                        "height": 36,
                        "right": 628,
                        "bottom": 258
                    },
                    "iconCoordinates": {
                        "top": 0,
                        "left": 0,
                        "width": 32,
                        "height": 32
                    },
                    "textCoordinates": {
                        "top": 12,
                        "left": 36,
                        "width": 34,
                        "height": 20
                    }
                }, {
                    "itemType": "iconItem",
                    "cssClass": "lib-element-flag",
                    "label": "Flag indicator",
                    "name": "flagIndicator",
                    "iconStyle": "0",
                    "iconSize": "42",
                    "iconOpacity": 100,
                    "coordinates": {
                        "top": 3,
                        "left": 297,
                        "width": 42,
                        "height": 42,
                        "right": 339,
                        "bottom": 45
                    }
                }, {
                    "itemType": "iconItem",
                    "cssClass": "lib-element-ctf-powerup",
                    "label": "CTF powerup indicator",
                    "name": "CTFPowerupIndicator",
                    "iconStyle": 0,
                    "iconSize": 16,
                    "iconOpacity": 100,
                    "coordinates": {
                        "top": 454,
                        "left": 472,
                        "width": 16,
                        "height": 16,
                        "right": 488,
                        "bottom": 470
                    }
                }, {
                    "itemType": "iconItem",
                    "cssClass": "lib-element-player-item",
                    "label": "Usable item indicator",
                    "name": "playerItem",
                    "iconStyle": 0,
                    "iconSize": 16,
                    "iconOpacity": 100,
                    "coordinates": {
                        "top": 454,
                        "left": 157,
                        "width": 16,
                        "height": 16,
                        "right": 173,
                        "bottom": 470
                    }
                }, {
                    "itemType": "scoreBox",
                    "cssClass": "lib-element-scorebox",
                    "label": "Scorebox",
                    "name": "scoreBox",
                    "scoreboxStyle": 0,
                    "layout": "horizontal",
                    "mode": "ffa",
                    "spacing": 1,
                    "iconSpacing": 10,
                    "coordinates": {
                        "top": 5,
                        "left": 5,
                        "width": 180,
                        "height": 35,
                        "right": 185,
                        "bottom": 40
                    }
                }, {
                    "itemType": "general",
                    "cssClass": "lib-element-timer",
                    "label": "Timer",
                    "name": "timer",
                    "iconPosition": "left",
                    "iconSpacing": "2",
                    "iconOpacity": 100,
                    "iconSize": "14",
                    "iconStyle": 0,
                    "textSize": "30",
                    "textOpacity": 100,
                    "textStyle": 3,
                    "teamColors": true,
                    "text": "0:00",
                    "textColor": "FFFFFF",
                    "coordinates": {
                        "top": 48,
                        "left": 5,
                        "width": 52,
                        "height": 14,
                        "right": 57,
                        "bottom": 62
                    },
                    "iconCoordinates": {
                        "top": 0,
                        "left": 0,
                        "width": 14,
                        "height": 14
                    },
                    "textCoordinates": {
                        "top": 2,
                        "left": 16,
                        "width": 36,
                        "height": 11
                    }
                }]
            },
            {
                'name': 'Normal HUD',
                'preset': [{
                    "itemType": "general",
                    "cssClass": "lib-element-health",
                    "label": "Health indicator",
                    "name": "healthIndicator",
                    "colorRanges": [{
                        "name": "Low",
                        "range": [-999, 25],
                        "color": "FF0000"
                    }, {
                        "name": "Normal",
                        "range": [26, 100],
                        "color": "FFFFFF"
                    }, {
                        "name": "High",
                        "range": [101, 999],
                        "color": "FFFFFF"
                    }],
                    "iconPosition": "left",
                    "iconSpacing": 10,
                    "iconOpacity": 100,
                    "iconSize": "0",
                    "iconStyle": 0,
                    "textSize": "70",
                    "textOpacity": 100,
                    "textStyle": 3,
                    "teamColors": true,
                    "text": "47",
                    "textColor": "FFFFFF",
                    "coordinates": {
                        "top": 447,
                        "left": 204,
                        "width": 73,
                        "height": 25,
                        "right": 277,
                        "bottom": 472
                    },
                    "iconCoordinates": {
                        "top": 0,
                        "left": 0,
                        "width": 0,
                        "height": 0
                    },
                    "textCoordinates": {
                        "top": 0,
                        "left": 0,
                        "width": 73,
                        "height": 25
                    }
                }, {
                    "itemType": "general",
                    "cssClass": "lib-element-armor",
                    "label": "Armor indicator",
                    "name": "armorIndicator",
                    "colorRanges": [{
                        "name": "Low",
                        "range": [-999, 25],
                        "color": "FF0000"
                    }, {
                        "name": "Normal",
                        "range": [26, 100],
                        "color": "FFFFFF"
                    }, {
                        "name": "High",
                        "range": [101, 999],
                        "color": "FFFFFF"
                    }],
                    "iconPosition": "left",
                    "iconSpacing": 10,
                    "iconOpacity": 100,
                    "iconSize": "0",
                    "iconStyle": 0,
                    "textSize": "70",
                    "textOpacity": 100,
                    "textStyle": 3,
                    "teamColors": true,
                    "text": "55",
                    "textColor": "FFFFFF",
                    "coordinates": {
                        "top": 447,
                        "left": 365,
                        "width": 73,
                        "height": 25,
                        "right": 438,
                        "bottom": 472
                    },
                    "iconCoordinates": {
                        "top": 0,
                        "left": 0,
                        "width": 0,
                        "height": 0
                    },
                    "textCoordinates": {
                        "top": 0,
                        "left": 0,
                        "width": 73,
                        "height": 25
                    }
                }, {
                    "itemType": "general",
                    "cssClass": "lib-element-ammo",
                    "label": "Ammo indicator",
                    "name": "ammoIndicator",
                    "colorRanges": [{
                        "name": "Low",
                        "range": [-999, 5],
                        "color": "FF0000"
                    }, {
                        "name": "Normal",
                        "range": [6, 100],
                        "color": "FFFFFF"
                    }, {
                        "name": "High",
                        "range": [101, 999],
                        "color": "FFFFFF"
                    }],
                    "iconPosition": "bottom",
                    "iconSpacing": "2",
                    "iconOpacity": 100,
                    "iconSize": "14",
                    "iconStyle": 0,
                    "textSize": "42",
                    "textOpacity": "60",
                    "textStyle": 3,
                    "teamColors": true,
                    "text": "23",
                    "textColor": "FFFFFF",
                    "coordinates": {
                        "top": 433,
                        "left": 300,
                        "width": 44,
                        "height": 31,
                        "right": 344,
                        "bottom": 464
                    },
                    "iconCoordinates": {
                        "top": 17,
                        "left": 15,
                        "width": 14,
                        "height": 14
                    },
                    "textCoordinates": {
                        "top": 0,
                        "left": 0,
                        "width": 44,
                        "height": 15
                    }
                }, {
                    "itemType": "iconItem",
                    "cssClass": "lib-element-flag",
                    "label": "Flag indicator",
                    "name": "flagIndicator",
                    "iconStyle": 0,
                    "iconSize": "32",
                    "iconOpacity": 100,
                    "coordinates": {
                        "top": 350,
                        "left": 304,
                        "width": 32,
                        "height": 32,
                        "right": 336,
                        "bottom": 382
                    }
                }, {
                    "itemType": "general",
                    "cssClass": "lib-element-powerup",
                    "label": "Powerup timer",
                    "name": "powerupIndicator",
                    "iconPosition": "top",
                    "iconSpacing": 4,
                    "iconOpacity": 100,
                    "iconSize": "32",
                    "iconStyle": 0,
                    "textSize": 55,
                    "textOpacity": 100,
                    "textStyle": 3,
                    "teamColors": true,
                    "text": "32",
                    "layout": "vertical",
                    "textColor": "FFFFFF",
                    "singlePowerup": false,
                    "coordinates": {
                        "top": 222,
                        "left": 566,
                        "width": 70,
                        "height": 36,
                        "right": 636,
                        "bottom": 258
                    },
                    "iconCoordinates": {
                        "top": 0,
                        "left": 0,
                        "width": 32,
                        "height": 32
                    },
                    "textCoordinates": {
                        "top": 12,
                        "left": 36,
                        "width": 34,
                        "height": 20
                    }
                }, {
                    "itemType": "iconItem",
                    "cssClass": "lib-element-player-item",
                    "label": "Usable item indicator",
                    "name": "playerItem",
                    "iconStyle": 0,
                    "iconSize": "25",
                    "iconOpacity": 100,
                    "coordinates": {
                        "top": 452,
                        "left": 520,
                        "width": 25,
                        "height": 25,
                        "right": 545,
                        "bottom": 477
                    }
                }, {
                    "itemType": "iconItem",
                    "cssClass": "lib-element-ctf-powerup",
                    "label": "CTF powerup indicator",
                    "name": "CTFPowerupIndicator",
                    "iconStyle": 0,
                    "iconSize": "25",
                    "iconOpacity": 100,
                    "coordinates": {
                        "top": 452,
                        "left": 610,
                        "width": 25,
                        "height": 25,
                        "right": 635,
                        "bottom": 477
                    }
                }, {
                    "itemType": "scoreBox",
                    "cssClass": "lib-element-scorebox",
                    "label": "Scorebox",
                    "name": "scoreBox",
                    "scoreboxStyle": 0,
                    "layout": "horizontal",
                    "mode": "ffa",
                    "spacing": 1,
                    "iconSpacing": 10,
                    "coordinates": {
                        "top": 5,
                        "left": 5,
                        "width": 180,
                        "height": 35,
                        "right": 185,
                        "bottom": 40
                    }
                }, {
                    "itemType": "general",
                    "cssClass": "lib-element-timer",
                    "label": "Timer",
                    "name": "timer",
                    "iconPosition": "left",
                    "iconSpacing": "3",
                    "iconOpacity": 100,
                    "iconSize": "14",
                    "iconStyle": 0,
                    "textSize": "35",
                    "textOpacity": 100,
                    "textStyle": 3,
                    "teamColors": true,
                    "text": "2:18",
                    "textColor": "FFFFFF",
                    "coordinates": {
                        "top": 52,
                        "left": 5,
                        "width": 47,
                        "height": 14,
                        "right": 52,
                        "bottom": 66
                    },
                    "iconCoordinates": {
                        "top": 0,
                        "left": 0,
                        "width": 14,
                        "height": 14
                    },
                    "textCoordinates": {
                        "top": 1,
                        "left": 17,
                        "width": 30,
                        "height": 13
                    }
                }]
            }
        ]
    }
});

