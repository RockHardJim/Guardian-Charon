'use strict';

/**
 * Map.InfoWindow
 * @param {Map.Marker} marker  Map marker-owner
 * @param {object} options InfoWindow options
 */
function InfoWindow (marker, options) {

	this.extend(google.maps.OverlayView, InfoWindow);

	/*
	 * Default options for Map.InfoWindow
	 */
	var defaults = {
	};
	this.options = $.extend(defaults, options);

	this.marker = marker;

	this.position = {
		left: 0,
		top: 0
	};

	this.build();
	this.setValues(this.options);

};

/**
 * Extends object prototype by anothers
 * @param  {object} source Source object (to extend with)
 * @param  {object} destination Destination object (to be extended)
 * @return {object}      	New extended object
 */
InfoWindow.prototype.extend = function(source, destination) {

	return (function (object) {

		for (var property in object.prototype)
			this.prototype[property] = object.prototype[property];
		return this;

	}).apply(destination, [source]);

};

/**
 * Builds the InfoWindow dom
 */
InfoWindow.prototype.build = function () {

	/*
	 * Create main window
	 */
	this.window = document.createElement('div');
	this.window.className = 'markinfo dark';
	this.window.style['display'] = 'none';

};

/**
 * Add "px" to value
 * @param  {number} num The number to wrap
 * @return {string|number}     Wrapper number
 */
InfoWindow.prototype.px = function (value) {

	return (value ? value + 'px' : value);

};

/**
 * Add events to stop propagation
 * @private
 */
InfoWindow.prototype.addEvents = function() {

	var
		me = this,
		/*
		 * We want to cancel all the events so they do not go to the map
		 */
		events = ['mousedown', 'mousemove', 'mouseover', 'mouseout', 'mouseup',
			'mousewheel', 'DOMMouseScroll', 'touchstart', 'touchend', 'touchmove',
			'dblclick', 'contextmenu', 'click'];

	this.listeners = [];
	for (var i = 0, event; event = events[i]; i++) {

		this.listeners.push(

			google.maps.event.addDomListener(me.window, event, function(e) {
				e.cancelBubble = true;
				if (e.stopPropagation)
					e.stopPropagation();
			})

		);

	};

};

/**
 * On Adding the InfoWindow to a map
 * Implementing the OverlayView interface
 */
InfoWindow.prototype.onAdd = function() {

	if (!this.window)
		this.build();

	this.addEvents();

	var panes = this.getPanes();
	if (panes)
		panes.floatPane.appendChild(this.window);

	/*
	 * Once the InfoWindow has been added to the DOM, fire 'domready' event
	 */
	google.maps.event.trigger(this, 'domready');

};

/**
 * Removing the InfoWindow from a map
 */
InfoWindow.prototype.onRemove = function () {

	if (this.window && this.window.parentNode)
		this.window.parentNode.removeChild(this.window);

	for (var i = 0, listener; listener = this.listeners[i]; i++)
		google.maps.event.removeListener(listener);

};

/**
 * Converts a HTML string to a document fragment.
 * @param  {string} htmlString The HTML string to convert
 * @return {Node}            HTML fragment
 */
InfoWindow.prototype.htmlToDocumentFragment = function (htmlString) {

	htmlString = htmlString.replace(/^\s*([\S\s]*)\b\s*$/, '$1');
	var tempDiv = document.createElement('div');
	tempDiv.innerHTML = htmlString;
	if (tempDiv.childNodes.length == 1) {
		return tempDiv.removeChild(tempDiv.firstChild);
	} else {
		var fragment = document.createDocumentFragment();
		while (tempDiv.firstChild)
			fragment.appendChild(tempDiv.firstChild);
		return fragment;
	};

};

/**
 * Draw the InfoWindow (Implementing the OverlayView interface)
 */
InfoWindow.prototype.draw = function () {

	var projection = this.getProjection();

	if (!projection)
		/*
		 * The map projection is not ready yet so do nothing
		 */
		return;

	var pos = projection.fromLatLngToDivPixel(this.marker.instance.position);
	this.position = {
		left: pos.x,
		top: pos.y
	};

	if (this.options.pixelOffset) {
		this.position.left += this.options.pixelOffset.width;
		this.position.top -= this.options.pixelOffset.height;
	};

	this.removeChildren(this.window);

	var contentString = this.options.contentString;
	if (contentString)
		this.window.appendChild(('string' === typeof contentString) ? this.htmlToDocumentFragment(contentString) : contentString);

	this.window.style['left'] = this.px(this.position.left);
	this.window.style['top'] = this.px(this.position.top);

};

/**
 * Remove all children from the node
 * @param  {node} node The node to remove all children from
 */
InfoWindow.prototype.removeChildren = function(node) {

	if (!node)
		return;

	var child;
	while (child = node.firstChild)
		node.removeChild(child);

};

/**
 * Show InfoWindow
 * @param  {boolean} alone True - other windows will be hidden
 */
InfoWindow.prototype.show = function (alone) {

	/**
	 * Hide active infoWindow (if it exists)
	 */
	if (false !== alone)
		this.marker.map.hideInfoWindows();

	this.draw();

	/*
	 * Setting map
	 */
	this.setMap(this.marker.map.instance);
	/*
	 * Setting anchor (marker)
	 */
	this.set('anchor', this.marker.instance);
	this.bindTo('anchorPoint', this.marker.instance);
	this.bindTo('position', this.marker.instance);

	/*
	 * Show the window
	 */
	this.window.style['display'] = '';

	/*
	 * Save current infoWindow as Map activeInfoWindow
	 */
	this.marker.map.activeInfoWindows.push(this);

};

/**
 * Hide InfoWindow
 */
InfoWindow.prototype.hide = function () {

	if (this.window)
		this.window.style['display'] = 'none';

};

module.exports = InfoWindow;
