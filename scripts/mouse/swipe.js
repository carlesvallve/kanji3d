// non-touch enabled browser workarounds and fixes for unsupported dom events
var canTouch = ('ontouchstart' in window && 'ontouchend' in window && 'ontouchmove' in window);

var touchstart = canTouch ? 'touchsart' : 'mousedown';
var touchmove = canTouch ? 'touchmove' : 'mousemove';
var touchend = canTouch ? 'touchend' : 'mouseup';
var touchcancel = canTouch ? 'touchcancel' : false;


function swipedetect(el, callback) {

	var touchsurface = el,
		swipedir,
		startX,
		startY,
		distX,
		distY,
		threshold = 20, //required min distance traveled to be considered swipe
		restraint = 100, // maximum distance allowed at the same time in perpendicular direction
		allowedTime = 300, // maximum time allowed to travel that distance
		elapsedTime,
		startTime,
		handleswipe = callback || function(swipedir) {};


	// touch start

	touchsurface.addEventListener(touchstart, function(e) {
		var touchobj = canTouch ? e.changedTouches[0] : e;

		swipedir = 'none';
		dist = 0;
		startX = touchobj.pageX;
		startY = touchobj.pageY;
		startTime = new Date().getTime(); // record time when finger first makes contact with surface
		e.preventDefault();

	}, false);


	// touch move

	touchsurface.addEventListener(touchmove, function(e) {
		e.preventDefault(); // prevent scrolling when inside DIV
	}, false);


	// touch end

	touchsurface.addEventListener(touchend, function(e) {
		var touchobj = canTouch ? e.changedTouches[0] : e;

		distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
		distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface

		elapsedTime = new Date().getTime() - startTime; // get time elapsed

		if (elapsedTime <= allowedTime) { // first condition for awipe met
			if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint) { // 2nd condition for horizontal swipe met
				swipedir = (distX < 0)? 'left' : 'right'; // if dist traveled is negative, it indicates left swipe
			}
			else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) { // 2nd condition for vertical swipe met
				swipedir = (distY < 0)? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
			}
		}

		handleswipe(swipedir);
		e.preventDefault()
	}, false)
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
