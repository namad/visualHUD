visualHUD.util.DragZoneBase = function(options) {
    options = _.extend({}, this.defaults, options || {});
    this.setOptions(options);
    this.initialize.apply(this, arguments);
}

_.extend(visualHUD.util.DragZoneBase.prototype, {
    currentElement: null,
    handler: null,
    defaults: {
        ticks: 2,
        tolerance: 3,
        ghost: 0,
        opacity: 0.5,
        bodyDragClass: 'drag',
        position: 'position'
    },
    initialize: function(options){
        var _this = this;

        this.scope = options.scope || this;

        this.dropPanel = this.options.dropPanelID ? $$(this.options.dropPanelID) : $(document);

        this.bound = {
            dragover: $.proxy(this.options.ondragover, this.dropPanel),
            dragout: $.proxy(this.options.ondragout, this.dropPanel),
            start: $.proxy(this.start, this),
            check: $.proxy(this.check, this),
            drag: $.proxy(this.drag, this),
            end: $.proxy(this.end, this)
        };

        this.ghost = $('<div class="drag-helper"></div>').css({
            display: 'none',
            position: 'absolute',
            top: 0,
            left: 0
        }).appendTo(document.body);

        if(this.options.ondragover) {
            this.dropPanel.bind('mouseover', function(event){
                _this.options.ondragover.apply(_this.dropPanel, [event]);
            });
        }

        if(this.options.ondragout) {
            this.dropPanel.bind('mouseout', function(event){
                _this.options.ondragout.apply(_this.dropPanel, [event]);
            });
        }

        if(this.options.init) {
            this.options.init.call(this);
        };

        return this;
    },

    start: function(event, element) {
        this.currentElement = element;
        this.handler = $(event.target);
        this.ticker = this.options.ticks;
        this.mouse = this.getMouse(event);
        this.moveOffset = {x:0, y: 0 };

        if(element){
            var position = this.options.position;
            var elementPosition = this.currentElement[position]() || {left: this.mouse.x, top: this.mouse.y };
            this.moveOffset = {x: elementPosition.left - this.mouse.x, y: elementPosition.top - this.mouse.y };
        }

        $(document).bind('mousemove', this.bound.check);
        $(document).bind('mouseup', this.bound.end);
        $(document.body).disableSelection();

        if(this.options.onbeforestart) {
            this.options.onbeforestart.apply(this.scope, [this, event, this.mouse]);
        };
    },

    check: function(event) {
        var _mouse = this.getMouse(event);

        if(Math.abs(_mouse.x - this.mouse.x) > this.options.tolerance || Math.abs(_mouse.y - this.mouse.y) > this.options.tolerance) {

            $(document).unbind('mousemove', this.bound.check);
            $(document).bind('mousemove', this.bound.drag);

            $(document.body).addClass(this.options.bodyDragClass);

            if(this.options.onstart) {
                this.options.onstart.apply(this.scope, [this, event, _mouse]);
            };
        }

        if (event.stopPropagation) event.stopPropagation();
        if (event.preventDefault) event.preventDefault();
        return false;
    },

    drag: function(event) {
        if(this.ticker == this.options.ticks) {
            var _mouse = this.getMouse(event);

            var pos = {
                left: _mouse.x + this.moveOffset.x,
                top:_mouse.y + this.moveOffset.y
            };

            if(this.options.grid) {
                pos.left -= pos.left % this.options.grid;
                pos.top -= pos.top % this.options.grid;
            }

            if(this.options.ondrag) {
                this.options.ondrag.apply(this.scope, [this, event, pos, _mouse]);
            }

            this.ticker = 0;
        }
        else {
            this.ticker++;
        }
        if (event.stopPropagation) event.stopPropagation();
        if (event.preventDefault) event.preventDefault();
        return false;
    },

    end: function(event) {
        $(document).unbind('mousemove', this.bound.check);
        $(document).unbind('mousemove', this.bound.drag);
        $(document).unbind('mouseup', this.bound.end);

        this.ghost.empty().css({'display': 'none'});

        $(document.body).removeClass(this.options.bodyDragClass).css('cursor', '');
        $(document.body).enableSelection();

        var $target = $(event.target);
        if(this.options.ondrop) {
            this.options.ondrop.apply(this.scope, [this, event, $target]);
        };

        if (event.stopPropagation) event.stopPropagation();
        if (event.preventDefault) event.preventDefault();
        return false;
    },

    setOptions: function(options){
        this.options = this.options || {};
        _.extend(this.options, options || {});
        if(options.dropables) this.options.dropables = $(options.dropables);
    },

    getMouse: function(event){
        return {
            x: event.pageX,
            y: event.pageY
        };
    }
})