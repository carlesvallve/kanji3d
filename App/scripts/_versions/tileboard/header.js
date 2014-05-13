var Header = function (container) {
    var self = this;

    this.elm = domutils.appendChild('div', container, 'header');
    this.elm.style.webkitTransform = 'translate(0, -120%)';

    this.init = function () {
        tweener.tween(this.elm,
            { 'webkitTransform': 'translate(0, 0)' }, { time: 500, delay: 0, easing: window.easing },
            function () {});
    };
};

