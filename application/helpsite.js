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
        widgets: 'Widgets',
        routers: 'Routers'
    },

    collections: [
        'DictionaryAbstract'
    ],

    controllers: [
    ],

    messages: {
    },

    navigation: [
        {
            page: 'videos',
            text: 'Video Tutorials'
        },
        {
            page: 'faq',
            text: 'F.A.Q.'
        },
        {
            page: 'credits',
            text: 'Credits'
        }
    ],

    DEFAULT_PAGE: 'home',

    launch: function() {
        this.growl = new visualHUD.Widgets.Growl({
            offset: 7
        });

        this.setupViewport();
        this.setupRouter();
    },

    setupRouter: function() {
        this.router = new visualHUD.Routers.HelpRouter();

        this.router.on('update', this.viewport.setPage, this.viewport);
        this.router.on('navigate.section', this.viewport.setSection, this.viewport);

        this.router.on('update.error', function(xhr) {
            this.growl.alert({
                status: 'error',
                title: xhr.statusText,
                message: 'Something goes wrong ;('
            })
        }, this);

        Backbone.history.start();

        var startPage = Backbone.history.getHash();
        if(!startPage) {
            this.router.page(this.DEFAULT_PAGE);
        }
    },

    setupViewport: function() {
        this.viewport = new visualHUD.Views.HelpPageViewport({
            el: $('body')
        });
    }
});

