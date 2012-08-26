visualHUD.Controllers.Viewport = Backbone.Controller.extend({
    views: [
        'Viewport',
        'CanvasToolbar',
        'Canvas',
        'TopBar',
        'StageControls',
        'GroupActionsPanel',
        'DownloadWindow',
        'LoadWindow'
    ],

    models: [
        'ClientSettings',
        'HUDItem'
    ],

    collections: [
        'StageControlsDictionary',
        'HUDItemTemplates',
        'HUDItemIconEnums',
        'HUDItems',
        'HUDPresets'
    ],

    initialize: function(options) {
        this.addListeners({
            'Viewport': {
                render: this.onViewportRender
            },
            'CanvasToolbar': {
                'toolbar.menu:show': this.onCanvasMenuShow,
                'toolbar.menu:hide': this.onCanvasMenuHide,
                'toolbar.menu:action': this.setCanvasOptions
            },
            'TopBar': {
                'toolbar:action': this.toolbarAction
            },
            'Canvas': {
                'selectionchange': this.onSelectionChange
            },
            'StageControls': {
                'scalefactor.change': this.switchScaleFactor
            },
            'keyboard': {
                'fullscreen.toggle': this.toggleFullscreen
            }
        });
    },

    onLaunch: function() {
        var clientSettingsModel = this.getModel('ClientSettings');

        var viewport = this.createView('Viewport', {
            clientSettingsModel: clientSettingsModel
        });
        var toolbar = this.createView('CanvasToolbar', {
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

        toolbar.render(viewport);
        canvas.render(viewport);
        topBar.render(viewport);
        stageControls.render(viewport);
        groupActionsPanel.render(viewport);

        viewport.render([toolbar, canvas, topBar, stageControls]);
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
    downloadHUD: function() {
        var HUDItemsCollection = this.getCollection('HUDItems');
        var downloadWindow = this.getView('DownloadWindow');

        if(!this.getView('DownloadWindow')) {
            this.createView('DownloadWindow', {
                width: 600,
                title: 'Download HUD',
                collection: HUDItemsCollection
            });
        }

        this.application.growl.alert({
            title: 'Oopsie',
            message: 'Testing'
        });

        this.getView('DownloadWindow').show();
    },

    /**
     * Event Handler triggered by [Load Preset] button
     */
    loadPreset: function() {
        var HUDPresetsCollection = this.getCollection('HUDPresets');

        if(!this.getView('LoadWindow')) {
            this.createView('LoadWindow', {
                width: 600,
                title: 'Import HUD',
                presetCollection: HUDPresetsCollection
            });
        }

        this.getView('LoadWindow').show();
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

    toggleFullscreen: function(event) {
        var clientSettingsModel = this.getModel('ClientSettings'),
            fullScreenView = !clientSettingsModel.get('fullScreenView');

        clientSettingsModel.set('fullScreenView', fullScreenView);

        if(fullScreenView == false) {
            this.getView('CanvasToolbar').hideMenu();
        }
    },

    switchScaleFactor: function(scale) {
        var path = window.location.pathname;
        window.location.href = path + (scale == 2 ? '?large' : '');
    }
});

