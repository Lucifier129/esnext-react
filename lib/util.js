// util
'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.isFn = isFn;
exports.noop = noop;
exports.identity = identity;
exports.pipe = pipe;
exports.addItem = addItem;
exports.flatEach = flatEach;
exports.extend = extend;
exports.getUid = getUid;
exports.setProps = setProps;
exports.patchProps = patchProps;

var _eventSystem = require('./event-system');

var _CSSPropertyOperationsJs = require('./CSSPropertyOperations.js');

var _DOMPropertyOperations = require('./DOMPropertyOperations');

var _constant = require('./constant');

function isFn(obj) {
    return typeof obj === 'function';
}

var isArr = Array.isArray;

exports.isArr = isArr;

function noop() {}

function identity(obj) {
    return obj;
}

function pipe(fn1, fn2) {
    return function () {
        fn1.apply(this, arguments);
        return fn2.apply(this, arguments);
    };
}

function addItem(list, item) {
    list[list.length] = item;
}

function flatEach(list, iteratee, a) {
    var len = list.length;
    var i = -1;

    while (len--) {
        var item = list[++i];
        if (isArr(item)) {
            flatEach(item, iteratee, a);
        } else {
            iteratee(item, a);
        }
    }
}

function extend(to, from) {
    if (!from) {
        return to;
    }
    var keys = Object.keys(from);
    var i = keys.length;
    while (i--) {
        to[keys[i]] = from[keys[i]];
    }
    return to;
}

var uid = 0;

function getUid() {
    return ++uid;
}

var EVENT_KEYS = /^on/i;

exports.EVENT_KEYS = EVENT_KEYS;
function setProp(elem, key, value, isCustomComponent) {
    if (EVENT_KEYS.test(key)) {
        (0, _eventSystem.addEvent)(elem, key, value);
    } else if (key === 'style') {
        (0, _CSSPropertyOperationsJs.setStyle)(elem.style, value);
    } else if (key === _constant.HTML_KEY) {
        if (value && value.__html != null) {
            elem.innerHTML = value.__html;
        }
    } else if (isCustomComponent) {
        if (value == null) {
            elem.removeAttribute(key);
        } else {
            elem.setAttribute(key, '' + value);
        }
    } else {
        (0, _DOMPropertyOperations.setPropValue)(elem, key, value);
    }
}

function removeProp(elem, key, oldValue, isCustomComponent) {
    if (EVENT_KEYS.test(key)) {
        (0, _eventSystem.removeEvent)(elem, key);
    } else if (key === 'style') {
        (0, _CSSPropertyOperationsJs.removeStyle)(elem.style, oldValue);
    } else if (key === _constant.HTML_KEY) {
        elem.innerHTML = '';
    } else if (isCustomComponent) {
        elem.removeAttribute(key);
    } else {
        (0, _DOMPropertyOperations.removePropValue)(elem, key);
    }
}

function patchProp(elem, key, value, oldValue, isCustomComponent) {
    if (key === 'value' || key === 'checked') {
        oldValue = elem[key];
    }
    if (value === oldValue) {
        return;
    }
    if (value === undefined) {
        removeProp(elem, key, oldValue, isCustomComponent);
        return;
    }
    if (key === 'style') {
        (0, _CSSPropertyOperationsJs.patchStyle)(elem.style, oldValue, value);
    } else {
        setProp(elem, key, value, isCustomComponent);
    }
}

function setProps(elem, props, isCustomComponent) {
    for (var key in props) {
        if (key !== 'children') {
            setProp(elem, key, props[key], isCustomComponent);
        }
    }
}

function patchProps(elem, props, newProps, isCustomComponent) {
    for (var key in props) {
        if (key !== 'children') {
            if (newProps.hasOwnProperty(key)) {
                patchProp(elem, key, newProps[key], props[key], isCustomComponent);
            } else {
                removeProp(elem, key, props[key], isCustomComponent);
            }
        }
    }
    for (var key in newProps) {
        if (key !== 'children' && !props.hasOwnProperty(key)) {
            setProp(elem, key, newProps[key], isCustomComponent);
        }
    }
}

if (!Object.freeze) {
    Object.freeze = identity;
}