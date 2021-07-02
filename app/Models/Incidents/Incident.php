<?php

namespace App\Models\Incidents;

use Illuminate\Database\Eloquent\Model;

class Incident extends Model
{
    //

    protected $table = 'incidents';
    protected $fillable = ['identifier', 'site', 'latitude', 'longitude', 'type', 'status'];

    public function tipoffs(){
        return $this->hasMany('App\Models\Incidents\IncidentTipOffs');
    }
    public function media(){
        return $this->hasMany('App\Models\Incidents\IncidentMedia', 'incident');
    }
    public function profile(){
        return $this->hasOne('App\Models\Incidents\IncidentProfile', 'incident', 'identifier');
    }
}
