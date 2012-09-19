visualHUD.Views.SystemHUDPresetList = visualHUD.Views.BoundList.extend({
    cls: 'custom-hud-list',
    collection: null,
    emptyListMessage: 'No presets here yet. Click here to add one',
    itemTpl: ([
        '<div class="bound-list-item-body">',
        '<span class="item-name"><%= name %></span>',
        '</div>'
    ]).join('')
});