(function (global) {
	var ViewModel,
		app = global.app = global.app || {};

	ViewModel = app.ViewModelBase.extend({
		test: "some test..."
	});

	app.settingsService = {
		viewModel: new ViewModel()
	};
})(window);