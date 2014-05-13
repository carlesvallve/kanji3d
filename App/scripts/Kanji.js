var Kanji = function () {
    var self = this;


    // ***************************************************************************************
    // Init
    // ***************************************************************************************

    this.init = function (num, data) {
        // props
        this.num = num;
        this.data = data;
        this.speed = kanjiSpeed; //0.05 + Math.random() * 0.05; // + Math.random() * 0.2;
        this.color = Math.floor(Math.random() * 16777215);

        // material
        var material = new THREE.SpriteMaterial( {
            map: this.generateKanjiTexture('Hi', {}, this.drawGlowingTexture), // this.drawNormalTexture), //
            color: this.color,
            fog: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: true
        } );

        // sprite
        this.sprite = new THREE.Sprite( material );
        this.sprite.scale.multiplyScalar(10);
        this.sprite.fog = true;

        // locate
        var d = 0.0;
        this.sprite.position.x = -d + (Math.random() * d * 2); //utils.randomInt(-d, d);
        this.sprite.position.y = -d + (Math.random() * d * 2);
        this.sprite.position.z = camera.position.z / 2 + (num + 1) * kanjiDistance;//(10 + Math.random() * 20);
    };


    // ***************************************************************************************
    // Update
    // ***************************************************************************************

    this.update = function () {
        // move
        this.sprite.position.z -= this.speed;

        // alpha
        var d = this.sprite.position.distanceTo(camera.position);

        if ((kanjiDistance + 6 - d) < 10) {
            this.sprite.material.opacity = (kanjiDistance + 6 - d) / 10;
        }

        if (this.sprite.visible && d < 8) {
            this.sprite.material.opacity = d / 8;
        }

        /*if (this.sprite.visible && d < 8) {
            this.sprite.material.opacity -= this.speed / 8; //d / 8; //0.015; //d / 8;
        }*/
    };


    // ***************************************************************************************
    // Kanji Texture Generator
    // ***************************************************************************************

    this.generateKanjiTexture = function (text, options, drawingFunction) {
        options = { width: 600, height: 600, fontSize: 400, color: utils.randomArr(['#ffffff']) };

        var canvas	= document.createElement( 'canvas' );
        canvas.width	= options.width;
        canvas.height	= options.height;

        var texture	= new THREE.Texture(canvas);
        texture.needsUpdate  = true;

        drawingFunction(texture.image.getContext('2d'), text, options);

        return texture;
    };


    this.drawGlowingTexture = function(ctx, text, options) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);


        canvasutils.setShadowStyle (ctx, 'Neon', text,
            { weight: 'bold', size: options.fontSize, family: 'Verdana-Bold', color: options.color },
            { x: options.width / 2, y: options.height / 2 }
        );
    };


    this.drawNormalTexture = function (ctx, text, options) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'normal ' + options.fontSize + 'px Verdana-Bold'; //Verdana-Bold';

        /*ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#cccccc';
        ctx.lineWidth = 1;
        ctx.strokeText(text, options.width / 2, options.height / 2);*/

        ctx.fillStyle = '#999999'; //options.color;
        ctx.fillText('V', options.width / 2, options.height / 2); // text

        console.log('>>>', '赤', decodeURI(text));
    };
};


