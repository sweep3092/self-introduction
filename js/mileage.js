function showMap() {
    $("#map-canvas").show().addClass("block-shadow");
}

// Google Maps API マップ作成
function initMaps(latlng) {
    var opts = {
        zoom: 15,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), opts);
    var marker = new google.maps.Marker( { position: latlng, map: map} );

    showMap();
}

// Google Maps API geocoder & initMaps
function geoCoding(place_name) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address:place_name}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            initMaps(results[0].geometry.location);
        }
        else {
            alert("指定されたポイントの検索に失敗");
        }
    });
}

// Google Maps API route-Request
function showRoute(departure, destination) {
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();

    var opts   = {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"),　opts);
    directionsDisplay.setMap(map);

    var request = {
        origin: departure,
        destination: destination,
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
        optimizeWaypoints: true,
        avoidHighways: false,
        avoidTolls: false
    };
    directionsService.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            $("#distance").val(response.routes[0].legs[0].distance.value);
        }
        else {
            alert("ルートの探索に失敗");
        }
    });
    showMap();
}

$(document).ready(function() {
    $("#calc").click(function(e) {
        e.preventDefault();
        var efficiency  = $("#efficiency").val();
        var distance    = $("#distance").val();
    });

    var search_place = function(place_a, place_b) {
        // 2文字以上なら
        if (place_a.length > 1) {
            if (place_b) {
                showRoute(place_a, place_b);
            }
            else {
                geoCoding(place_a);
            }
        }
    }
    // テキストボックス更新で地図を更新（geocoder）
    // 出発地、目的地の両方が入力されている場合は経路を表示
    $("#departure").change(function() {
        search_place( $("#departure").val(), $("#destination").val() );
    });

    $("#destination").change(function() {
        search_place( $("#destination").val(), $("#departure").val() );
    });


});
