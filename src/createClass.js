import * as _ from './util'
import Component from './Component'

let eachMixin = (mixins, iteratee) => {
	_.eachItem(mixins, mixin => {
		if (_.isArr(mixin.mixins)) {
			eachMixin(mixin.mixins, iteratee)
		}
		iteratee(mixin)
	})
}

let combineMixinToProto = (proto, mixin) => {
	_.mapValue(mixin, (value, key) => {
		if (key === 'getInitialState') {
			proto.$getInitialStates.push(value)
			return
		}
		let curValue = proto[key]
		if (_.isFn(curValue) && _.isFn(value)) {
			proto[key] = _.pipe(curValue, value)
		} else {
			proto[key] = value
		}
	})
}

let combineMixinToClass = (Component, mixin) => {
	if (_.isObj(mixin.propTypes)) {
		_.extend(Component.propTypes, mixin.propTypes)
	}
	if (_.isObj(mixin.contextTypes)) {
		_.extend(Component.contextTypes, mixin.contextTypes)
	}
	if (_.isFn(mixin.getDefaultProps)) {
		_.extend(Component.defaultProps, mixin.getDefaultProps())
	}
	if (_.isObj(mixin.statics)) {
		_.extend(Component, mixin.statics)
	}
}

let bindContext = (obj, source) => {
	_.mapValue(source, (value, key) => {
		if (_.isFn(value)) {
			obj[key] = value.bind(obj)
		}
	})
}

let Facade = function() {}
Facade.prototype = Component.prototype

let getInitialState = function() {
	let state = {}
	let setState = this.setState
	this.setState = Facade
	_.eachItem(this.$getInitialStates, getInitialState => {
		if (_.isFn(getInitialState)) {
			_.extend(state, getInitialState.call(this))
		}
	})
	this.setState = setState
	return state
}

export let createClass = spec => {
	if (!_.isFn(spec.render)) {
		throw new Error('createClass: spec.render is not function')
	}
	let specMixins = spec.mixins || []
	let mixins = specMixins.concat(spec)
	spec.mixins = null
	function Class(props, context) {
		Component.call(this, props, context)
		this.constructor = Class
		spec.autobind !== false && bindContext(this, Class.prototype)
		this.state = this.getInitialState() || this.state
	}
	Class.displayName = spec.displayName
	Class.contextTypes = {}
	Class.propTypes = {}
	Class.defaultProps = {}
	let proto = Class.prototype = new Facade()
	proto.$getInitialStates = []
	eachMixin(mixins, mixin => {
		combineMixinToProto(proto, mixin)
		combineMixinToClass(Class, mixin)
	})
	proto.getInitialState = getInitialState
	spec.mixins = specMixins
	return Class
}

export default createClass
