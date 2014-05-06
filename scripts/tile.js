var Tile = function (tileboard, x, y) {
    // set vars
    var self = this;

    this.x = x;
    this.y = y;

    // create tile elements
    this.elm = domutils.appendChild('div', tileboard.board, 'tile');
    this.label = domutils.appendChild('div', this.elm, 'tileLabel');

    //this.info = domutils.appendChild('div', this.elm, 'info', '?');
    /*this.bubble = domutils.appendChild('div', document.body, 'bubble');
    this.bubble.label = domutils.appendChild('div', this.bubble, 'bubbleLabel');
    this.bubble.style.visibility = 'hidden';*/

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
        this.elm.className = 'tile button ' + this.color || 'gray';

        // set tile text
        if (this.data) {
            domutils.setText(this.label, this.data.literal);
        }

        // locate tile
        this.pos = tileboard.gridToPixel(x, y);
        this.elm.style.webkitTransform = 'translate(' + this.pos.x + 'px, ' + this.pos.y + 'px)';
        this.elm.style.zIndex = this.pos.y;

        //this.bubble.style.webkitTransform = 'translate(' + (this.pos.x + 8) + 'px, ' + (this.pos.y + 148) + 'px)';
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
        //tileboard.setTile(null, self.x, self.y);
        this.originalColor = this.color;
        this.color = null;

        tweener.tween(this.elm,
            { webkitTransform: 'translate(' + this.pos.x + 'px, ' + this.pos.y + 'px) scale(0.01)', opacity: 0 },
            { time: time, delay: 0, easing: 'ease-in' },
            function () {
                self.elm.style.display = 'none';
            }
        );

    };
};