import * as _ from './util'
import {
    SVGNamespaceURI,
    notBubbleEvents,
    VELEMENT,
    VSTATELESS,
    VCOMPONENT,
    VCOMMENT
} from './constant'
import { getEventName } from './event-system'
let refs = null

export function createVelem(type, props) {
    return {
        vtype: VELEMENT,
        type: type,
        props: props,
        refs: refs
    }
}

export function createVstateless(type, props) {
    return {
        vtype: VSTATELESS,
        id: _.getUid(),
        type: type,
        props: props
    }
}

export function createVcomponent(type, props) {
    return {
        vtype: VCOMPONENT,
        id: _.getUid(),
        type: type,
        props: props,
        refs: refs
    }
}

function createVcomment(comment) {
    return {
        vtype: VCOMMENT,
        comment: comment
    }
}

export function initVnode(vnode, parentContext, namespaceURI) {
    let { vtype } = vnode
    let node = null
    if (!vtype) {
        node = document.createTextNode(vnode)
    } else if (vtype === VELEMENT) {
        node = initVelem(vnode, parentContext, namespaceURI)
    } else if (vtype === VCOMPONENT) {
        node = initVcomponent(vnode, parentContext, namespaceURI)
    } else if (vtype === VSTATELESS) {
        node = initVstateless(vnode, parentContext, namespaceURI)
    } else if (vtype === VCOMMENT) {
        node = document.createComment(vnode.comment)
    }
    return node
}

export function destroyVnode(vnode, node) {
    let { vtype } = vnode

    if (vtype === VELEMENT) {
        destroyVelem(vnode, node)
    } else if (vtype === VCOMPONENT) {
        destroyVcomponent(vnode, node)
    } else if (vtype === VSTATELESS) {
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

    let { children } = props
    let vchildren = node.vchildren = []
    if (_.isArr(children)) {
        _.flattenChildren(children, collectChild, vchildren)
    } else {
        collectChild(children, vchildren)
    }

    for (let i = 0, len = vchildren.length; i < len; i++) {
        node.appendChild(initVnode(vchildren[i], parentContext, namespaceURI))
    }

    _.setProps(node, props)

    if (velem.ref !== null) {
        attachRef(velem.refs, velem.ref, node)
    }

    return node
}

function collectChild(child, children) {
    if (child != null && typeof child !== 'boolean') {
        children.push(child.vtype ? child : '' + child)
    }
}

function updateVelem(velem, newVelem, node, parentContext) {
    let { props } = velem
    let newProps = newVelem.props
    let oldHtml = props.dangerouslySetInnerHTML && props.dangerouslySetInnerHTML.__html
    let newChildren = newProps.children
    let { vchildren, childNodes, namespaceURI } = node
    let vchildrenLen = vchildren.length
    let newVchildren = node.vchildren = []

    if (_.isArr(newChildren)) {
        _.flattenChildren(newChildren, collectChild, newVchildren)
    } else {
        collectChild(newChildren, newVchildren)
    }

    let newVchildrenLen = newVchildren.length

    if (oldHtml == null && vchildrenLen) {
        let shouldRemove = []
        let patches = Array(newVchildrenLen)

        outer: for (let i = 0; i < vchildrenLen; i++) {
            let vnode = vchildren[i]
            let { type, refs, key } = vnode
            for (let j = 0; j < newVchildrenLen; j++) {
                if (patches[j]) {
                    continue
                }
                let newVnode = newVchildren[j]
                if (newVnode === vnode || newVnode.type === type && newVnode.key === key && newVnode.refs === refs) {
                    patches[j] = {
                        vnode: vnode,
                        node: childNodes[i]
                    }
                    continue outer
                }
            }
            destroyVnode(vnode, shouldRemove[shouldRemove.length] = childNodes[i])
        }

        for (let i = 0, len = shouldRemove.length; i < len; i++) {
            node.removeChild(shouldRemove[i])
        }

        for (let i = 0; i < newVchildrenLen; i++) {
            let newVnode = newVchildren[i]
            let patchItem = patches[i]
            if (patchItem) {
                let vnode = patchItem.vnode
                let newChildNode = patchItem.node
                if (newVnode !== vnode) {
                    let vtype = newVnode.vtype
                    if (!vtype) { // textNode
                        // newChildNode.nodeValue = newVnode
                        newChildNode.replaceData(0, vnode.length, newVnode)
                    } else if (vtype === VELEMENT) {
                        newChildNode = updateVelem(vnode, newVnode, newChildNode, parentContext)
                    } else if (vtype === VCOMPONENT) {
                        newChildNode = updateVcomponent(vnode, newVnode, newChildNode, parentContext)
                    } else if (vtype === VSTATELESS) {
                        newChildNode = updateVstateless(vnode, newVnode, newChildNode, parentContext)
                    }
                }
                let currentNode = childNodes[i]
                if (currentNode !== newChildNode) {
                    node.insertBefore(newChildNode, currentNode || null)
                }
            } else {
                let newChildNode = initVnode(newVnode, parentContext, namespaceURI)
                node.insertBefore(newChildNode, childNodes[i] || null)
            }
        }
        _.patchProps(node, props, newProps)
    } else {
        // should patch props first, make sure innerHTML was cleared
        _.patchProps(node, props, newProps)
        for (let i = 0; i < newVchildrenLen; i++) {
            node.appendChild(initVnode(newVchildren[i], parentContext, namespaceURI))
        }
    }
    if (velem.ref !== null) {
        if (newVelem.ref !== null) {
            attachRef(newVelem.refs, newVelem.ref, node)
        } else {
            detachRef(velem.refs, velem.ref)
        }
    } else if (newVelem.ref !== null) {
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

    if (velem.ref !== null) {
        detachRef(velem.refs, velem.ref)
    }
    node.eventStore = node.vchildren = null
    for (let key in props) {
        if (props.hasOwnProperty(key) && _.EVENT_KEYS.test(key)) {
            key = getEventName(key)
            if (notBubbleEvents[key] === true) {
                node[key] = null
            }
        }
    }
}

function initVstateless(vstateless, parentContext, namespaceURI) {
    let vnode = renderVstateless(vstateless, parentContext)
    let node = initVnode(vnode, parentContext, namespaceURI)
    node.cache = node.cache || {}
    node.cache[vstateless.id] = vnode
    return node
}
function updateVstateless(vstateless, newVstateless, node, parentContext) {
    let id = vstateless.id
    let vnode = node.cache[id]
    delete node.cache[id]
    let newVnode = renderVstateless(newVstateless, parentContext)
    let newNode = compareTwoVnodes(vnode, newVnode, node, parentContext)
    newNode.cache = newNode.cache || {}
    newNode.cache[newVstateless.id] = newVnode
    if (newNode !== node) {
        _.extend(newNode.cache, node.cache)
    }
    return newNode
}
function destroyVstateless(vstateless, node) {
    let id = vstateless.id
    let vnode = node.cache[id]
    delete node.cache[id]
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
        vnode = createVcomment(`react-empty: ${_.getUid()}`)
    } else if (!vnode || !vnode.vtype) {
        throw new Error(`@${factory.name}#render:You may have returned undefined, an array or some other invalid object`)
    }
    return vnode
}

function initVcomponent(vcomponent, parentContext, namespaceURI) {
    let { type: Component, props, id } = vcomponent
    let componentContext = getContextByTypes(parentContext, Component.contextTypes)
    let component = new Component(props, componentContext)
    let { $updater: updater, $cache: cache } = component
    cache.parentContext = parentContext
    updater.isPending = true
    component.props = _.orObject(component.props) || props;
    component.context = _.orObject(component.context) || componentContext;

    if (component.componentWillMount) {
        component.componentWillMount()
        component.state = updater.getState()
    }
    let vnode = renderComponent(component, parentContext)
    let node = initVnode(vnode, vnode.context, namespaceURI)
    node.cache = node.cache || {}
    node.cache[id] = component
    cache.vnode = vnode
    cache.node = node
    cache.isMounted = true
    pendingComponents.push(component)
    if (vcomponent.ref !== null) {
        attachRef(vcomponent.refs, vcomponent.ref, component)
    }
    return node
}
function updateVcomponent(vcomponent, newVcomponent, node, parentContext) {
    let id = vcomponent.id
    let component = node.cache[id]
    let { $updater: updater, $cache: cache } = component
    let { type: Component, props: nextProps } = newVcomponent
    let componentContext = getContextByTypes(parentContext, Component.contextTypes)
    delete node.cache[id]
    node.cache[newVcomponent.id] = component
    cache.parentContext = parentContext
    if (component.componentWillReceiveProps) {
        updater.isPending = true
        component.componentWillReceiveProps(nextProps, componentContext)
        updater.isPending = false
    }
    updater.emitUpdate(nextProps, componentContext)
    if (vcomponent.ref !== null) {
        if (newVcomponent.ref !== null) {
            attachRef(newVcomponent.refs, newVcomponent.ref, component)
        } else {
            detachRef(vcomponent.refs, vcomponent.ref)
        }
    } else if (newVcomponent.ref !== null) {
        attachRef(newVcomponent.refs, newVcomponent.ref, component)
    }
    return cache.node
}
function destroyVcomponent(vcomponent, node) {
    let id = vcomponent.id
    let component = node.cache[id]
    let cache = component.$cache
    delete node.cache[id]
    if (vcomponent.ref !== null) {
        detachRef(vcomponent.refs, vcomponent.ref)
    }
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
        vnode = createVcomment(`react-empty: ${_.getUid()}`)
    } else if (!vnode || !vnode.vtype) {
        throw new Error(`@${component.constructor.name}#render:You may have returned undefined, an array or some other invalid object`)
    }

	let curContext = refs = null
    if (component.getChildContext) {
        curContext = component.getChildContext()
    }
	if (curContext) {
		curContext = _.extend(_.extend({}, parentContext), curContext)
	} else {
		curContext = parentContext
	}
	vnode.context = curContext
	return vnode
}

let pendingComponents = []
export function clearPendingComponents() {
	let components = pendingComponents
	let len = components.length
	if (!len) {
		return
	}
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

    if (newVnode == null) { // remove
        destroyVnode(vnode, node)
        node.parentNode.removeChild(node)
    } else if (vnode.type !== newVnode.type || newVnode.key !== vnode.key) {  // replace
        destroyVnode(vnode, node)
        newNode = initVnode(newVnode, parentContext, node.namespaceURI)
        node.parentNode.replaceChild(newNode, node)
    } else if (vnode !== newVnode) {
        // same type and same key -> update
        let vtype = vnode.vtype
        if (vtype === VELEMENT) {
            newNode = updateVelem(vnode, newVnode, node, parentContext)
        } else if (vtype === VCOMPONENT) {
            newNode = updateVcomponent(vnode, newVnode, node, parentContext)
        } else if (vtype === VSTATELESS) {
            newNode = updateVstateless(vnode, newVnode, node, parentContext)
        }
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
