var kanjidic, app;


function loadDictionary() {
    var preloader = document.getElementById( 'preloader' );

    kanjidic = new Kanjidic();

    kanjidic.load('./assets/data/kanjidic2-2.json',
        function (percent) {
            preloader.textContent = 'loading dictionary ' + percent + '%';
        },
        function () {
            preloader.style.display = 'none';
            app = new App(document.body);
            app.init();
        }
    );
}

loadDictionary();

