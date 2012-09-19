visualHUD.Views.HUDitemDefinitionControl = visualHUD.Views.BoundList.extend({
    cls: 'hud-item-definition-control',
    collection: null,
    emptyListMessage: 'No presets here yet. Click here to add one',
    listItemTpl: '<li class="bound-list-item" data-cid="<%= cid %>"><%= itemHTML %></li>',
    itemTpl: ([
        '<div class="definition-view">',
            '<span class="item-name"><%= name %></span>',
            '<span class="item-value"><%= value %></span>',
        '</div>',
        '<div class="definition-edit">',
            '<input type="text" name="name"/>',
            '<input type="text" name="value"/>',
        '</div>'
    ]).join('')
});