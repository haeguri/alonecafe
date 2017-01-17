$(document).ready(function() {
    'use strict';

    var googleMap = null;
    var marker = null;

    // 임시 초기값.
    // NEW Page일 때 디폴트로 서울특별시 좌표값이 설정
    var cafe_pos = {lat:37.566535, lng:126.97796919999996};

    var mapOptions = {
        center: {lat: cafe_pos.lat, lng: cafe_pos.lng},
        zoom: 14
    };

    function mapInitialize(position) {
        if(position !== null) {
            mapOptions.center.lat = position.lat;
            mapOptions.center.lng = position.lng;
            googleMap = new google.maps.Map(document.getElementById('google-map'), mapOptions);
        }
    }

    /* Cafe Detail Modal */
    var $cafeDetailModals = $('#cafeDetailModal');

    $('.cafe-thumbnail').each(function() {
        $(this).click(function() {
            var cafe_id = $(this).attr('data-id');
            $.get('/cafe/'+cafe_id, function(response) {
                console.log("/cafe/[cafe_id] get success.. ", response);
                $('#cafe-name').text(response.name);
                $('#cafe-intro').text(response.intro);
                var s_address = response.address.replace('대한민국 ', '');
                $('#cafe-address').text(s_address);
                if($('.user_id').text() == response.user) {
                    $('.only-owner').css('display', 'inline-block');
                    $('#edit').attr('href', '/cafe/' + response.id + '/edit/');
                    $('#delete').attr('href', '/cafe/' + response.id + '/delete/');
                }
                else {
                    $('.only-owner').css('display', 'none');
                }
                cafe_pos.lat = Number(response.pos.split(',')[0]);
                cafe_pos.lng = Number(response.pos.split(',')[1]);
                if (response.img_list.length !== 0) {
                    $('#cafe-img').attr('src', response.img_list[0]);
                } else {
                    $('#cafe-img').attr('src', '../static/imgs/no_img.png');
                }
                $cafeDetailModals.modal('show');
            }).fail(function(error) {
                console.log('/cafe/[cafe_id] get failed !!', error);
            });
        })
    });

    $cafeDetailModals.on('shown.bs.modal', function() {
        mapInitialize(cafe_pos);
        marker = new google.maps.Marker({
            position:cafe_pos,
            map: googleMap
        });
        // Modal 때문에 지도가 완벽하게 안나와서 한번 resizing 필요.
        google.maps.event.trigger(googleMap, 'resize');
    });

    /* Cafe Form */
    var $cafePhotoLabels = $('.cafephoto-preview label');

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
            // console.log("IMAGE UPLOADED ! ARG is" , $(this));
            if(window.FileReader) {
                if (!$(this)[0].files[0].type.match(/image\//)) {
                    return;
                }
                var reader = new FileReader();
                reader.onload = function(e) {
                    var src = e.target.result;
                    if(!$($cafePhotoLabels[input_idx]).parent().hasClass('img-loaded')) {
                        $($cafePhotoLabels[input_idx]).parent().addClass('img-loaded');
                    }
                    $($cafePhotoLabels[input_idx]).css('background-image', 'url("'+src+'")');
                    if(window.location.pathname.includes('edit')) {
                        var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?img=new';
                        window.history.pushState({state:newUrl},'', newUrl);
                    }
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

    var geocoder = null;
    var lat_input = null;
    var lng_input = null;

    geocoder = new google.maps.Geocoder();

    function moveMapCenter(lat, lng) {
        mapOptions.center.lat= lat;
        mapOptions.center.lng = lng;
        lat_input.val(lat);
        lng_input.val(lng);
        googleMap.setCenter(mapOptions.center);
        console.log("lat and lng :: " + lat_input.val() + ", " + lng_input.val());
    }

    thisClassRendered('cafe-form', function() {
        mapInitialize(cafe_pos);

        lat_input = $('#id_latitude');
        lng_input = $('#id_longitude');

        if($('#cur_img').text()) {
            if(!$($cafePhotoLabels[0]).parent().hasClass('img-loaded')) {
                $($cafePhotoLabels[0]).parent().addClass('img-loaded');
            }
            $($cafePhotoLabels[0]).css('background-image', 'url("'+$('#cur_img').text()+'")');
        }

        marker = new google.maps.Marker({
            position:mapOptions['center'],
            map: googleMap,
            draggable: true
        });

        marker.addListener('dragend', function(event) {
            moveMapCenter(event.latLng.lat(), event.latLng.lng());
            geocoder.geocode({
                'location':mapOptions.center
            }, function(result) {
                if(result.length !== 0) {
                    console.log(result);
                    $('.map-add-input').val(result[0].formatted_address);
                } else {
                    $('.map-add-input').val("검색된 주소가 없음.");
                }
            });
        });

        googleMap.addListener('click', function(event) {
            moveMapCenter(event.latLng.lat(), event.latLng.lng());
            marker.setPosition(mapOptions.center);
            geocoder.geocode({
                'location':mapOptions.center
            }, function(result) {
                if(result.length !== 0) {
                    console.log(result);
                    $('.map-add-input').val(result[0].formatted_address);
                } else {
                    $('.map-add-input').val("검색된 주소가 없음.");
                }
            });
        });

        moveMapCenter(mapOptions.center.lat, mapOptions.center.lng);
        marker.setPosition(mapOptions.center);

        $('#map-search-btn').on('click', function() {
            geocoder.geocode({
                'address':$(this).siblings("input").val()
            }, function(result) {
                if(result.length !== 0) {
                    moveMapCenter(result[0].geometry.location.lat(), result[0].geometry.location.lng());
                    marker.setPosition(mapOptions.center);
                } else {
                    console.log('검색된 좌표값이 없음.');
                }
            })
        });
    });

    //isElementLoaded($('.user-profile'), function() {
    //    $('.private-cafes').show();
    //    $('.private-infos').hide();
    //    $('.profile-tab li').each(function() {
    //        $(this).on('click', function() {
    //            if( !$(this).hasClass('active') ) {
    //                $(this).siblings().removeClass('active');
    //                $(this).addClass('active');
    //                var changed_tab = $(this).attr('data-tab');
    //                var hide_tab = $(this).siblings().attr('data-tab');
    //                console.log("Changed, HIde", changed_tab, hide_tab);
    //                $('.'+hide_tab).hide();
    //                $('.'+changed_tab).show();
    //            }
    //        });
    //    })
    //});

    function thisClassRendered(el_cls, callBack) {
        var elements = document.getElementsByClassName(el_cls);
        if(elements.length !== 0) {
            callBack();
        } else {
            return;
        }
    }
});