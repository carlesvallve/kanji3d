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
        // escape if no swipe direction
        if (!dir) { return; }

        // get both tiles
		var tile1 = self.getTileAtPos(pos);
        var tile2 = self.getTileAtPos( { x: pos.x + dir.x * self.tileSize, y: pos.y + dir.y * self.tileSize });

        // get both positions
        var pos1 = { x: tile1.pos.x, y: tile1.pos.y };
        var pos2 = { x: tile2.pos.x, y: tile2.pos.y };

        // move both tiles to new positions
        tile1.moveTo(pos2);
        tile2.moveTo(pos1);
	};

	swipedetect(this.elm, this.swipeTiles);
};

