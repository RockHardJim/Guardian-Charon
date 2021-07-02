<?php
namespace App\Http\Helpers\Tokens;
use App\Models\Misc\Tokey;
use Illuminate\Support\Facades\Auth;
use Tzsk\Otp\Facades\Otp;

class Token{

    public function create($cellphone){
        $secret = md5($cellphone);
        $token = Otp::digits(8)->expiry(60)->generate($secret);
        $tokey = new Tokey();
        $tokey->token = $token;
        $tokey->secret = $secret;
        $tokey->save();
        return $token;
    }

    public function validate($token){
        $tokey = new Tokey();
        $information = $tokey::where('token', $token)->first();
        if(!$information) {
            return false;
        } else {
            if($information->status == 'live'){
                if(Otp::digits(8)->expiry(60)->check($token, md5(Auth::user()->cellphone))){
                    $information::where('token', $token)->update(['status' => 'used']);
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }

    public function invalidate($token){

    }
}
