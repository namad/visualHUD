visualHUD.Views.ImportImageWindow = visualHUD.Views.Window.extend({
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

    init: function() {
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

    handleFileSelect: function(event) {
        var file = event.target.files[0];

        if(file) {
            if (!file.type.match('image.*')){
                visualHUD.growl.alert({
                    status: 'warning',
                    title: 'Unsupported file detected',
                    message: _.template(visualHUD.messages.unsupportedImageFormat, {
                        imageType: file.type || 'unknown'
                    })
                });
                return this.reset();
            }

            if (file.size >= visualHUD.MAX_BACKGROUND_SIZE){
                visualHUD.growl.alert({
                    status: 'warning',
                    title: 'Maximum file size exceeded',
                    message: _.template(visualHUD.messages.largeImageWarning, {
                        imageSize: Math.floor(file.size/1024) + 'kb',
                        maxSize: Math.floor(visualHUD.MAX_BACKGROUND_SIZE / 1024) + 'kb'
                    })
                });
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

    onLoad: function(event, file) {
        this.$submitButton.attr('disabled', false);
        this.src = event.target.result;
    },

    setImage: function() {
        if(this.src) {
            this.fireEvent('import', [this.src]);
            this.src = null;
            this.hide();
        }
    },

    reset: function() {
        this.$form.get(0).reset();
        this.$fileInput.trigger('change');
        this.$submitButton.attr('disabled', true);
        return true;
    }
});

