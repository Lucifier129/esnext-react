// util
import { addEvent, removeEvent } from './event-system'
import {
    setStyle,
    removeStyle,
    patchStyle
} from './CSSPropertyOperations.js'
import {
    setPropValue,
    removePropValue
} from './DOMPropertyOperations'

export function isFn(obj) {
    return typeof obj === 'function'
}

export let isArr = Array.isArray

export function noop() {}
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

export function extend(to, /* sources */) {
    var nextSource, nextIndex;
    for (nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
        nextSource = arguments[nextIndex];
        if (nextSource == null) {
            continue;
        }
    }
    var from = Object(nextSource);
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
export function setProps(elem, props, isCustomComponent) {
    for (let key in props) {
        if (!props.hasOwnProperty(key) || key === 'children') {
            continue
        }
        let value = props[key]
        if (EVENT_KEYS.test(key)) {
            addEvent(elem, key, value)
        } else if (key === 'style') {
            setStyle(elem.style, value)
        } else if (key === 'dangerouslySetInnerHTML') {
            value && value.__html != null && (elem.innerHTML = value.__html)
        } else if (isCustomComponent) {
            if (value == null) {
                elem.removeAttribute(key)
            } else {
                elem.setAttribute(key, '' + value)
            }
        } else {
            setPropValue(elem, key, value)
        }
    }
}

function patchProp(key, oldValue, value, elem, isCustomComponent) {
    if (key === 'value' || key === 'checked') {
        oldValue = elem[key]
    }
    if (value === oldValue) {
        return
    }
    if (value === undefined) {
        if (EVENT_KEYS.test(key)) {
            removeEvent(elem, key)
        } else if (key === 'style') {
            removeStyle(elem.style, oldValue)
        } else if (key === 'dangerouslySetInnerHTML') {
            elem.innerHTML = ''
        } else if (isCustomComponent) {
            elem.removeAttribute(key)
        } else {
            removePropValue(elem, key)
        }
        return
    }
    if (EVENT_KEYS.test(key)) {
        // addEvent will replace the oldValue
        addEvent(elem, key, value)
    } else if (key === 'style') {
        patchStyle(elem.style, oldValue, value)
    } else if (key === 'dangerouslySetInnerHTML') {
        let oldHtml = oldValue && oldValue.__html
        let html = value && value.__html
        if (html != null && html !== oldHtml) {
            elem.innerHTML = html
        }
    } else if (isCustomComponent) {
        if (value == null) {
            elem.removeAttribute(key)
        } else {
            elem.setAttribute(key, '' + value)
        }
    } else {
        setPropValue(elem, key, value)
    }
}

export function patchProps(elem, props, newProps, isCustomComponent) {
    let keyMap = { children: true }
    for (let key in props) {
        if (props.hasOwnProperty(key) && key !== 'children') {
            keyMap[key] = true
            patchProp(key, props[key], newProps[key], elem, isCustomComponent)
        }
    }
    for (let key in newProps) {
        if (newProps.hasOwnProperty(key) && keyMap[key] !== true) {
            patchProp(key, props[key], newProps[key], elem, isCustomComponent)
        }
    }
}

if (!Object.freeze) {
    Object.freeze = identity
}