(function (global) {
    var app = global.app = global.app || {},
        data = app.data = app.data || {};
    
    var log10 = function(val) {
        return Math.log(val) / Math.LN10;
    }
    
    var getProfile = function () {
        return data.defaultClient.buildRequest()
            .addToRoute("api")
            .addToRoute("profile")
            .get();
    };

    var updateProfile = function (profile) {
        return data.defaultClient.buildRequest()
            .addToRoute("api")
            .addToRoute("profile")
            .put(profile);
    };
    
    var getGoals = function () {
        return data.defaultClient.buildRequest()
            .addToRoute("api")
            .addToRoute("goals")
            .get();
    };
    
    var birthDateFormat = "dd.MM.yyyy";

    var BiometricsViewModel = app.ViewModelBase
        .extend({
                    'init': function() {
                        app.ViewModelBase.fn.init.call(this);
                        var that = this;
                        this.bind("change", function(e) {
                            if (e.field === "sex") {
                                that.set("isHipsFieldVisible", that.sex === "Female");
                            }
                            
                            if (e.field !== "bodyFat") {
                                that.calculateBodyFat();
                            }
                        });
                    },
                    'isHipsFieldVisible': false,
                    'loadProfile': function(profile) {
                        var that = this;
            
                        var birthDate = kendo.parseDate(profile.birthDate);
                        that.set('birthDate', kendo.toString(birthDate, birthDateFormat));
                        that.set('height', profile.height);
                        that.set('sex', profile.sex);
            
                        that.set('weight', profile.weight);
                        that.set('neck', profile.neck);
                        that.set('waist', profile.waist);
                        that.set('hips', profile.hips);
                    },
                    'save': function() {
                        var that = this;
                        
                        var profile = {
                            'birthDate': kendo.parseDate(that.birthDate, birthDateFormat),
                            'height': that.height,
                            'sex': that.sex,
                
                            'weight': that.weight,
                            'neck': that.neck,
                            'waist': that.waist,
                            'hips': that.hips,
                            'bodyFat' : that.bodyFat
                        };
                        
                        that.busyContent = "Saving profile data...";
                        
                        var saveProfileData = updateProfile(profile);
                        that.waitForResult(saveProfileData);
                        return saveProfileData;
                    },
                    'calculateBodyFat': function() {
                        var that = this,
                            bodyFat = 0;
                        
                        // Formula taken from here http://www.wikihow.com/Measure-Body-Fat-Using-the-US-Navy-Method
                        if (that.sex === "Female") {
                            bodyFat = 163.205 * log10(that.waist + that.hips - that.neck) - 97.684 * log10(that.height) - 104.912;
                        } else {
                            bodyFat = 86.010 * log10(that.waist - that.neck) - 70.041 * log10(that.height) + 30.30;
                        }
                        
                        that.set('bodyFat', bodyFat);
                    },
                    'onGoToDashboard': function() {
                        app.views.dashboard.navigateTo();
                    },
                    'onGoToNextStep': function() {
                        this.save()
                            .done(function() {
                                app.views.profileGoals.navigateTo();
                            });
                    }
                });
    
    var GoalsViewModel = app.ViewModelBase
        .extend({
                    'initGoals': function(goals) {
                        var that = this;
                        
                        var goalViewModels = [];
                        $.each(goals, function(i, goal) {
                            goalViewModels
                                .push({
                                          'tags': goal.tags,
                                          'description': goal.description,
                                          'onTap': function() {
                                              that.setGoal(goal)
                                                  .done(function() {
                                                      app.views.dashboard.navigateTo();
                                                  });
                                          }
                                      });
                        });
                        
                        that.set('goals', goalViewModels);
                    },
                    'setGoal': function(goal) {
                        var that = this;
                        
                        var profile = {
                            'goal': goal.id
                        };
                        
                        that.busyContent = "Saving profile data...";
                        
                        var saveProfileData = updateProfile(profile);
                        that.waitForResult(saveProfileData);
                        return saveProfileData;
                    },
                    'onGoToDashboard': function() {
                        app.views.dashboard.navigateTo();
                    }
                });

    app.profileService = {
        'biometricsViewModel': new BiometricsViewModel(),
        'goalsViewModel': new GoalsViewModel(),
        'initializeUserProfile': function (viewModel) {
            var initalizeUser = getProfile().done(function (profile) {
                app.profileService.biometricsViewModel.loadProfile(profile);
                
                if (!profile.isComplete) {
                    app.views.profileWizard.navigateTo();
                } else {
                    app.views.dashboard.navigateTo();
                }
            })
                .fail(function (err) {
                    viewModel.set('hasErrors', true);
                    viewModel.set('errorHeader', "Error loading profile: " + err.statusText);
                    viewModel.set('errorText', err.responseText);
                });

            viewModel.busyContent = "Loading user profile...";
            viewModel.waitForResult(initalizeUser);
        },
        'loadGoals': function () {
            var viewModel = app.profileService.goalsViewModel
            var initalizeGoals = getGoals()
                .done(function(r) {
                    viewModel.initGoals(r);
                })
                .fail(function (err) {
                    viewModel.set('hasErrors', true);
                    viewModel.set('errorHeader', "Error loading goals: " + err.statusText);
                    viewModel.set('errorText', err.responseText);
                });

            viewModel.busyContent = "Loading goals...";
            viewModel.waitForResult(initalizeGoals);
        },
    };
})(window);