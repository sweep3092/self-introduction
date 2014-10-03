<?php

$distance = $_GET['distance'];
$efficiency = $_GET['efficiency'];


// Google Maps API, GeoCoding
$param_geo = "address=".htmlspecialchars($_GET['destination'], ENT_QUOTES, 'UTF-8');
$req_geo   = "http://maps.googleapis.com/maps/api/geocode/xml?".$param_geo."&sensor=false";
$res_geo   = simplexml_load_file($req_geo);

// API gogo.gs
$param_gas = "&kind=".htmlspecialchars($_GET['oiltype'], ENT_QUOTES, 'UTF-8')."&lat=".$res_geo->result->geometry->location->lat."&lon=".$res_geo->result->geometry->location->lng;
$req_gas   = "http://api.gogo.gs/v1.2/?apid=mileagekdjfaoirj&num=1".$param_gas;
$res_gas   = simplexml_load_file($req_gas);

$cost = $_GET['distance'] / $_GET['efficiency'] * $res_gas->Item->Price * 0.001;

$output = array(
    'price'    => $res_gas->Item->Price,
    'shopcode' => $res_gas->Item->ShopCode,
    'cost'     => floor( $cost ),
);

header( 'Content-Type: text/javascript; charset=utf-8' );

echo $_GET['callback'] . "(" . json_encode($output). ")";
