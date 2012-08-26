
/*
 * jQuery Color Animations
 * Copyright 2007 John Resig
 * Released under the MIT and GPL licenses.
 */

(function(jQuery){

	// We override the animation for all of these color styles
	jQuery.each(['backgroundColor', 'borderBottomColor', 'borderLeftColor', 'borderRightColor', 'borderTopColor', 'color', 'outlineColor'], function(i,attr){
		jQuery.fx.step[attr] = function(fx){
			if ( fx.state == 0 ) {
				fx.start = getColor( fx.elem, attr );
				fx.end = getRGB( fx.end );
			}

			fx.elem.style[attr] = "rgb(" + [
				Math.max(Math.min( parseInt((fx.pos * (fx.end[0] - fx.start[0])) + fx.start[0]), 255), 0),
				Math.max(Math.min( parseInt((fx.pos * (fx.end[1] - fx.start[1])) + fx.start[1]), 255), 0),
				Math.max(Math.min( parseInt((fx.pos * (fx.end[2] - fx.start[2])) + fx.start[2]), 255), 0)
			].join(",") + ")";
		}
	});

	// Color Conversion functions from highlightFade
	// By Blair Mitchelmore
	// http://jquery.offput.ca/highlightFade/

	// Parse strings looking for color tuples [255,255,255]
	var getRGB = jQuery.getRGB = function(color) {
		var result;

		// Check if we're already dealing with an array of colors
		if ( color && color.constructor == Array && color.length == 3 )
			return color;

		// Look for rgba(num,num,num, num)
		if (result = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\,\s*([0-9]{1,3})\s*\)/.exec(color))
			return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3]), parseInt(result[4])];
			
		// Look for rgb(num,num,num)
		if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color))
			return [parseInt(result[1]), parseInt(result[2]), parseInt(result[3])];

		// Look for rgb(num%,num%,num%)
		if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color))
			return [parseFloat(result[1])*2.55, parseFloat(result[2])*2.55, parseFloat(result[3])*2.55];

		// Look for #a0b1c2
		if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color))
			return [parseInt(result[1],16), parseInt(result[2],16), parseInt(result[3],16)];

		// Look for #fff
		if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color))
			return [parseInt(result[1]+result[1],16), parseInt(result[2]+result[2],16), parseInt(result[3]+result[3],16)];

		// Otherwise, we're most likely dealing with a named color
		return colors[jQuery.trim(color).toLowerCase()];
	}
	
	function getColor(elem, attr) {
		var color;

		do {
			color = jQuery.curCSS(elem, attr);

			// Keep going until we find an element that has color, or we hit the body
			if ( color != '' && color != 'transparent' || jQuery.nodeName(elem, "body") )
				break; 

			attr = "backgroundColor";
		} while ( elem = elem.parentNode );

		return getRGB(color);
	};
	
	// Some named colors to work with
	// From Interface by Stefan Petre
	// http://interface.eyecon.ro/

	var colors = {
		aqua:[0,255,255],
		azure:[240,255,255],
		beige:[245,245,220],
		black:[0,0,0],
		blue:[0,0,255],
		brown:[165,42,42],
		cyan:[0,255,255],
		darkblue:[0,0,139],
		darkcyan:[0,139,139],
		darkgrey:[169,169,169],
		darkgreen:[0,100,0],
		darkkhaki:[189,183,107],
		darkmagenta:[139,0,139],
		darkolivegreen:[85,107,47],
		darkorange:[255,140,0],
		darkorchid:[153,50,204],
		darkred:[139,0,0],
		darksalmon:[233,150,122],
		darkviolet:[148,0,211],
		fuchsia:[255,0,255],
		gold:[255,215,0],
		green:[0,128,0],
		indigo:[75,0,130],
		khaki:[240,230,140],
		lightblue:[173,216,230],
		lightcyan:[224,255,255],
		lightgreen:[144,238,144],
		lightgrey:[211,211,211],
		lightpink:[255,182,193],
		lightyellow:[255,255,224],
		lime:[0,255,0],
		magenta:[255,0,255],
		maroon:[128,0,0],
		navy:[0,0,128],
		olive:[128,128,0],
		orange:[255,165,0],
		pink:[255,192,203],
		purple:[128,0,128],
		violet:[128,0,128],
		red:[255,0,0],
		silver:[192,192,192],
		white:[255,255,255],
		yellow:[255,255,0]
	};
	
})(jQuery);

(function($){
	/*
	Property: rgbToHsb
		Converts a RGB array to an HSB array.

	Returns:
		the HSB array.
	*/

	$.extend({
		color: function(_color){
			var rgb = $.getRGB(_color);
			return  {
				hex: $.rgbToHex(rgb),
				rgb: rgb,
				hsb: $.rgbToHsb(rgb)
			};
		},
		rgbToHsb: function(_rgb_array){
			var red = _rgb_array[0], green = _rgb_array[1], blue = _rgb_array[2];
			var hue, saturation, brightness;
			var max = Math.max(red, green, blue), min = Math.min(red, green, blue);
			var delta = max - min;
			brightness = max / 255;
			saturation = (max != 0) ? delta / max : 0;
			if (saturation == 0){
				hue = 0;
			} else {
				var rr = (max - red) / delta;
				var gr = (max - green) / delta;
				var br = (max - blue) / delta;
				if (red == max) hue = br - gr;
				else if (green == max) hue = 2 + rr - br;
				else hue = 4 + gr - rr;
				hue /= 6;
				if (hue < 0) hue++;
			}
			return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)];
		},
	
		/*
		Property: hsbToRgb
			Converts an HSB array to an RGB array.
	
		Returns:
			the RGB array.
		*/
	
		hsbToRgb: function(_hsb_array){
			var br = Math.round(_hsb_array[2] / 100 * 255);
			if (_hsb_array[1] == 0){
				return [br, br, br];
			} else {
				var hue = _hsb_array[0] % 360;
				var f = hue % 60;
				var p = Math.round((_hsb_array[2] * (100 - _hsb_array[1])) / 10000 * 255);
				var q = Math.round((_hsb_array[2] * (6000 - _hsb_array[1] * f)) / 600000 * 255);
				var t = Math.round((_hsb_array[2] * (6000 - _hsb_array[1] * (60 - f))) / 600000 * 255);
				switch(Math.floor(hue / 60)){
					case 0: return [br, t, p];
					case 1: return [q, br, p];
					case 2: return [p, br, t];
					case 3: return [p, q, br];
					case 4: return [t, p, br];
					case 5: return [br, p, q];
				}
			}
			return false;
		},
		/*
		Property: rgbToHex
			Converts an RGB value to hexidecimal. The string must be in the format of "rgb(255,255,255)" or "rgba(255,255,255,1)";
	
		Arguments:
			array - boolean value, defaults to false. Use true if you want the array ['FF','33','00'] as output instead of "#FF3300"
	
		Returns:
			hex string or array. returns "transparent" if the output is set as string and the fourth value of rgba in input string is 0.
	
		Example:
			>$.rgbToHex("rgb(17,34,51)"); //"#112233"
			>$.rgbToHex([17,34,51]); //"#112233"
			>$.rgbToHex("rgb(17,34,51)", true); //['11','22','33']
		*/

		rgbToHex: function(color, array){
			var rgb = color.constructor == Array ? color : color.match(/\d{1,3}/g);
			if(rgb) {
				if (rgb.length < 3) return false;
				if (rgb.length == 4 && rgb[3] == 0 && !array) return 'transparent';
				var hex = [];
				for (var i = 0; i < 3; i++){
					var bit = (rgb[i] - 0).toString(16);
					hex.push((bit.length == 1) ? '0' + bit : bit);
				}
				return array ? hex : '#' + hex.join('');
			};
			return false;
		},
	
	/*
	Property: hexToRgb
		Converts a hexidecimal color value to RGB. Input string must be the hex color value (with or without the hash). Also accepts triplets ('333');

	Arguments:
		array - boolean value, defaults to false. Use true if you want the array [255,255,255] as output instead of "rgb(255,255,255)";

	Returns:
		rgb string or array.

	Example:
		>$.hexToRgb("#112233"); //"rgb(17,34,51)"
		>$.hexToRgb("#112233",true); //[17,34,51]
	*/

	
		hexToRgb: function(color, array){
			var hex = color.match(/^#?(\w{1,2})(\w{1,2})(\w{1,2})$/);
			if(hex) {
				hex =  hex.slice(1);
				if (hex.length != 3) return false;
				var rgb = [];
				for (var i = 0; i < 3; i++){
					rgb.push(parseInt((hex[i].length == 1) ? hex[i] + hex[i] : hex[i], 16));
				}
				return array ? rgb : 'rgb(' + rgb.join(',') + ')';
			};
			return false;
		}
		
	});
})(jQuery);