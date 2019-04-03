'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _Component = require('./Component');

var _Component2 = _interopRequireDefault(_Component);

var _PureComponent = require('./PureComponent');

var _PureComponent2 = _interopRequireDefault(_PureComponent);

var _createClass = require('./createClass');

var _createClass2 = _interopRequireDefault(_createClass);

var _createElement = require('./createElement');

var _createElement2 = _interopRequireDefault(_createElement);

var _Children = require('./Children');

var Children = _interopRequireWildcard(_Children);

var _ReactDOM = require('./ReactDOM');

var ReactDOM = _interopRequireWildcard(_ReactDOM);

var _PropTypes = require('./PropTypes');

var _PropTypes2 = _interopRequireDefault(_PropTypes);

var _DOM = require('./DOM');

var _DOM2 = _interopRequireDefault(_DOM);

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

var React = _.extend({
    version: '0.15.1',
    cloneElement: _createElement.cloneElement,
    isValidElement: _createElement.isValidElement,
    createElement: _createElement2['default'],
    createFactory: _createElement.createFactory,
    Component: _Component2['default'],
    PureComponent: _PureComponent2['default'],
    createClass: _createClass2['default'],
    Children: Children,
    PropTypes: _PropTypes2['default'],
    DOM: _DOM2['default']
}, ReactDOM);

React.__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactDOM;

exports['default'] = React;
module.exports = exports['default'];