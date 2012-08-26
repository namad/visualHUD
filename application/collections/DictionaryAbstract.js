visualHUD.Collections.DictionaryAbstract = Backbone.Collection.extend({
    autoLoad: true,

    getData: function() {
        return [];
    },

    load: function() {
        this.add(this.getData(), {silent: true});
        return this;
    }
});

