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

        $('body').addClass('scale-factor-' + this.scaleFactor);
        $('#preloader').fadeOut(400, function() {
            $(this).remove();
        });

        this.toolTips = new visualHUD.Widgets.ToolTip();
    }
});

