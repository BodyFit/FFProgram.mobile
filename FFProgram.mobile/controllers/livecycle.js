(function (global) {
    var app = global.app = global.app || {},
        data = app.data = app.data || {};
    
    var initAuthorization = function() {
        if (data.dataStore.authorizationToken) {
            var authHeader = {
                'Authorization': "Bearer " + data.dataStore.authorizationToken
            };
            app.data.defaultClient.setHeader(authHeader);
            return true;
        }
        return false;
    };
    
    var login = function() {
        if (initAuthorization()) {
            var loginPromise = new $.Deferred();
            loginPromise.resolve();
            return loginPromise.promise();
        }
        
        app.views.login.navigateTo();
        
        return app.loginService
            .login()
            .done(function(token) {
                data.dataStore.authorizationToken = token;
                initAuthorization();
            });
    };
    
    var track = function(promise, loadingMessage, errorPattern) {
        promise.fail(function (err) {
            //viewModel.set('hasErrors', true);
            //viewModel.set('errorHeader', "Error loading profile: " + err.statusText);
            //viewModel.set('errorText', err.responseText);
        });
            
        app.application.changeLoadingMessage(loadingMessage);
        app.application.showLoading();

        promise.always(function () {
            app.application.hideLoading();
        });
    };
    
    var init = function() {
        var loginPrmise = login();
        
        var initProfilePrmise = loginPrmise.then(app.profileService.initializeUserProfile);
        
        initProfilePrmise.done(function(profile) {
            // TODO: Consider opening the biometrics view as well.
            if (!profile.birthDate || !profile.height || !profile.sex) {
                app.views.profileMain.navigateTo({ 'isWizardPage': true });
            } else if (!profile.goal) {
                app.views.profileGoals.navigateTo({ 'isWizardPage': true });
            } else {
                app.views.dashboard.navigateTo();
            }
        });
    };
    
    app.livecycle = {
        'bootstrap': function() {
            init();
            // TODO: Hook to varios events and respond to them.
        },
        'track': track
    };
})(window);