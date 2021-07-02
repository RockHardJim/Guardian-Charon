@extends('partials.appmap')
@section('content')
    <main>
        <div id="map"></div>
        <a href="{{ route('home') }}" class="myworld hidden-xs">{{ env('APP_NAME') }}</a>
        <button data-toggle-active=".mobile-menu" class="mobile-menu-toggle mobile-menu-toggle--tablet visible-sm visible-md">
            <span class="fa fa-bars"></span>
        </button>
        <header class="mobile-header visible-xs">
            <button data-toggle-active=".mobile-menu" class="mobile-menu-toggle mobile-header__btn active pull-left"><span class="fa fa-bars"></span></button>
            <button data-overview-toggle class="mobile-header__btn mobile-header__btn--map pull-right active">
                <span class="fa"></span>
            </button>
            <a href="{{ route('home') }}" class="myworld">{{ env('APP_NAME') }}</a>
        </header>

        <div class="sidebar container container--sidebar pull-right full-height" data-offset="0">
            <section class="overview overview--mobile-active overview--single sidebar__item active" data-offset="0">
                <header class="overview__header overview-header overview-block ">
                    <div class="overview-header-wrapper">
                        <button class="menu-toggle menu-toggle--overview visible-lg">
                            <span class="fa fa-bars"></span>
                        </button>
                        <h1 class="overview-header__title">{{ $incident->site }} </h1>
                    </div>
                </header>
                <!-- /overview-header -->
                <!-- place-view -->
                <section class="place-view place-view--slider overview-block">
                    <div class="place-view__imgs place-view-imgs">
                        <?php
                        foreach($media as $pictures)
                        {
                            if($pictures->type == 'image')
                            {
                        ?>
                        <img class="place-view-imgs__item active" id="{{ $pictures->id }}-img" src="{{ Storage::disk('s3')->url($pictures->file) }}" alt="" />
                        <?php
                            }
                        }?>
                    </div>
                    <ul class="place-view__thumbs place-view-thumbs">
                        <?php
                        foreach($media as $pictures)
                        {
                            if($pictures->type == 'image')
                            {
                                ?>
                        <li data-add-active="#{{ $pictures->id }}-img" data-add-active-individual=".place-view-imgs__item" class="place-view-thumbs__item">
                            <img src="{{ Storage::disk('s3')->url($pictures->file) }}" alt="" />
                        </li>
                            <?php
                            }
                            }?>
                    </ul>
                </section>
                <!-- /place-view -->
                <!-- place-descriptipon -->
                <section class="place-description overview-block">
                    <p class="place-description__desc">{{ $profile->description }}</p>
                </section>
                <!-- /place-descriptipon -->
                <header class="overview-heading">
                    <h3>CCTV footage of incident</h3>
                </header>
                <!-- instagram -->
                <section class="overview-block instagram clearfix">
                    <a href="img/instagram/1_big.jpg" data-rel="instagram" class="lightbox instagram__item">
                        <img src="img/instagram/1.jpg" alt="" />
                    </a>
                    <a href="img/instagram/2_big.jpg" data-rel="instagram" class="lightbox instagram__item">
                        <img src="img/instagram/2.jpg" alt="" />
                    </a>
                    <a href="img/instagram/3_big.jpg" data-rel="instagram" class="lightbox instagram__item">
                        <img src="img/instagram/3.jpg" alt="" />
                    </a>
                    <a href="img/instagram/4_big.jpg" data-rel="instagram" class="lightbox instagram__item">
                        <img src="img/instagram/4.jpg" alt="" />
                    </a>
                    <a class="instagram__item instagram__item--icon">
                        <img src="img/icons/insta.png" alt="" />
                    </a>
                </section>
                <!-- /instagram -->
                <!-- booking -->
                <section class="booking overview-block">
                    <p class="booking__title">Tools
                    </p>
                    <center><button data-toggle="modal" data-target="#booking" class="btn btn--red btn--long">Submit Tipoff</button></center>
                </section>
                <!-- /booking -->


                <section class="grid">
                    <header class="overview-heading">
                        <h3>Reports Near Site</h3>
                    </header>
                    <div class="overview-block overview-block--fluid grid-container">
                        <div class="container-fluid">
                            <div class="row">
                                <div class="grid-item grid-item--big clearfix col-md-12">
                                    <div class="grid-item-wrapper">
                                        <a href="open_places.html" class="grid-item__title">Central park</a>
                                        <p class="grid-item__desc">Get a history lesson on possibly the world's most famous beverage</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </section>
            <!-- /overview -->
            <!-- menu -->
            <nav class="menu sidebar__item menu--hidden" data-offset="0">
                <a href="{{ route('map') }}" class="menu-item menu-item-active">
                    <svg class="menu-item__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="14px" viewBox="0 0 16 14">
                        <path d="M-0 0C-0 0 5 3 5 3 5 3 5 14 5 14 5 14-0 11-0 11-0 11-0 0-0 0ZM 11 11C 11 11 16 14 16 14 16 14 16 3 16 3 16 3 11 0 11 0 11 0 11 11 11 11ZM 6 14C 6 14 10 11 10 11 10 11 10 0 10 0 10 0 6 3 6 3 6 3 6 14 6 14Z" fill="rgb(43,43,42)" />
                    </svg>
                    <span class="menu-item__title">Map</span>
                </a>
                <a href="{{ route('frontend.dashboard') }}" class="menu-item">
                    <svg class="menu-item__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="12px" height="16px" viewBox="0 0 12 16">
                        <path d="M 11 16C 11 16 1 16 1 16 0.45 16-0 15.55-0 15-0 15-0 11-0 11-0 9.9 0.9 9 2 9 2 9 4 9 4 9 4 9 6 12 6 12 6 12 8 9 8 9 8 9 10 9 10 9 11.11 9 12 9.9 12 11 12 11 12 15 12 15 12 15.55 11.55 16 11 16ZM 6 8C 4.07 8 2.5 6.21 2.5 4 2.5 1.79 4.07 0 6 0 7.93 0 9.5 1.79 9.5 4 9.5 6.21 7.93 8 6 8ZM 6 7C 6.55 7 7 6.55 7 6 7 6 5 6 5 6 5 6.55 5.45 7 6 7ZM 7 2.21C 6.8 2.59 6.47 2.97 6.03 3.28 5.16 3.89 4.17 4.03 3.66 3.65 3.56 3.92 3.5 4.2 3.5 4.5 3.5 5 3.65 5.45 3.9 5.84 3.9 5.84 6 5 6 5 6 5 8.1 5.84 8.1 5.84 8.35 5.45 8.5 5 8.5 4.5 8.5 3.48 7.88 2.6 7 2.21Z" fill="rgb(43,43,42)" />
                    </svg>
                    <span class="menu-item__title">Dashboard</span>
                </a>
                <a href="#" class="menu-item">
                    <svg class="menu-item__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" viewBox="0 0 16 16">
                        <path d="M 3 2C 3 2 3 1 3 1 3 0.45 3.45-0 4-0 4.55-0 5 0.45 5 1 5 1 5 2 5 2 5 2.55 4.55 3 4 3 3.45 3 3 2.55 3 2ZM 10 3C 10.55 3 11 2.55 11 2 11 2 11 1 11 1 11 0.45 10.55-0 10-0 9.45-0 9 0.45 9 1 9 1 9 2 9 2 9 2.55 9.45 3 10 3ZM 14 14C 14 14-0 14-0 14-0 14-0 2-0 2-0 2 2.5 2 2.5 2 2.5 2.83 3.17 3.5 4 3.5 4.83 3.5 5.5 2.83 5.5 2 5.5 2 8.5 2 8.5 2 8.5 2.83 9.17 3.5 10 3.5 10.83 3.5 11.5 2.83 11.5 2 11.5 2 14 2 14 2 14 2 14 14 14 14ZM 13 5C 13 5 1 5 1 5 1 5 1 13 1 13 1 13 13 13 13 13 13 13 13 5 13 5ZM 15 3C 15 3 15 15 15 15 15 15 1 15 1 15 1 15 1 16 1 16 1 16 16 16 16 16 16 16 16 3 16 3 16 3 15 3 15 3ZM 5 6C 5 6 3 6 3 6 3 6 3 8 3 8 3 8 5 8 5 8 5 8 5 6 5 6ZM 8 6C 8 6 6 6 6 6 6 6 6 8 6 8 6 8 8 8 8 8 8 8 8 6 8 6ZM 11 6C 11 6 9 6 9 6 9 6 9 8 9 8 9 8 11 8 11 8 11 8 11 6 11 6ZM 5 9C 5 9 3 9 3 9 3 9 3 11 3 11 3 11 5 11 5 11 5 11 5 9 5 9ZM 8 9C 8 9 6 9 6 9 6 9 6 11 6 11 6 11 8 11 8 11 8 11 8 9 8 9ZM 11 9C 11 9 9 9 9 9 9 9 9 11 9 11 9 11 11 11 11 11 11 11 11 9 11 9Z" fill="rgb(43,43,42)" />
                    </svg>
                    <span class="menu-item__title">NEWS</span>
                </a>
            </nav>
        </div>
    </main>


    <!-- mobile menu -->
    <nav class="mobile-menu">
        <div class="mobile-menu-wrapper">
            <a href="{{ route('map') }}" class="menu-item menu-item-active">
                <svg class="menu-item__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="14px" viewBox="0 0 16 14">
                    <path d="M-0 0C-0 0 5 3 5 3 5 3 5 14 5 14 5 14-0 11-0 11-0 11-0 0-0 0ZM 11 11C 11 11 16 14 16 14 16 14 16 3 16 3 16 3 11 0 11 0 11 0 11 11 11 11ZM 6 14C 6 14 10 11 10 11 10 11 10 0 10 0 10 0 6 3 6 3 6 3 6 14 6 14Z" fill="rgb(43,43,42)" />
                </svg>
                <span class="menu-item__title">Map</span>
            </a>
            <a href="{{ route('frontend.dashboard') }}" class="menu-item">
                <svg class="menu-item__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="12px" height="16px" viewBox="0 0 12 16">
                    <path d="M 11 16C 11 16 1 16 1 16 0.45 16-0 15.55-0 15-0 15-0 11-0 11-0 9.9 0.9 9 2 9 2 9 4 9 4 9 4 9 6 12 6 12 6 12 8 9 8 9 8 9 10 9 10 9 11.11 9 12 9.9 12 11 12 11 12 15 12 15 12 15.55 11.55 16 11 16ZM 6 8C 4.07 8 2.5 6.21 2.5 4 2.5 1.79 4.07 0 6 0 7.93 0 9.5 1.79 9.5 4 9.5 6.21 7.93 8 6 8ZM 6 7C 6.55 7 7 6.55 7 6 7 6 5 6 5 6 5 6.55 5.45 7 6 7ZM 7 2.21C 6.8 2.59 6.47 2.97 6.03 3.28 5.16 3.89 4.17 4.03 3.66 3.65 3.56 3.92 3.5 4.2 3.5 4.5 3.5 5 3.65 5.45 3.9 5.84 3.9 5.84 6 5 6 5 6 5 8.1 5.84 8.1 5.84 8.35 5.45 8.5 5 8.5 4.5 8.5 3.48 7.88 2.6 7 2.21Z" fill="rgb(43,43,42)" />
                </svg>
                <span class="menu-item__title">Dashboard</span>
            </a>
            <a href="#" class="menu-item">
                <svg class="menu-item__icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="16px" height="16px" viewBox="0 0 16 16">
                    <path d="M 3 2C 3 2 3 1 3 1 3 0.45 3.45-0 4-0 4.55-0 5 0.45 5 1 5 1 5 2 5 2 5 2.55 4.55 3 4 3 3.45 3 3 2.55 3 2ZM 10 3C 10.55 3 11 2.55 11 2 11 2 11 1 11 1 11 0.45 10.55-0 10-0 9.45-0 9 0.45 9 1 9 1 9 2 9 2 9 2.55 9.45 3 10 3ZM 14 14C 14 14-0 14-0 14-0 14-0 2-0 2-0 2 2.5 2 2.5 2 2.5 2.83 3.17 3.5 4 3.5 4.83 3.5 5.5 2.83 5.5 2 5.5 2 8.5 2 8.5 2 8.5 2.83 9.17 3.5 10 3.5 10.83 3.5 11.5 2.83 11.5 2 11.5 2 14 2 14 2 14 2 14 14 14 14ZM 13 5C 13 5 1 5 1 5 1 5 1 13 1 13 1 13 13 13 13 13 13 13 13 5 13 5ZM 15 3C 15 3 15 15 15 15 15 15 1 15 1 15 1 15 1 16 1 16 1 16 16 16 16 16 16 16 16 3 16 3 16 3 15 3 15 3ZM 5 6C 5 6 3 6 3 6 3 6 3 8 3 8 3 8 5 8 5 8 5 8 5 6 5 6ZM 8 6C 8 6 6 6 6 6 6 6 6 8 6 8 6 8 8 8 8 8 8 8 8 6 8 6ZM 11 6C 11 6 9 6 9 6 9 6 9 8 9 8 9 8 11 8 11 8 11 8 11 6 11 6ZM 5 9C 5 9 3 9 3 9 3 9 3 11 3 11 3 11 5 11 5 11 5 11 5 9 5 9ZM 8 9C 8 9 6 9 6 9 6 9 6 11 6 11 6 11 8 11 8 11 8 11 8 9 8 9ZM 11 9C 11 9 9 9 9 9 9 9 9 11 9 11 9 11 11 11 11 11 11 11 11 9 11 9Z" fill="rgb(43,43,42)" />
                </svg>
                <span class="menu-item__title">NEWS</span>
            </a>
        </div>
    </nav>
@endsection

@section('javascript')
    <script type="application/javascript">
        function initData () {

            var country = {
                SouthAfrica: new MyWorld.Country({
                    id: 1,
                    code: 'za',
                    name: 'South Africa',
                    latitude: -34.2969541,
                    longitude: 18.2479026
                }),
            };

            var reports = {
            {{ str_replace(' ', '', $incident->site) }}: country.SouthAfrica.addCity({
                id: {{ $incident->id }},
                code: '{{ $incident->identifier }}',
                name: '{{ $incident->site }}',
                latitude: {{ $incident->latitude }},
                longitude: {{ $incident->longitude }}
            }),
        };

            return {
                country: country,
                reports: reports,
            };
        };


        var data;

        function initMap() {

            data = initData();

            var $ul = $('ul.striped-list').empty();


            var map = data.country.SouthAfrica.createMap('#map').on('click', function() {

            });

            data.country.SouthAfrica.getCities().map(function(city, index) {

                var marker = city.createMarker(map).on('click', function() {

                });


            });

        };

    </script>
@endsection
