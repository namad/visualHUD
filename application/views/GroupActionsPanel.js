visualHUD.view.GroupActionsPanel = Backbone.View.extend({
    tagName: 'div',
    className: 'c-block',
    collection: null,
    htmlTpl: [
        '<div class="mb-15">Align multiple elements.</div>',
        '<ul class="library-items align-controls icons-24px clearfloat" id="alignControls">',
            '<li class="align-top" data-action="top"><span class="item-name">Align top edges</span></li>',
            '<li class="align-vertical" data-action="vertical"><span class="item-name">Align vertical centers</span></li>',
            '<li class="align-bottom" data-action="bottom"><span class="item-name">Align bottom edges</span></li>',
            '<li class="align-left" data-action="left"><span class="item-name">Align left edges</span></li>',
            '<li class="align-horizontal" data-action="horizontal"><span class="item-name">Align horizontal centers</span></li>',
            '<li class="align-right" data-action="right"><span class="item-name">Align right edges</span></li>',
        '</ul>',
        '<ul class="library-items arrange-controls icons-24px clearfloat hidden" id="arrangeControls">',
            '<li class="bring-front" data-action="arrangeFront"><span class="item-name">Bring to front <small>(CTRL + SHIFT + UP)</small></span></li>',
            '<li class="send-back" data-action="arrangeBack"><span class="item-name">Send to back <small>(CTRL + SHIFT + DOWN)</small></span></li>',
            '<li class="bring-forward" data-action="arrangeForward"><span class="item-name">Bring forward <small>(CTRL + UP)</small></span></li>',
            '<li class="send-backward" data-action="arrangeBackward"><span class="item-name">Send backward <small>(CTRL + DOWN)</small></span></li>',
        '</ul>',
        '<div class="mt-20 group-actions-panel">',
            '<button value="deleteSelectedItems" class="button-main delete-items"><span class="w-icon trash">Delete selected items</span></button>',
        '</div>'
    ],

    events: {
        'click .align-controls li': 'alignItems',
        'click .arrange-controls li': 'arrangeItems',
        'click button': 'groupActions'
    },

    initialize: function() {
        var stageControlsHTML = [];
        this.hide();
        this.$el.append(this.htmlTpl.join(''));
    },

    render: function(viewport) {
        this.viewport = viewport;
        this.$el.appendTo(viewport.$rightArea);
    },

    alignItems: function(event) {
        var control = $(event.currentTarget),
            action = control.data('action');

        this.fireEvent('align.action', [action]);
        return false;
    },

    arrangeItems: function(event) {
        var control = $(event.currentTarget),
            action = control.data('action');

        this.fireEvent('arrange.action', [action]);
        return false;
    },

    groupActions: function(event) {
        var action = event.currentTarget.value;
        this.fireEvent('group.action', [action]);
        return false;
    }

});