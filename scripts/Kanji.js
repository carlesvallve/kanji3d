var Kanji = function (scene) {
    var self = this;


    this.init = function (data) {
        this.data = data;

        var texture = this.generateGlowingTexture(data.literal); //new THREE.Texture( generateSprite() ); //THREE.ImageUtils.loadTexture( 'assets/textures/particles/star.png' );

        var material = new THREE.SpriteMaterial( {
            map: texture,
            color: Math.floor(Math.random() * 16777215),
            fog: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthTest: false
        } );

        this.sprite = new THREE.Sprite( material );
        scene.add( this.sprite );
    };


    this.generateNormalTexture = function (text, options) {
        options = options || {};
        options.color = options.color || Math.floor(Math.random() * 16777215);
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

        ctx.fillStyle = Math.floor(Math.random() * 16777215); //options.color;
        ctx.fillText(text, 256, 256);

        return dynamicTexture.texture;
    };


    this.generateGlowingTexture = function(text, options) {
        options = options || {};
        options.color = options.color || Math.floor(Math.random() * 16777215);
        options.size = options.size || 350;

        var dynamicTexture  = new THREEx.DynamicTexture(512,512);
        dynamicTexture.texture.needsUpdate  = true;
        dynamicTexture.clear();

        var ctx = dynamicTexture.context;

        setShadowStyle (ctx,
            'Neon',
            text,
            'bold ' + options.size + 'px Verdana',
            { x: 256, y: 256 }
        );

        return dynamicTexture.texture;
    };

};


