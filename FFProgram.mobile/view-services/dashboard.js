(function (global) {
	var ViewModel,
		app = global.app = global.app || {};

	ViewModel = app.ViewModelBase.extend({
		test: "some test..."
	});

	app.dashboardService = {
		viewModel: new ViewModel(),
        init: function() {
            app.views.login.navigateTo();
        }
	};
})(window);