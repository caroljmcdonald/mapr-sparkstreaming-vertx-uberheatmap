(function ($) {
	'use strict';
    var eb = new vertx.EventBus("http://" + location.host + "/eventbus");
    eb.onopen = function () {
        console.log("open");
        eb.registerHandler("dashboard", function (data) {

            var entry = JSON.parse(data);
            console.log(entry);
            points = points.concat(new google.maps.LatLng(37.782551, -122.445368));

        });
    };


})($);
