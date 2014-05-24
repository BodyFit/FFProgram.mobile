(function (global) {
	var app = global.app = global.app || {},
		data = app.data = app.data || {};

	var ClientRequestContext = function(client) {
		this.client = client;
		this.builder = new data.RequestBuilder(client.root);
	}

	ClientRequestContext.prototype = {
		'addToRoute': function (param) {
			this.builder.addToRoute(param);
			return this;
		},
		'addToQuery': function (name, value) {
			this.builder.addToQuery(name, value);
			return this;
		},
		'get': function () {
			return this.client.executeRequest("GET", this.builder.getUri());
		},
		'post': function (data) {
			return this.client.executeRequest("POST", this.builder.getUri(), data);
		},
		'put': function (data) {
			return this.client.executeRequest("PUT", this.builder.getUri(), data);
		},
		'delete': function () {
			return this.client.executeRequest("DELETE", this.builder.getUri());
		}
	}

	var HTTPClient = function (root, dataType) {
		this.root = root;
		this.dataType = dataType;
	}

	HTTPClient.prototype = {
		'buildRequest': function () {
			return new ClientRequestContext(this);
		},
		'executeRequest': function (method, uri, data) {
		    var request = {
				'type': method,
				'dataType': this.dataType,
				'url': uri
			};
		    
		    if (data) {
		        request.data = data;
		    }
			return $.ajax(request);
		}
	}

	data.HTTPClient = HTTPClient;
})(window);