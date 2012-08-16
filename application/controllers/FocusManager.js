/**
 * FocusManager is user to track focused form elements
 * Using Application Event Bus to communicate with other controllers
 * @type {*}
 */
visualHUD.Controllers.FocusManager = Backbone.Controller.extend({
    initialize: function(options) {
        this.focusedItem = null;
    },

    onLaunch: function() {
        var viewportView = this.application.getController('Viewport').getView('Viewport');

        $(document).on('focus', 'form', $.proxy(this, 'focusListener'));
    },

    focusListener: function(event) {
        var nodeName = event.target.nodeName;

        // don't do anything if we are focused on form element
        if(nodeName.match(/input|select|textarea|button|checkbox|radiobutton/gi)){
            this.focusedItem = event.target;
        }
    },

    getFocused: function() {
        return this.focusedItem;
    },

    blur: function() {
        this.focusedItem && this.focusedItem.blur();
    }
});

