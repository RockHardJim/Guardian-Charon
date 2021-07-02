<?php

namespace Shortener\Console;

use Illuminate\Console\Command;
use Shortener;
use Symfony\Component\Console\Input\InputArgument;

class FindUrl extends Command
{
    /**
     * The console command name.
     *
     * @var string
     */
    protected $name = 'google:find-url {url}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Find shorted url.';

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
        $this->info(Shortener::find($this->argument('url'))->getLongUrl());
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
