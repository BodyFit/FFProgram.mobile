(function (global) {
	var ViewModel,
        app = global.app = global.app || {},
        data = app.data = app.data || {};
    
    var getProgram = function (id) {
        return data.defaultClient.buildRequest()
            .addToRoute("api")
            .addToRoute("programs")
            .addToRoute(id)
            .get();
    };

	ViewModel = app.ViewModelBase.extend({
		'someText': "Lorem ipsum..."
	});

	app.programService = {
		viewModel: new ViewModel(),
		'getProgram': function(id) {
            return getProgram(id);
        }
	};
})(window);