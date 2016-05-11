import * as _ from './util'
import {
    VELEMENT,
    VSTATELESS,
    VCOMPONENT,
    VCOMMENT
} from './constant'
import { createVnode } from './virtual-dom'

export default function createElement(type, props, children) {
	let vtype = null
	if (typeof type === 'string') {
		vtype = VELEMENT
	} else if (typeof type === 'function') {
		if (type.prototype && typeof type.prototype.forceUpdate === 'function') {
			vtype = VCOMPONENT
		} else {
			vtype = VSTATELESS
		}
	} else {
		throw new Error(`React.createElement: unexpect type [ ${type} ]`)
	}

	let key = null
	let ref = null
	let finalProps = {}
	if (props != null) {
		for (let propKey in props) {
			if (!props.hasOwnProperty(propKey)) {
				continue
			}
			if (propKey === 'key') {
				if (props.key !== undefined) {
					key = '' + props.key
				}
			} else if (propKey === 'ref') {
				if (props.ref !== undefined) {
					ref = props.ref
				}
			} else {
				finalProps[propKey] = props[propKey]
			}
		}
	}

	let defaultProps = type.defaultProps

	if (defaultProps) {
		for (let propKey in defaultProps) {
			if (finalProps[propKey] === undefined) {
				finalProps[propKey] = defaultProps[propKey]
			}
		}
	}

	let argsLen = arguments.length
	let finalChildren = children

	if (argsLen > 3) {
		finalChildren = Array(argsLen - 2)
		for (let i = 2; i < argsLen; i++) {
			finalChildren[i - 2] = arguments[i]
		}
	}

	if (finalChildren !== undefined) {
		finalProps.children = finalChildren
	}

	return createVnode(vtype, type, finalProps, key, ref)
}

export function isValidElement(obj) {
	return obj != null && !!obj.vtype
}

export function cloneElement(originElem, props, ...children) {
	let { type, key, ref } = originElem
	let newProps = _.extend(_.extend({ key, ref }, originElem.props), props)
	let vnode = createElement(type, newProps, ...children)
	if (vnode.ref === originElem.ref) {
		vnode.refs = originElem.refs
	}
	return vnode
}

export function createFactory(type) {
	let factory = (...args) => createElement(type, ...args)
	factory.type = type
	return factory
}