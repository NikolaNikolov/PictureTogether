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
            app.picturesService.viewModel.viewShow(JSON.parse(e.view.params.pictures));
        }
    };
})(window);
