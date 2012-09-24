visualHUD.Controllers.Viewport = Backbone.Controller.extend({
    views: [
        'Viewport',
        'viewport.CanvasToolbar',
        'viewport.Canvas',
        'viewport.TopBar',
        'viewport.StageControls',
        'GroupActionsPanel',
        'windows.Download',
        'windows.ImportHUD',
        'windows.ImportImage',
        'windows.Feedback'
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
            'viewport.CanvasToolbar': {
                'toolbar.menu:show': this.onCanvasMenuShow,
                'toolbar.menu:hide': this.onCanvasMenuHide,
                'toolbar.menu:action': this.setCanvasOptions,
                'import.image': this.importImage
            },
            'viewport.TopBar': {
                'toolbar.global:action': this.toolbarAction,
                'feedback.action': this.feedbackAction
            },
            'viewport.Canvas': {
                'selectionchange': visualHUD.Function.createBuffered(this.onSelectionChange, 50, this),
                'import.image': this.importImage
            },
            'viewport.StageControls': {
                'scalefactor.change': this.switchScaleFactor,
                'layout.change': this.toggleFullscreen
            },
            'keyboard': {
                'fullscreen.toggle': this.toggleFullscreen,
                'reset': this.resetApplication,
                'import': this.loadPreset,
                'download': this.downloadHUD
            }
        });
    },

    onLaunch: function() {
        var clientSettingsModel = this.getModel('ClientSettings');

        var viewport = this.createApplicationView('Viewport', {
            clientSettingsModel: clientSettingsModel
        });
        var toolbar = this.createApplicationView('viewport.CanvasToolbar', {
            clientSettingsModel: clientSettingsModel
        });
        var canvas = this.createApplicationView('viewport.Canvas', {
            clientSettingsModel: clientSettingsModel
        });
        var topBar = this.createApplicationView('viewport.TopBar');

        var stageControls = this.createApplicationView('viewport.StageControls', {
            collection: this.getCollection('StageControlsDictionary')
        });

        this.createApplicationView('windows.Download', {
            width: 600,
            title: 'Download HUD',
            collection: this.getCollection('HUDItems')
        });

        this.createApplicationView('windows.ImportHUD', {
            width: 600,
            title: 'Import HUD',
            customPresetsCollection: this.getCollection('CustomHUDPresets'),
            presetCollection: this.getCollection('HUDPresets')
        });

        toolbar.render(viewport);
        canvas.render(viewport);
        topBar.render(viewport);
        stageControls.render(viewport);

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
        if(!this.getApplicationView('windows.ImportImage')) {
            this.createApplicationView('windows.ImportImage', {
                width: 600,
                title: 'Import Custom Background'
            });
        }

        this.getApplicationView('windows.ImportImage').show();
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

    feedbackAction: function(action) {
        if(!this.getApplicationView('windows.Feedback')) {
            this.createApplicationView('windows.Feedback', {
                width: 600
            });
        }

        switch(action) {
            case 'send-feedback': {
                this.sendFeedback();
                break;
            }
            case 'report-bug': {
                this.reportBug();
                break;
            }
        }
    },

    /**
     * Event Handler triggered by TopBar [Download] button
     */
    downloadHUD: function() {
        var HUDItemsCollection = this.getCollection('HUDItems');
        var downloadWindow = this.getApplicationView('windows.Download');

        if(!this.getApplicationView('windows.Download')) {

        }

        if(HUDItemsCollection.length > 0) {
            this.getApplicationView('windows.Download')
                .setHUDName(this.getModel('ClientSettings').get('HUDName'))
                .show();
        }
        else {
            var $alert = this.application.growl.alert({
                title: 'Oops ;(',
                status: 'warning',
                message: ([
                    '<p>', visualHUD.messages.EMPTY_HUD_WARNING, '</p>',
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


        this.getApplicationView('windows.ImportHUD').show();
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
        this.getApplicationView('windows.Feedback').setTitle('Report an Application Error');
        this.getApplicationView('windows.Feedback').show();
    },

    sendFeedback: function() {
        if(!this.getApplicationView('windows.Feedback')) {
            this.createApplicationView('windows.Feedback', {
                width: 600
            });
        }

        this.getApplicationView('windows.Feedback').setTitle('Give a Feedback');
        this.getApplicationView('windows.Feedback').show();
    },

    /**
     * Event Handler triggered by visualHUD.Views.Canvas selection model
     */
    onSelectionChange: function(view, selection) {
        this.getApplicationView('Viewport').hideAllSidebarItems();

        if(selection.length == 1) {
            selection[0].getForm().show()
        }        
        else {
            this.getApplicationView('viewport.StageControls').show();
            this.application.getController('FocusManager').blur();
        }
        
        this.getApplicationView('viewport.TopBar').updateToolbarButtonsState(selection.length);
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
            this.getApplicationView('viewport.CanvasToolbar').hideMenu();
        }
    },

    switchScaleFactor: function(scale) {
        var path = window.location.pathname;
        window.location.href = path + (scale == 2 ? '?large' : '');
    },

    resetApplication: function() {
        this.getModel('ClientSettings').reset();
        this.getCollection('CustomHUDPresets').reset();
        this.getCollection('HUDItems').reset();
        this.restartApplication();
    }
});

