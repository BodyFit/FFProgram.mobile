(function (global, $) {
    var ViewModel,
        app = global.app = global.app || {},
        data = app.data = app.data || {};
    
    var getBiometricsHistory = function () {
        return data.defaultClient.buildRequest()
            .addToRoute("api")
            .addToRoute("biometrics")
            .addToRoute("history")
            .get()
            .then(function(history) {
                result = [];
                $.each(history, function(index, item) {
                    result.push({
                                    value: item.weight,
                                    date: kendo.parseDate(item.ModifiedAt)
                                });
                });  
                return result;
            });
    };
    
    ViewModel = app.ViewModelBase
        .extend({
                    loadHistory: function(history) {
                        this.set("history", history);
                    },
                    loadProgram: function(program) {
                        this.set("dayProgram", program.day);
                        this.set("weekProgram", program.week);
                    }
                });

    app.dashboardService = {
        viewModel: new ViewModel(),
        dashboardShow: function() { 
            app.dashboardService.loadDashboardData();
        },
        loadDashboardData: function() {
            var viewModel = app.dashboardService.viewModel;
            var historyRequest = getBiometricsHistory()
                .done(function(r) { 
                    viewModel.loadHistory(r);
                });
            var programRequest = data
                .dataStore
                .getProgramOverview()
                .done(function(r) { 
                    viewModel.loadProgram(r); 
                });
        
            var requests = $.when(historyRequest, programRequest)
                .fail(function(err) {
                    viewModel.set('hasErrors', true);
                    viewModel.set('errorHeader', "Error loading goals: " + err.statusText);
                    viewModel.set('errorText', err.responseText);
                });
            
            app.livecycle.track(requests);
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