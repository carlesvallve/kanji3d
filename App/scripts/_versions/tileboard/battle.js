var Battle = function (container) {
    var self = this;

    this.elm = domutils.appendChild('div', container, 'battle');
    this.bg = domutils.appendChild('div', this.elm, 'battleBg');
    //self.bg.style.opacity = 0.1;

    this.init = function () {
        self.elm.style.opacity = 0;
        this.loadBackground('assets/textures/gif/' + utils.randomInt(1,5) + '.gif', function (img) {
            self.bg.style.background = 'url(' + img.src + ') no-repeat ' + utils.randomInt(0, 100) + '% 95%';
            tweener.tween(self.elm, { opacity: 1 }, { time: 500, delay: 500, easing: window.easing }, function () {});
        });
    };


    this.loadBackground = function (url, cb) {
        var img = new Image();
        img.onload = function () { if (cb) { cb(img); } };
        img.onerror = function (e) { console.error('Image not found', e); };
        img.src = url;
    };
};




