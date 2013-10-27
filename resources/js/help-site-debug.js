/*!
 * 
 */
new Backbone.Application({
    name: 'app',
    nameSpace: 'visualHUD',

    scaleFactor: 1,
    ver: '2.0',

    MAX_BACKGROUND_SIZE: 1024 * 300,

    allocationMap: {
        model: 'Models',
        collection: 'Collections',
        controller: 'Controllers',
        view: 'Views',
        lib: 'Libs',
        utility: 'Utils',
        widgets: 'Widgets',
        routers: 'Routers'
    },

    collections: [
        'DictionaryAbstract'
    ],

    controllers: [
    ],

    messages: {
    },

    navigation: [
        {
            page: 'videos',
            text: 'Video Tutorials'
        },
        {
            page: 'faq',
            text: 'F.A.Q.'
        },
        {
            page: 'credits',
            text: 'Credits'
        }
    ],

    DEFAULT_PAGE: 'home',

    launch: function() {
        this.growl = new visualHUD.Widgets.Growl({
            offset: 7
        });

        this.setupViewport();
        this.setupRouter();
    },

    setupRouter: function() {
        this.router = new visualHUD.Routers.HelpRouter();

        this.router.on('update', this.viewport.setPage, this.viewport);
        this.router.on('navigate.section', this.viewport.setSection, this.viewport);

        this.router.on('update.error', function(xhr) {
            this.growl.alert({
                status: 'error',
                title: xhr.statusText,
                message: 'Something goes wrong ;('
            })
        }, this);

        Backbone.history.start();

        var startPage = Backbone.history.getHash();
        if(!startPage) {
            this.router.page(this.DEFAULT_PAGE);
        }
    },

    setupViewport: function() {
        this.viewport = new visualHUD.Views.HelpPageViewport({
            el: $('body')
        });
    }
});

visualHUD.Routers.HelpRouter = Backbone.Router.extend({

    routes: {
        ":page": "page",
        ":page/:section": "page"
    },

    xhr: null,
    location: null,
    activeLocation: null,

    cache: {
    },

    initialize: function(options) {
        _.extend(this, options || {});
    },

    page: function(page, section) {

        var section = section || null;

        if(this.xhr !== null) {
            this.xhr.abort();
            this.xhr = null;
        }

        var cachedContent = this.cache[page];

        if(cachedContent != undefined) {
            this.updateContent(cachedContent, page, section);
        }
        else {
            this.xhr = $.ajax({
                url: page + ".html",
                complete: visualHUD.Function.bind(this.onRequestComplete, this, [page, section], true)
            });
        }

        var path = Array.prototype.slice.call(arguments).join('/');
        this.navigate(path);
    },

    onRequestComplete: function(xhr, status, page, section) {
        var code = xhr.status,
            html = xhr.responseText;

        if(code == 200) {
            this.cache[page] = true;
            this.updateContent(html, page, section);
        }
        else {
            this.trigger('update.error', xhr);
        }
    },

    updateContent: function(html, page, section) {
        var location = page + section;

        if(this.activeLocation != location) {
            this.activeLocation = location;
            this.trigger('update', page, section, html);
        }
    }
});

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

visualHUD.Libs.utility = {
    getGuid: function() {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    },
    fontToBoxSize: function(size){
        return {
            width: Math.round(104 * size),
            height: Math.round(36 * size)
        }
    },
    hexToQLColor: function(_hex){
        var color = $.color(_hex);
        var qlColor = [];
        for(var a = 0, b = color.rgb.length; a < b; a++){
            qlColor[a] = color.rgb[a] / 255;
            qlColor[a] = Math.floor(qlColor[a] * 100);
            qlColor[a] = qlColor[a] / 100;
        };
        return qlColor.join(' ');
    },
    convertQLColor: function(_color){
        _color = _color.split(' ');
        var rgbColor = [];
        for(var a = 0, b = _color.length; a < b; a++){
            rgbColor[a] = Math.floor(_color[a] * 255);
        };
        var color = $.color(rgbColor);
        return color;
    },
    getBoxGradients: function(style, $color, opacity) {
        var style = parseInt(style, 10);

        if (style == 0){
            return ['none !important'];
        }

        var rgba = 'rgba(<%= color %>,<%= opacity %>)',
            rgb = $color.rgb.join(',')

        var gradientColors = [
                _.template(rgba, {color: rgb, opacity: opacity}),
                _.template(rgba, {color: rgb, opacity: 0})
            ],

            prefixes = [
                '-moz-linear-gradient',
                '-webkit-linear-gradient',
                'linear-gradient',
                '-ms-linear-gradient'
            ],

            directions = [],
            styles = [],

            styleTemplate = '<%= prefix %>(<%= direction %>,  <%= colorStart %> 0%, <%= colorEnd %> 100%)';

        switch (style) {
            case 1: // Top to bottom
                directions = ('top,top,to bottom,top').split(',');
                break;
            case 2: // Bottom to top
                directions = ('bottom,bottom,to top,bottom').split(',');
                break;
            case 3: // Left to right
                directions = ('left,left,to right,left').split(',');
                break;
            case 4: // Right to left
                directions = ('right,right,to left,right').split(',');
                break;
        }


        for(var a = 0, b = prefixes.length; a < b; a++) {
            styles.push(
                _.template(styleTemplate, {
                    prefix: prefixes[a],
                    direction: directions[a],
                    colorStart: gradientColors[0],
                    colorEnd: gradientColors[1]
                })
            )
        }

        if ($.browser.msie) {
                /*
                 MSIE
                 ----------------
                 GradientType=0 - vertical gradient / top to bottom
                 GradientType=1 - horisontal gradient / left to right
                 */

                var msieOpacity = Math.floor(opacity * 255).toString(16);
                var solidColor = $color.hex.replace('#', '#' + msieOpacity);
                var transparentColor = $color.hex.replace('#', '#00');

                switch (style) {
                    case '0': // Top to bottom
                        direction = 0;
                        gradientColors = [solidColor, solidColor];
                        break;
                    case '1': // Top to bottom
                        direction = 0;
                        gradientColors = [solidColor, transparentColor];
                        break;
                    case '2': // Bottom to top
                        direction = 0;
                        gradientColors = [transparentColor, solidColor];
                        break;
                    case '3': // Left to right
                        direction = 1;
                        gradientColors = [solidColor, transparentColor];
                        break;
                    case '4': // Right to left
                        direction = 1;
                        gradientColors = [transparentColor, solidColor];
                        break;
                }

                style = 'progid:DXImageTransform.Microsoft.Gradient(GradientType=' + direction + ', StartColorStr="' + gradientColors[0] + '", EndColorStr="' + gradientColors[1] + '")';
            }

        return styles;
    },
    getRCornersMarkup: function(attributes){
        var rectMatrix = {
            '3': [
                [0,		50, 	95],
                [50,	100,	100],
                [95,	100,	100]
            ],
            '5': [
                [0,		0,		25, 	70, 	90],
                [0,		48,		100,	100,	100],
                [25,	100,	100,	100,	100],
                [70,	100,	100,	100,	100],
                [90,	100,	100,	100,	100]
            ],
            '8' : [
                [0,		0,		0,		0,		15,		55,		80,		95],
                [0,		0,		0,		45,		95,		100,	100,	100],
                [0,		0,		70,		100,	100,	100,	100,	100],
                [0,		55,		100,	100,	100,	100,	100,	100],
                [15,	95,		100,	100,	100,	100,	100,	100],
                [55,	100,	100,	100,	100,	100,	100,	100],
                [80,	100,	100,	100,	100,	100,	100,	100],
                [95,	100,	100,	100,	100,	100,	100,	100]
            ]
        };

        var borderRadius = parseInt(attributes.borderRadius, 10);
        var baseOpacity = parseInt(attributes.opacity, 10);

        var offsets = {
            topLeft: [0,0],
            topRight: [0, attributes.coordinates.width - borderRadius],
            bottomLeft: [ attributes.coordinates.height - borderRadius, 0],
            bottomRight: [ attributes.coordinates.height - borderRadius,  attributes.coordinates.width - borderRadius]
        };

        var matrix = rectMatrix[borderRadius];

        var directionsMap = {
            'topLeft': { vertical: 1, horizontal: 1 },
            'topRight': { vertical: 1, horizontal: 0 },
            'bottomLeft': { vertical: 0, horizontal: 1 },
            'bottomRight': { vertical: 0, horizontal: 0 }
        };

        var buildCorner = function(data){
            /*
             data = {
             matrix: [],
             direction: {},
             offset: []
             };

             direction = {
             vertical: 1 // 1 - from top to bottom, 0 - from bottom to top
             horizontal: 1 // 1 - from left to right, 0 - from right to left
             };

             */

            var direction = data.direction;
            var offset = data.offset;

            var row_matrix = [];
            var top, left, opacity;

            var matrix = data.matrix;
            var row_index, sub_row_index;

            var row_size = matrix.length;

            for(var x in matrix){
                x = parseInt(x);

                row_index = direction.vertical ? x : row_size - 1 - x
                var row = matrix[row_index];

                if(!row) continue;

                top =  offset[0] + x;

                var sub_row_size = row.length;

                for(var y in row){
                    y = parseInt(y);

                    sub_row_index = direction.horizontal ? y : sub_row_size - 1 - y

                    var value = row[sub_row_index]

                    if(!value) continue;

                    left = offset[1] + y;

                    var prevOpacity = row[direction.horizontal ? sub_row_index - 1 : sub_row_index + 1];

                    if(prevOpacity && prevOpacity == 100) {
                        row_matrix[row_matrix.length-1].width++;
                    } else {
                        row_matrix.push({
                            top: top,
                            left: left,
                            width: 1,
                            height: 1,
                            opacity: (baseOpacity / 100) * value
                        });
                    }

                };
            }
            return row_matrix;
        };

        var corners = [];
        for(var k in offsets){
            $.merge(corners, buildCorner({
                matrix: rectMatrix[borderRadius],
                offset: offsets[k],
                direction: directionsMap[k]
            }));
        }

        var offsetMap = [borderRadius, 0, attributes.coordinates.width - borderRadius];

        for(var a = 0, b = 3; a < b; a++){
            corners.push({
                top: a == 0 ? 0 : borderRadius,
                left: offsetMap[a],
                width: a == 0 ? attributes.coordinates.width - 2 * borderRadius : borderRadius,
                height: attributes.coordinates.height - (a == 0 ? 0 : 2 * borderRadius),
                opacity: baseOpacity
            });
        }
        return corners;
    }
};

visualHUD.Function = {
    bind: function(fn, scope, args, appendArgs) {
        if (arguments.length === 2) {
            return function() {
                return fn.apply(scope, arguments);
            }
        }

        var method = fn,
            slice = Array.prototype.slice;

        return function() {
            var callArgs = args || arguments;

            if (appendArgs === true) {
                callArgs = slice.call(arguments, 0);
                callArgs = callArgs.concat(args);
            }

            return method.apply(scope || window, callArgs);
        };
    },

    createDelayed: function(fn, delay, scope, args, appendArgs) {
        if (scope || args) {
            fn = visualHUD.Function.bind(fn, scope, args, appendArgs);
        }
        return function() {
            var me = this;
            return setTimeout(function() {
                fn.apply(me, arguments);
            }, delay);
        };
    },
    createBuffered: function(fn, buffer, scope, args) {
        return function(){
            var timerId;
            return function() {
                var me = this,
                    a = args || arguments,
                    s = scope || this;

                if (timerId) {
                    clearTimeout(timerId);
                    timerId = null;
                }
                timerId = setTimeout(function(){
                    fn.apply(s, a);
                }, buffer);
            };
        }();
    },

    createThrottled: function(fn, interval, scope) {
        var lastCallTime, elapsed, lastArgs, timer,
            execute = function() {
                fn.apply(scope || this, lastArgs);
                lastCallTime = new Date().getTime();
            };

        return function() {
            elapsed = new Date().getTime() - lastCallTime;
            lastArgs = arguments;

            clearTimeout(timer);
            if (!lastCallTime || (elapsed >= interval)) {
                execute();
            } else {
                timer = setTimeout(execute, interval - elapsed);
            }
        };
    }
};

visualHUD.Views.HelpPageViewport = Backbone.View.extend({


    events: {
        'click #navigation a': 'resetScroll'
    },

    initialize: function(options) {
        $(window).on('scroll', visualHUD.Function.bind(this.scrollSpy, this));
    },

    getDOMRefs: function() {
        var refs = this.refs;

        if(!refs) {
            refs = this.refs = {
                header: $('div.site-header')
            }
        }

        return refs;
    },

    render: function(viewport) {
    },

    scrollSpy: function() {
        var scrollTop = $(window).scrollTop(),
            fix = scrollTop >= 10;

        if(fix == true && !this.fixed) {
            this.fixed = true;
            this.getDOMRefs().header.addClass('site-header-fixed');
        }

        if(fix == false && this.fixed) {
            this.fixed = false;
            this.getDOMRefs().header.removeClass('site-header-fixed');
        }
    },

    setPage: function(page, section, html) {
        var content = $('#content'),
            currentPageSelector = 'div.content-' + page,
            allPages = content.children().not(currentPageSelector),
            currentPage = content.find(currentPageSelector);

        allPages.hide();

        if(currentPage.length) {
            currentPage.show();
        }
        else {
            currentPage = $('<div/>').addClass('content-' + page).appendTo(content);
            currentPage.html(html);
        }

        if(section != null) {
            $.scrollTo('[name=' + section + ']', {
                offset: {
                    top: -1 * (this.getDOMRefs().header.height() + parseInt(this.getDOMRefs().header.css('top')))
                }
            });
        }

        $('#navigation').find('li.active').removeClass('active');
        $('#navigation').find('li.page-' + page).addClass('active');
    },

    resetScroll: function() {
        $.scrollTo('0px');
    }
});



visualHUD.Collections.DictionaryAbstract = Backbone.Collection.extend({
    autoLoad: true,

    getData: function() {
        return [];
    },

    load: function() {
        this.reset(this.getData(), {silent: true});
        return this;
    }
});

