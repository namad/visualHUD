visualHUD.Views.TopBar = Backbone.View.extend({
    tagName: 'div',
    className: 'app-topbar',
    htmlTpl: [
        '<div class="app-logo"><span>VisualHUD</span></div>',
        '<div class="toolbar-main">',
        '<button value="downalodHUD" class="button-main" id="downloadButton"><span class="w-icon download">Download HUD</span></button>',
        '<button value="loadPreset" class="button-aux" id="loadPresetButton"><span class="w-icon load">Load Preset</span></button>',
        '<button value="restartApplication" class="button-aux" id="restartAppButton"><span class="w-icon restart">Restart</span></button>',
        '</div>',
        '<div class="app-stats">',
        '<span class="counter">0</span>',
        '<span class="hint">custom HUDs <br />have been created so far</span>',
        '</div>',

        '<div class="toolbar-aux">',
        '<button value="reportBug" class="button-aux" id="reportBugButton"><span class="w-icon report-bug">Report Bug</span></button>',
        '</div>'
    ],

    events: {
        'click button': 'onButtonClick'
    },
    initialize: function() {
        this.$el.append(this.htmlTpl.join(''));
        this.buttons = {
            download: this.$el.find('#downloadButton'),
            load: this.$el.find('#loadPresetButton'),
            restart: this.$el.find('#restartAppButton'),
            report: this.$el.find('#reportBugButton')
        }
    },

    render: function(viewport) {
        this.$el.appendTo(viewport.$topArea);
    },

    onButtonClick: function(event) {
        var action = event.currentTarget.value;
        this.fireEvent('toolbar.action', [action]);
    }
});

