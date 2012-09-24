visualHUD.Views.windows.Feedback = visualHUD.Views.WindowBase.extend({
    mixin: [
        'visualHUD.Libs.formControlsBuilder',
        'visualHUD.Libs.formBuilderMixin.base'
    ],
    events: {
        'submit form': 'sendReport',
        'focus form': 'suppressValidation',
        'blur form': 'validate',
        'click button[name=cancel]': 'hide'
    },
    _html: ([
        '<div class="mb-20">',
        '<p>Want to help? Send as much details as you can, especially describing your actions. This way I can easely reproduce the problem and fix it. Here is an example of good bug report:</p>',
        '<blockquote>"I was clicking [Apply] button and get an error message."</blockquote>',
        '</div>'
    ]).join(''),

    init: function() {

        var form = this.buildForm([
            {
                type: 'form',
                cssClass: 'mwin-form',
                id: 'feedbackForm',
                action: visualHUD.ACTION_CONTACT,
                method: 'post',
                items: [
                    {
                        type: 'container',
                        cssClass: 'row-fluid',
                        items: [
                            {
                                type: 'textbox',
                                name: 'name',
                                cssClass: 'span-6',
                                required: true,
                                label: 'Your name',
                                size: 32,
                                maxlength: 128,
                                value: ''
                            },
                            {
                                type: 'textbox',
                                name: 'email',
                                inputType: 'email',
                                cssClass: 'span-6',
                                label: 'Email address',
                                size: 32,
                                maxlength: 128,
                                value: ''
                            },
                            {
                                type: 'textbox',
                                name: 'verify',
                                cssClass: 'hidden'
                            }
                        ]
                    },

                    {
                        type: 'textarea',
                        name: 'comments',
                        label: 'Message',
                        required: true,
                        rows: 5,
                        value: ''
                    },
                    {
                        type: 'toolbar',
                        cssClass: 'pt-10',
                        items: [
                            {
                                type: 'button',
                                text: 'Send',
                                role: 'main',
                                action: 'submit',
                                name: 'submit'
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
        this.$form = this.$('#feedbackForm');

        var form = this.$form.get(0);

        this.on('show', this.setFocus, this);
        this.on('cancel', this.hide, this);
        this.on('hide', this.reset, this);
    },

    validate: function(event) {
        var target = $(event.target);
        var validClsFn = 'addClass';

        if(target.get(0).validity.valid == true) {
            validClsFn = 'removeClass';
        }
        target[validClsFn]('invalid-field');
    },

    suppressValidation: function(event) {
        var target = $(event.target);
        target.removeClass('invalid-field');
    },

    reset: function() {
        this.$form.get(0).reset();
        this.$form.find('.invalid-field').removeClass('invalid-field');
    },

    sendReport: function(event) {
        var serial = this.$form.serializeArray();
        var reportData = [];
        var isBot = false;

        var submitButton =  this.$form.find('button[type=submit]').attr('disabled', true);

        $.each(serial, function(){
            if(this.name == 'verify' && this.value.length > 0) {
                isBot = true;
            }
            if(this.name == 'comments'){
                this.value += '\n---------------\n\n';
            }
        });

        if(isBot == false) {
            $.ajax({
                type: this.$form.get(0).method,
                url: this.$form.get(0).action,
                data: serial,
                complete: visualHUD.Function.bind(function(xhr, status, page, section){
                    var code = xhr.status,
                        html = xhr.responseText;

                    if(code == 200) {
                        this.hide();
                        visualHUD.growl.alert({
                            status: 'success',
                            title: 'Thanks, mate!',
                            message: 'Your message has been successfully sent.'
                        });
                    }
                    else {
                        this.trigger('update.error', xhr);
                    }

                    submitButton.attr('disabled', false);


                }, this)
            });
        }
        else {
            this.hide();
        }

        return false;
    },

    setFocus: function() {
        this.$el.find('input[name=name]').focus();
    }
});

