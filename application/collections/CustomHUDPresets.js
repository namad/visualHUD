visualHUD.Collections.CustomHUDPresets = visualHUD.Collections.DictionaryAbstract.extend({
    LOCAL_STORAGE_KEY: 'CustomHUDPresets',

    getData: function() {
        var data = window.localStorage.getItem(this.LOCAL_STORAGE_KEY);
        data = JSON.parse(data);

        return data || [];
    },

    /**
     * Setup autosave when window unload event is fired
     */
    initialize: function() {
        this.on('all', this.save, this);
        this.on('add', this.sort, this);
    },

    comparator: function(model) {
        return model.get('name');
    },

    save: function() {
        var data = this.toJSON();
        try {
            window.localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(data));
        }
        catch(e) {
            throw('visualHUD was unable to save last preset. window.localStorage space quota exceeded');
        }

    }
});

