var ejecta = window.ejecta;

if (ejecta) {
    ejecta.include('lib/threejs/three.js');
    //ejecta.include('lib/threejs/stats.min.js');

    ejecta.include('lib/shaders/ShaderParticles.min.js');
    ejecta.include('lib/controls/customOrbitControls.js');

    ejecta.include('scripts/utils/pixastic.custom.js');
    ejecta.include('scripts/utils/utils.js');
    ejecta.include('scripts/utils/canvasutils.js');

    ejecta.include('scripts/dictionary/kanjidic.js');

    ejecta.include('scripts/Kanji.js');
    ejecta.include('scripts/Hud.js');
    ejecta.include('scripts/App.js');
}


var kanjidic, app;

// retina resolution: set canvas at double resolution and scale it manually with style
var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth * window.devicePixelRatio;
canvas.height = window.innerHeight * window.devicePixelRatio;
canvas.style.width = window.innerWidth + 'px';
canvas.style.height = window.innerHeight + 'px';


function init() {
    kanjidic = new Kanjidic();

    kanjidic.load('./assets/data/kanjidic2-2.json',

        function (percent) {},  // update
        function () {           // end
            console.log('dictionary loaded:', kanjidic.data.length, 'entries');

            // initialize application
            app = new App(document.body);
            app.init();
        }
    );
}

init();

















