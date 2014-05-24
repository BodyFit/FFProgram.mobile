(function (global) {
	var ViewModel,
		app = global.app = global.app || {};

	ViewModel = kendo.data.ObservableObject.extend({
		test: "some test..."
	});

	app.dashboardService = {
		viewModel: new ViewModel()
	};
})(window);