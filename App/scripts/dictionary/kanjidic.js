var Kanjidic = function () {

    var self = this;

    /**
     * load: Loads json file and converts it to an object, returning a callback when done
     * @param filename
     * @param cb
     * @returns {*}
     */
    this.load = function (filename, cbProgress, cbComplete) {
        console.log('loading kanji dictionary...');

        if (!filename) {
            console.error('json file not found');
            return cb(null);
        }

        var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json; charset=UTF-8");
        xobj.open('GET', filename +  '?' + new Date().getTime(), true);

        xobj.onreadystatechange = function () {
            if (xobj.readyState === 4 && xobj.status === 200) {
                // .open will NOT return a value but simply returns undefined in async mode so use a callback

                if (cbProgress) { cbProgress(100); }

                window.setTimeout(function () {
                    // parse json text
                    self.data = JSON.parse(xobj.responseText);

                    // return callback once the file has been loaded and parsed
                    if (cbComplete) { cbComplete(); }
                }, 0);

            }
        };

        xobj.onprogress = function (e) {
            var percent = Math.round(e.loaded * 100 / e.total);
            if (cbProgress) { cbProgress(percent); }
        };

        xobj.send(null);
    };


    // TODO: We cannot store all this data since is a lot more than 2.5Mb, we need to find a workaround
    this.saveToLocalStorage = function (data) {
        window.localStorage.setItem('kanjidic2', JSON.stringify(data));
    };

    // TODO: We cannot store all this data since is a lot more than 2.5Mb, we need to find a workaround
    this.loadFromLocalStorage = function () {
        var value = window.localStorage.getItem('kanjidic2');
        return value && JSON.parse(value);
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
        //result.meanings = [];
        result.readings = { all: [], eng: [], jap: [], onyomi: [], kunyomi: [] };

        for (i = 0, len = entry.meanings.length; i < len; i += 1) {
            item = entry.meanings[i];
            if (item.hasOwnProperty("m_lang")) { break; }
            result.readings.eng.push(item.meaning);
            result.readings.all.push(item.meaning);
        }

        // readings: all, on, kun

        for (i = 0, len = entry.readings.length; i < len; i += 1) {
            item = entry.readings[i];

            if (item.r_type === "ja_on" || item.r_type === "ja_kun") {
                result.readings.jap.push(item.reading);
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

