(function (global) {
    var LoginViewModel,
    app = global.app = global.app || {};
    var storage = window.localStorage;

    LoginViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        username: "",
        password: "",

        init: function () {
            var that = this;

            kendo.data.ObservableObject.fn.init.apply(that, []);

            storage.setItem("sessionsKey", "pesho");

            if (storage.getItem("sessionsKey")) {
                that.isLoggedIn = true;
            }
        },

        onLogin: function () {
            var that = this,
            username = that.get("username").trim(),
            password = that.get("password").trim();

            if (username === "" || password === "") {
                navigator.notification.alert("Both fields are required!",
                                             function () {
                                             }, "Login failed", 'OK');

                return;
            }

            that.set("isLoggedIn", true);
        },

        onLogout: function () {
            var that = this;

            that.clearForm();
            that.set("isLoggedIn", false);
            storage.clear();
        },

        clearForm: function () {
            var that = this;

            that.set("username", "");
            that.set("password", "");
        }
    });

    app.loginService = {
        viewModel: new LoginViewModel()
    };
})(window);