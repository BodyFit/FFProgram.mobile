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

			return data.defaultClient.buildRequest().addToRoute("api").addToRoute("users").post(user);
		},
		'getUser': function (id) {
			return data.defaultClient.buildRequest().addToRoute("api").addToRoute("users").addToRoute(id).get();
		},
		'authenticate': function (email, password) {
			var user = {
				'username': email,
				'password': password
			}
			return data.defaultClient
						.buildRequest()
						.addToRoute("auth")
						.post(user)
						.done(function (data) {
							var authHeader = {
								'Authorization': "Bearer " + data.Result.access_token
							};
							app.data.defaultClient.setHeader(authHeader);
						})
		}
	};
})(window);