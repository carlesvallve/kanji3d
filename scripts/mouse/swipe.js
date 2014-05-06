// non-touch enabled browser workarounds and fixes for unsupported dom events
var canTouch = ('ontouchstart' in window && 'ontouchend' in window && 'ontouchmove' in window);

var touchstart = canTouch ? 'touchstart' : 'mousedown';
var touchmove = canTouch ? 'touchmove' : 'mousemove';
var touchend = canTouch ? 'touchend' : 'mouseup';
var touchcancel = canTouch ? 'touchcancel' : false;


function swipedetect(touchsurface) {

        var mouseIsDown = false;

		var swipedir,
		startX,
		startY,
        endX,
        endY,
		distX,
		distY,
		threshold = 5, //required min distance traveled to be considered swipe
		restraint = 320, // maximum distance allowed at the same time in perpendicular direction
		allowedTime = 1000, // maximum time allowed to travel that distance
		elapsedTime,
		startTime;

		//handleSwipe = callback || function(point, swipedir) {};


    // get the touchsurface relative offset on the page

    function getOffset(element) {
        var xPosition = 0;
        var yPosition = 0;

        while(element) {
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return { left: xPosition, top: yPosition };
    }

    var offset = getOffset(touchsurface);


	// touch start

	touchsurface.addEventListener(touchstart, function(e) {
		var touchobj = canTouch ? e.changedTouches[0] : e;

        //alert('touch start!');

        mouseIsDown = true;

		swipedir = null;
		startX = touchobj.pageX - offset.left;
		startY = touchobj.pageY - offset.top;
		startTime = new Date().getTime(); // record time when finger first makes contact with surface
		e.preventDefault();

	}, false);


	// touch move

	touchsurface.addEventListener(touchmove, function(e) {
        if (swipedir) { return; }
        if (!mouseIsDown) { return; }

		var touchobj = canTouch ? e.changedTouches[0] : e;

        //alert('touch end!');

        endX = touchobj.pageX - offset.left;
        endY = touchobj.pageY - offset.top;
		distX = endX - startX; // get horizontal dist traveled by finger while in contact with surface
		distY = endY - startY; // get vertical dist traveled by finger while in contact with surface

		elapsedTime = new Date().getTime() - startTime; // get time elapsed

		if (elapsedTime <= allowedTime) { // first condition for awipe met
			if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
				swipedir = (distX < 0) ? { x: -1, y: 0} : { x: 1, y: 0}; //'left' : 'right'; // if dist traveled is negative, it indicates left swipe
			}
			else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
				swipedir = (distY < 0) ? { x: 0, y: -1} : { x: 0, y: 1}; // 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
			}
		}

		//handleSwipe({ x: startX, y: startY }, swipedir);

        // create and dispatch the event
        if (swipedir) {
            var event = new CustomEvent('customSwipe', { detail: { pos: { x: startX, y: startY }, dir: swipedir } });
            touchsurface.dispatchEvent(event);
        }


		e.preventDefault();
	}, false);


    // touch end

    touchsurface.addEventListener(touchend, function(e) {
        mouseIsDown = false;

        // create and dispatch the event
        if (!swipedir) {
            var event = new CustomEvent('customClick', { detail: { pos: { x: startX, y: startY } } });
            touchsurface.dispatchEvent(event);
        }

        e.preventDefault(); // prevent scrolling when inside DIV
    }, false);
}

//USAGE:
/*
 var el = document.getElementById('someel')
 swipedetect(el, function(swipedir){
 swipedir contains either "none", "left", "right", "top", or "down"
 if (swipedir =='left')
 alert('You just swiped left!')
 })
 */
