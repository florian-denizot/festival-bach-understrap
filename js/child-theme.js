/*!
  * Understrap v1.2.0 (https://understrap.com)
  * Copyright 2013-2025 The Understrap Authors (https://github.com/understrap/understrap/graphs/contributors)
  * Licensed under GPL-3.0 (undefined)
  */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
	typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.understrap = {}, global.jQuery));
})(this, (function (exports, require$$0$1) { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getAugmentedNamespace(n) {
	  var f = n.default;
		if (typeof f == "function") {
			var a = function a () {
				if (this instanceof a) {
					var args = [null];
					args.push.apply(args, arguments);
					var Ctor = Function.bind.apply(f, args);
					return new Ctor();
				}
				return f.apply(this, arguments);
			};
			a.prototype = f.prototype;
	  } else a = {};
	  Object.defineProperty(a, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var alert$1 = {exports: {}};

	var util = {exports: {}};

	/*!
	  * Bootstrap index.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	var hasRequiredUtil;

	function requireUtil () {
		if (hasRequiredUtil) return util.exports;
		hasRequiredUtil = 1;
		(function (module, exports) {
			(function (global, factory) {
			  factory(exports) ;
			})(commonjsGlobal, function (exports) {

			  /**
			   * --------------------------------------------------------------------------
			   * Bootstrap (v5.2.3): util/index.js
			   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
			   * --------------------------------------------------------------------------
			   */
			  const MAX_UID = 1000000;
			  const MILLISECONDS_MULTIPLIER = 1000;
			  const TRANSITION_END = 'transitionend'; // Shout-out Angus Croll (https://goo.gl/pxwQGp)

			  const toType = object => {
			    if (object === null || object === undefined) {
			      return `${object}`;
			    }
			    return Object.prototype.toString.call(object).match(/\s([a-z]+)/i)[1].toLowerCase();
			  };
			  /**
			   * Public Util API
			   */

			  const getUID = prefix => {
			    do {
			      prefix += Math.floor(Math.random() * MAX_UID);
			    } while (document.getElementById(prefix));
			    return prefix;
			  };
			  const getSelector = element => {
			    let selector = element.getAttribute('data-bs-target');
			    if (!selector || selector === '#') {
			      let hrefAttribute = element.getAttribute('href'); // The only valid content that could double as a selector are IDs or classes,
			      // so everything starting with `#` or `.`. If a "real" URL is used as the selector,
			      // `document.querySelector` will rightfully complain it is invalid.
			      // See https://github.com/twbs/bootstrap/issues/32273

			      if (!hrefAttribute || !hrefAttribute.includes('#') && !hrefAttribute.startsWith('.')) {
			        return null;
			      } // Just in case some CMS puts out a full URL with the anchor appended

			      if (hrefAttribute.includes('#') && !hrefAttribute.startsWith('#')) {
			        hrefAttribute = `#${hrefAttribute.split('#')[1]}`;
			      }
			      selector = hrefAttribute && hrefAttribute !== '#' ? hrefAttribute.trim() : null;
			    }
			    return selector;
			  };
			  const getSelectorFromElement = element => {
			    const selector = getSelector(element);
			    if (selector) {
			      return document.querySelector(selector) ? selector : null;
			    }
			    return null;
			  };
			  const getElementFromSelector = element => {
			    const selector = getSelector(element);
			    return selector ? document.querySelector(selector) : null;
			  };
			  const getTransitionDurationFromElement = element => {
			    if (!element) {
			      return 0;
			    } // Get transition-duration of the element

			    let {
			      transitionDuration,
			      transitionDelay
			    } = window.getComputedStyle(element);
			    const floatTransitionDuration = Number.parseFloat(transitionDuration);
			    const floatTransitionDelay = Number.parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

			    if (!floatTransitionDuration && !floatTransitionDelay) {
			      return 0;
			    } // If multiple durations are defined, take the first

			    transitionDuration = transitionDuration.split(',')[0];
			    transitionDelay = transitionDelay.split(',')[0];
			    return (Number.parseFloat(transitionDuration) + Number.parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
			  };
			  const triggerTransitionEnd = element => {
			    element.dispatchEvent(new Event(TRANSITION_END));
			  };
			  const isElement = object => {
			    if (!object || typeof object !== 'object') {
			      return false;
			    }
			    if (typeof object.jquery !== 'undefined') {
			      object = object[0];
			    }
			    return typeof object.nodeType !== 'undefined';
			  };
			  const getElement = object => {
			    // it's a jQuery object or a node element
			    if (isElement(object)) {
			      return object.jquery ? object[0] : object;
			    }
			    if (typeof object === 'string' && object.length > 0) {
			      return document.querySelector(object);
			    }
			    return null;
			  };
			  const isVisible = element => {
			    if (!isElement(element) || element.getClientRects().length === 0) {
			      return false;
			    }
			    const elementIsVisible = getComputedStyle(element).getPropertyValue('visibility') === 'visible'; // Handle `details` element as its content may falsie appear visible when it is closed

			    const closedDetails = element.closest('details:not([open])');
			    if (!closedDetails) {
			      return elementIsVisible;
			    }
			    if (closedDetails !== element) {
			      const summary = element.closest('summary');
			      if (summary && summary.parentNode !== closedDetails) {
			        return false;
			      }
			      if (summary === null) {
			        return false;
			      }
			    }
			    return elementIsVisible;
			  };
			  const isDisabled = element => {
			    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
			      return true;
			    }
			    if (element.classList.contains('disabled')) {
			      return true;
			    }
			    if (typeof element.disabled !== 'undefined') {
			      return element.disabled;
			    }
			    return element.hasAttribute('disabled') && element.getAttribute('disabled') !== 'false';
			  };
			  const findShadowRoot = element => {
			    if (!document.documentElement.attachShadow) {
			      return null;
			    } // Can find the shadow root otherwise it'll return the document

			    if (typeof element.getRootNode === 'function') {
			      const root = element.getRootNode();
			      return root instanceof ShadowRoot ? root : null;
			    }
			    if (element instanceof ShadowRoot) {
			      return element;
			    } // when we don't find a shadow root

			    if (!element.parentNode) {
			      return null;
			    }
			    return findShadowRoot(element.parentNode);
			  };
			  const noop = () => {};
			  /**
			   * Trick to restart an element's animation
			   *
			   * @param {HTMLElement} element
			   * @return void
			   *
			   * @see https://www.charistheo.io/blog/2021/02/restart-a-css-animation-with-javascript/#restarting-a-css-animation
			   */

			  const reflow = element => {
			    element.offsetHeight; // eslint-disable-line no-unused-expressions
			  };

			  const getjQuery = () => {
			    if (window.jQuery && !document.body.hasAttribute('data-bs-no-jquery')) {
			      return window.jQuery;
			    }
			    return null;
			  };
			  const DOMContentLoadedCallbacks = [];
			  const onDOMContentLoaded = callback => {
			    if (document.readyState === 'loading') {
			      // add listener on the first call when the document is in loading state
			      if (!DOMContentLoadedCallbacks.length) {
			        document.addEventListener('DOMContentLoaded', () => {
			          for (const callback of DOMContentLoadedCallbacks) {
			            callback();
			          }
			        });
			      }
			      DOMContentLoadedCallbacks.push(callback);
			    } else {
			      callback();
			    }
			  };
			  const isRTL = () => document.documentElement.dir === 'rtl';
			  const defineJQueryPlugin = plugin => {
			    onDOMContentLoaded(() => {
			      const $ = getjQuery();
			      /* istanbul ignore if */

			      if ($) {
			        const name = plugin.NAME;
			        const JQUERY_NO_CONFLICT = $.fn[name];
			        $.fn[name] = plugin.jQueryInterface;
			        $.fn[name].Constructor = plugin;
			        $.fn[name].noConflict = () => {
			          $.fn[name] = JQUERY_NO_CONFLICT;
			          return plugin.jQueryInterface;
			        };
			      }
			    });
			  };
			  const execute = callback => {
			    if (typeof callback === 'function') {
			      callback();
			    }
			  };
			  const executeAfterTransition = (callback, transitionElement, waitForTransition = true) => {
			    if (!waitForTransition) {
			      execute(callback);
			      return;
			    }
			    const durationPadding = 5;
			    const emulatedDuration = getTransitionDurationFromElement(transitionElement) + durationPadding;
			    let called = false;
			    const handler = ({
			      target
			    }) => {
			      if (target !== transitionElement) {
			        return;
			      }
			      called = true;
			      transitionElement.removeEventListener(TRANSITION_END, handler);
			      execute(callback);
			    };
			    transitionElement.addEventListener(TRANSITION_END, handler);
			    setTimeout(() => {
			      if (!called) {
			        triggerTransitionEnd(transitionElement);
			      }
			    }, emulatedDuration);
			  };
			  /**
			   * Return the previous/next element of a list.
			   *
			   * @param {array} list    The list of elements
			   * @param activeElement   The active element
			   * @param shouldGetNext   Choose to get next or previous element
			   * @param isCycleAllowed
			   * @return {Element|elem} The proper element
			   */

			  const getNextActiveElement = (list, activeElement, shouldGetNext, isCycleAllowed) => {
			    const listLength = list.length;
			    let index = list.indexOf(activeElement); // if the element does not exist in the list return an element
			    // depending on the direction and if cycle is allowed

			    if (index === -1) {
			      return !shouldGetNext && isCycleAllowed ? list[listLength - 1] : list[0];
			    }
			    index += shouldGetNext ? 1 : -1;
			    if (isCycleAllowed) {
			      index = (index + listLength) % listLength;
			    }
			    return list[Math.max(0, Math.min(index, listLength - 1))];
			  };
			  exports.defineJQueryPlugin = defineJQueryPlugin;
			  exports.execute = execute;
			  exports.executeAfterTransition = executeAfterTransition;
			  exports.findShadowRoot = findShadowRoot;
			  exports.getElement = getElement;
			  exports.getElementFromSelector = getElementFromSelector;
			  exports.getNextActiveElement = getNextActiveElement;
			  exports.getSelectorFromElement = getSelectorFromElement;
			  exports.getTransitionDurationFromElement = getTransitionDurationFromElement;
			  exports.getUID = getUID;
			  exports.getjQuery = getjQuery;
			  exports.isDisabled = isDisabled;
			  exports.isElement = isElement;
			  exports.isRTL = isRTL;
			  exports.isVisible = isVisible;
			  exports.noop = noop;
			  exports.onDOMContentLoaded = onDOMContentLoaded;
			  exports.reflow = reflow;
			  exports.toType = toType;
			  exports.triggerTransitionEnd = triggerTransitionEnd;
			  Object.defineProperties(exports, {
			    __esModule: {
			      value: true
			    },
			    [Symbol.toStringTag]: {
			      value: 'Module'
			    }
			  });
			});
	} (util, util.exports));
		return util.exports;
	}

	var eventHandler = {exports: {}};

	/*!
	  * Bootstrap event-handler.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	var hasRequiredEventHandler;

	function requireEventHandler () {
		if (hasRequiredEventHandler) return eventHandler.exports;
		hasRequiredEventHandler = 1;
		(function (module, exports) {
			(function (global, factory) {
			  module.exports = factory(requireUtil()) ;
			})(commonjsGlobal, function (index) {

			  /**
			   * --------------------------------------------------------------------------
			   * Bootstrap (v5.2.3): dom/event-handler.js
			   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
			   * --------------------------------------------------------------------------
			   */
			  /**
			   * Constants
			   */
			  const namespaceRegex = /[^.]*(?=\..*)\.|.*/;
			  const stripNameRegex = /\..*/;
			  const stripUidRegex = /::\d+$/;
			  const eventRegistry = {}; // Events storage

			  let uidEvent = 1;
			  const customEvents = {
			    mouseenter: 'mouseover',
			    mouseleave: 'mouseout'
			  };
			  const nativeEvents = new Set(['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll']);
			  /**
			   * Private methods
			   */

			  function makeEventUid(element, uid) {
			    return uid && `${uid}::${uidEvent++}` || element.uidEvent || uidEvent++;
			  }
			  function getElementEvents(element) {
			    const uid = makeEventUid(element);
			    element.uidEvent = uid;
			    eventRegistry[uid] = eventRegistry[uid] || {};
			    return eventRegistry[uid];
			  }
			  function bootstrapHandler(element, fn) {
			    return function handler(event) {
			      hydrateObj(event, {
			        delegateTarget: element
			      });
			      if (handler.oneOff) {
			        EventHandler.off(element, event.type, fn);
			      }
			      return fn.apply(element, [event]);
			    };
			  }
			  function bootstrapDelegationHandler(element, selector, fn) {
			    return function handler(event) {
			      const domElements = element.querySelectorAll(selector);
			      for (let {
			        target
			      } = event; target && target !== this; target = target.parentNode) {
			        for (const domElement of domElements) {
			          if (domElement !== target) {
			            continue;
			          }
			          hydrateObj(event, {
			            delegateTarget: target
			          });
			          if (handler.oneOff) {
			            EventHandler.off(element, event.type, selector, fn);
			          }
			          return fn.apply(target, [event]);
			        }
			      }
			    };
			  }
			  function findHandler(events, callable, delegationSelector = null) {
			    return Object.values(events).find(event => event.callable === callable && event.delegationSelector === delegationSelector);
			  }
			  function normalizeParameters(originalTypeEvent, handler, delegationFunction) {
			    const isDelegated = typeof handler === 'string'; // todo: tooltip passes `false` instead of selector, so we need to check

			    const callable = isDelegated ? delegationFunction : handler || delegationFunction;
			    let typeEvent = getTypeEvent(originalTypeEvent);
			    if (!nativeEvents.has(typeEvent)) {
			      typeEvent = originalTypeEvent;
			    }
			    return [isDelegated, callable, typeEvent];
			  }
			  function addHandler(element, originalTypeEvent, handler, delegationFunction, oneOff) {
			    if (typeof originalTypeEvent !== 'string' || !element) {
			      return;
			    }
			    let [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction); // in case of mouseenter or mouseleave wrap the handler within a function that checks for its DOM position
			    // this prevents the handler from being dispatched the same way as mouseover or mouseout does

			    if (originalTypeEvent in customEvents) {
			      const wrapFunction = fn => {
			        return function (event) {
			          if (!event.relatedTarget || event.relatedTarget !== event.delegateTarget && !event.delegateTarget.contains(event.relatedTarget)) {
			            return fn.call(this, event);
			          }
			        };
			      };
			      callable = wrapFunction(callable);
			    }
			    const events = getElementEvents(element);
			    const handlers = events[typeEvent] || (events[typeEvent] = {});
			    const previousFunction = findHandler(handlers, callable, isDelegated ? handler : null);
			    if (previousFunction) {
			      previousFunction.oneOff = previousFunction.oneOff && oneOff;
			      return;
			    }
			    const uid = makeEventUid(callable, originalTypeEvent.replace(namespaceRegex, ''));
			    const fn = isDelegated ? bootstrapDelegationHandler(element, handler, callable) : bootstrapHandler(element, callable);
			    fn.delegationSelector = isDelegated ? handler : null;
			    fn.callable = callable;
			    fn.oneOff = oneOff;
			    fn.uidEvent = uid;
			    handlers[uid] = fn;
			    element.addEventListener(typeEvent, fn, isDelegated);
			  }
			  function removeHandler(element, events, typeEvent, handler, delegationSelector) {
			    const fn = findHandler(events[typeEvent], handler, delegationSelector);
			    if (!fn) {
			      return;
			    }
			    element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
			    delete events[typeEvent][fn.uidEvent];
			  }
			  function removeNamespacedHandlers(element, events, typeEvent, namespace) {
			    const storeElementEvent = events[typeEvent] || {};
			    for (const handlerKey of Object.keys(storeElementEvent)) {
			      if (handlerKey.includes(namespace)) {
			        const event = storeElementEvent[handlerKey];
			        removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
			      }
			    }
			  }
			  function getTypeEvent(event) {
			    // allow to get the native events from namespaced events ('click.bs.button' --> 'click')
			    event = event.replace(stripNameRegex, '');
			    return customEvents[event] || event;
			  }
			  const EventHandler = {
			    on(element, event, handler, delegationFunction) {
			      addHandler(element, event, handler, delegationFunction, false);
			    },
			    one(element, event, handler, delegationFunction) {
			      addHandler(element, event, handler, delegationFunction, true);
			    },
			    off(element, originalTypeEvent, handler, delegationFunction) {
			      if (typeof originalTypeEvent !== 'string' || !element) {
			        return;
			      }
			      const [isDelegated, callable, typeEvent] = normalizeParameters(originalTypeEvent, handler, delegationFunction);
			      const inNamespace = typeEvent !== originalTypeEvent;
			      const events = getElementEvents(element);
			      const storeElementEvent = events[typeEvent] || {};
			      const isNamespace = originalTypeEvent.startsWith('.');
			      if (typeof callable !== 'undefined') {
			        // Simplest case: handler is passed, remove that listener ONLY.
			        if (!Object.keys(storeElementEvent).length) {
			          return;
			        }
			        removeHandler(element, events, typeEvent, callable, isDelegated ? handler : null);
			        return;
			      }
			      if (isNamespace) {
			        for (const elementEvent of Object.keys(events)) {
			          removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
			        }
			      }
			      for (const keyHandlers of Object.keys(storeElementEvent)) {
			        const handlerKey = keyHandlers.replace(stripUidRegex, '');
			        if (!inNamespace || originalTypeEvent.includes(handlerKey)) {
			          const event = storeElementEvent[keyHandlers];
			          removeHandler(element, events, typeEvent, event.callable, event.delegationSelector);
			        }
			      }
			    },
			    trigger(element, event, args) {
			      if (typeof event !== 'string' || !element) {
			        return null;
			      }
			      const $ = index.getjQuery();
			      const typeEvent = getTypeEvent(event);
			      const inNamespace = event !== typeEvent;
			      let jQueryEvent = null;
			      let bubbles = true;
			      let nativeDispatch = true;
			      let defaultPrevented = false;
			      if (inNamespace && $) {
			        jQueryEvent = $.Event(event, args);
			        $(element).trigger(jQueryEvent);
			        bubbles = !jQueryEvent.isPropagationStopped();
			        nativeDispatch = !jQueryEvent.isImmediatePropagationStopped();
			        defaultPrevented = jQueryEvent.isDefaultPrevented();
			      }
			      let evt = new Event(event, {
			        bubbles,
			        cancelable: true
			      });
			      evt = hydrateObj(evt, args);
			      if (defaultPrevented) {
			        evt.preventDefault();
			      }
			      if (nativeDispatch) {
			        element.dispatchEvent(evt);
			      }
			      if (evt.defaultPrevented && jQueryEvent) {
			        jQueryEvent.preventDefault();
			      }
			      return evt;
			    }
			  };
			  function hydrateObj(obj, meta) {
			    for (const [key, value] of Object.entries(meta || {})) {
			      try {
			        obj[key] = value;
			      } catch (_unused) {
			        Object.defineProperty(obj, key, {
			          configurable: true,
			          get() {
			            return value;
			          }
			        });
			      }
			    }
			    return obj;
			  }
			  return EventHandler;
			});
	} (eventHandler));
		return eventHandler.exports;
	}

	var baseComponent = {exports: {}};

	var data = {exports: {}};

	/*!
	  * Bootstrap data.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	var hasRequiredData;

	function requireData () {
		if (hasRequiredData) return data.exports;
		hasRequiredData = 1;
		(function (module, exports) {
			(function (global, factory) {
			  module.exports = factory() ;
			})(commonjsGlobal, function () {

			  /**
			   * --------------------------------------------------------------------------
			   * Bootstrap (v5.2.3): dom/data.js
			   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
			   * --------------------------------------------------------------------------
			   */

			  /**
			   * Constants
			   */
			  const elementMap = new Map();
			  const data = {
			    set(element, key, instance) {
			      if (!elementMap.has(element)) {
			        elementMap.set(element, new Map());
			      }
			      const instanceMap = elementMap.get(element); // make it clear we only want one instance per element
			      // can be removed later when multiple key/instances are fine to be used

			      if (!instanceMap.has(key) && instanceMap.size !== 0) {
			        // eslint-disable-next-line no-console
			        console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(instanceMap.keys())[0]}.`);
			        return;
			      }
			      instanceMap.set(key, instance);
			    },
			    get(element, key) {
			      if (elementMap.has(element)) {
			        return elementMap.get(element).get(key) || null;
			      }
			      return null;
			    },
			    remove(element, key) {
			      if (!elementMap.has(element)) {
			        return;
			      }
			      const instanceMap = elementMap.get(element);
			      instanceMap.delete(key); // free up element references if there are no instances left for an element

			      if (instanceMap.size === 0) {
			        elementMap.delete(element);
			      }
			    }
			  };
			  return data;
			});
	} (data));
		return data.exports;
	}

	var config = {exports: {}};

	var manipulator = {exports: {}};

	/*!
	  * Bootstrap manipulator.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	var hasRequiredManipulator;

	function requireManipulator () {
		if (hasRequiredManipulator) return manipulator.exports;
		hasRequiredManipulator = 1;
		(function (module, exports) {
			(function (global, factory) {
			  module.exports = factory() ;
			})(commonjsGlobal, function () {

			  /**
			   * --------------------------------------------------------------------------
			   * Bootstrap (v5.2.3): dom/manipulator.js
			   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
			   * --------------------------------------------------------------------------
			   */
			  function normalizeData(value) {
			    if (value === 'true') {
			      return true;
			    }
			    if (value === 'false') {
			      return false;
			    }
			    if (value === Number(value).toString()) {
			      return Number(value);
			    }
			    if (value === '' || value === 'null') {
			      return null;
			    }
			    if (typeof value !== 'string') {
			      return value;
			    }
			    try {
			      return JSON.parse(decodeURIComponent(value));
			    } catch (_unused) {
			      return value;
			    }
			  }
			  function normalizeDataKey(key) {
			    return key.replace(/[A-Z]/g, chr => `-${chr.toLowerCase()}`);
			  }
			  const Manipulator = {
			    setDataAttribute(element, key, value) {
			      element.setAttribute(`data-bs-${normalizeDataKey(key)}`, value);
			    },
			    removeDataAttribute(element, key) {
			      element.removeAttribute(`data-bs-${normalizeDataKey(key)}`);
			    },
			    getDataAttributes(element) {
			      if (!element) {
			        return {};
			      }
			      const attributes = {};
			      const bsKeys = Object.keys(element.dataset).filter(key => key.startsWith('bs') && !key.startsWith('bsConfig'));
			      for (const key of bsKeys) {
			        let pureKey = key.replace(/^bs/, '');
			        pureKey = pureKey.charAt(0).toLowerCase() + pureKey.slice(1, pureKey.length);
			        attributes[pureKey] = normalizeData(element.dataset[key]);
			      }
			      return attributes;
			    },
			    getDataAttribute(element, key) {
			      return normalizeData(element.getAttribute(`data-bs-${normalizeDataKey(key)}`));
			    }
			  };
			  return Manipulator;
			});
	} (manipulator));
		return manipulator.exports;
	}

	/*!
	  * Bootstrap config.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	var hasRequiredConfig;

	function requireConfig () {
		if (hasRequiredConfig) return config.exports;
		hasRequiredConfig = 1;
		(function (module, exports) {
			(function (global, factory) {
			  module.exports = factory(requireUtil(), requireManipulator()) ;
			})(commonjsGlobal, function (index, Manipulator) {

			  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
			    default: e
			  };
			  const Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);

			  /**
			   * --------------------------------------------------------------------------
			   * Bootstrap (v5.2.3): util/config.js
			   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
			   * --------------------------------------------------------------------------
			   */
			  /**
			   * Class definition
			   */

			  class Config {
			    // Getters
			    static get Default() {
			      return {};
			    }
			    static get DefaultType() {
			      return {};
			    }
			    static get NAME() {
			      throw new Error('You have to implement the static method "NAME", for each component!');
			    }
			    _getConfig(config) {
			      config = this._mergeConfigObj(config);
			      config = this._configAfterMerge(config);
			      this._typeCheckConfig(config);
			      return config;
			    }
			    _configAfterMerge(config) {
			      return config;
			    }
			    _mergeConfigObj(config, element) {
			      const jsonConfig = index.isElement(element) ? Manipulator__default.default.getDataAttribute(element, 'config') : {}; // try to parse

			      return {
			        ...this.constructor.Default,
			        ...(typeof jsonConfig === 'object' ? jsonConfig : {}),
			        ...(index.isElement(element) ? Manipulator__default.default.getDataAttributes(element) : {}),
			        ...(typeof config === 'object' ? config : {})
			      };
			    }
			    _typeCheckConfig(config, configTypes = this.constructor.DefaultType) {
			      for (const property of Object.keys(configTypes)) {
			        const expectedTypes = configTypes[property];
			        const value = config[property];
			        const valueType = index.isElement(value) ? 'element' : index.toType(value);
			        if (!new RegExp(expectedTypes).test(valueType)) {
			          throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${property}" provided type "${valueType}" but expected type "${expectedTypes}".`);
			        }
			      }
			    }
			  }
			  return Config;
			});
	} (config));
		return config.exports;
	}

	/*!
	  * Bootstrap base-component.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	var hasRequiredBaseComponent;

	function requireBaseComponent () {
		if (hasRequiredBaseComponent) return baseComponent.exports;
		hasRequiredBaseComponent = 1;
		(function (module, exports) {
			(function (global, factory) {
			  module.exports = factory(requireData(), requireUtil(), requireEventHandler(), requireConfig()) ;
			})(commonjsGlobal, function (Data, index, EventHandler, Config) {

			  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
			    default: e
			  };
			  const Data__default = /*#__PURE__*/_interopDefaultLegacy(Data);
			  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
			  const Config__default = /*#__PURE__*/_interopDefaultLegacy(Config);

			  /**
			   * --------------------------------------------------------------------------
			   * Bootstrap (v5.2.3): base-component.js
			   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
			   * --------------------------------------------------------------------------
			   */
			  /**
			   * Constants
			   */

			  const VERSION = '5.2.3';
			  /**
			   * Class definition
			   */

			  class BaseComponent extends Config__default.default {
			    constructor(element, config) {
			      super();
			      element = index.getElement(element);
			      if (!element) {
			        return;
			      }
			      this._element = element;
			      this._config = this._getConfig(config);
			      Data__default.default.set(this._element, this.constructor.DATA_KEY, this);
			    } // Public

			    dispose() {
			      Data__default.default.remove(this._element, this.constructor.DATA_KEY);
			      EventHandler__default.default.off(this._element, this.constructor.EVENT_KEY);
			      for (const propertyName of Object.getOwnPropertyNames(this)) {
			        this[propertyName] = null;
			      }
			    }
			    _queueCallback(callback, element, isAnimated = true) {
			      index.executeAfterTransition(callback, element, isAnimated);
			    }
			    _getConfig(config) {
			      config = this._mergeConfigObj(config, this._element);
			      config = this._configAfterMerge(config);
			      this._typeCheckConfig(config);
			      return config;
			    } // Static

			    static getInstance(element) {
			      return Data__default.default.get(index.getElement(element), this.DATA_KEY);
			    }
			    static getOrCreateInstance(element, config = {}) {
			      return this.getInstance(element) || new this(element, typeof config === 'object' ? config : null);
			    }
			    static get VERSION() {
			      return VERSION;
			    }
			    static get DATA_KEY() {
			      return `bs.${this.NAME}`;
			    }
			    static get EVENT_KEY() {
			      return `.${this.DATA_KEY}`;
			    }
			    static eventName(name) {
			      return `${name}${this.EVENT_KEY}`;
			    }
			  }
			  return BaseComponent;
			});
	} (baseComponent));
		return baseComponent.exports;
	}

	var componentFunctions = {exports: {}};

	/*!
	  * Bootstrap component-functions.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	var hasRequiredComponentFunctions;

	function requireComponentFunctions () {
		if (hasRequiredComponentFunctions) return componentFunctions.exports;
		hasRequiredComponentFunctions = 1;
		(function (module, exports) {
			(function (global, factory) {
			  factory(exports, requireEventHandler(), requireUtil()) ;
			})(commonjsGlobal, function (exports, EventHandler, index) {

			  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
			    default: e
			  };
			  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);

			  /**
			   * --------------------------------------------------------------------------
			   * Bootstrap (v5.2.3): util/component-functions.js
			   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
			   * --------------------------------------------------------------------------
			   */

			  const enableDismissTrigger = (component, method = 'hide') => {
			    const clickEvent = `click.dismiss${component.EVENT_KEY}`;
			    const name = component.NAME;
			    EventHandler__default.default.on(document, clickEvent, `[data-bs-dismiss="${name}"]`, function (event) {
			      if (['A', 'AREA'].includes(this.tagName)) {
			        event.preventDefault();
			      }
			      if (index.isDisabled(this)) {
			        return;
			      }
			      const target = index.getElementFromSelector(this) || this.closest(`.${name}`);
			      const instance = component.getOrCreateInstance(target); // Method argument is left, for Alert and only, as it doesn't implement the 'hide' method

			      instance[method]();
			    });
			  };
			  exports.enableDismissTrigger = enableDismissTrigger;
			  Object.defineProperties(exports, {
			    __esModule: {
			      value: true
			    },
			    [Symbol.toStringTag]: {
			      value: 'Module'
			    }
			  });
			});
	} (componentFunctions, componentFunctions.exports));
		return componentFunctions.exports;
	}

	/*!
	  * Bootstrap alert.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
		(function (global, factory) {
		  module.exports = factory(requireUtil(), requireEventHandler(), requireBaseComponent(), requireComponentFunctions()) ;
		})(commonjsGlobal, function (index, EventHandler, BaseComponent, componentFunctions) {

		  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
		    default: e
		  };
		  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
		  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

		  /**
		   * --------------------------------------------------------------------------
		   * Bootstrap (v5.2.3): alert.js
		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		   * --------------------------------------------------------------------------
		   */
		  /**
		   * Constants
		   */

		  const NAME = 'alert';
		  const DATA_KEY = 'bs.alert';
		  const EVENT_KEY = `.${DATA_KEY}`;
		  const EVENT_CLOSE = `close${EVENT_KEY}`;
		  const EVENT_CLOSED = `closed${EVENT_KEY}`;
		  const CLASS_NAME_FADE = 'fade';
		  const CLASS_NAME_SHOW = 'show';
		  /**
		   * Class definition
		   */

		  class Alert extends BaseComponent__default.default {
		    // Getters
		    static get NAME() {
		      return NAME;
		    } // Public

		    close() {
		      const closeEvent = EventHandler__default.default.trigger(this._element, EVENT_CLOSE);
		      if (closeEvent.defaultPrevented) {
		        return;
		      }
		      this._element.classList.remove(CLASS_NAME_SHOW);
		      const isAnimated = this._element.classList.contains(CLASS_NAME_FADE);
		      this._queueCallback(() => this._destroyElement(), this._element, isAnimated);
		    } // Private

		    _destroyElement() {
		      this._element.remove();
		      EventHandler__default.default.trigger(this._element, EVENT_CLOSED);
		      this.dispose();
		    } // Static

		    static jQueryInterface(config) {
		      return this.each(function () {
		        const data = Alert.getOrCreateInstance(this);
		        if (typeof config !== 'string') {
		          return;
		        }
		        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
		          throw new TypeError(`No method named "${config}"`);
		        }
		        data[config](this);
		      });
		    }
		  }
		  /**
		   * Data API implementation
		   */

		  componentFunctions.enableDismissTrigger(Alert, 'close');
		  /**
		   * jQuery
		   */

		  index.defineJQueryPlugin(Alert);
		  return Alert;
		});
	} (alert$1));

	var alert = alert$1.exports;

	var button$1 = {exports: {}};

	/*!
	  * Bootstrap button.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
		(function (global, factory) {
		  module.exports = factory(requireUtil(), requireEventHandler(), requireBaseComponent()) ;
		})(commonjsGlobal, function (index, EventHandler, BaseComponent) {

		  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
		    default: e
		  };
		  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
		  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

		  /**
		   * --------------------------------------------------------------------------
		   * Bootstrap (v5.2.3): button.js
		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		   * --------------------------------------------------------------------------
		   */
		  /**
		   * Constants
		   */

		  const NAME = 'button';
		  const DATA_KEY = 'bs.button';
		  const EVENT_KEY = `.${DATA_KEY}`;
		  const DATA_API_KEY = '.data-api';
		  const CLASS_NAME_ACTIVE = 'active';
		  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="button"]';
		  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
		  /**
		   * Class definition
		   */

		  class Button extends BaseComponent__default.default {
		    // Getters
		    static get NAME() {
		      return NAME;
		    } // Public

		    toggle() {
		      // Toggle class and sync the `aria-pressed` attribute with the return value of the `.toggle()` method
		      this._element.setAttribute('aria-pressed', this._element.classList.toggle(CLASS_NAME_ACTIVE));
		    } // Static

		    static jQueryInterface(config) {
		      return this.each(function () {
		        const data = Button.getOrCreateInstance(this);
		        if (config === 'toggle') {
		          data[config]();
		        }
		      });
		    }
		  }
		  /**
		   * Data API implementation
		   */

		  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, event => {
		    event.preventDefault();
		    const button = event.target.closest(SELECTOR_DATA_TOGGLE);
		    const data = Button.getOrCreateInstance(button);
		    data.toggle();
		  });
		  /**
		   * jQuery
		   */

		  index.defineJQueryPlugin(Button);
		  return Button;
		});
	} (button$1));

	var button = button$1.exports;

	var carousel$1 = {exports: {}};

	var selectorEngine = {exports: {}};

	/*!
	  * Bootstrap selector-engine.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	var hasRequiredSelectorEngine;

	function requireSelectorEngine () {
		if (hasRequiredSelectorEngine) return selectorEngine.exports;
		hasRequiredSelectorEngine = 1;
		(function (module, exports) {
			(function (global, factory) {
			  module.exports = factory(requireUtil()) ;
			})(commonjsGlobal, function (index) {

			  /**
			   * --------------------------------------------------------------------------
			   * Bootstrap (v5.2.3): dom/selector-engine.js
			   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
			   * --------------------------------------------------------------------------
			   */
			  /**
			   * Constants
			   */
			  const SelectorEngine = {
			    find(selector, element = document.documentElement) {
			      return [].concat(...Element.prototype.querySelectorAll.call(element, selector));
			    },
			    findOne(selector, element = document.documentElement) {
			      return Element.prototype.querySelector.call(element, selector);
			    },
			    children(element, selector) {
			      return [].concat(...element.children).filter(child => child.matches(selector));
			    },
			    parents(element, selector) {
			      const parents = [];
			      let ancestor = element.parentNode.closest(selector);
			      while (ancestor) {
			        parents.push(ancestor);
			        ancestor = ancestor.parentNode.closest(selector);
			      }
			      return parents;
			    },
			    prev(element, selector) {
			      let previous = element.previousElementSibling;
			      while (previous) {
			        if (previous.matches(selector)) {
			          return [previous];
			        }
			        previous = previous.previousElementSibling;
			      }
			      return [];
			    },
			    // TODO: this is now unused; remove later along with prev()
			    next(element, selector) {
			      let next = element.nextElementSibling;
			      while (next) {
			        if (next.matches(selector)) {
			          return [next];
			        }
			        next = next.nextElementSibling;
			      }
			      return [];
			    },
			    focusableChildren(element) {
			      const focusables = ['a', 'button', 'input', 'textarea', 'select', 'details', '[tabindex]', '[contenteditable="true"]'].map(selector => `${selector}:not([tabindex^="-"])`).join(',');
			      return this.find(focusables, element).filter(el => !index.isDisabled(el) && index.isVisible(el));
			    }
			  };
			  return SelectorEngine;
			});
	} (selectorEngine));
		return selectorEngine.exports;
	}

	var swipe = {exports: {}};

	/*!
	  * Bootstrap swipe.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	var hasRequiredSwipe;

	function requireSwipe () {
		if (hasRequiredSwipe) return swipe.exports;
		hasRequiredSwipe = 1;
		(function (module, exports) {
			(function (global, factory) {
			  module.exports = factory(requireConfig(), requireEventHandler(), requireUtil()) ;
			})(commonjsGlobal, function (Config, EventHandler, index) {

			  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
			    default: e
			  };
			  const Config__default = /*#__PURE__*/_interopDefaultLegacy(Config);
			  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);

			  /**
			   * --------------------------------------------------------------------------
			   * Bootstrap (v5.2.3): util/swipe.js
			   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
			   * --------------------------------------------------------------------------
			   */
			  /**
			   * Constants
			   */

			  const NAME = 'swipe';
			  const EVENT_KEY = '.bs.swipe';
			  const EVENT_TOUCHSTART = `touchstart${EVENT_KEY}`;
			  const EVENT_TOUCHMOVE = `touchmove${EVENT_KEY}`;
			  const EVENT_TOUCHEND = `touchend${EVENT_KEY}`;
			  const EVENT_POINTERDOWN = `pointerdown${EVENT_KEY}`;
			  const EVENT_POINTERUP = `pointerup${EVENT_KEY}`;
			  const POINTER_TYPE_TOUCH = 'touch';
			  const POINTER_TYPE_PEN = 'pen';
			  const CLASS_NAME_POINTER_EVENT = 'pointer-event';
			  const SWIPE_THRESHOLD = 40;
			  const Default = {
			    endCallback: null,
			    leftCallback: null,
			    rightCallback: null
			  };
			  const DefaultType = {
			    endCallback: '(function|null)',
			    leftCallback: '(function|null)',
			    rightCallback: '(function|null)'
			  };
			  /**
			   * Class definition
			   */

			  class Swipe extends Config__default.default {
			    constructor(element, config) {
			      super();
			      this._element = element;
			      if (!element || !Swipe.isSupported()) {
			        return;
			      }
			      this._config = this._getConfig(config);
			      this._deltaX = 0;
			      this._supportPointerEvents = Boolean(window.PointerEvent);
			      this._initEvents();
			    } // Getters

			    static get Default() {
			      return Default;
			    }
			    static get DefaultType() {
			      return DefaultType;
			    }
			    static get NAME() {
			      return NAME;
			    } // Public

			    dispose() {
			      EventHandler__default.default.off(this._element, EVENT_KEY);
			    } // Private

			    _start(event) {
			      if (!this._supportPointerEvents) {
			        this._deltaX = event.touches[0].clientX;
			        return;
			      }
			      if (this._eventIsPointerPenTouch(event)) {
			        this._deltaX = event.clientX;
			      }
			    }
			    _end(event) {
			      if (this._eventIsPointerPenTouch(event)) {
			        this._deltaX = event.clientX - this._deltaX;
			      }
			      this._handleSwipe();
			      index.execute(this._config.endCallback);
			    }
			    _move(event) {
			      this._deltaX = event.touches && event.touches.length > 1 ? 0 : event.touches[0].clientX - this._deltaX;
			    }
			    _handleSwipe() {
			      const absDeltaX = Math.abs(this._deltaX);
			      if (absDeltaX <= SWIPE_THRESHOLD) {
			        return;
			      }
			      const direction = absDeltaX / this._deltaX;
			      this._deltaX = 0;
			      if (!direction) {
			        return;
			      }
			      index.execute(direction > 0 ? this._config.rightCallback : this._config.leftCallback);
			    }
			    _initEvents() {
			      if (this._supportPointerEvents) {
			        EventHandler__default.default.on(this._element, EVENT_POINTERDOWN, event => this._start(event));
			        EventHandler__default.default.on(this._element, EVENT_POINTERUP, event => this._end(event));
			        this._element.classList.add(CLASS_NAME_POINTER_EVENT);
			      } else {
			        EventHandler__default.default.on(this._element, EVENT_TOUCHSTART, event => this._start(event));
			        EventHandler__default.default.on(this._element, EVENT_TOUCHMOVE, event => this._move(event));
			        EventHandler__default.default.on(this._element, EVENT_TOUCHEND, event => this._end(event));
			      }
			    }
			    _eventIsPointerPenTouch(event) {
			      return this._supportPointerEvents && (event.pointerType === POINTER_TYPE_PEN || event.pointerType === POINTER_TYPE_TOUCH);
			    } // Static

			    static isSupported() {
			      return 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
			    }
			  }
			  return Swipe;
			});
	} (swipe));
		return swipe.exports;
	}

	/*!
	  * Bootstrap carousel.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
		(function (global, factory) {
		  module.exports = factory(requireUtil(), requireEventHandler(), requireManipulator(), requireSelectorEngine(), requireSwipe(), requireBaseComponent()) ;
		})(commonjsGlobal, function (index, EventHandler, Manipulator, SelectorEngine, Swipe, BaseComponent) {

		  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
		    default: e
		  };
		  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
		  const Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
		  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
		  const Swipe__default = /*#__PURE__*/_interopDefaultLegacy(Swipe);
		  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

		  /**
		   * --------------------------------------------------------------------------
		   * Bootstrap (v5.2.3): carousel.js
		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		   * --------------------------------------------------------------------------
		   */
		  /**
		   * Constants
		   */

		  const NAME = 'carousel';
		  const DATA_KEY = 'bs.carousel';
		  const EVENT_KEY = `.${DATA_KEY}`;
		  const DATA_API_KEY = '.data-api';
		  const ARROW_LEFT_KEY = 'ArrowLeft';
		  const ARROW_RIGHT_KEY = 'ArrowRight';
		  const TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

		  const ORDER_NEXT = 'next';
		  const ORDER_PREV = 'prev';
		  const DIRECTION_LEFT = 'left';
		  const DIRECTION_RIGHT = 'right';
		  const EVENT_SLIDE = `slide${EVENT_KEY}`;
		  const EVENT_SLID = `slid${EVENT_KEY}`;
		  const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
		  const EVENT_MOUSEENTER = `mouseenter${EVENT_KEY}`;
		  const EVENT_MOUSELEAVE = `mouseleave${EVENT_KEY}`;
		  const EVENT_DRAG_START = `dragstart${EVENT_KEY}`;
		  const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
		  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
		  const CLASS_NAME_CAROUSEL = 'carousel';
		  const CLASS_NAME_ACTIVE = 'active';
		  const CLASS_NAME_SLIDE = 'slide';
		  const CLASS_NAME_END = 'carousel-item-end';
		  const CLASS_NAME_START = 'carousel-item-start';
		  const CLASS_NAME_NEXT = 'carousel-item-next';
		  const CLASS_NAME_PREV = 'carousel-item-prev';
		  const SELECTOR_ACTIVE = '.active';
		  const SELECTOR_ITEM = '.carousel-item';
		  const SELECTOR_ACTIVE_ITEM = SELECTOR_ACTIVE + SELECTOR_ITEM;
		  const SELECTOR_ITEM_IMG = '.carousel-item img';
		  const SELECTOR_INDICATORS = '.carousel-indicators';
		  const SELECTOR_DATA_SLIDE = '[data-bs-slide], [data-bs-slide-to]';
		  const SELECTOR_DATA_RIDE = '[data-bs-ride="carousel"]';
		  const KEY_TO_DIRECTION = {
		    [ARROW_LEFT_KEY]: DIRECTION_RIGHT,
		    [ARROW_RIGHT_KEY]: DIRECTION_LEFT
		  };
		  const Default = {
		    interval: 5000,
		    keyboard: true,
		    pause: 'hover',
		    ride: false,
		    touch: true,
		    wrap: true
		  };
		  const DefaultType = {
		    interval: '(number|boolean)',
		    // TODO:v6 remove boolean support
		    keyboard: 'boolean',
		    pause: '(string|boolean)',
		    ride: '(boolean|string)',
		    touch: 'boolean',
		    wrap: 'boolean'
		  };
		  /**
		   * Class definition
		   */

		  class Carousel extends BaseComponent__default.default {
		    constructor(element, config) {
		      super(element, config);
		      this._interval = null;
		      this._activeElement = null;
		      this._isSliding = false;
		      this.touchTimeout = null;
		      this._swipeHelper = null;
		      this._indicatorsElement = SelectorEngine__default.default.findOne(SELECTOR_INDICATORS, this._element);
		      this._addEventListeners();
		      if (this._config.ride === CLASS_NAME_CAROUSEL) {
		        this.cycle();
		      }
		    } // Getters

		    static get Default() {
		      return Default;
		    }
		    static get DefaultType() {
		      return DefaultType;
		    }
		    static get NAME() {
		      return NAME;
		    } // Public

		    next() {
		      this._slide(ORDER_NEXT);
		    }
		    nextWhenVisible() {
		      // FIXME TODO use `document.visibilityState`
		      // Don't call next when the page isn't visible
		      // or the carousel or its parent isn't visible
		      if (!document.hidden && index.isVisible(this._element)) {
		        this.next();
		      }
		    }
		    prev() {
		      this._slide(ORDER_PREV);
		    }
		    pause() {
		      if (this._isSliding) {
		        index.triggerTransitionEnd(this._element);
		      }
		      this._clearInterval();
		    }
		    cycle() {
		      this._clearInterval();
		      this._updateInterval();
		      this._interval = setInterval(() => this.nextWhenVisible(), this._config.interval);
		    }
		    _maybeEnableCycle() {
		      if (!this._config.ride) {
		        return;
		      }
		      if (this._isSliding) {
		        EventHandler__default.default.one(this._element, EVENT_SLID, () => this.cycle());
		        return;
		      }
		      this.cycle();
		    }
		    to(index) {
		      const items = this._getItems();
		      if (index > items.length - 1 || index < 0) {
		        return;
		      }
		      if (this._isSliding) {
		        EventHandler__default.default.one(this._element, EVENT_SLID, () => this.to(index));
		        return;
		      }
		      const activeIndex = this._getItemIndex(this._getActive());
		      if (activeIndex === index) {
		        return;
		      }
		      const order = index > activeIndex ? ORDER_NEXT : ORDER_PREV;
		      this._slide(order, items[index]);
		    }
		    dispose() {
		      if (this._swipeHelper) {
		        this._swipeHelper.dispose();
		      }
		      super.dispose();
		    } // Private

		    _configAfterMerge(config) {
		      config.defaultInterval = config.interval;
		      return config;
		    }
		    _addEventListeners() {
		      if (this._config.keyboard) {
		        EventHandler__default.default.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
		      }
		      if (this._config.pause === 'hover') {
		        EventHandler__default.default.on(this._element, EVENT_MOUSEENTER, () => this.pause());
		        EventHandler__default.default.on(this._element, EVENT_MOUSELEAVE, () => this._maybeEnableCycle());
		      }
		      if (this._config.touch && Swipe__default.default.isSupported()) {
		        this._addTouchEventListeners();
		      }
		    }
		    _addTouchEventListeners() {
		      for (const img of SelectorEngine__default.default.find(SELECTOR_ITEM_IMG, this._element)) {
		        EventHandler__default.default.on(img, EVENT_DRAG_START, event => event.preventDefault());
		      }
		      const endCallBack = () => {
		        if (this._config.pause !== 'hover') {
		          return;
		        } // If it's a touch-enabled device, mouseenter/leave are fired as
		        // part of the mouse compatibility events on first tap - the carousel
		        // would stop cycling until user tapped out of it;
		        // here, we listen for touchend, explicitly pause the carousel
		        // (as if it's the second time we tap on it, mouseenter compat event
		        // is NOT fired) and after a timeout (to allow for mouse compatibility
		        // events to fire) we explicitly restart cycling

		        this.pause();
		        if (this.touchTimeout) {
		          clearTimeout(this.touchTimeout);
		        }
		        this.touchTimeout = setTimeout(() => this._maybeEnableCycle(), TOUCHEVENT_COMPAT_WAIT + this._config.interval);
		      };
		      const swipeConfig = {
		        leftCallback: () => this._slide(this._directionToOrder(DIRECTION_LEFT)),
		        rightCallback: () => this._slide(this._directionToOrder(DIRECTION_RIGHT)),
		        endCallback: endCallBack
		      };
		      this._swipeHelper = new Swipe__default.default(this._element, swipeConfig);
		    }
		    _keydown(event) {
		      if (/input|textarea/i.test(event.target.tagName)) {
		        return;
		      }
		      const direction = KEY_TO_DIRECTION[event.key];
		      if (direction) {
		        event.preventDefault();
		        this._slide(this._directionToOrder(direction));
		      }
		    }
		    _getItemIndex(element) {
		      return this._getItems().indexOf(element);
		    }
		    _setActiveIndicatorElement(index) {
		      if (!this._indicatorsElement) {
		        return;
		      }
		      const activeIndicator = SelectorEngine__default.default.findOne(SELECTOR_ACTIVE, this._indicatorsElement);
		      activeIndicator.classList.remove(CLASS_NAME_ACTIVE);
		      activeIndicator.removeAttribute('aria-current');
		      const newActiveIndicator = SelectorEngine__default.default.findOne(`[data-bs-slide-to="${index}"]`, this._indicatorsElement);
		      if (newActiveIndicator) {
		        newActiveIndicator.classList.add(CLASS_NAME_ACTIVE);
		        newActiveIndicator.setAttribute('aria-current', 'true');
		      }
		    }
		    _updateInterval() {
		      const element = this._activeElement || this._getActive();
		      if (!element) {
		        return;
		      }
		      const elementInterval = Number.parseInt(element.getAttribute('data-bs-interval'), 10);
		      this._config.interval = elementInterval || this._config.defaultInterval;
		    }
		    _slide(order, element = null) {
		      if (this._isSliding) {
		        return;
		      }
		      const activeElement = this._getActive();
		      const isNext = order === ORDER_NEXT;
		      const nextElement = element || index.getNextActiveElement(this._getItems(), activeElement, isNext, this._config.wrap);
		      if (nextElement === activeElement) {
		        return;
		      }
		      const nextElementIndex = this._getItemIndex(nextElement);
		      const triggerEvent = eventName => {
		        return EventHandler__default.default.trigger(this._element, eventName, {
		          relatedTarget: nextElement,
		          direction: this._orderToDirection(order),
		          from: this._getItemIndex(activeElement),
		          to: nextElementIndex
		        });
		      };
		      const slideEvent = triggerEvent(EVENT_SLIDE);
		      if (slideEvent.defaultPrevented) {
		        return;
		      }
		      if (!activeElement || !nextElement) {
		        // Some weirdness is happening, so we bail
		        // todo: change tests that use empty divs to avoid this check
		        return;
		      }
		      const isCycling = Boolean(this._interval);
		      this.pause();
		      this._isSliding = true;
		      this._setActiveIndicatorElement(nextElementIndex);
		      this._activeElement = nextElement;
		      const directionalClassName = isNext ? CLASS_NAME_START : CLASS_NAME_END;
		      const orderClassName = isNext ? CLASS_NAME_NEXT : CLASS_NAME_PREV;
		      nextElement.classList.add(orderClassName);
		      index.reflow(nextElement);
		      activeElement.classList.add(directionalClassName);
		      nextElement.classList.add(directionalClassName);
		      const completeCallBack = () => {
		        nextElement.classList.remove(directionalClassName, orderClassName);
		        nextElement.classList.add(CLASS_NAME_ACTIVE);
		        activeElement.classList.remove(CLASS_NAME_ACTIVE, orderClassName, directionalClassName);
		        this._isSliding = false;
		        triggerEvent(EVENT_SLID);
		      };
		      this._queueCallback(completeCallBack, activeElement, this._isAnimated());
		      if (isCycling) {
		        this.cycle();
		      }
		    }
		    _isAnimated() {
		      return this._element.classList.contains(CLASS_NAME_SLIDE);
		    }
		    _getActive() {
		      return SelectorEngine__default.default.findOne(SELECTOR_ACTIVE_ITEM, this._element);
		    }
		    _getItems() {
		      return SelectorEngine__default.default.find(SELECTOR_ITEM, this._element);
		    }
		    _clearInterval() {
		      if (this._interval) {
		        clearInterval(this._interval);
		        this._interval = null;
		      }
		    }
		    _directionToOrder(direction) {
		      if (index.isRTL()) {
		        return direction === DIRECTION_LEFT ? ORDER_PREV : ORDER_NEXT;
		      }
		      return direction === DIRECTION_LEFT ? ORDER_NEXT : ORDER_PREV;
		    }
		    _orderToDirection(order) {
		      if (index.isRTL()) {
		        return order === ORDER_PREV ? DIRECTION_LEFT : DIRECTION_RIGHT;
		      }
		      return order === ORDER_PREV ? DIRECTION_RIGHT : DIRECTION_LEFT;
		    } // Static

		    static jQueryInterface(config) {
		      return this.each(function () {
		        const data = Carousel.getOrCreateInstance(this, config);
		        if (typeof config === 'number') {
		          data.to(config);
		          return;
		        }
		        if (typeof config === 'string') {
		          if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
		            throw new TypeError(`No method named "${config}"`);
		          }
		          data[config]();
		        }
		      });
		    }
		  }
		  /**
		   * Data API implementation
		   */

		  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_SLIDE, function (event) {
		    const target = index.getElementFromSelector(this);
		    if (!target || !target.classList.contains(CLASS_NAME_CAROUSEL)) {
		      return;
		    }
		    event.preventDefault();
		    const carousel = Carousel.getOrCreateInstance(target);
		    const slideIndex = this.getAttribute('data-bs-slide-to');
		    if (slideIndex) {
		      carousel.to(slideIndex);
		      carousel._maybeEnableCycle();
		      return;
		    }
		    if (Manipulator__default.default.getDataAttribute(this, 'slide') === 'next') {
		      carousel.next();
		      carousel._maybeEnableCycle();
		      return;
		    }
		    carousel.prev();
		    carousel._maybeEnableCycle();
		  });
		  EventHandler__default.default.on(window, EVENT_LOAD_DATA_API, () => {
		    const carousels = SelectorEngine__default.default.find(SELECTOR_DATA_RIDE);
		    for (const carousel of carousels) {
		      Carousel.getOrCreateInstance(carousel);
		    }
		  });
		  /**
		   * jQuery
		   */

		  index.defineJQueryPlugin(Carousel);
		  return Carousel;
		});
	} (carousel$1));

	var carousel = carousel$1.exports;

	var collapse$1 = {exports: {}};

	/*!
	  * Bootstrap collapse.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
		(function (global, factory) {
		  module.exports = factory(requireUtil(), requireEventHandler(), requireSelectorEngine(), requireBaseComponent()) ;
		})(commonjsGlobal, function (index, EventHandler, SelectorEngine, BaseComponent) {

		  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
		    default: e
		  };
		  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
		  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
		  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

		  /**
		   * --------------------------------------------------------------------------
		   * Bootstrap (v5.2.3): collapse.js
		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		   * --------------------------------------------------------------------------
		   */
		  /**
		   * Constants
		   */

		  const NAME = 'collapse';
		  const DATA_KEY = 'bs.collapse';
		  const EVENT_KEY = `.${DATA_KEY}`;
		  const DATA_API_KEY = '.data-api';
		  const EVENT_SHOW = `show${EVENT_KEY}`;
		  const EVENT_SHOWN = `shown${EVENT_KEY}`;
		  const EVENT_HIDE = `hide${EVENT_KEY}`;
		  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
		  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
		  const CLASS_NAME_SHOW = 'show';
		  const CLASS_NAME_COLLAPSE = 'collapse';
		  const CLASS_NAME_COLLAPSING = 'collapsing';
		  const CLASS_NAME_COLLAPSED = 'collapsed';
		  const CLASS_NAME_DEEPER_CHILDREN = `:scope .${CLASS_NAME_COLLAPSE} .${CLASS_NAME_COLLAPSE}`;
		  const CLASS_NAME_HORIZONTAL = 'collapse-horizontal';
		  const WIDTH = 'width';
		  const HEIGHT = 'height';
		  const SELECTOR_ACTIVES = '.collapse.show, .collapse.collapsing';
		  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="collapse"]';
		  const Default = {
		    parent: null,
		    toggle: true
		  };
		  const DefaultType = {
		    parent: '(null|element)',
		    toggle: 'boolean'
		  };
		  /**
		   * Class definition
		   */

		  class Collapse extends BaseComponent__default.default {
		    constructor(element, config) {
		      super(element, config);
		      this._isTransitioning = false;
		      this._triggerArray = [];
		      const toggleList = SelectorEngine__default.default.find(SELECTOR_DATA_TOGGLE);
		      for (const elem of toggleList) {
		        const selector = index.getSelectorFromElement(elem);
		        const filterElement = SelectorEngine__default.default.find(selector).filter(foundElement => foundElement === this._element);
		        if (selector !== null && filterElement.length) {
		          this._triggerArray.push(elem);
		        }
		      }
		      this._initializeChildren();
		      if (!this._config.parent) {
		        this._addAriaAndCollapsedClass(this._triggerArray, this._isShown());
		      }
		      if (this._config.toggle) {
		        this.toggle();
		      }
		    } // Getters

		    static get Default() {
		      return Default;
		    }
		    static get DefaultType() {
		      return DefaultType;
		    }
		    static get NAME() {
		      return NAME;
		    } // Public

		    toggle() {
		      if (this._isShown()) {
		        this.hide();
		      } else {
		        this.show();
		      }
		    }
		    show() {
		      if (this._isTransitioning || this._isShown()) {
		        return;
		      }
		      let activeChildren = []; // find active children

		      if (this._config.parent) {
		        activeChildren = this._getFirstLevelChildren(SELECTOR_ACTIVES).filter(element => element !== this._element).map(element => Collapse.getOrCreateInstance(element, {
		          toggle: false
		        }));
		      }
		      if (activeChildren.length && activeChildren[0]._isTransitioning) {
		        return;
		      }
		      const startEvent = EventHandler__default.default.trigger(this._element, EVENT_SHOW);
		      if (startEvent.defaultPrevented) {
		        return;
		      }
		      for (const activeInstance of activeChildren) {
		        activeInstance.hide();
		      }
		      const dimension = this._getDimension();
		      this._element.classList.remove(CLASS_NAME_COLLAPSE);
		      this._element.classList.add(CLASS_NAME_COLLAPSING);
		      this._element.style[dimension] = 0;
		      this._addAriaAndCollapsedClass(this._triggerArray, true);
		      this._isTransitioning = true;
		      const complete = () => {
		        this._isTransitioning = false;
		        this._element.classList.remove(CLASS_NAME_COLLAPSING);
		        this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);
		        this._element.style[dimension] = '';
		        EventHandler__default.default.trigger(this._element, EVENT_SHOWN);
		      };
		      const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
		      const scrollSize = `scroll${capitalizedDimension}`;
		      this._queueCallback(complete, this._element, true);
		      this._element.style[dimension] = `${this._element[scrollSize]}px`;
		    }
		    hide() {
		      if (this._isTransitioning || !this._isShown()) {
		        return;
		      }
		      const startEvent = EventHandler__default.default.trigger(this._element, EVENT_HIDE);
		      if (startEvent.defaultPrevented) {
		        return;
		      }
		      const dimension = this._getDimension();
		      this._element.style[dimension] = `${this._element.getBoundingClientRect()[dimension]}px`;
		      index.reflow(this._element);
		      this._element.classList.add(CLASS_NAME_COLLAPSING);
		      this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);
		      for (const trigger of this._triggerArray) {
		        const element = index.getElementFromSelector(trigger);
		        if (element && !this._isShown(element)) {
		          this._addAriaAndCollapsedClass([trigger], false);
		        }
		      }
		      this._isTransitioning = true;
		      const complete = () => {
		        this._isTransitioning = false;
		        this._element.classList.remove(CLASS_NAME_COLLAPSING);
		        this._element.classList.add(CLASS_NAME_COLLAPSE);
		        EventHandler__default.default.trigger(this._element, EVENT_HIDDEN);
		      };
		      this._element.style[dimension] = '';
		      this._queueCallback(complete, this._element, true);
		    }
		    _isShown(element = this._element) {
		      return element.classList.contains(CLASS_NAME_SHOW);
		    } // Private

		    _configAfterMerge(config) {
		      config.toggle = Boolean(config.toggle); // Coerce string values

		      config.parent = index.getElement(config.parent);
		      return config;
		    }
		    _getDimension() {
		      return this._element.classList.contains(CLASS_NAME_HORIZONTAL) ? WIDTH : HEIGHT;
		    }
		    _initializeChildren() {
		      if (!this._config.parent) {
		        return;
		      }
		      const children = this._getFirstLevelChildren(SELECTOR_DATA_TOGGLE);
		      for (const element of children) {
		        const selected = index.getElementFromSelector(element);
		        if (selected) {
		          this._addAriaAndCollapsedClass([element], this._isShown(selected));
		        }
		      }
		    }
		    _getFirstLevelChildren(selector) {
		      const children = SelectorEngine__default.default.find(CLASS_NAME_DEEPER_CHILDREN, this._config.parent); // remove children if greater depth

		      return SelectorEngine__default.default.find(selector, this._config.parent).filter(element => !children.includes(element));
		    }
		    _addAriaAndCollapsedClass(triggerArray, isOpen) {
		      if (!triggerArray.length) {
		        return;
		      }
		      for (const element of triggerArray) {
		        element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
		        element.setAttribute('aria-expanded', isOpen);
		      }
		    } // Static

		    static jQueryInterface(config) {
		      const _config = {};
		      if (typeof config === 'string' && /show|hide/.test(config)) {
		        _config.toggle = false;
		      }
		      return this.each(function () {
		        const data = Collapse.getOrCreateInstance(this, _config);
		        if (typeof config === 'string') {
		          if (typeof data[config] === 'undefined') {
		            throw new TypeError(`No method named "${config}"`);
		          }
		          data[config]();
		        }
		      });
		    }
		  }
		  /**
		   * Data API implementation
		   */

		  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
		    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
		    if (event.target.tagName === 'A' || event.delegateTarget && event.delegateTarget.tagName === 'A') {
		      event.preventDefault();
		    }
		    const selector = index.getSelectorFromElement(this);
		    const selectorElements = SelectorEngine__default.default.find(selector);
		    for (const element of selectorElements) {
		      Collapse.getOrCreateInstance(element, {
		        toggle: false
		      }).toggle();
		    }
		  });
		  /**
		   * jQuery
		   */

		  index.defineJQueryPlugin(Collapse);
		  return Collapse;
		});
	} (collapse$1));

	var collapse = collapse$1.exports;

	var dropdown$1 = {exports: {}};

	var top = 'top';
	var bottom = 'bottom';
	var right = 'right';
	var left = 'left';
	var auto = 'auto';
	var basePlacements = [top, bottom, right, left];
	var start = 'start';
	var end = 'end';
	var clippingParents = 'clippingParents';
	var viewport = 'viewport';
	var popper = 'popper';
	var reference = 'reference';
	var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
	  return acc.concat([placement + "-" + start, placement + "-" + end]);
	}, []);
	var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
	  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
	}, []); // modifiers that need to read the DOM

	var beforeRead = 'beforeRead';
	var read = 'read';
	var afterRead = 'afterRead'; // pure-logic modifiers

	var beforeMain = 'beforeMain';
	var main = 'main';
	var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

	var beforeWrite = 'beforeWrite';
	var write = 'write';
	var afterWrite = 'afterWrite';
	var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

	function getNodeName(element) {
	  return element ? (element.nodeName || '').toLowerCase() : null;
	}

	function getWindow(node) {
	  if (node == null) {
	    return window;
	  }
	  if (node.toString() !== '[object Window]') {
	    var ownerDocument = node.ownerDocument;
	    return ownerDocument ? ownerDocument.defaultView || window : window;
	  }
	  return node;
	}

	function isElement(node) {
	  var OwnElement = getWindow(node).Element;
	  return node instanceof OwnElement || node instanceof Element;
	}
	function isHTMLElement(node) {
	  var OwnElement = getWindow(node).HTMLElement;
	  return node instanceof OwnElement || node instanceof HTMLElement;
	}
	function isShadowRoot(node) {
	  // IE 11 has no ShadowRoot
	  if (typeof ShadowRoot === 'undefined') {
	    return false;
	  }
	  var OwnElement = getWindow(node).ShadowRoot;
	  return node instanceof OwnElement || node instanceof ShadowRoot;
	}

	// and applies them to the HTMLElements such as popper and arrow

	function applyStyles(_ref) {
	  var state = _ref.state;
	  Object.keys(state.elements).forEach(function (name) {
	    var style = state.styles[name] || {};
	    var attributes = state.attributes[name] || {};
	    var element = state.elements[name]; // arrow is optional + virtual elements

	    if (!isHTMLElement(element) || !getNodeName(element)) {
	      return;
	    } // Flow doesn't support to extend this property, but it's the most
	    // effective way to apply styles to an HTMLElement
	    // $FlowFixMe[cannot-write]

	    Object.assign(element.style, style);
	    Object.keys(attributes).forEach(function (name) {
	      var value = attributes[name];
	      if (value === false) {
	        element.removeAttribute(name);
	      } else {
	        element.setAttribute(name, value === true ? '' : value);
	      }
	    });
	  });
	}
	function effect$2(_ref2) {
	  var state = _ref2.state;
	  var initialStyles = {
	    popper: {
	      position: state.options.strategy,
	      left: '0',
	      top: '0',
	      margin: '0'
	    },
	    arrow: {
	      position: 'absolute'
	    },
	    reference: {}
	  };
	  Object.assign(state.elements.popper.style, initialStyles.popper);
	  state.styles = initialStyles;
	  if (state.elements.arrow) {
	    Object.assign(state.elements.arrow.style, initialStyles.arrow);
	  }
	  return function () {
	    Object.keys(state.elements).forEach(function (name) {
	      var element = state.elements[name];
	      var attributes = state.attributes[name] || {};
	      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

	      var style = styleProperties.reduce(function (style, property) {
	        style[property] = '';
	        return style;
	      }, {}); // arrow is optional + virtual elements

	      if (!isHTMLElement(element) || !getNodeName(element)) {
	        return;
	      }
	      Object.assign(element.style, style);
	      Object.keys(attributes).forEach(function (attribute) {
	        element.removeAttribute(attribute);
	      });
	    });
	  };
	} // eslint-disable-next-line import/no-unused-modules

	var applyStyles$1 = {
	  name: 'applyStyles',
	  enabled: true,
	  phase: 'write',
	  fn: applyStyles,
	  effect: effect$2,
	  requires: ['computeStyles']
	};

	function getBasePlacement(placement) {
	  return placement.split('-')[0];
	}

	var max = Math.max;
	var min = Math.min;
	var round = Math.round;

	function getUAString() {
	  var uaData = navigator.userAgentData;
	  if (uaData != null && uaData.brands) {
	    return uaData.brands.map(function (item) {
	      return item.brand + "/" + item.version;
	    }).join(' ');
	  }
	  return navigator.userAgent;
	}

	function isLayoutViewport() {
	  return !/^((?!chrome|android).)*safari/i.test(getUAString());
	}

	function getBoundingClientRect(element, includeScale, isFixedStrategy) {
	  if (includeScale === void 0) {
	    includeScale = false;
	  }
	  if (isFixedStrategy === void 0) {
	    isFixedStrategy = false;
	  }
	  var clientRect = element.getBoundingClientRect();
	  var scaleX = 1;
	  var scaleY = 1;
	  if (includeScale && isHTMLElement(element)) {
	    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
	    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
	  }
	  var _ref = isElement(element) ? getWindow(element) : window,
	    visualViewport = _ref.visualViewport;
	  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
	  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
	  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
	  var width = clientRect.width / scaleX;
	  var height = clientRect.height / scaleY;
	  return {
	    width: width,
	    height: height,
	    top: y,
	    right: x + width,
	    bottom: y + height,
	    left: x,
	    x: x,
	    y: y
	  };
	}

	// means it doesn't take into account transforms.

	function getLayoutRect(element) {
	  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
	  // Fixes https://github.com/popperjs/popper-core/issues/1223

	  var width = element.offsetWidth;
	  var height = element.offsetHeight;
	  if (Math.abs(clientRect.width - width) <= 1) {
	    width = clientRect.width;
	  }
	  if (Math.abs(clientRect.height - height) <= 1) {
	    height = clientRect.height;
	  }
	  return {
	    x: element.offsetLeft,
	    y: element.offsetTop,
	    width: width,
	    height: height
	  };
	}

	function contains(parent, child) {
	  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

	  if (parent.contains(child)) {
	    return true;
	  } // then fallback to custom implementation with Shadow DOM support
	  else if (rootNode && isShadowRoot(rootNode)) {
	    var next = child;
	    do {
	      if (next && parent.isSameNode(next)) {
	        return true;
	      } // $FlowFixMe[prop-missing]: need a better way to handle this...

	      next = next.parentNode || next.host;
	    } while (next);
	  } // Give up, the result is false

	  return false;
	}

	function getComputedStyle$1(element) {
	  return getWindow(element).getComputedStyle(element);
	}

	function isTableElement(element) {
	  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
	}

	function getDocumentElement(element) {
	  // $FlowFixMe[incompatible-return]: assume body is always available
	  return ((isElement(element) ? element.ownerDocument :
	  // $FlowFixMe[prop-missing]
	  element.document) || window.document).documentElement;
	}

	function getParentNode(element) {
	  if (getNodeName(element) === 'html') {
	    return element;
	  }
	  return (
	    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
	    // $FlowFixMe[incompatible-return]
	    // $FlowFixMe[prop-missing]
	    element.assignedSlot ||
	    // step into the shadow DOM of the parent of a slotted node
	    element.parentNode || (
	    // DOM Element detected
	    isShadowRoot(element) ? element.host : null) ||
	    // ShadowRoot detected
	    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
	    getDocumentElement(element) // fallback
	  );
	}

	function getTrueOffsetParent(element) {
	  if (!isHTMLElement(element) ||
	  // https://github.com/popperjs/popper-core/issues/837
	  getComputedStyle$1(element).position === 'fixed') {
	    return null;
	  }
	  return element.offsetParent;
	} // `.offsetParent` reports `null` for fixed elements, while absolute elements
	// return the containing block

	function getContainingBlock(element) {
	  var isFirefox = /firefox/i.test(getUAString());
	  var isIE = /Trident/i.test(getUAString());
	  if (isIE && isHTMLElement(element)) {
	    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
	    var elementCss = getComputedStyle$1(element);
	    if (elementCss.position === 'fixed') {
	      return null;
	    }
	  }
	  var currentNode = getParentNode(element);
	  if (isShadowRoot(currentNode)) {
	    currentNode = currentNode.host;
	  }
	  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
	    var css = getComputedStyle$1(currentNode); // This is non-exhaustive but covers the most common CSS properties that
	    // create a containing block.
	    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

	    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
	      return currentNode;
	    } else {
	      currentNode = currentNode.parentNode;
	    }
	  }
	  return null;
	} // Gets the closest ancestor positioned element. Handles some edge cases,
	// such as table ancestors and cross browser bugs.

	function getOffsetParent(element) {
	  var window = getWindow(element);
	  var offsetParent = getTrueOffsetParent(element);
	  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === 'static') {
	    offsetParent = getTrueOffsetParent(offsetParent);
	  }
	  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle$1(offsetParent).position === 'static')) {
	    return window;
	  }
	  return offsetParent || getContainingBlock(element) || window;
	}

	function getMainAxisFromPlacement(placement) {
	  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
	}

	function within(min$1, value, max$1) {
	  return max(min$1, min(value, max$1));
	}
	function withinMaxClamp(min, value, max) {
	  var v = within(min, value, max);
	  return v > max ? max : v;
	}

	function getFreshSideObject() {
	  return {
	    top: 0,
	    right: 0,
	    bottom: 0,
	    left: 0
	  };
	}

	function mergePaddingObject(paddingObject) {
	  return Object.assign({}, getFreshSideObject(), paddingObject);
	}

	function expandToHashMap(value, keys) {
	  return keys.reduce(function (hashMap, key) {
	    hashMap[key] = value;
	    return hashMap;
	  }, {});
	}

	var toPaddingObject = function toPaddingObject(padding, state) {
	  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
	    placement: state.placement
	  })) : padding;
	  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
	};
	function arrow(_ref) {
	  var _state$modifiersData$;
	  var state = _ref.state,
	    name = _ref.name,
	    options = _ref.options;
	  var arrowElement = state.elements.arrow;
	  var popperOffsets = state.modifiersData.popperOffsets;
	  var basePlacement = getBasePlacement(state.placement);
	  var axis = getMainAxisFromPlacement(basePlacement);
	  var isVertical = [left, right].indexOf(basePlacement) >= 0;
	  var len = isVertical ? 'height' : 'width';
	  if (!arrowElement || !popperOffsets) {
	    return;
	  }
	  var paddingObject = toPaddingObject(options.padding, state);
	  var arrowRect = getLayoutRect(arrowElement);
	  var minProp = axis === 'y' ? top : left;
	  var maxProp = axis === 'y' ? bottom : right;
	  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
	  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
	  var arrowOffsetParent = getOffsetParent(arrowElement);
	  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
	  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
	  // outside of the popper bounds

	  var min = paddingObject[minProp];
	  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
	  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
	  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

	  var axisProp = axis;
	  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
	}
	function effect$1(_ref2) {
	  var state = _ref2.state,
	    options = _ref2.options;
	  var _options$element = options.element,
	    arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;
	  if (arrowElement == null) {
	    return;
	  } // CSS selector

	  if (typeof arrowElement === 'string') {
	    arrowElement = state.elements.popper.querySelector(arrowElement);
	    if (!arrowElement) {
	      return;
	    }
	  }
	  if (!contains(state.elements.popper, arrowElement)) {
	    return;
	  }
	  state.elements.arrow = arrowElement;
	} // eslint-disable-next-line import/no-unused-modules

	var arrow$1 = {
	  name: 'arrow',
	  enabled: true,
	  phase: 'main',
	  fn: arrow,
	  effect: effect$1,
	  requires: ['popperOffsets'],
	  requiresIfExists: ['preventOverflow']
	};

	function getVariation(placement) {
	  return placement.split('-')[1];
	}

	var unsetSides = {
	  top: 'auto',
	  right: 'auto',
	  bottom: 'auto',
	  left: 'auto'
	}; // Round the offsets to the nearest suitable subpixel based on the DPR.
	// Zooming can change the DPR, but it seems to report a value that will
	// cleanly divide the values into the appropriate subpixels.

	function roundOffsetsByDPR(_ref) {
	  var x = _ref.x,
	    y = _ref.y;
	  var win = window;
	  var dpr = win.devicePixelRatio || 1;
	  return {
	    x: round(x * dpr) / dpr || 0,
	    y: round(y * dpr) / dpr || 0
	  };
	}
	function mapToStyles(_ref2) {
	  var _Object$assign2;
	  var popper = _ref2.popper,
	    popperRect = _ref2.popperRect,
	    placement = _ref2.placement,
	    variation = _ref2.variation,
	    offsets = _ref2.offsets,
	    position = _ref2.position,
	    gpuAcceleration = _ref2.gpuAcceleration,
	    adaptive = _ref2.adaptive,
	    roundOffsets = _ref2.roundOffsets,
	    isFixed = _ref2.isFixed;
	  var _offsets$x = offsets.x,
	    x = _offsets$x === void 0 ? 0 : _offsets$x,
	    _offsets$y = offsets.y,
	    y = _offsets$y === void 0 ? 0 : _offsets$y;
	  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
	    x: x,
	    y: y
	  }) : {
	    x: x,
	    y: y
	  };
	  x = _ref3.x;
	  y = _ref3.y;
	  var hasX = offsets.hasOwnProperty('x');
	  var hasY = offsets.hasOwnProperty('y');
	  var sideX = left;
	  var sideY = top;
	  var win = window;
	  if (adaptive) {
	    var offsetParent = getOffsetParent(popper);
	    var heightProp = 'clientHeight';
	    var widthProp = 'clientWidth';
	    if (offsetParent === getWindow(popper)) {
	      offsetParent = getDocumentElement(popper);
	      if (getComputedStyle$1(offsetParent).position !== 'static' && position === 'absolute') {
	        heightProp = 'scrollHeight';
	        widthProp = 'scrollWidth';
	      }
	    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it

	    offsetParent = offsetParent;
	    if (placement === top || (placement === left || placement === right) && variation === end) {
	      sideY = bottom;
	      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height :
	      // $FlowFixMe[prop-missing]
	      offsetParent[heightProp];
	      y -= offsetY - popperRect.height;
	      y *= gpuAcceleration ? 1 : -1;
	    }
	    if (placement === left || (placement === top || placement === bottom) && variation === end) {
	      sideX = right;
	      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width :
	      // $FlowFixMe[prop-missing]
	      offsetParent[widthProp];
	      x -= offsetX - popperRect.width;
	      x *= gpuAcceleration ? 1 : -1;
	    }
	  }
	  var commonStyles = Object.assign({
	    position: position
	  }, adaptive && unsetSides);
	  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
	    x: x,
	    y: y
	  }) : {
	    x: x,
	    y: y
	  };
	  x = _ref4.x;
	  y = _ref4.y;
	  if (gpuAcceleration) {
	    var _Object$assign;
	    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
	  }
	  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
	}
	function computeStyles(_ref5) {
	  var state = _ref5.state,
	    options = _ref5.options;
	  var _options$gpuAccelerat = options.gpuAcceleration,
	    gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
	    _options$adaptive = options.adaptive,
	    adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
	    _options$roundOffsets = options.roundOffsets,
	    roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
	  var commonStyles = {
	    placement: getBasePlacement(state.placement),
	    variation: getVariation(state.placement),
	    popper: state.elements.popper,
	    popperRect: state.rects.popper,
	    gpuAcceleration: gpuAcceleration,
	    isFixed: state.options.strategy === 'fixed'
	  };
	  if (state.modifiersData.popperOffsets != null) {
	    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
	      offsets: state.modifiersData.popperOffsets,
	      position: state.options.strategy,
	      adaptive: adaptive,
	      roundOffsets: roundOffsets
	    })));
	  }
	  if (state.modifiersData.arrow != null) {
	    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
	      offsets: state.modifiersData.arrow,
	      position: 'absolute',
	      adaptive: false,
	      roundOffsets: roundOffsets
	    })));
	  }
	  state.attributes.popper = Object.assign({}, state.attributes.popper, {
	    'data-popper-placement': state.placement
	  });
	} // eslint-disable-next-line import/no-unused-modules

	var computeStyles$1 = {
	  name: 'computeStyles',
	  enabled: true,
	  phase: 'beforeWrite',
	  fn: computeStyles,
	  data: {}
	};

	var passive = {
	  passive: true
	};
	function effect(_ref) {
	  var state = _ref.state,
	    instance = _ref.instance,
	    options = _ref.options;
	  var _options$scroll = options.scroll,
	    scroll = _options$scroll === void 0 ? true : _options$scroll,
	    _options$resize = options.resize,
	    resize = _options$resize === void 0 ? true : _options$resize;
	  var window = getWindow(state.elements.popper);
	  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
	  if (scroll) {
	    scrollParents.forEach(function (scrollParent) {
	      scrollParent.addEventListener('scroll', instance.update, passive);
	    });
	  }
	  if (resize) {
	    window.addEventListener('resize', instance.update, passive);
	  }
	  return function () {
	    if (scroll) {
	      scrollParents.forEach(function (scrollParent) {
	        scrollParent.removeEventListener('scroll', instance.update, passive);
	      });
	    }
	    if (resize) {
	      window.removeEventListener('resize', instance.update, passive);
	    }
	  };
	} // eslint-disable-next-line import/no-unused-modules

	var eventListeners = {
	  name: 'eventListeners',
	  enabled: true,
	  phase: 'write',
	  fn: function fn() {},
	  effect: effect,
	  data: {}
	};

	var hash$1 = {
	  left: 'right',
	  right: 'left',
	  bottom: 'top',
	  top: 'bottom'
	};
	function getOppositePlacement(placement) {
	  return placement.replace(/left|right|bottom|top/g, function (matched) {
	    return hash$1[matched];
	  });
	}

	var hash = {
	  start: 'end',
	  end: 'start'
	};
	function getOppositeVariationPlacement(placement) {
	  return placement.replace(/start|end/g, function (matched) {
	    return hash[matched];
	  });
	}

	function getWindowScroll(node) {
	  var win = getWindow(node);
	  var scrollLeft = win.pageXOffset;
	  var scrollTop = win.pageYOffset;
	  return {
	    scrollLeft: scrollLeft,
	    scrollTop: scrollTop
	  };
	}

	function getWindowScrollBarX(element) {
	  // If <html> has a CSS width greater than the viewport, then this will be
	  // incorrect for RTL.
	  // Popper 1 is broken in this case and never had a bug report so let's assume
	  // it's not an issue. I don't think anyone ever specifies width on <html>
	  // anyway.
	  // Browsers where the left scrollbar doesn't cause an issue report `0` for
	  // this (e.g. Edge 2019, IE11, Safari)
	  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
	}

	function getViewportRect(element, strategy) {
	  var win = getWindow(element);
	  var html = getDocumentElement(element);
	  var visualViewport = win.visualViewport;
	  var width = html.clientWidth;
	  var height = html.clientHeight;
	  var x = 0;
	  var y = 0;
	  if (visualViewport) {
	    width = visualViewport.width;
	    height = visualViewport.height;
	    var layoutViewport = isLayoutViewport();
	    if (layoutViewport || !layoutViewport && strategy === 'fixed') {
	      x = visualViewport.offsetLeft;
	      y = visualViewport.offsetTop;
	    }
	  }
	  return {
	    width: width,
	    height: height,
	    x: x + getWindowScrollBarX(element),
	    y: y
	  };
	}

	// of the `<html>` and `<body>` rect bounds if horizontally scrollable

	function getDocumentRect(element) {
	  var _element$ownerDocumen;
	  var html = getDocumentElement(element);
	  var winScroll = getWindowScroll(element);
	  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
	  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
	  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
	  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
	  var y = -winScroll.scrollTop;
	  if (getComputedStyle$1(body || html).direction === 'rtl') {
	    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
	  }
	  return {
	    width: width,
	    height: height,
	    x: x,
	    y: y
	  };
	}

	function isScrollParent(element) {
	  // Firefox wants us to check `-x` and `-y` variations as well
	  var _getComputedStyle = getComputedStyle$1(element),
	    overflow = _getComputedStyle.overflow,
	    overflowX = _getComputedStyle.overflowX,
	    overflowY = _getComputedStyle.overflowY;
	  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
	}

	function getScrollParent(node) {
	  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
	    // $FlowFixMe[incompatible-return]: assume body is always available
	    return node.ownerDocument.body;
	  }
	  if (isHTMLElement(node) && isScrollParent(node)) {
	    return node;
	  }
	  return getScrollParent(getParentNode(node));
	}

	/*
	given a DOM element, return the list of all scroll parents, up the list of ancesors
	until we get to the top window object. This list is what we attach scroll listeners
	to, because if any of these parent elements scroll, we'll need to re-calculate the
	reference element's position.
	*/

	function listScrollParents(element, list) {
	  var _element$ownerDocumen;
	  if (list === void 0) {
	    list = [];
	  }
	  var scrollParent = getScrollParent(element);
	  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
	  var win = getWindow(scrollParent);
	  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
	  var updatedList = list.concat(target);
	  return isBody ? updatedList :
	  // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
	  updatedList.concat(listScrollParents(getParentNode(target)));
	}

	function rectToClientRect(rect) {
	  return Object.assign({}, rect, {
	    left: rect.x,
	    top: rect.y,
	    right: rect.x + rect.width,
	    bottom: rect.y + rect.height
	  });
	}

	function getInnerBoundingClientRect(element, strategy) {
	  var rect = getBoundingClientRect(element, false, strategy === 'fixed');
	  rect.top = rect.top + element.clientTop;
	  rect.left = rect.left + element.clientLeft;
	  rect.bottom = rect.top + element.clientHeight;
	  rect.right = rect.left + element.clientWidth;
	  rect.width = element.clientWidth;
	  rect.height = element.clientHeight;
	  rect.x = rect.left;
	  rect.y = rect.top;
	  return rect;
	}
	function getClientRectFromMixedType(element, clippingParent, strategy) {
	  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
	} // A "clipping parent" is an overflowable container with the characteristic of
	// clipping (or hiding) overflowing elements with a position different from
	// `initial`

	function getClippingParents(element) {
	  var clippingParents = listScrollParents(getParentNode(element));
	  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle$1(element).position) >= 0;
	  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
	  if (!isElement(clipperElement)) {
	    return [];
	  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414

	  return clippingParents.filter(function (clippingParent) {
	    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
	  });
	} // Gets the maximum area that the element is visible in due to any number of
	// clipping parents

	function getClippingRect(element, boundary, rootBoundary, strategy) {
	  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
	  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
	  var firstClippingParent = clippingParents[0];
	  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
	    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
	    accRect.top = max(rect.top, accRect.top);
	    accRect.right = min(rect.right, accRect.right);
	    accRect.bottom = min(rect.bottom, accRect.bottom);
	    accRect.left = max(rect.left, accRect.left);
	    return accRect;
	  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
	  clippingRect.width = clippingRect.right - clippingRect.left;
	  clippingRect.height = clippingRect.bottom - clippingRect.top;
	  clippingRect.x = clippingRect.left;
	  clippingRect.y = clippingRect.top;
	  return clippingRect;
	}

	function computeOffsets(_ref) {
	  var reference = _ref.reference,
	    element = _ref.element,
	    placement = _ref.placement;
	  var basePlacement = placement ? getBasePlacement(placement) : null;
	  var variation = placement ? getVariation(placement) : null;
	  var commonX = reference.x + reference.width / 2 - element.width / 2;
	  var commonY = reference.y + reference.height / 2 - element.height / 2;
	  var offsets;
	  switch (basePlacement) {
	    case top:
	      offsets = {
	        x: commonX,
	        y: reference.y - element.height
	      };
	      break;
	    case bottom:
	      offsets = {
	        x: commonX,
	        y: reference.y + reference.height
	      };
	      break;
	    case right:
	      offsets = {
	        x: reference.x + reference.width,
	        y: commonY
	      };
	      break;
	    case left:
	      offsets = {
	        x: reference.x - element.width,
	        y: commonY
	      };
	      break;
	    default:
	      offsets = {
	        x: reference.x,
	        y: reference.y
	      };
	  }
	  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
	  if (mainAxis != null) {
	    var len = mainAxis === 'y' ? 'height' : 'width';
	    switch (variation) {
	      case start:
	        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
	        break;
	      case end:
	        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
	        break;
	    }
	  }
	  return offsets;
	}

	function detectOverflow(state, options) {
	  if (options === void 0) {
	    options = {};
	  }
	  var _options = options,
	    _options$placement = _options.placement,
	    placement = _options$placement === void 0 ? state.placement : _options$placement,
	    _options$strategy = _options.strategy,
	    strategy = _options$strategy === void 0 ? state.strategy : _options$strategy,
	    _options$boundary = _options.boundary,
	    boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
	    _options$rootBoundary = _options.rootBoundary,
	    rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
	    _options$elementConte = _options.elementContext,
	    elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
	    _options$altBoundary = _options.altBoundary,
	    altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
	    _options$padding = _options.padding,
	    padding = _options$padding === void 0 ? 0 : _options$padding;
	  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
	  var altContext = elementContext === popper ? reference : popper;
	  var popperRect = state.rects.popper;
	  var element = state.elements[altBoundary ? altContext : elementContext];
	  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary, strategy);
	  var referenceClientRect = getBoundingClientRect(state.elements.reference);
	  var popperOffsets = computeOffsets({
	    reference: referenceClientRect,
	    element: popperRect,
	    strategy: 'absolute',
	    placement: placement
	  });
	  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
	  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
	  // 0 or negative = within the clipping rect

	  var overflowOffsets = {
	    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
	    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
	    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
	    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
	  };
	  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

	  if (elementContext === popper && offsetData) {
	    var offset = offsetData[placement];
	    Object.keys(overflowOffsets).forEach(function (key) {
	      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
	      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
	      overflowOffsets[key] += offset[axis] * multiply;
	    });
	  }
	  return overflowOffsets;
	}

	function computeAutoPlacement(state, options) {
	  if (options === void 0) {
	    options = {};
	  }
	  var _options = options,
	    placement = _options.placement,
	    boundary = _options.boundary,
	    rootBoundary = _options.rootBoundary,
	    padding = _options.padding,
	    flipVariations = _options.flipVariations,
	    _options$allowedAutoP = _options.allowedAutoPlacements,
	    allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
	  var variation = getVariation(placement);
	  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
	    return getVariation(placement) === variation;
	  }) : basePlacements;
	  var allowedPlacements = placements$1.filter(function (placement) {
	    return allowedAutoPlacements.indexOf(placement) >= 0;
	  });
	  if (allowedPlacements.length === 0) {
	    allowedPlacements = placements$1;
	  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...

	  var overflows = allowedPlacements.reduce(function (acc, placement) {
	    acc[placement] = detectOverflow(state, {
	      placement: placement,
	      boundary: boundary,
	      rootBoundary: rootBoundary,
	      padding: padding
	    })[getBasePlacement(placement)];
	    return acc;
	  }, {});
	  return Object.keys(overflows).sort(function (a, b) {
	    return overflows[a] - overflows[b];
	  });
	}

	function getExpandedFallbackPlacements(placement) {
	  if (getBasePlacement(placement) === auto) {
	    return [];
	  }
	  var oppositePlacement = getOppositePlacement(placement);
	  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
	}
	function flip(_ref) {
	  var state = _ref.state,
	    options = _ref.options,
	    name = _ref.name;
	  if (state.modifiersData[name]._skip) {
	    return;
	  }
	  var _options$mainAxis = options.mainAxis,
	    checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
	    _options$altAxis = options.altAxis,
	    checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
	    specifiedFallbackPlacements = options.fallbackPlacements,
	    padding = options.padding,
	    boundary = options.boundary,
	    rootBoundary = options.rootBoundary,
	    altBoundary = options.altBoundary,
	    _options$flipVariatio = options.flipVariations,
	    flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
	    allowedAutoPlacements = options.allowedAutoPlacements;
	  var preferredPlacement = state.options.placement;
	  var basePlacement = getBasePlacement(preferredPlacement);
	  var isBasePlacement = basePlacement === preferredPlacement;
	  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
	  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
	    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
	      placement: placement,
	      boundary: boundary,
	      rootBoundary: rootBoundary,
	      padding: padding,
	      flipVariations: flipVariations,
	      allowedAutoPlacements: allowedAutoPlacements
	    }) : placement);
	  }, []);
	  var referenceRect = state.rects.reference;
	  var popperRect = state.rects.popper;
	  var checksMap = new Map();
	  var makeFallbackChecks = true;
	  var firstFittingPlacement = placements[0];
	  for (var i = 0; i < placements.length; i++) {
	    var placement = placements[i];
	    var _basePlacement = getBasePlacement(placement);
	    var isStartVariation = getVariation(placement) === start;
	    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
	    var len = isVertical ? 'width' : 'height';
	    var overflow = detectOverflow(state, {
	      placement: placement,
	      boundary: boundary,
	      rootBoundary: rootBoundary,
	      altBoundary: altBoundary,
	      padding: padding
	    });
	    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
	    if (referenceRect[len] > popperRect[len]) {
	      mainVariationSide = getOppositePlacement(mainVariationSide);
	    }
	    var altVariationSide = getOppositePlacement(mainVariationSide);
	    var checks = [];
	    if (checkMainAxis) {
	      checks.push(overflow[_basePlacement] <= 0);
	    }
	    if (checkAltAxis) {
	      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
	    }
	    if (checks.every(function (check) {
	      return check;
	    })) {
	      firstFittingPlacement = placement;
	      makeFallbackChecks = false;
	      break;
	    }
	    checksMap.set(placement, checks);
	  }
	  if (makeFallbackChecks) {
	    // `2` may be desired in some cases – research later
	    var numberOfChecks = flipVariations ? 3 : 1;
	    var _loop = function _loop(_i) {
	      var fittingPlacement = placements.find(function (placement) {
	        var checks = checksMap.get(placement);
	        if (checks) {
	          return checks.slice(0, _i).every(function (check) {
	            return check;
	          });
	        }
	      });
	      if (fittingPlacement) {
	        firstFittingPlacement = fittingPlacement;
	        return "break";
	      }
	    };
	    for (var _i = numberOfChecks; _i > 0; _i--) {
	      var _ret = _loop(_i);
	      if (_ret === "break") break;
	    }
	  }
	  if (state.placement !== firstFittingPlacement) {
	    state.modifiersData[name]._skip = true;
	    state.placement = firstFittingPlacement;
	    state.reset = true;
	  }
	} // eslint-disable-next-line import/no-unused-modules

	var flip$1 = {
	  name: 'flip',
	  enabled: true,
	  phase: 'main',
	  fn: flip,
	  requiresIfExists: ['offset'],
	  data: {
	    _skip: false
	  }
	};

	function getSideOffsets(overflow, rect, preventedOffsets) {
	  if (preventedOffsets === void 0) {
	    preventedOffsets = {
	      x: 0,
	      y: 0
	    };
	  }
	  return {
	    top: overflow.top - rect.height - preventedOffsets.y,
	    right: overflow.right - rect.width + preventedOffsets.x,
	    bottom: overflow.bottom - rect.height + preventedOffsets.y,
	    left: overflow.left - rect.width - preventedOffsets.x
	  };
	}
	function isAnySideFullyClipped(overflow) {
	  return [top, right, bottom, left].some(function (side) {
	    return overflow[side] >= 0;
	  });
	}
	function hide(_ref) {
	  var state = _ref.state,
	    name = _ref.name;
	  var referenceRect = state.rects.reference;
	  var popperRect = state.rects.popper;
	  var preventedOffsets = state.modifiersData.preventOverflow;
	  var referenceOverflow = detectOverflow(state, {
	    elementContext: 'reference'
	  });
	  var popperAltOverflow = detectOverflow(state, {
	    altBoundary: true
	  });
	  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
	  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
	  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
	  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
	  state.modifiersData[name] = {
	    referenceClippingOffsets: referenceClippingOffsets,
	    popperEscapeOffsets: popperEscapeOffsets,
	    isReferenceHidden: isReferenceHidden,
	    hasPopperEscaped: hasPopperEscaped
	  };
	  state.attributes.popper = Object.assign({}, state.attributes.popper, {
	    'data-popper-reference-hidden': isReferenceHidden,
	    'data-popper-escaped': hasPopperEscaped
	  });
	} // eslint-disable-next-line import/no-unused-modules

	var hide$1 = {
	  name: 'hide',
	  enabled: true,
	  phase: 'main',
	  requiresIfExists: ['preventOverflow'],
	  fn: hide
	};

	function distanceAndSkiddingToXY(placement, rects, offset) {
	  var basePlacement = getBasePlacement(placement);
	  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
	  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
	      placement: placement
	    })) : offset,
	    skidding = _ref[0],
	    distance = _ref[1];
	  skidding = skidding || 0;
	  distance = (distance || 0) * invertDistance;
	  return [left, right].indexOf(basePlacement) >= 0 ? {
	    x: distance,
	    y: skidding
	  } : {
	    x: skidding,
	    y: distance
	  };
	}
	function offset(_ref2) {
	  var state = _ref2.state,
	    options = _ref2.options,
	    name = _ref2.name;
	  var _options$offset = options.offset,
	    offset = _options$offset === void 0 ? [0, 0] : _options$offset;
	  var data = placements.reduce(function (acc, placement) {
	    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
	    return acc;
	  }, {});
	  var _data$state$placement = data[state.placement],
	    x = _data$state$placement.x,
	    y = _data$state$placement.y;
	  if (state.modifiersData.popperOffsets != null) {
	    state.modifiersData.popperOffsets.x += x;
	    state.modifiersData.popperOffsets.y += y;
	  }
	  state.modifiersData[name] = data;
	} // eslint-disable-next-line import/no-unused-modules

	var offset$1 = {
	  name: 'offset',
	  enabled: true,
	  phase: 'main',
	  requires: ['popperOffsets'],
	  fn: offset
	};

	function popperOffsets(_ref) {
	  var state = _ref.state,
	    name = _ref.name;
	  // Offsets are the actual position the popper needs to have to be
	  // properly positioned near its reference element
	  // This is the most basic placement, and will be adjusted by
	  // the modifiers in the next step
	  state.modifiersData[name] = computeOffsets({
	    reference: state.rects.reference,
	    element: state.rects.popper,
	    strategy: 'absolute',
	    placement: state.placement
	  });
	} // eslint-disable-next-line import/no-unused-modules

	var popperOffsets$1 = {
	  name: 'popperOffsets',
	  enabled: true,
	  phase: 'read',
	  fn: popperOffsets,
	  data: {}
	};

	function getAltAxis(axis) {
	  return axis === 'x' ? 'y' : 'x';
	}

	function preventOverflow(_ref) {
	  var state = _ref.state,
	    options = _ref.options,
	    name = _ref.name;
	  var _options$mainAxis = options.mainAxis,
	    checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
	    _options$altAxis = options.altAxis,
	    checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
	    boundary = options.boundary,
	    rootBoundary = options.rootBoundary,
	    altBoundary = options.altBoundary,
	    padding = options.padding,
	    _options$tether = options.tether,
	    tether = _options$tether === void 0 ? true : _options$tether,
	    _options$tetherOffset = options.tetherOffset,
	    tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
	  var overflow = detectOverflow(state, {
	    boundary: boundary,
	    rootBoundary: rootBoundary,
	    padding: padding,
	    altBoundary: altBoundary
	  });
	  var basePlacement = getBasePlacement(state.placement);
	  var variation = getVariation(state.placement);
	  var isBasePlacement = !variation;
	  var mainAxis = getMainAxisFromPlacement(basePlacement);
	  var altAxis = getAltAxis(mainAxis);
	  var popperOffsets = state.modifiersData.popperOffsets;
	  var referenceRect = state.rects.reference;
	  var popperRect = state.rects.popper;
	  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
	    placement: state.placement
	  })) : tetherOffset;
	  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
	    mainAxis: tetherOffsetValue,
	    altAxis: tetherOffsetValue
	  } : Object.assign({
	    mainAxis: 0,
	    altAxis: 0
	  }, tetherOffsetValue);
	  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
	  var data = {
	    x: 0,
	    y: 0
	  };
	  if (!popperOffsets) {
	    return;
	  }
	  if (checkMainAxis) {
	    var _offsetModifierState$;
	    var mainSide = mainAxis === 'y' ? top : left;
	    var altSide = mainAxis === 'y' ? bottom : right;
	    var len = mainAxis === 'y' ? 'height' : 'width';
	    var offset = popperOffsets[mainAxis];
	    var min$1 = offset + overflow[mainSide];
	    var max$1 = offset - overflow[altSide];
	    var additive = tether ? -popperRect[len] / 2 : 0;
	    var minLen = variation === start ? referenceRect[len] : popperRect[len];
	    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
	    // outside the reference bounds

	    var arrowElement = state.elements.arrow;
	    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
	      width: 0,
	      height: 0
	    };
	    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
	    var arrowPaddingMin = arrowPaddingObject[mainSide];
	    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
	    // to include its full size in the calculation. If the reference is small
	    // and near the edge of a boundary, the popper can overflow even if the
	    // reference is not overflowing as well (e.g. virtual elements with no
	    // width or height)

	    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
	    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
	    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
	    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
	    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
	    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
	    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
	    var tetherMax = offset + maxOffset - offsetModifierValue;
	    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
	    popperOffsets[mainAxis] = preventedOffset;
	    data[mainAxis] = preventedOffset - offset;
	  }
	  if (checkAltAxis) {
	    var _offsetModifierState$2;
	    var _mainSide = mainAxis === 'x' ? top : left;
	    var _altSide = mainAxis === 'x' ? bottom : right;
	    var _offset = popperOffsets[altAxis];
	    var _len = altAxis === 'y' ? 'height' : 'width';
	    var _min = _offset + overflow[_mainSide];
	    var _max = _offset - overflow[_altSide];
	    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
	    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
	    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
	    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
	    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
	    popperOffsets[altAxis] = _preventedOffset;
	    data[altAxis] = _preventedOffset - _offset;
	  }
	  state.modifiersData[name] = data;
	} // eslint-disable-next-line import/no-unused-modules

	var preventOverflow$1 = {
	  name: 'preventOverflow',
	  enabled: true,
	  phase: 'main',
	  fn: preventOverflow,
	  requiresIfExists: ['offset']
	};

	function getHTMLElementScroll(element) {
	  return {
	    scrollLeft: element.scrollLeft,
	    scrollTop: element.scrollTop
	  };
	}

	function getNodeScroll(node) {
	  if (node === getWindow(node) || !isHTMLElement(node)) {
	    return getWindowScroll(node);
	  } else {
	    return getHTMLElementScroll(node);
	  }
	}

	function isElementScaled(element) {
	  var rect = element.getBoundingClientRect();
	  var scaleX = round(rect.width) / element.offsetWidth || 1;
	  var scaleY = round(rect.height) / element.offsetHeight || 1;
	  return scaleX !== 1 || scaleY !== 1;
	} // Returns the composite rect of an element relative to its offsetParent.
	// Composite means it takes into account transforms as well as layout.

	function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
	  if (isFixed === void 0) {
	    isFixed = false;
	  }
	  var isOffsetParentAnElement = isHTMLElement(offsetParent);
	  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
	  var documentElement = getDocumentElement(offsetParent);
	  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
	  var scroll = {
	    scrollLeft: 0,
	    scrollTop: 0
	  };
	  var offsets = {
	    x: 0,
	    y: 0
	  };
	  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
	    if (getNodeName(offsetParent) !== 'body' ||
	    // https://github.com/popperjs/popper-core/issues/1078
	    isScrollParent(documentElement)) {
	      scroll = getNodeScroll(offsetParent);
	    }
	    if (isHTMLElement(offsetParent)) {
	      offsets = getBoundingClientRect(offsetParent, true);
	      offsets.x += offsetParent.clientLeft;
	      offsets.y += offsetParent.clientTop;
	    } else if (documentElement) {
	      offsets.x = getWindowScrollBarX(documentElement);
	    }
	  }
	  return {
	    x: rect.left + scroll.scrollLeft - offsets.x,
	    y: rect.top + scroll.scrollTop - offsets.y,
	    width: rect.width,
	    height: rect.height
	  };
	}

	function order(modifiers) {
	  var map = new Map();
	  var visited = new Set();
	  var result = [];
	  modifiers.forEach(function (modifier) {
	    map.set(modifier.name, modifier);
	  }); // On visiting object, check for its dependencies and visit them recursively

	  function sort(modifier) {
	    visited.add(modifier.name);
	    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
	    requires.forEach(function (dep) {
	      if (!visited.has(dep)) {
	        var depModifier = map.get(dep);
	        if (depModifier) {
	          sort(depModifier);
	        }
	      }
	    });
	    result.push(modifier);
	  }
	  modifiers.forEach(function (modifier) {
	    if (!visited.has(modifier.name)) {
	      // check for visited object
	      sort(modifier);
	    }
	  });
	  return result;
	}
	function orderModifiers(modifiers) {
	  // order based on dependencies
	  var orderedModifiers = order(modifiers); // order based on phase

	  return modifierPhases.reduce(function (acc, phase) {
	    return acc.concat(orderedModifiers.filter(function (modifier) {
	      return modifier.phase === phase;
	    }));
	  }, []);
	}

	function debounce(fn) {
	  var pending;
	  return function () {
	    if (!pending) {
	      pending = new Promise(function (resolve) {
	        Promise.resolve().then(function () {
	          pending = undefined;
	          resolve(fn());
	        });
	      });
	    }
	    return pending;
	  };
	}

	function mergeByName(modifiers) {
	  var merged = modifiers.reduce(function (merged, current) {
	    var existing = merged[current.name];
	    merged[current.name] = existing ? Object.assign({}, existing, current, {
	      options: Object.assign({}, existing.options, current.options),
	      data: Object.assign({}, existing.data, current.data)
	    }) : current;
	    return merged;
	  }, {}); // IE11 does not support Object.values

	  return Object.keys(merged).map(function (key) {
	    return merged[key];
	  });
	}

	var DEFAULT_OPTIONS = {
	  placement: 'bottom',
	  modifiers: [],
	  strategy: 'absolute'
	};
	function areValidElements() {
	  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
	    args[_key] = arguments[_key];
	  }
	  return !args.some(function (element) {
	    return !(element && typeof element.getBoundingClientRect === 'function');
	  });
	}
	function popperGenerator(generatorOptions) {
	  if (generatorOptions === void 0) {
	    generatorOptions = {};
	  }
	  var _generatorOptions = generatorOptions,
	    _generatorOptions$def = _generatorOptions.defaultModifiers,
	    defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
	    _generatorOptions$def2 = _generatorOptions.defaultOptions,
	    defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
	  return function createPopper(reference, popper, options) {
	    if (options === void 0) {
	      options = defaultOptions;
	    }
	    var state = {
	      placement: 'bottom',
	      orderedModifiers: [],
	      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
	      modifiersData: {},
	      elements: {
	        reference: reference,
	        popper: popper
	      },
	      attributes: {},
	      styles: {}
	    };
	    var effectCleanupFns = [];
	    var isDestroyed = false;
	    var instance = {
	      state: state,
	      setOptions: function setOptions(setOptionsAction) {
	        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
	        cleanupModifierEffects();
	        state.options = Object.assign({}, defaultOptions, state.options, options);
	        state.scrollParents = {
	          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
	          popper: listScrollParents(popper)
	        }; // Orders the modifiers based on their dependencies and `phase`
	        // properties

	        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

	        state.orderedModifiers = orderedModifiers.filter(function (m) {
	          return m.enabled;
	        }); // Validate the provided modifiers so that the consumer will get warned
	        runModifierEffects();
	        return instance.update();
	      },
	      // Sync update – it will always be executed, even if not necessary. This
	      // is useful for low frequency updates where sync behavior simplifies the
	      // logic.
	      // For high frequency updates (e.g. `resize` and `scroll` events), always
	      // prefer the async Popper#update method
	      forceUpdate: function forceUpdate() {
	        if (isDestroyed) {
	          return;
	        }
	        var _state$elements = state.elements,
	          reference = _state$elements.reference,
	          popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
	        // anymore

	        if (!areValidElements(reference, popper)) {
	          return;
	        } // Store the reference and popper rects to be read by modifiers

	        state.rects = {
	          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
	          popper: getLayoutRect(popper)
	        }; // Modifiers have the ability to reset the current update cycle. The
	        // most common use case for this is the `flip` modifier changing the
	        // placement, which then needs to re-run all the modifiers, because the
	        // logic was previously ran for the previous placement and is therefore
	        // stale/incorrect

	        state.reset = false;
	        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
	        // is filled with the initial data specified by the modifier. This means
	        // it doesn't persist and is fresh on each update.
	        // To ensure persistent data, use `${name}#persistent`

	        state.orderedModifiers.forEach(function (modifier) {
	          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
	        });
	        for (var index = 0; index < state.orderedModifiers.length; index++) {
	          if (state.reset === true) {
	            state.reset = false;
	            index = -1;
	            continue;
	          }
	          var _state$orderedModifie = state.orderedModifiers[index],
	            fn = _state$orderedModifie.fn,
	            _state$orderedModifie2 = _state$orderedModifie.options,
	            _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
	            name = _state$orderedModifie.name;
	          if (typeof fn === 'function') {
	            state = fn({
	              state: state,
	              options: _options,
	              name: name,
	              instance: instance
	            }) || state;
	          }
	        }
	      },
	      // Async and optimistically optimized update – it will not be executed if
	      // not necessary (debounced to run at most once-per-tick)
	      update: debounce(function () {
	        return new Promise(function (resolve) {
	          instance.forceUpdate();
	          resolve(state);
	        });
	      }),
	      destroy: function destroy() {
	        cleanupModifierEffects();
	        isDestroyed = true;
	      }
	    };
	    if (!areValidElements(reference, popper)) {
	      return instance;
	    }
	    instance.setOptions(options).then(function (state) {
	      if (!isDestroyed && options.onFirstUpdate) {
	        options.onFirstUpdate(state);
	      }
	    }); // Modifiers have the ability to execute arbitrary code before the first
	    // update cycle runs. They will be executed in the same order as the update
	    // cycle. This is useful when a modifier adds some persistent data that
	    // other modifiers need to use, but the modifier is run after the dependent
	    // one.

	    function runModifierEffects() {
	      state.orderedModifiers.forEach(function (_ref3) {
	        var name = _ref3.name,
	          _ref3$options = _ref3.options,
	          options = _ref3$options === void 0 ? {} : _ref3$options,
	          effect = _ref3.effect;
	        if (typeof effect === 'function') {
	          var cleanupFn = effect({
	            state: state,
	            name: name,
	            instance: instance,
	            options: options
	          });
	          var noopFn = function noopFn() {};
	          effectCleanupFns.push(cleanupFn || noopFn);
	        }
	      });
	    }
	    function cleanupModifierEffects() {
	      effectCleanupFns.forEach(function (fn) {
	        return fn();
	      });
	      effectCleanupFns = [];
	    }
	    return instance;
	  };
	}
	var createPopper$2 = /*#__PURE__*/popperGenerator(); // eslint-disable-next-line import/no-unused-modules

	var defaultModifiers$1 = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1];
	var createPopper$1 = /*#__PURE__*/popperGenerator({
	  defaultModifiers: defaultModifiers$1
	}); // eslint-disable-next-line import/no-unused-modules

	var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
	var createPopper = /*#__PURE__*/popperGenerator({
	  defaultModifiers: defaultModifiers
	}); // eslint-disable-next-line import/no-unused-modules

	var lib = /*#__PURE__*/Object.freeze({
		__proto__: null,
		popperGenerator: popperGenerator,
		detectOverflow: detectOverflow,
		createPopperBase: createPopper$2,
		createPopper: createPopper,
		createPopperLite: createPopper$1,
		top: top,
		bottom: bottom,
		right: right,
		left: left,
		auto: auto,
		basePlacements: basePlacements,
		start: start,
		end: end,
		clippingParents: clippingParents,
		viewport: viewport,
		popper: popper,
		reference: reference,
		variationPlacements: variationPlacements,
		placements: placements,
		beforeRead: beforeRead,
		read: read,
		afterRead: afterRead,
		beforeMain: beforeMain,
		main: main,
		afterMain: afterMain,
		beforeWrite: beforeWrite,
		write: write,
		afterWrite: afterWrite,
		modifierPhases: modifierPhases,
		applyStyles: applyStyles$1,
		arrow: arrow$1,
		computeStyles: computeStyles$1,
		eventListeners: eventListeners,
		flip: flip$1,
		hide: hide$1,
		offset: offset$1,
		popperOffsets: popperOffsets$1,
		preventOverflow: preventOverflow$1
	});

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(lib);

	/*!
	  * Bootstrap dropdown.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
		(function (global, factory) {
		  module.exports = factory(require$$0, requireUtil(), requireEventHandler(), requireManipulator(), requireSelectorEngine(), requireBaseComponent()) ;
		})(commonjsGlobal, function (Popper, index, EventHandler, Manipulator, SelectorEngine, BaseComponent) {

		  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
		    default: e
		  };
		  function _interopNamespace(e) {
		    if (e && e.__esModule) return e;
		    const n = Object.create(null, {
		      [Symbol.toStringTag]: {
		        value: 'Module'
		      }
		    });
		    if (e) {
		      for (const k in e) {
		        if (k !== 'default') {
		          const d = Object.getOwnPropertyDescriptor(e, k);
		          Object.defineProperty(n, k, d.get ? d : {
		            enumerable: true,
		            get: () => e[k]
		          });
		        }
		      }
		    }
		    n.default = e;
		    return Object.freeze(n);
		  }
		  const Popper__namespace = /*#__PURE__*/_interopNamespace(Popper);
		  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
		  const Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
		  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
		  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

		  /**
		   * --------------------------------------------------------------------------
		   * Bootstrap (v5.2.3): dropdown.js
		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		   * --------------------------------------------------------------------------
		   */
		  /**
		   * Constants
		   */

		  const NAME = 'dropdown';
		  const DATA_KEY = 'bs.dropdown';
		  const EVENT_KEY = `.${DATA_KEY}`;
		  const DATA_API_KEY = '.data-api';
		  const ESCAPE_KEY = 'Escape';
		  const TAB_KEY = 'Tab';
		  const ARROW_UP_KEY = 'ArrowUp';
		  const ARROW_DOWN_KEY = 'ArrowDown';
		  const RIGHT_MOUSE_BUTTON = 2; // MouseEvent.button value for the secondary button, usually the right button

		  const EVENT_HIDE = `hide${EVENT_KEY}`;
		  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
		  const EVENT_SHOW = `show${EVENT_KEY}`;
		  const EVENT_SHOWN = `shown${EVENT_KEY}`;
		  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
		  const EVENT_KEYDOWN_DATA_API = `keydown${EVENT_KEY}${DATA_API_KEY}`;
		  const EVENT_KEYUP_DATA_API = `keyup${EVENT_KEY}${DATA_API_KEY}`;
		  const CLASS_NAME_SHOW = 'show';
		  const CLASS_NAME_DROPUP = 'dropup';
		  const CLASS_NAME_DROPEND = 'dropend';
		  const CLASS_NAME_DROPSTART = 'dropstart';
		  const CLASS_NAME_DROPUP_CENTER = 'dropup-center';
		  const CLASS_NAME_DROPDOWN_CENTER = 'dropdown-center';
		  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)';
		  const SELECTOR_DATA_TOGGLE_SHOWN = `${SELECTOR_DATA_TOGGLE}.${CLASS_NAME_SHOW}`;
		  const SELECTOR_MENU = '.dropdown-menu';
		  const SELECTOR_NAVBAR = '.navbar';
		  const SELECTOR_NAVBAR_NAV = '.navbar-nav';
		  const SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
		  const PLACEMENT_TOP = index.isRTL() ? 'top-end' : 'top-start';
		  const PLACEMENT_TOPEND = index.isRTL() ? 'top-start' : 'top-end';
		  const PLACEMENT_BOTTOM = index.isRTL() ? 'bottom-end' : 'bottom-start';
		  const PLACEMENT_BOTTOMEND = index.isRTL() ? 'bottom-start' : 'bottom-end';
		  const PLACEMENT_RIGHT = index.isRTL() ? 'left-start' : 'right-start';
		  const PLACEMENT_LEFT = index.isRTL() ? 'right-start' : 'left-start';
		  const PLACEMENT_TOPCENTER = 'top';
		  const PLACEMENT_BOTTOMCENTER = 'bottom';
		  const Default = {
		    autoClose: true,
		    boundary: 'clippingParents',
		    display: 'dynamic',
		    offset: [0, 2],
		    popperConfig: null,
		    reference: 'toggle'
		  };
		  const DefaultType = {
		    autoClose: '(boolean|string)',
		    boundary: '(string|element)',
		    display: 'string',
		    offset: '(array|string|function)',
		    popperConfig: '(null|object|function)',
		    reference: '(string|element|object)'
		  };
		  /**
		   * Class definition
		   */

		  class Dropdown extends BaseComponent__default.default {
		    constructor(element, config) {
		      super(element, config);
		      this._popper = null;
		      this._parent = this._element.parentNode; // dropdown wrapper
		      // todo: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.2/forms/input-group/

		      this._menu = SelectorEngine__default.default.next(this._element, SELECTOR_MENU)[0] || SelectorEngine__default.default.prev(this._element, SELECTOR_MENU)[0] || SelectorEngine__default.default.findOne(SELECTOR_MENU, this._parent);
		      this._inNavbar = this._detectNavbar();
		    } // Getters

		    static get Default() {
		      return Default;
		    }
		    static get DefaultType() {
		      return DefaultType;
		    }
		    static get NAME() {
		      return NAME;
		    } // Public

		    toggle() {
		      return this._isShown() ? this.hide() : this.show();
		    }
		    show() {
		      if (index.isDisabled(this._element) || this._isShown()) {
		        return;
		      }
		      const relatedTarget = {
		        relatedTarget: this._element
		      };
		      const showEvent = EventHandler__default.default.trigger(this._element, EVENT_SHOW, relatedTarget);
		      if (showEvent.defaultPrevented) {
		        return;
		      }
		      this._createPopper(); // If this is a touch-enabled device we add extra
		      // empty mouseover listeners to the body's immediate children;
		      // only needed because of broken event delegation on iOS
		      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

		      if ('ontouchstart' in document.documentElement && !this._parent.closest(SELECTOR_NAVBAR_NAV)) {
		        for (const element of [].concat(...document.body.children)) {
		          EventHandler__default.default.on(element, 'mouseover', index.noop);
		        }
		      }
		      this._element.focus();
		      this._element.setAttribute('aria-expanded', true);
		      this._menu.classList.add(CLASS_NAME_SHOW);
		      this._element.classList.add(CLASS_NAME_SHOW);
		      EventHandler__default.default.trigger(this._element, EVENT_SHOWN, relatedTarget);
		    }
		    hide() {
		      if (index.isDisabled(this._element) || !this._isShown()) {
		        return;
		      }
		      const relatedTarget = {
		        relatedTarget: this._element
		      };
		      this._completeHide(relatedTarget);
		    }
		    dispose() {
		      if (this._popper) {
		        this._popper.destroy();
		      }
		      super.dispose();
		    }
		    update() {
		      this._inNavbar = this._detectNavbar();
		      if (this._popper) {
		        this._popper.update();
		      }
		    } // Private

		    _completeHide(relatedTarget) {
		      const hideEvent = EventHandler__default.default.trigger(this._element, EVENT_HIDE, relatedTarget);
		      if (hideEvent.defaultPrevented) {
		        return;
		      } // If this is a touch-enabled device we remove the extra
		      // empty mouseover listeners we added for iOS support

		      if ('ontouchstart' in document.documentElement) {
		        for (const element of [].concat(...document.body.children)) {
		          EventHandler__default.default.off(element, 'mouseover', index.noop);
		        }
		      }
		      if (this._popper) {
		        this._popper.destroy();
		      }
		      this._menu.classList.remove(CLASS_NAME_SHOW);
		      this._element.classList.remove(CLASS_NAME_SHOW);
		      this._element.setAttribute('aria-expanded', 'false');
		      Manipulator__default.default.removeDataAttribute(this._menu, 'popper');
		      EventHandler__default.default.trigger(this._element, EVENT_HIDDEN, relatedTarget);
		    }
		    _getConfig(config) {
		      config = super._getConfig(config);
		      if (typeof config.reference === 'object' && !index.isElement(config.reference) && typeof config.reference.getBoundingClientRect !== 'function') {
		        // Popper virtual elements require a getBoundingClientRect method
		        throw new TypeError(`${NAME.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);
		      }
		      return config;
		    }
		    _createPopper() {
		      if (typeof Popper__namespace === 'undefined') {
		        throw new TypeError('Bootstrap\'s dropdowns require Popper (https://popper.js.org)');
		      }
		      let referenceElement = this._element;
		      if (this._config.reference === 'parent') {
		        referenceElement = this._parent;
		      } else if (index.isElement(this._config.reference)) {
		        referenceElement = index.getElement(this._config.reference);
		      } else if (typeof this._config.reference === 'object') {
		        referenceElement = this._config.reference;
		      }
		      const popperConfig = this._getPopperConfig();
		      this._popper = Popper__namespace.createPopper(referenceElement, this._menu, popperConfig);
		    }
		    _isShown() {
		      return this._menu.classList.contains(CLASS_NAME_SHOW);
		    }
		    _getPlacement() {
		      const parentDropdown = this._parent;
		      if (parentDropdown.classList.contains(CLASS_NAME_DROPEND)) {
		        return PLACEMENT_RIGHT;
		      }
		      if (parentDropdown.classList.contains(CLASS_NAME_DROPSTART)) {
		        return PLACEMENT_LEFT;
		      }
		      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP_CENTER)) {
		        return PLACEMENT_TOPCENTER;
		      }
		      if (parentDropdown.classList.contains(CLASS_NAME_DROPDOWN_CENTER)) {
		        return PLACEMENT_BOTTOMCENTER;
		      } // We need to trim the value because custom properties can also include spaces

		      const isEnd = getComputedStyle(this._menu).getPropertyValue('--bs-position').trim() === 'end';
		      if (parentDropdown.classList.contains(CLASS_NAME_DROPUP)) {
		        return isEnd ? PLACEMENT_TOPEND : PLACEMENT_TOP;
		      }
		      return isEnd ? PLACEMENT_BOTTOMEND : PLACEMENT_BOTTOM;
		    }
		    _detectNavbar() {
		      return this._element.closest(SELECTOR_NAVBAR) !== null;
		    }
		    _getOffset() {
		      const {
		        offset
		      } = this._config;
		      if (typeof offset === 'string') {
		        return offset.split(',').map(value => Number.parseInt(value, 10));
		      }
		      if (typeof offset === 'function') {
		        return popperData => offset(popperData, this._element);
		      }
		      return offset;
		    }
		    _getPopperConfig() {
		      const defaultBsPopperConfig = {
		        placement: this._getPlacement(),
		        modifiers: [{
		          name: 'preventOverflow',
		          options: {
		            boundary: this._config.boundary
		          }
		        }, {
		          name: 'offset',
		          options: {
		            offset: this._getOffset()
		          }
		        }]
		      }; // Disable Popper if we have a static display or Dropdown is in Navbar

		      if (this._inNavbar || this._config.display === 'static') {
		        Manipulator__default.default.setDataAttribute(this._menu, 'popper', 'static'); // todo:v6 remove

		        defaultBsPopperConfig.modifiers = [{
		          name: 'applyStyles',
		          enabled: false
		        }];
		      }
		      return {
		        ...defaultBsPopperConfig,
		        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
		      };
		    }
		    _selectMenuItem({
		      key,
		      target
		    }) {
		      const items = SelectorEngine__default.default.find(SELECTOR_VISIBLE_ITEMS, this._menu).filter(element => index.isVisible(element));
		      if (!items.length) {
		        return;
		      } // if target isn't included in items (e.g. when expanding the dropdown)
		      // allow cycling to get the last item in case key equals ARROW_UP_KEY

		      index.getNextActiveElement(items, target, key === ARROW_DOWN_KEY, !items.includes(target)).focus();
		    } // Static

		    static jQueryInterface(config) {
		      return this.each(function () {
		        const data = Dropdown.getOrCreateInstance(this, config);
		        if (typeof config !== 'string') {
		          return;
		        }
		        if (typeof data[config] === 'undefined') {
		          throw new TypeError(`No method named "${config}"`);
		        }
		        data[config]();
		      });
		    }
		    static clearMenus(event) {
		      if (event.button === RIGHT_MOUSE_BUTTON || event.type === 'keyup' && event.key !== TAB_KEY) {
		        return;
		      }
		      const openToggles = SelectorEngine__default.default.find(SELECTOR_DATA_TOGGLE_SHOWN);
		      for (const toggle of openToggles) {
		        const context = Dropdown.getInstance(toggle);
		        if (!context || context._config.autoClose === false) {
		          continue;
		        }
		        const composedPath = event.composedPath();
		        const isMenuTarget = composedPath.includes(context._menu);
		        if (composedPath.includes(context._element) || context._config.autoClose === 'inside' && !isMenuTarget || context._config.autoClose === 'outside' && isMenuTarget) {
		          continue;
		        } // Tab navigation through the dropdown menu or events from contained inputs shouldn't close the menu

		        if (context._menu.contains(event.target) && (event.type === 'keyup' && event.key === TAB_KEY || /input|select|option|textarea|form/i.test(event.target.tagName))) {
		          continue;
		        }
		        const relatedTarget = {
		          relatedTarget: context._element
		        };
		        if (event.type === 'click') {
		          relatedTarget.clickEvent = event;
		        }
		        context._completeHide(relatedTarget);
		      }
		    }
		    static dataApiKeydownHandler(event) {
		      // If not an UP | DOWN | ESCAPE key => not a dropdown command
		      // If input/textarea && if key is other than ESCAPE => not a dropdown command
		      const isInput = /input|textarea/i.test(event.target.tagName);
		      const isEscapeEvent = event.key === ESCAPE_KEY;
		      const isUpOrDownEvent = [ARROW_UP_KEY, ARROW_DOWN_KEY].includes(event.key);
		      if (!isUpOrDownEvent && !isEscapeEvent) {
		        return;
		      }
		      if (isInput && !isEscapeEvent) {
		        return;
		      }
		      event.preventDefault(); // todo: v6 revert #37011 & change markup https://getbootstrap.com/docs/5.2/forms/input-group/

		      const getToggleButton = this.matches(SELECTOR_DATA_TOGGLE) ? this : SelectorEngine__default.default.prev(this, SELECTOR_DATA_TOGGLE)[0] || SelectorEngine__default.default.next(this, SELECTOR_DATA_TOGGLE)[0] || SelectorEngine__default.default.findOne(SELECTOR_DATA_TOGGLE, event.delegateTarget.parentNode);
		      const instance = Dropdown.getOrCreateInstance(getToggleButton);
		      if (isUpOrDownEvent) {
		        event.stopPropagation();
		        instance.show();
		        instance._selectMenuItem(event);
		        return;
		      }
		      if (instance._isShown()) {
		        // else is escape and we check if it is shown
		        event.stopPropagation();
		        instance.hide();
		        getToggleButton.focus();
		      }
		    }
		  }
		  /**
		   * Data API implementation
		   */

		  EventHandler__default.default.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE, Dropdown.dataApiKeydownHandler);
		  EventHandler__default.default.on(document, EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown.dataApiKeydownHandler);
		  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, Dropdown.clearMenus);
		  EventHandler__default.default.on(document, EVENT_KEYUP_DATA_API, Dropdown.clearMenus);
		  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
		    event.preventDefault();
		    Dropdown.getOrCreateInstance(this).toggle();
		  });
		  /**
		   * jQuery
		   */

		  index.defineJQueryPlugin(Dropdown);
		  return Dropdown;
		});
	} (dropdown$1));

	var dropdown = /*@__PURE__*/getDefaultExportFromCjs(dropdown$1.exports);

	var modal = {exports: {}};

	var scrollbar = {exports: {}};

	/*!
	  * Bootstrap scrollbar.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	var hasRequiredScrollbar;

	function requireScrollbar () {
		if (hasRequiredScrollbar) return scrollbar.exports;
		hasRequiredScrollbar = 1;
		(function (module, exports) {
			(function (global, factory) {
			  module.exports = factory(requireSelectorEngine(), requireManipulator(), requireUtil()) ;
			})(commonjsGlobal, function (SelectorEngine, Manipulator, index) {

			  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
			    default: e
			  };
			  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
			  const Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);

			  /**
			   * --------------------------------------------------------------------------
			   * Bootstrap (v5.2.3): util/scrollBar.js
			   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
			   * --------------------------------------------------------------------------
			   */
			  /**
			   * Constants
			   */

			  const SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
			  const SELECTOR_STICKY_CONTENT = '.sticky-top';
			  const PROPERTY_PADDING = 'padding-right';
			  const PROPERTY_MARGIN = 'margin-right';
			  /**
			   * Class definition
			   */

			  class ScrollBarHelper {
			    constructor() {
			      this._element = document.body;
			    } // Public

			    getWidth() {
			      // https://developer.mozilla.org/en-US/docs/Web/API/Window/innerWidth#usage_notes
			      const documentWidth = document.documentElement.clientWidth;
			      return Math.abs(window.innerWidth - documentWidth);
			    }
			    hide() {
			      const width = this.getWidth();
			      this._disableOverFlow(); // give padding to element to balance the hidden scrollbar width

			      this._setElementAttributes(this._element, PROPERTY_PADDING, calculatedValue => calculatedValue + width); // trick: We adjust positive paddingRight and negative marginRight to sticky-top elements to keep showing fullwidth

			      this._setElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING, calculatedValue => calculatedValue + width);
			      this._setElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN, calculatedValue => calculatedValue - width);
			    }
			    reset() {
			      this._resetElementAttributes(this._element, 'overflow');
			      this._resetElementAttributes(this._element, PROPERTY_PADDING);
			      this._resetElementAttributes(SELECTOR_FIXED_CONTENT, PROPERTY_PADDING);
			      this._resetElementAttributes(SELECTOR_STICKY_CONTENT, PROPERTY_MARGIN);
			    }
			    isOverflowing() {
			      return this.getWidth() > 0;
			    } // Private

			    _disableOverFlow() {
			      this._saveInitialAttribute(this._element, 'overflow');
			      this._element.style.overflow = 'hidden';
			    }
			    _setElementAttributes(selector, styleProperty, callback) {
			      const scrollbarWidth = this.getWidth();
			      const manipulationCallBack = element => {
			        if (element !== this._element && window.innerWidth > element.clientWidth + scrollbarWidth) {
			          return;
			        }
			        this._saveInitialAttribute(element, styleProperty);
			        const calculatedValue = window.getComputedStyle(element).getPropertyValue(styleProperty);
			        element.style.setProperty(styleProperty, `${callback(Number.parseFloat(calculatedValue))}px`);
			      };
			      this._applyManipulationCallback(selector, manipulationCallBack);
			    }
			    _saveInitialAttribute(element, styleProperty) {
			      const actualValue = element.style.getPropertyValue(styleProperty);
			      if (actualValue) {
			        Manipulator__default.default.setDataAttribute(element, styleProperty, actualValue);
			      }
			    }
			    _resetElementAttributes(selector, styleProperty) {
			      const manipulationCallBack = element => {
			        const value = Manipulator__default.default.getDataAttribute(element, styleProperty); // We only want to remove the property if the value is `null`; the value can also be zero

			        if (value === null) {
			          element.style.removeProperty(styleProperty);
			          return;
			        }
			        Manipulator__default.default.removeDataAttribute(element, styleProperty);
			        element.style.setProperty(styleProperty, value);
			      };
			      this._applyManipulationCallback(selector, manipulationCallBack);
			    }
			    _applyManipulationCallback(selector, callBack) {
			      if (index.isElement(selector)) {
			        callBack(selector);
			        return;
			      }
			      for (const sel of SelectorEngine__default.default.find(selector, this._element)) {
			        callBack(sel);
			      }
			    }
			  }
			  return ScrollBarHelper;
			});
	} (scrollbar));
		return scrollbar.exports;
	}

	var backdrop = {exports: {}};

	/*!
	  * Bootstrap backdrop.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	var hasRequiredBackdrop;

	function requireBackdrop () {
		if (hasRequiredBackdrop) return backdrop.exports;
		hasRequiredBackdrop = 1;
		(function (module, exports) {
			(function (global, factory) {
			  module.exports = factory(requireEventHandler(), requireUtil(), requireConfig()) ;
			})(commonjsGlobal, function (EventHandler, index, Config) {

			  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
			    default: e
			  };
			  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
			  const Config__default = /*#__PURE__*/_interopDefaultLegacy(Config);

			  /**
			   * --------------------------------------------------------------------------
			   * Bootstrap (v5.2.3): util/backdrop.js
			   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
			   * --------------------------------------------------------------------------
			   */
			  /**
			   * Constants
			   */

			  const NAME = 'backdrop';
			  const CLASS_NAME_FADE = 'fade';
			  const CLASS_NAME_SHOW = 'show';
			  const EVENT_MOUSEDOWN = `mousedown.bs.${NAME}`;
			  const Default = {
			    className: 'modal-backdrop',
			    clickCallback: null,
			    isAnimated: false,
			    isVisible: true,
			    // if false, we use the backdrop helper without adding any element to the dom
			    rootElement: 'body' // give the choice to place backdrop under different elements
			  };

			  const DefaultType = {
			    className: 'string',
			    clickCallback: '(function|null)',
			    isAnimated: 'boolean',
			    isVisible: 'boolean',
			    rootElement: '(element|string)'
			  };
			  /**
			   * Class definition
			   */

			  class Backdrop extends Config__default.default {
			    constructor(config) {
			      super();
			      this._config = this._getConfig(config);
			      this._isAppended = false;
			      this._element = null;
			    } // Getters

			    static get Default() {
			      return Default;
			    }
			    static get DefaultType() {
			      return DefaultType;
			    }
			    static get NAME() {
			      return NAME;
			    } // Public

			    show(callback) {
			      if (!this._config.isVisible) {
			        index.execute(callback);
			        return;
			      }
			      this._append();
			      const element = this._getElement();
			      if (this._config.isAnimated) {
			        index.reflow(element);
			      }
			      element.classList.add(CLASS_NAME_SHOW);
			      this._emulateAnimation(() => {
			        index.execute(callback);
			      });
			    }
			    hide(callback) {
			      if (!this._config.isVisible) {
			        index.execute(callback);
			        return;
			      }
			      this._getElement().classList.remove(CLASS_NAME_SHOW);
			      this._emulateAnimation(() => {
			        this.dispose();
			        index.execute(callback);
			      });
			    }
			    dispose() {
			      if (!this._isAppended) {
			        return;
			      }
			      EventHandler__default.default.off(this._element, EVENT_MOUSEDOWN);
			      this._element.remove();
			      this._isAppended = false;
			    } // Private

			    _getElement() {
			      if (!this._element) {
			        const backdrop = document.createElement('div');
			        backdrop.className = this._config.className;
			        if (this._config.isAnimated) {
			          backdrop.classList.add(CLASS_NAME_FADE);
			        }
			        this._element = backdrop;
			      }
			      return this._element;
			    }
			    _configAfterMerge(config) {
			      // use getElement() with the default "body" to get a fresh Element on each instantiation
			      config.rootElement = index.getElement(config.rootElement);
			      return config;
			    }
			    _append() {
			      if (this._isAppended) {
			        return;
			      }
			      const element = this._getElement();
			      this._config.rootElement.append(element);
			      EventHandler__default.default.on(element, EVENT_MOUSEDOWN, () => {
			        index.execute(this._config.clickCallback);
			      });
			      this._isAppended = true;
			    }
			    _emulateAnimation(callback) {
			      index.executeAfterTransition(callback, this._getElement(), this._config.isAnimated);
			    }
			  }
			  return Backdrop;
			});
	} (backdrop));
		return backdrop.exports;
	}

	var focustrap = {exports: {}};

	/*!
	  * Bootstrap focustrap.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	var hasRequiredFocustrap;

	function requireFocustrap () {
		if (hasRequiredFocustrap) return focustrap.exports;
		hasRequiredFocustrap = 1;
		(function (module, exports) {
			(function (global, factory) {
			  module.exports = factory(requireEventHandler(), requireSelectorEngine(), requireConfig()) ;
			})(commonjsGlobal, function (EventHandler, SelectorEngine, Config) {

			  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
			    default: e
			  };
			  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
			  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
			  const Config__default = /*#__PURE__*/_interopDefaultLegacy(Config);

			  /**
			   * --------------------------------------------------------------------------
			   * Bootstrap (v5.2.3): util/focustrap.js
			   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
			   * --------------------------------------------------------------------------
			   */
			  /**
			   * Constants
			   */

			  const NAME = 'focustrap';
			  const DATA_KEY = 'bs.focustrap';
			  const EVENT_KEY = `.${DATA_KEY}`;
			  const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
			  const EVENT_KEYDOWN_TAB = `keydown.tab${EVENT_KEY}`;
			  const TAB_KEY = 'Tab';
			  const TAB_NAV_FORWARD = 'forward';
			  const TAB_NAV_BACKWARD = 'backward';
			  const Default = {
			    autofocus: true,
			    trapElement: null // The element to trap focus inside of
			  };

			  const DefaultType = {
			    autofocus: 'boolean',
			    trapElement: 'element'
			  };
			  /**
			   * Class definition
			   */

			  class FocusTrap extends Config__default.default {
			    constructor(config) {
			      super();
			      this._config = this._getConfig(config);
			      this._isActive = false;
			      this._lastTabNavDirection = null;
			    } // Getters

			    static get Default() {
			      return Default;
			    }
			    static get DefaultType() {
			      return DefaultType;
			    }
			    static get NAME() {
			      return NAME;
			    } // Public

			    activate() {
			      if (this._isActive) {
			        return;
			      }
			      if (this._config.autofocus) {
			        this._config.trapElement.focus();
			      }
			      EventHandler__default.default.off(document, EVENT_KEY); // guard against infinite focus loop

			      EventHandler__default.default.on(document, EVENT_FOCUSIN, event => this._handleFocusin(event));
			      EventHandler__default.default.on(document, EVENT_KEYDOWN_TAB, event => this._handleKeydown(event));
			      this._isActive = true;
			    }
			    deactivate() {
			      if (!this._isActive) {
			        return;
			      }
			      this._isActive = false;
			      EventHandler__default.default.off(document, EVENT_KEY);
			    } // Private

			    _handleFocusin(event) {
			      const {
			        trapElement
			      } = this._config;
			      if (event.target === document || event.target === trapElement || trapElement.contains(event.target)) {
			        return;
			      }
			      const elements = SelectorEngine__default.default.focusableChildren(trapElement);
			      if (elements.length === 0) {
			        trapElement.focus();
			      } else if (this._lastTabNavDirection === TAB_NAV_BACKWARD) {
			        elements[elements.length - 1].focus();
			      } else {
			        elements[0].focus();
			      }
			    }
			    _handleKeydown(event) {
			      if (event.key !== TAB_KEY) {
			        return;
			      }
			      this._lastTabNavDirection = event.shiftKey ? TAB_NAV_BACKWARD : TAB_NAV_FORWARD;
			    }
			  }
			  return FocusTrap;
			});
	} (focustrap));
		return focustrap.exports;
	}

	/*!
	  * Bootstrap modal.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
		(function (global, factory) {
		  module.exports = factory(requireUtil(), requireEventHandler(), requireSelectorEngine(), requireScrollbar(), requireBaseComponent(), requireBackdrop(), requireFocustrap(), requireComponentFunctions()) ;
		})(commonjsGlobal, function (index, EventHandler, SelectorEngine, ScrollBarHelper, BaseComponent, Backdrop, FocusTrap, componentFunctions) {

		  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
		    default: e
		  };
		  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
		  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
		  const ScrollBarHelper__default = /*#__PURE__*/_interopDefaultLegacy(ScrollBarHelper);
		  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);
		  const Backdrop__default = /*#__PURE__*/_interopDefaultLegacy(Backdrop);
		  const FocusTrap__default = /*#__PURE__*/_interopDefaultLegacy(FocusTrap);

		  /**
		   * --------------------------------------------------------------------------
		   * Bootstrap (v5.2.3): modal.js
		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		   * --------------------------------------------------------------------------
		   */
		  /**
		   * Constants
		   */

		  const NAME = 'modal';
		  const DATA_KEY = 'bs.modal';
		  const EVENT_KEY = `.${DATA_KEY}`;
		  const DATA_API_KEY = '.data-api';
		  const ESCAPE_KEY = 'Escape';
		  const EVENT_HIDE = `hide${EVENT_KEY}`;
		  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
		  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
		  const EVENT_SHOW = `show${EVENT_KEY}`;
		  const EVENT_SHOWN = `shown${EVENT_KEY}`;
		  const EVENT_RESIZE = `resize${EVENT_KEY}`;
		  const EVENT_CLICK_DISMISS = `click.dismiss${EVENT_KEY}`;
		  const EVENT_MOUSEDOWN_DISMISS = `mousedown.dismiss${EVENT_KEY}`;
		  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
		  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
		  const CLASS_NAME_OPEN = 'modal-open';
		  const CLASS_NAME_FADE = 'fade';
		  const CLASS_NAME_SHOW = 'show';
		  const CLASS_NAME_STATIC = 'modal-static';
		  const OPEN_SELECTOR = '.modal.show';
		  const SELECTOR_DIALOG = '.modal-dialog';
		  const SELECTOR_MODAL_BODY = '.modal-body';
		  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="modal"]';
		  const Default = {
		    backdrop: true,
		    focus: true,
		    keyboard: true
		  };
		  const DefaultType = {
		    backdrop: '(boolean|string)',
		    focus: 'boolean',
		    keyboard: 'boolean'
		  };
		  /**
		   * Class definition
		   */

		  class Modal extends BaseComponent__default.default {
		    constructor(element, config) {
		      super(element, config);
		      this._dialog = SelectorEngine__default.default.findOne(SELECTOR_DIALOG, this._element);
		      this._backdrop = this._initializeBackDrop();
		      this._focustrap = this._initializeFocusTrap();
		      this._isShown = false;
		      this._isTransitioning = false;
		      this._scrollBar = new ScrollBarHelper__default.default();
		      this._addEventListeners();
		    } // Getters

		    static get Default() {
		      return Default;
		    }
		    static get DefaultType() {
		      return DefaultType;
		    }
		    static get NAME() {
		      return NAME;
		    } // Public

		    toggle(relatedTarget) {
		      return this._isShown ? this.hide() : this.show(relatedTarget);
		    }
		    show(relatedTarget) {
		      if (this._isShown || this._isTransitioning) {
		        return;
		      }
		      const showEvent = EventHandler__default.default.trigger(this._element, EVENT_SHOW, {
		        relatedTarget
		      });
		      if (showEvent.defaultPrevented) {
		        return;
		      }
		      this._isShown = true;
		      this._isTransitioning = true;
		      this._scrollBar.hide();
		      document.body.classList.add(CLASS_NAME_OPEN);
		      this._adjustDialog();
		      this._backdrop.show(() => this._showElement(relatedTarget));
		    }
		    hide() {
		      if (!this._isShown || this._isTransitioning) {
		        return;
		      }
		      const hideEvent = EventHandler__default.default.trigger(this._element, EVENT_HIDE);
		      if (hideEvent.defaultPrevented) {
		        return;
		      }
		      this._isShown = false;
		      this._isTransitioning = true;
		      this._focustrap.deactivate();
		      this._element.classList.remove(CLASS_NAME_SHOW);
		      this._queueCallback(() => this._hideModal(), this._element, this._isAnimated());
		    }
		    dispose() {
		      for (const htmlElement of [window, this._dialog]) {
		        EventHandler__default.default.off(htmlElement, EVENT_KEY);
		      }
		      this._backdrop.dispose();
		      this._focustrap.deactivate();
		      super.dispose();
		    }
		    handleUpdate() {
		      this._adjustDialog();
		    } // Private

		    _initializeBackDrop() {
		      return new Backdrop__default.default({
		        isVisible: Boolean(this._config.backdrop),
		        // 'static' option will be translated to true, and booleans will keep their value,
		        isAnimated: this._isAnimated()
		      });
		    }
		    _initializeFocusTrap() {
		      return new FocusTrap__default.default({
		        trapElement: this._element
		      });
		    }
		    _showElement(relatedTarget) {
		      // try to append dynamic modal
		      if (!document.body.contains(this._element)) {
		        document.body.append(this._element);
		      }
		      this._element.style.display = 'block';
		      this._element.removeAttribute('aria-hidden');
		      this._element.setAttribute('aria-modal', true);
		      this._element.setAttribute('role', 'dialog');
		      this._element.scrollTop = 0;
		      const modalBody = SelectorEngine__default.default.findOne(SELECTOR_MODAL_BODY, this._dialog);
		      if (modalBody) {
		        modalBody.scrollTop = 0;
		      }
		      index.reflow(this._element);
		      this._element.classList.add(CLASS_NAME_SHOW);
		      const transitionComplete = () => {
		        if (this._config.focus) {
		          this._focustrap.activate();
		        }
		        this._isTransitioning = false;
		        EventHandler__default.default.trigger(this._element, EVENT_SHOWN, {
		          relatedTarget
		        });
		      };
		      this._queueCallback(transitionComplete, this._dialog, this._isAnimated());
		    }
		    _addEventListeners() {
		      EventHandler__default.default.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
		        if (event.key !== ESCAPE_KEY) {
		          return;
		        }
		        if (this._config.keyboard) {
		          event.preventDefault();
		          this.hide();
		          return;
		        }
		        this._triggerBackdropTransition();
		      });
		      EventHandler__default.default.on(window, EVENT_RESIZE, () => {
		        if (this._isShown && !this._isTransitioning) {
		          this._adjustDialog();
		        }
		      });
		      EventHandler__default.default.on(this._element, EVENT_MOUSEDOWN_DISMISS, event => {
		        // a bad trick to segregate clicks that may start inside dialog but end outside, and avoid listen to scrollbar clicks
		        EventHandler__default.default.one(this._element, EVENT_CLICK_DISMISS, event2 => {
		          if (this._element !== event.target || this._element !== event2.target) {
		            return;
		          }
		          if (this._config.backdrop === 'static') {
		            this._triggerBackdropTransition();
		            return;
		          }
		          if (this._config.backdrop) {
		            this.hide();
		          }
		        });
		      });
		    }
		    _hideModal() {
		      this._element.style.display = 'none';
		      this._element.setAttribute('aria-hidden', true);
		      this._element.removeAttribute('aria-modal');
		      this._element.removeAttribute('role');
		      this._isTransitioning = false;
		      this._backdrop.hide(() => {
		        document.body.classList.remove(CLASS_NAME_OPEN);
		        this._resetAdjustments();
		        this._scrollBar.reset();
		        EventHandler__default.default.trigger(this._element, EVENT_HIDDEN);
		      });
		    }
		    _isAnimated() {
		      return this._element.classList.contains(CLASS_NAME_FADE);
		    }
		    _triggerBackdropTransition() {
		      const hideEvent = EventHandler__default.default.trigger(this._element, EVENT_HIDE_PREVENTED);
		      if (hideEvent.defaultPrevented) {
		        return;
		      }
		      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
		      const initialOverflowY = this._element.style.overflowY; // return if the following background transition hasn't yet completed

		      if (initialOverflowY === 'hidden' || this._element.classList.contains(CLASS_NAME_STATIC)) {
		        return;
		      }
		      if (!isModalOverflowing) {
		        this._element.style.overflowY = 'hidden';
		      }
		      this._element.classList.add(CLASS_NAME_STATIC);
		      this._queueCallback(() => {
		        this._element.classList.remove(CLASS_NAME_STATIC);
		        this._queueCallback(() => {
		          this._element.style.overflowY = initialOverflowY;
		        }, this._dialog);
		      }, this._dialog);
		      this._element.focus();
		    }
		    /**
		     * The following methods are used to handle overflowing modals
		     */

		    _adjustDialog() {
		      const isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;
		      const scrollbarWidth = this._scrollBar.getWidth();
		      const isBodyOverflowing = scrollbarWidth > 0;
		      if (isBodyOverflowing && !isModalOverflowing) {
		        const property = index.isRTL() ? 'paddingLeft' : 'paddingRight';
		        this._element.style[property] = `${scrollbarWidth}px`;
		      }
		      if (!isBodyOverflowing && isModalOverflowing) {
		        const property = index.isRTL() ? 'paddingRight' : 'paddingLeft';
		        this._element.style[property] = `${scrollbarWidth}px`;
		      }
		    }
		    _resetAdjustments() {
		      this._element.style.paddingLeft = '';
		      this._element.style.paddingRight = '';
		    } // Static

		    static jQueryInterface(config, relatedTarget) {
		      return this.each(function () {
		        const data = Modal.getOrCreateInstance(this, config);
		        if (typeof config !== 'string') {
		          return;
		        }
		        if (typeof data[config] === 'undefined') {
		          throw new TypeError(`No method named "${config}"`);
		        }
		        data[config](relatedTarget);
		      });
		    }
		  }
		  /**
		   * Data API implementation
		   */

		  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
		    const target = index.getElementFromSelector(this);
		    if (['A', 'AREA'].includes(this.tagName)) {
		      event.preventDefault();
		    }
		    EventHandler__default.default.one(target, EVENT_SHOW, showEvent => {
		      if (showEvent.defaultPrevented) {
		        // only register focus restorer if modal will actually get shown
		        return;
		      }
		      EventHandler__default.default.one(target, EVENT_HIDDEN, () => {
		        if (index.isVisible(this)) {
		          this.focus();
		        }
		      });
		    }); // avoid conflict when clicking modal toggler while another one is open

		    const alreadyOpen = SelectorEngine__default.default.findOne(OPEN_SELECTOR);
		    if (alreadyOpen) {
		      Modal.getInstance(alreadyOpen).hide();
		    }
		    const data = Modal.getOrCreateInstance(target);
		    data.toggle(this);
		  });
		  componentFunctions.enableDismissTrigger(Modal);
		  /**
		   * jQuery
		   */

		  index.defineJQueryPlugin(Modal);
		  return Modal;
		});
	} (modal));

	var Modal = modal.exports;

	var offcanvas$1 = {exports: {}};

	/*!
	  * Bootstrap offcanvas.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
		(function (global, factory) {
		  module.exports = factory(requireUtil(), requireScrollbar(), requireEventHandler(), requireBaseComponent(), requireSelectorEngine(), requireBackdrop(), requireFocustrap(), requireComponentFunctions()) ;
		})(commonjsGlobal, function (index, ScrollBarHelper, EventHandler, BaseComponent, SelectorEngine, Backdrop, FocusTrap, componentFunctions) {

		  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
		    default: e
		  };
		  const ScrollBarHelper__default = /*#__PURE__*/_interopDefaultLegacy(ScrollBarHelper);
		  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
		  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);
		  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
		  const Backdrop__default = /*#__PURE__*/_interopDefaultLegacy(Backdrop);
		  const FocusTrap__default = /*#__PURE__*/_interopDefaultLegacy(FocusTrap);

		  /**
		   * --------------------------------------------------------------------------
		   * Bootstrap (v5.2.3): offcanvas.js
		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		   * --------------------------------------------------------------------------
		   */
		  /**
		   * Constants
		   */

		  const NAME = 'offcanvas';
		  const DATA_KEY = 'bs.offcanvas';
		  const EVENT_KEY = `.${DATA_KEY}`;
		  const DATA_API_KEY = '.data-api';
		  const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
		  const ESCAPE_KEY = 'Escape';
		  const CLASS_NAME_SHOW = 'show';
		  const CLASS_NAME_SHOWING = 'showing';
		  const CLASS_NAME_HIDING = 'hiding';
		  const CLASS_NAME_BACKDROP = 'offcanvas-backdrop';
		  const OPEN_SELECTOR = '.offcanvas.show';
		  const EVENT_SHOW = `show${EVENT_KEY}`;
		  const EVENT_SHOWN = `shown${EVENT_KEY}`;
		  const EVENT_HIDE = `hide${EVENT_KEY}`;
		  const EVENT_HIDE_PREVENTED = `hidePrevented${EVENT_KEY}`;
		  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
		  const EVENT_RESIZE = `resize${EVENT_KEY}`;
		  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}${DATA_API_KEY}`;
		  const EVENT_KEYDOWN_DISMISS = `keydown.dismiss${EVENT_KEY}`;
		  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="offcanvas"]';
		  const Default = {
		    backdrop: true,
		    keyboard: true,
		    scroll: false
		  };
		  const DefaultType = {
		    backdrop: '(boolean|string)',
		    keyboard: 'boolean',
		    scroll: 'boolean'
		  };
		  /**
		   * Class definition
		   */

		  class Offcanvas extends BaseComponent__default.default {
		    constructor(element, config) {
		      super(element, config);
		      this._isShown = false;
		      this._backdrop = this._initializeBackDrop();
		      this._focustrap = this._initializeFocusTrap();
		      this._addEventListeners();
		    } // Getters

		    static get Default() {
		      return Default;
		    }
		    static get DefaultType() {
		      return DefaultType;
		    }
		    static get NAME() {
		      return NAME;
		    } // Public

		    toggle(relatedTarget) {
		      return this._isShown ? this.hide() : this.show(relatedTarget);
		    }
		    show(relatedTarget) {
		      if (this._isShown) {
		        return;
		      }
		      const showEvent = EventHandler__default.default.trigger(this._element, EVENT_SHOW, {
		        relatedTarget
		      });
		      if (showEvent.defaultPrevented) {
		        return;
		      }
		      this._isShown = true;
		      this._backdrop.show();
		      if (!this._config.scroll) {
		        new ScrollBarHelper__default.default().hide();
		      }
		      this._element.setAttribute('aria-modal', true);
		      this._element.setAttribute('role', 'dialog');
		      this._element.classList.add(CLASS_NAME_SHOWING);
		      const completeCallBack = () => {
		        if (!this._config.scroll || this._config.backdrop) {
		          this._focustrap.activate();
		        }
		        this._element.classList.add(CLASS_NAME_SHOW);
		        this._element.classList.remove(CLASS_NAME_SHOWING);
		        EventHandler__default.default.trigger(this._element, EVENT_SHOWN, {
		          relatedTarget
		        });
		      };
		      this._queueCallback(completeCallBack, this._element, true);
		    }
		    hide() {
		      if (!this._isShown) {
		        return;
		      }
		      const hideEvent = EventHandler__default.default.trigger(this._element, EVENT_HIDE);
		      if (hideEvent.defaultPrevented) {
		        return;
		      }
		      this._focustrap.deactivate();
		      this._element.blur();
		      this._isShown = false;
		      this._element.classList.add(CLASS_NAME_HIDING);
		      this._backdrop.hide();
		      const completeCallback = () => {
		        this._element.classList.remove(CLASS_NAME_SHOW, CLASS_NAME_HIDING);
		        this._element.removeAttribute('aria-modal');
		        this._element.removeAttribute('role');
		        if (!this._config.scroll) {
		          new ScrollBarHelper__default.default().reset();
		        }
		        EventHandler__default.default.trigger(this._element, EVENT_HIDDEN);
		      };
		      this._queueCallback(completeCallback, this._element, true);
		    }
		    dispose() {
		      this._backdrop.dispose();
		      this._focustrap.deactivate();
		      super.dispose();
		    } // Private

		    _initializeBackDrop() {
		      const clickCallback = () => {
		        if (this._config.backdrop === 'static') {
		          EventHandler__default.default.trigger(this._element, EVENT_HIDE_PREVENTED);
		          return;
		        }
		        this.hide();
		      }; // 'static' option will be translated to true, and booleans will keep their value

		      const isVisible = Boolean(this._config.backdrop);
		      return new Backdrop__default.default({
		        className: CLASS_NAME_BACKDROP,
		        isVisible,
		        isAnimated: true,
		        rootElement: this._element.parentNode,
		        clickCallback: isVisible ? clickCallback : null
		      });
		    }
		    _initializeFocusTrap() {
		      return new FocusTrap__default.default({
		        trapElement: this._element
		      });
		    }
		    _addEventListeners() {
		      EventHandler__default.default.on(this._element, EVENT_KEYDOWN_DISMISS, event => {
		        if (event.key !== ESCAPE_KEY) {
		          return;
		        }
		        if (!this._config.keyboard) {
		          EventHandler__default.default.trigger(this._element, EVENT_HIDE_PREVENTED);
		          return;
		        }
		        this.hide();
		      });
		    } // Static

		    static jQueryInterface(config) {
		      return this.each(function () {
		        const data = Offcanvas.getOrCreateInstance(this, config);
		        if (typeof config !== 'string') {
		          return;
		        }
		        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
		          throw new TypeError(`No method named "${config}"`);
		        }
		        data[config](this);
		      });
		    }
		  }
		  /**
		   * Data API implementation
		   */

		  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
		    const target = index.getElementFromSelector(this);
		    if (['A', 'AREA'].includes(this.tagName)) {
		      event.preventDefault();
		    }
		    if (index.isDisabled(this)) {
		      return;
		    }
		    EventHandler__default.default.one(target, EVENT_HIDDEN, () => {
		      // focus on trigger when it is closed
		      if (index.isVisible(this)) {
		        this.focus();
		      }
		    }); // avoid conflict when clicking a toggler of an offcanvas, while another is open

		    const alreadyOpen = SelectorEngine__default.default.findOne(OPEN_SELECTOR);
		    if (alreadyOpen && alreadyOpen !== target) {
		      Offcanvas.getInstance(alreadyOpen).hide();
		    }
		    const data = Offcanvas.getOrCreateInstance(target);
		    data.toggle(this);
		  });
		  EventHandler__default.default.on(window, EVENT_LOAD_DATA_API, () => {
		    for (const selector of SelectorEngine__default.default.find(OPEN_SELECTOR)) {
		      Offcanvas.getOrCreateInstance(selector).show();
		    }
		  });
		  EventHandler__default.default.on(window, EVENT_RESIZE, () => {
		    for (const element of SelectorEngine__default.default.find('[aria-modal][class*=show][class*=offcanvas-]')) {
		      if (getComputedStyle(element).position !== 'fixed') {
		        Offcanvas.getOrCreateInstance(element).hide();
		      }
		    }
		  });
		  componentFunctions.enableDismissTrigger(Offcanvas);
		  /**
		   * jQuery
		   */

		  index.defineJQueryPlugin(Offcanvas);
		  return Offcanvas;
		});
	} (offcanvas$1));

	var offcanvas = offcanvas$1.exports;

	var popover$1 = {exports: {}};

	var tooltip$1 = {exports: {}};

	var sanitizer = {exports: {}};

	/*!
	  * Bootstrap sanitizer.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	var hasRequiredSanitizer;

	function requireSanitizer () {
		if (hasRequiredSanitizer) return sanitizer.exports;
		hasRequiredSanitizer = 1;
		(function (module, exports) {
			(function (global, factory) {
			  factory(exports) ;
			})(commonjsGlobal, function (exports) {

			  /**
			   * --------------------------------------------------------------------------
			   * Bootstrap (v5.2.3): util/sanitizer.js
			   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
			   * --------------------------------------------------------------------------
			   */
			  const uriAttributes = new Set(['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href']);
			  const ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
			  /**
			   * A pattern that recognizes a commonly useful subset of URLs that are safe.
			   *
			   * Shout-out to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
			   */

			  const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file|sms):|[^#&/:?]*(?:[#/?]|$))/i;
			  /**
			   * A pattern that matches safe data URLs. Only matches image, video and audio types.
			   *
			   * Shout-out to Angular https://github.com/angular/angular/blob/12.2.x/packages/core/src/sanitization/url_sanitizer.ts
			   */

			  const DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;
			  const allowedAttribute = (attribute, allowedAttributeList) => {
			    const attributeName = attribute.nodeName.toLowerCase();
			    if (allowedAttributeList.includes(attributeName)) {
			      if (uriAttributes.has(attributeName)) {
			        return Boolean(SAFE_URL_PATTERN.test(attribute.nodeValue) || DATA_URL_PATTERN.test(attribute.nodeValue));
			      }
			      return true;
			    } // Check if a regular expression validates the attribute.

			    return allowedAttributeList.filter(attributeRegex => attributeRegex instanceof RegExp).some(regex => regex.test(attributeName));
			  };
			  const DefaultAllowlist = {
			    // Global attributes allowed on any supplied element below.
			    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
			    a: ['target', 'href', 'title', 'rel'],
			    area: [],
			    b: [],
			    br: [],
			    col: [],
			    code: [],
			    div: [],
			    em: [],
			    hr: [],
			    h1: [],
			    h2: [],
			    h3: [],
			    h4: [],
			    h5: [],
			    h6: [],
			    i: [],
			    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
			    li: [],
			    ol: [],
			    p: [],
			    pre: [],
			    s: [],
			    small: [],
			    span: [],
			    sub: [],
			    sup: [],
			    strong: [],
			    u: [],
			    ul: []
			  };
			  function sanitizeHtml(unsafeHtml, allowList, sanitizeFunction) {
			    if (!unsafeHtml.length) {
			      return unsafeHtml;
			    }
			    if (sanitizeFunction && typeof sanitizeFunction === 'function') {
			      return sanitizeFunction(unsafeHtml);
			    }
			    const domParser = new window.DOMParser();
			    const createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
			    const elements = [].concat(...createdDocument.body.querySelectorAll('*'));
			    for (const element of elements) {
			      const elementName = element.nodeName.toLowerCase();
			      if (!Object.keys(allowList).includes(elementName)) {
			        element.remove();
			        continue;
			      }
			      const attributeList = [].concat(...element.attributes);
			      const allowedAttributes = [].concat(allowList['*'] || [], allowList[elementName] || []);
			      for (const attribute of attributeList) {
			        if (!allowedAttribute(attribute, allowedAttributes)) {
			          element.removeAttribute(attribute.nodeName);
			        }
			      }
			    }
			    return createdDocument.body.innerHTML;
			  }
			  exports.DefaultAllowlist = DefaultAllowlist;
			  exports.sanitizeHtml = sanitizeHtml;
			  Object.defineProperties(exports, {
			    __esModule: {
			      value: true
			    },
			    [Symbol.toStringTag]: {
			      value: 'Module'
			    }
			  });
			});
	} (sanitizer, sanitizer.exports));
		return sanitizer.exports;
	}

	var templateFactory = {exports: {}};

	/*!
	  * Bootstrap template-factory.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	var hasRequiredTemplateFactory;

	function requireTemplateFactory () {
		if (hasRequiredTemplateFactory) return templateFactory.exports;
		hasRequiredTemplateFactory = 1;
		(function (module, exports) {
			(function (global, factory) {
			  module.exports = factory(requireSanitizer(), requireUtil(), requireSelectorEngine(), requireConfig()) ;
			})(commonjsGlobal, function (sanitizer, index, SelectorEngine, Config) {

			  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
			    default: e
			  };
			  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
			  const Config__default = /*#__PURE__*/_interopDefaultLegacy(Config);

			  /**
			   * --------------------------------------------------------------------------
			   * Bootstrap (v5.2.3): util/template-factory.js
			   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
			   * --------------------------------------------------------------------------
			   */
			  /**
			   * Constants
			   */

			  const NAME = 'TemplateFactory';
			  const Default = {
			    allowList: sanitizer.DefaultAllowlist,
			    content: {},
			    // { selector : text ,  selector2 : text2 , }
			    extraClass: '',
			    html: false,
			    sanitize: true,
			    sanitizeFn: null,
			    template: '<div></div>'
			  };
			  const DefaultType = {
			    allowList: 'object',
			    content: 'object',
			    extraClass: '(string|function)',
			    html: 'boolean',
			    sanitize: 'boolean',
			    sanitizeFn: '(null|function)',
			    template: 'string'
			  };
			  const DefaultContentType = {
			    entry: '(string|element|function|null)',
			    selector: '(string|element)'
			  };
			  /**
			   * Class definition
			   */

			  class TemplateFactory extends Config__default.default {
			    constructor(config) {
			      super();
			      this._config = this._getConfig(config);
			    } // Getters

			    static get Default() {
			      return Default;
			    }
			    static get DefaultType() {
			      return DefaultType;
			    }
			    static get NAME() {
			      return NAME;
			    } // Public

			    getContent() {
			      return Object.values(this._config.content).map(config => this._resolvePossibleFunction(config)).filter(Boolean);
			    }
			    hasContent() {
			      return this.getContent().length > 0;
			    }
			    changeContent(content) {
			      this._checkContent(content);
			      this._config.content = {
			        ...this._config.content,
			        ...content
			      };
			      return this;
			    }
			    toHtml() {
			      const templateWrapper = document.createElement('div');
			      templateWrapper.innerHTML = this._maybeSanitize(this._config.template);
			      for (const [selector, text] of Object.entries(this._config.content)) {
			        this._setContent(templateWrapper, text, selector);
			      }
			      const template = templateWrapper.children[0];
			      const extraClass = this._resolvePossibleFunction(this._config.extraClass);
			      if (extraClass) {
			        template.classList.add(...extraClass.split(' '));
			      }
			      return template;
			    } // Private

			    _typeCheckConfig(config) {
			      super._typeCheckConfig(config);
			      this._checkContent(config.content);
			    }
			    _checkContent(arg) {
			      for (const [selector, content] of Object.entries(arg)) {
			        super._typeCheckConfig({
			          selector,
			          entry: content
			        }, DefaultContentType);
			      }
			    }
			    _setContent(template, content, selector) {
			      const templateElement = SelectorEngine__default.default.findOne(selector, template);
			      if (!templateElement) {
			        return;
			      }
			      content = this._resolvePossibleFunction(content);
			      if (!content) {
			        templateElement.remove();
			        return;
			      }
			      if (index.isElement(content)) {
			        this._putElementInTemplate(index.getElement(content), templateElement);
			        return;
			      }
			      if (this._config.html) {
			        templateElement.innerHTML = this._maybeSanitize(content);
			        return;
			      }
			      templateElement.textContent = content;
			    }
			    _maybeSanitize(arg) {
			      return this._config.sanitize ? sanitizer.sanitizeHtml(arg, this._config.allowList, this._config.sanitizeFn) : arg;
			    }
			    _resolvePossibleFunction(arg) {
			      return typeof arg === 'function' ? arg(this) : arg;
			    }
			    _putElementInTemplate(element, templateElement) {
			      if (this._config.html) {
			        templateElement.innerHTML = '';
			        templateElement.append(element);
			        return;
			      }
			      templateElement.textContent = element.textContent;
			    }
			  }
			  return TemplateFactory;
			});
	} (templateFactory));
		return templateFactory.exports;
	}

	/*!
	  * Bootstrap tooltip.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
		(function (global, factory) {
		  module.exports = factory(require$$0, requireUtil(), requireSanitizer(), requireEventHandler(), requireManipulator(), requireBaseComponent(), requireTemplateFactory()) ;
		})(commonjsGlobal, function (Popper, index, sanitizer, EventHandler, Manipulator, BaseComponent, TemplateFactory) {

		  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
		    default: e
		  };
		  function _interopNamespace(e) {
		    if (e && e.__esModule) return e;
		    const n = Object.create(null, {
		      [Symbol.toStringTag]: {
		        value: 'Module'
		      }
		    });
		    if (e) {
		      for (const k in e) {
		        if (k !== 'default') {
		          const d = Object.getOwnPropertyDescriptor(e, k);
		          Object.defineProperty(n, k, d.get ? d : {
		            enumerable: true,
		            get: () => e[k]
		          });
		        }
		      }
		    }
		    n.default = e;
		    return Object.freeze(n);
		  }
		  const Popper__namespace = /*#__PURE__*/_interopNamespace(Popper);
		  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
		  const Manipulator__default = /*#__PURE__*/_interopDefaultLegacy(Manipulator);
		  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);
		  const TemplateFactory__default = /*#__PURE__*/_interopDefaultLegacy(TemplateFactory);

		  /**
		   * --------------------------------------------------------------------------
		   * Bootstrap (v5.2.3): tooltip.js
		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		   * --------------------------------------------------------------------------
		   */
		  /**
		   * Constants
		   */

		  const NAME = 'tooltip';
		  const DISALLOWED_ATTRIBUTES = new Set(['sanitize', 'allowList', 'sanitizeFn']);
		  const CLASS_NAME_FADE = 'fade';
		  const CLASS_NAME_MODAL = 'modal';
		  const CLASS_NAME_SHOW = 'show';
		  const SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
		  const SELECTOR_MODAL = `.${CLASS_NAME_MODAL}`;
		  const EVENT_MODAL_HIDE = 'hide.bs.modal';
		  const TRIGGER_HOVER = 'hover';
		  const TRIGGER_FOCUS = 'focus';
		  const TRIGGER_CLICK = 'click';
		  const TRIGGER_MANUAL = 'manual';
		  const EVENT_HIDE = 'hide';
		  const EVENT_HIDDEN = 'hidden';
		  const EVENT_SHOW = 'show';
		  const EVENT_SHOWN = 'shown';
		  const EVENT_INSERTED = 'inserted';
		  const EVENT_CLICK = 'click';
		  const EVENT_FOCUSIN = 'focusin';
		  const EVENT_FOCUSOUT = 'focusout';
		  const EVENT_MOUSEENTER = 'mouseenter';
		  const EVENT_MOUSELEAVE = 'mouseleave';
		  const AttachmentMap = {
		    AUTO: 'auto',
		    TOP: 'top',
		    RIGHT: index.isRTL() ? 'left' : 'right',
		    BOTTOM: 'bottom',
		    LEFT: index.isRTL() ? 'right' : 'left'
		  };
		  const Default = {
		    allowList: sanitizer.DefaultAllowlist,
		    animation: true,
		    boundary: 'clippingParents',
		    container: false,
		    customClass: '',
		    delay: 0,
		    fallbackPlacements: ['top', 'right', 'bottom', 'left'],
		    html: false,
		    offset: [0, 0],
		    placement: 'top',
		    popperConfig: null,
		    sanitize: true,
		    sanitizeFn: null,
		    selector: false,
		    template: '<div class="tooltip" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner"></div>' + '</div>',
		    title: '',
		    trigger: 'hover focus'
		  };
		  const DefaultType = {
		    allowList: 'object',
		    animation: 'boolean',
		    boundary: '(string|element)',
		    container: '(string|element|boolean)',
		    customClass: '(string|function)',
		    delay: '(number|object)',
		    fallbackPlacements: 'array',
		    html: 'boolean',
		    offset: '(array|string|function)',
		    placement: '(string|function)',
		    popperConfig: '(null|object|function)',
		    sanitize: 'boolean',
		    sanitizeFn: '(null|function)',
		    selector: '(string|boolean)',
		    template: 'string',
		    title: '(string|element|function)',
		    trigger: 'string'
		  };
		  /**
		   * Class definition
		   */

		  class Tooltip extends BaseComponent__default.default {
		    constructor(element, config) {
		      if (typeof Popper__namespace === 'undefined') {
		        throw new TypeError('Bootstrap\'s tooltips require Popper (https://popper.js.org)');
		      }
		      super(element, config); // Private

		      this._isEnabled = true;
		      this._timeout = 0;
		      this._isHovered = null;
		      this._activeTrigger = {};
		      this._popper = null;
		      this._templateFactory = null;
		      this._newContent = null; // Protected

		      this.tip = null;
		      this._setListeners();
		      if (!this._config.selector) {
		        this._fixTitle();
		      }
		    } // Getters

		    static get Default() {
		      return Default;
		    }
		    static get DefaultType() {
		      return DefaultType;
		    }
		    static get NAME() {
		      return NAME;
		    } // Public

		    enable() {
		      this._isEnabled = true;
		    }
		    disable() {
		      this._isEnabled = false;
		    }
		    toggleEnabled() {
		      this._isEnabled = !this._isEnabled;
		    }
		    toggle() {
		      if (!this._isEnabled) {
		        return;
		      }
		      this._activeTrigger.click = !this._activeTrigger.click;
		      if (this._isShown()) {
		        this._leave();
		        return;
		      }
		      this._enter();
		    }
		    dispose() {
		      clearTimeout(this._timeout);
		      EventHandler__default.default.off(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
		      if (this._element.getAttribute('data-bs-original-title')) {
		        this._element.setAttribute('title', this._element.getAttribute('data-bs-original-title'));
		      }
		      this._disposePopper();
		      super.dispose();
		    }
		    show() {
		      if (this._element.style.display === 'none') {
		        throw new Error('Please use show on visible elements');
		      }
		      if (!(this._isWithContent() && this._isEnabled)) {
		        return;
		      }
		      const showEvent = EventHandler__default.default.trigger(this._element, this.constructor.eventName(EVENT_SHOW));
		      const shadowRoot = index.findShadowRoot(this._element);
		      const isInTheDom = (shadowRoot || this._element.ownerDocument.documentElement).contains(this._element);
		      if (showEvent.defaultPrevented || !isInTheDom) {
		        return;
		      } // todo v6 remove this OR make it optional

		      this._disposePopper();
		      const tip = this._getTipElement();
		      this._element.setAttribute('aria-describedby', tip.getAttribute('id'));
		      const {
		        container
		      } = this._config;
		      if (!this._element.ownerDocument.documentElement.contains(this.tip)) {
		        container.append(tip);
		        EventHandler__default.default.trigger(this._element, this.constructor.eventName(EVENT_INSERTED));
		      }
		      this._popper = this._createPopper(tip);
		      tip.classList.add(CLASS_NAME_SHOW); // If this is a touch-enabled device we add extra
		      // empty mouseover listeners to the body's immediate children;
		      // only needed because of broken event delegation on iOS
		      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

		      if ('ontouchstart' in document.documentElement) {
		        for (const element of [].concat(...document.body.children)) {
		          EventHandler__default.default.on(element, 'mouseover', index.noop);
		        }
		      }
		      const complete = () => {
		        EventHandler__default.default.trigger(this._element, this.constructor.eventName(EVENT_SHOWN));
		        if (this._isHovered === false) {
		          this._leave();
		        }
		        this._isHovered = false;
		      };
		      this._queueCallback(complete, this.tip, this._isAnimated());
		    }
		    hide() {
		      if (!this._isShown()) {
		        return;
		      }
		      const hideEvent = EventHandler__default.default.trigger(this._element, this.constructor.eventName(EVENT_HIDE));
		      if (hideEvent.defaultPrevented) {
		        return;
		      }
		      const tip = this._getTipElement();
		      tip.classList.remove(CLASS_NAME_SHOW); // If this is a touch-enabled device we remove the extra
		      // empty mouseover listeners we added for iOS support

		      if ('ontouchstart' in document.documentElement) {
		        for (const element of [].concat(...document.body.children)) {
		          EventHandler__default.default.off(element, 'mouseover', index.noop);
		        }
		      }
		      this._activeTrigger[TRIGGER_CLICK] = false;
		      this._activeTrigger[TRIGGER_FOCUS] = false;
		      this._activeTrigger[TRIGGER_HOVER] = false;
		      this._isHovered = null; // it is a trick to support manual triggering

		      const complete = () => {
		        if (this._isWithActiveTrigger()) {
		          return;
		        }
		        if (!this._isHovered) {
		          this._disposePopper();
		        }
		        this._element.removeAttribute('aria-describedby');
		        EventHandler__default.default.trigger(this._element, this.constructor.eventName(EVENT_HIDDEN));
		      };
		      this._queueCallback(complete, this.tip, this._isAnimated());
		    }
		    update() {
		      if (this._popper) {
		        this._popper.update();
		      }
		    } // Protected

		    _isWithContent() {
		      return Boolean(this._getTitle());
		    }
		    _getTipElement() {
		      if (!this.tip) {
		        this.tip = this._createTipElement(this._newContent || this._getContentForTemplate());
		      }
		      return this.tip;
		    }
		    _createTipElement(content) {
		      const tip = this._getTemplateFactory(content).toHtml(); // todo: remove this check on v6

		      if (!tip) {
		        return null;
		      }
		      tip.classList.remove(CLASS_NAME_FADE, CLASS_NAME_SHOW); // todo: on v6 the following can be achieved with CSS only

		      tip.classList.add(`bs-${this.constructor.NAME}-auto`);
		      const tipId = index.getUID(this.constructor.NAME).toString();
		      tip.setAttribute('id', tipId);
		      if (this._isAnimated()) {
		        tip.classList.add(CLASS_NAME_FADE);
		      }
		      return tip;
		    }
		    setContent(content) {
		      this._newContent = content;
		      if (this._isShown()) {
		        this._disposePopper();
		        this.show();
		      }
		    }
		    _getTemplateFactory(content) {
		      if (this._templateFactory) {
		        this._templateFactory.changeContent(content);
		      } else {
		        this._templateFactory = new TemplateFactory__default.default({
		          ...this._config,
		          // the `content` var has to be after `this._config`
		          // to override config.content in case of popover
		          content,
		          extraClass: this._resolvePossibleFunction(this._config.customClass)
		        });
		      }
		      return this._templateFactory;
		    }
		    _getContentForTemplate() {
		      return {
		        [SELECTOR_TOOLTIP_INNER]: this._getTitle()
		      };
		    }
		    _getTitle() {
		      return this._resolvePossibleFunction(this._config.title) || this._element.getAttribute('data-bs-original-title');
		    } // Private

		    _initializeOnDelegatedTarget(event) {
		      return this.constructor.getOrCreateInstance(event.delegateTarget, this._getDelegateConfig());
		    }
		    _isAnimated() {
		      return this._config.animation || this.tip && this.tip.classList.contains(CLASS_NAME_FADE);
		    }
		    _isShown() {
		      return this.tip && this.tip.classList.contains(CLASS_NAME_SHOW);
		    }
		    _createPopper(tip) {
		      const placement = typeof this._config.placement === 'function' ? this._config.placement.call(this, tip, this._element) : this._config.placement;
		      const attachment = AttachmentMap[placement.toUpperCase()];
		      return Popper__namespace.createPopper(this._element, tip, this._getPopperConfig(attachment));
		    }
		    _getOffset() {
		      const {
		        offset
		      } = this._config;
		      if (typeof offset === 'string') {
		        return offset.split(',').map(value => Number.parseInt(value, 10));
		      }
		      if (typeof offset === 'function') {
		        return popperData => offset(popperData, this._element);
		      }
		      return offset;
		    }
		    _resolvePossibleFunction(arg) {
		      return typeof arg === 'function' ? arg.call(this._element) : arg;
		    }
		    _getPopperConfig(attachment) {
		      const defaultBsPopperConfig = {
		        placement: attachment,
		        modifiers: [{
		          name: 'flip',
		          options: {
		            fallbackPlacements: this._config.fallbackPlacements
		          }
		        }, {
		          name: 'offset',
		          options: {
		            offset: this._getOffset()
		          }
		        }, {
		          name: 'preventOverflow',
		          options: {
		            boundary: this._config.boundary
		          }
		        }, {
		          name: 'arrow',
		          options: {
		            element: `.${this.constructor.NAME}-arrow`
		          }
		        }, {
		          name: 'preSetPlacement',
		          enabled: true,
		          phase: 'beforeMain',
		          fn: data => {
		            // Pre-set Popper's placement attribute in order to read the arrow sizes properly.
		            // Otherwise, Popper mixes up the width and height dimensions since the initial arrow style is for top placement
		            this._getTipElement().setAttribute('data-popper-placement', data.state.placement);
		          }
		        }]
		      };
		      return {
		        ...defaultBsPopperConfig,
		        ...(typeof this._config.popperConfig === 'function' ? this._config.popperConfig(defaultBsPopperConfig) : this._config.popperConfig)
		      };
		    }
		    _setListeners() {
		      const triggers = this._config.trigger.split(' ');
		      for (const trigger of triggers) {
		        if (trigger === 'click') {
		          EventHandler__default.default.on(this._element, this.constructor.eventName(EVENT_CLICK), this._config.selector, event => {
		            const context = this._initializeOnDelegatedTarget(event);
		            context.toggle();
		          });
		        } else if (trigger !== TRIGGER_MANUAL) {
		          const eventIn = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSEENTER) : this.constructor.eventName(EVENT_FOCUSIN);
		          const eventOut = trigger === TRIGGER_HOVER ? this.constructor.eventName(EVENT_MOUSELEAVE) : this.constructor.eventName(EVENT_FOCUSOUT);
		          EventHandler__default.default.on(this._element, eventIn, this._config.selector, event => {
		            const context = this._initializeOnDelegatedTarget(event);
		            context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
		            context._enter();
		          });
		          EventHandler__default.default.on(this._element, eventOut, this._config.selector, event => {
		            const context = this._initializeOnDelegatedTarget(event);
		            context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = context._element.contains(event.relatedTarget);
		            context._leave();
		          });
		        }
		      }
		      this._hideModalHandler = () => {
		        if (this._element) {
		          this.hide();
		        }
		      };
		      EventHandler__default.default.on(this._element.closest(SELECTOR_MODAL), EVENT_MODAL_HIDE, this._hideModalHandler);
		    }
		    _fixTitle() {
		      const title = this._element.getAttribute('title');
		      if (!title) {
		        return;
		      }
		      if (!this._element.getAttribute('aria-label') && !this._element.textContent.trim()) {
		        this._element.setAttribute('aria-label', title);
		      }
		      this._element.setAttribute('data-bs-original-title', title); // DO NOT USE IT. Is only for backwards compatibility

		      this._element.removeAttribute('title');
		    }
		    _enter() {
		      if (this._isShown() || this._isHovered) {
		        this._isHovered = true;
		        return;
		      }
		      this._isHovered = true;
		      this._setTimeout(() => {
		        if (this._isHovered) {
		          this.show();
		        }
		      }, this._config.delay.show);
		    }
		    _leave() {
		      if (this._isWithActiveTrigger()) {
		        return;
		      }
		      this._isHovered = false;
		      this._setTimeout(() => {
		        if (!this._isHovered) {
		          this.hide();
		        }
		      }, this._config.delay.hide);
		    }
		    _setTimeout(handler, timeout) {
		      clearTimeout(this._timeout);
		      this._timeout = setTimeout(handler, timeout);
		    }
		    _isWithActiveTrigger() {
		      return Object.values(this._activeTrigger).includes(true);
		    }
		    _getConfig(config) {
		      const dataAttributes = Manipulator__default.default.getDataAttributes(this._element);
		      for (const dataAttribute of Object.keys(dataAttributes)) {
		        if (DISALLOWED_ATTRIBUTES.has(dataAttribute)) {
		          delete dataAttributes[dataAttribute];
		        }
		      }
		      config = {
		        ...dataAttributes,
		        ...(typeof config === 'object' && config ? config : {})
		      };
		      config = this._mergeConfigObj(config);
		      config = this._configAfterMerge(config);
		      this._typeCheckConfig(config);
		      return config;
		    }
		    _configAfterMerge(config) {
		      config.container = config.container === false ? document.body : index.getElement(config.container);
		      if (typeof config.delay === 'number') {
		        config.delay = {
		          show: config.delay,
		          hide: config.delay
		        };
		      }
		      if (typeof config.title === 'number') {
		        config.title = config.title.toString();
		      }
		      if (typeof config.content === 'number') {
		        config.content = config.content.toString();
		      }
		      return config;
		    }
		    _getDelegateConfig() {
		      const config = {};
		      for (const key in this._config) {
		        if (this.constructor.Default[key] !== this._config[key]) {
		          config[key] = this._config[key];
		        }
		      }
		      config.selector = false;
		      config.trigger = 'manual'; // In the future can be replaced with:
		      // const keysWithDifferentValues = Object.entries(this._config).filter(entry => this.constructor.Default[entry[0]] !== this._config[entry[0]])
		      // `Object.fromEntries(keysWithDifferentValues)`

		      return config;
		    }
		    _disposePopper() {
		      if (this._popper) {
		        this._popper.destroy();
		        this._popper = null;
		      }
		      if (this.tip) {
		        this.tip.remove();
		        this.tip = null;
		      }
		    } // Static

		    static jQueryInterface(config) {
		      return this.each(function () {
		        const data = Tooltip.getOrCreateInstance(this, config);
		        if (typeof config !== 'string') {
		          return;
		        }
		        if (typeof data[config] === 'undefined') {
		          throw new TypeError(`No method named "${config}"`);
		        }
		        data[config]();
		      });
		    }
		  }
		  /**
		   * jQuery
		   */

		  index.defineJQueryPlugin(Tooltip);
		  return Tooltip;
		});
	} (tooltip$1));

	var tooltip = /*@__PURE__*/getDefaultExportFromCjs(tooltip$1.exports);

	/*!
	  * Bootstrap popover.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
		(function (global, factory) {
		  module.exports = factory(requireUtil(), tooltip$1.exports) ;
		})(commonjsGlobal, function (index, Tooltip) {

		  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
		    default: e
		  };
		  const Tooltip__default = /*#__PURE__*/_interopDefaultLegacy(Tooltip);

		  /**
		   * --------------------------------------------------------------------------
		   * Bootstrap (v5.2.3): popover.js
		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		   * --------------------------------------------------------------------------
		   */
		  /**
		   * Constants
		   */

		  const NAME = 'popover';
		  const SELECTOR_TITLE = '.popover-header';
		  const SELECTOR_CONTENT = '.popover-body';
		  const Default = {
		    ...Tooltip__default.default.Default,
		    content: '',
		    offset: [0, 8],
		    placement: 'right',
		    template: '<div class="popover" role="tooltip">' + '<div class="popover-arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div>' + '</div>',
		    trigger: 'click'
		  };
		  const DefaultType = {
		    ...Tooltip__default.default.DefaultType,
		    content: '(null|string|element|function)'
		  };
		  /**
		   * Class definition
		   */

		  class Popover extends Tooltip__default.default {
		    // Getters
		    static get Default() {
		      return Default;
		    }
		    static get DefaultType() {
		      return DefaultType;
		    }
		    static get NAME() {
		      return NAME;
		    } // Overrides

		    _isWithContent() {
		      return this._getTitle() || this._getContent();
		    } // Private

		    _getContentForTemplate() {
		      return {
		        [SELECTOR_TITLE]: this._getTitle(),
		        [SELECTOR_CONTENT]: this._getContent()
		      };
		    }
		    _getContent() {
		      return this._resolvePossibleFunction(this._config.content);
		    } // Static

		    static jQueryInterface(config) {
		      return this.each(function () {
		        const data = Popover.getOrCreateInstance(this, config);
		        if (typeof config !== 'string') {
		          return;
		        }
		        if (typeof data[config] === 'undefined') {
		          throw new TypeError(`No method named "${config}"`);
		        }
		        data[config]();
		      });
		    }
		  }
		  /**
		   * jQuery
		   */

		  index.defineJQueryPlugin(Popover);
		  return Popover;
		});
	} (popover$1));

	var popover = popover$1.exports;

	var scrollspy$1 = {exports: {}};

	/*!
	  * Bootstrap scrollspy.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
		(function (global, factory) {
		  module.exports = factory(requireUtil(), requireEventHandler(), requireSelectorEngine(), requireBaseComponent()) ;
		})(commonjsGlobal, function (index, EventHandler, SelectorEngine, BaseComponent) {

		  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
		    default: e
		  };
		  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
		  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
		  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

		  /**
		   * --------------------------------------------------------------------------
		   * Bootstrap (v5.2.3): scrollspy.js
		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		   * --------------------------------------------------------------------------
		   */
		  /**
		   * Constants
		   */

		  const NAME = 'scrollspy';
		  const DATA_KEY = 'bs.scrollspy';
		  const EVENT_KEY = `.${DATA_KEY}`;
		  const DATA_API_KEY = '.data-api';
		  const EVENT_ACTIVATE = `activate${EVENT_KEY}`;
		  const EVENT_CLICK = `click${EVENT_KEY}`;
		  const EVENT_LOAD_DATA_API = `load${EVENT_KEY}${DATA_API_KEY}`;
		  const CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
		  const CLASS_NAME_ACTIVE = 'active';
		  const SELECTOR_DATA_SPY = '[data-bs-spy="scroll"]';
		  const SELECTOR_TARGET_LINKS = '[href]';
		  const SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
		  const SELECTOR_NAV_LINKS = '.nav-link';
		  const SELECTOR_NAV_ITEMS = '.nav-item';
		  const SELECTOR_LIST_ITEMS = '.list-group-item';
		  const SELECTOR_LINK_ITEMS = `${SELECTOR_NAV_LINKS}, ${SELECTOR_NAV_ITEMS} > ${SELECTOR_NAV_LINKS}, ${SELECTOR_LIST_ITEMS}`;
		  const SELECTOR_DROPDOWN = '.dropdown';
		  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
		  const Default = {
		    offset: null,
		    // TODO: v6 @deprecated, keep it for backwards compatibility reasons
		    rootMargin: '0px 0px -25%',
		    smoothScroll: false,
		    target: null,
		    threshold: [0.1, 0.5, 1]
		  };
		  const DefaultType = {
		    offset: '(number|null)',
		    // TODO v6 @deprecated, keep it for backwards compatibility reasons
		    rootMargin: 'string',
		    smoothScroll: 'boolean',
		    target: 'element',
		    threshold: 'array'
		  };
		  /**
		   * Class definition
		   */

		  class ScrollSpy extends BaseComponent__default.default {
		    constructor(element, config) {
		      super(element, config); // this._element is the observablesContainer and config.target the menu links wrapper

		      this._targetLinks = new Map();
		      this._observableSections = new Map();
		      this._rootElement = getComputedStyle(this._element).overflowY === 'visible' ? null : this._element;
		      this._activeTarget = null;
		      this._observer = null;
		      this._previousScrollData = {
		        visibleEntryTop: 0,
		        parentScrollTop: 0
		      };
		      this.refresh(); // initialize
		    } // Getters

		    static get Default() {
		      return Default;
		    }
		    static get DefaultType() {
		      return DefaultType;
		    }
		    static get NAME() {
		      return NAME;
		    } // Public

		    refresh() {
		      this._initializeTargetsAndObservables();
		      this._maybeEnableSmoothScroll();
		      if (this._observer) {
		        this._observer.disconnect();
		      } else {
		        this._observer = this._getNewObserver();
		      }
		      for (const section of this._observableSections.values()) {
		        this._observer.observe(section);
		      }
		    }
		    dispose() {
		      this._observer.disconnect();
		      super.dispose();
		    } // Private

		    _configAfterMerge(config) {
		      // TODO: on v6 target should be given explicitly & remove the {target: 'ss-target'} case
		      config.target = index.getElement(config.target) || document.body; // TODO: v6 Only for backwards compatibility reasons. Use rootMargin only

		      config.rootMargin = config.offset ? `${config.offset}px 0px -30%` : config.rootMargin;
		      if (typeof config.threshold === 'string') {
		        config.threshold = config.threshold.split(',').map(value => Number.parseFloat(value));
		      }
		      return config;
		    }
		    _maybeEnableSmoothScroll() {
		      if (!this._config.smoothScroll) {
		        return;
		      } // unregister any previous listeners

		      EventHandler__default.default.off(this._config.target, EVENT_CLICK);
		      EventHandler__default.default.on(this._config.target, EVENT_CLICK, SELECTOR_TARGET_LINKS, event => {
		        const observableSection = this._observableSections.get(event.target.hash);
		        if (observableSection) {
		          event.preventDefault();
		          const root = this._rootElement || window;
		          const height = observableSection.offsetTop - this._element.offsetTop;
		          if (root.scrollTo) {
		            root.scrollTo({
		              top: height,
		              behavior: 'smooth'
		            });
		            return;
		          } // Chrome 60 doesn't support `scrollTo`

		          root.scrollTop = height;
		        }
		      });
		    }
		    _getNewObserver() {
		      const options = {
		        root: this._rootElement,
		        threshold: this._config.threshold,
		        rootMargin: this._config.rootMargin
		      };
		      return new IntersectionObserver(entries => this._observerCallback(entries), options);
		    } // The logic of selection

		    _observerCallback(entries) {
		      const targetElement = entry => this._targetLinks.get(`#${entry.target.id}`);
		      const activate = entry => {
		        this._previousScrollData.visibleEntryTop = entry.target.offsetTop;
		        this._process(targetElement(entry));
		      };
		      const parentScrollTop = (this._rootElement || document.documentElement).scrollTop;
		      const userScrollsDown = parentScrollTop >= this._previousScrollData.parentScrollTop;
		      this._previousScrollData.parentScrollTop = parentScrollTop;
		      for (const entry of entries) {
		        if (!entry.isIntersecting) {
		          this._activeTarget = null;
		          this._clearActiveClass(targetElement(entry));
		          continue;
		        }
		        const entryIsLowerThanPrevious = entry.target.offsetTop >= this._previousScrollData.visibleEntryTop; // if we are scrolling down, pick the bigger offsetTop

		        if (userScrollsDown && entryIsLowerThanPrevious) {
		          activate(entry); // if parent isn't scrolled, let's keep the first visible item, breaking the iteration

		          if (!parentScrollTop) {
		            return;
		          }
		          continue;
		        } // if we are scrolling up, pick the smallest offsetTop

		        if (!userScrollsDown && !entryIsLowerThanPrevious) {
		          activate(entry);
		        }
		      }
		    }
		    _initializeTargetsAndObservables() {
		      this._targetLinks = new Map();
		      this._observableSections = new Map();
		      const targetLinks = SelectorEngine__default.default.find(SELECTOR_TARGET_LINKS, this._config.target);
		      for (const anchor of targetLinks) {
		        // ensure that the anchor has an id and is not disabled
		        if (!anchor.hash || index.isDisabled(anchor)) {
		          continue;
		        }
		        const observableSection = SelectorEngine__default.default.findOne(anchor.hash, this._element); // ensure that the observableSection exists & is visible

		        if (index.isVisible(observableSection)) {
		          this._targetLinks.set(anchor.hash, anchor);
		          this._observableSections.set(anchor.hash, observableSection);
		        }
		      }
		    }
		    _process(target) {
		      if (this._activeTarget === target) {
		        return;
		      }
		      this._clearActiveClass(this._config.target);
		      this._activeTarget = target;
		      target.classList.add(CLASS_NAME_ACTIVE);
		      this._activateParents(target);
		      EventHandler__default.default.trigger(this._element, EVENT_ACTIVATE, {
		        relatedTarget: target
		      });
		    }
		    _activateParents(target) {
		      // Activate dropdown parents
		      if (target.classList.contains(CLASS_NAME_DROPDOWN_ITEM)) {
		        SelectorEngine__default.default.findOne(SELECTOR_DROPDOWN_TOGGLE, target.closest(SELECTOR_DROPDOWN)).classList.add(CLASS_NAME_ACTIVE);
		        return;
		      }
		      for (const listGroup of SelectorEngine__default.default.parents(target, SELECTOR_NAV_LIST_GROUP)) {
		        // Set triggered links parents as active
		        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor
		        for (const item of SelectorEngine__default.default.prev(listGroup, SELECTOR_LINK_ITEMS)) {
		          item.classList.add(CLASS_NAME_ACTIVE);
		        }
		      }
		    }
		    _clearActiveClass(parent) {
		      parent.classList.remove(CLASS_NAME_ACTIVE);
		      const activeNodes = SelectorEngine__default.default.find(`${SELECTOR_TARGET_LINKS}.${CLASS_NAME_ACTIVE}`, parent);
		      for (const node of activeNodes) {
		        node.classList.remove(CLASS_NAME_ACTIVE);
		      }
		    } // Static

		    static jQueryInterface(config) {
		      return this.each(function () {
		        const data = ScrollSpy.getOrCreateInstance(this, config);
		        if (typeof config !== 'string') {
		          return;
		        }
		        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
		          throw new TypeError(`No method named "${config}"`);
		        }
		        data[config]();
		      });
		    }
		  }
		  /**
		   * Data API implementation
		   */

		  EventHandler__default.default.on(window, EVENT_LOAD_DATA_API, () => {
		    for (const spy of SelectorEngine__default.default.find(SELECTOR_DATA_SPY)) {
		      ScrollSpy.getOrCreateInstance(spy);
		    }
		  });
		  /**
		   * jQuery
		   */

		  index.defineJQueryPlugin(ScrollSpy);
		  return ScrollSpy;
		});
	} (scrollspy$1));

	var scrollspy = scrollspy$1.exports;

	var tab$1 = {exports: {}};

	/*!
	  * Bootstrap tab.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
		(function (global, factory) {
		  module.exports = factory(requireUtil(), requireEventHandler(), requireSelectorEngine(), requireBaseComponent()) ;
		})(commonjsGlobal, function (index, EventHandler, SelectorEngine, BaseComponent) {

		  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
		    default: e
		  };
		  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
		  const SelectorEngine__default = /*#__PURE__*/_interopDefaultLegacy(SelectorEngine);
		  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

		  /**
		   * --------------------------------------------------------------------------
		   * Bootstrap (v5.2.3): tab.js
		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		   * --------------------------------------------------------------------------
		   */
		  /**
		   * Constants
		   */

		  const NAME = 'tab';
		  const DATA_KEY = 'bs.tab';
		  const EVENT_KEY = `.${DATA_KEY}`;
		  const EVENT_HIDE = `hide${EVENT_KEY}`;
		  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
		  const EVENT_SHOW = `show${EVENT_KEY}`;
		  const EVENT_SHOWN = `shown${EVENT_KEY}`;
		  const EVENT_CLICK_DATA_API = `click${EVENT_KEY}`;
		  const EVENT_KEYDOWN = `keydown${EVENT_KEY}`;
		  const EVENT_LOAD_DATA_API = `load${EVENT_KEY}`;
		  const ARROW_LEFT_KEY = 'ArrowLeft';
		  const ARROW_RIGHT_KEY = 'ArrowRight';
		  const ARROW_UP_KEY = 'ArrowUp';
		  const ARROW_DOWN_KEY = 'ArrowDown';
		  const CLASS_NAME_ACTIVE = 'active';
		  const CLASS_NAME_FADE = 'fade';
		  const CLASS_NAME_SHOW = 'show';
		  const CLASS_DROPDOWN = 'dropdown';
		  const SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
		  const SELECTOR_DROPDOWN_MENU = '.dropdown-menu';
		  const NOT_SELECTOR_DROPDOWN_TOGGLE = ':not(.dropdown-toggle)';
		  const SELECTOR_TAB_PANEL = '.list-group, .nav, [role="tablist"]';
		  const SELECTOR_OUTER = '.nav-item, .list-group-item';
		  const SELECTOR_INNER = `.nav-link${NOT_SELECTOR_DROPDOWN_TOGGLE}, .list-group-item${NOT_SELECTOR_DROPDOWN_TOGGLE}, [role="tab"]${NOT_SELECTOR_DROPDOWN_TOGGLE}`;
		  const SELECTOR_DATA_TOGGLE = '[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]'; // todo:v6: could be only `tab`

		  const SELECTOR_INNER_ELEM = `${SELECTOR_INNER}, ${SELECTOR_DATA_TOGGLE}`;
		  const SELECTOR_DATA_TOGGLE_ACTIVE = `.${CLASS_NAME_ACTIVE}[data-bs-toggle="tab"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="pill"], .${CLASS_NAME_ACTIVE}[data-bs-toggle="list"]`;
		  /**
		   * Class definition
		   */

		  class Tab extends BaseComponent__default.default {
		    constructor(element) {
		      super(element);
		      this._parent = this._element.closest(SELECTOR_TAB_PANEL);
		      if (!this._parent) {
		        return; // todo: should Throw exception on v6
		        // throw new TypeError(`${element.outerHTML} has not a valid parent ${SELECTOR_INNER_ELEM}`)
		      } // Set up initial aria attributes

		      this._setInitialAttributes(this._parent, this._getChildren());
		      EventHandler__default.default.on(this._element, EVENT_KEYDOWN, event => this._keydown(event));
		    } // Getters

		    static get NAME() {
		      return NAME;
		    } // Public

		    show() {
		      // Shows this elem and deactivate the active sibling if exists
		      const innerElem = this._element;
		      if (this._elemIsActive(innerElem)) {
		        return;
		      } // Search for active tab on same parent to deactivate it

		      const active = this._getActiveElem();
		      const hideEvent = active ? EventHandler__default.default.trigger(active, EVENT_HIDE, {
		        relatedTarget: innerElem
		      }) : null;
		      const showEvent = EventHandler__default.default.trigger(innerElem, EVENT_SHOW, {
		        relatedTarget: active
		      });
		      if (showEvent.defaultPrevented || hideEvent && hideEvent.defaultPrevented) {
		        return;
		      }
		      this._deactivate(active, innerElem);
		      this._activate(innerElem, active);
		    } // Private

		    _activate(element, relatedElem) {
		      if (!element) {
		        return;
		      }
		      element.classList.add(CLASS_NAME_ACTIVE);
		      this._activate(index.getElementFromSelector(element)); // Search and activate/show the proper section

		      const complete = () => {
		        if (element.getAttribute('role') !== 'tab') {
		          element.classList.add(CLASS_NAME_SHOW);
		          return;
		        }
		        element.removeAttribute('tabindex');
		        element.setAttribute('aria-selected', true);
		        this._toggleDropDown(element, true);
		        EventHandler__default.default.trigger(element, EVENT_SHOWN, {
		          relatedTarget: relatedElem
		        });
		      };
		      this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE));
		    }
		    _deactivate(element, relatedElem) {
		      if (!element) {
		        return;
		      }
		      element.classList.remove(CLASS_NAME_ACTIVE);
		      element.blur();
		      this._deactivate(index.getElementFromSelector(element)); // Search and deactivate the shown section too

		      const complete = () => {
		        if (element.getAttribute('role') !== 'tab') {
		          element.classList.remove(CLASS_NAME_SHOW);
		          return;
		        }
		        element.setAttribute('aria-selected', false);
		        element.setAttribute('tabindex', '-1');
		        this._toggleDropDown(element, false);
		        EventHandler__default.default.trigger(element, EVENT_HIDDEN, {
		          relatedTarget: relatedElem
		        });
		      };
		      this._queueCallback(complete, element, element.classList.contains(CLASS_NAME_FADE));
		    }
		    _keydown(event) {
		      if (![ARROW_LEFT_KEY, ARROW_RIGHT_KEY, ARROW_UP_KEY, ARROW_DOWN_KEY].includes(event.key)) {
		        return;
		      }
		      event.stopPropagation(); // stopPropagation/preventDefault both added to support up/down keys without scrolling the page

		      event.preventDefault();
		      const isNext = [ARROW_RIGHT_KEY, ARROW_DOWN_KEY].includes(event.key);
		      const nextActiveElement = index.getNextActiveElement(this._getChildren().filter(element => !index.isDisabled(element)), event.target, isNext, true);
		      if (nextActiveElement) {
		        nextActiveElement.focus({
		          preventScroll: true
		        });
		        Tab.getOrCreateInstance(nextActiveElement).show();
		      }
		    }
		    _getChildren() {
		      // collection of inner elements
		      return SelectorEngine__default.default.find(SELECTOR_INNER_ELEM, this._parent);
		    }
		    _getActiveElem() {
		      return this._getChildren().find(child => this._elemIsActive(child)) || null;
		    }
		    _setInitialAttributes(parent, children) {
		      this._setAttributeIfNotExists(parent, 'role', 'tablist');
		      for (const child of children) {
		        this._setInitialAttributesOnChild(child);
		      }
		    }
		    _setInitialAttributesOnChild(child) {
		      child = this._getInnerElement(child);
		      const isActive = this._elemIsActive(child);
		      const outerElem = this._getOuterElement(child);
		      child.setAttribute('aria-selected', isActive);
		      if (outerElem !== child) {
		        this._setAttributeIfNotExists(outerElem, 'role', 'presentation');
		      }
		      if (!isActive) {
		        child.setAttribute('tabindex', '-1');
		      }
		      this._setAttributeIfNotExists(child, 'role', 'tab'); // set attributes to the related panel too

		      this._setInitialAttributesOnTargetPanel(child);
		    }
		    _setInitialAttributesOnTargetPanel(child) {
		      const target = index.getElementFromSelector(child);
		      if (!target) {
		        return;
		      }
		      this._setAttributeIfNotExists(target, 'role', 'tabpanel');
		      if (child.id) {
		        this._setAttributeIfNotExists(target, 'aria-labelledby', `#${child.id}`);
		      }
		    }
		    _toggleDropDown(element, open) {
		      const outerElem = this._getOuterElement(element);
		      if (!outerElem.classList.contains(CLASS_DROPDOWN)) {
		        return;
		      }
		      const toggle = (selector, className) => {
		        const element = SelectorEngine__default.default.findOne(selector, outerElem);
		        if (element) {
		          element.classList.toggle(className, open);
		        }
		      };
		      toggle(SELECTOR_DROPDOWN_TOGGLE, CLASS_NAME_ACTIVE);
		      toggle(SELECTOR_DROPDOWN_MENU, CLASS_NAME_SHOW);
		      outerElem.setAttribute('aria-expanded', open);
		    }
		    _setAttributeIfNotExists(element, attribute, value) {
		      if (!element.hasAttribute(attribute)) {
		        element.setAttribute(attribute, value);
		      }
		    }
		    _elemIsActive(elem) {
		      return elem.classList.contains(CLASS_NAME_ACTIVE);
		    } // Try to get the inner element (usually the .nav-link)

		    _getInnerElement(elem) {
		      return elem.matches(SELECTOR_INNER_ELEM) ? elem : SelectorEngine__default.default.findOne(SELECTOR_INNER_ELEM, elem);
		    } // Try to get the outer element (usually the .nav-item)

		    _getOuterElement(elem) {
		      return elem.closest(SELECTOR_OUTER) || elem;
		    } // Static

		    static jQueryInterface(config) {
		      return this.each(function () {
		        const data = Tab.getOrCreateInstance(this);
		        if (typeof config !== 'string') {
		          return;
		        }
		        if (data[config] === undefined || config.startsWith('_') || config === 'constructor') {
		          throw new TypeError(`No method named "${config}"`);
		        }
		        data[config]();
		      });
		    }
		  }
		  /**
		   * Data API implementation
		   */

		  EventHandler__default.default.on(document, EVENT_CLICK_DATA_API, SELECTOR_DATA_TOGGLE, function (event) {
		    if (['A', 'AREA'].includes(this.tagName)) {
		      event.preventDefault();
		    }
		    if (index.isDisabled(this)) {
		      return;
		    }
		    Tab.getOrCreateInstance(this).show();
		  });
		  /**
		   * Initialize on focus
		   */

		  EventHandler__default.default.on(window, EVENT_LOAD_DATA_API, () => {
		    for (const element of SelectorEngine__default.default.find(SELECTOR_DATA_TOGGLE_ACTIVE)) {
		      Tab.getOrCreateInstance(element);
		    }
		  });
		  /**
		   * jQuery
		   */

		  index.defineJQueryPlugin(Tab);
		  return Tab;
		});
	} (tab$1));

	var tab = tab$1.exports;

	var toast$1 = {exports: {}};

	/*!
	  * Bootstrap toast.js v5.2.3 (https://getbootstrap.com/)
	  * Copyright 2011-2022 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
	  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
	  */

	(function (module, exports) {
		(function (global, factory) {
		  module.exports = factory(requireUtil(), requireEventHandler(), requireBaseComponent(), requireComponentFunctions()) ;
		})(commonjsGlobal, function (index, EventHandler, BaseComponent, componentFunctions) {

		  const _interopDefaultLegacy = e => e && typeof e === 'object' && 'default' in e ? e : {
		    default: e
		  };
		  const EventHandler__default = /*#__PURE__*/_interopDefaultLegacy(EventHandler);
		  const BaseComponent__default = /*#__PURE__*/_interopDefaultLegacy(BaseComponent);

		  /**
		   * --------------------------------------------------------------------------
		   * Bootstrap (v5.2.3): toast.js
		   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
		   * --------------------------------------------------------------------------
		   */
		  /**
		   * Constants
		   */

		  const NAME = 'toast';
		  const DATA_KEY = 'bs.toast';
		  const EVENT_KEY = `.${DATA_KEY}`;
		  const EVENT_MOUSEOVER = `mouseover${EVENT_KEY}`;
		  const EVENT_MOUSEOUT = `mouseout${EVENT_KEY}`;
		  const EVENT_FOCUSIN = `focusin${EVENT_KEY}`;
		  const EVENT_FOCUSOUT = `focusout${EVENT_KEY}`;
		  const EVENT_HIDE = `hide${EVENT_KEY}`;
		  const EVENT_HIDDEN = `hidden${EVENT_KEY}`;
		  const EVENT_SHOW = `show${EVENT_KEY}`;
		  const EVENT_SHOWN = `shown${EVENT_KEY}`;
		  const CLASS_NAME_FADE = 'fade';
		  const CLASS_NAME_HIDE = 'hide'; // @deprecated - kept here only for backwards compatibility

		  const CLASS_NAME_SHOW = 'show';
		  const CLASS_NAME_SHOWING = 'showing';
		  const DefaultType = {
		    animation: 'boolean',
		    autohide: 'boolean',
		    delay: 'number'
		  };
		  const Default = {
		    animation: true,
		    autohide: true,
		    delay: 5000
		  };
		  /**
		   * Class definition
		   */

		  class Toast extends BaseComponent__default.default {
		    constructor(element, config) {
		      super(element, config);
		      this._timeout = null;
		      this._hasMouseInteraction = false;
		      this._hasKeyboardInteraction = false;
		      this._setListeners();
		    } // Getters

		    static get Default() {
		      return Default;
		    }
		    static get DefaultType() {
		      return DefaultType;
		    }
		    static get NAME() {
		      return NAME;
		    } // Public

		    show() {
		      const showEvent = EventHandler__default.default.trigger(this._element, EVENT_SHOW);
		      if (showEvent.defaultPrevented) {
		        return;
		      }
		      this._clearTimeout();
		      if (this._config.animation) {
		        this._element.classList.add(CLASS_NAME_FADE);
		      }
		      const complete = () => {
		        this._element.classList.remove(CLASS_NAME_SHOWING);
		        EventHandler__default.default.trigger(this._element, EVENT_SHOWN);
		        this._maybeScheduleHide();
		      };
		      this._element.classList.remove(CLASS_NAME_HIDE); // @deprecated

		      index.reflow(this._element);
		      this._element.classList.add(CLASS_NAME_SHOW, CLASS_NAME_SHOWING);
		      this._queueCallback(complete, this._element, this._config.animation);
		    }
		    hide() {
		      if (!this.isShown()) {
		        return;
		      }
		      const hideEvent = EventHandler__default.default.trigger(this._element, EVENT_HIDE);
		      if (hideEvent.defaultPrevented) {
		        return;
		      }
		      const complete = () => {
		        this._element.classList.add(CLASS_NAME_HIDE); // @deprecated

		        this._element.classList.remove(CLASS_NAME_SHOWING, CLASS_NAME_SHOW);
		        EventHandler__default.default.trigger(this._element, EVENT_HIDDEN);
		      };
		      this._element.classList.add(CLASS_NAME_SHOWING);
		      this._queueCallback(complete, this._element, this._config.animation);
		    }
		    dispose() {
		      this._clearTimeout();
		      if (this.isShown()) {
		        this._element.classList.remove(CLASS_NAME_SHOW);
		      }
		      super.dispose();
		    }
		    isShown() {
		      return this._element.classList.contains(CLASS_NAME_SHOW);
		    } // Private

		    _maybeScheduleHide() {
		      if (!this._config.autohide) {
		        return;
		      }
		      if (this._hasMouseInteraction || this._hasKeyboardInteraction) {
		        return;
		      }
		      this._timeout = setTimeout(() => {
		        this.hide();
		      }, this._config.delay);
		    }
		    _onInteraction(event, isInteracting) {
		      switch (event.type) {
		        case 'mouseover':
		        case 'mouseout':
		          {
		            this._hasMouseInteraction = isInteracting;
		            break;
		          }
		        case 'focusin':
		        case 'focusout':
		          {
		            this._hasKeyboardInteraction = isInteracting;
		            break;
		          }
		      }
		      if (isInteracting) {
		        this._clearTimeout();
		        return;
		      }
		      const nextElement = event.relatedTarget;
		      if (this._element === nextElement || this._element.contains(nextElement)) {
		        return;
		      }
		      this._maybeScheduleHide();
		    }
		    _setListeners() {
		      EventHandler__default.default.on(this._element, EVENT_MOUSEOVER, event => this._onInteraction(event, true));
		      EventHandler__default.default.on(this._element, EVENT_MOUSEOUT, event => this._onInteraction(event, false));
		      EventHandler__default.default.on(this._element, EVENT_FOCUSIN, event => this._onInteraction(event, true));
		      EventHandler__default.default.on(this._element, EVENT_FOCUSOUT, event => this._onInteraction(event, false));
		    }
		    _clearTimeout() {
		      clearTimeout(this._timeout);
		      this._timeout = null;
		    } // Static

		    static jQueryInterface(config) {
		      return this.each(function () {
		        const data = Toast.getOrCreateInstance(this, config);
		        if (typeof config === 'string') {
		          if (typeof data[config] === 'undefined') {
		            throw new TypeError(`No method named "${config}"`);
		          }
		          data[config](this);
		        }
		      });
		    }
		  }
		  /**
		   * Data API implementation
		   */

		  componentFunctions.enableDismissTrigger(Toast);
		  /**
		   * jQuery
		   */

		  index.defineJQueryPlugin(Toast);
		  return Toast;
		});
	} (toast$1));

	var toast = toast$1.exports;

	/**
	 * File skip-link-focus-fix.js.
	 *
	 * Helps with accessibility for keyboard only users.
	 *
	 * Learn more: https://git.io/vWdr2
	 */
	(function () {
	  var isWebkit = navigator.userAgent.toLowerCase().indexOf('webkit') > -1,
	    isOpera = navigator.userAgent.toLowerCase().indexOf('opera') > -1,
	    isIe = navigator.userAgent.toLowerCase().indexOf('msie') > -1;
	  if ((isWebkit || isOpera || isIe) && document.getElementById && window.addEventListener) {
	    window.addEventListener('hashchange', function () {
	      var id = location.hash.substring(1),
	        element;
	      if (!/^[A-z0-9_-]+$/.test(id)) {
	        return;
	      }
	      element = document.getElementById(id);
	      if (element) {
	        if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
	          element.tabIndex = -1;
	        }
	        element.focus();
	      }
	    }, false);
	  }
	})();

	var slick = {exports: {}};

	/*
	     _ _      _       _
	 ___| (_) ___| | __  (_)___
	/ __| | |/ __| |/ /  | / __|
	\__ \ | | (__|   < _ | \__ \
	|___/_|_|\___|_|\_(_)/ |___/
	                   |__/

	 Version: 1.8.1
	  Author: Ken Wheeler
	 Website: http://kenwheeler.github.io
	    Docs: http://kenwheeler.github.io/slick
	    Repo: http://github.com/kenwheeler/slick
	  Issues: http://github.com/kenwheeler/slick/issues

	 */

	(function (module, exports) {
		(function (factory) {

		  {
		    module.exports = factory(require$$0$1);
		  }
		})(function ($) {

		  var Slick = window.Slick || {};
		  Slick = function () {
		    var instanceUid = 0;
		    function Slick(element, settings) {
		      var _ = this,
		        dataSettings;
		      _.defaults = {
		        accessibility: true,
		        adaptiveHeight: false,
		        appendArrows: $(element),
		        appendDots: $(element),
		        arrows: true,
		        asNavFor: null,
		        prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
		        nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
		        autoplay: false,
		        autoplaySpeed: 3000,
		        centerMode: false,
		        centerPadding: '50px',
		        cssEase: 'ease',
		        customPaging: function (slider, i) {
		          return $('<button type="button" />').text(i + 1);
		        },
		        dots: false,
		        dotsClass: 'slick-dots',
		        draggable: true,
		        easing: 'linear',
		        edgeFriction: 0.35,
		        fade: false,
		        focusOnSelect: false,
		        focusOnChange: false,
		        infinite: true,
		        initialSlide: 0,
		        lazyLoad: 'ondemand',
		        mobileFirst: false,
		        pauseOnHover: true,
		        pauseOnFocus: true,
		        pauseOnDotsHover: false,
		        respondTo: 'window',
		        responsive: null,
		        rows: 1,
		        rtl: false,
		        slide: '',
		        slidesPerRow: 1,
		        slidesToShow: 1,
		        slidesToScroll: 1,
		        speed: 500,
		        swipe: true,
		        swipeToSlide: false,
		        touchMove: true,
		        touchThreshold: 5,
		        useCSS: true,
		        useTransform: true,
		        variableWidth: false,
		        vertical: false,
		        verticalSwiping: false,
		        waitForAnimate: true,
		        zIndex: 1000
		      };
		      _.initials = {
		        animating: false,
		        dragging: false,
		        autoPlayTimer: null,
		        currentDirection: 0,
		        currentLeft: null,
		        currentSlide: 0,
		        direction: 1,
		        $dots: null,
		        listWidth: null,
		        listHeight: null,
		        loadIndex: 0,
		        $nextArrow: null,
		        $prevArrow: null,
		        scrolling: false,
		        slideCount: null,
		        slideWidth: null,
		        $slideTrack: null,
		        $slides: null,
		        sliding: false,
		        slideOffset: 0,
		        swipeLeft: null,
		        swiping: false,
		        $list: null,
		        touchObject: {},
		        transformsEnabled: false,
		        unslicked: false
		      };
		      $.extend(_, _.initials);
		      _.activeBreakpoint = null;
		      _.animType = null;
		      _.animProp = null;
		      _.breakpoints = [];
		      _.breakpointSettings = [];
		      _.cssTransitions = false;
		      _.focussed = false;
		      _.interrupted = false;
		      _.hidden = 'hidden';
		      _.paused = true;
		      _.positionProp = null;
		      _.respondTo = null;
		      _.rowCount = 1;
		      _.shouldClick = true;
		      _.$slider = $(element);
		      _.$slidesCache = null;
		      _.transformType = null;
		      _.transitionType = null;
		      _.visibilityChange = 'visibilitychange';
		      _.windowWidth = 0;
		      _.windowTimer = null;
		      dataSettings = $(element).data('slick') || {};
		      _.options = $.extend({}, _.defaults, settings, dataSettings);
		      _.currentSlide = _.options.initialSlide;
		      _.originalSettings = _.options;
		      if (typeof document.mozHidden !== 'undefined') {
		        _.hidden = 'mozHidden';
		        _.visibilityChange = 'mozvisibilitychange';
		      } else if (typeof document.webkitHidden !== 'undefined') {
		        _.hidden = 'webkitHidden';
		        _.visibilityChange = 'webkitvisibilitychange';
		      }
		      _.autoPlay = $.proxy(_.autoPlay, _);
		      _.autoPlayClear = $.proxy(_.autoPlayClear, _);
		      _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
		      _.changeSlide = $.proxy(_.changeSlide, _);
		      _.clickHandler = $.proxy(_.clickHandler, _);
		      _.selectHandler = $.proxy(_.selectHandler, _);
		      _.setPosition = $.proxy(_.setPosition, _);
		      _.swipeHandler = $.proxy(_.swipeHandler, _);
		      _.dragHandler = $.proxy(_.dragHandler, _);
		      _.keyHandler = $.proxy(_.keyHandler, _);
		      _.instanceUid = instanceUid++;

		      // A simple way to check for HTML strings
		      // Strict HTML recognition (must start with <)
		      // Extracted from jQuery v1.11 source
		      _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;
		      _.registerBreakpoints();
		      _.init(true);
		    }
		    return Slick;
		  }();
		  Slick.prototype.activateADA = function () {
		    var _ = this;
		    _.$slideTrack.find('.slick-active').attr({
		      'aria-hidden': 'false'
		    }).find('a, input, button, select').attr({
		      'tabindex': '0'
		    });
		  };
		  Slick.prototype.addSlide = Slick.prototype.slickAdd = function (markup, index, addBefore) {
		    var _ = this;
		    if (typeof index === 'boolean') {
		      addBefore = index;
		      index = null;
		    } else if (index < 0 || index >= _.slideCount) {
		      return false;
		    }
		    _.unload();
		    if (typeof index === 'number') {
		      if (index === 0 && _.$slides.length === 0) {
		        $(markup).appendTo(_.$slideTrack);
		      } else if (addBefore) {
		        $(markup).insertBefore(_.$slides.eq(index));
		      } else {
		        $(markup).insertAfter(_.$slides.eq(index));
		      }
		    } else {
		      if (addBefore === true) {
		        $(markup).prependTo(_.$slideTrack);
		      } else {
		        $(markup).appendTo(_.$slideTrack);
		      }
		    }
		    _.$slides = _.$slideTrack.children(this.options.slide);
		    _.$slideTrack.children(this.options.slide).detach();
		    _.$slideTrack.append(_.$slides);
		    _.$slides.each(function (index, element) {
		      $(element).attr('data-slick-index', index);
		    });
		    _.$slidesCache = _.$slides;
		    _.reinit();
		  };
		  Slick.prototype.animateHeight = function () {
		    var _ = this;
		    if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
		      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
		      _.$list.animate({
		        height: targetHeight
		      }, _.options.speed);
		    }
		  };
		  Slick.prototype.animateSlide = function (targetLeft, callback) {
		    var animProps = {},
		      _ = this;
		    _.animateHeight();
		    if (_.options.rtl === true && _.options.vertical === false) {
		      targetLeft = -targetLeft;
		    }
		    if (_.transformsEnabled === false) {
		      if (_.options.vertical === false) {
		        _.$slideTrack.animate({
		          left: targetLeft
		        }, _.options.speed, _.options.easing, callback);
		      } else {
		        _.$slideTrack.animate({
		          top: targetLeft
		        }, _.options.speed, _.options.easing, callback);
		      }
		    } else {
		      if (_.cssTransitions === false) {
		        if (_.options.rtl === true) {
		          _.currentLeft = -_.currentLeft;
		        }
		        $({
		          animStart: _.currentLeft
		        }).animate({
		          animStart: targetLeft
		        }, {
		          duration: _.options.speed,
		          easing: _.options.easing,
		          step: function (now) {
		            now = Math.ceil(now);
		            if (_.options.vertical === false) {
		              animProps[_.animType] = 'translate(' + now + 'px, 0px)';
		              _.$slideTrack.css(animProps);
		            } else {
		              animProps[_.animType] = 'translate(0px,' + now + 'px)';
		              _.$slideTrack.css(animProps);
		            }
		          },
		          complete: function () {
		            if (callback) {
		              callback.call();
		            }
		          }
		        });
		      } else {
		        _.applyTransition();
		        targetLeft = Math.ceil(targetLeft);
		        if (_.options.vertical === false) {
		          animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
		        } else {
		          animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
		        }
		        _.$slideTrack.css(animProps);
		        if (callback) {
		          setTimeout(function () {
		            _.disableTransition();
		            callback.call();
		          }, _.options.speed);
		        }
		      }
		    }
		  };
		  Slick.prototype.getNavTarget = function () {
		    var _ = this,
		      asNavFor = _.options.asNavFor;
		    if (asNavFor && asNavFor !== null) {
		      asNavFor = $(asNavFor).not(_.$slider);
		    }
		    return asNavFor;
		  };
		  Slick.prototype.asNavFor = function (index) {
		    var _ = this,
		      asNavFor = _.getNavTarget();
		    if (asNavFor !== null && typeof asNavFor === 'object') {
		      asNavFor.each(function () {
		        var target = $(this).slick('getSlick');
		        if (!target.unslicked) {
		          target.slideHandler(index, true);
		        }
		      });
		    }
		  };
		  Slick.prototype.applyTransition = function (slide) {
		    var _ = this,
		      transition = {};
		    if (_.options.fade === false) {
		      transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
		    } else {
		      transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
		    }
		    if (_.options.fade === false) {
		      _.$slideTrack.css(transition);
		    } else {
		      _.$slides.eq(slide).css(transition);
		    }
		  };
		  Slick.prototype.autoPlay = function () {
		    var _ = this;
		    _.autoPlayClear();
		    if (_.slideCount > _.options.slidesToShow) {
		      _.autoPlayTimer = setInterval(_.autoPlayIterator, _.options.autoplaySpeed);
		    }
		  };
		  Slick.prototype.autoPlayClear = function () {
		    var _ = this;
		    if (_.autoPlayTimer) {
		      clearInterval(_.autoPlayTimer);
		    }
		  };
		  Slick.prototype.autoPlayIterator = function () {
		    var _ = this,
		      slideTo = _.currentSlide + _.options.slidesToScroll;
		    if (!_.paused && !_.interrupted && !_.focussed) {
		      if (_.options.infinite === false) {
		        if (_.direction === 1 && _.currentSlide + 1 === _.slideCount - 1) {
		          _.direction = 0;
		        } else if (_.direction === 0) {
		          slideTo = _.currentSlide - _.options.slidesToScroll;
		          if (_.currentSlide - 1 === 0) {
		            _.direction = 1;
		          }
		        }
		      }
		      _.slideHandler(slideTo);
		    }
		  };
		  Slick.prototype.buildArrows = function () {
		    var _ = this;
		    if (_.options.arrows === true) {
		      _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
		      _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');
		      if (_.slideCount > _.options.slidesToShow) {
		        _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
		        _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
		        if (_.htmlExpr.test(_.options.prevArrow)) {
		          _.$prevArrow.prependTo(_.options.appendArrows);
		        }
		        if (_.htmlExpr.test(_.options.nextArrow)) {
		          _.$nextArrow.appendTo(_.options.appendArrows);
		        }
		        if (_.options.infinite !== true) {
		          _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
		        }
		      } else {
		        _.$prevArrow.add(_.$nextArrow).addClass('slick-hidden').attr({
		          'aria-disabled': 'true',
		          'tabindex': '-1'
		        });
		      }
		    }
		  };
		  Slick.prototype.buildDots = function () {
		    var _ = this,
		      i,
		      dot;
		    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
		      _.$slider.addClass('slick-dotted');
		      dot = $('<ul />').addClass(_.options.dotsClass);
		      for (i = 0; i <= _.getDotCount(); i += 1) {
		        dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
		      }
		      _.$dots = dot.appendTo(_.options.appendDots);
		      _.$dots.find('li').first().addClass('slick-active');
		    }
		  };
		  Slick.prototype.buildOut = function () {
		    var _ = this;
		    _.$slides = _.$slider.children(_.options.slide + ':not(.slick-cloned)').addClass('slick-slide');
		    _.slideCount = _.$slides.length;
		    _.$slides.each(function (index, element) {
		      $(element).attr('data-slick-index', index).data('originalStyling', $(element).attr('style') || '');
		    });
		    _.$slider.addClass('slick-slider');
		    _.$slideTrack = _.slideCount === 0 ? $('<div class="slick-track"/>').appendTo(_.$slider) : _.$slides.wrapAll('<div class="slick-track"/>').parent();
		    _.$list = _.$slideTrack.wrap('<div class="slick-list"/>').parent();
		    _.$slideTrack.css('opacity', 0);
		    if (_.options.centerMode === true || _.options.swipeToSlide === true) {
		      _.options.slidesToScroll = 1;
		    }
		    $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');
		    _.setupInfinite();
		    _.buildArrows();
		    _.buildDots();
		    _.updateDots();
		    _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);
		    if (_.options.draggable === true) {
		      _.$list.addClass('draggable');
		    }
		  };
		  Slick.prototype.buildRows = function () {
		    var _ = this,
		      a,
		      b,
		      c,
		      newSlides,
		      numOfSlides,
		      originalSlides,
		      slidesPerSection;
		    newSlides = document.createDocumentFragment();
		    originalSlides = _.$slider.children();
		    if (_.options.rows > 0) {
		      slidesPerSection = _.options.slidesPerRow * _.options.rows;
		      numOfSlides = Math.ceil(originalSlides.length / slidesPerSection);
		      for (a = 0; a < numOfSlides; a++) {
		        var slide = document.createElement('div');
		        for (b = 0; b < _.options.rows; b++) {
		          var row = document.createElement('div');
		          for (c = 0; c < _.options.slidesPerRow; c++) {
		            var target = a * slidesPerSection + (b * _.options.slidesPerRow + c);
		            if (originalSlides.get(target)) {
		              row.appendChild(originalSlides.get(target));
		            }
		          }
		          slide.appendChild(row);
		        }
		        newSlides.appendChild(slide);
		      }
		      _.$slider.empty().append(newSlides);
		      _.$slider.children().children().children().css({
		        'width': 100 / _.options.slidesPerRow + '%',
		        'display': 'inline-block'
		      });
		    }
		  };
		  Slick.prototype.checkResponsive = function (initial, forceUpdate) {
		    var _ = this,
		      breakpoint,
		      targetBreakpoint,
		      respondToWidth,
		      triggerBreakpoint = false;
		    var sliderWidth = _.$slider.width();
		    var windowWidth = window.innerWidth || $(window).width();
		    if (_.respondTo === 'window') {
		      respondToWidth = windowWidth;
		    } else if (_.respondTo === 'slider') {
		      respondToWidth = sliderWidth;
		    } else if (_.respondTo === 'min') {
		      respondToWidth = Math.min(windowWidth, sliderWidth);
		    }
		    if (_.options.responsive && _.options.responsive.length && _.options.responsive !== null) {
		      targetBreakpoint = null;
		      for (breakpoint in _.breakpoints) {
		        if (_.breakpoints.hasOwnProperty(breakpoint)) {
		          if (_.originalSettings.mobileFirst === false) {
		            if (respondToWidth < _.breakpoints[breakpoint]) {
		              targetBreakpoint = _.breakpoints[breakpoint];
		            }
		          } else {
		            if (respondToWidth > _.breakpoints[breakpoint]) {
		              targetBreakpoint = _.breakpoints[breakpoint];
		            }
		          }
		        }
		      }
		      if (targetBreakpoint !== null) {
		        if (_.activeBreakpoint !== null) {
		          if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
		            _.activeBreakpoint = targetBreakpoint;
		            if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
		              _.unslick(targetBreakpoint);
		            } else {
		              _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);
		              if (initial === true) {
		                _.currentSlide = _.options.initialSlide;
		              }
		              _.refresh(initial);
		            }
		            triggerBreakpoint = targetBreakpoint;
		          }
		        } else {
		          _.activeBreakpoint = targetBreakpoint;
		          if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
		            _.unslick(targetBreakpoint);
		          } else {
		            _.options = $.extend({}, _.originalSettings, _.breakpointSettings[targetBreakpoint]);
		            if (initial === true) {
		              _.currentSlide = _.options.initialSlide;
		            }
		            _.refresh(initial);
		          }
		          triggerBreakpoint = targetBreakpoint;
		        }
		      } else {
		        if (_.activeBreakpoint !== null) {
		          _.activeBreakpoint = null;
		          _.options = _.originalSettings;
		          if (initial === true) {
		            _.currentSlide = _.options.initialSlide;
		          }
		          _.refresh(initial);
		          triggerBreakpoint = targetBreakpoint;
		        }
		      }

		      // only trigger breakpoints during an actual break. not on initialize.
		      if (!initial && triggerBreakpoint !== false) {
		        _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
		      }
		    }
		  };
		  Slick.prototype.changeSlide = function (event, dontAnimate) {
		    var _ = this,
		      $target = $(event.currentTarget),
		      indexOffset,
		      slideOffset,
		      unevenOffset;

		    // If target is a link, prevent default action.
		    if ($target.is('a')) {
		      event.preventDefault();
		    }

		    // If target is not the <li> element (ie: a child), find the <li>.
		    if (!$target.is('li')) {
		      $target = $target.closest('li');
		    }
		    unevenOffset = _.slideCount % _.options.slidesToScroll !== 0;
		    indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;
		    switch (event.data.message) {
		      case 'previous':
		        slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
		        if (_.slideCount > _.options.slidesToShow) {
		          _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
		        }
		        break;
		      case 'next':
		        slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
		        if (_.slideCount > _.options.slidesToShow) {
		          _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
		        }
		        break;
		      case 'index':
		        var index = event.data.index === 0 ? 0 : event.data.index || $target.index() * _.options.slidesToScroll;
		        _.slideHandler(_.checkNavigable(index), false, dontAnimate);
		        $target.children().trigger('focus');
		        break;
		      default:
		        return;
		    }
		  };
		  Slick.prototype.checkNavigable = function (index) {
		    var _ = this,
		      navigables,
		      prevNavigable;
		    navigables = _.getNavigableIndexes();
		    prevNavigable = 0;
		    if (index > navigables[navigables.length - 1]) {
		      index = navigables[navigables.length - 1];
		    } else {
		      for (var n in navigables) {
		        if (index < navigables[n]) {
		          index = prevNavigable;
		          break;
		        }
		        prevNavigable = navigables[n];
		      }
		    }
		    return index;
		  };
		  Slick.prototype.cleanUpEvents = function () {
		    var _ = this;
		    if (_.options.dots && _.$dots !== null) {
		      $('li', _.$dots).off('click.slick', _.changeSlide).off('mouseenter.slick', $.proxy(_.interrupt, _, true)).off('mouseleave.slick', $.proxy(_.interrupt, _, false));
		      if (_.options.accessibility === true) {
		        _.$dots.off('keydown.slick', _.keyHandler);
		      }
		    }
		    _.$slider.off('focus.slick blur.slick');
		    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
		      _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
		      _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);
		      if (_.options.accessibility === true) {
		        _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler);
		        _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler);
		      }
		    }
		    _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
		    _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
		    _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
		    _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);
		    _.$list.off('click.slick', _.clickHandler);
		    $(document).off(_.visibilityChange, _.visibility);
		    _.cleanUpSlideEvents();
		    if (_.options.accessibility === true) {
		      _.$list.off('keydown.slick', _.keyHandler);
		    }
		    if (_.options.focusOnSelect === true) {
		      $(_.$slideTrack).children().off('click.slick', _.selectHandler);
		    }
		    $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);
		    $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);
		    $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);
		    $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);
		  };
		  Slick.prototype.cleanUpSlideEvents = function () {
		    var _ = this;
		    _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
		    _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));
		  };
		  Slick.prototype.cleanUpRows = function () {
		    var _ = this,
		      originalSlides;
		    if (_.options.rows > 0) {
		      originalSlides = _.$slides.children().children();
		      originalSlides.removeAttr('style');
		      _.$slider.empty().append(originalSlides);
		    }
		  };
		  Slick.prototype.clickHandler = function (event) {
		    var _ = this;
		    if (_.shouldClick === false) {
		      event.stopImmediatePropagation();
		      event.stopPropagation();
		      event.preventDefault();
		    }
		  };
		  Slick.prototype.destroy = function (refresh) {
		    var _ = this;
		    _.autoPlayClear();
		    _.touchObject = {};
		    _.cleanUpEvents();
		    $('.slick-cloned', _.$slider).detach();
		    if (_.$dots) {
		      _.$dots.remove();
		    }
		    if (_.$prevArrow && _.$prevArrow.length) {
		      _.$prevArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');
		      if (_.htmlExpr.test(_.options.prevArrow)) {
		        _.$prevArrow.remove();
		      }
		    }
		    if (_.$nextArrow && _.$nextArrow.length) {
		      _.$nextArrow.removeClass('slick-disabled slick-arrow slick-hidden').removeAttr('aria-hidden aria-disabled tabindex').css('display', '');
		      if (_.htmlExpr.test(_.options.nextArrow)) {
		        _.$nextArrow.remove();
		      }
		    }
		    if (_.$slides) {
		      _.$slides.removeClass('slick-slide slick-active slick-center slick-visible slick-current').removeAttr('aria-hidden').removeAttr('data-slick-index').each(function () {
		        $(this).attr('style', $(this).data('originalStyling'));
		      });
		      _.$slideTrack.children(this.options.slide).detach();
		      _.$slideTrack.detach();
		      _.$list.detach();
		      _.$slider.append(_.$slides);
		    }
		    _.cleanUpRows();
		    _.$slider.removeClass('slick-slider');
		    _.$slider.removeClass('slick-initialized');
		    _.$slider.removeClass('slick-dotted');
		    _.unslicked = true;
		    if (!refresh) {
		      _.$slider.trigger('destroy', [_]);
		    }
		  };
		  Slick.prototype.disableTransition = function (slide) {
		    var _ = this,
		      transition = {};
		    transition[_.transitionType] = '';
		    if (_.options.fade === false) {
		      _.$slideTrack.css(transition);
		    } else {
		      _.$slides.eq(slide).css(transition);
		    }
		  };
		  Slick.prototype.fadeSlide = function (slideIndex, callback) {
		    var _ = this;
		    if (_.cssTransitions === false) {
		      _.$slides.eq(slideIndex).css({
		        zIndex: _.options.zIndex
		      });
		      _.$slides.eq(slideIndex).animate({
		        opacity: 1
		      }, _.options.speed, _.options.easing, callback);
		    } else {
		      _.applyTransition(slideIndex);
		      _.$slides.eq(slideIndex).css({
		        opacity: 1,
		        zIndex: _.options.zIndex
		      });
		      if (callback) {
		        setTimeout(function () {
		          _.disableTransition(slideIndex);
		          callback.call();
		        }, _.options.speed);
		      }
		    }
		  };
		  Slick.prototype.fadeSlideOut = function (slideIndex) {
		    var _ = this;
		    if (_.cssTransitions === false) {
		      _.$slides.eq(slideIndex).animate({
		        opacity: 0,
		        zIndex: _.options.zIndex - 2
		      }, _.options.speed, _.options.easing);
		    } else {
		      _.applyTransition(slideIndex);
		      _.$slides.eq(slideIndex).css({
		        opacity: 0,
		        zIndex: _.options.zIndex - 2
		      });
		    }
		  };
		  Slick.prototype.filterSlides = Slick.prototype.slickFilter = function (filter) {
		    var _ = this;
		    if (filter !== null) {
		      _.$slidesCache = _.$slides;
		      _.unload();
		      _.$slideTrack.children(this.options.slide).detach();
		      _.$slidesCache.filter(filter).appendTo(_.$slideTrack);
		      _.reinit();
		    }
		  };
		  Slick.prototype.focusHandler = function () {
		    var _ = this;
		    _.$slider.off('focus.slick blur.slick').on('focus.slick blur.slick', '*', function (event) {
		      event.stopImmediatePropagation();
		      var $sf = $(this);
		      setTimeout(function () {
		        if (_.options.pauseOnFocus) {
		          _.focussed = $sf.is(':focus');
		          _.autoPlay();
		        }
		      }, 0);
		    });
		  };
		  Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function () {
		    var _ = this;
		    return _.currentSlide;
		  };
		  Slick.prototype.getDotCount = function () {
		    var _ = this;
		    var breakPoint = 0;
		    var counter = 0;
		    var pagerQty = 0;
		    if (_.options.infinite === true) {
		      if (_.slideCount <= _.options.slidesToShow) {
		        ++pagerQty;
		      } else {
		        while (breakPoint < _.slideCount) {
		          ++pagerQty;
		          breakPoint = counter + _.options.slidesToScroll;
		          counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
		        }
		      }
		    } else if (_.options.centerMode === true) {
		      pagerQty = _.slideCount;
		    } else if (!_.options.asNavFor) {
		      pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
		    } else {
		      while (breakPoint < _.slideCount) {
		        ++pagerQty;
		        breakPoint = counter + _.options.slidesToScroll;
		        counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
		      }
		    }
		    return pagerQty - 1;
		  };
		  Slick.prototype.getLeft = function (slideIndex) {
		    var _ = this,
		      targetLeft,
		      verticalHeight,
		      verticalOffset = 0,
		      targetSlide,
		      coef;
		    _.slideOffset = 0;
		    verticalHeight = _.$slides.first().outerHeight(true);
		    if (_.options.infinite === true) {
		      if (_.slideCount > _.options.slidesToShow) {
		        _.slideOffset = _.slideWidth * _.options.slidesToShow * -1;
		        coef = -1;
		        if (_.options.vertical === true && _.options.centerMode === true) {
		          if (_.options.slidesToShow === 2) {
		            coef = -1.5;
		          } else if (_.options.slidesToShow === 1) {
		            coef = -2;
		          }
		        }
		        verticalOffset = verticalHeight * _.options.slidesToShow * coef;
		      }
		      if (_.slideCount % _.options.slidesToScroll !== 0) {
		        if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
		          if (slideIndex > _.slideCount) {
		            _.slideOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth * -1;
		            verticalOffset = (_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight * -1;
		          } else {
		            _.slideOffset = _.slideCount % _.options.slidesToScroll * _.slideWidth * -1;
		            verticalOffset = _.slideCount % _.options.slidesToScroll * verticalHeight * -1;
		          }
		        }
		      }
		    } else {
		      if (slideIndex + _.options.slidesToShow > _.slideCount) {
		        _.slideOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * _.slideWidth;
		        verticalOffset = (slideIndex + _.options.slidesToShow - _.slideCount) * verticalHeight;
		      }
		    }
		    if (_.slideCount <= _.options.slidesToShow) {
		      _.slideOffset = 0;
		      verticalOffset = 0;
		    }
		    if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
		      _.slideOffset = _.slideWidth * Math.floor(_.options.slidesToShow) / 2 - _.slideWidth * _.slideCount / 2;
		    } else if (_.options.centerMode === true && _.options.infinite === true) {
		      _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
		    } else if (_.options.centerMode === true) {
		      _.slideOffset = 0;
		      _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
		    }
		    if (_.options.vertical === false) {
		      targetLeft = slideIndex * _.slideWidth * -1 + _.slideOffset;
		    } else {
		      targetLeft = slideIndex * verticalHeight * -1 + verticalOffset;
		    }
		    if (_.options.variableWidth === true) {
		      if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
		        targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
		      } else {
		        targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
		      }
		      if (_.options.rtl === true) {
		        if (targetSlide[0]) {
		          targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
		        } else {
		          targetLeft = 0;
		        }
		      } else {
		        targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
		      }
		      if (_.options.centerMode === true) {
		        if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
		          targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
		        } else {
		          targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
		        }
		        if (_.options.rtl === true) {
		          if (targetSlide[0]) {
		            targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
		          } else {
		            targetLeft = 0;
		          }
		        } else {
		          targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
		        }
		        targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
		      }
		    }
		    return targetLeft;
		  };
		  Slick.prototype.getOption = Slick.prototype.slickGetOption = function (option) {
		    var _ = this;
		    return _.options[option];
		  };
		  Slick.prototype.getNavigableIndexes = function () {
		    var _ = this,
		      breakPoint = 0,
		      counter = 0,
		      indexes = [],
		      max;
		    if (_.options.infinite === false) {
		      max = _.slideCount;
		    } else {
		      breakPoint = _.options.slidesToScroll * -1;
		      counter = _.options.slidesToScroll * -1;
		      max = _.slideCount * 2;
		    }
		    while (breakPoint < max) {
		      indexes.push(breakPoint);
		      breakPoint = counter + _.options.slidesToScroll;
		      counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
		    }
		    return indexes;
		  };
		  Slick.prototype.getSlick = function () {
		    return this;
		  };
		  Slick.prototype.getSlideCount = function () {
		    var _ = this,
		      slidesTraversed,
		      swipedSlide,
		      centerOffset;
		    centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;
		    if (_.options.swipeToSlide === true) {
		      _.$slideTrack.find('.slick-slide').each(function (index, slide) {
		        if (slide.offsetLeft - centerOffset + $(slide).outerWidth() / 2 > _.swipeLeft * -1) {
		          swipedSlide = slide;
		          return false;
		        }
		      });
		      slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;
		      return slidesTraversed;
		    } else {
		      return _.options.slidesToScroll;
		    }
		  };
		  Slick.prototype.goTo = Slick.prototype.slickGoTo = function (slide, dontAnimate) {
		    var _ = this;
		    _.changeSlide({
		      data: {
		        message: 'index',
		        index: parseInt(slide)
		      }
		    }, dontAnimate);
		  };
		  Slick.prototype.init = function (creation) {
		    var _ = this;
		    if (!$(_.$slider).hasClass('slick-initialized')) {
		      $(_.$slider).addClass('slick-initialized');
		      _.buildRows();
		      _.buildOut();
		      _.setProps();
		      _.startLoad();
		      _.loadSlider();
		      _.initializeEvents();
		      _.updateArrows();
		      _.updateDots();
		      _.checkResponsive(true);
		      _.focusHandler();
		    }
		    if (creation) {
		      _.$slider.trigger('init', [_]);
		    }
		    if (_.options.accessibility === true) {
		      _.initADA();
		    }
		    if (_.options.autoplay) {
		      _.paused = false;
		      _.autoPlay();
		    }
		  };
		  Slick.prototype.initADA = function () {
		    var _ = this,
		      numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
		      tabControlIndexes = _.getNavigableIndexes().filter(function (val) {
		        return val >= 0 && val < _.slideCount;
		      });
		    _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
		      'aria-hidden': 'true',
		      'tabindex': '-1'
		    }).find('a, input, button, select').attr({
		      'tabindex': '-1'
		    });
		    if (_.$dots !== null) {
		      _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function (i) {
		        var slideControlIndex = tabControlIndexes.indexOf(i);
		        $(this).attr({
		          'role': 'tabpanel',
		          'id': 'slick-slide' + _.instanceUid + i,
		          'tabindex': -1
		        });
		        if (slideControlIndex !== -1) {
		          var ariaButtonControl = 'slick-slide-control' + _.instanceUid + slideControlIndex;
		          if ($('#' + ariaButtonControl).length) {
		            $(this).attr({
		              'aria-describedby': ariaButtonControl
		            });
		          }
		        }
		      });
		      _.$dots.attr('role', 'tablist').find('li').each(function (i) {
		        var mappedSlideIndex = tabControlIndexes[i];
		        $(this).attr({
		          'role': 'presentation'
		        });
		        $(this).find('button').first().attr({
		          'role': 'tab',
		          'id': 'slick-slide-control' + _.instanceUid + i,
		          'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,
		          'aria-label': i + 1 + ' of ' + numDotGroups,
		          'aria-selected': null,
		          'tabindex': '-1'
		        });
		      }).eq(_.currentSlide).find('button').attr({
		        'aria-selected': 'true',
		        'tabindex': '0'
		      }).end();
		    }
		    for (var i = _.currentSlide, max = i + _.options.slidesToShow; i < max; i++) {
		      if (_.options.focusOnChange) {
		        _.$slides.eq(i).attr({
		          'tabindex': '0'
		        });
		      } else {
		        _.$slides.eq(i).removeAttr('tabindex');
		      }
		    }
		    _.activateADA();
		  };
		  Slick.prototype.initArrowEvents = function () {
		    var _ = this;
		    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
		      _.$prevArrow.off('click.slick').on('click.slick', {
		        message: 'previous'
		      }, _.changeSlide);
		      _.$nextArrow.off('click.slick').on('click.slick', {
		        message: 'next'
		      }, _.changeSlide);
		      if (_.options.accessibility === true) {
		        _.$prevArrow.on('keydown.slick', _.keyHandler);
		        _.$nextArrow.on('keydown.slick', _.keyHandler);
		      }
		    }
		  };
		  Slick.prototype.initDotEvents = function () {
		    var _ = this;
		    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
		      $('li', _.$dots).on('click.slick', {
		        message: 'index'
		      }, _.changeSlide);
		      if (_.options.accessibility === true) {
		        _.$dots.on('keydown.slick', _.keyHandler);
		      }
		    }
		    if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {
		      $('li', _.$dots).on('mouseenter.slick', $.proxy(_.interrupt, _, true)).on('mouseleave.slick', $.proxy(_.interrupt, _, false));
		    }
		  };
		  Slick.prototype.initSlideEvents = function () {
		    var _ = this;
		    if (_.options.pauseOnHover) {
		      _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
		      _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));
		    }
		  };
		  Slick.prototype.initializeEvents = function () {
		    var _ = this;
		    _.initArrowEvents();
		    _.initDotEvents();
		    _.initSlideEvents();
		    _.$list.on('touchstart.slick mousedown.slick', {
		      action: 'start'
		    }, _.swipeHandler);
		    _.$list.on('touchmove.slick mousemove.slick', {
		      action: 'move'
		    }, _.swipeHandler);
		    _.$list.on('touchend.slick mouseup.slick', {
		      action: 'end'
		    }, _.swipeHandler);
		    _.$list.on('touchcancel.slick mouseleave.slick', {
		      action: 'end'
		    }, _.swipeHandler);
		    _.$list.on('click.slick', _.clickHandler);
		    $(document).on(_.visibilityChange, $.proxy(_.visibility, _));
		    if (_.options.accessibility === true) {
		      _.$list.on('keydown.slick', _.keyHandler);
		    }
		    if (_.options.focusOnSelect === true) {
		      $(_.$slideTrack).children().on('click.slick', _.selectHandler);
		    }
		    $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));
		    $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));
		    $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);
		    $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
		    $(_.setPosition);
		  };
		  Slick.prototype.initUI = function () {
		    var _ = this;
		    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
		      _.$prevArrow.show();
		      _.$nextArrow.show();
		    }
		    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
		      _.$dots.show();
		    }
		  };
		  Slick.prototype.keyHandler = function (event) {
		    var _ = this;
		    //Dont slide if the cursor is inside the form fields and arrow keys are pressed
		    if (!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
		      if (event.keyCode === 37 && _.options.accessibility === true) {
		        _.changeSlide({
		          data: {
		            message: _.options.rtl === true ? 'next' : 'previous'
		          }
		        });
		      } else if (event.keyCode === 39 && _.options.accessibility === true) {
		        _.changeSlide({
		          data: {
		            message: _.options.rtl === true ? 'previous' : 'next'
		          }
		        });
		      }
		    }
		  };
		  Slick.prototype.lazyLoad = function () {
		    var _ = this,
		      loadRange,
		      cloneRange,
		      rangeStart,
		      rangeEnd;
		    function loadImages(imagesScope) {
		      $('img[data-lazy]', imagesScope).each(function () {
		        var image = $(this),
		          imageSource = $(this).attr('data-lazy'),
		          imageSrcSet = $(this).attr('data-srcset'),
		          imageSizes = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
		          imageToLoad = document.createElement('img');
		        imageToLoad.onload = function () {
		          image.animate({
		            opacity: 0
		          }, 100, function () {
		            if (imageSrcSet) {
		              image.attr('srcset', imageSrcSet);
		              if (imageSizes) {
		                image.attr('sizes', imageSizes);
		              }
		            }
		            image.attr('src', imageSource).animate({
		              opacity: 1
		            }, 200, function () {
		              image.removeAttr('data-lazy data-srcset data-sizes').removeClass('slick-loading');
		            });
		            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
		          });
		        };
		        imageToLoad.onerror = function () {
		          image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');
		          _.$slider.trigger('lazyLoadError', [_, image, imageSource]);
		        };
		        imageToLoad.src = imageSource;
		      });
		    }
		    if (_.options.centerMode === true) {
		      if (_.options.infinite === true) {
		        rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
		        rangeEnd = rangeStart + _.options.slidesToShow + 2;
		      } else {
		        rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
		        rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
		      }
		    } else {
		      rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
		      rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
		      if (_.options.fade === true) {
		        if (rangeStart > 0) rangeStart--;
		        if (rangeEnd <= _.slideCount) rangeEnd++;
		      }
		    }
		    loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);
		    if (_.options.lazyLoad === 'anticipated') {
		      var prevSlide = rangeStart - 1,
		        nextSlide = rangeEnd,
		        $slides = _.$slider.find('.slick-slide');
		      for (var i = 0; i < _.options.slidesToScroll; i++) {
		        if (prevSlide < 0) prevSlide = _.slideCount - 1;
		        loadRange = loadRange.add($slides.eq(prevSlide));
		        loadRange = loadRange.add($slides.eq(nextSlide));
		        prevSlide--;
		        nextSlide++;
		      }
		    }
		    loadImages(loadRange);
		    if (_.slideCount <= _.options.slidesToShow) {
		      cloneRange = _.$slider.find('.slick-slide');
		      loadImages(cloneRange);
		    } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
		      cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
		      loadImages(cloneRange);
		    } else if (_.currentSlide === 0) {
		      cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
		      loadImages(cloneRange);
		    }
		  };
		  Slick.prototype.loadSlider = function () {
		    var _ = this;
		    _.setPosition();
		    _.$slideTrack.css({
		      opacity: 1
		    });
		    _.$slider.removeClass('slick-loading');
		    _.initUI();
		    if (_.options.lazyLoad === 'progressive') {
		      _.progressiveLazyLoad();
		    }
		  };
		  Slick.prototype.next = Slick.prototype.slickNext = function () {
		    var _ = this;
		    _.changeSlide({
		      data: {
		        message: 'next'
		      }
		    });
		  };
		  Slick.prototype.orientationChange = function () {
		    var _ = this;
		    _.checkResponsive();
		    _.setPosition();
		  };
		  Slick.prototype.pause = Slick.prototype.slickPause = function () {
		    var _ = this;
		    _.autoPlayClear();
		    _.paused = true;
		  };
		  Slick.prototype.play = Slick.prototype.slickPlay = function () {
		    var _ = this;
		    _.autoPlay();
		    _.options.autoplay = true;
		    _.paused = false;
		    _.focussed = false;
		    _.interrupted = false;
		  };
		  Slick.prototype.postSlide = function (index) {
		    var _ = this;
		    if (!_.unslicked) {
		      _.$slider.trigger('afterChange', [_, index]);
		      _.animating = false;
		      if (_.slideCount > _.options.slidesToShow) {
		        _.setPosition();
		      }
		      _.swipeLeft = null;
		      if (_.options.autoplay) {
		        _.autoPlay();
		      }
		      if (_.options.accessibility === true) {
		        _.initADA();
		        if (_.options.focusOnChange) {
		          var $currentSlide = $(_.$slides.get(_.currentSlide));
		          $currentSlide.attr('tabindex', 0).focus();
		        }
		      }
		    }
		  };
		  Slick.prototype.prev = Slick.prototype.slickPrev = function () {
		    var _ = this;
		    _.changeSlide({
		      data: {
		        message: 'previous'
		      }
		    });
		  };
		  Slick.prototype.preventDefault = function (event) {
		    event.preventDefault();
		  };
		  Slick.prototype.progressiveLazyLoad = function (tryCount) {
		    tryCount = tryCount || 1;
		    var _ = this,
		      $imgsToLoad = $('img[data-lazy]', _.$slider),
		      image,
		      imageSource,
		      imageSrcSet,
		      imageSizes,
		      imageToLoad;
		    if ($imgsToLoad.length) {
		      image = $imgsToLoad.first();
		      imageSource = image.attr('data-lazy');
		      imageSrcSet = image.attr('data-srcset');
		      imageSizes = image.attr('data-sizes') || _.$slider.attr('data-sizes');
		      imageToLoad = document.createElement('img');
		      imageToLoad.onload = function () {
		        if (imageSrcSet) {
		          image.attr('srcset', imageSrcSet);
		          if (imageSizes) {
		            image.attr('sizes', imageSizes);
		          }
		        }
		        image.attr('src', imageSource).removeAttr('data-lazy data-srcset data-sizes').removeClass('slick-loading');
		        if (_.options.adaptiveHeight === true) {
		          _.setPosition();
		        }
		        _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
		        _.progressiveLazyLoad();
		      };
		      imageToLoad.onerror = function () {
		        if (tryCount < 3) {
		          /**
		           * try to load the image 3 times,
		           * leave a slight delay so we don't get
		           * servers blocking the request.
		           */
		          setTimeout(function () {
		            _.progressiveLazyLoad(tryCount + 1);
		          }, 500);
		        } else {
		          image.removeAttr('data-lazy').removeClass('slick-loading').addClass('slick-lazyload-error');
		          _.$slider.trigger('lazyLoadError', [_, image, imageSource]);
		          _.progressiveLazyLoad();
		        }
		      };
		      imageToLoad.src = imageSource;
		    } else {
		      _.$slider.trigger('allImagesLoaded', [_]);
		    }
		  };
		  Slick.prototype.refresh = function (initializing) {
		    var _ = this,
		      currentSlide,
		      lastVisibleIndex;
		    lastVisibleIndex = _.slideCount - _.options.slidesToShow;

		    // in non-infinite sliders, we don't want to go past the
		    // last visible index.
		    if (!_.options.infinite && _.currentSlide > lastVisibleIndex) {
		      _.currentSlide = lastVisibleIndex;
		    }

		    // if less slides than to show, go to start.
		    if (_.slideCount <= _.options.slidesToShow) {
		      _.currentSlide = 0;
		    }
		    currentSlide = _.currentSlide;
		    _.destroy(true);
		    $.extend(_, _.initials, {
		      currentSlide: currentSlide
		    });
		    _.init();
		    if (!initializing) {
		      _.changeSlide({
		        data: {
		          message: 'index',
		          index: currentSlide
		        }
		      }, false);
		    }
		  };
		  Slick.prototype.registerBreakpoints = function () {
		    var _ = this,
		      breakpoint,
		      currentBreakpoint,
		      l,
		      responsiveSettings = _.options.responsive || null;
		    if ($.type(responsiveSettings) === 'array' && responsiveSettings.length) {
		      _.respondTo = _.options.respondTo || 'window';
		      for (breakpoint in responsiveSettings) {
		        l = _.breakpoints.length - 1;
		        if (responsiveSettings.hasOwnProperty(breakpoint)) {
		          currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

		          // loop through the breakpoints and cut out any existing
		          // ones with the same breakpoint number, we don't want dupes.
		          while (l >= 0) {
		            if (_.breakpoints[l] && _.breakpoints[l] === currentBreakpoint) {
		              _.breakpoints.splice(l, 1);
		            }
		            l--;
		          }
		          _.breakpoints.push(currentBreakpoint);
		          _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;
		        }
		      }
		      _.breakpoints.sort(function (a, b) {
		        return _.options.mobileFirst ? a - b : b - a;
		      });
		    }
		  };
		  Slick.prototype.reinit = function () {
		    var _ = this;
		    _.$slides = _.$slideTrack.children(_.options.slide).addClass('slick-slide');
		    _.slideCount = _.$slides.length;
		    if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
		      _.currentSlide = _.currentSlide - _.options.slidesToScroll;
		    }
		    if (_.slideCount <= _.options.slidesToShow) {
		      _.currentSlide = 0;
		    }
		    _.registerBreakpoints();
		    _.setProps();
		    _.setupInfinite();
		    _.buildArrows();
		    _.updateArrows();
		    _.initArrowEvents();
		    _.buildDots();
		    _.updateDots();
		    _.initDotEvents();
		    _.cleanUpSlideEvents();
		    _.initSlideEvents();
		    _.checkResponsive(false, true);
		    if (_.options.focusOnSelect === true) {
		      $(_.$slideTrack).children().on('click.slick', _.selectHandler);
		    }
		    _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);
		    _.setPosition();
		    _.focusHandler();
		    _.paused = !_.options.autoplay;
		    _.autoPlay();
		    _.$slider.trigger('reInit', [_]);
		  };
		  Slick.prototype.resize = function () {
		    var _ = this;
		    if ($(window).width() !== _.windowWidth) {
		      clearTimeout(_.windowDelay);
		      _.windowDelay = window.setTimeout(function () {
		        _.windowWidth = $(window).width();
		        _.checkResponsive();
		        if (!_.unslicked) {
		          _.setPosition();
		        }
		      }, 50);
		    }
		  };
		  Slick.prototype.removeSlide = Slick.prototype.slickRemove = function (index, removeBefore, removeAll) {
		    var _ = this;
		    if (typeof index === 'boolean') {
		      removeBefore = index;
		      index = removeBefore === true ? 0 : _.slideCount - 1;
		    } else {
		      index = removeBefore === true ? --index : index;
		    }
		    if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
		      return false;
		    }
		    _.unload();
		    if (removeAll === true) {
		      _.$slideTrack.children().remove();
		    } else {
		      _.$slideTrack.children(this.options.slide).eq(index).remove();
		    }
		    _.$slides = _.$slideTrack.children(this.options.slide);
		    _.$slideTrack.children(this.options.slide).detach();
		    _.$slideTrack.append(_.$slides);
		    _.$slidesCache = _.$slides;
		    _.reinit();
		  };
		  Slick.prototype.setCSS = function (position) {
		    var _ = this,
		      positionProps = {},
		      x,
		      y;
		    if (_.options.rtl === true) {
		      position = -position;
		    }
		    x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
		    y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';
		    positionProps[_.positionProp] = position;
		    if (_.transformsEnabled === false) {
		      _.$slideTrack.css(positionProps);
		    } else {
		      positionProps = {};
		      if (_.cssTransitions === false) {
		        positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
		        _.$slideTrack.css(positionProps);
		      } else {
		        positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
		        _.$slideTrack.css(positionProps);
		      }
		    }
		  };
		  Slick.prototype.setDimensions = function () {
		    var _ = this;
		    if (_.options.vertical === false) {
		      if (_.options.centerMode === true) {
		        _.$list.css({
		          padding: '0px ' + _.options.centerPadding
		        });
		      }
		    } else {
		      _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
		      if (_.options.centerMode === true) {
		        _.$list.css({
		          padding: _.options.centerPadding + ' 0px'
		        });
		      }
		    }
		    _.listWidth = _.$list.width();
		    _.listHeight = _.$list.height();
		    if (_.options.vertical === false && _.options.variableWidth === false) {
		      _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
		      _.$slideTrack.width(Math.ceil(_.slideWidth * _.$slideTrack.children('.slick-slide').length));
		    } else if (_.options.variableWidth === true) {
		      _.$slideTrack.width(5000 * _.slideCount);
		    } else {
		      _.slideWidth = Math.ceil(_.listWidth);
		      _.$slideTrack.height(Math.ceil(_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length));
		    }
		    var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
		    if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);
		  };
		  Slick.prototype.setFade = function () {
		    var _ = this,
		      targetLeft;
		    _.$slides.each(function (index, element) {
		      targetLeft = _.slideWidth * index * -1;
		      if (_.options.rtl === true) {
		        $(element).css({
		          position: 'relative',
		          right: targetLeft,
		          top: 0,
		          zIndex: _.options.zIndex - 2,
		          opacity: 0
		        });
		      } else {
		        $(element).css({
		          position: 'relative',
		          left: targetLeft,
		          top: 0,
		          zIndex: _.options.zIndex - 2,
		          opacity: 0
		        });
		      }
		    });
		    _.$slides.eq(_.currentSlide).css({
		      zIndex: _.options.zIndex - 1,
		      opacity: 1
		    });
		  };
		  Slick.prototype.setHeight = function () {
		    var _ = this;
		    if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
		      var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
		      _.$list.css('height', targetHeight);
		    }
		  };
		  Slick.prototype.setOption = Slick.prototype.slickSetOption = function () {
		    /**
		     * accepts arguments in format of:
		     *
		     *  - for changing a single option's value:
		     *     .slick("setOption", option, value, refresh )
		     *
		     *  - for changing a set of responsive options:
		     *     .slick("setOption", 'responsive', [{}, ...], refresh )
		     *
		     *  - for updating multiple values at once (not responsive)
		     *     .slick("setOption", { 'option': value, ... }, refresh )
		     */

		    var _ = this,
		      l,
		      item,
		      option,
		      value,
		      refresh = false,
		      type;
		    if ($.type(arguments[0]) === 'object') {
		      option = arguments[0];
		      refresh = arguments[1];
		      type = 'multiple';
		    } else if ($.type(arguments[0]) === 'string') {
		      option = arguments[0];
		      value = arguments[1];
		      refresh = arguments[2];
		      if (arguments[0] === 'responsive' && $.type(arguments[1]) === 'array') {
		        type = 'responsive';
		      } else if (typeof arguments[1] !== 'undefined') {
		        type = 'single';
		      }
		    }
		    if (type === 'single') {
		      _.options[option] = value;
		    } else if (type === 'multiple') {
		      $.each(option, function (opt, val) {
		        _.options[opt] = val;
		      });
		    } else if (type === 'responsive') {
		      for (item in value) {
		        if ($.type(_.options.responsive) !== 'array') {
		          _.options.responsive = [value[item]];
		        } else {
		          l = _.options.responsive.length - 1;

		          // loop through the responsive object and splice out duplicates.
		          while (l >= 0) {
		            if (_.options.responsive[l].breakpoint === value[item].breakpoint) {
		              _.options.responsive.splice(l, 1);
		            }
		            l--;
		          }
		          _.options.responsive.push(value[item]);
		        }
		      }
		    }
		    if (refresh) {
		      _.unload();
		      _.reinit();
		    }
		  };
		  Slick.prototype.setPosition = function () {
		    var _ = this;
		    _.setDimensions();
		    _.setHeight();
		    if (_.options.fade === false) {
		      _.setCSS(_.getLeft(_.currentSlide));
		    } else {
		      _.setFade();
		    }
		    _.$slider.trigger('setPosition', [_]);
		  };
		  Slick.prototype.setProps = function () {
		    var _ = this,
		      bodyStyle = document.body.style;
		    _.positionProp = _.options.vertical === true ? 'top' : 'left';
		    if (_.positionProp === 'top') {
		      _.$slider.addClass('slick-vertical');
		    } else {
		      _.$slider.removeClass('slick-vertical');
		    }
		    if (bodyStyle.WebkitTransition !== undefined || bodyStyle.MozTransition !== undefined || bodyStyle.msTransition !== undefined) {
		      if (_.options.useCSS === true) {
		        _.cssTransitions = true;
		      }
		    }
		    if (_.options.fade) {
		      if (typeof _.options.zIndex === 'number') {
		        if (_.options.zIndex < 3) {
		          _.options.zIndex = 3;
		        }
		      } else {
		        _.options.zIndex = _.defaults.zIndex;
		      }
		    }
		    if (bodyStyle.OTransform !== undefined) {
		      _.animType = 'OTransform';
		      _.transformType = '-o-transform';
		      _.transitionType = 'OTransition';
		      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
		    }
		    if (bodyStyle.MozTransform !== undefined) {
		      _.animType = 'MozTransform';
		      _.transformType = '-moz-transform';
		      _.transitionType = 'MozTransition';
		      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
		    }
		    if (bodyStyle.webkitTransform !== undefined) {
		      _.animType = 'webkitTransform';
		      _.transformType = '-webkit-transform';
		      _.transitionType = 'webkitTransition';
		      if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
		    }
		    if (bodyStyle.msTransform !== undefined) {
		      _.animType = 'msTransform';
		      _.transformType = '-ms-transform';
		      _.transitionType = 'msTransition';
		      if (bodyStyle.msTransform === undefined) _.animType = false;
		    }
		    if (bodyStyle.transform !== undefined && _.animType !== false) {
		      _.animType = 'transform';
		      _.transformType = 'transform';
		      _.transitionType = 'transition';
		    }
		    _.transformsEnabled = _.options.useTransform && _.animType !== null && _.animType !== false;
		  };
		  Slick.prototype.setSlideClasses = function (index) {
		    var _ = this,
		      centerOffset,
		      allSlides,
		      indexOffset,
		      remainder;
		    allSlides = _.$slider.find('.slick-slide').removeClass('slick-active slick-center slick-current').attr('aria-hidden', 'true');
		    _.$slides.eq(index).addClass('slick-current');
		    if (_.options.centerMode === true) {
		      var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;
		      centerOffset = Math.floor(_.options.slidesToShow / 2);
		      if (_.options.infinite === true) {
		        if (index >= centerOffset && index <= _.slideCount - 1 - centerOffset) {
		          _.$slides.slice(index - centerOffset + evenCoef, index + centerOffset + 1).addClass('slick-active').attr('aria-hidden', 'false');
		        } else {
		          indexOffset = _.options.slidesToShow + index;
		          allSlides.slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2).addClass('slick-active').attr('aria-hidden', 'false');
		        }
		        if (index === 0) {
		          allSlides.eq(allSlides.length - 1 - _.options.slidesToShow).addClass('slick-center');
		        } else if (index === _.slideCount - 1) {
		          allSlides.eq(_.options.slidesToShow).addClass('slick-center');
		        }
		      }
		      _.$slides.eq(index).addClass('slick-center');
		    } else {
		      if (index >= 0 && index <= _.slideCount - _.options.slidesToShow) {
		        _.$slides.slice(index, index + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
		      } else if (allSlides.length <= _.options.slidesToShow) {
		        allSlides.addClass('slick-active').attr('aria-hidden', 'false');
		      } else {
		        remainder = _.slideCount % _.options.slidesToShow;
		        indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;
		        if (_.options.slidesToShow == _.options.slidesToScroll && _.slideCount - index < _.options.slidesToShow) {
		          allSlides.slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder).addClass('slick-active').attr('aria-hidden', 'false');
		        } else {
		          allSlides.slice(indexOffset, indexOffset + _.options.slidesToShow).addClass('slick-active').attr('aria-hidden', 'false');
		        }
		      }
		    }
		    if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
		      _.lazyLoad();
		    }
		  };
		  Slick.prototype.setupInfinite = function () {
		    var _ = this,
		      i,
		      slideIndex,
		      infiniteCount;
		    if (_.options.fade === true) {
		      _.options.centerMode = false;
		    }
		    if (_.options.infinite === true && _.options.fade === false) {
		      slideIndex = null;
		      if (_.slideCount > _.options.slidesToShow) {
		        if (_.options.centerMode === true) {
		          infiniteCount = _.options.slidesToShow + 1;
		        } else {
		          infiniteCount = _.options.slidesToShow;
		        }
		        for (i = _.slideCount; i > _.slideCount - infiniteCount; i -= 1) {
		          slideIndex = i - 1;
		          $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex - _.slideCount).prependTo(_.$slideTrack).addClass('slick-cloned');
		        }
		        for (i = 0; i < infiniteCount + _.slideCount; i += 1) {
		          slideIndex = i;
		          $(_.$slides[slideIndex]).clone(true).attr('id', '').attr('data-slick-index', slideIndex + _.slideCount).appendTo(_.$slideTrack).addClass('slick-cloned');
		        }
		        _.$slideTrack.find('.slick-cloned').find('[id]').each(function () {
		          $(this).attr('id', '');
		        });
		      }
		    }
		  };
		  Slick.prototype.interrupt = function (toggle) {
		    var _ = this;
		    if (!toggle) {
		      _.autoPlay();
		    }
		    _.interrupted = toggle;
		  };
		  Slick.prototype.selectHandler = function (event) {
		    var _ = this;
		    var targetElement = $(event.target).is('.slick-slide') ? $(event.target) : $(event.target).parents('.slick-slide');
		    var index = parseInt(targetElement.attr('data-slick-index'));
		    if (!index) index = 0;
		    if (_.slideCount <= _.options.slidesToShow) {
		      _.slideHandler(index, false, true);
		      return;
		    }
		    _.slideHandler(index);
		  };
		  Slick.prototype.slideHandler = function (index, sync, dontAnimate) {
		    var targetSlide,
		      animSlide,
		      oldSlide,
		      slideLeft,
		      targetLeft = null,
		      _ = this,
		      navTarget;
		    sync = sync || false;
		    if (_.animating === true && _.options.waitForAnimate === true) {
		      return;
		    }
		    if (_.options.fade === true && _.currentSlide === index) {
		      return;
		    }
		    if (sync === false) {
		      _.asNavFor(index);
		    }
		    targetSlide = index;
		    targetLeft = _.getLeft(targetSlide);
		    slideLeft = _.getLeft(_.currentSlide);
		    _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;
		    if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
		      if (_.options.fade === false) {
		        targetSlide = _.currentSlide;
		        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
		          _.animateSlide(slideLeft, function () {
		            _.postSlide(targetSlide);
		          });
		        } else {
		          _.postSlide(targetSlide);
		        }
		      }
		      return;
		    } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > _.slideCount - _.options.slidesToScroll)) {
		      if (_.options.fade === false) {
		        targetSlide = _.currentSlide;
		        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
		          _.animateSlide(slideLeft, function () {
		            _.postSlide(targetSlide);
		          });
		        } else {
		          _.postSlide(targetSlide);
		        }
		      }
		      return;
		    }
		    if (_.options.autoplay) {
		      clearInterval(_.autoPlayTimer);
		    }
		    if (targetSlide < 0) {
		      if (_.slideCount % _.options.slidesToScroll !== 0) {
		        animSlide = _.slideCount - _.slideCount % _.options.slidesToScroll;
		      } else {
		        animSlide = _.slideCount + targetSlide;
		      }
		    } else if (targetSlide >= _.slideCount) {
		      if (_.slideCount % _.options.slidesToScroll !== 0) {
		        animSlide = 0;
		      } else {
		        animSlide = targetSlide - _.slideCount;
		      }
		    } else {
		      animSlide = targetSlide;
		    }
		    _.animating = true;
		    _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);
		    oldSlide = _.currentSlide;
		    _.currentSlide = animSlide;
		    _.setSlideClasses(_.currentSlide);
		    if (_.options.asNavFor) {
		      navTarget = _.getNavTarget();
		      navTarget = navTarget.slick('getSlick');
		      if (navTarget.slideCount <= navTarget.options.slidesToShow) {
		        navTarget.setSlideClasses(_.currentSlide);
		      }
		    }
		    _.updateDots();
		    _.updateArrows();
		    if (_.options.fade === true) {
		      if (dontAnimate !== true) {
		        _.fadeSlideOut(oldSlide);
		        _.fadeSlide(animSlide, function () {
		          _.postSlide(animSlide);
		        });
		      } else {
		        _.postSlide(animSlide);
		      }
		      _.animateHeight();
		      return;
		    }
		    if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
		      _.animateSlide(targetLeft, function () {
		        _.postSlide(animSlide);
		      });
		    } else {
		      _.postSlide(animSlide);
		    }
		  };
		  Slick.prototype.startLoad = function () {
		    var _ = this;
		    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
		      _.$prevArrow.hide();
		      _.$nextArrow.hide();
		    }
		    if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
		      _.$dots.hide();
		    }
		    _.$slider.addClass('slick-loading');
		  };
		  Slick.prototype.swipeDirection = function () {
		    var xDist,
		      yDist,
		      r,
		      swipeAngle,
		      _ = this;
		    xDist = _.touchObject.startX - _.touchObject.curX;
		    yDist = _.touchObject.startY - _.touchObject.curY;
		    r = Math.atan2(yDist, xDist);
		    swipeAngle = Math.round(r * 180 / Math.PI);
		    if (swipeAngle < 0) {
		      swipeAngle = 360 - Math.abs(swipeAngle);
		    }
		    if (swipeAngle <= 45 && swipeAngle >= 0) {
		      return _.options.rtl === false ? 'left' : 'right';
		    }
		    if (swipeAngle <= 360 && swipeAngle >= 315) {
		      return _.options.rtl === false ? 'left' : 'right';
		    }
		    if (swipeAngle >= 135 && swipeAngle <= 225) {
		      return _.options.rtl === false ? 'right' : 'left';
		    }
		    if (_.options.verticalSwiping === true) {
		      if (swipeAngle >= 35 && swipeAngle <= 135) {
		        return 'down';
		      } else {
		        return 'up';
		      }
		    }
		    return 'vertical';
		  };
		  Slick.prototype.swipeEnd = function (event) {
		    var _ = this,
		      slideCount,
		      direction;
		    _.dragging = false;
		    _.swiping = false;
		    if (_.scrolling) {
		      _.scrolling = false;
		      return false;
		    }
		    _.interrupted = false;
		    _.shouldClick = _.touchObject.swipeLength > 10 ? false : true;
		    if (_.touchObject.curX === undefined) {
		      return false;
		    }
		    if (_.touchObject.edgeHit === true) {
		      _.$slider.trigger('edge', [_, _.swipeDirection()]);
		    }
		    if (_.touchObject.swipeLength >= _.touchObject.minSwipe) {
		      direction = _.swipeDirection();
		      switch (direction) {
		        case 'left':
		        case 'down':
		          slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide + _.getSlideCount()) : _.currentSlide + _.getSlideCount();
		          _.currentDirection = 0;
		          break;
		        case 'right':
		        case 'up':
		          slideCount = _.options.swipeToSlide ? _.checkNavigable(_.currentSlide - _.getSlideCount()) : _.currentSlide - _.getSlideCount();
		          _.currentDirection = 1;
		          break;
		      }
		      if (direction != 'vertical') {
		        _.slideHandler(slideCount);
		        _.touchObject = {};
		        _.$slider.trigger('swipe', [_, direction]);
		      }
		    } else {
		      if (_.touchObject.startX !== _.touchObject.curX) {
		        _.slideHandler(_.currentSlide);
		        _.touchObject = {};
		      }
		    }
		  };
		  Slick.prototype.swipeHandler = function (event) {
		    var _ = this;
		    if (_.options.swipe === false || 'ontouchend' in document && _.options.swipe === false) {
		      return;
		    } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
		      return;
		    }
		    _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ? event.originalEvent.touches.length : 1;
		    _.touchObject.minSwipe = _.listWidth / _.options.touchThreshold;
		    if (_.options.verticalSwiping === true) {
		      _.touchObject.minSwipe = _.listHeight / _.options.touchThreshold;
		    }
		    switch (event.data.action) {
		      case 'start':
		        _.swipeStart(event);
		        break;
		      case 'move':
		        _.swipeMove(event);
		        break;
		      case 'end':
		        _.swipeEnd(event);
		        break;
		    }
		  };
		  Slick.prototype.swipeMove = function (event) {
		    var _ = this,
		      curLeft,
		      swipeDirection,
		      swipeLength,
		      positionOffset,
		      touches,
		      verticalSwipeLength;
		    touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;
		    if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
		      return false;
		    }
		    curLeft = _.getLeft(_.currentSlide);
		    _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
		    _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;
		    _.touchObject.swipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));
		    verticalSwipeLength = Math.round(Math.sqrt(Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));
		    if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
		      _.scrolling = true;
		      return false;
		    }
		    if (_.options.verticalSwiping === true) {
		      _.touchObject.swipeLength = verticalSwipeLength;
		    }
		    swipeDirection = _.swipeDirection();
		    if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
		      _.swiping = true;
		      event.preventDefault();
		    }
		    positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
		    if (_.options.verticalSwiping === true) {
		      positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
		    }
		    swipeLength = _.touchObject.swipeLength;
		    _.touchObject.edgeHit = false;
		    if (_.options.infinite === false) {
		      if (_.currentSlide === 0 && swipeDirection === 'right' || _.currentSlide >= _.getDotCount() && swipeDirection === 'left') {
		        swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
		        _.touchObject.edgeHit = true;
		      }
		    }
		    if (_.options.vertical === false) {
		      _.swipeLeft = curLeft + swipeLength * positionOffset;
		    } else {
		      _.swipeLeft = curLeft + swipeLength * (_.$list.height() / _.listWidth) * positionOffset;
		    }
		    if (_.options.verticalSwiping === true) {
		      _.swipeLeft = curLeft + swipeLength * positionOffset;
		    }
		    if (_.options.fade === true || _.options.touchMove === false) {
		      return false;
		    }
		    if (_.animating === true) {
		      _.swipeLeft = null;
		      return false;
		    }
		    _.setCSS(_.swipeLeft);
		  };
		  Slick.prototype.swipeStart = function (event) {
		    var _ = this,
		      touches;
		    _.interrupted = true;
		    if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
		      _.touchObject = {};
		      return false;
		    }
		    if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
		      touches = event.originalEvent.touches[0];
		    }
		    _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
		    _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;
		    _.dragging = true;
		  };
		  Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function () {
		    var _ = this;
		    if (_.$slidesCache !== null) {
		      _.unload();
		      _.$slideTrack.children(this.options.slide).detach();
		      _.$slidesCache.appendTo(_.$slideTrack);
		      _.reinit();
		    }
		  };
		  Slick.prototype.unload = function () {
		    var _ = this;
		    $('.slick-cloned', _.$slider).remove();
		    if (_.$dots) {
		      _.$dots.remove();
		    }
		    if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
		      _.$prevArrow.remove();
		    }
		    if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
		      _.$nextArrow.remove();
		    }
		    _.$slides.removeClass('slick-slide slick-active slick-visible slick-current').attr('aria-hidden', 'true').css('width', '');
		  };
		  Slick.prototype.unslick = function (fromBreakpoint) {
		    var _ = this;
		    _.$slider.trigger('unslick', [_, fromBreakpoint]);
		    _.destroy();
		  };
		  Slick.prototype.updateArrows = function () {
		    var _ = this;
		    Math.floor(_.options.slidesToShow / 2);
		    if (_.options.arrows === true && _.slideCount > _.options.slidesToShow && !_.options.infinite) {
		      _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
		      _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
		      if (_.currentSlide === 0) {
		        _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
		        _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
		      } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {
		        _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
		        _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
		      } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {
		        _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
		        _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
		      }
		    }
		  };
		  Slick.prototype.updateDots = function () {
		    var _ = this;
		    if (_.$dots !== null) {
		      _.$dots.find('li').removeClass('slick-active').end();
		      _.$dots.find('li').eq(Math.floor(_.currentSlide / _.options.slidesToScroll)).addClass('slick-active');
		    }
		  };
		  Slick.prototype.visibility = function () {
		    var _ = this;
		    if (_.options.autoplay) {
		      if (document[_.hidden]) {
		        _.interrupted = true;
		      } else {
		        _.interrupted = false;
		      }
		    }
		  };
		  $.fn.slick = function () {
		    var _ = this,
		      opt = arguments[0],
		      args = Array.prototype.slice.call(arguments, 1),
		      l = _.length,
		      i,
		      ret;
		    for (i = 0; i < l; i++) {
		      if (typeof opt == 'object' || typeof opt == 'undefined') _[i].slick = new Slick(_[i], opt);else ret = _[i].slick[opt].apply(_[i].slick, args);
		      if (typeof ret != 'undefined') return ret;
		    }
		    return _;
		  };
		});
	} (slick));

	var masonry = {exports: {}};

	var outlayer = {exports: {}};

	var evEmitter = {exports: {}};

	/**
	 * EvEmitter v1.1.0
	 * Lil' event emitter
	 * MIT License
	 */

	var hasRequiredEvEmitter;

	function requireEvEmitter () {
		if (hasRequiredEvEmitter) return evEmitter.exports;
		hasRequiredEvEmitter = 1;
		(function (module) {
			/* jshint unused: true, undef: true, strict: true */

			(function (global, factory) {
			  // universal module definition
			  /* jshint strict: false */ /* globals define, module, window */
			  if (module.exports) {
			    // CommonJS - Browserify, Webpack
			    module.exports = factory();
			  } else {
			    // Browser globals
			    global.EvEmitter = factory();
			  }
			})(typeof window != 'undefined' ? window : commonjsGlobal, function () {

			  function EvEmitter() {}
			  var proto = EvEmitter.prototype;
			  proto.on = function (eventName, listener) {
			    if (!eventName || !listener) {
			      return;
			    }
			    // set events hash
			    var events = this._events = this._events || {};
			    // set listeners array
			    var listeners = events[eventName] = events[eventName] || [];
			    // only add once
			    if (listeners.indexOf(listener) == -1) {
			      listeners.push(listener);
			    }
			    return this;
			  };
			  proto.once = function (eventName, listener) {
			    if (!eventName || !listener) {
			      return;
			    }
			    // add event
			    this.on(eventName, listener);
			    // set once flag
			    // set onceEvents hash
			    var onceEvents = this._onceEvents = this._onceEvents || {};
			    // set onceListeners object
			    var onceListeners = onceEvents[eventName] = onceEvents[eventName] || {};
			    // set flag
			    onceListeners[listener] = true;
			    return this;
			  };
			  proto.off = function (eventName, listener) {
			    var listeners = this._events && this._events[eventName];
			    if (!listeners || !listeners.length) {
			      return;
			    }
			    var index = listeners.indexOf(listener);
			    if (index != -1) {
			      listeners.splice(index, 1);
			    }
			    return this;
			  };
			  proto.emitEvent = function (eventName, args) {
			    var listeners = this._events && this._events[eventName];
			    if (!listeners || !listeners.length) {
			      return;
			    }
			    // copy over to avoid interference if .off() in listener
			    listeners = listeners.slice(0);
			    args = args || [];
			    // once stuff
			    var onceListeners = this._onceEvents && this._onceEvents[eventName];
			    for (var i = 0; i < listeners.length; i++) {
			      var listener = listeners[i];
			      var isOnce = onceListeners && onceListeners[listener];
			      if (isOnce) {
			        // remove listener
			        // remove before trigger to prevent recursion
			        this.off(eventName, listener);
			        // unset once flag
			        delete onceListeners[listener];
			      }
			      // trigger listener
			      listener.apply(this, args);
			    }
			    return this;
			  };
			  proto.allOff = function () {
			    delete this._events;
			    delete this._onceEvents;
			  };
			  return EvEmitter;
			});
	} (evEmitter));
		return evEmitter.exports;
	}

	var getSize = {exports: {}};

	/*!
	 * getSize v2.0.3
	 * measure size of elements
	 * MIT license
	 */

	var hasRequiredGetSize;

	function requireGetSize () {
		if (hasRequiredGetSize) return getSize.exports;
		hasRequiredGetSize = 1;
		(function (module) {
			/* jshint browser: true, strict: true, undef: true, unused: true */
			/* globals console: false */

			(function (window, factory) {
			  /* jshint strict: false */ /* globals define, module */
			  if (module.exports) {
			    // CommonJS
			    module.exports = factory();
			  } else {
			    // browser global
			    window.getSize = factory();
			  }
			})(window, function factory() {

			  // -------------------------- helpers -------------------------- //

			  // get a number from a string, not a percentage
			  function getStyleSize(value) {
			    var num = parseFloat(value);
			    // not a percent like '100%', and a number
			    var isValid = value.indexOf('%') == -1 && !isNaN(num);
			    return isValid && num;
			  }
			  function noop() {}
			  var logError = typeof console == 'undefined' ? noop : function (message) {
			    console.error(message);
			  };

			  // -------------------------- measurements -------------------------- //

			  var measurements = ['paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'marginLeft', 'marginRight', 'marginTop', 'marginBottom', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'borderBottomWidth'];
			  var measurementsLength = measurements.length;
			  function getZeroSize() {
			    var size = {
			      width: 0,
			      height: 0,
			      innerWidth: 0,
			      innerHeight: 0,
			      outerWidth: 0,
			      outerHeight: 0
			    };
			    for (var i = 0; i < measurementsLength; i++) {
			      var measurement = measurements[i];
			      size[measurement] = 0;
			    }
			    return size;
			  }

			  // -------------------------- getStyle -------------------------- //

			  /**
			   * getStyle, get style of element, check for Firefox bug
			   * https://bugzilla.mozilla.org/show_bug.cgi?id=548397
			   */
			  function getStyle(elem) {
			    var style = getComputedStyle(elem);
			    if (!style) {
			      logError('Style returned ' + style + '. Are you running this code in a hidden iframe on Firefox? ' + 'See https://bit.ly/getsizebug1');
			    }
			    return style;
			  }

			  // -------------------------- setup -------------------------- //

			  var isSetup = false;
			  var isBoxSizeOuter;

			  /**
			   * setup
			   * check isBoxSizerOuter
			   * do on first getSize() rather than on page load for Firefox bug
			   */
			  function setup() {
			    // setup once
			    if (isSetup) {
			      return;
			    }
			    isSetup = true;

			    // -------------------------- box sizing -------------------------- //

			    /**
			     * Chrome & Safari measure the outer-width on style.width on border-box elems
			     * IE11 & Firefox<29 measures the inner-width
			     */
			    var div = document.createElement('div');
			    div.style.width = '200px';
			    div.style.padding = '1px 2px 3px 4px';
			    div.style.borderStyle = 'solid';
			    div.style.borderWidth = '1px 2px 3px 4px';
			    div.style.boxSizing = 'border-box';
			    var body = document.body || document.documentElement;
			    body.appendChild(div);
			    var style = getStyle(div);
			    // round value for browser zoom. desandro/masonry#928
			    isBoxSizeOuter = Math.round(getStyleSize(style.width)) == 200;
			    getSize.isBoxSizeOuter = isBoxSizeOuter;
			    body.removeChild(div);
			  }

			  // -------------------------- getSize -------------------------- //

			  function getSize(elem) {
			    setup();

			    // use querySeletor if elem is string
			    if (typeof elem == 'string') {
			      elem = document.querySelector(elem);
			    }

			    // do not proceed on non-objects
			    if (!elem || typeof elem != 'object' || !elem.nodeType) {
			      return;
			    }
			    var style = getStyle(elem);

			    // if hidden, everything is 0
			    if (style.display == 'none') {
			      return getZeroSize();
			    }
			    var size = {};
			    size.width = elem.offsetWidth;
			    size.height = elem.offsetHeight;
			    var isBorderBox = size.isBorderBox = style.boxSizing == 'border-box';

			    // get all measurements
			    for (var i = 0; i < measurementsLength; i++) {
			      var measurement = measurements[i];
			      var value = style[measurement];
			      var num = parseFloat(value);
			      // any 'auto', 'medium' value will be 0
			      size[measurement] = !isNaN(num) ? num : 0;
			    }
			    var paddingWidth = size.paddingLeft + size.paddingRight;
			    var paddingHeight = size.paddingTop + size.paddingBottom;
			    var marginWidth = size.marginLeft + size.marginRight;
			    var marginHeight = size.marginTop + size.marginBottom;
			    var borderWidth = size.borderLeftWidth + size.borderRightWidth;
			    var borderHeight = size.borderTopWidth + size.borderBottomWidth;
			    var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

			    // overwrite width and height if we can get it from style
			    var styleWidth = getStyleSize(style.width);
			    if (styleWidth !== false) {
			      size.width = styleWidth + (
			      // add padding and border unless it's already including it
			      isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth);
			    }
			    var styleHeight = getStyleSize(style.height);
			    if (styleHeight !== false) {
			      size.height = styleHeight + (
			      // add padding and border unless it's already including it
			      isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight);
			    }
			    size.innerWidth = size.width - (paddingWidth + borderWidth);
			    size.innerHeight = size.height - (paddingHeight + borderHeight);
			    size.outerWidth = size.width + marginWidth;
			    size.outerHeight = size.height + marginHeight;
			    return size;
			  }
			  return getSize;
			});
	} (getSize));
		return getSize.exports;
	}

	var utils = {exports: {}};

	var matchesSelector = {exports: {}};

	/**
	 * matchesSelector v2.0.2
	 * matchesSelector( element, '.selector' )
	 * MIT license
	 */

	var hasRequiredMatchesSelector;

	function requireMatchesSelector () {
		if (hasRequiredMatchesSelector) return matchesSelector.exports;
		hasRequiredMatchesSelector = 1;
		(function (module) {
			/*jshint browser: true, strict: true, undef: true, unused: true */

			(function (window, factory) {

			  // universal module definition
			  if (module.exports) {
			    // CommonJS
			    module.exports = factory();
			  } else {
			    // browser global
			    window.matchesSelector = factory();
			  }
			})(window, function factory() {

			  var matchesMethod = function () {
			    var ElemProto = window.Element.prototype;
			    // check for the standard method name first
			    if (ElemProto.matches) {
			      return 'matches';
			    }
			    // check un-prefixed
			    if (ElemProto.matchesSelector) {
			      return 'matchesSelector';
			    }
			    // check vendor prefixes
			    var prefixes = ['webkit', 'moz', 'ms', 'o'];
			    for (var i = 0; i < prefixes.length; i++) {
			      var prefix = prefixes[i];
			      var method = prefix + 'MatchesSelector';
			      if (ElemProto[method]) {
			        return method;
			      }
			    }
			  }();
			  return function matchesSelector(elem, selector) {
			    return elem[matchesMethod](selector);
			  };
			});
	} (matchesSelector));
		return matchesSelector.exports;
	}

	/**
	 * Fizzy UI utils v2.0.7
	 * MIT license
	 */

	var hasRequiredUtils;

	function requireUtils () {
		if (hasRequiredUtils) return utils.exports;
		hasRequiredUtils = 1;
		(function (module) {
			/*jshint browser: true, undef: true, unused: true, strict: true */

			(function (window, factory) {
			  // universal module definition
			  /*jshint strict: false */ /*globals define, module, require */

			  if (module.exports) {
			    // CommonJS
			    module.exports = factory(window, requireMatchesSelector());
			  } else {
			    // browser global
			    window.fizzyUIUtils = factory(window, window.matchesSelector);
			  }
			})(window, function factory(window, matchesSelector) {

			  var utils = {};

			  // ----- extend ----- //

			  // extends objects
			  utils.extend = function (a, b) {
			    for (var prop in b) {
			      a[prop] = b[prop];
			    }
			    return a;
			  };

			  // ----- modulo ----- //

			  utils.modulo = function (num, div) {
			    return (num % div + div) % div;
			  };

			  // ----- makeArray ----- //

			  var arraySlice = Array.prototype.slice;

			  // turn element or nodeList into an array
			  utils.makeArray = function (obj) {
			    if (Array.isArray(obj)) {
			      // use object if already an array
			      return obj;
			    }
			    // return empty array if undefined or null. #6
			    if (obj === null || obj === undefined) {
			      return [];
			    }
			    var isArrayLike = typeof obj == 'object' && typeof obj.length == 'number';
			    if (isArrayLike) {
			      // convert nodeList to array
			      return arraySlice.call(obj);
			    }

			    // array of single index
			    return [obj];
			  };

			  // ----- removeFrom ----- //

			  utils.removeFrom = function (ary, obj) {
			    var index = ary.indexOf(obj);
			    if (index != -1) {
			      ary.splice(index, 1);
			    }
			  };

			  // ----- getParent ----- //

			  utils.getParent = function (elem, selector) {
			    while (elem.parentNode && elem != document.body) {
			      elem = elem.parentNode;
			      if (matchesSelector(elem, selector)) {
			        return elem;
			      }
			    }
			  };

			  // ----- getQueryElement ----- //

			  // use element as selector string
			  utils.getQueryElement = function (elem) {
			    if (typeof elem == 'string') {
			      return document.querySelector(elem);
			    }
			    return elem;
			  };

			  // ----- handleEvent ----- //

			  // enable .ontype to trigger from .addEventListener( elem, 'type' )
			  utils.handleEvent = function (event) {
			    var method = 'on' + event.type;
			    if (this[method]) {
			      this[method](event);
			    }
			  };

			  // ----- filterFindElements ----- //

			  utils.filterFindElements = function (elems, selector) {
			    // make array of elems
			    elems = utils.makeArray(elems);
			    var ffElems = [];
			    elems.forEach(function (elem) {
			      // check that elem is an actual element
			      if (!(elem instanceof HTMLElement)) {
			        return;
			      }
			      // add elem if no selector
			      if (!selector) {
			        ffElems.push(elem);
			        return;
			      }
			      // filter & find items if we have a selector
			      // filter
			      if (matchesSelector(elem, selector)) {
			        ffElems.push(elem);
			      }
			      // find children
			      var childElems = elem.querySelectorAll(selector);
			      // concat childElems to filterFound array
			      for (var i = 0; i < childElems.length; i++) {
			        ffElems.push(childElems[i]);
			      }
			    });
			    return ffElems;
			  };

			  // ----- debounceMethod ----- //

			  utils.debounceMethod = function (_class, methodName, threshold) {
			    threshold = threshold || 100;
			    // original method
			    var method = _class.prototype[methodName];
			    var timeoutName = methodName + 'Timeout';
			    _class.prototype[methodName] = function () {
			      var timeout = this[timeoutName];
			      clearTimeout(timeout);
			      var args = arguments;
			      var _this = this;
			      this[timeoutName] = setTimeout(function () {
			        method.apply(_this, args);
			        delete _this[timeoutName];
			      }, threshold);
			    };
			  };

			  // ----- docReady ----- //

			  utils.docReady = function (callback) {
			    var readyState = document.readyState;
			    if (readyState == 'complete' || readyState == 'interactive') {
			      // do async to allow for other scripts to run. metafizzy/flickity#441
			      setTimeout(callback);
			    } else {
			      document.addEventListener('DOMContentLoaded', callback);
			    }
			  };

			  // ----- htmlInit ----- //

			  // http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
			  utils.toDashed = function (str) {
			    return str.replace(/(.)([A-Z])/g, function (match, $1, $2) {
			      return $1 + '-' + $2;
			    }).toLowerCase();
			  };
			  var console = window.console;
			  /**
			   * allow user to initialize classes via [data-namespace] or .js-namespace class
			   * htmlInit( Widget, 'widgetName' )
			   * options are parsed from data-namespace-options
			   */
			  utils.htmlInit = function (WidgetClass, namespace) {
			    utils.docReady(function () {
			      var dashedNamespace = utils.toDashed(namespace);
			      var dataAttr = 'data-' + dashedNamespace;
			      var dataAttrElems = document.querySelectorAll('[' + dataAttr + ']');
			      var jsDashElems = document.querySelectorAll('.js-' + dashedNamespace);
			      var elems = utils.makeArray(dataAttrElems).concat(utils.makeArray(jsDashElems));
			      var dataOptionsAttr = dataAttr + '-options';
			      var jQuery = window.jQuery;
			      elems.forEach(function (elem) {
			        var attr = elem.getAttribute(dataAttr) || elem.getAttribute(dataOptionsAttr);
			        var options;
			        try {
			          options = attr && JSON.parse(attr);
			        } catch (error) {
			          // log error, do not initialize
			          if (console) {
			            console.error('Error parsing ' + dataAttr + ' on ' + elem.className + ': ' + error);
			          }
			          return;
			        }
			        // initialize
			        var instance = new WidgetClass(elem, options);
			        // make available via $().data('namespace')
			        if (jQuery) {
			          jQuery.data(elem, namespace, instance);
			        }
			      });
			    });
			  };

			  // -----  ----- //

			  return utils;
			});
	} (utils));
		return utils.exports;
	}

	var item = {exports: {}};

	/**
	 * Outlayer Item
	 */

	var hasRequiredItem;

	function requireItem () {
		if (hasRequiredItem) return item.exports;
		hasRequiredItem = 1;
		(function (module) {
			(function (window, factory) {
			  // universal module definition
			  /* jshint strict: false */ /* globals define, module, require */
			  if (module.exports) {
			    // CommonJS - Browserify, Webpack
			    module.exports = factory(requireEvEmitter(), requireGetSize());
			  } else {
			    // browser global
			    window.Outlayer = {};
			    window.Outlayer.Item = factory(window.EvEmitter, window.getSize);
			  }
			})(window, function factory(EvEmitter, getSize) {

			  // ----- helpers ----- //
			  function isEmptyObj(obj) {
			    for (var prop in obj) {
			      return false;
			    }
			    prop = null;
			    return true;
			  }

			  // -------------------------- CSS3 support -------------------------- //

			  var docElemStyle = document.documentElement.style;
			  var transitionProperty = typeof docElemStyle.transition == 'string' ? 'transition' : 'WebkitTransition';
			  var transformProperty = typeof docElemStyle.transform == 'string' ? 'transform' : 'WebkitTransform';
			  var transitionEndEvent = {
			    WebkitTransition: 'webkitTransitionEnd',
			    transition: 'transitionend'
			  }[transitionProperty];

			  // cache all vendor properties that could have vendor prefix
			  var vendorProperties = {
			    transform: transformProperty,
			    transition: transitionProperty,
			    transitionDuration: transitionProperty + 'Duration',
			    transitionProperty: transitionProperty + 'Property',
			    transitionDelay: transitionProperty + 'Delay'
			  };

			  // -------------------------- Item -------------------------- //

			  function Item(element, layout) {
			    if (!element) {
			      return;
			    }
			    this.element = element;
			    // parent layout class, i.e. Masonry, Isotope, or Packery
			    this.layout = layout;
			    this.position = {
			      x: 0,
			      y: 0
			    };
			    this._create();
			  }

			  // inherit EvEmitter
			  var proto = Item.prototype = Object.create(EvEmitter.prototype);
			  proto.constructor = Item;
			  proto._create = function () {
			    // transition objects
			    this._transn = {
			      ingProperties: {},
			      clean: {},
			      onEnd: {}
			    };
			    this.css({
			      position: 'absolute'
			    });
			  };

			  // trigger specified handler for event type
			  proto.handleEvent = function (event) {
			    var method = 'on' + event.type;
			    if (this[method]) {
			      this[method](event);
			    }
			  };
			  proto.getSize = function () {
			    this.size = getSize(this.element);
			  };

			  /**
			   * apply CSS styles to element
			   * @param {Object} style
			   */
			  proto.css = function (style) {
			    var elemStyle = this.element.style;
			    for (var prop in style) {
			      // use vendor property if available
			      var supportedProp = vendorProperties[prop] || prop;
			      elemStyle[supportedProp] = style[prop];
			    }
			  };

			  // measure position, and sets it
			  proto.getPosition = function () {
			    var style = getComputedStyle(this.element);
			    var isOriginLeft = this.layout._getOption('originLeft');
			    var isOriginTop = this.layout._getOption('originTop');
			    var xValue = style[isOriginLeft ? 'left' : 'right'];
			    var yValue = style[isOriginTop ? 'top' : 'bottom'];
			    var x = parseFloat(xValue);
			    var y = parseFloat(yValue);
			    // convert percent to pixels
			    var layoutSize = this.layout.size;
			    if (xValue.indexOf('%') != -1) {
			      x = x / 100 * layoutSize.width;
			    }
			    if (yValue.indexOf('%') != -1) {
			      y = y / 100 * layoutSize.height;
			    }
			    // clean up 'auto' or other non-integer values
			    x = isNaN(x) ? 0 : x;
			    y = isNaN(y) ? 0 : y;
			    // remove padding from measurement
			    x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
			    y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;
			    this.position.x = x;
			    this.position.y = y;
			  };

			  // set settled position, apply padding
			  proto.layoutPosition = function () {
			    var layoutSize = this.layout.size;
			    var style = {};
			    var isOriginLeft = this.layout._getOption('originLeft');
			    var isOriginTop = this.layout._getOption('originTop');

			    // x
			    var xPadding = isOriginLeft ? 'paddingLeft' : 'paddingRight';
			    var xProperty = isOriginLeft ? 'left' : 'right';
			    var xResetProperty = isOriginLeft ? 'right' : 'left';
			    var x = this.position.x + layoutSize[xPadding];
			    // set in percentage or pixels
			    style[xProperty] = this.getXValue(x);
			    // reset other property
			    style[xResetProperty] = '';

			    // y
			    var yPadding = isOriginTop ? 'paddingTop' : 'paddingBottom';
			    var yProperty = isOriginTop ? 'top' : 'bottom';
			    var yResetProperty = isOriginTop ? 'bottom' : 'top';
			    var y = this.position.y + layoutSize[yPadding];
			    // set in percentage or pixels
			    style[yProperty] = this.getYValue(y);
			    // reset other property
			    style[yResetProperty] = '';
			    this.css(style);
			    this.emitEvent('layout', [this]);
			  };
			  proto.getXValue = function (x) {
			    var isHorizontal = this.layout._getOption('horizontal');
			    return this.layout.options.percentPosition && !isHorizontal ? x / this.layout.size.width * 100 + '%' : x + 'px';
			  };
			  proto.getYValue = function (y) {
			    var isHorizontal = this.layout._getOption('horizontal');
			    return this.layout.options.percentPosition && isHorizontal ? y / this.layout.size.height * 100 + '%' : y + 'px';
			  };
			  proto._transitionTo = function (x, y) {
			    this.getPosition();
			    // get current x & y from top/left
			    var curX = this.position.x;
			    var curY = this.position.y;
			    var didNotMove = x == this.position.x && y == this.position.y;

			    // save end position
			    this.setPosition(x, y);

			    // if did not move and not transitioning, just go to layout
			    if (didNotMove && !this.isTransitioning) {
			      this.layoutPosition();
			      return;
			    }
			    var transX = x - curX;
			    var transY = y - curY;
			    var transitionStyle = {};
			    transitionStyle.transform = this.getTranslate(transX, transY);
			    this.transition({
			      to: transitionStyle,
			      onTransitionEnd: {
			        transform: this.layoutPosition
			      },
			      isCleaning: true
			    });
			  };
			  proto.getTranslate = function (x, y) {
			    // flip cooridinates if origin on right or bottom
			    var isOriginLeft = this.layout._getOption('originLeft');
			    var isOriginTop = this.layout._getOption('originTop');
			    x = isOriginLeft ? x : -x;
			    y = isOriginTop ? y : -y;
			    return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
			  };

			  // non transition + transform support
			  proto.goTo = function (x, y) {
			    this.setPosition(x, y);
			    this.layoutPosition();
			  };
			  proto.moveTo = proto._transitionTo;
			  proto.setPosition = function (x, y) {
			    this.position.x = parseFloat(x);
			    this.position.y = parseFloat(y);
			  };

			  // ----- transition ----- //

			  /**
			   * @param {Object} style - CSS
			   * @param {Function} onTransitionEnd
			   */

			  // non transition, just trigger callback
			  proto._nonTransition = function (args) {
			    this.css(args.to);
			    if (args.isCleaning) {
			      this._removeStyles(args.to);
			    }
			    for (var prop in args.onTransitionEnd) {
			      args.onTransitionEnd[prop].call(this);
			    }
			  };

			  /**
			   * proper transition
			   * @param {Object} args - arguments
			   *   @param {Object} to - style to transition to
			   *   @param {Object} from - style to start transition from
			   *   @param {Boolean} isCleaning - removes transition styles after transition
			   *   @param {Function} onTransitionEnd - callback
			   */
			  proto.transition = function (args) {
			    // redirect to nonTransition if no transition duration
			    if (!parseFloat(this.layout.options.transitionDuration)) {
			      this._nonTransition(args);
			      return;
			    }
			    var _transition = this._transn;
			    // keep track of onTransitionEnd callback by css property
			    for (var prop in args.onTransitionEnd) {
			      _transition.onEnd[prop] = args.onTransitionEnd[prop];
			    }
			    // keep track of properties that are transitioning
			    for (prop in args.to) {
			      _transition.ingProperties[prop] = true;
			      // keep track of properties to clean up when transition is done
			      if (args.isCleaning) {
			        _transition.clean[prop] = true;
			      }
			    }

			    // set from styles
			    if (args.from) {
			      this.css(args.from);
			      // force redraw. http://blog.alexmaccaw.com/css-transitions
			      this.element.offsetHeight;
			    }
			    // enable transition
			    this.enableTransition(args.to);
			    // set styles that are transitioning
			    this.css(args.to);
			    this.isTransitioning = true;
			  };

			  // dash before all cap letters, including first for
			  // WebkitTransform => -webkit-transform
			  function toDashedAll(str) {
			    return str.replace(/([A-Z])/g, function ($1) {
			      return '-' + $1.toLowerCase();
			    });
			  }
			  var transitionProps = 'opacity,' + toDashedAll(transformProperty);
			  proto.enableTransition = function /* style */
			  () {
			    // HACK changing transitionProperty during a transition
			    // will cause transition to jump
			    if (this.isTransitioning) {
			      return;
			    }

			    // make `transition: foo, bar, baz` from style object
			    // HACK un-comment this when enableTransition can work
			    // while a transition is happening
			    // var transitionValues = [];
			    // for ( var prop in style ) {
			    //   // dash-ify camelCased properties like WebkitTransition
			    //   prop = vendorProperties[ prop ] || prop;
			    //   transitionValues.push( toDashedAll( prop ) );
			    // }
			    // munge number to millisecond, to match stagger
			    var duration = this.layout.options.transitionDuration;
			    duration = typeof duration == 'number' ? duration + 'ms' : duration;
			    // enable transition styles
			    this.css({
			      transitionProperty: transitionProps,
			      transitionDuration: duration,
			      transitionDelay: this.staggerDelay || 0
			    });
			    // listen for transition end event
			    this.element.addEventListener(transitionEndEvent, this, false);
			  };

			  // ----- events ----- //

			  proto.onwebkitTransitionEnd = function (event) {
			    this.ontransitionend(event);
			  };
			  proto.onotransitionend = function (event) {
			    this.ontransitionend(event);
			  };

			  // properties that I munge to make my life easier
			  var dashedVendorProperties = {
			    '-webkit-transform': 'transform'
			  };
			  proto.ontransitionend = function (event) {
			    // disregard bubbled events from children
			    if (event.target !== this.element) {
			      return;
			    }
			    var _transition = this._transn;
			    // get property name of transitioned property, convert to prefix-free
			    var propertyName = dashedVendorProperties[event.propertyName] || event.propertyName;

			    // remove property that has completed transitioning
			    delete _transition.ingProperties[propertyName];
			    // check if any properties are still transitioning
			    if (isEmptyObj(_transition.ingProperties)) {
			      // all properties have completed transitioning
			      this.disableTransition();
			    }
			    // clean style
			    if (propertyName in _transition.clean) {
			      // clean up style
			      this.element.style[event.propertyName] = '';
			      delete _transition.clean[propertyName];
			    }
			    // trigger onTransitionEnd callback
			    if (propertyName in _transition.onEnd) {
			      var onTransitionEnd = _transition.onEnd[propertyName];
			      onTransitionEnd.call(this);
			      delete _transition.onEnd[propertyName];
			    }
			    this.emitEvent('transitionEnd', [this]);
			  };
			  proto.disableTransition = function () {
			    this.removeTransitionStyles();
			    this.element.removeEventListener(transitionEndEvent, this, false);
			    this.isTransitioning = false;
			  };

			  /**
			   * removes style property from element
			   * @param {Object} style
			  **/
			  proto._removeStyles = function (style) {
			    // clean up transition styles
			    var cleanStyle = {};
			    for (var prop in style) {
			      cleanStyle[prop] = '';
			    }
			    this.css(cleanStyle);
			  };
			  var cleanTransitionStyle = {
			    transitionProperty: '',
			    transitionDuration: '',
			    transitionDelay: ''
			  };
			  proto.removeTransitionStyles = function () {
			    // remove transition
			    this.css(cleanTransitionStyle);
			  };

			  // ----- stagger ----- //

			  proto.stagger = function (delay) {
			    delay = isNaN(delay) ? 0 : delay;
			    this.staggerDelay = delay + 'ms';
			  };

			  // ----- show/hide/remove ----- //

			  // remove element from DOM
			  proto.removeElem = function () {
			    this.element.parentNode.removeChild(this.element);
			    // remove display: none
			    this.css({
			      display: ''
			    });
			    this.emitEvent('remove', [this]);
			  };
			  proto.remove = function () {
			    // just remove element if no transition support or no transition
			    if (!transitionProperty || !parseFloat(this.layout.options.transitionDuration)) {
			      this.removeElem();
			      return;
			    }

			    // start transition
			    this.once('transitionEnd', function () {
			      this.removeElem();
			    });
			    this.hide();
			  };
			  proto.reveal = function () {
			    delete this.isHidden;
			    // remove display: none
			    this.css({
			      display: ''
			    });
			    var options = this.layout.options;
			    var onTransitionEnd = {};
			    var transitionEndProperty = this.getHideRevealTransitionEndProperty('visibleStyle');
			    onTransitionEnd[transitionEndProperty] = this.onRevealTransitionEnd;
			    this.transition({
			      from: options.hiddenStyle,
			      to: options.visibleStyle,
			      isCleaning: true,
			      onTransitionEnd: onTransitionEnd
			    });
			  };
			  proto.onRevealTransitionEnd = function () {
			    // check if still visible
			    // during transition, item may have been hidden
			    if (!this.isHidden) {
			      this.emitEvent('reveal');
			    }
			  };

			  /**
			   * get style property use for hide/reveal transition end
			   * @param {String} styleProperty - hiddenStyle/visibleStyle
			   * @returns {String}
			   */
			  proto.getHideRevealTransitionEndProperty = function (styleProperty) {
			    var optionStyle = this.layout.options[styleProperty];
			    // use opacity
			    if (optionStyle.opacity) {
			      return 'opacity';
			    }
			    // get first property
			    for (var prop in optionStyle) {
			      return prop;
			    }
			  };
			  proto.hide = function () {
			    // set flag
			    this.isHidden = true;
			    // remove display: none
			    this.css({
			      display: ''
			    });
			    var options = this.layout.options;
			    var onTransitionEnd = {};
			    var transitionEndProperty = this.getHideRevealTransitionEndProperty('hiddenStyle');
			    onTransitionEnd[transitionEndProperty] = this.onHideTransitionEnd;
			    this.transition({
			      from: options.visibleStyle,
			      to: options.hiddenStyle,
			      // keep hidden stuff hidden
			      isCleaning: true,
			      onTransitionEnd: onTransitionEnd
			    });
			  };
			  proto.onHideTransitionEnd = function () {
			    // check if still hidden
			    // during transition, item may have been un-hidden
			    if (this.isHidden) {
			      this.css({
			        display: 'none'
			      });
			      this.emitEvent('hide');
			    }
			  };
			  proto.destroy = function () {
			    this.css({
			      position: '',
			      left: '',
			      right: '',
			      top: '',
			      bottom: '',
			      transition: '',
			      transform: ''
			    });
			  };
			  return Item;
			});
	} (item));
		return item.exports;
	}

	/*!
	 * Outlayer v2.1.1
	 * the brains and guts of a layout library
	 * MIT license
	 */

	var hasRequiredOutlayer;

	function requireOutlayer () {
		if (hasRequiredOutlayer) return outlayer.exports;
		hasRequiredOutlayer = 1;
		(function (module) {
			(function (window, factory) {

			  // universal module definition
			  /* jshint strict: false */ /* globals define, module, require */
			  if (module.exports) {
			    // CommonJS - Browserify, Webpack
			    module.exports = factory(window, requireEvEmitter(), requireGetSize(), requireUtils(), requireItem());
			  } else {
			    // browser global
			    window.Outlayer = factory(window, window.EvEmitter, window.getSize, window.fizzyUIUtils, window.Outlayer.Item);
			  }
			})(window, function factory(window, EvEmitter, getSize, utils, Item) {

			  // ----- vars ----- //
			  var console = window.console;
			  var jQuery = window.jQuery;
			  var noop = function () {};

			  // -------------------------- Outlayer -------------------------- //

			  // globally unique identifiers
			  var GUID = 0;
			  // internal store of all Outlayer intances
			  var instances = {};

			  /**
			   * @param {Element, String} element
			   * @param {Object} options
			   * @constructor
			   */
			  function Outlayer(element, options) {
			    var queryElement = utils.getQueryElement(element);
			    if (!queryElement) {
			      if (console) {
			        console.error('Bad element for ' + this.constructor.namespace + ': ' + (queryElement || element));
			      }
			      return;
			    }
			    this.element = queryElement;
			    // add jQuery
			    if (jQuery) {
			      this.$element = jQuery(this.element);
			    }

			    // options
			    this.options = utils.extend({}, this.constructor.defaults);
			    this.option(options);

			    // add id for Outlayer.getFromElement
			    var id = ++GUID;
			    this.element.outlayerGUID = id; // expando
			    instances[id] = this; // associate via id

			    // kick it off
			    this._create();
			    var isInitLayout = this._getOption('initLayout');
			    if (isInitLayout) {
			      this.layout();
			    }
			  }

			  // settings are for internal use only
			  Outlayer.namespace = 'outlayer';
			  Outlayer.Item = Item;

			  // default options
			  Outlayer.defaults = {
			    containerStyle: {
			      position: 'relative'
			    },
			    initLayout: true,
			    originLeft: true,
			    originTop: true,
			    resize: true,
			    resizeContainer: true,
			    // item options
			    transitionDuration: '0.4s',
			    hiddenStyle: {
			      opacity: 0,
			      transform: 'scale(0.001)'
			    },
			    visibleStyle: {
			      opacity: 1,
			      transform: 'scale(1)'
			    }
			  };
			  var proto = Outlayer.prototype;
			  // inherit EvEmitter
			  utils.extend(proto, EvEmitter.prototype);

			  /**
			   * set options
			   * @param {Object} opts
			   */
			  proto.option = function (opts) {
			    utils.extend(this.options, opts);
			  };

			  /**
			   * get backwards compatible option value, check old name
			   */
			  proto._getOption = function (option) {
			    var oldOption = this.constructor.compatOptions[option];
			    return oldOption && this.options[oldOption] !== undefined ? this.options[oldOption] : this.options[option];
			  };
			  Outlayer.compatOptions = {
			    // currentName: oldName
			    initLayout: 'isInitLayout',
			    horizontal: 'isHorizontal',
			    layoutInstant: 'isLayoutInstant',
			    originLeft: 'isOriginLeft',
			    originTop: 'isOriginTop',
			    resize: 'isResizeBound',
			    resizeContainer: 'isResizingContainer'
			  };
			  proto._create = function () {
			    // get items from children
			    this.reloadItems();
			    // elements that affect layout, but are not laid out
			    this.stamps = [];
			    this.stamp(this.options.stamp);
			    // set container style
			    utils.extend(this.element.style, this.options.containerStyle);

			    // bind resize method
			    var canBindResize = this._getOption('resize');
			    if (canBindResize) {
			      this.bindResize();
			    }
			  };

			  // goes through all children again and gets bricks in proper order
			  proto.reloadItems = function () {
			    // collection of item elements
			    this.items = this._itemize(this.element.children);
			  };

			  /**
			   * turn elements into Outlayer.Items to be used in layout
			   * @param {Array or NodeList or HTMLElement} elems
			   * @returns {Array} items - collection of new Outlayer Items
			   */
			  proto._itemize = function (elems) {
			    var itemElems = this._filterFindItemElements(elems);
			    var Item = this.constructor.Item;

			    // create new Outlayer Items for collection
			    var items = [];
			    for (var i = 0; i < itemElems.length; i++) {
			      var elem = itemElems[i];
			      var item = new Item(elem, this);
			      items.push(item);
			    }
			    return items;
			  };

			  /**
			   * get item elements to be used in layout
			   * @param {Array or NodeList or HTMLElement} elems
			   * @returns {Array} items - item elements
			   */
			  proto._filterFindItemElements = function (elems) {
			    return utils.filterFindElements(elems, this.options.itemSelector);
			  };

			  /**
			   * getter method for getting item elements
			   * @returns {Array} elems - collection of item elements
			   */
			  proto.getItemElements = function () {
			    return this.items.map(function (item) {
			      return item.element;
			    });
			  };

			  // ----- init & layout ----- //

			  /**
			   * lays out all items
			   */
			  proto.layout = function () {
			    this._resetLayout();
			    this._manageStamps();

			    // don't animate first layout
			    var layoutInstant = this._getOption('layoutInstant');
			    var isInstant = layoutInstant !== undefined ? layoutInstant : !this._isLayoutInited;
			    this.layoutItems(this.items, isInstant);

			    // flag for initalized
			    this._isLayoutInited = true;
			  };

			  // _init is alias for layout
			  proto._init = proto.layout;

			  /**
			   * logic before any new layout
			   */
			  proto._resetLayout = function () {
			    this.getSize();
			  };
			  proto.getSize = function () {
			    this.size = getSize(this.element);
			  };

			  /**
			   * get measurement from option, for columnWidth, rowHeight, gutter
			   * if option is String -> get element from selector string, & get size of element
			   * if option is Element -> get size of element
			   * else use option as a number
			   *
			   * @param {String} measurement
			   * @param {String} size - width or height
			   * @private
			   */
			  proto._getMeasurement = function (measurement, size) {
			    var option = this.options[measurement];
			    var elem;
			    if (!option) {
			      // default to 0
			      this[measurement] = 0;
			    } else {
			      // use option as an element
			      if (typeof option == 'string') {
			        elem = this.element.querySelector(option);
			      } else if (option instanceof HTMLElement) {
			        elem = option;
			      }
			      // use size of element, if element
			      this[measurement] = elem ? getSize(elem)[size] : option;
			    }
			  };

			  /**
			   * layout a collection of item elements
			   * @api public
			   */
			  proto.layoutItems = function (items, isInstant) {
			    items = this._getItemsForLayout(items);
			    this._layoutItems(items, isInstant);
			    this._postLayout();
			  };

			  /**
			   * get the items to be laid out
			   * you may want to skip over some items
			   * @param {Array} items
			   * @returns {Array} items
			   */
			  proto._getItemsForLayout = function (items) {
			    return items.filter(function (item) {
			      return !item.isIgnored;
			    });
			  };

			  /**
			   * layout items
			   * @param {Array} items
			   * @param {Boolean} isInstant
			   */
			  proto._layoutItems = function (items, isInstant) {
			    this._emitCompleteOnItems('layout', items);
			    if (!items || !items.length) {
			      // no items, emit event with empty array
			      return;
			    }
			    var queue = [];
			    items.forEach(function (item) {
			      // get x/y object from method
			      var position = this._getItemLayoutPosition(item);
			      // enqueue
			      position.item = item;
			      position.isInstant = isInstant || item.isLayoutInstant;
			      queue.push(position);
			    }, this);
			    this._processLayoutQueue(queue);
			  };

			  /**
			   * get item layout position
			   * @param {Outlayer.Item} item
			   * @returns {Object} x and y position
			   */
			  proto._getItemLayoutPosition = function /* item */
			  () {
			    return {
			      x: 0,
			      y: 0
			    };
			  };

			  /**
			   * iterate over array and position each item
			   * Reason being - separating this logic prevents 'layout invalidation'
			   * thx @paul_irish
			   * @param {Array} queue
			   */
			  proto._processLayoutQueue = function (queue) {
			    this.updateStagger();
			    queue.forEach(function (obj, i) {
			      this._positionItem(obj.item, obj.x, obj.y, obj.isInstant, i);
			    }, this);
			  };

			  // set stagger from option in milliseconds number
			  proto.updateStagger = function () {
			    var stagger = this.options.stagger;
			    if (stagger === null || stagger === undefined) {
			      this.stagger = 0;
			      return;
			    }
			    this.stagger = getMilliseconds(stagger);
			    return this.stagger;
			  };

			  /**
			   * Sets position of item in DOM
			   * @param {Outlayer.Item} item
			   * @param {Number} x - horizontal position
			   * @param {Number} y - vertical position
			   * @param {Boolean} isInstant - disables transitions
			   */
			  proto._positionItem = function (item, x, y, isInstant, i) {
			    if (isInstant) {
			      // if not transition, just set CSS
			      item.goTo(x, y);
			    } else {
			      item.stagger(i * this.stagger);
			      item.moveTo(x, y);
			    }
			  };

			  /**
			   * Any logic you want to do after each layout,
			   * i.e. size the container
			   */
			  proto._postLayout = function () {
			    this.resizeContainer();
			  };
			  proto.resizeContainer = function () {
			    var isResizingContainer = this._getOption('resizeContainer');
			    if (!isResizingContainer) {
			      return;
			    }
			    var size = this._getContainerSize();
			    if (size) {
			      this._setContainerMeasure(size.width, true);
			      this._setContainerMeasure(size.height, false);
			    }
			  };

			  /**
			   * Sets width or height of container if returned
			   * @returns {Object} size
			   *   @param {Number} width
			   *   @param {Number} height
			   */
			  proto._getContainerSize = noop;

			  /**
			   * @param {Number} measure - size of width or height
			   * @param {Boolean} isWidth
			   */
			  proto._setContainerMeasure = function (measure, isWidth) {
			    if (measure === undefined) {
			      return;
			    }
			    var elemSize = this.size;
			    // add padding and border width if border box
			    if (elemSize.isBorderBox) {
			      measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight + elemSize.borderLeftWidth + elemSize.borderRightWidth : elemSize.paddingBottom + elemSize.paddingTop + elemSize.borderTopWidth + elemSize.borderBottomWidth;
			    }
			    measure = Math.max(measure, 0);
			    this.element.style[isWidth ? 'width' : 'height'] = measure + 'px';
			  };

			  /**
			   * emit eventComplete on a collection of items events
			   * @param {String} eventName
			   * @param {Array} items - Outlayer.Items
			   */
			  proto._emitCompleteOnItems = function (eventName, items) {
			    var _this = this;
			    function onComplete() {
			      _this.dispatchEvent(eventName + 'Complete', null, [items]);
			    }
			    var count = items.length;
			    if (!items || !count) {
			      onComplete();
			      return;
			    }
			    var doneCount = 0;
			    function tick() {
			      doneCount++;
			      if (doneCount == count) {
			        onComplete();
			      }
			    }

			    // bind callback
			    items.forEach(function (item) {
			      item.once(eventName, tick);
			    });
			  };

			  /**
			   * emits events via EvEmitter and jQuery events
			   * @param {String} type - name of event
			   * @param {Event} event - original event
			   * @param {Array} args - extra arguments
			   */
			  proto.dispatchEvent = function (type, event, args) {
			    // add original event to arguments
			    var emitArgs = event ? [event].concat(args) : args;
			    this.emitEvent(type, emitArgs);
			    if (jQuery) {
			      // set this.$element
			      this.$element = this.$element || jQuery(this.element);
			      if (event) {
			        // create jQuery event
			        var $event = jQuery.Event(event);
			        $event.type = type;
			        this.$element.trigger($event, args);
			      } else {
			        // just trigger with type if no event available
			        this.$element.trigger(type, args);
			      }
			    }
			  };

			  // -------------------------- ignore & stamps -------------------------- //

			  /**
			   * keep item in collection, but do not lay it out
			   * ignored items do not get skipped in layout
			   * @param {Element} elem
			   */
			  proto.ignore = function (elem) {
			    var item = this.getItem(elem);
			    if (item) {
			      item.isIgnored = true;
			    }
			  };

			  /**
			   * return item to layout collection
			   * @param {Element} elem
			   */
			  proto.unignore = function (elem) {
			    var item = this.getItem(elem);
			    if (item) {
			      delete item.isIgnored;
			    }
			  };

			  /**
			   * adds elements to stamps
			   * @param {NodeList, Array, Element, or String} elems
			   */
			  proto.stamp = function (elems) {
			    elems = this._find(elems);
			    if (!elems) {
			      return;
			    }
			    this.stamps = this.stamps.concat(elems);
			    // ignore
			    elems.forEach(this.ignore, this);
			  };

			  /**
			   * removes elements to stamps
			   * @param {NodeList, Array, or Element} elems
			   */
			  proto.unstamp = function (elems) {
			    elems = this._find(elems);
			    if (!elems) {
			      return;
			    }
			    elems.forEach(function (elem) {
			      // filter out removed stamp elements
			      utils.removeFrom(this.stamps, elem);
			      this.unignore(elem);
			    }, this);
			  };

			  /**
			   * finds child elements
			   * @param {NodeList, Array, Element, or String} elems
			   * @returns {Array} elems
			   */
			  proto._find = function (elems) {
			    if (!elems) {
			      return;
			    }
			    // if string, use argument as selector string
			    if (typeof elems == 'string') {
			      elems = this.element.querySelectorAll(elems);
			    }
			    elems = utils.makeArray(elems);
			    return elems;
			  };
			  proto._manageStamps = function () {
			    if (!this.stamps || !this.stamps.length) {
			      return;
			    }
			    this._getBoundingRect();
			    this.stamps.forEach(this._manageStamp, this);
			  };

			  // update boundingLeft / Top
			  proto._getBoundingRect = function () {
			    // get bounding rect for container element
			    var boundingRect = this.element.getBoundingClientRect();
			    var size = this.size;
			    this._boundingRect = {
			      left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
			      top: boundingRect.top + size.paddingTop + size.borderTopWidth,
			      right: boundingRect.right - (size.paddingRight + size.borderRightWidth),
			      bottom: boundingRect.bottom - (size.paddingBottom + size.borderBottomWidth)
			    };
			  };

			  /**
			   * @param {Element} stamp
			  **/
			  proto._manageStamp = noop;

			  /**
			   * get x/y position of element relative to container element
			   * @param {Element} elem
			   * @returns {Object} offset - has left, top, right, bottom
			   */
			  proto._getElementOffset = function (elem) {
			    var boundingRect = elem.getBoundingClientRect();
			    var thisRect = this._boundingRect;
			    var size = getSize(elem);
			    var offset = {
			      left: boundingRect.left - thisRect.left - size.marginLeft,
			      top: boundingRect.top - thisRect.top - size.marginTop,
			      right: thisRect.right - boundingRect.right - size.marginRight,
			      bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
			    };
			    return offset;
			  };

			  // -------------------------- resize -------------------------- //

			  // enable event handlers for listeners
			  // i.e. resize -> onresize
			  proto.handleEvent = utils.handleEvent;

			  /**
			   * Bind layout to window resizing
			   */
			  proto.bindResize = function () {
			    window.addEventListener('resize', this);
			    this.isResizeBound = true;
			  };

			  /**
			   * Unbind layout to window resizing
			   */
			  proto.unbindResize = function () {
			    window.removeEventListener('resize', this);
			    this.isResizeBound = false;
			  };
			  proto.onresize = function () {
			    this.resize();
			  };
			  utils.debounceMethod(Outlayer, 'onresize', 100);
			  proto.resize = function () {
			    // don't trigger if size did not change
			    // or if resize was unbound. See #9
			    if (!this.isResizeBound || !this.needsResizeLayout()) {
			      return;
			    }
			    this.layout();
			  };

			  /**
			   * check if layout is needed post layout
			   * @returns Boolean
			   */
			  proto.needsResizeLayout = function () {
			    var size = getSize(this.element);
			    // check that this.size and size are there
			    // IE8 triggers resize on body size change, so they might not be
			    var hasSizes = this.size && size;
			    return hasSizes && size.innerWidth !== this.size.innerWidth;
			  };

			  // -------------------------- methods -------------------------- //

			  /**
			   * add items to Outlayer instance
			   * @param {Array or NodeList or Element} elems
			   * @returns {Array} items - Outlayer.Items
			  **/
			  proto.addItems = function (elems) {
			    var items = this._itemize(elems);
			    // add items to collection
			    if (items.length) {
			      this.items = this.items.concat(items);
			    }
			    return items;
			  };

			  /**
			   * Layout newly-appended item elements
			   * @param {Array or NodeList or Element} elems
			   */
			  proto.appended = function (elems) {
			    var items = this.addItems(elems);
			    if (!items.length) {
			      return;
			    }
			    // layout and reveal just the new items
			    this.layoutItems(items, true);
			    this.reveal(items);
			  };

			  /**
			   * Layout prepended elements
			   * @param {Array or NodeList or Element} elems
			   */
			  proto.prepended = function (elems) {
			    var items = this._itemize(elems);
			    if (!items.length) {
			      return;
			    }
			    // add items to beginning of collection
			    var previousItems = this.items.slice(0);
			    this.items = items.concat(previousItems);
			    // start new layout
			    this._resetLayout();
			    this._manageStamps();
			    // layout new stuff without transition
			    this.layoutItems(items, true);
			    this.reveal(items);
			    // layout previous items
			    this.layoutItems(previousItems);
			  };

			  /**
			   * reveal a collection of items
			   * @param {Array of Outlayer.Items} items
			   */
			  proto.reveal = function (items) {
			    this._emitCompleteOnItems('reveal', items);
			    if (!items || !items.length) {
			      return;
			    }
			    var stagger = this.updateStagger();
			    items.forEach(function (item, i) {
			      item.stagger(i * stagger);
			      item.reveal();
			    });
			  };

			  /**
			   * hide a collection of items
			   * @param {Array of Outlayer.Items} items
			   */
			  proto.hide = function (items) {
			    this._emitCompleteOnItems('hide', items);
			    if (!items || !items.length) {
			      return;
			    }
			    var stagger = this.updateStagger();
			    items.forEach(function (item, i) {
			      item.stagger(i * stagger);
			      item.hide();
			    });
			  };

			  /**
			   * reveal item elements
			   * @param {Array}, {Element}, {NodeList} items
			   */
			  proto.revealItemElements = function (elems) {
			    var items = this.getItems(elems);
			    this.reveal(items);
			  };

			  /**
			   * hide item elements
			   * @param {Array}, {Element}, {NodeList} items
			   */
			  proto.hideItemElements = function (elems) {
			    var items = this.getItems(elems);
			    this.hide(items);
			  };

			  /**
			   * get Outlayer.Item, given an Element
			   * @param {Element} elem
			   * @param {Function} callback
			   * @returns {Outlayer.Item} item
			   */
			  proto.getItem = function (elem) {
			    // loop through items to get the one that matches
			    for (var i = 0; i < this.items.length; i++) {
			      var item = this.items[i];
			      if (item.element == elem) {
			        // return item
			        return item;
			      }
			    }
			  };

			  /**
			   * get collection of Outlayer.Items, given Elements
			   * @param {Array} elems
			   * @returns {Array} items - Outlayer.Items
			   */
			  proto.getItems = function (elems) {
			    elems = utils.makeArray(elems);
			    var items = [];
			    elems.forEach(function (elem) {
			      var item = this.getItem(elem);
			      if (item) {
			        items.push(item);
			      }
			    }, this);
			    return items;
			  };

			  /**
			   * remove element(s) from instance and DOM
			   * @param {Array or NodeList or Element} elems
			   */
			  proto.remove = function (elems) {
			    var removeItems = this.getItems(elems);
			    this._emitCompleteOnItems('remove', removeItems);

			    // bail if no items to remove
			    if (!removeItems || !removeItems.length) {
			      return;
			    }
			    removeItems.forEach(function (item) {
			      item.remove();
			      // remove item from collection
			      utils.removeFrom(this.items, item);
			    }, this);
			  };

			  // ----- destroy ----- //

			  // remove and disable Outlayer instance
			  proto.destroy = function () {
			    // clean up dynamic styles
			    var style = this.element.style;
			    style.height = '';
			    style.position = '';
			    style.width = '';
			    // destroy items
			    this.items.forEach(function (item) {
			      item.destroy();
			    });
			    this.unbindResize();
			    var id = this.element.outlayerGUID;
			    delete instances[id]; // remove reference to instance by id
			    delete this.element.outlayerGUID;
			    // remove data for jQuery
			    if (jQuery) {
			      jQuery.removeData(this.element, this.constructor.namespace);
			    }
			  };

			  // -------------------------- data -------------------------- //

			  /**
			   * get Outlayer instance from element
			   * @param {Element} elem
			   * @returns {Outlayer}
			   */
			  Outlayer.data = function (elem) {
			    elem = utils.getQueryElement(elem);
			    var id = elem && elem.outlayerGUID;
			    return id && instances[id];
			  };

			  // -------------------------- create Outlayer class -------------------------- //

			  /**
			   * create a layout class
			   * @param {String} namespace
			   */
			  Outlayer.create = function (namespace, options) {
			    // sub-class Outlayer
			    var Layout = subclass(Outlayer);
			    // apply new options and compatOptions
			    Layout.defaults = utils.extend({}, Outlayer.defaults);
			    utils.extend(Layout.defaults, options);
			    Layout.compatOptions = utils.extend({}, Outlayer.compatOptions);
			    Layout.namespace = namespace;
			    Layout.data = Outlayer.data;

			    // sub-class Item
			    Layout.Item = subclass(Item);

			    // -------------------------- declarative -------------------------- //

			    utils.htmlInit(Layout, namespace);

			    // -------------------------- jQuery bridge -------------------------- //

			    // make into jQuery plugin
			    if (jQuery && jQuery.bridget) {
			      jQuery.bridget(namespace, Layout);
			    }
			    return Layout;
			  };
			  function subclass(Parent) {
			    function SubClass() {
			      Parent.apply(this, arguments);
			    }
			    SubClass.prototype = Object.create(Parent.prototype);
			    SubClass.prototype.constructor = SubClass;
			    return SubClass;
			  }

			  // ----- helpers ----- //

			  // how many milliseconds are in each unit
			  var msUnits = {
			    ms: 1,
			    s: 1000
			  };

			  // munge time-like parameter into millisecond number
			  // '0.4s' -> 40
			  function getMilliseconds(time) {
			    if (typeof time == 'number') {
			      return time;
			    }
			    var matches = time.match(/(^\d*\.?\d*)(\w*)/);
			    var num = matches && matches[1];
			    var unit = matches && matches[2];
			    if (!num.length) {
			      return 0;
			    }
			    num = parseFloat(num);
			    var mult = msUnits[unit] || 1;
			    return num * mult;
			  }

			  // ----- fin ----- //

			  // back in global
			  Outlayer.Item = Item;
			  return Outlayer;
			});
	} (outlayer));
		return outlayer.exports;
	}

	/*!
	 * Masonry v4.2.2
	 * Cascading grid layout library
	 * https://masonry.desandro.com
	 * MIT License
	 * by David DeSandro
	 */

	(function (module) {
		(function (window, factory) {
		  // universal module definition
		  /* jshint strict: false */ /*globals define, module, require */
		  if (module.exports) {
		    // CommonJS
		    module.exports = factory(requireOutlayer(), requireGetSize());
		  } else {
		    // browser global
		    window.Masonry = factory(window.Outlayer, window.getSize);
		  }
		})(window, function factory(Outlayer, getSize) {

		  // -------------------------- masonryDefinition -------------------------- //

		  // create an Outlayer layout class
		  var Masonry = Outlayer.create('masonry');
		  // isFitWidth -> fitWidth
		  Masonry.compatOptions.fitWidth = 'isFitWidth';
		  var proto = Masonry.prototype;
		  proto._resetLayout = function () {
		    this.getSize();
		    this._getMeasurement('columnWidth', 'outerWidth');
		    this._getMeasurement('gutter', 'outerWidth');
		    this.measureColumns();

		    // reset column Y
		    this.colYs = [];
		    for (var i = 0; i < this.cols; i++) {
		      this.colYs.push(0);
		    }
		    this.maxY = 0;
		    this.horizontalColIndex = 0;
		  };
		  proto.measureColumns = function () {
		    this.getContainerWidth();
		    // if columnWidth is 0, default to outerWidth of first item
		    if (!this.columnWidth) {
		      var firstItem = this.items[0];
		      var firstItemElem = firstItem && firstItem.element;
		      // columnWidth fall back to item of first element
		      this.columnWidth = firstItemElem && getSize(firstItemElem).outerWidth ||
		      // if first elem has no width, default to size of container
		      this.containerWidth;
		    }
		    var columnWidth = this.columnWidth += this.gutter;

		    // calculate columns
		    var containerWidth = this.containerWidth + this.gutter;
		    var cols = containerWidth / columnWidth;
		    // fix rounding errors, typically with gutters
		    var excess = columnWidth - containerWidth % columnWidth;
		    // if overshoot is less than a pixel, round up, otherwise floor it
		    var mathMethod = excess && excess < 1 ? 'round' : 'floor';
		    cols = Math[mathMethod](cols);
		    this.cols = Math.max(cols, 1);
		  };
		  proto.getContainerWidth = function () {
		    // container is parent if fit width
		    var isFitWidth = this._getOption('fitWidth');
		    var container = isFitWidth ? this.element.parentNode : this.element;
		    // check that this.size and size are there
		    // IE8 triggers resize on body size change, so they might not be
		    var size = getSize(container);
		    this.containerWidth = size && size.innerWidth;
		  };
		  proto._getItemLayoutPosition = function (item) {
		    item.getSize();
		    // how many columns does this brick span
		    var remainder = item.size.outerWidth % this.columnWidth;
		    var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
		    // round if off by 1 pixel, otherwise use ceil
		    var colSpan = Math[mathMethod](item.size.outerWidth / this.columnWidth);
		    colSpan = Math.min(colSpan, this.cols);
		    // use horizontal or top column position
		    var colPosMethod = this.options.horizontalOrder ? '_getHorizontalColPosition' : '_getTopColPosition';
		    var colPosition = this[colPosMethod](colSpan, item);
		    // position the brick
		    var position = {
		      x: this.columnWidth * colPosition.col,
		      y: colPosition.y
		    };
		    // apply setHeight to necessary columns
		    var setHeight = colPosition.y + item.size.outerHeight;
		    var setMax = colSpan + colPosition.col;
		    for (var i = colPosition.col; i < setMax; i++) {
		      this.colYs[i] = setHeight;
		    }
		    return position;
		  };
		  proto._getTopColPosition = function (colSpan) {
		    var colGroup = this._getTopColGroup(colSpan);
		    // get the minimum Y value from the columns
		    var minimumY = Math.min.apply(Math, colGroup);
		    return {
		      col: colGroup.indexOf(minimumY),
		      y: minimumY
		    };
		  };

		  /**
		   * @param {Number} colSpan - number of columns the element spans
		   * @returns {Array} colGroup
		   */
		  proto._getTopColGroup = function (colSpan) {
		    if (colSpan < 2) {
		      // if brick spans only one column, use all the column Ys
		      return this.colYs;
		    }
		    var colGroup = [];
		    // how many different places could this brick fit horizontally
		    var groupCount = this.cols + 1 - colSpan;
		    // for each group potential horizontal position
		    for (var i = 0; i < groupCount; i++) {
		      colGroup[i] = this._getColGroupY(i, colSpan);
		    }
		    return colGroup;
		  };
		  proto._getColGroupY = function (col, colSpan) {
		    if (colSpan < 2) {
		      return this.colYs[col];
		    }
		    // make an array of colY values for that one group
		    var groupColYs = this.colYs.slice(col, col + colSpan);
		    // and get the max value of the array
		    return Math.max.apply(Math, groupColYs);
		  };

		  // get column position based on horizontal index. #873
		  proto._getHorizontalColPosition = function (colSpan, item) {
		    var col = this.horizontalColIndex % this.cols;
		    var isOver = colSpan > 1 && col + colSpan > this.cols;
		    // shift to next row if item can't fit on current row
		    col = isOver ? 0 : col;
		    // don't let zero-size items take up space
		    var hasSize = item.size.outerWidth && item.size.outerHeight;
		    this.horizontalColIndex = hasSize ? col + colSpan : this.horizontalColIndex;
		    return {
		      col: col,
		      y: this._getColGroupY(col, colSpan)
		    };
		  };
		  proto._manageStamp = function (stamp) {
		    var stampSize = getSize(stamp);
		    var offset = this._getElementOffset(stamp);
		    // get the columns that this stamp affects
		    var isOriginLeft = this._getOption('originLeft');
		    var firstX = isOriginLeft ? offset.left : offset.right;
		    var lastX = firstX + stampSize.outerWidth;
		    var firstCol = Math.floor(firstX / this.columnWidth);
		    firstCol = Math.max(0, firstCol);
		    var lastCol = Math.floor(lastX / this.columnWidth);
		    // lastCol should not go over if multiple of columnWidth #425
		    lastCol -= lastX % this.columnWidth ? 0 : 1;
		    lastCol = Math.min(this.cols - 1, lastCol);
		    // set colYs to bottom of the stamp

		    var isOriginTop = this._getOption('originTop');
		    var stampMaxY = (isOriginTop ? offset.top : offset.bottom) + stampSize.outerHeight;
		    for (var i = firstCol; i <= lastCol; i++) {
		      this.colYs[i] = Math.max(stampMaxY, this.colYs[i]);
		    }
		  };
		  proto._getContainerSize = function () {
		    this.maxY = Math.max.apply(Math, this.colYs);
		    var size = {
		      height: this.maxY
		    };
		    if (this._getOption('fitWidth')) {
		      size.width = this._getContainerFitWidth();
		    }
		    return size;
		  };
		  proto._getContainerFitWidth = function () {
		    var unusedCols = 0;
		    // count unused columns
		    var i = this.cols;
		    while (--i) {
		      if (this.colYs[i] !== 0) {
		        break;
		      }
		      unusedCols++;
		    }
		    // fit container to columns that have been used
		    return (this.cols - unusedCols) * this.columnWidth - this.gutter;
		  };
		  proto.needsResizeLayout = function () {
		    var previousWidth = this.containerWidth;
		    this.getContainerWidth();
		    return previousWidth != this.containerWidth;
		  };
		  return Masonry;
		});
	} (masonry));

	/**
	 * Increase opacity of main navbar when the page is scrolled down
	 */
	document.addEventListener('scroll', () => {
	  var scrollDown = window.scrollY;
	  var navOverlay = document.querySelector('.nav-overlay');
	  navOverlay.style.opacity = ((1 - (400 - scrollDown) / 400) * 0.8 + 0.4).toString();
	});
	jQuery(document).ready(function () {
	  /**
	   * Setup Partner Carousel
	   */
	  jQuery('.partner-carousel').slick({
	    infinite: true,
	    arrows: false,
	    slidesToShow: 5,
	    slidesToScroll: 1,
	    autoplay: true,
	    autoplaySpeed: 1000,
	    centerMode: false,
	    responsive: [{
	      breakpoint: 992,
	      settings: {
	        slidesToShow: 3
	      }
	    }, {
	      breakpoint: 768,
	      settings: {
	        slidesToShow: 2
	      }
	    }, {
	      breakpoint: 576,
	      settings: {
	        slidesToShow: 1
	      }
	    }]
	  });

	  /**
	   * Setup Artist Carousel
	   */

	  jQuery('.artist-carousel').slick({
	    infinite: true,
	    slidesToShow: 5,
	    slidesToScroll: 1,
	    autoplay: true,
	    autoplaySpeed: 2000,
	    arrows: true,
	    dots: true,
	    responsive: [{
	      breakpoint: 992,
	      settings: {
	        slidesToShow: 3
	      }
	    }, {
	      breakpoint: 576,
	      settings: {
	        slidesToShow: 2
	      }
	    }]
	  });

	  /**
	   * Setup Testimony Carousel
	   */

	  jQuery('.testimony-carousel').slick({
	    infinite: true,
	    slidesToShow: 3,
	    slidesToScroll: 1,
	    autoplay: true,
	    autoplaySpeed: 6000,
	    arrows: true,
	    dots: true,
	    responsive: [{
	      breakpoint: 1200,
	      settings: {
	        slidesToShow: 2
	      }
	    }, {
	      breakpoint: 992,
	      settings: {
	        slidesToShow: 1
	      }
	    }]
	  });

	  /**
	   * Setup Photo Gallery Carousel
	   */
	  for (let i = 0; i < 30; i++) {
	    jQuery('.gallery-display-' + i).slick({
	      slidesToShow: 1,
	      slidesToScroll: 1,
	      arrows: false,
	      fade: true,
	      asNavFor: '.gallery-carousel-' + i
	    });
	    jQuery('.gallery-carousel-' + i).slick({
	      infinite: true,
	      slidesToShow: 9,
	      slidesToScroll: 1,
	      asNavFor: '.gallery-display-' + i,
	      centerMode: true,
	      focusOnSelect: true,
	      autoplay: true,
	      autoplaySpeed: 3000,
	      arrows: true,
	      responsive: [{
	        breakpoint: 992,
	        settings: {
	          slidesToShow: 7
	        }
	      }, {
	        breakpoint: 768,
	        settings: {
	          slidesToShow: 5
	        }
	      }, {
	        breakpoint: 576,
	        settings: {
	          slidesToShow: 3
	        }
	      }]
	    });
	    var galleryEL = document.getElementById('modal-gallery-' + i);
	    if (galleryEL) {
	      Modal.getOrCreateInstance(galleryEL);
	      galleryEL.addEventListener('shown.bs.modal', event => {
	        jQuery('.gallery-carousel-' + i).slick('setPosition');
	        jQuery('.gallery-display-' + i).slick('setPosition');
	      });
	    }
	  }

	  /**
	   * Setup Newspaper Carousel
	   */
	  jQuery('.newspaper-carousel').slick({
	    infinite: true,
	    arrows: true,
	    slidesToShow: 4,
	    slidesToScroll: 1,
	    autoplay: true,
	    autoplaySpeed: 5000,
	    responsive: [{
	      breakpoint: 1200,
	      settings: {
	        slidesToShow: 3
	      }
	    }, {
	      breakpoint: 768,
	      settings: {
	        slidesToShow: 2
	      }
	    }, {
	      breakpoint: 576,
	      settings: {
	        slidesToShow: 1
	      }
	    }]
	  });
	  jQuery('.home-carousel').slick({
	    infinite: true,
	    arrows: true,
	    slidesToShow: 1,
	    slidesToScroll: 1,
	    autoplay: true,
	    autoplaySpeed: 5000
	  });
	});

	/**
	 *  Update artist modal content depending on the artist link clicked 
	 */
	const artistModal = document.getElementById('artist-modal');
	if (artistModal) {
	  artistModal.addEventListener('show.bs.modal', event => {
	    // Button that triggered the modal
	    const button = event.relatedTarget;

	    // Extract info from data-bs-* attributes
	    const name = button.getAttribute('data-bs-name');
	    const image = button.getAttribute('data-bs-image');
	    const bio = button.getAttribute('data-bs-bio');
	    const youtube = button.getAttribute('data-bs-youtube');
	    const soundcloud = button.getAttribute('data-bs-soundcloud');
	    const spotify = button.getAttribute('data-bs-spotify');
	    const website = button.getAttribute('data-bs-website');

	    // Update the modal's content.
	    const modalTitle = artistModal.querySelector('#artist-modal-name');
	    const modalImage = artistModal.querySelector('#artist-modal-image');
	    const modalBio = artistModal.querySelector('#artist-modal-bio');
	    const modalYoutube = artistModal.querySelector('#artist-modal-youtube');
	    const aYoutube = artistModal.querySelector('#artist-modal-youtube>a');
	    const modalSoundcloud = artistModal.querySelector('#artist-modal-soundcloud');
	    const aSoundcloud = artistModal.querySelector('#artist-modal-soundcloud>a');
	    const modalSpotify = artistModal.querySelector('#artist-modal-spotify');
	    const aSpotify = artistModal.querySelector('#artist-modal-spotify>a');
	    const modalWebsite = artistModal.querySelector('#artist-modal-website');
	    const aWebsite = artistModal.querySelector('#artist-modal-website>a');
	    modalTitle.textContent = name;
	    modalImage.src = image;
	    modalBio.textContent = bio;
	    if (!youtube) {
	      modalYoutube.classList.add('d-none');
	    } else {
	      modalYoutube.classList.remove('d-none');
	    }
	    aYoutube.href = youtube;
	    if (!soundcloud) {
	      modalSoundcloud.classList.add('d-none');
	    } else {
	      modalSoundcloud.classList.remove('d-none');
	    }
	    aSoundcloud.href = soundcloud;
	    if (!spotify) {
	      modalSpotify.classList.add('d-none');
	    } else {
	      modalSpotify.classList.remove('d-none');
	    }
	    aSpotify.href = spotify;
	    if (!website) {
	      modalWebsite.classList.add('d-none');
	    } else {
	      modalWebsite.classList.remove('d-none');
	    }
	    aWebsite.href = website;
	  });
	}

	/**
	  *  Update photo modal content depending on the photo clicked 
	  */
	const photoModal = document.getElementById('photo-modal');
	if (photoModal) {
	  photoModal.addEventListener('show.bs.modal', event => {
	    // Button that triggered the modal
	    const button = event.relatedTarget;

	    // Extract info from data-bs-* attributes
	    const image = button.getAttribute('data-bs-image');

	    // Update the modal's content.
	    const modalImage = photoModal.querySelector('#photo-modal-image');
	    modalImage.src = image;
	  });
	}

	/**
	 * Smooth collapse toogle on mouseenter/mouselease for concert infos
	 */
	/* 
	const collapseElementList = document.querySelectorAll('.concert-infos');

	collapseElementList.forEach(collapseEl => {
	  let elId = collapseEl.id;
	  let triggerEl = document.querySelector('a[trigger-collapse="' + elId + '"]');
	  
	  
	  if(triggerEl) {
	    let bCollapseEl = bootstrap.Collapse.getOrCreateInstance(collapseEl,{ toggle: false });
	    
	    triggerEl.addEventListener(
	      "mouseenter",
	      (event) => {
	        bCollapseEl.show();
	      }
	    );

	    triggerEl.addEventListener(
	      "mouseleave",
	      (event) => {
	        bCollapseEl.hide();
	      }
	    );
	    
	  }
	});
	*/

	exports.Alert = alert;
	exports.Button = button;
	exports.Carousel = carousel;
	exports.Collapse = collapse;
	exports.Dropdown = dropdown;
	exports.Modal = Modal;
	exports.Offcanvas = offcanvas;
	exports.Popover = popover;
	exports.Scrollspy = scrollspy;
	exports.Tab = tab;
	exports.Toast = toast;
	exports.Tooltip = tooltip;

}));
//# sourceMappingURL=child-theme.js.map
