visualHUD.Widgets.PopOver = Backbone.View.extend({
    tagName: 'div',
    className: 'popover-wrap',

    htmlTpl: [
        '<div class="popover-body">',
            '<div class="popover-title"><%= title %></div>',
            '<div class="popover-content"><%= html %></div>',
        '</div>'
    ],

    defaults: {
        opacity: 1,
        maxWidth: 500,
        offset: 10,
        html: 'This is popover content',
        title: 'Pop Over',
        position: 'top-left', // tr | tc |
        trigger: 'hover' // focus | click | manual
    },

    currentPosition: null,

    events: {
        'click .popover-body': 'cancelEventBubbling'
    },

    disabled: false,
    visible: false,

    initialize: function(options) {
        var template = _.template(this.htmlTpl.join(''));

        this.options = _.extend({}, this.defaults, options || {});

        this.$corner = $('<div class="popover-corner"></div>');
        this.$el.append(template(this.options));

        this.$corner.css('display', 'none');
        this.$el.css('display', 'none');

        this.bindEvents();
        this.getDOMRefs();
        this.render();
    },

    render: function() {
        this.$corner.appendTo(document.body);
        this.$el.appendTo(document.body);

        this.trigger('render', this);
    },

    bindEvents: function() {
        if(this.options.render){
            this.on('render', this.options.render, this.options.scope || this);
        }

        if(this.options.show){
            this.on('show', this.options.show, this.options.scope || this);
        }
        if(this.options.hide){
            this.on('hide', this.options.hide, this.options.scope || this);
        }
    },

    getDOMRefs: function() {
        this.$content = this.$el.find('div.popover-content');
        this.$title = this.$el.find('div.popover-title');
        this.$body = this.$el.find('div.popover-body');
    },

    setContend: function(html) {
        this.$content.html(html);
        return this;
    },

    setTitle: function(html) {
        this.$title.html(html);
        return this;
    },

    show: function(element, event){

        if(this.disabled) {
            return;
        }

        this.$activeElement = $(element);

        if(this.currentPosition != null) {
            this.$el.removeClass(this.currentPosition);
            this.$corner.removeClass(this.currentPosition);
        }


        this.$el.addClass('fade').css('display', 'block');
        this.$corner.addClass('fade').css('display', 'block');

        var popoverPosition = this.getCoordinates();
        var cornerPosition = this.getCornerCoordinates();


        this.$el
            .css(popoverPosition)
            .addClass('in');

        this.$corner
            .addClass(this.currentPosition)
            .css(cornerPosition)
            .addClass('in');

        event && event.stopPropagation();

        $('body').bind('click.hidePopOver', visualHUD.Function.bind(this.hide, this));

        this.visible = true;
        this.trigger('show', this);

        $(document).bind('mousewheel.hidePopover', visualHUD.Function.bind(this.hide, this));
    },

    hide: function(){
        if(!this.$activeElement) {
            return false;
        }

        this.$corner.removeClass('in').css('display', 'none');
        this.$el.removeClass('in').css('display', 'none');

        this.$activeElement = null;

        $('body').unbind('click.hidePopOver');

        this.visible = false;
        this.trigger('hide', this);

        $(document).unbind('mousewheel.hidePopover');
    },

    positionsMaps: {
        vertical: [
            'bottom-right', 'bottom-center', 'bottom-left',
            'top-left', 'top-center', 'top-right'
        ],
        horizontal: [
            'right-top', 'right-center', 'right-bottom',
            'left-bottom', 'left-center', 'left-top'
        ]
    },

    getCoordinates: function(){
        var targetElementCoordinates = this.$activeElement.coordinates(false, true);
        var popOverCoordinates = this.$el.coordinates();

        var mainPosition = this.options.position.split('-').shift();

        var isVertical = (/top|bottom/).test(mainPosition);
        var isHorizontal = (/left|right/).test(mainPosition);

        return this.calcCoordinates(this.options.position, {
            direction: isVertical ? 'vertical' : 'horizontal',
            maxLeft: $(document.body).innerWidth(),
            maxTop: $(document.body).innerHeight(),
            popOverCoordinates: popOverCoordinates,
            targetElementCoordinates: targetElementCoordinates
        });
    },

    calcCoordinates: function(position, options) {
        var currentPositionMap = this.positionsMaps[options.direction],
            currentPositionIndex = _.indexOf(currentPositionMap, position),
            mainPosition = position.split('-').shift(),
            adjustPosition = position.split('-').pop();

        var top = options.targetElementCoordinates.top;
        var left = options.targetElementCoordinates.left;

        var popOverHeight = options.popOverCoordinates.height,
            popOverWidth = options.popOverCoordinates.width;

        this.$el.addClass(this.currentPosition);

        switch(mainPosition) {
            case 'top': {
                top -= popOverHeight + this.options.offset;
                break;
            }
            case 'bottom': {
                top = options.targetElementCoordinates.bottom + this.options.offset;
                break;
            }
            case 'left': {
                left -= popOverWidth + this.options.offset;
                break;
            }
            case 'right': {
                left = options.targetElementCoordinates.right + this.options.offset;
                break;
            }
        }
        switch(adjustPosition) {
            case 'bottom': {
                top -= (popOverHeight - options.targetElementCoordinates.height);
                break;
            }
            case 'right': {
                left -= (popOverWidth - options.targetElementCoordinates.width);
                break;
            }
            case 'center': {
                if(options.direction == 'vertical') {
                    left -= popOverWidth / 2 - options.targetElementCoordinates.width / 2;
                }
                else {
                    top -= popOverHeight / 2 - options.targetElementCoordinates.height / 2;
                }
                break;
            }
        }

        if((top < 0 || top + popOverHeight > options.maxTop || left < 0 ||  left + popOverWidth > options.maxLeft) == true) {
            this.$el.removeClass(this.currentPosition);
            var nextDirection = currentPositionMap[currentPositionIndex + 1] || currentPositionMap[0];
            return this.calcCoordinates(nextDirection, options);
        }
        else {
            this.currentPosition = position;
            return {
                top: top,
                left: left
            }
        }
    },

    getCornerCoordinates: function() {
        var targetElementCoordinates = this.$activeElement.coordinates(false, true);
        var mainPosition = this.currentPosition.split('-').shift();
        var top = targetElementCoordinates.top;
        var left = targetElementCoordinates.left;
        var cornerWidth = this.$corner.outerWidth();
        var cornerHeight = this.$corner.outerHeight();

        switch(mainPosition) {
            case 'top': {
                top -= cornerHeight;
                left += targetElementCoordinates.width / 2 - cornerWidth / 2;
                break;
            }
            case 'bottom': {
                top = targetElementCoordinates.bottom;
                left += targetElementCoordinates.width / 2 - cornerWidth / 2;
                break;
            }
            case 'left': {
                top += targetElementCoordinates.height / 2 - cornerHeight / 2;
                left -= cornerWidth;
                break;
            }
            case 'right': {
                top += targetElementCoordinates.height / 2 - cornerHeight / 2;
                left = targetElementCoordinates.right;
                break;
            }
        }

        return {
            top: top,
            left: left
        }
    },

    disable: function(){
        this.hide();
        this.disabled = 1;
    },
    enable: function(){
        this.disabled = 0;
    },

    cancelEventBubbling: function(event) {
        event.stopPropagation();
    }
});

