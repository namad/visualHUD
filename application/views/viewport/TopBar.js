visualHUD.Views.viewport.TopBar = Backbone.View.extend({
    tagName: 'div',
    className: 'app-topbar',
    htmlTpl: [
        '<div class="app-logo popover-action" data-popover="logo"><span>VisualHUD</span></div>',
        '<div class="toolbar-main global-actions">',
            '<button value="downloadHUD" class="button" id="downloadButton"><span class="w-icon download">Download</span></button>',
            '<button value="loadPreset" class="button-aux" id="loadPresetButton"><span class="w-icon load">Import</span></button>',
        '</div>',
        '<div class="toolbar-main hud-actions">',
            '<button value="undoUpdate" class="button-aux" data-tooltip="Undo"><span class="w-icon icon-undo">Undo</span></button>',
            '<button value="deleteSelected" class="button-aux single-select-button" data-tooltip="Delete"><span class="w-icon icon-trash">Delete</span></button>',
            '<button value="cloneSelected" class="button-aux single-select-button" data-tooltip="Clone"><span class="w-icon icon-clone">Clone</span></button>',
            '<button value="groupSelected" class="button-aux multi-select-button" data-tooltip="Group"><span class="w-icon icon-group">Group</span></button>',
            '<button value="alignSelected" class="button-aux single-select-button popover-action"  data-tooltip="Align" data-popover="align"><span class="w-carret w-icon icon-align">Align</span></button>',
        '</div>',        
        '<div class="app-stats">',
        '<span class="counter" id="downloadCounterText">0</span>',
        '<span class="hint">custom HUDs <br />have been created so far</span>',
        '</div>',

        '<div class="toolbar-aux global-actions">',
        '<button value="sendFeedback" class="button-aux" id="reportBugButton"><span class="w-icon icon-feedback">Feedback</span></button>',
        '</div>'
    ],

    events: {
        'click .popover-action': 'showPopover',
        'click .global-actions button': 'onGlobalActionButtonClick',
        'click .hud-actions button': 'onHUDActionButtonClick'
    },
    initialize: function() {
        this.$el.append(this.htmlTpl.join(''));
        this.$('#downloadCounterText').text(parseInt(visualHUD.dlCount, 10) || 0);

        this.buttons = {
            download: this.$el.find('#downloadButton'),
            load: this.$el.find('#loadPresetButton'),
            restart: this.$el.find('#restartAppButton'),
            report: this.$el.find('#reportBugButton'),
            singleSelectActions: this.$el.find('.single-select-button'),
            multiSelectActions: this.$el.find('.multi-select-button')
        }
        
        this.updateToolbarButtonsState(0);
        this.setupAlignPopOver();
        //this.setupFeedbackPopOver();
        this.setupLogoPopOver();
        
    },

    setupAlignPopOver: function() {
        var $button = this.$el.find('button[value=alignSelected]');

        this.alignPopover = new visualHUD.Widgets.PopOver({
            cls: 'align-popover',
            events: {},
            html: visualHUD.Libs.formControlsBuilder.getTemplateByType('alignControl'),
            position: 'bottom-center',
            title: 'Align selected items',
            scope: this,
            show: function() {
                $button.addClass('active');
                visualHUD.toolTips.disable();
            },
            hide: function() {
                $button.removeClass('active');
                visualHUD.toolTips.enable();
            }
        });

        this.alignPopover.$el.on('click', '.align-controls li', visualHUD.Function.bind(this.fireAlignAction, this));
        this.alignPopover.$el.on('mouseenter', '.align-popover li', false);
    },

    setupLogoPopOver: function() {
        var $logo = this.$el.find('.app-logo');
        this.logoPopover = new visualHUD.Widgets.PopOver({
            cls: 'logo-popover',
            cancelEventBubbling: false,
            html: ([
                '<p>Simple yet powerful <a href="http://www.quakelive.com" target="_blank">Quake Live</a> online HUD builder. Simply drag and drop HUD elements to create completely custom Quake Live HUD</p>',
                '<p>New to visualHUD? Check these useful links!</p>',
                '<ul>',
                    '<li><a href="help/#videos" target="help">Video Tutorials</a></li>',
                    '<li><a href="help/#hotkeys" target="help">Hot Keys Cheat Sheet</a></li>',
                    '<li><a href="help/#credits" target="help">Credits</a></li>',
                '</ul>'
            ]).join(''),
            position: 'bottom-center',
            title: 'visualHUD',
            scope: this,
            show: function() {
                $logo.addClass('active');
            },
            hide: function() {
                $logo.removeClass('active');
            }
        });
    },

    setupFeedbackPopOver: function() {
        var $button = this.$el.find('button[value=feedback]');
        this.feedbackPopover = new visualHUD.Widgets.PopOver({
            cls: 'feedback-popover',
            cancelEventBubbling: false,
            html: ([
                '<ul class="popover-menu">',
                '<li><span class="icon icon-feedback"></span><a href="#" class="item-name" data-action="send-feedback">Give a feedback</a></li>',
                '<li><span class="icon icon-bug"></span><a href="#" class="item-name" data-action="report-bug">Report a bug</a></li>',
                '</ul>'
            ]).join(''),
            position: 'bottom-right',
            title: 'Feedback',
            scope: this,
            show: function() {
                $button.addClass('active');
            },
            hide: function() {
                $button.removeClass('active');
            }
        });

        this.feedbackPopover.$el.on('click', '.popover-menu a', visualHUD.Function.bind(this.fireFeedbackAction, this));
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

    showPopover: function(event) {
        var target = $(event.currentTarget),
            name = target.data('popover'),
            popoverComp = this[name + 'Popover'];

        popoverComp.visible ? popoverComp.hide() : popoverComp.show(target);

        return false;
    },

    fireAlignAction: function(event) {
        var control = $(event.currentTarget),
            action = control.data('action');

        this.fireEvent('align.action', [action]);
        //this.alignPopover.hide();

        return false;
    },

    fireFeedbackAction: function(event) {
        var control = $(event.currentTarget),
            action = control.data('action');

        this.fireEvent('feedback.action', [action]);
    },

    updateToolbarButtonsState: function(selectionLength) {
        this.buttons.singleSelectActions.attr('disabled', selectionLength == 0);
        this.buttons.multiSelectActions.attr('disabled', selectionLength <= 1);
    }
});

