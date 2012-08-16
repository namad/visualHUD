visualHUD.Collections.HUDItems = Backbone.Collection.extend({
    name: 'HUDItems',

    model: visualHUD.Models.HUDItem,

    /**
     * Save collection data to the localStorage object
     */
    save: function() {
        var data = this.toJSON();
        window.localStorage.setItem('HUDItems', JSON.stringify(data));
    },

    /**
     * Load collection from localStorage
     */
    load: function() {
        var json = window.localStorage.getItem('HUDItems');
        var data = json ? JSON.parse(json) : null;

        if(data && data.length) {
            this.add(data, {silent: true});
        }

        this.trigger('load');
    }
});

