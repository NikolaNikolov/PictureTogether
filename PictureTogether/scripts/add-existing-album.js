(function (global) {
    var AddExistingAlbumViewModel;
    var app = global.app = global.app || {};

    AddExistingAlbumViewModel = kendo.data.ObservableObject.extend({
        shareCode: "",

        onConfirmCode: function () {
            var that = this;

            var data = that.validateInput();
            if (data) {
                var url = app.servicesBaseUrl + "albums/album?sessionKey=" + app.sessionKey;
                global.httpRequester.putJSON(url, data)
                    .then(function (response) {
                        that.successfulCodeConfirmation(response);
                    }, function (error) {
                        that.unsuccessfulCodeConfirmation(error);
                    });
            }
        },

        validateInput: function () {
            var that = this;

            var shareCode = that.get("shareCode").trim();
            if (shareCode === "") {
                navigator.notification.alert("Please enter a share code",
                                             function () {
                                             }, "Code confirmation failed", 'OK');
                return null;
            }

            var indexOfAlbumId = shareCode.lastIndexOf("_");
            if (indexOfAlbumId < 0) {
                navigator.notification.alert("Invalid share code.",
                            function () {
                            }, "Code confirmation failed", 'OK');
                return null;
            }

            var username = shareCode.substring(0, indexOfAlbumId);
            var albumId = shareCode.substring(indexOfAlbumId + 1);
            var data = {
                albumId: albumId,
                username: username
            };

            app.application.pane.loader.show();
            return data;
        },

        successfulCodeConfirmation: function (response) {
            var that = this;

            app.application.pane.loader.hide();
            that.set("shareCode", "");
            app.application.navigate("views/albums.html?newAlbum=" + JSON.stringify(response));
        },

        unsuccessfulCodeConfirmation: function (error) {
            app.application.pane.loader.hide();
            try {
                var responseMessage = JSON.parse(error.responseText).Message;
                navigator.notification.alert(responseMessage,
                             function () {
                             }, "Code confirmation failed", 'OK');
            } catch (ex) {
                navigator.notification.alert("Check your internet connection.",
                             function () {
                             }, "Code confirmation failed", 'OK');
            }
        }
    });

    app.addExistingAlbumService = {
        viewModel: new AddExistingAlbumViewModel()
    };
})(window);
