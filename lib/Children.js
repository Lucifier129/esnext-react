'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.only = only;
exports.forEach = forEach;
exports.map = map;
exports.count = count;
exports.toArray = toArray;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

var _createElement = require('./createElement');

function only(children) {
	if ((0, _createElement.isValidElement)(children)) {
		return children;
	}
	throw new Error('expect only one child');
}

function forEach(children, iteratee, context) {
	if (children == null) {
		return children;
	}
	var index = 0;
	if (_.isArr(children)) {
		_.flatEach(children, function (child) {
			// from traverseAllChildrenImpl in react
			var type = typeof child;
			if (type === 'undefined' || type === 'boolean') {
				// All of the above are perceived as null.
				child = null;
			}

			iteratee.call(context, child, index++);
		});
	} else {
		// from traverseAllChildrenImpl in react
		var type = typeof children;
		if (type === 'undefined' || type === 'boolean') {
			// All of the above are perceived as null.
			children = null;
		}
		iteratee.call(context, children, index);
	}
}

function map(children, iteratee, context) {
	if (children == null) {
		return children;
	}
	var store = [];
	var keyMap = {};
	forEach(children, function (child, index) {
		var data = {};
		data.child = iteratee.call(context, child, index) || child;
		data.isEqual = data.child === child;
		var key = data.key = getKey(child, index);
		if (keyMap.hasOwnProperty(key)) {
			keyMap[key] += 1;
		} else {
			keyMap[key] = 0;
		}
		data.index = keyMap[key];
		_.addItem(store, data);
	});
	var result = [];
	store.forEach(function (_ref) {
		var child = _ref.child;
		var key = _ref.key;
		var index = _ref.index;
		var isEqual = _ref.isEqual;

		if (child == null || typeof child === 'boolean') {
			return;
		}
		if (!(0, _createElement.isValidElement)(child) || key == null) {
			_.addItem(result, child);
			return;
		}
		if (keyMap[key] !== 0) {
			key += ':' + index;
		}
		if (!isEqual) {
			key = escapeUserProvidedKey(child.key || '') + '/' + key;
		}
		child = (0, _createElement.cloneElement)(child, { key: key });
		_.addItem(result, child);
	});
	return result;
}

function count(children) {
	var count = 0;
	forEach(children, function () {
		count++;
	});
	return count;
}

function toArray(children) {
	return map(children, _.identity) || [];
}

function getKey(child, index) {
	var key = undefined;
	if ((0, _createElement.isValidElement)(child) && typeof child.key === 'string') {
		key = '.$' + child.key;
	} else {
		key = '.' + index.toString(36);
	}
	return key;
}

var userProvidedKeyEscapeRegex = /\/(?!\/)/g;
function escapeUserProvidedKey(text) {
	return ('' + text).replace(userProvidedKeyEscapeRegex, '//');
}