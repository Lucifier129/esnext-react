'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = createElement;
exports.isValidElement = isValidElement;
exports.cloneElement = cloneElement;
exports.createFactory = createFactory;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

var _constant = require('./constant');

var _virtualDom = require('./virtual-dom');

function createElement(type, props, children) {
	var vtype = null;
	if (typeof type === 'string') {
		vtype = _constant.VELEMENT;
	} else if (typeof type === 'function') {
		if (type.prototype && type.prototype.isReactComponent) {
			vtype = _constant.VCOMPONENT;
		} else {
			vtype = _constant.VSTATELESS;
		}
	} else {
		throw new Error('React.createElement: unexpect type [ ' + type + ' ]');
	}

	var key = null;
	var ref = null;
	var finalProps = {};
	if (props != null) {
		for (var propKey in props) {
			if (!props.hasOwnProperty(propKey)) {
				continue;
			}
			if (propKey === 'key') {
				if (props.key !== undefined) {
					key = '' + props.key;
				}
			} else if (propKey === 'ref') {
				if (props.ref !== undefined) {
					ref = props.ref;
				}
			} else {
				finalProps[propKey] = props[propKey];
			}
		}
	}

	var defaultProps = type.defaultProps;

	if (defaultProps) {
		for (var propKey in defaultProps) {
			if (finalProps[propKey] === undefined) {
				finalProps[propKey] = defaultProps[propKey];
			}
		}
	}

	var argsLen = arguments.length;
	var finalChildren = children;

	if (argsLen > 3) {
		finalChildren = Array(argsLen - 2);
		for (var i = 2; i < argsLen; i++) {
			finalChildren[i - 2] = arguments[i];
		}
	}

	if (finalChildren !== undefined) {
		finalProps.children = finalChildren;
	}

	return (0, _virtualDom.createVnode)(vtype, type, finalProps, key, ref);
}

function isValidElement(obj) {
	return obj != null && !!obj.vtype;
}

function cloneElement(originElem, props) {
	var type = originElem.type;
	var key = originElem.key;
	var ref = originElem.ref;

	var newProps = _.extend(_.extend({ key: key, ref: ref }, originElem.props), props);

	for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
		children[_key - 2] = arguments[_key];
	}

	var vnode = createElement.apply(undefined, [type, newProps].concat(children));
	if (vnode.ref === originElem.ref) {
		vnode.refs = originElem.refs;
	}
	return vnode;
}

function createFactory(type) {
	var factory = function factory() {
		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			args[_key2] = arguments[_key2];
		}

		return createElement.apply(undefined, [type].concat(args));
	};
	factory.type = type;
	return factory;
}