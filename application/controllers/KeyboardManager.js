/**
 * KeyboardManager is user to manage all keyboard interactions
 * Using Application Event Bus to communicate with other controllers
 * @type {*}
 */
visualHUD.Controllers.KeyboardManager = Backbone.Controller.extend({
    keyCodeMap : {
        A: 65,
        V: 86,
        Z: 90,
        TAB: 9,
        F: 70,
        LEFT: 37,
        TOP: 38,
        RIGHT: 39,
        DOWN: 40,
        C: 67,
        D: 68,
        DEL: 46,
        R: 82,
        G: 71
    },

    moveCodeMap: {
        '37': 'left',
        '38': 'top',
        '39': 'left',
        '40': 'top'
    },

    initialize: function(options) {
        $('body').bind('keyup', $.proxy(this, 'keyboardListiner'));
    },

    keyboardListiner: function(event) {
        var nodeName = event.target.nodeName;

        // don't do anything if we are focused on form element
        if(nodeName.match(/input|select|textarea|button|checkbox|radiobutton/gi)){
            return;
        }

        if(event.keyCode == this.keyCodeMap.DEL) {
            this.fireEvent('keyboard', 'delete');
            return false;
        }

        if(event.keyCode == this.keyCodeMap.F){
            this.fireEvent('keyboard', 'fullscreen.toggle', [event]);
            return false;
        }

        if(this.isMoveKeyPressed(event.keyCode)) {
            var delta = this.getMoveDelta(event);
            var direction = this.getMoveDirection(event.keyCode);

            this.fireEvent('keyboard', 'move', [direction, delta]);
            return false;
        }

        if(this.isArrangeKeyPressed(event) && event.ctrlKey) {
            var arrangeAction = this.getArrangeAction(event);
            this.fireEvent('keyboard', 'arrange', [arrangeAction]);
            return false;
        }

        if(event.keyCode == this.keyCodeMap.A && event.ctrlKey) {
            this.fireEvent('keyboard', 'select.all', [event]);
            return false;
        }

        if(event.keyCode == this.keyCodeMap.G && event.shiftKey) {
            event.stopPropagation();
            event.preventDefault();

            this.fireEvent('keyboard', 'group', [event]);
            return false;
        }
    },

    isMoveKeyPressed: function(keyCode) {
        return _.include([
            this.keyCodeMap.TOP,
            this.keyCodeMap.LEFT,
            this.keyCodeMap.DOWN,
            this.keyCodeMap.RIGHT
        ], keyCode);
    },

    getMoveDirection: function(keyCode) {
        return this.moveCodeMap[keyCode];
    },

    getMoveDelta: function(event) {
        var delta = 1 * visualHUD.scaleFactor;

        if(event.keyCode == this.keyCodeMap.LEFT || event.keyCode == this.keyCodeMap.TOP) {
            delta *= -1;
        }

        if(event.shiftKey) {
            delta *= 10;
        }

        return delta;
    },

    isArrangeKeyPressed: function(event) {
        return _.include([
            this.keyCodeMap.TOP,
            this.keyCodeMap.DOWN,
        ], event.keyCode);
    },

    getArrangeAction: function(event) {
        var arrangeMap = {
            '38': ['bring-front', 'bring-forward'],
            '40': ['send-back', 'send-backward']
        };

        var arrangeKey = arrangeMap[event.keyCode];
        var actionIndex = event.shiftKey ? 0 : 1;

        return arrangeKey[actionIndex];
    }
});

