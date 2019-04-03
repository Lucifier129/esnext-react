'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.createVnode = createVnode;
exports.initVnode = initVnode;
exports.destroyVnode = destroyVnode;
exports.renderComponent = renderComponent;
exports.getChildContext = getChildContext;
exports.clearPending = clearPending;
exports.compareTwoVnodes = compareTwoVnodes;
exports.syncCache = syncCache;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

var _constant = require('./constant');

/**
 * current stateful component's refs property
 * will attach to every vnode created by calling component.render method
 */
var refs = null;

function createVnode(vtype, type, props, key, ref) {
    var vnode = {
        vtype: vtype,
        type: type,
        props: props,
        refs: refs,
        key: key,
        ref: ref
    };
    if (vtype === _constant.VSTATELESS || vtype === _constant.VCOMPONENT) {
        vnode.uid = _.getUid();
    }
    return vnode;
}

function initVnode(vnode, parentContext, namespaceURI) {
    var vtype = vnode.vtype;

    var node = null;
    if (!vtype) {
        // init text
        node = document.createTextNode(vnode);
    } else if (vtype === _constant.VELEMENT) {
        // init element
        node = initVelem(vnode, parentContext, namespaceURI);
    } else if (vtype === _constant.VCOMPONENT) {
        // init stateful component
        node = initVcomponent(vnode, parentContext, namespaceURI);
    } else if (vtype === _constant.VSTATELESS) {
        // init stateless component
        node = initVstateless(vnode, parentContext, namespaceURI);
    } else if (vtype === _constant.VCOMMENT) {
        // init comment
        node = document.createComment('react-text: ' + (vnode.uid || _.getUid()));
    }
    return node;
}

function updateVnode(vnode, newVnode, node, parentContext) {
    var vtype = vnode.vtype;

    if (vtype === _constant.VCOMPONENT) {
        return updateVcomponent(vnode, newVnode, node, parentContext);
    }

    if (vtype === _constant.VSTATELESS) {
        return updateVstateless(vnode, newVnode, node, parentContext);
    }

    // ignore VCOMMENT and other vtypes
    if (vtype !== _constant.VELEMENT) {
        return node;
    }

    var oldHtml = vnode.props[_constant.HTML_KEY] && vnode.props[_constant.HTML_KEY].__html;
    if (oldHtml != null) {
        updateVelem(vnode, newVnode, node, parentContext);
        initVchildren(newVnode, node, parentContext);
    } else {
        updateVChildren(vnode, newVnode, node, parentContext);
        updateVelem(vnode, newVnode, node, parentContext);
    }
    return node;
}

function updateVChildren(vnode, newVnode, node, parentContext) {
    var patches = {
        removes: [],
        updates: [],
        creates: []
    };
    diffVchildren(patches, vnode, newVnode, node, parentContext);
    _.flatEach(patches.removes, applyDestroy);
    _.flatEach(patches.updates, applyUpdate);
    _.flatEach(patches.creates, applyCreate);
}

function applyUpdate(data) {
    if (!data) {
        return;
    }
    var vnode = data.vnode;
    var newNode = data.node;

    // update
    if (!data.shouldIgnore) {
        if (!vnode.vtype) {
            newNode.replaceData(0, newNode.length, data.newVnode);
        } else if (vnode.vtype === _constant.VELEMENT) {
            updateVelem(vnode, data.newVnode, newNode, data.parentContext);
        } else if (vnode.vtype === _constant.VSTATELESS) {
            newNode = updateVstateless(vnode, data.newVnode, newNode, data.parentContext);
        } else if (vnode.vtype === _constant.VCOMPONENT) {
            newNode = updateVcomponent(vnode, data.newVnode, newNode, data.parentContext);
        }
    }

    // re-order
    var currentNode = newNode.parentNode.childNodes[data.index];
    if (currentNode !== newNode) {
        newNode.parentNode.insertBefore(newNode, currentNode);
    }
    return newNode;
}

function applyDestroy(data) {
    destroyVnode(data.vnode, data.node);
    data.node.parentNode.removeChild(data.node);
}

function applyCreate(data) {
    var node = initVnode(data.vnode, data.parentContext, data.parentNode.namespaceURI);
    data.parentNode.insertBefore(node, data.parentNode.childNodes[data.index]);
}

/**
 * Only vnode which has props.children need to call destroy function
 * to check whether subTree has component that need to call lify-cycle method and release cache.
 */

function destroyVnode(vnode, node) {
    var vtype = vnode.vtype;

    if (vtype === _constant.VELEMENT) {
        // destroy element
        destroyVelem(vnode, node);
    } else if (vtype === _constant.VCOMPONENT) {
        // destroy state component
        destroyVcomponent(vnode, node);
    } else if (vtype === _constant.VSTATELESS) {
        // destroy stateless component
        destroyVstateless(vnode, node);
    }
}

function initVelem(velem, parentContext, namespaceURI) {
    var type = velem.type;
    var props = velem.props;

    var node = null;

    if (type === 'svg' || namespaceURI === _constant.SVGNamespaceURI) {
        node = document.createElementNS(_constant.SVGNamespaceURI, type);
        namespaceURI = _constant.SVGNamespaceURI;
    } else {
        node = document.createElement(type);
    }

    initVchildren(velem, node, parentContext);

    var isCustomComponent = type.indexOf('-') >= 0 || props.is != null;
    _.setProps(node, props, isCustomComponent);

    if (velem.ref != null) {
        _.addItem(pendingRefs, velem);
        _.addItem(pendingRefs, node);
    }

    return node;
}

function initVchildren(velem, node, parentContext) {
    var vchildren = node.vchildren = getFlattenChildren(velem);
    var namespaceURI = node.namespaceURI;
    for (var i = 0, len = vchildren.length; i < len; i++) {
        node.appendChild(initVnode(vchildren[i], parentContext, namespaceURI));
    }
}

function getFlattenChildren(vnode) {
    var children = vnode.props.children;

    var vchildren = [];
    if (_.isArr(children)) {
        _.flatEach(children, collectChild, vchildren);
    } else {
        collectChild(children, vchildren);
    }
    return vchildren;
}

function collectChild(child, children) {
    if (child != null && typeof child !== 'boolean') {
        if (!child.vtype) {
            // convert immutablejs data
            if (child.toJS) {
                child = child.toJS();
                if (_.isArr(child)) {
                    _.flatEach(child, collectChild, children);
                } else {
                    collectChild(child, children);
                }
                return;
            }
            child = '' + child;
        }
        children[children.length] = child;
    }
}

function diffVchildren(patches, vnode, newVnode, node, parentContext) {
    if (!node.vchildren) return; // react-lite hasn't seen this DOM node before

    var childNodes = node.childNodes;
    var vchildren = node.vchildren;

    var newVchildren = node.vchildren = getFlattenChildren(newVnode);
    var vchildrenLen = vchildren.length;
    var newVchildrenLen = newVchildren.length;

    if (vchildrenLen === 0) {
        if (newVchildrenLen > 0) {
            for (var i = 0; i < newVchildrenLen; i++) {
                _.addItem(patches.creates, {
                    vnode: newVchildren[i],
                    parentNode: node,
                    parentContext: parentContext,
                    index: i
                });
            }
        }
        return;
    } else if (newVchildrenLen === 0) {
        for (var i = 0; i < vchildrenLen; i++) {
            _.addItem(patches.removes, {
                vnode: vchildren[i],
                node: childNodes[i]
            });
        }
        return;
    }

    var updates = Array(newVchildrenLen);
    var removes = null;
    var creates = null;

    // isEqual
    for (var i = 0; i < vchildrenLen; i++) {
        var _vnode = vchildren[i];
        for (var j = 0; j < newVchildrenLen; j++) {
            if (updates[j]) {
                continue;
            }
            var _newVnode = newVchildren[j];
            if (_vnode === _newVnode) {
                var shouldIgnore = true;
                if (parentContext) {
                    if (_vnode.vtype === _constant.VCOMPONENT || _vnode.vtype === _constant.VSTATELESS) {
                        if (_vnode.type.contextTypes) {
                            shouldIgnore = false;
                        }
                    }
                }
                updates[j] = {
                    shouldIgnore: shouldIgnore,
                    vnode: _vnode,
                    newVnode: _newVnode,
                    node: childNodes[i],
                    parentContext: parentContext,
                    index: j
                };
                vchildren[i] = null;
                break;
            }
        }
    }

    // isSimilar
    for (var i = 0; i < vchildrenLen; i++) {
        var _vnode2 = vchildren[i];
        if (_vnode2 === null) {
            continue;
        }
        var shouldRemove = true;
        for (var j = 0; j < newVchildrenLen; j++) {
            if (updates[j]) {
                continue;
            }
            var _newVnode2 = newVchildren[j];
            if (_newVnode2.type === _vnode2.type && _newVnode2.key === _vnode2.key && _newVnode2.refs === _vnode2.refs) {
                updates[j] = {
                    vnode: _vnode2,
                    newVnode: _newVnode2,
                    node: childNodes[i],
                    parentContext: parentContext,
                    index: j
                };
                shouldRemove = false;
                break;
            }
        }
        if (shouldRemove) {
            if (!removes) {
                removes = [];
            }
            _.addItem(removes, {
                vnode: _vnode2,
                node: childNodes[i]
            });
        }
    }

    for (var i = 0; i < newVchildrenLen; i++) {
        var item = updates[i];
        if (!item) {
            if (!creates) {
                creates = [];
            }
            _.addItem(creates, {
                vnode: newVchildren[i],
                parentNode: node,
                parentContext: parentContext,
                index: i
            });
        } else if (item.vnode.vtype === _constant.VELEMENT) {
            diffVchildren(patches, item.vnode, item.newVnode, item.node, item.parentContext);
        }
    }

    if (removes) {
        _.addItem(patches.removes, removes);
    }
    if (creates) {
        _.addItem(patches.creates, creates);
    }
    _.addItem(patches.updates, updates);
}

function updateVelem(velem, newVelem, node) {
    var isCustomComponent = velem.type.indexOf('-') >= 0 || velem.props.is != null;
    _.patchProps(node, velem.props, newVelem.props, isCustomComponent);
    if (velem.ref !== newVelem.ref) {
        detachRef(velem.refs, velem.ref, node);
        attachRef(newVelem.refs, newVelem.ref, node);
    }
    return node;
}

function destroyVelem(velem, node) {
    var props = velem.props;
    var vchildren = node.vchildren;
    var childNodes = node.childNodes;

    if (vchildren) {
        for (var i = 0, len = vchildren.length; i < len; i++) {
            destroyVnode(vchildren[i], childNodes[i]);
        }
    }
    detachRef(velem.refs, velem.ref, node);
    node.eventStore = node.vchildren = null;
}

function initVstateless(vstateless, parentContext, namespaceURI) {
    var vnode = renderVstateless(vstateless, parentContext);
    var node = initVnode(vnode, parentContext, namespaceURI);
    node.cache = node.cache || {};
    node.cache[vstateless.uid] = vnode;
    return node;
}

function updateVstateless(vstateless, newVstateless, node, parentContext) {
    var uid = vstateless.uid;
    var vnode = node.cache[uid];
    delete node.cache[uid];
    var newVnode = renderVstateless(newVstateless, parentContext);
    var newNode = compareTwoVnodes(vnode, newVnode, node, parentContext);
    newNode.cache = newNode.cache || {};
    newNode.cache[newVstateless.uid] = newVnode;
    if (newNode !== node) {
        syncCache(newNode.cache, node.cache, newNode);
    }
    return newNode;
}

function destroyVstateless(vstateless, node) {
    var uid = vstateless.uid;
    var vnode = node.cache[uid];
    delete node.cache[uid];
    destroyVnode(vnode, node);
}

function renderVstateless(vstateless, parentContext) {
    var factory = vstateless.type;
    var props = vstateless.props;

    var componentContext = getContextByTypes(parentContext, factory.contextTypes);
    var vnode = factory(props, componentContext);
    if (vnode && vnode.render) {
        vnode = vnode.render();
    }
    if (vnode === null || vnode === false) {
        vnode = createVnode(_constant.VCOMMENT);
    } else if (!vnode || !vnode.vtype) {
        throw new Error('@' + factory.name + '#render:You may have returned undefined, an array or some other invalid object');
    }
    return vnode;
}

function initVcomponent(vcomponent, parentContext, namespaceURI) {
    var Component = vcomponent.type;
    var props = vcomponent.props;
    var uid = vcomponent.uid;

    var componentContext = getContextByTypes(parentContext, Component.contextTypes);
    var component = new Component(props, componentContext);
    var updater = component.$updater;
    var cache = component.$cache;

    cache.parentContext = parentContext;
    updater.isPending = true;
    component.props = component.props || props;
    component.context = component.context || componentContext;
    if (component.componentWillMount) {
        component.componentWillMount();
        component.state = updater.getState();
    }
    var vnode = renderComponent(component);
    var node = initVnode(vnode, getChildContext(component, parentContext), namespaceURI);
    node.cache = node.cache || {};
    node.cache[uid] = component;
    cache.vnode = vnode;
    cache.node = node;
    cache.isMounted = true;
    _.addItem(pendingComponents, component);

    if (vcomponent.ref != null) {
        _.addItem(pendingRefs, vcomponent);
        _.addItem(pendingRefs, component);
    }

    return node;
}

function updateVcomponent(vcomponent, newVcomponent, node, parentContext) {
    var uid = vcomponent.uid;
    var component = node.cache[uid];
    var updater = component.$updater;
    var cache = component.$cache;
    var Component = newVcomponent.type;
    var nextProps = newVcomponent.props;

    var componentContext = getContextByTypes(parentContext, Component.contextTypes);
    delete node.cache[uid];
    node.cache[newVcomponent.uid] = component;
    cache.parentContext = parentContext;
    if (component.componentWillReceiveProps) {
        var needToggleIsPending = !updater.isPending;
        if (needToggleIsPending) updater.isPending = true;
        component.componentWillReceiveProps(nextProps, componentContext);
        if (needToggleIsPending) updater.isPending = false;
    }

    if (vcomponent.ref !== newVcomponent.ref) {
        detachRef(vcomponent.refs, vcomponent.ref, component);
        attachRef(newVcomponent.refs, newVcomponent.ref, component);
    }

    updater.emitUpdate(nextProps, componentContext);

    return cache.node;
}

function destroyVcomponent(vcomponent, node) {
    var uid = vcomponent.uid;
    var component = node.cache[uid];
    var cache = component.$cache;
    delete node.cache[uid];
    detachRef(vcomponent.refs, vcomponent.ref, component);
    component.setState = component.forceUpdate = _.noop;
    if (component.componentWillUnmount) {
        component.componentWillUnmount();
    }
    destroyVnode(cache.vnode, node);
    delete component.setState;
    cache.isMounted = false;
    cache.node = cache.parentContext = cache.vnode = component.refs = component.context = null;
}

function getContextByTypes(curContext, contextTypes) {
    var context = {};
    if (!contextTypes || !curContext) {
        return context;
    }
    for (var key in contextTypes) {
        if (contextTypes.hasOwnProperty(key)) {
            context[key] = curContext[key];
        }
    }
    return context;
}

function renderComponent(component, parentContext) {
    refs = component.refs;
    var vnode = component.render();
    if (vnode === null || vnode === false) {
        vnode = createVnode(_constant.VCOMMENT);
    } else if (!vnode || !vnode.vtype) {
        throw new Error('@' + component.constructor.name + '#render:You may have returned undefined, an array or some other invalid object');
    }
    refs = null;
    return vnode;
}

function getChildContext(component, parentContext) {
    if (component.getChildContext) {
        var curContext = component.getChildContext();
        if (curContext) {
            parentContext = _.extend(_.extend({}, parentContext), curContext);
        }
    }
    return parentContext;
}

var pendingComponents = [];
function clearPendingComponents() {
    var len = pendingComponents.length;
    if (!len) {
        return;
    }
    var components = pendingComponents;
    pendingComponents = [];
    var i = -1;
    while (len--) {
        var component = components[++i];
        var updater = component.$updater;
        if (component.componentDidMount) {
            component.componentDidMount();
        }
        updater.isPending = false;
        updater.emitUpdate();
    }
}

var pendingRefs = [];
function clearPendingRefs() {
    var len = pendingRefs.length;
    if (!len) {
        return;
    }
    var list = pendingRefs;
    pendingRefs = [];
    for (var i = 0; i < len; i += 2) {
        var vnode = list[i];
        var refValue = list[i + 1];
        attachRef(vnode.refs, vnode.ref, refValue);
    }
}

function clearPending() {
    clearPendingRefs();
    clearPendingComponents();
}

function compareTwoVnodes(vnode, newVnode, node, parentContext) {
    var newNode = node;
    if (newVnode == null) {
        // remove
        destroyVnode(vnode, node);
        node.parentNode.removeChild(node);
    } else if (vnode.type !== newVnode.type || vnode.key !== newVnode.key) {
        // replace
        destroyVnode(vnode, node);
        newNode = initVnode(newVnode, parentContext, node.namespaceURI);
        node.parentNode.replaceChild(newNode, node);
    } else if (vnode !== newVnode || parentContext) {
        // same type and same key -> update
        newNode = updateVnode(vnode, newVnode, node, parentContext);
    }
    return newNode;
}

function getDOMNode() {
    return this;
}

function attachRef(refs, refKey, refValue) {
    if (refKey == null || !refValue) {
        return;
    }
    if (refValue.nodeName && !refValue.getDOMNode) {
        // support react v0.13 style: this.refs.myInput.getDOMNode()
        refValue.getDOMNode = getDOMNode;
    }
    if (_.isFn(refKey)) {
        refKey(refValue);
    } else if (refs) {
        refs[refKey] = refValue;
    }
}

function detachRef(refs, refKey, refValue) {
    if (refKey == null) {
        return;
    }
    if (_.isFn(refKey)) {
        refKey(null);
    } else if (refs && refs[refKey] === refValue) {
        delete refs[refKey];
    }
}

function syncCache(cache, oldCache, node) {
    for (var key in oldCache) {
        if (!oldCache.hasOwnProperty(key)) {
            continue;
        }
        var value = oldCache[key];
        cache[key] = value;

        // is component, update component.$cache.node
        if (value.forceUpdate) {
            value.$cache.node = node;
        }
    }
}