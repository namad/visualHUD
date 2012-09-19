visualHUD.Views.BoundList = Backbone.View.extend({
    tagName: 'ul',
    className: 'bound-list',

    opened: false,
    rendered: false,

    events: {
        'click .bound-list-item': 'itemClick'
    },

    defaults: {
    },

    renderTo: null,

    emptyListMessage: 'No items here yet',

    emptyTpl: ([
            '<div class="empty-list-message">',
                '<%= message %>',
            '</div>'
        ]).join(''),

    itemTpl: ([
        '<div class="bound-list-item-body">',
            '<%= name %>',
        '</div>'
        ]).join(''),

    listItemTpl: '<li class="bound-list-item" data-cid="<%= cid %>"><%= itemHTML %></li>',

    initialize: function(options) {
        _.extend(this, this.defaults, options || {});

        if(this.collection) {
            this.bindCollection(this.collection);
        }

        if(this.cls) {
            this.$el.addClass(this.cls);
        }

        this.bindEvents();

        this.getRefs();

        this.init();
        this.render(this.renderTo);
    },

    /**
     * Abstract function that will be executed during construction
     */
    init: function() {
    },

    bindCollection: function(collection) {
        this.collection = collection;

        this.collection.on('change', this.updateListItem, this);
        this.collection.on('add', this.addListItem, this);
        this.collection.on('remove', this.removeListItems, this);

        this.collection.on('all', this.refresh, this);

        this.refresh();
    },

    render: function(renderTo) {
        if(renderTo) {
            this.$el.appendTo(this.renderTo);
            this.rendered = true;
            this.fireEvent('render', this);
        }
    },

    getRefs: function() {
        this.$contentWrapper = this.$el.find('div.xpk-mwindow-wrap');
        this.$content = this.$el.find('div.xpk-win-content');
        this.$title = this.$el.find('.xpk-win-head h3');
        this.$closeButton = this.$el.find('.xpk-close-button');

        this.$closeButton.click($.proxy(this.hide, this));
        this.$el.click($.proxy(this.cancelEventBubbling, this));
    },

    updateListItem: function(model, options) {

    },

    addListItem: function(model, options) {

    },

    removeListItems: function(models, options) {

    },

    refresh: function(models, options) {
        var me = this,
            html = [],
            liTpl = _.template(this.listItemTpl),
            itemTpl = _.template(this.itemTpl);

        this.$el.children().remove();

        if(this.collection.length) {
            this.collection.each(function(model) {
                var itemHTML = itemTpl(model.toJSON());
                html.push(
                    liTpl({
                        cid: model.cid,
                        itemHTML: itemHTML
                    })
                );
            });
        }
        else {
            html.push(
                liTpl({
                    cid: null,
                    itemHTML: _.template(this.emptyTpl, {message: this.emptyListMessage})
                })
            )
        }
        
        this.$el.append(html.join(''));

        this.fireEvent('refresh', this);
    },

    itemClick: function(event) {
        var model = this.getModelByElement(event.currentTarget);
        this.fireEvent('itemclick', this, $(event.currentTarget), model, event);
    },

    getModelByElement: function(element) {
        var element = $(element),
            modelCid = element.data('cid'),
            model = this.collection.getByCid(modelCid);

        return model;
    },

    getElementByModel: function(model) {
        var cid = model.cid;
        var element = this.$el.find('[data-cid=' + cid + ']');

        return element.length ? element : null;
    },

    bindEvents: function() {
        if(this.options.itemclick){
            this.on('itemclick', this.options.itemclick, this.scope || this);
        }
        if(this.options.refresh){
            this.on('refresh', this.options.refresh, this.scope || this);
        }
        if(this.options.render){
            this.on('render', this.options.render, this.scope || this);
        }
    },

    cancelEventBubbling: function(event) {
        event.stopPropagation();
    }
});