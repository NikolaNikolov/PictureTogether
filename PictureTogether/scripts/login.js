(function (global) {
    var LoginViewModel;
    var app = global.app = global.app || {};
    var storage = window.localStorage;

    LoginViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        username: "",
        password: "",

        init: function () {
            var that = this;

            kendo.data.ObservableObject.fn.init.apply(that, []);

            app.sessionKey = storage.getItem("sessionsKey");
            app.username = storage.getItem("username");

            if (app.sessionKey) {
                that.set("isLoggedIn", true);
                document.addEventListener("deviceready", function () {
                    that.navigateToAlbums();
                    that.set("username", app.username);
                }, false);
            } else {
                document.addEventListener("deviceready", function () {
                    $("#tabstrip").hide();
                }, false);
            }
        },

        onLogin: function () {
            var that = this;

            var data = that.validateInput();
            if (data) {
                global.httpRequester.postJSON(app.servicesBaseUrl + "users/login", data)
                    .then(function (response) {
                        that.successfulLogin(response);
                    }, function (error) {
                        that.unsuccessfulLogin(error);
                    });
            }
        },

        onRegister: function () {
            var that = this;

            var data = that.validateInput();
            if (data) {
                global.httpRequester.postJSON(app.servicesBaseUrl + "users/register", data)
                    .then(function (response) {
                        that.successfulLogin(response);
                    }, function (error) {
                        that.unsuccessfulLogin(error);
                    });
            }
        },

        onLogout: function () {
            var that = this;

            that.clearForm();
            that.set("isLoggedIn", false);
            global.httpRequester.putJSON(app.servicesBaseUrl + "users/logout?sessionKey=" + app.sessionKey);
            app.sessionKey = "";
            app.username = "";
            storage.removeItem("sessionsKey");
            storage.removeItem("username");
            $("#tabstrip").hide();
        },

        clearForm: function () {
            var that = this;

            that.set("username", "");
            that.set("password", "");
        },

        validateInput: function () {
            var that = this;

            var username = that.get("username").trim();
            var password = that.get("password").trim();

            if (username === "" || password === "") {
                navigator.notification.alert("Both fields are required!",
                                             function () {
                                             }, "Login/Register failed", 'OK');

                return null;
            }

            app.application.pane.loader.show();
            var data = {
                username: username,
                authCode: CryptoJS.SHA1(password).toString()
            };

            return data;
        },

        successfulLogin: function (response) {
            var that = this;

            app.application.pane.loader.hide();
            that.set("isLoggedIn", true);
            app.sessionKey = response.sessionKey;
            app.username = response.username;
            storage.setItem("sessionsKey", response.sessionKey);
            storage.setItem("username", response.username);
            storage.setItem("albums", JSON.stringify(response.albums));
            $("#tabstrip").show();
            that.navigateToAlbums();
        },

        unsuccessfulLogin: function (error) {
            var that = this;

            app.application.pane.loader.hide();
            try {
                var responseMessage = JSON.parse(error.responseText).Message;
                navigator.notification.alert(responseMessage,
                             function () {
                             }, "Login/Register failed", 'OK');
            } catch (ex) {
                navigator.notification.alert("Check your internet connection.",
                             function () {
                             }, "Login/Register failed", 'OK');
            }
        },

        navigateToAlbums: function () {
            app.application.navigate("views/albums.html");
        }
    });

    app.loginService = {
        viewModel: new LoginViewModel()
    };
})(window);
