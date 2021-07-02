<?php

namespace App\Models\Incidents;

use Illuminate\Database\Eloquent\Model;

class IncidentMedia extends Model
{
    //

    protected $table = 'incidents_media';
    protected $fillable = ['incident', 'type', 'file'];
}
