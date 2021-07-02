@extends('partials.app')

@section('content')
    @include('partials.navbar')
    <div id="content">
        <div class="login-signup-page mx-auto my-5">
            <h3 class="font-weight-400 text-center">Profile Creation</h3>
            <p class="lead text-center">Hi <b>{{ Auth::user()->name }}</b> we are just wrapping up here, Before we let you go on your crime busting journey we still need a few bits of information from you to finalize your account</p>
            <div class="bg-light shadow-md rounded p-4 mx-2">
                <form id="profile" method="post" action="{{ route('ajax.profile') }}">
                    @csrf
                    <div class="form-group">
                        <label for="identity_number">Identity Number</label>
                        <input type="text" class="form-control" id="identity_number" name="identity_number" required placeholder="Your ID Number" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label for="address">Residential Address</label>
                        <input type="text" class="form-control" id="address" name="address" required placeholder="Your Residential Address" autocomplete="off">
                    </div>
                    <div class="form-group">
                        <label for="inputCountry">Gender</label>
                        <select class="custom-select" id="gender" name="gender">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="non-binary">Non Binary</option>
                            <option value="unknown">Unknown</option>
                        </select>
                    </div>
                    <button id="submit" class="btn btn-primary btn-block my-4" type="submit">Submit</button>
                </form>
            </div>
            @endsection

            @section('javascript')
                <script type="application/javascript">
                    $('#profile').submit(function(event) {
                        event.preventDefault();
                        var data = $('#profile').serialize();

                        $.ajax({
                            method: $('#profile').attr('method'),
                            url: $('#profile').attr('action'),
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
