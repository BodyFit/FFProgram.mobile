(function (global) {
	var ViewModelBase,
		app = global.app = global.app || {};

	ViewModelBase = kendo.data.ObservableObject.extend({
		errorHeader: "",
		errorText: "",
		hasErrors: false,
		busyContent: "Loading...",
		clearErrors: function () {
			this.set("hasErrors", false);
			this.set("errorHeader", "");
			this.set("errorText", "");
		},
		waitForResult: function (promise) {
			var that = this;

			app.application.changeLoadingMessage(that.busyContent);
			app.application.showLoading();

			promise.done(function () {
				that.clearErrors();
			})

			.always(function () {
				app.application.hideLoading();
			});
		}
	});

	app.ViewModelBase = ViewModelBase;
})(window);