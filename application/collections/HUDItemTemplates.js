visualHUD.collection.HUDItemTemplates = visualHUD.collection.DictionaryAbstract.extend({
    getData: function() {

        var getGeneralitemTemplate = function() {
            return [
                '<div class="item-icon"><img src="<%= icon.url %>" /></div>',
                '<div class="item-counter"><span class="counter"><%= text %></a></span></div>'
            ]
        }

        var getIconItemTemplate = function() {
            return [
                '<div class="item-icon"><img src="<%= icon %>" /></div>'
            ]
        }

        var getBarTemplate = function() {
            return [
                '<div class="hud-item-box">',
                '<div class="h-bar h100"><div class="h-bar h200"></div></div>',
                '</div>'
            ]
        }
        return [
            {
                'id': 'healthIndicator',
                'itemType': 'general',
                'cssClass': '',
                'template': getGeneralitemTemplate()
            },
            {
                'id': 'healthBar',
                'itemType': 'bar',
                'cssClass': 'health-bar',
                'template': getBarTemplate()
            },
            {
                'id': 'armorIndicator',
                'itemType': 'general',
                'cssClass': '',
                'template': getGeneralitemTemplate()
            },
            {
                'id': 'armorBar',
                'itemType': 'bar',
                'cssClass': 'armor-bar',
                'template': getBarTemplate()
            },

            {
                'id': 'ammoIndicator',
                'itemType': 'general',
                'cssClass': '',
                'template': getGeneralitemTemplate()
            },
            {
                'id': 'timer',
                'itemType': 'general',
                'cssClass': '',
                'template': getGeneralitemTemplate()
            },
            {
                'id': 'powerupIndicator',
                'itemType': 'general',
                'cssClass': '',
                'template': [
                    '<div class="powerups-wrapper">',
                        '<div class="powerup-item">',
                            '<div class="item-icon"><img src="<%= icon[0].url %>" /></div> ',
                            '<div class="item-counter"><span class="counter"><%= text %></a></span></div>',
                        '</div>',
                        '<div class="powerup-item">',
                            '<div class="item-icon"><img src="<%= icon[1].url %>" /></div> ',
                            '<div class="item-counter"><span class="counter"><%= text %></a></span></div>',
                        '</div>',
                    '</div>'
                ]
            },
            {
                'id': 'scoreBox',
                'itemType': 'scoreBox',
                'cssClass': 'scorebox-item',
                'template': [
                    '<div class="item-icon team-red"></div><div class="item-icon team-blue"></div>'
                ]
            },
            {
                'id': 'playerItem',
                'itemType': 'iconItem',
                'cssClass': 'icon-item ',
                'template': getIconItemTemplate()
            },
            {
                'id': 'CTFPowerupIndicator',
                'itemType': 'iconItem',
                'cssClass': 'icon-item ',
                'template': getIconItemTemplate()
            },
            {
                'id': 'obits',
                'itemType': 'obits',
                'cssClass': 'obit-item',
                'template': [
                    '<div class="item-counter"><span class="counter"><%= text[0] %></span></div>',
                    '<div class="item-icon"><img src="<%= icon %>" /></div>',
                    '<div class="item-counter"><span class="counter"><%= text[1] %></span></div>'
                ]
            },
            {
                'id': 'flagIndicator',
                'itemType': 'iconItem',
                'cssClass': 'icon-item ',
                'template': getIconItemTemplate()
            },

            {
                'id': 'rectangleBox',
                'itemType': 'rect',
                'template': [
                    '<div class="hud-item-box"></div>'
                ]
            },

            {
                'id': 'accuracyIndicator',
                'itemType': 'general',
                'cssClass': 'accuracy',
                'template': getGeneralitemTemplate()
            },
            {
                'id': 'skillIndicator',
                'itemType': 'textItem',
                'cssClass': 'skill-item',
                'template': [
                    '<div class="item-counter">',
                    '<span class="text"><%= template %></a></span>',
                    '<span class="counter"><%= text %></a></span>',
                    '</div>'
                ]
            },
            {
                'id': 'chatArea',
                'itemType': 'chatArea',
                'cssClass': 'chat-area',
                template: [
                    '<div class="hud-item-box">',
                    '<ul class="chat-messages" style="padding: 3px; ">',
                    '<li class="message-0">',
                    '<span class="name"><span style="color: Cyan">n</span><span style="color: Red">a</span><span style="color: Cyan">mad</span>:</span><span class="message">quad in 30 seconds, team</span>',
                    '</li>',
                    '<li class="message-1">',
                    '<span class="name"><span style="color: #3266fe">kN</span><span style="color: Red">a</span><span style="color: #3a63e9">kHstR</span>:</span><span class="message">WTF???</span>',
                    '</li>',
                    '<li class="message-2">',
                    '&lt;QUAKE LIVE&gt; <span style="color: Cyan">Ancest0R</span> has gone offline' +
                        '</li>',
                    '<li class="message-3">',
                    '<span class="name">fatal<span style="color: Red">1</span>ty:</span><span class="message">pwned ;)</span></li>',
                    '<li class="message-4">',
                    'fatal<span style="color: Red">1</span>ty connected' +
                        '</li>',
                    '<li class="message-5">',
                    'fatal<span style="color: Red">1</span>ty entered the game' +
                        '</li>',
                    '<li class="message-6">',
                    '<span class="name"><span style="color: Cyan">n</span><span style="color: Red">a</span><span style="color: Cyan">mad</span>:</span><span class="message">byte my shiny metal ass!</span>',
                    '</li>',
                    '</ul>',
                    '</div>'
                ]
            }
        ]
    }
});