visualHUD.Views.windows.Download = visualHUD.Views.WindowBase.extend({
    mixin: [
        'visualHUD.Libs.formControlsBuilder',
        'visualHUD.Libs.formBuilderMixin.base'
    ],
    events: {
        'click button[name=downloadHUD]': 'beginDownload',
        'click button[name=cancel]': 'hide',
        'change input[name=hud_name]': 'validateName',
        'keyup input[name=hud_name]': 'validateNameBuffered'
    },
    html: ([
        '<div class="mb-20">',
        '<p>You are about to download your custom HUD. Please, name it and click [Download] button. </p>',
        'Don\'t know how to use a custom HUD? Check out holysh1t\'s custom <a href="http://www.holysh1t.net/quakelive-custom-hud-install-guide/" target="_blank">HUD install guide</a>.',
        '</div>'
    ]).join(''),

    init: function() {

        var form = this.buildForm([
            {
                type: 'form',
                cssClass: 'mwin-form',
                id: 'downloadHUDForm',
                action: visualHUD.ACTION_DOWNLOAD_HUD,
                method: 'post',
                items: [
                    {
                        type: 'textbox',
                        name: 'hud_data',
                        inputType: 'hidden',
                        wrap: false
                    },
                    {
                        type: 'textbox',
                        name: 'hud_name',
                        label: 'HUD name',
                        size: 32,
                        maxlength: 128,
                        value: '',
                        hint: 'HUD name should be at least 3 characters length and contain only letters and numbers'
                    },
                    {
                        type: 'checkbox',
                        name: 'save_preset',
                        tooltip: 'All custom presets are available from the Import dialog',
                        boxLabel: 'Save as custom preset',
                        checked: true
                    },
                    {
                        type: 'toolbar',
                        cssClass: 'pt-10',
                        items: [
                            {
                                type: 'button',
                                text: 'Download',
                                icon: 'download',
                                role: 'main',
                                action: 'submit',
                                name: 'downloadHUD'
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
        
        this.validateNameBuffered = visualHUD.Function.createBuffered(this.validateName, 200, this);
 
        this.on('show', this.setFocus, this);
        this.on('cancel', this.hide, this);
    },

    setHUDName: function(name) {
        if(name) {
            this.$el.find('input[name=hud_name]').val(name);
        }
        return this;
    },
    
    beginDownload: function() {
        try {
            var name = this.$el.find('input[name=hud_name]').val(),
                data = this.collection.serialize(),
                output = {
                    name: name,
                    items: data
                };

            this.setHUDData(output);

            this.on('download', [this, output]);
            this.hide();
        }
        catch(e) {
            throw(e.message);
            return false;
        }
    },

    setFocus: function() {
        this.$el.find('input[name=hud_name]').focus();
        this.validateName();
    },

    validateName: function() {
        var textbox = this.$textbox || this.$content.find('input[name=hud_name]').get(0);
        var submitButton = this.$submitButton || this.$content.find('button[name=downloadHUD]');

        this.$submitButton = submitButton;
        this.$textbox = textbox;

        /*
            reg including spaces: /^[aA-zZ_\-\s0-9\.]{3,128}$/
         */
        var isValid = textbox.value.length && (/^[aA-zZ_\-0-9\.]{3,128}$/).test(textbox.value);
        submitButton.attr('disabled', isValid == false);
    },

    getForm: function() {
        var form = this.$form;

        if(form == undefined) {
            this.$form = form = this.$('#downloadHUDForm');
        }

        return form;
    },

    setHUDData: function(data) {
        if(_.isString(data) == false) {
            data = JSON.stringify(data)
        }
        this.$el.find('input[name=hud_data]').val(data);
    }
});

