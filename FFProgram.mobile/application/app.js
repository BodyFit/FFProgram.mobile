(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();

        app.application = new kendo.mobile.Application(document.body, { layout: "mobile-view", transition: "slide", skin: 'flat' });
        
        app.livecycle.bootstrap();
        // Load mocked up profile screen.
        //app.views.profileWizard.navigateTo();
        //app.profileService.biometricsViewModel.loadProfile({
        //    'birthDate': '2000-02-12',
        //    'height': 170,
        //    'sex': 'Female',
            
        //    'weight': 52,
        //    'neck': 30,
        //    'waist': 60,
        //    'hips': 85
        //});
        
        //app.views.profileGoals.navigateTo();
        //app.profileService.goalsViewModel
        //    .initGoals([{
        //            "tags": ["preserve", "decrease", "training"],
        //            "description": "Понижаване на теглото с максимално запазване на мускулната маса с тренировки."
        //        }, {
        //            "tags": ["preserve", "healthy", "muscles", "spas"],
        //            "description": "Понижаване на теглото с максимално запазване на мускулната маса с тренировки."
        //        }, {
        //            "tags": ["preserve", "healthy", "muscles", "spas"],
        //            "description": "Понижаване на теглото с максимално запазване на мускулната маса с тренировки."
        //        }, {
        //            "tags": ["preserve", "healthy", "muscles", "spas"],
        //            "description": "Понижаване на теглото с максимално запазване на мускулната маса с тренировки."
        //        }
        //               ]);
    }, false);
})(window);