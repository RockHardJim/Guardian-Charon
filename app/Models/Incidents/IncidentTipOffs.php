<?php

namespace App\Models\Incidents;

use Illuminate\Database\Eloquent\Model;

class IncidentTipOffs extends Model
{
    //
    protected $table = 'incident_tipoffs';
    protected $fillable = ['incident', 'user', 'description', 'serial', 'status', 'report'];

    public function media(){

    }
}
