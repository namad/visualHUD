visualHUD.Views.HUDItem = Backbone.View.extend({
    tagName: 'div',
    className: 'hud-item',

    events: {
        'click': 'itemClick'
    },
    initialize: function() {
        /*
            Since we are dealing with very specific items, we need to be able to mix some specific behaviour into newly created instance
            To make it possible let's use mixin library that will contain specific functionality depending on item type or name
        */
        var defaultMixin = visualHUD.Libs.itemBuilderMixin.getByType('general'),
            typeMixin = visualHUD.Libs.itemBuilderMixin.getByType(this.model.get('itemType')),
            nameMixin = visualHUD.Libs.itemBuilderMixin.getByName(this.model.get('name'));

        if(defaultMixin == typeMixin) {
            typeMixin = {};
        }
        // Maxin functionality goes from more generic (by type) to more specific (by name)
        _.extend(this, defaultMixin, typeMixin || {}, nameMixin || {});

        this.$el.data('HUDItem', this);

        this.model.on('change', this.onModelUpdate, this);
        this.model.on('destroy', this.onModelDestroy, this);

        this.model._HUDItem = this;

        this.delayedStatusUpdate = visualHUD.Function.createBuffered(this.refreshCoordinates, 10, this);

        this.render();
    },

    render: function() {
        var renderTo = this.options.renderTo,
            htmlTpl = this.prepareTemplate();

        var coordinates = this.model.get('coordinates');
        var resizable = this.model.get('resizable');

        this.$el.addClass(this.options.htmlTplRecord.get('cssClass'));
        this.$el.append(htmlTpl);
        this.$el.css({visibility: 'hidden'});

        if(this.model.get('resizable') == true) {
            this.appendResizehandles();
        }
        this.getDOMRefs();

        _.each(this.model.attributes, function(value, field) {
            value != null && this.callUpdateMethodByField(field, false);
        }, this);

        this.$el.appendTo(renderTo);

        var width = coordinates.width,
            height = coordinates.height,
            top = this.model.wasDropped ? coordinates.top - this.$el.height() / 2 : coordinates.top * visualHUD.scaleFactor,
            left = this.model.wasDropped ? coordinates.left - this.$el.width() / 2 : coordinates.left * visualHUD.scaleFactor;

        this.$el.css({
            width: this.model.get('width') * visualHUD.scaleFactor || 'auto',
            height: this.model.get('height') * visualHUD.scaleFactor || 'auto',
            top: Math.round(top),
            left: Math.round(left)
        });

        this.refreshCoordinates();

        // render associated item form
        this.getForm().render();
        this.$el.css({visibility: ''});
    },

    prepareTemplate: function() {
        var data = this.model.toJSON(),
            htmlTplRecord = this.options.htmlTplRecord,
            htmlTpl = htmlTplRecord.get('template').join(''),
            iconOptions = this.getIconOptions(),
            iconData = iconOptions ? iconOptions[this.model.get('iconStyle')] : null,
            template;

        data.icon = this.model.get('iconStyle') != null ? iconData : iconOptions;

        template = _.template(htmlTpl, data);
        return template;
    },

    appendResizehandles: function() {
        var handles = [];
        _.each(['nw', 'n', 'ne','e','se','s', 'sw', 'w'], function(cls) {
            handles.push('<div class="resize-handle '+ cls +'" data-resizeDirection="'+ cls +'"></div>');
        });

        this.$el.append(handles.join(''));
    },

    getDOMRefs: function() {
        var refs = this.refs;

        if(!refs) {
            this.refs = {
                layoutBox: this.$el.find('div.hud-item-layout'),
                iconBlock: this.$el.find('div.item-icon'),
                icon: this.$el.find('div.item-icon img'),
                textBlock: this.$el.find('div.item-counter'),
                counter: this.$el.find('div.item-counter span.counter'),
                templateText: this.$el.find('div.item-counter span.text'),
                box: this.$el.find('.hud-item-box'),
                h100: this.$el.find('.hud-item-box div.h100'),
                h200: this.$el.find('.hud-item-box div.h200'),
                chatList: this.$el.find('ul.chat-messages')
            }
        }

        return refs;
    },

    getForm: function() {
        return this.options.formView;
    },

    getIconOptions: function() {
        var HUDItemIconEnums = this.options.HUDItemIconEnums,
            iconRecord = HUDItemIconEnums.get(this.model.get('name')),
            iconOptions = iconRecord ? iconRecord.get('options') : null;

        return iconOptions;
    },

    onModelDestroy: function() {
        this.remove();
        this.getForm().remove();
        this.options.formView = null;

        this.fireEvent('destroy', [this.model]);
    },

    onModelUpdate: function(record, event) {
        var changes = event.changes;

        console.info(' > HUD Item', record.get('name'), 'model has changed', JSON.stringify(changes));

        _.each(changes, function(set, field) {
            var refreshStatus = field.match(/coordinates|width|height|padding|textSize|iconSize|iconSpacing|iconPosition/gi) != null;
            set && this.callUpdateMethodByField(field, refreshStatus);
        }, this);
    },

    callUpdateMethodByField: function(field, refreshStatus) {
        var value = this.model.get(field),
            methodName = 'update' + field.charAt(0).toUpperCase() + field.substring(1),
            fn = this[methodName]; // these methods are from visualHUD.Libs.itemBuilderMixin

        console.info(' > Updating HUD Item property', field, 'with new value:', value);

        if(_.isFunction(fn)) {
            fn.call(this, value);
            (refreshStatus === true) && this.delayedStatusUpdate(true);
        }
    },

    refreshCoordinates: function(silent) {
        if(this.$el.is(':visible')) {

            console.info(' > Updating HUD Item Coordinates. isSilent:', silent || false);

            var position = this.$el.position(),
                coordinates = {
                    top: Math.round(position.top / visualHUD.scaleFactor),
                    left: Math.round(position.left / visualHUD.scaleFactor),
                    height: Math.round(this.$el.height() / visualHUD.scaleFactor),
                    width: Math.round(this.$el.width() / visualHUD.scaleFactor)
                };

            this.model.set('coordinates', coordinates, {silent: silent});
            (silent == true) && this.getForm().updateStatusBar();

            return coordinates;
        }
    },

    move: function(direction, offset) {
        var position = this.$el.position();
        position[direction] += offset;

        var newPosition = this.checkPosition(position);

        this.$el.css(newPosition);
        this.refreshCoordinates();

    },

    checkPosition: function(position){

        var element = this.$el;
        var boundTo = element.offsetParent();

        var limits = this.limits || {
            top: 0,
            left: 0,
            right: boundTo.width(),
            bottom: boundTo.height()
        };

        this.limits = limits;

        var elementSize = {
            width: element.width(),
            height: element.height()
        };

        if(position.left + elementSize.width > limits.right){
            position.left = limits.right - elementSize.width;
        }

        if(position.top + elementSize.height > limits.bottom){
            position.top = limits.bottom - elementSize.height;
        }

        position.left = Math.round(position.left < 0 ? 0 : position.left);
        position.top = Math.round(position.top < 0 ? 0 : position.top);

        return position;
    },

    itemClick: function(event) {
        this.fireEvent('click', [this, event]);
    },

    getGroup: function() {
        return this.model.get('group');
    },

    setGroup: function(name) {
        this.model.set('group', name || null)
    },

    update: function(data) {
        console.info(' > Updating HUD Item', this.model.get('name'), JSON.stringify(data));

        var form = this.getForm();
        this.model.set(data);
        form.setValues(data, {silent: true});
    },
    /*
        Abstract methods, should be defined within visualHUD.Libs.itemBuilderMixin
    */
    updateCoordinates: function(values) {
        console.info(' > Updating HUD Item coordinates', JSON.stringify(values));
        this.$el.css({
            top: values.top * visualHUD.scaleFactor,
            left: values.left * visualHUD.scaleFactor
        });
    },

    updateTextSize: function(value) {
    },

    updateTextStyle: function(value) {
    },

    updateTextOpacity: function(value) {

    },

    updateIconPosition: function(position, spacing) {
    },

    updateIconOpacity: function(value) {
    },

    updateIconSize: function(value) {
    },

    updateIconStyle: function(value) {
    },

    updateIconSpacing: function(value) {
    },

    updateTextColor: function(value) {
    },

    updateTeamColors: function(value) {
    },

    updateColorRanges: function(value) {
    },

    updateText: function(value) {
    },

    updateBorderRadius: function(value) {
    },

    updateBoxStyle: function(value) {
    },

    updateTemplate: function(value) {
    },

    updatePowerupView: function(value) {
    },

    updatePadding: function(value) {
    },

    updateToggleChat: function(value) {
    },

    updateScoreboxLayout: function(value) {
    }
});

