<?php

namespace App\Http\Controllers\Ajax;

use App\Http\Controllers\Controller;
use App\Models\User\{User, Profile, Wallet};
use Illuminate\Support\Facades\{Hash, Validator, Auth};
use Illuminate\Http\Request;
use App\Http\Helpers\{Tokens};
use Illuminate\Support\Str;
use Spatie\Geocoder\Geocoder;
class AuthController extends Controller
{
    //

    public function __construct(){
        $this->middleware('auth')->only(['profile', 'verify']);
    }

    public function login(Request $request){
        $validated = Validator::make($request->all(),
            [
                'email' => 'email|required',
                'cellphone' => 'required|min:10|max:10',
                'password' => 'required|min:6|max:15'
            ]
        );
        if($validated->fails()) {
            return $this->json('failed', 'Hi, ensure your email, cellphone and password have been entered correctly.');
        } else {
            if(!$this->exists($request->email, $request->cellphone)) {
                return $this->json('failed', 'Hi, it appears you currently do not have an account registered with us please register before logging in.');
            } else {
                $credentials = $request->only('cellphone', 'email', 'password');
                if(!Auth::attempt($credentials)) {
                    return $this->json('failed', 'Hi, we could not authenticate you using the details you provided please try again later.');
                } else {
                    return $this->json('passed', 'Hi, we have successfully authenticated you please wait while we redirect you.');
                }
            }
        }
    }

    public function register(Request $request){
        $validated = Validator::make($request->all(),
            [
                'name' => 'required|string',
                'surname' => 'required|string',
                'email' => 'email|required',
                'cellphone' => 'required|min:10|max:10',
                'password' => 'required|min:6|max:15'
            ]
        );

        if($validated->fails())
        {
            return $this->json('failed', 'Hi, ensure you have entered the required information correctly.');
        }
        else {
            try {
                $user = new User();

                if(!$this->exists($request->cellphone, $request->email)) {
                    $user->id = Str::uuid();
                    $user->name = $request->name;
                    $user->surname = $request->surname;
                    $user->email = $request->email;
                    $user->cellphone = $request->cellphone;
                    $user->password = Hash::make($request->password);
                    $user->save();
                    return $this->json('passed', 'Hi, we have created your new account please wait while we take you to your login page so you can verify your account');
                } else {
                    return $this->json('failed', 'Hi, it appears we already have record of this account please login into your account');
                }

            } catch (\Exception $e) {
                return $this->json('failed', 'Hi, we are having issues processing your request please try again later');
            }
        }
    }

    public function verify(Request $request){
        $token = new Tokens\Token();
        $validated = Validator::make($request->all(), ['token' => 'required']);
        if($validated->fails()){
            return $this->json('failed', 'Hi, ensure you have entered the required information correctly.');
        } else {
            if($token->validate($request->token)){
                $user = new User();
                $user::where('cellphone', Auth::user()->cellphone)->update(['status' => 'active']);

                $wallet = new Wallet();
                $wallet->identifier = Auth::user()->id;
                $wallet->save();

                return $this->json('passed', 'Hi, we have successfully activated your account we will redirect you to your profile creation menu shortly.');
            } else {
                return $this->json('failed', 'Hi, either your token is invalid or it has expired.');
            }
        }
    }

    public function forgot(Request $request){

    }

    public function profile(Request $request){
        $validated = Validator::make($request->all(),
            [
                'address' => 'required',
                'identity_number' => 'required|min:13|max:13',
                'gender' => 'required'
            ]
        );

        if($validated->fails()){
            return $this->json('failed', 'Hi, ensure you have entered the required information correctly.');
        } else {

            $user = new User();
            if(!$user::find(Auth::user()->id)->profile){
                try {
                    $profile = new Profile();
                    //$client = new \GuzzleHttp\Client();

                    //$geocoder = new Geocoder($client);

                    //$geocoder->setApiKey(config('geocoder.key'));

                    //$coords = $geocoder->getCoordinatesForAddress($request->address);

                    $profile->identifier = Auth::user()->id;
                    $profile->identity_number = encrypt($request->identity_number);
                    $profile->latitude = '-25.9975646,28'  ;//just use $coords['lat'] if you want dynamic
                    $profile->longitude = '28.1426502';//just use $coords['lng'] if you want dynamic
                    $profile->gender = $request->gender;
                    $profile->save();
                    return $this->json('passed', 'Hi, we have successfully created your profile we will redirect you shortly to your user menu.');
                }catch(\Exception $e){
                    return $this->json('failed', $e->getMessage());
                }
            } else {
                return $this->json('failed', 'Hi, it appears you already have enrolled your profile with us.');
            }
        }
    }

    private function json($status, $message){
        return response()->json([
            'status' => $status,
            'message' => $message
        ]);
    }

    private function exists($email, $cellphone){
        $user = new User();

        if(count($user::where('cellphone', $cellphone)->get()) >= 1){
            return true;
        } else {
            return false;
        }
    }
}
