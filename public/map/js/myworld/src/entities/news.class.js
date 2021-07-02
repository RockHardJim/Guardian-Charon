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
 * News entity
 * @param {object} options News options
 */
var News = function (options) {

	/**
	 * Call parent constructor
	 */
	News.super_.call(this, 'News', options);

	this.data('title', options.name);
	this.data('datetime', options.datetime);
	this.data('description', options.description);
	this.data('tags', options.tags);

};

/**
 * Inherit News from GeoObject
 */
inherits(News, GeoObject);

/**
 * Map zoom
 */
News.prototype.getZoom = function () {

	return 19;

};

/**
 * Get and set data
 * @param  {string} paramName  Parameter Name
 * @param  {any} paramValue Parameter Value (must be empty if you want to get value)
 */
News.prototype.data = function (paramName, paramValue) {

	if ('latitude' === paramName && 'undefined' === typeof paramValue)
		return ('undefined' === this._data['latitude']) ? false : this._data['latitude'];
	if ('longitude' === paramName && 'undefined' === typeof paramValue)
		return ('undefined' === this._data['longitude']) ? false : this._data['longitude'];

	return News.super_.prototype.data.apply(this, arguments);

};

/**
 * Create Map.Marker
 * @param {Map} map Map-owner for new marker
 * @param {object} options Marker options
 */
News.prototype.createMarker = function (map, options) {

	if (!(this.data('latitude') && this.data('longitude'))) {
		this.marker = false;
		return this.marker;
	};

	var defaults = {
		latitude: this.data('latitude'),
		longitude: this.data('longitude'),
		icon: 'img/pins/route.png',
		infoWindow: {
			contentString: '<div class="left citypin">' +
			'<h3>' + this.data('title') + '</h3>' +
			'</div>',
			pixelOffset: new google.maps.Size(30, 50)
		}
	};
	options = $.extend(defaults, options);

	this.marker = map.addMarker(options);

	return this.marker;

};

module.exports = News;
