(function (global) {
    var ViewModel,
        app = global.app = global.app || {},
        data = app.data = app.data || {};
    
    var getBiometricsHistory = function () {
        return data.defaultClient.buildRequest()
            .addToRoute("api")
            .addToRoute("biometrics")
            .addToRoute("history")
            .get();
    };

    ViewModel = app.ViewModelBase
        .extend({
                    loadHistory: function(history) {
                    },
                    loadProgram: function(program) {
                    }
                });

    app.dashboardService = {
        viewModel: new ViewModel(),
        dashboardInit: function() {
            // TODO: Do this only if the user is not logged in.
            app.views.login.navigateTo();
        },
        dashboardShow: function() {
            var viewModel = app.dashboardService.viewModel;
            var historyRequest = getBiometricsHistory()
                .done(function(r) { 
                    viewModel.loadHistory(r); 
                });
            var programRequest = app.programService
                .getProgram(app.profileService.profile.goal)
                .done(function(r) { 
                    viewModel.loadProgram(r); 
                });
            
            var requests = $.when(historyRequest, programRequest)
                .fail(function(err) {
                    viewModel.set('hasErrors', true);
                    viewModel.set('errorHeader', "Error loading goals: " + err.statusText);
                    viewModel.set('errorText', err.responseText);
                });
            
            viewModel.busyContent = "Loading dashboard...";
            viewModel.waitForResult(requests);
        }
    };
})(window);