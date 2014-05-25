(function (global) {
	var ViewModel,
		app = global.app = global.app || {};

	ViewModel = app.ViewModelBase.extend({
		email: "miro@test.com",
		pass: "test",
		remember: false,

		onLogin: function () {
			var that = this;

			app.loginService
				.authenticate(that.email, that.pass, that)
				.done(function () {
					return app.profileService.initializeUserProfile(that);
				});
		},
		onRegister: function () {
			app.views.register.navigateTo();
		}
	});

	app.loginService = {
		viewModel: new ViewModel(),
		clear: function () {
			var that = app.loginService;
			that.viewModel.email = "";
			that.viewModel.pass = "";
			that.remember = false;
		},
		authenticate: function (email, pass, viewModel) {
			var authenticate = app.data.users.authenticate(viewModel.email, viewModel.pass)
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
			viewModel.waitForResult(authenticate);

			return authenticate;
		}
	};
})(window);