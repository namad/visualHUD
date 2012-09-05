new Backbone.Application({
    name: 'app',
    nameSpace: 'visualHUD',

    scaleFactor: 1,
    ver: '2.0',

    MAX_BACKGROUND_SIZE: 1024 * 300,

    allocationMap: {
        model: 'Models',
        collection: 'Collections',
        controller: 'Controllers',
        view: 'Views',
        lib: 'Libs',
        utility: 'Utils',
        widgets: 'Widgets'
    },

    controllers: [
        'Viewport',
        'HUDManager',
        'KeyboardManager',
        'FocusManager',
        'HistoryManager'
    ],

    messages: {
        scriptError: 'There was an error on this page.',
        errorReportSuccess: 'Thanks, mate. Your report has been sent',
        noHUDItems: 'There are no HUD items yet. C\'mon, add some elements first and try again',
        invalidHUDPreset: 'Invalid HUD preset. Aborting...',
        reportErrorTitle: 'Report an application error/bug',
        editRangesTitle: 'Edit {0} color ranges',
        invalidPresetData: 'Application was unable to parse custom HUD data',
        slowPerformanceProperty: 'Depending on your hardware configuration, using {0} may impact your in-game performance and significally lower your FPS.',
        largeImageWarning: 'Image you are trying to import, are too large (<%= imageSize %>). Please, try another image that is less than <%= maxSize %>',
        unsupportedImageFormat: 'Image type you are trying to import is not supported (<%= imageType %>). Try to import images in PNG, JPG or GIF format'
    },

    initialize: function() {
    },

    launch: function() {
        var host = window.location.hostname,
            queryString = window.location.search;

        if (queryString.match('(\\?|&)large') !== null) {
            this.scaleFactor = 2;
        }

        $('body').addClass('scale-factor-' + this.scaleFactor);

        this.toolTips = new visualHUD.Widgets.ToolTip({
            delay: 500
        });

        this.growl = new visualHUD.Widgets.Growl({
            offset: 7
        });

        $('#preloader').fadeOut(400, function() {
            $(this).remove();
        });
    }
});

