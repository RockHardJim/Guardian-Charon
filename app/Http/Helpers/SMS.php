<?php

namespace App\Http\Helpers\Sms;
use App\Http\Helpers\Tokens;
use Unirest\Request;
use Unirest;
use Exception;
class SMS{

    private $key = 'haSq2eb3SFm3uux81LGhng==';
    private $content;
    private $cellphone;

    public function otp($cellphone){
        $token = new Tokens\Token();
        $this->content = 'Hi to complete your '. env('APP_NAME') . ' registration please enter this code ' . $token->create($cellphone) . ' after signing in here '. route('login') . ' please note that the token is only valid for 60 minutes';
        $this->cellphone = $cellphone;
        $this->send();
    }

    public function incident($cellphone, $distance, $type, $token, $address){
        if($type == 'theft') {
            $this->content = 'Hi, a battery theft incident has occurred ' . $distance . 'km away from you at ' . $address . ' has just been reported, Please submit any tipoff you might have about this on ' . route('incident', $token) . ' to receive points';
            $this->cellphone = $cellphone;
            $this->send();
        }elseif($type == 'power'){
            $this->content = 'Hi, a power outage has been reported has occurred ' . $distance . 'km away from you. this may degrade network performance due to no power availability. To view updates on this incident goto ' . route('incident', $token);
            $this->cellphone = $cellphone;
            $this->send();
        }elseif($type == 'weather'){
            $this->content = 'Hi, a weather anomaly has been reported has occurred '. $distance .'km away from you. this may degrade network performance due to severe storms. To view updates on this incident goto '. route('incident', $token);
            $this->cellphone = $cellphone;
            $this->send();
        }
    }

    private function send(){
        $response = Unirest\Request::GET('https://platform.clickatell.com/messages/http/send?apiKey='.$this->key.'&to='.$this->cellphone.'&content='.$this->content);
    }
}
