visualHUD.Libs.colorHelper = (function() {
    var preventMouseleave = false;
    var currentColorCell;
    var colorInput;
    var currentColor;

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
            var $body = $(document.body);
            var paletteTpl = ([
                '<% _.each(colors, function(color) { %>',
                '<div class="color-cell" style="background-color:#<%= color %>" data-color="<%= color %>"></div>',
                '<% }); %>'
            ]).join('');

            var menuEventsHandler = this.menuEventsHandler;

            this.colorpicker = this.colorpicker || new xpk.DHTMLArea(area,{
                delegate: true,
                fromSelector: 'div.color-picker-box',
                className: 'color-picker-wrapper clearfloat',
                init: function(){
                    var _this = this;
                    var html = _.template(paletteTpl, {
                        colors: colorPresets
                    });

                    this.menu.append(html);
                    this.paletteElements = this.menu.find('div.color-cell');
                    this.menu.on('mouseover mouseout click', 'div.color-cell', $.proxy(menuEventsHandler, this));

                },
                onshow: function(){
                    colorInput = this.$activeElement.prev('input.color-input');
                    currentColor = this.backgroundColor = colorInput.val();

                    this.paletteElements.each(function() {
                        var $el = $(this);
                        var dataColor = String($el.data('color'));

                        if(dataColor.toUpperCase() == currentColor.toUpperCase()) {
                            $el.addClass('active-color');
                            currentColorCell = $el;
                        }
                    })

                    $body.addClass('color-picker-active');
                },
                onhide: function(){
                    currentColorCell && currentColorCell.removeClass('active-color');

                    window.setTimeout(function(){
                        $body.removeClass('color-picker-active');
                    }, 10);
                }
            })
        },

        menuEventsHandler: function(event) {
            if(this.activeElement) {
                var $colorCell = $(event.currentTarget);
                var color = $colorCell.data('color');
                var hoverFn = event.type == 'mouseout' || event.type == 'click' ? 'removeClass' : 'addClass';

                if (event.type == 'mouseover') {
                    this.$activeElement.css('backgroundColor', '#' + color);
                    colorInput.val(color.toUpperCase());
                }
                else if(event.type == 'mouseout' && preventMouseleave == false){
                    colorInput.val(color);
                    this.$activeElement.css('backgroundColor', '#' + currentColor);
                }

                $colorCell[hoverFn]('color-cell-hover');

                if(event.type == 'click') {
                    preventMouseleave = true;
                    colorInput.trigger('change');

                    this.hide();
                    event.stopPropagation()
                };
                preventMouseleave = false;

            }
        }
    }
})();

