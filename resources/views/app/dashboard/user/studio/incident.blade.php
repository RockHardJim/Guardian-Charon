@extends('partials.app')
@section('content')
@include('partials.navbar')
<?php
    $completeness = 100;

    if(!$profile){
        $completeness = $completeness - 50;
    }
    if(!$media){
        $completeness = $completeness - 50;
    }

    session(['incident' => $incident->identifier]);
?>
<div id="content" class="py-4">
    <div class="container">
        <div class="row">
            <aside class="col-lg-3">
                <div class="bg-light shadow-sm rounded text-center p-3 mb-4">
                    <p class="text-3 font-weight-500 mb-2">{{ $incident->site }}</p>
                </div>
            </aside>

            <div class="col-lg-9">

                <!-- Profile Completeness
                =============================== -->
                <div class="bg-light shadow-sm rounded p-4 mb-4">
                    <h3 class="text-5 font-weight-400 d-flex align-items-center mb-3">Incident Profile Completeness <span class="bg-light-4 text-success rounded px-2 py-1 font-weight-400 text-2 ml-2">{{ $completeness }}%</span></h3>
                    <div class="row profile-completeness">

                        <?php if(!$profile){ ?>
                            <div class="col-sm-6 col-md-3 mb-4 mb-sm-0">
                                <div class="border rounded p-3 text-center"> <span class="d-block text-10 text-light mt-2 mb-3"><i class="fas fa-edit"></i></span> <span class="text-5 d-block text-light mt-4 mb-3"><i class="far fa-circle "></i></span>
                                    <p class="mb-0"><a href="#profile" data-toggle="modal">Create Incident Profile</a></p>
                                </div>
                            </div>
                        <?php }else{
                            ?>
                            <div class="col-sm-6 col-md-3 mb-4 mb-md-0">
                                <div class="border rounded p-3 text-center"> <span class="d-block text-10 text-light mt-2 mb-3"><i class="fas fa-edit"></i></span> <span class="text-5 d-block text-success mt-4 mb-3"><i class="fas fa-check-circle"></i></span>
                                    <p class="mb-0">Incident Profile Created</p>
                                </div>
                            </div>
                            <?php
                            } ?>

                            <?php if(!$media){ ?>
                            <div class="col-sm-6 col-md-3 mb-4 mb-sm-0">
                                <div class="border rounded p-3 text-center"> <span class="d-block text-10 text-light mt-2 mb-3"><i class="fas fa-upload"></i></span> <span class="text-5 d-block text-light mt-4 mb-3"><i class="far fa-circle "></i></span>
                                    <p class="mb-0"><a href="#media-upload" data-toggle="modal">Upload Incident Footage</a></p>
                                </div>
                            </div>
                            <?php }else{
                                ?>
                            <div class="col-sm-6 col-md-3 mb-4 mb-sm-0">
                                <div class="border rounded p-3 text-center"> <span class="d-block text-10 text-light mt-2 mb-3"><i class="fas fa-upload"></i></span> <span class="text-5 d-block text-light mt-4 mb-3"><i class="far fa-circle "></i></span>
                                    <p class="mb-0"><a href="#media-upload" data-toggle="modal">Upload More Footage</a></p>
                                </div>
                            </div>
                            <?php
                            } ?>

                        <div class="col-sm-6 col-md-3">
                            <div class="border rounded p-3 text-center"> <span class="d-block text-10 text-light mt-2 mb-3"><i class="fas fa-edit"></i></span> <span class="text-5 d-block text-light mt-4 mb-3"></span>
                                <p class="mb-0"><a class="btn-link stretched-link" href="#">Edit Incident Report</a></p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Profile Completeness End -->
        </div>
    </div>


        <div id="profile" class="modal fade " role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title font-weight-400">Enrol incident profile details</h5>
                        <button type="button" class="close font-weight-400" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>
                    </div>
                    <div class="modal-body p-4">
                        <form id="incident_profile" action="{{ route('incident.profile') }}" method="post">
                            @csrf
                            <input type="hidden" value="{{ $incident->identifier }}" class="form-control" id="incident" name="incident" required>
                            <div class="row">
                                <div class="col-12">
                                <div class="form-group">
                                    <label for="description">Incident Description</label>
                                    <textarea class="form-control" rows="4" id="description" required name="description" placeholder="Describe the incident as clearly as possible"></textarea>
                                </div>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="date">Date Incident Occurred</label>
                                        <div class="position-relative">
                                            <input id="date" name="date" type="text" class="form-control" required placeholder="Date of Incident">
                                            <span class="icon-inside"><i class="fas fa-calendar-alt"></i></span> </div>
                                    </div>
                                </div>

                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="time">Time Incident Occurred</label>
                                        <div class="position-relative">
                                            <input id="time" timepicker name="time" type="text" class="form-control " required placeholder="Time of Incident">
                                            <span class="icon-inside"><i class="fas fa-clock-o"></i></span> </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <h3 class="text-5 font-weight-400 mt-3">Rewards Option</h3>
                                    <hr>
                                </div>
                                <div class="col-12">
                                    <div class="form-group">
                                        <label for="input-zone">Reward Points</label>
                                        <select class="custom-select" id="reward" name="reward">
                                            <option value=""> Please select reward points </option>
                                            <?php
                                            if($incident->type == 'theft'){
                                            ?>
                                            <option value="1500">1500</option>
                                            <option value="2500">2500</option>
                                            <option value="3000">3000</option>
                                            <option value="3500">3500</option>
                                            <option value="4000">4000</option>
                                            <option value="4500">4500</option>
                                            <?php
                                            }
                                            ?>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <button id="submit" class="btn btn-primary btn-block mt-2" type="submit">Save Changes</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>


        <div id="media-upload" class="modal fade " role="dialog" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title font-weight-400">Upload incident media</h5>
                        <button type="button" class="close font-weight-400" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>
                    </div>
                    <div class="modal-body p-4">
                        <form id="upload" action="{{ route('incident.media') }}" method="post" enctype="multipart/form-data">
                            <div class="row">
                                <div class="col-12">
                                    <div class="form-group btn btn-danger btn-block mt-2">
                                        <label for="description">Select Your Files</label>
                                        @csrf
                                        <input type="hidden" value="{{ $incident->identifier }}" class="form-control" id="incident" name="incident" required>
                                        <input type="file" name="file" required/>
                                    </div>
                                </div>
                            </div>
                            <button id="submit" class="btn btn-primary btn-block mt-2" type="submit">Upload</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
@endsection
@section('javascript')
            <script>
                $(function() {
                    'use strict';

                    $("#upload").on('submit',(function(e) {
                        e.preventDefault();
                        $.ajax({
                            url: "{{ route('incident.media') }}",
                            type: "POST",
                            data:  new FormData(this),
                            contentType: false,
                            cache: false,
                            processData:false,
                            beforeSend : function()
                            {
                                $.LoadingOverlay("show");
                                $('#submit').attr("disabled", true);
                            },
                            success: function(response)
                            {
                                if(response.status == 'failed')
                                {
                                    $.LoadingOverlay("hide");
                                    $('#submit').attr("disabled", false);
                                    $("#err").html("Invalid File !").fadeIn();
                                    iziToast.error({
                                        title: 'Error',
                                        message: response.message
                                    });
                                }
                                else
                                {
                                    $.LoadingOverlay("hide");
                                    $('#submit').attr("disabled", false);
                                    iziToast.show({
                                        id: 'haduken',
                                        theme: 'dark',
                                        title: 'Hey',
                                        displayMode: 2,
                                        message: response.message,
                                        position: 'center',
                                        transitionIn: 'flipInX',
                                        transitionOut: 'flipOutX',
                                        progressBarColor: 'rgb(0, 255, 184)',
                                        imageWidth: 70,
                                        layout: 2,
                                        iconColor: 'rgb(0, 255, 184)'
                                    });
                                }
                            },
                            error: function(e)
                            {
                                $.LoadingOverlay("hide");
                                $('#submit').attr("disabled", false);
                                $("#err").html(e).fadeIn();
                                iziToast.error({
                                    transitionIn: 'flipInX',
                                    transitionOut: 'flipOutX',
                                    progressBarColor: 'rgb(0, 255, 184)',
                                    title: 'Error',
                                    message: e
                                });
                            }
                        });
                    }));
                    // Payment due by
                    $('#date').daterangepicker({
                        singleDatePicker: true,
                        minDate: moment(),
                        autoUpdateInput: false,
                    }, function (chosen_date) {
                        $('#date').val(chosen_date.format('MM-DD-YYYY'));
                    });
                    $('input.timepicker').timepicker({});


                    $('#incident_profile').submit(function(event) {
                        event.preventDefault();
                        var data = $('#incident_profile').serialize();

                        $.ajax({
                            method:'POST',
                            url: $('#incident_profile').attr('action'),
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
                });
            </script>

@endsection
