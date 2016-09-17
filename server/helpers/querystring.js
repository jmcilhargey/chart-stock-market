"use strict";

module.exports = function(object) {

	if (typeof object === "object" && object !== null) {

		return Object.keys(object).map(function(key) {

			var string = encodeURIComponent(key) + "=";

			if (Array.isArray(object[key])) {
				return object[key].map(function(element) {
					return string + encodeURIComponent(element);
				}).join("&");

			} else {
				return string + encodeURIComponent(object[key]);
			}
		}).join("&");
	}
}
