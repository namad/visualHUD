visualHUD.Libs.layersManager = {
    alignItem: function(itemView, boxes, alignPosition) {
        var element = itemView.$el;

        switch(alignPosition){
            case 'top':
                element.css('top', boxes[0].top);
                break;
            case 'bottom':
                element.css('top', Math.round(boxes[0].top + boxes[0].height - boxes[1].height));
                break;
            case 'vertical':
                element.css('top', Math.round(boxes[0].top + (boxes[0].height -  boxes[1].height)/2));
                break;
            case 'left':
                element.css('left', boxes[0].left);
                break;
            case 'right':
                element.css('left', Math.round(boxes[0].left + boxes[0].width -  boxes[1].width));
                break;
            case 'horizontal':
                element.css('left', Math.round(boxes[0].left + (boxes[0].width -  boxes[1].width)/2));
                break;
        }
    },

    alignEdges: function(canvasView, alignPosition){

        var selection = canvasView.getSelection(),
            boxes = [];

        if(selection.length == 1){
            boxes.push(
                {
                    top: 0,
                    left: 0,
                    width: canvasView.$el.width(),
                    height: canvasView.$el.height()
                },
                selection[0].$el.coordinates(true, false)
            );

            this.alignItem(selection[0], boxes, alignPosition);
        }
        else {
            for(var a = 0, b = selection.length; a < b; a++){
                boxes.push(selection[0].$el.coordinates(true, false));
                if(a > 0){
                    this.alignItem(selection[a], [boxes[0], boxes[a]], alignPosition)
                }
            }
        }
    },
    arrangeLayers: function(_className){
        if(this.selectedItems.length != 1)
            return;

        var targetElement = this.selectedItems[0].element;

        var hudElementsWrap = this.hudElementsWrap;

        var actions = {
            'bring-front': function(){
                return {
                    element: hudElementsWrap,
                    fn: 'appendTo'
                };
            },
            'send-back': function(){
                return {
                    element: hudElementsWrap,
                    fn: 'prependTo'
                }
            },
            'bring-forward': function(){
                return {
                    element: targetElement.next(),
                    fn: 'insertAfter'
                }
            },
            'send-backward': function(){
                return {
                    element: targetElement.prev(),
                    fn: 'insertBefore'
                }
            }
        };

        var _direction;
        var fnData;

        var hudItems = this.hudElementsWrap.find('div.hud-item');

        for(var k in actions){
            if(_className.indexOf(k) > -1){
                fnData = actions[k]();
                break;
            };
        }

        if(fnData.element.length && fnData.element[0] != targetElement[0]){
            targetElement[fnData.fn](fnData.element)
        };

    }
};

