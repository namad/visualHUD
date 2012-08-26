(function($){
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

