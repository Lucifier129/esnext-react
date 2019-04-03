'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports.render = render;
exports.unstable_renderSubtreeIntoContainer = unstable_renderSubtreeIntoContainer;
exports.unmountComponentAtNode = unmountComponentAtNode;
exports.findDOMNode = findDOMNode;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

var _constant = require('./constant');

var _virtualDom = require('./virtual-dom');

var _Component = require('./Component');

function isValidContainer(node) {
	return !!(node && (node.nodeType === _constant.ELEMENT_NODE_TYPE || node.nodeType === _constant.DOC_NODE_TYPE || node.nodeType === _constant.DOCUMENT_FRAGMENT_NODE_TYPE));
}

var pendingRendering = {};
var vnodeStore = {};
function renderTreeIntoContainer(vnode, container, callback, parentContext) {
	if (!vnode.vtype) {
		throw new Error('cannot render ' + vnode + ' to container');
	}
	if (!isValidContainer(container)) {
		throw new Error('container ' + container + ' is not a DOM element');
	}
	var id = container[_constant.COMPONENT_ID] || (container[_constant.COMPONENT_ID] = _.getUid());
	var argsCache = pendingRendering[id];

	// component lify cycle method maybe call root rendering
	// should bundle them and render by only one time
	if (argsCache) {
		if (argsCache === true) {
			pendingRendering[id] = argsCache = { vnode: vnode, callback: callback, parentContext: parentContext };
		} else {
			argsCache.vnode = vnode;
			argsCache.parentContext = parentContext;
			argsCache.callback = argsCache.callback ? _.pipe(argsCache.callback, callback) : callback;
		}
		return;
	}

	pendingRendering[id] = true;
	var oldVnode = null;
	var rootNode = null;
	if (oldVnode = vnodeStore[id]) {
		rootNode = (0, _virtualDom.compareTwoVnodes)(oldVnode, vnode, container.firstChild, parentContext);
	} else {
		rootNode = (0, _virtualDom.initVnode)(vnode, parentContext, container.namespaceURI);
		var childNode = null;
		while (childNode = container.lastChild) {
			container.removeChild(childNode);
		}
		container.appendChild(rootNode);
	}
	vnodeStore[id] = vnode;
	var isPending = _Component.updateQueue.isPending;
	_Component.updateQueue.isPending = true;
	(0, _virtualDom.clearPending)();
	argsCache = pendingRendering[id];
	delete pendingRendering[id];

	var result = null;
	if (typeof argsCache === 'object') {
		result = renderTreeIntoContainer(argsCache.vnode, container, argsCache.callback, argsCache.parentContext);
	} else if (vnode.vtype === _constant.VELEMENT) {
		result = rootNode;
	} else if (vnode.vtype === _constant.VCOMPONENT) {
		result = rootNode.cache[vnode.uid];
	}

	if (!isPending) {
		_Component.updateQueue.isPending = false;
		_Component.updateQueue.batchUpdate();
	}

	if (callback) {
		callback.call(result);
	}

	return result;
}

function render(vnode, container, callback) {
	return renderTreeIntoContainer(vnode, container, callback);
}

function unstable_renderSubtreeIntoContainer(parentComponent, subVnode, container, callback) {
	var context = parentComponent.$cache.parentContext;
	return renderTreeIntoContainer(subVnode, container, callback, context);
}

function unmountComponentAtNode(container) {
	if (!container.nodeName) {
		throw new Error('expect node');
	}
	var id = container[_constant.COMPONENT_ID];
	var vnode = null;
	if (vnode = vnodeStore[id]) {
		(0, _virtualDom.destroyVnode)(vnode, container.firstChild);
		container.removeChild(container.firstChild);
		delete vnodeStore[id];
		return true;
	}
	return false;
}

function findDOMNode(node) {
	if (node == null) {
		return null;
	}
	if (node.nodeName) {
		return node;
	}
	var component = node;
	// if component.node equal to false, component must be unmounted
	if (component.getDOMNode && component.$cache.isMounted) {
		return component.getDOMNode();
	}
	throw new Error('findDOMNode can not find Node');
}