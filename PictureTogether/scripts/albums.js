(function (global) {
    var AlbumsViewModel;
    var app = global.app = global.app || {};
    var storage = window.localStorage;

    AlbumsViewModel = kendo.data.ObservableObject.extend({
        albumsDataSource: null,
        username: null,

        init: function () {
            var that = this;
            var dataSource;

            kendo.data.ObservableObject.fn.init.apply(that, []);
            dataSource = new kendo.data.DataSource({
                data: []
            });

            that.set("albumsDataSource", dataSource);
        },

        viewShow: function () {
            var that = this;
            var dataSource;
            var data;
            var newUsername = storage.getItem("username");

            if (newUsername !== that.username) {
                data = storage.getItem("albums");
                if (data !== "null") {
                    data = JSON.parse(storage.getItem("albums"));
                } else {
                    data = [];
                }

                that.username = newUsername;

                dataSource = new kendo.data.DataSource({
                    data: data
                });

                that.set("albumsDataSource", dataSource);
            }
        }
    });

    app.albumsService = {
        viewModel: new AlbumsViewModel(),
        show: function () {
            app.albumsService.viewModel.viewShow();
        }
    };
})(window);
