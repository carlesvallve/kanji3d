console.log('Welcome to kanji-3D');

var kanjidic;
var easing = 'cubic-bezier(0.455, 0.03, 0.515, 0.955)';

var App = function () {
    var self = this;

    this.elm = domutils.appendChild('div', document.body, 'app');
    this.preloader = domutils.appendChild('div', document.body, 'preloader');

    // create header
    this.header = new Header(this.elm);

    // create battle area
    this.battle = new Battle(this.elm);

    // create tileboard
    self.tileboard = new Tileboard(self.elm, 7, 5);


    this.loadDictionary = function () {
        kanjidic = new Kanjidic();
        kanjidic.load(self.preloader, './assets/data/kanjidic2.json', function () {
            tweener.tween(self.preloader, { opacity: 0 }, { time: 500, delay: 0, easing: 'ease' }, function () {
                // initialize application display
                self.preloader.style.display = 'none';
                self.init();
            });
        });
    };


    this.init = function () {
        self.header.init();
        self.tileboard.init();
        self.battle.init();
    };
};


window.onload = function() {
    // disable page scroll
    domutils.disableScroll();

    // init application
    var app = new App();

    // load kanji dictionary
    app.loadDictionary();
};
















