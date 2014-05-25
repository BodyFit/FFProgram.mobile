(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();

        app.application = new kendo.mobile.Application(document.body, { layout: "mobile-view", transition: "slide", skin: 'flat', initial: app.views.dashboard.getUri() });
        app.views.login.navigateTo();
        
        // Load mocked up profile screen.
        //app.views.profileWizard.navigateTo();
        //app.profileService.viewModel.loadProfile({
        //    'birthDate': '2000-02-12',
        //    'height': 170,
        //    'sex': 'Female',
            
        //    'weight': 52,
        //    'neck': 30,
        //    'waist': 60,
        //    'hips': 85
        //});
    }, false);
})(window);