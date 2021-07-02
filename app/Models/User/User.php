<?php

namespace App\Models\User;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use Notifiable;

    public $incrementing = false;

    /**
     * Sets the UUID value for the primary key field.
     */
    protected function setUUID()
    {
        $this->id = preg_replace('/\./', '', uniqid('id', true));
    }

    protected $fillable = ['name', 'surname', 'email', 'cellphone', 'password'];

    protected $hidden = [
        'password'
    ];


    public function profile(){
        return $this->hasOne('App\Models\User\Profile', 'identifier');
    }
    public function wallet(){
        return $this->hasOne('App\Models\User\Wallet', 'identifier');
    }
}
