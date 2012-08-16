visualHUD.Libs.selectionManagerInterface = {
    selection: [],

    initializeSelectionManager: function() {
        var me = this;

        $('body').bind('click.deselect', function(event) {
            var target = $(event.target);
            var hudItem = target.closest('div.hud-item', me.$el);
            if(hudItem.length == 0) {
                me.deselect();
            }
        });

        return this;
    },

    select: function(element, multiple) {
        var view;

        if(element instanceof visualHUD.Views.HUDItem) {
            view = element;
        }
        else {
            view = $(element).data('HUDItem');
        }

        var alreadyPresent = _.include(this.selection, view);

        if(alreadyPresent == false) {
            if(multiple == false) {
                this.deselect();
            }
            this.selection.push(view);
            view.$el.addClass('selected');

            this.fireEvent('selectionchange', [this, this.getSelection()]);
        }
    },

    deselect: function() {
        _.each(this.selection, function(view) {
            view.$el.removeClass('selected');
        });

        this.selection.length = 0;
        this.fireEvent('selectionchange', [this, this.getSelection()]);
    },

    selectAll: function() {
        var me = this;
        this.$el.find('div.hud-item').each(function() {
            me.select(this, true);
        });
    },

    getSelection: function() {
        return this.selection;
    },

    preventDeselect: function() {
        this._selectionDisabled = true;
        this.selection.length = 0;
    },

    enableDeselect: function() {
        this._selectionDisabled = false;
    }
};

