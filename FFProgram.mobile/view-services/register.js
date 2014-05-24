(function (global) {
	var ViewModel,
		app = global.app = global.app || {};

	ViewModel = kendo.data.ObservableObject.extend({
		email: "",
		pass: "",
		rePass: "",
		onRegister: function () {
			var that = this;

			app.data.users.registerUser(that.email, that.pass)
				.done(function (d) {
					console.log("User registered successfully!");
					return app.data.users.authenticate(that.email, that.pass);
				})
				.done(function (d) {
					// TODO: Store the tokens returned
					// NOTE: Pass that.remember as well

					app.user = d;
					app.views.home.navigateTo();
				})
				.fail(function (d) {
					console.log("Failed big time!" + d);
				});
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