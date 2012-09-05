visualHUD.Controllers.Viewport = Backbone.Controller.extend({
    views: [
        'Viewport',
        'CanvasToolbar',
        'Canvas',
        'TopBar',
        'StageControls',
        'GroupActionsPanel',
        'DownloadWindow',
        'LoadWindow',
        'ImportImageWindow'
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
                'toolbar.menu:action': this.setCanvasOptions,
                'import.image': this.importImage
            },
            'TopBar': {
                'toolbar.global:action': this.toolbarAction
            },
            'Canvas': {
                'selectionchange': visualHUD.Function.createBuffered(this.onSelectionChange, 50, this),
                'import.image': this.importImage
            },
            'StageControls': {
                'scalefactor.change': this.switchScaleFactor,
                'layout.change': this.toggleFullscreen
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

    importImage: function() {
        if(!this.getView('ImportImageWindow')) {
            this.createView('ImportImageWindow', {
                width: 600,
                title: 'Import Custom Background'
            });
        }

        this.getView('ImportImageWindow').show();
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
     * Event Handler triggered by TopBar [Download] button
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

        if(HUDItemsCollection.length > 0) {
            this.getView('DownloadWindow').show();
        }
        else {
            var $alert = this.application.growl.alert({
                title: 'Oops ;(',
                status: 'warning',
                message: ([
                    '<p>Nothing to download, mate. Try to add new items or import custom HUD first.</p>',
                    '<a href="#" class="import">Import now</a>'
                ]).join('')
            });

            $alert.find('a.import').click(visualHUD.Function.bind(function() {
                this.loadPreset();
                this.application.growl.hide($alert);
                return false;
            }, this));
        }
    },

    /**
     * Event Handler triggered by TopBar [Load Preset] button
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
     * Event Handler triggered by TopBar [Restart Application] button
     */
    restartApplication: function() {
        window.location.reload();
    },

    /**
     * Event Handler triggered by TopBar [Report Bug] button
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
        else {
            this.getView('StageControls').show();
            this.application.getController('FocusManager').blur();
        }
        
        this.getView('TopBar').updateToolbarButtonsState(selection.length);
    },

    onCanvasMenuShow: function() {
        this.getApplication().toolTips.disable();
    },

    onCanvasMenuHide: function() {
        this.getApplication().toolTips.enable();
    },

    toggleFullscreen: function(arg) {        
        var clientSettingsModel = this.getModel('ClientSettings'),
            fullScreenView = !clientSettingsModel.get('fullScreenView');

        if(typeof arg == 'boolean') {
            fullScreenView = arg;
        }
        
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

