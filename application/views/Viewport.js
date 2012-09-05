visualHUD.Views.Viewport = Backbone.View.extend({
    tagName: 'div',
    className: 'vh-viewport',
    pinned: true,
    canvasDragMoveAllowed: false,
    htmlTpl: [
        '<div class="vh-region vh-viewport-topbar"></div>',
        '<div class="vh-region vh-viewport-sidebar">',
            '<div class="vh-region vh-viewport-sidebar-content">',
                '<div class="pin-sidebar-action sidebar-pinned" title="Pin sidebar"><div class="pin-sidebar-icon"></div></div>',
            '</div>',
        '</div>',
        '<div class="vh-region vh-viewport-bottombar"></div>',
        '<div class="vh-region vh-viewport-center"></div>'
    ],

    events: {
        'mousedown': 'checkDragDrop',
        'click .pin-sidebar-action': 'toggleSidebarPin'
    },

    initialize: function() {
        var me = this;

        this.bound = {
            trackResize: $.proxy(this, 'trackResize'),
            trackSpaceDown: $.proxy(this, 'trackSpaceDown'),
            trackSpaceUp: $.proxy(this, 'trackSpaceUp')
        };

        this.$el.append(this.htmlTpl.join(''));
        this.$el.disableSelection();

        this.getDOMRefs();
        this.initializeClientSettings();
        this.setupCanvasDrag();
    },

    render: function(nestedViews) {
        this.setNestedViews(nestedViews);

        this.$el.appendTo(document.body);
        this.trackResize();

        this.fireEvent('render', [this]);
    },

    setNestedViews: function(views) {
        _.each(views, function(view) {
            var getterFn = 'get' + view.getAlias() + 'View';
            this[getterFn] = function() {
                return view;
            }
        }, this);
    },

    getDOMRefs: function() {
        this.$topArea = this.$el.find('.vh-viewport-topbar');
        this.$sidebarArea = this.$el.find('.vh-viewport-sidebar-content');
        this.$sidebarWrapper = this.$el.find('.vh-viewport-sidebar');
        this.$bottomtArea = this.$el.find('.vh-viewport-bottombar');
        this.$centerArea = this.$el.find('.vh-viewport-center');
        this.$pinSidebarIcon = this.$el.find('.pin-sidebar-action');
    },

    /**
     * Subscribe for the ClientSettings Model changes and set initial state based on that settings
     */
    initializeClientSettings: function() {
        var clientSettingsModel = this.options.clientSettingsModel;

        clientSettingsModel.on('change:pinSidebar', this.setSidebarState, this);
        clientSettingsModel.on('change:fullScreenView', this.toggleToolbars, this);

        this.setSidebarState(clientSettingsModel, clientSettingsModel.get('pinSidebar'));
        this.toggleToolbars(clientSettingsModel, clientSettingsModel.get('fullScreenView'));

    },

    /**
     * Adjust viewport height to the window height
     * Used as event handler at window.resize() calls
     * @param event
     */
    trackResize: function(event) {
        this.$el.css({
            height: $('body').height() + 'px'
        });

        if(this.pinned == false) {
            this.$centerArea.css({
                marginLeft: '',
                left: '',
                top: ''
            });
            this.pinned = true;
        }
    },

    trackSpaceDown: function(event) {
        if(event.keyCode == 32) {
            $(document).unbind('keydown', this.bound.trackSpaceDown);
            $(document).bind('keyup', this.bound.trackSpaceUp);
            $(document.body).addClass('drag');
            this.canvasDragMoveAllowed = true;
        }
    },

    trackSpaceUp: function(event) {
        if(event.keyCode == 32) {
            $(document).bind('keydown', this.bound.trackSpaceDown);
            $(document).unbind('keyup', this.bound.trackSpaceUp);
            $(document.body).removeClass('drag');
            this.canvasDragMoveAllowed = false;
        }
    },

    setupCanvasDrag: function() {
        var me = this,
            offset;

        $(window).bind('resize.canvas', this.bound.trackResize);
        $(document).bind('keydown', this.bound.trackSpaceDown);

        this.drag = new visualHUD.Utils.DragZoneBase({
            scope: this,
            ticks: 2,
            tolerance: 2,
            grid: 1,
            onbeforestart: function(manager, event, mouse){
                var position = this.$centerArea.position();
                this.pinned = false;
                manager.moveOffset = {x: position.left - mouse.x, y: position.top - mouse.y };
            },
            ondrag: function(manager, event, position){
                this.$centerArea.css(position);
            }
        });
    },

    checkDragDrop: function(event) {
        if(this.canvasDragMoveAllowed == true) {
            this.drag.start(event, this.$centerArea);
        }
    },

    hideAllSidebarItems: function() {
        this.$sidebarArea.children().not('.pin-sidebar-action').hide();
    },

    /**
     * Toggle top bar and toolbar
     * @param model
     * @param {Boolean} state Current value of  clientSettingsModel.fullScreenView
     */
    toggleToolbars: function(model, state) {
        var clientSettingsModel = this.options.clientSettingsModel,
            sidebarPinState = clientSettingsModel.get('pinSidebar');

        if(state == false) {
            this.$sidebarWrapper.css('right', '');
            this.bindSidebarSlideEvents(false)
        }
        else {
            if(sidebarPinState == false) {
                this.slideSidebar(false);
                this.bindSidebarSlideEvents(true);
            }
        }

        this.$el.toggleClass('tools-off', state);
        this.$el.toggleClass('tools-on', !state);
        
        $(window).trigger('resize.form');
    },

    slideSidebar: function(state) {

        var amount = state == true ? 0 : -1 * (this.$sidebarWrapper.width() - 30);
        var currentPosition = parseInt(this.$sidebarWrapper.css('right'), 10) || 0;

        if(amount == currentPosition) {
            return;
        }

        this.$sidebarWrapper.animate({
            'right': amount
        }, {
            duration: 200,
            complete: visualHUD.Function.createDelayed(function(){
                console.log('sidebar out');
            }, 20, this)
        });
    },

    toggleSidebarPin: function() {
        var clientSettingsModel = this.options.clientSettingsModel,
            sidebarPinState = clientSettingsModel.get('pinSidebar');

        clientSettingsModel.set('pinSidebar', !sidebarPinState);

        this.bindSidebarSlideEvents(sidebarPinState);
    },

    bindSidebarSlideEvents: function(state) {
        if(state == true) {
            var slide = visualHUD.Function.createBuffered(this.slideSidebar, 300, this);

            this.$sidebarArea.bind('mouseenter.slide', function(event) {
                slide(true);
                event.stopPropagation()
            });

            this.$sidebarWrapper.bind('mouseleave.slide', function(event) {
                slide(false);
                event.stopPropagation()
            });
        }
        else {
            this.$sidebarArea.unbind('mouseenter.slide');
            this.$sidebarWrapper.unbind('mouseleave.slide');
        }
    },

    setSidebarState: function(model, state) {
        this.$pinSidebarIcon.toggleClass('sidebar-pinned', state);
    }
});

