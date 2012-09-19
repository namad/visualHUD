visualHUD.Routers.HelpRouter = Backbone.Router.extend({

    routes: {
        ":page": "page",
        ":page/:section": "page"
    },

    xhr: null,
    location: null,
    activeLocation: null,

    cache: {
    },

    initialize: function(options) {
        _.extend(this, options || {});
    },

    page: function(page, section) {

        var section = section || null;

        if(this.xhr !== null) {
            this.xhr.abort();
            this.xhr = null;
        }

        var cachedContent = this.cache[page];

        if(cachedContent != undefined) {
            this.updateContent(cachedContent, page, section);
        }
        else {
            this.xhr = $.ajax({
                url: page + ".html",
                complete: visualHUD.Function.bind(this.onRequestComplete, this, [page, section], true)
            });
        }

        var path = Array.prototype.slice.call(arguments).join('/');
        this.navigate(path);
    },

    onRequestComplete: function(xhr, status, page, section) {
        var code = xhr.status,
            html = xhr.responseText;

        if(code == 200) {
            this.cache[page] = true;
            this.updateContent(html, page, section);
        }
        else {
            this.trigger('update.error', xhr);
        }
    },

    updateContent: function(html, page, section) {
        var location = page + section;

        if(this.activeLocation != location) {
            this.activeLocation = location;
            this.trigger('update', page, section, html);
        }
    }
});

