
$(document).ready(function() {
    var cafe_pos = {};

    function mapInitialize() {
        var mapOptions = {
            center: {lat: cafe_pos['lat'], lng: cafe_pos['lng']},
            zoom: 15
        };

        var map = new google.maps.Map(document.getElementById('map'), mapOptions);

        //var marker = new google.maps.Marker({
        //    position: cafe_pos,
        //    map: map
        //});
    }

    $('.hidden-data').each(function(){
        if ($(this).attr('id') == 'cafe-latitude') {
            cafe_pos['lat'] = parseFloat($(this).text());
            console.log("cafe_pos['lat']", cafe_pos['lat'])
        }
        else if ($(this).attr('id') == 'cafe-longitude') {
            cafe_pos['lng'] = parseFloat($(this).text());
            console.log("cafe_pos['lng']", cafe_pos['lng'])
        }
    });

    var cur_img = $('.cur_img')[0];

    function fade_in(){
        cur_img.style.opacity = parseFloat(cur_img.style.opacity) + 0.05;
        if (cur_img.style.opacity < 1) {
            setTimeout(fade_in, 50);
        }
    }

    function fade_out() {
        cur_img.style.opacity = parseFloat(cur_img.style.opacity) - 0.05;
        if (cur_img.style.opacity > 0) {
            setTimeout(fade_out, 50);
        }
    }

    $('.other-imgs-wrapper .img').each(function() {
        $(this).click(function() {
            cur_img.src = $(this).attr('src');
            cur_img.addEventListener("load", function() {
                cur_img.style.opacity = 0;
                fade_in();
            });
        });
    });

    // materialize select 박스 활성화
    $('select').material_select();

    google.maps.event.addDomListener(window, "load", mapInitialize);


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
        if(bottom_down_icon == undefined) {
            bottom_down_icon = $(this).find('i');
        }
        if($(this).hasClass('.clicked')) {
            cur_angle = 180;
            rotateRight();
            hideSection();
            $(this).removeClass('.clicked');
        }else{
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
        if(!$(cafephoto_labels[input_idx]).hasClass('img-loaded'))
            $(cafephoto_labels[input_idx]).addClass('img-loaded');

        $(cafephoto_labels[input_idx]).find('label').css('background-image', 'url("'+src+'")');
    }

});