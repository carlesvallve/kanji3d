var DomUtils = function () {
    this.appendChild = function (type, parent, className, text) {
        var elm = document.createElement(type);
        elm.className = className;
        if (text) { elm.innerText = text; }
        parent.appendChild(elm);

        return elm;
    };
};

var domutils = new DomUtils();