visualHUD.Views.HUDItemForm = Backbone.View.extend({
    tagName: 'form',
    className: 'app-form',
    basicTpl: [
        '<div class="control-header">',
            '<div class="header-wrap <%= className %>">',
                '<span class="item-type">Item:</span>',
                '<div class="item-name"><%= label %></div>',
            '</div>',
        '</div>',
        '<div class="app-form-container">',
            '<div class="app-form-controls">',
            '</div>',
        '</div>',
        '<div class="form-bbar">',
            '<div class="item-status">',
            '</div>',
        '</div>'
    ],
    statusBarTpl: [
        '<span class="mr-10">',
            '<span class="item-name">X:</span>',
            '<span class="item-value"><%= left %></span>',
        '</span>',
        '<span class="mr-10">',
            '<span class="item-name">Y:</span>',
            '<span class="item-value"><%= top %></span>',
        '</span>',
        '<span class="mr-10">',
            '<span class="item-name">W:</span>',
            '<span class="item-value"><%= width %></span>',
        '</span>',
        '<span class="mr-10">',
            '<span class="item-name">H:</span>',
            '<span class="item-value"><%= height %></span>',
        '</span>'
    ],

    events: {
        'submit': 'preventSubmit',
        'click legend': 'toggleFieldsetCollapse',
        'change': 'onChange',
        'click .align-controls li': 'alignItems',
        'click .arrange-controls li': 'arrangeItems'
    },

    initialize: function() {
        var defaultMixin = visualHUD.Libs.formBuilderMixin.getByType('base'),
            typeMixin = visualHUD.Libs.formBuilderMixin.getByType(this.model.get('itemType')),
            nameMixin = visualHUD.Libs.formBuilderMixin.getByName(this.model.get('name'));

        // Mixin functionality goes from more generic (by type) to more specific (by name)
        _.extend(this, defaultMixin, typeMixin || {}, nameMixin || {});

        //Mixin Form Controls Generator
        _.extend(this,visualHUD.Libs.formControlsBuilder);

        var tpl = _.template(this.basicTpl.join(''), {
                className: this.model.get('cssClass'),
                label: this.model.get('label')
            });

        this.$el.append(tpl);
        this.hide();

        this.model.on('change:coordinates', this.updateStatusBar, this);
        $(window).bind('resize.form', $.proxy(this, 'trackResize'));
    },

    render: function() {
        var renderTo = this.options.renderTo;
        this.$el.appendTo(renderTo);
        this.trackResize();
        this.updateStatusBar();

        visualHUD.Libs.colorHelper.setupColorPicker(renderTo);

        this.createControls(this.$el.find('.app-form-controls'));
    },

    trackResize: function() {
        var parent = this.$el.parent(),
            height = parent.height();

        this.$el.height(height);
    },

    updateStatusBar: function() {
        var coordinates = this.model.get('coordinates');
        var tpl = _.template(this.statusBarTpl.join(''), coordinates);

        this.$el.find('.item-status').html(tpl);
    },

    getCollection: function(name) {
        return this.options.collections[name] || null
    },

    onChange: function(event) {
        var name = event.target.name

        if(name && event.silent !== true) {
            var inputElement = $(event.target);
            var value = inputElement.is('[type=checkbox]') ? inputElement.get(0).checked : inputElement.val();
            var isColorRange = name.match(/^colorRange/);

            if(isColorRange) {
                value = this.getColorRangeChanges(name, value);
                name = 'colorRanges';
            }
            this.model.set(name, value);
        }

        return;
    },

    /**
     * Complex method that deeply clone color range structure and update it's value
     * We need this deep cloning in order to trigger model onchnage event
     * @param name
     * @param value
     * @return {Object}
     */
    getColorRangeChanges: function(name, value) {
        var rangeData = name.split('_');
        var colorRangeIndex = parseInt(rangeData[1], 10);
        var colorRangeValueIndex = parseInt(rangeData[3], 10);
        var currentRanges = Array.prototype.slice.call(this.model.get('colorRanges')); //clone array to trigger on change event
        var currentRange = _.clone(currentRanges[colorRangeIndex]);
        var currentRangeValues = Array.prototype.slice.call(currentRange.range);

        currentRanges[colorRangeIndex] = currentRange;
        currentRange.range = currentRangeValues;

        if(rangeData[2] == 'range' && colorRangeValueIndex !== undefined) {
            currentRangeValues[colorRangeValueIndex] = parseInt(value, 10);
        }
        else if(rangeData[2] == 'color'){
            currentRange.color = value;
        }

        return currentRanges
    },

    preventSubmit: function(event) {
        event.preventDefault();
    },

    getValues: function() {
        var rselectTextarea = /select|textarea/i;
        var rinput = /color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i;
        var formElements = this.$el.find("input,select,textarea");

        return this.$el.map(function () {
                return jQuery.makeArray(formElements);
            }).filter(function () {
                return this.name && !this.disabled && (this.checked || rselectTextarea.test(this.nodeName) || rinput.test(this.type));
            }).map(function (i, elem) {
                var valueObject = {};
                valueObject[elem.name] = jQuery(this).val();
                return valueObject
            }).get();
    },

    setValues: function(data, options) {
        var options = options || {};

        _.each(data, function(value, name) {
            var inputElement = this.$el.find('[name='+ name +']');
            if(inputElement.length) {
                var event = jQuery.Event('change');
                event.silent = options.silent || false;
                inputElement.val(value).trigger(event);
            }
        }, this);
    },

    toggleFieldsetCollapse: function(event) {
        var target = $(event.target);
        var fieldset = target.closest('fieldset', this.$el);
        fieldset.toggleClass('collapsed');
    },

    alignItems: function(event) {
        var control = $(event.currentTarget),
            action = control.data('action');

        this.trigger('align.action', [action]);
        return false;
    },

    arrangeItems: function(event) {
        var control = $(event.currentTarget),
            action = control.data('action');

        this.trigger('arrange.action', [action]);
        return false;
    },

    /**
     * Abstract function that is called upon from rendering
     * This method should be implemented in visualHUD.Libs.formBuilderMixin
     */
    createControls: function() {

    }
});

