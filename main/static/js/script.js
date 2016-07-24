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

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: cafe_pos['lat'], lng: cafe_pos['lng']},
        zoom: 15
    });

    var marker = new google.maps.Marker({
        position: cafe_pos,
        map: map
    });
})();