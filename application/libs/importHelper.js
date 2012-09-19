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
    }
}

