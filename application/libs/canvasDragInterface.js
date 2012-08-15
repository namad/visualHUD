visualHUD.lib.canvasDragInterface = {
    offsets: [],

    checkPosition: function(element, position){

        var boundTo = element.offsetParent();
        var limits = this.limits || {
            top: 0,
            left: 0,
            right: boundTo.width(),
            bottom: boundTo.height()
        };

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
                    onbeforestart: this.beforeStart,
                    onstart: this.startResizeBox,
                    ondrag: this.resizeBox,
                    ondrop: this.resizeBoxDrop
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
    startResizeBox: function(event, element){
        this.mode = 'resizeBox';
        for(var a = 0, b = this.compass.length; a < b; a++){
            var i = this.resizeHandle.hasClass(this.compass[a]);
            if(i){
                this.resizeDirection = this.compass[a];
                break;
            }
        };
    },
    resizeBox: function(event, position, mouse){

        if(this.options.grid) {
            mouse.x -= mouse.x % this.options.grid;
            mouse.y -= mouse.y % this.options.grid;
        };

        var margin = true;
        var relative = true;
        var _position = this.currentElement.position();

        var t = _position.top;
        var l = _position.left;

        var w = this.currentElement.width();
        var h = this.currentElement.height();

        var b = _position.top + h;
        var r = _position.left + w;

        if(this.resizeDirection == 'n' || this.resizeDirection == 'ne' || this.resizeDirection == 'nw'){
            t = Math.max(mouse.y - visualHUD.application.canvasPosition.top, 0);
            h = Math.max(b - t, 1); // _position.left - mouse.x - visualHUD.application.canvasPosition.left;
            if(h == 1){
                t = b - h;
            };

        };
        if(this.resizeDirection == 'w' || this.resizeDirection == 'nw' || this.resizeDirection == 'sw'){
            l = Math.max(mouse.x - visualHUD.application.canvasPosition.left, 0);
            w = Math.max(r - l, 1); //_position.top - mouse.y -  visualHUD.application.canvasPosition.top;

            if(w == 1){
                l = r - w;
            };


        };

        if(this.resizeDirection == 'e' || this.resizeDirection == 'ne' || this.resizeDirection == 'se'){
            w = mouse.x - _position.left - visualHUD.application.canvasPosition.left;
            w = mouse.x > visualHUD.application.canvasPosition.right ? visualHUD.application.canvasPosition.right - visualHUD.application.canvasPosition.left - _position.left : w;
        };
        if(this.resizeDirection == 's' || this.resizeDirection == 'se' || this.resizeDirection == 'sw'){
            h = mouse.y - _position.top -  visualHUD.application.canvasPosition.top;
            h = mouse.y > visualHUD.application.canvasPosition.bottom ? visualHUD.application.canvasPosition.bottom - visualHUD.application.canvasPosition.top - _position.top : h;
        };

        if(this.options.grid) {
            w -= w % this.options.grid;
            h -= h % this.options.grid;
        };

        this.currentElement.css({ width: Math.max(w, 1), height:  Math.max(h, 1),top: t, left: l });
    },
    resizeBoxDrop: function(){
        var _data = this.currentElement.data('HUDItem');
        var size = {
            width: this.currentElement.width(),
            height: this.currentElement.height()
        };

        for(var k in size){
            var element = _data.form.get(0)[k];
            if(element){
                element.value = size[k] = size[k] / visualHUD.scaleFactor;
                if(element.className.indexOf('range') != -1){
                    $(element).trigger('blur');
                };
            };
        };


        visualHUD.application.setupHudItem[_data.properties.itemType](this.currentElement, _data, size);


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

        this.getView().select(this.currentElement, false);
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