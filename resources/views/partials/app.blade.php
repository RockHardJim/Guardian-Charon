<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1.0, shrink-to-fit=no">
    <title>{{ env('APP_NAME') }} - Network Tower Theft Reports</title>
    <meta name="description" content="Anti network tower battery theft system powered by the community.">
    <meta name="author" content="Tumelo Baloyi">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <script src="https://cdn.jsdelivr.net/npm/places.js@1.17.1"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script src="{{ asset('app/vendor/bootstrap/js/bootstrap.bundle.min.js') }}"></script>
    <script src="{{ asset('app/vendor/owl.carousel/owl.carousel.min.js') }}"></script>
    <script src="{{ asset('app/vendor/bootstrap-select/js/bootstrap-select.min.js') }}"></script>
    <script src="{{ asset('app/vendor/daterangepicker/moment.min.js') }}"></script>
    <script src="{{ asset('app/vendor/daterangepicker/daterangepicker.js') }}"></script>
    <script src="{{ asset('app/js/theme.js') }}"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/js/iziToast.min.js" integrity="sha256-321PxS+POvbvWcIVoRZeRmf32q7fTFQJ21bXwTNWREY=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-material-datetimepicker/2.7.1/js/bootstrap-material-datetimepicker.min.js" integrity="sha256-Wj9bkvbfcB8UgPBenFOyjr0MBkdHsL2NACVTQ8+Q0JE=" crossorigin="anonymous"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.js"></script>
    <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Rubik:300,300i,400,400i,500,500i,700,700i,900,900i' type='text/css'>
    <link rel="stylesheet" http-equiv="x-pjax-version"  type="text/css" href="{{ asset('app/vendor/bootstrap/css/bootstrap.min.css') }}" />
    <link rel="stylesheet" http-equiv="x-pjax-version"  type="text/css" href="{{ asset('app/vendor/font-awesome/css/all.min.css') }}" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-material-datetimepicker/2.7.1/css/bootstrap-material-datetimepicker.min.css" integrity="sha256-h472ZYEQbdqAvtB9tQqzpmBApho+fZfF8MmPwTHaqas=" crossorigin="anonymous" />
    <link rel="stylesheet" http-equiv="x-pjax-version"  type="text/css" href="{{ asset('app/vendor/owl.carousel/assets/owl.carousel.min.css') }}" />
    <link rel="stylesheet" http-equiv="x-pjax-version"  type="text/css" href="{{ asset('app/css/stylesheet.css') }}" />
    <link rel="stylesheet" http-equiv="x-pjax-version"  type="text/css" href="{{ asset('app/vendor/currency-flags/css/currency-flags.min.css') }}" />
    <link rel="stylesheet" http-equiv="x-pjax-version"  type="text/css" href="{{ asset('app/vendor/daterangepicker/daterangepicker.css') }}" />
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.css">
    <script src="https://transloadit.edgly.net/releases/uppy/v1.7.0/uppy.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gasparesganga-jquery-loading-overlay@2.1.6/dist/loadingoverlay.min.js"></script>
    <link href="https://transloadit.edgly.net/releases/uppy/v1.7.0/uppy.min.css" rel="stylesheet">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/izitoast/1.4.0/css/iziToast.min.css" integrity="sha256-f6fW47QDm1m01HIep+UjpCpNwLVkBYKd+fhpb4VQ+gE=" crossorigin="anonymous" />
</head>
<body>
<div id="preloader">
    <div data-loader="dual-ring"></div>
</div>
@yield('content')

</div>
<footer id="footer">
    <div class="container">
        <div class="row">
            <div class="col-lg d-lg-flex align-items-center">
                <ul class="nav justify-content-center justify-content-lg-start text-3">
                    <li class="nav-item"> <a class="nav-link active" href="#">About</a></li>
                    <li class="nav-item"> <a class="nav-link" href="#">Support</a></li>
                    <li class="nav-item"> <a class="nav-link" href="#">Help</a></li>
                    <li class="nav-item"> <a class="nav-link" href="#">Rewards</a></li>
                </ul>
            </div>
            <div class="col-lg d-lg-flex justify-content-lg-end mt-3 mt-lg-0">
                <ul class="social-icons justify-content-center">
                    <li class="social-icons-facebook"><a data-toggle="tooltip" href="http://www.facebook.com/" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a></li>
                    <li class="social-icons-twitter"><a data-toggle="tooltip" href="http://www.twitter.com/" target="_blank" title="Twitter"><i class="fab fa-twitter"></i></a></li>
                    <li class="social-icons-google"><a data-toggle="tooltip" href="http://www.google.com/" target="_blank" title="Google"><i class="fab fa-google"></i></a></li>
                    <li class="social-icons-youtube"><a data-toggle="tooltip" href="http://www.youtube.com/" target="_blank" title="Youtube"><i class="fab fa-youtube"></i></a></li>
                </ul>
            </div>
        </div>
        <div class="footer-copyright pt-3 pt-lg-2 mt-2">
            <div class="row">
                <div class="col-lg">
                    <p class="text-center text-lg-left mb-2 mb-lg-0">Copyright &copy; {{ Date('Y') }} All Rights Reserved. Powered by Tumelo Baloyi</p>
                </div>
                <div class="col-lg d-lg-flex align-items-center justify-content-lg-end">
                    <ul class="nav justify-content-center">
                        <li class="nav-item"> <a class="nav-link active" href="#">Security</a></li>
                        <li class="nav-item"> <a class="nav-link" href="#">Terms</a></li>
                        <li class="nav-item"> <a class="nav-link" href="#">Privacy</a></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</footer>
</div>
<a id="back-to-top" data-toggle="tooltip" title="Back to Top" href="javascript:void(0)"><i class="fa fa-chevron-up"></i></a>
@yield('javascript')
</body>
</html>
