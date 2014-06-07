(function (global) {
    var app = global.app = global.app || {},
        data = app.data = app.data || {};
    
    var getProgramCore = function (id) {
        var deferred = new $.Deferred();
        
        var carbs = [], proteins = [], fats = [];
        var details = [];
        
        for (var i = 0; i < 7; i++) {
            carbs.push(10);
            proteins.push(20);
            fats.push(5);
            
            details.push({
                'trainings': [],
                'meals': [{
                    'start': '08:00',
                    'end': '08:30',
                    'type': 'breakfast',
                    'comp': {
                        'carbs': 3,
                        'prots': 2,
                        'fats': 4
                    }},
                    {
                    'start': '10:00',
                    'end': '10:30',
                    'type': 'second breakfast',
                    'comp': {
                        'carbs': 3,
                        'prots': 2,
                        'fats': 4
                    }},
                	{
                    'start': '13:00',
                    'end': '13:30',
                    'type': 'luch',
                    'comp': {
                        'carbs': 2,
                        'prots': 5,
                        'fats': 2
                    }}]
            });
        }
        
        details[1].trainings.push({
                    'start': '12:00',
                    'end': '13:00',
                    'type': 'cardio'
                });
        
        details[4].trainings.push({
                    'start': '12:00',
                    'end': '13:00',
                    'type': 'cardio'
                });
        
        deferred.resolve({
                             carbs: carbs,
                             proteins: proteins,
                             fats: fats,
            				 details: details
                         });
        return deferred.promise();
        //return data.defaultClient.buildRequest()
        //    .addToRoute("api")
        //    .addToRoute("programs")
        //    .addToRoute(id)
        //    .get();
    };

    var getProgram = function(id) {
        return getProgramCore(id).then(function(program) {
            var weekProgram = [];
            var carbs = program.carbs;
            var prots = program.proteins;
            var fats = program.fats;
            var details = program.details;
                        
            for (var i = 0; i < carbs.length; i++) {
                var day = {
                    'shortName': app.calendar.dayShortNames[i],
                    'longName': app.calendar.dayLongNames[i],
                    'all': [carbs[i], prots[i], fats[i]],
                    'carbs': carbs[i],
                	'prots': prots[i],
                	'fats': fats[i],
                    'details': details[i]
                };
                weekProgram.push(day);
            }

            var dayProgram = [weekProgram[0]];
            
            return {
                'day': dayProgram,
                'week': weekProgram
            };
        });
    };

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
            
            app.profileService.profile = app.profileService.profile || { 'goal': 1 };
            var goal = app.profileService.profile.goal;
            getProgram(goal).done(function(p) {
                app.programService.overviewViewModel.load(p);
            });
        }
    };
})(window);