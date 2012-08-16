visualHUD.Views.DownloadWindow = visualHUD.Views.Window.extend({
    events: {
        'click button[name=downloadHUD]': 'beginDownload',
        'click button[name=cancel]': 'hide',
        'change input[name=hud_name]': 'validateName',
        'keyup input[name=hud_name]': 'validateName'
    },
    initialize: function() {
        this.options.html = ([
            '<div class="mb-10">',
                '<p>You are about to download your custom HUD. Please, name it and click [Download] button. </p>',
                'Don\'t know how to use a custom HUD? Check out holysh1t\'s custom <a href="http://www.holysh1t.net/quakelive-custom-hud-install-guide/" target="_blank">HUD install guide</a>.',
            '</div>',

            '<form class="mwin-form" id="downloadHUDForm" action="download.php" method="post">',
                '<input type="hidden" name="hud_data" />',
                    '<label class="f-row">',
                        '<span class="f-label">HUD name:</span>',
                        '<span class="f-inputs"><input type="text" name="hud_name" size="32" maxlength="128"></span>',
                        '<div class="f-hint">HUD name should be at least 3 characters length and contain only letters and numbers</div>',
                    '</label>',
                    '<div class="f-row">',
                        '<button type="submit" name="downloadHUD" value="Load" class="button-main mr-5"><span class="w-icon download">Download</span></button>',
                        '<button type="button" name="cancel" value="Cancel"><span>Cancel</span></button>',
                    '</div>',
            '</form>'
        ]).join('');

        this.on('show', this.setFocus, this);
        this.render();
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

