(function ($) {
    'use strict';
    var eb = new vertx.EventBus("http://" + location.host + "/eventbus");
    eb.onopen = function () {
        console.log("open");
        eb.registerHandler("dashboard", function (data) {

            var msg = JSON.parse(data);
            console.log(msg);
            // line1= line1 + message.lon + message.lat;
            //  points = points.concat(new google.maps.LatLng(msg.lat, msg.lon));

            console.log(points);
        });
    };


})($);
