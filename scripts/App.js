var App = function (container) {
    var self = this;

    var scene, controls, camera, lighting, mesh;
    var renderer, rendererStats;


    this.init = function () {
        console.log('Welcome to kanji-3d');

        // RENDERER
        renderer = new THREE.WebGLRenderer(); // { antialias	: false }
        renderer.setSize( window.innerWidth - 10, window.innerHeight - 10 ); // container.clientWidth, container.clientHeight ); /
        renderer.setClearColor(0x222222, 1);
        container.appendChild( renderer.domElement );

        stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0px';
        stats.domElement.style.top = '0px';
        document.body.appendChild(stats.domElement);

        rendererStats   = new THREEx.RendererStats();
        rendererStats.domElement.style.position = 'absolute';
        rendererStats.domElement.style.left = '0px';
        rendererStats.domElement.style.top   = '48px';
        //rendererStats.domElement.style.bottom   = '10px';
        document.body.appendChild( rendererStats.domElement );

        // SCENE
        scene = new THREE.Scene();

        // CAMERA
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 2000 );
        camera.position.z = 5;

        // CONTROLS
        controls = new THREE.OrbitControls(camera);
        controls.btnRotate = 0;
        controls.btnZoom = -1;
        controls.btnPan = 2;
        controls.rotateSpeed = 1.5;
        controls.zoomSpeed = 1.5;
        controls.panSpeed = 1.5;
        controls.minDistance = 4;
        controls.maxDistance = 60;
        controls.minPolarAngle = 0;
        controls.maxPolarAngle = Math.PI;

        // LIGHTING
        lighting = new THREEx.ThreePointsLighting();
        //lighting = new THREEx.SunSetLighting();
        scene.add(lighting);

        // MESH
        //this.createParticles();
        /*for (var i = 0; i < category.length; i++) {
            var str = category[i].literal;
        }*/


        /*var arr = ('赤　男　女　金　雨　甘　愛　対　気　点　空').split('　');
        var sprites = [];
        for (var i = 0; i < 20; i++) {
            sprites.push(this.createKanjiMesh(
                utils.randomArr(arr),
                { size: 400 })
            );
        }*/


        /*var sprite = this.makeTextSprite( "World!",
            { fontsize: 32, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:1.0} } );
        sprite.position.set(0,0,0);
        scene.add( sprite );*/

        //var sprite = new Kanji(scene, )




        /*function generateSprite() {

            var canvas = document.createElement( 'canvas' );
            canvas.width = 512;
            canvas.height = 512;

            var context = canvas.getContext( '2d' );
            var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
            gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
            gradient.addColorStop( 0.2, 'rgba(0,255,255,1)' );
            gradient.addColorStop( 0.4, 'rgba(0,0,64,1)' );
            gradient.addColorStop( 1, 'rgba(0,0,0,1)' );

            context.fillStyle = gradient;
            context.fillRect( 0, 0, canvas.width, canvas.height );

            return canvas;

        }

        function initParticle( particle, delay ) {

            particle = this instanceof THREE.Particle ? this : particle;
            delay = delay !== undefined ? delay : 0;

            particle.position.x = 0;
            particle.position.y = 0;
            particle.position.z = 0;
            particle.scale.x = particle.scale.y = Math.random() * 3 + 1;

            *//*new TWEEN.Tween( particle )
                .delay( delay )
                .to( {}, 10000 )
                .onComplete( initParticle )
                .start();

            new TWEEN.Tween( particle.position )
                .delay( delay )
                .to( { x: Math.random() * 4000 - 2000, y: Math.random() * 1000 - 500, z: Math.random() * 4000 - 2000 }, 10000 )
                .start();

            new TWEEN.Tween( particle.scale )
                .delay( delay )
                .to( { x: 0, y: 0 }, 10000 )
                .start();*//*

        }


        var material = new THREE.ParticleBasicMaterial( { map: new THREE.Texture( generateSprite() ), blending: THREE.AdditiveBlending } );

        for ( var i = 0; i < 1000; i++ ) {

            var particle = new THREE.Particle( material );

            initParticle( particle, i * 10 );

            scene.add( particle );
        }*/





        // Create particle group and emitter
        function initParticles() {
            var particleGroup = new SPE.Group({
                texture: THREE.ImageUtils.loadTexture('assets/textures/particles/star.png'),
                maxAge: 2,
                blending: THREE.AdditiveBlending
            });

            var emitter = new SPE.Emitter({
                positionSpread: new THREE.Vector3(100, 100, 100),

                acceleration: new THREE.Vector3(0, 0, 10),

                velocity: new THREE.Vector3(0, 0, 10),

                colorStart: new THREE.Color('white'),
                colorEnd: new THREE.Color('white'),
                sizeStart: 2,
                sizeEnd: 2,
                opacityStart: 0,
                opacityMiddle: 1,
                opacityEnd: 0,

                particleCount: 2000
            });

            particleGroup.addEmitter( emitter );
            scene.add( particleGroup.mesh );

            return particleGroup;
        }

        //this.particleGroup = initParticles();








        // INIT RENDER
        window.requestAnimationFrame(self.render);
    };


    this.render = function () {
        // keep looping
        window.requestAnimationFrame(self.render);

        // update
        //self.particleGroup.tick( 0.016 ); // Using a fixed time-step here to avoid pauses


        // render
        renderer.render(scene, camera);

        // stats
        rendererStats.update(renderer);
        stats.update();
    };


    this.makeTextSprite = function ( message, parameters ) {
        if ( parameters === undefined ) parameters = {};

        var fontface = parameters.hasOwnProperty("fontface") ?
            parameters["fontface"] : "Arial";

        var fontsize = parameters.hasOwnProperty("fontsize") ?
            parameters["fontsize"] : 18;

        var borderThickness = parameters.hasOwnProperty("borderThickness") ?
            parameters["borderThickness"] : 4;

        var borderColor = parameters.hasOwnProperty("borderColor") ?
            parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };

        var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
            parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

        //var spriteAlignment = THREE.SpriteAlignment.topLeft;

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;

        // get size data (height depends only on font size)
        var metrics = context.measureText( message );
        var textWidth = metrics.width;

        // background color
        context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
            + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
            + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;
        roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
        // 1.4 is extra height factor for text below baseline: g,j,p,q.

        // text color
        context.fillStyle = "rgba(0, 0, 0, 1.0)";

        context.fillText( message, borderThickness, fontsize + borderThickness);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial(
            { map: texture, useScreenCoordinates: false, alignment: spriteAlignment } );
        var sprite = new THREE.Sprite( spriteMaterial );
        sprite.scale.set(100,50,1.0);
        return sprite;
    };




    this.createKanjiMesh = function (text, options) {

        options = options || {};
        options.color = options.color || '#ffffff';
        options.size = options.size || Math.floor(Math.random()*16777215);

        //var mesh	= new THREEx.Text('123');
        //scene.add(mesh)

        var dynamicTexture  = new THREEx.DynamicTexture(512,512);
        //dynamicTexture.canvas the underlying canvas
        //dynamicTexture.context the context of the underlying canvas
        //dynamicTexture.texture the THREE.Texture created

        var geometry = new THREE.PlaneGeometry(1, 1);
        var material = new THREE.MeshLambertMaterial({
            map : dynamicTexture.texture,
            side: THREE.DoubleSide,
            color: Math.floor(Math.random() * 16777215),
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });

        var mesh = new THREE.Mesh( geometry, material );
        mesh.doubleSided = true;
        mesh.side = THREE.DoubleSide;
        scene.add( mesh );

        //When you update a texture be sure to do
        dynamicTexture.texture.needsUpdate  = true;
        dynamicTexture.clear();

        var ctx = dynamicTexture.context;
        /*ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold ' + options.size + 'px Verdana';

        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#cccccc';
        ctx.lineWidth = 1;
        ctx.strokeText(text, 256, 256);

        ctx.fillStyle = options.color;
        ctx.fillText(text, 256, 256);*/

        setShadowStyle (ctx,
            'Neon',
            text,
            'bold ' + options.size + 'px Verdana',
            { x: 256, y: 256 }
        );

        mesh.position.set(-2 + Math.random() * 4, -2 + Math.random() * 4, -2 + Math.random() * 4);



        return mesh;
    };


    this.createGlowingMesh = function () {
        // TODO: Doesnt work with TextMesh :( -> neither with Spheres (?)

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
    };


    this.createParticles = function () {
        for ( i = 0; i < 1000; i ++ ) {

            var vertex = new THREE.Vector3();
            vertex.x = Math.random() * 2000 - 1000;
            vertex.y = Math.random() * 2000 - 1000;
            vertex.z = Math.random() * 2000 - 1000;

            geometry.vertices.push( vertex );

        }

        parameters = [ [ [1.0, 0.2, 0.5], sprite2, 20 ],
            [ [0.95, 0.1, 0.5], sprite3, 15 ],
            [ [0.90, 0.05, 0.5], sprite1, 10 ],
            [ [0.85, 0, 0.5], sprite5, 8 ],
            [ [0.80, 0, 0.5], sprite4, 5 ],
        ];

        for ( i = 0; i < parameters.length; i ++ ) {

            color  = parameters[i][0];
            sprite = parameters[i][1];
            size   = parameters[i][2];

            materials[i] = new THREE.ParticleSystemMaterial( { size: size, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true } );
            materials[i].color.setHSL( color[0], color[1], color[2] );

            particles = new THREE.ParticleSystem( geometry, materials[i] );

            particles.rotation.x = Math.random() * 6;
            particles.rotation.y = Math.random() * 6;
            particles.rotation.z = Math.random() * 6;

            scene.add( particles );

        }
    };



};