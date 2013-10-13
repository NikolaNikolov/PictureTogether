(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener("deviceready", function () {
        app.application = new kendo.mobile.Application(document.body, {
            layout: "tabstrip-layout"
        });

        app.servicesBaseUrl = "http://picturetogether.apphb.com/api/";
        //app.servicesBaseUrl = "http://localhost:61019/api/";
        global.httpRequester.getJSON(app.servicesBaseUrl + "appharbor/wakeup");

        document.addEventListener("online", function () {
            navigator.notification.vibrate(1000);
        }, false);

        document.addEventListener("offline", function () {
            navigator.notification.alert("You can still take pictures in offline mode.",
             function () {
             }, "No internet connection", 'OK');
        }, false);
    }, false);
})(window);
