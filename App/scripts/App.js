var App = function (container) {
    var self = this;

    var stats;

    var camera, scene, renderer;
    var controls;

    var objects = [];
    var targets = { row: [], table: [], sphere: [], helix: [], grid: [] };
    var shape = 'table';

    var tweening = false;


    // ***************************************************************************************
    // Init
    // ***************************************************************************************

    this.init = function () {

        // set camera
        camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 3000;

        // set scene
        scene = new THREE.Scene();

        // set stats
        stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);

        // create elements
        this.createElements();

        // set shapes
        this.setShapes();

        // set renderer
        renderer = new THREE.CSS3DRenderer();
        renderer.setClearColor(0xffffff);
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.domElement.style.position = 'absolute';
        document.getElementById( 'container' ).appendChild( renderer.domElement );

        // set controls
        controls = new THREE.TrackballControls( camera, renderer.domElement );
        controls.rotateSpeed = 0.5;
        controls.minDistance = 500;
        controls.maxDistance = 6000;
        controls.addEventListener( 'change', this.render );

        // set hud
        this.initHud();

        // display elements in table shape
        window.setTimeout(function () {
            self.transform( targets.table, 500 );
        }, 500);

        window.setTimeout(function () {
            // set resize
            window.addEventListener( 'resize', self.onWindowResize, false );

            // start animating
            self.animate();
        }, 500);
    };


    // ***************************************************************************************
    // Elements
    // ***************************************************************************************

    this.createElements = function () {

        this.category = kanjidic.filterByCategory(4, 'jlpt', 'freq');
        this.kanjis = [];

        console.log(this.category.length);

        for (var i = 0; i < this.category.length; i++) {
            var data = this.category[i];

            // set rgb
            var r = utils.randomInt(0, 255);
            var g = utils.randomInt(0, 255);
            var b = utils.randomInt(0, 255);

            // element
            var element = document.createElement( 'div' );
            element.className = 'element';
            element.style.backgroundColor = 'rgba(' + Math.round(r / 2) + ',' + Math.round(g / 2) + ',' + Math.round(b / 2) + ',' + ( Math.random() * 0.5 + 0.25 ) + ')';
            //element.style.border = '1px solid rgba(' + Math.round(g / 2) + ',' + Math.round(g / 2) + ',' + Math.round(g / 2) + ',0.75)';
            element.style.boxShadow =  '0px 0px 12px rgba(' + r + ',' + g + ',' + b + ', 0.5)';

            // number
            var number = document.createElement( 'div' );
            number.className = 'number';
            number.textContent = utils.randomArr(data.readings.onyomi) || '?';
            number.style.color = 'rgba(255, 255, 255, 0.5)';
            element.appendChild( number );

            // symbol
            var symbol = document.createElement( 'div' );
            symbol.className = 'symbol';
            symbol.textContent = data.literal;
            symbol.style.color = 'rgba(255, 255, 255, 0.65)';
            symbol.style.textShadow = '0 0 10px rgba(' + r + ',' + g + ',' + b + ',0.95)';
            element.appendChild( symbol );

            // details
            var details = document.createElement( 'div' );
            details.className = 'details';
            details.innerHTML = (utils.randomArr(data.readings.eng)  || '?') + '<br>' + (utils.randomArr(data.readings.kunyomi) || '?');
            details.style.color = 'rgba(255, 255, 255, 0.65)';
            element.appendChild( details );

            // 3d object
            var object = new THREE.CSS3DObject( element );
            var d = 2000;
            object.position.x = Math.random() * d - d / 2;
            object.position.y = Math.random() * d - d / 2;
            object.position.z = Math.random() * d - d / 2;
            scene.add( object );

            // record object
            object.element = element;
            objects.push( object );
        }
    };


    this.updateElements = function () {

        if (tweening) { return; }

        for ( var i = 0, l = objects.length; i < l; i ++ ) {
            var object = objects[i];

            if (shape === 'row') {
                object.position.z += 25;

                if (object.position.z > -300 && object.position.z < 2800) {
                    object.element.style.display = 'block';
                } else {
                    object.element.style.display = 'none';
                }
            }

            else if (shape === 'grid') {
                object.position.z += 25;

                if (object.position.z > 2800) {
                    object.position.z -= 4000;
                    object.element.style.display = 'block';
                }
            }

            else {
                object.element.style.display = 'block';
            }

        }
    };


    // ***************************************************************************************
    // Shapes
    // ***************************************************************************************

    this.setShapes = function () {

        var i, l, object, vector;
        var phi, theta;

        // table

        var x = 0, y = 0, z = 0, cols = 10;

        for ( i = 0, l = objects.length; i < l; i ++ ) {
            object = new THREE.Object3D();

            if (i > 0) {
                x += 140;
                if (x > cols * 140) { x = 0; y += 200; }
            }

            object.position.x = x - cols / 2 * 140;
            object.position.y = - 100 -y  + (objects.length / cols * 200 / 2);
            object.position.z = z;

            targets.table.push( object );
        }

        // row

        for ( i = 0, l = objects.length; i < l; i ++ ) {
            object = new THREE.Object3D();

            object.position.x = 0;
            object.position.y = 0;
            object.position.z = 0 - i * 3000;

            targets.row.push( object );
        }

        // sphere

        vector = new THREE.Vector3();

        for ( i = 0, l = objects.length; i < l; i ++ ) {

            phi = Math.acos( -1 + ( 2 * i ) / l );
            theta = Math.sqrt( l * Math.PI ) * phi;

            object = new THREE.Object3D();

            object.position.x = 800 * Math.cos( theta ) * Math.sin( phi );
            object.position.y = 800 * Math.sin( theta ) * Math.sin( phi );
            object.position.z = 800 * Math.cos( phi );

            vector.copy( object.position ).multiplyScalar( 2 );

            object.lookAt( vector );

            targets.sphere.push( object );

        }

        // helix

        vector = new THREE.Vector3();

        for ( i = 0, l = objects.length; i < l; i ++ ) {

            phi = i * 0.175 + Math.PI;

            object = new THREE.Object3D();

            object.position.x = 900 * Math.sin( phi );
            object.position.y = - ( i * 8 ) + 450;
            object.position.z = 900 * Math.cos( phi );

            vector.x = object.position.x * 2;
            vector.y = object.position.y;
            vector.z = object.position.z * 2;

            object.lookAt( vector );

            targets.helix.push( object );

        }

        // grid

        for ( i = 0, l = objects.length; i < l; i ++ ) {

            object = new THREE.Object3D();

            object.position.x = ( ( i % 5 ) * 400 ) - 800;
            object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
            object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

            targets.grid.push( object );

        }
    };


    // ***************************************************************************************
    // Transform
    // ***************************************************************************************

    this.transform = function ( targets, duration ) {

        tweening = true;
        function end() {
            tweening = false;
        }

        TWEEN.removeAll();

        var easing = TWEEN.Easing.Sinusoidal.InOut;

        for ( var i = 0; i < objects.length; i ++ ) {

            var object = objects[ i ];
            var target = targets[ i ];

            new TWEEN.Tween( object.position )
                .to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
                .easing( easing )
                .onComplete( end )
                .start();

            new TWEEN.Tween( object.rotation )
                .to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
                .easing( easing )
                .start();

        }
    };


    // ***************************************************************************************
    // Render
    // ***************************************************************************************

    this.onWindowResize = function () {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

        //this.render();
    };

    this.animate = function () {

        requestAnimationFrame( self.animate );

        self.updateElements();

        TWEEN.update();

        controls.update();

        stats.update();

        self.render();

    };

    this.render = function () {

        renderer.render( scene, camera );

    };


    // ***************************************************************************************
    // Hud
    // ***************************************************************************************

    this.initHud = function () {
        var button;

        button = document.getElementById( 'row' );
        button.addEventListener( 'click', function ( event ) {

            self.transform( targets.row, 500 );
            shape = 'row';

        }, false );

        button = document.getElementById( 'table' );
        button.addEventListener( 'click', function ( event ) {

            self.transform( targets.table, 500 );
            shape = 'table';

        }, false );

        button = document.getElementById( 'sphere' );
        button.addEventListener( 'click', function ( event ) {

            self.transform( targets.sphere, 500 );
            shape = 'sphere';

        }, false );

        button = document.getElementById( 'helix' );
        button.addEventListener( 'click', function ( event ) {

            self.transform( targets.helix, 500 );
            shape = 'helix';

        }, false );

        button = document.getElementById( 'grid' );
        button.addEventListener( 'click', function ( event ) {

            self.transform( targets.grid, 500 );
            shape = 'grid';

        }, false );
    };
};

