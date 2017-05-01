function initialize() {
//Setup Google Map
var myLatlng = new google.maps.LatLng(40.75144, - 74.00331);
        var light_grey_style = [{"featureType":"landscape", 
                "stylers":[{"saturation": - 100}, {"lightness":65}, {"visibility":"on"}]}, 
            {"featureType":"poi", "stylers":[{"saturation": - 100}, {"lightness":51}, {"visibility":"simplified"}]},
            {"featureType":"road.highway", "stylers":[{"saturation": - 100}, {"visibility":"simplified"}]}, 
            {"featureType":"road.arterial", "stylers":[{"saturation": - 100}, {"lightness":30},
                    {"visibility":"on"}]}, {"featureType":"road.local", "stylers":[{"saturation": - 100}, 
                    {"lightness":40}, {"visibility":"on"}]}, {"featureType":"transit", "stylers":[{"saturation": - 100}, {"visibility":"simplified"}]}, {"featureType":"administrative.province", "stylers":[{"visibility":"off"}]}, {"featureType":"water", "elementType":"labels", "stylers":[{"visibility":"on"}, {"lightness": - 25}, {"saturation": - 100}]}, {"featureType":"water", "elementType":"geometry", "stylers":[{"hue":"#ffff00"}, {"lightness": - 25}, {"saturation": - 97}]}];
        var myOptions = {
        zoom: 13,
                center: myLatlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                mapTypeControl: true,
                mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                        position: google.maps.ControlPosition.LEFT_BOTTOM
                },
                styles: light_grey_style
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
//        var map = new google.maps.Map(document.getElementById('map_canvas'), {
//           zoom: 13,
//           center: { lat: 40.75144, lng: - 74.00331 },
//           mapTypeId: google.maps.MapTypeId.SATELLITE
//        });
        //Setup heat map and link to Twitter array we will append data to
        var heatmap;
        var liveTweets = new google.maps.MVCArray();
       // var liveTweets = []
      //  var fakedata = []
        liveTweets.push(new google.maps.LatLng(0, 0))
//        heatmap = new google.maps.visualization.HeatmapLayer({
//        data: liveTweets,
//                map: map
//        })
//        liveTweets.push(new google.maps.LatLng(0, 0))
        heatmap = new google.maps.visualization.HeatmapLayer({
        data: liveTweets
        });
       heatmap.setMap(map);
        var eb = new vertx.EventBus("http://" + location.host + "/eventbus");
        eb.onopen = function () {
        console.log("open");
                eb.registerHandler("dashboard", function (data) {
                var msg = JSON.parse(data);
                        console.log(msg);
                        var tweetLocation = new google.maps.LatLng(msg.lon, msg.lat);
                        liveTweets.push(tweetLocation);
                        //Flash a dot onto the map quickly
                        heatmap.setData(liveTweets);
                        console.log("Points on the map: " + liveTweets.length)
                        var image = "css/small-dot-icon.png";
                        var marker = new google.maps.Marker({
                        position: tweetLocation,
                                map: map,
                                icon: image
                        });
//                        setTimeout(function(){
//                        marker.setMap(null);
//                        }, 600);
                });
        };
}