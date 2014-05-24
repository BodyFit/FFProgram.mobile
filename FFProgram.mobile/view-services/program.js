(function (global) {
	var ViewModel,
		app = global.app = global.app || {};

	ViewModel = app.ViewModelBase.extend({
		'someText': "Lorem ipsum..."
	});

	app.programService = {
		viewModel: new ViewModel()
	};
})(window);