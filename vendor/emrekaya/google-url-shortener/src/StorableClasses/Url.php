<?php

namespace Shortener\StorableClasses;

class Url
{
    /**
     * @var string
     */
    private $id;

    /**
     * @var string
     */
    private $longUrl;

    public function __construct(string $id, string $longUrl)
    {
        $this->id = $id;
        $this->longUrl = $longUrl;
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getLongUrl(): string
    {
        return $this->longUrl;
    }
}
