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
	 * Marker
	 */
	Marker = require('./../map/marker.class');

/**
 * Excursion entity
 * @param {object} options Excursion options
 */
function Excursion (options) {

	/**
	 * Call parent constructor
	 */
	Excursion.super_.call(this, 'Excursion', options);

	this.data('title', options.name);
	this.data('description', options.description);
	this.data('currency', options.currency);
	this.data('price', options.price);
	this.data('language', options.language);
	this.data('duration', options.duration);
	this.data('guide', options.guide);
	this.data('latitudeOrigin', options.latitudeOrigin);
	this.data('longitudeOrigin', options.longitudeOrigin)
	this.data('latitudeDestination', options.latitudeDestination);
	this.data('longitudeDestination', options.longitudeDestination);

};

/**
 * Inherit Excursion from GeoObject
 */
inherits(Excursion, GeoObject);

/**
 * Map zoom
 */
Excursion.prototype.getZoom = function () {

	return 19;

};

/**
 * Create excursion route
 * @param  {Map} map     Map
 * @param  {object} options Route options
 * @return {Map.Route}
 */
Excursion.prototype.createRoute = function (map, options) {

	this.markers = {};
	/**
	 * Route origin marker
	 */
	var originOptions = {
		latitude: this.data('latitudeOrigin'),
		longitude: this.data('longitudeOrigin'),
		icon: 'img/pins/route.png'
	};
	if ('undefined' !== typeof options)
		originOptions = $.extend(originOptions, options.markers);
	this.markers.origin = map.addMarker(originOptions);

	/**
	 * Route destination marker
	 */
	var destinationOptions = {
		latitude: this.data('latitudeDestination'),
		longitude: this.data('longitudeDestination'),
		icon: 'img/pins/route.png'
	};
	if ('undefined' !== typeof options)
		destinationOptions = $.extend(destinationOptions, options.markers);
	this.markers.destination = map.addMarker(destinationOptions);

	/**
	 * Default route options
	 */
	var defaults = {
	};
	options = $.extend(defaults, options);

	/**
	 * Create excursion route
	 */
	this.route = map.addRoute(this.markers.origin, this.markers.destination, options);
	this.route.show();

	return this.route;

};

module.exports = Excursion;