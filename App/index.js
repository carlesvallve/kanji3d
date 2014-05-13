//console.log('Welcome to kanji-3D');

if (window.ejecta) {
    ejecta.include('lib/threejs/three.js');
    //ejecta.include('lib/threejs/stats.min.js');

    ejecta.include('lib/shaders/ShaderParticles.min.js');
    ejecta.include('lib/controls/customOrbitControls.js');


    ejecta.include('scripts/utils/utils.js');
    ejecta.include('scripts/utils/canvasutils.js');
    ejecta.include('scripts/dictionary/kanjidic.js');

    ejecta.include('scripts/Kanji.js');
    ejecta.include('scripts/Hud.js');
    ejecta.include('scripts/App.js');
}


var kanjidic, app;

var canvas = document.getElementById('canvas');
var w = window.innerWidth;
var h = window.innerHeight;
canvas.width = w;
canvas.height = h;


function init() {
    kanjidic = new Kanjidic();
    console.log(kanjidic);



    kanjidic.load('./assets/data/kanjidic2-2.json',
        function (percent) {
            /*ctx.clearRect(0, 0, w, h);
             ctx.textAlign = 'center';
             ctx.textBaseline = 'middle';
             ctx.font = 'bold 14px Verdana';
             ctx.fillStyle = '#ffffff';
             ctx.fillText('loading dictionary ' + percent + '%', w2, h2);*/
        },
        function () {
            /*ctx.clearRect(0, 0, w, h);
             ctx.textAlign = 'center';
             ctx.textBaseline = 'middle';
             ctx.font = 'bold 14px Verdana';
             ctx.fillStyle = '#ffffff';
             ctx.fillText('YAY!', w2, h2);*/

            console.log(kanjidic.data.length);

            app = new App(document.body);
            app.init();


            //tweener.tween(preloader, { opacity: 0 }, { time: 500, delay: 0, easing: 'ease' }, function () {
            // hide preloader
            //preloader.style.display = 'none';

            // initialize application
            //app = new App(container);
            //app.init();
            //});
        }
    );
}

init();

















