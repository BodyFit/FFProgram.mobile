(function (global) {
	var ViewModel,
		app = global.app = global.app || {};

	ViewModel = kendo.data.ObservableObject.extend({
		'someText': "Lorem ipsum..."
	});

	app.profileService = {
		viewModel: new ViewModel()
	};
})(window);