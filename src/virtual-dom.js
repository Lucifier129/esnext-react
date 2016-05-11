import * as _ from './util'
import {
    SVGNamespaceURI,
    VELEMENT,
    VSTATELESS,
    VCOMPONENT,
    VCOMMENT,
    HTML_KEY
} from './constant'

/**
* current state component's refs property
* will attach to every vnode created by calling component.render method
*/
let refs = null

export function createVnode(vtype, type, props, key, ref) {
    let vnode = {
        vtype: vtype,
        type: type,
        props: props,
        refs: refs,
        key: key,
        ref: ref,
    }
    if (vtype === VSTATELESS || vtype === VCOMPONENT) {
        vnode.uid = _.getUid()
    }
    return vnode
}

export function initVnode(vnode, parentContext, namespaceURI) {
    let { vtype } = vnode
    let node = null
    if (!vtype) { // init text
        node = document.createTextNode(vnode)
    } else if (vtype === VELEMENT) { // init element
        node = initVelem(vnode, parentContext, namespaceURI)
    } else if (vtype === VCOMPONENT) { // init state component
        node = initVcomponent(vnode, parentContext, namespaceURI)
    } else if (vtype === VSTATELESS) { // init stateless component
        node = initVstateless(vnode, parentContext, namespaceURI)
    } else if (vtype === VCOMMENT) { // init comment
        node = document.createComment(`react-empty: ${ vnode.uid }`)
    }
    return node
}

function updateVnode(vnode, newVnode, node, parentContext) {
    let patches = {
        removes: [],
        updates: [],
        creates: [],
    }
    diffVnodes(patches, vnode, newVnode, node, parentContext)
    _.loop8(patches.removes, applyDestroy)
    let newNode = applyUpdate({
        vnode,
        newVnode,
        node,
        parentContext,
        index: 0
    })
    _.loop8(patches.updates, applyUpdate)
    _.loop8(patches.creates, applyCreate)
    return newNode
}

function applyUpdate(data) {
    let { vnode, newVnode, node, parentContext, index } = data
    let vtype = vnode.vtype
    let newNode = node
    if (!vtype) {
        newNode.replaceData(0, newNode.length, newVnode)
        // newNode.nodeValue = newVnode
    } else if (vtype === VELEMENT) {
        updateVelem(vnode, newVnode, newNode, parentContext)
    } else if (vtype === VSTATELESS) {
        newNode = updateVstateless(vnode, newVnode, newNode, parentContext)
    } else if (vtype === VCOMPONENT) {
        newNode = updateVcomponent(vnode, newVnode, newNode, parentContext)
    }
    let currentNode = newNode.parentNode.childNodes[index]
    if (currentNode !== newNode) {
        newNode.parentNode.insertBefore(newNode, currentNode)
    }
    return newNode
}

function applyDestroy(data) {
    destroyVnode(data.vnode, data.node)
    data.node.parentNode.removeChild(data.node)
}

function applyCreate(data) {
    let node = initVnode(data.vnode, data.parentContext, data.parentNode.namespaceURI)
    if (data.index >= data.parentNode.childNodes.length) {
        data.parentNode.appendChild(node)
    } else {
        data.parentNode.insertBefore(node, data.parentNode.childNodes[data.index])
    }
}


/**
* Only vnode which has props.children need to call destroy function
* to check whether subTree has component that need to call lify-cycle method and release cache.
*/
export function destroyVnode(vnode, node) {
    let { vtype } = vnode
    if (vtype === VELEMENT) { // destroy element
        destroyVelem(vnode, node)
    } else if (vtype === VCOMPONENT) { // destroy state component
        destroyVcomponent(vnode, node)
    } else if (vtype === VSTATELESS) { // destroy stateless component
        destroyVstateless(vnode, node)
    }
}

function initVelem(velem, parentContext, namespaceURI) {
    let { type, props } = velem
    let node = null
    
    if (type === 'svg' || namespaceURI === SVGNamespaceURI) {
        node = document.createElementNS(SVGNamespaceURI, type)
        namespaceURI = SVGNamespaceURI
    } else {
        node = document.createElement(type)
    }

    let vchildren = node.vchildren = getFlattenChildren(velem)
    for (let i = 0, len = vchildren.length; i < len; i++) {
        node.appendChild(initVnode(vchildren[i], parentContext, namespaceURI))
    }

    let isCustomComponent = type.indexOf('-') >= 0 || props.is != null
    _.setProps(node, props, isCustomComponent)

    attachRef(velem.refs, velem.ref, node)

    return node
}

function getFlattenChildren(vnode) {
    let { children } = vnode.props
    let vchildren = []
    if (_.isArr(children)) {
        _.flattenChildren(children, collectChild, vchildren)
    } else {
        collectChild(children, vchildren)
    }
    return vchildren
}

function collectChild(child, children) {
    if (child != null && typeof child !== 'boolean') {
        children[children.length] = child.vtype ? child : '' + child
    }
}

function diffVnodes(patches, vnode, newVnode, node, parentContext) {
    let { vtype } = vnode

    if (vtype !== VELEMENT && vtype !== VCOMPONENT && vtype !== VSTATELESS) {
        return
    }

    let newVchildren = getFlattenChildren(newVnode)
    let { vchildren } = node
    if (!vchildren) {
        console.log(vnode)
    }
    if (vchildren.length > 0) {
        if (newVchildren.length > 0) {
            diffChildren(patches, vchildren, newVchildren, node, parentContext)
        } else {
            for (let i = 0, len = vchildren.length; i < len; i++) {
                patches.removes.push({
                    vnode: vchildren[i],
                    node: node.childNodes[i],
                })
            }
        }
    } else if (newVchildren.length > 0) {
        for (let i = 0, len = newVchildren.length; i < len; i++) {
            patches.creates.push({
                vnode: newVchildren[i],
                parentNode: node,
                parentContext: parentContext,
                index: i,
            })
        }
    }
    node.vchildren = newVchildren
}

function diffChildren(patches, vchildren, newVchildren, node, parentContext) {
    let { childNodes } = node
    let vchildrenLen = vchildren.length
    let newVchildrenLen = newVchildren.length
    let matches = Array(newVchildrenLen)

    for (let i = 0; i < vchildrenLen; i++) {
        let vnode = vchildren[i]
        for (let j = 0; j < newVchildrenLen; j++) {
            if (matches[j]) {
                continue
            }
            let newVnode = newVchildren[j]
            if (vnode === newVnode) {
                if (parentContext) {
                    patches.updates.push({
                        vnode: vnode,
                        newVnode: newVnode,
                        node: childNodes[i],
                        parentContext: parentContext,
                        index: j,
                    })
                    diffVnodes(patches, vnode, newVnode, childNodes[i], parentContext)
                }
                matches[j] = 1
                vchildren[i] = null
                break
            }
        }
    }

    for (let i = 0; i < vchildrenLen; i++) {
        let vnode = vchildren[i]
        if (vnode === null) {
            continue
        }
        let shouldRemove = true
        for (let j = 0; j < newVchildrenLen; j++) {
            if (matches[j]) {
                continue
            }
            let newVnode = newVchildren[j]
            if (
                newVnode.type === vnode.type &&
                newVnode.key === vnode.key &&
                newVnode.refs === vnode.refs
            ) {
                patches.updates.push({
                    vnode: vnode,
                    newVnode: newVnode,
                    node: childNodes[i],
                    parentContext: parentContext,
                    index: j,
                })
                diffVnodes(patches, vnode, newVnode, childNodes[i], parentContext)
                matches[j] = 1
                shouldRemove = false
                break
            }
        }
        if (shouldRemove) {
            patches.removes.push({
                vnode: vnode,
                node: childNodes[i]
            })
        }
    }

    for (let i = 0; i < newVchildrenLen; i++) {
        if (!matches[i]) {
            patches.creates.push({
                vnode: newVchildren[i],
                parentNode: node,
                parentContext: parentContext,
                index: i,
            })
        }
    }
}

function updateVelem(velem, newVelem, node) {
    let isCustomComponent = velem.type.indexOf('-') >= 0 || velem.props.is != null
    _.patchProps(node, velem.props, newVelem.props, isCustomComponent)
    if (velem.ref !== newVelem.ref) {
        detachRef(velem.refs, velem.ref)
        attachRef(newVelem.refs, newVelem.ref, node)
    }
    return node
}

function destroyVelem(velem, node) {
    let { props } = velem
    let { vchildren, childNodes } = node
    for (let i = 0, len = vchildren.length; i < len; i++) {
        destroyVnode(vchildren[i], childNodes[i])
    }
    detachRef(velem.refs, velem.ref)
    node.eventStore = node.vchildren = null
}

function initVstateless(vstateless, parentContext, namespaceURI) {
    let vnode = renderVstateless(vstateless, parentContext)
    let node = initVnode(vnode, parentContext, namespaceURI)
    node.cache = node.cache || {}
    node.cache[vstateless.uid] = vnode
    return node
}
function updateVstateless(vstateless, newVstateless, node, parentContext) {
    let uid = vstateless.uid
    let vnode = node.cache[uid]
    delete node.cache[uid]
    let newVnode = renderVstateless(newVstateless, parentContext)
    let newNode = compareTwoVnodes(vnode, newVnode, node, parentContext)
    newNode.cache = newNode.cache || {}
    newNode.cache[newVstateless.uid] = newVnode
    if (newNode !== node) {
        syncCache(newNode.cache, node.cache, newNode)
    }
    return newNode
}
function destroyVstateless(vstateless, node) {
    let uid = vstateless.uid
    let vnode = node.cache[uid]
    delete node.cache[uid]
    destroyVnode(vnode, node)
}

function renderVstateless(vstateless, parentContext) {
    let { type: factory, props } = vstateless
    let componentContext = getContextByTypes(parentContext, factory.contextTypes)
    let vnode = factory(props, componentContext)
    if (vnode && vnode.render) {
        vnode = vnode.render()
    }
    if (vnode === null || vnode === false) {
        vnode = createVnode(VCOMMENT)
    } else if (!vnode || !vnode.vtype) {
        throw new Error(`@${factory.name}#render:You may have returned undefined, an array or some other invalid object`)
    }
    return vnode
}

function initVcomponent(vcomponent, parentContext, namespaceURI) {
    let { type: Component, props, uid } = vcomponent
    let componentContext = getContextByTypes(parentContext, Component.contextTypes)
    let component = new Component(props, componentContext)
    let { $updater: updater, $cache: cache } = component
    cache.parentContext = parentContext
    updater.isPending = true
    component.props = component.props || props
    component.context = component.context || componentContext
    if (component.componentWillMount) {
        component.componentWillMount()
        component.state = updater.getState()
    }
    let vnode = renderComponent(component)
    let node = initVnode(vnode, getChildContext(component, parentContext), namespaceURI)
    node.cache = node.cache || {}
    node.cache[uid] = component
    cache.vnode = vnode
    cache.node = node
    cache.isMounted = true
    pendingComponents.push(component)
    attachRef(vcomponent.refs, vcomponent.ref, component)
    return node
}
function updateVcomponent(vcomponent, newVcomponent, node, parentContext) {
    let uid = vcomponent.uid
    let component = node.cache[uid]
    let { $updater: updater, $cache: cache } = component
    let { type: Component, props: nextProps } = newVcomponent
    let componentContext = getContextByTypes(parentContext, Component.contextTypes)
    delete node.cache[uid]
    node.cache[newVcomponent.uid] = component
    cache.parentContext = parentContext
    if (component.componentWillReceiveProps) {
        updater.isPending = true
        component.componentWillReceiveProps(nextProps, componentContext)
        updater.isPending = false
    }
    updater.emitUpdate(nextProps, componentContext)

    if (vcomponent.ref !== newVcomponent.ref) {
        detachRef(vcomponent.refs, vcomponent.ref)
        attachRef(newVcomponent.refs, newVcomponent.ref, component)
    }
    return cache.node
}
function destroyVcomponent(vcomponent, node) {
    let uid = vcomponent.uid
    let component = node.cache[uid]
    let cache = component.$cache
    delete node.cache[uid]
    detachRef(vcomponent.refs, vcomponent.ref)
    component.setState = component.forceUpdate = _.noop
    if (component.componentWillUnmount) {
        component.componentWillUnmount()
    }
    destroyVnode(cache.vnode, node)
    delete component.setState
    cache.isMounted = false
    cache.node = cache.parentContext = cache.vnode = component.refs = component.context = null
}

function getContextByTypes(curContext, contextTypes) {
	let context = {}
	if (!contextTypes || !curContext) {
		return context
	}
	for (let key in contextTypes) {
		if (contextTypes.hasOwnProperty(key)) {
			context[key] = curContext[key]
		}
	}
	return context
}

export function renderComponent(component, parentContext) {
    refs = component.refs
	let vnode = component.render()
    if (vnode === null || vnode === false) {
        vnode = createVnode(VCOMMENT)
    } else if (!vnode || !vnode.vtype) {
        throw new Error(`@${component.constructor.name}#render:You may have returned undefined, an array or some other invalid object`)
    }
	refs = null
	return vnode
}

export function getChildContext(component, parentContext) {
    if (component.getChildContext) {
        let curContext = component.getChildContext()
        if (curContext) {
            parentContext = _.extend(_.extend({}, parentContext), curContext)
        }
    }
    return parentContext
}


let pendingComponents = []
export function clearPendingComponents() {
	let len = pendingComponents.length
	if (!len) {
		return
	}
    let components = pendingComponents
	pendingComponents = []
    let i = -1
    while (len--) {
        let component = components[++i]
        let updater = component.$updater
        if (component.componentDidMount) {
            component.componentDidMount()
        }
        updater.isPending = false
        updater.emitUpdate()
    }
}

export function compareTwoVnodes(vnode, newVnode, node, parentContext) {
    let newNode = node
    if (newVnode == null) {
        // remove
        destroyVnode(vnode, node)
        node.parentNode.removeChild(node)
    } else if (vnode.type !== newVnode.type || vnode.key !== newVnode.key || vnode.refs !== newVnode.refs) { 
        // replace
        destroyVnode(vnode, node)
        newNode = initVnode(newVnode, parentContext, node.namespaceURI)
        node.parentNode.replaceChild(newNode, node)
    } else if (vnode !== newVnode || parentContext) { 
        // same type and same key -> update
        newNode = updateVnode(vnode, newVnode, node, parentContext)
    }
    return newNode
}

function getDOMNode() { return this }

function attachRef(refs, refKey, refValue) {
    if (!refs || refKey == null || !refValue) {
        return
    }
    if (refValue.nodeName && !refValue.getDOMNode) {
        // support react v0.13 style: this.refs.myInput.getDOMNode()
        refValue.getDOMNode = getDOMNode
    }
    if (_.isFn(refKey)) {
        refKey(refValue)
    } else {
        refs[refKey] = refValue
    }
}

function detachRef(refs, refKey) {
    if (!refs || refKey == null) {
        return
    }
    if (_.isFn(refKey)) {
        refKey(null)
    } else {
        delete refs[refKey]
    }
}

export function syncCache(cache, oldCache, node) {
    for (let key in oldCache) {
        if (!oldCache.hasOwnProperty(key)) {
            continue
        }
        let value = oldCache[key]
        cache[key] = value
        // is component, update component.$cache.node
        if (value.forceUpdate) {
            value.$cache.node = node
        }
    }
}