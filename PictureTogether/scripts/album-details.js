(function (global) {
    var AlbumDetailsViewModel;
    var app = global.app = global.app || {};

    AlbumDetailsViewModel = kendo.data.ObservableObject.extend({
        albumId: null,
        album: null,
        shareCode: null,

        viewShow: function (albumId) {
            var that = this;
            var requestUrl;
            var shareCode;

            if (albumId && albumId != that.albumId) {
                that.albumId = albumId;
                shareCode = app.username + "_" + albumId;
                that.set("shareCode", shareCode);

                app.application.pane.loader.show();
                requestUrl = app.servicesBaseUrl + "albums/get/" + albumId + "?sessionKey=" + app.sessionKey;
                global.httpRequester.getJSON(requestUrl)
                    .then(function (response) {
                        that.album = response;
                        app.application.pane.loader.hide();
                    }, function (error) {
                        app.application.pane.loader.hide();
                        navigator.notification.alert("Check your internet connection.",
                            function () {
                            }, "Album request failed", 'OK');
                    });
            }
        },

        onTakePicture: function () {
            var that = this;

            navigator.camera.getPicture(
                function (imageURI) {
                    if (!that.album) {
                        that.album = {
                            id: that.albumId,
                            pictures: []
                        };
                    }
                    that.album.pictures.push({
                        url: imageURI
                    });
                    that.uploadPhoto(imageURI);
                },
                function (message) {
                    navigator.notification.alert("There seems to be a problem with your camera.",
                        function () {
                        }, "Take picture failed", 'OK');
                }, {
                    quality: 50,
                    destinationType: navigator.camera.DestinationType.FILE_URI,
                    sourceType: navigator.camera.PictureSourceType.CAMERA,
                    saveToPhotoAlbum: true
                });
        },

        uploadPhoto: function (imageURI) {
            var options = new FileUploadOptions();
            var params = new Object();
            var url = app.servicesBaseUrl + "albums/picture?sessionKey=" + app.sessionKey;
            var ft = new FileTransfer();

            options.fileKey = "file";
            options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
            options.mimeType = "image/jpg";
            options.chunkedMode = false;
            options.params = params;

            ft.upload(imageURI, encodeURI(url),
                function (r) {
                    console.log("Code = " + r.responseCode);
                    console.log("Response = " + r.response);
                    console.log("Sent = " + r.bytesSent);
                }, function (error) {
                    navigator.notification.alert("Check your internet connection.",
                        function () {
                        }, "Image upload failed", 'OK');
                    console.log("upload error code " + error.code);
                    console.log("upload error source " + error.source);
                    console.log("upload error target " + error.target);
                }, options);
        },

        onViewPictures: function () {
            var that = this;

            if (that.album && that.album.id == that.albumId) {
                app.application.navigate("views/pictures.html?pictures=" + JSON.stringify(that.album.pictures));
            } else {
                that.viewShow(that.albumId);
            }
        },

        onShowLocation: function () {
            var that = this;

            if (that.album && that.album.id == that.albumId) {
                app.application.navigate("views/album-location.html?location=" + JSON.stringify({
                    latitude: that.album.latitude,
                    longitude: that.album.longitude
                }));
            } else {
                that.viewShow(that.albumId);
            }
        }
    });

    app.albumDetailsService = {
        viewModel: new AlbumDetailsViewModel(),
        show: function (e) {
            var tabstrip = app.application.view().footer.find(".km-tabstrip").data("kendoMobileTabStrip");
            tabstrip.clear();
            app.albumDetailsService.viewModel.viewShow(e.view.params.albumId);
        }
    };
})(window);
