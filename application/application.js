new Backbone.Application({
    name: 'app',
    nameSpace: 'visualHUD',

    scaleFactor: 1,
    ver: '2.0',

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
        'FocusManager'
    ],
    launch: function() {

        var host = window.location.hostname,
            queryString = window.location.search;

        if (queryString.match('(\\?|&)large') !== null) {
            this.scaleFactor = 2;
        }

        $('body').addClass('scale-factor-' + this.scaleFactor);

        $('#preloader').fadeOut(400, function() {
            $(this).remove();
        });

        this.toolTips = new visualHUD.Widgets.ToolTip({
            delay: 500
        });

        this.growl = new visualHUD.Widgets.Growl({
            offset: 7
        });
    }
});

