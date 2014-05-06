var Tile = function (tileboard, x, y) {
    // set vars
    var self = this;

    this.x = x;
    this.y = y;

    // create tile elements
    this.elm = domutils.appendChild('div', tileboard.board, 'tile');
    //this.info = domutils.appendChild('div', this.elm, 'info', '?');


    // size
    this.elm.style.width = '40px';
    this.elm.style.height = '37px';

    // location
    this.pos = tileboard.gridToPixel(x, y);
    this.elm.style.webkitTransform = 'translate(' + this.pos.x + 'px, ' + this.pos.y + 'px)';


    this.init = function (x, y, color, data) {
        // set vars
        this.x = x;
        this.y = y;
        this.color = color;
        this.data = data;

        // set tile class
        this.elm.className = 'tile button ' + this.color;

        // set tile text
        domutils.setText(this.elm, this.data.literal);
        //domutils.setText(this.elm, this.x + ',' + this.y);

        // locate tile
        this.pos = tileboard.gridToPixel(x, y);
        this.elm.style.webkitTransform = 'translate(' + this.pos.x + 'px, ' + this.pos.y + 'px)';
        this.elm.style.zIndex = this.pos.y;
    };


    this.moveTo = function (pos, options, cb) {
        this.moving = true;

        options = {
            time: options.time || 250,
            delay: options.delay || 0,
            easing: options.easing || window.easing
        };

        // move tile to new pos
        tweener.tween(this.elm,
            { webkitTransform: 'translate(' + pos.x + 'px, ' + pos.y + 'px)', zIndex: pos.y },
            { time: options.time, delay: options.delay || 0, easing: options.easing },
            function () {
                self.moving = false;
                if (cb) { cb(); }
            }
        );
    };


    this.destroy = function (time) {
        tileboard.setTile(null, self.x, self.y);

        tweener.tween(this.elm,
            { webkitTransform: 'translate(' + this.pos.x + 'px, ' + this.pos.y + 'px) scale(0.01)', opacity: 0 },
            { time: time, delay: 0, easing: 'ease-in' },
            function () {
                self.elm.style.display = 'none';
            }
        );
    };

};