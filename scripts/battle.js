var Battle = function (container) {

    this.elm = domutils.appendChild('div', container, 'battle');

    var url = 'url(assets/textures/gif/' + utils.randomInt(1,5) + '.gif) no-repeat ' + utils.randomInt(0, 100) + '% 80%';
    console.log(url);
    this.elm.style.background = url;
};

