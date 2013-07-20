/**
 * Stage Controlls are used to create new HUD items
 * This view is placed within main Viewport
 * @type {*}
 */
visualHUD.Views.viewport.StageControls = Backbone.View.extend({
    tagName: 'div',
    className: 'stage-controlls-area',
    collection: null,
    htmlTpl: [
        '<div class="sidebar-block" id="getStartedTextarea">',
        '<h3>Get started</h3>',
        '<div class="mb-10">',
        'Use icons below to build your HUD. Drag and drop items or simple double click on icon to create new HUD element',
        '</div>',
        '<div>',
        '<a href="help/#videos" target="help" class="mr-20">View Video Tutorials</a>',
        '</div>',
        '</div>',
        '<div class="sidebar-block stage-controls" id="stageControlsArea">',
        '<h4>HUD Elements</h4>',
        '<ul class="library-items clearfloat">',
        '</ul>',
        '</div>',
        '<div class="sidebar-block stage-controls" id="editorSettingsArea">',
        '<h4>Editor Size and Layout</h4>',
        '<ul class="library-items icons-32px viewport-size-controls ctrl-group clearfloat">',
            '<li data-viewportsize="1" data-tooltip="Normal<small>640x480</small>" class="ctrl normal-viewport"><span class="item-name">Normal</span></li>',
            '<li data-viewportsize="2" data-tooltip="Doubled<small>1280x960</small>" class="ctrl doubled-viewport"><span class="item-name">Doubled</span></li>',
        '</ul>',
        '<ul class="library-items icons-32px viewport-layout-controls ctrl-group clearfloat">',
            '<li data-layout="false" data-tooltip="Full Layout" class="ctrl normal-layout"><span class="item-name">Normal</span></li>',
            '<li data-layout="true" data-tooltip="Compact Layout" class="ctrl compact-layout"><span class="item-name">Doubled</span></li>',
        '</ul>',        
        '</div>'
    ],

    stageControlTpl: [
        '<li class="<%= cssClass %>"  id="<%= id %>" data-id="<%= id %>" data-tooltip="<%= label %>">',
        '<span class="item-name"><%= label %></span>',
        '</li>'
    ],

    events: {
        'mousedown #stageControlsArea li': 'startDrag',
        'dblclick #stageControlsArea li': 'dropHUDItem',
        'click .viewport-size-controls li': 'switchEditorSize',
        'click .viewport-layout-controls li': 'switchEditorLayout',
        'mouseenter .viewport-size-controls li': 'exposeEditor',
        'mouseleave .viewport-size-controls li': 'maskEditor'
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
                dropArea = this.viewport.getCanvasView().getCanvasOffset();
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
                    this.trigger('item.drop', [record, {
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
        }

        this.dragManager.start(event, $target);

        if (event.stopPropagation) event.stopPropagation();
        if (event.preventDefault) event.preventDefault();
        return false;
    },

    dropHUDItem: function(event) {
        var $target = $(event.currentTarget),
            id = $target.data().id,
            record = this.collection.get(id),
            dropArea = this.viewport.getCanvasView().getCanvasOffset();

        if($target.hasClass('disabled')){
            return false;
        }

        this.trigger('item.drop', [record, {
            top: Math.round(dropArea.height/2),
            left: Math.round(dropArea.width/2)
        }]);
    },

    switchEditorSize: function(event) {
        var $target = $(event.currentTarget),
            scale = parseInt($target.data('viewportsize'), 10);

        this.trigger('scalefactor.change', [scale]);
    },

    exposeEditor: function() {
        var hudCanvasWrap = this.viewport.$centerArea;
        hudCanvasWrap.addClass('new-item-drop-over');
    },

    maskEditor: function() {
        var hudCanvasWrap = this.viewport.$centerArea;
        hudCanvasWrap.removeClass('new-item-drop-over');
    },

    switchEditorLayout: function(event) {
        var $target = $(event.currentTarget),
            layout = $target.data('layout');
            
        this.trigger('layout.change', [layout]);
    },
    
    updateControlsStatus: function(event, name) {
        var element = this.$('#' + name),
            record = this.collection.get(name),
            isSingle = record.get('isSingle'),
            clsFn = 'addClass';

        switch(event) {
            case 'create': {
                clsFn = 'addClass';
                break;
            }
            case 'destroy': {
                clsFn = 'removeClass';
                break;
            }
        }

        isSingle && element[clsFn]('disabled');
    }

});

