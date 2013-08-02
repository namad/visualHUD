visualHUD.Views.windows.ImportImage = visualHUD.Views.WindowBase.extend({
    mixin: [
        'visualHUD.Libs.formControlsBuilder',
        'visualHUD.Libs.formBuilderMixin.base'
    ],
    events: {
        'click button[name=setCustomImage]': 'setImage',
        'click button[name=cancel]': 'hide'
    },
    html: ([
        '<div class="mb-20">',
        'You can use images up to 300Kb in size, supported formats are JPEGs, GIFs and PNGs',
        '</div>'
    ]).join(''),

    init: function () {
        var form = this.buildForm([
            {
                type: 'form',
                cssClass: 'mwin-form',
                id: 'importHUDForm',
                items: [
                    {
                        type: 'fileInput',
                        name: 'customImage',
                        label: null,
                        accept: '.gif, .png, .jpg, .jpeg',
                        text: 'Choose image'
                    },
                    {
                        type: 'toolbar',
                        items: [
                            {
                                type: 'button',
                                text: 'Set Custom Background',
                                role: 'main',
                                name: 'setCustomImage'
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
        this.$submitButton = this.$content.find('button[name=setCustomImage]').attr('disabled', 'disabled');
        this.$form = this.$content.find('form');
        this.$fileInput = this.$content.find('input[name=customImage]');
        this.$fileInput.bind('change', visualHUD.Function.bind(this.handleFileSelect, this));

        this.on('hide', this.reset, this);
    },

    handleFileSelect: function (event) {
        var file = event.target.files[0];

        if (file) {
            if (visualHUD.Libs.importHelper.checkImageType(file) == false) {
                return this.reset();
            }

            if (visualHUD.Libs.importHelper.checkImageSize(file) == false) {
                return this.reset();
            }


            var reader = new FileReader();
            reader.onload = visualHUD.Function.bind(this.onLoad, this, [file], true);
            reader.readAsDataURL(file);
        }
        else {
            this.$submitButton.attr('disabled', true);
        }
    },

    onLoad: function (event, file) {
        this.$submitButton.attr('disabled', false);
        this.src = event.target.result;
    },

    setImage: function () {
        if (this.src) {
            this.trigger('import', [this.src]);
            this.src = null;
            this.hide();
        }
    },

    reset: function () {
        this.$form.get(0).reset();
        this.$fileInput.trigger('change');
        this.$submitButton.attr('disabled', true);
        return true;
    }
});

