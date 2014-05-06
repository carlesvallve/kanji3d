var Tileboard = function (container, width, height) {
	// set vars
	var self = this;

	this.tileSize = 44;
	this.width = width;
	this.height = height;
    this.x = 10;
    this.y = 10;


	// create tileboard elements

	this.elm = domutils.appendChild('div', container, 'tileboardArea');
    this.elm.style.webkitTransform = 'translate(0, 120%)';

    this.board = domutils.appendChild('div', this.elm, 'tileboard');
	this.board.style.width = (width * this.tileSize) + 'px';
	this.board.style.height = (height * this.tileSize) + 'px';


    this.init = function () {
        // create empty tiles
        this.createTiles();

        //this.createTileBubbles();

        // initialize tileboard at chapter 1 of category jlpt4
        var category = kanjidic.filterByCategory(4, 'jlpt', 'freq');
        self.initChapter(category, 2);

        // initialize tiles with chapter data
        this.initTiles();



        // display tileboard
        tweener.tween(this.elm,
            { 'webkitTransform': 'translate(0, 0)' }, { time: 500, delay: 0, easing: window.easing },
            function () {});
    };


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


    /*this.createTileBubbles = function () {
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var tile = this.tiles[y][x];
                tile.bubble = domutils.appendChild('div', document.body, 'bubble');
                tile.bubble.style.display = 'none';
            }
        }
    };*/


	// initialize chapter

	this.initChapter = function (category, chapterNum) {
		// set chapter vars
		this.chapter = {
			kanjis:[],
            colors: ['white', 'orange', 'pink', 'cyan'], //, 'gray'
            counter: [0, 0, 0, 0]
		};

		// get kanjis on current chapter num
        var max = this.chapter.colors.length;
        var start = max * (chapterNum - 1);
        var end = start + max;

        var str = '';
		for (var i = start; i < end; i++) {
			this.chapter.kanjis.push(category[i]);
            str +=' ' + category[i].literal;
		}
        console.log('chapter' + chapterNum + ':' + str);
	};


    // initialize tiles

    this.initTiles = function () {
        var num, max = this.chapter.colors.length;

        function setRandomTile(tile) {
            num = utils.randomInt(0, max - 1);
                self.chapter.counter[num] += 1;
                tile.init(x, y, self.chapter.colors[num], self.chapter.kanjis[num]);
                self.checkAllMatches();
        }

        // initialize current chapter tiles
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var tile = this.getTile(x, y);

                // make sure that new tiles never match when initialized
                tile.matches = { x: 3, y: 3, all: 3 };

                if (window.matchingMode === 'line') {
                    while (tile.matches.x >= 3) {
                        setRandomTile(tile);
                    }
                    while (tile.matches.y >= 3) {
                        setRandomTile(tile);
                    }
                } else {
                    while (tile.matches.all >= 3) {
                        setRandomTile(tile);
                    }
                }
            }
        }
    };


    this.gridToPixel = function (x, y) {
        return {
            x: x * (this.tileSize),
            y: y * (this.tileSize)
        };
    };


    this.pixelToGrid = function (pos) {
        return {
            x: Math.floor(pos.x / (this.tileSize)),
            y: Math.floor(pos.y / (this.tileSize))
        };
    };


    this.getTileAtPos = function (pos) {
        pos = this.pixelToGrid(pos);
        return this.tiles[pos.y][pos.x];
    };


    this.getTile = function (x, y) {
        if (x < 0 || y < 0 || x > this.width - 1 || y > this.height - 1) { return null; }
        return this.tiles[y][x];
    };


    this.setTile = function (tile, x, y) {
        self.tiles[y][x] = tile;
        if (!tile) { return null; }

        tile.x = x;
        tile.y = y;
        tile.pos = self.gridToPixel(x, y);

        return tile;
        //domutils.setText(tile.elm, tile.x + ',' + tile.y);
    };


	// swipe tiles

	this.swipeTiles = function (pos, dir) {
        // escape if no swipe direction
        if (!dir) { return; }

        // get both tiles
		var tile1 = self.getTileAtPos(pos);
        var tile2 = self.getTileAtPos( { x: pos.x + dir.x * self.tileSize, y: pos.y + dir.y * self.tileSize });

        if (!tile1 || !tile2) { return; }
        if (!tile1.color || !tile2.color) { return; }
        if (tile1.moving || tile2.moving) { return; }

        // get both positions
        var pos1 = { x: tile1.pos.x, y: tile1.pos.y, gx: tile1.x, gy: tile1.y };
        var pos2 = { x: tile2.pos.x, y: tile2.pos.y, gx: tile2.x, gy: tile2.y };

        // move both tiles to new positions

        // move tile1 to pos2
        self.setTile(tile1, pos2.gx, pos2.gy);
        tile1.moveTo(pos2, { time: 250 });

        // move tile2 to pos1
        self.setTile(tile2, pos1.gx, pos1.gy);
        tile2.moveTo(pos1, { time: 250 });

        self.wait(tile1.elm, 260, function () {
            self.checkAllMatches();
            self.destroyMatchingTiles();
        });
	};

	swipedetect(this.board, this.swipeTiles);


    // check for tileboard matches

    this.checkAllMatches = function () {
        if (window.matchingMode === 'line') {
            self.checkMatches('x');
            self.checkMatches('y');
        } else {
            self.checkMatches('all');
        }
    };


    this.checkMatches = function (dir) { // x, y, all

        function floodFill(tile, x, y, dir) {
            // get new tile
            var target = self.getTile(x, y);

            // escape if no target or target is of different color
            if (!target || target.color === null || target.color !== tile.color) { return; }

            // escape if target is already visited
            for (var i = 0; i < tile.visited.length; i++) {
                if (target === tile.visited[i]) { return; }
            }

            // add +1 to matches
            tile.matches[dir] += 1;

            // add target tile to visited array
            tile.visited.push(target);

            // recurse to next target in 4 directions
            if (dir === 'x' || dir === 'all') {
                if (x > 0) { floodFill(tile, x - 1, y, dir); }
                if (x < self.width - 1) { floodFill(tile, x + 1, y, dir); }
            }

            if (dir === 'y' || dir === 'all') {
                if (y > 0) { floodFill(tile, x, y - 1, dir); }
                if (y < self.height - 1) { floodFill(tile, x, y + 1, dir); }
            }
        }

        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                var tile = this.getTile(x, y);
                if (tile && tile.color) {
                    tile.matches = tile.matches || {};
                    tile.matches[dir] = 0;
                    tile.visited = [];
                    floodFill(tile, tile.x, tile.y, dir);
                }
            }
        }
    };


    this.destroyMatchingTiles = function() {

        // destroy all matching tiles
        for (var x = 0; x < self.width; x++) {
            for (var y = 0; y < self.height; y++) {
                var tile = self.getTile(x, y);
                if (window.matchingMode === 'line') {
                    if (tile.color && tile.matches.x >= 3 || tile.matches.y >= 3) {
                        tile.destroy(125);
                    }
                } else {
                    if (tile.color && tile.matches.all >= 3) {
                        tile.destroy(125);
                    }
                }
            }
        }

        // generate word rects over matching kanjis
        this.generateWordRects();

        // aply gravity on upper tiles
        /*this.wait(this.board, 125, function () {
            self.applyGravity();
        });*/
    };


    this.generateWordRects = function () {
        var rects = [];

        var x, y, tile, rect;

        // check horizontal rects
        for (y = 0; y < self.height; y++) {
            rect = null;
            for (x = 0; x < self.width; x++) {
                tile = this.getTile(x, y);
                if (tile.matches.x < 3) { rect = null; }
                if (tile.matches.x >= 3 && !tile.rected) {
                    if (rect) {
                        rect.width += this.tileSize - 1;
                    } else {
                        rect = {
                            x: tile.pos.x, y: this.tileSize * y,
                            width: this.tileSize - 2, height: this.tileSize - 7,
                            color: tile.originalColor,
                            data: tile.data,
                            direction: 'horizontal'
                        };
                        rects.push(rect);
                    }
                    tile.rected = true;
                }
            }
        }

        // check vertical rects
        for (x = 0; x < self.width; x++) {
            rect = null;
            for (y = 0; y < self.height; y++) {
                tile = this.getTile(x, y);
                if (tile.matches.y < 3) { rect = null; }
                if (tile.matches.y >= 3 && !tile.rected) {
                    if (rect) {
                        rect.height += this.tileSize - 1;
                    } else {
                        rect = {
                            x: this.tileSize * x, y: tile.pos.y,
                            width: this.tileSize - 4, height: this.tileSize - 5,
                            color: tile.originalColor,
                            data: tile.data,
                            direction: 'vertical'
                        };
                        rects.push(rect);
                    }
                    tile.rected = true;
                }
            }
        }

        // create rect blocks
        for (var i = 0; i < rects.length; i ++) {
            rect = rects[i];
            if (rect.width > 0) {
                var bubble = domutils.appendChild('div', this.board, 'tile button ' + rect.color);
                bubble.label = domutils.appendChild('div', bubble, 'tileLabel ' + rect.color);

                bubble.style.left = rect.x + 'px';
                bubble.style.top = rect.y + 'px';
                bubble.style.width = rect.width + 'px';
                bubble.style.height = rect.height + 'px';
                bubble.style.visibility = 'visible';
                bubble.style.zIndex = 1000;

                bubble.label.style.fontSize = '13px';

                if (rect.direction === 'vertical') {
                    bubble.label.style.wordBreak = 'break-all';
                    bubble.label.style.lineHeight = '16px';
                    bubble.label.style.width = '10px';
                    bubble.label.style.marginLeft = '14px';
                    bubble.label.style.marginTop = '8px';
                }

                var reading = utils.randomArr(rect.data.readings.all);
                domutils.setText(bubble.label, reading);
            }
        }
    };


    this.applyGravity = function () {
        for (var x = 0; x < this.width; x++) {
            for (var y = this.height - 1; y >= 0; y--) {
                var tile = this.getTile(x, y);
                if (!tile || tile.color === null) { continue; }

                var spaces = 0;
                for (var i = tile.y + 1; i < self.height; i++) {
                    var tile2 = this.getTile(tile.x, i);
                    if (tile2 && tile.color) { break; }
                    spaces++;
                }

                if (spaces > 0) {
                    var yy = tile.y + spaces;
                    this.setTile(null, tile.x, tile.y);
                    this.setTile(tile, tile.x, yy);

                    var delay = (4 - tile.y) * 50;
                    tile.moveTo({ x: tile.pos.x, y: yy * this.tileSize}, { time: 125, delay: delay, easing: 'ease-in' });
                }
            }
        }

        // repopulate tileboard
        self.repopulate();
    };


    this.repopulate = function () {
        var tile;
        var newtiles = [];

        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                tile = this.getTile(x, y);
                if (!tile || tile.color === null) {
                    tile = this.setTile(new Tile(this, x, y), x, y);
                    var num = utils.randomInt(0, this.chapter.colors.length - 1);
                    tile.init(x, y, this.chapter.colors[num], this.chapter.kanjis[num]);
                    newtiles.push(tile);
                }
            }
        }

        function moveTile(num, tile) {
            self.wait(tile, 50, function () {
                var delay = (4 - tile.y) * 50;
                tile.moveTo(tile.pos, { time: 250, delay: delay }, function () {
                    // once the last tile has fallen
                    if (num === newtiles.length - 1) {
                        // check for new tile matches
                        self.wait(self.elm, 125, function () {
                            self.checkAllMatches();
                            self.destroyMatchingTiles();
                        });
                    }
                });
            });
        }

        for (var i = 0; i < newtiles.length; i++) {
            tile = newtiles[i];
            tile.elm.style.opacity = 1;
            tile.elm.style.webkitTransform = 'translate(' + tile.pos.x + 'px, ' + ((tile.y - 6) * this.tileSize) + 'px)';
            moveTile(i, newtiles[i]);
        }
    };


    this.wait = function (elm, time, cb) {
        tweener.tween(this.elm, {}, { time: time, delay: 0 }, function () {
            cb();
        });
    };

};

