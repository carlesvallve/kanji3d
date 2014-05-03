// TODO: Convert this into a Dom object.
// TODO: Then we will be able to create elements by new Dom() and assign props and methods to it.

var DomUtils = function () {
    this.appendChild = function (type, parent, className, text) {
        var elm = document.createElement(type);
        elm.className = className;
        if (text) { this.setText(elm, text); }
        parent.appendChild(elm);

        return elm;
    };

	this.setText = function (elm, text) {
		elm.innerText = text;
	};


    this.disableScroll = function () {
        document.ontouchmove = function(e){ e.preventDefault(); }
    };


    this.enableScroll = function () {
        document.ontouchmove = function(e){ return true; }
    };
};

var domutils = new DomUtils();