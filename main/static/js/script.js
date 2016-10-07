$(document).ready(function() {
    'use strict';

    var map = null;
    var marker = null;

    var cafe_pos = {'lat':37.541, 'lng':126.986};
    var mapOptions = {
        center: {lat: cafe_pos['lat'], lng: cafe_pos['lng']},
        zoom: 14
    };

    function mapInitialize(lat, lng) {
        mapOptions['center']['lat'] = lat;
        mapOptions['center']['lng'] = lng;

        map = new google.maps.Map(document.getElementById('google-map'), mapOptions);
    }

    //google.maps.event.addDomListener(window, "load", mapInitialize);

    $('.hidden-data').each(function(){
        if ($(this).attr('id') === 'cafe-latitude') {
            cafe_pos['lat'] = parseFloat($(this).text());
            console.log("cafe_pos['lat']", cafe_pos['lat'])
        }
        else if ($(this).attr('id') === 'cafe-longitude') {
            cafe_pos['lng'] = parseFloat($(this).text());
            console.log("cafe_pos['lng']", cafe_pos['lng'])
        }
    });

    var cur_img = $('#cafe-img');

    function fade_in(){
        cur_img.css('opacity', parseFloat(cur_img.css('opacity'))+0.05);
        if (cur_img.css('opacity') < 1) {
            setTimeout(fade_in, 50);
        }
    }

    function addListenerToImg () {
        $('.detail-other-imgarea img').each(function() {
            $(this).click(function() {
                cur_img.css('opacity', 0);
                cur_img.attr('src', $(this).attr('src'));
                cur_img.on('load', function() {
                    fade_in();
                });
            });
        });
    }

    $('.cafe-thumbnail').each(function() {
        $(this).click(function() {
            var cafe_id = $(this).attr('data-id');
            $.get( "/cafe/"+cafe_id, function( response ) {
                console.log("/cafe/[cafe_id] get success.. ", response);

                $('#cafe-name').text(response.name);
                $('#cafe-intro').text(response.intro);
                $('#cafe-mood').text(response.mood);
                $('#cafe-address').text(response.address);

                if (response.img_list.length !== 0) {
                    $('#cafe-img').attr('src', response.img_list[0]);

                    $('.detail-other-imgarea').empty();

                    for(var i = 0; i < response.img_list.length; i ++) {
                        $('.detail-other-imgarea').append('<img src="'+response.img_list[i]+'" alt="" />');
                    }

                    addListenerToImg();
                }
                else {
                    $('#cafe-img').attr('src', '../static/imgs/no_img.png');
                }

                if(response.has_solo_table) {
                    $('#myModal').find('.cafe-tag').css('display', 'inline-block');
                }
                else {
                    $('#myModal').find('cafe-tag').css('display', 'none');
                }

                cafe_pos['lat'] = parseFloat(response.pos.split(",")[0]);
                cafe_pos['lng'] = parseFloat(response.pos.split(",")[1]);

                $('#cafeDetailModal').modal('show');

            }).fail(function(error) {
                console.log("/cafe/[cafe_id] get faield !!", error);
            });
        })
    });

    $('#cafeDetailModal').on('shown.bs.modal', function() {
        mapInitialize(cafe_pos['lat'], cafe_pos['lng']);
        // Modal뜨면 지도가 완벽하게 안나와서 한번 resizing 필요.
        google.maps.event.trigger(map, "resize");
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
            $(this).parent().removeClass('img-loaded');
            $(this).css('display', 'none');
            $(this).parent().find('.gray-box').css('display', 'none');
        });
    });

    $('.cafephoto-preview input').each(function(input_idx) {
        $(this).on('change', function(arg){
            console.log("IMAGE UPLOADED ! ARG is" , arg);
            if(window.FileReader) {
                if (!$(this)[0].files[0].type.match(/image\//)) return;

                var reader = new FileReader();

                reader.onload = function(e) {
                    var src = e.target.result;

                    changePreviewImg(input_idx, src);
                };

                reader.readAsDataURL($(this)[0].files[0]);
            }
        });
    });

    function changePreviewImg(input_idx, src){
        console.log("label list is", cafephoto_labels);
        console.log("input_idx is", input_idx);
        if(!$(cafephoto_labels[input_idx]).parent().hasClass('img-loaded')) {
            $(cafephoto_labels[input_idx]).parent().addClass('img-loaded');
        }

        $(cafephoto_labels[input_idx]).css('background-image', 'url("'+src+'")');
    }

    mapInitialize(cafe_pos['lat'], cafe_pos['lng']);
    var geocoder = new google.maps.Geocoder();

    $('.cafe-form').ready(function() {
        var lat_input = $('#id_position-0-latitude');
        var lng_input = $('#id_position-0-longitude');

        console.log(lat_input);

        marker = new google.maps.Marker({
            position:mapOptions.center,
            map: map,
            draggable: true
        });

        marker.addListener('dragend', function(event) {
            mapOptions['center']['lat'] = event.latLng.lat();
            mapOptions['center']['lng'] = event.latLng.lng();
            console.log(lat_input.val());
            lat_input.val(mapOptions['center']['lat']);
            lng_input.val(mapOptions['center']['lng']);
            console.log(lat_input.val());

            map.setCenter(mapOptions['center']);

            geocoder.geocode({
                'location':mapOptions['center']
            }, function(result) {
                console.log(result);

                //result.geometry.location.lat()
                $('#map-cur-address').text(result[0].formatted_address);
            });
        });

        map.addListener('click', function(event) {
            mapOptions['center']['lat']=event.latLng.lat();
            mapOptions['center']['lng']=event.latLng.lng();
            lat_input.val(mapOptions['center']['lat']);
            lng_input.val(mapOptions['center']['lng']);

            marker.setPosition(mapOptions['center']);
            map.setCenter(mapOptions['center']);

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
                mapOptions['center']['lat']=result[0].geometry.location.lat();
                mapOptions['center']['lng']=result[0].geometry.location.lng();
                lat_input.val(mapOptions['center']['lat']);
                lng_input.val(mapOptions['center']['lng']);

                map.setCenter(mapOptions['center']);
                marker.setPosition(mapOptions['center']);
            } else {
                console.log("검색된 좌표값이 없음.");
            }
        });


        $('#map-search-btn').on('click', function() {
            //console.log("$(this).siblings.val()", $(this).siblings().val());
            //$(this).siblings().val()

            geocoder.geocode({
                'address':$(this).siblings().val()
            }, function(result) {
                if(result.length !== 0) {
                    mapOptions['center']['lat']=result[0].geometry.location.lat();
                    mapOptions['center']['lng']=result[0].geometry.location.lng();
                    lat_input.val(""+mapOptions['center']['lat']);
                    lng_input.val(""+mapOptions['center']['lng']);

                    map.setCenter(mapOptions['center']);
                    marker.setPosition(mapOptions['center']);
                } else {
                    console.log("검색된 좌표값이 없음.");
                }
            })
        });
    });


});