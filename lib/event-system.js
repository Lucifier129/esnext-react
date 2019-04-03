'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.getEventName = getEventName;
exports.addEvent = addEvent;
exports.removeEvent = removeEvent;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _Component = require('./Component');

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

// event config
var unbubbleEvents = {
    /**
     * should not bind mousemove in document scope
     * even though mousemove event can bubble
     */
    onmousemove: 1,
    ontouchmove: 1,
    onmouseleave: 1,
    onmouseenter: 1,
    onload: 1,
    onunload: 1,
    onscroll: 1,
    onfocus: 1,
    onblur: 1,
    onrowexit: 1,
    onbeforeunload: 1,
    onstop: 1,
    ondragdrop: 1,
    ondragenter: 1,
    ondragexit: 1,
    ondraggesture: 1,
    ondragover: 1,
    oncontextmenu: 1,
    onerror: 1
};

exports.unbubbleEvents = unbubbleEvents;

function getEventName(key) {
    if (key === 'onDoubleClick') {
        key = 'ondblclick';
    } else if (key === 'onTouchTap') {
        key = 'onclick';
    }

    return key.toLowerCase();
}

// Mobile Safari does not fire properly bubble click events on
// non-interactive elements, which means delegated click listeners do not
// fire. The workaround for this bug involves attaching an empty click
// listener on the target node.
var inMobile = ('ontouchstart' in document);
var emptyFunction = function emptyFunction() {};
var ON_CLICK_KEY = 'onclick';

var eventTypes = {};

function addEvent(elem, eventType, listener) {
    eventType = getEventName(eventType);

    var eventStore = elem.eventStore || (elem.eventStore = {});
    eventStore[eventType] = listener;

    if (unbubbleEvents[eventType] === 1) {
        elem[eventType] = dispatchUnbubbleEvent;
        return;
    } else if (!eventTypes[eventType]) {
        // onclick -> click
        document.addEventListener(eventType.substr(2), dispatchEvent, false);
        eventTypes[eventType] = true;
    }

    if (inMobile && eventType === ON_CLICK_KEY) {
        elem.addEventListener('click', emptyFunction, false);
        return;
    }

    var nodeName = elem.nodeName;

    if (eventType === 'onchange' && supportInputEvent(elem)) {
        addEvent(elem, 'oninput', listener);
    }
}

function removeEvent(elem, eventType) {
    eventType = getEventName(eventType);

    var eventStore = elem.eventStore || (elem.eventStore = {});
    delete eventStore[eventType];

    if (unbubbleEvents[eventType] === 1) {
        elem[eventType] = null;
        return;
    } else if (inMobile && eventType === ON_CLICK_KEY) {
        elem.removeEventListener('click', emptyFunction, false);
        return;
    }

    var nodeName = elem.nodeName;

    if (eventType === 'onchange' && supportInputEvent(elem)) {
        delete eventStore['oninput'];
    }
}

function dispatchEvent(event) {
    var target = event.target;
    var type = event.type;

    var eventType = 'on' + type;
    var syntheticEvent = undefined;

    _Component.updateQueue.isPending = true;
    while (target) {
        var _target = target;
        var eventStore = _target.eventStore;

        var listener = eventStore && eventStore[eventType];
        if (!listener) {
            target = target.parentNode;
            continue;
        }
        if (!syntheticEvent) {
            syntheticEvent = createSyntheticEvent(event);
        }
        syntheticEvent.currentTarget = target;
        listener.call(target, syntheticEvent);
        if (syntheticEvent.$cancelBubble) {
            break;
        }
        target = target.parentNode;
    }
    _Component.updateQueue.isPending = false;
    _Component.updateQueue.batchUpdate();
}

function dispatchUnbubbleEvent(event) {
    var target = event.currentTarget || event.target;
    var eventType = 'on' + event.type;
    var syntheticEvent = createSyntheticEvent(event);

    syntheticEvent.currentTarget = target;
    _Component.updateQueue.isPending = true;

    var eventStore = target.eventStore;

    var listener = eventStore && eventStore[eventType];
    if (listener) {
        listener.call(target, syntheticEvent);
    }

    _Component.updateQueue.isPending = false;
    _Component.updateQueue.batchUpdate();
}

function createSyntheticEvent(nativeEvent) {
    var syntheticEvent = {};
    var cancelBubble = function cancelBubble() {
        return syntheticEvent.$cancelBubble = true;
    };
    syntheticEvent.nativeEvent = nativeEvent;
    syntheticEvent.persist = _.noop;
    for (var key in nativeEvent) {
        if (typeof nativeEvent[key] !== 'function') {
            syntheticEvent[key] = nativeEvent[key];
        } else if (key === 'stopPropagation' || key === 'stopImmediatePropagation') {
            syntheticEvent[key] = cancelBubble;
        } else {
            syntheticEvent[key] = nativeEvent[key].bind(nativeEvent);
        }
    }
    return syntheticEvent;
}

function supportInputEvent(elem) {
    var nodeName = elem.nodeName && elem.nodeName.toLowerCase();
    return nodeName !== 'select' && !(nodeName === 'input' && elem.type === 'file');
}