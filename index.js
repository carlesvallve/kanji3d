console.log('Welcome to kanji-3D');

var tileboard;

var kanjidic = new Kanjidic('./assets/data/kanjidic2.json.zip');
kanjidic.load('./assets/data/kanjidic2.json', function () {
    console.log(kanjidic);

	tileboard = new Tileboard(9, 9);

	// search all kanjis in a given category
	var category = kanjidic.filterByCategory(4, 'jlpt', 'freq');
	tileboard.initChapter(category, 1);
	//console.log('jlpt4', category.length, 'kanjis:', category);

    // search for a single kanji  entry
    //var results = kanjidic.search('literal', '女');
    //console.log(results);

    // search all kanjis in a given category
    /*var results = kanjidic.filterByCategory(4, 'jlpt', 'freq');
    console.log('jlpt4', results.length, 'kanjis:', results);*/

    // display random kanjis from category
    /*var kanjis = [];
    for (var i = 0; i < results.length; i++) {
        var entry = results[i]; //results[~~(Math.random() * results.length - 1)];
        domutils.appendChild('span', document.body, 'kanji', entry.literal);
        kanjis.push(entry);
    }*/


});













