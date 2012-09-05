visualHUD.Models.ClientSettings = Backbone.Model.extend({
    defaults: {
        'scaleFactor': 1,
        'fullScreenView': false,
        'pinSidebar': true,
        'lagometr': false,
        'speedometr': false,
        'pickup': false,
        'snapGrid': '0',
        'drawGrid': '0',
        'drawGun': '1',
        'drawWeaponbar': '1',
        'drawTeamoverlay': '0',
        'canvasShot': '1',
        'statusSkill': '90',
        'statusAccuracy': '47',
        'statusHealth': '200',
        'statusArmor': '100',
        'statusAmmo': '25',
        'customBackground': null
    },

    initialize: function() {
        var savedSettings = window.localStorage.getItem('vhudClient');
        if(savedSettings !== null) {
            savedSettings = JSON.parse(savedSettings)
            this.set(savedSettings)
        }
        this.on('change', this.save, this);
    },

    save: function() {
        var data = this.toJSON();
        var reset = {
            fullScreenView: false
        };
        _.extend(data, reset);

        window.localStorage.setItem('vhudClient', JSON.stringify(data));
    },

    reset: function() {
        this.set(this.defaults);
        this.save();
    },

    getStatusByName: function(name) {
        switch(name) {
            case 'armorIndicator':
            case 'armorbar': {
                return this.get('statusArmor')
                break;
            }
            case 'ammoIndicator': {
                return this.get('statusAmmo')
                break;
            }
            case 'healthIndicator':
            case 'healthBar':{
                return this.get('statusHealth')
                break;
            }
            case 'accuracyIndicator': {
                return this.get('statusAccuracy');
                break;
            }
            case 'skillIndicator': {
                return this.get('statusSkill');
                break;
            }
        }
    }
});

