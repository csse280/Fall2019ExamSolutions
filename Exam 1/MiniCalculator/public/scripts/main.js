/**
 * @fileoverview
 * Provides interactions for all pages in the UI.
 *
 * @author David Fisher
 */

/** namespace. */
var rh = rh || {};

/** globals */
rh.value = 0;

rh.enableClickListeners = function() {
	$(".calc-btn").click((event) => {
		const buttonValue = $(event.target).data("id");
		rh.value = rh.value * 10 + buttonValue;
		rh.updateDisplay();
	});
	$("#double-btn").click(() => {
		rh.value *= 2;
		rh.updateDisplay();
	});
	$("#clear-btn").click(() => {
		rh.value = 0;
		rh.updateDisplay();
	});
};

rh.updateDisplay = function () {
	$("#display").html(rh.value);
};



/* Main */
$(document).ready(() => {
	console.log("Ready");
	rh.enableClickListeners();
	rh.updateDisplay();
});
