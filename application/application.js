var visualHUD = {
    scaleFactor: 1,
    ver: '2.0',

    Controllers: {},
    Views: {},
    Models: {},
    Collections: {},
    Libs: {},
    Utils: {},

    Application: Backbone.Application.extend({
        name: 'app',
        nameSpace: 'visualHUD',

        controllers: [
            'visualHUD.Controllers.Viewport',
            'visualHUD.Controllers.HUDManager',
            'visualHUD.Controllers.KeyboardManager',
            'visualHUD.Controllers.FocusManager'
        ],
        launch: function() {
            $('#preloader').fadeOut(400, function() {
                $(this).remove();
            });
        }
    })
};

