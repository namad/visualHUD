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
        }
    }
};

