visualHUD.Views.windows.ImportHUD = visualHUD.Views.WindowBase.extend({
    mixin: [
        'visualHUD.Libs.formControlsBuilder',
        'visualHUD.Libs.formBuilderMixin.base'
    ],
    events: {
        'click button[name=loadHUD]': 'loadHUD',
        'click button[name=cancel]': 'hide',
        'click button[name=downloadPresets]': 'downloadPresets',
        'keyup textarea[name=hud_json]': 'validateHUDJsonBuffered',
        'keyup input[name=preset_filter]': 'filterPresetsBuffered',
        'change input[name=preset_filter]': 'filterPresets',
        'change form': 'updateFormStatus'
    },
    html: ([
        '<div class="mb-20">',
        'You can load predefined HUD or import custom HUD previously build with Visual HUD application. In order to import custom HUD, select appropriate option from drop down below and click [Load] button.',
        '</div>'
    ]).join(''),

    html: '',
    
    init: function() {
        this.createDlPresetForm();
        this.createImportForm();
        this.bindExtraEvents();

        this.customHUDPresetsList = this.$('#customHUDList').data('component');
    },

    bindExtraEvents: function() {
        this.validateHUDJsonBuffered = visualHUD.Function.createBuffered(this.validateHUDJson, 200, this);
        this.filterPresetsBuffered = visualHUD.Function.createBuffered(this.filterPresets, 200, this);

        var onListUpdateBuffered = visualHUD.Function.createBuffered(this.onListUpdate, 250, this);
        this.options.customPresetsCollection.on('add', onListUpdateBuffered);
        this.options.customPresetsCollection.on('remove', onListUpdateBuffered);
        this.options.customPresetsCollection.on('all', this.setDlPresetButtonState, this);

        var focusField = this.$el.find('[name=preset_filter]').get(0);

        this.on('show', focusField.focus, focusField);
        this.on('show', this.validateHUDJson, this);

        this.on('hide', this.reset, this);
        this.on('load', this.hide, this);
        this.on('cancel', this.hide, this);
    },

    importPredefinedHUD: function(boundList, element, model, event) {
        if(model == undefined) {
            this.$content.find('[name=presetType][value=custom]').trigger('click', [true]);
            return false;
        }

        var actionElement = $(event.target).closest('li.action', element);

        if(actionElement.length) {
            var action = actionElement.data('action');
            switch(action) {
                case 'delete': {
                    boundList.collection.remove(model);
                    break;
                }
                case 'download':{
                    this.fireEvent('download.preset', [model.attributes]);
                    break;
                }
            }
        }
        else {
            this.fireEvent('load', [model.attributes]);
        }
    },

    toggleNameField: function(state) {
        var nameField = this.$nameField || this.$('#HUDNameTextbox');
            
        if(state) {
            this.$nameField = nameField.removeClass('hidden');
            nameField.find('input').val('').get(0).focus();
        }
        else {
            this.$nameField = nameField.addClass('hidden');
            nameField.find('input').val('');
        }
        
        this.reposition();
    },
    
    showCustomHUDControl: function() {
        var customHUDControl = this.$customHUDControl || this.$('#customHUDControl');
        var predefinedHUDControl = this.$predefinedHUDControl || this.$('#predefinedHUDControl');
        var customHUDPresets = this.$customHUDPresets || this.$('#customHUDPresets');

        this.$customHUDControl = customHUDControl.removeClass('hidden');
        this.$predefinedHUDControl = predefinedHUDControl.addClass('hidden');
        this.$customHUDPresets = customHUDPresets.addClass('hidden');

        this.reposition();

        this.$el.find('[name=hud_json]').focus().select();
    },

    showPredefinedHUDControl: function() {
        var customHUDControl = this.$customHUDControl || this.$('#customHUDControl');
        var predefinedHUDControl = this.$predefinedHUDControl || this.$('#predefinedHUDControl');
        var customHUDPresets = this.$customHUDPresets || this.$('#customHUDPresets');

        this.$customHUDControl = customHUDControl.addClass('hidden');
        this.$predefinedHUDControl = predefinedHUDControl.removeClass('hidden');
        this.$customHUDPresets = customHUDPresets.addClass('hidden');

        this.setDlPresetButtonState();
        this.reposition();
    },

    showCustomHUDPresets: function() {
        var customHUDControl = this.$customHUDControl || this.$('#customHUDControl');
        var predefinedHUDControl = this.$predefinedHUDControl || this.$('#predefinedHUDControl');
        var customHUDPresets = this.$customHUDPresets || this.$('#customHUDPresets');

        this.$customHUDControl = customHUDControl.addClass('hidden');
        this.$predefinedHUDControl = predefinedHUDControl.addClass('hidden');
        this.$customHUDPresets = customHUDPresets.removeClass('hidden');

        this.$el.find('[name=preset_filter]').focus();
       this.reposition();
    },

    validateHUDJson: function() {
        var textbox = this.$textarea || this.$content.find('[name=hud_json]').get(0);
        var checkedPresetOptions = this.$content.find('[name=presetType]:checked');
        var presetType = checkedPresetOptions.val();
        var submitButton = this.$submitButton || this.$content.find('button[name=loadHUD]');

        this.$submitButton = submitButton;
        this.$textbox = textbox;

        var isValid = false;

        if(presetType == 'custom') {
            try {
                var data = JSON.parse(textbox.value);
                if(_.isArray(data)) {
                    isValid = data.length;
                }
                else if(_.isObject(data)) {
                    isValid = data.items.length;
                    if(data.name) {
                        this.toggleNameField(true);
                        this.$el.find('[name=hud_name]').val(data.name);
                        this.$el.find('[name=save_preset]').attr('checked', true);
                    }
                }
            }
            catch(e) {
            }
        }

        submitButton.attr('disabled', isValid == false);
    },

    filterPresets: function(event) {
        var value = event.target.value,
            regex = new RegExp(value, 'gi');

        this.options.customPresetsCollection.each(function(model) {
            var el = this.customHUDPresetsList.getElementByModel(model);

            if(model.get('name').match(regex) == null) {
                el.hide()
            }
            else {
                el.show();
            }
        }, this);
    },

    updateFormStatus: function(event) {
        var element = $(event.currentTarget);
        var values = this.serializeForm();
        var name = event.target.name;
        
        switch(values[name]) {
            case 'custom': {
                this.showCustomHUDControl();
                break;
            }
            case 'predefined': {
                this.showPredefinedHUDControl();
                break;
            }
            case 'my': {
                this.showCustomHUDPresets();
                break;
            }
        }
        
        switch(name) {
            case 'save_preset': {
                this.toggleNameField(!!values[name]);
                break;
            }
        }

        this.validateHUDJson();
    },
    
    reset: function() {
        this.$content.find('form').get(0).reset();
        this.showCustomHUDPresets();
        this.toggleNameField(false);
    },

    cancel: function() {
        this.hide();
    },

    loadHUD: function() {
        var values = this.serializeForm(),
            json, data, name = values.hud_name

        switch(values.presetType) {
            case 'custom': {
                try {
                    data = JSON.parse(values.hud_json);
                }
                catch(e) {
                    visualHUD.growl.alert({
                        status: 'error',
                        title: 'Invalid HUD Preset',
                        message: visualHUD.messages.HUD_PARSE_ERROR
                    });
                }
                break;
            }
        }

        if(_.isArray(data) && data.length) {
            this.fireEvent('load', [{
                name: name,
                items: data
            }]);
        }
        else if(_.isObject(data) && data.items.length) {
            this.fireEvent('load', [data]);
        }
    },

    onListUpdate: function() {
        if(this.opened) {
            this.reposition();
        }
    },

    createImportForm: function() {
        var form = this.buildForm([
            {
                type: 'form',
                cssClass: 'mwin-form',
                id: 'importHUDForm',
                items: [
                    {
                        type: 'radiobuttonGroup',
                        layout: 'inline',
                        label: null,
                        options: [
                            {
                                name: 'presetType',
                                value: 'my',
                                boxLabel: 'From My HUDs collection',
                                checked: true
                            },
                            {
                                name: 'presetType',
                                value: 'custom',
                                boxLabel: 'Custom'
                            },
                            {
                                name: 'presetType',
                                value: 'predefined',
                                boxLabel: 'Predefined'
                            }
                        ]
                    },
                    {
                        type: 'container',
                        id: 'customHUDControl',
                        cssClass: 'hidden',
                        items: [
                            {
                                type: 'textarea',
                                name: 'hud_json',
                                label: '',
                                rows: 3,
                                hint: 'Custom HUD code can be found at *.vhud file. <a href="help/#import" target="help">Learn more</a>'
                            },
                            {
                                type: 'checkbox',
                                name: 'save_preset',
                                tooltip: 'Check this option if you want to be able edit this HUD later without importing code from external file',
                                boxLabel: 'Name preset to add it to My HUDs collection',
                                checked: false
                            },
                            {
                                type: 'textbox',
                                id: 'HUDNameTextbox',
                                cssClass: 'hidden',
                                name: 'hud_name',
                                label: '',
                                size: 32,
                                maxlength: 128,
                                value: ''
                            }
                        ]
                    },

                    {
                        type: 'container',
                        cssClass: 'hidden mb-10',
                        id: 'predefinedHUDControl',
                        items: {
                            type: 'component',
                            constructorName: 'visualHUD.Views.SystemHUDPresetList',
                            collection: this.options.presetCollection,
                            scope: this,
                            itemclick: this.importPredefinedHUD
                        }
                    },
                    {
                        type: 'container',
                        cssClass: 'mb-10 clearfloat',
                        id: 'customHUDPresets',
                        items: [
                            {
                                type: 'textbox',
                                label: null,
                                placeholder: 'Find preset',
                                name: 'preset_filter'
                            },
                            {
                                type: 'component',
                                constructorName: 'visualHUD.Views.CustomHUDPresetList',
                                id: 'customHUDList',
                                collection: this.options.customPresetsCollection,
                                scope: this,
                                itemclick: this.importPredefinedHUD
                            },
                            {
                                type: 'button',
                                cssClass: 'download-presets-button',
                                text: 'Download Presets',
                                name: 'downloadPresets'
                            }
                        ]
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
                                action: 'reset',
                                role: 'aux',
                                name: 'cancel'
                            }
                        ]
                    }
                ]
            }
        ]);
        this.$content.get(0).appendChild(form);
    },

    createDlPresetForm: function() {
        var form = this.buildForm([
            {
                type: 'form',
                cssClass: 'hidden',
                id: 'downloadPresetsForm',
                action: 'download_presets.php',
                method: 'post',
                items: [
                    {
                        type: 'textbox',
                        name: 'hud_data',
                        inputType: 'hidden',
                        wrap: false
                    }
                ]
            }
        ]);

        this.$content.get(0).appendChild(form);
    },
    setDlPresetButtonState: function() {
        this.$downloadPresetsButton = this.$downloadPresetsButton || this.$content.find('button.download-presets-button');
        var downloadPresetsButton = this.$downloadPresetsButton;
        var displayFn = this.options.customPresetsCollection.length == 0 ? 'hide' : 'show';
        downloadPresetsButton[displayFn]();

    },

    downloadPresets: function() {
        var data = this.options.customPresetsCollection.toJSON();
        this.$('#downloadPresetsForm').find('[name=hud_data]').val(JSON.stringify(data));
        this.$('#downloadPresetsForm').submit();
    }
});

