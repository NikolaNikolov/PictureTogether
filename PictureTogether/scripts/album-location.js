(function (global) {
    var map;
    var AlbumLocationViewModel;
    var app = global.app = global.app || {};

    AlbumLocationViewModel = kendo.data.ObservableObject.extend({
        _lastMarker: null,

        showMarker: function (location) {
            var that = this;

            if (location) {
                var position = new google.maps.LatLng(location.latitude, location.longitude);
                map.panTo(position);
                that._putMarker(position);
            } else {
                navigator.notification.alert("The selected album has no location.",
                             function () {
                                 app.application.navigate("#:back");
                             }, "No location", 'OK');
            }
        },

        _putMarker: function (position) {
            var that = this;

            if (that._lastMarker !== null && that._lastMarker !== undefined) {
                that._lastMarker.setMap(null);
            }

            that._lastMarker = new google.maps.Marker({
                map: map,
                position: position
            });
        }
    });

    app.albumLocationService = {
        initLocation: function () {
            var mapOptions = {
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                zoomControl: true,
                zoomControlOptions: {
                    position: google.maps.ControlPosition.LEFT_BOTTOM
                },

                mapTypeControl: false,
                streetViewControl: false
            };

            map = new google.maps.Map(document.getElementById("album-map-canvas"), mapOptions);
        },

        show: function (e) {
            google.maps.event.trigger(map, "resize");
            app.albumLocationService.viewModel.showMarker(JSON.parse(e.view.params.location));
        },

        viewModel: new AlbumLocationViewModel()
    };
})(window);
