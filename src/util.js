// util
import { addEvent, removeEvent } from './event-system'
import {
	propAlias,
	attributesNS,
	attrbutesConfigs,
	readOnlyProps,
	isUnitlessNumber
} from './constant'

// Speed up calls to hasOwnProperty
const hasOwnProperty = Object.prototype.hasOwnProperty;

export function isEmpty(obj) {
    if (obj == null) return true
    if (obj.length > 0) return false
    if (obj.length === 0)  return true

    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false
    }
    return true
}

export function isFn(obj) {
    return typeof obj === 'function'
}

export let isArr = Array.isArray

export function noop(){}
export function identity(obj) {
	return obj
}
export function pipe(fn1, fn2) {
	return function() {
		fn1.apply(this, arguments)
		return fn2.apply(this, arguments)
	}
}

export function flattenChildren(list, iteratee, a) {
    let len = list.length
    let i = -1

    while (len--) {
        let item = list[++i]
        if (isArr(item)) {
        	flattenChildren(item, iteratee, a)
        } else {
        	iteratee(item, a)
        }
    }
}

export function eachItem(list, iteratee) {
	for (let i = 0, len = list.length; i < len; i++) {
		iteratee(list[i], i)
	}
}

export function mapValue(obj, iteratee) {
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			iteratee(obj[key], key)
		}
	}
}

export function extend(to, from) {
    if (!from) {
        return to
    }
    var keys = Object.keys(from)
    var i = keys.length
    while (i--) {
        if (from[keys[i]] !== undefined) {
            to[keys[i]] = from[keys[i]]
        }
    }
    return to
}


let uid = 0
export function getUid() {
	return ++uid
}

export let EVENT_KEYS = /^on/i
function isInnerHTMLKey(key) {
	return key === 'dangerouslySetInnerHTML'
}
function isStyleKey(key) {
	return key === 'style'
}

function setProp(elem, key, value) {
	let originalKey = key
	key = propAlias[key] || key

	if (EVENT_KEYS.test(key)) {
		addEvent(elem, key, value)
	} else if (key === 'style') {
		setStyle(elem, value)
	} else if (key === 'dangerouslySetInnerHTML') {
		value && value.__html != null && (elem.innerHTML = value.__html)
	} else if ((key in elem) && attrbutesConfigs[originalKey] !== true) {
		if (readOnlyProps[key] !== true) {
			if (key === 'title' && value == null) {
				value = ''
			}
			elem[key] = value
		}
	} else {
		if (value == null) {
		    elem.removeAttribute(key)
		} else if (attributesNS.hasOwnProperty(originalKey)) {
			elem.setAttributeNS(attributesNS[originalKey], key, value)
		} else {
		    elem.setAttribute(key, value)
		}
	}
}
export function setProps(elem, props) {
	for (let key in props) {
		if (props.hasOwnProperty(key) && key !== 'children') {
			setProp(elem, key, props[key])
		}
	}
}

function removeProp(elem, key, oldValue) {
	key = propAlias[key] || key

	if (EVENT_KEYS.test(key)) {
		removeEvent(elem, key)
	} else if (key === 'style') {
		removeStyle(elem, oldValue)
	} else if (key === 'dangerouslySetInnerHTML') {
		elem.innerHTML = ''
	} else if (!(key in elem) || attrbutesConfigs[key] === true) {
		elem.removeAttribute(key)
	} else if (isFn(oldValue)) {
		elem[key] = null
	} else if (typeof oldValue === 'string') {
		elem[key] = ''
	} else if (typeof oldValue === 'boolean') {
		elem[key] = false
	} else {
		try {
		    delete elem[key]
		} catch (e) {
		    //pass
		}
	}
}

function patchProp(key, oldValue, value, elem) {
    if (key === 'value' || key === 'checked') {
    	oldValue = elem[key]
    }

    if (value === oldValue) {
        return
    }
    if (value === undefined) {
        removeProp(elem, key, oldValue)
        return
    }
    if (key === 'style') {
        patchStyle(elem, oldValue, value)
    } else if (key === 'dangerouslySetInnerHTML') {
        let oldHtml = oldValue && oldValue.__html
        let html = value && value.__html
        if (html != null && html !== oldHtml) {
            elem.innerHTML = html
        }
    } else {
        setProp(elem, key, value)
    }
}


export function patchProps(elem, props, newProps) {
	let keyMap = { children: true }
	for (let key in props) {
		if (props.hasOwnProperty(key) && key !== 'children') {
			keyMap[key] = true
			patchProp(key, props[key], newProps[key], elem)
		}
	}
	for (let key in newProps) {
		if (newProps.hasOwnProperty(key) && keyMap[key] !== true) {
			patchProp(key, props[key], newProps[key], elem)
		}
	}
}

function removeStyle(elem, style) {
	if (!style) {
		return
	}
	let elemStyle = elem.style
	for (let key in style) {
		if (style.hasOwnProperty(key)) {
			elemStyle[key] = ''
		}
	}
}
function setStyle(elem, style) {
	if (!style) {
		return
	}
	let elemStyle = elem.style
	for (let key in style) {
		if (style.hasOwnProperty(key)) {
			setStyleValue(elemStyle, key, style[key])
		}
	}
}

function patchStyle(elem, style, newStyle) {
    if (style === newStyle) {
        return
    }
    if (!newStyle && style) {
        removeStyle(elem, style)
        return
    } else if (newStyle && !style) {
        setStyle(elem, newStyle)
        return
    }

    let elemStyle = elem.style
    let keyMap = {}
    for (let key in style) {
        if (style.hasOwnProperty(key)) {
            keyMap[key] = true
            if (style[key] !== newStyle[key]) {
                setStyleValue(elemStyle, key, newStyle[key])
            }
        }
    }
    for (let key in newStyle) {
        if (newStyle.hasOwnProperty(key) && keyMap[key] !== true) {
            if (style[key] !== newStyle[key]) {
                setStyleValue(elemStyle, key, newStyle[key])
            }
        }
    }
}


let isUnitlessNumberWithPrefix = {}
let prefixes = ['Webkit', 'ms', 'Moz', 'O'];
let prefixKey = (prefix, key) => prefix + key.charAt(0).toUpperCase() + key.substring(1)
mapValue(isUnitlessNumber, (_, prop) => {
	eachItem(prefixes, prefix =>
		isUnitlessNumberWithPrefix[prefixKey(prefix, prop)] = true
	)
})
mapValue(isUnitlessNumberWithPrefix, (value, key) => {
	isUnitlessNumber[key] = value
})

let RE_NUMBER = /^-?\d+(\.\d+)?$/
function setStyleValue(style, key, value) {
	if (!isUnitlessNumber[key] && RE_NUMBER.test(value)) {
		style[key] = value + 'px'
	} else {
		key = key === 'float' ? 'cssFloat' : key
		style[key] = (value == null || typeof value === 'boolean') ? '' : value
	}
}

if (!Object.freeze) {
	Object.freeze = identity
}
