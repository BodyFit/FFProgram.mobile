(function (global) {
	var ViewModel,
		app = global.app = global.app || {};

	ViewModel = kendo.data.ObservableObject.extend({
		email: "",
		pass: "",
		remember: false,
		onLogin: function () {
			var that = this;
			app.loginService.authenticate(that.email, that.pass, that.remember)
				.then(function () {
					app.views.home.navigateTo();
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
		authenticate: function () {
			var result = $.deferred();
			result.resolve();
			return result;
		}
	};
})(window);