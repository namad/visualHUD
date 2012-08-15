visualHUD.view.Canvas = Backbone.View.extend({
    className: 'hud-canvas',
    tagName: 'div',
    htmlTpl: [
        '<div class="canvas-extras">',
        '<div class="hud-weapon"></div>',
        '<div class="hud-crosshair"></div>',
        '<div class="weapon-bar"></div>',
        '<div class="team-overlay"></div>',
        '<div class="lag-o-metr"></div>',
        '<div class="speed-o-metr"></div>',
        '<div class="pickup-message"></div>',
        '<div class="demo-rec-message"></div>',
        '</div>',
        '<div class="hud-elements">',
        '</div>'
    ],

    clientSettingsMap: {
        'lagometr': {
            '1': 'draw-lag'
        },
        'speedometr': {
            '1': 'draw-speed'
        },
        'pickup': {
            '1': 'draw-pickup'
        },
        'recordingMessage': {
            '1': 'draw-demo-rec'
        },
        'drawGrid': {
            '0': 'no-grid',
            '5': 'grid-5',
            '10': 'grid-10'
        },
        'drawGun': {
            '0': 'no-gun',
            '1': 'gun-1',
            '2': 'gun-2'
        },
        'drawWeaponbar': {
            '0': 'no-gun',
            '1': 'wbar-1',
            '2': 'wbar-2',
            '3': 'wbar-3',
            '4': 'wbar-4'
        },
        'drawTeamoverlay': {
            '0': 'no-teamoverlay',
            '1': 'teamoverlay-1',
            '2': 'teamoverlay-2'
        }
    },

    events: {
        'mousedown': 'checkDragAction'
    },

    initialize: function() {
        _.extend(this, visualHUD.lib.selectionManagerInterface);
        this.initializeSelectionManager();
        this.initializeDragManager();
    },

    render: function(viewport) {
        this.viewport = viewport;

        this.$el.append(this.htmlTpl.join(''));
        this.getRefs();
        this.$el.appendTo(viewport.$centerArea);

        var clientSettingsModel = this.options.clientSettingsModel;
        this.setClientSettings(clientSettingsModel);
        clientSettingsModel.on('change', this.setClientSettings, this);

    },

    getRefs: function() {
        this.$HUDextras = this.$el.find('.canvas-extras');
        this.$canvas = this.$el.find('.hud-elements');
    },

    setClientSettings: function(record) {
        var data = record.toJSON();
        var settingsMap = this.clientSettingsMap;

        _.each(data, function(value, key) {

            if(key == 'snapGrid'){
                this.dragManager.setOptions({
                    grid: parseInt(value, 10) * visualHUD.scaleFactor
                });
            }

            if(key == 'canvasShot'){
                var originalClassName = this.$el.parent().attr('class');
                var patt = /canvas-[0-9]/;
                if(patt.test(originalClassName)) {
                    originalClassName = originalClassName.replace(patt, '');
                    originalClassName = $.trim(originalClassName);
                }
                originalClassName += (' canvas-' + value);

                this.$el.parent().attr('class', originalClassName);

//                if(_this.client[name] < 4){
//                    visualHUD.imageimport.dropImage();
//                } else if(_this.client[name] == 4){
//                    visualHUD.imageimport.setCustomBackground();
//                }
                //_this.canvas.css('background-image', '');
                return;
            }


            var extra = this.clientSettingsMap[key];
            if(extra) {
                var fn = 'removeClass';
                for(var x in extra){
                    fn = value == x ? 'addClass': 'removeClass';
                    this.$el[fn](extra[x])
                }
            }

        }, this);

    },

    initializeDragManager: function() {
        var me = this;

        this.dragManager = new visualHUD.util.DragZoneBase({
            ticks: 0,
            tolerance: 2,
            grid: visualHUD.scaleFactor,
            view: this,
            init: function(){
                var handles = [],
                    compass = ['nw', 'n', 'ne','e','se','s', 'sw', 'w'],
                    drawBox;

                for(var a = 0, b = compass.length; a < b; a++){
                    handles.push('<div class="resize-handle '+ compass[a] +'"></div>');
                };

                drawBox = $('<div class="hud-item"><div class="hud-item-box"></div>'+ handles.join('') +'</div>').width(1).height(1);

                _.extend(this,
                    visualHUD.lib.canvasDragInterface,
                    {
                        compass: compass,
                        drawBox: drawBox,
                        getView: function() {
                            return me;
                        }
                    }
                );
            }
        });
    },

    checkDragAction: function(event) {
        var $target = $(event.target);
        var hudItem = $target.closest('.hud-item', this.$el);

        if(this.viewport.canvasDragMoveAllowed == true) {
            return;
        }
        else {
            if(hudItem.length) {
                this.dragManager.setMode('move').start(event, hudItem);
            }
            else {
                this.dragManager.setMode('select').start(event);
            }
        }
        return false;
    },

    deselectItem: function(event) {
        this.deselect();
        return false;
    },

    getCanvasOffset: function(){
        var offset = this.$canvas.offset(),
            size = {
                width: this.$canvas.width(),
                height: this.$canvas.height()
            },
            canvasPosition = {
                top: offset.top,
                left: offset.left,
                right: offset.left + size.width,
                bottom: offset.top + size.height
            };

        _.extend(canvasPosition, size);

        return canvasPosition;
    }
});