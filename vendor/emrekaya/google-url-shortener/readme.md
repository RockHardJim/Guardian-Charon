# Google URL Shortener

[![Latest Stable Version](https://img.shields.io/packagist/v/emrekaya/google-url-shortener.svg)](https://packagist.org/packages/emrekaya/google-url-shortener)
[![Total Downloads](https://img.shields.io/packagist/dt/emrekaya/google-url-shortener.svg)](https://packagist.org/packages/emrekaya/google-url-shortener)
[![Monthly Downloads](https://img.shields.io/packagist/dm/emrekaya/google-url-shortener.svg)](https://packagist.org/packages/emrekaya/google-url-shortener)
[![PHP Version](https://img.shields.io/packagist/php-v/emrekaya/google-url-shortener.svg)](https://packagist.org/packages/emrekaya/google-url-shortener)
[![License](https://img.shields.io/packagist/l/emrekaya/google-url-shortener.svg)](https://packagist.org/packages/emrekaya/google-url-shortener)

## How to install?

```bash
composer require emrekaya/google-url-shortener
```

## How to publish config file?

```bash
php artisan vendor:publish --provider="Shortener\\Providers\\ShortenerServiceProvider" --tag="config"
```

## How to setup?

You must add ``GOOGLE_URL_SHORTENER_API_KEY=YOUR_API_KEY`` it to the .env file to use this package.

## How to use?

### How to short link?

```php
Shortener::short('YOUR_LINK')->getId();
```

### How to get shorted link?
```php
Shortener::find('https://goo.gl/SHORTENER_ID')->getLongUrl();
```

### How to get analytics for shorted link?
```php
$analytic = Shortener::analytics('https://goo.gl/SHORTENER_ID');
```

##### Available analytic class methods

This methods return integer

```php
$analytic->getAllTimeShortUrlClicks();
$analytic->getMonthlyShortUrlClicks();
$analytic->getWeeklyShortUrlClicks();
$analytic->getDailyShortUrlClicks();
$analytic->getLastTwoHoursShortUrlClicks();

$analytic->getAllTimeLongUrlClicks();
$analytic->getMonthlyLongUrlClicks();
$analytic->getWeeklyLongUrlClicks();
$analytic->getDailyLongUrlClicks();
$analytic->getLastTwoHoursLongUrlClicks();
```

This methods return object

```php
$analytic->getAllTimeAnalytics();
$analytic->getMonthlyAnalytics();
$analytic->getWeeklyAnalytics();
$analytic->getDailyAnalytics();
$analytic->getLastTwoHoursAnalytics();
```

For more information; [Click here!](https://developers.google.com/url-shortener/v1/getting_started#url_analytics)

### How to short link on CLI?
```bash
php artisan google:short-url URL
```

### How to get shorted link on CLI?
```bash
php artisan google:find-url https://goo.gl/SHORTENER_ID
```

### How to test?

Copy .env.test.example to .env.test

```bash
cp .env.example.test .env.test
```

Add ``GOOGLE_URL_SHORTENER_API_KEY=YOUR_API_KEY`` to .env.test file.

Run...
```bash
composer test
```
