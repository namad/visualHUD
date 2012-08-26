visualHUD.Libs.layersManager = {
    alignItem: function(itemView, boxes, alignPosition) {
        var element = itemView.$el,
            css = {};

        switch(alignPosition){
            case 'top':
                css = {'top': boxes[0].top};
                break;
            case 'bottom':
                css = {'top' : Math.round(boxes[0].top + boxes[0].height - boxes[1].height)};
                break;
            case 'vertical':
                css = {'top': Math.round(boxes[0].top + (boxes[0].height -  boxes[1].height)/2)};
                break;
            case 'left':
                css = {'left': boxes[0].left};
                break;
            case 'right':
                css = {'left': Math.round(boxes[0].left + boxes[0].width -  boxes[1].width)};
                break;
            case 'horizontal':
                css = {'left': Math.round(boxes[0].left + (boxes[0].width -  boxes[1].width)/2)};
                break;
        }
        element.css(css);

        return css;
    },

    alignEdges: function(canvasView, alignPosition){

        var selection = canvasView.getSelection(),
            isGroup = selection.length > 1 && selection[0].getGroup() != null;
            boxes = [];

        if(selection.length == 1 || isGroup){
            var masterElement = selection[0];
            boxes.push(
                {
                    top: 0,
                    left: 0,
                    width: canvasView.$el.width(),
                    height: canvasView.$el.height()
                },
                masterElement.$el.coordinates(true, false)
            );

            if(isGroup == false) {
                this.alignItem(selection[0], boxes, alignPosition);
            }
            else {
                console.info('Could not align grouped items yet :(');
            }
        }
        else {
            for(var a = 0, b = selection.length; a < b; a++){
                boxes.push(selection[a].$el.coordinates(true, false));
                if(a > 0){
                    this.alignItem(selection[a], [boxes[0], boxes[a]], alignPosition)
                }
            }
        }
    },

    arrangeLayers: function(canvasView, arrangeAction){
        var selection = canvasView.getSelection()

        if(selection.length == 0) {
            return;
        }

        var targetElement = selection[0].$el;
        var hudElementsWrap = canvasView.$canvas;

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
        var fnData = actions[arrangeAction]();

        if(fnData.element.length && fnData.element[0] != targetElement[0]){
            targetElement[fnData.fn](fnData.element)
        }
    }
};

