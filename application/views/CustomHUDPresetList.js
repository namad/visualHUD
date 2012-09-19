visualHUD.Views.CustomHUDPresetList = visualHUD.Views.BoundList.extend({
    cls: 'custom-hud-list',
    collection: null,
    emptyListMessage: 'No presets here yet. Click here to add one',
    itemTpl: ([
        '<div class="bound-list-item-body">',
        '<span class="item-name"><%= name %></span>',
        '<ul class="custom-hud-actions">',
        '<li class="action icon-download" data-tooltip="Download this HUD" data-action="download"><span>Download this hud</span></li>',
        '<li class="action icon-trash" data-tooltip="Delete" data-action="delete"><span>Delete this hud</span></li>',
        '</ul>',
        '</div>'
    ]).join('')
});