(function (global) {
	var ViewModel,
		app = global.app = global.app || {};

	ViewModel = app.ViewModelBase.extend({
		test: "some test..."
	});

	app.dashboardService = {
		viewModel: new ViewModel()
	};
})(window);