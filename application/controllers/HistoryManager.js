/**
 * FocusManager is user to track focused form elements
 * Using Application Event Bus to communicate with other controllers
 * @type {*}
 */
visualHUD.Controllers.HistoryManager = Backbone.Controller.extend({

    HISTORY_LENGTH: 50,

    initialize: function(options) {
        this.undoHistrory = [];
        this.redoHistrory = [];

        this.addListeners({
            'keyboard': {
                'undo': this.undo
            }
        });
    },

    onLaunch: function() {
        this.getCollection('HUDItems').on('change', this.pushUpdateState, this);
        this.getCollection('HUDItems').on('remove', this.pushDestroyState, this);
        this.getCollection('HUDItems').on('add', this.pushCreateState, this);

        this.getCollection('HUDItems').on('load', this.clearHistory, this);
    },

    clearHistory: function() {
        this.undoHistrory.length = 0;
    },

    pushUpdateState: function(model, event) {
        if(model.wasDropped !== true) {
            this.pushHistoryState({
                event: 'update',
                cid: model.cid,
                model: model,
                fields: event.changes,
                state: model.previousAttributes()
            });
        }
    },


    pushCreateState: function(model, collection, data) {
        this.pushHistoryState({
            event: 'create',
            cid: model.cid,
            model: model,
            fields: null,
            state: null
        });
    },

    pushDestroyState: function(model, collection, data) {
        this.pushHistoryState({
            event: 'destroy',
            cid: model.cid,
            model: model.toJSON(),
            fields: null,
            state: null
        });
    },

    pushHistoryState: function(data) {
        console.log('adding new state to history:', JSON.stringify(data));

        this.undoHistrory.push(data);

        if(this.undoHistrory > this.HISTORY_LENGTH) {
            this.undoHistrory.shift();
        }
    },

    undo: function() {
        var historyRecord = this.undoHistrory.pop();

        if(historyRecord) {
            switch(historyRecord.event) {
                case 'update': {
                    this.undoUpdate(historyRecord);
                    break;
                }
                case 'create': {
                    this.undoCreate(historyRecord);
                    break;
                }
                case 'destroy': {
                    this.undoDestroy(historyRecord);
                    break;
                }
            }

        }
    },

    undoUpdate: function(historyRecord) {
        this.getCollection('HUDItems').off('change', this.pushUpdateState, this);

        var record = historyRecord.model,
            HUDItem = record._HUDItem,
            updateObject = {};

        _.each(historyRecord.fields, function(value, key) {
            updateObject[key] = historyRecord.state[key];
        });

        HUDItem.update(updateObject);

        this.getCollection('HUDItems').on('change', this.pushUpdateState, this);
    },

    undoCreate: function(historyRecord){
        var canvas = this.application.getController('Viewport').getView('Canvas');

        this.getCollection('HUDItems').off('remove', this.pushDestroyState, this);
        historyRecord.model.destroy();
        this.getCollection('HUDItems').on('remove', this.pushDestroyState, this);
        canvas.deselect();
    },

    undoDestroy: function(historyRecord) {
        var canvasView = this.application.getController('Viewport').getView('Canvas'),
            HUDItemModelClass = this.getModelConstructor('HUDItem'),
            newRecord = new HUDItemModelClass(historyRecord.model);

        this.getCollection('HUDItems').add(newRecord);

        this.undoHistrory.pop();

        _.each(this.undoHistrory, function(h) {
            if(h.cid == historyRecord.cid) {
                h.model = newRecord;
            }
        });
    },

    redo: function() {

    }
});

