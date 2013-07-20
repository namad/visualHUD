visualHUD.Views.windows.Confirm = visualHUD.Views.WindowBase.extend({
    mixin: [
        'visualHUD.Libs.formControlsBuilder',
        'visualHUD.Libs.formBuilderMixin.base'
    ],
    events: {
        'click button[name=confirm]': 'yes',
        'click button[name=cancel]': 'no'
    },
    html: ([
        '<div class="mb-20" id="messageContainer">',
        '</div>'
    ]).join(''),

    defaults: {
        width: 400,
        height: 'auto',
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
    },

    init: function () {

        var form = this.buildForm([
            {
                type: 'form',
                cssClass: 'mwin-form',
                id: 'importHUDForm',
                items: [
                    {
                        type: 'container',
                        name: 'customImage',
                        label: null,
                        text: 'Choose image'
                    },
                    {
                        type: 'toolbar',
                        items: [
                            {
                                type: 'button',
                                text: this.options.confirmButtonText,
                                role: 'main',
                                name: 'confirm'
                            },
                            {
                                type: 'button',
                                text: this.options.cancelButtonText,
                                role: 'aux',
                                name: 'cancel'
                            }
                        ]
                    }
                ]
            }
        ]);

        this.$content.get(0).appendChild(form);
        var $messageContainer = this.$content.find('#messageContainer');

        $messageContainer.html(this.options.confirm);

        this.on('hide', this.destroy, this);

        this.on('show', function() {
            this.$content.find('button[name=confirm]').focus();
        }, this);
    },

    yes: function () {
        this.options.handler.apply(this.options.scope || this, [true]);
        this.hide();
    },

    no: function () {
        this.options.handler.apply(this.options.scope || this, [false]);
        this.hide();
    },

    destroy: function() {
        this.$el.remove();
    }
});

