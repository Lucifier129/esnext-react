/*!
 * react-lite.js v0.15.5
 * (c) 2016 Jade Gu
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  global.React = factory();
}(this, function () { 'use strict';

  var TRUE = true;
  var xlink = 'http://www.w3.org/1999/xlink';
  var xml = 'http://www.w3.org/XML/1998/namespace';

  var SVGNamespaceURI = 'http://www.w3.org/2000/svg';
  var COMPONENT_ID = 'liteid';

  var VELEMENT = 2;
  var VSTATELESS = 3;
  var VCOMPONENT = 4;
  var VCOMMENT = 5;

  var propAlias = {
      // svg attributes alias
      clipPath: 'clip-path',
      fillOpacity: 'fill-opacity',
      fontFamily: 'font-family',
      fontSize: 'font-size',
      markerEnd: 'marker-end',
      markerMid: 'marker-mid',
      markerStart: 'marker-start',
      stopColor: 'stop-color',
      stopOpacity: 'stop-opacity',
      strokeDasharray: 'stroke-dasharray',
      strokeLinecap: 'stroke-linecap',
      strokeOpacity: 'stroke-opacity',
      strokeWidth: 'stroke-width',
      textAnchor: 'text-anchor',
      xlinkActuate: 'xlink:actuate',
      xlinkArcrole: 'xlink:arcrole',
      xlinkHref: 'xlink:href',
      xlinkRole: 'xlink:role',
      xlinkShow: 'xlink:show',
      xlinkTitle: 'xlink:title',
      xlinkType: 'xlink:type',
      xmlBase: 'xml:base',
      xmlLang: 'xml:lang',
      xmlSpace: 'xml:space',
      // DOM attributes alias
      acceptCharset: 'accept-charset',
      className: 'class',
      htmlFor: 'for',
      httpEquiv: 'http-equiv',
      // DOM property alias
      autoCompconste: 'autocompconste',
      autoFocus: 'autofocus',
      autoPlay: 'autoplay',
      autoSave: 'autosave',
      hrefLang: 'hreflang',
      radioGroup: 'radiogroup',
      spellCheck: 'spellcheck',
      srcDoc: 'srcdoc',
      srcSet: 'srcset'
  };

  var attributesNS = {
      xlinkActuate: xlink,
      xlinkArcrole: xlink,
      xlinkHref: xlink,
      xlinkRole: xlink,
      xlinkShow: xlink,
      xlinkTitle: xlink,
      xlinkType: xlink,
      xmlBase: xml,
      xmlLang: xml,
      xmlSpace: xml
  };

  // those keys must use be attributes
  var attrbutesConfigs = {
      children: TRUE,
      type: TRUE,
      clipPath: TRUE,
      cx: TRUE,
      cy: TRUE,
      d: TRUE,
      dx: TRUE,
      dy: TRUE,
      fill: TRUE,
      fillOpacity: TRUE,
      fontFamily: TRUE,
      fontSize: TRUE,
      fx: TRUE,
      fy: TRUE,
      gradientTransform: TRUE,
      gradientUnits: TRUE,
      markerEnd: TRUE,
      markerMid: TRUE,
      markerStart: TRUE,
      offset: TRUE,
      opacity: TRUE,
      patternContentUnits: TRUE,
      patternUnits: TRUE,
      points: TRUE,
      preserveAspectRatio: TRUE,
      r: TRUE,
      rx: TRUE,
      ry: TRUE,
      spreadMethod: TRUE,
      stopColor: TRUE,
      stopOpacity: TRUE,
      stroke: TRUE,
      strokeDasharray: TRUE,
      strokeLinecap: TRUE,
      strokeOpacity: TRUE,
      strokeWidth: TRUE,
      textAnchor: TRUE,
      transform: TRUE,
      version: TRUE,
      viewBox: TRUE,
      x1: TRUE,
      x2: TRUE,
      x: TRUE,
      xlinkActuate: TRUE,
      xlinkArcrole: TRUE,
      xlinkHref: TRUE,
      xlinkRole: TRUE,
      xlinkShow: TRUE,
      xlinkTitle: TRUE,
      xlinkType: TRUE,
      xmlBase: TRUE,
      xmlLang: TRUE,
      xmlSpace: TRUE,
      y1: TRUE,
      y2: TRUE,
      y: TRUE,

      /**
       * Standard Properties
       */
      allowFullScreen: TRUE,
      allowTransparency: TRUE,
      // capture: TRUE,
      charSet: TRUE,
      challenge: TRUE,
      classID: TRUE,
      cols: TRUE,
      contextMenu: TRUE,
      dateTime: TRUE,
      // disabled: TRUE,
      form: TRUE,
      formAction: TRUE,
      formEncType: TRUE,
      formMethod: TRUE,
      formTarget: TRUE,
      frameBorder: TRUE,
      height: TRUE,
      // hidden: TRUE,
      inputMode: TRUE,
      is: TRUE,
      keyParams: TRUE,
      keyType: TRUE,
      list: TRUE,
      manifest: TRUE,
      maxLength: TRUE,
      media: TRUE,
      minLength: TRUE,
      nonce: TRUE,
      role: TRUE,
      rows: TRUE,
      // seamless: TRUE,
      size: TRUE,
      sizes: TRUE,
      srcSet: TRUE,
      width: TRUE,
      wmode: TRUE,
      /**
       * RDFa Properties
       */
      about: TRUE,
      datatype: TRUE,
      inlist: TRUE,
      prefix: TRUE,
      // property is also supported for OpenGraph in meta tags.
      property: TRUE,
      resource: TRUE,
      'typeof': TRUE,
      vocab: TRUE,
      /**
       * Non-standard Properties
       */
      // autoCapitalize and autoCorrect are supported in Mobile Safari for
      // keyboard hints.
      autoCapitalize: TRUE,
      autoCorrect: TRUE,
      // itemProp, itemScope, itemType are for
      // Microdata support. See http://schema.org/docs/gs.html
      itemProp: TRUE,
      // itemScope: TRUE,
      itemType: TRUE,
      // itemID and itemRef are for Microdata support as well but
      // only specified in the the WHATWG spec document. See
      // https://html.spec.whatwg.org/multipage/microdata.html#microdata-dom-api
      itemID: TRUE,
      itemRef: TRUE,
      // IE-only attribute that specifies security restrictions on an iframe
      // as an alternative to the sandbox attribute on IE<10
      security: TRUE,
      // IE-only attribute that controls focus behavior
      unselectable: TRUE
  };

  var readOnlyProps = {
      nodeName: TRUE,
      nodeValue: TRUE,
      nodeType: TRUE,
      parentNode: TRUE,
      childNodes: TRUE,
      classList: TRUE,
      firstChild: TRUE,
      lastChild: TRUE,
      previousSibling: TRUE,
      previousElementSibling: TRUE,
      nextSibling: TRUE,
      nextElementSibling: TRUE,
      attributes: TRUE,
      ownerDocument: TRUE,
      namespaceURI: TRUE,
      localName: TRUE,
      baseURI: TRUE,
      prefix: TRUE,
      length: TRUE,
      specified: TRUE,
      tagName: TRUE,
      offsetTop: TRUE,
      offsetLeft: TRUE,
      offsetWidth: TRUE,
      offsetHeight: TRUE,
      offsetParent: TRUE,
      scrollWidth: TRUE,
      scrollHeight: TRUE,
      clientTop: TRUE,
      clientLeft: TRUE,
      clientWidth: TRUE,
      clientHeight: TRUE,
      x: TRUE,
      y: TRUE
  };

  var isUnitlessNumber = {
      animationIterationCount: TRUE,
      boxFlex: TRUE,
      boxFlexGroup: TRUE,
      boxOrdinalGroup: TRUE,
      columnCount: TRUE,
      flex: TRUE,
      flexGrow: TRUE,
      flexPositive: TRUE,
      flexShrink: TRUE,
      flexNegative: TRUE,
      flexOrder: TRUE,
      fontWeight: TRUE,
      lineClamp: TRUE,
      lineHeight: TRUE,
      opacity: TRUE,
      order: TRUE,
      orphans: TRUE,
      tabSize: TRUE,
      widows: TRUE,
      zIndex: TRUE,
      zoom: TRUE,

      // SVG-related properties
      fillOpacity: TRUE,
      stopOpacity: TRUE,
      strokeDashoffset: TRUE,
      strokeOpacity: TRUE,
      strokeWidth: TRUE
  };

  var eventNameAlias = {
      onDoubleClick: 'ondblclick'
  };

  var notBubbleEvents = {
      onmouseleave: TRUE,
      onmouseenter: TRUE,
      onload: TRUE,
      onunload: TRUE,
      onscroll: TRUE,
      onfocus: TRUE,
      onblur: TRUE,
      onrowexit: TRUE,
      onbeforeunload: TRUE,
      onstop: TRUE,
      ondragdrop: TRUE,
      ondragenter: TRUE,
      ondragexit: TRUE,
      ondraggesture: TRUE,
      ondragover: TRUE,
      oncontextmenu: TRUE
  };

  var refs = null;

  function createVelem(type, props) {
      return {
          vtype: VELEMENT,
          type: type,
          props: props,
          refs: refs
      };
  }

  function createVstateless(type, props) {
      return {
          vtype: VSTATELESS,
          id: getUid(),
          type: type,
          props: props
      };
  }

  function createVcomponent(type, props) {
      return {
          vtype: VCOMPONENT,
          id: getUid(),
          type: type,
          props: props,
          refs: refs
      };
  }

  function createVcomment(comment) {
      return {
          vtype: VCOMMENT,
          comment: comment
      };
  }

  function initVnode(vnode, parentContext, namespaceURI) {
      var vtype = vnode.vtype;

      var node = null;
      if (!vtype) {
          node = document.createTextNode(vnode);
      } else if (vtype === VELEMENT) {
          node = initVelem(vnode, parentContext, namespaceURI);
      } else if (vtype === VCOMPONENT) {
          node = initVcomponent(vnode, parentContext, namespaceURI);
      } else if (vtype === VSTATELESS) {
          node = initVstateless(vnode, parentContext, namespaceURI);
      } else if (vtype === VCOMMENT) {
          node = document.createComment(vnode.comment);
      }
      return node;
  }

  function destroyVnode(vnode, node) {
      var vtype = vnode.vtype;

      if (vtype === VELEMENT) {
          destroyVelem(vnode, node);
      } else if (vtype === VCOMPONENT) {
          destroyVcomponent(vnode, node);
      } else if (vtype === VSTATELESS) {
          destroyVstateless(vnode, node);
      }
  }

  function initVelem(velem, parentContext, namespaceURI) {
      var type = velem.type;
      var props = velem.props;

      var node = null;

      if (type === 'svg' || namespaceURI === SVGNamespaceURI) {
          node = document.createElementNS(SVGNamespaceURI, type);
          namespaceURI = SVGNamespaceURI;
      } else {
          node = document.createElement(type);
      }

      var children = props.children;

      var vchildren = node.vchildren = [];
      if (isArr(children)) {
          flattenChildren(children, collectChild, vchildren);
      } else {
          collectChild(children, vchildren);
      }

      for (var i = 0, len = vchildren.length; i < len; i++) {
          node.appendChild(initVnode(vchildren[i], parentContext, namespaceURI));
      }

      setProps(node, props);

      if (velem.ref !== null) {
          attachRef(velem.refs, velem.ref, node);
      }

      return node;
  }

  function collectChild(child, children) {
      if (child != null && typeof child !== 'boolean') {
          children.push(child.vtype ? child : '' + child);
      }
  }

  function updateVelem(velem, newVelem, node, parentContext) {
      var props = velem.props;

      var newProps = newVelem.props;
      var oldHtml = props.dangerouslySetInnerHTML && props.dangerouslySetInnerHTML.__html;
      var newChildren = newProps.children;
      var vchildren = node.vchildren;
      var childNodes = node.childNodes;
      var namespaceURI = node.namespaceURI;

      var vchildrenLen = vchildren.length;
      var newVchildren = node.vchildren = [];

      if (isArr(newChildren)) {
          flattenChildren(newChildren, collectChild, newVchildren);
      } else {
          collectChild(newChildren, newVchildren);
      }

      var newVchildrenLen = newVchildren.length;

      if (oldHtml == null && vchildrenLen) {
          var shouldRemove = [];
          var patches = Array(newVchildrenLen);

          outer: for (var i = 0; i < vchildrenLen; i++) {
              var vnode = vchildren[i];
              var type = vnode.type;
              var _refs = vnode.refs;
              var key = vnode.key;

              for (var j = 0; j < newVchildrenLen; j++) {
                  if (patches[j]) {
                      continue;
                  }
                  var newVnode = newVchildren[j];
                  if (newVnode === vnode || newVnode.type === type && newVnode.key === key && newVnode.refs === _refs) {
                      patches[j] = {
                          vnode: vnode,
                          node: childNodes[i]
                      };
                      continue outer;
                  }
              }
              destroyVnode(vnode, shouldRemove[shouldRemove.length] = childNodes[i]);
          }

          for (var i = 0, len = shouldRemove.length; i < len; i++) {
              node.removeChild(shouldRemove[i]);
          }

          for (var i = 0; i < newVchildrenLen; i++) {
              var newVnode = newVchildren[i];
              var patchItem = patches[i];
              if (patchItem) {
                  var vnode = patchItem.vnode;
                  var newChildNode = patchItem.node;
                  if (newVnode !== vnode) {
                      var vtype = newVnode.vtype;
                      if (!vtype) {
                          // textNode
                          // newChildNode.nodeValue = newVnode
                          newChildNode.replaceData(0, vnode.length, newVnode);
                      } else if (vtype === VELEMENT) {
                          newChildNode = updateVelem(vnode, newVnode, newChildNode, parentContext);
                      } else if (vtype === VCOMPONENT) {
                          newChildNode = updateVcomponent(vnode, newVnode, newChildNode, parentContext);
                      } else if (vtype === VSTATELESS) {
                          newChildNode = updateVstateless(vnode, newVnode, newChildNode, parentContext);
                      }
                  }
                  var currentNode = childNodes[i];
                  if (currentNode !== newChildNode) {
                      node.insertBefore(newChildNode, currentNode || null);
                  }
              } else {
                  var newChildNode = initVnode(newVnode, parentContext, namespaceURI);
                  node.insertBefore(newChildNode, childNodes[i] || null);
              }
          }
          patchProps(node, props, newProps);
      } else {
          // should patch props first, make sure innerHTML was cleared
          patchProps(node, props, newProps);
          for (var i = 0; i < newVchildrenLen; i++) {
              node.appendChild(initVnode(newVchildren[i], parentContext, namespaceURI));
          }
      }
      if (velem.ref !== null) {
          if (newVelem.ref !== null) {
              attachRef(newVelem.refs, newVelem.ref, node);
          } else {
              detachRef(velem.refs, velem.ref);
          }
      } else if (newVelem.ref !== null) {
          attachRef(newVelem.refs, newVelem.ref, node);
      }
      return node;
  }

  function destroyVelem(velem, node) {
      var props = velem.props;
      var vchildren = node.vchildren;
      var childNodes = node.childNodes;

      for (var i = 0, len = vchildren.length; i < len; i++) {
          destroyVnode(vchildren[i], childNodes[i]);
      }

      if (velem.ref !== null) {
          detachRef(velem.refs, velem.ref);
      }
      node.eventStore = node.vchildren = null;
      for (var key in props) {
          if (props.hasOwnProperty(key) && EVENT_KEYS.test(key)) {
              key = getEventName(key);
              if (notBubbleEvents[key] === true) {
                  node[key] = null;
              }
          }
      }
  }

  function initVstateless(vstateless, parentContext, namespaceURI) {
      var vnode = renderVstateless(vstateless, parentContext);
      var node = initVnode(vnode, parentContext, namespaceURI);
      node.cache = node.cache || {};
      node.cache[vstateless.id] = vnode;
      return node;
  }
  function updateVstateless(vstateless, newVstateless, node, parentContext) {
      var id = vstateless.id;
      var vnode = node.cache[id];
      delete node.cache[id];
      var newVnode = renderVstateless(newVstateless, parentContext);
      var newNode = compareTwoVnodes(vnode, newVnode, node, parentContext);
      newNode.cache = newNode.cache || {};
      newNode.cache[newVstateless.id] = newVnode;
      if (newNode !== node) {
          extend(newNode.cache, node.cache);
      }
      return newNode;
  }
  function destroyVstateless(vstateless, node) {
      var id = vstateless.id;
      var vnode = node.cache[id];
      delete node.cache[id];
      destroyVnode(vnode, node);
  }

  function renderVstateless(vstateless, parentContext) {
      var factory = vstateless.type;
      var props = vstateless.props;

      var componentContext = getContextByTypes(parentContext, factory.contextTypes);
      var vnode = factory(props, componentContext);
      if (vnode && vnode.render) {
          vnode = vnode.render();
      }
      if (vnode === null || vnode === false) {
          vnode = createVcomment('react-empty: ' + getUid());
      } else if (!vnode || !vnode.vtype) {
          throw new Error('@' + factory.name + '#render:You may have returned undefined, an array or some other invalid object');
      }
      return vnode;
  }

  function initVcomponent(vcomponent, parentContext, namespaceURI) {
      var Component = vcomponent.type;
      var props = vcomponent.props;
      var id = vcomponent.id;

      var componentContext = getContextByTypes(parentContext, Component.contextTypes);
      var component = new Component(props, componentContext);
      var updater = component.$updater;
      var cache = component.$cache;

      cache.parentContext = parentContext;
      updater.isPending = true;
      component.props = orObject(component.props) || props;
      component.context = orObject(component.context) || componentContext;

      if (component.componentWillMount) {
          component.componentWillMount();
          component.state = updater.getState();
      }
      var vnode = renderComponent(component, parentContext);
      var node = initVnode(vnode, vnode.context, namespaceURI);
      node.cache = node.cache || {};
      node.cache[id] = component;
      cache.vnode = vnode;
      cache.node = node;
      cache.isMounted = true;
      pendingComponents.push(component);
      if (vcomponent.ref !== null) {
          attachRef(vcomponent.refs, vcomponent.ref, component);
      }
      return node;
  }
  function updateVcomponent(vcomponent, newVcomponent, node, parentContext) {
      var id = vcomponent.id;
      var component = node.cache[id];
      var updater = component.$updater;
      var cache = component.$cache;
      var Component = newVcomponent.type;
      var nextProps = newVcomponent.props;

      var componentContext = getContextByTypes(parentContext, Component.contextTypes);
      delete node.cache[id];
      node.cache[newVcomponent.id] = component;
      cache.parentContext = parentContext;
      if (component.componentWillReceiveProps) {
          updater.isPending = true;
          component.componentWillReceiveProps(nextProps, componentContext);
          updater.isPending = false;
      }
      updater.emitUpdate(nextProps, componentContext);
      if (vcomponent.ref !== null) {
          if (newVcomponent.ref !== null) {
              attachRef(newVcomponent.refs, newVcomponent.ref, component);
          } else {
              detachRef(vcomponent.refs, vcomponent.ref);
          }
      } else if (newVcomponent.ref !== null) {
          attachRef(newVcomponent.refs, newVcomponent.ref, component);
      }
      return cache.node;
  }
  function destroyVcomponent(vcomponent, node) {
      var id = vcomponent.id;
      var component = node.cache[id];
      var cache = component.$cache;
      delete node.cache[id];
      if (vcomponent.ref !== null) {
          detachRef(vcomponent.refs, vcomponent.ref);
      }
      component.setState = component.forceUpdate = noop;
      if (component.componentWillUnmount) {
          component.componentWillUnmount();
      }
      destroyVnode(cache.vnode, node);
      delete component.setState;
      cache.isMounted = false;
      cache.node = cache.parentContext = cache.vnode = component.refs = component.context = null;
  }

  function getContextByTypes(curContext, contextTypes) {
      var context = {};
      if (!contextTypes || !curContext) {
          return context;
      }
      for (var key in contextTypes) {
          if (contextTypes.hasOwnProperty(key)) {
              context[key] = curContext[key];
          }
      }
      return context;
  }

  function renderComponent(component, parentContext) {
      refs = component.refs;
      var vnode = component.render();

      if (vnode === null || vnode === false) {
          vnode = createVcomment('react-empty: ' + getUid());
      } else if (!vnode || !vnode.vtype) {
          throw new Error('@' + component.constructor.name + '#render:You may have returned undefined, an array or some other invalid object');
      }

      var curContext = refs = null;
      if (component.getChildContext) {
          curContext = component.getChildContext();
      }
      if (curContext) {
          curContext = extend(extend({}, parentContext), curContext);
      } else {
          curContext = parentContext;
      }
      vnode.context = curContext;
      return vnode;
  }

  var pendingComponents = [];

  function clearPendingComponents() {
      var components = pendingComponents;
      var len = components.length;
      if (!len) {
          return;
      }
      pendingComponents = [];
      var i = -1;
      while (len--) {
          var component = components[++i];
          var updater = component.$updater;
          if (component.componentDidMount) {
              component.componentDidMount();
          }
          updater.isPending = false;
          updater.emitUpdate();
      }
  }

  function compareTwoVnodes(vnode, newVnode, node, parentContext) {
      var newNode = node;

      if (newVnode == null) {
          // remove
          destroyVnode(vnode, node);
          node.parentNode.removeChild(node);
      } else if (vnode.type !== newVnode.type || newVnode.key !== vnode.key) {
          // replace
          destroyVnode(vnode, node);
          newNode = initVnode(newVnode, parentContext, node.namespaceURI);
          node.parentNode.replaceChild(newNode, node);
      } else if (vnode !== newVnode) {
          // same type and same key -> update
          var vtype = vnode.vtype;
          if (vtype === VELEMENT) {
              newNode = updateVelem(vnode, newVnode, node, parentContext);
          } else if (vtype === VCOMPONENT) {
              newNode = updateVcomponent(vnode, newVnode, node, parentContext);
          } else if (vtype === VSTATELESS) {
              newNode = updateVstateless(vnode, newVnode, node, parentContext);
          }
      }

      return newNode;
  }

  function getDOMNode() {
      return this;
  }

  function attachRef(refs, refKey, refValue) {
      if (!refs || refKey == null || !refValue) {
          return;
      }
      if (refValue.nodeName && !refValue.getDOMNode) {
          // support react v0.13 style: this.refs.myInput.getDOMNode()
          refValue.getDOMNode = getDOMNode;
      }
      if (isFn(refKey)) {
          refKey(refValue);
      } else {
          refs[refKey] = refValue;
      }
  }

  function detachRef(refs, refKey) {
      if (!refs || refKey == null) {
          return;
      }
      if (isFn(refKey)) {
          refKey(null);
      } else {
          delete refs[refKey];
      }
  }

  var updateQueue = {
  	updaters: [],
  	isPending: false,
  	add: function add(updater) {
  		this.updaters.push(updater);
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
  			this.pendingStates.push(nextState);
  			if (!this.isPending) {
  				this.emitUpdate();
  			}
  		}
  	},
  	replaceState: function replaceState(nextState) {
  		var pendingStates = this.pendingStates;

  		pendingStates.pop();
  		// push special params to point out should replace state
  		pendingStates.push([nextState]);
  	},
  	getState: function getState() {
  		var instance = this.instance;
  		var pendingStates = this.pendingStates;
  		var state = instance.state;
  		var props = instance.props;

  		if (pendingStates.length) {
  			state = extend({}, state);
  			eachItem(pendingStates, function (nextState) {
  				// replace state
  				if (isArr(nextState)) {
  					state = extend({}, nextState[0]);
  					return;
  				}
  				if (isFn(nextState)) {
  					nextState = nextState.call(instance, state, props);
  				}
  				extend(state, nextState);
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
  			eachItem(pendingCallbacks, function (callback) {
  				return callback.call(instance);
  			});
  		}
  	},
  	addCallback: function addCallback(callback) {
  		if (isFn(callback)) {
  			this.pendingCallbacks.push(callback);
  		}
  	}
  };
  function Component(props, context) {
  	this.$updater = new Updater(this);
  	this.$cache = { isMounted: false };
  	this.props = props;
  	this.state = {};
  	this.refs = {};
  	this.context = context || {};
  }

  Component.prototype = {
  	constructor: Component,
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

  		if ($updater.isPending || !$cache.isMounted) {
  			return;
  		}
  		var nextProps = $cache.props || props;
  		var nextState = $cache.state || state;
  		var nextContext = $cache.context || orObject(context) || {};
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
  		var newVnode = renderComponent(this, parentContext);
  		var newNode = compareTwoVnodes(vnode, newVnode, node, newVnode.context);
  		if (newNode !== node) {
  			newNode.cache = newNode.cache || {};
  			extend(newNode.cache, node.cache);
  		}
  		$cache.vnode = newVnode;
  		$cache.node = newNode;
  		clearPendingComponents();
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

  function getEventName(key) {
  	key = eventNameAlias[key] || key;
  	return key.toLowerCase();
  }

  var eventTypes = {};

  function addEvent(elem, eventType, listener) {
  	eventType = getEventName(eventType);

  	if (notBubbleEvents[eventType] === true) {
  		elem[eventType] = listener;
  		return;
  	}

  	var eventStore = elem.eventStore || (elem.eventStore = {});
  	eventStore[eventType] = listener;

  	if (!eventTypes[eventType]) {
  		// onclick -> click
  		document.addEventListener(eventType.substr(2), dispatchEvent);
  		eventTypes[eventType] = true;
  	}

  	var nodeName = elem.nodeName;

  	if (eventType === 'onchange' && (nodeName === 'INPUT' || nodeName === 'TEXTAREA')) {
  		addEvent(elem, 'oninput', listener);
  	}
  }

  function removeEvent(elem, eventType) {
  	eventType = getEventName(eventType);
  	if (notBubbleEvents[eventType] === true) {
  		elem[eventType] = null;
  		return;
  	}

  	var eventStore = elem.eventStore || (elem.eventStore = {});
  	delete eventStore[eventType];

  	var nodeName = elem.nodeName;

  	if (eventType === 'onchange' && (nodeName === 'INPUT' || nodeName === 'TEXTAREA')) {
  		delete eventStore['oninput'];
  	}
  }

  function dispatchEvent(event) {
  	var target = event.target;
  	var type = event.type;

  	var eventType = 'on' + type;
  	var syntheticEvent = undefined;
  	updateQueue.isPending = true;
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
  		if (syntheticEvent.$cancalBubble) {
  			break;
  		}
  		target = target.parentNode;
  	}
  	updateQueue.isPending = false;
  	updateQueue.batchUpdate();
  }

  function createSyntheticEvent(nativeEvent) {
  	var syntheticEvent = {};
  	var cancalBubble = function cancalBubble() {
  		return syntheticEvent.$cancalBubble = true;
  	};
  	syntheticEvent.nativeEvent = nativeEvent;
  	for (var key in nativeEvent) {
  		if (typeof nativeEvent[key] !== 'function') {
  			syntheticEvent[key] = nativeEvent[key];
  		} else if (key === 'stopPropagation' || key === 'stopImmediatePropagation') {
  			syntheticEvent[key] = cancalBubble;
  		} else {
  			syntheticEvent[key] = nativeEvent[key].bind(nativeEvent);
  		}
  	}
  	return syntheticEvent;
  }

  // Speed up calls to hasOwnProperty
  var hasOwnProperty = Object.prototype.hasOwnProperty;

  function orObject(obj) {
  	if (obj == null) return false;
  	if (obj.length > 0) return obj;
  	if (obj.length === 0) return false;

  	for (var key in obj) {
  		if (hasOwnProperty.call(obj, key)) return obj;
  	}
  	return false;
  }

  function isFn(obj) {
  	return typeof obj === 'function';
  }

  var isArr = Array.isArray;

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

  function flattenChildren(list, iteratee, a) {
  	var len = list.length;
  	var i = -1;

  	while (len--) {
  		var item = list[++i];
  		if (isArr(item)) {
  			flattenChildren(item, iteratee, a);
  		} else {
  			iteratee(item, a);
  		}
  	}
  }

  function eachItem(list, iteratee) {
  	for (var i = 0, len = list.length; i < len; i++) {
  		iteratee(list[i], i);
  	}
  }

  function mapValue(obj, iteratee) {
  	for (var key in obj) {
  		if (obj.hasOwnProperty(key)) {
  			iteratee(obj[key], key);
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
  		if (from[keys[i]] !== undefined) {
  			to[keys[i]] = from[keys[i]];
  		}
  	}
  	return to;
  }

  var uid = 0;

  function getUid() {
  	return ++uid;
  }

  var EVENT_KEYS = /^on/i;
  function setProp(elem, key, value) {
  	var originalKey = key;
  	key = propAlias[key] || key;

  	if (EVENT_KEYS.test(key)) {
  		addEvent(elem, key, value);
  	} else if (key === 'style') {
  		setStyle(elem, value);
  	} else if (key === 'dangerouslySetInnerHTML') {
  		value && value.__html != null && (elem.innerHTML = value.__html);
  	} else if (key in elem && attrbutesConfigs[originalKey] !== true) {
  		if (readOnlyProps[key] !== true) {
  			if (key === 'title' && value == null) {
  				value = '';
  			}
  			elem[key] = value;
  		}
  	} else {
  		if (value == null) {
  			elem.removeAttribute(key);
  		} else if (attributesNS.hasOwnProperty(originalKey)) {
  			elem.setAttributeNS(attributesNS[originalKey], key, value);
  		} else {
  			elem.setAttribute(key, value);
  		}
  	}
  }

  function setProps(elem, props) {
  	for (var key in props) {
  		if (props.hasOwnProperty(key) && key !== 'children') {
  			setProp(elem, key, props[key]);
  		}
  	}
  }

  function removeProp(elem, key, oldValue) {
  	key = propAlias[key] || key;

  	if (EVENT_KEYS.test(key)) {
  		removeEvent(elem, key);
  	} else if (key === 'style') {
  		removeStyle(elem, oldValue);
  	} else if (key === 'dangerouslySetInnerHTML') {
  		elem.innerHTML = '';
  	} else if (!(key in elem) || attrbutesConfigs[key] === true) {
  		elem.removeAttribute(key);
  	} else if (isFn(oldValue)) {
  		elem[key] = null;
  	} else if (typeof oldValue === 'string') {
  		elem[key] = '';
  	} else if (typeof oldValue === 'boolean') {
  		elem[key] = false;
  	} else {
  		try {
  			delete elem[key];
  		} catch (e) {
  			//pass
  		}
  	}
  }

  function patchProp(key, oldValue, value, elem) {
  	if (key === 'value' || key === 'checked') {
  		oldValue = elem[key];
  	}

  	if (value === oldValue) {
  		return;
  	}
  	if (value === undefined) {
  		removeProp(elem, key, oldValue);
  		return;
  	}
  	if (key === 'style') {
  		patchStyle(elem, oldValue, value);
  	} else if (key === 'dangerouslySetInnerHTML') {
  		var oldHtml = oldValue && oldValue.__html;
  		var html = value && value.__html;
  		if (html != null && html !== oldHtml) {
  			elem.innerHTML = html;
  		}
  	} else {
  		setProp(elem, key, value);
  	}
  }

  function patchProps(elem, props, newProps) {
  	var keyMap = { children: true };
  	for (var key in props) {
  		if (props.hasOwnProperty(key) && key !== 'children') {
  			keyMap[key] = true;
  			patchProp(key, props[key], newProps[key], elem);
  		}
  	}
  	for (var key in newProps) {
  		if (newProps.hasOwnProperty(key) && keyMap[key] !== true) {
  			patchProp(key, props[key], newProps[key], elem);
  		}
  	}
  }

  function removeStyle(elem, style) {
  	if (!style) {
  		return;
  	}
  	var elemStyle = elem.style;
  	for (var key in style) {
  		if (style.hasOwnProperty(key)) {
  			elemStyle[key] = '';
  		}
  	}
  }
  function setStyle(elem, style) {
  	if (!style) {
  		return;
  	}
  	var elemStyle = elem.style;
  	for (var key in style) {
  		if (style.hasOwnProperty(key)) {
  			setStyleValue(elemStyle, key, style[key]);
  		}
  	}
  }

  function patchStyle(elem, style, newStyle) {
  	if (style === newStyle) {
  		return;
  	}
  	if (!newStyle && style) {
  		removeStyle(elem, style);
  		return;
  	} else if (newStyle && !style) {
  		setStyle(elem, newStyle);
  		return;
  	}

  	var elemStyle = elem.style;
  	var keyMap = {};
  	for (var key in style) {
  		if (style.hasOwnProperty(key)) {
  			keyMap[key] = true;
  			if (style[key] !== newStyle[key]) {
  				setStyleValue(elemStyle, key, newStyle[key]);
  			}
  		}
  	}
  	for (var key in newStyle) {
  		if (newStyle.hasOwnProperty(key) && keyMap[key] !== true) {
  			if (style[key] !== newStyle[key]) {
  				setStyleValue(elemStyle, key, newStyle[key]);
  			}
  		}
  	}
  }

  var isUnitlessNumberWithPrefix = {};
  var prefixes = ['Webkit', 'ms', 'Moz', 'O'];
  var prefixKey = function prefixKey(prefix, key) {
  	return prefix + key.charAt(0).toUpperCase() + key.substring(1);
  };
  mapValue(isUnitlessNumber, function (_, prop) {
  	eachItem(prefixes, function (prefix) {
  		return isUnitlessNumberWithPrefix[prefixKey(prefix, prop)] = true;
  	});
  });
  mapValue(isUnitlessNumberWithPrefix, function (value, key) {
  	isUnitlessNumber[key] = value;
  });

  var RE_NUMBER = /^-?\d+(\.\d+)?$/;
  function setStyleValue(style, key, value) {
  	if (!isUnitlessNumber[key] && RE_NUMBER.test(value)) {
  		style[key] = value + 'px';
  	} else {
  		key = key === 'float' ? 'cssFloat' : key;
  		style[key] = value == null || typeof value === 'boolean' ? '' : value;
  	}
  }

  if (!Object.freeze) {
  	Object.freeze = identity;
  }

  var pendingRendering = {};
  var vnodeStore = {};
  function renderTreeIntoContainer(vnode, container, callback, parentContext) {
  	if (!vnode.vtype) {
  		throw new Error('cannot render ' + vnode + ' to container');
  	}
  	var id = container[COMPONENT_ID] || (container[COMPONENT_ID] = getUid());
  	var argsCache = pendingRendering[id];

  	// component lify cycle method maybe call root rendering
  	// should bundle them and render by only one time
  	if (argsCache) {
  		if (argsCache === true) {
  			pendingRendering[id] = argsCache = [vnode, callback, parentContext];
  		} else {
  			argsCache[0] = vnode;
  			argsCache[2] = parentContext;
  			if (callback) {
  				argsCache[1] = argsCache[1] ? pipe(argsCache[1], callback) : callback;
  			}
  		}
  		return;
  	}

  	pendingRendering[id] = true;
  	var oldVnode = null;
  	var rootNode = null;
  	if (oldVnode = vnodeStore[id]) {
  		rootNode = compareTwoVnodes(oldVnode, vnode, container.firstChild, parentContext);
  	} else {
  		rootNode = initVnode(vnode, parentContext, container.namespaceURI);
  		var childNode = null;
  		while (childNode = container.lastChild) {
  			container.removeChild(childNode);
  		}
  		container.appendChild(rootNode);
  	}
  	vnodeStore[id] = vnode;
  	var isPending = updateQueue.isPending;
  	updateQueue.isPending = true;
  	clearPendingComponents();
  	argsCache = pendingRendering[id];
  	delete pendingRendering[id];

  	var result = null;
  	if (isArr(argsCache)) {
  		result = renderTreeIntoContainer(argsCache[0], container, argsCache[1], argsCache[2]);
  	} else if (vnode.vtype === VELEMENT) {
  		result = rootNode;
  	} else if (vnode.vtype === VCOMPONENT) {
  		result = rootNode.cache[vnode.id];
  	}

  	if (!isPending) {
  		updateQueue.isPending = false;
  		updateQueue.batchUpdate();
  	}

  	if (callback) {
  		callback.call(result);
  	}

  	return result;
  }

  function render(vnode, container, callback) {
  	return renderTreeIntoContainer(vnode, container, callback);
  }

  function unstable_renderSubtreeIntoContainer(parentComponent, subVnode, container, callback) {
  	var context = parentComponent.vnode ? parentComponent.vnode.context : parentComponent.$cache.parentContext;
  	return renderTreeIntoContainer(subVnode, container, callback, context);
  }

  function unmountComponentAtNode(container) {
  	if (!container.nodeName) {
  		throw new Error('expect node');
  	}
  	var id = container[COMPONENT_ID];
  	var vnode = null;
  	if (vnode = vnodeStore[id]) {
  		destroyVnode(vnode, container.firstChild);
  		container.removeChild(container.firstChild);
  		delete vnodeStore[id];
  		return true;
  	}
  	return false;
  }

  function findDOMNode(node) {
  	if (node == null) {
  		return null;
  	}
  	if (node.nodeName) {
  		return node;
  	}
  	var component = node;
  	// if component.node equal to false, component must be unmounted
  	if (component.getDOMNode && component.$cache.isMounted) {
  		return component.getDOMNode();
  	}
  	throw new Error('findDOMNode can not find Node');
  }

  var ReactDOM = Object.freeze({
  	render: render,
  	unstable_renderSubtreeIntoContainer: unstable_renderSubtreeIntoContainer,
  	unmountComponentAtNode: unmountComponentAtNode,
  	findDOMNode: findDOMNode
  });

  function isValidElement(obj) {
  	return obj != null && !!obj.vtype;
  }

  function cloneElement(originElem, props) {
  	var type = originElem.type;
  	var key = originElem.key;
  	var ref = originElem.ref;

  	var newProps = extend(extend({ key: key, ref: ref }, originElem.props), props);

  	for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
  		children[_key - 2] = arguments[_key];
  	}

  	var vnode = createElement.apply(undefined, [type, newProps].concat(children));
  	if (vnode.ref === originElem.ref) {
  		vnode.refs = originElem.refs;
  	}
  	return vnode;
  }

  function createFactory(type) {
  	var factory = function factory() {
  		for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
  			args[_key2] = arguments[_key2];
  		}

  		return createElement.apply(undefined, [type].concat(args));
  	};
  	factory.type = type;
  	return factory;
  }

  function createElement(type, props, children) {
  	var createVnode = null;
  	var varType = typeof type;

  	if (varType === 'string') {
  		createVnode = createVelem;
  	} else if (varType === 'function') {
  		if (type.prototype && typeof type.prototype.forceUpdate === 'function') {
  			createVnode = createVcomponent;
  		} else {
  			createVnode = createVstateless;
  		}
  	} else {
  		throw new Error('React.createElement: unexpect type [ ' + type + ' ]');
  	}

  	var key = null;
  	var ref = null;
  	var finalProps = {};
  	var propValue = null;
  	if (props != null) {
  		for (var propKey in props) {
  			if (!props.hasOwnProperty(propKey)) {
  				continue;
  			}
  			if (propKey === 'key') {
  				if (props.key !== undefined) {
  					key = '' + props.key;
  				}
  			} else if (propKey === 'ref') {
  				if (props.ref !== undefined) {
  					ref = props.ref;
  				}
  			} else if ((propValue = props[propKey]) !== undefined) {
  				finalProps[propKey] = propValue;
  			}
  		}
  	}

  	var defaultProps = type.defaultProps;

  	if (defaultProps) {
  		for (var propKey in defaultProps) {
  			if (finalProps[propKey] === undefined) {
  				finalProps[propKey] = defaultProps[propKey];
  			}
  		}
  	}

  	var argsLen = arguments.length;
  	var finalChildren = children;

  	if (argsLen > 3) {
  		finalChildren = Array(argsLen - 2);
  		for (var i = 2; i < argsLen; i++) {
  			finalChildren[i - 2] = arguments[i];
  		}
  	}

  	if (finalChildren !== undefined) {
  		finalProps.children = finalChildren;
  	}

  	var vnode = createVnode(type, finalProps);
  	vnode.key = key;
  	vnode.ref = ref;
  	return vnode;
  }

  var tagNames = 'a|abbr|address|area|article|aside|audio|b|base|bdi|bdo|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|data|datalist|dd|del|details|dfn|dialog|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|h1|h2|h3|h4|h5|h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|main|map|mark|menu|menuitem|meta|meter|nav|noscript|object|ol|optgroup|option|output|p|param|picture|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|track|u|ul|var|video|wbr|circle|clipPath|defs|ellipse|g|image|line|linearGradient|mask|path|pattern|polygon|polyline|radialGradient|rect|stop|svg|text|tspan';
  var DOM = {};
  eachItem(tagNames.split('|'), function (tagName) {
  	DOM[tagName] = createFactory(tagName);
  });

  var check = function check() {
      return check;
  };
  check.isRequired = check;
  var PropTypes = {
      "array": check,
      "bool": check,
      "func": check,
      "number": check,
      "object": check,
      "string": check,
      "any": check,
      "arrayOf": check,
      "element": check,
      "instanceOf": check,
      "node": check,
      "objectOf": check,
      "oneOf": check,
      "oneOfType": check,
      "shape": check
  };

  function only(children) {
  	if (isValidElement(children)) {
  		return children;
  	}
  	throw new Error('expect only one child');
  }

  function forEach(children, iteratee, context) {
  	if (children == null) {
  		return children;
  	}
  	var index = 0;
  	if (isArr(children)) {
  		flattenChildren(children, function (child) {
  			iteratee.call(context, child, index++);
  		});
  	} else {
  		iteratee.call(context, children, index);
  	}
  }

  function map(children, iteratee, context) {
  	if (children == null) {
  		return children;
  	}
  	var store = [];
  	var keyMap = {};
  	forEach(children, function (child, index) {
  		var data = {};
  		data.child = iteratee.call(context, child, index) || child;
  		data.isEqual = data.child === child;
  		var key = data.key = getKey(child, index);
  		if (keyMap.hasOwnProperty(key)) {
  			keyMap[key] += 1;
  		} else {
  			keyMap[key] = 0;
  		}
  		data.index = keyMap[key];
  		store.push(data);
  	});
  	var result = [];
  	eachItem(store, function (_ref) {
  		var child = _ref.child;
  		var key = _ref.key;
  		var index = _ref.index;
  		var isEqual = _ref.isEqual;

  		if (child == null || typeof child === 'boolean') {
  			return;
  		}
  		if (!isValidElement(child) || key == null) {
  			result.push(child);
  			return;
  		}
  		if (keyMap[key] !== 0) {
  			key += ':' + index;
  		}
  		if (!isEqual) {
  			key = escapeUserProvidedKey(child.key || '') + '/' + key;
  		}
  		child = cloneElement(child, { key: key });
  		result.push(child);
  	});
  	return result;
  }

  function count(children) {
  	var count = 0;
  	forEach(children, function () {
  		count++;
  	});
  	return count;
  }

  function toArray(children) {
  	return map(children, identity) || [];
  }

  function getKey(child, index) {
  	var key = undefined;
  	if (isValidElement(child) && typeof child.key === 'string') {
  		key = '.$' + child.key;
  	} else {
  		key = '.' + index.toString(36);
  	}
  	return key;
  }

  var userProvidedKeyEscapeRegex = /\/(?!\/)/g;
  function escapeUserProvidedKey(text) {
  	return ('' + text).replace(userProvidedKeyEscapeRegex, '//');
  }

  var Children = Object.freeze({
  	only: only,
  	forEach: forEach,
  	map: map,
  	count: count,
  	toArray: toArray
  });

  function eachMixin(mixins, iteratee) {
  	eachItem(mixins, function (mixin) {
  		if (mixin) {
  			if (isArr(mixin.mixins)) {
  				eachMixin(mixin.mixins, iteratee);
  			}
  			iteratee(mixin);
  		}
  	});
  }

  function combineMixinToProto(proto, mixin) {
  	mapValue(mixin, function (value, key) {
  		if (key === 'getInitialState') {
  			proto.$getInitialStates.push(value);
  			return;
  		}
  		var curValue = proto[key];
  		if (isFn(curValue) && isFn(value)) {
  			proto[key] = pipe(curValue, value);
  		} else {
  			proto[key] = value;
  		}
  	});
  }

  function combineMixinToClass(Component, mixin) {
  	extend(Component.propTypes, mixin.propTypes);
  	extend(Component.contextTypes, mixin.contextTypes);
  	extend(Component, mixin.statics);
  	if (isFn(mixin.getDefaultProps)) {
  		extend(Component.defaultProps, mixin.getDefaultProps());
  	}
  }

  function bindContext(obj, source) {
  	mapValue(source, function (value, key) {
  		if (isFn(value)) {
  			obj[key] = value.bind(obj);
  		}
  	});
  }

  var Facade = function Facade() {};
  Facade.prototype = Component.prototype;

  function getInitialState() {
  	var _this = this;

  	var state = {};
  	var setState = this.setState;
  	this.setState = Facade;
  	eachItem(this.$getInitialStates, function (getInitialState) {
  		if (isFn(getInitialState)) {
  			extend(state, getInitialState.call(_this));
  		}
  	});
  	this.setState = setState;
  	return state;
  }
  function createClass(spec) {
  	if (!isFn(spec.render)) {
  		throw new Error('createClass: spec.render is not function');
  	}
  	var specMixins = spec.mixins || [];
  	var mixins = specMixins.concat(spec);
  	spec.mixins = null;
  	function Klass(props, context) {
  		Component.call(this, props, context);
  		this.constructor = Klass;
  		spec.autobind !== false && bindContext(this, Klass.prototype);
  		this.state = this.getInitialState() || this.state;
  	}
  	Klass.displayName = spec.displayName;
  	Klass.contextTypes = {};
  	Klass.propTypes = {};
  	Klass.defaultProps = {};
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

  var React = extend({
      version: '0.15.1',
      cloneElement: cloneElement,
      isValidElement: isValidElement,
      createElement: createElement,
      createFactory: createFactory,
      Component: Component,
      createClass: createClass,
      Children: Children,
      PropTypes: PropTypes,
      DOM: DOM
  }, ReactDOM);

  React.__SECRET_DOM_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactDOM;

  return React;

}));