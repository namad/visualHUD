visualHUD.Collections.HUDItems = Backbone.Collection.extend({
    name: 'HUDItems',
    LOCAL_STORAGE_KEY: 'HUDItems',
    model: visualHUD.Models.HUDItem,

    /**
     * Setup autosave when window unload event is fired
     */
    initialize: function() {
        this.on('add', this.setIndex, this);
        this.on('load', this.updateIndexes, this);
		this.on('change:ownerDrawFlag', function(model, event) {
			this.filter && this.filterItemsByOwnerDraw(this.filter);
		}, this);
        $(window).unload(visualHUD.Function.bind(this.save, this, []));
    },

    /**
     * Save collection data to the localStorage object
     */
    save: function() {
        var data = this.toJSON();
        window.localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(data));
    },

    /**
     * Load collection from localStorage
     * Triggers 'load' event
     */
    load: function(data) {
        var data = data || window.localStorage.getItem(this.LOCAL_STORAGE_KEY),
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
                this.cleanDefaultChat();
                success = true;
            }
            catch(e) {
                console.warn('Invalid HUD data');
            }
        }

        this.trigger('load', success);
    },

    setIndex: function(model) {
        model.set('index', this.length, {silent: true});
    },

    updateIndexes: function() {
        this.each(function(model, i) {
            model.set('index', i, {silent: true});
        });
    },

    comparator: function(model) {
        return model.get('index');
    },

    cleanDefaultChat: function() {
        var defaultChat = this.where({
            name: 'chatArea',
            isDefaultChat: true
        });
        if(defaultChat.length) {
            this.remove(defaultChat, {silent: true});
        }
    },

    /**
     * Prepare data for HUD download
     * @return {Array}
     */
    serialize: function() {
        this.sort();

        var outputData = [],
            defaultChat = new this.model();

        defaultChat.setDefaultValues({
            isDefaultChat: true,
            itemType: 'chatArea',
            name: 'chatArea'
        });

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
                    top: refs.templateText[0].offsetTop / visualHUD.scaleFactor,
                    left: refs.templateText[0].offsetLeft / visualHUD.scaleFactor,
                    width: refs.templateText.eq(0).width() / visualHUD.scaleFactor,
                    height: refs.templateText.eq(0).height() / visualHUD.scaleFactor
                }
                data.counterCoordinates = {
                    top: refs.counter[0].offsetTop / visualHUD.scaleFactor,
                    left: refs.counter[0].offsetLeft / visualHUD.scaleFactor,
                    width: refs.counter.eq(0).width() / visualHUD.scaleFactor,
                    height: refs.counter.eq(0).height() / visualHUD.scaleFactor
                };
            }

            if(data.itemType == 'rect'){
                var borderRadius = parseInt(data.borderRadius, 10);
                if(borderRadius > 0) {
                    data.boxStyle = 0;
                    data.rbox = visualHUD.Libs.utility.getRCornersMarkup(data);
                }
            }

            if(data.name == 'chatArea') {
                defaultChat = null;
            }

            outputData.push(data);
        });

        defaultChat && outputData.push(defaultChat.toJSON());
        defaultChat = null;

        return outputData;
    },
	
	filterItemsByOwnerDraw: function(value) {
        this.each(function(record) {
            var HUDItemView = record._HUDItem,
                flagValue = record.get('ownerDrawFlag'),
                refs = HUDItemView.getDOMRefs();
			
			if(value == '' || flagValue == value || flagValue == '') {
				HUDItemView.show();
			}
			else {
				HUDItemView.hide();
			}
		});
		
		this.filter = value;
	}
});

