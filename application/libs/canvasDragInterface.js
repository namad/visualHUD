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
        var size = this.positionCache;

        this.positionCache.height = Math.max(HUDItemView.model.get('minHeight') * visualHUD.scaleFactor + HUDItemView.model.get('padding') * 2 * visualHUD.scaleFactor, this.positionCache.height);
        this.positionCache.width = Math.max(HUDItemView.model.get('minWidth') * visualHUD.scaleFactor + HUDItemView.model.get('padding') * 2 * visualHUD.scaleFactor, this.positionCache.width);

        this.currentElement.css(this.positionCache);

        // update model with new data
        HUDItemView.model.set('width', this.positionCache.width);
        HUDItemView.model.set('height', this.positionCache.height);

        // update form values with new data
        HUDItemView.getForm().setValues(size, {silent: true});

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

        this.getView().select(this.currentElement, false);

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

