(function (global) {
    var PicturesViewModel;
    var app = global.app = global.app || {};

    PicturesViewModel = kendo.data.ObservableObject.extend({
        viewShow: function (pictures) {
            var that = this;

            $("#pictures-listview").kendoMobileListView({
                dataSource: {
                    data: pictures
                },
                template: $("#listview-pictures-template").html()
            });

            $(".double-tap").kendoTouch({
                doubletap: function (e) {
                    $(e.touch.target).toggleClass("small-image");
                }
            });
        }
    });

    app.picturesService = {
        viewModel: new PicturesViewModel(),
        show: function (e) {
            var pictures = JSON.parse(e.view.params.pictures);
            if (pictures.length == 0) {
                navigator.notification.alert("Noone has uploaded a picture in this album.",
                    function () {
                        app.application.navigate("#:back");
                    }, "No pictures", 'OK');
            }

            app.picturesService.viewModel.viewShow(pictures);
        }
    };
})(window);
