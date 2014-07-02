// TODO: グローバルスコープはなるべく使いたくない
var distance;

$(document).ready(function() {
    var show_map = function() {
        $("#map-canvas").show().addClass("block-shadow");
    }

    // Google Maps API geocoder
    var find_geocode = function(place_name) {
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { address: place_name }, function(result, status) {
            if ( status == google.maps.GeocoderStatus.OK ) {
                draw_map(result[0].geometry.location);
            }
            else {
                alert("指定されたポイントの検索に失敗");
            }
        });
    }

    // Google Maps API
    var draw_map = function(geocode) {
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
    var show_route = function(departure, destination) {
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
                distance = response.routes[0].legs[0].distance.value;
                show_map();
            }
            else {
                alert("ルートの探索に失敗");
            }
        });
    }

    var draw_result = function(response) {
        $("#panel-result").parent().remove();
        var result_section = $("<section>");
        var result_panel = $("<div>");
        result_panel.addClass("panel block-shadow").attr("id", "panel-result");
        $("<p>").text( "走行距離: " + distance * 0.001 + "Km" ).appendTo( result_panel );
        $("<p>").text( "燃料単価: ¥" + response.price[0] ).appendTo( result_panel );
        $("<p>").text( "ガソリン代: ¥" + response.cost ).appendTo( result_panel );

        result_section.append(result_panel);

        $("#help").parent().after(result_section);
    }

    $("#calc").click(function(e) {
        e.preventDefault();
        var efficiency = $("#efficiency").val();
        if ( !$.isNumeric(efficiency) ) {
            alert("燃費が正しく設定されていません");
            return;
        }
        if ( !$.isNumeric(distance) ) {
            alert("走行距離が計算できませんでした");
            return;
        }
        var oiltype = $("#oiltype").val();
        var destination = $("#destination").val();
        if ( !destination ) {
            alert("目的地が正しく設定されていません");
            return;
        }

        $.ajax({
            url : "http://mileage.youk.info/mileage-twei/result.php",
            crossDomain: true,
            data : {
                oiltype: oiltype,
                destination: destination,
                distance: distance,
                efficiency: efficiency
            },
            type : "get",
            dataType: "jsonp",
            success : function(data) {
                draw_result(data);
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
