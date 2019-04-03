'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = PureComponent;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _shallowEqual = require('./shallowEqual');

var _shallowEqual2 = _interopRequireDefault(_shallowEqual);

var _Component = require('./Component');

var _Component2 = _interopRequireDefault(_Component);

function PureComponent(props, context) {
	_Component2['default'].call(this, props, context);
}

PureComponent.prototype = Object.create(_Component2['default'].prototype);
PureComponent.prototype.constructor = PureComponent;
PureComponent.prototype.isPureReactComponent = true;
PureComponent.prototype.shouldComponentUpdate = shallowCompare;

function shallowCompare(nextProps, nextState) {
	return !(0, _shallowEqual2['default'])(this.props, nextProps) || !(0, _shallowEqual2['default'])(this.state, nextState);
}
module.exports = exports['default'];