//console.log('Welcome to kanji-3D');

if (window.ejecta) {
    ejecta.include('lib/threejs/three.js');
    //ejecta.include('lib/threejs/stats.min.js');

    ejecta.include('lib/shaders/ShaderParticles.min.js');
    ejecta.include('lib/controls/customOrbitControls.js');

    //ejecta.include('scripts/utils/canvas/canvasTextEffects.js');
    ejecta.include('scripts/utils/utils.js');
    ejecta.include('scripts/Kanji.js');
    ejecta.include('scripts/Hud.js');

    ejecta.include('scripts/dictionary/kanjidic.js');
    ejecta.include('scripts/App.js');

    //init();
} else {
    //window.onload = init;
}

var kanjidic;
var app;
var easing = 'cubic-bezier(0.455, 0.03, 0.515, 0.955)';


var canvas = document.getElementById('canvas');
var w = window.innerWidth;
var h = window.innerHeight;
canvas.width = w;
canvas.height = h;

//window.onload = function() {
// disable page scroll
//domutils.disableScroll();

//var container = document.body; //domutils.appendChild('div', document.body, 'app');
//var preloader = domutils.appendChild('div', container, 'preloader');

function init() {
    kanjidic = new Kanjidic();
    console.log(kanjidic);

    kanjidic.load('./assets/data/kanjidic2.json',
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



/*var w = window.innerWidth;
var h = window.innerHeight;
var w2 = w/2;
var h2 = h/2;*/

/*var canvas = document.getElementById('canvas');
canvas.width = w;
canvas.height = h;

var ctx = canvas.getContext('webgl');

ctx.fillStyle = '#0000ff';
ctx.fillRect (10, 10, w- 20, h - 20);


ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.font = 'bold 14px Verdana';
ctx.fillStyle = '#ffffff';
ctx.fillText('Hello world!', w2, h2);*/








//};
















