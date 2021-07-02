<?php

namespace App\Http\Controllers\View;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Incidents\{Incident, IncidentTipOffs, IncidentMedia, IncidentProfile, TipOffMedia};

class DashboardController extends Controller
{
    //

    public function index(Request $request){
        if(Auth::user()->role == 'user') {
            return view('app.dashboard.user.overview');
        }elseif(Auth::user()->role == 'security'){
            return view('app.dashboard.security.overview');
        }elseif(Auth::user()->role == 'administrator'){
            return view('app.dashboard.administrator.overview');
        }
    }

    public function map(Request $request){
            return view('app.dashboard.user.map');
    }

    public function studio(Request $request, $token){
        $incidents = new Incident();
        $profiles = new IncidentProfile();
        $medias = new IncidentMedia();

        $incident = $incidents::where('identifier', $token)->first();
        if(!$incident){
            return redirect('app/map');
        }elseif($incident->user !== Auth::user()->id){
            return redirect('app/map');
        }elseif($incident->user == Auth::user()->id && Auth::user()->role == 'administrator'){
            $incident = $incidents::where('identifier', $token)->first();
            $profile = $profiles::where('incident', $token)->first();
            $media = $medias::where('incident', $token)->first();
            return view('app.dashboard.user.studio.incident',['incident' => $incident, 'profile' => $profile, 'media' => $media]);
        }
    }

    public function incident(Request $request, $token){
        $incident = new Incident();
        $profile = new IncidentProfile();
        $media = new IncidentMedia();
        $incident = $incident::where('identifier', $token)->first();
        if(!$incident){
            return redirect('app/map');
        }else{
        $profile = $profile::where('incident', $token)->first();
        $media = $media::where('incident', $token)->get();
        return view('app.dashboard.user.incident', ['incident' => $incident, 'profile' => $profile, 'media' => $media]);
        }
    }
}
