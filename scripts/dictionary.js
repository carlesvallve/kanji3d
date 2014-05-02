var Kanjidic = function () {

    var self = this;

    /**
     * load: Loads json file and converts it to an object, returning a callback when done
     * @param filename
     * @param cb
     * @returns {*}
     */
    this.load = function (filename, cb) {
        console.log('loading kanji dictionary...');

        if (!filename) {
            console.error('json file not found');
            return cb(null);
        }

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
        xobj.open('GET', filename, true); // + '?' + new Date().getTime(), true);

        xobj.onreadystatechange = function () {
            if (xobj.readyState === 4 && xobj.status === 200) {
                // .open will NOT return a value but simply returns undefined in async mode so use a callback
                self.data =JSON.parse(xobj.responseText);
                cb();
            }
        };

        xobj.send(null);
    };


    /**
     * search: Searches for an entries containing value of given type
     * @param source: the kanjidic2 object
     * @param type: literal, meaning, reading, on, kun
     * @param value: the term we are searching for
     * @returns {Array}
     */
    this.search = function (type, value) {
        var source = this.data;
        var results = [];
        var index, len, i, len2;
        var entry, item;

        console.log('searching for', type + ':', value);

        for (index = 0, len = source.length; index < len; index += 1) {
            entry = source[index];

            // literal
            if (type === 'literal' && entry.hasOwnProperty("literal")) {
                if (entry.literal === value) {
                    results.push(this.prettyEntry(entry));
                }

            } else if (type === 'meaning' && entry.hasOwnProperty("meanings")) {
                // english meaning
                for (i = 0, len2 = entry.meanings.length; i < len2; i += 1) {
                    item = entry.meanings[i];
                    if (item.hasOwnProperty("m_lang")) { break; }
                    if (item.meaning === value) {
                        results.push(this.pretty(entry));
                    }
                }

            } else if ((type === 'on' || type === 'kun') && entry.hasOwnProperty("readings")) {
                // reading kun/on
                for (i = 0, len2 = entry.readings.length; i < len2; i += 1) {
                    item = entry.readings[i];
                    if (item.r_type === "ja_" + type) {
                        if (item.reading === value) {
                            results.push(this.pretty(entry));
                        }
                    }
                }

            } else if ((type === 'reading') && entry.hasOwnProperty("readings")) {
                // all readings
                for (i = 0, len2 = entry.readings.length; i < len2; i += 1) {
                    item = entry.readings[i];
                    if (item.r_type === "ja_on" || item.r_type === "ja_kun") {
                        if (item.reading === value) {
                            results.push(this.pretty(entry));
                        }
                    }
                }
            }
        }

        return results;
    };


    /**
     * filterByCategory: returns an array of all entries that match criteria
     * @param level
     * @param type: freq, grade, jlpt, stroke_count
     * @param sortType: freq, grade, jlpt, stroke_count
     grade: 1
     jlpt: 2
     * @returns {Array}
     */
    this.filterByCategory = function (level, type, sortType) {
        var results = [];
        var index, len, entry;

        for (index = 0, len = this.data.length; index < len; index += 1) {
            entry = this.data[index];
            if (entry.hasOwnProperty(type) && entry[type] === level) {
                results.push(this.pretty(entry));
            }
        }

        if (sortType) {
            results.sort(function(a,b) {
                return parseFloat(a[sortType]) - parseFloat(b[sortType]);
            });
        }


        return results;
    };


    /**
     * pretty: generates a nice readable kanji entry from a raw one
     * @param entry
     * @returns {{}}
     */
    this.pretty = function (entry) {
        var result = {};
        var i, len, item;

        // literal
        result.literal = entry.literal;

        // english meanings
        result.meanings = [];
        for (i = 0, len = entry.meanings.length; i < len; i += 1) {
            item = entry.meanings[i];
            if (item.hasOwnProperty("m_lang")) { break; }
            result.meanings.push(item.meaning);
        }

        // readings: all, on, kun
        result.readings = { all: [], onyomi: [], kunyomi: [] };
        for (i = 0, len = entry.readings.length; i < len; i += 1) {
            item = entry.readings[i];

            if (item.r_type === "ja_on" || item.r_type === "ja_kun") {
                result.readings.all.push(item.reading);
            }

            if (item.r_type === "ja_on") {
                result.readings.onyomi.push(item.reading);
            } else if (item.r_type === "ja_kun") {
                result.readings.kunyomi.push(item.reading);
            }
        }

        // others
        result.freq = entry.freq;
        result.grade = entry.grade;
        result.jlpt = entry.jlpt;
        result.radicals = entry.radicals;
        result.stroke_count = entry.stroke_count;

        // return pretty entry
        return result;
    };

};

