(function (global) {
    var app = global.app = global.app || {},
        data = app.data = app.data || {};

    var ProgramOverviewViewModel = app.WizardPageViewModel
        .extend({
                    'load': function(program) {
                        this.set('weekProgram', program.week);
                    }
                });

    app.programService = {
        'overviewViewModel': new ProgramOverviewViewModel(),
        'getProgram': function(id) {
            return getProgram(id);
        },
        'overviewViewShow': function (e) {
            var viewModel = app.programService.overviewViewModel;
            viewModel.onShow(e.view.params);
            data.dataStore.getProgramOverview().done(function(p) {
                app.programService.overviewViewModel.load(p);
            });
        }
    };
})(window);