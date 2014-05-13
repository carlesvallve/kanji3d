var Hud = function () {

    this.init = function () {

        // create hud scene and camera
        // HUD
        this.scene = new THREE.Scene(); // scene.fog = new THREE.FogExp2( 0x222222, 10 );
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 10 );
        this.camera.position.z = 1;

        // get coordinates

        // create hud sprite
        this.sprite = this.createHudSprite('Hello', { width: 512, height: 512, fontSize: 16, color: '#ff0000' });
        this.sprite.position.set( 0, 0, 0 ); // center
        this.scene.add(this.sprite);

        this.resize();

        this.drawText('World');
    };


    this.drawText = function (caption) {
        var options = {};
        //options.width = window.innerWidth * 1;
        //options.height = window.innerHeight * 1;
        options.fontSize = 20; //options.width / 4;
        options.textAlign = ['center', 'center'];

        var texture = this.sprite.material.map;
        texture.needsUpdate  = true;

        var ctx = texture.image.getContext('2d');

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#00ffffff';
        ctx.strokeRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.textAlign = options.textAlign[0]; //'center';
        ctx.textBaseline = options.textAlign[1]; //'middle';
        ctx.font = 'bold ' + options.fontSize + 'px Verdana';
        /*ctx.shadowOffsetX = 1;
         ctx.shadowOffsetY = 1;
         ctx.shadowBlur = 2;
         ctx.shadowColor = '#000000';*/

        ctx.fillStyle = '#ffffff'; //options.color;

        var pos = { x: 0, y: 0 };
        if (ctx.textAlign === 'left') { pos.x = 0; }
        if (ctx.textAlign === 'center') { pos.x = ctx.canvas.width / 2; }
        if (ctx.textAlign === 'right') { pos.x = ctx.canvas.width; }

        if (ctx.textBaseline === 'top') { pos.y = 0; }
        if (ctx.textBaseline === 'middle') { pos.y = ctx.canvas.height / 2; }
        if (ctx.textBaseline === 'bottom') { pos.y = ctx.canvas.height; }

        ctx.fillText(caption, pos.x, pos.y);
    };



    this.createHudSprite = function (text, options) {
        //options = { width: 512, height: 512, fontSize: 400, color: utils.randomArr(['#ffffff', '#ffffff']) };

        options.width = window.innerWidth * 2;
        options.height = window.innerHeight * 2;
        options.fontSize = 20; //options.width / 4;
        options.textAlign = ['center', 'top'];


        var canvas	= document.createElement( 'canvas' );
        canvas.width	= options.width;
        canvas.height	= options.height;
        //var ctx	= canvas.getContext( '2d' );
        // var textSize	= ctx.measureText(text);

        var texture	= new THREE.Texture(canvas);
        //texture.needsUpdate  = true;

        // draw content

        /*ctx.lineWidth = 1;
        ctx.strokeStyle = '#00ffffff';
        ctx.strokeRect(0, 0, options.width, options.height);

        ctx.textAlign = options.textAlign[0]; //'center';
        ctx.textBaseline = options.textAlign[1]; //'middle';
        ctx.font = 'bold ' + options.fontSize + 'px Verdana';
        *//*ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowBlur = 2;
        ctx.shadowColor = '#000000';*//*

        ctx.fillStyle = '#ffffff'; //options.color;

        var pos = { x: 0, y: 0 };
        if (ctx.textAlign === 'left') { pos.x = 0; }
        if (ctx.textAlign === 'center') { pos.x = options.width / 2; }
        if (ctx.textAlign === 'right') { pos.x = options.width; }

        if (ctx.textBaseline === 'top') { pos.y = 0; }
        if (ctx.textBaseline === 'middle') { pos.y = options.height / 2; }
        if (ctx.textBaseline === 'bottom') { pos.y = options.height; }

        console.log(ctx.textAlign, ctx.textBaseline);

        ctx.fillText(text, pos.x, pos.y);*/

        // material
        var material = new THREE.SpriteMaterial( {
            map: texture
            //color: this.color,
            //fog: true,
            //transparent: true,
            //blending: THREE.AdditiveBlending,
            //depthTest: true
        } );

        // sprite
        var sprite = new THREE.Sprite( material );

        return sprite;
    };


    this.resize = function () {
        var width = window.innerWidth;
        var height = window.innerHeight;

        hud.camera.aspect = width / height;
        hud.camera.updateProjectionMatrix();

        var ratio = (width / height);
        //sprite.scale.set(0.25, 0.25 * ratio); //y = 1 / ratio; //set(options.width / 100, options.height / 100);

        this.sprite.scale.set(1.98 * ratio, 1.98);
    };

};