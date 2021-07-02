<?php

namespace Shortener\Console;

use Illuminate\Console\Command;
use Shortener;
use Symfony\Component\Console\Input\InputArgument;

class ShortUrl extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'google:short-url {url}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Short url.';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $this->info(Shortener::short($this->argument('url'))->getId());
    }

    /**
     * Get the console command arguments.
     *
     * @return array
     */
    protected function getArguments()
    {
        return [
            ['url', InputArgument::REQUIRED],
        ];
    }
}
