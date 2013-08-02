visualHUD.Views.WindowBase = Backbone.View.extend({
    tagName: 'div',
    className: 'xpk-window',

    opened: false,
    rendered: false,

    defaults: {
        width: 500,
        height: 'auto'
    },

    mixin: [
    ],

    htmlTpl: [
        '<div class="xpk-mwindow-wrap">',
            '<div class="xpk-mwindow-content">',
                '<div class="xpk-win-head clearfloat">',
                    '<h3><%= title %></h3>',
                    '<a href="#" class="xpk-close-button">&times;</a>',
                '</div>',
                '<div class="xpk-win-content clearfloat">',
                    '<%= html %>',
                '</div>',
            '</div>',
        '</div>'
    ],

    initialize: function(options) {
        var mixin = [this];

        this.options = _.extend({}, this.defaults, options);

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
        this.trigger('render', this);
    },

    getRefs: function() {
        this.$contentWrapper = this.$el.find('div.xpk-mwindow-wrap');
        this.$content = this.$el.find('div.xpk-win-content');
        this.$title = this.$el.find('.xpk-win-head h3');
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
        if(this.options.cancel){
            this.on('hide', this.options.cancel, this);
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



        this.$contentWrapper.css({
            'width': animateToWidth
        });

        this.$el.css({
            visibility: 'hidden',
            display: 'block'
        });


        // var heightBounds = [10, this.$el.height()];

        // var topBounds = this.getTopPosition(heightBounds);

        var contentWrapperHeight = this.$contentWrapper.height();
        this.$contentWrapper.addClass('xpk-win-show');

        this.$el.css({
            marginTop: -1 * contentWrapperHeight / 2 + 'px',
            visibility: 'visible'
        });



        var animateWindow = visualHUD.Function.createDelayed(this.animateWindow, 10, this);

        animateWindow();
        $.showModalOverlay(200, 0.70);

        /*if(($.__overlay && $.__overlay.visible !== true) || (!$.__overlay) ) {
            $.showModalOverlay(200, 0.70, animateWindow);
        }
        else {
            animateWindow();
        }*/


        return this;
    },

    hide: function(event) {
        this.$el.css({
            display: 'none'
        });

        $.hideModalOverlay();

        this.opened = false;

        $(window).unbind('resize.reposition');
        $(document).unbind('keyup.keyboardListiner');

        this.trigger('hide', [this]);

        if(event instanceof jQuery.Event) {
            event.preventDefault();
        }

        return this;
    },

    getTopPosition: function(heightBounds) {
        var _top = [];

        var _winHeight = $(document.body).height();
        var _topOffset = $(window).scrollTop();

        _top[0] = Math.round(_winHeight / 2 - heightBounds[0] / 2);
        _top[0] +=  _topOffset;

        _top[1] = Math.round(_winHeight/2 - heightBounds[1]/2);
        _top[1] += _topOffset;

        if(_top[1] < 0){
            _top[1] = 0;
        }

        return _top;
    },

    animateWindow: function(aninameToWidth, animateToHeight, topBounds) {


        this.$contentWrapper.removeClass('xpk-win-show');

        this.opened = true;
        this.trigger('show', [this]);

        var reposition = visualHUD.Function.createBuffered(this.reposition, 200, this);
        var keyboardListener = visualHUD.Function.bind(this.keyboardListiner, this);

        $(window).bind('resize.windowReposition', reposition);
        $(document).bind('keyup.windowKeyboardListiner', keyboardListener);


        return;

        var me = this;
        var duration = 250;
        var easing = jQuery.easing['easeOutExpo'] ? 'easeOutExpo' : 'swing';
        var contentWrapper = this.$contentWrapper;
        var options = this.options;

        var reposition = visualHUD.Function.createBuffered(this.reposition, 200, this);
        var keyboardListener = visualHUD.Function.bind(this.keyboardListiner, this);


        this.$el.css({
            overflow: 'hidden',
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
                me.trigger('show', [me]);

                $(window).bind('resize.windowReposition', reposition);
                $(document).bind('keyup.windowKeyboardListiner', keyboardListener);

                reposition();
            }
        });

        this.$el.animate({
            top: topBounds[1]
        },{
            easing: easing,
            duration: duration
        });

        return this;
    },

    reposition: function() {
        return;

        if(this.$el.is(':visible')) {
            var _limit = $(document.body).height();
            var _height = this.$el.height();
            var _top = this.getTopPosition([0, _height]);

            _height = _height > _limit ? _limit : 'auto';

            this.$el.css({
                overflow: 'auto',
                height: _height,
                top: _top[1]
            });
        }
    },

    keyboardListiner: function(event) {
        if(event.keyCode == 27){
            this.trigger('cancel', [this]);
        }
    },

    cancel: function() {
        this.trigger('cancel', [this]);
    },

    cancelEventBubbling: function(event) {
        event.stopPropagation();
    },

    serializeForm: function() {
        return this.$content.serializeForm();
    }
});

//dimScreen()
//by Brandon Goldman
(function($){
})(jQuery);

