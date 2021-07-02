<?php

namespace Shortener\Facades;

use Illuminate\Support\Facades\Facade;
use Shortener\Contracts\Factory;

class Shortener extends Facade
{
    protected static function getFacadeAccessor()
    {
        return Factory::class;
    }
}
