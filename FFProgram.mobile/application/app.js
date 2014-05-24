(function (global) {
    var app = global.app = global.app || {};

    document.addEventListener('deviceready', function () {
        navigator.splashscreen.hide();

        app.application = new kendo.mobile.Application(document.body, { layout: "mobile-view", transition: "slide" });
        app.views.login.navigateTo();
    }, false);
})(window);