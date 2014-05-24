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
		this.defaultHeaders = {};
	}

	HTTPClient.prototype = {
		'setHeader': function (headers) {
			var that = this;
			$.each(headers, function (key, value) {
				that.defaultHeaders[key] = value;
			})
		},
		'buildRequest': function () {
			return new ClientRequestContext(this);
		},
		'executeRequest': function (method, uri, data) {
			var that = this;
			var request = {
				'beforeSend': function (r)
				{
					$.each(that.defaultHeaders, function (key, value) {
						r.setRequestHeader(key, value);
					})
				},
				'type': method,
				'dataType': this.dataType,
				'url': uri
			};
		    
		    if (data) {
		    	request.data = JSON.stringify(data);
		    	request.contentType = "application/json";
		    }
			return $.ajax(request);
		}
	}

	data.HTTPClient = HTTPClient;
})(window);