(function (global) {
    var app = global.app = global.app || {};
    var storage = window.localStorage;
    
    document.addEventListener("deviceready", function () {
        app.application = new kendo.mobile.Application(document.body, {
            layout: "tabstrip-layout"
        });
        
        storage.setItem("sessionsKey", "pesho");
    }, false);    
})(window);