'use strict';

/**
 * Map
 * @param {string} selector Map container (jQuery selector)
 * @param {object} options  Map options
 */
function Map (selector, options) {

	var me = this;

	/*
	 * Map markers will be stored in array
	 */
	me.markers = [];
	/*
	 * Map routes will be stored in array
	 */
	me.routes = [];
	/*
	 * Current (opened) info window
	 */
	me.activeInfoWindows = [];

	/*
	 * Default options for map
	 */
	var defaults = {
		center: {
			lat: options.latitude,
			lng: options.longitude
		},
		/*
		 * Map zoom
		 */
		zoom: 3,
		/*
		 * We disabling standard Google UI
		 */
		disableDefaultUI: true,
		/*
		 * We can rebuild map (with re-center) on window resize
		 */
		rebuildMapOnResize: true
	};
	me.options = $.extend(defaults, options);

	/*
	 * We don't need store these options
	 */
	delete me.options.latitude;
	delete me.options.longitude;

	/*
	 * Standard google.maps.Map will be stored in me.instance
	 */
	me.instance = new google.maps.Map($(selector)[0], me.options);

	if (false !== me.options.rebuildMapOnResize)
		google.maps.event.addDomListener(window, 'resize', me.recenter.bind(me));

	google.maps.event.addListenerOnce(me.instance, 'idle', me.resize.bind(me));
	setTimeout(me.resize.bind(me), 50);

};

/**
 * Center map on position
 * @param  {number} latitude  Center latitude
 * @param  {number} longitude Center longitude
 */
Map.prototype.center = function (latitude, longitude) {

	var centerPosition = new google.maps.LatLng(latitude, longitude);
	this.instance.panTo(centerPosition);
	return this;

};

/**
 * Pan map to geo object
 * @param  {object} geoObject Object with geo positions
 */
Map.prototype.panTo = function (geoObject) {

	if (geoObject.data('latitude') && geoObject.data('longitude'))
		this.center(geoObject.data('latitude'), geoObject.data('longitude'));
	return this;

};

/**
 * Resize map
 */
Map.prototype.resize = function () {

	google.maps.event.trigger(this.instance, 'resize');
	this.recenter();

};

/**
 * Recenter map
 */
Map.prototype.recenter = function () {

	var center = this.instance.getCenter();
	this.instance.setCenter(this.options.center);

};

/**
 * Set callback function for event
 * @param  {string} eventName     Event name
 * @param  {function} eventFunction Callback function
 */
Map.prototype.on = function (eventName, eventFunction) {

	google.maps.event.addListener(this.instance, eventName, eventFunction);
	return this;

};

/**
 * Turn off event
 * @param  {string} eventName Event name
 */
Map.prototype.off = function (eventName) {

	google.maps.event.clearListeners(this.instance, eventName);
	return this;

};

/**
 * Set map zoom for showing all map objects
 * @param {boolean} enable Enable/disable map autozoom
 */
Map.prototype.autoZoom = function (enable) {

	/*
	 * Disable auto zoom - set zoom to options.zoom
	 */
	if (false === enable) {
		this.instance.setZoom(this.options.zoom);
		return this;
	};

	/*
	 * Combine all markers to LatLngBounds
	 */
	var bounds = new google.maps.LatLngBounds();
	this.markers.map(function (marker) {

		bounds.extend(
			new google.maps.LatLng(marker.position.latitude, marker.position.longitude)
		);

	});
	this.instance.fitBounds(bounds);

};

/**
 * Hide opened info windows
 */
Map.prototype.hideInfoWindows = function () {

	this.activeInfoWindows.forEach(function (infoWindow) {
		infoWindow.hide();
	});

};

/**
 * Clear map and removing all markers
 */
Map.prototype.clearMarkers = function () {

	this.hideInfoWindows();
	this.markers.map(function (marker) {

		marker.setMap(null);

	});
	this.markers = [];

};

/**
 * Add new marker to map
 * @param {object} options Marker options
 */
Map.prototype.addMarker = function (options) {

	var result = new MyWorld.Map.Marker(options);
	result.setMap(this);
	return result;

};

/**
 * Enable map markers event
 * @param  {string} eventName Event name
 */
Map.prototype.enableMarkersEvent = function (eventName) {

	this.markers.map(function (marker) {
		marker.enableEvent(eventName);
	});

};

/**
 * Disable map markers event
 * @param  {string} eventName Event name
 */
Map.prototype.disableMarkersEvent = function (eventName) {

	this.markers.map(function (marker) {
		marker.disableEvent(eventName);
	});

};

/**
 * Add new route point-to-point to map
 * @param {Marker} markerStart Marker - route start
 * @param {Marker} markerStop  Marker - route stop
 * @param {object} options Route options
 */
Map.prototype.addRoute = function (markerStart, markerStop, options) {

	var result = new MyWorld.Map.Route(markerStart, markerStop, options);
	result.setMap(this);
	return result;

};

module.exports = Map;