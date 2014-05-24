(function (global) {
	var ViewModel,
		app = global.app = global.app || {};

	ViewModel = app.ViewModelBase.extend({
		email: "miro@test.com",
		pass: "test",
		remember: false,

		onLogin: function () {
			var that = this;

			var authenticate = app.data.users.authenticate(that.email, that.pass)
				.done(function (d) {
					app.views.profileWizard.navigateTo();
				})
				.fail(function (err) {
					that.set('hasErrors', true);
					that.set('errorHeader', "Error logging in: " + err.statusText);
					if (err.status === 401) {
						that.set('errorText', "Wrong username or password!");
					} else {
						that.set('errorText', err.responseText);
					}
				});

			that.busyContent = "Logging in...";
			that.waitForResult(authenticate);
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
		}
	};
})(window);