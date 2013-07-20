visualHUD.Views.viewport.Canvas = Backbone.View.extend({
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
        _.extend(this, visualHUD.Libs.selectionManagerInterface);
        this.initializeDragManager();
    },

    render: function(viewport) {
        this.viewport = viewport;

        this.$el.append(this.htmlTpl.join(''));
        this.getRefs();
        this.$el.appendTo(viewport.$centerArea);

        var clientSettingsModel = this.options.clientSettingsModel;
		clientSettingsModel.changed = clientSettingsModel.toJSON();
        this.setClientSettings(clientSettingsModel);
        clientSettingsModel.on('change', this.setClientSettings, this);

    },

    getRefs: function() {
        this.$HUDextras = this.$el.find('.canvas-extras');
        this.$canvas = this.$el.find('.hud-elements');
    },

    setClientSettings: function(record) {
        var settingsMap = this.clientSettingsMap;

		
        _.each(record.changed, function(value, key) {

            if(key == 'snapGrid'){
                this.dragManager.setOptions({
                    grid: Math.max(parseInt(value, 10) * visualHUD.scaleFactor, visualHUD.scaleFactor)
                });
            }

            if(key == 'canvasShot'){
                var originalClassName = this.$el.parent().attr('class');
                originalClassName = originalClassName.replace(/canvas-[0-9]/, '');
                originalClassName = $.trim(originalClassName) + ' canvas-' + value;

                this.$el.parent().attr('class', originalClassName);

                if(value < 3){
                    this.$customImage && this.$customImage.hide();
                }
                else if(value == 3){
                    this.setCustomBackground();
                }
                return;
            }


            if(key == 'ownerDrawFlag') {
				var prevValue = record._previousAttributes[key] || '';
                this.$el.parent()
					.removeClass('gt-' + prevValue.toLowerCase())
					.addClass('gt-' + value.toLowerCase());
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

        this.dragManager = new visualHUD.Utils.DragZoneBase({
            ticks: 0,
            tolerance: 2,
            grid: visualHUD.scaleFactor,
            view: this
        });

        // extend drag manage with canvas specific functionality
        _.extend(this.dragManager, visualHUD.Libs.canvasDragInterface);
    },

    checkDragAction: function(event) {
        var $target = $(event.target);
        var hudItem = $target.closest('.hud-item', this.$el);
        var resizeHandle = $target.closest('div.resize-handle', this.$el);

        if(this.viewport.canvasDragMoveAllowed == true) {
            return;
        }
        else {

            if(resizeHandle.length){
                this.dragManager.setMode('resize').start(event, resizeHandle);
                return false;
            }

            if(hudItem.length) {
                this.dragManager.setMode('move').start(event, hudItem);
                return false;
            }
            else {
                this.dragManager.setMode('select').start(event);
                return false;
            }
        }

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
    },

    beginUpdate: function() {
        this.$el.addClass('hud-items-hidden');
    },

    completeUpdate: function() {
        this.$el.removeClass('hud-items-hidden');

        this.$el.find('div.' + visualHUD.Views.HUDItem.prototype.className).each(function(idx) {
            var view = $(this).data('HUDItem');
            view.refreshCoordinates();
        });
    },

    setCustomBackground: function() {
        var clientSettingsModel = this.options.clientSettingsModel;
        var prev = clientSettingsModel.previous('canvasShot');
        var src = clientSettingsModel.get('customBackground');

        this.$customImage = this.$customImage || $('<img/>').css({ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'none'}).prependTo(this.$el);

        if(src) {
            this.$customImage.attr('src', src).show();
        }
        else {
            if(visualHUD.growl) {
                var $alert =  visualHUD.growl.alert({
                    status: 'warning',
                    title: 'No custom image',
                    message: 'Custom background was not imported yet. Would you like to <a href="#" class="import">import</a>?'
                });

                $alert.find('a.import').click(visualHUD.Function.bind(function() {
                    this.trigger('import.image');
                    visualHUD.growl.hide($alert);
                    return false;
                }, this));
            }
            visualHUD.Function.createDelayed(function(attr, value) {
                var data = {};
                data[attr] = value;
                clientSettingsModel.set(data);
                this.viewport.getCanvasToolbarView().setClientSettings(data);
            }, 10, this, ['canvasShot', prev])();
        }

    },

    updateIndexes: function() {
        var elements = this.$canvas.children(),
            i = elements.length,
            view;

        elements.each(function(i) {
            view = elements.eq(i).data('HUDItem');
            view.model.set('index', i);
        });

        /*while(--i) {
            view = elements.eq(i).data('HUDItem');
            view.model.set('index', i);
        }*/
    }
});

