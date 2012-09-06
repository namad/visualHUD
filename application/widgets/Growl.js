visualHUD.Widgets.Growl = Backbone.View.extend({
    tagName: 'div',
    className: 'growl-message-container',

    msgTpl: [
        '<div class="growl-message-wrapper clearfloat">',
            '<div class="growl-message">',
                '<a class="close-message">&times;</a>',
                '<div class="message">',
                    '<% if(title) { %>',
                        '<h4><%= title %></h4>',
                    '<% } %>',
                    '<div><%= message %></div>',
                '</div>',
            '</div>',
        '</div>'
    ],

    active: 0,
    stack: [],
    messageLog: [],
    messagesCounter: 0,

    defaults: {
        speed: 300,
        delay: 50000,
        offset: 10,
        status: 'working',
        fixed: false,
        single: false,
        maxMessages: 8,
        className: 'growl-message-container',
        position: 'bottom-right'
    },

    defaultMessageOptions: {
        title: null,
        message: 'This is growl message',
        status: null
    },

    currentPosition: null,

    events: {
        'click a.close-message': 'hideMessage',
        'contextmenu div.growl-message-wrapper': 'hideMessage'
    },

    disabled: false,
    visible: false,
    rendered: false,

    initialize: function(options) {

        this.options = _.extend({}, this.defaults, options || {});

        this.$el.css({margin: this.options.offset}).addClass(this.options.position);

        this.bindEvents();

    },

    render: function() {
        this.$el.appendTo(document.body);
        this.rendered = true;
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
    },

    alert: function(options) {

        if(this.rendered == false) {
            this.render();
        }

        if (this.options.single) {
            this.$el.children().remove();
        }

        this.$el.show();

        var options = _.extend({}, this.defaultMessageOptions, options);
        var messageElement = _.template(this.msgTpl.join(''), options);
        var $messageElement = $(messageElement).addClass(options.status || this.options.status).css('display','none');
        var positionVertical = this.options.position.split('-').shift();

        var appendFn = positionVertical == 'bottom' ? 'prependTo' : 'appendTo';
        var hideFn = visualHUD.Function.createDelayed(this.hide, options.delay || this.options.delay, this, [$messageElement]);

        this.$messages = this.$el.children();

        if(this.$messages.length > this.options.maxMessages){
            this.hide(this.$messages.eq(0));
        }

        $messageElement[appendFn](this.$el).fadeTo(this.options.speed, 1);
        hideFn();

        this.trigger('show', [this]);

        return $messageElement;
    },

    hide: function($element) {
        var me = this;

        if($element) {
            $element.find('.growl-message').hide(this.options.speed/2, function() {
                $element.remove();
                if(me.$el.children().length == 0) {
                    me.$el.hide();
                }
            });
        }
        else {
            $messages.remove();
            this.$el.hide();
        }

        this.trigger('hide', [this]);

        return this;
    },

    hideMessage: function(event) {
        var target = $(event.currentTarget);
        var message = target.closest('.growl-message-wrapper', this.$el);
        if(message.length) {
            this.hide(message);
        }
        return false;
    }
});

