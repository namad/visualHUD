visualHUD.Models.HUDItem = Backbone.Model.extend({
    defaults: {
        'index': 0,
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
        'barDirection': null,
        'resizable': false,
        'group': null,
        'ownerDrawFlag': '0'
    },

    /**
     * Hash Map that contains item specific defaults by name
     */
    defaultsByName: {
        'chatArea':{
            coordinates: {
                top: 245,
                left: 0,
                width: 640,
                height: 160
            },
            showChat: false,
            color: '000000',
            opacity: 75,
            padding: 3,
            width: 640,
            height: 160,
            minWidth: 1,
            minHeight: 1,
            maxWidth: 640,
            maxHeight: 480,
            boxStyle: 2,
            borderRadius: 0
        },
        'timer': {
            colorRanges: [],
            text: '2:47'
        },
        'ammoIndicator': {
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
        'medal': {
            text: '27',
            colorRanges: [],
            ownerDrawFlag: 0,
            textStyle: 0,
            textSize: 50
        },
        'powerupIndicator': {
            colorRanges: [],
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

    /**
     * Hash Map that contains item specific defaults by itemType
     */
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
                    color: 'FCCC30',
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
            width: 100,
            height: 100,
            minWidth: 1,
            minHeight: 1,
            maxWidth: 640,
            maxHeight: 480,
            teamColors: false,
            boxStyle: 0,
            hairLine: 0,
            borderRadius: 0,
            coordinates: {
                width: 100,
                height: 100
            },
            resizable: true
        },

        'bar': {
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
                    color: 'FFA000',
                    range: [101, 999]
                }
            ],
            color: '000000',
            opacity: 30,
            width: 100,
            height: 24,
            minWidth: 1,
            minHeight: 1,
            maxWidth: 640,
            maxHeight: 100,
            padding: 0,
            barsOpacity: 70,
            text: 125,
            barDirection: 0,
            coordinates: {
                width: 100,
                height: 24
            },
            resizable: true
        }
    },

    initialize: function(options) {
        this.legacyCleanUp();
    },

    /**
     * Set defaults for newly created item
     * @param options
     * @return {visualHUD.Models.HUDItem}
     */
    setDefaultValues: function(options) {
        var defaultValuesByType = this.getDefaultsByType(options.itemType) || {},
            defaultValuesByName = this.getDefaultsByName(options.name) || {};

        // mix defaults in particular order, from more generic to more specific
        _.extend(this.attributes, options, defaultValuesByType, defaultValuesByName);



        return this;
    },

    getDefaultsByType: function(type) {
        return this.defaultsByType[type] || null;
    },

    getDefaultsByName: function(type) {
        return this.defaultsByName[type] || null;
    },

    legacyCleanUp: function() {
        var data = this.attributes;

        // always reset obits to their default values
        if(data.itemType == 'obits') {
            this.set(this.getDefaultsByType(data.itemType), {silent: true});
        }

        if(data.name == 'scoreBox') {
            if('scoreboxStyle' in data) {
                this.set({'iconStyle': data.scoreboxStyle}, {silent: true});
                delete datascoreboxStyle;
            }

            if('spacing' in data) {
                this.set({'iconSpacing': data.spacing}, {silent: true});
                delete data.spacing;
            }

            if('layout' in data) {
                this.set({'scoreboxLayout': data.layout}, {silent: true});
                delete data.layout;
            }

            if('mode' in data) {
                this.set({'scoreboxMode': data.mode}, {silent: true});
                delete data.mode;
            }
        }

        if(data.name == 'accuracyIndicator') {
            this.set({
                itemType: "general",
                iconStyle: 0,
                name: 'medal'
            }, {silent: true});
        }

        if(data.name == 'powerupIndicator' && data.iconStyle != null) {
            this.set({'iconStyle': null}, {silent: true});
        }

        if(this.get('ownerDraw') == '') {
            this.set({'ownerDraw': '0'}, {silent: true});
        }

        if(data.name == 'skillIndicator' && 'opacity' in data) {
            this.set({'textOpacity': data.opacity}, {silent: true});
            delete data.opacity;
        }

        if('rbox' in data) {
            delete data.rbox;
        }

        if('iconCoordinates' in data) {
            delete data.iconCoordinates;
        }

        if('textCoordinates' in data) {
            delete data.textCoordinates;
        }
    }
});

