(function (global) {
    var app = global.app = global.app || {},
        data = app.data = app.data || {};
    
    var getRawProgramOverview = function (id) {
        //var deferred = new $.Deferred();
        //var carbs = [], proteins = [], fats = [];
        //var details = [];
        //for (var i = 0; i < 7; i++) {
        //    carbs.push(10);
        //    proteins.push(20);
        //    fats.push(5);
        //}
        //deferred.resolve({
        //                     carbs: carbs,
        //                     proteins: proteins,
        //                     fats: fats,
        //                     details: details
        //                 });
        //return deferred.promise();
        return data.defaultClient.buildRequest()
            .addToRoute("api")
            .addToRoute("programs")
            .addToRoute(id)
            .get();
    };
    
    var getProgramOverview = function(id) {        
        return getRawProgramOverview(id)
            .then(function(program) {
                var weekProgram = [];
                var carbs = program.carbs;
                var prots = program.proteins;
                var fats = program.fats;
                        
                for (var i = 0; i < carbs.length; i++) {
                    var day = {
                        'index' : i,
                        'shortName': app.calendar.dayShortNames[i],
                        'longName': app.calendar.dayLongNames[i],
                        'all': [carbs[i], prots[i], fats[i]],
                        'data': [{
                                    'carbs': carbs[i],
                                    'prots': prots[i],
                                    'fats': fats[i]
                                }
                        ],
                        'carbs': carbs[i],
                        'prots': prots[i],
                        'fats': fats[i]
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
    
    var getProgramDetails = function (id, dayOfWeek) {
        //        details.push({
        //            'trainings': [],
        //            'meals': [{
        //                'start': '08:00',
        //                'end': '08:30',
        //                'type': 'breakfast',
        //                'comp': {
        //                    'carbs': 3,
        //                    'prots': 2,
        //                    'fats': 4
        //                }},
        //                {
        //                'start': '10:00',
        //                'end': '10:30',
        //                'type': 'second breakfast',
        //                'comp': {
        //                    'carbs': 3,
        //                    'prots': 2,
        //                    'fats': 4
        //                }},
        //            	{
        //                'start': '13:00',
        //                'end': '13:30',
        //                'type': 'luch',
        //                'comp': {
        //                    'carbs': 2,
        //                    'prots': 5,
        //                    'fats': 2
        //                }}]
        //        });
        //    }
        //    details[1].trainings.push({
        //                'start': '12:00',
        //                'end': '13:00',
        //                'type': 'cardio'
        //            });
        //    details[4].trainings.push({
        //                'start': '12:00',
        //                'end': '13:00',
        //                'type': 'cardio'
        //            });
    }
    
    data.dataStore = {
        'authorizationToken': "GiEScTF5NzujXqoUMTz3hZqbnLJMxmXXb4Cx04FhvXer5K385PGTVkTA185orAckyOqI6OW3vYAhVHTjPoom5q2mBQjR6NfKP4tQIrMyHAkgMMrLDMAp5tRMiAEmOc538Mx8M2PbVss7u8kBVd14YpTLmb8ea7oj7463xLTsdMqvI4AbLOUuZLwc1371DsKqQPbMuZ7YMxbeIca73ocMIK1EJqFySKa8XvCy1j9tLTjlx5zlt2nKRzixHPrq7dmx",
        'getProgramOverview': function() {
            var goal = 1;
            if (app.profileService.profile) {
                goal = app.profileService.profile.goal;
            }
            return getProgramOverview(goal);
        }
    };
})(window)