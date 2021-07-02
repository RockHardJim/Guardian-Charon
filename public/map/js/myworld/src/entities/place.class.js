'use strict';

var
	/**
	 * GeoObject - parent class
	 */
	GeoObject = require('./geoobject.class'),
	/**
	 * Inheritance module
	 */
	inherits = require('util').inherits,
	/**
	 * Event
	 */
	Event = require('./event.class');

/**
 * Place entity
 * @param {object} options Place options
 */
function Place (options) {

	/**
	 * Call parent constructor
	 */
	Place.super_.call(this, 'Place', options);
	/**
	 * Place events will be stored in array
	 */
	this.events = [];

	this.data('type', options.type);
	this.data('description', options.description);
	this.data('tags', options.tags);
	this.data('address', options.address);

};

/**
 * Inherit Place from GeoObject
 */
inherits(Place, GeoObject);

/**
 * Map zoom
 */
Place.prototype.getZoom = function () {

	return 19;

};

/**
 * Get events
 */
Place.prototype.getEvents = function (criteriaName) {

	switch (criteriaName) {
	default:
		/*
		 */
		return this.events;
	};

};

/**
 * Get events count
 */
Place.prototype.data_EventsCount = function () {

	return this.getEvents().length;

};

/**
 * Add event (create new or use existing)
 * @param {object} options Event options
 */
Place.prototype.addEvent = function (options) {

	var result;
	if ('Event' === options.className)
		result = options;
	else
		result = new Event(options);
	var pos = this.events.indexOf(result);
	if (-1 === pos)
		this.events.push(result);
	else
		this.events[pos] = result;
	result.place = this;
	return result;

};

/**
 * Create Map.Marker
 * @param {Map} map Map-owner for new marker
 * @param {object} options Marker options
 */
Place.prototype.createMarker = function (map, options) {

	var defaults = {
		latitude: this.data('latitude'),
		longitude: this.data('longitude'),
		icon: 'img/pins/' + this.data('type') + '.png',
		infoWindow: {
			contentString: '<div class="left citypin">' +
			'<h3>' + this.data('name') + '</h3>' +
			'</div>',
			pixelOffset: new google.maps.Size(30, 50)
		}
	};
	options = $.extend(defaults, options);

	this.marker = map.addMarker(options);

	return this.marker;

};

module.exports = Place;
