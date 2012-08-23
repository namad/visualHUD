/**
 * HUDManager is user to manage all HUD design operations
 * Full CRUD cycle for every supported HUD Item
 * @type {*}
 */
visualHUD.Controllers.HUDManager = Backbone.Controller.extend({
    views: [
        'HUDItem',
        'HUDItemForm'
    ],

    models: [
        'HUDItem',
        'ClientSettings'
    ],

    collections: [
        'HUDItemTemplates',
        'HUDItemIconEnums',
        'HUDItems'
    ],

    AUTOSAVE_TIMEOUT: 300000,

    initialize: function(options) {
        this.addListeners([
            {
                'Viewport': {
                    'render': this.loadDraft
                },
                'StageControls': {
                    'item.drop': this.dropNewHUDItem
                },
                'Canvas': {
                    'drop.move': this.onItemMove
                },
                'GroupActionsPanel': {
                    'align.action': this.alignItems,
                    'arrange.action': this.arrangeItems,
                    'group.action':  this.groupActions
                },
                'Form': {
                    'align.action': this.alignItems,
                    'arrange.action': this.arrangeItems
                },
                'HUDItem': {
                    'click': this.onHUDItemClick
                },
                // Events generated by KeyboardManager Controller
                'keyboard': {
                    'select.all': this.selectAllHUDItems,
                    'delete': this.deleteSelectedItems,
                    'move': this.moveSelectedItems
                }
            }
        ]);
    },

    onLaunch: function() {
        var HUDItemsCollection = this.getCollection('HUDItems');
        var clientSettingsModel = this.getModel('ClientSettings');

        HUDItemsCollection.on('add', this.addNewHUDItem, this);
        clientSettingsModel.on('change', this.updateHUDItemStatus, this);
        HUDItemsCollection.on('load', this.loadDraft, this);

        // Load saved HUD Items
        $(window).load(visualHUD.Function.bind(HUDItemsCollection.load, HUDItemsCollection));
        // Save HUD Items
        $(window).unload(visualHUD.Function.bind(HUDItemsCollection.save, HUDItemsCollection));
    },

    /**
     * Event handler triggered by visualHUD.Collections.HUDItems
     * Restore previously saved draft
     */
    loadDraft: function() {
        var canvasView = this.application.getController('Viewport').getView('Canvas');

        this.getCollection('HUDItems').each(function(record) {
            this.createNewHUDItem(record);
        }, this);

    },

    /**
     * Event handler triggered by StageControls View when new HUD Item has been dropped to the canvas
     * @param record
     * @param position
     */
    dropNewHUDItem: function(record, position) {
        var HUDItemModelClass = this.getModelConstructor('HUDItem');
        var HUDItemModel = new HUDItemModelClass();
        var statusText = this.getModel('ClientSettings').getStatusByName(record.get('id'));

        HUDItemModel.setDefaultValues({
            name: record.get('id'),
            itemType: record.get('itemType')
        }).set({
            cssClass: record.get('cssClass'),
            label: record.get('label'),
            coordinates: position
        });

        HUDItemModel.wasDropped = true;

        if(statusText) {
            HUDItemModel.set('text', statusText);
        }

        this.getCollection('HUDItems').add(HUDItemModel);
    },

    /**
     * Create new visualHUD.Views.HUDItem instance based on visualHUD.Models.HUDItem data
     * @param record
     * @return {*}
     */
    createNewHUDItem: function(record) {
        var HUDItemTemplates = this.getCollection('HUDItemTemplates');
        var canvasView = this.application.getController('Viewport').getView('Canvas');
        var viewportView = this.application.getController('Viewport').getView('Viewport');

        var HUDItemViewClass = this.getViewConstructor('HUDItem');
        var formViewClass = this.getViewConstructor('HUDItemForm');
        var HUDItemIconEnums = this.getCollection('HUDItemIconEnums')

        var formView = new formViewClass({
            alias: 'Form',
            model: record,
            renderTo: viewportView.$rightArea,
            collections: {
                'HUDItemIconEnums': HUDItemIconEnums
            }
        });

        var HUDItem = new HUDItemViewClass({
            alias: 'HUDItem',
            HUDItemIconEnums: HUDItemIconEnums,
            renderTo: canvasView.$canvas,
            model: record,
            wasDropped: record.wasDropped,
            formView: formView,
            htmlTplRecord: HUDItemTemplates.get(record.get('name'))
        });

        return HUDItem;
    },

    /**
     * Event handler triggered by visualHUD.Collections.HUDItems when new record has been added to the collection
     * @param record
     */
    addNewHUDItem: function(record) {
        var canvasView = this.application.getController('Viewport').getView('Canvas');
        var HUDItem = this.createNewHUDItem(record);
        canvasView.select(HUDItem, false);
    },

    /**
     * Event handler Triggered by visualHUD.Libs.canvasDragInterface
     * @param HUDElementView
     */
    onItemMove: function(HUDElementView) {
        var canvasView = this.application.getController('Viewport').getView('Canvas');

        _.each(canvasView.getSelection(), function(view) {
            view.refreshCoordinates();
        });
    },

    onHUDItemClick: function(HUDItem, event) {
        var canvasView = this.application.getController('Viewport').getView('Canvas');
        this.application.getController('FocusManager').blur();
        canvasView.select(HUDItem, event.shiftKey || event.ctrlKey);
    },

    /**
     * Event handler Triggered by visualHUD.Models.ClientSettings
     * Used to update status of the particular HUD Item
     * @param model
     * @param options
     */
    updateHUDItemStatus: function(model, event) {
        var changes = event.changes;
        var HUDItemsCollection = this.getCollection('HUDItems');

        _.each(changes, function(set, field) {
            var value = model.get(field),
                namePattern;

            switch(field) {
                case 'statusHealth': {
                    namePattern = /healthIndicator|healthBar/
                    break;
                }
                case 'statusArmor': {
                    namePattern = /armorIndicator|armorBar/
                    break;
                }
                case 'statusAmmo': {
                    namePattern = /ammoIndicator/
                    break;
                }
                case 'statusAccuracy': {
                    namePattern = /accuracyIndicator/
                    break;
                }
                case 'statusSkill': {
                    namePattern = /skillIndicator/
                    break;
                }
            }

            HUDItemsCollection.each(function(record){
                var name = record.get('name');

                if(namePattern && namePattern.test(name)) {
                    record.set('text', value);
                }
            });
        }, this);
    },

    alignItems: function(value){
        var canvasView = this.application.getController('Viewport').getView('Canvas');
        visualHUD.Libs.layersManager.alignEdges(canvasView, value);

        _.each(canvasView.getSelection(), function(view) {
            view.refreshCoordinates();
        });
    },

    arrangeItems: function(value){

    },

    groupActions: function(action){
        switch(action) {
            case 'deleteSelectedItems': {
                this.deleteSelectedItems();
                break;
            }
        }
    },

    /**
     * Event triggered by KeyboardManager controller when pressing DEL button
     */
    deleteSelectedItems: function() {
        var canvas = this.application.getController('Viewport').getView('Canvas'),
            selection = canvas.getSelection();

        _.each(selection, function(view) {
            view.model.destroy();
        });

        canvas.deselect();
    },

    /**
     * Event triggered by KeyboardManager controller when pressing arrow buttons
     * @param direction
     * @param offset
     */
    moveSelectedItems: function(direction, offset) {
        var canvas = this.application.getController('Viewport').getView('Canvas'),
            selection = canvas.getSelection();

        _.each(selection, function(view) {
            view.move(direction, offset);
        });
    },

    selectAllHUDItems: function(event) {
        var canvas = this.application.getController('Viewport').getView('Canvas');
        canvas.selectAll();
    }
});

