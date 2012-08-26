visualHUD.Libs.formBuilderMixin = {
    getByType: function(type) {
        return this[type];
    },

    getByName: function(name) {
        return this[name];
    },

    'base': {
        buildForm: function(markups) {
            var fragment = document.createDocumentFragment();

            if(_.isArray(markups) == false) {
                markups = [markups];
            }

            _.each(markups, function(m) {
                var element = this.createElementByType(m);
                fragment.appendChild(element.get(0));

                if(m.items && m.items.length) {
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

        getSelectBasic: function(options) {
            return _.extend({
                'type': 'select',
                'name': 'select',
                'label': 'Select',
                'width': '120px',
                'value': null,
                'options': []
            }, options || {});
        },

        getRangeInputBasic: function(options) {
            return _.extend({
                'type': 'rangeInput',
                'name': 'input',
                'label': 'Range Input',
                'min': 0,
                'max': 100,
                'value': null
            }, options || {});
        },

        getColorInputBasic: function(options) {
            return _.extend({
                'type': 'colorPicker',
                'name': 'input',
                'label': 'Color',
                'value': null
            }, options || {});
        },

        getIconStyleSelectOptions: function() {
            var iconOptionsRecord = this.getCollection('HUDItemIconEnums').get(this.model.get('name'));
            var iconOptions = iconOptionsRecord.get('options');
            var iconStyleSelectOptions = {};

            _.each(iconOptions, function(opt, idx) {
                iconStyleSelectOptions[String(idx)] = opt.name;
            });

            return iconStyleSelectOptions;
        },

        getIconPositionOptions: function() {
            return {
                'left': 'Left',
                'top': 'Top',
                'right': 'Right',
                'bottom': 'Bottom'
            }
        },

        getTextStyleOptions: function() {
            return {
                '0': 'Normal',
                '3': 'Drop shadow'
            }
        },

        getBorderRadiusOptions: function() {
            return {
                '0': 'None',
                '3': '3px',
                '5': '5px',
                '8': '8px'
            }
        },

        getGradientOptions: function() {
            return {
                '0': 'Solid',
                'Gradient': {
                    '1': 'Top to bottom',
                    '2': 'Bottom to top',
                    '3': 'Left to right',
                    '4': 'Right to left'
                }
            }
        },

        getTextColorInput: function() {
            return this.getColorInputBasic({
                'name': 'textColor',
                'label': 'Color',
                'value': this.model.get('textColor')
            })
        },

        getIconStyleSelect: function() {
            return this.getSelectBasic({
                'name': 'iconStyle',
                'label': 'Icon',
                'value': this.model.get('iconStyle'),
                'options': this.getIconStyleSelectOptions()
            })
        },

        getIconPositionSelect: function() {
            return this.getSelectBasic({
                'name': 'iconPosition',
                'label': 'Position',
                'value':this.model.get('iconPosition'),
                'options': this.getIconPositionOptions()
            });
        },

        getIconSpacingInput: function() {
            return this.getRangeInputBasic({
                'name': 'iconSpacing',
                'label': 'Margin',
                'max': 32,
                'value': this.model.get('iconSpacing')
            });
        },

        getIconSizeInput: function() {
            return this.getRangeInputBasic({
                'name': 'iconSize',
                'label': 'Size',
                'max': 32,
                'value':this.model.get('iconSize')
            });
        },

        getIconOpacityInput: function() {
            return this.getRangeInputBasic({
                'name': 'iconOpacity',
                'label': 'Opacity',
                'value': this.model.get('iconOpacity')
            });
        },

        getTextStyleSelect: function() {
            return this.getSelectBasic({
                'name': 'textStyle',
                'label': 'Style',
                'value': this.model.get('textStyle'),
                'options': this.getTextStyleOptions()
            });
        },

        getTextSizeInput: function() {
            return this.getRangeInputBasic({
                'name': 'textSize',
                'label': 'Size',
                'value': this.model.get('textSize')
            });
        },

        getTextOpacityInput: function() {
            return this.getRangeInputBasic({
                'name': 'textOpacity',
                'label': 'Opacity',
                'value': this.model.get('textOpacity')
            });
        },

        getWidthInput: function() {
            return this.getRangeInputBasic({
                'name': 'width',
                'label': 'Width',
                'min': this.model.get('minWidth'),
                'max': this.model.get('maxWidth'),
                'value': this.model.get('width')
            });
        },

        getHeightInput: function() {
            return this.getRangeInputBasic({
                'name': 'height',
                'label': 'Height',
                'min': this.model.get('minHeight'),
                'max': this.model.get('maxHeight'),
                'value': this.model.get('height')
            });
        },

        getPaddingInput: function() {
            return this.getRangeInputBasic({
                'name': 'padding',
                'label': 'Padding',
                'min': 0,
                'max': 10,
                'value': this.model.get('padding')
            });
        },

        getOpacityInput: function() {
            return this.getRangeInputBasic({
                'name': 'opacity',
                'label': 'Opacity',
                'min': 0,
                'max': 100,
                'value': this.model.get('opacity')
            });
        },

        getPowerupLayoutOptions: function() {
            return {
                'left': 'Left to right',
                'right': 'Right to left',
                'top': 'Top to bottom',
                'bottom': 'Bottom to top'
            }
        }
    },
    'general': {
        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: 'Icon Properties',
                    items: [
                        this.getIconStyleSelect(),
                        this.getIconPositionSelect(),
                        this.getIconSpacingInput(),
                        this.getIconSizeInput(),
                        this.getIconOpacityInput(),
                        {
                            'type': 'checkbox',
                            'name': 'teamColors',
                            'boxLabel': 'Use team colors',
                            'checked': this.model.get('teamColors')
                        }
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Text Properties',
                    items: [
                        this.getTextStyleSelect(),
                        this.getTextSizeInput(),
                        this.getTextOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Color Range',
                    items: [
                        {
                            'type': 'colorRange',
                            'name': 'colorRanges',
                            'ranges': this.model.get('colorRanges')
                        }
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Align'
                        }
                    ]
                }
            ];
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'timer': {
        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: 'Icon Properties',
                    items: [
                        this.getIconPositionSelect(),
                        this.getIconSpacingInput(),
                        this.getIconSizeInput(),
                        this.getIconOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Text Properties',
                    items: [
                        {
                            'type': 'textbox',
                            'name': 'text',
                            'label': 'Time',
                            'size': 10,
                            'maxlength': 5,
                            'value': this.model.get('text')
                        },
                        this.getTextStyleSelect(),
                        this.getTextSizeInput(),
                        this.getTextOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'powerupIndicator': {
        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: 'Icon Properties',
                    items: [
                        this.getSelectBasic({
                            'name': 'iconPosition',
                            'label': 'Stack',
                            'value': this.model.get('iconPosition'),
                            'options': this.getPowerupLayoutOptions()
                        }),
                        this.getIconSpacingInput(),
                        this.getIconSizeInput(),
                        {
                            'type': 'checkbox',
                            'name': 'singlePowerup',
                            'boxLabel': 'Show single icon',
                            'checked': this.model.get('singlePowerup')
                        }
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Text Properties',
                    items: [
                        this.getTextSizeInput(),
                        this.getTextOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'accuracyIndicator': {
        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: 'Icon Properties',
                    items: [
                        this.getIconStyleSelect(),
                        this.getIconPositionSelect(),
                        this.getIconSpacingInput(),
                        this.getIconSizeInput(),
                        this.getIconOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Text Properties',
                    items: [
                        this.getTextStyleSelect(),
                        this.getTextColorInput(),
                        this.getTextSizeInput(),
                        this.getTextOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'skillIndicator': {
        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: 'Text Properties',
                    items: [
                        this.getTextColorInput(),
                        {
                            'type': 'textbox',
                            'name': 'template',
                            'label': 'Tpl',
                            'size': 32,
                            'maxlength': '64',
                            'value': this.model.get('template')
                        }
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Text Style',
                    items: [
                        this.getTextStyleSelect(),
                        this.getTextSizeInput(),
                        this.getTextOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Color Range',
                    items: [
                        {
                            'type': 'colorRange',
                            'name': 'colorRanges',
                            'ranges': this.model.get('colorRanges')
                        }
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'iconItem': {
        getIconSizeInput: function() {
            return this.getRangeInputBasic({
                'name': 'iconSize',
                'label': 'Size',
                'min': 8,
                'max': 48,
                'value':this.model.get('iconSize')
            });
        },
        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: 'Icon Properties',
                    items: [
                        this.getIconSizeInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'flagIndicator': {
        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: 'Icon Properties',
                    items: [
                        this.getIconStyleSelect(),
                        this.getIconSizeInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'obits': {
        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'scoreBox': {
        getIconSpacingInput: function() {
            return this.getRangeInputBasic({
                'name': 'iconSpacing',
                'label': 'Spacing',
                'max': 8,
                'value': this.model.get('iconSpacing')
            });
        },

        getLayoutOptions: function() {
            return {
                'vertical': 'Vertical',
                'horizontal': 'Horizontal'
            };
        },

        getModeOptions: function() {
            return {
                'ffa': 'FFA / Duel',
                'tdm': 'Teamplay'
            }
        },

        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: 'Scorebox Properties',
                    items: [
                        this.getIconStyleSelect(),

                        this.getSelectBasic({
                            'name': 'scoreboxLayout',
                            'label': 'Layout',
                            'value': this.model.get('scoreboxLayout'),
                            'options': this.getLayoutOptions()
                        }),

                        this.getIconSpacingInput(),

                        this.getSelectBasic({
                            'name': 'scoreboxMode',
                            'label': 'Mode',
                            'value': this.model.get('scoreboxMode'),
                            'options': this.getModeOptions()
                        })
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'bar': {
        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: this.model.get('label') + ' Properties',
                    items: [
                        this.getWidthInput(),
                        this.getHeightInput(),
                        this.getPaddingInput(),
                        {
                            'type': 'colorPicker',
                            'name': 'color',
                            'label': 'Color',
                            'value': this.model.get('color')
                        },
                        this.getOpacityInput()
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Color Range',
                    items: [
                        {
                            'type': 'colorRange',
                            'name': 'colorRanges',
                            'ranges': this.model.get('colorRanges')
                        },
                        this.getRangeInputBasic({
                            'name': 'barsOpacity',
                            'label': 'Opacity',
                            'min': 0,
                            'max': 100,
                            'value': this.model.get('barsOpacity')
                        })
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }
    },

    'rect': {
        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: this.model.get('label') + ' Properties',
                    items: [
                        this.getWidthInput(),
                        this.getHeightInput(),
                        this.getSelectBasic({
                            'name': 'borderRadius',
                            'label': 'Rounded',
                            'value': this.model.get('borderRadius'),
                            'options': this.getBorderRadiusOptions()
                        }),
                        this.getSelectBasic({
                            'name': 'boxStyle',
                            'label': 'Style',
                            'width': '182px',
                            'value': this.model.get('boxStyle'),
                            'options': this.getGradientOptions()
                        }),
                        {
                            'type': 'colorPicker',
                            'name': 'color',
                            'label': 'Color',
                            'value': this.model.get('color')
                        },
                        this.getOpacityInput(),
                        {
                            'type': 'checkbox',
                            'name': 'teamColors',
                            'boxLabel': 'Use team colors',
                            'checked': this.model.get('teamColors')
                        },
                        {
                            'type': 'checkbox',
                            'name': 'teamColors',
                            'boxLabel': 'Use team colors',
                            'checked': this.model.get('teamColors')
                        }
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }

    },

    'chatArea': {
        createControls: function(form) {
            var markup = [
                {
                    type: 'fieldset',
                    label: this.model.get('label') + ' Properties',
                    items: [
                        this.getWidthInput(),
                        this.getHeightInput(),
                        this.getSelectBasic({
                            'name': 'borderRadius',
                            'label': 'Rounded',
                            'value': this.model.get('borderRadius'),
                            'options': this.getBorderRadiusOptions()
                        }),
                        this.getSelectBasic({
                            'name': 'boxStyle',
                            'label': 'Style',
                            'width': '182px',
                            'value': this.model.get('boxStyle'),
                            'options': this.getGradientOptions()
                        }),
                        {
                            'type': 'colorPicker',
                            'name': 'color',
                            'label': 'Color',
                            'value': this.model.get('color')
                        },
                        this.getOpacityInput(),
                        {
                            'type': 'checkbox',
                            'name': 'showChat',
                            'boxLabel': 'Show chat',
                            'checked': this.model.get('showChat')
                        }
                    ]
                },
                {
                    type: 'fieldset',
                    label: 'Actions',
                    items: [
                        {
                            'type': 'arrangeControl',
                            'label': 'Arrange'
                        },
                        {
                            'type': 'alignControl',
                            'label': 'Allign'
                        }
                    ]
                }
            ]
            var fragment = this.buildForm(markup);

            // call this in the end
            form.get(0).appendChild(fragment);
        }

    }
};

