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
	 * Place
	 */
	Place = require('./place.class'),
	/**
	 * Company
	 */
	Company = require('./company.class'),
	/**
	 * News
	 */
	News = require('./news.class'),
	/**
	 * Excursion
	 */
	Excursion = require('./excursion.class');

/**
 * City entity
 * @param {object} options City options
 */
function City (options) {

	/**
	 * Call parent constructor
	 */
	City.super_.call(this, 'City', options);
	/**
	 * City places will be stored in array
	 */
	this.places = [];
	/**
	 * City companies will be stored in array
	 */
	this.companies = [];
	/**
	 * City news will be stored in array
	 */
	this.news = [];
	/**
	 * City excursions will be stored in array
	 */
	this.excursions = [];

};

/**
 * Inherit City from GeoObject
 */
inherits(City, GeoObject);

/**
 * Map zoom
 */
City.prototype.getZoom = function () {

	return 15;

};

/**
 * Get places
 */
City.prototype.getPlaces = function (criteriaName) {

	switch (criteriaName) {
	default:
		/*
		 */
		return this.places;
	};

};

/**
 * Get events
 */
City.prototype.getEvents = function () {

	var result = [];

	this.getPlaces().map(function (place) {

		place.getEvents().map(function (event) {

			result.push(event);

		});

	});

	return result;

};

/**
 * Get companies
 */
City.prototype.getCompanies = function (criteriaName) {

	switch (criteriaName) {
	default:
		/*
		 */
		return this.companies;
	};

};

/**
 * Get vacancies
 */
City.prototype.getVacancies = function (criteriaName) {

	var result = [];

	this.getCompanies().map(function (company) {

		company.getVacancies().map(function (vacancy) {

			result.push(vacancy);

		});

	});

	return result;

};

/**
 * Get news
 */
City.prototype.getNews = function (criteriaName) {

	switch (criteriaName) {
	default:
		/*
		 */
		return this.news;
	};

};

/**
 * Get excursions
 */
City.prototype.getExcursions = function (criteriaName) {

	switch (criteriaName) {
	default:
		/*
		 */
		return this.excursions;
	};

};

/**
 * Get places count
 */
City.prototype.data_placesCount = function () {

	return this.getPlaces().length;

};

/**
 * Get companies count
 */
City.prototype.data_companiesCount = function () {

	return this.getCompanies().length;

};

/**
 * Get vacancies count
 */
City.prototype.data_vacanciesCount = function () {

	return this.getVacancies().length;

};

/**
 * Get news count
 */
City.prototype.data_newsCount = function () {

	return this.getNews().length;

};

/**
 * GEt excursions count
 */
City.prototype.data_excursionsCount = function () {

	return this.getExcursions().length;

};

/**
 * Add place (create new or use existing)
 * @param {object} options Place options
 */
City.prototype.addPlace = function (options) {

	var result;
	if ('Place' === options.className)
		result = options;
	else
		result = new Place(options);
	var pos = this.places.indexOf(result);
	if (-1 === pos)
		this.places.push(result);
	else
		this.places[pos] = result;
	result.city = this;
	return result;

};

/**
 * Add company (create new or use existing)
 * @param {object} options Company options
 */
City.prototype.addCompany = function (options) {

	var result;
	if ('Company' === options.className)
		result = options;
	else
		result = new Company(options);
	var pos = this.companies.indexOf(result);
	if (-1 === pos)
		this.companies.push(result);
	else
		this.companies[pos] = result;
	result.city = this;
	return result;

};

/**
 * Add news (create new or use existing)
 * @param {object} options News options
 */
City.prototype.addNews = function (options) {

	var result;
	if ('News' === options.className)
		result = options;
	else
		result = new News(options);
	var pos = this.news.indexOf(result);
	if (-1 === pos)
		this.news.push(result);
	else
		this.news[pos] = result;
	result.city = this;
	return result;

};

/**
 * Add excursion (create new or use existing)
 * @param {object} options Excursion options
 */
City.prototype.addExcursion = function (options) {

	var result;
	if ('Excursion' === options.className)
		result = options;
	else
		result = new Excursion(options);
	var pos = this.excursions.indexOf(result);
	if (-1 === pos)
		this.excursions.push(result);
	else
		this.excursions[pos] = result;
	result.city = this;
	return result;

};

/**
 * Create Map.Marker
 * @param {Map} map Map-owner for new marker
 * @param {object} options Marker options
 */
City.prototype.createMarker = function (map, options) {

	var defaults = {
		latitude: this.data('latitude'),
		longitude: this.data('longitude'),
		icon: 'img/pins/marker.png',
		infoWindow: {
			contentString: '<div class="left citypin">' +
			'<h3>' + this.data('name') + '</h3>' +
			'</div>',
			pixelOffset: new google.maps.Size(20, 30)
		}
	};
	options = $.extend(defaults, options);

	this.marker = map.addMarker(options);

	return this.marker;

};

module.exports = City;
