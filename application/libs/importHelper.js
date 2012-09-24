visualHUD.Libs.importHelper = {
    checkImageSize: function(file) {
        if (file.size >= visualHUD.MAX_BACKGROUND_SIZE){
            visualHUD.growl.alert({
                status: 'warning',
                title: 'Maximum file size exceeded',
                message: _.template(visualHUD.messages.LARGE_IMAGE_WARNING, {
                    imageSize: Math.floor(file.size/1024) + 'kb',
                    maxSize: Math.floor(visualHUD.MAX_BACKGROUND_SIZE / 1024) + 'kb'
                })
            });
            return false;
        }
        
        return true;
    },
    
    checkImageType: function(file) {
        if (!file.type.match('image.*')){
            visualHUD.growl.alert({
                status: 'warning',
                title: 'Unsupported file detected',
                message: _.template(visualHUD.messages.UNSUPPORTED_IMAGE_FORMAT, {
                    imageType: file.type || 'unknown'
                })
            });
            return false;
        }
        
        return true;
    },
    
    checkTextType: function(file) {
    },

    batchImport: function(files, callback) {
        var batch = [],
            reader = new FileReader(),
            imageProcessed = false,
            callback = _.extend({
                scope: this,
                image: false,
                files: false
            }, callback || {}),
            scope = callback.scope;

        var processFile = function(file) {
            if(file.type.match('image.*') && visualHUD.Libs.importHelper.checkImageSize(file) == true && imageProcessed == false) {
                reader.onload = visualHUD.Function.bind(processImage, this, [file], true);
                reader.readAsDataURL(file);
            }

            if(file.type.match('text.*') || file.name.match('vhud$')) {
                reader.onload = visualHUD.Function.bind(processText, this, [file], true);
                reader.readAsText(file);
            }
        };

        var processImage = function(event) {
            imageProcessed = true;
            callback.image && callback.image.call(scope, event.target.result);

        };

        var processText = function(event, file) {
            var fileName = file.name.split('.');
            fileName.pop();

            batch.push({
                name: fileName.join('.'),
                json: event.target.result
            });

            if(files.length > 0) {
                processFile.call(this, files.shift());
            }
            else {
                callback.files && callback.files.call(scope, batch);
            }
        };

        if(files.length) {
            processFile.call(this, files.shift());
        }
    }
}

