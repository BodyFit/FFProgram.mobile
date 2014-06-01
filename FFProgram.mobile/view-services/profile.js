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
    
    var getBiometrics = function () {
        return data.defaultClient.buildRequest()
            .addToRoute("api")
            .addToRoute("biometrics")
            .get();
    };

    var updateBiometrics = function (profile) {
        return data.defaultClient.buildRequest()
            .addToRoute("api")
            .addToRoute("biometrics")
            .post(profile);
    };
    
    var getGoals = function () {
        return data.defaultClient.buildRequest()
            .addToRoute("api")
            .addToRoute("goals")
            .get();
    };
    
    var birthDateFormat = "dd.MM.yyyy";
    
    var saveToCache = function(p) {
        $.each(p, function(k, v) {
            app.profileService.profile[k] = v;
        });
    }
    
    var ProfileViewModel = app.ViewModelBase
        .extend({
                    'setIsWizardPage': function(isWizardPage) {
                        this.set('isSinglePage', !isWizardPage);
                        this.set('isWizardPage', isWizardPage);
                    },
                    'onShow': function(params) {
                        this.setIsWizardPage(params && params.isWizardPage);
                    },
                    'onGoToDashboard': function() {
                        app.views.dashboard.navigateTo();
                    },
                    'onGoToNextStep': function() {
                        var that = this;                    
                        this.save()
                            .done(function() {
                                if (that.nextStep) {
                                    that.nextStep.navigateTo({ 'isWizardPage': that.isWizardPage });
                                } else {
                                    app.views.dashboard.navigateTo();
                                }
                            });
                    },
                    'onSave': function() {
                        this.save()
                            .done(function() {
                                app.views.naigateBack();
                            });
                    },
                    'save': function() {
                        var deferred = new $.Deferred();
                        deferred.resolve();
                        return deferred.promise();
                    }
                });
    
    var MainViewModel = ProfileViewModel
        .extend({
                    'nextStep': app.views.profileBiometrics,
                    'load': function(profile) {
                        var that = this;
            
                        var birthDate = kendo.parseDate(profile.birthDate);
                        that.set('birthDate', kendo.toString(birthDate, birthDateFormat));
                        that.set('height', profile.height);
                        that.set('sex', profile.sex);
                    },
                    'save': function() {
                        var that = this;
                        
                        var profile = {
                            'birthDate': kendo.parseDate(that.birthDate, birthDateFormat),
                            'height': that.height,
                            'sex': that.sex
                        };
                        
                        saveToCache(profile);
                        
                        that.busyContent = "Saving profile data...";
                        
                        var saveProfileData = updateProfile(profile);
                        that.waitForResult(saveProfileData);
                        return saveProfileData;
                    }
                });

    var BiometricsViewModel = ProfileViewModel
        .extend({
                    'nextStep': app.views.profileGoals,
                    'init': function() {
                        app.ViewModelBase.fn.init.call(this);
                        var that = this;
                        this.bind("change", function(e) {                            
                            if (e.field !== "bodyFat") {
                                that.calculateBodyFat();
                            }
                        });
                    },
                    'isHipsFieldVisible': false,
                    'load': function(biometrics) {
                        var that = this;

                        that.set('weight', biometrics.weight);
                        that.set('neck', biometrics.neck);
                        that.set('waist', biometrics.waist);
                        that.set('hips', biometrics.hips);
                    },
                    'save': function() {
                        var that = this;
                        
                        var biometrics = {                
                            'weight': that.weight,
                            'neck': that.neck,
                            'waist': that.waist,
                            'hips': that.hips,
                            'bodyFat' : that.bodyFat
                        };
                        
                        saveToCache(biometrics);
                        
                        that.busyContent = "Saving biometrics data...";
                        
                        var saveBiometricsData = updateBiometrics(biometrics);
                        that.waitForResult(saveBiometricsData);
                        return saveBiometricsData;
                    },
                    'calculateBodyFat': function() {
                        var that = this,
                            bodyFat = 0;
                                                
                        // Formula taken from here http://www.wikihow.com/Measure-Body-Fat-Using-the-US-Navy-Method
                        var height = app.profileService.mainViewModel.height;
                        if (that.sex === "Female") {
                            bodyFat = 163.205 * log10(that.waist + that.hips - that.neck) - 97.684 * log10(height) - 104.912;
                        } else {
                            bodyFat = 86.010 * log10(that.waist - that.neck) - 70.041 * log10(height) + 30.30;
                        }
                        
                        that.set('bodyFat', Math.round(bodyFat * 100) / 100);
                    }
                });
    
    var GoalsViewModel = ProfileViewModel
        .extend({
                    'nextStep': app.views.programOverview,
                    'initGoals': function(goals) {
                        var that = this;
                        
                        var goalViewModels = [];
                        var goToNext = function() {
                            that.onGoToNextStep();
                        };
                        $.each(goals, function(i, goal) {
                            goalViewModels
                                .push({
                                          'tags': goal.tags,
                                          'description': goal.description,
                                          'onTap': function() {
                                              that.setGoal(goal).done(goToNext);
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
                        
                        saveToCache(profile);
                        
                        that.busyContent = "Saving profile data...";
                        
                        var saveProfileData = updateProfile(profile);
                        that.waitForResult(saveProfileData);
                        return saveProfileData;
                    }
                });

    var PreferencesViewModel = ProfileViewModel
        .extend({
                });
    
    var ProgramOverviewViewModel = ProfileViewModel
        .extend({
                });

    app.profileService = {
        'mainViewModel': new MainViewModel(),
        'biometricsViewModel': new BiometricsViewModel(),
        'goalsViewModel': new GoalsViewModel(),
        'preferencesViewModel': new PreferencesViewModel(),
        'overviewViewModel': new ProgramOverviewViewModel(),
        'initializeUserProfile': function (viewModel) {
            var initalizeUser = getProfile().done(function (profile) {
                app.profileService.profile = profile;
                app.profileService.mainViewModel.load(profile);
                
                // TODO: Consider opening the biometrics view as well.
                if (!profile.birthDate || !profile.height || !profile.sex) {
                    app.views.profileMain.navigateTo({ 'isWizardPage': true });
                } else if (!profile.goal) {
                    app.views.profileGoals.navigateTo({ 'isWizardPage': true });
                } else {
                    app.views.dashboard.navigateTo();
                }
            }).fail(function (err) {
                viewModel.set('hasErrors', true);
                viewModel.set('errorHeader', "Error loading profile: " + err.statusText);
                viewModel.set('errorText', err.responseText);
            });

            viewModel.busyContent = "Loading user profile...";
            viewModel.waitForResult(initalizeUser);
        },
        'mainViewShow': function (e) {
            var viewModel = app.profileService.mainViewModel;
            viewModel.onShow(e.view.params);
        },
        'biometricsViewShow': function (e) {
            var viewModel = app.profileService.biometricsViewModel;
            viewModel.onShow(e.view.params);
            viewModel.set("isHipsFieldVisible", app.profileService.profile.sex === "Female");
            
            viewModel.busyContent = "Loading biometrics data...";
            viewModel.waitForResult(getBiometrics().done(function(r) {
                viewModel.load(r);
            }));
        },
        'goalsViewShow': function (e) {
            var viewModel = app.profileService.goalsViewModel;
            viewModel.onShow(e.view.params);
        },
        'preferencesViewShow': function (e) {
            var viewModel = app.profileService.preferencesViewModel;
            viewModel.onShow(e.view.params);
        },
        'overviewViewShow': function (e) {
            var viewModel = app.profileService.overviewViewModel;
            viewModel.onShow(e.view.params);
        },
        'goalsViewInit': function () {
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