var location_geocode;

function show_map() {
    $("#map-canvas").show().addClass("block-shadow");
}

// Google Maps API geocoder
function find_geocode(place_name) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode( { address: place_name }, function(result, status) {
        if ( status == google.maps.GeocoderStatus.OK ) {
            location_geocode = result[0].geometry.location;
            draw_map( location_geocode );
        }
        else {
            alert("指定されたポイントの検索に失敗");
        }
    });
}

// Google Maps API
function draw_map(geocode) {
    if (!geocode) return false;

    var opts = {
        zoom: 15,
        center: geocode,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), opts);
    var marker = new google.maps.Marker( {
        position: geocode,
        map: map
    } );

    show_map();
}

// Google Maps API route-Request
function show_route(departure, destination) {
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
            show_map();
        }
        else {
            alert("ルートの探索に失敗");
        }
    });
}

$(document).ready(function() {
    $("#calc").click(function(e) {
        e.preventDefault();
        var efficiency  = $("#efficiency").val();
        var distance    = $("#distance").val();
        var oiltype     = $("#oiltype").val();
        console.log(location_geocode);

        $.ajax({
            url : "http://api.gogo.gs/v1.2/",
            crossDomain: true,
            data : {
                apid : "mileagekdjfaoirj",
                num   : 1,
                kind  : oiltype,
                lat   : location_geocode.lat(),
                lon   : location_geocode.lng()
            },
            type : "get",
            dataType: "xml",
            success : function(xml) {
                console.log( $(xml.responseText) );
            }
        });
    });

    var search_place = function(place_a, place_b) {
        // 2文字以上なら
        if ( place_a.length > 1 ) {
            if ( place_b ) {
                show_route( place_a, place_b );
            }
            else {
                find_geocode( place_a );
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
