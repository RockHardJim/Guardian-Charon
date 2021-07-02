<?php

namespace App\Observers;

use App\Models\User\User;
use App\Http\Helpers\{SMS};

class UserObserver
{
    /**
     * Handle the user "created" event.
     *
     * @param  \App\Models\User\User  $user
     * @return void
     */
    public function created(User $user)
    {
        $sms = new \App\Http\Helpers\Sms\SMS();
        $sms->otp($user->cellphone);
    }

    /**
     * Handle the user "updated" event.
     *
     * @param  \App\Models\User\User  $user
     * @return void
     */
    public function updated(User $user)
    {
        //
    }

    /**
     * Handle the user "deleted" event.
     *
     * @param  \App\Models\User\User  $user
     * @return void
     */
    public function deleted(User $user)
    {
        //
    }

    /**
     * Handle the user "restored" event.
     *
     * @param  \App\Models\User\User  $user
     * @return void
     */
    public function restored(User $user)
    {
        //
    }

    /**
     * Handle the user "force deleted" event.
     *
     * @param  \App\Models\User\User  $user
     * @return void
     */
    public function forceDeleted(User $user)
    {
        //
    }
}
