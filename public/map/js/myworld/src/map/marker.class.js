'use strict';

/**
 * Map Marker
 * @param {object} options Marker options
 */
function Marker (options) {

	/*
	 * Default options for Map.Marker
	 */
	var defaults = {
		position: {
			lat: options.latitude,
			lng: options.longitude
		},
		draggable: false
	};
	this.options = $.extend(defaults, options);
	/*
	 * Marker events will be stored separately
	 */
	this._events = {};

	/*
	 * Marker position will be stored separately
	 */
	this.position = {
		latitude: options.latitude,
		longitude: options.longitude
	};

	/*
	 * We don't need store these options
	 */
	delete this.options.latitude;
	delete this.options.longitude;
	delete this.options.infoWindow;

	/*
	 * Standard google.maps.Marker will be stored in this.instance
	 */
	this.instance = new google.maps.Marker(this.options);
	/*
	 * Save Map.Marker as google.maps.Marker owner
	 */
	this.instance._owner = this;

	/*
	 * If options contains "infoWindow" section, we can to create info window immediately
	 */
	if ('undefined' !== typeof options.infoWindow)
		this.createInfoWindow(options.infoWindow);

};

/**
 * Place marker on map
 * @param {Map} map Map-owner
 */
Marker.prototype.setMap = function (map) {

	this.map = map;
	if (map)
		map.markers.push(this);
	this.instance.setMap(map ? map.instance : null);
	return this;

};

/**
 * Set callback function for event
 * @param  {string} eventName     Event name
 * @param  {function} eventFunction Callback function
 */
Marker.prototype.on = function (eventName, eventFunction) {

	this._events[eventName] = eventFunction;
	google.maps.event.addListener(this.instance, eventName, eventFunction);
	return this;

};

/**
 * Turn off event
 * @param {string} eventName Event name
 * @param {boolean} disableEvent Only disable event instead of deleting
 */
Marker.prototype.off = function (eventName, disableEvent) {

	google.maps.event.clearListeners(this.instance, eventName);
	if (true !== disableEvent)
		this._events[eventName] = function () {};
	return this;

};

/**
 * Enable marker event
 * @param  {string} eventName Event name
 */
Marker.prototype.enableEvent = function (eventName) {

	if ('undefined' !== typeof this._events[eventName])
		return this.on(eventName, this._events[eventName]);

};

/**
 * Disable marker event
 * @param  {string} eventName Event name
 */
Marker.prototype.disableEvent = function (eventName) {

	return this.off(eventName, true);

};

/**
 * Execute marker event
 * @param  {string} eventName Event name
 */
Marker.prototype.executeEvent = function (eventName) {

	if ('undefined' !== typeof this._events[eventName])
		this._events[eventName].call(this);

};

/**
 * Create marker info window
 * @param  {object} options Info Window options
 */
Marker.prototype.createInfoWindow = function (options) {

	/*
	 * Create info window for marker
	 */
	this.infoWindow = new MyWorld.Map.InfoWindow(this, options);

	/*
	 * Show info window while mouse over and hide while mouse out
	 * (set options.disableEvents to "true" for turn off this behaviour)
	 */
	if (true !== options.disableEvents) {

		var that = this;

		this.on('mouseover', function () {
			that.infoWindow.show();
		}).on('mouseout', function () {
			that.infoWindow.hide();
		});

	};

};

/**
 * Change marker icon
 * @param {string} path Path to new icon
 */
Marker.prototype.setIcon = function (path) {

	this.instance.setIcon(path);

};

module.exports = Marker;