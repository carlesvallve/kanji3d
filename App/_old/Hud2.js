var cameraOrtho, sceneOrtho;

var Hud2 = function () {
    var self = this;


    this.init = function () {
        var width = window.innerWidth;
        var height= window.innerHeight;

        sceneOrtho = new THREE.Scene();
        cameraOrtho = new THREE.OrthographicCamera( - width / 2, width / 2, height / 2, - height / 2, 0.1, 2000 );
        cameraOrtho.position.z = 10;




        var sprite = this.createSprite('Hello', { width: 512, height: 512, fontSize: 16, color: '#ff0000' });
        scene.add(sprite);
        console.log(sprite);

        this.testSprite = sprite;
    };


    this.createSprite = function (text, options) {
        //options = { width: 512, height: 512, fontSize: 400, color: utils.randomArr(['#ffffff', '#ffffff']) };

        // texture

        var dynamicTexture  = new THREEx.DynamicTexture(options.width, options.height);
        dynamicTexture.texture.needsUpdate  = true;
        dynamicTexture.clear();
        var ctx = dynamicTexture.context;

        // draw content

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold ' + options.fontSize + 'px Verdana';
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 2;
        ctx.shadowColor = '#000000';
        ctx.lineWidth = 1;
        //ctx.strokeRect(0, 0, options.width, options.height);

        ctx.strokeText(text, options.width / 2, options.height / 2);
        ctx.fillStyle = '#999999'; //options.color;
        ctx.fillText(text, options.width / 2, options.height / 2);

        // material
        var material = new THREE.SpriteMaterial( {
            map: dynamicTexture.texture
            //color: this.color,
            //fog: true,
            //transparent: true,
            //blending: THREE.AdditiveBlending,
            //depthTest: true
        } );

        // sprite
        var sprite = new THREE.Sprite( material );
        this.updateSprite(sprite);

        return sprite;
    };


    this.updateSprite = function (sprite) {
        var width = window.innerWidth / 2;
        var height = window.innerHeight / 2;

        var material = sprite.material;

        var imageWidth = material.map.image.width / 2;
        var imageHeight = material.map.image.height / 2;

        sprite.position.set( 0, 0, camera.position.z -1.1 ); // center
        //sprite.position.set( - width + imageWidth,   height - imageHeight, camera.position.z + 1 ); // top left
        //sprite.position.set(   width - imageWidth,   height - imageHeight, 1 ); // top right
        //sprite.position.set( - width + imageWidth, - height + imageHeight, 1 ); // bottom left
        //sprite.position.set(   width - imageWidth, - height + imageHeight, 1 ); // bottom right*/
    };


    this.render = function () {
        renderer.clearDepth();
        renderer.render( sceneOrtho, cameraOrtho );

        self.updateSprite(self.testSprite);
    };


    this.resize = function () {
        var width = window.innerWidth;
        var height = window.innerHeight;

        cameraOrtho.left = - width / 2;
        cameraOrtho.right = width / 2;
        cameraOrtho.top = height / 2;
        cameraOrtho.bottom = - height / 2;
        cameraOrtho.updateProjectionMatrix();

        self.updateSprite(self.testSprite);
    };

};