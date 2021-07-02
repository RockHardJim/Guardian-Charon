'use strict';

/*
 * MyWorld namespace. Create blank object if it doesn't exist
 */
var MyWorld = window.MyWorld || {};

/*
 * Map entities
 */
MyWorld.Map = require('./map/map.class');
MyWorld.Map.Marker = require('./map/marker.class');
MyWorld.Map.InfoWindow = require('./map/infowindow.class');
MyWorld.Map.Route  = require('./map/route.class');

/*
 * Geo objects
 */
MyWorld.Country = require('./entities/country.class');
MyWorld.City = require('./entities/city.class');
MyWorld.Place = require('./entities/place.class');
MyWorld.Company = require('./entities/company.class');
MyWorld.Vacancy = require('./entities/vacancy.class');
MyWorld.Event = require('./entities/event.class');
MyWorld.News = require('./entities/news.class');
MyWorld.Excursion = require('./entities/excursion.class');

/*
 * Create/replace global namespace
 */
window.MyWorld = MyWorld;