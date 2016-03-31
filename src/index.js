import Component from './Component'
import createClass from './createClass'
import createElement, { isValidElement, cloneElement, createFactory } from './createElement'
import * as Children from './Children'
import * as ReactDOM from './ReactDOM'
import PropTypes from './PropTypes'
import DOM from './DOM'
import * as _ from './util'

let React = _.extend({
    version: '0.15.1',
    cloneElement,
    isValidElement,
    createElement,
    createFactory,
    Component,
    createClass,
    Children,
    PropTypes,
    DOM,
    __spread: _.extend
}, ReactDOM)

React.__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactDOM

export default React