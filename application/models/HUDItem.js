visualHUD.model.HUDItem = Backbone.Model.extend({
    defaults: {
        'itemType': null,
        'iconPosition': null,
        'iconSpacing': null,
        'iconOpacity': null,
        'iconSize': null,
        'iconStyle': null,
        'textSize': null,
        'textOpacity': null,
        'textStyle': null,
        'textColor': 'FFFFFF',
        'teamColors': null,
        'colorRanges': null,
        'coordinates': {
            top: 0,
            left: 0,
            width: null,
            height: null
        },
        'iconCoordinates': {},
        'textCoordinates': {},
        'cssClass': null,
        'label': null,
        'name': null,
        'text': null,
        'borderRadius': 0,
        'boxStyle': 0,
        'template': null,
        'singlePowerup': true,
        'padding': null,
        'toggleChat': null,
        'scoreboxLayout': null,
        'scoreboxMode': null,
        'barDirection': null
    },

    defaultsByName: {
        'chatArea': {
            padding: 5,
            toggleChat: false,
            'coordinates': {
                top: 0,
                left: 0,
                width: 640,
                height: null
            }
        },
        'timer': {
            colorRanges: [],
            text: '2:47'
        },
        ammoIndicator: {
            colorRanges: [
                {
                    name: 'Low',
                    color: 'FF0000',
                    range: [-999, 5]
                },
                {
                    name: 'Normal',
                    color: 'FFFFFF',
                    range: [6,100]
                },
                {
                    name: 'Hight',
                    color: 'FFFFFF',
                    range: [101, 999]
                }
            ]
        },
        'skillIndicator': {
            colorRanges: [
                {
                    name: 'Low',
                    color: '56F000',
                    range: [0, 33]
                },
                {
                    name: 'Normal',
                    color: 'ECF000',
                    range: [34,66]
                },
                {
                    name: 'Hight',
                    color: 'CC0E00',
                    range: [67, 999]
                }
            ],
            template: 'Skill rating',
            textSize: 20,
            textStyle: 0,
            textColor: 'FFFFFF',
            text: 100,
            ownerDraw: '0',
            textOpacity: 100
        },
        'accuracyIndicator': {
            text: '36',
            colorRanges: []
        },
        'powerupIndicator': {
            layout: 'vertical',
            iconStyle: null,
            iconSize: 24,
            textSize: 55,
            iconSpacing: 4,
            text: '32'
        },
        'scoreBox': {
            scoreboxLayout: 'vertical',
            iconSpacing: 2,
            iconStyle: 0,
            scoreboxMode: 'ffa'
        }
    },

    defaultsByType: {
        'general': {
            colorRanges: [
                {
                    name: 'Low',
                    color: 'FF0000',
                    range: [-999, 25]
                },
                {
                    name: 'Normal',
                    color: 'FFFFFF',
                    range: [26,100]
                },
                {
                    name: 'Hight',
                    color: 'FFFFFF',
                    range: [101, 999]
                }
            ],
            iconPosition: 'left',
            iconSpacing: 10,
            iconOpacity: 100,
            iconSize: 32,
            iconStyle: 0,
            textSize: 100,
            textOpacity: 100,
            textStyle: '3',
            teamColors: true
        },
        'iconItem': {
            iconStyle: 0,
            iconSize: 24,
            iconOpacity: 100
        },
        'scoreBox': {
            scoreboxStyle: 0,
            layout: 'horizontal',
            mode: 'ffa',
            spacing: 1,
            iconSpacing: 10//  horisontal || vertical
        },
        'flagIndicator':{
            iconStyle: 0,
            iconSize: 32,
            iconOpacity: 100
        },
        'obits': {
            iconStyle: 0,
            iconSize: null,
            text: ['Klesk', 'Xaero']
        },
        'rect':{
            color: 'FFFFFF',
            opacity: 100,
            width: 0,
            height: 0,
            minWidth: 1,
            minHeight: 1,
            maxWidth: 640,
            maxHeight: 480,
            teamColors: false,
            boxStyle: 0,
            hairLine: 0,
            borderRadius: 0
        },
        'chatArea':{
            coordinates: {
                top: 301,
                left: 0,
                width: 640,
                height: 120
            },
            color: '000000',
            opacity: 75,
            padding: 3,
            width: 640,
            height: 120,
            minWidth: 1,
            minHeight: 1,
            maxWidth: 640,
            maxHeight: 480,
            boxStyle: 2,
            borderRadius: 0
        },
        'bar': {
            color: '000000',
            opacity: 30,
            width: 100,
            height: 24,
            minWidth: 1,
            minHeight: 1,
            maxWidth: 640,
            maxHeight: 100,
            padding: 0,
            barsOpacity: 80,
            text: 125,
            barDirection: 0,
            coordinates: {
                width: 100,
                height: 24
            }
        }
    },

    setDefaultValues: function(options) {
        var defaultValuesByType = this.getDefaultsByType(options.itemType) || {},
            defaultValuesByName = this.getDefaultsByName(options.name) || {};

        _.extend(this.attributes, options, defaultValuesByType, defaultValuesByName);

        return this;
    },

    getDefaultsByType: function(type) {
        return this.defaultsByType[type] || null;
    },

    getDefaultsByName: function(type) {
        return this.defaultsByName[type] || null;
    },

    getDefaultColorRangeByName: function(name) {
        return this.defaultColorRangesByName[name] || null;
    },

    getDefaultTextByName: function(name) {
        return this.defaultTextByName[name] || null;
    }
});