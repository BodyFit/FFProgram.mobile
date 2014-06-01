(function (global, $) {
    var ViewModel,
        app = global.app = global.app || {},
        data = app.data = app.data || {};
    
    var getBiometricsHistory = function () {
        var deferred = new $.Deferred();
        deferred.resolve([
                             { value: 110, date: new Date("2011/12/29") },
                             { value: 112, date: new Date("2011/12/30") },
                             { value: 110, date: new Date("2011/12/31") },
                             { value: 108, date: new Date("2012/01/01") },
                             { value: 107, date: new Date("2012/01/02") },
                             { value: 108, date: new Date("2012/01/03") },
                             { value: 111, date: new Date("2012/01/04") },
                             { value: 110, date: new Date("2012/01/05") },
                             { value: 107, date: new Date("2012/01/08") }
                         ]);
        return deferred.promise();
        //return data.defaultClient.buildRequest()
        //    .addToRoute("api")
        //    .addToRoute("biometrics")
        //    .addToRoute("history")
        //    .get();
    };
    
    var days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    ViewModel = app.ViewModelBase
        .extend({
                    loadHistory: function(history) {
                        this.set("history", history);
                    },
                    loadProgram: function(program) {
                        var weekProgram = [];
                        var carbs = program.carbs;
                        var prots = program.proteins;
                        var fats = program.fats;
                        
                        for (var i = 0; i < carbs.length; i++) {
                            var day = {
                                title: days[i],
                                data: [carbs[i], prots[i], fats[i]]
                            };
                            weekProgram.push(day);
						}
                        
                        var dayProgram = [{
                            carbs: carbs[0],
                            prots: prots[0],
                            fats: fats[0],
                        }];
                        
                        this.set("dayProgram", dayProgram);
                        this.set("weekProgram", weekProgram);
                    }
                });

    app.dashboardService = {
        viewModel: new ViewModel(),
        dashboardShow: function() {
            var viewModel = app.dashboardService.viewModel;
            app.profileService.profile = { goal: 1 };
            
            if (!app.profileService.profile) {
                app.views.login.navigateTo();
            } else {
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
        },
        dashboardInit: function() {
            var weightChart = $("#weightChart");
            var dashboardRoot = $("#dashboardRoot");
            
            var refreshChartSize = function() {
                weightChart.width(dashboardRoot.width());
                weightChart.data("kendoChart").refresh();
            };
            
            refreshChartSize();
            
            $(window).resize(refreshChartSize);
        }
    };
})(window, jQuery);