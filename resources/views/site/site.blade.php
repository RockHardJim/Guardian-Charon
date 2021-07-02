@extends('partials.app')

@section('content')
    @include('partials.navbar')
    <div id="content">
        <div class="owl-carousel owl-theme single-slideshow" data-autoplay="true" data-loop="true" data-autoheight="true" data-nav="true" data-items="1">
            <div class="item">
                <section class="hero-wrap section shadow-md">
                    <div class="hero-mask opacity-7 bg-dark"></div>
                    <div class="hero-bg" style="background-image:url('{{ asset('images/sliders/711fun.jpg') }}');"></div>

                    <div class="hero-content py-2 py-lg-5">
                        <div class="container text-center">
                            <h2 class="text-16 text-white">Report Tower Battery Thefts</h2>
                            <p class="text-5 text-white mb-4">Use this platform to submit tip-offs and report network tower incidents
                                in your area and get rewarded with redeemable points.</p>
                    </div>
                </section>
            </div>
            <div class="item">
                <section class="hero-wrap section shadow-md">
                    <div class="hero-bg" style="background-image:url('{{ asset('images/sliders/antenne-telcom2.jpg') }}');"></div>
                    <div class="hero-content py-2 py-lg-4">
                        <div class="container">
                            <div class="row">
                                <div class="col-12 col-lg-8 col-xl-7 text-center text-lg-left">
                                    <h2 class="text-13 text-white">Help us end the siege.</h2>
                                    <p class="text-5 text-white mb-4">Participate in our community based reporting platform to report network tower battery theft incidents and get rewarded for successful reports.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
        <section class="section bg-light">
            <div class="container">
                <h2 class="text-9 text-center">What can you do with {{ env('APP_NAME') }}</h2>
                <p class="text-4 text-center mb-5">Below are some of the features we have on this platform.</p>
                <div class="row">
                    <div class="col-sm-6 col-lg-3 mb-4"> <a href="#">
                            <div class="featured-box style-5 rounded">
                                <div class="featured-box-icon text-primary"> <i class="fas fa-bullhorn"></i> </div>
                                <h3>Report Incidents</h3>
                            </div>
                        </a> </div>
                    <div class="col-sm-6 col-lg-3 mb-4"> <a href="#">
                            <div class="featured-box style-5 rounded">
                                <div class="featured-box-icon text-primary"> <i class="fas fa-compass"></i> </div>
                                <h3>Submit Tip-offs</h3>
                            </div>
                        </a> </div>
                    <div class="col-sm-6 col-lg-3 mb-4"> <a href="#">
                            <div class="featured-box style-5 rounded">
                                <div class="featured-box-icon text-primary"> <i class="fas fa-coins"></i> </div>
                                <h3>Rewards Wallet</h3>
                            </div>
                        </a> </div>
                    <div class="col-sm-6 col-lg-3 mb-4"> <a href="#">
                            <div class="featured-box style-5 rounded">
                                <div class="featured-box-icon text-primary"> <i class="far fa-chart-bar"></i> </div>
                                <h3>Tower Intelligence</h3>
                            </div>
                        </a> </div>
                </div>
            </div>
        </section>
        <section class="section py-5">
            <div class="container">
                <div class="justify-content-center text-center">
                    <h2 class="text-9">Get the {{ env('APP_NAME') }} App</h2>
                    <p class="text-4 mb-4">We are working on our new mobile which will be available on these following platforms</p>
                    <a class="d-inline-flex mx-3" href="#"><img alt="" src="{{ asset('app/images/app-store.png') }}"></a> <a class="d-inline-flex mx-3" href="#"><img alt="" src="{{ asset('app/images/google-play-store.png') }}"></a> </div>
            </div>
        </section>
@endsection

@section('javascript')

@endsection
