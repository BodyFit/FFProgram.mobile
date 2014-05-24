(function (global) {
	var app = global.app = global.app || {},
		data = app.data = app.data || {};

	var RouteEntry = function (name, value) {
		this.name = name;
		this.value = value;
	}

	RouteEntry.prototype = {
		'toString': function () {
			return [this.name, encodeURIComponent(this.value)].join("=");
		}
	}

	var RequestBuilder = function (base) {
		this.base = base;
		this.routeEntries = [];
		this.queryParams = [];
	}

	RequestBuilder.prototype = {
		'addToRoute': function (param) {
			this.routeEntries.push(param);
			return this;
		},
		'addToQuery': function (name, value) {
			this.queryParams.push(new RouteEntry(name, value));
			return this;
		},
		'getUri': function () {
			var uri = this.base;
			for (var i in this.routeEntries) {
				uri += ['/', encodeURIComponent(this.routeEntries[i])].join("");
			}

			if (this.queryParams.length > 0) {
				uri += '?' + this.queryParams.join('&');
			}

			return uri;
		}
	};

	data.RequestBuilder = RequestBuilder;
})(window);