(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener("deviceready", function () {
        app.application = new kendo.mobile.Application(document.body, {
            layout: "tabstrip-layout"
        });
        //localStorage.clear();
        //app.servicesBaseUrl = "http://picturetogether.apphb.com/api/";
        app.servicesBaseUrl = "http://localhost:61019/api/";
        global.httpRequester.getJSON(app.servicesBaseUrl);

        document.addEventListener("online", function () {
            navigator.notification.vibrate(1000);
        }, false);
    }, false);
})(window);