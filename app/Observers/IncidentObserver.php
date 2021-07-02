<?php

namespace App\Observers;

use App\Models\Incidents\Incident;
use http\Client\Curl\User;
use App\Http\Helpers\{SMS};
use Illuminate\Support\Facades\Auth;
use Spatie\Geocoder\Geocoder;

class IncidentObserver
{
    public function created(Incident $incident)
    {
        $profiles =  \App\Models\User\Profile::all();

        $geotools = new \League\Geotools\Geotools();

        $client = new \GuzzleHttp\Client();

        $geocoder = new Geocoder($client);

        $geocoder->setApiKey(config('geocoder.key'));

        foreach($profiles as $profile){
            $address_1  = new \League\Geotools\Coordinate\Coordinate([$profile->latitude, $profile->longitude]);
            $address_2   = new \League\Geotools\Coordinate\Coordinate([$incident->latitude, $incident->longitude]);
            $distance = $geotools->distance()->setFrom($address_1)->setTo($address_2);

            if(round($distance->in('km')->haversine(), 2) < 7.5){
                $user = \App\Models\User\User::where('id', $profile->identifier)->first();

                $address = $geocoder->getAddressForCoordinates($incident->latitude, $incident->longitude);

                $sms = new \App\Http\Helpers\Sms\SMS();

                $sms->incident($user->cellphone, round($distance->in('km')->haversine(), 2), $incident->type, $incident->identifier, $address['formatted_address']);
            }
        }
    }

    /**
     * Handle the incident "updated" event.
     *
     * @param  \App\Models\Incidents\Incident  $incident
     * @return void
     */
    public function updated(Incident $incident)
    {

    }

    /**
     * Handle the incident "deleted" event.
     *
     * @param  \App\Models\Incidents\Incident  $incident
     * @return void
     */
    public function deleted(Incident $incident)
    {
        //
    }

    /**
     * Handle the incident "restored" event.
     *
     * @param  \App\Models\Incidents\Incident  $incident
     * @return void
     */
    public function restored(Incident $incident)
    {
        //
    }

    /**
     * Handle the incident "force deleted" event.
     *
     * @param  \App\Models\Incidents\Incident  $incident
     * @return void
     */
    public function forceDeleted(Incident $incident)
    {
        //
    }
}
