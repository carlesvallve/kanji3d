var Kanji = function () {
    var self = this;


    // ***************************************************************************************
    // Init
    // ***************************************************************************************

    this.init = function (num, data) {
        // props
        this.num = num;
        this.data = data;
        this.speed = 0.075; //0.05 + Math.random() * 0.05; // + Math.random() * 0.2;
        this.color = Math.floor(Math.random() * 16777215);

        // material
        var material = new THREE.SpriteMaterial( {
            map: this.generateKanjiTexture(data.literal),
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
        this.sprite.position.z = num * 18;//(10 + Math.random() * 20);
    };


    // ***************************************************************************************
    // Update
    // ***************************************************************************************

    this.update = function () {
        // move
        this.sprite.position.z -= this.speed;

        // alpha
        if (this.sprite.visible && this.sprite.position.z < 10) {
            this.sprite.material.opacity = this.sprite.position.z / 10;
            if (this.sprite.opacity < 0) { this.sprite.visible = false; }
        }
    };


    // ***************************************************************************************
    // Kanji Texture Generators
    // ***************************************************************************************

    this.generateKanjiTexture = function (text, options) {
        options = { size: 400, color: utils.randomArr(['#000000', '#ffffff']) };
        //return this.generateNormalTexture(text, options);
        return this.generateGlowingTexture(text, options);
    };


    this.generateNormalTexture = function (text, options) {
        options = options || {};
        options.color = options.color || '#' + Math.floor(Math.random() * 16777215).toString(16);
        options.size = options.size || 350;

        var dynamicTexture  = new THREEx.DynamicTexture(512,512);
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

        ctx.fillStyle = options.color;
        ctx.fillText(text, 256, 256);

        return dynamicTexture.texture;
    };


    this.generateGlowingTexture = function(text, options) {
        options = options || {};
        options.color = options.color || '#' + Math.floor(Math.random() * 16777215).toString(16);
        options.size = options.size || 350;

        var dynamicTexture  = new THREEx.DynamicTexture(512,512);
        dynamicTexture.texture.needsUpdate  = true;
        dynamicTexture.clear();

        var ctx = dynamicTexture.context;

        setShadowStyle (ctx,
            'Neon',
            text,
            'bold ' + options.size + 'px Verdana',
            options.color,
            { x: 256, y: 256 }
        );

        return dynamicTexture.texture;
    };

};


