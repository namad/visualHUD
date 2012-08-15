visualHUD.view.Viewport = Backbone.View.extend({
    tagName: 'div',
    className: 'vh-viewport',
    pinned: true,
    canvasDragMoveAllowed: false,
    htmlTpl: [
        '<div class="vh-region vh-region-top"></div>',
        '<div class="vh-region vh-region-right"></div>',
        '<div class="vh-region vh-region-bottom"></div>',
        '<div class="vh-region vh-region-center"></div>'
    ],

    events: {
        'mousedown': 'checkDragDrop',
        'click .vh-region-right': 'cancelEventBubbling'
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

        $(window).bind('resize.canvas', this.bound.trackResize);
        $(document).bind('keydown', this.bound.trackSpaceDown);

        this.$topArea = this.$el.find('.vh-region-top');
        this.$rightArea = this.$el.find('.vh-region-right');
        this.$bottomtArea = this.$el.find('.vh-region-bottom');
        this.$centerArea = this.$el.find('.vh-region-center');

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
                left: '50%',
                top: '50%'
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

        this.drag = new visualHUD.util.DragZoneBase({
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
        this.$rightArea.children().hide();
    },

    cancelEventBubbling: function(event) {
        event.stopPropagation();
    }
});