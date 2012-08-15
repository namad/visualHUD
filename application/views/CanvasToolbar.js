visualHUD.view.CanvasToolbar = Backbone.View.extend({
    tagName: 'ul',
    className: 'app-toolbar',
    baseCls: 'root-item',
    menuStructire: [
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
            cls: '',
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
            cls: '',
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
        'mouseover li.root-item.ul': 'stopPropagation'
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
    },
    render: function(viewport) {
        var tpl = _.template(this.tpl.join(''), {
                baseCls: this.baseCls,
                items: this.menuStructire
            });

        this.$el.append(tpl);

        this.renderPlayerStatusControls();

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
            visualHUD.lib.formControlsBuilder.createRangeInput({
                'type': 'rangeInput',
                'name': 'statusHealth',
                'label': 'Health',
                'min': 0,
                'max': 200,
                'value': clientSettingsModel.get('statusHealth')
           })
        );

        statusRangeInputs.push(
            visualHUD.lib.formControlsBuilder.createRangeInput({
                'type': 'rangeInput',
                'name': 'statusArmor',
                'label': 'Armor',
                'min': 0,
                'max': 200,
                'value': clientSettingsModel.get('statusArmor')
            })
        );

        statusRangeInputs.push(
            visualHUD.lib.formControlsBuilder.createRangeInput({
                'type': 'rangeInput',
                'name': 'statusAmmo',
                'label': 'Ammo',
                'min': 0,
                'max': 150,
                'value': clientSettingsModel.get('statusAmmo')
            })
        );

        statusRangeInputs.push(
            visualHUD.lib.formControlsBuilder.createRangeInput({
                'type': 'rangeInput',
                'name': 'statusAccuracy',
                'label': 'Acc',
                'min': 0,
                'max': 100,
                'value': clientSettingsModel.get('statusAccuracy')
            })
        );

        statusRangeInputs.push(
            visualHUD.lib.formControlsBuilder.createRangeInput({
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

    onRootitemClick: function(event) {
        event.preventDefault();

        var listItem = $(event.currentTarget);
        var listItems = this.$el.children();
        var activeItems = listItems.filter('.active').not(listItem).removeClass('active');
        var activeItem = null;

        listItem.toggleClass('active');
        activeItem = listItem.hasClass('active');

        this.options.appToolTips.hide();

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

        var textElement = $formControl.closest('li.root-item').find('strong.item-value').text(formControl.value);

        this.fireEvent('setCanvasOptions', [{
            name: formControl.name,
            value: formControl.value,
            enabled: formControl.checked
        }]);
    },

    setClientSettings: function(data) {
        var set, attr, type, name, val, input;

        for(var key in data){
            set = data[key];

            name = ('input[name={0}]').format(key);
            input = this.$el.find(name);

            if(set === true){
                input.attr('checked', set);
            }
            else {
                val = ('input[value={0}]').format(set);
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