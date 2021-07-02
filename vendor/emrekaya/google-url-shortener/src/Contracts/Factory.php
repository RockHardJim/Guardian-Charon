<?php

namespace Shortener\Contracts;

interface Factory
{
    /**
     * @param string $url
     *
     * @return \Shortener\StorableClasses\Url
     */
    public function short($url);

    /**
     * @param string $url
     *
     * @return \Shortener\StorableClasses\Url
     */
    public function find($url);

    /**
     * @param string $url
     *
     * @return \Shortener\StorableClasses\Analytic
     */
    public function analytics($url);
}
