@extends('partials.app')
@section('content')
    @include('partials.navbar')
    <div id="content">
        <div class="login-signup-page mx-auto my-5">
            <h3 class="font-weight-400 text-center">Account Verification</h3>
            <p class="lead text-center">Hi {{ Auth::user()->name }} before you can continue using the platform please enter the verification code you received by sms below to unlock your account</p>
            <div class="bg-light shadow-md rounded p-4 mx-2">
                <form id="verify" method="post" action="{{ route('ajax.verify') }}">
                    @csrf
                    <div class="form-group">
                        <label for="token">Verification Code</label>
                        <input type="text" class="form-control" id="token" name="token" required placeholder="Verification Code" autocomplete="off">
                    </div>
                    <button id="submit" class="btn btn-primary btn-block my-4" type="submit">Verify</button>
                </form>
            </div>
            @endsection

            @section('javascript')
                <script type="application/javascript">
                    $('#verify').submit(function(event) {
                        event.preventDefault();
                        var data = $('#verify').serialize();

                        $.ajax({
                            method:'POST',
                            url: $('#verify').attr('action'),
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
