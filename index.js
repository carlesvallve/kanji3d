//console.log('Welcome to kanji-3D');

var kanjidic;
var app;
var easing = 'cubic-bezier(0.455, 0.03, 0.515, 0.955)';

window.onload = function() {
    // disable page scroll
    domutils.disableScroll();

    var container = document.body; //domutils.appendChild('div', document.body, 'app');
    var preloader = domutils.appendChild('div', container, 'preloader');

    kanjidic = new Kanjidic();
    kanjidic.load(preloader, './assets/data/kanjidic2.json', function () {
        //tweener.tween(preloader, { opacity: 0 }, { time: 500, delay: 0, easing: 'ease' }, function () {
            // hide preloader
            preloader.style.display = 'none';

            // initialize application
            app = new App(container);
            app.init();
        //});
    });





};
















