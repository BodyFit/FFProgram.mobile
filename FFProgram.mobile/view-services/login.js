(function (global) {
    var app = global.app = global.app || {},
		data = app.data = app.data || {};
    
    var loginPromise = new $.Deferred();
    var registerUser = function (email, password) {
        var user = {
            'Username': email,
            'Password': password,
            'DisplayName': email,
            'Email': email
        };

        return data.defaultClient.buildRequest().addToRoute("signup").post(user);
    };
    var authenticate = function (email, password) {
        var user = {
            'username': email,
            'password': password
        }
        return data.defaultClient
            .buildRequest()
            .addToRoute("auth")
            .post(user);
    };
    
    var authenticateWithViewModel = function (viewModel) {
        var authenticateRequest = authenticate(viewModel.email, viewModel.pass)
        	.done(function (data) {
                loginPromise.resolve(data.Result.access_token);
            })
            .fail(function (err) {
                viewModel.set('hasErrors', true);
                viewModel.set('errorHeader', "Error logging in: " + err.statusText);
                if (err.status === 401) {
                    viewModel.set('errorText', "Wrong username or password!");
                } else {
                    viewModel.set('errorText', err.responseText);
                }
            });

        viewModel.busyContent = "Logging in...";
        viewModel.waitForResult(authenticateRequest);

        return authenticateRequest;
    }

    var LoginViewModel = app.ViewModelBase
        .extend({
                    email: "miro@test.com",
                    pass: "test",
                    remember: false,

                    onLogin: function () {
                        var that = this;

                        authenticateWithViewModel(that);
                    },
                    onRegister: function () {
                        app.views.register.navigateTo();
                    }
                });
    
    var RegisterViewModel = app.ViewModelBase
        .extend({
                    email: "",
                    pass: "",
                    rePass: "",
                    onRegister: function () {
                        var that = this;
                        // TODO: Add validation.

                        var register = registerUser(that.email, that.pass);

                        that.busyContent = "Creating user...";
                        that.waitForResult(register);

                        register.fail(function (err) {
                            that.set('hasErrors', true);
                            that.set('errorHeader', "Error creating user: " + err.statusText);
                            that.set('errorText', err.responseText);
                        }).done(function () {
                            authenticateWithViewModel(that);
                        });
                    }
                });

    app.loginService = {
        'loginViewModel': new LoginViewModel(),
        'registerViewModel': new RegisterViewModel(),
        'login': function () {
            return loginPromise.promise();
        },
        'clearLoginView': function () {
            var that = app.loginService;
            that.viewModel.email = "";
            that.viewModel.pass = "";
            that.remember = false;
        },
        'clearRegisterView': function () {
            var viewModel = app.loginService.registerViewModel;
            viewModel.email = "";
            viewModel.pass = "";
            viewModel.rePass = "";
        }
    };
})(window);