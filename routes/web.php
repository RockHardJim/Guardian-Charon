<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'View\SiteController@index')->name('home');

Route::prefix('auth')->group(function () {
    Route::get('login', 'View\AuthController@login')->name('login')->middleware('guest');
    Route::get('register', 'View\AuthController@register')->name('register')->middleware('guest');
});


Route::prefix('auth')->group(function () {
    Route::post('login', 'Ajax\AuthController@login')->name('ajax.login');
    Route::post('register', 'Ajax\AuthController@register')->name('ajax.register');
    Route::post('verify', 'Ajax\AuthController@verify')->name('ajax.verify')->middleware('auth');
    Route::post('profile', 'Ajax\AuthController@profile')->name('ajax.profile')->middleware('auth');
});

Route::prefix('incident')->group(function () {
    Route::post('create', 'Ajax\IncidentController@create')->name('incident.create')->middleware(['auth', 'verify']);
    Route::post('profile', 'Ajax\IncidentController@profile')->name('incident.profile')->middleware(['auth', 'verify']);
    Route::post('media', 'Ajax\IncidentController@media')->name('incident.media')->middleware(['auth', 'verify']);
    Route::post('tip-off', 'Ajax\IncidentController@tipoff')->name('incident.tipoff')->middleware(['auth', 'verify']);
});

Route::prefix(['app',  'middleware' => ['auth', 'verify']], function()
{

});

Route::prefix('app')->group(function () {
    Route::get('home', 'View\DashboardController@index')->name('frontend.dashboard')->middleware(['auth', 'verify']);
    Route::get('map', 'View\DashboardController@map')->name('map')->middleware(['auth', 'verify']);
    Route::get('incident/{token}', 'View\DashboardController@incident')->name('incident')->middleware(['auth', 'verify']);
    Route::get('studio/{token}', 'View\DashboardController@studio')->name('studio')->middleware(['auth', 'verify']);
});
