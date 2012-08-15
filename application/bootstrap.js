window.visualHUD = {
    scaleFactor: 1,
    ver: '2.0',

    controller: {},
    view: {},
    model: {},
    collection: {},
    lib: {},
    util: {}
};

(function() {
    var documentHead = typeof document !== 'undefined' && (document.head || document.getElementsByTagName('head')[0]);

    var cleanupScriptElement = function(script) {
        script.onload = null;
        script.onreadystatechange = null;
        script.onerror = null;

        return this;
    }

    var injectScriptElement = function(url, onLoad, onError, scope) {
        var script = document.createElement('script'),
            me = this,
            onLoadFn = function() {
                cleanupScriptElement(script);
                onLoad.call(scope);
            },
            onErrorFn = function() {
                cleanupScriptElement(script);
                onError.call(scope);
            };

        script.type = 'text/javascript';
        script.src = url;
        script.onload = onLoadFn;
        script.onerror = onErrorFn;
        script.onreadystatechange = function() {
            if (this.readyState === 'loaded' || this.readyState === 'complete') {
                onLoadFn();
            }
        };

        documentHead.appendChild(script);

        return script;
    }


    var loadScripts = function(urls, callback) {
        var emptyFn = function() {};
        var queue = urls.length;

        for(var a = 0, b = urls.length; a < b; a++) {
            injectScriptElement(urls[a], function() {
                (--queue === 0) && callback();
            }, emptyFn);
        }
    }

//    loadScripts([
//        'application/models/ClientSettings.js',
//        'application/models/HUDItem.js',
//
//        'application/collections/DictionaryAbstract.js',
//        'application/collections/HUDItemIconEnums.js',
//        'application/collections/HUDItems.js',
//        'application/collections/HUDItemTemplates.js',
//        'application/collections/StageControlsDictionary.js',
//        'application/collections/StageControlsDefaults.js',
//
//        'application/views/Viewport.js',
//        'application/views/TopBar.js',
//        'application/views/CanvasToolbar.js',
//        'application/views/Canvas.js',
//        'application/views/HUDItem.js',
//        'application/views/StageControls.js',
//        'application/views/GroupActionsPanel.js',
//        'application/views/HUDItemForm.js',
//        'application/views/Window.js',
//        'application/views/DownloadWindow.js',
//
//        'application/libs/utility.js',
//        'application/libs/itemBuilderMixin.js',
//        'application/libs/layersManager.js',
//        'application/libs/canvasDragInterface.js',
//        'application/libs/selectionManagerInterface.js',
//        'application/libs/formControlsBuilder.js',
//        'application/libs/formBuilderMixin.js',
//        'application/libs/plugins.js',
//        'application/libs/colorHelper.js',
//
//        'application/controllers/Viewport.js',
//        'application/controllers/HUDManager.js',
//        'application/controllers/KeyboardManager.js',
//        'application/controllers/FocusManager.js'
//
//    ], function() {
//
//    });



})()