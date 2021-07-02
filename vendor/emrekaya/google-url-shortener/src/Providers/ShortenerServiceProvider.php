<?php

namespace Shortener\Providers;

use GuzzleHttp\Client;
use GuzzleHttp\ClientInterface;
use Illuminate\Support\ServiceProvider;
use Shortener\Console\FindUrl;
use Shortener\Console\ShortUrl;
use Shortener\Contracts\Factory;
use Shortener\Shortener;

class ShortenerServiceProvider extends ServiceProvider
{
    /**
     * Indicates if loading of the provider is deferred.
     *
     * @var bool
     */
    protected $defer = true;

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(ClientInterface::class, function ($app, $params = []) {
            return new Client($params);
        });

        $this->app->singleton(Factory::class, function ($app) {
            return new Shortener($app->make(ClientInterface::class, [
                'base_uri' => Shortener::API_URL,
            ]));
        });

        $this->commands([
            ShortUrl::class,
            FindUrl::class,
        ]);

        $this->registerConfig();
    }

    /**
     * Register config.
     *
     * @return void
     */
    protected function registerConfig()
    {
        $this->publishes([
            __DIR__.'/../Config/shortener.php' => config_path('shortener.php'),
        ], 'config');

        $this->mergeConfigFrom(
            __DIR__.'/../Config/shortener.php',
            'shortener'
        );
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return [Factory::class];
    }
}
