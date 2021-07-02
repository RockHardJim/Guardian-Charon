<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Observers\{UserObserver, IncidentObserver};
use App\Models\
{User\User,
Incidents\Incident};

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        User::observe(UserObserver::class);
        Incident::observe(IncidentObserver::class);
    }
}
