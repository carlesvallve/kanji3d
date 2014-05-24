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

        if (window.ejecta) {
            this.data.literal = utils.decode_utf8(this.data.literal);
        }

        var drawingFunction = this.drawPixasticGlowingTexture;
        //var drawingFunction = this.drawShadowGlowingTexture;
        //var drawingFunction = this.drawNormalTexture;

        console.log('====================================');
        console.log('Kanji', num, this.data.literal);

        // texture
        var texture = this.generateKanjiTexture(
            this.data.literal,
            {},
            drawingFunction
        );

        // material
        var material = new THREE.SpriteMaterial( {
            map: texture,
            color: this.color,
            //fog: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: true
        } );

        // sprite
        this.sprite = new THREE.Sprite( material );
        this.sprite.scale.multiplyScalar(3);
        this.sprite.material.opacity = 0;
        //this.sprite.fog = true;

        // locate
        var d = 0.0;
        this.sprite.position.x = -d + (Math.random() * d * 2);
        this.sprite.position.y = -d + (Math.random() * d * 2);
        this.sprite.position.z = camera.position.z / 2 + (num + 1) * kanjiDistance;
    };


    // ***************************************************************************************
    // Update
    // ***************************************************************************************

    this.update = function () {
        // move
        this.sprite.position.z -= this.speed;

        // alpha
        var d = this.sprite.position.distanceTo(camera.position);

        // far
        if (d < kanjiDistance + 7) {
            if (this.sprite.material.opacity < 1) {
                this.sprite.material.opacity += 0.01;
            }
        }

        // near
        if (d < 11) {
            if (this.sprite.material.opacity > 0) {
                this.sprite.material.opacity -= 0.025;
            }
        }
    };


    // ***************************************************************************************
    // Kanji Texture Generator
    // ***************************************************************************************

    this.generateKanjiTexture = function (text, options, drawingFunction) {
        options = { width: 128, height: 128, fontSize: 96, color: utils.randomArr(['#000000']) };

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
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'normal ' + options.fontSize + 'px Verdana-Bold';

        ctx.fillStyle = '#ff00de'; //'#ff00de'; //'#ffffff';
        ctx.fillText(text, options.width / 2, options.height / 2);

        Pixastic.process(ctx.canvas, 'glow', { amount: 1.0, radius: 1.0 }, function (pixCanvas) {
            pixCanvas.tagName = 'canvas';
            ctx.drawImage(pixCanvas, 0, 0);

            //ctx.globalAlpha = 0.5;
            ctx.fillStyle = options.color; //'#' + Math.floor(Math.random() * 16777215).toString(16);
            ctx.fillText(text, options.width / 2, options.height / 2);
        });
    };


    this.drawShadowGlowingTexture = function(ctx, text, options) {
        canvasutils.setShadowStyle (ctx, 'Neon', text,
            { weight: 'bold', size: options.fontSize, family: 'Verdana-Bold', color: options.color },
            { x: options.width / 2, y: options.height / 2 }
        );
    };


    this.drawNormalTexture = function (ctx, text, options) {
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'normal ' + options.fontSize + 'px Verdana-Bold';

        ctx.fillStyle = '#999999'; //options.color;
        ctx.fillText(text, options.width / 2, options.height / 2); // text
    };
};


