sap.ui.define([], function () {
	"use strict";
	return {
		dateFormatter: function (date) {
			return new Date(date.slice(0, 4) + "/" + date.slice(4, 6) + "/" + date.slice(6, 8)).toDateString();
		},
		statusFormatter: function (state) {
			var status;
			if (state === "A") {
				status = "Accepted";
			} else {
				status = "Declined";
			}
			return status;
		}
	};
});
