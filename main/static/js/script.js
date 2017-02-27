function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/.test(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
        }
    }
});

$(document).ready(function() {
    'use strict';

    var googleMap, marker,
        seoulPos,
        mapOptions,
        $cafeDetailModal,
        $cafePhotoLabels;

    // 서울특별시 좌표
    seoulPos =  {lat:37.566535, lng:126.97796919999996};

    mapOptions = {
        center: {lat: 0.0, lng: 0.0},
        zoom: 14
    };

    function mapInitialize(position) {
        if(position !== null) {
            mapOptions.center.lat = position.lat || seoulPos.lat;
            mapOptions.center.lng = position.lng || seoulPos.lng;
            googleMap = new google.maps.Map(document.getElementById('google-map'), mapOptions);
        }
    }

    /* Cafe Detail Modal */
    $cafeDetailModal = $('#cafeDetailModal');

    $('.cafe-card').each(function() {
        $(this).click(function() {
            var cafeId = $(this).parent().attr('data-id');

            $.get('/cafe/'+cafeId, function(response) {
                $('#cafe-name').text(response.name);
                $('#cafe-intro').text(response.intro);
                $('#cafe-address').text(response.address.replace('대한민국 ', ''));

                if(parseInt($('.user_id').text()) === response.user) {
                    $('.only-owner').css('display', 'inline-block');
                    $('#edit').attr('href', '/cafe/' + response.id + '/edit/');
                    $('#delete').click(function() {
                        if(confirm("정말 삭제하시겠습니까?")) {
                            $.ajax({
                                url: '/cafe/'+response.id+'/delete/',
                                type: 'DELETE',
                                success: function(response) {
                                    console.log("Response", response);
                                    window.location.href = response.next_url;
                                },
                                error: function(error) {
                                    console.log("Error, ", error);
                                }
                            })
                        }
                    })
                }
                else {
                    $('.only-owner').css('display', 'none');
                }
                mapOptions.center.lat= Number(response.pos.split(',')[0]);
                mapOptions.center.lng = Number(response.pos.split(',')[1]);
                if (response.img_list.length !== 0) {
                    $('#cafe-img').attr('src', response.img_list[0]);
                } else {
                    $('#cafe-img').attr('src', '../static/imgs/no_img.png');
                }
                $cafeDetailModal.modal('show');
            });
        })
    });

    $cafeDetailModal.on('shown.bs.modal', function() {
        mapInitialize(mapOptions.center);
        console.log("current mapoption center", mapOptions.center);
        marker = new google.maps.Marker({
            position:mapOptions.center,
            map: googleMap
        });
        // Modal 때문에 GoogleMap이 제대로 안나옴, 한번 resizing 필요.
        google.maps.event.trigger(googleMap, 'resize');
    });

    /* Cafe Form */
    $cafePhotoLabels = $('.cafephoto-preview label');

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
        });
    });

    var geocoder = new google.maps.Geocoder(),
        $latInput, $lngInput;

    function moveMapCenter(lat, lng) {
        lat = lat || seoulPos.lat;
        lng = lng || seoulPos.lng;
        mapOptions.center.lat=lat;
        mapOptions.center.lng=lng;
        $latInput.val(lat);
        $lngInput.val(lng);
        googleMap.setCenter(mapOptions.center);
        console.log("lat: " + $latInput.val() + ", lng" + $lngInput.val());
    }

    thisClassRendered('cafe-form', function() {
        mapInitialize(mapOptions.center);

        var $curImg = $('#cur_img');

        $latInput = $('#id_latitude');
        $lngInput = $('#id_longitude');

        if($curImg.text()) {
            if(!$($cafePhotoLabels[0]).parent().hasClass('img-loaded')) {
                $($cafePhotoLabels[0]).parent().addClass('img-loaded');
            }
            $($cafePhotoLabels[0]).css('background-image', 'url("'+$curImg.text()+'")');
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

        moveMapCenter(parseFloat($latInput.val()), parseFloat($lngInput.val()));
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

    function thisClassRendered(el_cls, callBack) {
        var elements = document.getElementsByClassName(el_cls);
        if(elements.length !== 0) {
            callBack();
        }
    }
});