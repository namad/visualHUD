visualHUD.Libs.utility = {
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
    getBoxGradient: function(_style, _color, _opacity) {
        if (!_style) return '';

        var style, direction, rgba = 'rgba({0},{1})';
        var _rgb = _color.rgb.join(',');
        var gradientColors = [rgba.format(_rgb, _opacity), rgba.format(_rgb, 0)];

        _style = _style.toString();

        if (!$.browser.mozilla) {
            if ($.browser.webkit) {
                switch (_style) {
                    case '1': // Top to bottom
                        direction = 'left top, left bottom';
                        break;
                    case '2': // Bottom to top
                        direction = 'left bottom, left top';
                        break;
                    case '3': // Left to right
                        direction = 'left top, right top';
                        break;
                    case '4': // Right to left
                        direction = 'right top, left top';
                        break;
                }
                style = '-webkit-gradient(linear, ' + direction + ', color-stop(0, ' + gradientColors[0] + '), color-stop(1, ' + gradientColors[1] + ') )';
            }
            else if ($.browser.msie) {
                /*
                 MSIE
                 ----------------
                 GradientType=0 - vertical gradient / top to bottom
                 GradientType=1 - horisontal gradient / left to right
                 */

                var msieOpacity = Math.floor(_opacity * 255).toString(16);
                var solidColor = _color.hex.replace('#', '#' + msieOpacity);
                var transparentColor = _color.hex.replace('#', '#00');

                switch (_style) {
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
        } else {
            switch (_style) {
                case '1': // Top to bottom
                    direction = 'center top';
                    break;
                case '2': // Bottom to top
                    direction = 'center bottom';
                    break;
                case '3': // Left to right
                    direction = 'left center';
                    break;
                case '4': // Right to left
                    direction = 'right center';
                    break;
            }
            style = '-moz-linear-gradient(' + direction + ', ' + gradientColors[0] + ' 0%, ' + gradientColors[1] + ' 100%)';
        }

        return style;
    },
    getRCornersMarkup: function(box){
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

        var borderRadius = parseInt(box.borderRadius);
        var baseOpacity = box.opacity;

        var offsets = {
            topLeft: [0,0],
            topRight: [0, box.coordinates.width - borderRadius],
            bottomLeft: [ box.coordinates.height - borderRadius, 0],
            bottomRight: [ box.coordinates.height - borderRadius,  box.coordinates.width - borderRadius]
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
        };

        var offsetMap = [borderRadius, 0, box.coordinates.width - borderRadius];

        for(var a = 0, b = 3; a < b; a++){
            corners.push({
                top: a == 0 ? 0 : borderRadius,
                left: offsetMap[a],
                width: a == 0 ? box.coordinates.width - 2 * borderRadius : borderRadius,
                height: box.coordinates.height - (a == 0 ? 0 : 2 * borderRadius),
                opacity: baseOpacity
            });
        };
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
            else if (typeof appendArgs == 'number') {
                callArgs = slice.call(arguments, 0); // copy arguments first
                Ext.Array.insert(callArgs, appendArgs, args);
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
                var me = this;
                if (timerId) {
                    clearTimeout(timerId);
                    timerId = null;
                }
                timerId = setTimeout(function(){
                    fn.apply(scope || me, args || arguments);
                }, buffer);
            };
        }();
    }
};

