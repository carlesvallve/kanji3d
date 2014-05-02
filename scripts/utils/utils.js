var Utils = function () {
	// ***********************************
	// Random
	// ***********************************

	// random integer
	this.randomInt = function (min, max, excludeZero) {
		var num = Math.floor(Math.random() * (max - min + 1) + min);

		if (excludeZero) {
			while (num === 0) {
				num = Math.floor(Math.random() * (max - min + 1) + min);
			}
		}

		return num;
	};


	// returns a random item from an array
	this.randomArr = function (arr) {
		return arr[this.randomInt(0, arr.length - 1)];
	};


	// returns a random color in given format (hex, rgb, int)
	this.randomColor = function (format) {
		format = 'hex';
		var rint = Math.round(0xffffff * Math.random());
		switch (format) {
			case 'hex':
				return ('#0' + rint.toString(16)).replace(/^#0([0-9a-f]{6})$/i, '#$1');
			case 'rgb':
				return 'rgb(' + (rint >> 16) + ',' + (rint >> 8 & 255) + ',' + (rint & 255) + ')';
			default:
				return rint;
		}
	};
};

var utils = new Utils();