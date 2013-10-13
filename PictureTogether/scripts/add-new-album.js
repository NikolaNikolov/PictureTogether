(function (global) {
    var AddNewAlbumViewModel;
    var app = global.app = global.app || {};

    AddNewAlbumViewModel = kendo.data.ObservableObject.extend({
        albumLocation: null,
        albumName: "",

        viewShow: function () {
            var that = this;

            that.albumLocation = app.lastMarker;
        },

        onConfirmName: function () {
            var that = this;

            var data = that.validateInput();
            if (data) {
                var url = app.servicesBaseUrl + "albums/album?sessionKey=" + app.sessionKey;
                global.httpRequester.postJSON(url, data)
                    .then(function (response) {
                        that.successfulAlbumCreation(response);
                    }, function (error) {
                        that.unsuccessfulAlbumCreation(error);
                    });
            }
        },

        validateInput: function () {
            var that = this;

            var albumName = that.get("albumName").trim();
            if (albumName === "") {
                navigator.notification.alert("Please enter an album name",
                                             function () {
                                             }, "Album creation failed", 'OK');
                return null;
            }

            app.application.pane.loader.show();
            var data = {
                name: albumName,
                latitude: app.lastMarker.position.lb,
                longitude: app.lastMarker.position.mb
            };
            return data;
        },

        successfulAlbumCreation: function (response) {
            var that = this;

            app.application.pane.loader.hide();
            that.set("albumName", "");
            app.application.navigate("views/albums.html?newAlbum=" + JSON.stringify(response));
        },

        unsuccessfulAlbumCreation: function (error) {
            app.application.pane.loader.hide();
            try {
                var responseMessage = JSON.parse(error.responseText).Message;
                navigator.notification.alert(responseMessage,
                             function () {
                             }, "Album creation failed", 'OK');
            } catch (ex) {
                navigator.notification.alert("Check your internet connection.",
                             function () {
                             }, "Album creation failed", 'OK');
            }
        }
    });

    app.addNewAlbumService = {
        viewModel: new AddNewAlbumViewModel(),
        show: function () {
            app.addNewAlbumService.viewModel.viewShow();
        }
    };
})(window);
