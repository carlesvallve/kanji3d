var Utils = function () {

    // ***********************************
    // Unicode
    // ***********************************

    this.encode_utf8 = function (str) {
        return unescape(encodeURIComponent(str));
    };

    this.decode_utf8 = function (str) {
        return decodeURIComponent(escape(str));
    };


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
};

var utils = new Utils();