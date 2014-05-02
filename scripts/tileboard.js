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
        var gridpos = tileboard.pixelToGrid(pos);
        tileboard.setTile(self, gridpos.x, gridpos.y);

        tweener.tween(this.elm,
            { 'webkitTransform': 'translate(' + pos.x + 'px, ' + pos.y + 'px)' },
            { time: 500, delay: 0, easing: 'ease-in-out' },
            function () {



                domutils.setText(self.elm.info, self.x + ',' + self.y);
            }
        );
    };

};


var Tileboard = function (container, width, height) {
	// set vars
	var self = this;

	this.tileSize = 52;
	this.width = width;
	this.height = height;
    this.x = 10;
    this.y = 10;


	// create tileboard elements

	this.elm = domutils.appendChild('div', container, 'tileboard');
	this.elm.style.width = (width * this.tileSize) + 'px';
	this.elm.style.height = (height * this.tileSize) + 'px';


    // create tiles

    this.createTiles = function () {
        this.tiles = [];
        for (var y = 0; y < this.height; y++) {
            this.tiles.push([]);
            for (var x = 0; x < this.width; x++) {
                this.tiles[y].push(new Tile(this, x, y));
            }
        }
    };



	// initialize chapter

	this.initChapter = function (category, chapterNum) {
		// set chapter vars
		this.chapter = {
			kanjis:[],
			colors: [['#f00', '#900'], ['#390', '#330'], ['#099', '#033'], ['#f90', '#930']]
		};

		// get kanjis on current chapter num
		for (var i = chapterNum - 1; i < chapterNum + 3; i++) {
			this.chapter.kanjis.push(category[i]);
		}

		// initialize current chapter tiles
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				var num = utils.randomInt(0, 3);
				this.tiles[y][x].init(x, y, this.chapter.colors[num], this.chapter.kanjis[num]);
			}
		}
	};


    this.gridToPixel = function (x, y) {
        return {
            x: x * this.tileSize,
            y: y * this.tileSize
        };
    };


    this.pixelToGrid = function (pos) {
        return {
            x: Math.floor(pos.x / this.tileSize),
            y: Math.floor(pos.y / this.tileSize)
        };
    };


    this.getTileAtPos = function (pos) {
        pos = this.pixelToGrid(pos);
        return this.tiles[pos.y][pos.x];
    };


    this.setTile = function (tile, x, y) {
        tile.x = x;
        tile.y = y;
        tile.pos = this.gridToPixel(x, y);
        this.tiles[y][x] = tile;
    };


	// swipe tiles

	this.swipeTiles = function (pos, dir) {
        //pos = { x: pos.x - self.x, y: pos.y - self.y };

		var tile1 = self.getTileAtPos(pos);
        var tile2 = self.getTileAtPos( { x: pos.x + dir.x * self.tileSize, y: pos.y + dir.y * self.tileSize });

        var pos1 = { x: tile1.pos.x, y: tile1.pos.y };
        var pos2 = { x: tile2.pos.x, y: tile2.pos.y };

        tile1.moveTo(pos2);
        tile2.moveTo(pos1);
	};

	swipedetect(this.elm, this.swipeTiles);
};


