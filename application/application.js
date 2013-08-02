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

    ACTION_CONTACT: 'contact.php',
    ACTION_DOWNLOAD_PRESETS: 'download_presets.php',
    ACTION_DOWNLOAD_HUD: 'download.php',

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
        UNSUPPORTED_FILE_FORMAT: 'File<%= count>1 ? \'s\' : \'\' %> you are trying to load <%= count>1 ? \'are\' : \'is\' %> not supported. To load previously downloaded HUD use *.vhud files.',
        CONFIRM_APPLICATION_RESET: 'Are you sure to reset visualHUD?\nAll settings and stored data will be cleared!',
        CONFIRM_HUD_OVERWRITE: 'Are you sure to overwrite current HUD? All changes will be lost!',
        AJAX_ERROR: '<%= url %> request returned error:<br /><strong><%= error %></strong>'
    },

    initialize: function() {
    },

    launch: function() {
        var host = window.location.hostname,
            queryString = window.location.search;

        this.scaleFactor = this.getModel('ClientSettings').get('scaleFactor');

        $('body').addClass('scale-factor-' + this.scaleFactor);

        this.toolTips = new visualHUD.Widgets.ToolTip({
            delay: 500
        });

        this.growl = new visualHUD.Widgets.Growl({
            offset: 7
        });

        window.onerror = visualHUD.Function.createBuffered(this.applicationErrorHandler, 50, this);

        $(document).ajaxError(visualHUD.Function.bind(function(event, jqXHR, ajaxSettings, thrownError) {
            this.ajaxErrorAlert = this.growl.alert({
                status: 'error',
                title:  'Oops.. Something goes wrong ;(',
                message: _.template(this.messages.AJAX_ERROR, {
                    url: ajaxSettings.url,
                    error: jqXHR.status + ' ' + thrownError
                })
            });
        }, this));
    },

    /**
     *
     * @param errorMsg
     * @param url
     * @param lineNumber
     */
    applicationErrorHandler: function(errorMsg, url, lineNumber) {
        var browserVersion = $.browser.version;
        var browserInfo = ['\n-----------------------\n'];

        for(var k in $.browser){
            if(k != 'version') browserInfo.push(k);
        };

        browserInfo = browserInfo.join('/') + ' ver.' + browserVersion + "\n";


        $.ajax({
            type: 'post',
            url: visualHUD.ACTION_CONTACT,
            data: [
                {
                    name: 'name',
                    value: 'VisualHUD Automated Reported'
                },
                {
                    name: 'email',
                    value: 'vhud@pk69.com'
                },
                {
                    name: 'message',
                    value: _.template('Error: <%= errorMsg %>\nURL: <%= url %>\nLine: <%= lineNumber %><%= browserInfo %>', {
                        errorMsg: errorMsg,
                        url: url,
                        lineNumber: lineNumber,
                        browserInfo: browserInfo
                    })
                }
            ],
            success: visualHUD.Function.bind(function(){
                if(this.growl == undefined) {
                    return true;
                }

                var messageTemplate = ([
                    '<p><%= errorMsg %><br />',
                    '<%= url %> (line: <%= lineNumber %>)</p>',
                    'But no worries, mate, this problem has been already reported.'
                ]).join('');

                $alert = this.growl.alert({
                    status: 'error',
                    title: 'Oops.. Something goes wrong ;(',
                    message: _.template(messageTemplate, {
                        errorMsg: errorMsg,
                        url: url,
                        lineNumber: lineNumber
                    })
                });
            }, visualHUD)
        });
    },

    confirm: function(options) {
        return new visualHUD.Views.windows.Confirm(options).show();
    }
});

