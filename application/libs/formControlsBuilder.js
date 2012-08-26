/**
 * The set of methods that is used to build form controls
 * @type {Object}
 */
visualHUD.Libs.formControlsBuilder = {
    cache:{},

    getDefaultsByType: function(type) {
        return this.controlDefaults[type];
    },

    getTemplateByType: function(type) {
        return this.controlTemplates[type].join('');
    },

    controlDefaults: {
        form: {
            cssClass: '',
            id: '',
            action: '',
            method: 'get',
            wrap: false,
            hint: null
        },
        fieldset: {
            label: 'Fieldset',
            wrap: false,
            hint: null
        },
        toolbar: {
            wrap: false
        },
        textbox: {
            size: '',
            label: 'Textbox',
            name: 'textbox',
            value: '',
            maxlength: '',
            hint: null,
            wrap: true
        },
        textarea: {
            rows: 2,
            cols: 20,
            value: '',
            wrap: true,
            hint: null,
            name: 'textarea'
        },
        rangeInput: {
            value: 0,
            name: 'rangeinput',
            hint: null,
            wrap: true
        },
        checkbox: {
            type: 'checkbox',
            hint: null,
            label: null,
            checked: false,
            name: 'checkbox',
            value: 'on',
            boxLabel: 'Checkbox',
            wrap: true
        },
        checkboxGroup: {
            wrap: true,
            hint: null
        },
        radiobutton: {
            type: 'radiobutton',
            hint: null,
            label: null,
            checked: false,
            name: 'radiobutton',
            value: 'on',
            boxLabel: 'Radiobutton',
            wrap: true
        },
        radiobuttonGroup: {
            wrap: true,
            hint: null
        },
        select: {
            width: null,
            value: 0,
            name: 'select',
            hint: null,
            wrap: true,
            displayField: 'name',
            valueField: 'id',
            options: {}
        },
        button: {
            name: '',
            role: '',
            action: 'button',
            value: '',
            cssClass: '',
            tooltip: '',
            icon: '',
            text: 'Button',
            wrap: false,
            hint: null
        },
        alignControl: {
            label: 'Align',
            hint: null,
            wrap: true
        },
        arrangeControl: {
            label: 'Arrange',
            hint: null,
            wrap: true
        },
        groupActionsControl: {
            label: 'Actions',
            hint: null,
            wrap: true
        },
        colorPicker: {
            value: 'FFFFFF',
            name: 'color',
            hint: null,
            wrap: true
        }
    },

    controlTemplates: {
        form: [
            '<form class="<%= cssClass %>" id="<%= id %>" action="<%= action %>" method="<%= method %>">'
        ],
        toolbar: [
            '<div class="form-toolbar clearfloat"></div>'
        ],
        textbox: [
            '<input type="text" size="<%= size %>" name="<%= name %>" value="<%= value %>" maxlength="<%= maxlength %>"  />'
        ],
        textarea: [
            '<textarea name="<%= name %>" rows="<%= rows %>" cols="<%= cols %>"><%= value %></textarea>'
        ],
        fieldset: [
            '<fieldset>',
            '<legend><%= label %></legend>',
            '</fieldset>'
        ],
        rangeInput: [
            '<div class="slider"><div class="progress"></div><input type="button" class="handle" /></div>',
            '<input type="text" size="8" maxlength="3" value="<%= value %>" class="range range-input" name="<%= name %>"  />'
        ],
        checkbox: [
            '<label class="check-label"><input type="checkbox" name="<%= name %>" value="<%= value %>" <%= checked ? \'checked="checked"\' : \'\' %>"><span class="box-label"><%= boxLabel %></span></label>'
        ],
        radiobutton: [
            '<label class="check-label"><input type="radio" name="<%= name %>" value="<%= value %>"  <%= checked ? \'checked="checked"\' : \'\' %>"><span class="box-label"><%= boxLabel %></span></label>'
        ],
        select: [
            '<select type="text" name="<%= name %>" value="<%= value %>" <% if(width) { %>style="width:<%= width %>"<% }; %>><%= options %></select>'
        ],
        button: [
            '<button name="<%= name %>" type="<%= action %>" value="<%= value %>" class="<%= cssClass %>" data-tooltip="<%= tooltip %>"><span class="<%= icon %>"><%= text %></span></button>'
        ],
        alignControl: [
            '<ul class="library-items align-controls icons-24px clearfloat">',
            '<li class="align-top" data-action="top" data-tooltip="Align top edges"><span class="item-name">Align top edges</span></li>',
            '<li class="align-vertical" data-action="vertical" data-tooltip="Align vertical centers"><span class="item-name">Align vertical centers</span></li>',
            '<li class="align-bottom" data-action="bottom" data-tooltip="Align bottom edges"><span class="item-name">Align bottom edges</span></li>',
            '<li class="align-left" data-action="left" data-tooltip="Align left edges"><span class="item-name">Align left edges</span></li>',
            '<li class="align-horizontal" data-action="horizontal" data-tooltip="Align horizontal centers"><span class="item-name">Align horizontal centers</span></li>',
            '<li class="align-right" data-action="right" data-tooltip="Align right edges"><span class="item-name">Align right edges</span></li>',
            '</ul>'
        ],
        arrangeControl: [
            '<ul class="library-items arrange-controls icons-24px clearfloat">',
            '<li class="bring-front" data-action="bring-front" data-tooltip="Bring to front <small>(CTRL + SHIFT + UP)</small>"><span class="item-name">Bring to front <small>(CTRL + SHIFT + UP)</small></span></li>',
            '<li class="send-back" data-action="send-back" data-tooltip="Send to back <small>(CTRL + SHIFT + DOWN)</small>"><span class="item-name">Send to back <small>(CTRL + SHIFT + DOWN)</small></span></li>',
            '<li class="bring-forward" data-action="bring-forward" data-tooltip="Bring forward <small>(CTRL + UP)</small>"><span class="item-name">Bring forward <small>(CTRL + UP)</small></span></li>',
            '<li class="send-backward" data-action="send-backward" data-tooltip="Send backward <small>(CTRL + DOWN)</small>"><span class="item-name">Send backward <small>(CTRL + DOWN)</small></span></li>',
            '</ul>'
        ],
        groupActionsControl: [
            '<ul class="library-items group-action-controls icons-24px clearfloat">',
            '<li class="delete" data-action="delete-selected" data-tooltip="Delete selected items"></li>',
            '<li class="group" data-action="group-selected" data-tooltip="Group/ungroup selected items"></li>',
            '</ul>'
        ],
        colorPicker: [
            '<input type="text" size="6" name="<%= name %>" value="<%= value %>" maxlength="6" class="color-input"  />',
            '<div class="color-picker-box" style="background-color: #<%= value %>; "></div>'
        ]
    },

    baseTemplate: [
        '<span class="f-label <%= label ? \'\' : \'hidden\' %>"><%= label %></span>',
        '<span class="f-inputs">',
            '{markup}',
        '</span>',
        '<% if(hint) { %><div class="f-hint"><%= hint %></div><% }; %>'
    ],

    getBaseElement: function(attributes) {
        return $('<div class="f-row" />').addClass(attributes.cssClass || '').attr('id', attributes.id || '');
    },

    getBaseMarkup: function(markup) {
        var html = this.baseTemplate.join('').replace(/{markup}/gi, markup);
        return html;
    },

    createFormControl: function(attributes, markup) {
        var markup = markup || this.getTemplateByType(attributes.type);
        var defaults = this.getDefaultsByType(attributes.type);
        var attributes = _.extend({}, defaults, attributes);
        var template = attributes.wrap ? this.getBaseMarkup(markup) : markup;
        var html = _.template(template, attributes);
        var element = attributes.wrap ? this.getBaseElement(attributes).html(html) : $(html);

        return element;
    },

    createRangeInput:function (attributes) {
        var defaults = {
            precision:false,
            keyboard:false,
            progress:true,
            sliderSize:160,
            handleSize:12
        };
        var element = this.createFormControl(attributes);
        var input = element.find('input.range-input').rangeinput(_.extend(defaults, attributes));

        return element;
    },

    createCheckboxGroup: function(attributes) {
        return this.createChecksGroup('checkbox', attributes);
    },

    createRadiobuttonGroup: function(attributes) {
        return this.createChecksGroup('radiobutton', attributes);
    },

    createChecksGroup: function(defaultType, attributes) {
        var checkboxTemplate = this.getTemplateByType(defaultType),
            checkboxDefaults = this.getDefaultsByType(defaultType),
            markup = [];

        attributes.cssClass = defaultType + '-group layout-' + (attributes.layout || '');

        _.each(attributes.options, function(item) {
            var attributes = _.extend({}, checkboxDefaults, item);
            markup.push(_.template(checkboxTemplate, attributes));
        }, this);

        return this.createFormControl(attributes, markup.join(''));
    },

    createSelectOptionsMapFromCollection: function(collection, attributes) {
        var selectOptionsMap = {};

       collection.each(function(record) {
           selectOptionsMap[record.get(attributes.valueField)] = record.get(attributes.displayField);
       });

       return selectOptionsMap;
    },

    generateSelectOptionsFromMap: function (opts, selectHTML) {
        var optionHTMLTemplate = '<option value="<%= value %>"><%= label %></option>';
        var optgroupHTMLTemplates = ['<optgroup label="<%= label %>">', '</optgroup>'];

        _.each(opts, function (value, key) {

            if ($.isPlainObject(value)) {
                selectHTML.push(
                    _.template(optgroupHTMLTemplates[0], {
                        label: key
                    })
                );
                this.generateSelectOptionsFromMap(value, selectHTML);
                selectHTML.push(optgroupHTMLTemplates[1]);
            }
            else {
                selectHTML.push(
                    _.template(optionHTMLTemplate, {
                        value:key,
                        label:value
                    })
                );
            }
        }, this);
        return selectHTML.join('')
    },

    createSelect:function (attributes) {

        if(attributes.collection) {
            attributes.options = this.createSelectOptionsMapFromCollection(attributes.collection, attributes);
        }

        attributes.options = this.generateSelectOptionsFromMap(attributes.options, []);

        var element = this.createFormControl(attributes);

        if (attributes.value) {
            element.find('select').val(attributes.value);
        }
        else {
            element.find('select').attr('selectedIndex', 0);
        }

        return element;
    },

    createButton:function (attributes) {
        attributes.cssClass += attributes.role ? ' button-' + attributes.role : '';
        attributes.icon = attributes.icon ? 'w-icon ' + attributes.icon : '';

        return this.createFormControl(attributes);
    },


    createColorRange:function (attributes) {
        var template = ([
            '<% _.each(ranges, function(range, idx) { %>',
            '<div class="f-row">',
            '<span class="f-label"><%= range.name %></span>',
            '<span class="f-inputs">',
            '<span class="color-range-inputs mr-10">',
            '<input type="text" size="3" name="colorRange_<%= idx %>_range_0" value="<%= range.range[0] %>" maxlength="3" class="color-range-input mr-5">',
            '<input type="text" size="3" name="colorRange_<%= idx %>_range_1" value="<%= range.range[1] %>" maxlength="3" class="color-range-input mr-5">',
            '</span>',
            '<input type="text" size="6" name="colorRange_<%= idx %>_color" value="<%= range.color %>" maxlength="6" class="color-input" />',
            '<div class="color-picker-box" style="background-color: #<%= range.color %>; "></div>',
            '</span>',
            '</div>',
            '<% }); %>'
        ]).join('');

        var element = $('<div />').html(_.template(template, attributes));

        var rangeValueInputs = element.find('input.color-range-input');
        var eventManuallyTriggered = false;

        element.delegate('input[type=text]', 'change', function (event) {
            if(eventManuallyTriggered) {
                $(this).closest('form').trigger(event);
                eventManuallyTriggered = false;
                return false;
            }

            var $input = $(this),
                index = rangeValueInputs.index(this),
                odd = (index + 1) % 2 == 0,
                value;

            var $nextInput = rangeValueInputs.eq(index + 1),
                $prevInput = rangeValueInputs.eq(index - 1);

            if (odd) {
                value = parseInt(this.value);
                if ($nextInput.length && !$nextInput.attr('readOnly')) {
                    $nextInput.val(value + 1);

                    //event.stopPropagation();
                    eventManuallyTriggered = true;
                    $nextInput.trigger('change', [value + 1]);
                }
            } else {
                value = parseInt(this.value);
                if ($prevInput.length && !$prevInput.attr('readOnly')) {
                    $prevInput.val(value - 1);

                    //event.stopPropagation();
                    eventManuallyTriggered = true;
                    $prevInput.trigger('change', [value - 1]);

                }
            }
        });

        rangeValueInputs.first().attr('readonly', true);
        rangeValueInputs.last().attr('readonly', true);

        return element;
    }
};

