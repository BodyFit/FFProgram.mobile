(function (global) {
	var app = global.app = global.app || {};

	var PageDesciption = function (uri) {
        this.getUri = function () {
    		return uri;  
        };
		this.navigateTo = function () {
			app.application.navigate(uri);
		}
	};
	app.views = {
		home: new PageDesciption("home-view"),
		login: new PageDesciption("views/login-view.html"),
		register: new PageDesciption("views/register-view.html"),
		dashboard: new PageDesciption("views/dashboard-view.html"),
		profileWizard: new PageDesciption("views/profile/profile-wizard.html"),
		profileConfig: new PageDesciption("views/profile/profile-view.html"),
		about: new PageDesciption("views/about-view.html"),
		settings: new PageDesciption("views/settings-view.html")
	}
}(window));