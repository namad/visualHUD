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
        viewportViews: 'Views.viewport',
        modalViews: 'Views.windows',
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
        EMPTY_HUD_WARNING: 'Nothing to download, mate. Try to add new items or import custom HUD first.',
        HUD_ELEMENTS_PARSE_ERROR: 'visualHUD was unable to parse <%= count %> HUD element<%= count==1 ? \'\' : \'s\' %> because the data is incorrect or currupted',
        HUD_PARSE_ERROR: 'visualHUD was unable to parse custom HUD because the data is incorrect or corrupted',
        LARGE_IMAGE_WARNING: 'Image you are trying to import, are too large (<%= imageSize %>). Please, try another image that is less than <%= maxSize %>',
        UNSUPPORTED_IMAGE_FORMAT: 'Image type you are trying to import is not supported (<%= imageType %>). Try to import images in PNG, JPG or GIF format',
        CONFIRM_APPLICATION_RESET: 'Are you sure to reset visualHUD?\nAll settings and stored data will be cleared!',
        CONFIRM_HUD_OVERWRITE: 'Are you sure to overwrite current HUD? All changes will be lost!'
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
        
        window.onerror = this.applicationErrorHandler;
    },
    
    applicationErrorHandler: function(errorMsg, url, lineNumber) {    
        if(visualHUD.growl == undefined) {
            return true;
        }
        
        console.trace();
        
        var messageTemplate = ([
                '<p><%= errorMsg %><br />',
                '<%= url %> (line: <%= lineNumber %>)</p>',
                '<div><a href="#" class="report">Send Report</a></div>'
            ]).join('');
        
        $alert = visualHUD.growl.alert({
            status: 'error',
            title: 'Oops.. Something goes wrong ;(',
            message: _.template(messageTemplate, {
                errorMsg: errorMsg,
                url: url,
                lineNumber: lineNumber
            })
        });

        $alert.find('a.report').click(function() {
            visualHUD.getController('Viewport').reportBug(errorMsg, url, lineNumber);
            visualHUD.growl.hide($alert);
            return false;
        });
    }
});

