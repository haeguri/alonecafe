(function() {
    var cafe_pos = {};

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

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: cafe_pos['lat'], lng: cafe_pos['lng']},
        zoom: 15
    });

    var marker = new google.maps.Marker({
        position: cafe_pos,
        map: map
    });
})();