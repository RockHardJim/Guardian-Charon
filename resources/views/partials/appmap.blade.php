<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <title>{{ env('APP_NAME') }} – MapView</title>
    <link rel="stylesheet" href="{{asset('map/bower_components/bootstrap/dist/css/bootstrap.min.css')}}">
    <link rel="stylesheet" href="{{asset('map/bower_components/font-awesome/css/font-awesome.min.css')}}">
    <link rel="stylesheet" href="{{asset('map/fonts/stylesheet.css')}}">
    <link rel="stylesheet" href="{{asset('map/css/main.css')}}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css" integrity="sha256-f6fW47QDm1m01HIep+UjpCpNwLVkBYKd+fhpb4VQ+gE=" crossorigin="anonymous" />
</head>
<body>
@yield('content')
<script type="text/javascript" src="{{asset('map/js/bundle.js')}}"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.min.js" integrity="sha256-321PxS+POvbvWcIVoRZeRmf32q7fTFQJ21bXwTNWREY=" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/places.js@1.17.1"></script>
<script type="text/javascript" src="{{asset('map/js/myworld/build/myworld.js')}}"></script>
@yield('javascript')
<script async defer src="https://maps.googleapis.com/maps/api/js?key={{ env('google_key') }}&callback=initMap"></script>
</body>
</html>
