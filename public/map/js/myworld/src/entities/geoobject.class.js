'use strict';

/**
 * GeoObject
 * @param {string} className Object class name
 * @param {object} options   GeoObject options
 */
function GeoObject (className, options) {

	// console.group('GeoObject constructor');
	// console.info(className);
	// console.info(options);
	// console.groupEnd();

	/**
	 * Object unique id
	 */
	this.id = options.id;
	/**
	 * Object name
	 */
	this.name = options.name;
	/**
	 * Object optional data
	 */
	this._data = {};
	/**
	 * Class name
	 */
	this.className = className;
	/**
	 * Linked marker
	 */
	this.marker = false;

	/**
	 * Save object optional data separately
	 */
	if ('undefined' !== typeof options.code)
		this.data('code', options.code);
	if ('undefined' !== typeof options.name)
		this.data('name', options.name);
	if ('undefined' !== typeof options.latitude)
		this.data('latitude', options.latitude);
	if ('undefined' !== typeof options.longitude)
		this.data('longitude', options.longitude);

	/**
	 * Create random data for demo
	 */
	this.data('rating', (5 * Math.random()).toFixed(2));
	this.data('comments', Math.floor(1000 * Math.random()));

};

/**
 * Get and set data
 * @param  {string} paramName  Parameter Name
 * @param  {any} paramValue Parameter Value (must be empty if you want to get value)
 */
GeoObject.prototype.data = function (paramName, paramValue) {

	/**
	 * Possible to use getter for execute functions
	 */
	if ('function' === typeof this['data_' + paramName])
		return this['data_' + paramName]();

	if ('undefined' === typeof paramValue) {
		/**
		 * Get data
		 */
		if ('undefined' === typeof this._data[paramName]) {
			console.group('Empty paramValue');
			console.log(this.className);
			console.log(this);
			console.log(paramName);
			console.groupEnd();
		};
		return this._data[paramName];
	} else {
		/**
		 * Set data
		 */
		this._data[paramName] = paramValue;
		return this._data[paramName];
	};

};

/**
 * Each GeoObject can create infoWindow
 */
GeoObject.prototype.getInfoWindowOptions = function () {

	return {
		contentString: this.data('name')
	}

};

/**
 * Each GeoObject can create Map.Marker
 * @param  {Map} map     Map
 * @param  {object} options Marker options
 */
GeoObject.prototype.createMarker = function (map, options) {

	/**
	 * Only for objects which contains geo data
	 */
	if (!(this.data('latitude') && this.data('longitude')))
		return;

	var defaults = {
		latitude: this.data('latitude'),
		longitude: this.data('longitude'),
		label: this.data('name')
	};
	options = $.extend(defaults, options);

	if (true !== options.suppressInfoWindow)
		options.infoWindow = this.getInfoWindowOptions();

	this.marker = map.addMarker(options);

	return this.marker;

};

/**
 * Each GeoObject contain unique zoom
 */
GeoObject.prototype.getZoom = function () {

	return 3;

};

/**
 * Each GeoObject can create map
 * @param  {string} selector Map container
 * @param  {object} options  Map options
 * @return {Map}
 */
GeoObject.prototype.createMap = function (selector, options) {

	/**
	 * Default map options
	 */
	var defaults = {
		latitude: this.data('latitude'),
		longitude: this.data('longitude'),
		zoom: this.getZoom()
	};
	options = $.extend(defaults, options);

	return new MyWorld.Map(selector, options);

};

/**
 * Output data in jQuery section
 * @param  {string} selector jQuery selector
 */
GeoObject.prototype.output = function (selector) {

	var
		$element,
		that = this;

	$(selector).find('[data-value]').each(function (index, element) {

		$element = $(element);
		$element.html(that.data($element.data('value')));

	});

};

module.exports = GeoObject;