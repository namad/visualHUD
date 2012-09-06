visualHUD.Views.Window = Backbone.View.extend({
    tagName: 'div',
    className: 'xpk-window',

    opened: false,
    rendered: false,

    options: {
        width: 500,
        height: 'auto'
    },

    mixin: [
    ],

    htmlTpl: [
        '<div class="xpk-mwindow-wrap">',
            '<div class="xpk-mwindow-content">',
                '<div class="xpk-win-head clearfloat">',
                    '<div class="xpk-win-title"><%= title %></div>',
                    '<a href="#" class="xpk-close-button">&times;</a>',
                '</div>',
                '<div class="xpk-win-content clearfloat">',
                    '<%= html %>',
                '</div>',
            '</div>',
        '</div>'
    ],

    initialize: function() {
        var mixin = [this];

        _.each(this.mixin, function(className) {
            mixin.push(Backbone.resolveNamespace(className));
        });

        if(this.mixin.length) {
            _.extend.apply(_, mixin);
        }

        var html = _.template(this.htmlTpl.join(''), {
            title: this.options.title || 'Modal Window',
            html: this.html || this.options.html || ''
        });
        this.$el.append(html);

        this.getRefs();
        this.bindEvents();

        this.init();
        this.render();
    },

    /**
     * Abstract function that will be executed during construction
     */
    init: function() {
    },

    render: function() {
        this.$el.css({display: 'none'}).appendTo(document.body);
        this.rendered = true;
        this.fireEvent('render', this);
    },

    getRefs: function() {
        this.$contentWrapper = this.$el.find('div.xpk-mwindow-wrap');
        this.$contentCell = this.$el.find('.xpk-mwindow-wrap');
        this.$content = this.$el.find('div.xpk-win-content');
        this.$header = this.$el.find('div.xpk-win-head');
        this.$title = this.$el.find('.xpk-win-title');
        this.$closeButton = this.$el.find('.xpk-close-button');

        this.$closeButton.click($.proxy(this.hide, this));
        this.$el.click($.proxy(this.cancelEventBubbling, this));
    },

    bindEvents: function() {
        if(this.options.show){
            this.on('show', this.options.show, this);
        }
        if(this.options.hide){
            this.on('hide', this.options.hide, this);
        }
    },

    setTitle: function(txt){
        this.$title.html(txt);
    },

    update: function(html){
        this.$content.empty().append(html);
    },

    show: function() {
        var animateToWidth = this.options.width;
        var height = this.options.height;

        this.$el.css({
            visibility: 'hidden',
            top: 0,
            left: 0,
            display: 'block'
        });

        this.$contentWrapper.css({
            'width': animateToWidth,
            'height':height
        });

        var heightBounds = [10, this.$contentWrapper.height()];

        var topBounds = this.getTopPosition(heightBounds);

        var animateToHeight = this.$contentWrapper.outerHeight();

        this.$contentWrapper.addClass('xpk-win-show').css({'width': 10, 'height':10});

        var animateWindow = visualHUD.Function.bind(this.animateWindow, this, [animateToWidth,animateToHeight, topBounds]);

        if($.showModalOverlay) {
            $.showModalOverlay(200, 0.70, animateWindow);
        }
        else {
            animateWindow();
        }
    },

    hide: function(event) {
        this.$el.css({
            display: 'none'
        });

        $.hideModalOverlay();

        this.opened = false;

        $(window).unbind('resize.reposition');
        $(document).unbind('keyup.keyboardListiner');

        this.fireEvent('hide', [this]);

        if(event instanceof jQuery.Event) {
            event.preventDefault();
        }
    },

    getTopPosition: function(heightBounds) {
        var _top = [];

        var _winHeight = $(document.body).height();
        var _topOffset = $(window).scrollTop();

        _top[0] = Math.round(_winHeight / 2 - heightBounds[0] / 2);
        _top[0] +=  _topOffset;

        _top[1] = heightBounds[1] > _winHeight ? 25 : Math.round(_winHeight/2 - heightBounds[1]/2);
        _top[1] += _topOffset;

        if(_top[1] < 10){
            _top[1] = 10;
        }

        return _top;
    },

    animateWindow: function(aninameToWidth, animateToHeight, topBounds) {
        var me = this;
        var duration = 250;
        var easing = jQuery.easing['easeOutExpo'] ? 'easeOutExpo' : 'swing';
        var contentWrapper = this.$contentWrapper;
        var options = this.options;
        var element = this.$el;

        var reposition = visualHUD.Function.createBuffered(this.reposition, 200, this);
        var keyboardListener = visualHUD.Function.bind(this.keyboardListiner, this);


        this.$el.css({
            visibility: 'visible',
            height: 'auto',
            top: topBounds[0]
        });

        contentWrapper.animate({
            width: aninameToWidth,
            height: animateToHeight
        }, {
            easing: easing,
            duration: duration,
            complete: function(){
                contentWrapper.removeClass('xpk-win-show').css({
                    height: options.height
                });

                me.opened = true;
                me.fireEvent('show', [me]);

                $(window).bind('resize.windowReposition', reposition);
                $(document).bind('keyup.windowKeyboardListiner', keyboardListener);
            }
        });

        this.$el.animate({
            top: topBounds[1]
        },{
            easing: easing,
            duration: duration
        });
    },

    reposition: function() {
        if(this.$el.is(':visible')) {
            var _duration = 250;
            var _top = this.getTopPosition([0, this.$el.height()]);
            var _easing = jQuery.easing['easeOutExpo'] ? 'easeOutExpo' : 'swing';

            this.$el.animate({
                top: _top[1]
            },{
                easing: _easing,
                duration: _duration
            });
        }
    },

    keyboardListiner: function(event) {
        if(event.keyCode == 27){
            this.fireEvent('cancel', [this]);
        }
    },

    cancel: function() {
        this.fireEvent('cancel', [this]);
    },

    cancelEventBubbling: function(event) {
        event.stopPropagation();
    }
});

//dimScreen()
//by Brandon Goldman
(function($){
})(jQuery);

