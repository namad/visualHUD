visualHUD.Views.GroupActionsPanel = Backbone.View.extend({
    tagName: 'div',
    className: 'sidebar-block group-actions',
    collection: null,

    events: {
        'click .align-controls li': 'alignItems',
        'click .group-action-controls li': 'groupActions'
    },

    initialize: function() {
        var defaultMixin = visualHUD.Libs.formBuilderMixin.getByType('base');
        // Mixin functionality goes from more generic (by type) to more specific (by name)
        _.extend(this, defaultMixin);
        //Mixin Form Controls Generator
        _.extend(this,visualHUD.Libs.formControlsBuilder);

        var stageControlsHTML = [];
        this.hide();
        var controls = this.buildForm([
            {
                type: 'fieldset',
                label: 'Multiple items actions',
                items: [
                    {
                        type: 'alignControl'
                    },
                    {
                        type: 'groupActionsControl'
                    }
                ]
            }
        ]);
        var form = $('<div class="app-form"></div>');
        form.get(0).appendChild(controls);

        this.$el.append(form);
    },

    render: function(viewport) {
        this.viewport = viewport;
        this.$el.appendTo(viewport.$sidebarArea);
    },

    alignItems: function(event) {
        var control = $(event.currentTarget),
            action = control.data('action');

        this.fireEvent('align.action', [action]);
        return false;
    },

    groupActions: function(event) {
        var control = $(event.currentTarget),
            action = control.data('action');

        this.fireEvent('group.action', [action]);
        return false;
    }

});

