(function (global) {
	var ViewModel,
		app = global.app = global.app || {},
		data = app.data = app.data || {};

	ViewModel = app.ViewModelBase.extend({
		'someText': "Lorem ipsum..."
	});

	var getProfile = function () {
		return data.defaultClient.buildRequest()
								 .addToRoute("api")
								 .addToRoute("profile")
								 .get();
	};

	var updateProfile = function (profile) {
		return data.defaultClient.buildRequest()
								 .addToRoute("api")
								 .addToRoute("profile")
								 .post(profile);
	};

	app.profileService = {
		viewModel: new ViewModel(),
		initializeUser: function (viewModel) {
			var initalizeUser = getProfile().done(function (d) {
				app.profileService.viewModel.userProfile = d;
				app.views.profileWizard.navigateTo();
			})
			.fail(function (err) {
				viewModel.set('hasErrors', true);
				viewModel.set('errorHeader', "Error loading user: " + err.statusText);
				viewModel.set('errorText', err.responseText);
			});

			viewModel.busyContent = "Loading user...";
			viewModel.waitForResult(initalizeUser);
		}
	};
})(window);