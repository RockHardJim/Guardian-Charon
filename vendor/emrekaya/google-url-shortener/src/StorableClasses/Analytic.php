<?php

namespace Shortener\StorableClasses;

use Exception;

class Analytic
{
    const AVAILABLE_DURATIONS = ['allTime', 'monthly', 'weekly', 'daily', 'lastTwoHours'];

    /**
     * @var object
     */
    private $allTime;

    /**
     * @var object
     */
    private $monthly;

    /**
     * @var object
     */
    private $weekly;

    /**
     * @var object
     */
    private $daily;

    /**
     * @var object
     */
    private $lastTwoHours;

    public function __construct($analytic)
    {
        $this->allTime = $analytic->allTime;
        $this->monthly = $analytic->month;
        $this->weekly = $analytic->week;
        $this->daily = $analytic->day;
        $this->lastTwoHours = $analytic->twoHours;
    }

    public function __call($method, $args)
    {
        $duration = camel_case(str_replace(
            ['get', 'LongUrlClicks', 'ShortUrlClicks', 'Analytics'],
            '',
            $method
        ));

        if (!in_array($duration, self::AVAILABLE_DURATIONS)) {
            throw new Exception("{$duration} is not available duration.");
        }

        $method = camel_case(str_replace(
            ['AllTime', 'Monthly', 'Weekly', 'Daily', 'LastTwoHours'],
            '',
            $method
        ));

        if (!method_exists($this, $method)) {
            throw new Exception("{$method} is not exists.");
        }

        return $this->$method($duration);
    }

    private function getAnalytics($duration = 'allTime'): object
    {
        return $this->{$duration};
    }

    private function getShortUrlClicks($duration = 'allTime'): int
    {
        return $this->{$duration}->shortUrlClicks;
    }

    private function getLongUrlClicks($duration = 'allTime'): int
    {
        return $this->{$duration}->longUrlClicks;
    }
}
