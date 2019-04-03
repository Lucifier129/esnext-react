'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = createClass;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

var _Component = require('./Component');

var _Component2 = _interopRequireDefault(_Component);

function eachMixin(mixins, iteratee) {
	mixins.forEach(function (mixin) {
		if (mixin) {
			if (_.isArr(mixin.mixins)) {
				eachMixin(mixin.mixins, iteratee);
			}
			iteratee(mixin);
		}
	});
}

function combineMixinToProto(proto, mixin) {
	for (var key in mixin) {
		if (!mixin.hasOwnProperty(key)) {
			continue;
		}
		var value = mixin[key];
		if (key === 'getInitialState') {
			_.addItem(proto.$getInitialStates, value);
			continue;
		}
		var curValue = proto[key];
		if (_.isFn(curValue) && _.isFn(value)) {
			proto[key] = _.pipe(curValue, value);
		} else {
			proto[key] = value;
		}
	}
}

function combineMixinToClass(Component, mixin) {
	if (mixin.propTypes) {
		Component.propTypes = Component.propTypes || {};
		_.extend(Component.propTypes, mixin.propTypes);
	}
	if (mixin.contextTypes) {
		Component.contextTypes = Component.contextTypes || {};
		_.extend(Component.contextTypes, mixin.contextTypes);
	}
	_.extend(Component, mixin.statics);
	if (_.isFn(mixin.getDefaultProps)) {
		Component.defaultProps = Component.defaultProps || {};
		_.extend(Component.defaultProps, mixin.getDefaultProps());
	}
}

function bindContext(obj, source) {
	for (var key in source) {
		if (source.hasOwnProperty(key)) {
			if (_.isFn(source[key])) {
				obj[key] = source[key].bind(obj);
			}
		}
	}
}

var Facade = function Facade() {};
Facade.prototype = _Component2['default'].prototype;

function getInitialState() {
	var _this = this;

	var state = {};
	var setState = this.setState;
	this.setState = Facade;
	this.$getInitialStates.forEach(function (getInitialState) {
		if (_.isFn(getInitialState)) {
			_.extend(state, getInitialState.call(_this));
		}
	});
	this.setState = setState;
	return state;
}

function createClass(spec) {
	if (!_.isFn(spec.render)) {
		throw new Error('createClass: spec.render is not function');
	}
	var specMixins = spec.mixins || [];
	var mixins = specMixins.concat(spec);
	spec.mixins = null;
	function Klass(props, context) {
		_Component2['default'].call(this, props, context);
		this.constructor = Klass;
		spec.autobind !== false && bindContext(this, Klass.prototype);
		this.state = this.getInitialState() || this.state;
	}
	Klass.displayName = spec.displayName;
	var proto = Klass.prototype = new Facade();
	proto.$getInitialStates = [];
	eachMixin(mixins, function (mixin) {
		combineMixinToProto(proto, mixin);
		combineMixinToClass(Klass, mixin);
	});
	proto.getInitialState = getInitialState;
	spec.mixins = specMixins;
	return Klass;
}

module.exports = exports['default'];