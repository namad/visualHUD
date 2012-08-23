visualHUD.Controllers.Viewport = Backbone.Controller.extend({
    views: [
        'Viewport',
        'CanvasToolbar',
        'Canvas',
        'TopBar',
        'StageControls',
        'GroupActionsPanel',
        'DownloadWindow'
    ],

    models: [
        'ClientSettings',
        'HUDItem'
    ],

    collections: [
        'StageControlsDictionary',
        'HUDItemTemplates',
        'HUDItemIconEnums',
        'HUDItems'
    ],

    initialize: function(options) {
        this.addListeners([
            {
                'Viewport': {
                    render: this.onViewportRender
                }
            },
            {
                'CanvasToolbar': {
                    'toolbar.menu:show': this.onCanvasMenuShow,
                    'toolbar.menu:hide': this.onCanvasMenuHide,
                    'toolbar.menu:action': this.setCanvasOptions
                }
            },
            {
                'TopBar': {
                    'toolbar:action': this.toolbarAction
                }
            },
            {
                'Canvas': {
                    'selectionchange': this.onSelectionChange
                }
            },
            {
                'keyboard': {
                    'tab': this.toggleToolbars
                }
            }
        ]);
    },

    onLaunch: function() {
        var clientSettingsModel = this.getModel('ClientSettings');

        var viewport = this.createView('Viewport');
        var toobar = this.createView('CanvasToolbar', {
            clientSettingsModel: clientSettingsModel
        });
        var canvas = this.createView('Canvas', {
            clientSettingsModel: clientSettingsModel
        });
        var topBar = this.createView('TopBar');
        var groupActionsPanel = this.createView('GroupActionsPanel');

        var stageControls = this.createView('StageControls', {
            collection: this.getCollection('StageControlsDictionary')
        });

        toobar.render(viewport);
        canvas.render(viewport);
        topBar.render(viewport);
        stageControls.render(viewport);
        groupActionsPanel.render(viewport);

        viewport.render([toobar, canvas, topBar, stageControls]);

        clientSettingsModel.on('change', clientSettingsModel.save, clientSettingsModel);
    },

    onViewportRender: function(view) {
        //this.initializeClientSettings();
    },

    /**
     * Event Handler triggered by visualHUD.Views.CanvasToolbar when used change Client Settings
     */
    setCanvasOptions: function(data) {
        var clientSettings = this.getModel('ClientSettings');
        var value = data.value;
        clientSettings.set(data.name,  value);
    },

    /**
     * Event handler triggered by visualHUD.Views.TopBar action
     * @param action
     */
    toolbarAction: function(action) {
        var fn = this[action];
        if(_.isFunction(fn)) {
            fn.apply(this, arguments);
        }
    },

    /**
     * Event Handler triggered by [Download] button
     */
    downalodHUD: function() {
        var HUDItemsCollection = this.getCollection('HUDItems');

        if(!this.downloadWindow) {
            var winConstructor = this.getViewConstructor('DownloadWindow');
            this.downloadWindow = new  winConstructor({
                width: 600,
                title: 'Download HUD',
                jsonData: JSON.stringify(HUDItemsCollection.toJSON())
            });
        }

        this.downloadWindow.show();
    },

    /**
     * Event Handler triggered by [Load Preset] button
     */
    loadHUD: function() {
        var HUDPresetsCollection = this.getCollection('HUDPresets');

        if(!this.presetWindow) {
            var winConstructor = this.getViewConstructor('LoadWindow');
            this.downloadWindow = new  winConstructor({
                width: 600,
                title: 'Load Preset',
                jsonData: JSON.stringify(HUDItemsCollection.toJSON())
            });
        }

        this.downloadWindow.show();
    },

    /**
     * Event Handler triggered by [Restart Application] button
     */
    restartApplication: function() {
        window.location.reload();
    },

    /**
     * Event Handler triggered by [Report Bug] button
     */
    reportBug: function() {

    },

    /**
     * Event Handler triggered by visualHUD.Views.Canvas selection model
     */
    onSelectionChange: function(view, selection) {
        this.getView('Viewport').hideAllSidebarItems();

        if(selection.length == 1) {
            selection[0].getForm().show()
        }
        else if( selection.length > 1) {
            this.getView('GroupActionsPanel').show();
        }
        else if(selection.length == 0) {
            this.getView('StageControls').show();
            this.application.getController('FocusManager').blur();
        }
    },

    onCanvasMenuShow: function() {
        this.getApplication().toolTips.disable();
    },

    onCanvasMenuHide: function() {
        this.getApplication().toolTips.enable();
    },

    toggleToolbars: function(event) {
        this.getView('Viewport').toggleToolbars();
    }
});

