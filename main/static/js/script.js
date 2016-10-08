$(document).ready(function() {
    'use strict';

    var googleMap = null;
    var marker = null;

    // 임시 초기값.
    var cafe_pos = {'lat':37.541, 'lng':126.986};

    var mapOptions = {
        center: {lat: cafe_pos['lat'], lng: cafe_pos['lng']},
        zoom: 14
    };

    function mapInitialize(position) {
        if(position !== null) {
            mapOptions['center']['lat'] = position.lat;
            mapOptions['center']['lng'] = position.lng;

            googleMap = new google.maps.Map(document.getElementById('google-map'), mapOptions);
        }
    }

    /* Cafe Detail Modal */
    var cur_img = $('#cafe-img');

    function fadeInImg(){
        cur_img.css('opacity', Number(cur_img.css('opacity'))+0.05);
        if (cur_img.css('opacity') < 1) {
            setTimeout(fadeInImg, 50);
        }
    }

    function addListenerImg () {
        $('.detail-other-imgarea img').each(function() {
            $(this).click(function() {
                cur_img.css('opacity', 0);
                cur_img.attr('src', $(this).attr('src'));
                cur_img.on('load', function() {
                    fadeInImg();
                });
            });
        });
    }

    $('.cafe-thumbnail').each(function() {
        $(this).click(function() {
            var cafe_id = $(this).attr('data-id');
            $.get( "/cafe/"+cafe_id, function( response ) {
                //console.log("/cafe/[cafe_id] get success.. ", response);

                $('#cafe-name').text(response.name);
                $('#cafe-intro').text(response.intro);
                $('#cafe-mood').text(response.mood);
                $('#cafe-address').text(response.address);

                cafe_pos['lat'] = Number(response.pos.split(",")[0]);
                cafe_pos['lng'] = Number(response.pos.split(",")[1]);

                if (response.img_list.length !== 0) {
                    $('#cafe-img').attr('src', response.img_list[0]);
                    $('.detail-other-imgarea').empty();

                    for(var i = 0; i < response.img_list.length; i ++) {
                        $('.detail-other-imgarea').append('<img src="'+response.img_list[i]+'" alt="" />');
                    }

                    addListenerImg();
                } else {
                    $('#cafe-img').attr('src', '../static/imgs/no_img.png');
                }

                if(response.has_solo_table) {
                    $('#myModal').find('.cafe-tag').css('display', 'inline-block');
                } else {
                    $('#myModal').find('.cafe-tag').css('display', 'none');
                }

                $('#cafeDetailModal').modal('show');

            }).fail(function(error) {
                console.log("/cafe/[cafe_id] get faield !!", error);
            });
        })
    });

    $('#cafeDetailModal').on('shown.bs.modal', function() {
        mapInitialize(cafe_pos);
        // Modal뜨면 지도가 완벽하게 안나와서 한번 resizing 필요.
        google.maps.event.trigger(googleMap, "resize");
    });

    var cafephoto_labels = $('.cafephoto-preview label');

    $('.label-wrapper').each(function() {
        $(this).mouseenter(function(){
            if ($(this).hasClass('img-loaded')) {
                $(this).find('i').css('display','block');
                $(this).find('.gray-box').css('display','block');
            }
        }).mouseleave(function() {
            if ($(this).hasClass('img-loaded')) {
                $(this).find('i').css('display','none');
                $(this).find('.gray-box').css('display','none');
            }
        });

        $(this).find('i').on('click', function() {
            $(this).parent().find('input').val('');
            $(this).parent().find('label').css('background-image', '');
            $(this).parent().find('.gray-box').css('display', 'none');
            $(this).parent().removeClass('img-loaded');
            $(this).css('display', 'none');
        });
    });

    $('.cafephoto-preview input').each(function(input_idx) {
        $(this).on('change', function(arg){
            //console.log("IMAGE UPLOADED ! ARG is" , arg);
            if(window.FileReader) {
                if (!$(this)[0].files[0].type.match(/image\//)) return;

                var reader = new FileReader();

                reader.onload = function(e) {
                    var src = e.target.result;
                    previewUploadImg(input_idx, src);
                };

                reader.readAsDataURL($(this)[0].files[0]);
            }

            /*
            *
            * IE???
            *
            * */
        });
    });

    function previewUploadImg(input_idx, src){
        if(!$(cafephoto_labels[input_idx]).parent().hasClass('img-loaded')) {
            $(cafephoto_labels[input_idx]).parent().addClass('img-loaded');
        }

        $(cafephoto_labels[input_idx]).css('background-image', 'url("'+src+'")');
    }

    /* Cafe Form */
    mapInitialize(cafe_pos);
    var geocoder = new google.maps.Geocoder();

    var lat_input = null;
    var lng_input = null;

    function moveMapCenter(lat, lng) {
        mapOptions['center']['lat'] = lat;
        mapOptions['center']['lng'] = lng;

        lat_input.val(lat);
        lng_input.val(lng);

        googleMap.setCenter(mapOptions['center']);
    }

    $('.cafe-form').ready(function() {
        lat_input = $('#id_position-0-latitude');
        lng_input = $('#id_position-0-longitude');

        marker = new google.maps.Marker({
            position:mapOptions.center,
            map: googleMap,
            draggable: true
        });

        marker.addListener('dragend', function(event) {
            moveMapCenter(event.latLng.lat(), event.latLng.lng());

            geocoder.geocode({
                'location':mapOptions['center']
            }, function(result) {
                if(result.length !== 0) {
                    console.log(result);
                    $('#map-cur-address').text(result[0].formatted_address);
                } else {
                    $('#map-cur-address').text("검색된 주소가 없음.");
                }
            });
        });

        googleMap.addListener('click', function(event) {
            moveMapCenter(event.latLng.lat(), event.latLng.lng());

            marker.setPosition(mapOptions['center']);

            geocoder.geocode({
                'location':mapOptions['center']
            }, function(result) {
                if(result.length !== 0) {
                    console.log(result);
                    $('#map-cur-address').text(result[0].formatted_address);
                } else {
                    $('#map-cur-address').text("검색된 주소가 없음.");
                }
            });
        });

        geocoder.geocode({
           'address':'서울특별시'
        }, function(result) {
            if(result.length !== 0) {
                moveMapCenter(result[0].geometry.location.lat(), result[0].geometry.location.lng());
                marker.setPosition(mapOptions['center']);
            } else {
                console.log("검색된 좌표값이 없음.");
            }
        });


        $('#map-search-btn').on('click', function() {
            geocoder.geocode({
                'address':$(this).siblings().val()
            }, function(result) {
                if(result.length !== 0) {
                    moveMapCenter(result[0].geometry.location.lat(), result[0].geometry.location.lng());
                    marker.setPosition(mapOptions['center']);
                } else {
                    console.log("검색된 좌표값이 없음.");
                }
            })
        });
    });
});