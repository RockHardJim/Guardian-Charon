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
 * Vacancy entity
 * @param {object} options Vacancy options
 */
function Vacancy (options) {

	/**
	 * Call parent constructor
	 */
	Vacancy.super_.call(this, 'Vacancy', options);

	this.data('salary', options.salary);
	this.data('currency', options.currency);
	this.data('description', options.description);
	this.data('tags', options.tags);

};

/**
 * Inherit Vacancy from GeoObject
 */
inherits(Vacancy, GeoObject);

/**
 * Map zoom
 */
Vacancy.prototype.getZoom = function () {

	return 19;

};

/**
 * Get and set data
 * @param  {string} paramName  Parameter Name
 * @param  {any} paramValue Parameter Value (must be empty if you want to get value)
 */
Vacancy.prototype.data = function (paramName, paramValue) {

	if ('latitude' === paramName && 'undefined' === typeof paramValue)
		return this.company.data(paramName);
	if ('longitude' === paramName && 'undefined' === typeof paramValue)
		return this.company.data(paramName);

	return Vacancy.super_.prototype.data.apply(this, arguments);

};

/**
 * Create Map.Marker
 * @param {Map} map Map-owner for new marker
 * @param {object} options Marker options
 */
Vacancy.prototype.createMarker = function (map, options) {

	var defaults = {
		latitude: this.data('latitude'),
		longitude: this.data('longitude'),
		icon: 'img/pins/' + this.company.data('type') + '.png',
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

module.exports = Vacancy;
