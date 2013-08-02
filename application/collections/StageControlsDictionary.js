visualHUD.Collections.StageControlsDictionary = visualHUD.Collections.DictionaryAbstract.extend({
    getData: function() {
        return [
            {
                'id': 'healthIndicator',
                'itemType': 'general',
                'cssClass': 'lib-element-health',
                'label': 'Health indicator'
            },
            {
                'id': 'healthBar',
                'name': 'healthBar',
                'itemType': 'bar',
                'label': 'Health bar',
                'cssClass': 'lib-element-hbar'
            },
            {
                'id': 'armorIndicator',
                'itemType': 'general',
                'cssClass': 'lib-element-armor',
                'label': 'Armor indicator'
            },
            {
                'id': 'armorBar',
                'name': 'armorBar',
                'itemType': 'bar',
                'label': 'Armor bar',
                'cssClass': 'lib-element-abar'
            },

            {
                'id': 'ammoIndicator',
                'itemType': 'general',
                'cssClass': 'lib-element-ammo',
                'label': 'Ammo indicator'
            },
            {
                'id': 'timer',
                'itemType': 'general',
                'cssClass': 'lib-element-timer',
                'label': 'Timer'
            },
            {
                'id': 'powerupIndicator',
                'itemType': 'general',
                'cssClass': 'lib-element-powerup',
                'label': 'Powerup timer'
            },
            {
                'id': 'scoreBox',
                'itemType': 'scoreBox',
                'cssClass': 'lib-element-scorebox',
                'label': 'Scorebox'
            },
            {
                'id': 'playerItem',
                'itemType': 'iconItem',
                'cssClass': 'lib-element-player-item',
                'label': 'Usable item indicator'
            },
            {
                'id': 'CTFPowerupIndicator',
                'itemType': 'iconItem',
                'cssClass': 'lib-element-ctf-powerup',
                'label': 'CTF powerup indicator'
            },
            {
                'id': 'obits',
                'itemType': 'obits',
                'cssClass': 'lib-element-obit',
                'label': 'Graphical obits'
            },
            {
                'id': 'flagIndicator',
                'itemType': 'iconItem',
                'cssClass': 'lib-element-flag',
                'label': 'Flag indicator'
            },



            {
                'id': 'medal',
                'name': 'medal',
                'itemType': 'general',
                'label': 'Medal',
                'cssClass': 'lib-element-medal'
            },
            {
                'id': 'skillIndicator',
                'name': 'skillIndicator',
                'itemType': 'textItem',
                'label': 'Skill Rating Indicator',
                'cssClass': 'lib-element-skill'
            },
            {
                'id': 'chatArea',
                'name': 'chatArea',
                'itemType': 'rect',
                'label': 'Chat area',
                'isSingle': true,
                'cssClass': 'lib-element-chat'
            },
            {
                'id': 'rectangleBox',
                'name': 'rectangleBox',
                'itemType': 'rect',
                'label': 'Rectangle box',
                'cssClass': 'lib-element-rect'
            },
            {
                'id': 'customDefinition',
                'name': 'customDefinition',
                'itemType': 'customDefinition',
                'label': 'Custom Definition <small>Not implemented yet</small>',
                'cssClass': 'lib-element-definition disabled'
            }
        ];
    }
});

