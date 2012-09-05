visualHUD.Views.TopBar = Backbone.View.extend({
    tagName: 'div',
    className: 'app-topbar',
    htmlTpl: [
        '<div class="app-logo"><span>VisualHUD</span></div>',
        '<div class="toolbar-main global-actions">',
            '<button value="downloadHUD" class="button" id="downloadButton"><span class="w-icon download">Download HUD</span></button>',
            '<button value="loadPreset" class="button-aux" id="loadPresetButton"><span class="w-icon load">Import</span></button>',
            '<button value="restartApplication" class="button-aux" id="restartAppButton"><span class="w-icon restart">Restart</span></button>',
        '</div>',
        '<div class="toolbar-main hud-actions">',
            '<button value="undoUpdate" class="button-aux"><span class="w-icon undo">Undo</span></button>',
            '<button value="deleteSelected" class="button-aux single-select-button"><span class="w-icon trash">Delete</span></button>',
            '<button value="cloneSelected" class="button-aux single-select-button"><span class="w-icon plus">Clone</span></button>',
            '<button value="groupSelected" class="button-aux multi-select-button"><span class="w-icon group">Group</span></button>',
            '<button value="alignSelected" class="button-aux single-select-button"><span class="w-carret w-icon align">Align</span></button>',
        '</div>',        
        '<div class="app-stats">',
        '<span class="counter" id="downloadCounterText">0</span>',
        '<span class="hint">custom HUDs <br />have been created so far</span>',
        '</div>',

        '<div class="toolbar-aux">',
        '<button value="reportBug" class="button-aux" id="reportBugButton"><span class="w-icon report-bug">Report Bug</span></button>',
        '</div>'
    ],

    events: {
        'click .global-actions button': 'onGlobalActionButtonClick',
        'click .hud-actions button': 'onHUDActionButtonClick',
        'click button[value=alignSelected]': 'showAlignPopover'
    },
    initialize: function() {
        this.$el.append(this.htmlTpl.join(''));
        this.$('#downloadCounterText').text(visualHUD.dlCount);

        this.buttons = {
            download: this.$el.find('#downloadButton'),
            load: this.$el.find('#loadPresetButton'),
            restart: this.$el.find('#restartAppButton'),
            report: this.$el.find('#reportBugButton'),
            singleSelectActions: this.$el.find('.single-select-button'),
            multiSelectActions: this.$el.find('.multi-select-button')
        }
        
        this.updateToolbarButtonsState(0);
        
        this.alignPopoverTemplate = visualHUD.Libs.formControlsBuilder.getTemplateByType('alignControl');
        this.alignPopover = new visualHUD.Widgets.PopOver({
            cls: 'align-popover',
            events: {},
            html: visualHUD.Libs.formControlsBuilder.getTemplateByType('alignControl'),
            position: 'bottom-center',
            title: 'Align selected items',
            scope: this,
            show: function() {
                this.$el.find('button[value=alignSelected]').addClass('active');
            },
            hide: function() {
                this.$el.find('button[value=alignSelected]').removeClass('active');
            }
        });
        
        this.alignPopover.$el.on('click', '.align-controls li', visualHUD.Function.bind(this.fireAlignAction, this));
        this.alignPopover.$el.on('mouseenter', '.align-popover li', false);
    },

    render: function(viewport) {
        this.$el.appendTo(viewport.$topArea);
    },

    onGlobalActionButtonClick: function(event) {
        var action = event.currentTarget.value;
        this.fireEvent('toolbar.global:action', [action]);
    },
    
    onHUDActionButtonClick: function(event) {
        var action = event.currentTarget.value;
        this.fireEvent('toolbar.hud:action', [action]);
        
        return false;
    },
    
    showAlignPopover: function(event) {
        var button = $(event.currentTarget);
        
        this.alignPopover.visible ? this.alignPopover.hide() : this.alignPopover.show(button);
        
        return false;
    },
    
    fireAlignAction: function(event) {
        var control = $(event.currentTarget),
            action = control.data('action');

        this.fireEvent('align.action', [action]);
        this.alignPopover.hide();
    },
    
    updateToolbarButtonsState: function(selectionLength) {
        this.buttons.singleSelectActions.attr('disabled', selectionLength == 0);
        this.buttons.multiSelectActions.attr('disabled', selectionLength <= 1);
    }
});

