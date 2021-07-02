'use strict';

/**
 * Map route
 * @param {Marker} markerOrigin Marker - route start
 * @param {Marker} markerDestination  Marker - route stop
 * @param {object} options Route options
 */
function Route (markerOrigin, markerDestination, options) {

	/*
	 * Default options for Map.Route
	 */
	var defaults = {
		/*
		 * We don't need markers on route
		 */
		suppressMarkers: true,
		polylineOptions: {
			/*
			 * Default route color
			 */
			strokeColor: '#0A161E'
		},
		/*
		 * You can set travelMode you need (walking is default)
		 */
		travelMode: google.maps.TravelMode.WALKING
	};
	options = $.extend(defaults, options);

	this.markers = {
		origin: markerOrigin,
		destination: markerDestination
	};

	/*
	 * Create route instance
	 */
	this.instance = {
		markerOrigin: this.markers.origin,
		markerDestination: this.markers.destination,
		directionsService: new google.maps.DirectionsService,
		directionsDisplay: new google.maps.DirectionsRenderer({
			suppressMarkers: options.suppressMarkers,
			polylineOptions: options.polylineOptions
		})
	};

	/*
	 * Make route
	 */
	var that = this;
	this.instance.directionsService.route({
		origin: {
			lat: that.markers.origin.position.latitude,
			lng: that.markers.origin.position.longitude
		},
		destination: {
			lat: that.markers.destination.position.latitude,
			lng: that.markers.destination.position.longitude
		},
		travelMode: options.travelMode
	}, function (response, status) {
		if (status === google.maps.DirectionsStatus.OK)
			that.instance.directionsDisplay.setDirections(response);
		else
			console.error('Directions request failed due to ' + status);
	});

};

/**
 * Place route on map
 * @param {Map} map Map-owner
 */
Route.prototype.setMap = function (map) {

	this.map = map;
	if (map)
		map.routes.push(this);
	return this;

};

/**
 * Show map route
 */
Route.prototype.show = function () {

	this.instance.directionsDisplay.setMap(this.map.instance);

};

/**
 * Update map route
 * @param  {object} options Route options
 */
Route.prototype.update = function (options) {

	this.markers.origin.instance.setIcon(options.markers.icon);
	this.markers.destination.instance.setIcon(options.markers.icon);

	this.instance.directionsDisplay.setOptions(options);
	this.show();

};

module.exports = Route;