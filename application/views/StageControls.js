/**
 * Stage Controlls are used to create new HUD items
 * This view is placed within main Viewport
 * @type {*}
 */
visualHUD.Views.StageControls = Backbone.View.extend({
    tagName: 'div',
    className: 'stage-controlls-area',
    collection: null,
    htmlTpl: [
        '<div class="sidebar-block" id="getStartedTextarea">',
        '<h2>Get started</h2>',
        '<div class="mb-10">',
        'Use icons below to start building yor HUD. You can use drag and drop or double click in order to create new HUD element',
        '</div>',
        '<div>',
        '<a href="#" class="mr-20">View Video Tutorials</a>',
        '<a href="#">Help</a>',
        '</div>',
        '</div>',
        '<div class="sidebar-block stage-controls" id="stageControlsArea">',
        '<h4>HUD Elements</h4>',
        '<ul class="library-items clearfloat">',
        '</ul>',
        '</div>',
        '<div class="sidebar-block stage-controls" id="editorSettingsArea">',
        '<h4>Editor Size</h4>',
        '<ul class="library-items icons-32px viewport-size-controls clearfloat">',
            '<li data-viewportsize="1" data-tooltip="640x480" class="normal-viewport"><span class="item-name">Normal</span></li>',
            '<li data-viewportsize="2" data-tooltip="1280x960" class="doubled-viewport"><span class="item-name">Doubled</span></li>',
        '</ul>',
        '</div>'
    ],

    stageControlTpl: [
        '<li class="<%= cssClass %>"  data-id="<%= id %>" data-tooltip="<%= label %>">',
        '<span class="item-name"><%= label %></span>',
        '</li>'
    ],

    events: {
        'mousedown #stageControlsArea li': 'startDrag',
        'click #editorSettingsArea li': 'switchEditorSize',
        'mouseenter #editorSettingsArea li': 'exposeEditor',
        'mouseleave #editorSettingsArea li': 'maskEditor'
    },

    initialize: function() {
        var stageControlsHTML = [];

        this.collection.each(function(record) {
            stageControlsHTML.push(
                _.template(this.stageControlTpl.join(''), {
                    id: record.get('id'),
                    label: record.get('label'),
                    cssClass: record.get('cssClass')
                })
            );
        }, this);

        this.$el.append(this.htmlTpl.join(''));
        this.$('#stageControlsArea').find('ul.library-items').append(stageControlsHTML.join(''));

        this.setupDragManager();
    },

    render: function(viewport) {
        this.viewport = viewport;
        this.$el.appendTo(viewport.$sidebarArea);
    },

    /**
     * Drag Manager is need to support Drag and Drop operations
     */
    setupDragManager: function() {
        var dropArea,
            hudCanvas;

        this.dragManager = new visualHUD.Utils.DragZoneBase({
            scope: this,
            ticks: 2,
            tolerance: 3,
            position: 'offset',
            bodyDragClass: 'new-item-drag',
            init: function(dragManager) {
                dragManager.ghost.addClass('stage-controls-drag-helper');
            },
            onbeforestart: function(){
                dropArea = this.getCanvasPosition();
                hudCanvas = this.viewport.$centerArea;
            },
            onstart: function(dragManager){
                var css = {
                    left: dragManager.mouse.x + dragManager.moveOffset.x,
                    top: dragManager.y + dragManager.moveOffset.y,
                    display: 'block'
                };

                dragManager.ghost.addClass(dragManager.currentElement[0].className).css(css);
                dragManager.currentElement.addClass('drag-start');
            },
            ondrag: function(dragManager, event, position, mouse){
                dragManager.ghost.css(position);

                if(dropArea.top < mouse.y && dropArea.left < mouse.x && dropArea.right > mouse.x && dropArea.bottom > mouse.y){
                    if(!hudCanvas.hasClass('new-item-drop-over')){
                        hudCanvas.addClass('new-item-drop-over')
                    }
                } else {
                    if(hudCanvas.hasClass('new-item-drop-over')){
                        hudCanvas.removeClass('new-item-drop-over')
                    }
                }
            },
            ondrop: function(dragManager, event, _target){
                var dataId = dragManager.currentElement.data().id;
                var record = this.collection.get(dataId);
                var mouse = dragManager.getMouse(event);
                var hit = dropArea.top < mouse.y && dropArea.left < mouse.x && dropArea.right > mouse.x && dropArea.bottom > mouse.y;

                dragManager.ghost.removeClass(dragManager.currentElement[0].className);
                dragManager.currentElement.removeClass('drag-start');
                hudCanvas.removeClass('new-item-drop-over');

                if(hit){
                    this.fireEvent('item.drop', [record, {
                        top: Math.round(mouse.y - dropArea.top),
                        left: Math.round(mouse.x - dropArea.left)
                    }]);
                }
            }
        });
    },

    startDrag: function(event) {
        var $target = $(event.currentTarget);

        if($target.hasClass('disabled')){
            return false;
        };

        this.dragManager.start(event, $target);

        if (event.stopPropagation) event.stopPropagation();
        if (event.preventDefault) event.preventDefault();
        return false;
    },

    switchEditorSize: function(event) {
        var $target = $(event.currentTarget),
            scale = parseInt($target.data('viewportsize'), 10);

        this.fireEvent('scalefactor.change', [scale]);


    },

    getCanvasPosition: function(){
        var canvas = this.viewport.$centerArea;
        var offset = canvas.offset();
        var size = {
            width: canvas.width(),
            height: canvas.height()
        };
        var canvasPosition = {
            top: offset.top,
            left: offset.left,
            right: offset.left + size.width,
            bottom: offset.top + size.height
        };

        $.extend(canvasPosition, size);
        return canvasPosition;
    },

    exposeEditor: function() {
        var hudCanvasWrap = this.viewport.$centerArea;
        hudCanvasWrap.addClass('new-item-drop-over');
    },

    maskEditor: function() {
        var hudCanvasWrap = this.viewport.$centerArea;
        hudCanvasWrap.removeClass('new-item-drop-over');
    }

});

