visualHUD.Views.DownloadWindow = visualHUD.Views.Window.extend({
    mixin: [
        'visualHUD.Libs.formControlsBuilder',
        'visualHUD.Libs.formBuilderMixin.base'
    ],
    events: {
        'click button[name=downloadHUD]': 'beginDownload',
        'click button[name=cancel]': 'hide',
        'change input[name=hud_name]': 'validateName',
        'keyup input[name=hud_name]': 'validateName'
    },
    html: ([
        '<div class="mb-10">',
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
                action: 'download.php',
                method: 'post',
                items: [
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
                        type: 'toolbar',
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

        this.on('show', this.setFocus, this);
    },

    beginDownload: function() {
        this.fireEvent('download', [this]);
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

        var isValid = textbox.value.length && (/^[a-z_\-\s0-9\.]{3,128}$/).test(textbox.value);
        submitButton.attr('disabled', isValid == false);
    }
});

