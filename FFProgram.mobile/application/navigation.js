(function (global) {
    var DrawerViewModel,
        app = global.app = global.app || {};
    
    var PageDesciption = function (title, url) {
        this.title = title;
        this.url = url;
        this.getUri = function () {
    		return url;  
        };
		this.navigateTo = function () {
			app.application.navigate(url);
		}
	};
    
	app.views = {
		login: new PageDesciption("Login", "views/login-view.html"),
		register: new PageDesciption("Register", "views/register-view.html"),
		dashboard: new PageDesciption("Dashboard", "views/dashboard-view.html"),
        programOverview: new PageDesciption("Overview", "views/program-overview-view.html"),
		profileMain: new PageDesciption("Profile main", "views/profile/profile-main.html"),
        profileBiometrics: new PageDesciption("Biometrics", "views/profile/profile-biometrics.html"),
        profileGoals: new PageDesciption("Goals", "views/profile/profile-goals.html"),
		profilePreferences: new PageDesciption("Preferences", "views/profile/profile-preferences.html"),
		about: new PageDesciption("About", "views/about-view.html"),
		settings: new PageDesciption("Settings", "views/settings-view.html")
	}
    
    app.navigationViews = [app.views.dashboard,
    						app.views.profileBiometrics,
    						app.views.programOverview, 
    						app.views.about,
    						app.views.settings];
    
    DrawerViewModel = app.ViewModelBase
        .extend({
                    'init': function() {
                        app.ViewModelBase.fn.init.call(this);
                        var that = this;
                        
                        var viewsList = [];
                        $.each(app.navigationViews, function(i, v) {
                            viewsList.push({
                                'name': v.title,
                                'url': v.url
                            });
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
            e.preventDefault();
        }
    };
})(window);