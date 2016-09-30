$(document).ready(function() {
    'use strict';

    var cafe_pos = {'lat':37.541, 'lng':126.986};
    var mapOptions = {
        center: {lat: cafe_pos['lat'], lng: cafe_pos['lng']},
        zoom: 14
    };
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);

    function mapInitialize() {
        mapOptions['center']['lat'] = cafe_pos['lat'];
        mapOptions['center']['lng'] = cafe_pos['lng'];

        map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }

    google.maps.event.addDomListener(window, "load", mapInitialize);

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

                $('#cafeDetailModal').modal('show');

                $('#cafe-name').text(response.name);
                $('#cafe-intro').text(response.intro);
                $('#cafe-mood').text(response.mood);
                $('#cafe-address').text(response.address);

                if (response.img_list.length !== 0) {
                    $('#cafe-img').attr('src', response.img_list[0]);

                    $('.detail-other-imgarea').empty();

                    console.log("response.img_list.length is", response.img_list.length);
                    for(var i = 0; i < response.img_list.length; i ++) {
                        console.log(response.img_list[i]);
                        $('.detail-other-imgarea').append('<img src="'+response.img_list[i]+'" alt="" />');
                    }

                    addListenerToImg();
                }
                else {
                    $('#cafe-img').attr('src', '../static/imgs/no_img.png');
                }

                if(response.has_solo_table === 'true') {
                    $('#myModal').find('.cafe-tag').css('display', 'inline-block');
                }
                else {
                    $('#myModal').find('cafe-tag').css('display', 'none');
                }

                var op_times = ['week_hours', 'satur_hours', 'sun_hours'];

                for(var i = 0; i < op_times.length; i++) {
                    if (response[op_times[i]].length !== 0) {
                        $('#cafe-'+op_times[i]).text(response[op_times[i]]);
                    }
                    else {
                        $('#cafe-'+op_times[i]).text('모름');
                    }
                }

                //cafe_pos['lat'] = parseFloat(response.pos.split(",")[0]);
                //cafe_pos['lng'] = parseFloat(response.pos.split(",")[1]);

            }).fail(function(error) {
                console.log("/cafe/[cafe_id] get faield !!", error);
            });
        })
    });

    $('#cafeDetailModal').on('shown.bs.modal', function() {
        // Modal뜨면 지도가 완벽하게 안나와서 한번 resizing 필요.
        google.maps.event.trigger(map, "resize");
    });

    var bottom_down_icon;
    var cur_angle;

    function rotateLeft() {
        cur_angle -= 5;
        bottom_down_icon.css('transform', 'rotate(' + (cur_angle) + 'deg)');
        if(cur_angle > -180) {
            setTimeout(rotateLeft, 2);
        }
    }

    function rotateRight() {
        cur_angle -= 5;
        bottom_down_icon.css('transform', 'rotate(' + (cur_angle) + 'deg)');
        if(cur_angle > 0) {
            setTimeout(rotateRight, 2);
        }
    }

    function showSection() {
        var height = hidden_section.height();
        hidden_section.css('height', (height+inc_height)+'px');
        if(height < origin_height ) {
            setTimeout(showSection, 2);
        }
    }

    function hideSection() {
        var height = hidden_section.height();
        hidden_section.css('height', (height-inc_height)+'px');
        if(height > 0 ) {
            setTimeout(hideSection, 2);
        }
    }

    var hidden_section = $('.detail-more .hidden-section');
    var origin_height = hidden_section.height();
    var inc_height = origin_height/10;
    hidden_section.css('height', '0px');

    $('button.detail-more-btn').click(function() {
        if(bottom_down_icon === undefined) {
            bottom_down_icon = $(this).find('i');
        }
        if($(this).hasClass('.clicked')) {
            cur_angle = 180;
            rotateRight();
            hideSection();
            $(this).removeClass('.clicked');
        } else {
            cur_angle = 0;
            rotateLeft();
            showSection();
            $("html, body").animate({ scrollTop: $(document).height() }, 500);
            $(this).addClass('.clicked');
        }
    });

    var cafephoto_labels = $('.cafephoto-preview .cafephoto-label');

    $('.cafephoto-input.hidden input').each(function(input_idx) {
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
        if(!$(cafephoto_labels[input_idx]).hasClass('img-loaded')) {
            $(cafephoto_labels[input_idx]).addClass('img-loaded');
        }

        $(cafephoto_labels[input_idx]).find('label').css('background-image', 'url("'+src+'")');
    }

});