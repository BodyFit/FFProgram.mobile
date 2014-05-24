(function (global) {
	var app = global.app = global.app || {},
		data = app.data = app.data || {};

	data.defaultClient = new app.data.HTTPClient("http://pure-mountain-4037.herokuapp.com/api", "json");
})(window);