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
	 * City
	 */
	City = require('./city.class');

/**
 * Country entity
 * @param {object} options Country options
 */
function Country (options) {

	/**
	 * Call parent constructor
	 */
	Country.super_.call(this, 'Country', options);
	/**
	 * Country cities will be stored in array
	 */
	this.cities = [];

};

/**
 * Inherit Country from GeoObject
 */
inherits(Country, GeoObject);

/**
 * Add city (create new or use existing)
 * @param {object} options City options
 */
Country.prototype.addCity = function (options) {

	var result;
	if ('City' === options.className)
		result = options;
	else
		result = new City(options);
	var pos = this.cities.indexOf(result);
	if (-1 === pos)
		this.cities.push(result);
	else
		this.cities[pos] = result;
	result.country = this;
	return result;

};

/**
 * Get cities
 */
Country.prototype.getCities = function (criteriaName) {

	switch (criteriaName) {
	default:
		/*
		 */
		return this.cities;
	};

};

/**
 * Cities count
 */
Country.prototype.data_citiesCount = function () {

	return this.getCities() .length;

};

/**
 * Create Map.Marker
 * @param {Map} map Map-owner for new marker
 * @param {object} options Marker options
 */
Country.prototype.createMarker = function (map, options) {

	var defaults = {
		latitude: this.data('latitude'),
		longitude: this.data('longitude'),
		icon: 'img/pins/' + this.data('code') + '.png',
		infoWindow: {
			contentString: '<div class="right counpin">' +
			'<img src="img/country/' + this.data('code') + '.png" />' +
			'<h3>' + this.data('name') + '</h3>' +
			'<span class="rating">' + this.data('rating') + '</span>' +
			'</div>',
			pixelOffset: new google.maps.Size(40, 60)
		}
	};
	options = $.extend(defaults, options);

	this.marker = map.addMarker(options);

	return this.marker;

};

module.exports = Country;
