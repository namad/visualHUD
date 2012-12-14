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
        viewportViews: 'Views.viewport',
        modalViews: 'Views.windows',
        lib: 'Libs',
        utility: 'Utils',
        widgets: 'Widgets'
    },

    controllers: [
        'Viewport',
        'HUDManager',
        'KeyboardManager',
        'FocusManager',
        'HistoryManager'
    ],

    ACTION_CONTACT: 'contact.php',
    ACTION_DOWNLOAD_PRESETS: 'download_presets.php',
    ACTION_DOWNLOAD_HUD: 'download.php',

    messages: {
        scriptError: 'There was an error on this page.',
        errorReportSuccess: 'Thanks, mate. Your report has been sent',
        noHUDItems: 'There are no HUD items yet. C\'mon, add some elements first and try again',
        invalidHUDPreset: 'Invalid HUD preset. Aborting...',
        reportErrorTitle: 'Report an application error/bug',
        editRangesTitle: 'Edit {0} color ranges',
        invalidPresetData: 'Application was unable to parse custom HUD data',
        slowPerformanceProperty: 'Depending on your hardware configuration, using {0} may impact your in-game performance and significally lower your FPS.',
        EMPTY_HUD_WARNING: 'Nothing to download, mate. Try to add new items or import custom HUD first.',
        HUD_ELEMENTS_PARSE_ERROR: 'visualHUD was unable to parse <%= count %> HUD element<%= count==1 ? \'\' : \'s\' %> because the data is incorrect or currupted',
        HUD_PARSE_ERROR: 'visualHUD was unable to parse custom HUD because the data is incorrect or corrupted',
        LARGE_IMAGE_WARNING: 'Image you are trying to import, are too large (<%= imageSize %>). Please, try another image that is less than <%= maxSize %>',
        UNSUPPORTED_IMAGE_FORMAT: 'Image type you are trying to import is not supported (<%= imageType %>). Try to import images in PNG, JPG or GIF format',
        CONFIRM_APPLICATION_RESET: 'Are you sure to reset visualHUD?\nAll settings and stored data will be cleared!',
        CONFIRM_HUD_OVERWRITE: 'Are you sure to overwrite current HUD? All changes will be lost!',
        AJAX_ERROR: '<%= url %> request returned error:<br /><strong><%= error %></strong>'
    },

    initialize: function() {
    },

    launch: function() {
        var host = window.location.hostname,
            queryString = window.location.search;

        if (queryString.match('(\\?|&)large') !== null) {
            this.scaleFactor = 2;
        }

        $('body').addClass('scale-factor-' + this.scaleFactor);

        this.toolTips = new visualHUD.Widgets.ToolTip({
            delay: 500
        });

        this.growl = new visualHUD.Widgets.Growl({
            offset: 7
        });

        $('#preloader').fadeOut(400, function() {
            $(this).remove();
        });
        
        window.onerror = visualHUD.Function.createBuffered(this.applicationErrorHandler, 50, this);

        $(document).ajaxError(visualHUD.Function.bind(function(event, jqXHR, ajaxSettings, thrownError) {
            this.ajaxErrorAlert = this.growl.alert({
                status: 'error',
                title:  'Oops.. Something goes wrong ;(',
                message: _.template(this.messages.AJAX_ERROR, {
                    url: ajaxSettings.url,
                    error: jqXHR.status + ' ' + thrownError
                })
            });
        }, this));
    },
    
    applicationErrorHandler: function(errorMsg, url, lineNumber) {
        var browserVersion = $.browser.version;
        var browserInfo = ['\n-----------------------\n'];

        for(var k in $.browser){
            if(k != 'version') browserInfo.push(k);
        };

        browserInfo = browserInfo.join('/') + ' ver.' + browserVersion + "\n";


        $.ajax({
            type: 'post',
            url: visualHUD.ACTION_CONTACT,
            data: [
                {
                    name: 'name',
                    value: 'VisualHUD Automated Reported'
                },
                {
                    name: 'email',
                    value: 'vhud@pk69.com'
                },
                {
                    name: 'message',
                    value: _.template('Error: <%= errorMsg %>\nURL: <%= url %>\nLine: <%= lineNumber %><%= browserInfo %>', {
                        errorMsg: errorMsg,
                        url: url,
                        lineNumber: lineNumber,
                        browserInfo: browserInfo
                    })
                }
            ],
            success: visualHUD.Function.bind(function(){
                if(this.growl == undefined) {
                    return true;
                }

                var messageTemplate = ([
                    '<p><%= errorMsg %><br />',
                    '<%= url %> (line: <%= lineNumber %>)</p>',
                    'But no worries, mate, this problem has been already reported.'
                ]).join('');

                $alert = this.growl.alert({
                    status: 'error',
                    title: 'Oops.. Something goes wrong ;(',
                    message: _.template(messageTemplate, {
                        errorMsg: errorMsg,
                        url: url,
                        lineNumber: lineNumber
                    })
                });
            }, visualHUD)
        });
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

/**
 * Item Builder is used to update HUDItem visuals when model properties are changed
 * Use by visualHUD.Views.HUDItem instances
 * @type {Object}
 */
visualHUD.Libs.itemBuilderMixin = {
    getByType: function(type) {
        return this[type];
    },

    getByName: function(name) {
        return this[name];
    },

    'general': {
        getRgba: _.template('rgba(<%= color %>,<%= opacity%>)'),

        updateTextSize: function(value) {
            var size = parseInt(value, 10) * visualHUD.scaleFactor,
                textboxSize = visualHUD.Libs.utility.fontToBoxSize(size/100);

            this.getDOMRefs().textBlock.width(textboxSize.width).height(textboxSize.height).css('line-height', textboxSize.height + 'px');

            this.getDOMRefs().counter.css({
                'font-size': size + '%'
            });
        },

        updateTextStyle: function(value) {
            var originalClassName = this.getDOMRefs().counter.attr('class'),
                patt = /textstyle-[0-9]/;

            if(patt.test(originalClassName)) {
                originalClassName = originalClassName.replace(patt, '');
                originalClassName = $.trim(originalClassName);
            }
            originalClassName += (' textstyle-' + value);

            this.getDOMRefs().counter.attr('class', originalClassName);
        },

        updateTextOpacity: function(value) {
            var opacity = parseInt(value, 10);
            this.getDOMRefs().textBlock.css('opacity', opacity / 100);
        },

        updateIconSpacing: function(value) {
            var spacing = parseInt(value, 10) * visualHUD.scaleFactor,
                position = this.model.get('iconPosition');

            this.updateIconPositionAndSpacing(position, spacing);
        },

        updateIconPosition: function(value) {
            var spacing = parseInt(this.model.get('iconSpacing'), 10) * visualHUD.scaleFactor,
                position = value;

            this.updateIconPositionAndSpacing(position, spacing);
        },

        updateIconPositionAndSpacing: function(position, spacing) {
            var iconMarginsMap = {
                    'left': 'margin-right',
                    'top': 'margin-bottom',
                    'right': 'margin-left',
                    'bottom': 'margin-top'
                },
                blocks = [this.getDOMRefs().textBlock, this.getDOMRefs().iconBlock];

            this.getDOMRefs().iconBlock.css('margin', 'auto').css(iconMarginsMap[position], spacing + 'px');

            if(position.match(/left|top/gi)){
                blocks = [this.getDOMRefs().iconBlock, this.getDOMRefs().textBlock];
            }

            var iconPositionFn = position == 'left' || position == 'right' ? 'removeClass' : 'addClass';
            this.$el[iconPositionFn]('icon-top');

            for(var a = 0, b = blocks.length; a < b; a++){
                blocks[a].appendTo(this.$el);
            }
        },

        updateIconOpacity: function(value) {
            var opacity = parseInt(value, 10);
            this.getDOMRefs().iconBlock.css('opacity', opacity / 100);
        },

        updateIconSize: function(value) {
            var size = parseInt(value, 10) * visualHUD.scaleFactor;

            this.getDOMRefs().icon.css({

            });

            this.getDOMRefs().iconBlock.css({
                'width': size + 'px',
                'height': size + 'px',
                'display': size == 0 ? 'none' : ''
            });
        },

        updateIconStyle: function(value) {
            var style = parseInt(value, 10),
                iconOptions = this.getIconOptions()
            iconData = iconOptions[style];

            this.getDOMRefs().icon.attr('src', iconData.url);
        },

        updateTextColorByStatus: function(value, ranges) {
            var textValue = parseInt(value, 10),
                color = this.model.get('textColor');

            _.each(ranges, function(range) {
                if(textValue >= range.range[0] && textValue <= range.range[1]){
                    color = range.color;
                    return {};
                }
            }, this);

            this.getDOMRefs(). counter.css({
                'color': '#' + color
            });
        },

        updateTextColor: function(value) {
            this.getDOMRefs(). counter.css({
                'color': '#' + value
            });
        },

        updateText: function(value) {
            this.getDOMRefs().counter.text(value);

            var ranges = this.model.get('colorRanges');
            if(ranges != null) {
                this.updateTextColorByStatus(value, ranges)
            }
        },

        updateColorRanges: function(value) {
            var text = this.model.get('text');
            this.updateTextColorByStatus(text, value)
        }

    },

    'timer': {
        updateTextSize: function(value) {
            visualHUD.Libs.itemBuilderMixin.getByType('general').updateTextSize.call(this, value);
            this.getDOMRefs().textBlock.width('auto');
        }
    },

    'medal': {
        updateIconStyle: function(value) {
            visualHUD.Libs.itemBuilderMixin.getByType('general').updateIconStyle.apply(this, arguments);
            var iconStyle = parseInt(this.model.get('iconStyle'), 10);
            var text = this.model.get('text');
            this.updateText(text);
        },

        updateText: function(value) {
            var iconStyle = parseInt(this.model.get('iconStyle'), 10);
            if(iconStyle == 0 && value.match(/\%$/) == null) {
                value += '%'
            }
            if(iconStyle > 0) {
                value = value.replace('%', '');
            }

            this.getDOMRefs().counter.text(value);
        },
        updateTextSize: function(value) {
            visualHUD.Libs.itemBuilderMixin.getByType('timer').updateTextSize.apply(this, arguments);
        }
    },

    'powerupIndicator': {
        updateTextSize: function(value) {
            visualHUD.Libs.itemBuilderMixin.getByType('timer').updateTextSize.apply(this, arguments);
        },

        updateIconSpacing: function(value) {
            var margin = parseInt(value, 10);
            var lastChild = this.$el.find('div.powerup-item:last').eq(0);
            lastChild.css('margin', 'auto');

            if(!this.model.get('singlePowerup')){
                lastChild.css('margin-' + this.model.get('iconPosition'), margin * visualHUD.scaleFactor);
            }
        },

        updateIconPosition: function(value) {

            var originalClassName = this.$el.attr('class').toLowerCase(),
                patt = /stack-[a-z]/,
                iconSize = parseInt(this.model.get('iconSize'), 10),
                iconSpacing = parseInt(this.model.get('iconSpacing'), 10),
                textboxSize = visualHUD.Libs.utility.fontToBoxSize(iconSize/100);

            if(patt.test(originalClassName)) {
                originalClassName = originalClassName.replace(patt, '');
                originalClassName = $.trim(originalClassName);
            }
            originalClassName += (' stack-' + value);
            this.$el.attr('class', originalClassName);

            this.updateIconSpacing(iconSpacing);
        },

        updateSinglePowerup: function(value) {
            var miltiItemsCSS = value ? 'addClass' : 'removeClass';
            this.$el[miltiItemsCSS]('single-powerup');
        }
    },

    'accuracyIndicator': {
        updateTextSize: function(value) {
            visualHUD.Libs.itemBuilderMixin.getByType('general').updateTextSize.call(this, value);

            var size = parseInt(value, 10) / 100;
            var width = Math.round(128 * size)  * visualHUD.scaleFactor;

            this.getDOMRefs().textBlock.width(width);
        },
        updateText: function(value) {
            this.getDOMRefs().counter.text(value + '%');
        }
    },

    'skillIndicator': {
        updateTextSize: function(value) {
            var size = parseInt(value, 10) * visualHUD.scaleFactor;

            var textboxSize = visualHUD.Libs.utility.fontToBoxSize(size/100);

            this.getDOMRefs().textBlock.height(textboxSize.height).css('line-height', textboxSize.height + 'px');
            this.$el.height(textboxSize.height).css('line-height', textboxSize.height + 'px');

            var textCss = {
                'line-height': textboxSize.height + 'px',
                'font-size':  size + '%'
            };
            this.getDOMRefs().counter.css(textCss);
            this.getDOMRefs().templateText.css(textCss);
        },

        updateTextStyle: function(value) {
            var originalClassName = this.getDOMRefs().counter.attr('class');
            var patt = /textstyle-[0-9]/;

            if(patt.test(originalClassName)) {
                originalClassName = originalClassName.replace(patt, '');
                originalClassName = $.trim(originalClassName);
            }
            originalClassName += (' textstyle-' + value);

            this.getDOMRefs().counter.attr('class', originalClassName);
        },

        updateTemplate: function(value) {
            this.getDOMRefs().templateText.html(value + (value.length ? ':&nbsp;' : ''));
        },

        updateTextColor: function(value) {
            this.getDOMRefs(). templateText.css({
                'color': '#' + value
            });
        }
    },

    'chatArea': {
        updatePadding: function(value) {
            var padding = parseInt(value, 10) * visualHUD.scaleFactor;
            this.getDOMRefs().chatList.css({padding: padding});
        },

        updateShowChat: function(value) {
            var toggleClass = (value ? 'add' : 'remove') + 'Class';
            this.$el[toggleClass]('chat-visible');

            toggleClass = (value ? 'remove' : 'add') + 'Class';
            this.$el[toggleClass]('chat-invisible');
        },

        updateWidth: function(value) {
            var width = parseInt(value, 10),
                height = this.model.get('height'),
                padding = this.model.get('padding');

            this.updateDimensions(width, height, padding);

        },

        updateHeight: function(value) {
            var height = parseInt(value, 10),
                width = this.model.get('width'),
                padding = this.model.get('padding');

            this.updateDimensions(width, height, padding);
        },

        updatePadding: function(value) {
            var padding = parseInt(value, 10),
                width = this.model.get('width'),
                height = this.model.get('height');
            this.updateDimensions(width, height, padding);
        },

        updateDimensions: function(width, height, padding) {
            width *=  visualHUD.scaleFactor;
            height *=  visualHUD.scaleFactor;
            padding *= visualHUD.scaleFactor;

            var minHeight = 2 * padding + this.model.get('minHeight') * visualHUD.scaleFactor;
            var minWidth = 2 * padding + this.model.get('minWidth') * visualHUD.scaleFactor;

            var w = Math.max(minWidth, width);
            var h = Math.max(minHeight, height);


            w = this.model.get('maxWidth') ? Math.min(this.model.get('maxWidth') * visualHUD.scaleFactor, w) : w;
            this.$el.width(w);

            h = this.model.get('maxHeight') ? Math.min(this.model.get('maxHeight') * visualHUD.scaleFactor, h) : h;
            this.$el.height(h);

            this.getDOMRefs().chatList.css('margin', padding);
        }
    },

    'scoreBox': {
        updateIconStyle: function(value) {
            var originalClassName = this.$el.attr('class');
            var newClassName = originalClassName;
            var patt = /style-[0-9]/;

            if(patt.test(originalClassName)) {
                newClassName = originalClassName.replace(patt, '');
                newClassName = $.trim(newClassName);
            }
            newClassName += (' style-' + value);

            this.$el.attr('class', newClassName);
        },

        updateIconSpacing: function(value) {
            var spacing = parseInt(value, 10) * visualHUD.scaleFactor,
                layout = this.model.get('scoreboxLayout');

            this.updateLayoutAndSpacing(layout, spacing);
        },

        updateScoreboxLayout: function(value) {
            var spacing = parseInt(this.model.get('iconSpacing'), 10) * visualHUD.scaleFactor,
                layout = value;

            this.updateLayoutAndSpacing(layout, spacing);
        },

        updateLayoutAndSpacing: function(layout, spacing) {
            var marginsMap = {
                'vertical': 'margin-top',
                'horizontal': 'margin-left'
            };

            var layoutMap = {
                'vertical': 'scorebox-vertical',
                'horizontal': 'scorebox-horizontal'
            };

            for(var x in layoutMap){
                var fn = x == layout ? 'addClass' : 'removeClass';
                this.$el[fn](layoutMap[x]);
            }

            var boxElement = this.getDOMRefs().iconBlock.eq(1);
            boxElement.css('margin', 0).css(marginsMap[layout], spacing + 'px');
        },

        updateScoreboxMode: function(value) {
            var modeMap = {
                'ffa': 'ffa-score',
                'tdm': 'team-score'
            };

            for(var m in modeMap){
                var fn = m == value ? 'addClass' : 'removeClass';
                this.$el[fn](modeMap[m]);
            }
        }
    },

    'bar': {
        updateBarDirection: function(value) {
            var direction = parseInt(value, 10);
            var directionMap = ['ltr-bar', 'rtl-bar']

            _.each(function(val, idx) {
                var fn = idx == direction ? 'addClass' : 'removeClass';
                this.$el[fn](directionMap[idx]);
            }, this);
        },

        updateWidth: function(value) {
            var width = parseInt(value, 10),
                height = this.model.get('height'),
                padding = this.model.get('padding');

            this.updateBarDimensions(width, height, padding);

        },

        updateHeight: function(value) {
            var height = parseInt(value, 10),
                width = this.model.get('width'),
                padding = this.model.get('padding');

            this.updateBarDimensions(width, height, padding);
        },

        updatePadding: function(value) {
            var padding = parseInt(value, 10),
                width = this.model.get('width'),
                height = this.model.get('height');
            this.updateBarDimensions(width, height, padding);
        },

        updateBarDimensions: function(width, height, padding) {
            width *=  visualHUD.scaleFactor;
            height *=  visualHUD.scaleFactor;
            padding *= visualHUD.scaleFactor;

            var minHeight = 2 * padding + this.model.get('minHeight') * visualHUD.scaleFactor;
            var minWidth = 2 * padding + this.model.get('minWidth') * visualHUD.scaleFactor;

            var w = Math.max(minWidth, width);
            var h = Math.max(minHeight, height);


            w = this.model.get('maxWidth') ? Math.min(this.model.get('maxWidth') * visualHUD.scaleFactor, w) : w;
            this.$el.width(w);

            h = this.model.get('maxHeight') ? Math.min(this.model.get('maxHeight') * visualHUD.scaleFactor, h) : h;
            this.$el.height(h);

            this.getDOMRefs().box.css('padding', padding);
        },

        updateText: function(value) {
            var barValue = parseInt(value, 10);

            var barsSize = {
                h100: barValue > 100 ? 100 : barValue,
                h200: barValue > 100 ? barValue - 100 : 0
            };

            for(var k in barsSize){
                this.getDOMRefs()[k].css('width', barsSize[k] + '%');
            }

            var ranges = this.model.get('colorRanges');
            if(ranges != null) {
                this.updateTextColorByStatus(barValue, ranges)
            }
        },

        updateColorRanges: function(value) {
            var text = parseInt(this.model.get('text'), 10);
            this.updateTextColorByStatus(text, value)
        },

        updateTextColorByStatus: function(barValue, ranges) {
            var opacity = parseInt(this.model.get('barsOpacity'), 10),
                color = null;

            if(barValue <= 100){
                _.each(ranges, function(range) {
                    if(barValue >= range.range[0] && barValue <= range.range[1]){
                        color = $.color('#' + range.color);
                        return {};
                    }
                }, this);

                this.paintBarElement(this.getDOMRefs().h100, color, opacity);

            }
            else if(barValue > 100){
                color = $.color('#' + ranges[1].color);
                this.paintBarElement(this.getDOMRefs().h100, color, opacity);

                color = $.color('#' + ranges[2].color);
                this.paintBarElement(this.getDOMRefs().h200, color, opacity);

            }
        },

        updateBarsOpacity: function(value) {
            var ranges = this.model.get('colorRanges');
            var barValue = parseInt(this.model.get('text'), 10);
            if(ranges != null) {
                this.updateTextColorByStatus(barValue, ranges)
            }
        },

        paintBarElement: function($bar, color, opacity){
            $bar.css('background', this.getRgba({ color: color.rgb.join(','), opacity: opacity/100 }));
        },

        updateColor: function(value) {
            var color = $.color('#' + value);
            var opacity = parseInt(this.model.get('opacity'), 10);

            this.paintBarElement(this.getDOMRefs().box, color, opacity);
        },

        updateOpacity: function(value) {
            var opacity = parseInt(value, 10)
            var color = $.color('#' + this.model.get('color'));

            this.paintBarElement(this.getDOMRefs().box, color, opacity);
        }

    },

    'rect': {

        updateWidth: function(value) {
            var width = parseInt(value, 10),
                height = this.model.get('height');
            this.updateDimensions(width, height);
        },

        updateHeight: function(value) {
            var height = parseInt(value, 10),
                width = this.model.get('width');
            this.updateDimensions(width, height);
        },

        updateDimensions: function(width, height) {
            width *=  visualHUD.scaleFactor;
            height *=  visualHUD.scaleFactor;

            var minHeight = this.model.get('minHeight') * visualHUD.scaleFactor;
            var minWidth = this.model.get('minWidth') * visualHUD.scaleFactor;

            var w = Math.max(minWidth, width);
            var h = Math.max(minHeight, height);

            w = this.model.get('maxWidth') ? Math.min(this.model.get('maxWidth') * visualHUD.scaleFactor, w) : w;
            this.$el.width(w);

            h = this.model.get('maxHeight') ? Math.min(this.model.get('maxHeight') * visualHUD.scaleFactor, h) : h;
            this.$el.height(h);
        },

        updateColor: function(value) {
            this.updateBoxStyle();
        },

        updateOpacity: function(value) {
            this.updateBoxStyle();
        },

        updateBorderRadius: function(value) {
            var radius = parseInt(value, 10);

            var originalClassName = this.getDOMRefs().box.attr('class'),
                patt = /rbox-[0-9]/;

            if(patt.test(originalClassName)) {
                originalClassName = originalClassName.replace(patt, '');
                originalClassName = $.trim(originalClassName);
            }
            originalClassName += (' rbox-' + radius);
            this.getDOMRefs().box.attr('class', originalClassName);

            if(radius > 0) {
                this.model.set('boxStyle', 0, {silent: true});
                this.getForm().setValues({'boxStyle': 0}, {silent: true});
                this.updateBoxStyle(0);
            }
        },

        updateBoxStyle: function() {
            var style = parseInt(this.model.get('boxStyle'), 10);
            var color = $.color('#' + this.model.get('color'));
            var opacity = this.model.get('opacity')/100 ;

            var renderGradient = style > 0 && parseInt(this.model.get('borderRadius'), 10) == 0;

            if(renderGradient) {
                this.getDOMRefs().box.css('background', color.hex);
                _.each(visualHUD.Libs.utility.getBoxGradients(style, color, opacity), function(gradStyle) {
                    this.getDOMRefs().box.css('background', gradStyle);
                }, this)
            }
            else {
                this.getDOMRefs().box.css('background', this.getRgba({ color: color.rgb.join(','), opacity: opacity }));
            }

            if(style > 0) {
                this.model.set('borderRadius', 0, {silent: true});
                this.getForm().setValues({'borderRadius': 0}, {silent: true});
                this.updateBorderRadius(0);
            }
        }

    },

    'obits': {
        updateTextSize: function(value) {
        },

        updateTextStyle: function(value) {
        },

        updateTextOpacity: function(value) {

        },

        updateIconPosition: function(position, spacing) {
        },

        updateIconOpacity: function(value) {
        },

        updateIconSize: function(value) {
        },

        updateIconStyle: function(value) {
        },

        updateIconSpacing: function(value) {
        },

        updateTextColor: function(value) {
        },

        updateTeamColors: function(value) {
        },

        updateColorRanges: function(value) {
        },

        updateText: function(value) {
        },

        updateBorderRadius: function(value) {
        },

        updateBoxStyle: function(value) {
        },

        updateTemplate: function(value) {
        },

        updatePowerupView: function(value) {
        },

        updatePadding: function(value) {
        },

        updateToggleChat: function(value) {
        },

        updateScoreboxLayout: function(value) {
        }
    }
};

visualHUD.Libs.layersManager = {
    alignItem: function(itemView, boxes, alignPosition) {
        var element = itemView.$el,
            css = {};

        switch(alignPosition){
            case 'top':
                css = {'top': boxes[0].top};
                break;
            case 'bottom':
                css = {'top' : Math.round(boxes[0].top + boxes[0].height - boxes[1].height)};
                break;
            case 'vertical':
                css = {'top': Math.round(boxes[0].top + (boxes[0].height -  boxes[1].height)/2)};
                break;
            case 'left':
                css = {'left': boxes[0].left};
                break;
            case 'right':
                css = {'left': Math.round(boxes[0].left + boxes[0].width -  boxes[1].width)};
                break;
            case 'horizontal':
                css = {'left': Math.round(boxes[0].left + (boxes[0].width -  boxes[1].width)/2)};
                break;
        }
        element.css(css);

        return css;
    },

    alignEdges: function(canvasView, alignPosition){

        var selection = canvasView.getSelection(),
            isGroup = selection.length > 1 && selection[0].getGroup() != null;
            boxes = [];

        if(selection.length == 1 || isGroup){
            var masterElement = selection[0];
            boxes.push(
                {
                    top: 0,
                    left: 0,
                    width: canvasView.$el.width(),
                    height: canvasView.$el.height()
                },
                masterElement.$el.coordinates(true, false)
            );

            if(isGroup == false) {
                this.alignItem(selection[0], boxes, alignPosition);
            }
            else {
                console.info('Could not align grouped items yet :(');
            }
        }
        else {
            for(var a = 0, b = selection.length; a < b; a++){
                boxes.push(selection[a].$el.coordinates(true, false));
                if(a > 0){
                    this.alignItem(selection[a], [boxes[0], boxes[a]], alignPosition)
                }
            }
        }
    },

    arrangeLayers: function(canvasView, arrangeAction){
        var selection = canvasView.getSelection()

        if(selection.length == 0) {
            return;
        }

        var targetElement = selection[0].$el;
        var hudElementsWrap = canvasView.$canvas;

        var actions = {
            'bring-front': {
                element: hudElementsWrap,
                fn: 'appendTo'
            },
            'send-back': {
                element: hudElementsWrap,
                fn: 'prependTo'
            },
            'bring-forward': {
                element: targetElement.next(),
                fn: 'insertAfter'
            },
            'send-backward': {
                element: targetElement.prev(),
                fn: 'insertBefore'
            }
        };

        var _direction;
        var fnData = actions[arrangeAction];

        if(fnData.element.length && fnData.element[0] != targetElement[0]){
            targetElement[fnData.fn](fnData.element)
        }
    }
};

visualHUD.Libs.canvasDragInterface = {
    offsets: [],

    getView: function() {
        return this.options.view;
    },

    setMode: function(mode){
        switch(mode) {
            case 'move': {
                this.setOptions({
                    bodyDragClass: 'drag',
                    onbeforestart: this.beforeStart,
                    onstart: this.startMoveElement,
                    ondrag: null,
                    ondrop: null
                });
                break;
            }
            case 'select': {
                this.setOptions({
                    bodyDragClass: 'drag-select',
                    onbeforestart: null,
                    onstart: this.startDragSelect,
                    ondrag: null,
                    ondrop: null
                });
                break;
            }
            case 'resize': {
                this.setOptions({
                    bodyDragClass: 'resize',
                    onbeforestart: null,
                    onstart: this.startResizeBox,
                    ondrag: null,
                    ondrop: null
                });
                break;
            }
            case 'draw': {
                this.setOptions({
                    bodyDragClass: 'draw',
                    onbeforestart: this.beforeStart,
                    onstart: this.startDrawRect,
                    ondrag: this.drawRect,
                    ondrop: this.drawRectDrop
                });
                break;
            }
            default: {
                this.setOptions({
                    bodyDragClass: '',
                    onbeforestart: null,
                    onstart: null,
                    ondrag: null,
                    ondrop: null
                });
            }
        }
        return this;
    },

    beforeStart: function(drag, event, _mouse) {
        var boundTo = this.currentElement.offsetParent();

        this.offsets = [];

        this.limits = {
            top: 0,
            left: 0,
            right: boundTo.width(),
            bottom: boundTo.height()
        }
    },

    setDragHandle: function(resizeHandle){
        this.resizeHandle = resizeHandle;
        return this;
    },

    startDrawRect: function(event, element){
        this.currentElement = this.drawBox.clone().css({top: Math.round(this.mouse.y), left: Math.round(this.mouse.x)}).appendTo(visualHUD.application.hudElementsWrap);
        this.mode = 'drawRect';
    },
    drawRect: function(drag, event, position, mouse){

        if(this.options.grid) {
            this.mouse.x -= this.mouse.x % this.options.grid;
            this.mouse.y -= this.mouse.y % this.options.grid;
            mouse.x -= mouse.x % this.options.grid;
            mouse.y -= mouse.y % this.options.grid;
        }

        var w = Math.abs(this.mouse.x - mouse.x);
        var h = Math.abs(this.mouse.y - mouse.y);


        var t = Math.min(this.mouse.y, mouse.y) - this.limits.top;
        var l = Math.min(this.mouse.x, mouse.x) - this.limits.left;

        if(t < 0){
            t = 0;
            h = this.mouse.y - this.limits.top;
        }
        else {
            h = mouse.y > this.limits.bottom ? this.limits.bottom - this.mouse.y : h;
        }

        if(l < 0){
            l = 0;
            w = this.mouse.x - this.limits.left;
        }
        else {
            w = mouse.x > this.limits.right ? this.limits.right - this.mouse.x : w;
        }

        if(this.options.grid) {
            l -= l % this.options.grid;
            t -= t % this.options.grid;
        }

        var area = {
            width: w,
            height: h,
            top: Math.round(t),
            left: Math.round(l)
        };

        this.currentElement.css(area);

        return area;
    },
    drawRectDrop: function(){
        var dataObject = {
            'name': 'rectangleBox',
            'itemType': 'rect',
            'label': 'Rectangle box',
            'cssClass': 'lib-element-rect'
        };
        visualHUD.constructor.fn.createRect(dataObject, this.currentElement);
        this.currentElement.trigger('click');
        _data = this.currentElement.data('HUDItem');
    },

    startDragSelect: function(drag, event, element){
        var _this = this;
        this.rubberBox = this.rubberBox || $('<div />').addClass('rubber-box');

        this.currentElement = this.rubberBox.css({
            width: 1,
            height: 1,
            top: Math.round(this.mouse.y),
            left: Math.round(this.mouse.x)
        }).appendTo(this.getView().$canvas);

        var HUDElements = this.getView().$canvas.find('div.hud-item');
        var elementCoordinatesCache = [];

        HUDElements.each(function(){
            var _element = $(this);

            elementCoordinatesCache.push({
                element: _element,
                coordinates:_element.coordinates(true, false)
            });
        });

        this.limits = this.getView().getCanvasOffset();
        this.getView().deselect();

        this.elementCoordinatesCache = elementCoordinatesCache;

        this.setOptions({
            ondrag: this.dragSelect,
            ondrop: this.dragSelectDrop
        });
    },
    dragSelect: function(drag, event, position, mouse){
        var area = this.drawRect.apply(this, arguments);

        area.right = area.left + area.width;
        area.bottom = area.top + area.height;

        var HUDItem, selectFN;

        for(var a = 0, b = this.elementCoordinatesCache.length; a < b; a++){
            HUDItem = this.elementCoordinatesCache[a];
            var _element = HUDItem.element;
            var coordinates = HUDItem.coordinates;

            var selectFN = area.right > coordinates.left && area.left < coordinates.right && area.bottom > coordinates.top && area.top < coordinates.bottom ? 'addClass' : 'removeClass';
            _element[selectFN]('selected');
        }

    },
    dragSelectDrop: function(drag, event){
        var view = this.getView();

        this.rubberBox && this.rubberBox.remove();

        this.currentElement = null;
        this.elementCoordinatesCache = null;

        var selected = view.$canvas.find('div.selected');

        window.setTimeout(function() {
            selected.each(function(){
                view.select(this, true);
            });
        }, 20);

        this.setMode(null);

        return false;
    },

    startResizeBox: function(drag, event, mouse){
        this.resizeDirection = this.currentElement.data('resizedirection');
        this.currentElement = this.currentElement.closest('div.hud-item');
        this.limits = this.getView().getCanvasOffset();
        this.positionCache = null;

        this.setOptions({
            ondrag: this.resizeBox,
            ondrop: this.resizeBoxDrop
        });

    },
    resizeBox: function(drag, event, position, mouse){

        if(this.options.grid) {
            mouse.x -= mouse.x % this.options.grid;
            mouse.y -= mouse.y % this.options.grid;
        }

        // cache position and dimensions to avoid recalculations
        var position = this.positionCache = this.positionCache || this.currentElement.position();

        var t = position.top;
        var l = position.left;

        var w = this.positionCache.width || this.currentElement.width();
        var h = this.positionCache.height || this.currentElement.height();

        var b = position.top + h;
        var r = position.left + w;

        if(this.resizeDirection == 'n' || this.resizeDirection == 'ne' || this.resizeDirection == 'nw'){
            t = Math.max(mouse.y - this.limits.top, 0);
            h = Math.max(b - t, 1);
            if(h == 1){
                t = b - h;
            }
        }

        if(this.resizeDirection == 'w' || this.resizeDirection == 'nw' || this.resizeDirection == 'sw'){
            l = Math.max(mouse.x - this.limits.left, 0);
            w = Math.max(r - l, 1);

            if(w == 1){
                l = r - w;
            }
        }

        if(this.resizeDirection == 'e' || this.resizeDirection == 'ne' || this.resizeDirection == 'se'){
            w = mouse.x - position.left - this.limits.left;
            w = mouse.x > this.limits.right ? this.limits.right - this.limits.left - position.left : w;
        }

        if(this.resizeDirection == 's' || this.resizeDirection == 'se' || this.resizeDirection == 'sw'){
            h = mouse.y - position.top -  this.limits.top;
            h = mouse.y > this.limits.bottom ? this.limits.bottom - this.limits.top - position.top : h;
        }

        if(this.options.grid) {
            w -= w % this.options.grid;
            h -= h % this.options.grid;
        }

        position = this.positionCache = {
            width: Math.max(1, w),
            height:  Math.max(1, h),
            top: t,
            left: l
        }

        this.currentElement.css(position);
    },
    resizeBoxDrop: function(){
        var HUDItemView = this.currentElement.data('HUDItem');

        this.positionCache.height = Math.max(HUDItemView.model.get('minHeight') * visualHUD.scaleFactor + HUDItemView.model.get('padding') * 2 * visualHUD.scaleFactor, this.positionCache.height);
        this.positionCache.width = Math.max(HUDItemView.model.get('minWidth') * visualHUD.scaleFactor + HUDItemView.model.get('padding') * 2 * visualHUD.scaleFactor, this.positionCache.width);

        HUDItemView.update({
            coordinates: {
                top: Math.round(this.positionCache.top / visualHUD.scaleFactor),
                left: Math.round(this.positionCache.left / visualHUD.scaleFactor),
                width: Math.round(this.positionCache.width / visualHUD.scaleFactor),
                height: Math.round(this.positionCache.height / visualHUD.scaleFactor)
            },
            width: this.positionCache.width,
            height: this.positionCache.height
        });

        // set default state for drop manager
        this.setMode(null);

        // reset position cache
        this.positionCache = null
    },

    startMoveElement: function(drag, event, element){
        this.setOptions({
            ondrag: this.moveElement,
            ondrop: this.moveElementDrop
        });

        this.currentElement = this.currentElement.data('HUDItem');
        this.currentElement.$el.addClass('drag-start');

        this.slaveElements = [];
        this.offsets = [];
        this.drawLine = false;

        this.getView().select(this.currentElement, true);

        var masterElement = null,
            selection = this.getView().getSelection(),
            isMatch = false;

        if(selection.length > 1){
            for(var a = 0, b = selection.length; a < b; a++){
                isMatch = selection[a].$el.get(0) == this.currentElement.$el.get(0);
                if(isMatch == false){
                    this.slaveElements.push(selection[a]);
                }
            }

            var masterPosition = this.currentElement.$el.position();

            for(a = 0, b = this.slaveElements.length; a < b; a++){
                var slavePosition = this.slaveElements[a].$el.position();

                this.offsets.push({
                    top: masterPosition.top - slavePosition.top,
                    left: masterPosition.left - slavePosition.left
                });
            }
        }

    },
    moveElement: function(drag, event, position, mouse){

        var newPosition = this.currentElement.checkPosition(position);
        this.currentElement.$el.css(newPosition);

        var pos;

        for(a = 0, b = this.slaveElements.length; a < b; a++){
            pos = this.slaveElements[a].checkPosition({
                top: newPosition.top - this.offsets[a].top,
                left: newPosition.left - this.offsets[a].left
            });
            this.slaveElements[a].$el.css(pos);
        }
    },
    moveElementDrop: function(drag, event, target){
        this.currentElement.$el.removeClass('drag-start');
        this.getView().fireEvent('drop.move', [this.currentElement]);
    }
};

visualHUD.Libs.selectionManagerInterface = {
    selection: [],

    _deselectBinded: false,
    _selectionDisabled: false,

    select: function(element, multiple) {
        var view;

        if(element instanceof visualHUD.Views.HUDItem) {
            view = element;
        }
        else {
            view = $(element).data('HUDItem');
        }

        var inGroup = view.getGroup();
        var alreadyPresent = this.isSelected(view);

        if(this._selectionDisabled == false) {
            if(multiple == false) {
                this.deselect();
            }
            
            if(this.isSelected(view) == false) {
                this.selection.push(view);
                view.$el.addClass('selected');
            }

            (inGroup == null) && this.fireEvent('selectionchange', [this, this.getSelection()]);

            if(this._deselectBinded == false) {
                $('body').bind('click.deselect', visualHUD.Function.bind(this.clickDeselect, this));
                this._deselectBinded = true;
            }
        }

        if(inGroup) {
            this.selectByGroup(inGroup);
        }
    },

    isSelected: function(element) {
        return _.include(this.selection, element);
    },

    deselect: function() {
        _.each(this.selection, function(view) {
            view.$el.removeClass('selected');
        });

        this.selection.length = 0;
        this.fireEvent('selectionchange', [this, this.getSelection()]);

        if(this._deselectBinded == true) {
            $('body').unbind('click.deselect');
            this._deselectBinded = false;
        }
    },

    selectAll: function() {
        var me = this;
        this.$el.find('div.' + visualHUD.Views.HUDItem.prototype.className).each(function() {
            me.select(this, true);
        });
    },

    selectByGroup: function(groupName) {
        var me = this;
        this.$el.find('div.' + visualHUD.Views.HUDItem.prototype.className).each(function() {
            var view = $(this).data('HUDItem'),
                inGroup = view.getGroup(),
                alreadyPresent = _.include(me.selection, view)

            if(inGroup == groupName && alreadyPresent == false) {
                me.selection.push(view);
                view.$el.addClass('selected');
            }
        });

        this.fireEvent('selectionchange', [this, this.getSelection()]);
    },

    getSelection: function() {
        return this.selection;
    },

    disableSelection: function() {
        this._selectionDisabled = true;
    },

    enableSelection: function() {
        this._selectionDisabled = false;
    },

    clickDeselect: function(event) {
        var target = $(event.target);
        var hudItem = target.closest('div.' + visualHUD.Views.HUDItem.prototype.className, this.$el);
        var sidebar = target.closest('.vh-viewport-sidebar', document.body);

        if(hudItem.length == 0 && sidebar.length == 0) {
            this.deselect();
        }
    }
};

/**
 * The set of methods that is used to build form controls
 * @type {Object}
 */
visualHUD.Libs.formControlsBuilder = {
    cache:{},

    getDefaultsByType: function(type) {
        return this.controlDefaults[type];
    },

    getTemplateByType: function(type) {
        return this.controlTemplates[type].join('');
    },
    buildForm: function(markups) {
        var fragment = document.createDocumentFragment();

        if(_.isArray(markups) == false) {
            markups = [markups];
        }

        _.each(markups, function(m) {
            var element = this.createElementByType(m);
            fragment.appendChild(element.get(0));

            if(m.items != undefined) {
                var f = this.buildForm(m.items);
                element.get(0).appendChild(f);
            }
        }, this);

        return fragment;
    },

    createElementByType: function(options) {
        var fnName = 'create' + options.type.charAt(0).toUpperCase() + options.type.substring(1);
        var fn = this[fnName];

        if(_.isFunction(fn)) {
            return fn.apply(this, arguments);
        }
        else {
            return this.createFormControl(options);
        }
    },

    controlDefaults: {
        container: {
            cssClass: '',
            id: '',
            wrap: false,
            hint: null
        },
        form: {
            cssClass: '',
            id: '',
            action: '',
            method: 'get',
            wrap: false,
            hint: null
        },
        fieldset: {
            label: 'Fieldset',
            wrap: false,
            hint: null
        },
        toolbar: {
            cssClass: '',
            wrap: false
        },
        textbox: {
            size: '',
            label: 'Textbox',
            name: 'textbox',
            inputType: 'text',
            value: '',
            maxlength: '',
            placeholder: '',
            hint: null,
            wrap: true,
            required: false
        },
        fileInput: {
            size: '',
            label: 'Fileinput',
            noFileMessage: 'No file selected',
            text: 'Browse...',
            name: 'file',
            value: '',
            maxlength: '',
            hint: null,
            wrap: true
        },
        textarea: {
            rows: 2,
            cols: 20,
            value: '',
            wrap: true,
            hint: null,
            required: false,
            name: 'textarea'
        },
        rangeInput: {
            value: 0,
            name: 'rangeinput',
            hint: null,
            wrap: true
        },
        checkbox: {
            type: 'checkbox',
            hint: null,
            label: null,
            tooltip: null,
            checked: false,
            name: 'checkbox',
            value: 'on',
            boxLabel: 'Checkbox',
            wrap: true
        },
        checkboxGroup: {
            wrap: true,
            hint: null
        },
        radiobutton: {
            type: 'radiobutton',
            hint: null,
            label: null,
            tooltip: null,
            checked: false,
            name: 'radiobutton',
            value: 'on',
            boxLabel: 'Radiobutton',
            wrap: true
        },
        radiobuttonGroup: {
            wrap: true,
            hint: null
        },
        select: {
            width: null,
            value: 0,
            name: 'select',
            hint: null,
            wrap: true,
            displayField: 'name',
            valueField: 'id',
            options: {}
        },
        button: {
            name: '',
            role: '',
            action: 'button',
            value: '',
            cssClass: '',
            tooltip: '',
            icon: '',
            text: 'Button',
            wrap: false,
            hint: null
        },
        alignControl: {
            label: 'Align',
            hint: null,
            wrap: true
        },
        arrangeControl: {
            label: 'Arrange',
            hint: null,
            wrap: true
        },
        groupActionsControl: {
            label: 'Actions',
            hint: null,
            wrap: true
        },
        colorPicker: {
            value: 'FFFFFF',
            name: 'color',
            hint: null,
            wrap: true
        }
    },

    controlTemplates: {
        container: [
            '<div></div>'
        ],
        form: [
            '<form class="<%= cssClass %>" id="<%= id %>" action="<%= action %>" method="<%= method %>">'
        ],
        toolbar: [
            '<div class="form-toolbar <%= cssClass %> clearfloat"></div>'
        ],
        textbox: [
            '<input type="<%= inputType %>" size="<%= size %>" name="<%= name %>" value="<%= value %>" placeholder="<%= placeholder %>" maxlength="<%= maxlength %>" <%= required ? \'required="required"\' : \'\' %>  />'
        ],
        textarea: [
            '<textarea name="<%= name %>" rows="<%= rows %>" cols="<%= cols %>" <%= required ? \'required="required"\' : \'\' %>><%= value %></textarea>'
        ],
        fieldset: [
            '<fieldset>',
            '<legend><%= label %></legend>',
            '</fieldset>'
        ],
        fileInput: [
            '<span class="file-input">',
                '<span class="btn <%= cssClass %>"><span><%= text %></span><input type="file" name="<%= name %>" /></span>',
                '<span class="file-name"><%= noFileMessage %></span>',
            '</span>'
        ],
        rangeInput: [
            '<div class="slider"><div class="progress"></div><input type="button" class="handle" /></div>',
            '<input type="text" size="8" maxlength="3" value="<%= value %>" class="range range-input" name="<%= name %>"  />'
        ],
        checkbox: [
            '<label class="check-label"><input type="checkbox" name="<%= name %>" value="<%= value %>" <%= checked ? \'checked="checked"\' : \'\' %>"><span class="box-label" data-tooltip="<%= tooltip %>"><%= boxLabel %></span></label>'
        ],
        radiobutton: [
            '<label class="check-label"><input type="radio" name="<%= name %>" value="<%= value %>"  <%= checked ? \'checked="checked"\' : \'\' %>"><span class="box-label" data-tooltip="<%= tooltip %>"><%= boxLabel %></span></label>'
        ],
        select: [
            '<span class="styled-select w-carret" <% if(width) { %>style="width:<%= width %>"<% }; %>><span class="select-value"></span><select type="text" name="<%= name %>" value="<%= value %>"><%= options %></select></span>'
        ],
        button: [
            '<button name="<%= name %>" type="<%= action %>" value="<%= value %>" class="<%= cssClass %>" data-tooltip="<%= tooltip %>"><span class="<%= icon %>"><%= text %></span></button>'
        ],
        alignControl: [
            '<ul class="library-items align-controls icons-24px clearfloat">',
            '<li class="align-top" data-action="top" data-tooltip="Align top edges"><span class="icon"></span><span class="item-name">Top edges</span></li>',
            '<li class="align-vertical" data-action="vertical" data-tooltip="Align vertical centers"><span class="icon"></span><span class="item-name">Vertical centers</span></li>',
            '<li class="align-bottom" data-action="bottom" data-tooltip="Align bottom edges"><span class="icon"></span><span class="item-name">Bottom edges</span></li>',
            '<li class="align-left" data-action="left" data-tooltip="Align left edges"><span class="icon"></span><span class="item-name">Left edges</span></li>',
            '<li class="align-horizontal" data-action="horizontal" data-tooltip="Align horizontal centers"><span class="icon"></span><span class="item-name">Horizontal centers</span></li>',
            '<li class="align-right" data-action="right" data-tooltip="Align right edges"><span class="icon"></span><span class="item-name">Right edges</span></li>',
            '</ul>'
        ],
        arrangeControl: [
            '<ul class="library-items arrange-controls icons-24px clearfloat">',
            '<li class="bring-front" data-action="bring-front" data-tooltip="Bring to front <small>(CTRL + SHIFT + UP)</small>"><span class="icon"></span><span class="item-name">Bring to front <small>(CTRL + SHIFT + UP)</small></span></li>',
            '<li class="send-back" data-action="send-back" data-tooltip="Send to back <small>(CTRL + SHIFT + DOWN)</small>"><span class="icon"></span><span class="item-name">Send to back <small>(CTRL + SHIFT + DOWN)</small></span></li>',
            '<li class="bring-forward" data-action="bring-forward" data-tooltip="Bring forward <small>(CTRL + UP)</small>"><span class="icon"></span><span class="item-name">Bring forward <small>(CTRL + UP)</small></span></li>',
            '<li class="send-backward" data-action="send-backward" data-tooltip="Send backward <small>(CTRL + DOWN)</small>"><span class="icon"></span><span class="item-name">Send backward <small>(CTRL + DOWN)</small></span></li>',
            '</ul>'
        ],
        groupActionsControl: [
            '<ul class="library-items group-action-controls icons-24px clearfloat">',
            '<li class="delete" data-action="delete-selected" data-tooltip="Delete selected items"></li>',
            '<li class="group" data-action="group-selected" data-tooltip="Group/ungroup selected items"></li>',
            '</ul>'
        ],
        colorPicker: [
            '<input type="text" size="6" name="<%= name %>" value="<%= value %>" maxlength="6" class="color-input"  />',
            '<div class="color-picker-box" style="background-color: #<%= value %>; "></div>'
        ]
    },

    baseTemplate: [
        '<span class="f-label <%= label ? \'\' : \'hidden\' %>"><%= label %></span>',
        '<span class="f-inputs">',
            '{markup}',
        '</span>',
        '<% if(hint) { %><div class="f-hint"><%= hint %></div><% }; %>'
    ],

    getBaseElement: function(attributes) {
        var element = $('<div class="f-row" />');
        element
            .addClass(attributes.cssClass || '')
            .attr('id', attributes.id || '')
            .addClass(attributes.required ? 'reqired-field' : '');
        
        return element;
    },

    getBaseMarkup: function(markup) {
        var html = this.baseTemplate.join('').replace(/{markup}/gi, markup);
        return html;
    },

    createFormControl: function(attributes, markup) {
        var markup = markup || this.getTemplateByType(attributes.type);
        var defaults = this.getDefaultsByType(attributes.type);
        var attributes = _.extend({}, defaults, attributes);
        var template = attributes.wrap ? this.getBaseMarkup(markup) : markup;
        var html = _.template(template, attributes);
        var element = attributes.wrap ? this.getBaseElement(attributes).html(html) : $(html);

        return element;
    },

    createContainer: function(attributes) {
        var element = $('<div />');
        
        var ignoreAttributes = ['type', 'items'];
        var mapAttributes = {'cssClass': 'class'};

        var elementAttributes = _.extend({}, attributes);

        _.each(ignoreAttributes, function(attr) {
            delete elementAttributes[attr];
        });
        _.each(mapAttributes, function(value, key) {
            elementAttributes[value] = elementAttributes[key];
            delete elementAttributes[key];
        });
        
        element.attr(elementAttributes);

        return element;
    },

    createComponent: function(attributes) {
        var constructor = Backbone.resolveNamespace(attributes['constructorName']),
            instance = new constructor(attributes),
            element = instance.$el;

        element.data('component', instance);

        return element;
    },

    createRangeInput:function (attributes) {
        var defaults = {
            precision:false,
            keyboard:false,
            progress:true,
            sliderSize:160,
            handleSize:12
        };
        var element = this.createFormControl(attributes);
        var input = element.find('input.range-input').rangeinput(_.extend(defaults, attributes));

        return element;
    },

    createCheckboxGroup: function(attributes) {
        return this.createChecksGroup('checkbox', attributes);
    },

    createRadiobuttonGroup: function(attributes) {
        return this.createChecksGroup('radiobutton', attributes);
    },

    createChecksGroup: function(defaultType, attributes) {
        var checkboxTemplate = this.getTemplateByType(defaultType),
            checkboxDefaults = this.getDefaultsByType(defaultType),
            markup = [];

        attributes.cssClass = defaultType + '-group layout-' + (attributes.layout || '');

        _.each(attributes.options, function(item) {
            var attributes = _.extend({}, checkboxDefaults, item);
            markup.push(_.template(checkboxTemplate, attributes));
        }, this);

        return this.createFormControl(attributes, markup.join(''));
    },

    createSelectOptionsMapFromCollection: function(collection, attributes) {
        var selectOptionsMap = {};

       collection.each(function(record) {
           selectOptionsMap[record.get(attributes.valueField)] = record.get(attributes.displayField);
       });

       return selectOptionsMap;
    },

    generateSelectOptionsFromMap: function (opts, selectHTML) {
        var optionHTMLTemplate = '<option value="<%= value %>"><%= label %></option>';
        var optgroupHTMLTemplates = ['<optgroup label="<%= label %>">', '</optgroup>'];

        _.each(opts, function (value, key) {

            if ($.isPlainObject(value)) {
                selectHTML.push(
                    _.template(optgroupHTMLTemplates[0], {
                        label: key
                    })
                );
                this.generateSelectOptionsFromMap(value, selectHTML);
                selectHTML.push(optgroupHTMLTemplates[1]);
            }
            else {
                selectHTML.push(
                    _.template(optionHTMLTemplate, {
                        value:key,
                        label:value
                    })
                );
            }
        }, this);
        return selectHTML.join('')
    },

    createSelect:function (attributes) {

        if(attributes.collection) {
            attributes.options = this.createSelectOptionsMapFromCollection(attributes.collection, attributes);
        }

        attributes.options = this.generateSelectOptionsFromMap(attributes.options, []);

        var element = this.createFormControl(attributes),
            select = element.find('select'),
            valueElement = select.parent().find('.select-value');

        if (attributes.value) {
            select.val(attributes.value);
        }
        else {
            select.attr('selectedIndex', 0);
        }

        var selectDOM = select.get(0);

        valueElement.text(selectDOM[selectDOM.selectedIndex].label);

        select.on('change', function() {
            valueElement.text(selectDOM[selectDOM.selectedIndex].label);
        });

        select.on('focus', function() {
            select.parent().addClass('focused');
        });

        select.on('blur', function() {
            select.parent().removeClass('focused');
        });

        if(attributes.collection) {
            attributes.collection.on('all', function() {
                var options = this.createSelectOptionsMapFromCollection(attributes.collection, attributes);
                options = this.generateSelectOptionsFromMap(options, []);
                select.html(options);
            }, this)
        }

        return element;
    },

    createButton:function (attributes) {
        attributes.cssClass = attributes.cssClass || '';
        attributes.cssClass += attributes.role ? ' button-' + attributes.role : '';
        attributes.icon = attributes.icon ? 'w-icon icon-' + attributes.icon : '';

        return this.createFormControl(attributes);
    },


    createFileInput: function(attributes) {
        attributes.cssClass += attributes.role ? ' button-' + attributes.role : '';
        var element = this.createFormControl(attributes);
        var fileinput = element.find('input[type=file]');
        var filename = element.find('span.file-name');

        var defaults = this.getDefaultsByType(attributes.type);
        attributes = _.extend({}, defaults, attributes);

        fileinput.bind('change', function() {
            var value = $(this).val(),
                fileName = value.split(/\\/).pop();
            filename.text(fileName || attributes.noFileMessage);
        });

        return element;
    },

    createColorRange:function (attributes) {
        var template = ([
            '<% _.each(ranges, function(range, idx) { %>',
            '<div class="f-row">',
            '<span class="f-label"><%= range.name %></span>',
            '<span class="f-inputs">',
            '<span class="color-range-inputs mr-10">',
            '<input type="text" size="3" name="colorRange_<%= idx %>_range_0" value="<%= range.range[0] %>" maxlength="3" class="color-range-input mr-5">',
            '<input type="text" size="3" name="colorRange_<%= idx %>_range_1" value="<%= range.range[1] %>" maxlength="3" class="color-range-input mr-5">',
            '</span>',
            '<input type="text" size="6" name="colorRange_<%= idx %>_color" value="<%= range.color %>" maxlength="6" class="color-input" />',
            '<div class="color-picker-box" style="background-color: #<%= range.color %>; "></div>',
            '</span>',
            '</div>',
            '<% }); %>'
        ]).join('');

        var element = $('<div />').html(_.template(template, attributes));

        var rangeValueInputs = element.find('input.color-range-input');
        var eventManuallyTriggered = false;

        element.delegate('input[type=text]', 'change', function (event) {
            if(eventManuallyTriggered) {
                $(this).closest('form').trigger(event);
                eventManuallyTriggered = false;
                return false;
            }

            var $input = $(this),
                index = rangeValueInputs.index(this),
                odd = (index + 1) % 2 == 0,
                value;

            var $nextInput = rangeValueInputs.eq(index + 1),
                $prevInput = rangeValueInputs.eq(index - 1);

            if (odd) {
                value = parseInt(this.value);
                if ($nextInput.length && !$nextInput.attr('readOnly')) {
                    $nextInput.val(value + 1);

                    //event.stopPropagation();
                    eventManuallyTriggered = true;
                    $nextInput.trigger('change', [value + 1]);
                }
            } else {
                value = parseInt(this.value);
                if ($prevInput.length && !$prevInput.attr('readOnly')) {
                    $prevInput.val(value - 1);

                    //event.stopPropagation();
                    eventManuallyTriggered = true;
                    $prevInput.trigger('change', [value - 1]);

                }
            }
        });

        rangeValueInputs.first().attr('readonly', true);
        rangeValueInputs.last().attr('readonly', true);

        return element;
    }
};

visualHUD.Libs.formBuilderMixin = {
    getByType: function(type) {
        return this[type];
    },

    getByName: function(name) {
        return this[name];
    },

    'base': {

        getSelectBasic: function(options) {
            return _.extend({
                'type': 'select',
                'name': 'select',
                'label': 'Select',
                'width': '120px',
                'value': null,
                'options': []
            }, options || {});
        },

        getRangeInputBasic: function(options) {
            return _.extend({
                'type': 'rangeInput',
                'name': 'input',
                'label': 'Range Input',
                'min': 0,
                'max': 100,
                'value': null
            }, options || {});
        },

        getColorInputBasic: function(options) {
            return _.extend({
                'type': 'colorPicker',
                'name': 'input',
                'label': 'Color',
                'value': null
            }, options || {});
        },

        getIconStyleSelectOptions: function() {
            var iconOptionsRecord = this.getCollection('HUDItemIconEnums').get(this.model.get('name'));
            var iconOptions = iconOptionsRecord.get('options');
            var iconStyleSelectOptions = {};

            _.each(iconOptions, function(opt, idx) {
                iconStyleSelectOptions[String(idx)] = opt.name;
            });

            return iconStyleSelectOptions;
        },

        getIconPositionOptions: function() {
            return {
                'left': 'Left',
                'top': 'Top',
                'right': 'Right',
                'bottom': 'Bottom'
            }
        },

        getTextStyleOptions: function() {
            return {
                '0': 'Normal',
                '3': 'Drop shadow'
            }
        },

        getBorderRadiusOptions: function() {
            return {
                '0': 'None',
                '3': '3px',
                '5': '5px',
                '8': '8px'
            }
        },

        getOwnerDrawOptions: function() {
            return {
                '0': 'Any Game Type',
                'CG_SHOW_ANYNONTEAMGAME': 'Any Non Team Game',
                'CG_SHOW_ANYTEAMGAME': 'Any Team Game',
                'CG_SHOW_CLAN_ARENA': 'Clan Arenay Only',
                'CG_SHOW_TOURNAMENT': 'Duel Only',
                'CG_SHOW_IF_WARMUP': 'Warm-up Only',
                'CG_SHOW_IF_NOT_WARMUP': 'Game Only (Not Warm-up)',
                'CG_SHOW_CTF': 'CTF Only'
/*
 'CG_SHOW_IF_PLYR_IS_FIRST_PLACE', 'CG_SHOW_IF_PLYR_IS_NOT_FIRST_PLACE', 'CG_SHOW_IF_RED_IS_FIRST_PLACE',
 'CG_SHOW_IF_BLUE_IS_FIRST_PLACE', 'CG_SHOW_IF_PLYR_IS_ON_RED', 'CG_SHOW_IF_PLYR_IS_ON_BLUE',
 'CG_SHOW_IF_PLAYER_HAS_FLAG', 'CG_SHOW_YOURTEAMHASENEMYFLAG', 'CG_SHOW_OTHERTEAMHASFLAG',
 'CG_SHOW_BLUE_TEAM_HAS_REDFLAG', 'CG_SHOW_RED_TEAM_HAS_BLUEFLAG',
 'CG_SHOW_ANYTEAMGAME', 'CG_SHOW_ANYNONTEAMGAME', 'CG_SHOW_CTF', 'CG_SHOW_CLAN_ARENA', 'CG_SHOW_TOURNAMENT',
 'CG_SHOW_HEALTHCRITICAL', 'CG_SHOW_HEALTHOK', 'CG_SHOW_IF_WARMUP', 'CG_SHOW_IF_NOT_WARMUP'
                 */
            }
        },
        getGradientOptions: function() {
            return {
                '0': 'Solid',
                'Gradient': {
                    '1': 'Top to bottom',
                    '2': 'Bottom to top',
                    '3': 'Left to right',
                    '4': 'Right to left'
                }
            }
        },

        getTextColorInput: function() {
            return this.getColorInputBasic({
                'name': 'textColor',
                'label': 'Color',
                'value': this.model.get('textColor')
            })
        },

        getIconStyleSelect: function() {
            return this.getSelectBasic({
                'name': 'iconStyle',
                'label': 'Icon',
                'value': this.model.get('iconStyle'),
                'options': this.getIconStyleSelectOptions()
            })
        },

        getIconPositionSelect: function() {
            return this.getSelectBasic({
                'name': 'iconPosition',
                'label': 'Position',
                'value':this.model.get('iconPosition'),
                'options': this.getIconPositionOptions()
            });
        },

        getIconSpacingInput: function() {
            return this.getRangeInputBasic({
                'name': 'iconSpacing',
                'label': 'Margin',
                'max': 32,
                'value': this.model.get('iconSpacing')
            });
        },

        getIconSizeInput: function() {
            return this.getRangeInputBasic({
                'name': 'iconSize',
                'label': 'Size',
                'max': 32,
                'value':this.model.get('iconSize')
            });
        },

        getIconOpacityInput: function() {
            return this.getRangeInputBasic({
                'name': 'iconOpacity',
                'label': 'Opacity',
                'value': this.model.get('iconOpacity')
            });
        },

        getTextStyleSelect: function() {
            return this.getSelectBasic({
                'name': 'textStyle',
                'label': 'Style',
                'value': this.model.get('textStyle'),
                'options': this.getTextStyleOptions()
            });
        },

        getTextSizeInput: function() {
            return this.getRangeInputBasic({
                'name': 'textSize',
                'label': 'Size',
                'value': this.model.get('textSize')
            });
        },

        getTextOpacityInput: function() {
            return this.getRangeInputBasic({
                'name': 'textOpacity',
                'label': 'Opacity',
                'value': this.model.get('textOpacity')
            });
        },

        getWidthInput: function() {
            return this.getRangeInputBasic({
                'name': 'width',
                'label': 'Width',
                'min': this.model.get('minWidth'),
                'max': this.model.get('maxWidth'),
                'value': this.model.get('width')
            });
        },

        getHeightInput: function() {
            return this.getRangeInputBasic({
                'name': 'height',
                'label': 'Height',
                'min': this.model.get('minHeight'),
                'max': this.model.get('maxHeight'),
                'value': this.model.get('height')
            });
        },

        getPaddingInput: function() {
            return this.getRangeInputBasic({
                'name': 'padding',
                'label': 'Padding',
                'min': 0,
                'max': 10,
                'value': this.model.get('padding')
            });
        },

        getOpacityInput: function() {
            return this.getRangeInputBasic({
                'name': 'opacity',
                'label': 'Opacity',
                'min': 0,
                'max': 100,
                'value': this.model.get('opacity')
            });
        },

        getPowerupLayoutOptions: function() {
            return {
                'left': 'Left to right',
                'right': 'Right to left',
                'top': 'Top to bottom',
                'bottom': 'Bottom to top'
            }
        },

        getAvailabilityControls: function() {
            return {
                type: 'fieldset',
                label: 'Availability',
                items: [
                    this.getSelectBasic({
                        label: 'During',
                        name: 'ownerDrawFlag',
                        value: this.model.get('ownerDrawFlag'),
                        options: this.getOwnerDrawOptions()
                    })
                ]
            }
        }
    },
    'general': {
        createControls: function(form) {
            var markup = [
                this.getAvailabilityControls(),
                {
                    type: 'fieldset',
                    label: 'Icon Properties',
                    items: [
                        this.getIconStyleSelect(),
                        this.getIconPositionSelect(),
                        this.getIconSpacingInput(),
                        this.getIconSizeInput(),
                        this.getIconOpacityInput(),
                        {
                            'type': 'checkbox',
                            'name': 'teamColors',
                            'boxLabel': 'Use team colors',
                            'checked': this.model.get('teamColors')
                        }
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Text Properties',
                    items: [
                        this.getTextStyleSelect(),
                        this.getTextSizeInput(),
                        this.getTextOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Color Range',
                    items: [
                        {
                            'type': 'colorRange',
                            'name': 'colorRanges',
                            'ranges': this.model.get('colorRanges')
                        }
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Align'
                        }
                    ]
                }
            ];
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'ammoIndicator': {
        createControls: function(form) {
            var markup = [
                this.getAvailabilityControls(),
                {
                    type: 'fieldset',
                    label: 'Icon Properties',
                    items: [
                        this.getIconPositionSelect(),
                        this.getIconSpacingInput(),
                        this.getIconSizeInput(),
                        this.getIconOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Text Properties',
                    items: [
                        this.getTextStyleSelect(),
                        this.getTextSizeInput(),
                        this.getTextOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Color Range',
                    items: [
                        {
                            'type': 'colorRange',
                            'name': 'colorRanges',
                            'ranges': this.model.get('colorRanges')
                        }
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Align'
                        }
                    ]
                }
            ];
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },
    'timer': {
        createControls: function(form) {
            var markup = [
                this.getAvailabilityControls(),
                {
                    type: 'fieldset',
                    label: 'Icon Properties',
                    items: [
                        this.getIconPositionSelect(),
                        this.getIconSpacingInput(),
                        this.getIconSizeInput(),
                        this.getIconOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Text Properties',
                    items: [
                        {
                            'type': 'textbox',
                            'name': 'text',
                            'label': 'Time',
                            'size': 10,
                            'maxlength': 5,
                            'value': this.model.get('text')
                        },
                        this.getTextStyleSelect(),
                        this.getTextSizeInput(),
                        this.getTextOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'powerupIndicator': {
        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: 'Icon Properties',
                    items: [
                        this.getSelectBasic({
                            'name': 'iconPosition',
                            'label': 'Stack',
                            'value': this.model.get('iconPosition'),
                            'options': this.getPowerupLayoutOptions()
                        }),
                        this.getIconSpacingInput(),
                        this.getIconSizeInput(),
                        {
                            'type': 'checkbox',
                            'name': 'singlePowerup',
                            'boxLabel': 'Show single icon',
                            'checked': this.model.get('singlePowerup')
                        }
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Text Properties',
                    items: [
                        this.getTextSizeInput(),
                        this.getTextOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'accuracyIndicator': {
        createControls: function(form) {
            var markup = [
                this.getAvailabilityControls(),
                {
                    type: 'fieldset',
                    label: 'Icon Properties',
                    items: [
                        this.getIconStyleSelect(),
                        this.getIconPositionSelect(),
                        this.getIconSpacingInput(),
                        this.getIconSizeInput(),
                        this.getIconOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Text Properties',
                    items: [
                        this.getTextStyleSelect(),
                        this.getTextColorInput(),
                        this.getTextSizeInput(),
                        this.getTextOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'skillIndicator': {
        createControls: function(form) {
            var markup = [
                this.getAvailabilityControls(),
                {
                    type: 'fieldset',
                    label: 'Text Properties',
                    items: [
                        this.getTextColorInput(),
                        {
                            'type': 'textbox',
                            'name': 'template',
                            'label': 'Tpl',
                            'size': 32,
                            'maxlength': '64',
                            'value': this.model.get('template')
                        }
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Text Style',
                    items: [
                        this.getTextStyleSelect(),
                        this.getTextSizeInput(),
                        this.getTextOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Color Range',
                    items: [
                        {
                            'type': 'colorRange',
                            'name': 'colorRanges',
                            'ranges': this.model.get('colorRanges')
                        }
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'iconItem': {
        getIconSizeInput: function() {
            return this.getRangeInputBasic({
                'name': 'iconSize',
                'label': 'Size',
                'min': 8,
                'max': 48,
                'value':this.model.get('iconSize')
            });
        },
        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: 'Icon Properties',
                    items: [
                        this.getIconSizeInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'flagIndicator': {
        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: 'Icon Properties',
                    items: [
                        this.getIconStyleSelect(),
                        this.getIconSizeInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'obits': {
        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'scoreBox': {
        getIconSpacingInput: function() {
            return this.getRangeInputBasic({
                'name': 'iconSpacing',
                'label': 'Spacing',
                'max': 8,
                'value': this.model.get('iconSpacing')
            });
        },

        getLayoutOptions: function() {
            return {
                'vertical': 'Vertical',
                'horizontal': 'Horizontal'
            };
        },

        getModeOptions: function() {
            return {
                'ffa': 'FFA / Duel',
                'tdm': 'Teamplay'
            }
        },

        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: 'Scorebox Properties',
                    items: [
                        this.getIconStyleSelect(),

                        this.getSelectBasic({
                            'name': 'scoreboxLayout',
                            'label': 'Layout',
                            'value': this.model.get('scoreboxLayout'),
                            'options': this.getLayoutOptions()
                        }),

                        this.getIconSpacingInput(),

                        this.getSelectBasic({
                            'name': 'scoreboxMode',
                            'label': 'Mode',
                            'value': this.model.get('scoreboxMode'),
                            'options': this.getModeOptions()
                        })
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'bar': {
        createControls: function(form) {
            var markup = [
                this.getAvailabilityControls(),
                {
                    type: 'fieldset',
                    label: this.model.get('label') + ' Properties',
                    items: [
                        this.getWidthInput(),
                        this.getHeightInput(),
                        this.getPaddingInput(),
                        {
                            'type': 'colorPicker',
                            'name': 'color',
                            'label': 'Color',
                            'value': this.model.get('color')
                        },
                        this.getOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Color Range',
                    items: [
                        {
                            'type': 'colorRange',
                            'name': 'colorRanges',
                            'ranges': this.model.get('colorRanges')
                        },
                        this.getRangeInputBasic({
                            'name': 'barsOpacity',
                            'label': 'Opacity',
                            'min': 0,
                            'max': 100,
                            'value': this.model.get('barsOpacity')
                        })
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'rect': {
        createControls: function(form) {
            var markup = [
                this.getAvailabilityControls(),
                {
                    type: 'fieldset',
                    label: this.model.get('label') + ' Properties',
                    items: [
                        this.getWidthInput(),
                        this.getHeightInput(),
                        this.getSelectBasic({
                            'name': 'borderRadius',
                            'label': 'Rounded',
                            'value': this.model.get('borderRadius'),
                            'options': this.getBorderRadiusOptions()
                        }),
                        this.getSelectBasic({
                            'name': 'boxStyle',
                            'label': 'Style',
                            'width': '182px',
                            'value': this.model.get('boxStyle'),
                            'options': this.getGradientOptions()
                        }),
                        {
                            'type': 'colorPicker',
                            'name': 'color',
                            'label': 'Color',
                            'value': this.model.get('color')
                        },
                        this.getOpacityInput(),
                        {
                            'type': 'checkbox',
                            'name': 'teamColors',
                            'boxLabel': 'Use team colors',
                            'checked': this.model.get('teamColors')
                        }
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }

    },

    'chatArea': {
        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: this.model.get('label') + ' Properties',
                    items: [
                        this.getWidthInput(),
                        this.getHeightInput(),
                        this.getPaddingInput(),
                        this.getSelectBasic({
                            'name': 'borderRadius',
                            'label': 'Rounded',
                            'value': this.model.get('borderRadius'),
                            'options': this.getBorderRadiusOptions()
                        }),
                        this.getSelectBasic({
                            'name': 'boxStyle',
                            'label': 'Style',
                            'width': '182px',
                            'value': this.model.get('boxStyle'),
                            'options': this.getGradientOptions()
                        }),
                        {
                            'type': 'colorPicker',
                            'name': 'color',
                            'label': 'Color',
                            'value': this.model.get('color')
                        },
                        this.getOpacityInput(),
                        {
                            'type': 'checkbox',
                            'name': 'showChat',
                            'boxLabel': 'Show chat',
                            'checked': this.model.get('showChat')
                        }
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }

    },

    'medal': {
        createControls: function(form) {
            var markup = [
                this.getAvailabilityControls(),
                {
                    type: 'fieldset',
                    label: 'Icon Properties',
                    items: [
                        this.getIconStyleSelect(),
                        this.getIconPositionSelect(),
                        this.getIconSpacingInput(),
                        this.getIconSizeInput(),
                        this.getIconOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Text Properties',
                    items: [
                        {
                            type: 'textbox',
                            label: 'Text',
                            name: 'text',
                            size: 16,
                            maxlength: 4,
                            value: this.model.get('text')
                        },
                        this.getTextColorInput(),
                        this.getTextSizeInput(),
                        this.getTextOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Align'
                        }
                    ]
                }
            ];
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    }
};

(function($){
    $.event.props.push('dataTransfer');

    $.fn.coordinates = function(_relative, _margin) {
        if ( !this[0] ) return { top: 0, left: 0, right:0, bottom: 0, width: 0, height: 0 };
        var fn = _relative ? 'position' : 'offset';
        var _position = this[fn]();

        fn = _margin ? 'outerWidth' : 'width';
        _position.width = this[fn]();

        fn = _margin ? 'outerHeight' : 'height';
        _position.height = this[fn]();

        _position.right = _position.left + _position.width;
        _position.bottom = _position.top + _position.height;

        return _position;
    };


    $.fn.disableSelection = function() {
        if (window.getSelection) window.getSelection().removeAllRanges();
        else if (document.selection && document.selection.clear) document.selection.clear();

        return this.each(function() {
            $(this).attr('unselectable', 'on')
                .css({'-moz-user-select':'none',
                    '-o-user-select':'none',
                    '-khtml-user-select':'none',
                    '-webkit-user-select':'none',
                    '-ms-user-select':'none',
                    'user-select':'none'})
                .each(function() {
                    $(this).bind('selectstart',function(){ return false; });
                });
        });
    };

    $.fn.enableSelection = function() {
        return this.each(function() {
            $(this).attr('unselectable', '')
                .css({'-moz-user-select':'',
                    '-o-user-select':'',
                    '-khtml-user-select':'',
                    '-webkit-user-select':'',
                    '-ms-user-select':'',
                    'user-select':''})
                .each(function() {
                    $(this).unbind('selectstart');
                });
        });
    };

    var rselectTextarea = /select|textarea/i;
    var rinput = /color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i;

    $.fn.serializeForm = function(){
        var valueObject = {};

        this.map(function () {
            //return this.elements ? jQuery.makeArray(this.elements) : this;
            return jQuery.makeArray($(this).getFormElements());
        }).filter(function () {
                return this.name && !this.disabled && (this.checked || rselectTextarea.test(this.nodeName) || rinput.test(this.type));
        }).map(function (i, elem) {
            var val = jQuery(this).val();
            valueObject[elem.name] = val;

//            return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function (val, i) {
//                    return {
//                        name: elem.name,
//                        value: val
//                    };
//                }) : {
//                    name: elem.name,
//                    value: val
//                };
            }).get();

        return valueObject;
    };

    $.fn.deserialize = function(d,config) {
        var data= d;
        me  = this;

        if (d === undefined) {
            return me;
        }

        config = $.extend({ isPHPnaming	: false,
            overwrite	: true},config);

        // check if data is an array, and convert to hash, converting multiple entries of
        // same name to an array
        if (d.constructor == Array)	{
            data={};
            for(var i=0; i<d.length; i++) {
                if (typeof data[d[i].name] != 'undefined') {
                    if (data[d[i].name].constructor!= Array) {
                        data[d[i].name]=[data[d[i].name],d[i].value];
                    } else {
                        data[d[i].name].push(d[i].value);
                    }
                } else {
                    data[d[i].name]=d[i].value;
                }
            }
        }

        // now data is a hash. insert each parameter into the form
        me.find('input,select,textarea').each(function() {
            var p=this.name;
            var v = [];

            // handle wierd PHP names if required
            if (config.isPHPnaming) {
                p=p.replace(/\[\]$/,'');
            }
            if(p && data[p] != undefined) {
                v = data[p].constructor == Array ? data[p] : [data[p]];
            }
            // Additional parameter overwrite
            if (config.overwrite === true || data[p]) {
                switch(this.type || this.tagName.toLowerCase()) {
                    case "radio":
                    case "checkbox":
                        this.checked=false;
                        for(var i=0;i<v.length;i++) {
                            this.checked|=(this.value!='' && v[i]==this.value);
                        }
                        break;
                    case "select-multiple" || "select":
                        for( i=0;i<this.options.length;i++) {
                            this.options[i].selected=false;
                            for(var j=0;j<v.length;j++) {
                                this.options[i].selected|=(this.options[i].value!='' && this.options[i].value==v[j]);
                            }
                        }
                        break;
                    case "button":
                    case "submit":
                        this.value=v.length>0?v.join(','):this.value;
                        break;
                    default:
                        this.value=v.join(',');
                }
            }
        });
        return me;
    };

    $.fn.getFormElements = function(){
        var $elements = $("input,select,textarea", this);
        return $elements;
    };

    var resizeCheck = function(){
        $.WMSOverlay.css({
            height: $(document).height()
        });
    };

    //dims the screen
    $.showModalOverlay = function(speed, opacity, callback) {

        if(typeof speed == 'function') {
            callback = speed;
            speed = null;
        }

        if(typeof opacity == 'function') {
            callback = opacity;
            opacity = null;
        }

        if(speed < 1) {
            var placeholder = opacity;
            opacity = speed;
            speed = placeholder;
        }

        if(opacity >= 1) {
            var placeholder = speed;
            speed = opacity;
            opacity = placeholder;
        }

        speed = (speed > 0) ? speed : 500;
        opacity = (opacity > 0) ? opacity : 0.5;

        var _css = [{
            display: 'block',
            height: $(document).height() + 'px',
            left: '0px',
            opacity: 0,
            position: 'absolute',
            top: '0px',
            width: '100%'
        },{
            display: 'block',
            opacity: 0,
            height: $(document).height()
        }];

        if(!this.WMSOverlay) {
            this.WMSOverlay = this('<div></div>').attr({
                id: 'dimScreen'
            }).css(_css[0]).appendTo(document.body);
            $.data($.WMSOverlay[0], 'options', { fade_opacity: opacity, speed: speed});

        } else {
            this.WMSOverlay.css(_css[1]);
            if(this.WMSOverlayFix){
                this.WMSOverlayFix.css(_css[1]);
            }
        }

        $(window).bind('resize', resizeCheck);


        this.WMSOverlay.fadeTo(speed, opacity, callback);
        this.WMSOverlay.visible = 1;
        return this.WMSOverlay;
    };

    //stops current dimming of the screen
    $.hideModalOverlay = function(callback) {
        var x = this.WMSOverlay;
        var opt = $.data($.WMSOverlay[0], 'options');
        var opacity = opt.fade_opacity;
        var speed = window.ie6 ? 0 : opt.speed;
        x.fadeOut(speed, function() {
            if($.WMSOverlayFix){
                $.WMSOverlayFix.css({
                    display: 'none'
                });
            };
            if(typeof callback == 'function') callback();
        });
        $(window).unbind('resize', resizeCheck);
        this.WMSOverlay.visible = 0;
    }

})(jQuery);

visualHUD.Libs.colorHelper = (function() {
    var preventMouseleave = false;
    var currentColorCell;
    var colorInput;
    var currentColor;
    var paletteElements;
    var activeElement;
    var colorpicker = null;

    var colorPresets = [
        "FFFFFF","FF8AD8","FF928A","FFBA8A","fccc30","FDFF8A","DAFF58","a1fb6e","7ff7e0","54cdf5","5ba8f5","5537ff","a053ed",
        "CCCCCC","FF00BA","FF0000","F06300","FFA000","ECF000","BBF000","56F000","00F0C1","00B4F0","0077F0","2e15f1","732fbe",
        "999999","CC0087","CC0E00","CC5400","CC7F00","C9CC00","9FCC00","4ACC00","00CCA4","0099CC","0065CC","1a05c4","501a8c",
        "666666","990066","990A00","993F00","996000","979900","789900","389900","00997B","007399","004C99","1100a0","391166",
        "333333","660043","660700","662A00","664000","646600","506600","256600","006652","004C66","003266","0c0073","250b41",
        "000000","330021","330400","331500","332000","323300","273300","123300","003329","002633","001933","060033","190033"
    ];

    return {
        setupColorPicker: function(area){
            if(colorpicker == null) {
                var $body = $(document.body);
                var paletteTpl = ([
                    '<% _.each(colors, function(color) { %>',
                    '<div class="color-cell" style="background-color:#<%= color %>"><input type="hidden" value="<%= color %>" name="color"/></div>',
                    '<% }); %>'
                ]).join('');

                var menuEventsHandler = this.menuEventsHandler;

                $(area).on('click', 'div.color-picker-box', visualHUD.Function.bind(this.showColorPicker, this));
                $(area).on('click', 'input.color-input', visualHUD.Function.bind(this.showColorPicker, this));
                $(area).on('change', 'input.color-input', visualHUD.Function.bind(this.updateColor, this));

                colorpicker = new visualHUD.Widgets.PopOver({
                    scope: this,
                    position: 'left-center',
                    html: _.template(paletteTpl, {
                        colors: colorPresets
                    }),
                    render: function(popOver) {
                        paletteElements = popOver.$content.find('div.color-cell');

                        popOver.$el.addClass('color-picker-popover')
                        popOver.$content.on('mouseover mouseout click', 'div.color-cell', visualHUD.Function.bind(menuEventsHandler, this));
                        popOver.$title.hide();
                    },
                    hide: function() {
                        currentColorCell && currentColorCell.removeClass('active-color');
                    }
                });
            }
        },

        menuEventsHandler: function(event) {
            if(activeElement) {

                var $colorCell = $(event.currentTarget);
                var color = $colorCell.find('input[name=color]').val().toUpperCase();
                var hoverFn = event.type == 'mouseout' || event.type == 'click' ? 'removeClass' : 'addClass';

                if (event.type == 'mouseover' && colorpicker.visible == true) {
                    colorpicker.setTitle('#' + color);
                    colorInput.val(color);
                    activeElement.css('backgroundColor', '#' + color);
                }

                if(event.type == 'mouseout' && colorpicker.visible == true){
                    colorpicker.setTitle('#' + currentColor);
                    colorInput.val(currentColor);
                    activeElement.css('backgroundColor', '#' + currentColor);
                }

                $colorCell[hoverFn]('color-cell-hover');

                if(event.type == 'click') {
                    colorpicker.hide();

                    preventMouseleave = true;
                    colorInput.trigger('change');

                    return false
                }

                preventMouseleave = false;
            }
        },

        showColorPicker: function(event) {
            paletteElements.filter('.active-color').removeClass('active-color');

            if(colorpicker.visible == true && activeElement && activeElement.get(0) == event.currentTarget) {
                colorpicker.hide();
            }
            else {
                activeElement = $(event.currentTarget);

                if(activeElement.is('input.color-input')) {
                    colorInput = activeElement;
                    activeElement = activeElement.next('div.color-picker-box')
                }
                else {
                    colorInput = activeElement.prev('input.color-input');
                }

                currentColor = colorInput.val();

                paletteElements.each(function() {
                    var $el = $(this);
                    var dataColor = String($el.data('color'));

                    if(dataColor.toUpperCase() == currentColor.toUpperCase()) {
                        $el.addClass('active-color');
                        currentColorCell = $el;
                        return false;
                    }
                });
                colorpicker.setTitle('#' + currentColor);
                colorpicker.show(colorInput, event);

            }
        },

        updateColor: function(event) {
            var input = $(event.currentTarget);
            var color = '';

            try{
                color = $.color('#' + input.val());
                colorpicker.hide();
                activeElement.css('backgroundColor', color.hex);
            }
            catch(e) {

            }
        }
    }
})();

visualHUD.Libs.importHelper = {
    checkImageSize: function(file) {
        if (file.size >= visualHUD.MAX_BACKGROUND_SIZE){
            visualHUD.growl.alert({
                status: 'warning',
                title: 'Maximum file size exceeded',
                message: _.template(visualHUD.messages.LARGE_IMAGE_WARNING, {
                    imageSize: Math.floor(file.size/1024) + 'kb',
                    maxSize: Math.floor(visualHUD.MAX_BACKGROUND_SIZE / 1024) + 'kb'
                })
            });
            return false;
        }
        
        return true;
    },
    
    checkImageType: function(file) {
        if (!file.type.match('image.*')){
            visualHUD.growl.alert({
                status: 'warning',
                title: 'Unsupported file detected',
                message: _.template(visualHUD.messages.UNSUPPORTED_IMAGE_FORMAT, {
                    imageType: file.type || 'unknown'
                })
            });
            return false;
        }
        
        return true;
    },
    
    checkTextType: function(file) {
    },

    batchImport: function(files, callback) {
        var batch = [],
            reader = new FileReader(),
            imageProcessed = false,
            callback = _.extend({
                scope: this,
                image: false,
                files: false
            }, callback || {}),
            scope = callback.scope;

        var processFile = function(file) {
            if(file.type.match('image.*') && visualHUD.Libs.importHelper.checkImageSize(file) == true && imageProcessed == false) {
                reader.onload = visualHUD.Function.bind(processImage, this, [file], true);
                reader.readAsDataURL(file);
            }

            if(file.type.match('text.*') || file.name.match('vhud$')) {
                reader.onload = visualHUD.Function.bind(processText, this, [file], true);
                reader.readAsText(file);
            }
        };

        var processImage = function(event) {
            imageProcessed = true;
            callback.image && callback.image.call(scope, event.target.result);

        };

        var processText = function(event, file) {
            var fileName = file.name.split('.');
            fileName.pop();

            batch.push({
                name: fileName.join('.'),
                json: event.target.result
            });

            if(files.length > 0) {
                processFile.call(this, files.shift());
            }
            else {
                callback.files && callback.files.call(scope, batch);
            }
        };

        if(files.length) {
            processFile.call(this, files.shift());
        }
    }
}

/**
 * Drag Zone is a basic event handler and flexible interface to support mouse move interaction
 * @param options
 * @constructor
 */
visualHUD.Utils.DragZoneBase = function(options) {
    options = _.extend({}, this.defaults, options || {});
    this.setOptions(options);
    this.initialize.apply(this, arguments);
}

_.extend(visualHUD.Utils.DragZoneBase.prototype, {
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
            this.options.init.apply(this.scope, [this]);
        }

        return this;
    },

    /**
     * This method should be called manually in order to start drag action
     * @param {Event} event
     * @param {jQuery} element
     */
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
});

visualHUD.Models.ClientSettings = Backbone.Model.extend({
    defaults: {
        'HUDName': null,
        'scaleFactor': 1,
        'fullScreenView': false,
        'pinSidebar': true,
        'lagometr': false,
        'speedometr': false,
        'pickup': false,
        'snapGrid': '0',
        'drawGrid': '0',
        'drawGun': '1',
        'drawWeaponbar': '1',
        'drawTeamoverlay': '0',
        'canvasShot': '1',
        'statusSkill': '90',
        'statusAccuracy': '47',
        'statusHealth': '200',
        'statusArmor': '100',
        'statusAmmo': '25',
        'customBackground': null
    },

    initialize: function() {
        var savedSettings = window.localStorage.getItem('vhudClient');
        if(savedSettings !== null) {
            savedSettings = JSON.parse(savedSettings)
            this.set(savedSettings)
        }
        this.on('change', this.save, this);
    },

    save: function() {
        var data = this.toJSON();
        var reset = {
            fullScreenView: false
        };
        _.extend(data, reset);

        window.localStorage.setItem('vhudClient', JSON.stringify(data));
    },

    reset: function() {
        this.set(this.defaults);
        this.save();
    },

    getStatusByName: function(name) {
        switch(name) {
            case 'armorIndicator':
            case 'armorbar': {
                return this.get('statusArmor')
                break;
            }
            case 'ammoIndicator': {
                return this.get('statusAmmo')
                break;
            }
            case 'healthIndicator':
            case 'healthBar':{
                return this.get('statusHealth')
                break;
            }
            case 'accuracyIndicator': {
                return this.get('statusAccuracy');
                break;
            }
            case 'skillIndicator': {
                return this.get('statusSkill');
                break;
            }
        }

        return null;
    }
});

visualHUD.Models.HUDItem = Backbone.Model.extend({
    defaults: {
        'index': 0,
        'itemType': null,
        'iconPosition': null,
        'iconSpacing': null,
        'iconOpacity': null,
        'iconSize': null,
        'iconStyle': null,
        'textSize': null,
        'textOpacity': null,
        'textStyle': null,
        'textColor': 'FFFFFF',
        'teamColors': null,
        'colorRanges': null,
        'coordinates': {
            top: 0,
            left: 0,
            width: null,
            height: null
        },
        'iconCoordinates': {},
        'textCoordinates': {},
        'cssClass': null,
        'label': null,
        'name': null,
        'text': null,
        'borderRadius': 0,
        'boxStyle': 0,
        'template': null,
        'singlePowerup': true,
        'padding': null,
        'toggleChat': null,
        'scoreboxLayout': null,
        'scoreboxMode': null,
        'barDirection': null,
        'resizable': false,
        'group': null,
        'ownerDrawFlag': ''
    },

    /**
     * Hash Map that contains item specific defaults by name
     */
    defaultsByName: {
        'chatArea':{
            coordinates: {
                top: 245,
                left: 0,
                width: 640,
                height: 160
            },
            showChat: false,
            color: '000000',
            opacity: 75,
            padding: 3,
            width: 640,
            height: 160,
            minWidth: 1,
            minHeight: 1,
            maxWidth: 640,
            maxHeight: 480,
            boxStyle: 2,
            borderRadius: 0
        },
        'timer': {
            colorRanges: [],
            text: '2:47'
        },
        'ammoIndicator': {
            colorRanges: [
                {
                    name: 'Low',
                    color: 'FF0000',
                    range: [-999, 5]
                },
                {
                    name: 'Normal',
                    color: 'FFFFFF',
                    range: [6,100]
                },
                {
                    name: 'Hight',
                    color: 'FFFFFF',
                    range: [101, 999]
                }
            ]
        },
        'skillIndicator': {
            colorRanges: [
                {
                    name: 'Low',
                    color: '56F000',
                    range: [0, 33]
                },
                {
                    name: 'Normal',
                    color: 'ECF000',
                    range: [34,66]
                },
                {
                    name: 'Hight',
                    color: 'CC0E00',
                    range: [67, 999]
                }
            ],
            template: 'Skill rating',
            textSize: 20,
            textStyle: 0,
            textColor: 'FFFFFF',
            text: 100,
            ownerDraw: '0',
            textOpacity: 100
        },
        'medal': {
            text: '27',
            colorRanges: [],
            ownerDrawFlag: 0,
            textStyle: 0,
            textSize: 50
        },
        'powerupIndicator': {
            colorRanges: [],
            layout: 'vertical',
            iconStyle: null,
            iconSize: 24,
            textSize: 55,
            iconSpacing: 4,
            text: '32'
        },
        'scoreBox': {
            scoreboxLayout: 'vertical',
            iconSpacing: 2,
            iconStyle: 0,
            scoreboxMode: 'ffa'
        }
    },

    /**
     * Hash Map that contains item specific defaults by itemType
     */
    defaultsByType: {
        'general': {
            colorRanges: [
                {
                    name: 'Low',
                    color: 'FF0000',
                    range: [-999, 25]
                },
                {
                    name: 'Normal',
                    color: 'FCCC30',
                    range: [26,100]
                },
                {
                    name: 'Hight',
                    color: 'FFFFFF',
                    range: [101, 999]
                }
            ],
            iconPosition: 'left',
            iconSpacing: 10,
            iconOpacity: 100,
            iconSize: 32,
            iconStyle: 0,
            textSize: 100,
            textOpacity: 100,
            textStyle: '3',
            teamColors: true
        },
        'iconItem': {
            iconStyle: 0,
            iconSize: 24,
            iconOpacity: 100
        },
        'scoreBox': {
            mode: 'ffa',
            spacing: 1,
            iconSpacing: 10//  horisontal || vertical
        },
        'flagIndicator':{
            iconStyle: 0,
            iconSize: 32,
            iconOpacity: 100
        },
        'obits': {
            iconStyle: 0,
            iconSize: null,
            text: ['Klesk', 'Xaero']
        },
        'rect':{
            color: 'FFFFFF',
            opacity: 100,
            width: 100,
            height: 100,
            minWidth: 1,
            minHeight: 1,
            maxWidth: 640,
            maxHeight: 480,
            teamColors: false,
            boxStyle: 0,
            hairLine: 0,
            borderRadius: 0,
            coordinates: {
                width: 100,
                height: 100
            },
            resizable: true
        },

        'bar': {
            colorRanges: [
                {
                    name: 'Low',
                    color: 'FF0000',
                    range: [-999, 25]
                },
                {
                    name: 'Normal',
                    color: 'FFFFFF',
                    range: [26,100]
                },
                {
                    name: 'Hight',
                    color: 'FFA000',
                    range: [101, 999]
                }
            ],
            color: '000000',
            opacity: 30,
            width: 100,
            height: 24,
            minWidth: 1,
            minHeight: 1,
            maxWidth: 640,
            maxHeight: 100,
            padding: 0,
            barsOpacity: 70,
            text: 125,
            barDirection: 0,
            coordinates: {
                width: 100,
                height: 24
            },
            resizable: true
        }
    },

    initialize: function(options) {
        this.legacyCleanUp();
    },

    /**
     * Set defaults for newly created item
     * @param options
     * @return {visualHUD.Models.HUDItem}
     */
    setDefaultValues: function(options) {
        var defaultValuesByType = this.getDefaultsByType(options.itemType) || {},
            defaultValuesByName = this.getDefaultsByName(options.name) || {};

        // mix defaults in particular order, from more generic to more specific
        _.extend(this.attributes, options, defaultValuesByType, defaultValuesByName);



        return this;
    },

    getDefaultsByType: function(type) {
        return this.defaultsByType[type] || null;
    },

    getDefaultsByName: function(type) {
        return this.defaultsByName[type] || null;
    },

    legacyCleanUp: function() {
        var data = this.attributes;

        // always reset obits to their default values
        if(data.itemType == 'obits') {
            this.set(this.getDefaultsByType(data.itemType), {silent: true});
        }

        if(data.name == 'scoreBox') {
            if('scoreboxStyle' in data) {
                this.set({'iconStyle': data.scoreboxStyle}, {silent: true});
                delete datascoreboxStyle;
            }

            if('spacing' in data) {
                this.set({'iconSpacing': data.spacing}, {silent: true});
                delete data.spacing;
            }

            if('layout' in data) {
                this.set({'scoreboxLayout': data.layout}, {silent: true});
                delete data.layout;
            }

            if('mode' in data) {
                this.set({'scoreboxMode': data.mode}, {silent: true});
                delete data.mode;
            }
        }

        if(data.name == 'powerupIndicator' && data.iconStyle != null) {
            this.set({'iconStyle': null}, {silent: true});
        }

        if(data.name == 'skillIndicator' && 'opacity' in data) {
            this.set({'textOpacity': data.opacity}, {silent: true});
            delete data.opacity;
        }

        if('rbox' in data) {
            delete data.rbox;
        }

        if('iconCoordinates' in data) {
            delete data.iconCoordinates;
        }

        if('textCoordinates' in data) {
            delete data.textCoordinates;
        }
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

visualHUD.Collections.HUDItemIconEnums = visualHUD.Collections.DictionaryAbstract.extend({
    getData: function() {
        return [
            {
                id: 'armorIndicator',
                options: [
                    {
                        name: 'QL Armor',
                        url: 'resources/images/icons/armor.png'

                    },
                    {
                        name: 'Q3A Armor',
                        url: 'resources/images/icons/iconr_red.png'
                    }
                ]
            },
            {
                id: 'healthIndicator',
                options: [
                    {
                        name: 'QL Health',
                        url: 'resources/images/icons/health.png'

                    },
                    {
                        name: 'Head icon',
                        url: 'resources/images/icons/icon_head.png'
                    }
                ]
            },
            {
                id: 'ammoIndicator',
                options: [
                    {
                        name: 'Rocketlauncher',
                        url: 'resources/images/icons/iconw_rocket.png'
                    }
                ]
            },
            {
                id: 'powerupIndicator',
                options: [
                    {
                        name: 'Quad',
                        url:'resources/images/icons/quad.png'
                    },
                    {
                        name: 'Regeneration',
                        url:'resources/images/icons/regen.png'
                    }
                ]
            },
            {
                id: 'accuracyIndicator',
                options: [
                    {
                        name: 'Accuracy medal',
                        url:'resources/images/icons/medal_accuracy.png'
                    }
                ]
            },
            {
                id: 'CTFPowerupIndicator',
                options: [
                    {
                        name: 'Scout',
                        url:'resources/images/icons/scout.png'
                    }
                ]
            },

            {
                id: 'scoreBox',
                options: [
                    {
                        name: 'Classic Full',
                        url: null
                    },
                    {
                        name: 'Classic Small',
                        url: null
                    },
                    {
                        name: 'Compact',
                        url: null
                    }
                ]
            },
            {
                id: 'timer',
                options: [
                    {
                        name: 'Clock',
                        url:'resources/images/icons/icon_time.png'
                    }
                ]
            },
            {
                id: 'playerItem',
                options: [
                    {
                        name: 'Medkit',
                        url:'resources/images/icons/medkit.png'
                    }
                ]
            },
            {
                id: 'obits',
                options: [
                    {
                        name: 'Rocketlauncher',
                        url: 'resources/images/icons/iconw_rocket.png'
                    }
                ]
            },
            {
                id: 'flagIndicator',
                options: [
                    {
                        name: 'Flag 1',
                        url:'resources/images/icons/flag.png'
                    },
                    {
                        name: 'Flag 2',
                        url:'resources/images/icons/iconf_blu1.png'
                    },
                    {
                        name: 'Flag 3',
                        url:'resources/images/icons/flag_3_1.png'
                    },
                    {
                        name: 'Flag 4',
                        url:'resources/images/icons/flag_3_2.png'
                    }]
            },
            {
                id: 'skillIndicator',
                options: []
            },
            {
                id: 'medal',
                options: [
                    {
                        name: 'Accuracy medal',
                        url:'resources/images/icons/medal_accuracy.png'
                    },
                    {
                        name: 'Gauntlet medal',
                        url:'resources/images/icons/medal_gauntlet.png'
                    },
                    {
                        name: 'Excellent medal',
                        url:'resources/images/icons/medal_excellent.png'
                    },
                    {
                        name: 'Impressive medal',
                        url:'resources/images/icons/medal_impressive.png'
                    },
                    {
                        name: 'Captures medal',
                        url:'resources/images/icons/medal_capture.png'
                    },
                    {
                        name: 'Assist medal',
                        url:'resources/images/icons/medal_assist.png'
                    },
                    {
                        name: 'Defend medal',
                        url:'resources/images/icons/medal_defend.png'
                    }
                ]
            }
        ];
    }
});

visualHUD.Collections.HUDItems = Backbone.Collection.extend({
    name: 'HUDItems',
    LOCAL_STORAGE_KEY: 'HUDItems',
    model: visualHUD.Models.HUDItem,

    /**
     * Setup autosave when window unload event is fired
     */
    initialize: function() {
        this.on('add', this.setIndex, this);
        this.on('load', this.updateIndexes, this);
		this.on('change:ownerDrawFlag', function(model, event) {
			this.filter && this.filterItemsByOwnerDraw(this.filter);
		}, this);
        $(window).unload(visualHUD.Function.bind(this.save, this, []));
    },

    /**
     * Save collection data to the localStorage object
     */
    save: function() {
        var data = this.toJSON();
        window.localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(data));
    },

    /**
     * Load collection from localStorage
     * Triggers 'load' event
     */
    load: function(data) {
        var data = data || window.localStorage.getItem(this.LOCAL_STORAGE_KEY),
            success = false;

        if(_.isString(data)) {
            try {
                data = JSON.parse(data);
            }
            catch(e) {
                console.warn('Invalid HUD JSON data');
            }
        }

        if(data && data.length) {
            try {
                this.reset(data, {silent: true});
                this.cleanDefaultChat();
                success = true;
            }
            catch(e) {
                console.warn('Invalid HUD data');
            }
        }

        this.trigger('load', success);
    },

    setIndex: function(model) {
        model.set('index', this.length, {silent: true});
    },

    updateIndexes: function() {
        this.each(function(model, i) {
            model.set('index', i, {silent: true});
        });
    },

    comparator: function(model) {
        return model.get('index');
    },

    cleanDefaultChat: function() {
        var defaultChat = this.where({
            name: 'chatArea',
            isDefaultChat: true
        });
        if(defaultChat.length) {
            this.remove(defaultChat, {silent: true});
        }
    },

    /**
     * Prepare data for HUD download
     * @return {Array}
     */
    serialize: function() {
        this.sort();

        var outputData = [],
            defaultChat = new this.model();

        defaultChat.setDefaultValues({
            isDefaultChat: true,
            itemType: 'chatArea',
            name: 'chatArea'
        });

        this.each(function(record) {
            var HUDItemView = record._HUDItem,
                data = record.toJSON(),
                refs = HUDItemView.getDOMRefs();

            if(data.itemType == 'general'){
                data.iconCoordinates = {
                    top: refs.iconBlock[0].offsetTop / visualHUD.scaleFactor,
                    left: refs.iconBlock[0].offsetLeft / visualHUD.scaleFactor,
                    width: refs.iconBlock.eq(0).width() / visualHUD.scaleFactor,
                    height: refs.iconBlock.eq(0).height() / visualHUD.scaleFactor
                };
                data.textCoordinates = {
                    top: refs.textBlock[0].offsetTop / visualHUD.scaleFactor,
                    left: refs.textBlock[0].offsetLeft / visualHUD.scaleFactor,
                    width: refs.textBlock.eq(0).width() / visualHUD.scaleFactor,
                    height: refs.textBlock.eq(0).height() / visualHUD.scaleFactor
                };
            }

            if(data.itemType == 'textItem'){
                data.textCoordinates = {
                    top: refs.templateText[0].offsetTop / visualHUD.scaleFactor,
                    left: refs.templateText[0].offsetLeft / visualHUD.scaleFactor,
                    width: refs.templateText.eq(0).width() / visualHUD.scaleFactor,
                    height: refs.templateText.eq(0).height() / visualHUD.scaleFactor
                }
                data.counterCoordinates = {
                    top: refs.counter[0].offsetTop / visualHUD.scaleFactor,
                    left: refs.counter[0].offsetLeft / visualHUD.scaleFactor,
                    width: refs.counter.eq(0).width() / visualHUD.scaleFactor,
                    height: refs.counter.eq(0).height() / visualHUD.scaleFactor
                };
            }

            if(data.itemType == 'rect'){
                var borderRadius = parseInt(data.borderRadius, 10);
                if(borderRadius > 0) {
                    data.boxStyle = 0;
                    data.rbox = visualHUD.Libs.utility.getRCornersMarkup(data);
                }
            }

            if(data.name == 'chatArea') {
                defaultChat = null;
            }

            outputData.push(data);
        });

        defaultChat && outputData.push(defaultChat.toJSON());
        defaultChat = null;

        return outputData;
    },
	
	filterItemsByOwnerDraw: function(value) {
        this.each(function(record) {
            var HUDItemView = record._HUDItem,
                flagValue = record.get('ownerDrawFlag'),
                refs = HUDItemView.getDOMRefs();
			
			if(value == '' || flagValue == value || flagValue == '') {
				HUDItemView.show();
			}
			else {
				HUDItemView.hide();
			}
		});
		
		this.filter = value;
	}
});

visualHUD.Collections.HUDItemTemplates = visualHUD.Collections.DictionaryAbstract.extend({
    getData: function() {

        var getGeneralItemTemplate = function() {
            return [
                '<div class="item-icon"><img src="<%= icon.url %>"/></div>',
                '<div class="item-counter"><span class="counter"><%= text %></span></div>'
            ]
        }

        var getIconItemTemplate = function() {
            return [
                '<div class="item-icon"><img src="<%= icon.url %>"/></div>'
            ]
        }

        var getBarTemplate = function() {
            return [
                '<div class="hud-item-box">',
                '<div class="h-bar h100"><div class="h-bar h200"></div></div>',
                '</div>'
            ]
        }
        return [
            {
                'id': 'healthIndicator',
                'itemType': 'general',
                'cssClass': '',
                'template': getGeneralItemTemplate()
            },
            {
                'id': 'healthBar',
                'itemType': 'bar',
                'cssClass': 'health-bar',
                'template': getBarTemplate()
            },
            {
                'id': 'armorIndicator',
                'itemType': 'general',
                'cssClass': '',
                'template': getGeneralItemTemplate()
            },
            {
                'id': 'armorBar',
                'itemType': 'bar',
                'cssClass': 'armor-bar',
                'template': getBarTemplate()
            },

            {
                'id': 'ammoIndicator',
                'itemType': 'general',
                'cssClass': '',
                'template': getGeneralItemTemplate()
            },
            {
                'id': 'timer',
                'itemType': 'general',
                'cssClass': '',
                'template': getGeneralItemTemplate()
            },
            {
                'id': 'powerupIndicator',
                'itemType': 'general',
                'cssClass': '',
                'template': [
                    '<div class="powerups-wrapper">',
                        '<div class="powerup-item">',
                            '<div class="item-icon"><img src="<%= icon[0].url %>"/></div> ',
                            '<div class="item-counter"><span class="counter"><%= text %></a></span></div>',
                        '</div>',
                        '<div class="powerup-item">',
                            '<div class="item-icon"><img src="<%= icon[1].url %>"/></div> ',
                            '<div class="item-counter"><span class="counter"><%= text %></a></span></div>',
                        '</div>',
                    '</div>'
                ]
            },
            {
                'id': 'scoreBox',
                'itemType': 'scoreBox',
                'cssClass': 'scorebox-item',
                'template': [
                    '<div class="item-icon team-red"></div><div class="item-icon team-blue"></div>'
                ]
            },
            {
                'id': 'playerItem',
                'itemType': 'iconItem',
                'cssClass': 'icon-item ',
                'template': getIconItemTemplate()
            },
            {
                'id': 'CTFPowerupIndicator',
                'itemType': 'iconItem',
                'cssClass': 'icon-item ',
                'template': getIconItemTemplate()
            },
            {
                'id': 'obits',
                'itemType': 'obits',
                'cssClass': 'obit-item',
                'template': [
                    '<div class="item-counter"><span class="counter"><%= text[0] %></span></div>',
                    '<div class="item-icon"><img src="<%= icon.url %>"/></div>',
                    '<div class="item-counter"><span class="counter"><%= text[1] %></span></div>'
                ]
            },
            {
                'id': 'flagIndicator',
                'itemType': 'iconItem',
                'cssClass': 'icon-item ',
                'template': getIconItemTemplate()
            },

            {
                'id': 'rectangleBox',
                'itemType': 'rect',
                'template': [
                    '<div class="hud-item-box"></div>'
                ]
            },

            {
                'id': 'medal',
                'itemType': 'general',
                'cssClass': 'accuracy',
                'template': getGeneralItemTemplate()
            },
            {
                'id': 'skillIndicator',
                'itemType': 'textItem',
                'cssClass': 'skill-item',
                'template': [
                    '<div class="item-counter">',
                    '<span class="text"><%= template %></a></span>',
                    '<span class="counter"><%= text %></a></span>',
                    '</div>'
                ]
            },
            {
                'id': 'chatArea',
                'itemType': 'chatArea',
                'cssClass': 'chat-area',
                template: [
                    '<div class="hud-item-box">',
                    '<ul class="chat-messages">',
                        '<li class="message-0">',
                            '<span class="name"><span style="color: Red" class="mr-5">bwt</span><span style="color: white">namad</span>:</span><span class="message">quad in 30 seconds, team</span>',
                        '</li>',
                        '<li class="message-1">',
                            '<span class="name"><span style="color: Red" class="mr-5">bwt</span><span style="color: #3266fe">kN</span><span style="color: Red">a</span><span style="color: #3a63e9">kHstR</span>:</span><span class="message">WTF???</span>',
                        '</li>',
                        '<li class="message-2">',
                            '&lt;QUAKE LIVE&gt; <span style="color: Cyan">Ancest0R</span> has gone offline' +
                        '</li>',
                        '<li class="message-4">',
                            'fatal<span style="color: Red">1</span>ty connected' +
                        '</li>',
                        '<li class="message-5">',
                            'fatal<span style="color: Red">1</span>ty entered the game' +
                        '</li>',
                        '<li class="message-3">',
                            '<span class="name">fatal<span style="color: Red">1</span>ty:</span><span class="message">ready to get pwned? ;)</span></li>',
                        '<li class="message-6">',
                            '<span class="name"><span style="color: Red" class="mr-5">bwt</span><span style="color: white">namad</span>:</span><span class="message">byte my shiny metal ass!</span>',
                        '</li>',
                    '</ul>',
                    '</div>'
                ]
            }
        ]
    }
});

visualHUD.Collections.StageControlsDictionary = visualHUD.Collections.DictionaryAbstract.extend({
    getData: function() {
        return [
            {
                'id': 'healthIndicator',
                'itemType': 'general',
                'cssClass': 'lib-element-health',
                'label': 'Health indicator'
            },
            {
                'id': 'healthBar',
                'name': 'healthBar',
                'itemType': 'bar',
                'label': 'Health bar',
                'cssClass': 'lib-element-hbar'
            },
            {
                'id': 'armorIndicator',
                'itemType': 'general',
                'cssClass': 'lib-element-armor',
                'label': 'Armor indicator'
            },
            {
                'id': 'armorBar',
                'name': 'armorBar',
                'itemType': 'bar',
                'label': 'Armor bar',
                'cssClass': 'lib-element-abar'
            },

            {
                'id': 'ammoIndicator',
                'itemType': 'general',
                'cssClass': 'lib-element-ammo',
                'label': 'Ammo indicator'
            },
            {
                'id': 'timer',
                'itemType': 'general',
                'cssClass': 'lib-element-timer',
                'label': 'Timer'
            },
            {
                'id': 'powerupIndicator',
                'itemType': 'general',
                'cssClass': 'lib-element-powerup',
                'label': 'Powerup timer'
            },
            {
                'id': 'scoreBox',
                'itemType': 'scoreBox',
                'cssClass': 'lib-element-scorebox',
                'label': 'Scorebox'
            },
            {
                'id': 'playerItem',
                'itemType': 'iconItem',
                'cssClass': 'lib-element-player-item',
                'label': 'Usable item indicator'
            },
            {
                'id': 'CTFPowerupIndicator',
                'itemType': 'iconItem',
                'cssClass': 'lib-element-ctf-powerup',
                'label': 'CTF powerup indicator'
            },
            {
                'id': 'obits',
                'itemType': 'obits',
                'cssClass': 'lib-element-obit',
                'label': 'Graphical obits'
            },
            {
                'id': 'flagIndicator',
                'itemType': 'iconItem',
                'cssClass': 'lib-element-flag',
                'label': 'Flag indicator'
            },



            {
                'id': 'medal',
                'name': 'medal',
                'itemType': 'general',
                'label': 'Medal',
                'cssClass': 'lib-element-medal'
            },
            {
                'id': 'skillIndicator',
                'name': 'skillIndicator',
                'itemType': 'textItem',
                'label': 'Skill Rating Indicator',
                'cssClass': 'lib-element-skill'
            },
            {
                'id': 'chatArea',
                'name': 'chatArea',
                'itemType': 'rect',
                'label': 'Chat area',
                'isSingle': true,
                'cssClass': 'lib-element-chat'
            },
            {
                'id': 'rectangleBox',
                'name': 'rectangleBox',
                'itemType': 'rect',
                'label': 'Rectangle box',
                'cssClass': 'lib-element-rect'
            },
            {
                'id': 'customDefinition',
                'name': 'customDefinition',
                'itemType': 'customDefinition',
                'label': 'Custom Definition',
                'cssClass': 'lib-element-definition'
            }
        ];
    }
});

visualHUD.Collections.HUDPresets = visualHUD.Collections.DictionaryAbstract.extend({
    getData:function () {
        return [
            {
                'id':'largeHUD',
                'isBuiltIn': true,
                'name':'Large_HUD',
                'items':[
                    {
                        "itemType":"general",
                        "cssClass":"lib-element-armor",
                        "label":"Armor indicator",
                        "name":"armorIndicator",
                        "colorRanges":[
                            {
                                "name":"Low",
                                "range":[-999, 25],
                                "color":"FF0000"
                            },
                            {
                                "name":"Normal",
                                "range":[26, 99],
                                "color":"fccc30"
                            },
                            {
                                "name":"High",
                                "range":[100, 999],
                                "color":"FFFFFF"
                            }
                        ],
                        "iconPosition":"left",
                        "iconSpacing":"5",
                        "iconOpacity":100,
                        "iconSize":"18",
                        "iconStyle":0,
                        "textSize":100,
                        "textOpacity":100,
                        "textStyle":3,
                        "teamColors":true,
                        "text":"100",
                        "textColor":"FFFFFF",
                        "coordinates":{
                            "top":435,
                            "left":400,
                            "width":127,
                            "height":35,
                            "right":527,
                            "bottom":471
                        },
                        "iconCoordinates":{
                            "top":8.5,
                            "left":0,
                            "width":18,
                            "height":18,
                            "right":18,
                            "bottom":26.5
                        },
                        "textCoordinates":{
                            "top":0,
                            "left":23,
                            "width":104,
                            "height":35,
                            "right":127,
                            "bottom":35
                        }
                    },
                    {
                        "itemType":"general",
                        "cssClass":"lib-element-ammo",
                        "label":"Ammo indicator",
                        "name":"ammoIndicator",
                        "colorRanges":[
                            {
                                "name":"Low",
                                "range":[-999, 5],
                                "color":"FF0000"
                            },
                            {
                                "name":"Normal",
                                "range":[5, 99],
                                "color":"FFFFFF"
                            },
                            {
                                "name":"High",
                                "range":[100, 999],
                                "color":"FFFFFF"
                            }
                        ],
                        "iconPosition":"left",
                        "iconSpacing":"0",
                        "iconOpacity":100,
                        "iconSize":"16",
                        "iconStyle":0,
                        "textSize":"65",
                        "textOpacity":100,
                        "textStyle":3,
                        "teamColors":true,
                        "text":"25",
                        "textColor":"FFFFFF",
                        "coordinates":{
                            "top":442,
                            "left":113,
                            "width":83,
                            "height":22,
                            "right":196,
                            "bottom":464
                        },
                        "iconCoordinates":{
                            "top":3,
                            "left":0,
                            "width":16,
                            "height":16,
                            "right":16,
                            "bottom":19
                        },
                        "textCoordinates":{
                            "top":0,
                            "left":16,
                            "width":67,
                            "height":22,
                            "right":83,
                            "bottom":22
                        }
                    },
                    {
                        "itemType":"general",
                        "cssClass":"lib-element-timer",
                        "label":"Timer",
                        "name":"timer",
                        "iconPosition":"left",
                        "iconSpacing":10,
                        "iconOpacity":100,
                        "iconSize":"0",
                        "iconStyle":0,
                        "textSize":"60",
                        "textOpacity":100,
                        "textStyle":3,
                        "teamColors":true,
                        "text":"0:00",
                        "textColor":"FFFFFF",
                        "coordinates":{
                            "top":3,
                            "left":250,
                            "width":72,
                            "height":21,
                            "right":322,
                            "bottom":24
                        },
                        "iconCoordinates":{
                            "top":0,
                            "left":0,
                            "width":0,
                            "height":0,
                            "right":0,
                            "bottom":0
                        },
                        "textCoordinates":{
                            "top":0,
                            "left":0,
                            "width":72,
                            "height":21,
                            "right":72,
                            "bottom":21
                        }
                    },
                    {
                        "itemType":"scoreBox",
                        "cssClass":"lib-element-scorebox",
                        "label":"Scorebox",
                        "name":"scoreBox",
                        "scoreboxStyle":2,
                        "layout":"vertical",
                        "mode":"ffa",
                        "spacing":1,
                        "iconSpacing":10,
                        "coordinates":{
                            "top":436,
                            "left":585,
                            "width":50,
                            "height":33,
                            "right":635,
                            "bottom":469
                        }
                    },
                    {
                        "itemType":"general",
                        "cssClass":"lib-element-powerup",
                        "label":"Powerup timer",
                        "name":"powerupIndicator",
                        "iconPosition":"top",
                        "iconSpacing":4,
                        "iconOpacity":100,
                        "iconSize":24,
                        "iconStyle":0,
                        "textSize":55,
                        "textOpacity":100,
                        "textStyle":3,
                        "teamColors":true,
                        "text":"32",
                        "layout":"vertical",
                        "textColor":"FFFFFF",
                        "singlePowerup":false,
                        "coordinates":{
                            "top":240,
                            "left":571,
                            "width":62,
                            "height":28,
                            "right":633,
                            "bottom":268
                        },
                        "iconCoordinates":{
                            "top":0,
                            "left":0,
                            "width":24,
                            "height":24,
                            "right":24,
                            "bottom":24
                        },
                        "textCoordinates":{
                            "top":5,
                            "left":28,
                            "width":34,
                            "height":19,
                            "right":62,
                            "bottom":24
                        }
                    },
                    {
                        "itemType":"iconItem",
                        "cssClass":"lib-element-flag",
                        "label":"Flag indicator",
                        "name":"flagIndicator",
                        "iconStyle":"1",
                        "iconSize":"38",
                        "iconOpacity":100,
                        "coordinates":{
                            "top":434,
                            "left":51,
                            "width":38,
                            "height":38,
                            "right":89,
                            "bottom":472
                        }
                    },
                    {
                        "itemType":"general",
                        "cssClass":"lib-element-health",
                        "label":"Health indicator",
                        "name":"healthIndicator",
                        "colorRanges":[
                            {
                                "name":"Low",
                                "range":[-999, 25],
                                "color":"FF0000"
                            },
                            {
                                "name":"Normal",
                                "range":[26, 100],
                                "color":"fccc30"
                            },
                            {
                                "name":"High",
                                "range":[101, 999],
                                "color":"FFFFFF"
                            }
                        ],
                        "iconPosition":"left",
                        "iconSpacing":"5",
                        "iconOpacity":100,
                        "iconSize":"18",
                        "iconStyle":0,
                        "textSize":100,
                        "textOpacity":100,
                        "textStyle":3,
                        "teamColors":true,
                        "text":"100",
                        "textColor":"fccc30",
                        "coordinates":{
                            "top":435,
                            "left":243,
                            "width":127,
                            "height":35,
                            "right":370,
                            "bottom":470
                        },
                        "iconCoordinates":{
                            "top":8.5,
                            "left":0,
                            "width":18,
                            "height":18,
                            "right":18,
                            "bottom":26.5
                        },
                        "textCoordinates":{
                            "top":0,
                            "left":23,
                            "width":104,
                            "height":35,
                            "right":127,
                            "bottom":35
                        }
                    },
                    {
                        "itemType":"iconItem",
                        "cssClass":"lib-element-ctf-powerup",
                        "label":"CTF powerup indicator",
                        "name":"CTFPowerupIndicator",
                        "iconStyle":0,
                        "iconSize":16,
                        "iconOpacity":100,
                        "coordinates":{
                            "top":455,
                            "left":5,
                            "width":16,
                            "height":16,
                            "right":21,
                            "bottom":471
                        }
                    },
                    {
                        "itemType":"iconItem",
                        "cssClass":"lib-element-player-item",
                        "label":"Usable item indicator",
                        "name":"playerItem",
                        "iconStyle":0,
                        "iconSize":16,
                        "iconOpacity":100,
                        "coordinates":{
                            "top":435,
                            "left":5,
                            "width":16,
                            "height":16,
                            "right":21,
                            "bottom":451
                        }
                    }
                ]
            },
            {
                'id':'smallHUD',
                'isBuiltIn': true,
                'name':'Small_HUD',
                'items':[
                    {
                        "itemType":"rect",
                        "name":"rectangleBox",
                        "label":"Rectangle box",
                        "cssClass":"lib-element-rect",
                        "color":"000000",
                        "opacity":"30",
                        "width":"343",
                        "height":"28",
                        "coordinates":{
                            "top":448,
                            "left":151,
                            "width":343,
                            "height":28,
                            "right":494,
                            "bottom":476
                        },
                        "teamColors":true,
                        "borderRadius":"3",
                        "boxStyle":0
                    },
                    {
                        "itemType":"general",
                        "cssClass":"lib-element-health",
                        "label":"Health indicator",
                        "name":"healthIndicator",
                        "colorRanges":[
                            {
                                "name":"Low",
                                "range":[-999, 25],
                                "color":"FF0000"
                            },
                            {
                                "name":"Normal",
                                "range":[26, 100],
                                "color":"FFFFFF"
                            },
                            {
                                "name":"High",
                                "range":[101, 999],
                                "color":"FFFFFF"
                            }
                        ],
                        "iconPosition":"left",
                        "iconSpacing":"2",
                        "iconOpacity":100,
                        "iconSize":"18",
                        "iconStyle":0,
                        "textSize":"50",
                        "textOpacity":100,
                        "textStyle":3,
                        "teamColors":true,
                        "text":"100",
                        "textColor":"FFFFFF",
                        "coordinates":{
                            "top":453,
                            "left":199,
                            "width":72,
                            "height":18,
                            "right":271,
                            "bottom":471
                        },
                        "iconCoordinates":{
                            "top":0,
                            "left":0,
                            "width":18,
                            "height":18
                        },
                        "textCoordinates":{
                            "top":0,
                            "left":20,
                            "width":52,
                            "height":18
                        }
                    },
                    {
                        "itemType":"general",
                        "cssClass":"lib-element-armor",
                        "label":"Armor indicator",
                        "name":"armorIndicator",
                        "colorRanges":[
                            {
                                "name":"Low",
                                "range":[-999, 25],
                                "color":"FF0000"
                            },
                            {
                                "name":"Normal",
                                "range":[26, 100],
                                "color":"FFFFFF"
                            },
                            {
                                "name":"High",
                                "range":[101, 999],
                                "color":"FFFFFF"
                            }
                        ],
                        "iconPosition":"left",
                        "iconSpacing":"2",
                        "iconOpacity":100,
                        "iconSize":"18",
                        "iconStyle":0,
                        "textSize":"50",
                        "textOpacity":100,
                        "textStyle":3,
                        "teamColors":true,
                        "text":"179",
                        "textColor":"FFFFFF",
                        "coordinates":{
                            "top":453,
                            "left":370,
                            "width":72,
                            "height":18,
                            "right":442,
                            "bottom":471
                        },
                        "iconCoordinates":{
                            "top":0,
                            "left":0,
                            "width":18,
                            "height":18
                        },
                        "textCoordinates":{
                            "top":0,
                            "left":20,
                            "width":52,
                            "height":18
                        }
                    },
                    {
                        "itemType":"general",
                        "cssClass":"lib-element-ammo",
                        "label":"Ammo indicator",
                        "name":"ammoIndicator",
                        "colorRanges":[
                            {
                                "name":"Low",
                                "range":[-999, 5],
                                "color":"FF0000"
                            },
                            {
                                "name":"Normal",
                                "range":[6, 100],
                                "color":"FFFFFF"
                            },
                            {
                                "name":"High",
                                "range":[101, 999],
                                "color":"FFFFFF"
                            }
                        ],
                        "iconPosition":"left",
                        "iconSpacing":"2",
                        "iconOpacity":100,
                        "iconSize":"18",
                        "iconStyle":0,
                        "textSize":"45",
                        "textOpacity":100,
                        "textStyle":3,
                        "teamColors":true,
                        "text":"25",
                        "textColor":"FFFFFF",
                        "coordinates":{
                            "top":453,
                            "left":286,
                            "width":67,
                            "height":18,
                            "right":353,
                            "bottom":471
                        },
                        "iconCoordinates":{
                            "top":0,
                            "left":0,
                            "width":18,
                            "height":18
                        },
                        "textCoordinates":{
                            "top":1,
                            "left":20,
                            "width":47,
                            "height":16
                        }
                    },
                    {
                        "itemType":"general",
                        "cssClass":"lib-element-powerup",
                        "label":"Powerup timer",
                        "name":"powerupIndicator",
                        "iconPosition":"top",
                        "iconSpacing":"0",
                        "iconOpacity":100,
                        "iconSize":"32",
                        "iconStyle":0,
                        "textSize":55,
                        "textOpacity":100,
                        "textStyle":3,
                        "teamColors":true,
                        "text":"32",
                        "layout":"vertical",
                        "textColor":"FFFFFF",
                        "singlePowerup":false,
                        "coordinates":{
                            "top":222,
                            "left":566,
                            "width":62,
                            "height":36,
                            "right":628,
                            "bottom":258
                        },
                        "iconCoordinates":{
                            "top":0,
                            "left":0,
                            "width":32,
                            "height":32
                        },
                        "textCoordinates":{
                            "top":12,
                            "left":36,
                            "width":34,
                            "height":20
                        }
                    },
                    {
                        "itemType":"iconItem",
                        "cssClass":"lib-element-flag",
                        "label":"Flag indicator",
                        "name":"flagIndicator",
                        "iconStyle":"0",
                        "iconSize":"42",
                        "iconOpacity":100,
                        "coordinates":{
                            "top":3,
                            "left":297,
                            "width":42,
                            "height":42,
                            "right":339,
                            "bottom":45
                        }
                    },
                    {
                        "itemType":"iconItem",
                        "cssClass":"lib-element-ctf-powerup",
                        "label":"CTF powerup indicator",
                        "name":"CTFPowerupIndicator",
                        "iconStyle":0,
                        "iconSize":16,
                        "iconOpacity":100,
                        "coordinates":{
                            "top":454,
                            "left":472,
                            "width":16,
                            "height":16,
                            "right":488,
                            "bottom":470
                        }
                    },
                    {
                        "itemType":"iconItem",
                        "cssClass":"lib-element-player-item",
                        "label":"Usable item indicator",
                        "name":"playerItem",
                        "iconStyle":0,
                        "iconSize":16,
                        "iconOpacity":100,
                        "coordinates":{
                            "top":454,
                            "left":157,
                            "width":16,
                            "height":16,
                            "right":173,
                            "bottom":470
                        }
                    },
                    {
                        "itemType":"scoreBox",
                        "cssClass":"lib-element-scorebox",
                        "label":"Scorebox",
                        "name":"scoreBox",
                        "scoreboxStyle":0,
                        "layout":"horizontal",
                        "mode":"ffa",
                        "spacing":1,
                        "iconSpacing":10,
                        "coordinates":{
                            "top":5,
                            "left":5,
                            "width":180,
                            "height":35,
                            "right":185,
                            "bottom":40
                        }
                    },
                    {
                        "itemType":"general",
                        "cssClass":"lib-element-timer",
                        "label":"Timer",
                        "name":"timer",
                        "iconPosition":"left",
                        "iconSpacing":"2",
                        "iconOpacity":100,
                        "iconSize":"14",
                        "iconStyle":0,
                        "textSize":"30",
                        "textOpacity":100,
                        "textStyle":3,
                        "teamColors":true,
                        "text":"0:00",
                        "textColor":"FFFFFF",
                        "coordinates":{
                            "top":48,
                            "left":5,
                            "width":52,
                            "height":14,
                            "right":57,
                            "bottom":62
                        },
                        "iconCoordinates":{
                            "top":0,
                            "left":0,
                            "width":14,
                            "height":14
                        },
                        "textCoordinates":{
                            "top":2,
                            "left":16,
                            "width":36,
                            "height":11
                        }
                    }
                ]
            },
            {
                'id':'defaultHUD',
                'isBuiltIn': true,
                'name':'Normal_HUD',
                'items':[
                    {
                        "itemType":"general",
                        "cssClass":"lib-element-health",
                        "label":"Health indicator",
                        "name":"healthIndicator",
                        "colorRanges":[
                            {
                                "name":"Low",
                                "range":[-999, 25],
                                "color":"FF0000"
                            },
                            {
                                "name":"Normal",
                                "range":[26, 100],
                                "color":"FFFFFF"
                            },
                            {
                                "name":"High",
                                "range":[101, 999],
                                "color":"FFFFFF"
                            }
                        ],
                        "iconPosition":"left",
                        "iconSpacing":10,
                        "iconOpacity":100,
                        "iconSize":"0",
                        "iconStyle":0,
                        "textSize":"70",
                        "textOpacity":100,
                        "textStyle":3,
                        "teamColors":true,
                        "text":"47",
                        "textColor":"FFFFFF",
                        "coordinates":{
                            "top":447,
                            "left":204,
                            "width":73,
                            "height":25,
                            "right":277,
                            "bottom":472
                        },
                        "iconCoordinates":{
                            "top":0,
                            "left":0,
                            "width":0,
                            "height":0
                        },
                        "textCoordinates":{
                            "top":0,
                            "left":0,
                            "width":73,
                            "height":25
                        }
                    },
                    {
                        "itemType":"general",
                        "cssClass":"lib-element-armor",
                        "label":"Armor indicator",
                        "name":"armorIndicator",
                        "colorRanges":[
                            {
                                "name":"Low",
                                "range":[-999, 25],
                                "color":"FF0000"
                            },
                            {
                                "name":"Normal",
                                "range":[26, 100],
                                "color":"FFFFFF"
                            },
                            {
                                "name":"High",
                                "range":[101, 999],
                                "color":"FFFFFF"
                            }
                        ],
                        "iconPosition":"left",
                        "iconSpacing":10,
                        "iconOpacity":100,
                        "iconSize":"0",
                        "iconStyle":0,
                        "textSize":"70",
                        "textOpacity":100,
                        "textStyle":3,
                        "teamColors":true,
                        "text":"55",
                        "textColor":"FFFFFF",
                        "coordinates":{
                            "top":447,
                            "left":365,
                            "width":73,
                            "height":25,
                            "right":438,
                            "bottom":472
                        },
                        "iconCoordinates":{
                            "top":0,
                            "left":0,
                            "width":0,
                            "height":0
                        },
                        "textCoordinates":{
                            "top":0,
                            "left":0,
                            "width":73,
                            "height":25
                        }
                    },
                    {
                        "itemType":"general",
                        "cssClass":"lib-element-ammo",
                        "label":"Ammo indicator",
                        "name":"ammoIndicator",
                        "colorRanges":[
                            {
                                "name":"Low",
                                "range":[-999, 5],
                                "color":"FF0000"
                            },
                            {
                                "name":"Normal",
                                "range":[6, 100],
                                "color":"FFFFFF"
                            },
                            {
                                "name":"High",
                                "range":[101, 999],
                                "color":"FFFFFF"
                            }
                        ],
                        "iconPosition":"bottom",
                        "iconSpacing":"2",
                        "iconOpacity":100,
                        "iconSize":"14",
                        "iconStyle":0,
                        "textSize":"42",
                        "textOpacity":"60",
                        "textStyle":3,
                        "teamColors":true,
                        "text":"23",
                        "textColor":"FFFFFF",
                        "coordinates":{
                            "top":433,
                            "left":300,
                            "width":44,
                            "height":31,
                            "right":344,
                            "bottom":464
                        },
                        "iconCoordinates":{
                            "top":17,
                            "left":15,
                            "width":14,
                            "height":14
                        },
                        "textCoordinates":{
                            "top":0,
                            "left":0,
                            "width":44,
                            "height":15
                        }
                    },
                    {
                        "itemType":"iconItem",
                        "cssClass":"lib-element-flag",
                        "label":"Flag indicator",
                        "name":"flagIndicator",
                        "iconStyle":0,
                        "iconSize":"32",
                        "iconOpacity":100,
                        "coordinates":{
                            "top":350,
                            "left":304,
                            "width":32,
                            "height":32,
                            "right":336,
                            "bottom":382
                        }
                    },
                    {
                        "itemType":"general",
                        "cssClass":"lib-element-powerup",
                        "label":"Powerup timer",
                        "name":"powerupIndicator",
                        "iconPosition":"top",
                        "iconSpacing":4,
                        "iconOpacity":100,
                        "iconSize":"32",
                        "iconStyle":0,
                        "textSize":55,
                        "textOpacity":100,
                        "textStyle":3,
                        "teamColors":true,
                        "text":"32",
                        "layout":"vertical",
                        "textColor":"FFFFFF",
                        "singlePowerup":false,
                        "coordinates":{
                            "top":222,
                            "left":566,
                            "width":70,
                            "height":36,
                            "right":636,
                            "bottom":258
                        },
                        "iconCoordinates":{
                            "top":0,
                            "left":0,
                            "width":32,
                            "height":32
                        },
                        "textCoordinates":{
                            "top":12,
                            "left":36,
                            "width":34,
                            "height":20
                        }
                    },
                    {
                        "itemType":"iconItem",
                        "cssClass":"lib-element-player-item",
                        "label":"Usable item indicator",
                        "name":"playerItem",
                        "iconStyle":0,
                        "iconSize":"25",
                        "iconOpacity":100,
                        "coordinates":{
                            "top":452,
                            "left":520,
                            "width":25,
                            "height":25,
                            "right":545,
                            "bottom":477
                        }
                    },
                    {
                        "itemType":"iconItem",
                        "cssClass":"lib-element-ctf-powerup",
                        "label":"CTF powerup indicator",
                        "name":"CTFPowerupIndicator",
                        "iconStyle":0,
                        "iconSize":"25",
                        "iconOpacity":100,
                        "coordinates":{
                            "top":452,
                            "left":610,
                            "width":25,
                            "height":25,
                            "right":635,
                            "bottom":477
                        }
                    },
                    {
                        "itemType":"scoreBox",
                        "cssClass":"lib-element-scorebox",
                        "label":"Scorebox",
                        "name":"scoreBox",
                        "scoreboxStyle":0,
                        "layout":"horizontal",
                        "mode":"ffa",
                        "spacing":1,
                        "iconSpacing":10,
                        "coordinates":{
                            "top":5,
                            "left":5,
                            "width":180,
                            "height":35,
                            "right":185,
                            "bottom":40
                        }
                    },
                    {
                        "itemType":"general",
                        "cssClass":"lib-element-timer",
                        "label":"Timer",
                        "name":"timer",
                        "iconPosition":"left",
                        "iconSpacing":"3",
                        "iconOpacity":100,
                        "iconSize":"14",
                        "iconStyle":0,
                        "textSize":"35",
                        "textOpacity":100,
                        "textStyle":3,
                        "teamColors":true,
                        "text":"2:18",
                        "textColor":"FFFFFF",
                        "coordinates":{
                            "top":52,
                            "left":5,
                            "width":47,
                            "height":14,
                            "right":52,
                            "bottom":66
                        },
                        "iconCoordinates":{
                            "top":0,
                            "left":0,
                            "width":14,
                            "height":14
                        },
                        "textCoordinates":{
                            "top":1,
                            "left":17,
                            "width":30,
                            "height":13
                        }
                    }
                ]
            }
        ]
    }
});

visualHUD.Collections.CustomHUDPresets = visualHUD.Collections.DictionaryAbstract.extend({
    LOCAL_STORAGE_KEY: 'CustomHUDPresets',

    getData: function() {
        var data = window.localStorage.getItem(this.LOCAL_STORAGE_KEY);
        data = JSON.parse(data);

        return data || [];
    },

    /**
     * Setup autosave when window unload event is fired
     */
    initialize: function() {
        this.on('all', this.save, this);
        this.on('add', this.sort, this);
    },

    comparator: function(model) {
        return model.get('name');
    },

    save: function() {
        var data = this.toJSON();
        try {
            window.localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(data));
        }
        catch(e) {
            throw('visualHUD was unable to save last preset. window.localStorage space quota exceeded');
        }

    }
});

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
        this.bindDropImport();
    },

    render: function(nestedViews) {
        this.setNestedViews(nestedViews);

        this.$el.appendTo(document.body);
        this.trackResize();

        this.fireEvent('render', [this]);
    },

    setNestedViews: function(views) {
        _.each(views, function(view) {
            var getterFn = 'get' + view.getAlias().split('.').pop() + 'View';
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

        this.$sidebarWrapper.stop().animate({
            'right': amount
        }, {
            duration: 200
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
    },

    bindDropImport: function() {
        if(Modernizr.draganddrop == true) {
            document.body.addEventListener('drop', visualHUD.Function.bind(function(event) {
                event.preventDefault();

                var files = Array.prototype.slice.call(event.dataTransfer.files);
                visualHUD.Libs.importHelper.batchImport(files, {
                    scope: this,
                    files: function(output) {
                        this.fireEvent('import.text', [output]);
                    },
                    image: function(output) {
                        this.fireEvent('import.image', [output]);
                    }
                });
                return false;

            }, this), false);
        }
    }
});

visualHUD.Views.viewport.TopBar = Backbone.View.extend({
    tagName: 'div',
    className: 'app-topbar',
    htmlTpl: [
        '<div class="app-logo popover-action" data-popover="logo"><span>VisualHUD</span></div>',
        '<div class="toolbar-main global-actions">',
            '<button value="downloadHUD" class="button" id="downloadButton"><span class="w-icon download">Download</span></button>',
            '<button value="loadPreset" class="button-aux" id="loadPresetButton"><span class="w-icon load">Import</span></button>',
            '<button value="restartApplication" class="button-aux" id="restartAppButton"><span class="w-icon restart">Restart</span></button>',
        '</div>',
        '<div class="toolbar-main hud-actions">',
            '<button value="undoUpdate" class="button-aux" data-tooltip="Undo"><span class="w-icon icon-undo">Undo</span></button>',
            '<button value="deleteSelected" class="button-aux single-select-button" data-tooltip="Delete"><span class="w-icon icon-trash">Delete</span></button>',
            '<button value="cloneSelected" class="button-aux single-select-button" data-tooltip="Clone"><span class="w-icon icon-clone">Clone</span></button>',
            '<button value="groupSelected" class="button-aux multi-select-button" data-tooltip="Group"><span class="w-icon icon-group">Group</span></button>',
            '<button value="alignSelected" class="button-aux single-select-button popover-action"  data-tooltip="Align" data-popover="align"><span class="w-carret w-icon icon-align">Align</span></button>',
        '</div>',        
        '<div class="app-stats">',
        '<span class="counter" id="downloadCounterText">0</span>',
        '<span class="hint">custom HUDs <br />have been created so far</span>',
        '</div>',

        '<div class="toolbar-aux global-actions">',
        '<button value="sendFeedback" class="button-aux" id="reportBugButton"><span class="w-icon icon-feedback">Feedback</span></button>',
        '</div>'
    ],

    events: {
        'click .popover-action': 'showPopover',
        'click .global-actions button': 'onGlobalActionButtonClick',
        'click .hud-actions button': 'onHUDActionButtonClick'
    },
    initialize: function() {
        this.$el.append(this.htmlTpl.join(''));
        this.$('#downloadCounterText').text(parseInt(visualHUD.dlCount, 10) || 0);

        this.buttons = {
            download: this.$el.find('#downloadButton'),
            load: this.$el.find('#loadPresetButton'),
            restart: this.$el.find('#restartAppButton'),
            report: this.$el.find('#reportBugButton'),
            singleSelectActions: this.$el.find('.single-select-button'),
            multiSelectActions: this.$el.find('.multi-select-button')
        }
        
        this.updateToolbarButtonsState(0);
        this.setupAlignPopOver();
        //this.setupFeedbackPopOver();
        this.setupLogoPopOver();
        
    },

    setupAlignPopOver: function() {
        var $button = this.$el.find('button[value=alignSelected]');

        this.alignPopover = new visualHUD.Widgets.PopOver({
            cls: 'align-popover',
            events: {},
            html: visualHUD.Libs.formControlsBuilder.getTemplateByType('alignControl'),
            position: 'bottom-center',
            title: 'Align selected items',
            scope: this,
            show: function() {
                $button.addClass('active');
                visualHUD.toolTips.disable();
            },
            hide: function() {
                $button.removeClass('active');
                visualHUD.toolTips.enable();
            }
        });

        this.alignPopover.$el.on('click', '.align-controls li', visualHUD.Function.bind(this.fireAlignAction, this));
        this.alignPopover.$el.on('mouseenter', '.align-popover li', false);
    },

    setupLogoPopOver: function() {
        var $logo = this.$el.find('.app-logo');
        this.logoPopover = new visualHUD.Widgets.PopOver({
            cls: 'logo-popover',
            cancelEventBubbling: false,
            html: ([
                '<p>Simple yet powerful <a href="http://www.quakelive.com" target="_blank">Quake Live</a> online HUD builder. Simply drag and drop HUD elements to create completely custom Quake Live HUD</p>',
                '<p>New to visualHUD? Check these useful links!</p>',
                '<ul>',
                    '<li><a href="help/#videos" target="help">Video Tutorials</a></li>',
                    '<li><a href="help/#hotkeys" target="help">Hot Keys Cheat Sheet</a></li>',
                    '<li><a href="help/#credits" target="help">Credits</a></li>',
                '</ul>'
            ]).join(''),
            position: 'bottom-center',
            title: 'visualHUD',
            scope: this,
            show: function() {
                $logo.addClass('active');
            },
            hide: function() {
                $logo.removeClass('active');
            }
        });
    },

    setupFeedbackPopOver: function() {
        var $button = this.$el.find('button[value=feedback]');
        this.feedbackPopover = new visualHUD.Widgets.PopOver({
            cls: 'feedback-popover',
            cancelEventBubbling: false,
            html: ([
                '<ul class="popover-menu">',
                '<li><span class="icon icon-feedback"></span><a href="#" class="item-name" data-action="send-feedback">Give a feedback</a></li>',
                '<li><span class="icon icon-bug"></span><a href="#" class="item-name" data-action="report-bug">Report a bug</a></li>',
                '</ul>'
            ]).join(''),
            position: 'bottom-right',
            title: 'Feedback',
            scope: this,
            show: function() {
                $button.addClass('active');
            },
            hide: function() {
                $button.removeClass('active');
            }
        });

        this.feedbackPopover.$el.on('click', '.popover-menu a', visualHUD.Function.bind(this.fireFeedbackAction, this));
    },

    render: function(viewport) {
        this.$el.appendTo(viewport.$topArea);
    },

    onGlobalActionButtonClick: function(event) {
        var action = event.currentTarget.value;
        this.fireEvent('toolbar.global:action', [action]);
    },
    
    onHUDActionButtonClick: function(event) {
        var action = event.currentTarget.value;
        this.fireEvent('toolbar.hud:action', [action]);
        
        return false;
    },

    showPopover: function(event) {
        var target = $(event.currentTarget),
            name = target.data('popover'),
            popoverComp = this[name + 'Popover'];

        popoverComp.visible ? popoverComp.hide() : popoverComp.show(target);

        return false;
    },

    fireAlignAction: function(event) {
        var control = $(event.currentTarget),
            action = control.data('action');

        this.fireEvent('align.action', [action]);
        //this.alignPopover.hide();

        return false;
    },

    fireFeedbackAction: function(event) {
        var control = $(event.currentTarget),
            action = control.data('action');

        this.fireEvent('feedback.action', [action]);
    },

    updateToolbarButtonsState: function(selectionLength) {
        this.buttons.singleSelectActions.attr('disabled', selectionLength == 0);
        this.buttons.multiSelectActions.attr('disabled', selectionLength <= 1);
    }
});

visualHUD.Views.viewport.CanvasToolbar = Backbone.View.extend({
    tagName: 'ul',
    className: 'app-toolbar',
    baseCls: 'root-item',
    menuStructure: [
        {
            text: 'Screenshot',
            title: 'Change location background',
            cls: 'rtl-item shot-toggle',
            counter: 'hidden',
            options: [
                {
                    name: 'canvasShot',
                    control: 'radio',
                    label: 'None',
                    value: 0
                },
                {
                    name: 'canvasShot',
                    control: 'radio',
                    label: 'Longest Yard',
                    value: 1
                },
                {
                    name: 'canvasShot',
                    control: 'radio',
                    label: 'Almost Lost',
                    value: 2
                },
                {
                    name: 'canvasShot',
                    control: 'radio',
                    label: 'Custom Background',
                    value: 3
                }
            ]
        },
        {
            text: 'Grid',
            title: 'Toggle grid',
            cls: 'rtl-item grid-toggle',
            counter: 'visible',
            options: [
                {
                    name: 'drawGrid',
                    control: 'radio',
                    label: 'Off',
                    value: 0
                },
                {
                    name: 'drawGrid',
                    control: 'radio',
                    label: '5px',
                    value: 5
                },
                {
                    name: 'drawGrid',
                    control: 'radio',
                    label: '10px',
                    value: 10
                }
            ]
        },
        {
            text: 'Snap',
            title: 'Snap element to grid',
            cls: 'rtl-item grid-snap',
            counter: 'visible',
            options: [
                {
                    name: 'snapGrid',
                    control: 'radio',
                    label: 'Off',
                    value: 0
                },
                {
                    name: 'snapGrid',
                    control: 'radio',
                    label: '5px',
                    value: 5
                },
                {
                    name: 'snapGrid',
                    control: 'radio',
                    label: '10px',
                    value: 10
                }
            ]
        },
        {
            text: 'Status',
            title: '',
            cls: 'player-status',
            counter: 'hidden',
            options: null
        },
        {
            text: 'HUD Extras',
            title: '',
            cls: 'hud-extras',
            counter: 'visible',
            options: [
                {
                    control: 'checkbox',
                    value: 1,
                    name: 'lagometr',
                    label: 'Lagometr'
                },
                {
                    control: 'checkbox',
                    value: 1,
                    name: 'speedometr',
                    label: 'Speedometr'
                },
                {
                    control: 'checkbox',
                    value: 1,
                    name: 'pickup',
                    label: 'Item Pickup'
                },
                {
                    control: 'checkbox',
                    value: 1,
                    name: 'recordingMessage',
                    label: 'Demo Recording Message'
                }
            ]
        },
        {
            text: 'Gun',
            title: '',
            cls: 'draw-gun',
            counter: 'visible',

            options: [
                {
                    name: 'drawGun',
                    control: 'radio',
                    label: 'Hidden',
                    value: 0
                },
                {
                    name: 'drawGun',
                    control: 'radio',
                    label: 'Right',
                    value: 1
                },
                {
                    name: 'drawGun',
                    control: 'radio',
                    label: 'Center',
                    value: 2
                }
            ]
        },
        {
            text: 'Weapon bar',
            title: '',
            cls: 'weapong-bar',
            counter: 'visible',
            options: [
                {
                    name: 'drawWeaponbar',
                    control: 'radio',
                    label: 'Hidden',
                    value: 0
                },
                {
                    name: 'drawWeaponbar',
                    control: 'radio',
                    label: 'Right',
                    value: 2
                },
                {
                    name: 'drawWeaponbar',
                    control: 'radio',
                    label: 'Left',
                    value: 1
                },
                {

                    name: 'drawWeaponbar',
                    control: 'radio',
                    label: 'Bottom',
                    value: 3
                },
                {
                    name: 'drawWeaponbar',
                    control: 'radio',
                    label: 'Q3A Style',
                    value: 4
                }
            ]
        },
        {
            text: 'Team overlay',
            title: '',
            cls: 'tm-overlay',
            counter: 'visible',
            options: [
                {
                    name: 'drawTeamoverlay',
                    control: 'radio',
                    label: 'Hidden',
                    value: 0
                },
                {
                    name: 'drawTeamoverlay',
                    control: 'radio',
                    label: 'Top',
                    value: 1
                },
                {
                    name: 'drawTeamoverlay',
                    control: 'radio',
                    label: 'Bottom',
                    value: 2
                }
            ]
        }
    ],
    events: {
        'click input': "changeCanvasOption",
        'change .player-status input[type=text]': "changeCanvasOption",
        'click .player-status form': 'stopPropagation',
        'click li.root-item ul': 'onSubmenuClick',
        'click li.root-item': 'onRootitemClick',
        'mouseover li.root-item ul': 'stopPropagation'
    },

    initialize: function() {
        this.tpl = [
            '<% _.each(items, function(item) { %>',
                '<li class="<%= baseCls %> <%= item.cls %>" data-tooltip="<%= item.title %>">',
                    '<span class="item-name"><%= item.text %></span>',
                    '<strong class="item-value <%= item.counter %>">0</strong>',
                    '<% if(item.options && item.options.length){ %>',
                        '<ul>',
                        '<% _.each(item.options, function(option) { %>',
                            '<li>',
                                '<label><input type="<%= option.control %>" name="<%= option.name %>" value="<%= option.value %>" /><span><%= option.label %></span></label>',
                            '</li>',
                        '<% }); %>',
                        '</ul>',
                    '<% }; %>',
                '</li>',
            '<% }); %>'
        ];

        this.menuStructure.splice(0,0,{
            text: 'View',
            title: 'Filter Elements by Game Type',
            cls: 'rtl-item gt-filter',
            counter: 'hidden',
            options: this.getGameTypeFilterOptions()
        });
    },

    getGameTypeFilterOptions: function() {
        var options = [];

        _.each(visualHUD.Libs.formBuilderMixin.getByName('base').getOwnerDrawOptions(), function(value, key) {
            options.push({
                name: 'ownerDrawFlag',
                control: 'radio',
                label: value,
                value: key
            });
        });

        return options;
    },

    render: function(viewport) {
        var tpl = _.template(this.tpl.join(''), {
                baseCls: this.baseCls,
                items: this.menuStructure
            });

        this.$el.append(tpl);

        this.renderPlayerStatusControls();
        this.renderImageImportMenuItem();

        var clientSettingsModel = this.options.clientSettingsModel;
        this.setClientSettings(clientSettingsModel.toJSON());

        this.$el.appendTo(viewport.$bottomtArea);
    },

    renderPlayerStatusControls: function() {
        var playerStatusListItem = this.$el.find('.player-status');
        var form = $('<form />');
        var clientSettingsModel = this.options.clientSettingsModel;
        var statusRangeInputs = [];

        statusRangeInputs.push(
            visualHUD.Libs.formControlsBuilder.createRangeInput({
                'type': 'rangeInput',
                'name': 'statusHealth',
                'label': 'Health',
                'min': 0,
                'max': 200,
                'value': clientSettingsModel.get('statusHealth')
           })
        );

        statusRangeInputs.push(
            visualHUD.Libs.formControlsBuilder.createRangeInput({
                'type': 'rangeInput',
                'name': 'statusArmor',
                'label': 'Armor',
                'min': 0,
                'max': 200,
                'value': clientSettingsModel.get('statusArmor')
            })
        );

        statusRangeInputs.push(
            visualHUD.Libs.formControlsBuilder.createRangeInput({
                'type': 'rangeInput',
                'name': 'statusAmmo',
                'label': 'Ammo',
                'min': 0,
                'max': 150,
                'value': clientSettingsModel.get('statusAmmo')
            })
        );

//        statusRangeInputs.push(
//            visualHUD.Libs.formControlsBuilder.createRangeInput({
//                'type': 'rangeInput',
//                'name': 'statusAccuracy',
//                'label': 'Acc',
//                'min': 0,
//                'max': 100,
//                'value': clientSettingsModel.get('statusAccuracy')
//            })
//        );

        statusRangeInputs.push(
            visualHUD.Libs.formControlsBuilder.createRangeInput({
                'type': 'rangeInput',
                'name': 'statusSkill',
                'label': 'Skill',
                'min': 0,
                'max': 100,
                'value': clientSettingsModel.get('statusSkill')
            })
        );
        _.each(statusRangeInputs, function(el) {
            form.append(el);
        });

        playerStatusListItem.append(form);
    },

    renderImageImportMenuItem: function() {
        var submenuElement = this.$el.find('li.shot-toggle ul'),
            importLinkTpl = ([
                '<a href="#" class="set-custom-bg">',
                    'Import image',
                '</a>'
            ]).join(''),
            menuItem = $('<li />').html(importLinkTpl).appendTo(submenuElement),
            importLink = menuItem.find('a.set-custom-bg');

        importLink.click(visualHUD.Function.bind(function(event) {
            this.fireEvent('import.image');
            event.preventDefault();
        }, this));
    },

    onRootitemClick: function(event) {
        event.preventDefault();

        var listItem = $(event.currentTarget);
        var listItems = this.$el.children();
        var activeItems = listItems.filter('.active').not(listItem).removeClass('active');
        var activeItem = null;

        listItem.toggleClass('active');
        activeItem = listItem.hasClass('active');

        this.fireEvent('toolbar.menu:show', [this]);

        var hideFn = visualHUD.Function.bind(this.hideMenu, this);

        if(activeItem && activeItems.length == 0){
            window.setTimeout(function(){
                $('body').bind('click.hideMenu', hideFn);
            }, 20);
        }
        else if(!activeItem && activeItems.length == 0){
            $('body').bind('click.hideMenu', hideFn);
        }
        else {
            event.stopPropagation();
        }
    },

    hideMenu: function() {
        var listItems = this.$el.children();

        listItems.filter('.active').removeClass('active');
        $('body').unbind('click.hideMenu');

        this.fireEvent('toolbar.menu:hide', [this]);
    },


    onSubmenuClick: function(event) {
        event.stopPropagation();

        var listItems = this.$el.children();

        listItems.filter('.active').removeClass('active');
        $('body').unbind('click.hideMenu');
    },

    changeCanvasOption: function(event) {
        var formControl = event.currentTarget;
        var $formControl = $(formControl);

        var isCheckbox = $formControl.is('[type=checkbox]');
        var isRadiobutton = $formControl.is('[type=radio]');

        var textElement = $formControl.closest('li.root-item').find('strong.item-value').text(formControl.value);

        if(formControl.name != '') {
			var clientSettingsModel = this.options.clientSettingsModel;
			clientSettingsModel.set(formControl.name, isCheckbox ? formControl.checked : formControl.value)
        }
    },

    setClientSettings: function(data) {
        var set, attr, type, name, val, input;

        for(var key in data){
            set = data[key];

            name = _.template('input[name=<%= name %>]', {name: key});
            input = this.$el.find(name);

            if(set === true){
                input.attr('checked', set);
            }
            else {
                val = _.template('input[value=<%= name %>]', {name: set});
                input = input.filter(val)
                input.attr('checked', true);

                var textElement = input.closest('li.root-item').find('strong.item-value').text(set);
            }
        }
    },

    stopPropagation: function(event) {
        event.stopPropagation();
        return false;
    }
});

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
                    this.fireEvent('import.image');
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

/**
 * Stage Controlls are used to create new HUD items
 * This view is placed within main Viewport
 * @type {*}
 */
visualHUD.Views.viewport.StageControls = Backbone.View.extend({
    tagName: 'div',
    className: 'stage-controlls-area',
    collection: null,
    htmlTpl: [
        '<div class="sidebar-block" id="getStartedTextarea">',
        '<h3>Get started</h3>',
        '<div class="mb-10">',
        'Use icons below to start building yor HUD. You can use drag and drop or double click in order to create new HUD element',
        '</div>',
        '<div>',
        '<a href="help/#videos" target="help" class="mr-20">View Video Tutorials</a>',
        '</div>',
        '</div>',
        '<div class="sidebar-block stage-controls" id="stageControlsArea">',
        '<h4>HUD Elements</h4>',
        '<ul class="library-items clearfloat">',
        '</ul>',
        '</div>',
        '<div class="sidebar-block stage-controls" id="editorSettingsArea">',
        '<h4>Editor Size and Layout</h4>',
        '<ul class="library-items icons-32px viewport-size-controls ctrl-group clearfloat">',
            '<li data-viewportsize="1" data-tooltip="Normal<small>640x480</small>" class="ctrl normal-viewport"><span class="item-name">Normal</span></li>',
            '<li data-viewportsize="2" data-tooltip="Doubled<small>1280x960</small>" class="ctrl doubled-viewport"><span class="item-name">Doubled</span></li>',
        '</ul>',
        '<ul class="library-items icons-32px viewport-layout-controls ctrl-group clearfloat">',
            '<li data-layout="false" data-tooltip="Full Layout" class="ctrl normal-layout"><span class="item-name">Normal</span></li>',
            '<li data-layout="true" data-tooltip="Compact Layout" class="ctrl compact-layout"><span class="item-name">Doubled</span></li>',
        '</ul>',        
        '</div>'
    ],

    stageControlTpl: [
        '<li class="<%= cssClass %>"  id="<%= id %>" data-id="<%= id %>" data-tooltip="<%= label %>">',
        '<span class="item-name"><%= label %></span>',
        '</li>'
    ],

    events: {
        'mousedown #stageControlsArea li': 'startDrag',
        'dblclick #stageControlsArea li': 'dropHUDItem',
        'click .viewport-size-controls li': 'switchEditorSize',
        'click .viewport-layout-controls li': 'switchEditorLayout',
        'mouseenter .viewport-size-controls li': 'exposeEditor',
        'mouseleave .viewport-size-controls li': 'maskEditor'
    },

    initialize: function() {
        var stageControlsHTML = [];

        this.collection.each(function(record) {
            stageControlsHTML.push(
                _.template(this.stageControlTpl.join(''), {
                    id: record.get('id'),
                    label: record.get('label'),
                    cssClass: record.get('cssClass')
                })
            );
        }, this);

        this.$el.append(this.htmlTpl.join(''));
        this.$('#stageControlsArea').find('ul.library-items').append(stageControlsHTML.join(''));

        this.setupDragManager();
    },

    render: function(viewport) {
        this.viewport = viewport;
        this.$el.appendTo(viewport.$sidebarArea);
    },

    /**
     * Drag Manager is need to support Drag and Drop operations
     */
    setupDragManager: function() {
        var dropArea,
            hudCanvas;

        this.dragManager = new visualHUD.Utils.DragZoneBase({
            scope: this,
            ticks: 2,
            tolerance: 3,
            position: 'offset',
            bodyDragClass: 'new-item-drag',
            init: function(dragManager) {
                dragManager.ghost.addClass('stage-controls-drag-helper');
            },
            onbeforestart: function(){
                dropArea = this.viewport.getCanvasView().getCanvasOffset();
                hudCanvas = this.viewport.$centerArea;
            },
            onstart: function(dragManager){
                var css = {
                    left: dragManager.mouse.x + dragManager.moveOffset.x,
                    top: dragManager.y + dragManager.moveOffset.y,
                    display: 'block'
                };

                dragManager.ghost.addClass(dragManager.currentElement[0].className).css(css);
                dragManager.currentElement.addClass('drag-start');
            },
            ondrag: function(dragManager, event, position, mouse){
                dragManager.ghost.css(position);

                if(dropArea.top < mouse.y && dropArea.left < mouse.x && dropArea.right > mouse.x && dropArea.bottom > mouse.y){
                    if(!hudCanvas.hasClass('new-item-drop-over')){
                        hudCanvas.addClass('new-item-drop-over')
                    }
                } else {
                    if(hudCanvas.hasClass('new-item-drop-over')){
                        hudCanvas.removeClass('new-item-drop-over')
                    }
                }
            },
            ondrop: function(dragManager, event, _target){
                var dataId = dragManager.currentElement.data().id;
                var record = this.collection.get(dataId);
                var mouse = dragManager.getMouse(event);
                var hit = dropArea.top < mouse.y && dropArea.left < mouse.x && dropArea.right > mouse.x && dropArea.bottom > mouse.y;

                dragManager.ghost.removeClass(dragManager.currentElement[0].className);
                dragManager.currentElement.removeClass('drag-start');
                hudCanvas.removeClass('new-item-drop-over');

                if(hit){
                    this.fireEvent('item.drop', [record, {
                        top: Math.round(mouse.y - dropArea.top),
                        left: Math.round(mouse.x - dropArea.left)
                    }]);
                }
            }
        });
    },

    startDrag: function(event) {
        var $target = $(event.currentTarget);

        if($target.hasClass('disabled')){
            return false;
        }

        this.dragManager.start(event, $target);

        if (event.stopPropagation) event.stopPropagation();
        if (event.preventDefault) event.preventDefault();
        return false;
    },

    dropHUDItem: function(event) {
        var $target = $(event.currentTarget),
            id = $target.data().id,
            record = this.collection.get(id),
            dropArea = this.viewport.getCanvasView().getCanvasOffset();

        if($target.hasClass('disabled')){
            return false;
        }

        this.fireEvent('item.drop', [record, {
            top: Math.round(dropArea.height/2),
            left: Math.round(dropArea.width/2)
        }]);
    },

    switchEditorSize: function(event) {
        var $target = $(event.currentTarget),
            scale = parseInt($target.data('viewportsize'), 10);

        this.fireEvent('scalefactor.change', [scale]);
    },

    exposeEditor: function() {
        var hudCanvasWrap = this.viewport.$centerArea;
        hudCanvasWrap.addClass('new-item-drop-over');
    },

    maskEditor: function() {
        var hudCanvasWrap = this.viewport.$centerArea;
        hudCanvasWrap.removeClass('new-item-drop-over');
    },

    switchEditorLayout: function(event) {
        var $target = $(event.currentTarget),
            layout = $target.data('layout');
            
        this.fireEvent('layout.change', [layout]);
    },
    
    updateControlsStatus: function(event, name) {
        var element = this.$('#' + name),
            record = this.collection.get(name),
            isSingle = record.get('isSingle'),
            clsFn = 'addClass';

        switch(event) {
            case 'create': {
                clsFn = 'addClass';
                break;
            }
            case 'destroy': {
                clsFn = 'removeClass';
                break;
            }
        }

        isSingle && element[clsFn]('disabled');
    }

});

visualHUD.Views.HUDItem = Backbone.View.extend({
    tagName: 'div',
    className: 'hud-item',

    events: {
        'click': 'itemClick'
    },
    initialize: function() {
        /*
            Since we are dealing with very specific items, we need to be able to mix some specific behaviour into newly created instance
            To make it possible let's use mixin library that will contain specific functionality depending on item type or name
        */
        var defaultMixin = visualHUD.Libs.itemBuilderMixin.getByType('general'),
            typeMixin = visualHUD.Libs.itemBuilderMixin.getByType(this.model.get('itemType')),
            nameMixin = visualHUD.Libs.itemBuilderMixin.getByName(this.model.get('name'));

        if(defaultMixin == typeMixin) {
            typeMixin = {};
        }
        // Maxin functionality goes from more generic (by type) to more specific (by name)
        _.extend(this, defaultMixin, typeMixin || {}, nameMixin || {});

        this.$el.data('HUDItem', this);

        this.model.on('change', this.onModelUpdate, this);
        this.model.on('destroy', this.onModelDestroy, this);

        this.model._HUDItem = this;

        this.delayedStatusUpdate = visualHUD.Function.createBuffered(this.refreshCoordinates, 10, this);

        this.render();
    },

    render: function() {
        var renderTo = this.options.renderTo,
            htmlTpl = this.prepareTemplate();

        var coordinates = this.model.get('coordinates');
        var resizable = this.model.get('resizable');

        this.$el.addClass(this.options.htmlTplRecord.get('cssClass'));
        this.$el.append(htmlTpl);
        this.$el.css({visibility: 'hidden'});

        if(this.model.get('resizable') == true) {
            this.appendResizehandles();
        }
        this.getDOMRefs();

        _.each(this.model.attributes, function(value, field) {
            value != null && this.callUpdateMethodByField(field, false);
        }, this);

        this.$el.appendTo(renderTo);

        var width = coordinates.width,
            height = coordinates.height,
            top = this.model.wasDropped ? coordinates.top - this.$el.height() / 2 : coordinates.top * visualHUD.scaleFactor,
            left = this.model.wasDropped ? coordinates.left - this.$el.width() / 2 : coordinates.left * visualHUD.scaleFactor;

        this.$el.css({
            width: this.model.get('width') * visualHUD.scaleFactor || 'auto',
            height: this.model.get('height') * visualHUD.scaleFactor || 'auto',
            top: Math.round(top),
            left: Math.round(left)
        });

        this.refreshCoordinates();

        // render associated item form
        this.getForm().render();
        this.$el.css({visibility: ''});
    },

    prepareTemplate: function() {
        var data = this.model.toJSON(),
            htmlTplRecord = this.options.htmlTplRecord,
            htmlTpl = htmlTplRecord.get('template').join(''),
            iconOptions = this.getIconOptions(),
            iconData = iconOptions ? iconOptions[this.model.get('iconStyle')] : null,
            template;

        data.icon = this.model.get('iconStyle') != null ? iconData : iconOptions;

        template = _.template(htmlTpl, data);
        return template;
    },

    appendResizehandles: function() {
        var handles = [];
        _.each(['nw', 'n', 'ne','e','se','s', 'sw', 'w'], function(cls) {
            handles.push('<div class="resize-handle '+ cls +'" data-resizeDirection="'+ cls +'"></div>');
        });

        this.$el.append(handles.join(''));
    },

    getDOMRefs: function() {
        var refs = this.refs;

        if(!refs) {
            this.refs = {
                layoutBox: this.$el.find('div.hud-item-layout'),
                iconBlock: this.$el.find('div.item-icon'),
                icon: this.$el.find('div.item-icon img'),
                textBlock: this.$el.find('div.item-counter'),
                counter: this.$el.find('div.item-counter span.counter'),
                templateText: this.$el.find('div.item-counter span.text'),
                box: this.$el.find('.hud-item-box'),
                h100: this.$el.find('.hud-item-box div.h100'),
                h200: this.$el.find('.hud-item-box div.h200'),
                chatList: this.$el.find('ul.chat-messages')
            }
        }

        return refs;
    },

    getForm: function() {
        return this.options.formView;
    },

    getIconOptions: function() {
        var HUDItemIconEnums = this.options.HUDItemIconEnums,
            iconRecord = HUDItemIconEnums.get(this.model.get('name')),
            iconOptions = iconRecord ? iconRecord.get('options') : null;

        return iconOptions;
    },

    onModelDestroy: function() {
        this.remove();
        this.getForm().remove();
        this.options.formView = null;

        this.fireEvent('destroy', [this.model]);
    },

    onModelUpdate: function(record, event) {
        var changes = event.changes;

        /*console.info(' > HUD Item', record.get('name'), 'model has changed', JSON.stringify(changes));*/

        _.each(changes, function(set, field) {
            var refreshStatus = field.match(/coordinates|width|height|padding|textSize|iconSize|iconSpacing|iconPosition/gi) != null;
            set && this.callUpdateMethodByField(field, refreshStatus);
        }, this);
    },

    callUpdateMethodByField: function(field, refreshStatus) {
        var value = this.model.get(field),
            methodName = 'update' + field.charAt(0).toUpperCase() + field.substring(1),
            fn = this[methodName]; // these methods are from visualHUD.Libs.itemBuilderMixin

        /*console.info(' > Updating HUD Item property', field, 'with new value:', value);*/

        if(_.isFunction(fn)) {
            fn.call(this, value);
            (refreshStatus === true) && this.delayedStatusUpdate(true);
        }
    },

    refreshCoordinates: function(silent) {
        if(this.$el.is(':visible')) {

            /*console.info(' > Updating HUD Item Coordinates. isSilent:', silent || false);*/

            var position = this.$el.position(),
                coordinates = {
                    top: Math.round(position.top / visualHUD.scaleFactor),
                    left: Math.round(position.left / visualHUD.scaleFactor),
                    height: Math.round(this.$el.height() / visualHUD.scaleFactor),
                    width: Math.round(this.$el.width() / visualHUD.scaleFactor)
                };

            this.model.set('coordinates', coordinates, {silent: silent});
            (silent == true) && this.getForm().updateStatusBar();

            return coordinates;
        }
    },

    move: function(direction, offset) {
        var position = this.$el.position();
        position[direction] += offset;

        var newPosition = this.checkPosition(position);

        this.$el.css(newPosition);
        this.refreshCoordinates();

    },

    checkPosition: function(position){

        var element = this.$el;
        var boundTo = element.offsetParent();

        var limits = this.limits || {
            top: 0,
            left: 0,
            right: boundTo.width(),
            bottom: boundTo.height()
        };

        this.limits = limits;

        var elementSize = {
            width: element.width(),
            height: element.height()
        };

        if(position.left + elementSize.width > limits.right){
            position.left = limits.right - elementSize.width;
        }

        if(position.top + elementSize.height > limits.bottom){
            position.top = limits.bottom - elementSize.height;
        }

        position.left = Math.round(position.left < 0 ? 0 : position.left);
        position.top = Math.round(position.top < 0 ? 0 : position.top);

        return position;
    },

    itemClick: function(event) {
        this.fireEvent('click', [this, event]);
    },

    getGroup: function() {
        return this.model.get('group');
    },

    setGroup: function(name) {
        this.model.set('group', name || null)
    },

    update: function(data) {
        /*console.info(' > Updating HUD Item', this.model.get('name'), JSON.stringify(data));*/

        var form = this.getForm();
        this.model.set(data);
        form.setValues(data, {silent: true});
    },
    /*
        Abstract methods, should be defined within visualHUD.Libs.itemBuilderMixin
    */
    updateCoordinates: function(values) {
        /*console.info(' > Updating HUD Item coordinates', JSON.stringify(values));*/
        this.$el.css({
            top: values.top * visualHUD.scaleFactor,
            left: values.left * visualHUD.scaleFactor
        });
    },

    updateTextSize: function(value) {
    },

    updateTextStyle: function(value) {
    },

    updateTextOpacity: function(value) {

    },

    updateIconPosition: function(position, spacing) {
    },

    updateIconOpacity: function(value) {
    },

    updateIconSize: function(value) {
    },

    updateIconStyle: function(value) {
    },

    updateIconSpacing: function(value) {
    },

    updateTextColor: function(value) {
    },

    updateTeamColors: function(value) {
    },

    updateColorRanges: function(value) {
    },

    updateText: function(value) {
    },

    updateBorderRadius: function(value) {
    },

    updateBoxStyle: function(value) {
    },

    updateTemplate: function(value) {
    },

    updatePowerupView: function(value) {
    },

    updatePadding: function(value) {
    },

    updateToggleChat: function(value) {
    },

    updateScoreboxLayout: function(value) {
    }
});

visualHUD.Views.HUDItemForm = Backbone.View.extend({
    tagName: 'form',
    className: 'app-form',
    basicTpl: [
        '<div class="control-header">',
            '<div class="header-wrap <%= className %>">',
                '<span class="item-type">Item:</span>',
                '<div class="item-name"><%= label %></div>',
            '</div>',
        '</div>',
        '<div class="app-form-container">',
            '<div class="app-form-controls">',
            '</div>',
        '</div>',
        '<div class="form-bbar">',
            '<div class="item-status">',
            '</div>',
        '</div>'
    ],
    statusBarTpl: [
        '<span class="mr-10">',
            '<span class="item-name">X:</span>',
            '<span class="item-value"><%= left %></span>',
        '</span>',
        '<span class="mr-10">',
            '<span class="item-name">Y:</span>',
            '<span class="item-value"><%= top %></span>',
        '</span>',
        '<span class="mr-10">',
            '<span class="item-name">W:</span>',
            '<span class="item-value"><%= width %></span>',
        '</span>',
        '<span class="mr-10">',
            '<span class="item-name">H:</span>',
            '<span class="item-value"><%= height %></span>',
        '</span>'
    ],

    events: {
        'submit': 'preventSubmit',
        'click legend': 'toggleFieldsetCollapse',
        'change': 'onChange',
        'click .align-controls li': 'alignItems',
        'click .arrange-controls li': 'arrangeItems'
    },

    initialize: function() {
        var defaultMixin = visualHUD.Libs.formBuilderMixin.getByType('base'),
            typeMixin = visualHUD.Libs.formBuilderMixin.getByType(this.model.get('itemType')),
            nameMixin = visualHUD.Libs.formBuilderMixin.getByName(this.model.get('name'));

        // Mixin functionality goes from more generic (by type) to more specific (by name)
        _.extend(this, defaultMixin, typeMixin || {}, nameMixin || {});

        //Mixin Form Controls Generator
        _.extend(this,visualHUD.Libs.formControlsBuilder);

        var tpl = _.template(this.basicTpl.join(''), {
                className: this.model.get('cssClass'),
                label: this.model.get('label')
            });

        this.$el.append(tpl);
        this.hide();

        this.model.on('change:coordinates', this.updateStatusBar, this);
        $(window).bind('resize.form', $.proxy(this, 'trackResize'));
    },

    render: function() {
        var renderTo = this.options.renderTo;
        this.$el.appendTo(renderTo);
        this.trackResize();
        this.updateStatusBar();

        visualHUD.Libs.colorHelper.setupColorPicker(renderTo);

        this.createControls(this.$el.find('.app-form-controls'));
    },

    trackResize: function() {
        var parent = this.$el.parent(),
            height = parent.height();

        this.$el.height(height);
    },

    updateStatusBar: function() {
        var coordinates = this.model.get('coordinates');
        var tpl = _.template(this.statusBarTpl.join(''), coordinates);

        this.$el.find('.item-status').html(tpl);
    },

    getCollection: function(name) {
        return this.options.collections[name] || null
    },

    onChange: function(event) {
        var name = event.target.name

        if(name && event.silent !== true) {
            var inputElement = $(event.target);
            var value = inputElement.is('[type=checkbox]') ? inputElement.get(0).checked : inputElement.val();
            var isColorRange = name.match(/^colorRange/);

            if(isColorRange) {
                value = this.getColorRangeChanges(name, value);
                name = 'colorRanges';
            }
            this.model.set(name, value);
        }

        return;
    },

    /**
     * Complex method that deeply clone color range structure and update it's value
     * We need this deep cloning in order to trigger model onchnage event
     * @param name
     * @param value
     * @return {Object}
     */
    getColorRangeChanges: function(name, value) {
        var rangeData = name.split('_');
        var colorRangeIndex = parseInt(rangeData[1], 10);
        var colorRangeValueIndex = parseInt(rangeData[3], 10);
        var currentRanges = Array.prototype.slice.call(this.model.get('colorRanges')); //clone array to trigger on change event
        var currentRange = _.clone(currentRanges[colorRangeIndex]);
        var currentRangeValues = Array.prototype.slice.call(currentRange.range);

        currentRanges[colorRangeIndex] = currentRange;
        currentRange.range = currentRangeValues;

        if(rangeData[2] == 'range' && colorRangeValueIndex !== undefined) {
            currentRangeValues[colorRangeValueIndex] = parseInt(value, 10);
        }
        else if(rangeData[2] == 'color'){
            currentRange.color = value;
        }

        return currentRanges
    },

    preventSubmit: function(event) {
        event.preventDefault();
    },

    getValues: function() {
        var rselectTextarea = /select|textarea/i;
        var rinput = /color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i;
        var formElements = this.$el.find("input,select,textarea");

        return this.$el.map(function () {
                return jQuery.makeArray(formElements);
            }).filter(function () {
                return this.name && !this.disabled && (this.checked || rselectTextarea.test(this.nodeName) || rinput.test(this.type));
            }).map(function (i, elem) {
                var valueObject = {};
                valueObject[elem.name] = jQuery(this).val();
                return valueObject
            }).get();
    },

    setValues: function(data, options) {
        var options = options || {};

        _.each(data, function(value, name) {
            var inputElement = this.$el.find('[name='+ name +']');
            if(inputElement.length) {
                var event = jQuery.Event('change');
                event.silent = options.silent || false;
                inputElement.val(value).trigger(event);
            }
        }, this);
    },

    toggleFieldsetCollapse: function(event) {
        var target = $(event.target);
        var fieldset = target.closest('fieldset', this.$el);
        fieldset.toggleClass('collapsed');
    },

    alignItems: function(event) {
        var control = $(event.currentTarget),
            action = control.data('action');

        this.fireEvent('align.action', [action]);
        return false;
    },

    arrangeItems: function(event) {
        var control = $(event.currentTarget),
            action = control.data('action');

        this.fireEvent('arrange.action', [action]);
        return false;
    },

    /**
     * Abstract function that is called upon from rendering
     * This method should be implemented in visualHUD.Libs.formBuilderMixin
     */
    createControls: function() {

    }
});

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
        this.fireEvent('render', this);
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

        var heightBounds = [10, this.$el.height()];

        var topBounds = this.getTopPosition(heightBounds);

        var animateToHeight = this.$contentWrapper.height();

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

        _top[1] = Math.round(_winHeight/2 - heightBounds[1]/2);
        _top[1] += _topOffset;

        if(_top[1] < 0){
            _top[1] = 0;
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
                me.fireEvent('show', [me]);

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
    },

    reposition: function() {
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
            this.fireEvent('cancel', [this]);
        }
    },

    cancel: function() {
        this.fireEvent('cancel', [this]);
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

visualHUD.Views.windows.Download = visualHUD.Views.WindowBase.extend({
    mixin: [
        'visualHUD.Libs.formControlsBuilder',
        'visualHUD.Libs.formBuilderMixin.base'
    ],
    events: {
        'click button[name=downloadHUD]': 'beginDownload',
        'click button[name=cancel]': 'hide',
        'change input[name=hud_name]': 'validateName',
        'keyup input[name=hud_name]': 'validateNameBuffered'
    },
    html: ([
        '<div class="mb-20">',
        '<p>You are about to download your custom HUD. Please, name it and click [Download] button. </p>',
        'Don\'t know how to use a custom HUD? Check out holysh1t\'s custom <a href="http://www.holysh1t.net/quakelive-custom-hud-install-guide/" target="_blank">HUD install guide</a>.',
        '</div>'
    ]).join(''),

    init: function() {

        var form = this.buildForm([
            {
                type: 'form',
                cssClass: 'mwin-form',
                id: 'downloadHUDForm',
                action: visualHUD.ACTION_DOWNLOAD_HUD,
                method: 'post',
                items: [
                    {
                        type: 'textbox',
                        name: 'hud_data',
                        inputType: 'hidden',
                        wrap: false
                    },
                    {
                        type: 'textbox',
                        name: 'hud_name',
                        label: 'HUD name',
                        size: 32,
                        maxlength: 128,
                        value: '',
                        hint: 'HUD name should be at least 3 characters length and contain only letters and numbers'
                    },
                    {
                        type: 'checkbox',
                        name: 'save_preset',
                        tooltip: 'All custom presets are available from the Import dialog',
                        boxLabel: 'Save as custom preset',
                        checked: true
                    },
                    {
                        type: 'toolbar',
                        cssClass: 'pt-10',
                        items: [
                            {
                                type: 'button',
                                text: 'Download',
                                icon: 'download',
                                role: 'main',
                                action: 'submit',
                                name: 'downloadHUD'
                            },
                            {
                                type: 'button',
                                text: 'Cancel',
                                role: 'aux',
                                name: 'cancel'
                            }
                        ]
                    }
                ]
            }
        ]);

        this.$content.get(0).appendChild(form);
        
        this.validateNameBuffered = visualHUD.Function.createBuffered(this.validateName, 200, this);
 
        this.on('show', this.setFocus, this);
        this.on('cancel', this.hide, this);
    },

    setHUDName: function(name) {
        if(name) {
            this.$el.find('input[name=hud_name]').val(name);
        }
        return this;
    },
    
    beginDownload: function() {
        try {
            var name = this.$el.find('input[name=hud_name]').val(),
                data = this.collection.serialize(),
                output = {
                    name: name,
                    items: data
                };

            this.setHUDData(output);

            this.fireEvent('download', [this, output]);
            this.hide();
        }
        catch(e) {
            throw(e.message);
            return false;
        }
    },

    setFocus: function() {
        this.$el.find('input[name=hud_name]').focus();
        this.validateName();
    },

    validateName: function() {
        var textbox = this.$textbox || this.$content.find('input[name=hud_name]').get(0);
        var submitButton = this.$submitButton || this.$content.find('button[name=downloadHUD]');

        this.$submitButton = submitButton;
        this.$textbox = textbox;

        /*
            reg including spaces: /^[aA-zZ_\-\s0-9\.]{3,128}$/
         */
        var isValid = textbox.value.length && (/^[aA-zZ_\-0-9\.]{3,128}$/).test(textbox.value);
        submitButton.attr('disabled', isValid == false);
    },

    getForm: function() {
        var form = this.$form;

        if(form == undefined) {
            this.$form = form = this.$('#downloadHUDForm');
        }

        return form;
    },

    setHUDData: function(data) {
        if(_.isString(data) == false) {
            data = JSON.stringify(data)
        }
        this.$el.find('input[name=hud_data]').val(data);
    }
});

visualHUD.Views.windows.ImportHUD = visualHUD.Views.WindowBase.extend({
    mixin: [
        'visualHUD.Libs.formControlsBuilder',
        'visualHUD.Libs.formBuilderMixin.base'
    ],
    events: {
        'click button[name=loadHUD]': 'loadHUD',
        'click button[name=cancel]': 'hide',
        'click button[name=downloadPresets]': 'downloadPresets',
        'keyup textarea[name=hud_json]': 'validateHUDJsonBuffered',
        'keyup input[name=preset_filter]': 'filterPresetsBuffered',
        'change input[name=preset_filter]': 'filterPresets',
        'change form': 'updateFormStatus',
        'change input[name=myCustomPreset]': 'processSelectedFiles'
    },
    html: ([
        '<div class="mb-20">',
        'To add more presets, click [Browse For Presets...] button and choose *.vhud files to import. Also you can simply drag and drop these files right into the browser window.<a href="help/#import" target="help" class="ml-10">Learn more</a>',
        '</div>'
    ]).join(''),

    init: function() {
        this.createDlPresetForm();
        this.createImportForm();
        this.bindExtraEvents();
        this.setDlPresetButtonState();

        this.customHUDPresetsList = this.$('#customHUDList').data('component');
    },

    importPredefined: function() {
        this.$el.find('[value=predefined]').attr('checked', true);
        this.showPredefinedHUDPresets();
        this.show();
    },

    importCustom: function() {
        this.$el.find('[value=custom]').attr('checked', true);
        this.showCustomHUDPresets();
        this.show();
    },

    bindExtraEvents: function() {
        this.validateHUDJsonBuffered = visualHUD.Function.createBuffered(this.validateHUDJson, 200, this);
        this.filterPresetsBuffered = visualHUD.Function.createBuffered(this.filterPresets, 200, this);

        var onListUpdateBuffered = visualHUD.Function.createBuffered(this.onListUpdate, 250, this);
        this.options.customPresetsCollection.on('add', onListUpdateBuffered);
        this.options.customPresetsCollection.on('remove', onListUpdateBuffered);
        this.options.customPresetsCollection.on('all', this.setDlPresetButtonState, this);

        var focusField = this.$el.find('[name=preset_filter]').get(0);

        this.on('show', focusField.focus, focusField);
        this.on('show', this.validateHUDJson, this);

        this.on('hide', this.reset, this);
        this.on('load', this.hide, this);
        this.on('cancel', this.hide, this);
    },

    importPredefinedHUD: function(boundList, element, model, event) {
        if(model == undefined) {
            //  this.$content.find('[name=presetType][value=custom]').trigger('click', [true]);
            return true;
        }

        var actionElement = $(event.target).closest('li.action', element);

        if(actionElement.length) {
            var action = actionElement.data('action');
            switch(action) {
                case 'delete': {
                    boundList.collection.remove(model);
                    break;
                }
                case 'download':{
                    this.fireEvent('download.preset', [model.attributes]);
                    break;
                }
            }
        }
        else {
            this.fireEvent('load', [model.attributes]);
        }
    },

    toggleNameField: function(state) {
        var nameField = this.$nameField || this.$('#HUDNameTextbox');
            
        if(state) {
            this.$nameField = nameField.removeClass('hidden');
            nameField.find('input').val('').get(0).focus();
        }
        else {
            this.$nameField = nameField.addClass('hidden');
            nameField.find('input').val('');
        }
        
        this.reposition();
    },
    
    showCustomHUDControl: function() {
        var customHUDControl = this.$customHUDControl || this.$('#customHUDControl');
        var predefinedHUDPresets = this.$predefinedHUDPresets || this.$('#predefinedHUDPresets');
        var customHUDPresets = this.$customHUDPresets || this.$('#customHUDPresets');

        this.$customHUDControl = customHUDControl.removeClass('hidden');
        this.$predefinedHUDPresets = predefinedHUDPresets.addClass('hidden');
        this.$customHUDPresets = customHUDPresets.addClass('hidden');


        this.reposition();

        this.$el.find('[name=hud_json]').focus().select();
    },

    showPredefinedHUDPresets: function() {
        var customHUDControl = this.$customHUDControl || this.$('#customHUDControl');
        var predefinedHUDPresets = this.$predefinedHUDPresets || this.$('#predefinedHUDPresets');
        var customHUDPresets = this.$customHUDPresets || this.$('#customHUDPresets');

        this.$customHUDControl = customHUDControl.addClass('hidden');
        this.$predefinedHUDPresets = predefinedHUDPresets.removeClass('hidden');
        this.$customHUDPresets = customHUDPresets.addClass('hidden');

        this.reposition();
    },

    showCustomHUDPresets: function() {
        var customHUDControl = this.$customHUDControl || this.$('#customHUDControl');
        var predefinedHUDPresets = this.$predefinedHUDPresets || this.$('#predefinedHUDPresets');
        var customHUDPresets = this.$customHUDPresets || this.$('#customHUDPresets');

        this.$customHUDControl = customHUDControl.addClass('hidden');
        this.$predefinedHUDPresets = predefinedHUDPresets.addClass('hidden');
        this.$customHUDPresets = customHUDPresets.removeClass('hidden');

        this.$el.find('[name=preset_filter]').focus();
        this.reposition();
    },

    validateHUDJson: function() {
        var textbox = this.$textarea || this.$content.find('[name=hud_json]').get(0);
        var checkedPresetOptions = this.$content.find('[name=presetType]:checked');
        var presetType = checkedPresetOptions.val();
        var submitButton = this.$submitButton || this.$content.find('button[name=loadHUD]');

        this.$submitButton = submitButton;
        this.$textbox = textbox;

        var isValid = false;

        if(presetType == 'custom') {
            try {
                var data = JSON.parse(textbox.value);
                if(_.isArray(data)) {
                    isValid = data.length;
                }
                else if(_.isObject(data)) {
                    isValid = data.items.length;
                    if(data.name) {
                        this.toggleNameField(true);
                        this.$el.find('[name=hud_name]').val(data.name);
                        this.$el.find('[name=save_preset]').attr('checked', true);
                    }
                }
            }
            catch(e) {
            }
        }

        submitButton.attr('disabled', isValid == false);
    },

    filterPresets: function(event) {
        var value = event.target.value,
            regex = new RegExp(value, 'gi');

        this.options.customPresetsCollection.each(function(model) {
            var el = this.customHUDPresetsList.getElementByModel(model);

            if(model.get('name').match(regex) == null) {
                el.hide()
            }
            else {
                el.show();
            }
        }, this);
    },

    updateFormStatus: function(event) {
        var element = $(event.currentTarget);
        var values = this.serializeForm();
        var name = event.target.name;
        
        switch(values[name]) {
            case 'predefined': {
                this.showPredefinedHUDPresets();
                break;
            }
            case 'custom': {
                this.showCustomHUDPresets();
                break;
            }
        }
        
        switch(name) {
            case 'save_preset': {
                this.toggleNameField(!!values[name]);
                break;
            }
        }

        this.validateHUDJson();
    },
    
    reset: function() {
        this.$content.find('form').get(0).reset();
        this.showCustomHUDPresets();
        this.$content.find('[name=presetType][value=custom]').attr('checked', true);
    },

    cancel: function() {
        this.hide();
    },

    loadHUD: function() {
        var values = this.serializeForm(),
            json, data, name = values.hud_name

        switch(values.presetType) {
            case 'custom': {
                try {
                    data = JSON.parse(values.hud_json);
                }
                catch(e) {
                    visualHUD.growl.alert({
                        status: 'error',
                        title: 'Invalid HUD Preset',
                        message: visualHUD.messages.HUD_PARSE_ERROR
                    });
                }
                break;
            }
        }

        if(_.isArray(data) && data.length) {
            this.fireEvent('load', [{
                name: name,
                items: data
            }]);
        }
        else if(_.isObject(data) && data.items.length) {
            this.fireEvent('load', [data]);
        }
    },

    onListUpdate: function() {
        if(this.opened) {
            this.reposition();
        }
    },

    createImportForm: function() {
        var form = this.buildForm([
            {
                type: 'form',
                cssClass: 'mwin-form',
                id: 'importHUDForm',
                items: [
                    {
                        type: 'radiobuttonGroup',
                        layout: 'inline',
                        label: 'Choose preset',
                        options: [
                            {
                                name: 'presetType',
                                value: 'custom',
                                boxLabel: 'Custom',
                                checked: true
                            },
                            {
                                name: 'presetType',
                                value: 'predefined',
                                boxLabel: 'Predefined'
                            }
                        ]
                    },
                    {
                        type: 'container',
                        id: 'customHUDControl',
                        cssClass: 'hidden',
                        items: [
                            {
                                type: 'textarea',
                                name: 'hud_json',
                                label: '',
                                rows: 3,
                                hint: 'Custom HUD code can be found at *.vhud file. <a href="help/#import" target="help">Learn more</a>'
                            },
                            {
                                type: 'checkbox',
                                name: 'save_preset',
                                tooltip: 'Check this option if you want to be able edit this HUD later without importing code from external file',
                                boxLabel: 'Name preset to add it to My HUDs collection',
                                checked: false
                            },
                            {
                                type: 'textbox',
                                id: 'HUDNameTextbox',
                                cssClass: 'hidden',
                                name: 'hud_name',
                                label: '',
                                size: 32,
                                maxlength: 128,
                                value: ''
                            }
                        ]
                    },

                    {
                        type: 'container',
                        cssClass: 'hidden mb-10',
                        id: 'predefinedHUDPresets',
                        items: {
                            type: 'component',
                            constructorName: 'visualHUD.Views.SystemHUDPresetList',
                            collection: this.options.presetCollection,
                            scope: this,
                            itemclick: this.importPredefinedHUD
                        }
                    },
                    {
                        type: 'container',
                        cssClass: 'mb-10 clearfloat',
                        id: 'customHUDPresets',
                        items: [
                            {
                                type: 'textbox',
                                label: null,
                                placeholder: 'Find preset',
                                name: 'preset_filter'
                            },
                            {
                                type: 'component',
                                constructorName: 'visualHUD.Views.CustomHUDPresetList',
                                id: 'customHUDList',
                                collection: this.options.customPresetsCollection,
                                scope: this,
                                itemclick: this.importPredefinedHUD
                            },
                            {
                                type: 'button',
                                cssClass: 'download-presets-button',
                                text: 'Download All Presets',
                                name: 'downloadPresets'
                            }
                        ]
                    },
                    {
                        type: 'toolbar',
                        cssClass: 'import-form-buttons',
                        items: [
                            {
                                type: 'fileInput',
                                text: 'Browse For Presets...',
                                name: 'myCustomPreset',
                                wrap: false
                            },
                            {
                                type: 'button',
                                text: 'Cancel',
                                action: 'reset',
                                role: 'aux',
                                name: 'cancel'
                            }
                        ]
                    }
                ]
            }
        ]);
        this.$content.get(0).appendChild(form);
    },

    createDlPresetForm: function() {
        var form = this.buildForm([
            {
                type: 'form',
                cssClass: 'hidden',
                id: 'downloadPresetsForm',
                action: visualHUD.ACTION_DOWNLOAD_PRESETS,
                method: 'post',
                items: [
                    {
                        type: 'textbox',
                        name: 'hud_data',
                        inputType: 'hidden',
                        wrap: false
                    }
                ]
            }
        ]);

        this.$content.get(0).appendChild(form);
    },
    setDlPresetButtonState: function() {
        this.$downloadPresetsButton = this.$downloadPresetsButton || this.$content.find('button.download-presets-button');
        var downloadPresetsButton = this.$downloadPresetsButton;
        var displayFn = this.options.customPresetsCollection.length == 0 ? 'hide' : 'show';
        downloadPresetsButton[displayFn]();

    },

    downloadPresets: function() {
        var data = this.options.customPresetsCollection.toJSON();
        this.$('#downloadPresetsForm').find('[name=hud_data]').val(JSON.stringify(data));
        this.$('#downloadPresetsForm').submit();
    },

    processSelectedFiles: function(event) {
        var files = Array.prototype.slice.call(event.target.files);

        if(files.length) {
            visualHUD.Libs.importHelper.batchImport(files, {
                scope: this,
                files: function(output) {
                    this.fireEvent('import.text', [output]);
                }
            });
            this.showCustomHUDPresets();
        }

        event.target.value = '';
    }
});

visualHUD.Views.windows.ImportImage = visualHUD.Views.WindowBase.extend({
    mixin: [
        'visualHUD.Libs.formControlsBuilder',
        'visualHUD.Libs.formBuilderMixin.base'
    ],
    events: {
        'click button[name=setCustomImage]': 'setImage',
        'click button[name=cancel]': 'hide'
    },
    html: ([
        '<div class="mb-20">',
        'You can use images up to 300Kb in size, supported formats are JPEGs, GIFs and PNGs',
        '</div>'
    ]).join(''),

    init: function () {
        var form = this.buildForm([
            {
                type: 'form',
                cssClass: 'mwin-form',
                id: 'importHUDForm',
                items: [
                    {
                        type: 'fileInput',
                        name: 'customImage',
                        label: null,
                        text: 'Choose image'
                    },
                    {
                        type: 'toolbar',
                        items: [
                            {
                                type: 'button',
                                text: 'Set Custom Background',
                                role: 'main',
                                name: 'setCustomImage'
                            },
                            {
                                type: 'button',
                                text: 'Cancel',
                                role: 'aux',
                                name: 'cancel'
                            }
                        ]
                    }
                ]
            }
        ]);

        this.$content.get(0).appendChild(form);
        this.$submitButton = this.$content.find('button[name=setCustomImage]').attr('disabled', 'disabled');
        this.$form = this.$content.find('form');
        this.$fileInput = this.$content.find('input[name=customImage]');
        this.$fileInput.bind('change', visualHUD.Function.bind(this.handleFileSelect, this));

        this.on('hide', this.reset, this);
    },

    handleFileSelect: function (event) {
        var file = event.target.files[0];

        if (file) {
            if (visualHUD.Libs.importHelper.checkImageType(file) == false) {
                return this.reset();
            }

            if (visualHUD.Libs.importHelper.checkImageSize(file) == false) {
                return this.reset();
            }


            var reader = new FileReader();
            reader.onload = visualHUD.Function.bind(this.onLoad, this, [file], true);
            reader.readAsDataURL(file);
        }
        else {
            this.$submitButton.attr('disabled', true);
        }
    },

    onLoad: function (event, file) {
        this.$submitButton.attr('disabled', false);
        this.src = event.target.result;
    },

    setImage: function () {
        if (this.src) {
            this.fireEvent('import', [this.src]);
            this.src = null;
            this.hide();
        }
    },

    reset: function () {
        this.$form.get(0).reset();
        this.$fileInput.trigger('change');
        this.$submitButton.attr('disabled', true);
        return true;
    }
});

visualHUD.Views.windows.Feedback = visualHUD.Views.WindowBase.extend({
    mixin: [
        'visualHUD.Libs.formControlsBuilder',
        'visualHUD.Libs.formBuilderMixin.base'
    ],
    events: {
        'submit form': 'sendReport',
        'focus form': 'suppressValidation',
        'blur form': 'validate',
        'click button[name=cancel]': 'hide'
    },
    _html: ([
        '<div class="mb-20">',
        '<p>Want to help? Send as much details as you can, especially describing your actions. This way I can easely reproduce the problem and fix it. Here is an example of good bug report:</p>',
        '<blockquote>"I was clicking [Apply] button and get an error message."</blockquote>',
        '</div>'
    ]).join(''),

    init: function() {

        var form = this.buildForm([
            {
                type: 'form',
                cssClass: 'mwin-form',
                id: 'feedbackForm',
                action: visualHUD.ACTION_CONTACT,
                method: 'post',
                items: [
                    {
                        type: 'container',
                        cssClass: 'row-fluid',
                        items: [
                            {
                                type: 'textbox',
                                name: 'name',
                                cssClass: 'span-6',
                                required: true,
                                label: 'Your name',
                                size: 32,
                                maxlength: 128,
                                value: ''
                            },
                            {
                                type: 'textbox',
                                name: 'email',
                                inputType: 'email',
                                cssClass: 'span-6',
                                label: 'Email address',
                                size: 32,
                                maxlength: 128,
                                value: ''
                            },
                            {
                                type: 'textbox',
                                name: 'verify',
                                cssClass: 'hidden'
                            }
                        ]
                    },

                    {
                        type: 'textarea',
                        name: 'comments',
                        label: 'Message',
                        required: true,
                        rows: 5,
                        value: ''
                    },
                    {
                        type: 'toolbar',
                        cssClass: 'pt-10',
                        items: [
                            {
                                type: 'button',
                                text: 'Send',
                                role: 'main',
                                action: 'submit',
                                name: 'submit'
                            },
                            {
                                type: 'button',
                                text: 'Cancel',
                                role: 'aux',
                                name: 'cancel'
                            }
                        ]
                    }
                ]
            }
        ]);

        this.$content.get(0).appendChild(form);
        this.$form = this.$('#feedbackForm');

        var form = this.$form.get(0);

        this.on('show', this.setFocus, this);
        this.on('cancel', this.hide, this);
        this.on('hide', this.reset, this);
    },

    validate: function(event) {
        var target = $(event.target);
        var validClsFn = 'addClass';

        if(target.get(0).validity.valid == true) {
            validClsFn = 'removeClass';
        }
        target[validClsFn]('invalid-field');
    },

    suppressValidation: function(event) {
        var target = $(event.target);
        target.removeClass('invalid-field');
    },

    reset: function() {
        this.$form.get(0).reset();
        this.$form.find('.invalid-field').removeClass('invalid-field');
    },

    sendReport: function(event) {
        var serial = this.$form.serializeArray();
        var reportData = [];
        var isBot = false;

        var submitButton =  this.$form.find('button[type=submit]').attr('disabled', true);

        $.each(serial, function(){
            if(this.name == 'verify' && this.value.length > 0) {
                isBot = true;
            }
            if(this.name == 'comments'){
                this.value += '\n---------------\n\n';
            }
        });

        if(isBot == false) {
            $.ajax({
                type: this.$form.get(0).method,
                url: this.$form.get(0).action,
                data: serial,
                complete: visualHUD.Function.bind(function(xhr, status, page, section){
                    var code = xhr.status,
                        html = xhr.responseText;

                    if(code == 200) {
                        this.hide();
                        visualHUD.growl.alert({
                            status: 'success',
                            title: 'Thanks, mate!',
                            message: 'Your message has been successfully sent.'
                        });
                    }
                    else {
                        this.trigger('update.error', xhr);
                    }

                    submitButton.attr('disabled', false);


                }, this)
            });
        }
        else {
            this.hide();
        }

        return false;
    },

    setFocus: function() {
        this.$el.find('input[name=name]').focus();
    }
});

visualHUD.Views.BoundList = Backbone.View.extend({
    tagName: 'ul',
    className: 'bound-list',

    opened: false,
    rendered: false,

    events: {
        'click .bound-list-item': 'itemClick'
    },

    defaults: {
    },

    renderTo: null,

    emptyListMessage: 'No items here yet',

    emptyTpl: ([
            '<div class="empty-list-message">',
                '<%= message %>',
            '</div>'
        ]).join(''),

    itemTpl: ([
        '<div class="bound-list-item-body">',
            '<%= name %>',
        '</div>'
        ]).join(''),

    listItemTpl: '<li class="bound-list-item" data-cid="<%= cid %>"><%= itemHTML %></li>',

    initialize: function(options) {
        _.extend(this, this.defaults, options || {});

        if(this.collection) {
            this.bindCollection(this.collection);
        }

        if(this.cls) {
            this.$el.addClass(this.cls);
        }

        this.bindEvents();

        this.getRefs();

        this.init();
        this.render(this.renderTo);
    },

    /**
     * Abstract function that will be executed during construction
     */
    init: function() {
    },

    bindCollection: function(collection) {
        this.collection = collection;

        this.collection.on('change', this.updateListItem, this);
        this.collection.on('add', this.addListItem, this);
        this.collection.on('remove', this.removeListItems, this);

        this.collection.on('all', this.refresh, this);

        this.refresh();
    },

    render: function(renderTo) {
        if(renderTo) {
            this.$el.appendTo(this.renderTo);
            this.rendered = true;
            this.fireEvent('render', this);
        }
    },

    getRefs: function() {
        this.$contentWrapper = this.$el.find('div.xpk-mwindow-wrap');
        this.$content = this.$el.find('div.xpk-win-content');
        this.$title = this.$el.find('.xpk-win-head h3');
        this.$closeButton = this.$el.find('.xpk-close-button');

        this.$closeButton.click($.proxy(this.hide, this));
        this.$el.click($.proxy(this.cancelEventBubbling, this));
    },

    updateListItem: function(model, options) {

    },

    addListItem: function(model, options) {

    },

    removeListItems: function(models, options) {

    },

    refresh: function(models, options) {
        var me = this,
            html = [],
            liTpl = _.template(this.listItemTpl),
            itemTpl = _.template(this.itemTpl);

        this.$el.children().remove();

        if(this.collection.length) {
            this.collection.each(function(model) {
                var itemHTML = itemTpl(model.toJSON());
                html.push(
                    liTpl({
                        cid: model.cid,
                        itemHTML: itemHTML
                    })
                );
            });
        }
        else {
            html.push(
                liTpl({
                    cid: null,
                    itemHTML: _.template(this.emptyTpl, {message: this.emptyListMessage})
                })
            )
        }
        
        this.$el.append(html.join(''));

        this.fireEvent('refresh', this);
    },

    itemClick: function(event) {
        var model = this.getModelByElement(event.currentTarget);
        this.fireEvent('itemclick', this, $(event.currentTarget), model, event);
    },

    getModelByElement: function(element) {
        var element = $(element),
            modelCid = element.data('cid'),
            model = this.collection.getByCid(modelCid);

        return model;
    },

    getElementByModel: function(model) {
        var cid = model.cid;
        var element = this.$el.find('[data-cid=' + cid + ']');

        return element.length ? element : null;
    },

    bindEvents: function() {
        if(this.options.itemclick){
            this.on('itemclick', this.options.itemclick, this.scope || this);
        }
        if(this.options.refresh){
            this.on('refresh', this.options.refresh, this.scope || this);
        }
        if(this.options.render){
            this.on('render', this.options.render, this.scope || this);
        }
    },

    cancelEventBubbling: function(event) {
        event.stopPropagation();
    }
});visualHUD.Views.CustomHUDPresetList = visualHUD.Views.BoundList.extend({
    cls: 'custom-hud-list',
    collection: null,
    emptyListMessage: 'No presets here yet. Click here to add one',
    itemTpl: ([
        '<div class="bound-list-item-body">',
        '<span class="item-name"><%= name %></span>',
        '<ul class="custom-hud-actions">',
        '<li class="action icon-download" data-tooltip="Download this HUD" data-action="download"><span>Download this hud</span></li>',
        '<li class="action icon-trash" data-tooltip="Delete" data-action="delete"><span>Delete this hud</span></li>',
        '</ul>',
        '</div>'
    ]).join(''),

    emptyTpl: ([
        '<div class="empty-list-message">',
            '<%= message %>',
            '<input type="file" name="myCustomPreset" multiple="true" />',
        '</div>'
    ]).join('')
});visualHUD.Views.SystemHUDPresetList = visualHUD.Views.BoundList.extend({
    cls: 'custom-hud-list',
    collection: null,
    emptyListMessage: 'No presets here yet. Click here to add one',
    itemTpl: ([
        '<div class="bound-list-item-body">',
        '<span class="item-name"><%= name %></span>',
        '</div>'
    ]).join('')
});visualHUD.Widgets.ToolTip = Backbone.View.extend({
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
        cls: '',
        opacity: 1,
        maxWidth: 500,
        offset: 10,
        cancelEventBubbling: true,
        html: 'This is popover content',
        title: 'Pop Over',
        position: 'top-left', // tr | tc |
        trigger: 'hover' // focus | click | manual
    },

    currentPosition: null,

    events: {
        'click': 'cancelEventBubbling'
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

        if(this.options.cls) {
            this.$el.addClass(this.options.cls);
        }
        
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
        $(window).bind('resize.hidePopover', visualHUD.Function.bind(this.hide, this));
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
        $(window).unbind('resize.hidePopover', visualHUD.Function.bind(this.hide, this));
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
        if(this.options.cancelEventBubbling == true) {
            event.stopPropagation();
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

/**
 * HUDManager is user to manage all HUD design operations
 * Full CRUD cycle for every supported HUD Item
 * @type {*}
 */
visualHUD.Controllers.HUDManager = Backbone.Controller.extend({
    views: [
        'HUDItem',
        'HUDItemForm'
    ],

    models: [
        'HUDItem',
        'ClientSettings'
    ],

    collections: [
        'HUDItemTemplates',
        'HUDItemIconEnums',
        'HUDItems',
        'CustomHUDPresets'
    ],

    AUTOSAVE_TIMEOUT: 300000,

    initialize: function(options) {
        this.addListeners({
            'Viewport': {
                'import.image': this.importImage,
                'import.text': this.importHUDPresets
            },        
            'viewport.TopBar': {
                'align.action': this.alignItems,
                'toolbar.hud:action': this.groupActions
            },        
            'viewport.StageControls': {
                'item.drop': this.dropNewHUDItem
            },
            'viewport.Canvas': {
                'drop.move': this.onItemMove
            },
            'windows.ImportHUD': {
                'load': this.loadHUD,
                'download.preset': this.downloadPreset,
                'import.text': this.importHUDPresets
            },
            'windows.Download': {
                'download': this.onDownload
            },
            'windows.ImportImage': {
                'import': this.importImage
            },
            'Form': {
                'align.action': this.alignItems,
                'arrange.action': this.arrangeItems
            },
            'HUDItem': {
                'click': this.onHUDItemClick,
                'destroy': this.onHUDItemDestroy
            },
            // Events generated by KeyboardManager Controller
            'keyboard': {
                'select.all': this.selectAllHUDItems,
                'delete': this.deleteSelectedItems,
                'move': this.moveSelectedItems,
                'group': this.groupSelectedItems,
                'clone': this.cloneSelectedItems,
                'arrange': this.arrangeItems
            }
        });
    },

    onLaunch: function() {
        var HUDItemsCollection = this.getCollection('HUDItems');
        var clientSettingsModel = this.getModel('ClientSettings');

        clientSettingsModel.on('change', this.updateHUDItemStatus, this);

        HUDItemsCollection.on('add', this.addNewHUDItem, this);
        // HUDItemsCollection.on('change', this.syncPresets, this);
        HUDItemsCollection.on('load', this.loadDraft, this);

        // Load saved HUD Items
        $(window).load(visualHUD.Function.bind(HUDItemsCollection.load, HUDItemsCollection, []));
    },

    /**
     * Event handler triggered by visualHUD.Collections.HUDItems
     * Restore previously saved draft
     */
    loadDraft: function() {
        console.log('load draft triggered');

        if(this.getCollection('HUDItems').length == 0) {
            return this.showGetStartedMessage();
        }

        var canvasView = this.getApplicationView('viewport.Canvas'),
            trash = [];

        canvasView.beginUpdate();

        this.selectAllHUDItems();
        this.deleteSelectedItems();

        this.getCollection('HUDItems').each(function(record) {
            var statusText = this.getModel('ClientSettings').getStatusByName(record.get('name'));
            (statusText) && record.set('text', statusText, {silent: true});

            // using try catch in order to skip damaged/incorrect hud items
            try {
                this.createNewHUDItem(record);
            }
            catch(e) {
                trash.push(record);
                console.warn('Invalid HUD Data!', record.toJSON());
            }
        }, this);
        // remove damaged items from collection
        // and show error message        
        if(trash.length) {
            this.application.growl.alert({
                status: 'warning',
                title: 'Some Items Were Not Imported',
                message: _.template(visualHUD.messages.HUD_ELEMENTS_PARSE_ERROR, {count: trash.length})
            });
            this.getCollection('HUDItems').remove(trash);
        }
        canvasView.completeUpdate();
    },

    showGetStartedMessage: function() {
        var $message = this.application.growl.alert({
            status: 'info',
            title: 'Get Started',
            delay: 20000,
            message: ([
                '<p>Visual HUD is ready to rock, but there are no HUD items yet. Would you like to import something?</p>',
                '<a href="#" class="import">Import HUD</a>'
            ]).join('')
        });

        $message.find('a.import').click(visualHUD.Function.bind(function() {
            var view = this.getApplicationView('windows.ImportHUD');

            if(this.getCollection('CustomHUDPresets').length > 0) {
                view.importCustom();
            }
            else {
                view.importPredefined();
            }

            this.application.growl.hide($message);
            return false;
        }, this));
    },

    /**
     * Event handler triggered by StageControls View when new HUD Item has been dropped to the canvas
     * @param record
     * @param position
     */
    dropNewHUDItem: function(record, position) {
        var HUDItemModelClass = this.getModelConstructor('HUDItem');
        var HUDItemModel = new HUDItemModelClass();
        var statusText = this.getModel('ClientSettings').getStatusByName(record.get('id'));

        HUDItemModel.setDefaultValues({
            name: record.get('id'),
            itemType: record.get('itemType')
        }).set({
            cssClass: record.get('cssClass'),
            label: record.get('label'),
            coordinates: position
        });

        HUDItemModel.wasDropped = true;

        if(statusText) {
            HUDItemModel.set('text', statusText);
        }

        this.getCollection('HUDItems').add(HUDItemModel);
    },

    /**
     * Create new visualHUD.Views.HUDItem instance based on visualHUD.Models.HUDItem data
     * @param record
     * @return {Object} HUDItem visualHUD.Views.HUDItem instance
     */
    createNewHUDItem: function(record) {
        var HUDItemTemplates = this.getCollection('HUDItemTemplates');
        var canvasView = this.getApplicationView('viewport.Canvas');
        var viewportView = this.getApplicationView('Viewport');
        var stageControlsView = viewportView.getStageControlsView();

        var HUDItemViewClass = this.getViewConstructor('HUDItem');
        var formViewClass = this.getViewConstructor('HUDItemForm');
        var HUDItemIconEnums = this.getCollection('HUDItemIconEnums')

        var formView = new formViewClass({
            alias: 'Form',
            model: record,
            renderTo: viewportView.$sidebarArea,
            collections: {
                'HUDItemIconEnums': HUDItemIconEnums
            }
        });

        var HUDItem = new HUDItemViewClass({
            alias: 'HUDItem',
            HUDItemIconEnums: HUDItemIconEnums,
            renderTo: canvasView.$canvas,
            model: record,
            wasDropped: record.wasDropped,
            formView: formView,
            htmlTplRecord: HUDItemTemplates.get(record.get('name'))
        });

        stageControlsView.updateControlsStatus('create', record.get('name'));

        delete record.wasDropped;

        return HUDItem;
    },

    /**
     * Event handler triggered by visualHUD.Collections.HUDItems when new record has been added to the collection
     * @param record
     */
    addNewHUDItem: function(record) {
        var canvasView = this.getApplicationView('viewport.Canvas');
        var HUDItem = this.createNewHUDItem(record);
        canvasView.select(HUDItem, false);
    },

    /**
     * Event handler Triggered by visualHUD.Libs.canvasDragInterface
     * @param HUDElementView
     */
    onItemMove: function(HUDElementView) {
        var canvasView = this.getApplicationView('viewport.Canvas');

        _.each(canvasView.getSelection(), function(view) {
            view.refreshCoordinates();
        });

        canvasView.disableSelection();
    },

    /**
     * Event handler triggered by visualHUD.Views.HUDItem when item is clicked
     * Used to blur focused form element and select clicked item
     * @param HUDItem
     * @param event
     */
    onHUDItemClick: function(HUDItem, event) {
        var canvasView = this.getApplicationView('viewport.Canvas');
        this.application.getController('FocusManager').blur();
        canvasView.select(HUDItem, event.shiftKey || event.ctrlKey);
        canvasView.enableSelection();
    },

    /**
     * Triggered by visualHUD.Views.HUDItem when item is destroyed
     * Used to update StageControls state (for example, enable chat icon)
     * @param record
     */
    onHUDItemDestroy: function(record) {
        var viewportView = this.getApplicationView('Viewport'),
            stageControlsView = viewportView.getStageControlsView();

        stageControlsView.updateControlsStatus('destroy', record.get('name'));
    },

    /**
     * Event handler Triggered by visualHUD.Models.ClientSettings
     * Used to update status of the particular HUD Item
     * @param model
     * @param options
     */
    updateHUDItemStatus: function(model, event) {
        var changes = event.changes;
        var HUDItemsCollection = this.getCollection('HUDItems');

        _.each(changes, function(set, field) {
            var value = model.get(field),
                namePattern,
				fieldToUpdate = 'text';

            switch(field) {
                case 'statusHealth': {
                    namePattern = /healthIndicator|healthBar/;
                    break;
                }
                case 'statusArmor': {
                    namePattern = /armorIndicator|armorBar/;
                    break;
                }
                case 'statusAmmo': {
                    namePattern = /ammoIndicator/;
                    break;
                }
                case 'statusAccuracy': {
                    namePattern = /accuracyIndicator/;
                    break;
                }
                case 'statusSkill': {
                    namePattern = /skillIndicator/;
                    break;
                }
                case 'ownerDrawFlag': {
					return HUDItemsCollection.filterItemsByOwnerDraw(value);
                }
            }

            HUDItemsCollection.each(function(record){
                var name = record.get('name');

                if(namePattern && namePattern.test(name)) {
                    record.set(fieldToUpdate, value);
                }
            });
        }, this);
    },

    /**
     * Align items action delegated to the visualHUD.Libs.layersManager
     * Triggered by different buttons
     * @param value
     */
    alignItems: function(value){
        var canvasView = this.getApplicationView('viewport.Canvas');
        visualHUD.Libs.layersManager.alignEdges(canvasView, value);

        _.each(canvasView.getSelection(), function(view) {
            view.refreshCoordinates();
        });
    },

    /**
     * Arrange items action delegated to the visualHUD.Libs.layersManager
     * Triggered by different buttons
     * @param value
     */
    arrangeItems: function(value){
        var canvasView = this.getApplicationView('viewport.Canvas');
        visualHUD.Libs.layersManager.arrangeLayers(canvasView, value);
        canvasView.updateIndexes();
        this.getCollection('HUDItems').sort();
    },
    /**
     * Triggered by TopBar view when HUD action buttons are clicked
     * @param {String} action The name of the action being triggered
     */
    groupActions: function(action){
        switch(action) {
            case 'deleteSelected': {
                this.deleteSelectedItems();
                break;
            }
            case 'groupSelected': {
                this.groupSelectedItems();
                break;
            }
            case 'cloneSelected': {
                this.cloneSelectedItems();
                break;
            }
            case 'undoUpdate': {
                this.application.getController('HistoryManager').undo();
                break;
            }
        }
    },
    /**
     * Function to select all HUD items
     * @param event
     */
    selectAllHUDItems: function(event) {
        var canvas = this.getApplicationView('viewport.Canvas');
        canvas.selectAll();
    },

    /**
     * Event triggered by KeyboardManager controller when pressing DEL button
     */
    deleteSelectedItems: function() {
        var canvas = this.getApplicationView('viewport.Canvas'),
            selection = canvas.getSelection();

        // reset HUDName if all HUD items are deleted
        if(this.getCollection('HUDItems').length == selection.length) {
            this.getModel('ClientSettings').set('HUDName', null);
        }

        _.each(selection, function(view) {
            view.model.destroy();
        });

        canvas.deselect();
    },

    /**
     * Event triggered by KeyboardManager controller when pressing arrow buttons
     * @param direction
     * @param offset
     */
    moveSelectedItems: function(direction, offset) {
        var canvas = this.getApplicationView('viewport.Canvas'),
            selection = canvas.getSelection();

        _.each(selection, function(view) {
            view.move(direction, offset);
        });
    },

    /**
     * Function to clone group/ungroup selected items
     * @param event
     */
    groupSelectedItems: function() {
        var canvas = this.getApplicationView('viewport.Canvas'),
            selection = canvas.getSelection(),
            masterElement = selection[0];
            isUngroup = false,
            groupGuid = null;

        _.each(selection, function(view) {
            if(view.getGroup()) {
                isUngroup = true;
            }
            else {
                groupGuid = groupGuid || visualHUD.Libs.utility.getGuid();
            }
            view.setGroup(groupGuid);
        });

        if(isUngroup == true) {
            canvas.deselect();
            canvas.select(masterElement);
        }
    },

    /**
     * Function to clone selected items
     * @param event
     */
    cloneSelectedItems: function(event) {
        var canvasView = this.getApplicationView('viewport.Canvas'),
            selection = Array.prototype.slice.call(canvasView.getSelection()),
            HUDItemModelClass = this.getModelConstructor('HUDItem');

        canvasView.deselect();

        _.each(selection, function(view) {
            var cloneData = view.model.toJSON();

            _.extend(cloneData, {
                group: null,
                coordinates: {
                    top: cloneData.coordinates.top + 10,
                    left: cloneData.coordinates.left + 10
                }
            });

            var newRecord = new HUDItemModelClass(cloneData),
                newItem = this.createNewHUDItem(newRecord);

            this.getCollection('HUDItems').add(newRecord, {silent: true});

            canvasView.select(newItem, true);
        }, this);
    },

    /**
     * Triggered by visualHUD.Views.LoadWindow when new HUD preset is being loaded
     * @param data
     */
    loadHUD: function(data, name, suppressLoad) {
        var name = data.name || name;

        if(_.isArray(data)) {
            data = {
                name: name,
                items: data
            }
        }

        if(name) {
            this.addCustomHUDPreset(data);
        }
        else {
            this.getModel('ClientSettings').set('HUDName', null);
        }

        var action = this.getCollection('HUDItems').length && suppressLoad !== true ?
                        window.confirm(visualHUD.messages.CONFIRM_HUD_OVERWRITE) : true;

        if(suppressLoad !== true && action) {
            this.getCollection('HUDItems').load(data.items);
        }

    },

    onDownload: function(view, data) {
        var values = view.serializeForm();

        if(values['save_preset']) {
            this.addCustomHUDPreset({
                name: data.name,
                items: view.collection.toJSON()
            });
        }
        else {
            this.getModel('ClientSettings').set('HUDName', null);
        }
    },

    downloadPreset: function(data) {
        var dlWindow = this.getApplicationView('windows.Download');

        dlWindow.setHUDData(data);
        dlWindow.getForm().submit();
    },

    syncPresets: function() {
        var HUDName = this.getModel('ClientSettings').get('HUDName');

        if(HUDName) {
            this.addCustomHUDPreset({
                name: HUDName,
                items: this.getCollection('HUDItems').toJSON()
            });
        }
    },

    addCustomHUDPreset: function(data) {
        var items = data.items,
            name = data.name,
            builtIn = data.isBuiltIn;

        if(builtIn === true) {
            return;
        }

        var presetRecord = this.getCollection('CustomHUDPresets').find(function(record) {
                return record.get('name') == name;
            });
            
        if(presetRecord) {
            presetRecord.set('items', items);
        }
        else {
            this.getCollection('CustomHUDPresets').add(data);
        }
        
        this.getModel('ClientSettings').set('HUDName', name);
    },

    /**
     * Triggered by visualHUD.Views.ImportImageWindow when new image is being uploaded
     * @param src
     */
    importImage: function(src) {
        var clientSettingsModel = this.getModel('ClientSettings');
        clientSettingsModel.set({
            'customBackground': src,
            'canvasShot': 3
        });
        this.getApplicationView('viewport.CanvasToolbar').setClientSettings({
            'canvasShot': 3
        });
    },
    
    importHUDPresets: function(presets) {
        var data = [],
            success = true,
            loadWindow = this.getApplicationView('windows.ImportHUD'),
            openLoadWindow = loadWindow ? loadWindow.opened == false : true,
            length = this.getCollection('HUDItems').length;

        _.each(presets, function(preset, idx) {
            try {
                // set suppress boolean to true only for the fist item in the collection
                var suppress = idx == 0 ? length > 0 : true
                this.loadHUD(JSON.parse(preset.json), preset.name || null,  suppress);
            }
            catch(e) {
                success = false;
                console.error('Failed to import HUD', preset.json);
            }
        }, this);

        if(success) {
            var message = '<%= count %> HUD<%= count==1 ? \' has\' : \'s have\' %> been successfuly imported! ';

            if(openLoadWindow == true) {
                message = [
                    '<p>', message, 'Would you like to review the new items?', '</p>',
                    '<a href="#" class="import">Open import manager</a>'
                ];
            }
            else {
                message = [message];
            }

            var growl = this.application.growl,
                viewportController = this.application.getController('Viewport');

            var $alert = growl.alert({
                title: 'Hooray! ',
                status: 'success',
                message: _.template(message.join(''), {count: presets.length})
            });

            $alert.find('a.import').click(visualHUD.Function.bind(function() {
                viewportController.loadPreset();
                growl.hide($alert);
                return false;
            }, this));
        }

    }

});

/**
 * KeyboardManager is user to manage all keyboard interactions
 * Using Application Event Bus to communicate with other controllers
 * @type {*}
 */
visualHUD.Controllers.KeyboardManager = Backbone.Controller.extend({
    keyCodeMap : {
        A: 65,
        V: 86,
        Z: 90,
        TAB: 9,
        F: 70,
        LEFT: 37,
        TOP: 38,
        RIGHT: 39,
        DOWN: 40,
        C: 67,
        D: 68,
        I: 73,
        DEL: 46,
        R: 82,
        G: 71
    },

    moveCodeMap: {
        '37': 'left',
        '38': 'top',
        '39': 'left',
        '40': 'top'
    },

    initialize: function(options) {
        $(document).bind('keydown', $.proxy(this, 'keyboardListiner'));
    },

    keyboardListiner: function(event) {
        var nodeName = event.target.nodeName;

        // don't do anything if we are focused on form element
        if(nodeName.match(/input|select|textarea|button|checkbox|radiobutton/gi)){
            return;
        }

        if(event.keyCode == this.keyCodeMap.D) {
            this.fireEvent('keyboard', 'download');
            return false;
        }

        if(event.keyCode == this.keyCodeMap.I) {
            this.fireEvent('keyboard', 'import');
            return false;
        }

        if(event.keyCode == this.keyCodeMap.R && event.ctrlKey && event.shiftKey) {
            var action = window.confirm(visualHUD.messages.CONFIRM_APPLICATION_RESET);

            if(action == true) {
                this.fireEvent('keyboard', 'reset');
            }

            return action;
        }

        if(event.keyCode == this.keyCodeMap.DEL) {
            this.fireEvent('keyboard', 'delete');
            return false;
        }

        if(event.keyCode == this.keyCodeMap.TAB){
            this.fireEvent('keyboard', 'fullscreen.toggle', [event]);
            return false;
        }

        if(event.keyCode == this.keyCodeMap.V && event.ctrlKey){
            this.fireEvent('keyboard', 'clone', [event]);
            return false;
        }

        if(event.keyCode == this.keyCodeMap.Z && event.ctrlKey){
            this.fireEvent('keyboard', 'undo', [event]);
            return false;
        }

        if(this.isArrangeKeyPressed(event) && event.ctrlKey) {
            var arrangeAction = this.getArrangeAction(event);
            this.fireEvent('keyboard', 'arrange', [arrangeAction]);
            return false;
        }

        if(this.isMoveKeyPressed(event.keyCode)) {
            var delta = this.getMoveDelta(event);
            var direction = this.getMoveDirection(event.keyCode);

            this.fireEvent('keyboard', 'move', [direction, delta]);
            return false;
        }

        if(event.keyCode == this.keyCodeMap.A && event.ctrlKey) {
            this.fireEvent('keyboard', 'select.all', [event]);
            return false;
        }

        if(event.keyCode == this.keyCodeMap.G && event.ctrlKey) {
            event.stopPropagation();
            event.preventDefault();

            this.fireEvent('keyboard', 'group', [event]);
            return false;
        }
    },

    isMoveKeyPressed: function(keyCode) {
        return _.include([
            this.keyCodeMap.TOP,
            this.keyCodeMap.LEFT,
            this.keyCodeMap.DOWN,
            this.keyCodeMap.RIGHT
        ], keyCode);
    },

    getMoveDirection: function(keyCode) {
        return this.moveCodeMap[keyCode];
    },

    getMoveDelta: function(event) {
        var delta = 1 * visualHUD.scaleFactor;

        if(event.keyCode == this.keyCodeMap.LEFT || event.keyCode == this.keyCodeMap.TOP) {
            delta *= -1;
        }

        if(event.shiftKey) {
            delta *= 10;
        }

        return delta;
    },

    isArrangeKeyPressed: function(event) {
        return _.include([
            this.keyCodeMap.TOP,
            this.keyCodeMap.DOWN
        ], event.keyCode);
    },

    getArrangeAction: function(event) {
        var arrangeMap = {
            '38': ['bring-front', 'bring-forward'],
            '40': ['send-back', 'send-backward']
        };

        var arrangeKey = arrangeMap[event.keyCode];
        var actionIndex = event.shiftKey ? 0 : 1;

        return arrangeKey[actionIndex];
    }
});

/**
 * FocusManager is user to track focused form elements
 * Using Application Event Bus to communicate with other controllers
 * @type {*}
 */
visualHUD.Controllers.FocusManager = Backbone.Controller.extend({
    initialize: function(options) {
        this.focusedItem = null;
    },

    onLaunch: function() {
        var viewportView = this.getApplicationView('Viewport');

        $(document).on('focus', 'form', $.proxy(this, 'focusListener'));
    },

    focusListener: function(event) {
        var nodeName = event.target.nodeName;

        // don't do anything if we are focused on form element
        if(nodeName.match(/input|select|textarea|button|checkbox|radiobutton/gi)){
            this.focusedItem = event.target;
        }
    },

    getFocused: function() {
        return this.focusedItem;
    },

    blur: function() {
        this.focusedItem && this.focusedItem.blur();
    }
});

visualHUD.Controllers.Viewport = Backbone.Controller.extend({
    views: [
        'Viewport',
        'viewport.CanvasToolbar',
        'viewport.Canvas',
        'viewport.TopBar',
        'viewport.StageControls',
        'GroupActionsPanel',
        'windows.Download',
        'windows.ImportHUD',
        'windows.ImportImage',
        'windows.Feedback'
    ],

    models: [
        'ClientSettings',
        'HUDItem'
    ],

    collections: [
        'StageControlsDictionary',
        'HUDItemTemplates',
        'HUDItemIconEnums',
        'HUDItems',
        'HUDPresets'
    ],

    initialize: function(options) {
        this.addListeners({
            'Viewport': {
                render: this.onViewportRender
            },
            'viewport.CanvasToolbar': {
                'toolbar.menu:show': this.onCanvasMenuShow,
                'toolbar.menu:hide': this.onCanvasMenuHide,
                'import.image': this.importImage
            },
            'viewport.TopBar': {
                'toolbar.global:action': this.toolbarAction,
                'feedback.action': this.feedbackAction
            },
            'viewport.Canvas': {
                'selectionchange': visualHUD.Function.createBuffered(this.onSelectionChange, 50, this),
                'import.image': this.importImage
            },
            'viewport.StageControls': {
                'scalefactor.change': this.switchScaleFactor,
                'layout.change': this.toggleFullscreen
            },
            'keyboard': {
                'fullscreen.toggle': this.toggleFullscreen,
                'reset': this.resetApplication,
                'import': this.loadPreset,
                'download': this.downloadHUD
            }
        });
    },

    onLaunch: function() {
        var clientSettingsModel = this.getModel('ClientSettings');

        var viewport = this.createApplicationView('Viewport', {
            clientSettingsModel: clientSettingsModel
        });
        var toolbar = this.createApplicationView('viewport.CanvasToolbar', {
            clientSettingsModel: clientSettingsModel
        });
        var canvas = this.createApplicationView('viewport.Canvas', {
            clientSettingsModel: clientSettingsModel
        });
        var topBar = this.createApplicationView('viewport.TopBar');

        var stageControls = this.createApplicationView('viewport.StageControls', {
            collection: this.getCollection('StageControlsDictionary')
        });

        this.createApplicationView('windows.Download', {
            width: 600,
            title: 'Download HUD',
            collection: this.getCollection('HUDItems')
        });

        this.createApplicationView('windows.ImportHUD', {
            width: 600,
            title: 'Import HUD',
            customPresetsCollection: this.getCollection('CustomHUDPresets'),
            presetCollection: this.getCollection('HUDPresets')
        });

        toolbar.render(viewport);
        canvas.render(viewport);
        topBar.render(viewport);
        stageControls.render(viewport);

        viewport.render([toolbar, canvas, topBar, stageControls]);
    },

    onViewportRender: function(view) {
        //this.initializeClientSettings();
    },

    importImage: function() {
        if(!this.getApplicationView('windows.ImportImage')) {
            this.createApplicationView('windows.ImportImage', {
                width: 600,
                title: 'Import Custom Background'
            });
        }

        this.getApplicationView('windows.ImportImage').show();
    },

    /**
     * Event handler triggered by visualHUD.Views.TopBar action
     * @param action
     */
    toolbarAction: function(action) {
        var fn = this[action];
        if(_.isFunction(fn)) {
            fn.apply(this, arguments);
        }
    },

    feedbackAction: function(action) {
        if(!this.getApplicationView('windows.Feedback')) {
            this.createApplicationView('windows.Feedback', {
                width: 600
            });
        }

        switch(action) {
            case 'send-feedback': {
                this.sendFeedback();
                break;
            }
            case 'report-bug': {
                this.reportBug();
                break;
            }
        }
    },

    /**
     * Event Handler triggered by TopBar [Download] button
     */
    downloadHUD: function() {
        var HUDItemsCollection = this.getCollection('HUDItems');
        var downloadWindow = this.getApplicationView('windows.Download');

        if(!this.getApplicationView('windows.Download')) {

        }

        if(HUDItemsCollection.length > 0) {
            this.getApplicationView('windows.Download')
                .setHUDName(this.getModel('ClientSettings').get('HUDName'))
                .show();
        }
        else {
            var $alert = this.application.growl.alert({
                title: 'Oops ;(',
                status: 'warning',
                message: ([
                    '<p>', visualHUD.messages.EMPTY_HUD_WARNING, '</p>',
                    '<a href="#" class="import">Import now</a>'
                ]).join('')
            });

            $alert.find('a.import').click(visualHUD.Function.bind(function() {
                this.loadPreset();
                this.application.growl.hide($alert);
                return false;
            }, this));
        }
    },

    /**
     * Event Handler triggered by TopBar [Load Preset] button
     */
    loadPreset: function() {


        this.getApplicationView('windows.ImportHUD').show();
    },

    /**
     * Event Handler triggered by TopBar [Restart Application] button
     */
    restartApplication: function() {
        window.location.reload();
    },

    /**
     * Event Handler triggered by TopBar [Report Bug] button
     */
    reportBug: function() {
        this.getApplicationView('windows.Feedback').setTitle('Report an Application Error');
        this.getApplicationView('windows.Feedback').show();
    },

    sendFeedback: function() {
        if(!this.getApplicationView('windows.Feedback')) {
            this.createApplicationView('windows.Feedback', {
                width: 600
            });
        }

        this.getApplicationView('windows.Feedback').setTitle('Give a Feedback');
        this.getApplicationView('windows.Feedback').show();
    },

    /**
     * Event Handler triggered by visualHUD.Views.Canvas selection model
     */
    onSelectionChange: function(view, selection) {
        this.getApplicationView('Viewport').hideAllSidebarItems();

        if(selection.length == 1) {
            selection[0].getForm().show()
        }        
        else {
            this.getApplicationView('viewport.StageControls').show();
            this.application.getController('FocusManager').blur();
        }
        
        this.getApplicationView('viewport.TopBar').updateToolbarButtonsState(selection.length);
    },

    onCanvasMenuShow: function() {
        this.getApplication().toolTips.disable();
    },

    onCanvasMenuHide: function() {
        this.getApplication().toolTips.enable();
    },

    toggleFullscreen: function(arg) {        
        var clientSettingsModel = this.getModel('ClientSettings'),
            fullScreenView = !clientSettingsModel.get('fullScreenView');

        if(typeof arg == 'boolean') {
            fullScreenView = arg;
        }
        
        clientSettingsModel.set('fullScreenView', fullScreenView);

        if(fullScreenView == false) {
            this.getApplicationView('viewport.CanvasToolbar').hideMenu();
        }
    },

    switchScaleFactor: function(scale) {
        var path = window.location.pathname;
        window.location.href = path + (scale == 2 ? '?large' : '');
    },

    resetApplication: function() {
        this.getModel('ClientSettings').reset();
        this.getCollection('CustomHUDPresets').reset();
        this.getCollection('HUDItems').reset();
        this.restartApplication();
    }
});

/**
 * FocusManager is user to track focused form elements
 * Using Application Event Bus to communicate with other controllers
 * @type {*}
 */
visualHUD.Controllers.HistoryManager = Backbone.Controller.extend({

    HISTORY_LENGTH: 50,

    EXCLUDE_FIELDS: /index|group/gi,

    initialize: function(options) {
        this.undoHistrory = [];
        this.redoHistrory = [];

        this.addListeners({
            'keyboard': {
                'undo': this.undo
            }
        });
    },

    onLaunch: function() {
        this.getCollection('HUDItems').on('change', this.pushUpdateState, this);
        this.getCollection('HUDItems').on('remove', this.pushDestroyState, this);
        this.getCollection('HUDItems').on('add', this.pushCreateState, this);

        this.getCollection('HUDItems').on('load', this.clearHistory, this);
    },

    clearHistory: function() {
        this.undoHistrory.length = 0;
    },

    pushUpdateState: function(model, event) {
        var fields = _.keys(event.changes);

        fields = _.filter(fields, function(key) {
            return key.match(this.EXCLUDE_FIELDS) == null;
        }, this);

        if(model.wasDropped !== true && fields.length > 0) {
            this.pushHistoryState({
                event: 'update',
                cid: model.cid,
                model: model,
                fields: fields,
                state: model.previousAttributes()
            });
        }
    },


    pushCreateState: function(model, collection, data) {
        this.pushHistoryState({
            event: 'create',
            cid: model.cid,
            model: model,
            fields: null,
            state: null
        });
    },

    pushDestroyState: function(model, collection, data) {
        this.pushHistoryState({
            event: 'destroy',
            cid: model.cid,
            model: model.toJSON(),
            fields: null,
            state: null
        });
    },

    pushHistoryState: function(data) {
        /*console.log('adding new state to history:', JSON.stringify(data));*/

        this.undoHistrory.push(data);

        if(this.undoHistrory > this.HISTORY_LENGTH) {
            this.undoHistrory.shift();
        }
    },

    undo: function() {
        var historyRecord = this.undoHistrory.pop();

        if(historyRecord) {
            switch(historyRecord.event) {
                case 'update': {
                    this.undoUpdate(historyRecord);
                    break;
                }
                case 'create': {
                    this.undoCreate(historyRecord);
                    break;
                }
                case 'destroy': {
                    this.undoDestroy(historyRecord);
                    break;
                }
            }

        }
    },

    undoUpdate: function(historyRecord) {
        this.getCollection('HUDItems').off('change', this.pushUpdateState, this);

        var record = historyRecord.model,
            HUDItem = record._HUDItem,
            updateObject = {};

        _.each(historyRecord.fields, function(field) {
            updateObject[field] = historyRecord.state[field];
        });

        HUDItem.update(updateObject);

        this.getCollection('HUDItems').on('change', this.pushUpdateState, this);
    },

    undoCreate: function(historyRecord){
        var canvas = this.getApplicationView('viewport.Canvas');

        this.getCollection('HUDItems').off('remove', this.pushDestroyState, this);
        historyRecord.model.destroy();
        this.getCollection('HUDItems').on('remove', this.pushDestroyState, this);
        canvas.deselect();
    },

    undoDestroy: function(historyRecord) {
        var canvasView = this.getApplicationView('viewport.Canvas'),
            HUDItemModelClass = this.getModelConstructor('HUDItem'),
            newRecord = new HUDItemModelClass(historyRecord.model);

        this.getCollection('HUDItems').add(newRecord);

        this.undoHistrory.pop();

        _.each(this.undoHistrory, function(h) {
            if(h.cid == historyRecord.cid) {
                h.model = newRecord;
            }
        });
    },

    redo: function() {

    }
});

