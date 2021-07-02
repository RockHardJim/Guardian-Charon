@extends('partials.app')

@section('content')
    @include('partials.navbar')
    <div id="content">
        <div class="login-signup-page mx-auto my-5">
            <h3 class="font-weight-400 text-center">Register</h3>
            <p class="lead text-center">Create your {{ env('APP_NAME') }} account.</p>
            <div class="bg-light shadow-md rounded p-4 mx-2">
                <form id="register" method="post" action="{{ route('ajax.register') }}">
                    @csrf
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" class="form-control" id="name" name="name" required placeholder="Enter Your Name" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label for="surname">Surname</label>
                        <input type="text" class="form-control" id="surname" name="surname" required placeholder="Enter Your Surname" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" class="form-control" id="email" name="email" required placeholder="Enter Your Email" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label for="cellphone">Cellphone Number</label>
                        <input type="tel" class="form-control" id="cellphone" name="cellphone" required placeholder="Enter Your Cellphone Number" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" class="form-control" id="password" name="password" required placeholder="Enter Your Password" autocomplete="off">
                    </div>
                    <button id="submit" class="btn btn-primary btn-block my-4" type="submit">Register</button>
                </form>
                <p class="text-3 text-muted text-center mb-0">Have an account? <a class="btn-link" href="{{ route('login') }}">Login</a></p>
            </div>
@endsection

@section('javascript')
                <script type="application/javascript">
                    $('#register').submit(function(event) {
                        event.preventDefault();
                        var data = $('#register').serialize();

                        $.ajax({
                            method:'POST',
                            url: $('#register').attr('action'),
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
                                        location.reload();
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
                </script>
@endsection
