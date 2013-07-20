/**
 * The set of methods that is used to build form controls
 * @type {Object}
 */
visualHUD.Libs.formControlsBuilder = {
    cache: {},

    getDefaultsByType: function(type) {
        return this.controlDefaults[type];
    },

    getTemplateByType: function(type) {
        return this.controlTemplates[type].join('');
    },
    buildForm: function(markups) {
        var fragment = document.createDocumentFragment();

        if(_.isArray(markups) == false) {
            markups = [markups];
        }

        _.each(markups, function(m) {
            var element = this.createElementByType(m);
            fragment.appendChild(element.get(0));

            if(m.items != undefined) {
                var f = this.buildForm(m.items);
                element.get(0).appendChild(f);
            }
        }, this);

        return fragment;
    },

    createElementByType: function(options) {
        var fnName = 'create' + options.type.charAt(0).toUpperCase() + options.type.substring(1);
        var fn = this[fnName];

        if(_.isFunction(fn)) {
            return fn.apply(this, arguments);
        }
        else {
            return this.createFormControl(options);
        }
    },

    controlDefaults: {
        container: {
            cssClass: '',
            id: '',
            wrap: false,
            hint: null
        },
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
            cssClass: '',
            wrap: false
        },
        textbox: {
            size: '',
            label: 'Textbox',
            name: 'textbox',
            inputType: 'text',
            value: '',
            maxlength: '',
            placeholder: '',
            hint: null,
            wrap: true,
            required: false
        },
        fileInput: {
            size: '',
            label: 'Fileinput',
            noFileMessage: 'No file selected',
            text: 'Browse...',
            name: 'file',
            value: '',
            multiple: false,
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
            required: false,
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
            tooltip: null,
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
            tooltip: null,
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
        container: [
            '<div></div>'
        ],
        form: [
            '<form class="<%= cssClass %>" id="<%= id %>" action="<%= action %>" method="<%= method %>">'
        ],
        toolbar: [
            '<div class="form-toolbar <%= cssClass %> clearfloat"></div>'
        ],
        textbox: [
            '<input type="<%= inputType %>" size="<%= size %>" name="<%= name %>" value="<%= value %>" placeholder="<%= placeholder %>" maxlength="<%= maxlength %>" <%= required ? \'required="required"\' : \'\' %>  />'
        ],
        textarea: [
            '<textarea name="<%= name %>" rows="<%= rows %>" cols="<%= cols %>" <%= required ? \'required="required"\' : \'\' %>><%= value %></textarea>'
        ],
        fieldset: [
            '<fieldset>',
            '<legend><%= label %></legend>',
            '</fieldset>'
        ],
        fileInput: [
            '<span class="file-input">',
            '<span class="btn <%= cssClass %>"><span><%= text %></span><input type="file" name="<%= name %>" <%= multiple ? \'multiple\' : \'\' %> /></span>',
            '<span class="file-name"><%= noFileMessage %></span>',
            '</span>'
        ],
        rangeInput: [
            '<div class="slider"><div class="progress"></div><input type="button" class="handle" /></div>',
            '<input type="text" size="8" maxlength="3" value="<%= value %>" class="range range-input" name="<%= name %>"  />'
        ],
        checkbox: [
            '<label class="check-label"><input type="checkbox" name="<%= name %>" value="<%= value %>" <%= checked ? \'checked="checked"\' : \'\' %>"><span class="box-label" data-tooltip="<%= tooltip %>"><%= boxLabel %></span></label>'
        ],
        radiobutton: [
            '<label class="check-label"><input type="radio" name="<%= name %>" value="<%= value %>"  <%= checked ? \'checked="checked"\' : \'\' %>"><span class="box-label" data-tooltip="<%= tooltip %>"><%= boxLabel %></span></label>'
        ],
        select: [
            '<span class="styled-select w-carret" <% if(width) { %>style="width:<%= width %>"<% }; %>><span class="select-value"></span><select type="text" name="<%= name %>" value="<%= value %>"><%= options %></select></span>'
        ],
        button: [
            '<button name="<%= name %>" type="<%= action %>" value="<%= value %>" class="<%= cssClass %>" data-tooltip="<%= tooltip %>"><span class="<%= icon %>"><%= text %></span></button>'
        ],
        alignControl: [
            '<ul class="library-items align-controls icons-24px clearfloat">',
            '<li class="align-top" data-action="top" data-tooltip="Align top edges"><span class="icon"></span><span class="item-name">Top edges</span></li>',
            '<li class="align-vertical" data-action="vertical" data-tooltip="Align vertical centers"><span class="icon"></span><span class="item-name">Vertical centers</span></li>',
            '<li class="align-bottom" data-action="bottom" data-tooltip="Align bottom edges"><span class="icon"></span><span class="item-name">Bottom edges</span></li>',
            '<li class="align-left" data-action="left" data-tooltip="Align left edges"><span class="icon"></span><span class="item-name">Left edges</span></li>',
            '<li class="align-horizontal" data-action="horizontal" data-tooltip="Align horizontal centers"><span class="icon"></span><span class="item-name">Horizontal centers</span></li>',
            '<li class="align-right" data-action="right" data-tooltip="Align right edges"><span class="icon"></span><span class="item-name">Right edges</span></li>',
            '</ul>'
        ],
        arrangeControl: [
            '<ul class="library-items arrange-controls icons-24px clearfloat">',
            '<li class="bring-front" data-action="bring-front" data-tooltip="Bring to front <small>(CTRL + SHIFT + UP)</small>"><span class="icon"></span><span class="item-name">Bring to front <small>(CTRL + SHIFT + UP)</small></span></li>',
            '<li class="send-back" data-action="send-back" data-tooltip="Send to back <small>(CTRL + SHIFT + DOWN)</small>"><span class="icon"></span><span class="item-name">Send to back <small>(CTRL + SHIFT + DOWN)</small></span></li>',
            '<li class="bring-forward" data-action="bring-forward" data-tooltip="Bring forward <small>(CTRL + UP)</small>"><span class="icon"></span><span class="item-name">Bring forward <small>(CTRL + UP)</small></span></li>',
            '<li class="send-backward" data-action="send-backward" data-tooltip="Send backward <small>(CTRL + DOWN)</small>"><span class="icon"></span><span class="item-name">Send backward <small>(CTRL + DOWN)</small></span></li>',
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
        var element = $('<div class="f-row" />');
        element
            .addClass(attributes.cssClass || '')
            .attr('id', attributes.id || '')
            .addClass(attributes.required ? 'reqired-field' : '');
        
        return element;
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

    createContainer: function(attributes) {
        var element = $('<div />');
        
        var ignoreAttributes = ['type', 'items'];
        var mapAttributes = {'cssClass': 'class'};

        var elementAttributes = _.extend({}, attributes);

        _.each(ignoreAttributes, function(attr) {
            delete elementAttributes[attr];
        });
        _.each(mapAttributes, function(value, key) {
            elementAttributes[value] = elementAttributes[key];
            delete elementAttributes[key];
        });
        
        element.attr(elementAttributes);

        if(attributes.html) {
            element.html(attributes.html);
        }

        return element;
    },

    createComponent: function(attributes) {
        var constructor = Backbone.resolveNamespace(attributes['constructorName']),
            instance = new constructor(attributes),
            element = instance.$el;

        element.data('component', instance);

        return element;
    },

    createRangeInput: function(attributes) {
        var defaults = {
            precision: false,
            keyboard: false,
            progress: true,
            sliderSize: 160,
            handleSize: 12
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

    generateSelectOptionsFromMap: function(opts, selectHTML) {
        var optionHTMLTemplate = '<option value="<%= value %>"><%= label %></option>';
        var optgroupHTMLTemplates = ['<optgroup label="<%= label %>">', '</optgroup>'];

        _.each(opts, function(value, key) {

            if($.isPlainObject(value)) {
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
                        value: key,
                        label: value
                    })
                );
            }
        }, this);
        return selectHTML.join('')
    },

    createSelect: function(attributes) {

        if(attributes.collection) {
            attributes.options = this.createSelectOptionsMapFromCollection(attributes.collection, attributes);
        }

        attributes.options = this.generateSelectOptionsFromMap(attributes.options, []);

        var element = this.createFormControl(attributes),
            select = element.find('select'),
            valueElement = select.parent().find('.select-value');

        if(attributes.value) {
            select.val(attributes.value);
        }
        else {
            select.attr('selectedIndex', 0);
        }

        var selectDOM = select.get(0);

        valueElement.text($(selectDOM[selectDOM.selectedIndex]).text());

        select.on('change', function() {
            var text = $(this[this.selectedIndex]).text()
            valueElement.text(text);
        });

        select.on('focus', function() {
            select.parent().addClass('focused');
        });

        select.on('blur', function() {
            select.parent().removeClass('focused');
        });

        if(attributes.collection) {
            attributes.collection.on('all', function() {
                var options = this.createSelectOptionsMapFromCollection(attributes.collection, attributes);
                options = this.generateSelectOptionsFromMap(options, []);
                select.html(options);
            }, this)
        }

        return element;
    },

    createButton: function(attributes) {
        attributes.cssClass = attributes.cssClass || '';
        attributes.cssClass += attributes.role ? ' button-' + attributes.role : '';
        attributes.icon = attributes.icon ? 'w-icon icon-' + attributes.icon : '';

        return this.createFormControl(attributes);
    },


    createFileInput: function(attributes) {
        attributes.cssClass += attributes.role ? ' button-' + attributes.role : '';
        var element = this.createFormControl(attributes);
        var fileinput = element.find('input[type=file]');
        var filename = element.find('span.file-name');

        var defaults = this.getDefaultsByType(attributes.type);
        attributes = _.extend({}, defaults, attributes);

        fileinput.bind('change', function() {
            var value = $(this).val(),
                fileName = value.split(/\\/).pop();
            filename.text(fileName || attributes.noFileMessage);
        });

        return element;
    },

    createColorRange: function(attributes) {
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

        element.delegate('input[type=text]', 'change', function(event) {
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

            if(odd) {
                value = parseInt(this.value);
                if($nextInput.length && !$nextInput.attr('readOnly')) {
                    $nextInput.val(value + 1);

                    //event.stopPropagation();
                    eventManuallyTriggered = true;
                    $nextInput.trigger('change', [value + 1]);
                }
            } else {
                value = parseInt(this.value);
                if($prevInput.length && !$prevInput.attr('readOnly')) {
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

