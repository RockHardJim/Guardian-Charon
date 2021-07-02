@extends('partials.app')
@section('content')
    @include('partials.navbar')
    <?php
    $user = new \App\Models\User\User();
    $wallet = $user::find(Auth::user()->id)->wallet;
    ?>
    <div id="content" class="py-4">
        <div class="container">
            <div class="row">
                <aside class="col-lg-3">
                    <div class="bg-light shadow-sm rounded text-center p-3 mb-4">
                        <div class="profile-thumb mt-3 mb-4"> <img class="rounded-circle" src="{{ Avatar::create(Auth::user()->name .' '. Auth::user()->surname)->toBase64() }}" alt="">
                        </div>
                        <p class="text-3 font-weight-500 mb-2">Hi, {{ Auth::user()->name .' '. Auth::user()->surname }}</p>
                    </div>
                </aside>
                <div class="col-lg-9">

                    <!-- Profile Completeness
                    =============================== -->
                    <div class="bg-light shadow-sm rounded p-4 mb-4">
                        <h3 class="text-5 font-weight-400 d-flex align-items-center mb-3">Applications</h3>
                        <div class="row profile-completeness">
                            <div class="col-sm-6 col-md-3 mb-4 mb-sm-0">
                                <div class="border rounded p-3 text-center"> <span class="d-block text-10 text-light mt-2 mb-3"><i class="fas fa-map-marked"></i></span> <span class="text-5 d-block text-light mt-4 mb-3"></span>
                                    <p class="mb-0"><a class="btn-link stretched-link" href="{{ route('map') }}">Incident Map</a></p>
                                </div>
                            </div>
                            <div class="col-sm-6 col-md-3 mb-4 mb-sm-0">
                                <div class="border rounded p-3 text-center"> <span class="d-block text-10 text-light mt-2 mb-3"><i class="fas fa-user-secret"></i></span> <span class="text-5 d-block text-light mt-4 mb-3"></span>
                                    <p class="mb-0"><a class="btn-link stretched-link" href="#">Tipoff Center</a></p>
                                </div>
                            </div>
                            <div class="col-sm-6 col-md-3 mb-4 mb-sm-0">
                                <div class="border rounded p-3 text-center"> <span class="d-block text-10 text-light mt-2 mb-3"><i class="fas fa-map-marked"></i></span> <span class="text-5 d-block text-light mt-4 mb-3"></span>
                                    <p class="mb-0"><a class="btn-link stretched-link" href="#">Incident Administrator</a></p>
                                </div>
                            </div>
                            <div class="col-sm-6 col-md-3">
                                <div class="border rounded p-3 text-center"> <span class="d-block text-10 text-light mt-2 mb-3"><i class="fas fa-university"></i></span> <span class="text-5 d-block text-light mt-4 mb-3"></span>
                                    <p class="mb-0"><a class="btn-link stretched-link" href="#">User Manager</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
@endsection
