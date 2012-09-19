visualHUD.Collections.DictionaryAbstract = Backbone.Collection.extend({
    autoLoad: true,

    getData: function() {
        return [];
    },

    load: function() {
        this.reset(this.getData(), {silent: true});
        return this;
    }
});

