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

        <!-- sidebar -->
        <div class="sidebar container container--sidebar pull-right full-height" data-offset="0">
            <!-- menu -->
            <nav class="menu sidebar__item visible-lg" data-offset="0">
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
            <!-- /menu -->
            <!-- places -->
            <section class="places sidebar__item" data-offset="0">
                <div class="places-toggle-wrapper visible-sm visible-md">
                    <button data-toggle-active="" class="places-toggle">
                        <span class="fa fa-bars fa-rotate-90"></span>
                    </button>
                </div>
                <div class="places-outer-wrapper">
                    <div class="places-wrapper">
                        <!-- places-header -->
                        <header class="places-header">
                            <span class="places-header__label">{{ env('APP_NAME') }}</span>
                            <button class="menu-toggle visible-lg">
                                <span class="fa fa-bars"></span>
                            </button>
                        </header>

                        <section class="places-block">
                            <header>
                                <h4 class="places-block__title">Incidents</h4>
                            </header>
                            <ul class="striped-list">

                            </ul>
                        </section>
                        <section class="places-block places-block--bottom">
                            <header>
                                <h4 class="places-block__title">Menu</h4>
                            </header>
                            <button data-toggle="modal" data-target="#incident" class="places-block__btn btn btn--contour-blue">Report Incident</button>
                        </section>
                    </div>
                </div>
            </section>
        </div>
    </main>
    <div class="modal fade" id="incident" tabindex="-1" role="dialog">
        <div class="container full-height">
            <div class="row full-height">
                <div class="col-lg-offset-4 col-lg-4 full-height">
                    <div class="modal-dialog-wrapper full-height">
                        <div class="modal-dialog">
                            <div class="login">
                                <div class="login-heading">
                                    <div class="login-heading-wrapper">
                                        <p class="login-heading__title">Incident Reporter!</p>
                                        <p class="login-heading__subtitle">Report an incident regarding network towers!</p>
                                    </div>
                                </div>
                                <form id="incident-form" action="{{ route('incident.create') }}" method="post" class="login-form">
                                    @csrf
                                    <input  class="login-form__input input input--blue" type="text" placeholder="Enter the name of place" name="site" autocomplete="off">
                                    <input  class="login-form__input input input--blue" type="text" id="address" name="address" placeholder="Enter Address" autocomplete="off">
                                        <p class="filter__title">Select the type of your report</p>
                                        <select name="type" class="custom-select">
                                            <option value="theft">Theft</option>
                                            <option value="weather">Severe Weather</option>
                                            <option value="power">Power Outage</option>
                                        </select>
                                    <div class="login-form__links">
                                        <div style="text-align: center;">
                                            <?php
                                            if(Auth::user()->role == 'administrator' || Auth::user()->role == 'security')
                                            {
                                            ?>
                                            <button class="btn btn--blue" id="submit" type="submit">Report</button>
                                            <?php
                                            }
                                            ?>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <!-- /login -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('javascript')
<script type="application/javascript">
    var placesAutocomplete = places({
        appId: 'plVY1KEL1Y98',
        apiKey: 'cb018db4e6ab2444fa54b2f08ce61d5b',
        container: document.querySelector('#address')
    });
    $('#incident-form').submit(function(event) {
        event.preventDefault();
        var data = $('#incident-form').serialize();

        $.ajax({
            method:'POST',
            url: $('#incident-form').attr('action'),
            data: data,
            beforeSend: function(response) {
                $('#submit').attr("disabled", true);
            },
            complete: function() {
                $('#submit').attr("disabled", false);
            }
        })
            .done(function(response) {
                if (response.status == 'failed') {
                    iziToast.error({
                        title: 'Error',
                        message: response.message,
                        position: 'center'
                    });

                    document.addEventListener('iziToast-closed', function(data) {
                        location.reload();
                    });
                } else {
                    iziToast.success({
                        title: 'Success',
                        message: response.message,
                        position: 'center'
                    });

                    document.addEventListener('iziToast-closed', function(data) {
                        window.location.href = '{{ url('app/studio') }}/'+response.token;
                    });
                }
            })

            .fail(function(response) {
                iziToast.error({
                    title: 'Error',
                    message: 'We have encountered an error in our rest services please try again later',
                    position: 'center'
                });

                document.addEventListener('iziToast-closed', function(data) {
                    location.reload();
                });
            });
    });
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
            <?php
            $incidents = \App\Models\Incidents\Incident::all();
            foreach($incidents as $incident){
            ?>
            {{ str_replace(' ', '', $incident->site) }}: country.SouthAfrica.addCity({
                id: {{ $incident->id }},
                code: '{{ $incident->identifier }}',
                name: '{{ $incident->site }}',
                latitude: {{ $incident->latitude }},
                longitude: {{ $incident->longitude }}
            }),
            <?php
                }
            ?>
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


            $ul.append(
                $('<li/>', {
                    'class': 'striped-list-item',
                    'data-overview-toggle': ''
                }).append(
                    $('<span/>', {
                        'class': 'striped-list-item__index',
                        'html': index + 1
                    })
                ).append(
                    $('<span/>', {
                        'class': 'striped-list-item__name',
                        'html': city.data('name')
                    })
                ).on('mouseover', function() {
                    map.panTo(city);
                    marker.infoWindow.show();
                }).on('click', function() {
                    window.location.href = '{{ url('app/incident') }}/'+city.data('code');
                })
            );

        });

    };

</script>
@endsection
