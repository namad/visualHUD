visualHUD.Models.ClientSettings = Backbone.Model.extend({
    defaults: {
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
        'statusAmmo': '25'
    },

    initialize: function() {
        var savedSettings = window.localStorage.getItem('vhudClient');
        if(savedSettings !== null) {
            savedSettings = JSON.parse(savedSettings)
            this.set(savedSettings)
        }
    },

    save: function() {
        var data = this.toJSON();
        window.localStorage.setItem('vhudClient', JSON.stringify(data));
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

