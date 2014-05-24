(function (global) {
	var ViewModel,
		app = global.app = global.app || {};

	ViewModel = app.ViewModelBase.extend({
		email: "",
		pass: "",
		rePass: "",
		onRegister: function () {
			var that = this;
			// TODO: Add validation.

			var register = app.data.users.registerUser(that.email, that.pass)
				.done(function (d) {
					console.log("User registered successfully!");
					return app.data.users.authenticate(that.email, that.pass);
				})
				.done(function (d) {					
					app.views.home.navigateTo();
				})
				.fail(function (err) {
					that.set('hasErrors', true);
					that.set('errorHeader', "Error creating user: " + err.statusText);
					that.set('errorText', err.responseText);
				});

			that.busyContent = "Creating user...";
			this.waitForResult(register);
		},
		onCancel: function () {
			app.views.login.navigateTo();
		}
	});

	app.registerService = {
		viewModel: new ViewModel(),
		clear: function () {
			var that = app.registerService;
			that.viewModel.email = "";
			that.viewModel.pass = "";
			that.viewModel.rePass = "";
		}
	};
})(window);