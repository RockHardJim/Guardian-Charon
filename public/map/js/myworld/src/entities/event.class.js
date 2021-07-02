'use strict';

var
	/**
	 * GeoObject - parent class
	 */
	GeoObject = require('./geoobject.class'),
	/**
	 * Inheritance module
	 */
	inherits = require('util').inherits;

/**
 * Event entity
 * @param {object} options Event options
 */
function Event (options) {

	/**
	 * Call parent constructor
	 */
	Event.super_.call(this, 'Event', options);

	this.data('description', options.description);
	this.data('datetime', options.datetime);
	this.data('currency', options.currency);
	this.data('price', options.price);
	this.data('tags', options.tags);

};

/**
 * Inherit Event from GeoObject
 */
inherits(Event, GeoObject);

/**
 * Map zoom
 */
Event.prototype.getZoom = function () {

	return 19;

};

/**
 * Get and set data
 * @param  {string} paramName  Parameter Name
 * @param  {any} paramValue Parameter Value (must be empty if you want to get value)
 */
Event.prototype.data = function (paramName, paramValue) {

	if ('latitude' === paramName && 'undefined' === typeof paramValue)
		return this.place.data(paramName);
	if ('longitude' === paramName && 'undefined' === typeof paramValue)
		return this.place.data(paramName);

	return Event.super_.prototype.data.apply(this, arguments);

};

/**
 * Create Map.Marker
 * @param {Map} map Map-owner for new marker
 * @param {object} options Marker options
 */
Event.prototype.createMarker = function (map, options) {

	var defaults = {
		latitude: this.data('latitude'),
		longitude: this.data('longitude'),
		icon: 'img/pins/' + this.place.data('type') + '.png',
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

module.exports = Event;
