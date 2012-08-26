visualHUD.Collections.HUDItems = Backbone.Collection.extend({
    name: 'HUDItems',

    model: visualHUD.Models.HUDItem,

    /**
     * Setup autosave when window unload event is fired
     */
    initialize: function() {
        $(window).unload(visualHUD.Function.bind(this.save, this, []));
    },

    /**
     * Save collection data to the localStorage object
     */
    save: function() {
        var data = this.toJSON();
        window.localStorage.setItem('HUDItems', JSON.stringify(data));
    },

    /**
     * Load collection from localStorage
     * Triggers 'load' event
     */
    load: function(data) {
        var data = data || window.localStorage.getItem('HUDItems'),
            success = false;

        if(_.isString(data)) {
            try {
                data = JSON.parse(data);
            }
            catch(e) {
                console.warn('Invalid HUD JSON data');
            }
        }

        if(data && data.length) {
            try {
                this.reset(data, {silent: true});
                success = true;
            }
            catch(e) {
                console.warn('Invalid HUD data');
            }
        }

        this.trigger('load', success);
    },

    /**
     * Prepare data for HUD download
     * @return {Array}
     */
    serialize: function() {
        var outputData = [];

        this.each(function(record) {
            var HUDItemView = record._HUDItem,
                data = record.toJSON(),
                refs = HUDItemView.getDOMRefs();

            if(data.itemType == 'general'){
                data.iconCoordinates = {
                    top: refs.iconBlock[0].offsetTop / visualHUD.scaleFactor,
                    left: refs.iconBlock[0].offsetLeft / visualHUD.scaleFactor,
                    width: refs.iconBlock.eq(0).width() / visualHUD.scaleFactor,
                    height: refs.iconBlock.eq(0).height() / visualHUD.scaleFactor
                };
                data.textCoordinates = {
                    top: refs.textBlock[0].offsetTop / visualHUD.scaleFactor,
                    left: refs.textBlock[0].offsetLeft / visualHUD.scaleFactor,
                    width: refs.textBlock.eq(0).width() / visualHUD.scaleFactor,
                    height: refs.textBlock.eq(0).height() / visualHUD.scaleFactor
                };
            }

            if(data.itemType == 'textItem'){
                data.textCoordinates = {
                    top: refs.text[0].offsetTop / visualHUD.scaleFactor,
                    left: refs.text[0].offsetLeft / visualHUD.scaleFactor,
                    width: refs.text.eq(0).width() / visualHUD.scaleFactor,
                    height: refs.text.eq(0).height() / visualHUD.scaleFactor
                };
                data.counterCoordinates = {
                    top: refs.counter[0].offsetTop / visualHUD.scaleFactor,
                    left: refs.counter[0].offsetLeft / visualHUD.scaleFactor,
                    width: refs.counter.eq(0).width() / visualHUD.scaleFactor,
                    height: refs.counter.eq(0).height() / visualHUD.scaleFactor
                };
            }

            if(data.itemType == 'rect' || data.itemType == 'chatArea'){
                var borderRadius = parseInt(data.borderRadius, 10);
                if(borderRadius > 0) {
                    data.boxStyle = 0;
                    data.rbox = visualHUD.Libs.utility.getRCornersMarkup(data);
                }
            }

            outputData.push(data);
        });

        return outputData;
    }
});

