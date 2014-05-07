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
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 100 );
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


        var arr = ('赤　男　女　金　雨　甘　愛　対　気　点　空').split(' ');
        var sprites = [];
        for (var i = 0; i < 20; i++) {
            sprites.push(this.createKanjiMesh(
                utils.randomArr(arr),
                { size: 400 })
            );
        }


        // INIT RENDER
        window.requestAnimationFrame(self.render);
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
            //blending: THREE.AdditiveBlending, depthTest: false
        });

        var mesh = new THREE.Mesh( geometry, material );
        mesh.doubleSided = true;
        mesh.side = THREE.DoubleSide;
        scene.add( mesh );

        //When you update a texture be sure to do
        dynamicTexture.texture.needsUpdate  = true;
        dynamicTexture.clear();
        
        var ctx = dynamicTexture.context;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold ' + options.size + 'px Verdana';

        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#cccccc';
        ctx.lineWidth = 1;
        ctx.strokeText(text, 256, 256);

        //var gradient = ctx.createLinearGradient(0, 0, 512, 512);
        //gradient.addColorStop(0, "rgb(255, 0, 0)");
        //gradient.addColorStop(1, "rgb(255, 255, 0)");
        //ctx.fillStyle = gradient;
        ctx.fillStyle = options.color;
        ctx.fillText(text, 256, 256);

        /*setShadowStyle (ctx,
            'Neon',
            text,
            'bold ' + options.size + 'px Verdana',
            { x: 256, y: 256 }
        );*/

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


    this.render = function () {
        // keep looping
        window.requestAnimationFrame(self.render);

        // update
        stats.update();
        rendererStats.update(renderer);

        // render
        renderer.render(scene, camera);
    };
};