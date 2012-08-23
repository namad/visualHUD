visualHUD.Views.LoadWindow = visualHUD.Views.Window.extend({
    events: {
        'click button[name=downloadHUD]': 'beginDownload',
        'click button[name=cancel]': 'hide',
        'change input[name=hud_name]': 'validateName',
        'keyup input[name=hud_name]': 'validateName'
    },
    initialize: function() {
        this.options.html = ([
            '<div class="mb-10">',
                '<p>You can load predefined HUD or import custom HUD previously build with Visual HUD application. In order to import custom HUD, select appropriate option from drop down below and click [Load] button.</p>',
            '</div>',

            '<form class="mwin-form" id="loadHUDForm">',
                '<label class="check-label"><input type="radiobutton" name="import" checked="checked" value="custom"><span class="label">Previously Downloaded</span></label>',
                '<label class="check-label"><input type="radiobutton" name="import" value="preset"><span class="label">Predefined HUD</span></label>',

                '<div class="" id="customForm">',
                '</div>',
                '<div class="" id="presetForm">',
                '</div>',

                '<label class="f-row">',
                    '<span class="f-label">HUD name:</span>',
                    '<span class="f-inputs"><input type="text" name="hud_name" size="32" maxlength="128"></span>',
                    '<div class="f-hint">HUD name should be at least 3 characters length and contain only letters and numbers</div>',
                '</label>',
                '<div class="f-row">',
                    '<button type="submit" name="downloadHUD" value="Load" class="button-main mr-5"><span class="w-icon download">Download</span></button>',
                    '<button type="button" name="cancel" value="Cancel" class="button-aux"><span>Cancel</span></button>',
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

