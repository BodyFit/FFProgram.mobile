(function (global) {
    var app = global.app = global.app || {};

   var WizardPageViewModel = app.ViewModelBase
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
    
    app.WizardPageViewModel = WizardPageViewModel;
})(window);