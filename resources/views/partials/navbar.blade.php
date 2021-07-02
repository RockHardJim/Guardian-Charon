<div id="main-wrapper" class="boxed">
    <header id="header">
        <div class="container">
            <div class="header-row">
                <div class="header-column justify-content-start">
                    <div class="logo"> <a class="d-flex" href="{{ route('home') }}" title="{{ env('APP_NAME') }}"><img src="#" alt="{{ env('APP_NAME') }}" /></a> </div>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#header-nav"> <span></span> <span></span> <span></span> </button><!-- Collapse Button end -->
                    <nav class="primary-menu navbar navbar-expand-lg">
                        <div id="header-nav" class="collapse navbar-collapse">
                            <ul class="navbar-nav mr-auto">
                                <li><a href="{{ route('home') }}">Home</a></li>
                                <li><a href="{{ route('map') }}">Incidents</a></li>
                                <li><a href="#">News</a></li>
                                <li><a href="#">About</a></li>
                            </ul>
                        </div>
                    </nav>
                </div>
                <div class="header-column justify-content-end">
                    <nav class="login-signup navbar navbar-expand">
                        <ul class="navbar-nav">
                            @guest
                            <li><a href="{{ route('login') }}">Login</a> </li>
                            <li class="align-items-center h-auto ml-sm-3"><a class="btn btn-primary d-none d-sm-block" href="{{ route('register') }}">Register</a></li>
                            @endguest
                            @auth
                                    <li><a href="{{ route('frontend.dashboard') }}">Dashboard</a> </li>
                            @endauth
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    </header>
