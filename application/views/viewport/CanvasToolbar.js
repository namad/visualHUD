visualHUD.Views.viewport.CanvasToolbar = Backbone.View.extend({
    tagName: 'ul',
    className: 'app-toolbar',
    baseCls: 'root-item',
    menuStructure: [
        {
            text: 'Screenshot',
            title: 'Change location background',
            cls: 'rtl-item shot-toggle',
            counter: 'hidden',
            options: [
                {
                    name: 'canvasShot',
                    control: 'radio',
                    label: 'None',
                    value: 0
                },
                {
                    name: 'canvasShot',
                    control: 'radio',
                    label: 'Longest Yard',
                    value: 1
                },
                {
                    name: 'canvasShot',
                    control: 'radio',
                    label: 'Almost Lost',
                    value: 2
                },
                {
                    name: 'canvasShot',
                    control: 'radio',
                    label: 'Custom Background',
                    value: 3
                }
            ]
        },
        {
            text: 'Grid',
            title: 'Toggle grid',
            cls: 'rtl-item grid-toggle',
            counter: 'visible',
            options: [
                {
                    name: 'drawGrid',
                    control: 'radio',
                    label: 'Off',
                    value: 0
                },
                {
                    name: 'drawGrid',
                    control: 'radio',
                    label: '5px',
                    value: 5
                },
                {
                    name: 'drawGrid',
                    control: 'radio',
                    label: '10px',
                    value: 10
                }
            ]
        },
        {
            text: 'Snap',
            title: 'Snap element to grid',
            cls: 'rtl-item grid-snap',
            counter: 'visible',
            options: [
                {
                    name: 'snapGrid',
                    control: 'radio',
                    label: 'Off',
                    value: 0
                },
                {
                    name: 'snapGrid',
                    control: 'radio',
                    label: '5px',
                    value: 5
                },
                {
                    name: 'snapGrid',
                    control: 'radio',
                    label: '10px',
                    value: 10
                }
            ]
        },
        {
            text: 'Status',
            title: '',
            cls: 'player-status',
            counter: 'hidden',
            options: null
        },
        {
            text: 'HUD Extras',
            title: '',
            cls: 'hud-extras',
            counter: 'visible',
            options: [
                {
                    control: 'checkbox',
                    value: 1,
                    name: 'lagometr',
                    label: 'Lagometr'
                },
                {
                    control: 'checkbox',
                    value: 1,
                    name: 'speedometr',
                    label: 'Speedometr'
                },
                {
                    control: 'checkbox',
                    value: 1,
                    name: 'pickup',
                    label: 'Item Pickup'
                },
                {
                    control: 'checkbox',
                    value: 1,
                    name: 'recordingMessage',
                    label: 'Demo Recording Message'
                }
            ]
        },
        {
            text: 'Gun',
            title: '',
            cls: 'draw-gun',
            counter: 'visible',

            options: [
                {
                    name: 'drawGun',
                    control: 'radio',
                    label: 'Hidden',
                    value: 0
                },
                {
                    name: 'drawGun',
                    control: 'radio',
                    label: 'Right',
                    value: 1
                },
                {
                    name: 'drawGun',
                    control: 'radio',
                    label: 'Center',
                    value: 2
                }
            ]
        },
        {
            text: 'Weapon bar',
            title: '',
            cls: 'weapong-bar',
            counter: 'visible',
            options: [
                {
                    name: 'drawWeaponbar',
                    control: 'radio',
                    label: 'Hidden',
                    value: 0
                },
                {
                    name: 'drawWeaponbar',
                    control: 'radio',
                    label: 'Right',
                    value: 2
                },
                {
                    name: 'drawWeaponbar',
                    control: 'radio',
                    label: 'Left',
                    value: 1
                },
                {

                    name: 'drawWeaponbar',
                    control: 'radio',
                    label: 'Bottom',
                    value: 3
                },
                {
                    name: 'drawWeaponbar',
                    control: 'radio',
                    label: 'Q3A Style',
                    value: 4
                }
            ]
        },
        {
            text: 'Team overlay',
            title: '',
            cls: 'tm-overlay',
            counter: 'visible',
            options: [
                {
                    name: 'drawTeamoverlay',
                    control: 'radio',
                    label: 'Hidden',
                    value: 0
                },
                {
                    name: 'drawTeamoverlay',
                    control: 'radio',
                    label: 'Top',
                    value: 1
                },
                {
                    name: 'drawTeamoverlay',
                    control: 'radio',
                    label: 'Bottom',
                    value: 2
                }
            ]
        }
    ],
    events: {
        'click input': "changeCanvasOption",
        'change .player-status input[type=text]': "changeCanvasOption",
        'click .player-status form': 'stopPropagation',
        'click li.root-item ul': 'onSubmenuClick',
        'click li.root-item': 'onRootitemClick',
        'mouseover li.root-item ul': 'stopPropagation'
    },

    initialize: function() {
        this.tpl = [
            '<% _.each(items, function(item) { %>',
                '<li class="<%= baseCls %> <%= item.cls %>" data-tooltip="<%= item.title %>">',
                    '<span class="item-name"><%= item.text %></span>',
                    '<strong class="item-value <%= item.counter %>">0</strong>',
                    '<% if(item.options && item.options.length){ %>',
                        '<ul>',
                        '<% _.each(item.options, function(option) { %>',
                            '<li>',
                                '<label><input type="<%= option.control %>" name="<%= option.name %>" value="<%= option.value %>" /><span><%= option.label %></span></label>',
                            '</li>',
                        '<% }); %>',
                        '</ul>',
                    '<% }; %>',
                '</li>',
            '<% }); %>'
        ];

        this.menuStructure.splice(0,0,{
            text: 'View',
            title: 'Filter Elements by Game Type',
            cls: 'rtl-item gt-filter',
            counter: 'hidden',
            options: this.getGameTypeFilterOptions()
        });
    },

    getGameTypeFilterOptions: function() {
        var options = [];

        _.each(visualHUD.Libs.formBuilderMixin.getByName('base').getOwnerDrawOptions(), function(value, key) {
            options.push({
                name: 'ownerDrawFlag',
                control: 'radio',
                label: value,
                value: key
            });
        });

        return options;
    },

    render: function(viewport) {
        var tpl = _.template(this.tpl.join(''), {
                baseCls: this.baseCls,
                items: this.menuStructure
            });

        this.$el.append(tpl);

        this.renderPlayerStatusControls();
        this.renderImageImportMenuItem();

        var clientSettingsModel = this.options.clientSettingsModel;
        this.setClientSettings(clientSettingsModel.toJSON());

        this.$el.appendTo(viewport.$bottomtArea);
    },

    renderPlayerStatusControls: function() {
        var playerStatusListItem = this.$el.find('.player-status');
        var form = $('<form />');
        var clientSettingsModel = this.options.clientSettingsModel;
        var statusRangeInputs = [];

        statusRangeInputs.push(
            visualHUD.Libs.formControlsBuilder.createRangeInput({
                'type': 'rangeInput',
                'name': 'statusHealth',
                'label': 'Health',
                'min': 0,
                'max': 200,
                'value': clientSettingsModel.get('statusHealth')
           })
        );

        statusRangeInputs.push(
            visualHUD.Libs.formControlsBuilder.createRangeInput({
                'type': 'rangeInput',
                'name': 'statusArmor',
                'label': 'Armor',
                'min': 0,
                'max': 200,
                'value': clientSettingsModel.get('statusArmor')
            })
        );

        statusRangeInputs.push(
            visualHUD.Libs.formControlsBuilder.createRangeInput({
                'type': 'rangeInput',
                'name': 'statusAmmo',
                'label': 'Ammo',
                'min': 0,
                'max': 150,
                'value': clientSettingsModel.get('statusAmmo')
            })
        );

//        statusRangeInputs.push(
//            visualHUD.Libs.formControlsBuilder.createRangeInput({
//                'type': 'rangeInput',
//                'name': 'statusAccuracy',
//                'label': 'Acc',
//                'min': 0,
//                'max': 100,
//                'value': clientSettingsModel.get('statusAccuracy')
//            })
//        );

        statusRangeInputs.push(
            visualHUD.Libs.formControlsBuilder.createRangeInput({
                'type': 'rangeInput',
                'name': 'statusSkill',
                'label': 'Skill',
                'min': 0,
                'max': 100,
                'value': clientSettingsModel.get('statusSkill')
            })
        );
        _.each(statusRangeInputs, function(el) {
            form.append(el);
        });

        playerStatusListItem.append(form);
    },

    renderImageImportMenuItem: function() {
        var submenuElement = this.$el.find('li.shot-toggle ul'),
            importLinkTpl = ([
                '<a href="#" class="set-custom-bg">',
                    'Import image',
                '</a>'
            ]).join(''),
            menuItem = $('<li />').html(importLinkTpl).appendTo(submenuElement),
            importLink = menuItem.find('a.set-custom-bg');

        importLink.click(visualHUD.Function.bind(function(event) {
            this.trigger('import.image');
            event.preventDefault();
        }, this));
    },

    onRootitemClick: function(event) {
        event.preventDefault();

        var listItem = $(event.currentTarget);
        var listItems = this.$el.children();
        var activeItems = listItems.filter('.active').not(listItem).removeClass('active');
        var activeItem = null;

        listItem.toggleClass('active');
        activeItem = listItem.hasClass('active');

        this.trigger('toolbar.menu:show', [this]);

        var hideFn = visualHUD.Function.bind(this.hideMenu, this);

        if(activeItem && activeItems.length == 0){
            window.setTimeout(function(){
                $('body').bind('click.hideMenu', hideFn);
            }, 20);
        }
        else if(!activeItem && activeItems.length == 0){
            $('body').bind('click.hideMenu', hideFn);
        }
        else {
            event.stopPropagation();
        }
    },

    hideMenu: function() {
        var listItems = this.$el.children();

        listItems.filter('.active').removeClass('active');
        $('body').unbind('click.hideMenu');

        this.trigger('toolbar.menu:hide', [this]);
    },


    onSubmenuClick: function(event) {
        event.stopPropagation();

        var listItems = this.$el.children();

        listItems.filter('.active').removeClass('active');
        $('body').unbind('click.hideMenu');
    },

    changeCanvasOption: function(event) {
        var formControl = event.currentTarget;
        var $formControl = $(formControl);

        var isCheckbox = $formControl.is('[type=checkbox]');
        var isRadiobutton = $formControl.is('[type=radio]');

        var textElement = $formControl.closest('li.root-item').find('strong.item-value').text(formControl.value);

        if(formControl.name != '') {
			var clientSettingsModel = this.options.clientSettingsModel;
			clientSettingsModel.set(formControl.name, isCheckbox ? formControl.checked : formControl.value)
        }
    },

    setClientSettings: function(data) {
        var set, attr, type, name, val, input;

        for(var key in data){
            set = data[key];

            name = _.template('input[name=<%= name %>]', {name: key});
            input = this.$el.find(name);

            if(set === true){
                input.attr('checked', set);
            }
            else {
                val = _.template('input[value=<%= name %>]', {name: set});
                input = input.filter(val)
                input.attr('checked', true);

                var textElement = input.closest('li.root-item').find('strong.item-value').text(set);
            }
        }
    },

    stopPropagation: function(event) {
        event.stopPropagation();
        return false;
    }
});

