/**
 * DOM Property Operations
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.setPropValue = setPropValue;
exports.removePropValue = removePropValue;

var _DOMConfig = require('./DOMConfig');

/**
 * Sets the value for a property on a node.
 *
 * @param {DOMElement} node
 * @param {string} name
 * @param {*} value
 */

function setPropValue(node, name, value) {
    var propInfo = _DOMConfig.properties.hasOwnProperty(name) && _DOMConfig.properties[name];
    if (propInfo) {
        // should delete value from dom
        if (value == null || propInfo.hasBooleanValue && !value || propInfo.hasNumericValue && isNaN(value) || propInfo.hasPositiveNumericValue && value < 1 || propInfo.hasOverloadedBooleanValue && value === false) {
            removePropValue(node, name);
        } else if (propInfo.mustUseProperty) {
            var propName = propInfo.propertyName;
            // dom.value has side effect
            if (propName !== 'value' || '' + node[propName] !== '' + value) {
                node[propName] = value;
            }
        } else {
            var attributeName = propInfo.attributeName;
            var namespace = propInfo.attributeNamespace;

            // `setAttribute` with objects becomes only `[object]` in IE8/9,
            // ('' + value) makes it output the correct toString()-value.
            if (namespace) {
                node.setAttributeNS(namespace, attributeName, '' + value);
            } else if (propInfo.hasBooleanValue || propInfo.hasOverloadedBooleanValue && value === true) {
                node.setAttribute(attributeName, '');
            } else {
                node.setAttribute(attributeName, '' + value);
            }
        }
    } else if ((0, _DOMConfig.isCustomAttribute)(name) && _DOMConfig.VALID_ATTRIBUTE_NAME_REGEX.test(name)) {
        if (value == null) {
            node.removeAttribute(name);
        } else {
            node.setAttribute(name, '' + value);
        }
    }
}

/**
 * Deletes the value for a property on a node.
 *
 * @param {DOMElement} node
 * @param {string} name
 */

function removePropValue(node, name) {
    var propInfo = _DOMConfig.properties.hasOwnProperty(name) && _DOMConfig.properties[name];
    if (propInfo) {
        if (propInfo.mustUseProperty) {
            var propName = propInfo.propertyName;
            if (propInfo.hasBooleanValue) {
                node[propName] = false;
            } else {
                // dom.value accept string value has side effect
                if (propName !== 'value' || '' + node[propName] !== '') {
                    node[propName] = '';
                }
            }
        } else {
            node.removeAttribute(propInfo.attributeName);
        }
    } else if ((0, _DOMConfig.isCustomAttribute)(name)) {
        node.removeAttribute(name);
    }
}