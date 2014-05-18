var scene, controls, camera;
var renderer, rendererStats, stats;
var hud;

var debugStats = false;

var kanjiDistance = 50;
var kanjiSpeed = 0.25;

var App = function (container) {
    var self = this;


    // ***************************************************************************************
    // Init
    // ***************************************************************************************

    this.init = function () {
        console.log('Welcome to kanji-3d');

        // create scene
        this.createScene();

        // create hud
        //hud = new Hud();
        //hud.init();

        // create particles
        this.createParticles();

        this.kanjis = [];
        window.setTimeout(function () {
            // create kanjis // TODO: select N items from the whole chapter
            self.category = kanjidic.filterByCategory(4, 'jlpt', 'freq'); // random (?)
            self.createKanjis();
        }, 1500);

        // start rendering
        window.requestAnimationFrame(self.render);
    };


    // ***************************************************************************************
    // Scene
    // ***************************************************************************************

    this.createScene = function () {
        // RENDERER
        renderer = new THREE.WebGLRenderer( { antialias: false, canvas: document.getElementById('canvas')} );
        //renderer = new THREE.WebGLRenderer(); // { antialias	: false }
        renderer.setSize( window.innerWidth, window.innerHeight ); // container.clientWidth, container.clientHeight ); /
        renderer.setClearColor(0x222222, 1);
        renderer.autoClear = false;
        container.appendChild( renderer.domElement );

        if (debugStats) {
            stats = new Stats();
            stats.setMode(0);
            stats.domElement.style.position = 'absolute';
            stats.domElement.style.left = '0px';
            stats.domElement.style.top = '0px';
            document.body.appendChild(stats.domElement);

            /*rendererStats   = new THREEx.RendererStats();
            rendererStats.domElement.style.position = 'absolute';
            rendererStats.domElement.style.left = '0px';
            rendererStats.domElement.style.top   = '48px';
            //rendererStats.domElement.style.bottom   = '10px';
            document.body.appendChild( rendererStats.domElement );*/
        }

        // SCENE
        scene = new THREE.Scene(); // scene.fog = new THREE.FogExp2( 0x222222, 10 );
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.5, 100 );
        camera.position.z = -25;
        camera.lookAt(new THREE.Vector3(0, 0, 0));


        // CONTROLS
        controls = new THREE.OrbitControls(camera);
        controls.btnRotate = 0;
        controls.btnZoom = -1;
        controls.btnPan = 2;
        controls.rotateSpeed = 0.5;
        controls.zoomSpeed = 1.5;
        controls.panSpeed = 10.0;
        controls.minDistance = 0.5;
        controls.maxDistance = 200;
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI;

        // LIGHTING
        //lighting = new THREEx.ThreePointsLighting();
        //lighting = new THREEx.SunSetLighting();
        //scene.add(lighting);


        // Resize
        //window.onresize = this.resize;
    };


    // ***************************************************************************************
    // Kanjis
    // ***************************************************************************************

    this.createKanjis = function () {
        this.kanjis = [];
        for (var i = 0; i < 20; i++) { // this.category.length
            var kanji = new Kanji();
            kanji.init(i, this.category[i]);
            //kanji.init(i, null);
            scene.add(kanji.sprite);
            this.kanjis.push(kanji);
        }
    };


    // ***************************************************************************************
    // Particles (Shader)
    // ***************************************************************************************

    this.createParticles = function () {
        this.particleGroup = new SPE.Group({
            texture: THREE.ImageUtils.loadTexture('assets/textures/particles/particle4u.png'),
            maxAge: 2,
            blending: THREE.AdditiveBlending
        });

        var emitter = new SPE.Emitter({
            positionSpread: new THREE.Vector3(10, 15, 100),
            acceleration: new THREE.Vector3(0, 0, -5),
            velocity: new THREE.Vector3(0, 0, -5),

            colorStart: new THREE.Color('white'),
            colorEnd: new THREE.Color('white'),
            sizeStart: 1,
            sizeEnd: 1,
            opacityStart: 0,
            opacityMiddle: 1,
            opacityEnd: 0,

            particleCount: 500
        });

        this.particleGroup.addEmitter( emitter );
        scene.add( this.particleGroup.mesh );
    };


    // ***************************************************************************************
    // Render
    // ***************************************************************************************

    this.render = function () {
        // keep looping
        window.requestAnimationFrame(self.render);

        if (self.particleGroup) {
            self.particleGroup.emitters[0].position = camera.position;
            self.particleGroup.tick(0.016);  //0.016 -> Using a fixed time-step here to avoid pauses
        }

        for (var i = 0; i < self.kanjis.length; i++) {
            self.kanjis[i].update();
        }

        // render scene
        renderer.clear();
        renderer.render(scene, camera);

        // render hud scene
        //renderer.clearDepth();
        //renderer.render(hud.scene, hud.camera);

        // stats
        if (debugStats) {
            //rendererStats.update(renderer);
            stats.update();
        }

    };


    this.resize = function () {
        var width = window.innerWidth;
        var height = window.innerHeight;

        // update camera aspect
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        // update hud camera aspect
        /*cameraHud.left = - width / 2;
        cameraHud.right = width / 2;
        cameraHud.top = height / 2;
        cameraHud.bottom = - height / 2;
        camera.aspect = width / height;
        cameraHud.updateProjectionMatrix();*/


        hud.resize();

        // update renderer size
        renderer.setSize( width, height );
    };


    /*this.locateHudSprite = function (sprite, screenX, screenY) {
        //sprite.position.set( 0, 0, cameraHud.position.z -1 ); // center
        //sprite.position.x = 0 - 0.875;
        //sprite.position.y = 0.95;


        // 0, 0 is center


        var x = window.innerWidth / 2
    };*/




    // ***************************************************************************************
    // Unused
    // ***************************************************************************************

    // TODO: Doesnt work with TextMesh :( -> neither with Spheres (?)
    /*this.createGlowingMesh = function () {

        var geometry	= new THREE.TorusKnotGeometry(1-0.25, 0.25, 32*3, 32);
        //var geometry	= new THREE.TorusGeometry(1-0.25, 0.25);
        //var geometry	= new THREE.SphereGeometry(1, 32, 16);
        //var geometry	= new THREE.CubeGeometry(1,1,1, 10, 10, 10);

        var material = new THREE.MeshLambertMaterial({ color	: new THREE.Color('gray') });
        mesh = new THREE.Mesh( geometry, material ); //mesh.visible = false;
        scene.add( mesh );

        var glowMesh = new THREEx.GeometricGlowMesh(mesh);
        var insideUniforms = glowMesh.insideMesh.material.uniforms;
        insideUniforms.glowColor.value.set('hotpink');
        var outsideUniforms	= glowMesh.outsideMesh.material.uniforms;
        outsideUniforms.glowColor.value.set('hotpink');
        mesh.add(glowMesh.object3d);
    };*/

};