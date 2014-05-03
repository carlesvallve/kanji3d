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
        self.createTiles();

        // initialize tileboard at chapter 1 of category jlpt4
        var category = kanjidic.filterByCategory(4, 'jlpt', 'freq');
        self.initChapter(category, 2);

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


	// initialize chapter

	this.initChapter = function (category, chapterNum) {
		// set chapter vars
		this.chapter = {
			kanjis:[],
            colors: ['white', 'orange', 'pink', 'blue']
		};

		// get kanjis on current chapter num
        var max = 4;
        var start = max * (chapterNum - 1);
        var end = start + max;

        var str = '';
		for (var i = start; i < end; i++) {
			this.chapter.kanjis.push(category[i]);
            str +=' ' + category[i].literal;
		}
        console.log('chapter' + chapterNum + ':' + str);

		// initialize current chapter tiles
		for (var y = 0; y < this.height; y++) {
			for (var x = 0; x < this.width; x++) {
				var num = utils.randomInt(0, max - 1);
				this.tiles[y][x].init(x, y, this.chapter.colors[num], this.chapter.kanjis[num]);
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

	swipedetect(this.board, this.swipeTiles);


    /*this.checkMatches = function () {
        var bMatchesFound = false;
        var matchList = [];

        while ( bMatchesFound ) {
            bMatchesFound = false;

            var matchColor = gameBoard[0].color;

            int startPos = 0;
            for ( int curPos=1; curPos < gameBoard.len(); curPos++ ) {
                if ( gameBoard[curPos].color != matchColor ) {
                    // we've ended a run; now check to see if it was long enough
                    if ( curPos-startPos >= 3 ) {
                        // It was - go ahead and add it to our list of matches
                        matchList.add(Match(startPos, curPos-1, matchColor));
                        bMatchesFound = true;
                    }
                    // now, regardless, make sure we start a new match-run here
                    startPos = curPos;
                    matchColor = gameBoard[curPos].color;
                }
            }
            // Finally, check for a match at the end - if our 'last' startPos
            // was far enough back.
            if ( startPos <= gameBoard.len()-3 ) {
                matchList.add(Match(startPos, gameBoard.len()-1, matchColor);
                bMatchesFound = true;
            }
            // 'destroy' all our matches (with suitable pyrotechnics)
            destroyMatches(matchList);
            // and keep doing this until we run out of matches
        }
    };*/
};

