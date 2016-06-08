(function(angular, factory) {
	'use strict';

	/* istanbul ignore if */
	if (typeof define === 'function' && /* istanbul ignore next */ define.amd) {
		define(['angular'], function(angular) {
			return factory(angular);
		});
	} else {
		return factory(angular);
	}
}(window.angular || /* istanbul ignore next */ null, function(angular) {
