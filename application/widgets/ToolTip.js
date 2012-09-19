visualHUD.Widgets.ToolTip = Backbone.View.extend({
    tagName: 'div',
    className: 'hint-wrap',

    htmlTpl: [
        '<div class="hint-body">',
            '<div class="hint-content"></div>',
        '</div>',
        '<div class="hint-corner"></div>'
    ],

    defaults: {
        opacity: 1,
        delay: 100,
        width: 200
    },

    VERTICAL_OFFSET: 5,

    rendered: false,

    initialize: function(options) {
        this.$el.append(this.htmlTpl.join(''));

        $(document.body).on('click.hideTooltip', visualHUD.Function.bind(this.hide, this));
        $(document.body).on('mouseenter', '[data-tooltip]', visualHUD.Function.bind(this.mover, this));
        $(document.body).on('mouseleave', '[data-tooltip]', visualHUD.Function.bind(this.mout, this));

        this.options = _.extend({}, this.defaults, options || {});

        this.bound = {
            show: visualHUD.Function.createBuffered(this.show, this.options.delay, this)
        };

        this.getDOMRefs();
    },

    render: function() {
        this.$el.appendTo(document.body);
        this.rendered = true;
    },

    getDOMRefs: function() {
        this.$content = this.$el.find('div.hint-content');
        this.$body = this.$el.find('div.hint-body');
    },

    mover: function(event){

        if(this.disabled) return;

        this.$activeElement = $(event.currentTarget);

        window.clearTimeout(this.showTimer);
        this.showTimer = this.bound.show();

        this.mouseOver = 1;
    },

    mout: function(element, event){
        if(this.disabled) return;
        window.clearTimeout(this.showTimer);
        this.mouseOver = 0;
        this.hide();
    },

    show: function(event){

        if(this.rendered == false) {
            this.render();
        }

        if(this.$activeElement == null) {
            return;
        }

        var tooltipText = this.$activeElement.data('tooltip');

        if(tooltipText == null || tooltipText == '' || this.mouseOver == 0) {
            return;
        }

        this.$content.css('visibility', 'hidden').html(tooltipText);
        this.$el.css({'width': '', top:0, left: 0});
        this.$body.css({'width': '', 'height': ''});

        var width = this.$body.width(); // we'll use it later to properly position tooltip
        var height = this.$body.height(); // we'll use it later to properly position tooltip

        if(width > this.options.width) {
            this.$body.css({'width': this.options.width});

            width = this.options.width;
            height = this.$body.height();
        }

        this.setTipPosition();

        this.$body.css({
            'width': 0,
            'height': 0,
            'opacity': 0
        });

        this.$el.css({
            'width': this.options.width,
            'visibility': 'visible'
        });

        visualHUD.Function.createBuffered(this.animate, 10, this, [width, height])();
    },

    animate: function(width, height) {
        this.$body.animate({
            'width': width + 2,
            'height': height + 2,
            'opacity': this.options.opacity
        }, {
            duration: 100,
            complete: visualHUD.Function.createDelayed(function(){
                this.$content.css('visibility', '');
            }, 20, this)
        });
    },

    hide: function(){
        if(!this.$activeElement) {
            return;
        }

        this.$content.css('visibility', 'hidden');

        this.$el.css({
            'visibility': 'hidden',
            'bottom': 'auto',
            'top': -1000,
            'left': -1000
        });

        this.$activeElement = null;

    },
    getElementPosition: function($element){
        var element = this.$activeElement.get(0);
        var position = this.$activeElement.offset()

        var obj = {
            'width': element.offsetWidth,
            'height': element.offsetHeight,
            'left': position.left,
            'top': position.top
        };
        obj.right = obj.left + obj.width;
        obj.bottom = obj.top + obj.height;
        return obj;
    },
    setTipPosition: function(){
        var position = this.getElementPosition();
        var _winHeight = $(document.body).innerHeight();
        var top = position.top - this.$el.height() - this.VERTICAL_OFFSET;
        var bottom = _winHeight - position.top + this.VERTICAL_OFFSET;

        if(top < 0) {
            bottom = 'auto';
            top = position.bottom + this.VERTICAL_OFFSET;
            this.$el.addClass('hint-carret-top').removeClass('hint-carret-bottom');
        }
        else {
            top = 'auto';
            this.$el.addClass('hint-carret-bottom').removeClass('hint-carret-top');
        }

        this.$el.css({
            top: top,
            left: 'auto',
            bottom:  bottom,
            left: position.left - this.options.width / 2 + position.width / 2
        });
    },
    disable: function(){
        window.clearTimeout(this.showTimer);
        this.hide();
        this.disabled = 1;
    },
    enable: function(){
        this.disabled = 0;
    }
});

