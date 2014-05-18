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

        //var drawingFunction = this.drawPixasticGlowingTexture;
        //var drawingFunction = this.drawShadowGlowingTexture;
        var drawingFunction = this.drawNormalTexture;



        // caption
        //var str = ('A B C D E F G H I J K L M N O P Q R S T U V W X Y Z').split(' ')[this.num];
        var str = this.data.literal;

        console.log('=======================================');
        console.log('create Kanji', str);
        console.log('=======================================');

        // texture
        //var texture = this.generatePixasticKanjiTexture(str);
        var texture = this.generateKanjiTexture(
            str,
            {},
            drawingFunction
        );

        // material
        var material = new THREE.SpriteMaterial( {
            map: texture, // this.drawNormalTexture), //
            color: this.color,
            //fog: true,
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
        options = { width: 600, height: 600, fontSize: 300, color: utils.randomArr(['#000000']) }; // 400

        var canvas	= document.createElement( 'canvas' );
        canvas.tagName = 'canvas';
        canvas.width	= options.width;
        canvas.height	= options.height;

        var texture	= new THREE.Texture(canvas);
        texture.needsUpdate  = true;

        drawingFunction(texture.image.getContext('2d'), text, options);

        return texture;
    };


    this.drawPixasticGlowingTexture = function(ctx, text, options) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'normal ' + options.fontSize + 'px Verdana-Bold'; //Verdana-Bold';

        ctx.fillStyle = '#ff00de'; //'#' + Math.floor(Math.random() * 16777215).toString(16); //'#ffffff'; //options.color;
        ctx.fillText(text, options.width / 2, options.height / 2); // text

        Pixastic.process(ctx.canvas, 'glow', { amount: 1.0, radius: 5.0 }, function (pixCanvas) {
            pixCanvas.tagName = 'canvas';
            Pixastic.process(pixCanvas, 'glow', { amount: 1.0, radius: 5.0 }, function (pixCanvas2) {
                pixCanvas2.tagName = 'canvas';
                ctx.drawImage(pixCanvas2, 0, 0);

                ctx.globalAlpha = 0.9;
                ctx.fillStyle = options.color; //'#' + Math.floor(Math.random() * 16777215).toString(16); //'#ffffff'; //options.color;
                ctx.fillText(text, options.width / 2, options.height / 2); // text
            });
        });
    };


    this.drawShadowGlowingTexture = function(ctx, text, options) {
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
        ctx.font = 'normal ' + options.fontSize + 'px Verdana-Bold';

        ctx.fillStyle = '#999999'; //options.color;
        ctx.fillText(text, options.width / 2, options.height / 2); // text
    };
};


