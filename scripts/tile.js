var Tile = function (tileboard, x, y) {
    // set vars
    var self = this;

    this.x = x;
    this.y = y;

    // create tile elements
    this.elm = domutils.appendChild('div', tileboard.board, 'tile');
    this.info = domutils.appendChild('div', this.elm, 'info', '?');

    //console.log(this.info);

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

        // locate tile
        this.pos = tileboard.gridToPixel(x, y);
        this.elm.style.webkitTransform = 'translate(' + this.pos.x + 'px, ' + this.pos.y + 'px)';
        this.elm.style.zIndex = this.pos.y;
    };


    this.moveTo = function (pos, cb) {
        // set tile on array
        var gridpos = tileboard.pixelToGrid(pos);
        tileboard.setTile(self, gridpos.x, gridpos.y);

        // move tile to new pos
        tweener.tween(this.elm,
            { 'webkitTransform': 'translate(' + pos.x + 'px, ' + pos.y + 'px)', zIndex: pos.y },
            { time: 200, delay: 0, easing: window.easing },
            function () {
                // domutils.setText(self.info, self.x + ',' + self.y);

                if (cb) { cb(); }
            }
        );
    };

};