if (!Element.prototype.animate) {
    Element.prototype.animate = function() {
        var animation = {
            onfinish: null
        };
        
        setTimeout(function() {
            if (animation.onfinish) {
                animation.onfinish();
            }
        }, 0);
        
        return animation;
    };
}
