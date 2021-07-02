<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Validator, Auth, Storage, DB};
use App\Models\Incidents\{Incident, IncidentTipOffs, IncidentMedia, IncidentProfile, TipOffMedia};
use Illuminate\Support\{Str};
use Carbon\Carbon;
use Spatie\Geocoder\Facades\Geocoder;

class IncidentController extends Controller
{
    //

    public function __construct()
    {

    }

    public function create(Request $request){
        $validated = Validator::make($request->all(), ['site' => 'required|min:5', 'address' => 'required|min:5', 'type' => 'required']);

        if($validated->fails()){
            return $this->json('failed', 'Hi, we could not save your report due to a form validation error.');
        } else {
            try {
                if(Auth::user()->role == 'administrator' || Auth::user()->role == 'security') {
                    $identifier = Str::uuid();
                    $client = new \GuzzleHttp\Client();

                    $geocoder = new \Spatie\Geocoder\Geocoder($client);
                    $geocoder->setApiKey(config('geocoder.key'));
                    $coords = $geocoder->getCoordinatesForAddress($request->address);
                    $incident = new Incident();

                    $incident->identifier = $identifier;
                    $incident->site = $request->site;
                    $incident->user = Auth::user()->id;
                    $incident->latitude = $coords['lat'];
                    $incident->longitude = $coords['lng'];
                    $incident->type = $request->type;
                    $incident->save();
                    return response()->json([
                        'status' => 'passed',
                        'message' => 'Hi, we have successfully saved your report please wait while we redirect you to our incident builder to collect more information',
                        'token' => $identifier
                    ]);
                }else{
                    return $this->json('passed', 'Hi, only administrators and security officials can post events for now this option might be available later on for users.');
                }
                }catch(\Exception $e) {
                return $this->json('failed', $e->getMessage());
            }
        }
    }

    public function profile(Request $request){
        $validated = Validator::make($request->all(), [
            'incident' => 'required',
            'description' => 'required|min:15',
            'reward' => 'integer|required',
            'date' => 'required',
            'time' => 'required'
        ]);

        if($validated->fails()) {
            return $this->json('failed', 'Hi, we could not save your report due to a form validation error.');
        } else {
            $profile = new IncidentProfile();

            if(!$profile::where('incident', $request->incident)->first()){
                if(Incident::where('identifier', $request->incident)->first()){
                    $profile->incident = $request->incident;
                    $profile->description = $request->description;
                    $profile->reward = $request->reward;
                    $profile->date = $request->date;
                    $profile->time = $request->time;
                    $profile->save();
                    return $this->json('passed', 'Hi, you have successfully enrolled the incident profile and notifications have been sent out to users nearby where the incident happened.');
                }else{
                    return $this->json('failed', 'Hi, we could not find any incident related with your submitted ID.');
                }
            }else{
                return $this->json('failed', 'Hi, editing of submitted incident data is still prohibited.');
            }
        }
    }

    public function media(Request $request){
        $validator = Validator::make($request->all(),[
            'incident' => 'required',
            'file' => 'required|mimes:jpeg,bmp,png,mp4,mov,ogg,qt,ogx,oga,ogv,ogg,webm',
        ]);

        if($validator->fails()){
            return $this->json('failed', 'Hi, we could not process your file uploads due to invalid extensions.');
        }else{

            try {
                if ($request->file('file')->extension() == 'jpeg') {
                    $type = 'image';
                }
                if ($request->file('file')->extension() == 'jpg') {
                    $type = 'image';
                }
                if ($request->file('file')->extension() == 'png') {
                    $type = 'image';
                }
                if ($request->file('file')->extension() == 'mp4') {
                    $type = 'video';
                }
                if ($request->file('file')->extension() == 'avi') {
                    $type = 'video';
                }
                if ($request->file('file')->extension() == 'mp3') {
                    $type = 'audio';
                }

                $time = Carbon::now();
                $image = $request->file('file');
                $extension = $image->getClientOriginalExtension();
                $filename = Str::random(5) . date_format($time, 'd') . rand(1, 9) . date_format($time, 'h').'.'.$extension;
                $key = 'footage/' . $filename;
                Storage::disk('s3')->put($key, file_get_contents($image), 'public');

                $media = new IncidentMedia();
                $media->incident = $request->incident;
                $media->type = $type;
                $media->file = $key;
                $media->save();

                return response()->json([
                    'status' => 'passed',
                    'message' => 'File successfully uploaded',
                    'file' => Storage::disk('s3')->url($key)
                ]);

            }catch(\Exception $e){
                return $this->json('failed', $e->getMessage());
            }

        }
    }

    public function vote(Request $request){

    }

    public function votes(Request $request){

    }

    public function tipoff(Request $request){
        $validate = validator::make($request->all(), ['description' => 'required|min:15']);

        if($validate->fails()){
            return $this->json('failed', 'Hi please ensure your tipoff has at-least 15 words before proceeding to submit it.');
        }else {
            $query = new IncidentTipOffs();

            $reporter = $query::where('incident', $request->incident)
                        ->where('user', Auth::user()->id)->first();

            if(!$reporter){
                $tipoff = new IncidentTipOffs();
                $serial = Str::uuid();

                $tipoff->incident = $request->incident;
                $tipoff->user = Auth::user()->id;
                $tipoff->description = $request->description;
                $tipoff->serial = $serial;
                $tipoff->save();

                return response()->json([
                    'status' => 'passed',
                    'message' => 'Hi we have successfully logged your tip off however we might need some footage regarding this report we will redirect you to the tipoff screen to upload your proof footage',
                    'serial' => $serial
                ]);

            }else{
                return $this->json('failed', 'Hi it appears you have submitted a report for this. To post an update simply go to your dashboard and select your tipoff and click update');
            }
        }
    }

    public function tipoff_media(Request $request){
        $validator = Validator::make($request->all(),[
            'tip' => 'required',
            'file' => 'required|mimes:jpeg,bmp,png,mp4,mov,ogg,qt,ogx,oga,ogv,ogg,webm',
        ]);

        if($validator->fails()){
            return $this->json('failed', 'Hi, we could not process your file uploads due to invalid extensions.');
        }else{
            $tipoff = new Incident();

            $files = $request->file('file');

            
            foreach($files as $file){

            }
        }
    }

    private function json($status, $message){
        return response()->json([
            'status' => $status,
            'message' => $message
        ]);
    }
}
