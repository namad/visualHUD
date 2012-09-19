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

