'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});
exports['default'] = Component;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _util = require('./util');

var _ = _interopRequireWildcard(_util);

var _virtualDom = require('./virtual-dom');

var updateQueue = {
	updaters: [],
	isPending: false,
	add: function add(updater) {
		_.addItem(this.updaters, updater);
	},
	batchUpdate: function batchUpdate() {
		if (this.isPending) {
			return;
		}
		this.isPending = true;
		/*
   each updater.update may add new updater to updateQueue
   clear them with a loop
   event bubbles from bottom-level to top-level
   reverse the updater order can merge some props and state and reduce the refresh times
   see Updater.update method below to know why
  */
		var updaters = this.updaters;

		var updater = undefined;
		while (updater = updaters.pop()) {
			updater.updateComponent();
		}
		this.isPending = false;
	}
};

exports.updateQueue = updateQueue;
function Updater(instance) {
	this.instance = instance;
	this.pendingStates = [];
	this.pendingCallbacks = [];
	this.isPending = false;
	this.nextProps = this.nextContext = null;
	this.clearCallbacks = this.clearCallbacks.bind(this);
}

Updater.prototype = {
	emitUpdate: function emitUpdate(nextProps, nextContext) {
		this.nextProps = nextProps;
		this.nextContext = nextContext;
		// receive nextProps!! should update immediately
		nextProps || !updateQueue.isPending ? this.updateComponent() : updateQueue.add(this);
	},
	updateComponent: function updateComponent() {
		var instance = this.instance;
		var pendingStates = this.pendingStates;
		var nextProps = this.nextProps;
		var nextContext = this.nextContext;

		if (nextProps || pendingStates.length > 0) {
			nextProps = nextProps || instance.props;
			nextContext = nextContext || instance.context;
			this.nextProps = this.nextContext = null;
			// merge the nextProps and nextState and update by one time
			shouldUpdate(instance, nextProps, this.getState(), nextContext, this.clearCallbacks);
		}
	},
	addState: function addState(nextState) {
		if (nextState) {
			_.addItem(this.pendingStates, nextState);
			if (!this.isPending) {
				this.emitUpdate();
			}
		}
	},
	replaceState: function replaceState(nextState) {
		var pendingStates = this.pendingStates;

		pendingStates.pop();
		// push special params to point out should replace state
		_.addItem(pendingStates, [nextState]);
	},
	getState: function getState() {
		var instance = this.instance;
		var pendingStates = this.pendingStates;
		var state = instance.state;
		var props = instance.props;

		if (pendingStates.length) {
			state = _.extend({}, state);
			pendingStates.forEach(function (nextState) {
				var isReplace = _.isArr(nextState);
				if (isReplace) {
					nextState = nextState[0];
				}
				if (_.isFn(nextState)) {
					nextState = nextState.call(instance, state, props);
				}
				// replace state
				if (isReplace) {
					state = _.extend({}, nextState);
				} else {
					_.extend(state, nextState);
				}
			});
			pendingStates.length = 0;
		}
		return state;
	},
	clearCallbacks: function clearCallbacks() {
		var pendingCallbacks = this.pendingCallbacks;
		var instance = this.instance;

		if (pendingCallbacks.length > 0) {
			this.pendingCallbacks = [];
			pendingCallbacks.forEach(function (callback) {
				return callback.call(instance);
			});
		}
	},
	addCallback: function addCallback(callback) {
		if (_.isFn(callback)) {
			_.addItem(this.pendingCallbacks, callback);
		}
	}
};

function Component(props, context) {
	this.$updater = new Updater(this);
	this.$cache = { isMounted: false };
	this.props = props;
	this.state = {};
	this.refs = {};
	this.context = context;
}

var ReactComponentSymbol = {};

Component.prototype = {
	constructor: Component,
	isReactComponent: ReactComponentSymbol,
	// getChildContext: _.noop,
	// componentWillUpdate: _.noop,
	// componentDidUpdate: _.noop,
	// componentWillReceiveProps: _.noop,
	// componentWillMount: _.noop,
	// componentDidMount: _.noop,
	// componentWillUnmount: _.noop,
	// shouldComponentUpdate(nextProps, nextState) {
	// 	return true
	// },
	forceUpdate: function forceUpdate(callback) {
		var $updater = this.$updater;
		var $cache = this.$cache;
		var props = this.props;
		var state = this.state;
		var context = this.context;

		if (!$cache.isMounted) {
			return;
		}
		// if updater is pending, add state to trigger nexttick update
		if ($updater.isPending) {
			$updater.addState(state);
			return;
		}
		var nextProps = $cache.props || props;
		var nextState = $cache.state || state;
		var nextContext = $cache.context || context;
		var parentContext = $cache.parentContext;
		var node = $cache.node;
		var vnode = $cache.vnode;
		$cache.props = $cache.state = $cache.context = null;
		$updater.isPending = true;
		if (this.componentWillUpdate) {
			this.componentWillUpdate(nextProps, nextState, nextContext);
		}
		this.state = nextState;
		this.props = nextProps;
		this.context = nextContext;
		var newVnode = (0, _virtualDom.renderComponent)(this);
		var newNode = (0, _virtualDom.compareTwoVnodes)(vnode, newVnode, node, (0, _virtualDom.getChildContext)(this, parentContext));
		if (newNode !== node) {
			newNode.cache = newNode.cache || {};
			(0, _virtualDom.syncCache)(newNode.cache, node.cache, newNode);
		}
		$cache.vnode = newVnode;
		$cache.node = newNode;
		(0, _virtualDom.clearPending)();
		if (this.componentDidUpdate) {
			this.componentDidUpdate(props, state, context);
		}
		if (callback) {
			callback.call(this);
		}
		$updater.isPending = false;
		$updater.emitUpdate();
	},
	setState: function setState(nextState, callback) {
		var $updater = this.$updater;

		$updater.addCallback(callback);
		$updater.addState(nextState);
	},
	replaceState: function replaceState(nextState, callback) {
		var $updater = this.$updater;

		$updater.addCallback(callback);
		$updater.replaceState(nextState);
	},
	getDOMNode: function getDOMNode() {
		var node = this.$cache.node;
		return node && node.nodeName === '#comment' ? null : node;
	},
	isMounted: function isMounted() {
		return this.$cache.isMounted;
	}
};

function shouldUpdate(component, nextProps, nextState, nextContext, callback) {
	var shouldComponentUpdate = true;
	if (component.shouldComponentUpdate) {
		shouldComponentUpdate = component.shouldComponentUpdate(nextProps, nextState, nextContext);
	}
	if (shouldComponentUpdate === false) {
		component.props = nextProps;
		component.state = nextState;
		component.context = nextContext || {};
		return;
	}
	var cache = component.$cache;
	cache.props = nextProps;
	cache.state = nextState;
	cache.context = nextContext || {};
	component.forceUpdate(callback);
}