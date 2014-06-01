(function (global) {
	var ViewModel,
        app = global.app = global.app || {},
        data = app.data = app.data || {};
    
    var getProgram = function (id) {
        var deferred = new $.Deferred();
        
        var carbs = [], proteins = [], fats = [];
        for (var i = 0; i < 7; i++) {
            carbs.push(10);
            proteins.push(20);
            fats.push(5);
        }
        
        deferred.resolve({
    			carbs: carbs,
    			proteins: proteins,
    			fats: fats
  		});
        return deferred.promise();
        
        //return data.defaultClient.buildRequest()
        //    .addToRoute("api")
        //    .addToRoute("programs")
        //    .addToRoute(id)
        //    .get();
    };

	ViewModel = app.ViewModelBase.extend({
	});

	app.programService = {
		viewModel: new ViewModel(),
		'getProgram': function(id) {
            return getProgram(id);
        }
	};
})(window);