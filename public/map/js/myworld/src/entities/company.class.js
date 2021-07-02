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
	 * Vacancy
	 */
	Vacancy = require('./vacancy.class');

/**
 * Company entity
 * @param {object} options Company options
 */
function Company (options) {

	/**
	 * Call parent constructor
	 */
	Company.super_.call(this, 'Company', options);

	this.vacancies = [];

	this.data('type', options.type);
	this.data('description', options.description);
	this.data('tags', options.tags);
	this.data('address', options.address);

};

/**
 * Inherit Company from GeoObject
 */
inherits(Company, GeoObject);

/**
 * Map zoom
 */
Company.prototype.getZoom = function () {

	return 19;

};

/**
 * Get vacancies
 */
Company.prototype.getVacancies = function (criteriaName) {

	switch (criteriaName) {
	default:
		/*
		 */
		return this.vacancies;
	};

};

/**
 * Get vacancies count
 */
Company.prototype.data_VacanciesCount = function () {

	return this.getVacancies().length;

};

/**
 * Add vacancy (create new or use existing)
 * @param {object} options Vacancy options
 */
Company.prototype.addVacancy = function (options) {

	var result;
	if ('Vacancy' === options.className)
		result = options;
	else
		result = new Vacancy(options);
	var pos = this.vacancies.indexOf(result);
	if (-1 === pos)
		this.vacancies.push(result);
	else
		this.vacancies[pos] = result;
	result.company = this;
	return result;

};

module.exports = Company;