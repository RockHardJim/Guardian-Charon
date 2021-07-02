<?php

namespace App\Models\Incidents;

use Illuminate\Database\Eloquent\Model;

class IncidentProfile extends Model
{
    //
    protected $table = 'incident_profiles';
    protected $fillable = ['incident', 'description', 'reward', 'date', 'time'];

    public function incident()
    {
        return $this->belongsTo('App\Models\Incidents\Incident', 'incident', 'identifier');
    }
}
