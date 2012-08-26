visualHUD.Views.LoadWindow = visualHUD.Views.Window.extend({
    mixin: [
        'visualHUD.Libs.formControlsBuilder',
        'visualHUD.Libs.formBuilderMixin.base'
    ],
    events: {
        'click button[name=loadHUD]': 'loadHUD',
        'click button[name=cancel]': 'hide',
        'click input[value=custom]': 'showCustomHUDControl',
        'click input[value=predefined]': 'showPredefinedHUDControl',
        'keyup textarea[name=hudJSON]': 'validateHUDJSON'
    },
    html: ([
        '<div class="mb-20">',
        'You can load predefined HUD or import custom HUD previously build with Visual HUD application. In order to import custom HUD, select appropriate option from drop down below and click [Load] button.',
        '</div>'
    ]).join(''),

    init: function() {
        var form = this.buildForm([
            {
                type: 'form',
                cssClass: 'mwin-form',
                id: 'importHUDForm',
                items: [
                    {
                        type: 'radiobuttonGroup',
                        layout: 'inline',
                        label: 'Import:',
                        options: [
                            {
                                name: 'presetType',
                                value: 'custom',
                                boxLabel: 'Custom HUD',
                                checked: true
                            },
                            {
                                name: 'presetType',
                                value: 'predefined',
                                boxLabel: 'Predefined HUD'
                            }
                        ]
                    },
                    {
                        type: 'select',
                        cssClass: 'hidden',
                        id: 'predefinedHUDControl',
                        name: 'presetName',
                        label: null,
                        valueField: 'id',
                        displayField: 'name',
                        width: null,
                        collection: this.options.presetCollection
                    },
                    {
                        type: 'textarea',
                        id: 'customHUDControl',
                        name: 'hudJSON',
                        label: null,
                        rows: 10,
                        hint: 'Custom HUD code can be found at *.vhud file. <a href="http://visualhud.pk69.com/help/import.html" target="_blank">Learn more</a>'
                    },
                    {
                        type: 'toolbar',
                        items: [
                            {
                                type: 'button',
                                text: 'Load HUD',
                                icon: 'load',
                                role: 'main',
                                name: 'loadHUD'
                            },
                            {
                                type: 'button',
                                text: 'Cancel',
                                role: 'aux',
                                name: 'cancel'
                            }
                        ]
                    }
                ]
            }
        ]);

        this.$content.get(0).appendChild(form);
        this.$content.find('form').bind('change', visualHUD.Function.bind(this.validateHUDJSON, this));

        this.on('show', this.validateHUDJSON, this);
    },

    showCustomHUDControl: function() {
        var customHUDControl = this.$customHUDControl || this.$('#customHUDControl');
        var predefinedHUDControl = this.$predefinedHUDControl || this.$('#predefinedHUDControl');

        this.$customHUDControl = customHUDControl.removeClass('hidden');
        this.$predefinedHUDControl = predefinedHUDControl.addClass('hidden');

        this.reposition();

        this.$el.find('[name=hudJSON]').focus().select();
    },

    showPredefinedHUDControl: function() {
        var customHUDControl = this.$customHUDControl || this.$('#customHUDControl');
        var predefinedHUDControl = this.$predefinedHUDControl || this.$('#predefinedHUDControl');

        this.$customHUDControl = customHUDControl.addClass('hidden');
        this.$predefinedHUDControl = predefinedHUDControl.removeClass('hidden');

        this.reposition();

        this.$el.find('[name=presetName]').focus();
    },

    validateHUDJSON: function() {
        var textbox = this.$textarea || this.$content.find('[name=hudJSON]').get(0);
        var isCustomPreset = this.$content.find('[name=presetType][value=custom]').get(0).checked;
        var submitButton = this.$submitButton || this.$content.find('button[name=loadHUD]');

        this.$submitButton = submitButton;
        this.$textbox = textbox;

        var isValid = !isCustomPreset;

        try {
            var data = JSON.parse(textbox.value);
            isValid = _.isArray(data) && data.length;
        }
        catch(e) {
        }
        submitButton.attr('disabled', isValid == false);
    },

    loadHUD: function() {
        var values = this.$('#importHUDForm').serializeForm(),
            json, data;

        switch(values.presetType) {
            case 'custom': {
                data = values.hudJSON;
                break;
            }
            case 'predefined': {
                data = this.options.presetCollection.get(values.presetName).get('preset');
                break;
            }
        }

        if(data && data.length) {
            this.fireEvent('load', [data]);
            this.hide();
        }
    }
});

