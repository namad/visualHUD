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
        utility: 'Utils'
    },

    controllers: [
        'Viewport',
        'HUDManager',
        'KeyboardManager',
        'FocusManager'
    ],
    launch: function() {
        $('#preloader').fadeOut(400, function() {
            $(this).remove();
        });
    }
});

