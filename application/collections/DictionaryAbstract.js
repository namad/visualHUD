visualHUD.collection.DictionaryAbstract = Backbone.Collection.extend({
    autoLoad: true,

    getData: function() {
    },

    load: function() {
        this.add(this.getData(), {silent: true});
        return this;
    }
});