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

            this.getDOMRefs().textBlock.width(textboxSize.width).height(textboxSize.height);

            this.getDOMRefs().counter.css({
                'line-height': textboxSize.height + 'px',
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

    'powerupIndicator': {
        updateTextSize: function(value) {
            visualHUD.Libs.itemBuilderMixin.getByType('general').updateTextSize.call(this, value);
            this.getDOMRefs().textBlock.width('auto');
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

            var originalClassName = this.$el.attr('class'),
                patt = /textstyle-[0-9]/,
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
            this.getDOMRefs().textBlock.height(textboxSize.height);

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

        updateToggleChat: function(value) {
            var toggleClass = (value ? 'add' : 'remove') + 'Class';
            this.$el[toggleClass]('chat-visible');

            toggleClass = (value ? 'remove' : 'add') + 'Class';
            this.$el[toggleClass]('chat-invisible');
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

        updateTextColorByStatus: visualHUD.Function.createBuffered(function(barValue, ranges) {
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
        }, 50),

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

            var renderGradient = style > 0 || parseInt(this.model.get('borderRadius'), 10) == 0;

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

    }
};

