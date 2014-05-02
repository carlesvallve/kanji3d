var Tile = function (tileboard, x, y) {
    // set vars
    var self = this;

    this.x = x;
    this.y = y;

    // create tile elements
    this.elm = domutils.appendChild('div', tileboard.elm, 'tile');
    this.elm.block = domutils.appendChild('div', this.elm, 'block');
    this.elm.kanji = domutils.appendChild('div', this.elm.block, 'kanji');
    this.elm.info = domutils.appendChild('div', this.elm.block, 'info', this.x + ',' + this.y);

    // size
    this.elm.style.width = tileboard.tileSize + 'px';
    this.elm.style.height = tileboard.tileSize + 'px';
    this.elm.block.style.width = (tileboard.tileSize - 4) + 'px';
    this.elm.block.style.height = (tileboard.tileSize - 4) + 'px';

    // location
    this.pos = tileboard.gridToPixel(x, y);
    this.elm.style.webkitTransform = 'translate(' + this.pos.x + 'px, ' + this.pos.y + 'px)';


    this.init = function (x, y, colors, data) {
        // set vars
        this.x = x;
        this.y = y;
        this.colors = colors;
        this.data = data;

        // locate
        this.pos = tileboard.gridToPixel(x, y);
        this.elm.style.webkitTransform = 'translate(' + this.pos.x + 'px, ' + this.pos.y + 'px)';

        // colorize
        this.elm.block.style.backgroundColor = this.colors[0];
        this.elm.block.style.boxShadow =
            '0 1px 2px ' + colors[1] + ', 0 -1px 1px ' + colors[0] + ', inset 0 -1px 1px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.5)';

        // fill with data
        domutils.setText(this.elm.kanji, this.data.literal);
    };


    this.moveTo = function (pos) {
        // set tile on array
        var gridpos = tileboard.pixelToGrid(pos);
        tileboard.setTile(self, gridpos.x, gridpos.y);

        // move tile to new pos
        tweener.tween(this.elm,
            { 'webkitTransform': 'translate(' + pos.x + 'px, ' + pos.y + 'px)' },
            { time: 250, delay: 0, easing: 'ease-in-out' },
            function () {
                domutils.setText(self.elm.info, self.x + ',' + self.y);
            }
        );
    };

};