<?php

namespace App\Http\Middleware\User;

use Closure;
use Illuminate\Support\Facades\{Auth};
use App\Models\User\User;

class Verify
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(Auth::user()->status == 'unverified'){
            return response()->view('app.auth.verify');
        }elseif(!User::find(Auth::user()->id)->profile){
            return response()->view('app.auth.profile');
        }

            return $next($request);
    }
}
