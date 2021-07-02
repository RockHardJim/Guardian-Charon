<?php

namespace App\Models\Misc;

use Illuminate\Database\Eloquent\Model;

class Tokey extends Model
{
    //

    protected $table = 'tokens';
    protected $fillable = ['token', 'secret'];
}
