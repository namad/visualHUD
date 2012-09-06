visualHUD.Libs.selectionManagerInterface = {
    selection: [],

    _deselectBinded: false,
    _selectionDisabled: false,

    select: function(element, multiple) {
        var view;

        if(element instanceof visualHUD.Views.HUDItem) {
            view = element;
        }
        else {
            view = $(element).data('HUDItem');
        }

        var inGroup = view.getGroup();
        var alreadyPresent = this.isSelected(view);

        if(this._selectionDisabled == false) {
            if(multiple == false) {
                this.deselect();
            }
            this.selection.push(view);
            view.$el.addClass('selected');

            (inGroup == null) && this.fireEvent('selectionchange', [this, this.getSelection()]);

            if(this._deselectBinded == false) {
                $('body').bind('click.deselect', visualHUD.Function.bind(this.clickDeselect, this));
                this._deselectBinded = true;
            }
        }

        if(inGroup) {
            this.selectByGroup(inGroup);
        }
    },

    isSelected: function(element) {
        return _.include(this.selection, element);
    },

    deselect: function() {
        _.each(this.selection, function(view) {
            view.$el.removeClass('selected');
        });

        this.selection.length = 0;
        this.fireEvent('selectionchange', [this, this.getSelection()]);

        if(this._deselectBinded == true) {
            $('body').unbind('click.deselect');
            this._deselectBinded = false;
        }
    },

    selectAll: function() {
        var me = this;
        this.$el.find('div.' + visualHUD.Views.HUDItem.prototype.className).each(function() {
            me.select(this, true);
        });
    },

    selectByGroup: function(groupName) {
        var me = this;
        this.$el.find('div.' + visualHUD.Views.HUDItem.prototype.className).each(function() {
            var view = $(this).data('HUDItem'),
                inGroup = view.getGroup(),
                alreadyPresent = _.include(me.selection, view)

            if(inGroup == groupName && alreadyPresent == false) {
                me.selection.push(view);
                view.$el.addClass('selected');
            }
        });

        this.fireEvent('selectionchange', [this, this.getSelection()]);
    },

    getSelection: function() {
        return this.selection;
    },

    disableSelection: function() {
        this._selectionDisabled = true;
    },

    enableSelection: function() {
        this._selectionDisabled = false;
    },

    clickDeselect: function(event) {
        var target = $(event.target);
        var hudItem = target.closest('div.' + visualHUD.Views.HUDItem.prototype.className, this.$el);
        var sidebar = target.closest('.vh-viewport-sidebar', document.body);

        if(hudItem.length == 0 && sidebar.length == 0) {
            this.deselect();
        }
    }
};

