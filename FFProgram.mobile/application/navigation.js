(function (global) {
    var DrawerViewModel,
        app = global.app = global.app || {};
    
    var PageDesciption = function (url, title, icon) {
        this.title = title;
        this.url = url;
        this.icon = icon;
        
        this.getUri = function () {
    		return url;  
        };
		this.navigateTo = function () {
			app.application.navigate(url);
		}
	};
    
	app.views = {
		login: new PageDesciption("views/login-view.html", "Login"),
		register: new PageDesciption("views/register-view.html", "Register"),
		dashboard: new PageDesciption("views/dashboard-view.html", "Dashboard", "tiles"),
        programOverview: new PageDesciption("views/program-overview-view.html", "Overview", "eye"),
		profileMain: new PageDesciption("views/profile/profile-main.html", "Profile main"),
        profileBiometrics: new PageDesciption("views/profile/profile-biometrics.html", "Biometrics", "bars"),
        profileGoals: new PageDesciption("views/profile/profile-goals.html", "Goals"),
		profilePreferences: new PageDesciption("views/profile/profile-preferences.html", "Preferences", "half-heart"),
		about: new PageDesciption("views/about-view.html", "About", "about"),
		settings: new PageDesciption("views/settings-view.html", "Settings", "settings")
	}
    
    app.navigationViews = [app.views.dashboard,    						
    						app.views.programOverview,
    						app.views.profileBiometrics,
    						app.views.profilePreferences,
    						app.views.about,
    						app.views.settings];
    
    DrawerViewModel = app.ViewModelBase
        .extend({
                    'init': function() {
                        app.ViewModelBase.fn.init.call(this);
                        var that = this;
                        
                        var viewsList = [];
                        $.each(app.navigationViews, function(i, v) {
                            viewsList.push(v);
                        });
                        
                        that.set('views', viewsList);
                    }
                });

    app.navigationService = {
        drawerViewModel: new DrawerViewModel(),
        beforeShowDrawer: function(e) {
            var currentView = app.application.view().id;
            var views = app.navigationService.drawerViewModel.views;
            for (var i in views) {
                if (views[i].url === currentView) {
                    return;
                }
            }
//            e.preventDefault();
        }
    };
})(window);