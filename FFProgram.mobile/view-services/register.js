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

			var register = app.data.users.registerUser(that.email, that.pass);

			that.busyContent = "Creating user...";
			that.waitForResult(register);

			register.fail(function (err) {
				that.set('hasErrors', true);
				that.set('errorHeader', "Error creating user: " + err.statusText);
				that.set('errorText', err.responseText);
			}).done(function () {
				app.loginService
					.authenticate(that.email, that.pass, that)
					.done(function () {
						return app.profileService.initializeUserProfile(that);
					});
			});
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