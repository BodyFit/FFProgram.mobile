(function (global) {
	var app = global.app = global.app || {},
		data = app.data = app.data || {};

	data.users = {
		'registerUser': function (email, password) {
			var user = {
				'Username': email,
				'Password': password,
				'DisplayName': email,
				'Email': email
			};

			return data.defaultClient.buildRequest().addToRoute("users").post(user);
		},
		'getUser': function (id) {
			return data.defaultClient.buildRequest().addToRoute("users").addToRoute(id).get();
		},
		'authenticate': function (email, password) {
			//return data.defaultClient.buildRequest().addToRoute("users")
		}
	};
})(window);