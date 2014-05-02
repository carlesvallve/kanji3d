var Tile = function (tileboard, x, y) {
	// set vars
	this.x = x;
	this.y = y;

	// create tile elements
	this.elm = domutils.appendChild('div', tileboard.elm, 'tile');
	this.elm.kanji = domutils.appendChild('div', this.elm, 'kanji');

	// size
	this.elm.style.width = tileboard.tileSize + 'px';
	this.elm.style.height = tileboard.tileSize + 'px';

	// location
	var xx = tileboard.margin + (x * (tileboard.tileSize + tileboard.margin));
	var yy = tileboard.margin + (y * (tileboard.tileSize + tileboard.margin));
	this.elm.style.webkitTransform = 'translate(' + xx + 'px, ' + yy + 'px)';


	this.init = function (x, y, colors, data) {
		// set vars
		this.x = x;
		this.y = y;
		this.colors = colors;
		this.data = data;

		// locate
		var xx = tileboard.margin + (x * (tileboard.tileSize + tileboard.margin));
		var yy = tileboard.margin + (y * (tileboard.tileSize + tileboard.margin));
		this.elm.style.webkitTransform = 'translate(' + xx + 'px, ' + yy + 'px)';

		// colorize
		this.elm.style.backgroundColor = this.colors[0];
		this.elm.style.boxShadow =
			'0 1px 2px ' + colors[1] + ', 0 -1px 1px ' + colors[0] + ', inset 0 -1px 1px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.8)';

		// fill with data
		domutils.setText(this.elm.kanji, this.data.literal);
	}
};


var Tileboard = function (width, height) {
	// set vars
	this.tileSize = 48;
	this.margin = 5;
	this.width = width;
	this.height = height;

	// create tileboard elements
	this.elm = domutils.appendChild('div', document.body, 'tileboard');
	this.elm.style.width = (this.margin + width * (this.tileSize + this.margin)) + 'px';
	this.elm.style.height = (this.margin + height * (this.tileSize + this.margin)) + 'px';


	// create tiles
	this.tiles = [];
	for (var y = 0; y < height; y++) {
		this.tiles.push([]);
		for (var x = 0; x < width; x++) {
			this.tiles[y].push(new Tile(this, x, y));
		}
	}

	// swipe detector
	swipedetect(this.elm, function(swipedir) {
		console.log('swipe', swipedir);
	});


	this.initChapter = function (category, chapterNum) {
		// set chapter vars
		this.chapter = {
			kanjis:[],
			colors: [['#f00', '#900'], ['#0f0', '#090'], ['#0ff', '#099'], ['#f90', '#930']]
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
	}
};


