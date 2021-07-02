<?php

namespace Shortener;

use GuzzleHttp\ClientInterface;
use GuzzleHttp\Exception\RequestException;
use GuzzleHttp\Psr7\Response;
use GuzzleHttp\RequestOptions;
use Shortener\StorableClasses\Analytic;
use Shortener\StorableClasses\Url;

class Shortener implements Contracts\Factory
{
    const API_URL = 'https://www.googleapis.com/urlshortener/v1/url';

    protected $client;

    public function __construct(ClientInterface $client)
    {
        $this->client = $client;
    }

    public function short($url): Url
    {
        $response = $this->sendRequest('POST', null, [
            RequestOptions::QUERY => $this->getApiKeyQuery(),
            RequestOptions::JSON  => [
                'longUrl' => $url,
            ],
        ]);

        return $this->buildUrlInstance($response);
    }

    public function find($url): Url
    {
        $response = $this->sendRequest('GET', null, [
            RequestOptions::QUERY => array_merge([
                'shortUrl' => $url,
            ], $this->getApiKeyQuery()),
        ]);

        return $this->buildUrlInstance($response);
    }

    public function analytics($url): Analytic
    {
        $options = [
            'projection' => 'FULL',
        ];

        $response = $this->sendRequest('GET', null, [
            RequestOptions::QUERY => array_merge([
                'shortUrl' => $url,
            ], $this->getApiKeyQuery(), $options),
        ]);

        return new Analytic($response->analytics);
    }

    protected function sendRequest($method, $url, $options): object
    {
        try {
            return $this->decodeResponse($this->client->request($method, $url, $options));
        } catch (RequestException $e) {
            throw new \Exception($e->getMessage());
        }
    }

    protected function decodeResponse(Response $response): object
    {
        return json_decode($response->getBody());
    }

    protected function getApiKeyQuery(): array
    {
        return [
            'key' => $this->getApiKey(),
        ];
    }

    protected function getApiKey(): string
    {
        return config('shortener.google_url_shortener_api_key') ?? '';
    }

    protected function buildUrlInstance(object $response): Url
    {
        return new Url($response->id, $response->longUrl);
    }
}
