<?php

namespace App\Models\Misc;

use Illuminate\Database\Eloquent\Model;

class Logger extends Model
{
    //

    protected $table = 'logs';
    protected $fillable = ['severity', 'exception'];
}
