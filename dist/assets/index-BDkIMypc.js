function _mergeNamespaces(n2, m2) {
  for (var i = 0; i < m2.length; i++) {
    const e = m2[i];
    if (typeof e !== "string" && !Array.isArray(e)) {
      for (const k2 in e) {
        if (k2 !== "default" && !(k2 in n2)) {
          const d = Object.getOwnPropertyDescriptor(e, k2);
          if (d) {
            Object.defineProperty(n2, k2, d.get ? d : {
              enumerable: true,
              get: () => e[k2]
            });
          }
        }
      }
    }
  }
  return Object.freeze(Object.defineProperty(n2, Symbol.toStringTag, { value: "Module" }));
}
function getDefaultExportFromCjs(x2) {
  return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
}
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
var react = { exports: {} };
var react_production_min = {};
/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var l$1 = Symbol.for("react.element"), n$1 = Symbol.for("react.portal"), p$2 = Symbol.for("react.fragment"), q$1 = Symbol.for("react.strict_mode"), r = Symbol.for("react.profiler"), t = Symbol.for("react.provider"), u = Symbol.for("react.context"), v$1 = Symbol.for("react.forward_ref"), w = Symbol.for("react.suspense"), x = Symbol.for("react.memo"), y = Symbol.for("react.lazy"), z$1 = Symbol.iterator;
function A$1(a) {
  if (null === a || "object" !== typeof a) return null;
  a = z$1 && a[z$1] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var B$1 = { isMounted: function() {
  return false;
}, enqueueForceUpdate: function() {
}, enqueueReplaceState: function() {
}, enqueueSetState: function() {
} }, C$1 = Object.assign, D$1 = {};
function E$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
E$1.prototype.isReactComponent = {};
E$1.prototype.setState = function(a, b) {
  if ("object" !== typeof a && "function" !== typeof a && null != a) throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
  this.updater.enqueueSetState(this, a, b, "setState");
};
E$1.prototype.forceUpdate = function(a) {
  this.updater.enqueueForceUpdate(this, a, "forceUpdate");
};
function F() {
}
F.prototype = E$1.prototype;
function G$1(a, b, e) {
  this.props = a;
  this.context = b;
  this.refs = D$1;
  this.updater = e || B$1;
}
var H$1 = G$1.prototype = new F();
H$1.constructor = G$1;
C$1(H$1, E$1.prototype);
H$1.isPureReactComponent = true;
var I$1 = Array.isArray, J = Object.prototype.hasOwnProperty, K$1 = { current: null }, L$1 = { key: true, ref: true, __self: true, __source: true };
function M$1(a, b, e) {
  var d, c = {}, k2 = null, h = null;
  if (null != b) for (d in void 0 !== b.ref && (h = b.ref), void 0 !== b.key && (k2 = "" + b.key), b) J.call(b, d) && !L$1.hasOwnProperty(d) && (c[d] = b[d]);
  var g = arguments.length - 2;
  if (1 === g) c.children = e;
  else if (1 < g) {
    for (var f2 = Array(g), m2 = 0; m2 < g; m2++) f2[m2] = arguments[m2 + 2];
    c.children = f2;
  }
  if (a && a.defaultProps) for (d in g = a.defaultProps, g) void 0 === c[d] && (c[d] = g[d]);
  return { $$typeof: l$1, type: a, key: k2, ref: h, props: c, _owner: K$1.current };
}
function N$1(a, b) {
  return { $$typeof: l$1, type: a.type, key: b, ref: a.ref, props: a.props, _owner: a._owner };
}
function O$1(a) {
  return "object" === typeof a && null !== a && a.$$typeof === l$1;
}
function escape(a) {
  var b = { "=": "=0", ":": "=2" };
  return "$" + a.replace(/[=:]/g, function(a2) {
    return b[a2];
  });
}
var P$1 = /\/+/g;
function Q$1(a, b) {
  return "object" === typeof a && null !== a && null != a.key ? escape("" + a.key) : b.toString(36);
}
function R$1(a, b, e, d, c) {
  var k2 = typeof a;
  if ("undefined" === k2 || "boolean" === k2) a = null;
  var h = false;
  if (null === a) h = true;
  else switch (k2) {
    case "string":
    case "number":
      h = true;
      break;
    case "object":
      switch (a.$$typeof) {
        case l$1:
        case n$1:
          h = true;
      }
  }
  if (h) return h = a, c = c(h), a = "" === d ? "." + Q$1(h, 0) : d, I$1(c) ? (e = "", null != a && (e = a.replace(P$1, "$&/") + "/"), R$1(c, b, e, "", function(a2) {
    return a2;
  })) : null != c && (O$1(c) && (c = N$1(c, e + (!c.key || h && h.key === c.key ? "" : ("" + c.key).replace(P$1, "$&/") + "/") + a)), b.push(c)), 1;
  h = 0;
  d = "" === d ? "." : d + ":";
  if (I$1(a)) for (var g = 0; g < a.length; g++) {
    k2 = a[g];
    var f2 = d + Q$1(k2, g);
    h += R$1(k2, b, e, f2, c);
  }
  else if (f2 = A$1(a), "function" === typeof f2) for (a = f2.call(a), g = 0; !(k2 = a.next()).done; ) k2 = k2.value, f2 = d + Q$1(k2, g++), h += R$1(k2, b, e, f2, c);
  else if ("object" === k2) throw b = String(a), Error("Objects are not valid as a React child (found: " + ("[object Object]" === b ? "object with keys {" + Object.keys(a).join(", ") + "}" : b) + "). If you meant to render a collection of children, use an array instead.");
  return h;
}
function S$1(a, b, e) {
  if (null == a) return a;
  var d = [], c = 0;
  R$1(a, d, "", "", function(a2) {
    return b.call(e, a2, c++);
  });
  return d;
}
function T$1(a) {
  if (-1 === a._status) {
    var b = a._result;
    b = b();
    b.then(function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 1, a._result = b2;
    }, function(b2) {
      if (0 === a._status || -1 === a._status) a._status = 2, a._result = b2;
    });
    -1 === a._status && (a._status = 0, a._result = b);
  }
  if (1 === a._status) return a._result.default;
  throw a._result;
}
var U$1 = { current: null }, V$1 = { transition: null }, W$1 = { ReactCurrentDispatcher: U$1, ReactCurrentBatchConfig: V$1, ReactCurrentOwner: K$1 };
function X$2() {
  throw Error("act(...) is not supported in production builds of React.");
}
react_production_min.Children = { map: S$1, forEach: function(a, b, e) {
  S$1(a, function() {
    b.apply(this, arguments);
  }, e);
}, count: function(a) {
  var b = 0;
  S$1(a, function() {
    b++;
  });
  return b;
}, toArray: function(a) {
  return S$1(a, function(a2) {
    return a2;
  }) || [];
}, only: function(a) {
  if (!O$1(a)) throw Error("React.Children.only expected to receive a single React element child.");
  return a;
} };
react_production_min.Component = E$1;
react_production_min.Fragment = p$2;
react_production_min.Profiler = r;
react_production_min.PureComponent = G$1;
react_production_min.StrictMode = q$1;
react_production_min.Suspense = w;
react_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = W$1;
react_production_min.act = X$2;
react_production_min.cloneElement = function(a, b, e) {
  if (null === a || void 0 === a) throw Error("React.cloneElement(...): The argument must be a React element, but you passed " + a + ".");
  var d = C$1({}, a.props), c = a.key, k2 = a.ref, h = a._owner;
  if (null != b) {
    void 0 !== b.ref && (k2 = b.ref, h = K$1.current);
    void 0 !== b.key && (c = "" + b.key);
    if (a.type && a.type.defaultProps) var g = a.type.defaultProps;
    for (f2 in b) J.call(b, f2) && !L$1.hasOwnProperty(f2) && (d[f2] = void 0 === b[f2] && void 0 !== g ? g[f2] : b[f2]);
  }
  var f2 = arguments.length - 2;
  if (1 === f2) d.children = e;
  else if (1 < f2) {
    g = Array(f2);
    for (var m2 = 0; m2 < f2; m2++) g[m2] = arguments[m2 + 2];
    d.children = g;
  }
  return { $$typeof: l$1, type: a.type, key: c, ref: k2, props: d, _owner: h };
};
react_production_min.createContext = function(a) {
  a = { $$typeof: u, _currentValue: a, _currentValue2: a, _threadCount: 0, Provider: null, Consumer: null, _defaultValue: null, _globalName: null };
  a.Provider = { $$typeof: t, _context: a };
  return a.Consumer = a;
};
react_production_min.createElement = M$1;
react_production_min.createFactory = function(a) {
  var b = M$1.bind(null, a);
  b.type = a;
  return b;
};
react_production_min.createRef = function() {
  return { current: null };
};
react_production_min.forwardRef = function(a) {
  return { $$typeof: v$1, render: a };
};
react_production_min.isValidElement = O$1;
react_production_min.lazy = function(a) {
  return { $$typeof: y, _payload: { _status: -1, _result: a }, _init: T$1 };
};
react_production_min.memo = function(a, b) {
  return { $$typeof: x, type: a, compare: void 0 === b ? null : b };
};
react_production_min.startTransition = function(a) {
  var b = V$1.transition;
  V$1.transition = {};
  try {
    a();
  } finally {
    V$1.transition = b;
  }
};
react_production_min.unstable_act = X$2;
react_production_min.useCallback = function(a, b) {
  return U$1.current.useCallback(a, b);
};
react_production_min.useContext = function(a) {
  return U$1.current.useContext(a);
};
react_production_min.useDebugValue = function() {
};
react_production_min.useDeferredValue = function(a) {
  return U$1.current.useDeferredValue(a);
};
react_production_min.useEffect = function(a, b) {
  return U$1.current.useEffect(a, b);
};
react_production_min.useId = function() {
  return U$1.current.useId();
};
react_production_min.useImperativeHandle = function(a, b, e) {
  return U$1.current.useImperativeHandle(a, b, e);
};
react_production_min.useInsertionEffect = function(a, b) {
  return U$1.current.useInsertionEffect(a, b);
};
react_production_min.useLayoutEffect = function(a, b) {
  return U$1.current.useLayoutEffect(a, b);
};
react_production_min.useMemo = function(a, b) {
  return U$1.current.useMemo(a, b);
};
react_production_min.useReducer = function(a, b, e) {
  return U$1.current.useReducer(a, b, e);
};
react_production_min.useRef = function(a) {
  return U$1.current.useRef(a);
};
react_production_min.useState = function(a) {
  return U$1.current.useState(a);
};
react_production_min.useSyncExternalStore = function(a, b, e) {
  return U$1.current.useSyncExternalStore(a, b, e);
};
react_production_min.useTransition = function() {
  return U$1.current.useTransition();
};
react_production_min.version = "18.3.1";
{
  react.exports = react_production_min;
}
var reactExports = react.exports;
const React = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
const React$1 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: React
}, [reactExports]);
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p$1 = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a) m$1.call(a, b) && !p$1.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var reactDom = { exports: {} };
var reactDom_production_min = {};
var scheduler = { exports: {} };
var scheduler_production_min = {};
/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
(function(exports) {
  function f2(a, b) {
    var c = a.length;
    a.push(b);
    a: for (; 0 < c; ) {
      var d = c - 1 >>> 1, e = a[d];
      if (0 < g(e, b)) a[d] = b, a[c] = e, c = d;
      else break a;
    }
  }
  function h(a) {
    return 0 === a.length ? null : a[0];
  }
  function k2(a) {
    if (0 === a.length) return null;
    var b = a[0], c = a.pop();
    if (c !== b) {
      a[0] = c;
      a: for (var d = 0, e = a.length, w2 = e >>> 1; d < w2; ) {
        var m2 = 2 * (d + 1) - 1, C2 = a[m2], n2 = m2 + 1, x2 = a[n2];
        if (0 > g(C2, c)) n2 < e && 0 > g(x2, C2) ? (a[d] = x2, a[n2] = c, d = n2) : (a[d] = C2, a[m2] = c, d = m2);
        else if (n2 < e && 0 > g(x2, c)) a[d] = x2, a[n2] = c, d = n2;
        else break a;
      }
    }
    return b;
  }
  function g(a, b) {
    var c = a.sortIndex - b.sortIndex;
    return 0 !== c ? c : a.id - b.id;
  }
  if ("object" === typeof performance && "function" === typeof performance.now) {
    var l2 = performance;
    exports.unstable_now = function() {
      return l2.now();
    };
  } else {
    var p2 = Date, q2 = p2.now();
    exports.unstable_now = function() {
      return p2.now() - q2;
    };
  }
  var r2 = [], t2 = [], u2 = 1, v2 = null, y2 = 3, z2 = false, A2 = false, B2 = false, D2 = "function" === typeof setTimeout ? setTimeout : null, E2 = "function" === typeof clearTimeout ? clearTimeout : null, F2 = "undefined" !== typeof setImmediate ? setImmediate : null;
  "undefined" !== typeof navigator && void 0 !== navigator.scheduling && void 0 !== navigator.scheduling.isInputPending && navigator.scheduling.isInputPending.bind(navigator.scheduling);
  function G2(a) {
    for (var b = h(t2); null !== b; ) {
      if (null === b.callback) k2(t2);
      else if (b.startTime <= a) k2(t2), b.sortIndex = b.expirationTime, f2(r2, b);
      else break;
      b = h(t2);
    }
  }
  function H2(a) {
    B2 = false;
    G2(a);
    if (!A2) if (null !== h(r2)) A2 = true, I2(J2);
    else {
      var b = h(t2);
      null !== b && K2(H2, b.startTime - a);
    }
  }
  function J2(a, b) {
    A2 = false;
    B2 && (B2 = false, E2(L2), L2 = -1);
    z2 = true;
    var c = y2;
    try {
      G2(b);
      for (v2 = h(r2); null !== v2 && (!(v2.expirationTime > b) || a && !M2()); ) {
        var d = v2.callback;
        if ("function" === typeof d) {
          v2.callback = null;
          y2 = v2.priorityLevel;
          var e = d(v2.expirationTime <= b);
          b = exports.unstable_now();
          "function" === typeof e ? v2.callback = e : v2 === h(r2) && k2(r2);
          G2(b);
        } else k2(r2);
        v2 = h(r2);
      }
      if (null !== v2) var w2 = true;
      else {
        var m2 = h(t2);
        null !== m2 && K2(H2, m2.startTime - b);
        w2 = false;
      }
      return w2;
    } finally {
      v2 = null, y2 = c, z2 = false;
    }
  }
  var N2 = false, O2 = null, L2 = -1, P2 = 5, Q2 = -1;
  function M2() {
    return exports.unstable_now() - Q2 < P2 ? false : true;
  }
  function R2() {
    if (null !== O2) {
      var a = exports.unstable_now();
      Q2 = a;
      var b = true;
      try {
        b = O2(true, a);
      } finally {
        b ? S2() : (N2 = false, O2 = null);
      }
    } else N2 = false;
  }
  var S2;
  if ("function" === typeof F2) S2 = function() {
    F2(R2);
  };
  else if ("undefined" !== typeof MessageChannel) {
    var T2 = new MessageChannel(), U2 = T2.port2;
    T2.port1.onmessage = R2;
    S2 = function() {
      U2.postMessage(null);
    };
  } else S2 = function() {
    D2(R2, 0);
  };
  function I2(a) {
    O2 = a;
    N2 || (N2 = true, S2());
  }
  function K2(a, b) {
    L2 = D2(function() {
      a(exports.unstable_now());
    }, b);
  }
  exports.unstable_IdlePriority = 5;
  exports.unstable_ImmediatePriority = 1;
  exports.unstable_LowPriority = 4;
  exports.unstable_NormalPriority = 3;
  exports.unstable_Profiling = null;
  exports.unstable_UserBlockingPriority = 2;
  exports.unstable_cancelCallback = function(a) {
    a.callback = null;
  };
  exports.unstable_continueExecution = function() {
    A2 || z2 || (A2 = true, I2(J2));
  };
  exports.unstable_forceFrameRate = function(a) {
    0 > a || 125 < a ? console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported") : P2 = 0 < a ? Math.floor(1e3 / a) : 5;
  };
  exports.unstable_getCurrentPriorityLevel = function() {
    return y2;
  };
  exports.unstable_getFirstCallbackNode = function() {
    return h(r2);
  };
  exports.unstable_next = function(a) {
    switch (y2) {
      case 1:
      case 2:
      case 3:
        var b = 3;
        break;
      default:
        b = y2;
    }
    var c = y2;
    y2 = b;
    try {
      return a();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_pauseExecution = function() {
  };
  exports.unstable_requestPaint = function() {
  };
  exports.unstable_runWithPriority = function(a, b) {
    switch (a) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
        break;
      default:
        a = 3;
    }
    var c = y2;
    y2 = a;
    try {
      return b();
    } finally {
      y2 = c;
    }
  };
  exports.unstable_scheduleCallback = function(a, b, c) {
    var d = exports.unstable_now();
    "object" === typeof c && null !== c ? (c = c.delay, c = "number" === typeof c && 0 < c ? d + c : d) : c = d;
    switch (a) {
      case 1:
        var e = -1;
        break;
      case 2:
        e = 250;
        break;
      case 5:
        e = 1073741823;
        break;
      case 4:
        e = 1e4;
        break;
      default:
        e = 5e3;
    }
    e = c + e;
    a = { id: u2++, callback: b, priorityLevel: a, startTime: c, expirationTime: e, sortIndex: -1 };
    c > d ? (a.sortIndex = c, f2(t2, a), null === h(r2) && a === h(t2) && (B2 ? (E2(L2), L2 = -1) : B2 = true, K2(H2, c - d))) : (a.sortIndex = e, f2(r2, a), A2 || z2 || (A2 = true, I2(J2)));
    return a;
  };
  exports.unstable_shouldYield = M2;
  exports.unstable_wrapCallback = function(a) {
    var b = y2;
    return function() {
      var c = y2;
      y2 = b;
      try {
        return a.apply(this, arguments);
      } finally {
        y2 = c;
      }
    };
  };
})(scheduler_production_min);
{
  scheduler.exports = scheduler_production_min;
}
var schedulerExports = scheduler.exports;
/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var aa = reactExports, ca = schedulerExports;
function p(a) {
  for (var b = "https://reactjs.org/docs/error-decoder.html?invariant=" + a, c = 1; c < arguments.length; c++) b += "&args[]=" + encodeURIComponent(arguments[c]);
  return "Minified React error #" + a + "; visit " + b + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
}
var da = /* @__PURE__ */ new Set(), ea = {};
function fa(a, b) {
  ha(a, b);
  ha(a + "Capture", b);
}
function ha(a, b) {
  ea[a] = b;
  for (a = 0; a < b.length; a++) da.add(b[a]);
}
var ia = !("undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement), ja = Object.prototype.hasOwnProperty, ka = /^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/, la = {}, ma = {};
function oa(a) {
  if (ja.call(ma, a)) return true;
  if (ja.call(la, a)) return false;
  if (ka.test(a)) return ma[a] = true;
  la[a] = true;
  return false;
}
function pa(a, b, c, d) {
  if (null !== c && 0 === c.type) return false;
  switch (typeof b) {
    case "function":
    case "symbol":
      return true;
    case "boolean":
      if (d) return false;
      if (null !== c) return !c.acceptsBooleans;
      a = a.toLowerCase().slice(0, 5);
      return "data-" !== a && "aria-" !== a;
    default:
      return false;
  }
}
function qa(a, b, c, d) {
  if (null === b || "undefined" === typeof b || pa(a, b, c, d)) return true;
  if (d) return false;
  if (null !== c) switch (c.type) {
    case 3:
      return !b;
    case 4:
      return false === b;
    case 5:
      return isNaN(b);
    case 6:
      return isNaN(b) || 1 > b;
  }
  return false;
}
function v(a, b, c, d, e, f2, g) {
  this.acceptsBooleans = 2 === b || 3 === b || 4 === b;
  this.attributeName = d;
  this.attributeNamespace = e;
  this.mustUseProperty = c;
  this.propertyName = a;
  this.type = b;
  this.sanitizeURL = f2;
  this.removeEmptyString = g;
}
var z = {};
"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(a) {
  z[a] = new v(a, 0, false, a, null, false, false);
});
[["acceptCharset", "accept-charset"], ["className", "class"], ["htmlFor", "for"], ["httpEquiv", "http-equiv"]].forEach(function(a) {
  var b = a[0];
  z[b] = new v(b, 1, false, a[1], null, false, false);
});
["contentEditable", "draggable", "spellCheck", "value"].forEach(function(a) {
  z[a] = new v(a, 2, false, a.toLowerCase(), null, false, false);
});
["autoReverse", "externalResourcesRequired", "focusable", "preserveAlpha"].forEach(function(a) {
  z[a] = new v(a, 2, false, a, null, false, false);
});
"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(a) {
  z[a] = new v(a, 3, false, a.toLowerCase(), null, false, false);
});
["checked", "multiple", "muted", "selected"].forEach(function(a) {
  z[a] = new v(a, 3, true, a, null, false, false);
});
["capture", "download"].forEach(function(a) {
  z[a] = new v(a, 4, false, a, null, false, false);
});
["cols", "rows", "size", "span"].forEach(function(a) {
  z[a] = new v(a, 6, false, a, null, false, false);
});
["rowSpan", "start"].forEach(function(a) {
  z[a] = new v(a, 5, false, a.toLowerCase(), null, false, false);
});
var ra = /[\-:]([a-z])/g;
function sa(a) {
  return a[1].toUpperCase();
}
"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(a) {
  var b = a.replace(
    ra,
    sa
  );
  z[b] = new v(b, 1, false, a, null, false, false);
});
"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/1999/xlink", false, false);
});
["xml:base", "xml:lang", "xml:space"].forEach(function(a) {
  var b = a.replace(ra, sa);
  z[b] = new v(b, 1, false, a, "http://www.w3.org/XML/1998/namespace", false, false);
});
["tabIndex", "crossOrigin"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, false, false);
});
z.xlinkHref = new v("xlinkHref", 1, false, "xlink:href", "http://www.w3.org/1999/xlink", true, false);
["src", "href", "action", "formAction"].forEach(function(a) {
  z[a] = new v(a, 1, false, a.toLowerCase(), null, true, true);
});
function ta(a, b, c, d) {
  var e = z.hasOwnProperty(b) ? z[b] : null;
  if (null !== e ? 0 !== e.type : d || !(2 < b.length) || "o" !== b[0] && "O" !== b[0] || "n" !== b[1] && "N" !== b[1]) qa(b, c, e, d) && (c = null), d || null === e ? oa(b) && (null === c ? a.removeAttribute(b) : a.setAttribute(b, "" + c)) : e.mustUseProperty ? a[e.propertyName] = null === c ? 3 === e.type ? false : "" : c : (b = e.attributeName, d = e.attributeNamespace, null === c ? a.removeAttribute(b) : (e = e.type, c = 3 === e || 4 === e && true === c ? "" : "" + c, d ? a.setAttributeNS(d, b, c) : a.setAttribute(b, c)));
}
var ua = aa.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, va = Symbol.for("react.element"), wa = Symbol.for("react.portal"), ya = Symbol.for("react.fragment"), za = Symbol.for("react.strict_mode"), Aa = Symbol.for("react.profiler"), Ba = Symbol.for("react.provider"), Ca = Symbol.for("react.context"), Da = Symbol.for("react.forward_ref"), Ea = Symbol.for("react.suspense"), Fa = Symbol.for("react.suspense_list"), Ga = Symbol.for("react.memo"), Ha = Symbol.for("react.lazy");
var Ia = Symbol.for("react.offscreen");
var Ja = Symbol.iterator;
function Ka(a) {
  if (null === a || "object" !== typeof a) return null;
  a = Ja && a[Ja] || a["@@iterator"];
  return "function" === typeof a ? a : null;
}
var A = Object.assign, La;
function Ma(a) {
  if (void 0 === La) try {
    throw Error();
  } catch (c) {
    var b = c.stack.trim().match(/\n( *(at )?)/);
    La = b && b[1] || "";
  }
  return "\n" + La + a;
}
var Na = false;
function Oa(a, b) {
  if (!a || Na) return "";
  Na = true;
  var c = Error.prepareStackTrace;
  Error.prepareStackTrace = void 0;
  try {
    if (b) if (b = function() {
      throw Error();
    }, Object.defineProperty(b.prototype, "props", { set: function() {
      throw Error();
    } }), "object" === typeof Reflect && Reflect.construct) {
      try {
        Reflect.construct(b, []);
      } catch (l2) {
        var d = l2;
      }
      Reflect.construct(a, [], b);
    } else {
      try {
        b.call();
      } catch (l2) {
        d = l2;
      }
      a.call(b.prototype);
    }
    else {
      try {
        throw Error();
      } catch (l2) {
        d = l2;
      }
      a();
    }
  } catch (l2) {
    if (l2 && d && "string" === typeof l2.stack) {
      for (var e = l2.stack.split("\n"), f2 = d.stack.split("\n"), g = e.length - 1, h = f2.length - 1; 1 <= g && 0 <= h && e[g] !== f2[h]; ) h--;
      for (; 1 <= g && 0 <= h; g--, h--) if (e[g] !== f2[h]) {
        if (1 !== g || 1 !== h) {
          do
            if (g--, h--, 0 > h || e[g] !== f2[h]) {
              var k2 = "\n" + e[g].replace(" at new ", " at ");
              a.displayName && k2.includes("<anonymous>") && (k2 = k2.replace("<anonymous>", a.displayName));
              return k2;
            }
          while (1 <= g && 0 <= h);
        }
        break;
      }
    }
  } finally {
    Na = false, Error.prepareStackTrace = c;
  }
  return (a = a ? a.displayName || a.name : "") ? Ma(a) : "";
}
function Pa(a) {
  switch (a.tag) {
    case 5:
      return Ma(a.type);
    case 16:
      return Ma("Lazy");
    case 13:
      return Ma("Suspense");
    case 19:
      return Ma("SuspenseList");
    case 0:
    case 2:
    case 15:
      return a = Oa(a.type, false), a;
    case 11:
      return a = Oa(a.type.render, false), a;
    case 1:
      return a = Oa(a.type, true), a;
    default:
      return "";
  }
}
function Qa(a) {
  if (null == a) return null;
  if ("function" === typeof a) return a.displayName || a.name || null;
  if ("string" === typeof a) return a;
  switch (a) {
    case ya:
      return "Fragment";
    case wa:
      return "Portal";
    case Aa:
      return "Profiler";
    case za:
      return "StrictMode";
    case Ea:
      return "Suspense";
    case Fa:
      return "SuspenseList";
  }
  if ("object" === typeof a) switch (a.$$typeof) {
    case Ca:
      return (a.displayName || "Context") + ".Consumer";
    case Ba:
      return (a._context.displayName || "Context") + ".Provider";
    case Da:
      var b = a.render;
      a = a.displayName;
      a || (a = b.displayName || b.name || "", a = "" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
      return a;
    case Ga:
      return b = a.displayName || null, null !== b ? b : Qa(a.type) || "Memo";
    case Ha:
      b = a._payload;
      a = a._init;
      try {
        return Qa(a(b));
      } catch (c) {
      }
  }
  return null;
}
function Ra(a) {
  var b = a.type;
  switch (a.tag) {
    case 24:
      return "Cache";
    case 9:
      return (b.displayName || "Context") + ".Consumer";
    case 10:
      return (b._context.displayName || "Context") + ".Provider";
    case 18:
      return "DehydratedFragment";
    case 11:
      return a = b.render, a = a.displayName || a.name || "", b.displayName || ("" !== a ? "ForwardRef(" + a + ")" : "ForwardRef");
    case 7:
      return "Fragment";
    case 5:
      return b;
    case 4:
      return "Portal";
    case 3:
      return "Root";
    case 6:
      return "Text";
    case 16:
      return Qa(b);
    case 8:
      return b === za ? "StrictMode" : "Mode";
    case 22:
      return "Offscreen";
    case 12:
      return "Profiler";
    case 21:
      return "Scope";
    case 13:
      return "Suspense";
    case 19:
      return "SuspenseList";
    case 25:
      return "TracingMarker";
    case 1:
    case 0:
    case 17:
    case 2:
    case 14:
    case 15:
      if ("function" === typeof b) return b.displayName || b.name || null;
      if ("string" === typeof b) return b;
  }
  return null;
}
function Sa(a) {
  switch (typeof a) {
    case "boolean":
    case "number":
    case "string":
    case "undefined":
      return a;
    case "object":
      return a;
    default:
      return "";
  }
}
function Ta(a) {
  var b = a.type;
  return (a = a.nodeName) && "input" === a.toLowerCase() && ("checkbox" === b || "radio" === b);
}
function Ua(a) {
  var b = Ta(a) ? "checked" : "value", c = Object.getOwnPropertyDescriptor(a.constructor.prototype, b), d = "" + a[b];
  if (!a.hasOwnProperty(b) && "undefined" !== typeof c && "function" === typeof c.get && "function" === typeof c.set) {
    var e = c.get, f2 = c.set;
    Object.defineProperty(a, b, { configurable: true, get: function() {
      return e.call(this);
    }, set: function(a2) {
      d = "" + a2;
      f2.call(this, a2);
    } });
    Object.defineProperty(a, b, { enumerable: c.enumerable });
    return { getValue: function() {
      return d;
    }, setValue: function(a2) {
      d = "" + a2;
    }, stopTracking: function() {
      a._valueTracker = null;
      delete a[b];
    } };
  }
}
function Va(a) {
  a._valueTracker || (a._valueTracker = Ua(a));
}
function Wa(a) {
  if (!a) return false;
  var b = a._valueTracker;
  if (!b) return true;
  var c = b.getValue();
  var d = "";
  a && (d = Ta(a) ? a.checked ? "true" : "false" : a.value);
  a = d;
  return a !== c ? (b.setValue(a), true) : false;
}
function Xa(a) {
  a = a || ("undefined" !== typeof document ? document : void 0);
  if ("undefined" === typeof a) return null;
  try {
    return a.activeElement || a.body;
  } catch (b) {
    return a.body;
  }
}
function Ya(a, b) {
  var c = b.checked;
  return A({}, b, { defaultChecked: void 0, defaultValue: void 0, value: void 0, checked: null != c ? c : a._wrapperState.initialChecked });
}
function Za(a, b) {
  var c = null == b.defaultValue ? "" : b.defaultValue, d = null != b.checked ? b.checked : b.defaultChecked;
  c = Sa(null != b.value ? b.value : c);
  a._wrapperState = { initialChecked: d, initialValue: c, controlled: "checkbox" === b.type || "radio" === b.type ? null != b.checked : null != b.value };
}
function ab(a, b) {
  b = b.checked;
  null != b && ta(a, "checked", b, false);
}
function bb(a, b) {
  ab(a, b);
  var c = Sa(b.value), d = b.type;
  if (null != c) if ("number" === d) {
    if (0 === c && "" === a.value || a.value != c) a.value = "" + c;
  } else a.value !== "" + c && (a.value = "" + c);
  else if ("submit" === d || "reset" === d) {
    a.removeAttribute("value");
    return;
  }
  b.hasOwnProperty("value") ? cb(a, b.type, c) : b.hasOwnProperty("defaultValue") && cb(a, b.type, Sa(b.defaultValue));
  null == b.checked && null != b.defaultChecked && (a.defaultChecked = !!b.defaultChecked);
}
function db(a, b, c) {
  if (b.hasOwnProperty("value") || b.hasOwnProperty("defaultValue")) {
    var d = b.type;
    if (!("submit" !== d && "reset" !== d || void 0 !== b.value && null !== b.value)) return;
    b = "" + a._wrapperState.initialValue;
    c || b === a.value || (a.value = b);
    a.defaultValue = b;
  }
  c = a.name;
  "" !== c && (a.name = "");
  a.defaultChecked = !!a._wrapperState.initialChecked;
  "" !== c && (a.name = c);
}
function cb(a, b, c) {
  if ("number" !== b || Xa(a.ownerDocument) !== a) null == c ? a.defaultValue = "" + a._wrapperState.initialValue : a.defaultValue !== "" + c && (a.defaultValue = "" + c);
}
var eb = Array.isArray;
function fb(a, b, c, d) {
  a = a.options;
  if (b) {
    b = {};
    for (var e = 0; e < c.length; e++) b["$" + c[e]] = true;
    for (c = 0; c < a.length; c++) e = b.hasOwnProperty("$" + a[c].value), a[c].selected !== e && (a[c].selected = e), e && d && (a[c].defaultSelected = true);
  } else {
    c = "" + Sa(c);
    b = null;
    for (e = 0; e < a.length; e++) {
      if (a[e].value === c) {
        a[e].selected = true;
        d && (a[e].defaultSelected = true);
        return;
      }
      null !== b || a[e].disabled || (b = a[e]);
    }
    null !== b && (b.selected = true);
  }
}
function gb(a, b) {
  if (null != b.dangerouslySetInnerHTML) throw Error(p(91));
  return A({}, b, { value: void 0, defaultValue: void 0, children: "" + a._wrapperState.initialValue });
}
function hb(a, b) {
  var c = b.value;
  if (null == c) {
    c = b.children;
    b = b.defaultValue;
    if (null != c) {
      if (null != b) throw Error(p(92));
      if (eb(c)) {
        if (1 < c.length) throw Error(p(93));
        c = c[0];
      }
      b = c;
    }
    null == b && (b = "");
    c = b;
  }
  a._wrapperState = { initialValue: Sa(c) };
}
function ib(a, b) {
  var c = Sa(b.value), d = Sa(b.defaultValue);
  null != c && (c = "" + c, c !== a.value && (a.value = c), null == b.defaultValue && a.defaultValue !== c && (a.defaultValue = c));
  null != d && (a.defaultValue = "" + d);
}
function jb(a) {
  var b = a.textContent;
  b === a._wrapperState.initialValue && "" !== b && null !== b && (a.value = b);
}
function kb(a) {
  switch (a) {
    case "svg":
      return "http://www.w3.org/2000/svg";
    case "math":
      return "http://www.w3.org/1998/Math/MathML";
    default:
      return "http://www.w3.org/1999/xhtml";
  }
}
function lb(a, b) {
  return null == a || "http://www.w3.org/1999/xhtml" === a ? kb(b) : "http://www.w3.org/2000/svg" === a && "foreignObject" === b ? "http://www.w3.org/1999/xhtml" : a;
}
var mb, nb = function(a) {
  return "undefined" !== typeof MSApp && MSApp.execUnsafeLocalFunction ? function(b, c, d, e) {
    MSApp.execUnsafeLocalFunction(function() {
      return a(b, c, d, e);
    });
  } : a;
}(function(a, b) {
  if ("http://www.w3.org/2000/svg" !== a.namespaceURI || "innerHTML" in a) a.innerHTML = b;
  else {
    mb = mb || document.createElement("div");
    mb.innerHTML = "<svg>" + b.valueOf().toString() + "</svg>";
    for (b = mb.firstChild; a.firstChild; ) a.removeChild(a.firstChild);
    for (; b.firstChild; ) a.appendChild(b.firstChild);
  }
});
function ob(a, b) {
  if (b) {
    var c = a.firstChild;
    if (c && c === a.lastChild && 3 === c.nodeType) {
      c.nodeValue = b;
      return;
    }
  }
  a.textContent = b;
}
var pb = {
  animationIterationCount: true,
  aspectRatio: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridArea: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true
}, qb = ["Webkit", "ms", "Moz", "O"];
Object.keys(pb).forEach(function(a) {
  qb.forEach(function(b) {
    b = b + a.charAt(0).toUpperCase() + a.substring(1);
    pb[b] = pb[a];
  });
});
function rb(a, b, c) {
  return null == b || "boolean" === typeof b || "" === b ? "" : c || "number" !== typeof b || 0 === b || pb.hasOwnProperty(a) && pb[a] ? ("" + b).trim() : b + "px";
}
function sb(a, b) {
  a = a.style;
  for (var c in b) if (b.hasOwnProperty(c)) {
    var d = 0 === c.indexOf("--"), e = rb(c, b[c], d);
    "float" === c && (c = "cssFloat");
    d ? a.setProperty(c, e) : a[c] = e;
  }
}
var tb = A({ menuitem: true }, { area: true, base: true, br: true, col: true, embed: true, hr: true, img: true, input: true, keygen: true, link: true, meta: true, param: true, source: true, track: true, wbr: true });
function ub(a, b) {
  if (b) {
    if (tb[a] && (null != b.children || null != b.dangerouslySetInnerHTML)) throw Error(p(137, a));
    if (null != b.dangerouslySetInnerHTML) {
      if (null != b.children) throw Error(p(60));
      if ("object" !== typeof b.dangerouslySetInnerHTML || !("__html" in b.dangerouslySetInnerHTML)) throw Error(p(61));
    }
    if (null != b.style && "object" !== typeof b.style) throw Error(p(62));
  }
}
function vb(a, b) {
  if (-1 === a.indexOf("-")) return "string" === typeof b.is;
  switch (a) {
    case "annotation-xml":
    case "color-profile":
    case "font-face":
    case "font-face-src":
    case "font-face-uri":
    case "font-face-format":
    case "font-face-name":
    case "missing-glyph":
      return false;
    default:
      return true;
  }
}
var wb = null;
function xb(a) {
  a = a.target || a.srcElement || window;
  a.correspondingUseElement && (a = a.correspondingUseElement);
  return 3 === a.nodeType ? a.parentNode : a;
}
var yb = null, zb = null, Ab = null;
function Bb(a) {
  if (a = Cb(a)) {
    if ("function" !== typeof yb) throw Error(p(280));
    var b = a.stateNode;
    b && (b = Db(b), yb(a.stateNode, a.type, b));
  }
}
function Eb(a) {
  zb ? Ab ? Ab.push(a) : Ab = [a] : zb = a;
}
function Fb() {
  if (zb) {
    var a = zb, b = Ab;
    Ab = zb = null;
    Bb(a);
    if (b) for (a = 0; a < b.length; a++) Bb(b[a]);
  }
}
function Gb(a, b) {
  return a(b);
}
function Hb() {
}
var Ib = false;
function Jb(a, b, c) {
  if (Ib) return a(b, c);
  Ib = true;
  try {
    return Gb(a, b, c);
  } finally {
    if (Ib = false, null !== zb || null !== Ab) Hb(), Fb();
  }
}
function Kb(a, b) {
  var c = a.stateNode;
  if (null === c) return null;
  var d = Db(c);
  if (null === d) return null;
  c = d[b];
  a: switch (b) {
    case "onClick":
    case "onClickCapture":
    case "onDoubleClick":
    case "onDoubleClickCapture":
    case "onMouseDown":
    case "onMouseDownCapture":
    case "onMouseMove":
    case "onMouseMoveCapture":
    case "onMouseUp":
    case "onMouseUpCapture":
    case "onMouseEnter":
      (d = !d.disabled) || (a = a.type, d = !("button" === a || "input" === a || "select" === a || "textarea" === a));
      a = !d;
      break a;
    default:
      a = false;
  }
  if (a) return null;
  if (c && "function" !== typeof c) throw Error(p(231, b, typeof c));
  return c;
}
var Lb = false;
if (ia) try {
  var Mb = {};
  Object.defineProperty(Mb, "passive", { get: function() {
    Lb = true;
  } });
  window.addEventListener("test", Mb, Mb);
  window.removeEventListener("test", Mb, Mb);
} catch (a) {
  Lb = false;
}
function Nb(a, b, c, d, e, f2, g, h, k2) {
  var l2 = Array.prototype.slice.call(arguments, 3);
  try {
    b.apply(c, l2);
  } catch (m2) {
    this.onError(m2);
  }
}
var Ob = false, Pb = null, Qb = false, Rb = null, Sb = { onError: function(a) {
  Ob = true;
  Pb = a;
} };
function Tb(a, b, c, d, e, f2, g, h, k2) {
  Ob = false;
  Pb = null;
  Nb.apply(Sb, arguments);
}
function Ub(a, b, c, d, e, f2, g, h, k2) {
  Tb.apply(this, arguments);
  if (Ob) {
    if (Ob) {
      var l2 = Pb;
      Ob = false;
      Pb = null;
    } else throw Error(p(198));
    Qb || (Qb = true, Rb = l2);
  }
}
function Vb(a) {
  var b = a, c = a;
  if (a.alternate) for (; b.return; ) b = b.return;
  else {
    a = b;
    do
      b = a, 0 !== (b.flags & 4098) && (c = b.return), a = b.return;
    while (a);
  }
  return 3 === b.tag ? c : null;
}
function Wb(a) {
  if (13 === a.tag) {
    var b = a.memoizedState;
    null === b && (a = a.alternate, null !== a && (b = a.memoizedState));
    if (null !== b) return b.dehydrated;
  }
  return null;
}
function Xb(a) {
  if (Vb(a) !== a) throw Error(p(188));
}
function Yb(a) {
  var b = a.alternate;
  if (!b) {
    b = Vb(a);
    if (null === b) throw Error(p(188));
    return b !== a ? null : a;
  }
  for (var c = a, d = b; ; ) {
    var e = c.return;
    if (null === e) break;
    var f2 = e.alternate;
    if (null === f2) {
      d = e.return;
      if (null !== d) {
        c = d;
        continue;
      }
      break;
    }
    if (e.child === f2.child) {
      for (f2 = e.child; f2; ) {
        if (f2 === c) return Xb(e), a;
        if (f2 === d) return Xb(e), b;
        f2 = f2.sibling;
      }
      throw Error(p(188));
    }
    if (c.return !== d.return) c = e, d = f2;
    else {
      for (var g = false, h = e.child; h; ) {
        if (h === c) {
          g = true;
          c = e;
          d = f2;
          break;
        }
        if (h === d) {
          g = true;
          d = e;
          c = f2;
          break;
        }
        h = h.sibling;
      }
      if (!g) {
        for (h = f2.child; h; ) {
          if (h === c) {
            g = true;
            c = f2;
            d = e;
            break;
          }
          if (h === d) {
            g = true;
            d = f2;
            c = e;
            break;
          }
          h = h.sibling;
        }
        if (!g) throw Error(p(189));
      }
    }
    if (c.alternate !== d) throw Error(p(190));
  }
  if (3 !== c.tag) throw Error(p(188));
  return c.stateNode.current === c ? a : b;
}
function Zb(a) {
  a = Yb(a);
  return null !== a ? $b(a) : null;
}
function $b(a) {
  if (5 === a.tag || 6 === a.tag) return a;
  for (a = a.child; null !== a; ) {
    var b = $b(a);
    if (null !== b) return b;
    a = a.sibling;
  }
  return null;
}
var ac = ca.unstable_scheduleCallback, bc = ca.unstable_cancelCallback, cc = ca.unstable_shouldYield, dc = ca.unstable_requestPaint, B = ca.unstable_now, ec = ca.unstable_getCurrentPriorityLevel, fc = ca.unstable_ImmediatePriority, gc = ca.unstable_UserBlockingPriority, hc = ca.unstable_NormalPriority, ic = ca.unstable_LowPriority, jc = ca.unstable_IdlePriority, kc = null, lc = null;
function mc(a) {
  if (lc && "function" === typeof lc.onCommitFiberRoot) try {
    lc.onCommitFiberRoot(kc, a, void 0, 128 === (a.current.flags & 128));
  } catch (b) {
  }
}
var oc = Math.clz32 ? Math.clz32 : nc, pc = Math.log, qc = Math.LN2;
function nc(a) {
  a >>>= 0;
  return 0 === a ? 32 : 31 - (pc(a) / qc | 0) | 0;
}
var rc = 64, sc = 4194304;
function tc(a) {
  switch (a & -a) {
    case 1:
      return 1;
    case 2:
      return 2;
    case 4:
      return 4;
    case 8:
      return 8;
    case 16:
      return 16;
    case 32:
      return 32;
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return a & 4194240;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return a & 130023424;
    case 134217728:
      return 134217728;
    case 268435456:
      return 268435456;
    case 536870912:
      return 536870912;
    case 1073741824:
      return 1073741824;
    default:
      return a;
  }
}
function uc(a, b) {
  var c = a.pendingLanes;
  if (0 === c) return 0;
  var d = 0, e = a.suspendedLanes, f2 = a.pingedLanes, g = c & 268435455;
  if (0 !== g) {
    var h = g & ~e;
    0 !== h ? d = tc(h) : (f2 &= g, 0 !== f2 && (d = tc(f2)));
  } else g = c & ~e, 0 !== g ? d = tc(g) : 0 !== f2 && (d = tc(f2));
  if (0 === d) return 0;
  if (0 !== b && b !== d && 0 === (b & e) && (e = d & -d, f2 = b & -b, e >= f2 || 16 === e && 0 !== (f2 & 4194240))) return b;
  0 !== (d & 4) && (d |= c & 16);
  b = a.entangledLanes;
  if (0 !== b) for (a = a.entanglements, b &= d; 0 < b; ) c = 31 - oc(b), e = 1 << c, d |= a[c], b &= ~e;
  return d;
}
function vc(a, b) {
  switch (a) {
    case 1:
    case 2:
    case 4:
      return b + 250;
    case 8:
    case 16:
    case 32:
    case 64:
    case 128:
    case 256:
    case 512:
    case 1024:
    case 2048:
    case 4096:
    case 8192:
    case 16384:
    case 32768:
    case 65536:
    case 131072:
    case 262144:
    case 524288:
    case 1048576:
    case 2097152:
      return b + 5e3;
    case 4194304:
    case 8388608:
    case 16777216:
    case 33554432:
    case 67108864:
      return -1;
    case 134217728:
    case 268435456:
    case 536870912:
    case 1073741824:
      return -1;
    default:
      return -1;
  }
}
function wc(a, b) {
  for (var c = a.suspendedLanes, d = a.pingedLanes, e = a.expirationTimes, f2 = a.pendingLanes; 0 < f2; ) {
    var g = 31 - oc(f2), h = 1 << g, k2 = e[g];
    if (-1 === k2) {
      if (0 === (h & c) || 0 !== (h & d)) e[g] = vc(h, b);
    } else k2 <= b && (a.expiredLanes |= h);
    f2 &= ~h;
  }
}
function xc(a) {
  a = a.pendingLanes & -1073741825;
  return 0 !== a ? a : a & 1073741824 ? 1073741824 : 0;
}
function yc() {
  var a = rc;
  rc <<= 1;
  0 === (rc & 4194240) && (rc = 64);
  return a;
}
function zc(a) {
  for (var b = [], c = 0; 31 > c; c++) b.push(a);
  return b;
}
function Ac(a, b, c) {
  a.pendingLanes |= b;
  536870912 !== b && (a.suspendedLanes = 0, a.pingedLanes = 0);
  a = a.eventTimes;
  b = 31 - oc(b);
  a[b] = c;
}
function Bc(a, b) {
  var c = a.pendingLanes & ~b;
  a.pendingLanes = b;
  a.suspendedLanes = 0;
  a.pingedLanes = 0;
  a.expiredLanes &= b;
  a.mutableReadLanes &= b;
  a.entangledLanes &= b;
  b = a.entanglements;
  var d = a.eventTimes;
  for (a = a.expirationTimes; 0 < c; ) {
    var e = 31 - oc(c), f2 = 1 << e;
    b[e] = 0;
    d[e] = -1;
    a[e] = -1;
    c &= ~f2;
  }
}
function Cc(a, b) {
  var c = a.entangledLanes |= b;
  for (a = a.entanglements; c; ) {
    var d = 31 - oc(c), e = 1 << d;
    e & b | a[d] & b && (a[d] |= b);
    c &= ~e;
  }
}
var C = 0;
function Dc(a) {
  a &= -a;
  return 1 < a ? 4 < a ? 0 !== (a & 268435455) ? 16 : 536870912 : 4 : 1;
}
var Ec, Fc, Gc, Hc, Ic, Jc = false, Kc = [], Lc = null, Mc = null, Nc = null, Oc = /* @__PURE__ */ new Map(), Pc = /* @__PURE__ */ new Map(), Qc = [], Rc = "mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");
function Sc(a, b) {
  switch (a) {
    case "focusin":
    case "focusout":
      Lc = null;
      break;
    case "dragenter":
    case "dragleave":
      Mc = null;
      break;
    case "mouseover":
    case "mouseout":
      Nc = null;
      break;
    case "pointerover":
    case "pointerout":
      Oc.delete(b.pointerId);
      break;
    case "gotpointercapture":
    case "lostpointercapture":
      Pc.delete(b.pointerId);
  }
}
function Tc(a, b, c, d, e, f2) {
  if (null === a || a.nativeEvent !== f2) return a = { blockedOn: b, domEventName: c, eventSystemFlags: d, nativeEvent: f2, targetContainers: [e] }, null !== b && (b = Cb(b), null !== b && Fc(b)), a;
  a.eventSystemFlags |= d;
  b = a.targetContainers;
  null !== e && -1 === b.indexOf(e) && b.push(e);
  return a;
}
function Uc(a, b, c, d, e) {
  switch (b) {
    case "focusin":
      return Lc = Tc(Lc, a, b, c, d, e), true;
    case "dragenter":
      return Mc = Tc(Mc, a, b, c, d, e), true;
    case "mouseover":
      return Nc = Tc(Nc, a, b, c, d, e), true;
    case "pointerover":
      var f2 = e.pointerId;
      Oc.set(f2, Tc(Oc.get(f2) || null, a, b, c, d, e));
      return true;
    case "gotpointercapture":
      return f2 = e.pointerId, Pc.set(f2, Tc(Pc.get(f2) || null, a, b, c, d, e)), true;
  }
  return false;
}
function Vc(a) {
  var b = Wc(a.target);
  if (null !== b) {
    var c = Vb(b);
    if (null !== c) {
      if (b = c.tag, 13 === b) {
        if (b = Wb(c), null !== b) {
          a.blockedOn = b;
          Ic(a.priority, function() {
            Gc(c);
          });
          return;
        }
      } else if (3 === b && c.stateNode.current.memoizedState.isDehydrated) {
        a.blockedOn = 3 === c.tag ? c.stateNode.containerInfo : null;
        return;
      }
    }
  }
  a.blockedOn = null;
}
function Xc(a) {
  if (null !== a.blockedOn) return false;
  for (var b = a.targetContainers; 0 < b.length; ) {
    var c = Yc(a.domEventName, a.eventSystemFlags, b[0], a.nativeEvent);
    if (null === c) {
      c = a.nativeEvent;
      var d = new c.constructor(c.type, c);
      wb = d;
      c.target.dispatchEvent(d);
      wb = null;
    } else return b = Cb(c), null !== b && Fc(b), a.blockedOn = c, false;
    b.shift();
  }
  return true;
}
function Zc(a, b, c) {
  Xc(a) && c.delete(b);
}
function $c() {
  Jc = false;
  null !== Lc && Xc(Lc) && (Lc = null);
  null !== Mc && Xc(Mc) && (Mc = null);
  null !== Nc && Xc(Nc) && (Nc = null);
  Oc.forEach(Zc);
  Pc.forEach(Zc);
}
function ad(a, b) {
  a.blockedOn === b && (a.blockedOn = null, Jc || (Jc = true, ca.unstable_scheduleCallback(ca.unstable_NormalPriority, $c)));
}
function bd(a) {
  function b(b2) {
    return ad(b2, a);
  }
  if (0 < Kc.length) {
    ad(Kc[0], a);
    for (var c = 1; c < Kc.length; c++) {
      var d = Kc[c];
      d.blockedOn === a && (d.blockedOn = null);
    }
  }
  null !== Lc && ad(Lc, a);
  null !== Mc && ad(Mc, a);
  null !== Nc && ad(Nc, a);
  Oc.forEach(b);
  Pc.forEach(b);
  for (c = 0; c < Qc.length; c++) d = Qc[c], d.blockedOn === a && (d.blockedOn = null);
  for (; 0 < Qc.length && (c = Qc[0], null === c.blockedOn); ) Vc(c), null === c.blockedOn && Qc.shift();
}
var cd = ua.ReactCurrentBatchConfig, dd = true;
function ed(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 1, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function gd(a, b, c, d) {
  var e = C, f2 = cd.transition;
  cd.transition = null;
  try {
    C = 4, fd(a, b, c, d);
  } finally {
    C = e, cd.transition = f2;
  }
}
function fd(a, b, c, d) {
  if (dd) {
    var e = Yc(a, b, c, d);
    if (null === e) hd(a, b, d, id, c), Sc(a, d);
    else if (Uc(e, a, b, c, d)) d.stopPropagation();
    else if (Sc(a, d), b & 4 && -1 < Rc.indexOf(a)) {
      for (; null !== e; ) {
        var f2 = Cb(e);
        null !== f2 && Ec(f2);
        f2 = Yc(a, b, c, d);
        null === f2 && hd(a, b, d, id, c);
        if (f2 === e) break;
        e = f2;
      }
      null !== e && d.stopPropagation();
    } else hd(a, b, d, null, c);
  }
}
var id = null;
function Yc(a, b, c, d) {
  id = null;
  a = xb(d);
  a = Wc(a);
  if (null !== a) if (b = Vb(a), null === b) a = null;
  else if (c = b.tag, 13 === c) {
    a = Wb(b);
    if (null !== a) return a;
    a = null;
  } else if (3 === c) {
    if (b.stateNode.current.memoizedState.isDehydrated) return 3 === b.tag ? b.stateNode.containerInfo : null;
    a = null;
  } else b !== a && (a = null);
  id = a;
  return null;
}
function jd(a) {
  switch (a) {
    case "cancel":
    case "click":
    case "close":
    case "contextmenu":
    case "copy":
    case "cut":
    case "auxclick":
    case "dblclick":
    case "dragend":
    case "dragstart":
    case "drop":
    case "focusin":
    case "focusout":
    case "input":
    case "invalid":
    case "keydown":
    case "keypress":
    case "keyup":
    case "mousedown":
    case "mouseup":
    case "paste":
    case "pause":
    case "play":
    case "pointercancel":
    case "pointerdown":
    case "pointerup":
    case "ratechange":
    case "reset":
    case "resize":
    case "seeked":
    case "submit":
    case "touchcancel":
    case "touchend":
    case "touchstart":
    case "volumechange":
    case "change":
    case "selectionchange":
    case "textInput":
    case "compositionstart":
    case "compositionend":
    case "compositionupdate":
    case "beforeblur":
    case "afterblur":
    case "beforeinput":
    case "blur":
    case "fullscreenchange":
    case "focus":
    case "hashchange":
    case "popstate":
    case "select":
    case "selectstart":
      return 1;
    case "drag":
    case "dragenter":
    case "dragexit":
    case "dragleave":
    case "dragover":
    case "mousemove":
    case "mouseout":
    case "mouseover":
    case "pointermove":
    case "pointerout":
    case "pointerover":
    case "scroll":
    case "toggle":
    case "touchmove":
    case "wheel":
    case "mouseenter":
    case "mouseleave":
    case "pointerenter":
    case "pointerleave":
      return 4;
    case "message":
      switch (ec()) {
        case fc:
          return 1;
        case gc:
          return 4;
        case hc:
        case ic:
          return 16;
        case jc:
          return 536870912;
        default:
          return 16;
      }
    default:
      return 16;
  }
}
var kd = null, ld = null, md = null;
function nd() {
  if (md) return md;
  var a, b = ld, c = b.length, d, e = "value" in kd ? kd.value : kd.textContent, f2 = e.length;
  for (a = 0; a < c && b[a] === e[a]; a++) ;
  var g = c - a;
  for (d = 1; d <= g && b[c - d] === e[f2 - d]; d++) ;
  return md = e.slice(a, 1 < d ? 1 - d : void 0);
}
function od(a) {
  var b = a.keyCode;
  "charCode" in a ? (a = a.charCode, 0 === a && 13 === b && (a = 13)) : a = b;
  10 === a && (a = 13);
  return 32 <= a || 13 === a ? a : 0;
}
function pd() {
  return true;
}
function qd() {
  return false;
}
function rd(a) {
  function b(b2, d, e, f2, g) {
    this._reactName = b2;
    this._targetInst = e;
    this.type = d;
    this.nativeEvent = f2;
    this.target = g;
    this.currentTarget = null;
    for (var c in a) a.hasOwnProperty(c) && (b2 = a[c], this[c] = b2 ? b2(f2) : f2[c]);
    this.isDefaultPrevented = (null != f2.defaultPrevented ? f2.defaultPrevented : false === f2.returnValue) ? pd : qd;
    this.isPropagationStopped = qd;
    return this;
  }
  A(b.prototype, { preventDefault: function() {
    this.defaultPrevented = true;
    var a2 = this.nativeEvent;
    a2 && (a2.preventDefault ? a2.preventDefault() : "unknown" !== typeof a2.returnValue && (a2.returnValue = false), this.isDefaultPrevented = pd);
  }, stopPropagation: function() {
    var a2 = this.nativeEvent;
    a2 && (a2.stopPropagation ? a2.stopPropagation() : "unknown" !== typeof a2.cancelBubble && (a2.cancelBubble = true), this.isPropagationStopped = pd);
  }, persist: function() {
  }, isPersistent: pd });
  return b;
}
var sd = { eventPhase: 0, bubbles: 0, cancelable: 0, timeStamp: function(a) {
  return a.timeStamp || Date.now();
}, defaultPrevented: 0, isTrusted: 0 }, td = rd(sd), ud = A({}, sd, { view: 0, detail: 0 }), vd = rd(ud), wd, xd, yd, Ad = A({}, ud, { screenX: 0, screenY: 0, clientX: 0, clientY: 0, pageX: 0, pageY: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, getModifierState: zd, button: 0, buttons: 0, relatedTarget: function(a) {
  return void 0 === a.relatedTarget ? a.fromElement === a.srcElement ? a.toElement : a.fromElement : a.relatedTarget;
}, movementX: function(a) {
  if ("movementX" in a) return a.movementX;
  a !== yd && (yd && "mousemove" === a.type ? (wd = a.screenX - yd.screenX, xd = a.screenY - yd.screenY) : xd = wd = 0, yd = a);
  return wd;
}, movementY: function(a) {
  return "movementY" in a ? a.movementY : xd;
} }), Bd = rd(Ad), Cd = A({}, Ad, { dataTransfer: 0 }), Dd = rd(Cd), Ed = A({}, ud, { relatedTarget: 0 }), Fd = rd(Ed), Gd = A({}, sd, { animationName: 0, elapsedTime: 0, pseudoElement: 0 }), Hd = rd(Gd), Id = A({}, sd, { clipboardData: function(a) {
  return "clipboardData" in a ? a.clipboardData : window.clipboardData;
} }), Jd = rd(Id), Kd = A({}, sd, { data: 0 }), Ld = rd(Kd), Md = {
  Esc: "Escape",
  Spacebar: " ",
  Left: "ArrowLeft",
  Up: "ArrowUp",
  Right: "ArrowRight",
  Down: "ArrowDown",
  Del: "Delete",
  Win: "OS",
  Menu: "ContextMenu",
  Apps: "ContextMenu",
  Scroll: "ScrollLock",
  MozPrintableKey: "Unidentified"
}, Nd = {
  8: "Backspace",
  9: "Tab",
  12: "Clear",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  19: "Pause",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  45: "Insert",
  46: "Delete",
  112: "F1",
  113: "F2",
  114: "F3",
  115: "F4",
  116: "F5",
  117: "F6",
  118: "F7",
  119: "F8",
  120: "F9",
  121: "F10",
  122: "F11",
  123: "F12",
  144: "NumLock",
  145: "ScrollLock",
  224: "Meta"
}, Od = { Alt: "altKey", Control: "ctrlKey", Meta: "metaKey", Shift: "shiftKey" };
function Pd(a) {
  var b = this.nativeEvent;
  return b.getModifierState ? b.getModifierState(a) : (a = Od[a]) ? !!b[a] : false;
}
function zd() {
  return Pd;
}
var Qd = A({}, ud, { key: function(a) {
  if (a.key) {
    var b = Md[a.key] || a.key;
    if ("Unidentified" !== b) return b;
  }
  return "keypress" === a.type ? (a = od(a), 13 === a ? "Enter" : String.fromCharCode(a)) : "keydown" === a.type || "keyup" === a.type ? Nd[a.keyCode] || "Unidentified" : "";
}, code: 0, location: 0, ctrlKey: 0, shiftKey: 0, altKey: 0, metaKey: 0, repeat: 0, locale: 0, getModifierState: zd, charCode: function(a) {
  return "keypress" === a.type ? od(a) : 0;
}, keyCode: function(a) {
  return "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
}, which: function(a) {
  return "keypress" === a.type ? od(a) : "keydown" === a.type || "keyup" === a.type ? a.keyCode : 0;
} }), Rd = rd(Qd), Sd = A({}, Ad, { pointerId: 0, width: 0, height: 0, pressure: 0, tangentialPressure: 0, tiltX: 0, tiltY: 0, twist: 0, pointerType: 0, isPrimary: 0 }), Td = rd(Sd), Ud = A({}, ud, { touches: 0, targetTouches: 0, changedTouches: 0, altKey: 0, metaKey: 0, ctrlKey: 0, shiftKey: 0, getModifierState: zd }), Vd = rd(Ud), Wd = A({}, sd, { propertyName: 0, elapsedTime: 0, pseudoElement: 0 }), Xd = rd(Wd), Yd = A({}, Ad, {
  deltaX: function(a) {
    return "deltaX" in a ? a.deltaX : "wheelDeltaX" in a ? -a.wheelDeltaX : 0;
  },
  deltaY: function(a) {
    return "deltaY" in a ? a.deltaY : "wheelDeltaY" in a ? -a.wheelDeltaY : "wheelDelta" in a ? -a.wheelDelta : 0;
  },
  deltaZ: 0,
  deltaMode: 0
}), Zd = rd(Yd), $d = [9, 13, 27, 32], ae = ia && "CompositionEvent" in window, be = null;
ia && "documentMode" in document && (be = document.documentMode);
var ce = ia && "TextEvent" in window && !be, de = ia && (!ae || be && 8 < be && 11 >= be), ee = String.fromCharCode(32), fe = false;
function ge(a, b) {
  switch (a) {
    case "keyup":
      return -1 !== $d.indexOf(b.keyCode);
    case "keydown":
      return 229 !== b.keyCode;
    case "keypress":
    case "mousedown":
    case "focusout":
      return true;
    default:
      return false;
  }
}
function he(a) {
  a = a.detail;
  return "object" === typeof a && "data" in a ? a.data : null;
}
var ie = false;
function je(a, b) {
  switch (a) {
    case "compositionend":
      return he(b);
    case "keypress":
      if (32 !== b.which) return null;
      fe = true;
      return ee;
    case "textInput":
      return a = b.data, a === ee && fe ? null : a;
    default:
      return null;
  }
}
function ke(a, b) {
  if (ie) return "compositionend" === a || !ae && ge(a, b) ? (a = nd(), md = ld = kd = null, ie = false, a) : null;
  switch (a) {
    case "paste":
      return null;
    case "keypress":
      if (!(b.ctrlKey || b.altKey || b.metaKey) || b.ctrlKey && b.altKey) {
        if (b.char && 1 < b.char.length) return b.char;
        if (b.which) return String.fromCharCode(b.which);
      }
      return null;
    case "compositionend":
      return de && "ko" !== b.locale ? null : b.data;
    default:
      return null;
  }
}
var le = { color: true, date: true, datetime: true, "datetime-local": true, email: true, month: true, number: true, password: true, range: true, search: true, tel: true, text: true, time: true, url: true, week: true };
function me(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return "input" === b ? !!le[a.type] : "textarea" === b ? true : false;
}
function ne(a, b, c, d) {
  Eb(d);
  b = oe(b, "onChange");
  0 < b.length && (c = new td("onChange", "change", null, c, d), a.push({ event: c, listeners: b }));
}
var pe = null, qe = null;
function re(a) {
  se(a, 0);
}
function te(a) {
  var b = ue(a);
  if (Wa(b)) return a;
}
function ve(a, b) {
  if ("change" === a) return b;
}
var we = false;
if (ia) {
  var xe;
  if (ia) {
    var ye = "oninput" in document;
    if (!ye) {
      var ze = document.createElement("div");
      ze.setAttribute("oninput", "return;");
      ye = "function" === typeof ze.oninput;
    }
    xe = ye;
  } else xe = false;
  we = xe && (!document.documentMode || 9 < document.documentMode);
}
function Ae() {
  pe && (pe.detachEvent("onpropertychange", Be), qe = pe = null);
}
function Be(a) {
  if ("value" === a.propertyName && te(qe)) {
    var b = [];
    ne(b, qe, a, xb(a));
    Jb(re, b);
  }
}
function Ce(a, b, c) {
  "focusin" === a ? (Ae(), pe = b, qe = c, pe.attachEvent("onpropertychange", Be)) : "focusout" === a && Ae();
}
function De(a) {
  if ("selectionchange" === a || "keyup" === a || "keydown" === a) return te(qe);
}
function Ee(a, b) {
  if ("click" === a) return te(b);
}
function Fe(a, b) {
  if ("input" === a || "change" === a) return te(b);
}
function Ge(a, b) {
  return a === b && (0 !== a || 1 / a === 1 / b) || a !== a && b !== b;
}
var He = "function" === typeof Object.is ? Object.is : Ge;
function Ie(a, b) {
  if (He(a, b)) return true;
  if ("object" !== typeof a || null === a || "object" !== typeof b || null === b) return false;
  var c = Object.keys(a), d = Object.keys(b);
  if (c.length !== d.length) return false;
  for (d = 0; d < c.length; d++) {
    var e = c[d];
    if (!ja.call(b, e) || !He(a[e], b[e])) return false;
  }
  return true;
}
function Je(a) {
  for (; a && a.firstChild; ) a = a.firstChild;
  return a;
}
function Ke(a, b) {
  var c = Je(a);
  a = 0;
  for (var d; c; ) {
    if (3 === c.nodeType) {
      d = a + c.textContent.length;
      if (a <= b && d >= b) return { node: c, offset: b - a };
      a = d;
    }
    a: {
      for (; c; ) {
        if (c.nextSibling) {
          c = c.nextSibling;
          break a;
        }
        c = c.parentNode;
      }
      c = void 0;
    }
    c = Je(c);
  }
}
function Le(a, b) {
  return a && b ? a === b ? true : a && 3 === a.nodeType ? false : b && 3 === b.nodeType ? Le(a, b.parentNode) : "contains" in a ? a.contains(b) : a.compareDocumentPosition ? !!(a.compareDocumentPosition(b) & 16) : false : false;
}
function Me() {
  for (var a = window, b = Xa(); b instanceof a.HTMLIFrameElement; ) {
    try {
      var c = "string" === typeof b.contentWindow.location.href;
    } catch (d) {
      c = false;
    }
    if (c) a = b.contentWindow;
    else break;
    b = Xa(a.document);
  }
  return b;
}
function Ne(a) {
  var b = a && a.nodeName && a.nodeName.toLowerCase();
  return b && ("input" === b && ("text" === a.type || "search" === a.type || "tel" === a.type || "url" === a.type || "password" === a.type) || "textarea" === b || "true" === a.contentEditable);
}
function Oe(a) {
  var b = Me(), c = a.focusedElem, d = a.selectionRange;
  if (b !== c && c && c.ownerDocument && Le(c.ownerDocument.documentElement, c)) {
    if (null !== d && Ne(c)) {
      if (b = d.start, a = d.end, void 0 === a && (a = b), "selectionStart" in c) c.selectionStart = b, c.selectionEnd = Math.min(a, c.value.length);
      else if (a = (b = c.ownerDocument || document) && b.defaultView || window, a.getSelection) {
        a = a.getSelection();
        var e = c.textContent.length, f2 = Math.min(d.start, e);
        d = void 0 === d.end ? f2 : Math.min(d.end, e);
        !a.extend && f2 > d && (e = d, d = f2, f2 = e);
        e = Ke(c, f2);
        var g = Ke(
          c,
          d
        );
        e && g && (1 !== a.rangeCount || a.anchorNode !== e.node || a.anchorOffset !== e.offset || a.focusNode !== g.node || a.focusOffset !== g.offset) && (b = b.createRange(), b.setStart(e.node, e.offset), a.removeAllRanges(), f2 > d ? (a.addRange(b), a.extend(g.node, g.offset)) : (b.setEnd(g.node, g.offset), a.addRange(b)));
      }
    }
    b = [];
    for (a = c; a = a.parentNode; ) 1 === a.nodeType && b.push({ element: a, left: a.scrollLeft, top: a.scrollTop });
    "function" === typeof c.focus && c.focus();
    for (c = 0; c < b.length; c++) a = b[c], a.element.scrollLeft = a.left, a.element.scrollTop = a.top;
  }
}
var Pe = ia && "documentMode" in document && 11 >= document.documentMode, Qe = null, Re = null, Se = null, Te = false;
function Ue(a, b, c) {
  var d = c.window === c ? c.document : 9 === c.nodeType ? c : c.ownerDocument;
  Te || null == Qe || Qe !== Xa(d) || (d = Qe, "selectionStart" in d && Ne(d) ? d = { start: d.selectionStart, end: d.selectionEnd } : (d = (d.ownerDocument && d.ownerDocument.defaultView || window).getSelection(), d = { anchorNode: d.anchorNode, anchorOffset: d.anchorOffset, focusNode: d.focusNode, focusOffset: d.focusOffset }), Se && Ie(Se, d) || (Se = d, d = oe(Re, "onSelect"), 0 < d.length && (b = new td("onSelect", "select", null, b, c), a.push({ event: b, listeners: d }), b.target = Qe)));
}
function Ve(a, b) {
  var c = {};
  c[a.toLowerCase()] = b.toLowerCase();
  c["Webkit" + a] = "webkit" + b;
  c["Moz" + a] = "moz" + b;
  return c;
}
var We = { animationend: Ve("Animation", "AnimationEnd"), animationiteration: Ve("Animation", "AnimationIteration"), animationstart: Ve("Animation", "AnimationStart"), transitionend: Ve("Transition", "TransitionEnd") }, Xe = {}, Ye = {};
ia && (Ye = document.createElement("div").style, "AnimationEvent" in window || (delete We.animationend.animation, delete We.animationiteration.animation, delete We.animationstart.animation), "TransitionEvent" in window || delete We.transitionend.transition);
function Ze(a) {
  if (Xe[a]) return Xe[a];
  if (!We[a]) return a;
  var b = We[a], c;
  for (c in b) if (b.hasOwnProperty(c) && c in Ye) return Xe[a] = b[c];
  return a;
}
var $e = Ze("animationend"), af = Ze("animationiteration"), bf = Ze("animationstart"), cf = Ze("transitionend"), df = /* @__PURE__ */ new Map(), ef = "abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");
function ff(a, b) {
  df.set(a, b);
  fa(b, [a]);
}
for (var gf = 0; gf < ef.length; gf++) {
  var hf = ef[gf], jf = hf.toLowerCase(), kf = hf[0].toUpperCase() + hf.slice(1);
  ff(jf, "on" + kf);
}
ff($e, "onAnimationEnd");
ff(af, "onAnimationIteration");
ff(bf, "onAnimationStart");
ff("dblclick", "onDoubleClick");
ff("focusin", "onFocus");
ff("focusout", "onBlur");
ff(cf, "onTransitionEnd");
ha("onMouseEnter", ["mouseout", "mouseover"]);
ha("onMouseLeave", ["mouseout", "mouseover"]);
ha("onPointerEnter", ["pointerout", "pointerover"]);
ha("onPointerLeave", ["pointerout", "pointerover"]);
fa("onChange", "change click focusin focusout input keydown keyup selectionchange".split(" "));
fa("onSelect", "focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));
fa("onBeforeInput", ["compositionend", "keypress", "textInput", "paste"]);
fa("onCompositionEnd", "compositionend focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionStart", "compositionstart focusout keydown keypress keyup mousedown".split(" "));
fa("onCompositionUpdate", "compositionupdate focusout keydown keypress keyup mousedown".split(" "));
var lf = "abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "), mf = new Set("cancel close invalid load scroll toggle".split(" ").concat(lf));
function nf(a, b, c) {
  var d = a.type || "unknown-event";
  a.currentTarget = c;
  Ub(d, b, void 0, a);
  a.currentTarget = null;
}
function se(a, b) {
  b = 0 !== (b & 4);
  for (var c = 0; c < a.length; c++) {
    var d = a[c], e = d.event;
    d = d.listeners;
    a: {
      var f2 = void 0;
      if (b) for (var g = d.length - 1; 0 <= g; g--) {
        var h = d[g], k2 = h.instance, l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
      else for (g = 0; g < d.length; g++) {
        h = d[g];
        k2 = h.instance;
        l2 = h.currentTarget;
        h = h.listener;
        if (k2 !== f2 && e.isPropagationStopped()) break a;
        nf(e, h, l2);
        f2 = k2;
      }
    }
  }
  if (Qb) throw a = Rb, Qb = false, Rb = null, a;
}
function D(a, b) {
  var c = b[of];
  void 0 === c && (c = b[of] = /* @__PURE__ */ new Set());
  var d = a + "__bubble";
  c.has(d) || (pf(b, a, 2, false), c.add(d));
}
function qf(a, b, c) {
  var d = 0;
  b && (d |= 4);
  pf(c, a, d, b);
}
var rf = "_reactListening" + Math.random().toString(36).slice(2);
function sf(a) {
  if (!a[rf]) {
    a[rf] = true;
    da.forEach(function(b2) {
      "selectionchange" !== b2 && (mf.has(b2) || qf(b2, false, a), qf(b2, true, a));
    });
    var b = 9 === a.nodeType ? a : a.ownerDocument;
    null === b || b[rf] || (b[rf] = true, qf("selectionchange", false, b));
  }
}
function pf(a, b, c, d) {
  switch (jd(b)) {
    case 1:
      var e = ed;
      break;
    case 4:
      e = gd;
      break;
    default:
      e = fd;
  }
  c = e.bind(null, b, c, a);
  e = void 0;
  !Lb || "touchstart" !== b && "touchmove" !== b && "wheel" !== b || (e = true);
  d ? void 0 !== e ? a.addEventListener(b, c, { capture: true, passive: e }) : a.addEventListener(b, c, true) : void 0 !== e ? a.addEventListener(b, c, { passive: e }) : a.addEventListener(b, c, false);
}
function hd(a, b, c, d, e) {
  var f2 = d;
  if (0 === (b & 1) && 0 === (b & 2) && null !== d) a: for (; ; ) {
    if (null === d) return;
    var g = d.tag;
    if (3 === g || 4 === g) {
      var h = d.stateNode.containerInfo;
      if (h === e || 8 === h.nodeType && h.parentNode === e) break;
      if (4 === g) for (g = d.return; null !== g; ) {
        var k2 = g.tag;
        if (3 === k2 || 4 === k2) {
          if (k2 = g.stateNode.containerInfo, k2 === e || 8 === k2.nodeType && k2.parentNode === e) return;
        }
        g = g.return;
      }
      for (; null !== h; ) {
        g = Wc(h);
        if (null === g) return;
        k2 = g.tag;
        if (5 === k2 || 6 === k2) {
          d = f2 = g;
          continue a;
        }
        h = h.parentNode;
      }
    }
    d = d.return;
  }
  Jb(function() {
    var d2 = f2, e2 = xb(c), g2 = [];
    a: {
      var h2 = df.get(a);
      if (void 0 !== h2) {
        var k3 = td, n2 = a;
        switch (a) {
          case "keypress":
            if (0 === od(c)) break a;
          case "keydown":
          case "keyup":
            k3 = Rd;
            break;
          case "focusin":
            n2 = "focus";
            k3 = Fd;
            break;
          case "focusout":
            n2 = "blur";
            k3 = Fd;
            break;
          case "beforeblur":
          case "afterblur":
            k3 = Fd;
            break;
          case "click":
            if (2 === c.button) break a;
          case "auxclick":
          case "dblclick":
          case "mousedown":
          case "mousemove":
          case "mouseup":
          case "mouseout":
          case "mouseover":
          case "contextmenu":
            k3 = Bd;
            break;
          case "drag":
          case "dragend":
          case "dragenter":
          case "dragexit":
          case "dragleave":
          case "dragover":
          case "dragstart":
          case "drop":
            k3 = Dd;
            break;
          case "touchcancel":
          case "touchend":
          case "touchmove":
          case "touchstart":
            k3 = Vd;
            break;
          case $e:
          case af:
          case bf:
            k3 = Hd;
            break;
          case cf:
            k3 = Xd;
            break;
          case "scroll":
            k3 = vd;
            break;
          case "wheel":
            k3 = Zd;
            break;
          case "copy":
          case "cut":
          case "paste":
            k3 = Jd;
            break;
          case "gotpointercapture":
          case "lostpointercapture":
          case "pointercancel":
          case "pointerdown":
          case "pointermove":
          case "pointerout":
          case "pointerover":
          case "pointerup":
            k3 = Td;
        }
        var t2 = 0 !== (b & 4), J2 = !t2 && "scroll" === a, x2 = t2 ? null !== h2 ? h2 + "Capture" : null : h2;
        t2 = [];
        for (var w2 = d2, u2; null !== w2; ) {
          u2 = w2;
          var F2 = u2.stateNode;
          5 === u2.tag && null !== F2 && (u2 = F2, null !== x2 && (F2 = Kb(w2, x2), null != F2 && t2.push(tf(w2, F2, u2))));
          if (J2) break;
          w2 = w2.return;
        }
        0 < t2.length && (h2 = new k3(h2, n2, null, c, e2), g2.push({ event: h2, listeners: t2 }));
      }
    }
    if (0 === (b & 7)) {
      a: {
        h2 = "mouseover" === a || "pointerover" === a;
        k3 = "mouseout" === a || "pointerout" === a;
        if (h2 && c !== wb && (n2 = c.relatedTarget || c.fromElement) && (Wc(n2) || n2[uf])) break a;
        if (k3 || h2) {
          h2 = e2.window === e2 ? e2 : (h2 = e2.ownerDocument) ? h2.defaultView || h2.parentWindow : window;
          if (k3) {
            if (n2 = c.relatedTarget || c.toElement, k3 = d2, n2 = n2 ? Wc(n2) : null, null !== n2 && (J2 = Vb(n2), n2 !== J2 || 5 !== n2.tag && 6 !== n2.tag)) n2 = null;
          } else k3 = null, n2 = d2;
          if (k3 !== n2) {
            t2 = Bd;
            F2 = "onMouseLeave";
            x2 = "onMouseEnter";
            w2 = "mouse";
            if ("pointerout" === a || "pointerover" === a) t2 = Td, F2 = "onPointerLeave", x2 = "onPointerEnter", w2 = "pointer";
            J2 = null == k3 ? h2 : ue(k3);
            u2 = null == n2 ? h2 : ue(n2);
            h2 = new t2(F2, w2 + "leave", k3, c, e2);
            h2.target = J2;
            h2.relatedTarget = u2;
            F2 = null;
            Wc(e2) === d2 && (t2 = new t2(x2, w2 + "enter", n2, c, e2), t2.target = u2, t2.relatedTarget = J2, F2 = t2);
            J2 = F2;
            if (k3 && n2) b: {
              t2 = k3;
              x2 = n2;
              w2 = 0;
              for (u2 = t2; u2; u2 = vf(u2)) w2++;
              u2 = 0;
              for (F2 = x2; F2; F2 = vf(F2)) u2++;
              for (; 0 < w2 - u2; ) t2 = vf(t2), w2--;
              for (; 0 < u2 - w2; ) x2 = vf(x2), u2--;
              for (; w2--; ) {
                if (t2 === x2 || null !== x2 && t2 === x2.alternate) break b;
                t2 = vf(t2);
                x2 = vf(x2);
              }
              t2 = null;
            }
            else t2 = null;
            null !== k3 && wf(g2, h2, k3, t2, false);
            null !== n2 && null !== J2 && wf(g2, J2, n2, t2, true);
          }
        }
      }
      a: {
        h2 = d2 ? ue(d2) : window;
        k3 = h2.nodeName && h2.nodeName.toLowerCase();
        if ("select" === k3 || "input" === k3 && "file" === h2.type) var na = ve;
        else if (me(h2)) if (we) na = Fe;
        else {
          na = De;
          var xa = Ce;
        }
        else (k3 = h2.nodeName) && "input" === k3.toLowerCase() && ("checkbox" === h2.type || "radio" === h2.type) && (na = Ee);
        if (na && (na = na(a, d2))) {
          ne(g2, na, c, e2);
          break a;
        }
        xa && xa(a, h2, d2);
        "focusout" === a && (xa = h2._wrapperState) && xa.controlled && "number" === h2.type && cb(h2, "number", h2.value);
      }
      xa = d2 ? ue(d2) : window;
      switch (a) {
        case "focusin":
          if (me(xa) || "true" === xa.contentEditable) Qe = xa, Re = d2, Se = null;
          break;
        case "focusout":
          Se = Re = Qe = null;
          break;
        case "mousedown":
          Te = true;
          break;
        case "contextmenu":
        case "mouseup":
        case "dragend":
          Te = false;
          Ue(g2, c, e2);
          break;
        case "selectionchange":
          if (Pe) break;
        case "keydown":
        case "keyup":
          Ue(g2, c, e2);
      }
      var $a;
      if (ae) b: {
        switch (a) {
          case "compositionstart":
            var ba = "onCompositionStart";
            break b;
          case "compositionend":
            ba = "onCompositionEnd";
            break b;
          case "compositionupdate":
            ba = "onCompositionUpdate";
            break b;
        }
        ba = void 0;
      }
      else ie ? ge(a, c) && (ba = "onCompositionEnd") : "keydown" === a && 229 === c.keyCode && (ba = "onCompositionStart");
      ba && (de && "ko" !== c.locale && (ie || "onCompositionStart" !== ba ? "onCompositionEnd" === ba && ie && ($a = nd()) : (kd = e2, ld = "value" in kd ? kd.value : kd.textContent, ie = true)), xa = oe(d2, ba), 0 < xa.length && (ba = new Ld(ba, a, null, c, e2), g2.push({ event: ba, listeners: xa }), $a ? ba.data = $a : ($a = he(c), null !== $a && (ba.data = $a))));
      if ($a = ce ? je(a, c) : ke(a, c)) d2 = oe(d2, "onBeforeInput"), 0 < d2.length && (e2 = new Ld("onBeforeInput", "beforeinput", null, c, e2), g2.push({ event: e2, listeners: d2 }), e2.data = $a);
    }
    se(g2, b);
  });
}
function tf(a, b, c) {
  return { instance: a, listener: b, currentTarget: c };
}
function oe(a, b) {
  for (var c = b + "Capture", d = []; null !== a; ) {
    var e = a, f2 = e.stateNode;
    5 === e.tag && null !== f2 && (e = f2, f2 = Kb(a, c), null != f2 && d.unshift(tf(a, f2, e)), f2 = Kb(a, b), null != f2 && d.push(tf(a, f2, e)));
    a = a.return;
  }
  return d;
}
function vf(a) {
  if (null === a) return null;
  do
    a = a.return;
  while (a && 5 !== a.tag);
  return a ? a : null;
}
function wf(a, b, c, d, e) {
  for (var f2 = b._reactName, g = []; null !== c && c !== d; ) {
    var h = c, k2 = h.alternate, l2 = h.stateNode;
    if (null !== k2 && k2 === d) break;
    5 === h.tag && null !== l2 && (h = l2, e ? (k2 = Kb(c, f2), null != k2 && g.unshift(tf(c, k2, h))) : e || (k2 = Kb(c, f2), null != k2 && g.push(tf(c, k2, h))));
    c = c.return;
  }
  0 !== g.length && a.push({ event: b, listeners: g });
}
var xf = /\r\n?/g, yf = /\u0000|\uFFFD/g;
function zf(a) {
  return ("string" === typeof a ? a : "" + a).replace(xf, "\n").replace(yf, "");
}
function Af(a, b, c) {
  b = zf(b);
  if (zf(a) !== b && c) throw Error(p(425));
}
function Bf() {
}
var Cf = null, Df = null;
function Ef(a, b) {
  return "textarea" === a || "noscript" === a || "string" === typeof b.children || "number" === typeof b.children || "object" === typeof b.dangerouslySetInnerHTML && null !== b.dangerouslySetInnerHTML && null != b.dangerouslySetInnerHTML.__html;
}
var Ff = "function" === typeof setTimeout ? setTimeout : void 0, Gf = "function" === typeof clearTimeout ? clearTimeout : void 0, Hf = "function" === typeof Promise ? Promise : void 0, Jf = "function" === typeof queueMicrotask ? queueMicrotask : "undefined" !== typeof Hf ? function(a) {
  return Hf.resolve(null).then(a).catch(If);
} : Ff;
function If(a) {
  setTimeout(function() {
    throw a;
  });
}
function Kf(a, b) {
  var c = b, d = 0;
  do {
    var e = c.nextSibling;
    a.removeChild(c);
    if (e && 8 === e.nodeType) if (c = e.data, "/$" === c) {
      if (0 === d) {
        a.removeChild(e);
        bd(b);
        return;
      }
      d--;
    } else "$" !== c && "$?" !== c && "$!" !== c || d++;
    c = e;
  } while (c);
  bd(b);
}
function Lf(a) {
  for (; null != a; a = a.nextSibling) {
    var b = a.nodeType;
    if (1 === b || 3 === b) break;
    if (8 === b) {
      b = a.data;
      if ("$" === b || "$!" === b || "$?" === b) break;
      if ("/$" === b) return null;
    }
  }
  return a;
}
function Mf(a) {
  a = a.previousSibling;
  for (var b = 0; a; ) {
    if (8 === a.nodeType) {
      var c = a.data;
      if ("$" === c || "$!" === c || "$?" === c) {
        if (0 === b) return a;
        b--;
      } else "/$" === c && b++;
    }
    a = a.previousSibling;
  }
  return null;
}
var Nf = Math.random().toString(36).slice(2), Of = "__reactFiber$" + Nf, Pf = "__reactProps$" + Nf, uf = "__reactContainer$" + Nf, of = "__reactEvents$" + Nf, Qf = "__reactListeners$" + Nf, Rf = "__reactHandles$" + Nf;
function Wc(a) {
  var b = a[Of];
  if (b) return b;
  for (var c = a.parentNode; c; ) {
    if (b = c[uf] || c[Of]) {
      c = b.alternate;
      if (null !== b.child || null !== c && null !== c.child) for (a = Mf(a); null !== a; ) {
        if (c = a[Of]) return c;
        a = Mf(a);
      }
      return b;
    }
    a = c;
    c = a.parentNode;
  }
  return null;
}
function Cb(a) {
  a = a[Of] || a[uf];
  return !a || 5 !== a.tag && 6 !== a.tag && 13 !== a.tag && 3 !== a.tag ? null : a;
}
function ue(a) {
  if (5 === a.tag || 6 === a.tag) return a.stateNode;
  throw Error(p(33));
}
function Db(a) {
  return a[Pf] || null;
}
var Sf = [], Tf = -1;
function Uf(a) {
  return { current: a };
}
function E(a) {
  0 > Tf || (a.current = Sf[Tf], Sf[Tf] = null, Tf--);
}
function G(a, b) {
  Tf++;
  Sf[Tf] = a.current;
  a.current = b;
}
var Vf = {}, H = Uf(Vf), Wf = Uf(false), Xf = Vf;
function Yf(a, b) {
  var c = a.type.contextTypes;
  if (!c) return Vf;
  var d = a.stateNode;
  if (d && d.__reactInternalMemoizedUnmaskedChildContext === b) return d.__reactInternalMemoizedMaskedChildContext;
  var e = {}, f2;
  for (f2 in c) e[f2] = b[f2];
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = b, a.__reactInternalMemoizedMaskedChildContext = e);
  return e;
}
function Zf(a) {
  a = a.childContextTypes;
  return null !== a && void 0 !== a;
}
function $f() {
  E(Wf);
  E(H);
}
function ag(a, b, c) {
  if (H.current !== Vf) throw Error(p(168));
  G(H, b);
  G(Wf, c);
}
function bg(a, b, c) {
  var d = a.stateNode;
  b = b.childContextTypes;
  if ("function" !== typeof d.getChildContext) return c;
  d = d.getChildContext();
  for (var e in d) if (!(e in b)) throw Error(p(108, Ra(a) || "Unknown", e));
  return A({}, c, d);
}
function cg(a) {
  a = (a = a.stateNode) && a.__reactInternalMemoizedMergedChildContext || Vf;
  Xf = H.current;
  G(H, a);
  G(Wf, Wf.current);
  return true;
}
function dg(a, b, c) {
  var d = a.stateNode;
  if (!d) throw Error(p(169));
  c ? (a = bg(a, b, Xf), d.__reactInternalMemoizedMergedChildContext = a, E(Wf), E(H), G(H, a)) : E(Wf);
  G(Wf, c);
}
var eg = null, fg = false, gg = false;
function hg(a) {
  null === eg ? eg = [a] : eg.push(a);
}
function ig(a) {
  fg = true;
  hg(a);
}
function jg() {
  if (!gg && null !== eg) {
    gg = true;
    var a = 0, b = C;
    try {
      var c = eg;
      for (C = 1; a < c.length; a++) {
        var d = c[a];
        do
          d = d(true);
        while (null !== d);
      }
      eg = null;
      fg = false;
    } catch (e) {
      throw null !== eg && (eg = eg.slice(a + 1)), ac(fc, jg), e;
    } finally {
      C = b, gg = false;
    }
  }
  return null;
}
var kg = [], lg = 0, mg = null, ng = 0, og = [], pg = 0, qg = null, rg = 1, sg = "";
function tg(a, b) {
  kg[lg++] = ng;
  kg[lg++] = mg;
  mg = a;
  ng = b;
}
function ug(a, b, c) {
  og[pg++] = rg;
  og[pg++] = sg;
  og[pg++] = qg;
  qg = a;
  var d = rg;
  a = sg;
  var e = 32 - oc(d) - 1;
  d &= ~(1 << e);
  c += 1;
  var f2 = 32 - oc(b) + e;
  if (30 < f2) {
    var g = e - e % 5;
    f2 = (d & (1 << g) - 1).toString(32);
    d >>= g;
    e -= g;
    rg = 1 << 32 - oc(b) + e | c << e | d;
    sg = f2 + a;
  } else rg = 1 << f2 | c << e | d, sg = a;
}
function vg(a) {
  null !== a.return && (tg(a, 1), ug(a, 1, 0));
}
function wg(a) {
  for (; a === mg; ) mg = kg[--lg], kg[lg] = null, ng = kg[--lg], kg[lg] = null;
  for (; a === qg; ) qg = og[--pg], og[pg] = null, sg = og[--pg], og[pg] = null, rg = og[--pg], og[pg] = null;
}
var xg = null, yg = null, I = false, zg = null;
function Ag(a, b) {
  var c = Bg(5, null, null, 0);
  c.elementType = "DELETED";
  c.stateNode = b;
  c.return = a;
  b = a.deletions;
  null === b ? (a.deletions = [c], a.flags |= 16) : b.push(c);
}
function Cg(a, b) {
  switch (a.tag) {
    case 5:
      var c = a.type;
      b = 1 !== b.nodeType || c.toLowerCase() !== b.nodeName.toLowerCase() ? null : b;
      return null !== b ? (a.stateNode = b, xg = a, yg = Lf(b.firstChild), true) : false;
    case 6:
      return b = "" === a.pendingProps || 3 !== b.nodeType ? null : b, null !== b ? (a.stateNode = b, xg = a, yg = null, true) : false;
    case 13:
      return b = 8 !== b.nodeType ? null : b, null !== b ? (c = null !== qg ? { id: rg, overflow: sg } : null, a.memoizedState = { dehydrated: b, treeContext: c, retryLane: 1073741824 }, c = Bg(18, null, null, 0), c.stateNode = b, c.return = a, a.child = c, xg = a, yg = null, true) : false;
    default:
      return false;
  }
}
function Dg(a) {
  return 0 !== (a.mode & 1) && 0 === (a.flags & 128);
}
function Eg(a) {
  if (I) {
    var b = yg;
    if (b) {
      var c = b;
      if (!Cg(a, b)) {
        if (Dg(a)) throw Error(p(418));
        b = Lf(c.nextSibling);
        var d = xg;
        b && Cg(a, b) ? Ag(d, c) : (a.flags = a.flags & -4097 | 2, I = false, xg = a);
      }
    } else {
      if (Dg(a)) throw Error(p(418));
      a.flags = a.flags & -4097 | 2;
      I = false;
      xg = a;
    }
  }
}
function Fg(a) {
  for (a = a.return; null !== a && 5 !== a.tag && 3 !== a.tag && 13 !== a.tag; ) a = a.return;
  xg = a;
}
function Gg(a) {
  if (a !== xg) return false;
  if (!I) return Fg(a), I = true, false;
  var b;
  (b = 3 !== a.tag) && !(b = 5 !== a.tag) && (b = a.type, b = "head" !== b && "body" !== b && !Ef(a.type, a.memoizedProps));
  if (b && (b = yg)) {
    if (Dg(a)) throw Hg(), Error(p(418));
    for (; b; ) Ag(a, b), b = Lf(b.nextSibling);
  }
  Fg(a);
  if (13 === a.tag) {
    a = a.memoizedState;
    a = null !== a ? a.dehydrated : null;
    if (!a) throw Error(p(317));
    a: {
      a = a.nextSibling;
      for (b = 0; a; ) {
        if (8 === a.nodeType) {
          var c = a.data;
          if ("/$" === c) {
            if (0 === b) {
              yg = Lf(a.nextSibling);
              break a;
            }
            b--;
          } else "$" !== c && "$!" !== c && "$?" !== c || b++;
        }
        a = a.nextSibling;
      }
      yg = null;
    }
  } else yg = xg ? Lf(a.stateNode.nextSibling) : null;
  return true;
}
function Hg() {
  for (var a = yg; a; ) a = Lf(a.nextSibling);
}
function Ig() {
  yg = xg = null;
  I = false;
}
function Jg(a) {
  null === zg ? zg = [a] : zg.push(a);
}
var Kg = ua.ReactCurrentBatchConfig;
function Lg(a, b, c) {
  a = c.ref;
  if (null !== a && "function" !== typeof a && "object" !== typeof a) {
    if (c._owner) {
      c = c._owner;
      if (c) {
        if (1 !== c.tag) throw Error(p(309));
        var d = c.stateNode;
      }
      if (!d) throw Error(p(147, a));
      var e = d, f2 = "" + a;
      if (null !== b && null !== b.ref && "function" === typeof b.ref && b.ref._stringRef === f2) return b.ref;
      b = function(a2) {
        var b2 = e.refs;
        null === a2 ? delete b2[f2] : b2[f2] = a2;
      };
      b._stringRef = f2;
      return b;
    }
    if ("string" !== typeof a) throw Error(p(284));
    if (!c._owner) throw Error(p(290, a));
  }
  return a;
}
function Mg(a, b) {
  a = Object.prototype.toString.call(b);
  throw Error(p(31, "[object Object]" === a ? "object with keys {" + Object.keys(b).join(", ") + "}" : a));
}
function Ng(a) {
  var b = a._init;
  return b(a._payload);
}
function Og(a) {
  function b(b2, c2) {
    if (a) {
      var d2 = b2.deletions;
      null === d2 ? (b2.deletions = [c2], b2.flags |= 16) : d2.push(c2);
    }
  }
  function c(c2, d2) {
    if (!a) return null;
    for (; null !== d2; ) b(c2, d2), d2 = d2.sibling;
    return null;
  }
  function d(a2, b2) {
    for (a2 = /* @__PURE__ */ new Map(); null !== b2; ) null !== b2.key ? a2.set(b2.key, b2) : a2.set(b2.index, b2), b2 = b2.sibling;
    return a2;
  }
  function e(a2, b2) {
    a2 = Pg(a2, b2);
    a2.index = 0;
    a2.sibling = null;
    return a2;
  }
  function f2(b2, c2, d2) {
    b2.index = d2;
    if (!a) return b2.flags |= 1048576, c2;
    d2 = b2.alternate;
    if (null !== d2) return d2 = d2.index, d2 < c2 ? (b2.flags |= 2, c2) : d2;
    b2.flags |= 2;
    return c2;
  }
  function g(b2) {
    a && null === b2.alternate && (b2.flags |= 2);
    return b2;
  }
  function h(a2, b2, c2, d2) {
    if (null === b2 || 6 !== b2.tag) return b2 = Qg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function k2(a2, b2, c2, d2) {
    var f3 = c2.type;
    if (f3 === ya) return m2(a2, b2, c2.props.children, d2, c2.key);
    if (null !== b2 && (b2.elementType === f3 || "object" === typeof f3 && null !== f3 && f3.$$typeof === Ha && Ng(f3) === b2.type)) return d2 = e(b2, c2.props), d2.ref = Lg(a2, b2, c2), d2.return = a2, d2;
    d2 = Rg(c2.type, c2.key, c2.props, null, a2.mode, d2);
    d2.ref = Lg(a2, b2, c2);
    d2.return = a2;
    return d2;
  }
  function l2(a2, b2, c2, d2) {
    if (null === b2 || 4 !== b2.tag || b2.stateNode.containerInfo !== c2.containerInfo || b2.stateNode.implementation !== c2.implementation) return b2 = Sg(c2, a2.mode, d2), b2.return = a2, b2;
    b2 = e(b2, c2.children || []);
    b2.return = a2;
    return b2;
  }
  function m2(a2, b2, c2, d2, f3) {
    if (null === b2 || 7 !== b2.tag) return b2 = Tg(c2, a2.mode, d2, f3), b2.return = a2, b2;
    b2 = e(b2, c2);
    b2.return = a2;
    return b2;
  }
  function q2(a2, b2, c2) {
    if ("string" === typeof b2 && "" !== b2 || "number" === typeof b2) return b2 = Qg("" + b2, a2.mode, c2), b2.return = a2, b2;
    if ("object" === typeof b2 && null !== b2) {
      switch (b2.$$typeof) {
        case va:
          return c2 = Rg(b2.type, b2.key, b2.props, null, a2.mode, c2), c2.ref = Lg(a2, null, b2), c2.return = a2, c2;
        case wa:
          return b2 = Sg(b2, a2.mode, c2), b2.return = a2, b2;
        case Ha:
          var d2 = b2._init;
          return q2(a2, d2(b2._payload), c2);
      }
      if (eb(b2) || Ka(b2)) return b2 = Tg(b2, a2.mode, c2, null), b2.return = a2, b2;
      Mg(a2, b2);
    }
    return null;
  }
  function r2(a2, b2, c2, d2) {
    var e2 = null !== b2 ? b2.key : null;
    if ("string" === typeof c2 && "" !== c2 || "number" === typeof c2) return null !== e2 ? null : h(a2, b2, "" + c2, d2);
    if ("object" === typeof c2 && null !== c2) {
      switch (c2.$$typeof) {
        case va:
          return c2.key === e2 ? k2(a2, b2, c2, d2) : null;
        case wa:
          return c2.key === e2 ? l2(a2, b2, c2, d2) : null;
        case Ha:
          return e2 = c2._init, r2(
            a2,
            b2,
            e2(c2._payload),
            d2
          );
      }
      if (eb(c2) || Ka(c2)) return null !== e2 ? null : m2(a2, b2, c2, d2, null);
      Mg(a2, c2);
    }
    return null;
  }
  function y2(a2, b2, c2, d2, e2) {
    if ("string" === typeof d2 && "" !== d2 || "number" === typeof d2) return a2 = a2.get(c2) || null, h(b2, a2, "" + d2, e2);
    if ("object" === typeof d2 && null !== d2) {
      switch (d2.$$typeof) {
        case va:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, k2(b2, a2, d2, e2);
        case wa:
          return a2 = a2.get(null === d2.key ? c2 : d2.key) || null, l2(b2, a2, d2, e2);
        case Ha:
          var f3 = d2._init;
          return y2(a2, b2, c2, f3(d2._payload), e2);
      }
      if (eb(d2) || Ka(d2)) return a2 = a2.get(c2) || null, m2(b2, a2, d2, e2, null);
      Mg(b2, d2);
    }
    return null;
  }
  function n2(e2, g2, h2, k3) {
    for (var l3 = null, m3 = null, u2 = g2, w2 = g2 = 0, x2 = null; null !== u2 && w2 < h2.length; w2++) {
      u2.index > w2 ? (x2 = u2, u2 = null) : x2 = u2.sibling;
      var n3 = r2(e2, u2, h2[w2], k3);
      if (null === n3) {
        null === u2 && (u2 = x2);
        break;
      }
      a && u2 && null === n3.alternate && b(e2, u2);
      g2 = f2(n3, g2, w2);
      null === m3 ? l3 = n3 : m3.sibling = n3;
      m3 = n3;
      u2 = x2;
    }
    if (w2 === h2.length) return c(e2, u2), I && tg(e2, w2), l3;
    if (null === u2) {
      for (; w2 < h2.length; w2++) u2 = q2(e2, h2[w2], k3), null !== u2 && (g2 = f2(u2, g2, w2), null === m3 ? l3 = u2 : m3.sibling = u2, m3 = u2);
      I && tg(e2, w2);
      return l3;
    }
    for (u2 = d(e2, u2); w2 < h2.length; w2++) x2 = y2(u2, e2, w2, h2[w2], k3), null !== x2 && (a && null !== x2.alternate && u2.delete(null === x2.key ? w2 : x2.key), g2 = f2(x2, g2, w2), null === m3 ? l3 = x2 : m3.sibling = x2, m3 = x2);
    a && u2.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function t2(e2, g2, h2, k3) {
    var l3 = Ka(h2);
    if ("function" !== typeof l3) throw Error(p(150));
    h2 = l3.call(h2);
    if (null == h2) throw Error(p(151));
    for (var u2 = l3 = null, m3 = g2, w2 = g2 = 0, x2 = null, n3 = h2.next(); null !== m3 && !n3.done; w2++, n3 = h2.next()) {
      m3.index > w2 ? (x2 = m3, m3 = null) : x2 = m3.sibling;
      var t3 = r2(e2, m3, n3.value, k3);
      if (null === t3) {
        null === m3 && (m3 = x2);
        break;
      }
      a && m3 && null === t3.alternate && b(e2, m3);
      g2 = f2(t3, g2, w2);
      null === u2 ? l3 = t3 : u2.sibling = t3;
      u2 = t3;
      m3 = x2;
    }
    if (n3.done) return c(
      e2,
      m3
    ), I && tg(e2, w2), l3;
    if (null === m3) {
      for (; !n3.done; w2++, n3 = h2.next()) n3 = q2(e2, n3.value, k3), null !== n3 && (g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
      I && tg(e2, w2);
      return l3;
    }
    for (m3 = d(e2, m3); !n3.done; w2++, n3 = h2.next()) n3 = y2(m3, e2, w2, n3.value, k3), null !== n3 && (a && null !== n3.alternate && m3.delete(null === n3.key ? w2 : n3.key), g2 = f2(n3, g2, w2), null === u2 ? l3 = n3 : u2.sibling = n3, u2 = n3);
    a && m3.forEach(function(a2) {
      return b(e2, a2);
    });
    I && tg(e2, w2);
    return l3;
  }
  function J2(a2, d2, f3, h2) {
    "object" === typeof f3 && null !== f3 && f3.type === ya && null === f3.key && (f3 = f3.props.children);
    if ("object" === typeof f3 && null !== f3) {
      switch (f3.$$typeof) {
        case va:
          a: {
            for (var k3 = f3.key, l3 = d2; null !== l3; ) {
              if (l3.key === k3) {
                k3 = f3.type;
                if (k3 === ya) {
                  if (7 === l3.tag) {
                    c(a2, l3.sibling);
                    d2 = e(l3, f3.props.children);
                    d2.return = a2;
                    a2 = d2;
                    break a;
                  }
                } else if (l3.elementType === k3 || "object" === typeof k3 && null !== k3 && k3.$$typeof === Ha && Ng(k3) === l3.type) {
                  c(a2, l3.sibling);
                  d2 = e(l3, f3.props);
                  d2.ref = Lg(a2, l3, f3);
                  d2.return = a2;
                  a2 = d2;
                  break a;
                }
                c(a2, l3);
                break;
              } else b(a2, l3);
              l3 = l3.sibling;
            }
            f3.type === ya ? (d2 = Tg(f3.props.children, a2.mode, h2, f3.key), d2.return = a2, a2 = d2) : (h2 = Rg(f3.type, f3.key, f3.props, null, a2.mode, h2), h2.ref = Lg(a2, d2, f3), h2.return = a2, a2 = h2);
          }
          return g(a2);
        case wa:
          a: {
            for (l3 = f3.key; null !== d2; ) {
              if (d2.key === l3) if (4 === d2.tag && d2.stateNode.containerInfo === f3.containerInfo && d2.stateNode.implementation === f3.implementation) {
                c(a2, d2.sibling);
                d2 = e(d2, f3.children || []);
                d2.return = a2;
                a2 = d2;
                break a;
              } else {
                c(a2, d2);
                break;
              }
              else b(a2, d2);
              d2 = d2.sibling;
            }
            d2 = Sg(f3, a2.mode, h2);
            d2.return = a2;
            a2 = d2;
          }
          return g(a2);
        case Ha:
          return l3 = f3._init, J2(a2, d2, l3(f3._payload), h2);
      }
      if (eb(f3)) return n2(a2, d2, f3, h2);
      if (Ka(f3)) return t2(a2, d2, f3, h2);
      Mg(a2, f3);
    }
    return "string" === typeof f3 && "" !== f3 || "number" === typeof f3 ? (f3 = "" + f3, null !== d2 && 6 === d2.tag ? (c(a2, d2.sibling), d2 = e(d2, f3), d2.return = a2, a2 = d2) : (c(a2, d2), d2 = Qg(f3, a2.mode, h2), d2.return = a2, a2 = d2), g(a2)) : c(a2, d2);
  }
  return J2;
}
var Ug = Og(true), Vg = Og(false), Wg = Uf(null), Xg = null, Yg = null, Zg = null;
function $g() {
  Zg = Yg = Xg = null;
}
function ah(a) {
  var b = Wg.current;
  E(Wg);
  a._currentValue = b;
}
function bh(a, b, c) {
  for (; null !== a; ) {
    var d = a.alternate;
    (a.childLanes & b) !== b ? (a.childLanes |= b, null !== d && (d.childLanes |= b)) : null !== d && (d.childLanes & b) !== b && (d.childLanes |= b);
    if (a === c) break;
    a = a.return;
  }
}
function ch(a, b) {
  Xg = a;
  Zg = Yg = null;
  a = a.dependencies;
  null !== a && null !== a.firstContext && (0 !== (a.lanes & b) && (dh = true), a.firstContext = null);
}
function eh(a) {
  var b = a._currentValue;
  if (Zg !== a) if (a = { context: a, memoizedValue: b, next: null }, null === Yg) {
    if (null === Xg) throw Error(p(308));
    Yg = a;
    Xg.dependencies = { lanes: 0, firstContext: a };
  } else Yg = Yg.next = a;
  return b;
}
var fh = null;
function gh(a) {
  null === fh ? fh = [a] : fh.push(a);
}
function hh(a, b, c, d) {
  var e = b.interleaved;
  null === e ? (c.next = c, gh(b)) : (c.next = e.next, e.next = c);
  b.interleaved = c;
  return ih(a, d);
}
function ih(a, b) {
  a.lanes |= b;
  var c = a.alternate;
  null !== c && (c.lanes |= b);
  c = a;
  for (a = a.return; null !== a; ) a.childLanes |= b, c = a.alternate, null !== c && (c.childLanes |= b), c = a, a = a.return;
  return 3 === c.tag ? c.stateNode : null;
}
var jh = false;
function kh(a) {
  a.updateQueue = { baseState: a.memoizedState, firstBaseUpdate: null, lastBaseUpdate: null, shared: { pending: null, interleaved: null, lanes: 0 }, effects: null };
}
function lh(a, b) {
  a = a.updateQueue;
  b.updateQueue === a && (b.updateQueue = { baseState: a.baseState, firstBaseUpdate: a.firstBaseUpdate, lastBaseUpdate: a.lastBaseUpdate, shared: a.shared, effects: a.effects });
}
function mh(a, b) {
  return { eventTime: a, lane: b, tag: 0, payload: null, callback: null, next: null };
}
function nh(a, b, c) {
  var d = a.updateQueue;
  if (null === d) return null;
  d = d.shared;
  if (0 !== (K & 2)) {
    var e = d.pending;
    null === e ? b.next = b : (b.next = e.next, e.next = b);
    d.pending = b;
    return ih(a, c);
  }
  e = d.interleaved;
  null === e ? (b.next = b, gh(d)) : (b.next = e.next, e.next = b);
  d.interleaved = b;
  return ih(a, c);
}
function oh(a, b, c) {
  b = b.updateQueue;
  if (null !== b && (b = b.shared, 0 !== (c & 4194240))) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
function ph(a, b) {
  var c = a.updateQueue, d = a.alternate;
  if (null !== d && (d = d.updateQueue, c === d)) {
    var e = null, f2 = null;
    c = c.firstBaseUpdate;
    if (null !== c) {
      do {
        var g = { eventTime: c.eventTime, lane: c.lane, tag: c.tag, payload: c.payload, callback: c.callback, next: null };
        null === f2 ? e = f2 = g : f2 = f2.next = g;
        c = c.next;
      } while (null !== c);
      null === f2 ? e = f2 = b : f2 = f2.next = b;
    } else e = f2 = b;
    c = { baseState: d.baseState, firstBaseUpdate: e, lastBaseUpdate: f2, shared: d.shared, effects: d.effects };
    a.updateQueue = c;
    return;
  }
  a = c.lastBaseUpdate;
  null === a ? c.firstBaseUpdate = b : a.next = b;
  c.lastBaseUpdate = b;
}
function qh(a, b, c, d) {
  var e = a.updateQueue;
  jh = false;
  var f2 = e.firstBaseUpdate, g = e.lastBaseUpdate, h = e.shared.pending;
  if (null !== h) {
    e.shared.pending = null;
    var k2 = h, l2 = k2.next;
    k2.next = null;
    null === g ? f2 = l2 : g.next = l2;
    g = k2;
    var m2 = a.alternate;
    null !== m2 && (m2 = m2.updateQueue, h = m2.lastBaseUpdate, h !== g && (null === h ? m2.firstBaseUpdate = l2 : h.next = l2, m2.lastBaseUpdate = k2));
  }
  if (null !== f2) {
    var q2 = e.baseState;
    g = 0;
    m2 = l2 = k2 = null;
    h = f2;
    do {
      var r2 = h.lane, y2 = h.eventTime;
      if ((d & r2) === r2) {
        null !== m2 && (m2 = m2.next = {
          eventTime: y2,
          lane: 0,
          tag: h.tag,
          payload: h.payload,
          callback: h.callback,
          next: null
        });
        a: {
          var n2 = a, t2 = h;
          r2 = b;
          y2 = c;
          switch (t2.tag) {
            case 1:
              n2 = t2.payload;
              if ("function" === typeof n2) {
                q2 = n2.call(y2, q2, r2);
                break a;
              }
              q2 = n2;
              break a;
            case 3:
              n2.flags = n2.flags & -65537 | 128;
            case 0:
              n2 = t2.payload;
              r2 = "function" === typeof n2 ? n2.call(y2, q2, r2) : n2;
              if (null === r2 || void 0 === r2) break a;
              q2 = A({}, q2, r2);
              break a;
            case 2:
              jh = true;
          }
        }
        null !== h.callback && 0 !== h.lane && (a.flags |= 64, r2 = e.effects, null === r2 ? e.effects = [h] : r2.push(h));
      } else y2 = { eventTime: y2, lane: r2, tag: h.tag, payload: h.payload, callback: h.callback, next: null }, null === m2 ? (l2 = m2 = y2, k2 = q2) : m2 = m2.next = y2, g |= r2;
      h = h.next;
      if (null === h) if (h = e.shared.pending, null === h) break;
      else r2 = h, h = r2.next, r2.next = null, e.lastBaseUpdate = r2, e.shared.pending = null;
    } while (1);
    null === m2 && (k2 = q2);
    e.baseState = k2;
    e.firstBaseUpdate = l2;
    e.lastBaseUpdate = m2;
    b = e.shared.interleaved;
    if (null !== b) {
      e = b;
      do
        g |= e.lane, e = e.next;
      while (e !== b);
    } else null === f2 && (e.shared.lanes = 0);
    rh |= g;
    a.lanes = g;
    a.memoizedState = q2;
  }
}
function sh(a, b, c) {
  a = b.effects;
  b.effects = null;
  if (null !== a) for (b = 0; b < a.length; b++) {
    var d = a[b], e = d.callback;
    if (null !== e) {
      d.callback = null;
      d = c;
      if ("function" !== typeof e) throw Error(p(191, e));
      e.call(d);
    }
  }
}
var th = {}, uh = Uf(th), vh = Uf(th), wh = Uf(th);
function xh(a) {
  if (a === th) throw Error(p(174));
  return a;
}
function yh(a, b) {
  G(wh, b);
  G(vh, a);
  G(uh, th);
  a = b.nodeType;
  switch (a) {
    case 9:
    case 11:
      b = (b = b.documentElement) ? b.namespaceURI : lb(null, "");
      break;
    default:
      a = 8 === a ? b.parentNode : b, b = a.namespaceURI || null, a = a.tagName, b = lb(b, a);
  }
  E(uh);
  G(uh, b);
}
function zh() {
  E(uh);
  E(vh);
  E(wh);
}
function Ah(a) {
  xh(wh.current);
  var b = xh(uh.current);
  var c = lb(b, a.type);
  b !== c && (G(vh, a), G(uh, c));
}
function Bh(a) {
  vh.current === a && (E(uh), E(vh));
}
var L = Uf(0);
function Ch(a) {
  for (var b = a; null !== b; ) {
    if (13 === b.tag) {
      var c = b.memoizedState;
      if (null !== c && (c = c.dehydrated, null === c || "$?" === c.data || "$!" === c.data)) return b;
    } else if (19 === b.tag && void 0 !== b.memoizedProps.revealOrder) {
      if (0 !== (b.flags & 128)) return b;
    } else if (null !== b.child) {
      b.child.return = b;
      b = b.child;
      continue;
    }
    if (b === a) break;
    for (; null === b.sibling; ) {
      if (null === b.return || b.return === a) return null;
      b = b.return;
    }
    b.sibling.return = b.return;
    b = b.sibling;
  }
  return null;
}
var Dh = [];
function Eh() {
  for (var a = 0; a < Dh.length; a++) Dh[a]._workInProgressVersionPrimary = null;
  Dh.length = 0;
}
var Fh = ua.ReactCurrentDispatcher, Gh = ua.ReactCurrentBatchConfig, Hh = 0, M = null, N = null, O = null, Ih = false, Jh = false, Kh = 0, Lh = 0;
function P() {
  throw Error(p(321));
}
function Mh(a, b) {
  if (null === b) return false;
  for (var c = 0; c < b.length && c < a.length; c++) if (!He(a[c], b[c])) return false;
  return true;
}
function Nh(a, b, c, d, e, f2) {
  Hh = f2;
  M = b;
  b.memoizedState = null;
  b.updateQueue = null;
  b.lanes = 0;
  Fh.current = null === a || null === a.memoizedState ? Oh : Ph;
  a = c(d, e);
  if (Jh) {
    f2 = 0;
    do {
      Jh = false;
      Kh = 0;
      if (25 <= f2) throw Error(p(301));
      f2 += 1;
      O = N = null;
      b.updateQueue = null;
      Fh.current = Qh;
      a = c(d, e);
    } while (Jh);
  }
  Fh.current = Rh;
  b = null !== N && null !== N.next;
  Hh = 0;
  O = N = M = null;
  Ih = false;
  if (b) throw Error(p(300));
  return a;
}
function Sh() {
  var a = 0 !== Kh;
  Kh = 0;
  return a;
}
function Th() {
  var a = { memoizedState: null, baseState: null, baseQueue: null, queue: null, next: null };
  null === O ? M.memoizedState = O = a : O = O.next = a;
  return O;
}
function Uh() {
  if (null === N) {
    var a = M.alternate;
    a = null !== a ? a.memoizedState : null;
  } else a = N.next;
  var b = null === O ? M.memoizedState : O.next;
  if (null !== b) O = b, N = a;
  else {
    if (null === a) throw Error(p(310));
    N = a;
    a = { memoizedState: N.memoizedState, baseState: N.baseState, baseQueue: N.baseQueue, queue: N.queue, next: null };
    null === O ? M.memoizedState = O = a : O = O.next = a;
  }
  return O;
}
function Vh(a, b) {
  return "function" === typeof b ? b(a) : b;
}
function Wh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = N, e = d.baseQueue, f2 = c.pending;
  if (null !== f2) {
    if (null !== e) {
      var g = e.next;
      e.next = f2.next;
      f2.next = g;
    }
    d.baseQueue = e = f2;
    c.pending = null;
  }
  if (null !== e) {
    f2 = e.next;
    d = d.baseState;
    var h = g = null, k2 = null, l2 = f2;
    do {
      var m2 = l2.lane;
      if ((Hh & m2) === m2) null !== k2 && (k2 = k2.next = { lane: 0, action: l2.action, hasEagerState: l2.hasEagerState, eagerState: l2.eagerState, next: null }), d = l2.hasEagerState ? l2.eagerState : a(d, l2.action);
      else {
        var q2 = {
          lane: m2,
          action: l2.action,
          hasEagerState: l2.hasEagerState,
          eagerState: l2.eagerState,
          next: null
        };
        null === k2 ? (h = k2 = q2, g = d) : k2 = k2.next = q2;
        M.lanes |= m2;
        rh |= m2;
      }
      l2 = l2.next;
    } while (null !== l2 && l2 !== f2);
    null === k2 ? g = d : k2.next = h;
    He(d, b.memoizedState) || (dh = true);
    b.memoizedState = d;
    b.baseState = g;
    b.baseQueue = k2;
    c.lastRenderedState = d;
  }
  a = c.interleaved;
  if (null !== a) {
    e = a;
    do
      f2 = e.lane, M.lanes |= f2, rh |= f2, e = e.next;
    while (e !== a);
  } else null === e && (c.lanes = 0);
  return [b.memoizedState, c.dispatch];
}
function Xh(a) {
  var b = Uh(), c = b.queue;
  if (null === c) throw Error(p(311));
  c.lastRenderedReducer = a;
  var d = c.dispatch, e = c.pending, f2 = b.memoizedState;
  if (null !== e) {
    c.pending = null;
    var g = e = e.next;
    do
      f2 = a(f2, g.action), g = g.next;
    while (g !== e);
    He(f2, b.memoizedState) || (dh = true);
    b.memoizedState = f2;
    null === b.baseQueue && (b.baseState = f2);
    c.lastRenderedState = f2;
  }
  return [f2, d];
}
function Yh() {
}
function Zh(a, b) {
  var c = M, d = Uh(), e = b(), f2 = !He(d.memoizedState, e);
  f2 && (d.memoizedState = e, dh = true);
  d = d.queue;
  $h(ai.bind(null, c, d, a), [a]);
  if (d.getSnapshot !== b || f2 || null !== O && O.memoizedState.tag & 1) {
    c.flags |= 2048;
    bi(9, ci.bind(null, c, d, e, b), void 0, null);
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(c, b, e);
  }
  return e;
}
function di(a, b, c) {
  a.flags |= 16384;
  a = { getSnapshot: b, value: c };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.stores = [a]) : (c = b.stores, null === c ? b.stores = [a] : c.push(a));
}
function ci(a, b, c, d) {
  b.value = c;
  b.getSnapshot = d;
  ei(b) && fi(a);
}
function ai(a, b, c) {
  return c(function() {
    ei(b) && fi(a);
  });
}
function ei(a) {
  var b = a.getSnapshot;
  a = a.value;
  try {
    var c = b();
    return !He(a, c);
  } catch (d) {
    return true;
  }
}
function fi(a) {
  var b = ih(a, 1);
  null !== b && gi(b, a, 1, -1);
}
function hi(a) {
  var b = Th();
  "function" === typeof a && (a = a());
  b.memoizedState = b.baseState = a;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: Vh, lastRenderedState: a };
  b.queue = a;
  a = a.dispatch = ii.bind(null, M, a);
  return [b.memoizedState, a];
}
function bi(a, b, c, d) {
  a = { tag: a, create: b, destroy: c, deps: d, next: null };
  b = M.updateQueue;
  null === b ? (b = { lastEffect: null, stores: null }, M.updateQueue = b, b.lastEffect = a.next = a) : (c = b.lastEffect, null === c ? b.lastEffect = a.next = a : (d = c.next, c.next = a, a.next = d, b.lastEffect = a));
  return a;
}
function ji() {
  return Uh().memoizedState;
}
function ki(a, b, c, d) {
  var e = Th();
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, void 0, void 0 === d ? null : d);
}
function li(a, b, c, d) {
  var e = Uh();
  d = void 0 === d ? null : d;
  var f2 = void 0;
  if (null !== N) {
    var g = N.memoizedState;
    f2 = g.destroy;
    if (null !== d && Mh(d, g.deps)) {
      e.memoizedState = bi(b, c, f2, d);
      return;
    }
  }
  M.flags |= a;
  e.memoizedState = bi(1 | b, c, f2, d);
}
function mi(a, b) {
  return ki(8390656, 8, a, b);
}
function $h(a, b) {
  return li(2048, 8, a, b);
}
function ni(a, b) {
  return li(4, 2, a, b);
}
function oi(a, b) {
  return li(4, 4, a, b);
}
function pi(a, b) {
  if ("function" === typeof b) return a = a(), b(a), function() {
    b(null);
  };
  if (null !== b && void 0 !== b) return a = a(), b.current = a, function() {
    b.current = null;
  };
}
function qi(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return li(4, 4, pi.bind(null, b, a), c);
}
function ri() {
}
function si(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  c.memoizedState = [a, b];
  return a;
}
function ti(a, b) {
  var c = Uh();
  b = void 0 === b ? null : b;
  var d = c.memoizedState;
  if (null !== d && null !== b && Mh(b, d[1])) return d[0];
  a = a();
  c.memoizedState = [a, b];
  return a;
}
function ui(a, b, c) {
  if (0 === (Hh & 21)) return a.baseState && (a.baseState = false, dh = true), a.memoizedState = c;
  He(c, b) || (c = yc(), M.lanes |= c, rh |= c, a.baseState = true);
  return b;
}
function vi(a, b) {
  var c = C;
  C = 0 !== c && 4 > c ? c : 4;
  a(true);
  var d = Gh.transition;
  Gh.transition = {};
  try {
    a(false), b();
  } finally {
    C = c, Gh.transition = d;
  }
}
function wi() {
  return Uh().memoizedState;
}
function xi(a, b, c) {
  var d = yi(a);
  c = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, c);
  else if (c = hh(a, b, c, d), null !== c) {
    var e = R();
    gi(c, a, d, e);
    Bi(c, b, d);
  }
}
function ii(a, b, c) {
  var d = yi(a), e = { lane: d, action: c, hasEagerState: false, eagerState: null, next: null };
  if (zi(a)) Ai(b, e);
  else {
    var f2 = a.alternate;
    if (0 === a.lanes && (null === f2 || 0 === f2.lanes) && (f2 = b.lastRenderedReducer, null !== f2)) try {
      var g = b.lastRenderedState, h = f2(g, c);
      e.hasEagerState = true;
      e.eagerState = h;
      if (He(h, g)) {
        var k2 = b.interleaved;
        null === k2 ? (e.next = e, gh(b)) : (e.next = k2.next, k2.next = e);
        b.interleaved = e;
        return;
      }
    } catch (l2) {
    } finally {
    }
    c = hh(a, b, e, d);
    null !== c && (e = R(), gi(c, a, d, e), Bi(c, b, d));
  }
}
function zi(a) {
  var b = a.alternate;
  return a === M || null !== b && b === M;
}
function Ai(a, b) {
  Jh = Ih = true;
  var c = a.pending;
  null === c ? b.next = b : (b.next = c.next, c.next = b);
  a.pending = b;
}
function Bi(a, b, c) {
  if (0 !== (c & 4194240)) {
    var d = b.lanes;
    d &= a.pendingLanes;
    c |= d;
    b.lanes = c;
    Cc(a, c);
  }
}
var Rh = { readContext: eh, useCallback: P, useContext: P, useEffect: P, useImperativeHandle: P, useInsertionEffect: P, useLayoutEffect: P, useMemo: P, useReducer: P, useRef: P, useState: P, useDebugValue: P, useDeferredValue: P, useTransition: P, useMutableSource: P, useSyncExternalStore: P, useId: P, unstable_isNewReconciler: false }, Oh = { readContext: eh, useCallback: function(a, b) {
  Th().memoizedState = [a, void 0 === b ? null : b];
  return a;
}, useContext: eh, useEffect: mi, useImperativeHandle: function(a, b, c) {
  c = null !== c && void 0 !== c ? c.concat([a]) : null;
  return ki(
    4194308,
    4,
    pi.bind(null, b, a),
    c
  );
}, useLayoutEffect: function(a, b) {
  return ki(4194308, 4, a, b);
}, useInsertionEffect: function(a, b) {
  return ki(4, 2, a, b);
}, useMemo: function(a, b) {
  var c = Th();
  b = void 0 === b ? null : b;
  a = a();
  c.memoizedState = [a, b];
  return a;
}, useReducer: function(a, b, c) {
  var d = Th();
  b = void 0 !== c ? c(b) : b;
  d.memoizedState = d.baseState = b;
  a = { pending: null, interleaved: null, lanes: 0, dispatch: null, lastRenderedReducer: a, lastRenderedState: b };
  d.queue = a;
  a = a.dispatch = xi.bind(null, M, a);
  return [d.memoizedState, a];
}, useRef: function(a) {
  var b = Th();
  a = { current: a };
  return b.memoizedState = a;
}, useState: hi, useDebugValue: ri, useDeferredValue: function(a) {
  return Th().memoizedState = a;
}, useTransition: function() {
  var a = hi(false), b = a[0];
  a = vi.bind(null, a[1]);
  Th().memoizedState = a;
  return [b, a];
}, useMutableSource: function() {
}, useSyncExternalStore: function(a, b, c) {
  var d = M, e = Th();
  if (I) {
    if (void 0 === c) throw Error(p(407));
    c = c();
  } else {
    c = b();
    if (null === Q) throw Error(p(349));
    0 !== (Hh & 30) || di(d, b, c);
  }
  e.memoizedState = c;
  var f2 = { value: c, getSnapshot: b };
  e.queue = f2;
  mi(ai.bind(
    null,
    d,
    f2,
    a
  ), [a]);
  d.flags |= 2048;
  bi(9, ci.bind(null, d, f2, c, b), void 0, null);
  return c;
}, useId: function() {
  var a = Th(), b = Q.identifierPrefix;
  if (I) {
    var c = sg;
    var d = rg;
    c = (d & ~(1 << 32 - oc(d) - 1)).toString(32) + c;
    b = ":" + b + "R" + c;
    c = Kh++;
    0 < c && (b += "H" + c.toString(32));
    b += ":";
  } else c = Lh++, b = ":" + b + "r" + c.toString(32) + ":";
  return a.memoizedState = b;
}, unstable_isNewReconciler: false }, Ph = {
  readContext: eh,
  useCallback: si,
  useContext: eh,
  useEffect: $h,
  useImperativeHandle: qi,
  useInsertionEffect: ni,
  useLayoutEffect: oi,
  useMemo: ti,
  useReducer: Wh,
  useRef: ji,
  useState: function() {
    return Wh(Vh);
  },
  useDebugValue: ri,
  useDeferredValue: function(a) {
    var b = Uh();
    return ui(b, N.memoizedState, a);
  },
  useTransition: function() {
    var a = Wh(Vh)[0], b = Uh().memoizedState;
    return [a, b];
  },
  useMutableSource: Yh,
  useSyncExternalStore: Zh,
  useId: wi,
  unstable_isNewReconciler: false
}, Qh = { readContext: eh, useCallback: si, useContext: eh, useEffect: $h, useImperativeHandle: qi, useInsertionEffect: ni, useLayoutEffect: oi, useMemo: ti, useReducer: Xh, useRef: ji, useState: function() {
  return Xh(Vh);
}, useDebugValue: ri, useDeferredValue: function(a) {
  var b = Uh();
  return null === N ? b.memoizedState = a : ui(b, N.memoizedState, a);
}, useTransition: function() {
  var a = Xh(Vh)[0], b = Uh().memoizedState;
  return [a, b];
}, useMutableSource: Yh, useSyncExternalStore: Zh, useId: wi, unstable_isNewReconciler: false };
function Ci(a, b) {
  if (a && a.defaultProps) {
    b = A({}, b);
    a = a.defaultProps;
    for (var c in a) void 0 === b[c] && (b[c] = a[c]);
    return b;
  }
  return b;
}
function Di(a, b, c, d) {
  b = a.memoizedState;
  c = c(d, b);
  c = null === c || void 0 === c ? b : A({}, b, c);
  a.memoizedState = c;
  0 === a.lanes && (a.updateQueue.baseState = c);
}
var Ei = { isMounted: function(a) {
  return (a = a._reactInternals) ? Vb(a) === a : false;
}, enqueueSetState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueReplaceState: function(a, b, c) {
  a = a._reactInternals;
  var d = R(), e = yi(a), f2 = mh(d, e);
  f2.tag = 1;
  f2.payload = b;
  void 0 !== c && null !== c && (f2.callback = c);
  b = nh(a, f2, e);
  null !== b && (gi(b, a, e, d), oh(b, a, e));
}, enqueueForceUpdate: function(a, b) {
  a = a._reactInternals;
  var c = R(), d = yi(a), e = mh(c, d);
  e.tag = 2;
  void 0 !== b && null !== b && (e.callback = b);
  b = nh(a, e, d);
  null !== b && (gi(b, a, d, c), oh(b, a, d));
} };
function Fi(a, b, c, d, e, f2, g) {
  a = a.stateNode;
  return "function" === typeof a.shouldComponentUpdate ? a.shouldComponentUpdate(d, f2, g) : b.prototype && b.prototype.isPureReactComponent ? !Ie(c, d) || !Ie(e, f2) : true;
}
function Gi(a, b, c) {
  var d = false, e = Vf;
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? f2 = eh(f2) : (e = Zf(b) ? Xf : H.current, d = b.contextTypes, f2 = (d = null !== d && void 0 !== d) ? Yf(a, e) : Vf);
  b = new b(c, f2);
  a.memoizedState = null !== b.state && void 0 !== b.state ? b.state : null;
  b.updater = Ei;
  a.stateNode = b;
  b._reactInternals = a;
  d && (a = a.stateNode, a.__reactInternalMemoizedUnmaskedChildContext = e, a.__reactInternalMemoizedMaskedChildContext = f2);
  return b;
}
function Hi(a, b, c, d) {
  a = b.state;
  "function" === typeof b.componentWillReceiveProps && b.componentWillReceiveProps(c, d);
  "function" === typeof b.UNSAFE_componentWillReceiveProps && b.UNSAFE_componentWillReceiveProps(c, d);
  b.state !== a && Ei.enqueueReplaceState(b, b.state, null);
}
function Ii(a, b, c, d) {
  var e = a.stateNode;
  e.props = c;
  e.state = a.memoizedState;
  e.refs = {};
  kh(a);
  var f2 = b.contextType;
  "object" === typeof f2 && null !== f2 ? e.context = eh(f2) : (f2 = Zf(b) ? Xf : H.current, e.context = Yf(a, f2));
  e.state = a.memoizedState;
  f2 = b.getDerivedStateFromProps;
  "function" === typeof f2 && (Di(a, b, f2, c), e.state = a.memoizedState);
  "function" === typeof b.getDerivedStateFromProps || "function" === typeof e.getSnapshotBeforeUpdate || "function" !== typeof e.UNSAFE_componentWillMount && "function" !== typeof e.componentWillMount || (b = e.state, "function" === typeof e.componentWillMount && e.componentWillMount(), "function" === typeof e.UNSAFE_componentWillMount && e.UNSAFE_componentWillMount(), b !== e.state && Ei.enqueueReplaceState(e, e.state, null), qh(a, c, e, d), e.state = a.memoizedState);
  "function" === typeof e.componentDidMount && (a.flags |= 4194308);
}
function Ji(a, b) {
  try {
    var c = "", d = b;
    do
      c += Pa(d), d = d.return;
    while (d);
    var e = c;
  } catch (f2) {
    e = "\nError generating stack: " + f2.message + "\n" + f2.stack;
  }
  return { value: a, source: b, stack: e, digest: null };
}
function Ki(a, b, c) {
  return { value: a, source: null, stack: null != c ? c : null, digest: null != b ? b : null };
}
function Li(a, b) {
  try {
    console.error(b.value);
  } catch (c) {
    setTimeout(function() {
      throw c;
    });
  }
}
var Mi = "function" === typeof WeakMap ? WeakMap : Map;
function Ni(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  c.payload = { element: null };
  var d = b.value;
  c.callback = function() {
    Oi || (Oi = true, Pi = d);
    Li(a, b);
  };
  return c;
}
function Qi(a, b, c) {
  c = mh(-1, c);
  c.tag = 3;
  var d = a.type.getDerivedStateFromError;
  if ("function" === typeof d) {
    var e = b.value;
    c.payload = function() {
      return d(e);
    };
    c.callback = function() {
      Li(a, b);
    };
  }
  var f2 = a.stateNode;
  null !== f2 && "function" === typeof f2.componentDidCatch && (c.callback = function() {
    Li(a, b);
    "function" !== typeof d && (null === Ri ? Ri = /* @__PURE__ */ new Set([this]) : Ri.add(this));
    var c2 = b.stack;
    this.componentDidCatch(b.value, { componentStack: null !== c2 ? c2 : "" });
  });
  return c;
}
function Si(a, b, c) {
  var d = a.pingCache;
  if (null === d) {
    d = a.pingCache = new Mi();
    var e = /* @__PURE__ */ new Set();
    d.set(b, e);
  } else e = d.get(b), void 0 === e && (e = /* @__PURE__ */ new Set(), d.set(b, e));
  e.has(c) || (e.add(c), a = Ti.bind(null, a, b, c), b.then(a, a));
}
function Ui(a) {
  do {
    var b;
    if (b = 13 === a.tag) b = a.memoizedState, b = null !== b ? null !== b.dehydrated ? true : false : true;
    if (b) return a;
    a = a.return;
  } while (null !== a);
  return null;
}
function Vi(a, b, c, d, e) {
  if (0 === (a.mode & 1)) return a === b ? a.flags |= 65536 : (a.flags |= 128, c.flags |= 131072, c.flags &= -52805, 1 === c.tag && (null === c.alternate ? c.tag = 17 : (b = mh(-1, 1), b.tag = 2, nh(c, b, 1))), c.lanes |= 1), a;
  a.flags |= 65536;
  a.lanes = e;
  return a;
}
var Wi = ua.ReactCurrentOwner, dh = false;
function Xi(a, b, c, d) {
  b.child = null === a ? Vg(b, null, c, d) : Ug(b, a.child, c, d);
}
function Yi(a, b, c, d, e) {
  c = c.render;
  var f2 = b.ref;
  ch(b, e);
  d = Nh(a, b, c, d, f2, e);
  c = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && c && vg(b);
  b.flags |= 1;
  Xi(a, b, d, e);
  return b.child;
}
function $i(a, b, c, d, e) {
  if (null === a) {
    var f2 = c.type;
    if ("function" === typeof f2 && !aj(f2) && void 0 === f2.defaultProps && null === c.compare && void 0 === c.defaultProps) return b.tag = 15, b.type = f2, bj(a, b, f2, d, e);
    a = Rg(c.type, null, d, b, b.mode, e);
    a.ref = b.ref;
    a.return = b;
    return b.child = a;
  }
  f2 = a.child;
  if (0 === (a.lanes & e)) {
    var g = f2.memoizedProps;
    c = c.compare;
    c = null !== c ? c : Ie;
    if (c(g, d) && a.ref === b.ref) return Zi(a, b, e);
  }
  b.flags |= 1;
  a = Pg(f2, d);
  a.ref = b.ref;
  a.return = b;
  return b.child = a;
}
function bj(a, b, c, d, e) {
  if (null !== a) {
    var f2 = a.memoizedProps;
    if (Ie(f2, d) && a.ref === b.ref) if (dh = false, b.pendingProps = d = f2, 0 !== (a.lanes & e)) 0 !== (a.flags & 131072) && (dh = true);
    else return b.lanes = a.lanes, Zi(a, b, e);
  }
  return cj(a, b, c, d, e);
}
function dj(a, b, c) {
  var d = b.pendingProps, e = d.children, f2 = null !== a ? a.memoizedState : null;
  if ("hidden" === d.mode) if (0 === (b.mode & 1)) b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null }, G(ej, fj), fj |= c;
  else {
    if (0 === (c & 1073741824)) return a = null !== f2 ? f2.baseLanes | c : c, b.lanes = b.childLanes = 1073741824, b.memoizedState = { baseLanes: a, cachePool: null, transitions: null }, b.updateQueue = null, G(ej, fj), fj |= a, null;
    b.memoizedState = { baseLanes: 0, cachePool: null, transitions: null };
    d = null !== f2 ? f2.baseLanes : c;
    G(ej, fj);
    fj |= d;
  }
  else null !== f2 ? (d = f2.baseLanes | c, b.memoizedState = null) : d = c, G(ej, fj), fj |= d;
  Xi(a, b, e, c);
  return b.child;
}
function gj(a, b) {
  var c = b.ref;
  if (null === a && null !== c || null !== a && a.ref !== c) b.flags |= 512, b.flags |= 2097152;
}
function cj(a, b, c, d, e) {
  var f2 = Zf(c) ? Xf : H.current;
  f2 = Yf(b, f2);
  ch(b, e);
  c = Nh(a, b, c, d, f2, e);
  d = Sh();
  if (null !== a && !dh) return b.updateQueue = a.updateQueue, b.flags &= -2053, a.lanes &= ~e, Zi(a, b, e);
  I && d && vg(b);
  b.flags |= 1;
  Xi(a, b, c, e);
  return b.child;
}
function hj(a, b, c, d, e) {
  if (Zf(c)) {
    var f2 = true;
    cg(b);
  } else f2 = false;
  ch(b, e);
  if (null === b.stateNode) ij(a, b), Gi(b, c, d), Ii(b, c, d, e), d = true;
  else if (null === a) {
    var g = b.stateNode, h = b.memoizedProps;
    g.props = h;
    var k2 = g.context, l2 = c.contextType;
    "object" === typeof l2 && null !== l2 ? l2 = eh(l2) : (l2 = Zf(c) ? Xf : H.current, l2 = Yf(b, l2));
    var m2 = c.getDerivedStateFromProps, q2 = "function" === typeof m2 || "function" === typeof g.getSnapshotBeforeUpdate;
    q2 || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== d || k2 !== l2) && Hi(b, g, d, l2);
    jh = false;
    var r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    k2 = b.memoizedState;
    h !== d || r2 !== k2 || Wf.current || jh ? ("function" === typeof m2 && (Di(b, c, m2, d), k2 = b.memoizedState), (h = jh || Fi(b, c, h, d, r2, k2, l2)) ? (q2 || "function" !== typeof g.UNSAFE_componentWillMount && "function" !== typeof g.componentWillMount || ("function" === typeof g.componentWillMount && g.componentWillMount(), "function" === typeof g.UNSAFE_componentWillMount && g.UNSAFE_componentWillMount()), "function" === typeof g.componentDidMount && (b.flags |= 4194308)) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), b.memoizedProps = d, b.memoizedState = k2), g.props = d, g.state = k2, g.context = l2, d = h) : ("function" === typeof g.componentDidMount && (b.flags |= 4194308), d = false);
  } else {
    g = b.stateNode;
    lh(a, b);
    h = b.memoizedProps;
    l2 = b.type === b.elementType ? h : Ci(b.type, h);
    g.props = l2;
    q2 = b.pendingProps;
    r2 = g.context;
    k2 = c.contextType;
    "object" === typeof k2 && null !== k2 ? k2 = eh(k2) : (k2 = Zf(c) ? Xf : H.current, k2 = Yf(b, k2));
    var y2 = c.getDerivedStateFromProps;
    (m2 = "function" === typeof y2 || "function" === typeof g.getSnapshotBeforeUpdate) || "function" !== typeof g.UNSAFE_componentWillReceiveProps && "function" !== typeof g.componentWillReceiveProps || (h !== q2 || r2 !== k2) && Hi(b, g, d, k2);
    jh = false;
    r2 = b.memoizedState;
    g.state = r2;
    qh(b, d, g, e);
    var n2 = b.memoizedState;
    h !== q2 || r2 !== n2 || Wf.current || jh ? ("function" === typeof y2 && (Di(b, c, y2, d), n2 = b.memoizedState), (l2 = jh || Fi(b, c, l2, d, r2, n2, k2) || false) ? (m2 || "function" !== typeof g.UNSAFE_componentWillUpdate && "function" !== typeof g.componentWillUpdate || ("function" === typeof g.componentWillUpdate && g.componentWillUpdate(d, n2, k2), "function" === typeof g.UNSAFE_componentWillUpdate && g.UNSAFE_componentWillUpdate(d, n2, k2)), "function" === typeof g.componentDidUpdate && (b.flags |= 4), "function" === typeof g.getSnapshotBeforeUpdate && (b.flags |= 1024)) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), b.memoizedProps = d, b.memoizedState = n2), g.props = d, g.state = n2, g.context = k2, d = l2) : ("function" !== typeof g.componentDidUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 4), "function" !== typeof g.getSnapshotBeforeUpdate || h === a.memoizedProps && r2 === a.memoizedState || (b.flags |= 1024), d = false);
  }
  return jj(a, b, c, d, f2, e);
}
function jj(a, b, c, d, e, f2) {
  gj(a, b);
  var g = 0 !== (b.flags & 128);
  if (!d && !g) return e && dg(b, c, false), Zi(a, b, f2);
  d = b.stateNode;
  Wi.current = b;
  var h = g && "function" !== typeof c.getDerivedStateFromError ? null : d.render();
  b.flags |= 1;
  null !== a && g ? (b.child = Ug(b, a.child, null, f2), b.child = Ug(b, null, h, f2)) : Xi(a, b, h, f2);
  b.memoizedState = d.state;
  e && dg(b, c, true);
  return b.child;
}
function kj(a) {
  var b = a.stateNode;
  b.pendingContext ? ag(a, b.pendingContext, b.pendingContext !== b.context) : b.context && ag(a, b.context, false);
  yh(a, b.containerInfo);
}
function lj(a, b, c, d, e) {
  Ig();
  Jg(e);
  b.flags |= 256;
  Xi(a, b, c, d);
  return b.child;
}
var mj = { dehydrated: null, treeContext: null, retryLane: 0 };
function nj(a) {
  return { baseLanes: a, cachePool: null, transitions: null };
}
function oj(a, b, c) {
  var d = b.pendingProps, e = L.current, f2 = false, g = 0 !== (b.flags & 128), h;
  (h = g) || (h = null !== a && null === a.memoizedState ? false : 0 !== (e & 2));
  if (h) f2 = true, b.flags &= -129;
  else if (null === a || null !== a.memoizedState) e |= 1;
  G(L, e & 1);
  if (null === a) {
    Eg(b);
    a = b.memoizedState;
    if (null !== a && (a = a.dehydrated, null !== a)) return 0 === (b.mode & 1) ? b.lanes = 1 : "$!" === a.data ? b.lanes = 8 : b.lanes = 1073741824, null;
    g = d.children;
    a = d.fallback;
    return f2 ? (d = b.mode, f2 = b.child, g = { mode: "hidden", children: g }, 0 === (d & 1) && null !== f2 ? (f2.childLanes = 0, f2.pendingProps = g) : f2 = pj(g, d, 0, null), a = Tg(a, d, c, null), f2.return = b, a.return = b, f2.sibling = a, b.child = f2, b.child.memoizedState = nj(c), b.memoizedState = mj, a) : qj(b, g);
  }
  e = a.memoizedState;
  if (null !== e && (h = e.dehydrated, null !== h)) return rj(a, b, g, d, h, e, c);
  if (f2) {
    f2 = d.fallback;
    g = b.mode;
    e = a.child;
    h = e.sibling;
    var k2 = { mode: "hidden", children: d.children };
    0 === (g & 1) && b.child !== e ? (d = b.child, d.childLanes = 0, d.pendingProps = k2, b.deletions = null) : (d = Pg(e, k2), d.subtreeFlags = e.subtreeFlags & 14680064);
    null !== h ? f2 = Pg(h, f2) : (f2 = Tg(f2, g, c, null), f2.flags |= 2);
    f2.return = b;
    d.return = b;
    d.sibling = f2;
    b.child = d;
    d = f2;
    f2 = b.child;
    g = a.child.memoizedState;
    g = null === g ? nj(c) : { baseLanes: g.baseLanes | c, cachePool: null, transitions: g.transitions };
    f2.memoizedState = g;
    f2.childLanes = a.childLanes & ~c;
    b.memoizedState = mj;
    return d;
  }
  f2 = a.child;
  a = f2.sibling;
  d = Pg(f2, { mode: "visible", children: d.children });
  0 === (b.mode & 1) && (d.lanes = c);
  d.return = b;
  d.sibling = null;
  null !== a && (c = b.deletions, null === c ? (b.deletions = [a], b.flags |= 16) : c.push(a));
  b.child = d;
  b.memoizedState = null;
  return d;
}
function qj(a, b) {
  b = pj({ mode: "visible", children: b }, a.mode, 0, null);
  b.return = a;
  return a.child = b;
}
function sj(a, b, c, d) {
  null !== d && Jg(d);
  Ug(b, a.child, null, c);
  a = qj(b, b.pendingProps.children);
  a.flags |= 2;
  b.memoizedState = null;
  return a;
}
function rj(a, b, c, d, e, f2, g) {
  if (c) {
    if (b.flags & 256) return b.flags &= -257, d = Ki(Error(p(422))), sj(a, b, g, d);
    if (null !== b.memoizedState) return b.child = a.child, b.flags |= 128, null;
    f2 = d.fallback;
    e = b.mode;
    d = pj({ mode: "visible", children: d.children }, e, 0, null);
    f2 = Tg(f2, e, g, null);
    f2.flags |= 2;
    d.return = b;
    f2.return = b;
    d.sibling = f2;
    b.child = d;
    0 !== (b.mode & 1) && Ug(b, a.child, null, g);
    b.child.memoizedState = nj(g);
    b.memoizedState = mj;
    return f2;
  }
  if (0 === (b.mode & 1)) return sj(a, b, g, null);
  if ("$!" === e.data) {
    d = e.nextSibling && e.nextSibling.dataset;
    if (d) var h = d.dgst;
    d = h;
    f2 = Error(p(419));
    d = Ki(f2, d, void 0);
    return sj(a, b, g, d);
  }
  h = 0 !== (g & a.childLanes);
  if (dh || h) {
    d = Q;
    if (null !== d) {
      switch (g & -g) {
        case 4:
          e = 2;
          break;
        case 16:
          e = 8;
          break;
        case 64:
        case 128:
        case 256:
        case 512:
        case 1024:
        case 2048:
        case 4096:
        case 8192:
        case 16384:
        case 32768:
        case 65536:
        case 131072:
        case 262144:
        case 524288:
        case 1048576:
        case 2097152:
        case 4194304:
        case 8388608:
        case 16777216:
        case 33554432:
        case 67108864:
          e = 32;
          break;
        case 536870912:
          e = 268435456;
          break;
        default:
          e = 0;
      }
      e = 0 !== (e & (d.suspendedLanes | g)) ? 0 : e;
      0 !== e && e !== f2.retryLane && (f2.retryLane = e, ih(a, e), gi(d, a, e, -1));
    }
    tj();
    d = Ki(Error(p(421)));
    return sj(a, b, g, d);
  }
  if ("$?" === e.data) return b.flags |= 128, b.child = a.child, b = uj.bind(null, a), e._reactRetry = b, null;
  a = f2.treeContext;
  yg = Lf(e.nextSibling);
  xg = b;
  I = true;
  zg = null;
  null !== a && (og[pg++] = rg, og[pg++] = sg, og[pg++] = qg, rg = a.id, sg = a.overflow, qg = b);
  b = qj(b, d.children);
  b.flags |= 4096;
  return b;
}
function vj(a, b, c) {
  a.lanes |= b;
  var d = a.alternate;
  null !== d && (d.lanes |= b);
  bh(a.return, b, c);
}
function wj(a, b, c, d, e) {
  var f2 = a.memoizedState;
  null === f2 ? a.memoizedState = { isBackwards: b, rendering: null, renderingStartTime: 0, last: d, tail: c, tailMode: e } : (f2.isBackwards = b, f2.rendering = null, f2.renderingStartTime = 0, f2.last = d, f2.tail = c, f2.tailMode = e);
}
function xj(a, b, c) {
  var d = b.pendingProps, e = d.revealOrder, f2 = d.tail;
  Xi(a, b, d.children, c);
  d = L.current;
  if (0 !== (d & 2)) d = d & 1 | 2, b.flags |= 128;
  else {
    if (null !== a && 0 !== (a.flags & 128)) a: for (a = b.child; null !== a; ) {
      if (13 === a.tag) null !== a.memoizedState && vj(a, c, b);
      else if (19 === a.tag) vj(a, c, b);
      else if (null !== a.child) {
        a.child.return = a;
        a = a.child;
        continue;
      }
      if (a === b) break a;
      for (; null === a.sibling; ) {
        if (null === a.return || a.return === b) break a;
        a = a.return;
      }
      a.sibling.return = a.return;
      a = a.sibling;
    }
    d &= 1;
  }
  G(L, d);
  if (0 === (b.mode & 1)) b.memoizedState = null;
  else switch (e) {
    case "forwards":
      c = b.child;
      for (e = null; null !== c; ) a = c.alternate, null !== a && null === Ch(a) && (e = c), c = c.sibling;
      c = e;
      null === c ? (e = b.child, b.child = null) : (e = c.sibling, c.sibling = null);
      wj(b, false, e, c, f2);
      break;
    case "backwards":
      c = null;
      e = b.child;
      for (b.child = null; null !== e; ) {
        a = e.alternate;
        if (null !== a && null === Ch(a)) {
          b.child = e;
          break;
        }
        a = e.sibling;
        e.sibling = c;
        c = e;
        e = a;
      }
      wj(b, true, c, null, f2);
      break;
    case "together":
      wj(b, false, null, null, void 0);
      break;
    default:
      b.memoizedState = null;
  }
  return b.child;
}
function ij(a, b) {
  0 === (b.mode & 1) && null !== a && (a.alternate = null, b.alternate = null, b.flags |= 2);
}
function Zi(a, b, c) {
  null !== a && (b.dependencies = a.dependencies);
  rh |= b.lanes;
  if (0 === (c & b.childLanes)) return null;
  if (null !== a && b.child !== a.child) throw Error(p(153));
  if (null !== b.child) {
    a = b.child;
    c = Pg(a, a.pendingProps);
    b.child = c;
    for (c.return = b; null !== a.sibling; ) a = a.sibling, c = c.sibling = Pg(a, a.pendingProps), c.return = b;
    c.sibling = null;
  }
  return b.child;
}
function yj(a, b, c) {
  switch (b.tag) {
    case 3:
      kj(b);
      Ig();
      break;
    case 5:
      Ah(b);
      break;
    case 1:
      Zf(b.type) && cg(b);
      break;
    case 4:
      yh(b, b.stateNode.containerInfo);
      break;
    case 10:
      var d = b.type._context, e = b.memoizedProps.value;
      G(Wg, d._currentValue);
      d._currentValue = e;
      break;
    case 13:
      d = b.memoizedState;
      if (null !== d) {
        if (null !== d.dehydrated) return G(L, L.current & 1), b.flags |= 128, null;
        if (0 !== (c & b.child.childLanes)) return oj(a, b, c);
        G(L, L.current & 1);
        a = Zi(a, b, c);
        return null !== a ? a.sibling : null;
      }
      G(L, L.current & 1);
      break;
    case 19:
      d = 0 !== (c & b.childLanes);
      if (0 !== (a.flags & 128)) {
        if (d) return xj(a, b, c);
        b.flags |= 128;
      }
      e = b.memoizedState;
      null !== e && (e.rendering = null, e.tail = null, e.lastEffect = null);
      G(L, L.current);
      if (d) break;
      else return null;
    case 22:
    case 23:
      return b.lanes = 0, dj(a, b, c);
  }
  return Zi(a, b, c);
}
var zj, Aj, Bj, Cj;
zj = function(a, b) {
  for (var c = b.child; null !== c; ) {
    if (5 === c.tag || 6 === c.tag) a.appendChild(c.stateNode);
    else if (4 !== c.tag && null !== c.child) {
      c.child.return = c;
      c = c.child;
      continue;
    }
    if (c === b) break;
    for (; null === c.sibling; ) {
      if (null === c.return || c.return === b) return;
      c = c.return;
    }
    c.sibling.return = c.return;
    c = c.sibling;
  }
};
Aj = function() {
};
Bj = function(a, b, c, d) {
  var e = a.memoizedProps;
  if (e !== d) {
    a = b.stateNode;
    xh(uh.current);
    var f2 = null;
    switch (c) {
      case "input":
        e = Ya(a, e);
        d = Ya(a, d);
        f2 = [];
        break;
      case "select":
        e = A({}, e, { value: void 0 });
        d = A({}, d, { value: void 0 });
        f2 = [];
        break;
      case "textarea":
        e = gb(a, e);
        d = gb(a, d);
        f2 = [];
        break;
      default:
        "function" !== typeof e.onClick && "function" === typeof d.onClick && (a.onclick = Bf);
    }
    ub(c, d);
    var g;
    c = null;
    for (l2 in e) if (!d.hasOwnProperty(l2) && e.hasOwnProperty(l2) && null != e[l2]) if ("style" === l2) {
      var h = e[l2];
      for (g in h) h.hasOwnProperty(g) && (c || (c = {}), c[g] = "");
    } else "dangerouslySetInnerHTML" !== l2 && "children" !== l2 && "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && "autoFocus" !== l2 && (ea.hasOwnProperty(l2) ? f2 || (f2 = []) : (f2 = f2 || []).push(l2, null));
    for (l2 in d) {
      var k2 = d[l2];
      h = null != e ? e[l2] : void 0;
      if (d.hasOwnProperty(l2) && k2 !== h && (null != k2 || null != h)) if ("style" === l2) if (h) {
        for (g in h) !h.hasOwnProperty(g) || k2 && k2.hasOwnProperty(g) || (c || (c = {}), c[g] = "");
        for (g in k2) k2.hasOwnProperty(g) && h[g] !== k2[g] && (c || (c = {}), c[g] = k2[g]);
      } else c || (f2 || (f2 = []), f2.push(
        l2,
        c
      )), c = k2;
      else "dangerouslySetInnerHTML" === l2 ? (k2 = k2 ? k2.__html : void 0, h = h ? h.__html : void 0, null != k2 && h !== k2 && (f2 = f2 || []).push(l2, k2)) : "children" === l2 ? "string" !== typeof k2 && "number" !== typeof k2 || (f2 = f2 || []).push(l2, "" + k2) : "suppressContentEditableWarning" !== l2 && "suppressHydrationWarning" !== l2 && (ea.hasOwnProperty(l2) ? (null != k2 && "onScroll" === l2 && D("scroll", a), f2 || h === k2 || (f2 = [])) : (f2 = f2 || []).push(l2, k2));
    }
    c && (f2 = f2 || []).push("style", c);
    var l2 = f2;
    if (b.updateQueue = l2) b.flags |= 4;
  }
};
Cj = function(a, b, c, d) {
  c !== d && (b.flags |= 4);
};
function Dj(a, b) {
  if (!I) switch (a.tailMode) {
    case "hidden":
      b = a.tail;
      for (var c = null; null !== b; ) null !== b.alternate && (c = b), b = b.sibling;
      null === c ? a.tail = null : c.sibling = null;
      break;
    case "collapsed":
      c = a.tail;
      for (var d = null; null !== c; ) null !== c.alternate && (d = c), c = c.sibling;
      null === d ? b || null === a.tail ? a.tail = null : a.tail.sibling = null : d.sibling = null;
  }
}
function S(a) {
  var b = null !== a.alternate && a.alternate.child === a.child, c = 0, d = 0;
  if (b) for (var e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags & 14680064, d |= e.flags & 14680064, e.return = a, e = e.sibling;
  else for (e = a.child; null !== e; ) c |= e.lanes | e.childLanes, d |= e.subtreeFlags, d |= e.flags, e.return = a, e = e.sibling;
  a.subtreeFlags |= d;
  a.childLanes = c;
  return b;
}
function Ej(a, b, c) {
  var d = b.pendingProps;
  wg(b);
  switch (b.tag) {
    case 2:
    case 16:
    case 15:
    case 0:
    case 11:
    case 7:
    case 8:
    case 12:
    case 9:
    case 14:
      return S(b), null;
    case 1:
      return Zf(b.type) && $f(), S(b), null;
    case 3:
      d = b.stateNode;
      zh();
      E(Wf);
      E(H);
      Eh();
      d.pendingContext && (d.context = d.pendingContext, d.pendingContext = null);
      if (null === a || null === a.child) Gg(b) ? b.flags |= 4 : null === a || a.memoizedState.isDehydrated && 0 === (b.flags & 256) || (b.flags |= 1024, null !== zg && (Fj(zg), zg = null));
      Aj(a, b);
      S(b);
      return null;
    case 5:
      Bh(b);
      var e = xh(wh.current);
      c = b.type;
      if (null !== a && null != b.stateNode) Bj(a, b, c, d, e), a.ref !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      else {
        if (!d) {
          if (null === b.stateNode) throw Error(p(166));
          S(b);
          return null;
        }
        a = xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.type;
          var f2 = b.memoizedProps;
          d[Of] = b;
          d[Pf] = f2;
          a = 0 !== (b.mode & 1);
          switch (c) {
            case "dialog":
              D("cancel", d);
              D("close", d);
              break;
            case "iframe":
            case "object":
            case "embed":
              D("load", d);
              break;
            case "video":
            case "audio":
              for (e = 0; e < lf.length; e++) D(lf[e], d);
              break;
            case "source":
              D("error", d);
              break;
            case "img":
            case "image":
            case "link":
              D(
                "error",
                d
              );
              D("load", d);
              break;
            case "details":
              D("toggle", d);
              break;
            case "input":
              Za(d, f2);
              D("invalid", d);
              break;
            case "select":
              d._wrapperState = { wasMultiple: !!f2.multiple };
              D("invalid", d);
              break;
            case "textarea":
              hb(d, f2), D("invalid", d);
          }
          ub(c, f2);
          e = null;
          for (var g in f2) if (f2.hasOwnProperty(g)) {
            var h = f2[g];
            "children" === g ? "string" === typeof h ? d.textContent !== h && (true !== f2.suppressHydrationWarning && Af(d.textContent, h, a), e = ["children", h]) : "number" === typeof h && d.textContent !== "" + h && (true !== f2.suppressHydrationWarning && Af(
              d.textContent,
              h,
              a
            ), e = ["children", "" + h]) : ea.hasOwnProperty(g) && null != h && "onScroll" === g && D("scroll", d);
          }
          switch (c) {
            case "input":
              Va(d);
              db(d, f2, true);
              break;
            case "textarea":
              Va(d);
              jb(d);
              break;
            case "select":
            case "option":
              break;
            default:
              "function" === typeof f2.onClick && (d.onclick = Bf);
          }
          d = e;
          b.updateQueue = d;
          null !== d && (b.flags |= 4);
        } else {
          g = 9 === e.nodeType ? e : e.ownerDocument;
          "http://www.w3.org/1999/xhtml" === a && (a = kb(c));
          "http://www.w3.org/1999/xhtml" === a ? "script" === c ? (a = g.createElement("div"), a.innerHTML = "<script><\/script>", a = a.removeChild(a.firstChild)) : "string" === typeof d.is ? a = g.createElement(c, { is: d.is }) : (a = g.createElement(c), "select" === c && (g = a, d.multiple ? g.multiple = true : d.size && (g.size = d.size))) : a = g.createElementNS(a, c);
          a[Of] = b;
          a[Pf] = d;
          zj(a, b, false, false);
          b.stateNode = a;
          a: {
            g = vb(c, d);
            switch (c) {
              case "dialog":
                D("cancel", a);
                D("close", a);
                e = d;
                break;
              case "iframe":
              case "object":
              case "embed":
                D("load", a);
                e = d;
                break;
              case "video":
              case "audio":
                for (e = 0; e < lf.length; e++) D(lf[e], a);
                e = d;
                break;
              case "source":
                D("error", a);
                e = d;
                break;
              case "img":
              case "image":
              case "link":
                D(
                  "error",
                  a
                );
                D("load", a);
                e = d;
                break;
              case "details":
                D("toggle", a);
                e = d;
                break;
              case "input":
                Za(a, d);
                e = Ya(a, d);
                D("invalid", a);
                break;
              case "option":
                e = d;
                break;
              case "select":
                a._wrapperState = { wasMultiple: !!d.multiple };
                e = A({}, d, { value: void 0 });
                D("invalid", a);
                break;
              case "textarea":
                hb(a, d);
                e = gb(a, d);
                D("invalid", a);
                break;
              default:
                e = d;
            }
            ub(c, e);
            h = e;
            for (f2 in h) if (h.hasOwnProperty(f2)) {
              var k2 = h[f2];
              "style" === f2 ? sb(a, k2) : "dangerouslySetInnerHTML" === f2 ? (k2 = k2 ? k2.__html : void 0, null != k2 && nb(a, k2)) : "children" === f2 ? "string" === typeof k2 ? ("textarea" !== c || "" !== k2) && ob(a, k2) : "number" === typeof k2 && ob(a, "" + k2) : "suppressContentEditableWarning" !== f2 && "suppressHydrationWarning" !== f2 && "autoFocus" !== f2 && (ea.hasOwnProperty(f2) ? null != k2 && "onScroll" === f2 && D("scroll", a) : null != k2 && ta(a, f2, k2, g));
            }
            switch (c) {
              case "input":
                Va(a);
                db(a, d, false);
                break;
              case "textarea":
                Va(a);
                jb(a);
                break;
              case "option":
                null != d.value && a.setAttribute("value", "" + Sa(d.value));
                break;
              case "select":
                a.multiple = !!d.multiple;
                f2 = d.value;
                null != f2 ? fb(a, !!d.multiple, f2, false) : null != d.defaultValue && fb(
                  a,
                  !!d.multiple,
                  d.defaultValue,
                  true
                );
                break;
              default:
                "function" === typeof e.onClick && (a.onclick = Bf);
            }
            switch (c) {
              case "button":
              case "input":
              case "select":
              case "textarea":
                d = !!d.autoFocus;
                break a;
              case "img":
                d = true;
                break a;
              default:
                d = false;
            }
          }
          d && (b.flags |= 4);
        }
        null !== b.ref && (b.flags |= 512, b.flags |= 2097152);
      }
      S(b);
      return null;
    case 6:
      if (a && null != b.stateNode) Cj(a, b, a.memoizedProps, d);
      else {
        if ("string" !== typeof d && null === b.stateNode) throw Error(p(166));
        c = xh(wh.current);
        xh(uh.current);
        if (Gg(b)) {
          d = b.stateNode;
          c = b.memoizedProps;
          d[Of] = b;
          if (f2 = d.nodeValue !== c) {
            if (a = xg, null !== a) switch (a.tag) {
              case 3:
                Af(d.nodeValue, c, 0 !== (a.mode & 1));
                break;
              case 5:
                true !== a.memoizedProps.suppressHydrationWarning && Af(d.nodeValue, c, 0 !== (a.mode & 1));
            }
          }
          f2 && (b.flags |= 4);
        } else d = (9 === c.nodeType ? c : c.ownerDocument).createTextNode(d), d[Of] = b, b.stateNode = d;
      }
      S(b);
      return null;
    case 13:
      E(L);
      d = b.memoizedState;
      if (null === a || null !== a.memoizedState && null !== a.memoizedState.dehydrated) {
        if (I && null !== yg && 0 !== (b.mode & 1) && 0 === (b.flags & 128)) Hg(), Ig(), b.flags |= 98560, f2 = false;
        else if (f2 = Gg(b), null !== d && null !== d.dehydrated) {
          if (null === a) {
            if (!f2) throw Error(p(318));
            f2 = b.memoizedState;
            f2 = null !== f2 ? f2.dehydrated : null;
            if (!f2) throw Error(p(317));
            f2[Of] = b;
          } else Ig(), 0 === (b.flags & 128) && (b.memoizedState = null), b.flags |= 4;
          S(b);
          f2 = false;
        } else null !== zg && (Fj(zg), zg = null), f2 = true;
        if (!f2) return b.flags & 65536 ? b : null;
      }
      if (0 !== (b.flags & 128)) return b.lanes = c, b;
      d = null !== d;
      d !== (null !== a && null !== a.memoizedState) && d && (b.child.flags |= 8192, 0 !== (b.mode & 1) && (null === a || 0 !== (L.current & 1) ? 0 === T && (T = 3) : tj()));
      null !== b.updateQueue && (b.flags |= 4);
      S(b);
      return null;
    case 4:
      return zh(), Aj(a, b), null === a && sf(b.stateNode.containerInfo), S(b), null;
    case 10:
      return ah(b.type._context), S(b), null;
    case 17:
      return Zf(b.type) && $f(), S(b), null;
    case 19:
      E(L);
      f2 = b.memoizedState;
      if (null === f2) return S(b), null;
      d = 0 !== (b.flags & 128);
      g = f2.rendering;
      if (null === g) if (d) Dj(f2, false);
      else {
        if (0 !== T || null !== a && 0 !== (a.flags & 128)) for (a = b.child; null !== a; ) {
          g = Ch(a);
          if (null !== g) {
            b.flags |= 128;
            Dj(f2, false);
            d = g.updateQueue;
            null !== d && (b.updateQueue = d, b.flags |= 4);
            b.subtreeFlags = 0;
            d = c;
            for (c = b.child; null !== c; ) f2 = c, a = d, f2.flags &= 14680066, g = f2.alternate, null === g ? (f2.childLanes = 0, f2.lanes = a, f2.child = null, f2.subtreeFlags = 0, f2.memoizedProps = null, f2.memoizedState = null, f2.updateQueue = null, f2.dependencies = null, f2.stateNode = null) : (f2.childLanes = g.childLanes, f2.lanes = g.lanes, f2.child = g.child, f2.subtreeFlags = 0, f2.deletions = null, f2.memoizedProps = g.memoizedProps, f2.memoizedState = g.memoizedState, f2.updateQueue = g.updateQueue, f2.type = g.type, a = g.dependencies, f2.dependencies = null === a ? null : { lanes: a.lanes, firstContext: a.firstContext }), c = c.sibling;
            G(L, L.current & 1 | 2);
            return b.child;
          }
          a = a.sibling;
        }
        null !== f2.tail && B() > Gj && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
      }
      else {
        if (!d) if (a = Ch(g), null !== a) {
          if (b.flags |= 128, d = true, c = a.updateQueue, null !== c && (b.updateQueue = c, b.flags |= 4), Dj(f2, true), null === f2.tail && "hidden" === f2.tailMode && !g.alternate && !I) return S(b), null;
        } else 2 * B() - f2.renderingStartTime > Gj && 1073741824 !== c && (b.flags |= 128, d = true, Dj(f2, false), b.lanes = 4194304);
        f2.isBackwards ? (g.sibling = b.child, b.child = g) : (c = f2.last, null !== c ? c.sibling = g : b.child = g, f2.last = g);
      }
      if (null !== f2.tail) return b = f2.tail, f2.rendering = b, f2.tail = b.sibling, f2.renderingStartTime = B(), b.sibling = null, c = L.current, G(L, d ? c & 1 | 2 : c & 1), b;
      S(b);
      return null;
    case 22:
    case 23:
      return Hj(), d = null !== b.memoizedState, null !== a && null !== a.memoizedState !== d && (b.flags |= 8192), d && 0 !== (b.mode & 1) ? 0 !== (fj & 1073741824) && (S(b), b.subtreeFlags & 6 && (b.flags |= 8192)) : S(b), null;
    case 24:
      return null;
    case 25:
      return null;
  }
  throw Error(p(156, b.tag));
}
function Ij(a, b) {
  wg(b);
  switch (b.tag) {
    case 1:
      return Zf(b.type) && $f(), a = b.flags, a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 3:
      return zh(), E(Wf), E(H), Eh(), a = b.flags, 0 !== (a & 65536) && 0 === (a & 128) ? (b.flags = a & -65537 | 128, b) : null;
    case 5:
      return Bh(b), null;
    case 13:
      E(L);
      a = b.memoizedState;
      if (null !== a && null !== a.dehydrated) {
        if (null === b.alternate) throw Error(p(340));
        Ig();
      }
      a = b.flags;
      return a & 65536 ? (b.flags = a & -65537 | 128, b) : null;
    case 19:
      return E(L), null;
    case 4:
      return zh(), null;
    case 10:
      return ah(b.type._context), null;
    case 22:
    case 23:
      return Hj(), null;
    case 24:
      return null;
    default:
      return null;
  }
}
var Jj = false, U = false, Kj = "function" === typeof WeakSet ? WeakSet : Set, V = null;
function Lj(a, b) {
  var c = a.ref;
  if (null !== c) if ("function" === typeof c) try {
    c(null);
  } catch (d) {
    W(a, b, d);
  }
  else c.current = null;
}
function Mj(a, b, c) {
  try {
    c();
  } catch (d) {
    W(a, b, d);
  }
}
var Nj = false;
function Oj(a, b) {
  Cf = dd;
  a = Me();
  if (Ne(a)) {
    if ("selectionStart" in a) var c = { start: a.selectionStart, end: a.selectionEnd };
    else a: {
      c = (c = a.ownerDocument) && c.defaultView || window;
      var d = c.getSelection && c.getSelection();
      if (d && 0 !== d.rangeCount) {
        c = d.anchorNode;
        var e = d.anchorOffset, f2 = d.focusNode;
        d = d.focusOffset;
        try {
          c.nodeType, f2.nodeType;
        } catch (F2) {
          c = null;
          break a;
        }
        var g = 0, h = -1, k2 = -1, l2 = 0, m2 = 0, q2 = a, r2 = null;
        b: for (; ; ) {
          for (var y2; ; ) {
            q2 !== c || 0 !== e && 3 !== q2.nodeType || (h = g + e);
            q2 !== f2 || 0 !== d && 3 !== q2.nodeType || (k2 = g + d);
            3 === q2.nodeType && (g += q2.nodeValue.length);
            if (null === (y2 = q2.firstChild)) break;
            r2 = q2;
            q2 = y2;
          }
          for (; ; ) {
            if (q2 === a) break b;
            r2 === c && ++l2 === e && (h = g);
            r2 === f2 && ++m2 === d && (k2 = g);
            if (null !== (y2 = q2.nextSibling)) break;
            q2 = r2;
            r2 = q2.parentNode;
          }
          q2 = y2;
        }
        c = -1 === h || -1 === k2 ? null : { start: h, end: k2 };
      } else c = null;
    }
    c = c || { start: 0, end: 0 };
  } else c = null;
  Df = { focusedElem: a, selectionRange: c };
  dd = false;
  for (V = b; null !== V; ) if (b = V, a = b.child, 0 !== (b.subtreeFlags & 1028) && null !== a) a.return = b, V = a;
  else for (; null !== V; ) {
    b = V;
    try {
      var n2 = b.alternate;
      if (0 !== (b.flags & 1024)) switch (b.tag) {
        case 0:
        case 11:
        case 15:
          break;
        case 1:
          if (null !== n2) {
            var t2 = n2.memoizedProps, J2 = n2.memoizedState, x2 = b.stateNode, w2 = x2.getSnapshotBeforeUpdate(b.elementType === b.type ? t2 : Ci(b.type, t2), J2);
            x2.__reactInternalSnapshotBeforeUpdate = w2;
          }
          break;
        case 3:
          var u2 = b.stateNode.containerInfo;
          1 === u2.nodeType ? u2.textContent = "" : 9 === u2.nodeType && u2.documentElement && u2.removeChild(u2.documentElement);
          break;
        case 5:
        case 6:
        case 4:
        case 17:
          break;
        default:
          throw Error(p(163));
      }
    } catch (F2) {
      W(b, b.return, F2);
    }
    a = b.sibling;
    if (null !== a) {
      a.return = b.return;
      V = a;
      break;
    }
    V = b.return;
  }
  n2 = Nj;
  Nj = false;
  return n2;
}
function Pj(a, b, c) {
  var d = b.updateQueue;
  d = null !== d ? d.lastEffect : null;
  if (null !== d) {
    var e = d = d.next;
    do {
      if ((e.tag & a) === a) {
        var f2 = e.destroy;
        e.destroy = void 0;
        void 0 !== f2 && Mj(b, c, f2);
      }
      e = e.next;
    } while (e !== d);
  }
}
function Qj(a, b) {
  b = b.updateQueue;
  b = null !== b ? b.lastEffect : null;
  if (null !== b) {
    var c = b = b.next;
    do {
      if ((c.tag & a) === a) {
        var d = c.create;
        c.destroy = d();
      }
      c = c.next;
    } while (c !== b);
  }
}
function Rj(a) {
  var b = a.ref;
  if (null !== b) {
    var c = a.stateNode;
    switch (a.tag) {
      case 5:
        a = c;
        break;
      default:
        a = c;
    }
    "function" === typeof b ? b(a) : b.current = a;
  }
}
function Sj(a) {
  var b = a.alternate;
  null !== b && (a.alternate = null, Sj(b));
  a.child = null;
  a.deletions = null;
  a.sibling = null;
  5 === a.tag && (b = a.stateNode, null !== b && (delete b[Of], delete b[Pf], delete b[of], delete b[Qf], delete b[Rf]));
  a.stateNode = null;
  a.return = null;
  a.dependencies = null;
  a.memoizedProps = null;
  a.memoizedState = null;
  a.pendingProps = null;
  a.stateNode = null;
  a.updateQueue = null;
}
function Tj(a) {
  return 5 === a.tag || 3 === a.tag || 4 === a.tag;
}
function Uj(a) {
  a: for (; ; ) {
    for (; null === a.sibling; ) {
      if (null === a.return || Tj(a.return)) return null;
      a = a.return;
    }
    a.sibling.return = a.return;
    for (a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag; ) {
      if (a.flags & 2) continue a;
      if (null === a.child || 4 === a.tag) continue a;
      else a.child.return = a, a = a.child;
    }
    if (!(a.flags & 2)) return a.stateNode;
  }
}
function Vj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? 8 === c.nodeType ? c.parentNode.insertBefore(a, b) : c.insertBefore(a, b) : (8 === c.nodeType ? (b = c.parentNode, b.insertBefore(a, c)) : (b = c, b.appendChild(a)), c = c._reactRootContainer, null !== c && void 0 !== c || null !== b.onclick || (b.onclick = Bf));
  else if (4 !== d && (a = a.child, null !== a)) for (Vj(a, b, c), a = a.sibling; null !== a; ) Vj(a, b, c), a = a.sibling;
}
function Wj(a, b, c) {
  var d = a.tag;
  if (5 === d || 6 === d) a = a.stateNode, b ? c.insertBefore(a, b) : c.appendChild(a);
  else if (4 !== d && (a = a.child, null !== a)) for (Wj(a, b, c), a = a.sibling; null !== a; ) Wj(a, b, c), a = a.sibling;
}
var X$1 = null, Xj = false;
function Yj(a, b, c) {
  for (c = c.child; null !== c; ) Zj(a, b, c), c = c.sibling;
}
function Zj(a, b, c) {
  if (lc && "function" === typeof lc.onCommitFiberUnmount) try {
    lc.onCommitFiberUnmount(kc, c);
  } catch (h) {
  }
  switch (c.tag) {
    case 5:
      U || Lj(c, b);
    case 6:
      var d = X$1, e = Xj;
      X$1 = null;
      Yj(a, b, c);
      X$1 = d;
      Xj = e;
      null !== X$1 && (Xj ? (a = X$1, c = c.stateNode, 8 === a.nodeType ? a.parentNode.removeChild(c) : a.removeChild(c)) : X$1.removeChild(c.stateNode));
      break;
    case 18:
      null !== X$1 && (Xj ? (a = X$1, c = c.stateNode, 8 === a.nodeType ? Kf(a.parentNode, c) : 1 === a.nodeType && Kf(a, c), bd(a)) : Kf(X$1, c.stateNode));
      break;
    case 4:
      d = X$1;
      e = Xj;
      X$1 = c.stateNode.containerInfo;
      Xj = true;
      Yj(a, b, c);
      X$1 = d;
      Xj = e;
      break;
    case 0:
    case 11:
    case 14:
    case 15:
      if (!U && (d = c.updateQueue, null !== d && (d = d.lastEffect, null !== d))) {
        e = d = d.next;
        do {
          var f2 = e, g = f2.destroy;
          f2 = f2.tag;
          void 0 !== g && (0 !== (f2 & 2) ? Mj(c, b, g) : 0 !== (f2 & 4) && Mj(c, b, g));
          e = e.next;
        } while (e !== d);
      }
      Yj(a, b, c);
      break;
    case 1:
      if (!U && (Lj(c, b), d = c.stateNode, "function" === typeof d.componentWillUnmount)) try {
        d.props = c.memoizedProps, d.state = c.memoizedState, d.componentWillUnmount();
      } catch (h) {
        W(c, b, h);
      }
      Yj(a, b, c);
      break;
    case 21:
      Yj(a, b, c);
      break;
    case 22:
      c.mode & 1 ? (U = (d = U) || null !== c.memoizedState, Yj(a, b, c), U = d) : Yj(a, b, c);
      break;
    default:
      Yj(a, b, c);
  }
}
function ak(a) {
  var b = a.updateQueue;
  if (null !== b) {
    a.updateQueue = null;
    var c = a.stateNode;
    null === c && (c = a.stateNode = new Kj());
    b.forEach(function(b2) {
      var d = bk.bind(null, a, b2);
      c.has(b2) || (c.add(b2), b2.then(d, d));
    });
  }
}
function ck(a, b) {
  var c = b.deletions;
  if (null !== c) for (var d = 0; d < c.length; d++) {
    var e = c[d];
    try {
      var f2 = a, g = b, h = g;
      a: for (; null !== h; ) {
        switch (h.tag) {
          case 5:
            X$1 = h.stateNode;
            Xj = false;
            break a;
          case 3:
            X$1 = h.stateNode.containerInfo;
            Xj = true;
            break a;
          case 4:
            X$1 = h.stateNode.containerInfo;
            Xj = true;
            break a;
        }
        h = h.return;
      }
      if (null === X$1) throw Error(p(160));
      Zj(f2, g, e);
      X$1 = null;
      Xj = false;
      var k2 = e.alternate;
      null !== k2 && (k2.return = null);
      e.return = null;
    } catch (l2) {
      W(e, b, l2);
    }
  }
  if (b.subtreeFlags & 12854) for (b = b.child; null !== b; ) dk(b, a), b = b.sibling;
}
function dk(a, b) {
  var c = a.alternate, d = a.flags;
  switch (a.tag) {
    case 0:
    case 11:
    case 14:
    case 15:
      ck(b, a);
      ek(a);
      if (d & 4) {
        try {
          Pj(3, a, a.return), Qj(3, a);
        } catch (t2) {
          W(a, a.return, t2);
        }
        try {
          Pj(5, a, a.return);
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 1:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      break;
    case 5:
      ck(b, a);
      ek(a);
      d & 512 && null !== c && Lj(c, c.return);
      if (a.flags & 32) {
        var e = a.stateNode;
        try {
          ob(e, "");
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      if (d & 4 && (e = a.stateNode, null != e)) {
        var f2 = a.memoizedProps, g = null !== c ? c.memoizedProps : f2, h = a.type, k2 = a.updateQueue;
        a.updateQueue = null;
        if (null !== k2) try {
          "input" === h && "radio" === f2.type && null != f2.name && ab(e, f2);
          vb(h, g);
          var l2 = vb(h, f2);
          for (g = 0; g < k2.length; g += 2) {
            var m2 = k2[g], q2 = k2[g + 1];
            "style" === m2 ? sb(e, q2) : "dangerouslySetInnerHTML" === m2 ? nb(e, q2) : "children" === m2 ? ob(e, q2) : ta(e, m2, q2, l2);
          }
          switch (h) {
            case "input":
              bb(e, f2);
              break;
            case "textarea":
              ib(e, f2);
              break;
            case "select":
              var r2 = e._wrapperState.wasMultiple;
              e._wrapperState.wasMultiple = !!f2.multiple;
              var y2 = f2.value;
              null != y2 ? fb(e, !!f2.multiple, y2, false) : r2 !== !!f2.multiple && (null != f2.defaultValue ? fb(
                e,
                !!f2.multiple,
                f2.defaultValue,
                true
              ) : fb(e, !!f2.multiple, f2.multiple ? [] : "", false));
          }
          e[Pf] = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 6:
      ck(b, a);
      ek(a);
      if (d & 4) {
        if (null === a.stateNode) throw Error(p(162));
        e = a.stateNode;
        f2 = a.memoizedProps;
        try {
          e.nodeValue = f2;
        } catch (t2) {
          W(a, a.return, t2);
        }
      }
      break;
    case 3:
      ck(b, a);
      ek(a);
      if (d & 4 && null !== c && c.memoizedState.isDehydrated) try {
        bd(b.containerInfo);
      } catch (t2) {
        W(a, a.return, t2);
      }
      break;
    case 4:
      ck(b, a);
      ek(a);
      break;
    case 13:
      ck(b, a);
      ek(a);
      e = a.child;
      e.flags & 8192 && (f2 = null !== e.memoizedState, e.stateNode.isHidden = f2, !f2 || null !== e.alternate && null !== e.alternate.memoizedState || (fk = B()));
      d & 4 && ak(a);
      break;
    case 22:
      m2 = null !== c && null !== c.memoizedState;
      a.mode & 1 ? (U = (l2 = U) || m2, ck(b, a), U = l2) : ck(b, a);
      ek(a);
      if (d & 8192) {
        l2 = null !== a.memoizedState;
        if ((a.stateNode.isHidden = l2) && !m2 && 0 !== (a.mode & 1)) for (V = a, m2 = a.child; null !== m2; ) {
          for (q2 = V = m2; null !== V; ) {
            r2 = V;
            y2 = r2.child;
            switch (r2.tag) {
              case 0:
              case 11:
              case 14:
              case 15:
                Pj(4, r2, r2.return);
                break;
              case 1:
                Lj(r2, r2.return);
                var n2 = r2.stateNode;
                if ("function" === typeof n2.componentWillUnmount) {
                  d = r2;
                  c = r2.return;
                  try {
                    b = d, n2.props = b.memoizedProps, n2.state = b.memoizedState, n2.componentWillUnmount();
                  } catch (t2) {
                    W(d, c, t2);
                  }
                }
                break;
              case 5:
                Lj(r2, r2.return);
                break;
              case 22:
                if (null !== r2.memoizedState) {
                  gk(q2);
                  continue;
                }
            }
            null !== y2 ? (y2.return = r2, V = y2) : gk(q2);
          }
          m2 = m2.sibling;
        }
        a: for (m2 = null, q2 = a; ; ) {
          if (5 === q2.tag) {
            if (null === m2) {
              m2 = q2;
              try {
                e = q2.stateNode, l2 ? (f2 = e.style, "function" === typeof f2.setProperty ? f2.setProperty("display", "none", "important") : f2.display = "none") : (h = q2.stateNode, k2 = q2.memoizedProps.style, g = void 0 !== k2 && null !== k2 && k2.hasOwnProperty("display") ? k2.display : null, h.style.display = rb("display", g));
              } catch (t2) {
                W(a, a.return, t2);
              }
            }
          } else if (6 === q2.tag) {
            if (null === m2) try {
              q2.stateNode.nodeValue = l2 ? "" : q2.memoizedProps;
            } catch (t2) {
              W(a, a.return, t2);
            }
          } else if ((22 !== q2.tag && 23 !== q2.tag || null === q2.memoizedState || q2 === a) && null !== q2.child) {
            q2.child.return = q2;
            q2 = q2.child;
            continue;
          }
          if (q2 === a) break a;
          for (; null === q2.sibling; ) {
            if (null === q2.return || q2.return === a) break a;
            m2 === q2 && (m2 = null);
            q2 = q2.return;
          }
          m2 === q2 && (m2 = null);
          q2.sibling.return = q2.return;
          q2 = q2.sibling;
        }
      }
      break;
    case 19:
      ck(b, a);
      ek(a);
      d & 4 && ak(a);
      break;
    case 21:
      break;
    default:
      ck(
        b,
        a
      ), ek(a);
  }
}
function ek(a) {
  var b = a.flags;
  if (b & 2) {
    try {
      a: {
        for (var c = a.return; null !== c; ) {
          if (Tj(c)) {
            var d = c;
            break a;
          }
          c = c.return;
        }
        throw Error(p(160));
      }
      switch (d.tag) {
        case 5:
          var e = d.stateNode;
          d.flags & 32 && (ob(e, ""), d.flags &= -33);
          var f2 = Uj(a);
          Wj(a, f2, e);
          break;
        case 3:
        case 4:
          var g = d.stateNode.containerInfo, h = Uj(a);
          Vj(a, h, g);
          break;
        default:
          throw Error(p(161));
      }
    } catch (k2) {
      W(a, a.return, k2);
    }
    a.flags &= -3;
  }
  b & 4096 && (a.flags &= -4097);
}
function hk(a, b, c) {
  V = a;
  ik(a);
}
function ik(a, b, c) {
  for (var d = 0 !== (a.mode & 1); null !== V; ) {
    var e = V, f2 = e.child;
    if (22 === e.tag && d) {
      var g = null !== e.memoizedState || Jj;
      if (!g) {
        var h = e.alternate, k2 = null !== h && null !== h.memoizedState || U;
        h = Jj;
        var l2 = U;
        Jj = g;
        if ((U = k2) && !l2) for (V = e; null !== V; ) g = V, k2 = g.child, 22 === g.tag && null !== g.memoizedState ? jk(e) : null !== k2 ? (k2.return = g, V = k2) : jk(e);
        for (; null !== f2; ) V = f2, ik(f2), f2 = f2.sibling;
        V = e;
        Jj = h;
        U = l2;
      }
      kk(a);
    } else 0 !== (e.subtreeFlags & 8772) && null !== f2 ? (f2.return = e, V = f2) : kk(a);
  }
}
function kk(a) {
  for (; null !== V; ) {
    var b = V;
    if (0 !== (b.flags & 8772)) {
      var c = b.alternate;
      try {
        if (0 !== (b.flags & 8772)) switch (b.tag) {
          case 0:
          case 11:
          case 15:
            U || Qj(5, b);
            break;
          case 1:
            var d = b.stateNode;
            if (b.flags & 4 && !U) if (null === c) d.componentDidMount();
            else {
              var e = b.elementType === b.type ? c.memoizedProps : Ci(b.type, c.memoizedProps);
              d.componentDidUpdate(e, c.memoizedState, d.__reactInternalSnapshotBeforeUpdate);
            }
            var f2 = b.updateQueue;
            null !== f2 && sh(b, f2, d);
            break;
          case 3:
            var g = b.updateQueue;
            if (null !== g) {
              c = null;
              if (null !== b.child) switch (b.child.tag) {
                case 5:
                  c = b.child.stateNode;
                  break;
                case 1:
                  c = b.child.stateNode;
              }
              sh(b, g, c);
            }
            break;
          case 5:
            var h = b.stateNode;
            if (null === c && b.flags & 4) {
              c = h;
              var k2 = b.memoizedProps;
              switch (b.type) {
                case "button":
                case "input":
                case "select":
                case "textarea":
                  k2.autoFocus && c.focus();
                  break;
                case "img":
                  k2.src && (c.src = k2.src);
              }
            }
            break;
          case 6:
            break;
          case 4:
            break;
          case 12:
            break;
          case 13:
            if (null === b.memoizedState) {
              var l2 = b.alternate;
              if (null !== l2) {
                var m2 = l2.memoizedState;
                if (null !== m2) {
                  var q2 = m2.dehydrated;
                  null !== q2 && bd(q2);
                }
              }
            }
            break;
          case 19:
          case 17:
          case 21:
          case 22:
          case 23:
          case 25:
            break;
          default:
            throw Error(p(163));
        }
        U || b.flags & 512 && Rj(b);
      } catch (r2) {
        W(b, b.return, r2);
      }
    }
    if (b === a) {
      V = null;
      break;
    }
    c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function gk(a) {
  for (; null !== V; ) {
    var b = V;
    if (b === a) {
      V = null;
      break;
    }
    var c = b.sibling;
    if (null !== c) {
      c.return = b.return;
      V = c;
      break;
    }
    V = b.return;
  }
}
function jk(a) {
  for (; null !== V; ) {
    var b = V;
    try {
      switch (b.tag) {
        case 0:
        case 11:
        case 15:
          var c = b.return;
          try {
            Qj(4, b);
          } catch (k2) {
            W(b, c, k2);
          }
          break;
        case 1:
          var d = b.stateNode;
          if ("function" === typeof d.componentDidMount) {
            var e = b.return;
            try {
              d.componentDidMount();
            } catch (k2) {
              W(b, e, k2);
            }
          }
          var f2 = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, f2, k2);
          }
          break;
        case 5:
          var g = b.return;
          try {
            Rj(b);
          } catch (k2) {
            W(b, g, k2);
          }
      }
    } catch (k2) {
      W(b, b.return, k2);
    }
    if (b === a) {
      V = null;
      break;
    }
    var h = b.sibling;
    if (null !== h) {
      h.return = b.return;
      V = h;
      break;
    }
    V = b.return;
  }
}
var lk = Math.ceil, mk = ua.ReactCurrentDispatcher, nk = ua.ReactCurrentOwner, ok = ua.ReactCurrentBatchConfig, K = 0, Q = null, Y = null, Z = 0, fj = 0, ej = Uf(0), T = 0, pk = null, rh = 0, qk = 0, rk = 0, sk = null, tk = null, fk = 0, Gj = Infinity, uk = null, Oi = false, Pi = null, Ri = null, vk = false, wk = null, xk = 0, yk = 0, zk = null, Ak = -1, Bk = 0;
function R() {
  return 0 !== (K & 6) ? B() : -1 !== Ak ? Ak : Ak = B();
}
function yi(a) {
  if (0 === (a.mode & 1)) return 1;
  if (0 !== (K & 2) && 0 !== Z) return Z & -Z;
  if (null !== Kg.transition) return 0 === Bk && (Bk = yc()), Bk;
  a = C;
  if (0 !== a) return a;
  a = window.event;
  a = void 0 === a ? 16 : jd(a.type);
  return a;
}
function gi(a, b, c, d) {
  if (50 < yk) throw yk = 0, zk = null, Error(p(185));
  Ac(a, c, d);
  if (0 === (K & 2) || a !== Q) a === Q && (0 === (K & 2) && (qk |= c), 4 === T && Ck(a, Z)), Dk(a, d), 1 === c && 0 === K && 0 === (b.mode & 1) && (Gj = B() + 500, fg && jg());
}
function Dk(a, b) {
  var c = a.callbackNode;
  wc(a, b);
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) null !== c && bc(c), a.callbackNode = null, a.callbackPriority = 0;
  else if (b = d & -d, a.callbackPriority !== b) {
    null != c && bc(c);
    if (1 === b) 0 === a.tag ? ig(Ek.bind(null, a)) : hg(Ek.bind(null, a)), Jf(function() {
      0 === (K & 6) && jg();
    }), c = null;
    else {
      switch (Dc(d)) {
        case 1:
          c = fc;
          break;
        case 4:
          c = gc;
          break;
        case 16:
          c = hc;
          break;
        case 536870912:
          c = jc;
          break;
        default:
          c = hc;
      }
      c = Fk(c, Gk.bind(null, a));
    }
    a.callbackPriority = b;
    a.callbackNode = c;
  }
}
function Gk(a, b) {
  Ak = -1;
  Bk = 0;
  if (0 !== (K & 6)) throw Error(p(327));
  var c = a.callbackNode;
  if (Hk() && a.callbackNode !== c) return null;
  var d = uc(a, a === Q ? Z : 0);
  if (0 === d) return null;
  if (0 !== (d & 30) || 0 !== (d & a.expiredLanes) || b) b = Ik(a, d);
  else {
    b = d;
    var e = K;
    K |= 2;
    var f2 = Jk();
    if (Q !== a || Z !== b) uk = null, Gj = B() + 500, Kk(a, b);
    do
      try {
        Lk();
        break;
      } catch (h) {
        Mk(a, h);
      }
    while (1);
    $g();
    mk.current = f2;
    K = e;
    null !== Y ? b = 0 : (Q = null, Z = 0, b = T);
  }
  if (0 !== b) {
    2 === b && (e = xc(a), 0 !== e && (d = e, b = Nk(a, e)));
    if (1 === b) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
    if (6 === b) Ck(a, d);
    else {
      e = a.current.alternate;
      if (0 === (d & 30) && !Ok(e) && (b = Ik(a, d), 2 === b && (f2 = xc(a), 0 !== f2 && (d = f2, b = Nk(a, f2))), 1 === b)) throw c = pk, Kk(a, 0), Ck(a, d), Dk(a, B()), c;
      a.finishedWork = e;
      a.finishedLanes = d;
      switch (b) {
        case 0:
        case 1:
          throw Error(p(345));
        case 2:
          Pk(a, tk, uk);
          break;
        case 3:
          Ck(a, d);
          if ((d & 130023424) === d && (b = fk + 500 - B(), 10 < b)) {
            if (0 !== uc(a, 0)) break;
            e = a.suspendedLanes;
            if ((e & d) !== d) {
              R();
              a.pingedLanes |= a.suspendedLanes & e;
              break;
            }
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), b);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 4:
          Ck(a, d);
          if ((d & 4194240) === d) break;
          b = a.eventTimes;
          for (e = -1; 0 < d; ) {
            var g = 31 - oc(d);
            f2 = 1 << g;
            g = b[g];
            g > e && (e = g);
            d &= ~f2;
          }
          d = e;
          d = B() - d;
          d = (120 > d ? 120 : 480 > d ? 480 : 1080 > d ? 1080 : 1920 > d ? 1920 : 3e3 > d ? 3e3 : 4320 > d ? 4320 : 1960 * lk(d / 1960)) - d;
          if (10 < d) {
            a.timeoutHandle = Ff(Pk.bind(null, a, tk, uk), d);
            break;
          }
          Pk(a, tk, uk);
          break;
        case 5:
          Pk(a, tk, uk);
          break;
        default:
          throw Error(p(329));
      }
    }
  }
  Dk(a, B());
  return a.callbackNode === c ? Gk.bind(null, a) : null;
}
function Nk(a, b) {
  var c = sk;
  a.current.memoizedState.isDehydrated && (Kk(a, b).flags |= 256);
  a = Ik(a, b);
  2 !== a && (b = tk, tk = c, null !== b && Fj(b));
  return a;
}
function Fj(a) {
  null === tk ? tk = a : tk.push.apply(tk, a);
}
function Ok(a) {
  for (var b = a; ; ) {
    if (b.flags & 16384) {
      var c = b.updateQueue;
      if (null !== c && (c = c.stores, null !== c)) for (var d = 0; d < c.length; d++) {
        var e = c[d], f2 = e.getSnapshot;
        e = e.value;
        try {
          if (!He(f2(), e)) return false;
        } catch (g) {
          return false;
        }
      }
    }
    c = b.child;
    if (b.subtreeFlags & 16384 && null !== c) c.return = b, b = c;
    else {
      if (b === a) break;
      for (; null === b.sibling; ) {
        if (null === b.return || b.return === a) return true;
        b = b.return;
      }
      b.sibling.return = b.return;
      b = b.sibling;
    }
  }
  return true;
}
function Ck(a, b) {
  b &= ~rk;
  b &= ~qk;
  a.suspendedLanes |= b;
  a.pingedLanes &= ~b;
  for (a = a.expirationTimes; 0 < b; ) {
    var c = 31 - oc(b), d = 1 << c;
    a[c] = -1;
    b &= ~d;
  }
}
function Ek(a) {
  if (0 !== (K & 6)) throw Error(p(327));
  Hk();
  var b = uc(a, 0);
  if (0 === (b & 1)) return Dk(a, B()), null;
  var c = Ik(a, b);
  if (0 !== a.tag && 2 === c) {
    var d = xc(a);
    0 !== d && (b = d, c = Nk(a, d));
  }
  if (1 === c) throw c = pk, Kk(a, 0), Ck(a, b), Dk(a, B()), c;
  if (6 === c) throw Error(p(345));
  a.finishedWork = a.current.alternate;
  a.finishedLanes = b;
  Pk(a, tk, uk);
  Dk(a, B());
  return null;
}
function Qk(a, b) {
  var c = K;
  K |= 1;
  try {
    return a(b);
  } finally {
    K = c, 0 === K && (Gj = B() + 500, fg && jg());
  }
}
function Rk(a) {
  null !== wk && 0 === wk.tag && 0 === (K & 6) && Hk();
  var b = K;
  K |= 1;
  var c = ok.transition, d = C;
  try {
    if (ok.transition = null, C = 1, a) return a();
  } finally {
    C = d, ok.transition = c, K = b, 0 === (K & 6) && jg();
  }
}
function Hj() {
  fj = ej.current;
  E(ej);
}
function Kk(a, b) {
  a.finishedWork = null;
  a.finishedLanes = 0;
  var c = a.timeoutHandle;
  -1 !== c && (a.timeoutHandle = -1, Gf(c));
  if (null !== Y) for (c = Y.return; null !== c; ) {
    var d = c;
    wg(d);
    switch (d.tag) {
      case 1:
        d = d.type.childContextTypes;
        null !== d && void 0 !== d && $f();
        break;
      case 3:
        zh();
        E(Wf);
        E(H);
        Eh();
        break;
      case 5:
        Bh(d);
        break;
      case 4:
        zh();
        break;
      case 13:
        E(L);
        break;
      case 19:
        E(L);
        break;
      case 10:
        ah(d.type._context);
        break;
      case 22:
      case 23:
        Hj();
    }
    c = c.return;
  }
  Q = a;
  Y = a = Pg(a.current, null);
  Z = fj = b;
  T = 0;
  pk = null;
  rk = qk = rh = 0;
  tk = sk = null;
  if (null !== fh) {
    for (b = 0; b < fh.length; b++) if (c = fh[b], d = c.interleaved, null !== d) {
      c.interleaved = null;
      var e = d.next, f2 = c.pending;
      if (null !== f2) {
        var g = f2.next;
        f2.next = e;
        d.next = g;
      }
      c.pending = d;
    }
    fh = null;
  }
  return a;
}
function Mk(a, b) {
  do {
    var c = Y;
    try {
      $g();
      Fh.current = Rh;
      if (Ih) {
        for (var d = M.memoizedState; null !== d; ) {
          var e = d.queue;
          null !== e && (e.pending = null);
          d = d.next;
        }
        Ih = false;
      }
      Hh = 0;
      O = N = M = null;
      Jh = false;
      Kh = 0;
      nk.current = null;
      if (null === c || null === c.return) {
        T = 1;
        pk = b;
        Y = null;
        break;
      }
      a: {
        var f2 = a, g = c.return, h = c, k2 = b;
        b = Z;
        h.flags |= 32768;
        if (null !== k2 && "object" === typeof k2 && "function" === typeof k2.then) {
          var l2 = k2, m2 = h, q2 = m2.tag;
          if (0 === (m2.mode & 1) && (0 === q2 || 11 === q2 || 15 === q2)) {
            var r2 = m2.alternate;
            r2 ? (m2.updateQueue = r2.updateQueue, m2.memoizedState = r2.memoizedState, m2.lanes = r2.lanes) : (m2.updateQueue = null, m2.memoizedState = null);
          }
          var y2 = Ui(g);
          if (null !== y2) {
            y2.flags &= -257;
            Vi(y2, g, h, f2, b);
            y2.mode & 1 && Si(f2, l2, b);
            b = y2;
            k2 = l2;
            var n2 = b.updateQueue;
            if (null === n2) {
              var t2 = /* @__PURE__ */ new Set();
              t2.add(k2);
              b.updateQueue = t2;
            } else n2.add(k2);
            break a;
          } else {
            if (0 === (b & 1)) {
              Si(f2, l2, b);
              tj();
              break a;
            }
            k2 = Error(p(426));
          }
        } else if (I && h.mode & 1) {
          var J2 = Ui(g);
          if (null !== J2) {
            0 === (J2.flags & 65536) && (J2.flags |= 256);
            Vi(J2, g, h, f2, b);
            Jg(Ji(k2, h));
            break a;
          }
        }
        f2 = k2 = Ji(k2, h);
        4 !== T && (T = 2);
        null === sk ? sk = [f2] : sk.push(f2);
        f2 = g;
        do {
          switch (f2.tag) {
            case 3:
              f2.flags |= 65536;
              b &= -b;
              f2.lanes |= b;
              var x2 = Ni(f2, k2, b);
              ph(f2, x2);
              break a;
            case 1:
              h = k2;
              var w2 = f2.type, u2 = f2.stateNode;
              if (0 === (f2.flags & 128) && ("function" === typeof w2.getDerivedStateFromError || null !== u2 && "function" === typeof u2.componentDidCatch && (null === Ri || !Ri.has(u2)))) {
                f2.flags |= 65536;
                b &= -b;
                f2.lanes |= b;
                var F2 = Qi(f2, h, b);
                ph(f2, F2);
                break a;
              }
          }
          f2 = f2.return;
        } while (null !== f2);
      }
      Sk(c);
    } catch (na) {
      b = na;
      Y === c && null !== c && (Y = c = c.return);
      continue;
    }
    break;
  } while (1);
}
function Jk() {
  var a = mk.current;
  mk.current = Rh;
  return null === a ? Rh : a;
}
function tj() {
  if (0 === T || 3 === T || 2 === T) T = 4;
  null === Q || 0 === (rh & 268435455) && 0 === (qk & 268435455) || Ck(Q, Z);
}
function Ik(a, b) {
  var c = K;
  K |= 2;
  var d = Jk();
  if (Q !== a || Z !== b) uk = null, Kk(a, b);
  do
    try {
      Tk();
      break;
    } catch (e) {
      Mk(a, e);
    }
  while (1);
  $g();
  K = c;
  mk.current = d;
  if (null !== Y) throw Error(p(261));
  Q = null;
  Z = 0;
  return T;
}
function Tk() {
  for (; null !== Y; ) Uk(Y);
}
function Lk() {
  for (; null !== Y && !cc(); ) Uk(Y);
}
function Uk(a) {
  var b = Vk(a.alternate, a, fj);
  a.memoizedProps = a.pendingProps;
  null === b ? Sk(a) : Y = b;
  nk.current = null;
}
function Sk(a) {
  var b = a;
  do {
    var c = b.alternate;
    a = b.return;
    if (0 === (b.flags & 32768)) {
      if (c = Ej(c, b, fj), null !== c) {
        Y = c;
        return;
      }
    } else {
      c = Ij(c, b);
      if (null !== c) {
        c.flags &= 32767;
        Y = c;
        return;
      }
      if (null !== a) a.flags |= 32768, a.subtreeFlags = 0, a.deletions = null;
      else {
        T = 6;
        Y = null;
        return;
      }
    }
    b = b.sibling;
    if (null !== b) {
      Y = b;
      return;
    }
    Y = b = a;
  } while (null !== b);
  0 === T && (T = 5);
}
function Pk(a, b, c) {
  var d = C, e = ok.transition;
  try {
    ok.transition = null, C = 1, Wk(a, b, c, d);
  } finally {
    ok.transition = e, C = d;
  }
  return null;
}
function Wk(a, b, c, d) {
  do
    Hk();
  while (null !== wk);
  if (0 !== (K & 6)) throw Error(p(327));
  c = a.finishedWork;
  var e = a.finishedLanes;
  if (null === c) return null;
  a.finishedWork = null;
  a.finishedLanes = 0;
  if (c === a.current) throw Error(p(177));
  a.callbackNode = null;
  a.callbackPriority = 0;
  var f2 = c.lanes | c.childLanes;
  Bc(a, f2);
  a === Q && (Y = Q = null, Z = 0);
  0 === (c.subtreeFlags & 2064) && 0 === (c.flags & 2064) || vk || (vk = true, Fk(hc, function() {
    Hk();
    return null;
  }));
  f2 = 0 !== (c.flags & 15990);
  if (0 !== (c.subtreeFlags & 15990) || f2) {
    f2 = ok.transition;
    ok.transition = null;
    var g = C;
    C = 1;
    var h = K;
    K |= 4;
    nk.current = null;
    Oj(a, c);
    dk(c, a);
    Oe(Df);
    dd = !!Cf;
    Df = Cf = null;
    a.current = c;
    hk(c);
    dc();
    K = h;
    C = g;
    ok.transition = f2;
  } else a.current = c;
  vk && (vk = false, wk = a, xk = e);
  f2 = a.pendingLanes;
  0 === f2 && (Ri = null);
  mc(c.stateNode);
  Dk(a, B());
  if (null !== b) for (d = a.onRecoverableError, c = 0; c < b.length; c++) e = b[c], d(e.value, { componentStack: e.stack, digest: e.digest });
  if (Oi) throw Oi = false, a = Pi, Pi = null, a;
  0 !== (xk & 1) && 0 !== a.tag && Hk();
  f2 = a.pendingLanes;
  0 !== (f2 & 1) ? a === zk ? yk++ : (yk = 0, zk = a) : yk = 0;
  jg();
  return null;
}
function Hk() {
  if (null !== wk) {
    var a = Dc(xk), b = ok.transition, c = C;
    try {
      ok.transition = null;
      C = 16 > a ? 16 : a;
      if (null === wk) var d = false;
      else {
        a = wk;
        wk = null;
        xk = 0;
        if (0 !== (K & 6)) throw Error(p(331));
        var e = K;
        K |= 4;
        for (V = a.current; null !== V; ) {
          var f2 = V, g = f2.child;
          if (0 !== (V.flags & 16)) {
            var h = f2.deletions;
            if (null !== h) {
              for (var k2 = 0; k2 < h.length; k2++) {
                var l2 = h[k2];
                for (V = l2; null !== V; ) {
                  var m2 = V;
                  switch (m2.tag) {
                    case 0:
                    case 11:
                    case 15:
                      Pj(8, m2, f2);
                  }
                  var q2 = m2.child;
                  if (null !== q2) q2.return = m2, V = q2;
                  else for (; null !== V; ) {
                    m2 = V;
                    var r2 = m2.sibling, y2 = m2.return;
                    Sj(m2);
                    if (m2 === l2) {
                      V = null;
                      break;
                    }
                    if (null !== r2) {
                      r2.return = y2;
                      V = r2;
                      break;
                    }
                    V = y2;
                  }
                }
              }
              var n2 = f2.alternate;
              if (null !== n2) {
                var t2 = n2.child;
                if (null !== t2) {
                  n2.child = null;
                  do {
                    var J2 = t2.sibling;
                    t2.sibling = null;
                    t2 = J2;
                  } while (null !== t2);
                }
              }
              V = f2;
            }
          }
          if (0 !== (f2.subtreeFlags & 2064) && null !== g) g.return = f2, V = g;
          else b: for (; null !== V; ) {
            f2 = V;
            if (0 !== (f2.flags & 2048)) switch (f2.tag) {
              case 0:
              case 11:
              case 15:
                Pj(9, f2, f2.return);
            }
            var x2 = f2.sibling;
            if (null !== x2) {
              x2.return = f2.return;
              V = x2;
              break b;
            }
            V = f2.return;
          }
        }
        var w2 = a.current;
        for (V = w2; null !== V; ) {
          g = V;
          var u2 = g.child;
          if (0 !== (g.subtreeFlags & 2064) && null !== u2) u2.return = g, V = u2;
          else b: for (g = w2; null !== V; ) {
            h = V;
            if (0 !== (h.flags & 2048)) try {
              switch (h.tag) {
                case 0:
                case 11:
                case 15:
                  Qj(9, h);
              }
            } catch (na) {
              W(h, h.return, na);
            }
            if (h === g) {
              V = null;
              break b;
            }
            var F2 = h.sibling;
            if (null !== F2) {
              F2.return = h.return;
              V = F2;
              break b;
            }
            V = h.return;
          }
        }
        K = e;
        jg();
        if (lc && "function" === typeof lc.onPostCommitFiberRoot) try {
          lc.onPostCommitFiberRoot(kc, a);
        } catch (na) {
        }
        d = true;
      }
      return d;
    } finally {
      C = c, ok.transition = b;
    }
  }
  return false;
}
function Xk(a, b, c) {
  b = Ji(c, b);
  b = Ni(a, b, 1);
  a = nh(a, b, 1);
  b = R();
  null !== a && (Ac(a, 1, b), Dk(a, b));
}
function W(a, b, c) {
  if (3 === a.tag) Xk(a, a, c);
  else for (; null !== b; ) {
    if (3 === b.tag) {
      Xk(b, a, c);
      break;
    } else if (1 === b.tag) {
      var d = b.stateNode;
      if ("function" === typeof b.type.getDerivedStateFromError || "function" === typeof d.componentDidCatch && (null === Ri || !Ri.has(d))) {
        a = Ji(c, a);
        a = Qi(b, a, 1);
        b = nh(b, a, 1);
        a = R();
        null !== b && (Ac(b, 1, a), Dk(b, a));
        break;
      }
    }
    b = b.return;
  }
}
function Ti(a, b, c) {
  var d = a.pingCache;
  null !== d && d.delete(b);
  b = R();
  a.pingedLanes |= a.suspendedLanes & c;
  Q === a && (Z & c) === c && (4 === T || 3 === T && (Z & 130023424) === Z && 500 > B() - fk ? Kk(a, 0) : rk |= c);
  Dk(a, b);
}
function Yk(a, b) {
  0 === b && (0 === (a.mode & 1) ? b = 1 : (b = sc, sc <<= 1, 0 === (sc & 130023424) && (sc = 4194304)));
  var c = R();
  a = ih(a, b);
  null !== a && (Ac(a, b, c), Dk(a, c));
}
function uj(a) {
  var b = a.memoizedState, c = 0;
  null !== b && (c = b.retryLane);
  Yk(a, c);
}
function bk(a, b) {
  var c = 0;
  switch (a.tag) {
    case 13:
      var d = a.stateNode;
      var e = a.memoizedState;
      null !== e && (c = e.retryLane);
      break;
    case 19:
      d = a.stateNode;
      break;
    default:
      throw Error(p(314));
  }
  null !== d && d.delete(b);
  Yk(a, c);
}
var Vk;
Vk = function(a, b, c) {
  if (null !== a) if (a.memoizedProps !== b.pendingProps || Wf.current) dh = true;
  else {
    if (0 === (a.lanes & c) && 0 === (b.flags & 128)) return dh = false, yj(a, b, c);
    dh = 0 !== (a.flags & 131072) ? true : false;
  }
  else dh = false, I && 0 !== (b.flags & 1048576) && ug(b, ng, b.index);
  b.lanes = 0;
  switch (b.tag) {
    case 2:
      var d = b.type;
      ij(a, b);
      a = b.pendingProps;
      var e = Yf(b, H.current);
      ch(b, c);
      e = Nh(null, b, d, a, e, c);
      var f2 = Sh();
      b.flags |= 1;
      "object" === typeof e && null !== e && "function" === typeof e.render && void 0 === e.$$typeof ? (b.tag = 1, b.memoizedState = null, b.updateQueue = null, Zf(d) ? (f2 = true, cg(b)) : f2 = false, b.memoizedState = null !== e.state && void 0 !== e.state ? e.state : null, kh(b), e.updater = Ei, b.stateNode = e, e._reactInternals = b, Ii(b, d, a, c), b = jj(null, b, d, true, f2, c)) : (b.tag = 0, I && f2 && vg(b), Xi(null, b, e, c), b = b.child);
      return b;
    case 16:
      d = b.elementType;
      a: {
        ij(a, b);
        a = b.pendingProps;
        e = d._init;
        d = e(d._payload);
        b.type = d;
        e = b.tag = Zk(d);
        a = Ci(d, a);
        switch (e) {
          case 0:
            b = cj(null, b, d, a, c);
            break a;
          case 1:
            b = hj(null, b, d, a, c);
            break a;
          case 11:
            b = Yi(null, b, d, a, c);
            break a;
          case 14:
            b = $i(null, b, d, Ci(d.type, a), c);
            break a;
        }
        throw Error(p(
          306,
          d,
          ""
        ));
      }
      return b;
    case 0:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), cj(a, b, d, e, c);
    case 1:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), hj(a, b, d, e, c);
    case 3:
      a: {
        kj(b);
        if (null === a) throw Error(p(387));
        d = b.pendingProps;
        f2 = b.memoizedState;
        e = f2.element;
        lh(a, b);
        qh(b, d, null, c);
        var g = b.memoizedState;
        d = g.element;
        if (f2.isDehydrated) if (f2 = { element: d, isDehydrated: false, cache: g.cache, pendingSuspenseBoundaries: g.pendingSuspenseBoundaries, transitions: g.transitions }, b.updateQueue.baseState = f2, b.memoizedState = f2, b.flags & 256) {
          e = Ji(Error(p(423)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else if (d !== e) {
          e = Ji(Error(p(424)), b);
          b = lj(a, b, d, c, e);
          break a;
        } else for (yg = Lf(b.stateNode.containerInfo.firstChild), xg = b, I = true, zg = null, c = Vg(b, null, d, c), b.child = c; c; ) c.flags = c.flags & -3 | 4096, c = c.sibling;
        else {
          Ig();
          if (d === e) {
            b = Zi(a, b, c);
            break a;
          }
          Xi(a, b, d, c);
        }
        b = b.child;
      }
      return b;
    case 5:
      return Ah(b), null === a && Eg(b), d = b.type, e = b.pendingProps, f2 = null !== a ? a.memoizedProps : null, g = e.children, Ef(d, e) ? g = null : null !== f2 && Ef(d, f2) && (b.flags |= 32), gj(a, b), Xi(a, b, g, c), b.child;
    case 6:
      return null === a && Eg(b), null;
    case 13:
      return oj(a, b, c);
    case 4:
      return yh(b, b.stateNode.containerInfo), d = b.pendingProps, null === a ? b.child = Ug(b, null, d, c) : Xi(a, b, d, c), b.child;
    case 11:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), Yi(a, b, d, e, c);
    case 7:
      return Xi(a, b, b.pendingProps, c), b.child;
    case 8:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 12:
      return Xi(a, b, b.pendingProps.children, c), b.child;
    case 10:
      a: {
        d = b.type._context;
        e = b.pendingProps;
        f2 = b.memoizedProps;
        g = e.value;
        G(Wg, d._currentValue);
        d._currentValue = g;
        if (null !== f2) if (He(f2.value, g)) {
          if (f2.children === e.children && !Wf.current) {
            b = Zi(a, b, c);
            break a;
          }
        } else for (f2 = b.child, null !== f2 && (f2.return = b); null !== f2; ) {
          var h = f2.dependencies;
          if (null !== h) {
            g = f2.child;
            for (var k2 = h.firstContext; null !== k2; ) {
              if (k2.context === d) {
                if (1 === f2.tag) {
                  k2 = mh(-1, c & -c);
                  k2.tag = 2;
                  var l2 = f2.updateQueue;
                  if (null !== l2) {
                    l2 = l2.shared;
                    var m2 = l2.pending;
                    null === m2 ? k2.next = k2 : (k2.next = m2.next, m2.next = k2);
                    l2.pending = k2;
                  }
                }
                f2.lanes |= c;
                k2 = f2.alternate;
                null !== k2 && (k2.lanes |= c);
                bh(
                  f2.return,
                  c,
                  b
                );
                h.lanes |= c;
                break;
              }
              k2 = k2.next;
            }
          } else if (10 === f2.tag) g = f2.type === b.type ? null : f2.child;
          else if (18 === f2.tag) {
            g = f2.return;
            if (null === g) throw Error(p(341));
            g.lanes |= c;
            h = g.alternate;
            null !== h && (h.lanes |= c);
            bh(g, c, b);
            g = f2.sibling;
          } else g = f2.child;
          if (null !== g) g.return = f2;
          else for (g = f2; null !== g; ) {
            if (g === b) {
              g = null;
              break;
            }
            f2 = g.sibling;
            if (null !== f2) {
              f2.return = g.return;
              g = f2;
              break;
            }
            g = g.return;
          }
          f2 = g;
        }
        Xi(a, b, e.children, c);
        b = b.child;
      }
      return b;
    case 9:
      return e = b.type, d = b.pendingProps.children, ch(b, c), e = eh(e), d = d(e), b.flags |= 1, Xi(a, b, d, c), b.child;
    case 14:
      return d = b.type, e = Ci(d, b.pendingProps), e = Ci(d.type, e), $i(a, b, d, e, c);
    case 15:
      return bj(a, b, b.type, b.pendingProps, c);
    case 17:
      return d = b.type, e = b.pendingProps, e = b.elementType === d ? e : Ci(d, e), ij(a, b), b.tag = 1, Zf(d) ? (a = true, cg(b)) : a = false, ch(b, c), Gi(b, d, e), Ii(b, d, e, c), jj(null, b, d, true, a, c);
    case 19:
      return xj(a, b, c);
    case 22:
      return dj(a, b, c);
  }
  throw Error(p(156, b.tag));
};
function Fk(a, b) {
  return ac(a, b);
}
function $k(a, b, c, d) {
  this.tag = a;
  this.key = c;
  this.sibling = this.child = this.return = this.stateNode = this.type = this.elementType = null;
  this.index = 0;
  this.ref = null;
  this.pendingProps = b;
  this.dependencies = this.memoizedState = this.updateQueue = this.memoizedProps = null;
  this.mode = d;
  this.subtreeFlags = this.flags = 0;
  this.deletions = null;
  this.childLanes = this.lanes = 0;
  this.alternate = null;
}
function Bg(a, b, c, d) {
  return new $k(a, b, c, d);
}
function aj(a) {
  a = a.prototype;
  return !(!a || !a.isReactComponent);
}
function Zk(a) {
  if ("function" === typeof a) return aj(a) ? 1 : 0;
  if (void 0 !== a && null !== a) {
    a = a.$$typeof;
    if (a === Da) return 11;
    if (a === Ga) return 14;
  }
  return 2;
}
function Pg(a, b) {
  var c = a.alternate;
  null === c ? (c = Bg(a.tag, b, a.key, a.mode), c.elementType = a.elementType, c.type = a.type, c.stateNode = a.stateNode, c.alternate = a, a.alternate = c) : (c.pendingProps = b, c.type = a.type, c.flags = 0, c.subtreeFlags = 0, c.deletions = null);
  c.flags = a.flags & 14680064;
  c.childLanes = a.childLanes;
  c.lanes = a.lanes;
  c.child = a.child;
  c.memoizedProps = a.memoizedProps;
  c.memoizedState = a.memoizedState;
  c.updateQueue = a.updateQueue;
  b = a.dependencies;
  c.dependencies = null === b ? null : { lanes: b.lanes, firstContext: b.firstContext };
  c.sibling = a.sibling;
  c.index = a.index;
  c.ref = a.ref;
  return c;
}
function Rg(a, b, c, d, e, f2) {
  var g = 2;
  d = a;
  if ("function" === typeof a) aj(a) && (g = 1);
  else if ("string" === typeof a) g = 5;
  else a: switch (a) {
    case ya:
      return Tg(c.children, e, f2, b);
    case za:
      g = 8;
      e |= 8;
      break;
    case Aa:
      return a = Bg(12, c, b, e | 2), a.elementType = Aa, a.lanes = f2, a;
    case Ea:
      return a = Bg(13, c, b, e), a.elementType = Ea, a.lanes = f2, a;
    case Fa:
      return a = Bg(19, c, b, e), a.elementType = Fa, a.lanes = f2, a;
    case Ia:
      return pj(c, e, f2, b);
    default:
      if ("object" === typeof a && null !== a) switch (a.$$typeof) {
        case Ba:
          g = 10;
          break a;
        case Ca:
          g = 9;
          break a;
        case Da:
          g = 11;
          break a;
        case Ga:
          g = 14;
          break a;
        case Ha:
          g = 16;
          d = null;
          break a;
      }
      throw Error(p(130, null == a ? a : typeof a, ""));
  }
  b = Bg(g, c, b, e);
  b.elementType = a;
  b.type = d;
  b.lanes = f2;
  return b;
}
function Tg(a, b, c, d) {
  a = Bg(7, a, d, b);
  a.lanes = c;
  return a;
}
function pj(a, b, c, d) {
  a = Bg(22, a, d, b);
  a.elementType = Ia;
  a.lanes = c;
  a.stateNode = { isHidden: false };
  return a;
}
function Qg(a, b, c) {
  a = Bg(6, a, null, b);
  a.lanes = c;
  return a;
}
function Sg(a, b, c) {
  b = Bg(4, null !== a.children ? a.children : [], a.key, b);
  b.lanes = c;
  b.stateNode = { containerInfo: a.containerInfo, pendingChildren: null, implementation: a.implementation };
  return b;
}
function al(a, b, c, d, e) {
  this.tag = b;
  this.containerInfo = a;
  this.finishedWork = this.pingCache = this.current = this.pendingChildren = null;
  this.timeoutHandle = -1;
  this.callbackNode = this.pendingContext = this.context = null;
  this.callbackPriority = 0;
  this.eventTimes = zc(0);
  this.expirationTimes = zc(-1);
  this.entangledLanes = this.finishedLanes = this.mutableReadLanes = this.expiredLanes = this.pingedLanes = this.suspendedLanes = this.pendingLanes = 0;
  this.entanglements = zc(0);
  this.identifierPrefix = d;
  this.onRecoverableError = e;
  this.mutableSourceEagerHydrationData = null;
}
function bl(a, b, c, d, e, f2, g, h, k2) {
  a = new al(a, b, c, h, k2);
  1 === b ? (b = 1, true === f2 && (b |= 8)) : b = 0;
  f2 = Bg(3, null, null, b);
  a.current = f2;
  f2.stateNode = a;
  f2.memoizedState = { element: d, isDehydrated: c, cache: null, transitions: null, pendingSuspenseBoundaries: null };
  kh(f2);
  return a;
}
function cl(a, b, c) {
  var d = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
  return { $$typeof: wa, key: null == d ? null : "" + d, children: a, containerInfo: b, implementation: c };
}
function dl(a) {
  if (!a) return Vf;
  a = a._reactInternals;
  a: {
    if (Vb(a) !== a || 1 !== a.tag) throw Error(p(170));
    var b = a;
    do {
      switch (b.tag) {
        case 3:
          b = b.stateNode.context;
          break a;
        case 1:
          if (Zf(b.type)) {
            b = b.stateNode.__reactInternalMemoizedMergedChildContext;
            break a;
          }
      }
      b = b.return;
    } while (null !== b);
    throw Error(p(171));
  }
  if (1 === a.tag) {
    var c = a.type;
    if (Zf(c)) return bg(a, c, b);
  }
  return b;
}
function el(a, b, c, d, e, f2, g, h, k2) {
  a = bl(c, d, true, a, e, f2, g, h, k2);
  a.context = dl(null);
  c = a.current;
  d = R();
  e = yi(c);
  f2 = mh(d, e);
  f2.callback = void 0 !== b && null !== b ? b : null;
  nh(c, f2, e);
  a.current.lanes = e;
  Ac(a, e, d);
  Dk(a, d);
  return a;
}
function fl(a, b, c, d) {
  var e = b.current, f2 = R(), g = yi(e);
  c = dl(c);
  null === b.context ? b.context = c : b.pendingContext = c;
  b = mh(f2, g);
  b.payload = { element: a };
  d = void 0 === d ? null : d;
  null !== d && (b.callback = d);
  a = nh(e, b, g);
  null !== a && (gi(a, e, g, f2), oh(a, e, g));
  return g;
}
function gl(a) {
  a = a.current;
  if (!a.child) return null;
  switch (a.child.tag) {
    case 5:
      return a.child.stateNode;
    default:
      return a.child.stateNode;
  }
}
function hl(a, b) {
  a = a.memoizedState;
  if (null !== a && null !== a.dehydrated) {
    var c = a.retryLane;
    a.retryLane = 0 !== c && c < b ? c : b;
  }
}
function il(a, b) {
  hl(a, b);
  (a = a.alternate) && hl(a, b);
}
function jl() {
  return null;
}
var kl = "function" === typeof reportError ? reportError : function(a) {
  console.error(a);
};
function ll(a) {
  this._internalRoot = a;
}
ml.prototype.render = ll.prototype.render = function(a) {
  var b = this._internalRoot;
  if (null === b) throw Error(p(409));
  fl(a, b, null, null);
};
ml.prototype.unmount = ll.prototype.unmount = function() {
  var a = this._internalRoot;
  if (null !== a) {
    this._internalRoot = null;
    var b = a.containerInfo;
    Rk(function() {
      fl(null, a, null, null);
    });
    b[uf] = null;
  }
};
function ml(a) {
  this._internalRoot = a;
}
ml.prototype.unstable_scheduleHydration = function(a) {
  if (a) {
    var b = Hc();
    a = { blockedOn: null, target: a, priority: b };
    for (var c = 0; c < Qc.length && 0 !== b && b < Qc[c].priority; c++) ;
    Qc.splice(c, 0, a);
    0 === c && Vc(a);
  }
};
function nl(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType);
}
function ol(a) {
  return !(!a || 1 !== a.nodeType && 9 !== a.nodeType && 11 !== a.nodeType && (8 !== a.nodeType || " react-mount-point-unstable " !== a.nodeValue));
}
function pl() {
}
function ql(a, b, c, d, e) {
  if (e) {
    if ("function" === typeof d) {
      var f2 = d;
      d = function() {
        var a2 = gl(g);
        f2.call(a2);
      };
    }
    var g = el(b, d, a, 0, null, false, false, "", pl);
    a._reactRootContainer = g;
    a[uf] = g.current;
    sf(8 === a.nodeType ? a.parentNode : a);
    Rk();
    return g;
  }
  for (; e = a.lastChild; ) a.removeChild(e);
  if ("function" === typeof d) {
    var h = d;
    d = function() {
      var a2 = gl(k2);
      h.call(a2);
    };
  }
  var k2 = bl(a, 0, false, null, null, false, false, "", pl);
  a._reactRootContainer = k2;
  a[uf] = k2.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  Rk(function() {
    fl(b, k2, c, d);
  });
  return k2;
}
function rl(a, b, c, d, e) {
  var f2 = c._reactRootContainer;
  if (f2) {
    var g = f2;
    if ("function" === typeof e) {
      var h = e;
      e = function() {
        var a2 = gl(g);
        h.call(a2);
      };
    }
    fl(b, g, a, e);
  } else g = ql(c, b, a, e, d);
  return gl(g);
}
Ec = function(a) {
  switch (a.tag) {
    case 3:
      var b = a.stateNode;
      if (b.current.memoizedState.isDehydrated) {
        var c = tc(b.pendingLanes);
        0 !== c && (Cc(b, c | 1), Dk(b, B()), 0 === (K & 6) && (Gj = B() + 500, jg()));
      }
      break;
    case 13:
      Rk(function() {
        var b2 = ih(a, 1);
        if (null !== b2) {
          var c2 = R();
          gi(b2, a, 1, c2);
        }
      }), il(a, 1);
  }
};
Fc = function(a) {
  if (13 === a.tag) {
    var b = ih(a, 134217728);
    if (null !== b) {
      var c = R();
      gi(b, a, 134217728, c);
    }
    il(a, 134217728);
  }
};
Gc = function(a) {
  if (13 === a.tag) {
    var b = yi(a), c = ih(a, b);
    if (null !== c) {
      var d = R();
      gi(c, a, b, d);
    }
    il(a, b);
  }
};
Hc = function() {
  return C;
};
Ic = function(a, b) {
  var c = C;
  try {
    return C = a, b();
  } finally {
    C = c;
  }
};
yb = function(a, b, c) {
  switch (b) {
    case "input":
      bb(a, c);
      b = c.name;
      if ("radio" === c.type && null != b) {
        for (c = a; c.parentNode; ) c = c.parentNode;
        c = c.querySelectorAll("input[name=" + JSON.stringify("" + b) + '][type="radio"]');
        for (b = 0; b < c.length; b++) {
          var d = c[b];
          if (d !== a && d.form === a.form) {
            var e = Db(d);
            if (!e) throw Error(p(90));
            Wa(d);
            bb(d, e);
          }
        }
      }
      break;
    case "textarea":
      ib(a, c);
      break;
    case "select":
      b = c.value, null != b && fb(a, !!c.multiple, b, false);
  }
};
Gb = Qk;
Hb = Rk;
var sl = { usingClientEntryPoint: false, Events: [Cb, ue, Db, Eb, Fb, Qk] }, tl = { findFiberByHostInstance: Wc, bundleType: 0, version: "18.3.1", rendererPackageName: "react-dom" };
var ul = { bundleType: tl.bundleType, version: tl.version, rendererPackageName: tl.rendererPackageName, rendererConfig: tl.rendererConfig, overrideHookState: null, overrideHookStateDeletePath: null, overrideHookStateRenamePath: null, overrideProps: null, overridePropsDeletePath: null, overridePropsRenamePath: null, setErrorHandler: null, setSuspenseHandler: null, scheduleUpdate: null, currentDispatcherRef: ua.ReactCurrentDispatcher, findHostInstanceByFiber: function(a) {
  a = Zb(a);
  return null === a ? null : a.stateNode;
}, findFiberByHostInstance: tl.findFiberByHostInstance || jl, findHostInstancesForRefresh: null, scheduleRefresh: null, scheduleRoot: null, setRefreshHandler: null, getCurrentFiber: null, reconcilerVersion: "18.3.1-next-f1338f8080-20240426" };
if ("undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__) {
  var vl = __REACT_DEVTOOLS_GLOBAL_HOOK__;
  if (!vl.isDisabled && vl.supportsFiber) try {
    kc = vl.inject(ul), lc = vl;
  } catch (a) {
  }
}
reactDom_production_min.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = sl;
reactDom_production_min.createPortal = function(a, b) {
  var c = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
  if (!nl(b)) throw Error(p(200));
  return cl(a, b, null, c);
};
reactDom_production_min.createRoot = function(a, b) {
  if (!nl(a)) throw Error(p(299));
  var c = false, d = "", e = kl;
  null !== b && void 0 !== b && (true === b.unstable_strictMode && (c = true), void 0 !== b.identifierPrefix && (d = b.identifierPrefix), void 0 !== b.onRecoverableError && (e = b.onRecoverableError));
  b = bl(a, 1, false, null, null, c, false, d, e);
  a[uf] = b.current;
  sf(8 === a.nodeType ? a.parentNode : a);
  return new ll(b);
};
reactDom_production_min.findDOMNode = function(a) {
  if (null == a) return null;
  if (1 === a.nodeType) return a;
  var b = a._reactInternals;
  if (void 0 === b) {
    if ("function" === typeof a.render) throw Error(p(188));
    a = Object.keys(a).join(",");
    throw Error(p(268, a));
  }
  a = Zb(b);
  a = null === a ? null : a.stateNode;
  return a;
};
reactDom_production_min.flushSync = function(a) {
  return Rk(a);
};
reactDom_production_min.hydrate = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, true, c);
};
reactDom_production_min.hydrateRoot = function(a, b, c) {
  if (!nl(a)) throw Error(p(405));
  var d = null != c && c.hydratedSources || null, e = false, f2 = "", g = kl;
  null !== c && void 0 !== c && (true === c.unstable_strictMode && (e = true), void 0 !== c.identifierPrefix && (f2 = c.identifierPrefix), void 0 !== c.onRecoverableError && (g = c.onRecoverableError));
  b = el(b, null, a, 1, null != c ? c : null, e, false, f2, g);
  a[uf] = b.current;
  sf(a);
  if (d) for (a = 0; a < d.length; a++) c = d[a], e = c._getVersion, e = e(c._source), null == b.mutableSourceEagerHydrationData ? b.mutableSourceEagerHydrationData = [c, e] : b.mutableSourceEagerHydrationData.push(
    c,
    e
  );
  return new ml(b);
};
reactDom_production_min.render = function(a, b, c) {
  if (!ol(b)) throw Error(p(200));
  return rl(null, a, b, false, c);
};
reactDom_production_min.unmountComponentAtNode = function(a) {
  if (!ol(a)) throw Error(p(40));
  return a._reactRootContainer ? (Rk(function() {
    rl(null, null, a, false, function() {
      a._reactRootContainer = null;
      a[uf] = null;
    });
  }), true) : false;
};
reactDom_production_min.unstable_batchedUpdates = Qk;
reactDom_production_min.unstable_renderSubtreeIntoContainer = function(a, b, c, d) {
  if (!ol(c)) throw Error(p(200));
  if (null == a || void 0 === a._reactInternals) throw Error(p(38));
  return rl(a, b, c, false, d);
};
reactDom_production_min.version = "18.3.1-next-f1338f8080-20240426";
function checkDCE() {
  if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
    return;
  }
  try {
    __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
  } catch (err) {
    console.error(err);
  }
}
{
  checkDCE();
  reactDom.exports = reactDom_production_min;
}
var reactDomExports = reactDom.exports;
var createRoot;
var m = reactDomExports;
{
  createRoot = m.createRoot;
  m.hydrateRoot;
}
const QueryClientContext = reactExports.createContext(void 0);
const QueryClientProvider = ({ client, children }) => {
  reactExports.useEffect(() => {
    client.mount();
    return () => {
      client.unmount();
    };
  }, [client]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientContext.Provider, {
    value: client,
    children
  });
};
const defaultTimeoutProvider = {
  setTimeout: (callback, delay) => setTimeout(callback, delay),
  clearTimeout: (timeoutId) => clearTimeout(timeoutId),
  setInterval: (callback, delay) => setInterval(callback, delay),
  clearInterval: (intervalId) => clearInterval(intervalId)
};
var TimeoutManager = class {
  #provider = defaultTimeoutProvider;
  #providerCalled = false;
  /**
  * `setTimeoutProvider` can be used to set a custom implementation of the
  * `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval` functions,
  * called a `TimeoutProvider`.
  *
  * This may be useful if you notice event loop performance issues with
  * thousands of queries. A custom TimeoutProvider could also support timer
  * delays longer than the global `setTimeout` maximum delay value of about
  * 24 days.
  *
  * It is important to call `setTimeoutProvider` before creating a
  * QueryClient or queries, so that the same provider is used consistently
  * for all timers in the application, since different TimeoutProviders
  * cannot cancel each others' timers.
  * @param provider - The `TimeoutProvider` to use for all timers from now on.
  * @example
  * ```ts
  * import { timeoutManager, QueryClient } from '@tanstack/query-core'
  * import { CustomTimeoutProvider } from './CustomTimeoutProvider'
  *
  * timeoutManager.setTimeoutProvider(new CustomTimeoutProvider())
  *
  * export const queryClient = new QueryClient()
  * ```
  */
  setTimeoutProvider(provider) {
    this.#provider = provider;
  }
  /**
  * `setTimeout` schedules a callback to run after approximately `delay`
  * milliseconds, like the global `setTimeout` function. The callback can be
  * canceled with `clearTimeout`.
  *
  * It returns a timer ID, which may be a number or an object that can be
  * coerced to a number via `Symbol.toPrimitive`.
  * @param callback - The function to call when the timeout elapses.
  * @param delay - The time to wait before calling `callback`, in milliseconds.
  * @returns The timer ID, to pass to {@link TimeoutManager#clearTimeout}.
  * @example
  * ```ts
  * import { timeoutManager } from '@tanstack/query-core'
  *
  * const timeoutId = timeoutManager.setTimeout(
  *   () => console.log('ran at:', new Date()),
  *   1000,
  * )
  *
  * const timeoutIdNumber: number = Number(timeoutId)
  * ```
  */
  setTimeout(callback, delay) {
    return this.#provider.setTimeout(callback, delay);
  }
  /**
  * `clearTimeout` cancels a timeout callback scheduled with `setTimeout`,
  * like the global `clearTimeout` function. It should be called with a
  * timer ID returned by `setTimeout`.
  * @param timeoutId - The timer ID returned by `setTimeout`, or `undefined`.
  * @example
  * ```ts
  * import { timeoutManager } from '@tanstack/query-core'
  *
  * const timeoutId = timeoutManager.setTimeout(
  *   () => console.log('ran at:', new Date()),
  *   1000,
  * )
  *
  * timeoutManager.clearTimeout(timeoutId)
  * ```
  */
  clearTimeout(timeoutId) {
    this.#provider.clearTimeout(timeoutId);
  }
  /**
  * `setInterval` schedules a callback to be called approximately every
  * `delay` milliseconds, like the global `setInterval` function.
  *
  * Like `setTimeout`, it returns a timer ID, which may be a number or an
  * object that can be coerced to a number via `Symbol.toPrimitive`.
  * @param callback - The function to call on every interval.
  * @param delay - The time between calls, in milliseconds.
  * @returns The timer ID, to pass to {@link TimeoutManager#clearInterval}.
  * @example
  * ```ts
  * import { timeoutManager } from '@tanstack/query-core'
  *
  * const intervalId = timeoutManager.setInterval(
  *   () => console.log('ran at:', new Date()),
  *   1000,
  * )
  * ```
  */
  setInterval(callback, delay) {
    return this.#provider.setInterval(callback, delay);
  }
  /**
  * `clearInterval` can be used to cancel an interval, like the global
  * `clearInterval` function. It should be called with an interval ID
  * returned by `setInterval`.
  * @param intervalId - The timer ID returned by `setInterval`, or `undefined`.
  * @example
  * ```ts
  * import { timeoutManager } from '@tanstack/query-core'
  *
  * const intervalId = timeoutManager.setInterval(
  *   () => console.log('ran at:', new Date()),
  *   1000,
  * )
  *
  * timeoutManager.clearInterval(intervalId)
  * ```
  */
  clearInterval(intervalId) {
    this.#provider.clearInterval(intervalId);
  }
};
const timeoutManager = new TimeoutManager();
function systemSetTimeoutZero(callback) {
  setTimeout(callback, 0);
}
const isServer$1 = typeof window === "undefined" || "Deno" in globalThis;
function noop() {
}
function functionalUpdate(updater, input) {
  return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
  return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
  return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function resolveQueryValue(value, query) {
  return typeof value === "function" ? value(query) : value;
}
function matchQuery(filters, query) {
  const { type = "all", exact, fetchStatus, predicate, queryKey, stale } = filters;
  if (queryKey) {
    if (exact) {
      if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) return false;
    } else if (!partialMatchKey(query.queryKey, queryKey)) return false;
  }
  if (type !== "all") {
    const isActive = query.isActive();
    if (type === "active" && !isActive) return false;
    if (type === "inactive" && isActive) return false;
  }
  if (typeof stale === "boolean" && query.isStale() !== stale) return false;
  if (fetchStatus && fetchStatus !== query.state.fetchStatus) return false;
  if (predicate && !predicate(query)) return false;
  return true;
}
function matchMutation(filters, mutation) {
  const { exact, status, predicate, mutationKey } = filters;
  if (mutationKey) {
    if (!mutation.options.mutationKey) return false;
    if (exact) {
      if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) return false;
    } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) return false;
  }
  if (status && mutation.state.status !== status) return false;
  if (predicate && !predicate(mutation)) return false;
  return true;
}
function hashQueryKeyByOptions(queryKey, options2) {
  return (options2?.queryKeyHashFn || hashKey)(queryKey);
}
function hashKey(queryKey) {
  return JSON.stringify(queryKey, (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
    result[key] = val[key];
    return result;
  }, {}) : val);
}
function partialMatchKey(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a && b && typeof a === "object" && typeof b === "object") {
    if (Array.isArray(a) && Array.isArray(b)) {
      if (b.length > a.length) return false;
      for (let i = 0; i < b.length; i++) if (!partialMatchKey(a[i], b[i])) return false;
      return true;
    }
    const bKeys = Object.keys(b);
    for (const key of bKeys) if (!partialMatchKey(a[key], b[key])) return false;
    return true;
  }
  return false;
}
const hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a, b, depth = 0) {
  if (a === b) return a;
  if (depth > 500) return b;
  const array = isPlainArray(a) && isPlainArray(b);
  if (!array && !(isPlainObject(a) && isPlainObject(b))) return b;
  const aSize = (array ? a : Object.keys(a)).length;
  const bItems = array ? b : Object.keys(b);
  const bSize = bItems.length;
  const copy = array ? new Array(bSize) : {};
  let equalItems = 0;
  for (let i = 0; i < bSize; i++) {
    const key = array ? i : bItems[i];
    const aItem = a[key];
    const bItem = b[key];
    if (aItem === bItem) {
      copy[key] = aItem;
      if (array ? i < aSize : hasOwn.call(a, key)) equalItems++;
      continue;
    }
    if (aItem === null || bItem === null || typeof aItem !== "object" || typeof bItem !== "object") {
      copy[key] = bItem;
      continue;
    }
    const v2 = replaceEqualDeep(aItem, bItem, depth + 1);
    copy[key] = v2;
    if (v2 === aItem) equalItems++;
  }
  return aSize === bSize && equalItems === aSize ? a : copy;
}
function isPlainArray(value) {
  return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
  if (!hasObjectPrototype(o)) return false;
  const objectPrototype = Object.getPrototypeOf(o);
  const ctor = objectPrototype?.constructor;
  if (ctor === void 0) return true;
  if (typeof ctor !== "function") return false;
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) return false;
  if (!prot.hasOwnProperty("isPrototypeOf")) return false;
  if (objectPrototype !== Object.prototype) return false;
  return true;
}
function hasObjectPrototype(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(timeout) {
  return new Promise((resolve) => {
    timeoutManager.setTimeout(resolve, timeout);
  });
}
function replaceData(prevData, data, options2) {
  if (typeof options2.structuralSharing === "function") return options2.structuralSharing(prevData, data);
  else if (options2.structuralSharing !== false) {
    return replaceEqualDeep(prevData, data);
  }
  return data;
}
function addToEnd(items, item, max = 0) {
  const newItems = [...items, item];
  return max && newItems.length > max ? newItems.slice(-max) : newItems;
}
function addToStart(items, item, max = 0) {
  const newItems = [item, ...items];
  return max && newItems.length > max ? newItems.slice(0, max) : newItems;
}
const skipToken = Symbol();
function ensureQueryFn(options2, fetchOptions) {
  if (!options2.queryFn && fetchOptions?.initialPromise) return () => fetchOptions.initialPromise;
  if (!options2.queryFn || options2.queryFn === skipToken) return () => Promise.reject(/* @__PURE__ */ new Error(`Missing queryFn: '${options2.queryHash}'`));
  return options2.queryFn;
}
const fetchSignal = Symbol();
function addConsumeAwareSignal(object, getSignal, onCancelled, internalSignal) {
  let consumed = false;
  let signal;
  Object.defineProperties(object, {
    [fetchSignal]: { value: internalSignal },
    signal: {
      enumerable: true,
      get: () => {
        signal ??= getSignal();
        if (consumed) return signal;
        consumed = true;
        if (signal.aborted) onCancelled();
        else signal.addEventListener("abort", onCancelled, { once: true });
        return signal;
      }
    }
  });
  return object;
}
let isServerFn = () => isServer$1;
const isServer = () => isServerFn();
var Subscribable = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = this.subscribe.bind(this);
  }
  /**
  * Registers a listener to be called on every update this object notifies about. Returns a function
  * that removes the listener again — call it to stop listening. The base class never drops a listener
  * on its own, though some subclasses clear all of theirs in `destroy()`.
  * @param listener - Called on each update, with whatever the subclass passes to its subscribers.
  * @returns A function that removes the listener.
  * @example
  * ```ts
  * const unsubscribe = subscribable.subscribe(() => {
  *   // react to the update
  * })
  *
  * unsubscribe()
  * ```
  */
  subscribe(listener) {
    this.listeners.add(listener);
    this.onSubscribe();
    return () => {
      this.listeners.delete(listener);
      this.onUnsubscribe();
    };
  }
  /**
  * Returns `true` while at least one listener is registered, `false` once they have all unsubscribed.
  * @returns `true` if at least one listener is registered.
  */
  hasListeners() {
    return this.listeners.size > 0;
  }
  /**
  * Called after a listener is added. Does nothing here; subclasses override it, e.g. to start
  * tracking what they observe once the first listener subscribes.
  */
  onSubscribe() {
  }
  /**
  * Called after a listener is removed. Does nothing here; subclasses override it, e.g. to clean up
  * once the last listener unsubscribes.
  */
  onUnsubscribe() {
  }
};
var FocusManager = class extends Subscribable {
  #focused;
  #cleanup;
  #setup;
  constructor() {
    super();
    this.#setup = (onFocus) => {
      if (typeof window !== "undefined" && window.addEventListener) {
        const listener = () => onFocus();
        window.addEventListener("visibilitychange", listener, false);
        return () => {
          window.removeEventListener("visibilitychange", listener);
        };
      }
    };
  }
  onSubscribe() {
    if (!this.#cleanup) this.setEventListener(this.#setup);
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#cleanup?.();
      this.#cleanup = void 0;
    }
  }
  /**
  * `setEventListener` can be used to set a custom event listener that will
  * be used to determine the focus state. The provided `setup` function
  * receives a `setFocused` callback: call it with a `boolean` to manually
  * set the focus state, or with no arguments to re-evaluate the current
  * focus state and notify subscribers.
  * @param setup - Receives the `setFocused` callback, registers the event listener, and may return
  * a cleanup function that is called when the listener is replaced or no longer needed.
  * @example
  * ```ts
  * import { focusManager } from '@tanstack/query-core'
  *
  * focusManager.setEventListener((handleFocus) => {
  *   const listener = () => handleFocus()
  *   // Listen to visibilitychange
  *   if (typeof window !== 'undefined' && window.addEventListener) {
  *     window.addEventListener('visibilitychange', listener, false)
  *   }
  *
  *   return () => {
  *     // Be sure to unsubscribe if a new handler is set
  *     window.removeEventListener('visibilitychange', listener)
  *   }
  * })
  * ```
  */
  setEventListener(setup) {
    this.#setup = setup;
    this.#cleanup?.();
    this.#cleanup = setup((focused) => {
      if (typeof focused === "boolean") this.setFocused(focused);
      else this.onFocus();
    });
  }
  /**
  * `setFocused` can be used to manually set the focus state. Set `undefined`
  * to fall back to the default focus check.
  * @param focused - The focus state, or `undefined` to use the default focus check.
  * @example
  * ```ts
  * import { focusManager } from '@tanstack/query-core'
  *
  * // Set focused
  * focusManager.setFocused(true)
  *
  * // Set unfocused
  * focusManager.setFocused(false)
  *
  * // Fallback to the default focus check
  * focusManager.setFocused(undefined)
  * ```
  */
  setFocused(focused) {
    if (this.#focused !== focused) {
      this.#focused = focused;
      this.onFocus();
    }
  }
  /**
  * `onFocus` notifies all subscribed listeners with the current focus state.
  */
  onFocus() {
    const isFocused = this.isFocused();
    this.listeners.forEach((listener) => {
      listener(isFocused);
    });
  }
  /**
  * `isFocused` can be used to get the current focus state.
  * @returns The focus state set with `setFocused`, or otherwise whether the document is visible.
  */
  isFocused() {
    if (typeof this.#focused === "boolean") return this.#focused;
    return globalThis.document?.visibilityState !== "hidden";
  }
};
const focusManager = new FocusManager();
const defaultScheduler = systemSetTimeoutZero;
function createNotifyManager() {
  let queue = [];
  let transactions = 0;
  let notifyFn = (callback) => {
    callback();
  };
  let batchNotifyFn = (callback) => {
    callback();
  };
  let scheduleFn = defaultScheduler;
  const schedule = (callback) => {
    if (transactions) queue.push(callback);
    else scheduleFn(() => {
      notifyFn(callback);
    });
  };
  const flush = () => {
    const originalQueue = queue;
    queue = [];
    if (originalQueue.length) scheduleFn(() => {
      batchNotifyFn(() => {
        originalQueue.forEach((callback) => {
          notifyFn(callback);
        });
      });
    });
  };
  return {
    /**
    * Batches all updates scheduled inside the passed callback.
    * This is mainly used internally to optimize query client updating.
    * Batches can be nested; the queue is only flushed once the outermost `batch` call finishes.
    * The return value of `callback` is passed through.
    * @param callback - The function to run in the batch.
    * @returns The return value of `callback`.
    */
    batch: (callback) => {
      let result;
      transactions++;
      try {
        result = callback();
      } finally {
        transactions--;
        if (!transactions) flush();
      }
      return result;
    },
    /**
    * All calls to the wrapped function will be batched.
    * @param callback - The function to wrap.
    * @returns A function that schedules a call to `callback` with the given arguments.
    */
    batchCalls: (callback) => {
      return (...args) => {
        schedule(() => {
          callback(...args);
        });
      };
    },
    /**
    * Schedules a function to be run on the next batch.
    * By default, the batch is run with a `setTimeout`, but this can be configured via `setScheduler`.
    */
    schedule,
    /**
    * Use this method to set a custom notify function.
    * This can be used to for example wrap notifications with `React.act` while running tests.
    * @param fn - Receives each notification callback and must call it.
    */
    setNotifyFunction: (fn) => {
      notifyFn = fn;
    },
    /**
    * Use this method to set a custom function to batch notifications together into a single tick.
    * Framework adapters use this to plug in their own batching primitive, so that a single query
    * update only triggers one re-render instead of one per subscriber.
    * @param fn - Receives a function that runs a batch of notifications and must call it.
    * @example
    * ```ts
    * import { notifyManager } from '@tanstack/query-core'
    * import { batch } from 'solid-js'
    *
    * notifyManager.setBatchNotifyFunction(batch)
    * ```
    */
    setBatchNotifyFunction: (fn) => {
      batchNotifyFn = fn;
    },
    /**
    * Configures a custom callback that schedules when the next batch runs.
    * The default behavior is `setTimeout(callback, 0)`.
    * @param fn - Receives a callback that runs the next batch, and schedules it.
    * @example
    * ```ts
    * import { notifyManager } from '@tanstack/query-core'
    *
    * // Schedule batches in the next microtask
    * notifyManager.setScheduler(queueMicrotask)
    *
    * // Schedule batches before the next frame is rendered
    * notifyManager.setScheduler(requestAnimationFrame)
    *
    * // Schedule batches some time in the future
    * notifyManager.setScheduler((cb) => setTimeout(cb, 10))
    * ```
    */
    setScheduler: (fn) => {
      scheduleFn = fn;
    }
  };
}
const notifyManager = createNotifyManager();
var OnlineManager = class extends Subscribable {
  #online = true;
  #cleanup;
  #setup;
  constructor() {
    super();
    this.#setup = (onOnline) => {
      if (typeof window !== "undefined" && window.addEventListener) {
        const onlineListener = () => onOnline(true);
        const offlineListener = () => onOnline(false);
        window.addEventListener("online", onlineListener, false);
        window.addEventListener("offline", offlineListener, false);
        return () => {
          window.removeEventListener("online", onlineListener);
          window.removeEventListener("offline", offlineListener);
        };
      }
    };
  }
  onSubscribe() {
    if (!this.#cleanup) this.setEventListener(this.#setup);
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#cleanup?.();
      this.#cleanup = void 0;
    }
  }
  /**
  * `setEventListener` can be used to set a custom event listener that will
  * be used to determine the online state. The provided `setup` function
  * receives a `setOnline` callback that should be called with a `boolean`
  * whenever the online state changes.
  * @param setup - Receives the `setOnline` callback, registers the event listener, and may return
  * a cleanup function that is called when the listener is replaced or no longer needed.
  * @example
  * ```ts
  * import NetInfo from '@react-native-community/netinfo'
  * import { onlineManager } from '@tanstack/query-core'
  *
  * onlineManager.setEventListener((setOnline) => {
  *   return NetInfo.addEventListener((state) => {
  *     setOnline(!!state.isConnected)
  *   })
  * })
  * ```
  */
  setEventListener(setup) {
    this.#setup = setup;
    this.#cleanup?.();
    this.#cleanup = setup(this.setOnline.bind(this));
  }
  /**
  * `setOnline` can be used to manually set the online state.
  * @param online - The online state.
  * @example
  * ```ts
  * import { onlineManager } from '@tanstack/query-core'
  *
  * // Set to online
  * onlineManager.setOnline(true)
  *
  * // Set to offline
  * onlineManager.setOnline(false)
  * ```
  */
  setOnline(online) {
    if (this.#online !== online) {
      this.#online = online;
      this.listeners.forEach((listener) => {
        listener(online);
      });
    }
  }
  /**
  * `isOnline` can be used to get the current online state.
  * @returns `true` if online.
  */
  isOnline() {
    return this.#online;
  }
};
const onlineManager = new OnlineManager();
function defaultRetryDelay(failureCount) {
  return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
  return (networkMode ?? "online") === "online" ? onlineManager.isOnline() : true;
}
var CancelledError = class extends Error {
  constructor(options2) {
    super("CancelledError");
    this.revert = options2?.revert;
    this.silent = options2?.silent;
  }
};
function createRetryer(config) {
  let isRetryCancelled = false;
  let failureCount = 0;
  let continueFn;
  let status = "pending";
  let promiseResolve;
  let promiseReject;
  const promise = new Promise((resolve2, reject2) => {
    promiseResolve = resolve2;
    promiseReject = reject2;
  });
  promise.catch(noop);
  const isResolved = () => status !== "pending";
  const cancel = (cancelOptions) => {
    if (!isResolved()) {
      const error = new CancelledError(cancelOptions);
      reject(error);
      config.onCancel?.(error);
    }
  };
  const cancelRetry = () => {
    isRetryCancelled = true;
  };
  const continueRetry = () => {
    isRetryCancelled = false;
  };
  const canContinue = () => focusManager.isFocused() && (config.networkMode === "always" || onlineManager.isOnline()) && config.canRun();
  const canStart = () => canFetch(config.networkMode) && config.canRun();
  const resolve = (value) => {
    if (!isResolved()) {
      continueFn?.();
      status = "resolved";
      promiseResolve(value);
    }
  };
  const reject = (value) => {
    if (!isResolved()) {
      continueFn?.();
      status = "rejected";
      promiseReject(value);
    }
  };
  const pause = (canResume) => {
    return new Promise((continueResolve) => {
      continueFn = (value) => {
        if (isResolved() || canResume()) continueResolve(value);
      };
      config.onPause?.();
    }).then(() => {
      continueFn = void 0;
      if (!isResolved()) config.onContinue?.();
    });
  };
  const run = () => {
    if (isResolved()) return;
    let promiseOrValue;
    const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
    try {
      promiseOrValue = initialPromise ?? config.fn();
    } catch (error) {
      promiseOrValue = Promise.reject(error);
    }
    Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
      if (isResolved()) return;
      const retry = config.retry ?? (isServer() ? 0 : 3);
      const retryDelay = config.retryDelay ?? defaultRetryDelay;
      const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
      const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
      if (isRetryCancelled || !shouldRetry) {
        reject(error);
        return;
      }
      failureCount++;
      config.onFail?.(failureCount, error);
      sleep(delay).then(() => {
        return isResolved() || canContinue() ? void 0 : pause(canContinue);
      }).then(() => {
        if (isRetryCancelled) reject(error);
        else run();
      });
    });
  };
  return {
    promise,
    status: () => status,
    cancel,
    continue: () => {
      continueFn?.();
      return promise;
    },
    cancelRetry,
    continueRetry,
    canStart,
    start: () => {
      if (canStart()) run();
      else pause(canStart).then(run);
      return promise;
    }
  };
}
var Removable = class {
  #gcTimeout;
  /**
  * Clears the pending garbage collection timeout, so the entry is no longer scheduled for removal.
  * A subclass may override this to release what it holds on to as well — `Query` also cancels any
  * in-flight fetch.
  */
  destroy() {
    this.clearGcTimeout();
  }
  /**
  * Schedules the entry to be removed from its cache after `gcTime`, replacing any timeout scheduled
  * before. Nothing is scheduled if `gcTime` is `Infinity`.
  */
  scheduleGc() {
    this.clearGcTimeout();
    if (isValidTimeout(this.gcTime)) this.#gcTimeout = timeoutManager.setTimeout(() => {
      this.optionalRemove();
    }, this.gcTime);
  }
  /**
  * Updates `gcTime`, keeping the longest one seen so far. Without a value, it defaults to 5 minutes
  * on the client and `Infinity` on the server.
  * @param newGcTime - The `gcTime` from the latest options, if any.
  */
  updateGcTime(newGcTime) {
    this.gcTime = Math.max(this.gcTime || 0, newGcTime ?? (isServer() ? Infinity : 3e5));
  }
  /**
  * Cancels the scheduled removal, if there is one.
  */
  clearGcTimeout() {
    if (this.#gcTimeout !== void 0) {
      timeoutManager.clearTimeout(this.#gcTimeout);
      this.#gcTimeout = void 0;
    }
  }
};
function infiniteQueryBehavior(pages) {
  return { onFetch: (context, query) => {
    const options2 = context.options;
    const direction = context.fetchOptions?.meta?.fetchMore?.direction;
    const oldPages = context.state.data?.pages || [];
    const oldPageParams = context.state.data?.pageParams || [];
    let result = {
      pages: [],
      pageParams: []
    };
    let currentPage = 0;
    const fetchFn = async () => {
      let cancelled = false;
      const signalContext = context;
      const addSignalProperty = (object) => {
        addConsumeAwareSignal(object, () => context.signal, () => cancelled = true, signalContext[fetchSignal]);
      };
      const queryFn = ensureQueryFn(context.options, context.fetchOptions);
      const fetchPage = async (data, param, previous) => {
        if (cancelled) return Promise.reject(context.signal.reason);
        if (param == null && data.pages.length) return Promise.resolve(data);
        const createQueryFnContext = () => {
          const queryFnContext2 = {
            client: context.client,
            queryKey: context.queryKey,
            pageParam: param,
            direction: previous ? "backward" : "forward",
            meta: context.options.meta
          };
          addSignalProperty(queryFnContext2);
          return queryFnContext2;
        };
        const queryFnContext = createQueryFnContext();
        const page = await queryFn(queryFnContext);
        const { maxPages } = context.options;
        const addTo = previous ? addToStart : addToEnd;
        return {
          pages: addTo(data.pages, page, maxPages),
          pageParams: addTo(data.pageParams, param, maxPages)
        };
      };
      if (direction && oldPages.length) {
        const previous = direction === "backward";
        const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
        const oldData = {
          pages: oldPages,
          pageParams: oldPageParams
        };
        result = await fetchPage(oldData, pageParamFn(options2, oldData), previous);
      } else {
        const remainingPages = pages ?? oldPages.length;
        do {
          const param = currentPage === 0 ? oldPageParams[0] === void 0 ? options2.initialPageParam : oldPageParams[0] : getNextPageParam(options2, result);
          if (currentPage > 0 && param == null) break;
          result = await fetchPage(result, param);
          currentPage++;
        } while (currentPage < remainingPages);
      }
      return result;
    };
    if (context.options.persister) context.fetchFn = () => {
      return context.options.persister?.(fetchFn, {
        client: context.client,
        queryKey: context.queryKey,
        meta: context.options.meta,
        signal: context.signal
      }, query);
    };
    else context.fetchFn = fetchFn;
  } };
}
function getNextPageParam(options2, { pages, pageParams }) {
  const lastIndex = pages.length - 1;
  return pages.length > 0 ? options2.getNextPageParam(pages[lastIndex], pages, pageParams[lastIndex], pageParams) : void 0;
}
function getPreviousPageParam(options2, { pages, pageParams }) {
  return pages.length > 0 ? options2.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams) : void 0;
}
var Query = class extends Removable {
  #queryType;
  #initialState;
  #revertState;
  #cache;
  #client;
  #retryer;
  #fetchPromise;
  #defaultOptions;
  #abortSignalConsumed;
  constructor(config) {
    super();
    this.#abortSignalConsumed = false;
    this.#defaultOptions = config.defaultOptions;
    this.setOptions(config.options);
    this.observers = [];
    this.#client = config.client;
    this.#cache = this.#client.getQueryCache();
    this.queryKey = config.queryKey;
    this.queryHash = config.queryHash;
    this.#initialState = getDefaultState$1(this.options);
    this.state = config.state ?? this.#initialState;
    this.scheduleGc();
  }
  /**
  * The `meta` object passed in the query's options, if any.
  * @returns The query's `meta`, or `undefined` if none was set.
  */
  get meta() {
    return this.options.meta;
  }
  /**
  * `'infinite'` for an infinite query, otherwise `undefined`.
  * @internal
  * @returns The type of the query, set from the `_type` option (e.g. `'infinite'`).
  */
  get queryType() {
    return this.#queryType;
  }
  /**
  * The promise for the currently in-flight fetch, if the query is fetching.
  * `undefined` when the query is not fetching.
  * @returns The promise of the in-flight fetch, or `undefined`.
  */
  get promise() {
    return this.#retryer?.promise;
  }
  /**
  * Replaces the query's options and applies their `gcTime`. If the query has no data yet, it gets
  * the `initialData` from the new options, if any.
  * @internal
  * @param options - The new query options, merged on top of the query's default options.
  */
  setOptions(options2) {
    this.options = {
      ...this.#defaultOptions,
      ...options2
    };
    if (options2?._type) this.#queryType = options2._type;
    this.updateGcTime(this.options.gcTime);
    if (this.state && this.state.data === void 0) {
      const defaultState = getDefaultState$1(this.options);
      if (defaultState.data !== void 0) {
        this.setState(successState(defaultState.data, defaultState.dataUpdatedAt));
        this.#initialState = defaultState;
      }
    }
  }
  optionalRemove() {
    if (!this.observers.length && this.state.fetchStatus === "idle") this.#cache.remove(this);
  }
  /**
  * Writes new data to the query and marks it as successfully fetched.
  * @internal
  * @param newData - The data to write. Structural sharing with the current data is applied.
  * @param options - Set `updatedAt` to override the timestamp, and `manual` to mark the write as
  * manual (e.g. from `queryClient.setQueryData`).
  * @returns The data that was written.
  */
  setData(newData, options2) {
    const data = replaceData(this.state.data, newData, this.options);
    this.#dispatch({
      data,
      type: "success",
      dataUpdatedAt: options2?.updatedAt,
      manual: options2?.manual
    });
    return data;
  }
  /**
  * Merges the given partial state directly into this query's state, notifying observers. Used
  * by persistence and broadcast plugins to restore a state snapshot, and by devtools to let a
  * user manually trigger a loading/error state or edit the cached data.
  * @param state - The partial state to merge into the query's state.
  */
  setState(state) {
    this.#dispatch({
      type: "setState",
      state
    });
  }
  /**
  * Cancels the query's currently in-flight fetch, if any.
  * - Returns a promise that resolves once the cancellation has settled.
  * - If no fetch is in progress, resolves immediately.
  * @param options - Set `revert` to restore the state from before the fetch started, and `silent`
  * to suppress the cancellation error when a new fetch replaces the cancelled one.
  * @returns A promise that resolves once the cancellation has settled.
  * @example
  * ```ts
  * await query.cancel()
  * ```
  */
  cancel(options2) {
    const promise = this.#retryer?.promise;
    this.#retryer?.cancel(options2);
    return promise ? promise.then(noop).catch(noop) : Promise.resolve();
  }
  /**
  * Clears the query's garbage collection timeout and silently cancels any
  * in-flight fetch. Called by `QueryCache` when the query is removed from
  * the cache.
  * @see {@link Query#cancel}
  */
  destroy() {
    super.destroy();
    this.cancel({ silent: true });
  }
  /**
  * The state the query was created with.
  * @internal
  * @returns The state the query had when it was first created, used by {@link Query#reset}.
  */
  get resetState() {
    return this.#initialState;
  }
  /**
  * Resets the query back to its initial state (the state it had when it was
  * first created, e.g. any `initialData`), destroying it first to cancel any
  * in-flight fetch.
  */
  reset() {
    this.destroy();
    this.setState(this.resetState);
  }
  /**
  * Returns `true` if the query has at least one observer for which `enabled`
  * does not resolve to `false`.
  * @returns `true` if the query has an enabled observer.
  */
  isActive() {
    return this.observers.some((observer) => resolveQueryValue(observer.options.enabled, this) !== false);
  }
  /**
  * Returns `true` if the query is disabled, meaning it will not fetch
  * automatically.
  * - If the query has observers, it is disabled when none of them are active
  *   (see `isActive`).
  * - If the query has no observers, it is disabled when its `queryFn` is
  *   `skipToken` or it has never been fetched.
  * @returns `true` if the query is disabled.
  */
  isDisabled() {
    if (this.getObserversCount() > 0) return !this.isActive();
    return this.options.queryFn === skipToken || !this.isFetched();
  }
  /**
  * Returns `true` if the query has been fetched, i.e. it has resolved with
  * either data or an error at least once.
  * @returns `true` if the query has been fetched.
  */
  isFetched() {
    return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
  }
  /**
  * Returns `true` if the query has data and at least one observer configured with
  * `staleTime: 'static'`, meaning it is treated as never stale.
  * @returns `true` if the query is static.
  */
  isStatic() {
    if (this.state.data === void 0) return false;
    if (this.getObserversCount() > 0) return this.observers.some((observer) => resolveQueryValue(observer.options.staleTime, this) === "static");
    return false;
  }
  /**
  * Returns `true` if the query is stale.
  * - If the query has observers, defers to whether any observer's current
  *   result reports `isStale` (which accounts for each observer's own
  *   `staleTime` and `enabled` state).
  * - If the query has no observers, it is considered stale when it has no
  *   data or has been invalidated.
  * @returns `true` if the query is stale.
  * @see {@link Query#isStaleByTime}
  * @example
  * ```ts
  * if (query.isStale()) {
  *   // refetch or otherwise treat the cached data as outdated
  * }
  * ```
  */
  isStale() {
    if (this.getObserversCount() > 0) return this.observers.some((observer) => observer.getCurrentResult().isStale);
    return this.state.data === void 0 || this.state.isInvalidated;
  }
  /**
  * Returns `true` if the query's data is stale relative to the given
  * `staleTime` (defaults to `0`).
  * - A query with no data is always stale.
  * - `staleTime: 'static'` is never stale.
  * - An invalidated query is always stale.
  * - Otherwise, staleness is based on elapsed time since `dataUpdatedAt`.
  * @param staleTime - The time, in milliseconds, after which data is considered stale, or
  * `'static'` to never treat existing data as stale. A query without data is stale either way.
  * @returns `true` if the query's data is stale.
  * @see {@link Query#isStale}
  * @example
  * ```ts
  * const isStale = query.isStaleByTime(60 * 1000)
  * ```
  */
  isStaleByTime(staleTime = 0) {
    if (this.state.data === void 0) return true;
    if (staleTime === "static") return false;
    if (this.state.isInvalidated) return true;
    return !timeUntilStale(this.state.dataUpdatedAt, staleTime);
  }
  /**
  * Refetches the query when the window regains focus, if an observer wants that, and continues a
  * paused fetch.
  * @internal
  */
  onFocus() {
    this.observers.find((x2) => x2.shouldFetchOnWindowFocus())?.refetch({ cancelRefetch: false });
    this.#retryer?.continue();
  }
  /**
  * Refetches the query when the app reconnects, if an observer wants that, and continues a paused
  * fetch.
  * @internal
  */
  onOnline() {
    this.observers.find((x2) => x2.shouldFetchOnReconnect())?.refetch({ cancelRefetch: false });
    this.#retryer?.continue();
  }
  /**
  * Subscribes an observer to the query and stops its garbage collection.
  * @internal
  * @param observer - The observer to add. Adding an observer that is already subscribed does
  * nothing.
  */
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      this.clearGcTimeout();
      this.#cache.notify({
        type: "observerAdded",
        query: this,
        observer
      });
    }
  }
  /**
  * Unsubscribes an observer from the query.
  * @internal
  * @param observer - The observer to remove. When the last observer is removed, the in-flight
  * fetch is cancelled if its abort signal was consumed (otherwise only its retries are stopped),
  * and garbage collection is scheduled.
  */
  removeObserver(observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
      if (!this.observers.length) {
        if (this.#retryer) {
          if (this.#abortSignalConsumed || this.state.fetchStatus === "paused" && this.state.status === "pending") this.#retryer.cancel({ revert: true });
          else this.#retryer.cancelRetry();
        }
        this.scheduleGc();
      }
      this.#cache.notify({
        type: "observerRemoved",
        query: this,
        observer
      });
    }
  }
  /**
  * Returns the number of observers currently subscribed to this query.
  * @returns The number of observers.
  * @example
  * ```ts
  * if (query.getObserversCount() === 0) {
  *   // no component is currently watching this query
  * }
  * ```
  */
  getObserversCount() {
    return this.observers.length;
  }
  /**
  * Marks the query as invalidated, unless it is already invalidated. This
  * updates `state.isInvalidated` and notifies observers, but does not by
  * itself trigger a refetch.
  * @example
  * ```ts
  * query.invalidate()
  * ```
  */
  invalidate() {
    if (!this.state.isInvalidated) this.#dispatch({ type: "invalidate" });
  }
  /**
  * Fetches the query, i.e. runs its `queryFn` (through any configured
  * retryer/behavior) and updates the query's state with the result.
  * - If a fetch is already in flight, returns its promise instead of
  *   starting a new one, unless `fetchOptions.cancelRefetch` is set and the
  *   query already has data, in which case the current fetch is silently
  *   cancelled first.
  * - If `options` is passed, it replaces the query's current options
  *   before fetching.
  * @param options - Query options that replace the query's current options before fetching. They
  * are not applied when an in-flight fetch is reused.
  * @param fetchOptions - Set `cancelRefetch` to cancel an in-flight fetch first (only if the query
  * already has data), and `meta` to pass extra information to the query's behavior.
  * @returns A promise that resolves with the fetched data, or rejects with the fetch error. If the
  * fetch is cancelled with `revert` while the query has data, it resolves with the restored data
  * instead.
  */
  async fetch(options2, fetchOptions) {
    if (this.state.fetchStatus !== "idle" && this.#retryer?.status() !== "rejected") {
      if (this.state.data !== void 0 && fetchOptions?.cancelRefetch) this.cancel({ silent: true });
      else if (this.#retryer && this.#fetchPromise) {
        this.#retryer.continueRetry();
        return this.#fetchPromise;
      }
    }
    if (options2) this.setOptions(options2);
    if (!this.options.queryFn) {
      const observer = this.observers.find((x2) => x2.options.queryFn);
      if (observer) this.setOptions(observer.options);
    }
    const abortController = new AbortController();
    const addSignalProperty = (object) => {
      Object.defineProperties(object, {
        [fetchSignal]: {
          value: abortController.signal,
          enumerable: true
        },
        signal: {
          enumerable: true,
          get: () => {
            this.#abortSignalConsumed = true;
            return abortController.signal;
          }
        }
      });
    };
    const fetchFn = () => {
      const queryFn = ensureQueryFn(this.options, fetchOptions);
      const createQueryFnContext = () => {
        const queryFnContext2 = {
          client: this.#client,
          queryKey: this.queryKey,
          meta: this.meta
        };
        addSignalProperty(queryFnContext2);
        return queryFnContext2;
      };
      const queryFnContext = createQueryFnContext();
      this.#abortSignalConsumed = false;
      if (this.options.persister) return this.options.persister(queryFn, queryFnContext, this);
      return queryFn(queryFnContext);
    };
    const createFetchContext = () => {
      const context2 = {
        fetchOptions,
        options: this.options,
        queryKey: this.queryKey,
        client: this.#client,
        state: this.state,
        fetchFn
      };
      addSignalProperty(context2);
      return context2;
    };
    const context = createFetchContext();
    (this.#queryType === "infinite" ? infiniteQueryBehavior(this.options.pages) : this.options.behavior)?.onFetch(context, this);
    this.#revertState = this.state;
    if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) this.#dispatch({
      type: "fetch",
      meta: context.fetchOptions?.meta
    });
    const retryer = this.#retryer = createRetryer({
      initialPromise: fetchOptions?.initialPromise,
      fn: context.fetchFn,
      onCancel: (error) => {
        if (error instanceof CancelledError && error.revert) this.setState({
          ...this.#revertState,
          fetchStatus: "idle"
        });
        abortController.abort();
      },
      onFail: (failureCount, error) => {
        this.#dispatch({
          type: "failed",
          failureCount,
          error
        });
      },
      onPause: () => {
        this.#dispatch({ type: "pause" });
      },
      onContinue: () => {
        this.#dispatch({ type: "continue" });
      },
      retry: context.options.retry,
      retryDelay: context.options.retryDelay,
      networkMode: context.options.networkMode,
      canRun: () => true
    });
    const fetchPromise = (async () => {
      try {
        const data = await retryer.promise;
        if (data === void 0) {
          if (false) ;
          throw new Error(`${this.queryHash} data is undefined`);
        }
        this.setData(data);
        this.#cache.config.onSuccess?.(data, this);
        this.#cache.config.onSettled?.(data, this.state.error, this);
        return data;
      } catch (error) {
        if (error instanceof CancelledError) {
          if (error.silent) {
            if (this.#retryer !== retryer && this.#fetchPromise) return this.#fetchPromise;
            throw error;
          } else if (error.revert) {
            if (this.state.data === void 0) throw error;
            return this.state.data;
          }
        }
        this.#dispatch({
          type: "error",
          error
        });
        this.#cache.config.onError?.(error, this);
        this.#cache.config.onSettled?.(this.state.data, error, this);
        throw error;
      } finally {
        if (this.#retryer === retryer) {
          this.#retryer = void 0;
          this.#fetchPromise = void 0;
        }
        this.scheduleGc();
      }
    })();
    this.#fetchPromise = fetchPromise;
    retryer.start();
    return fetchPromise;
  }
  #dispatch(action) {
    const reducer = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            fetchFailureCount: action.failureCount,
            fetchFailureReason: action.error
          };
        case "pause":
          return {
            ...state,
            fetchStatus: "paused"
          };
        case "continue":
          return {
            ...state,
            fetchStatus: "fetching"
          };
        case "fetch":
          return {
            ...state,
            ...fetchState(state.data, this.options),
            fetchMeta: action.meta ?? null
          };
        case "success":
          const newState = {
            ...state,
            ...successState(action.data, action.dataUpdatedAt),
            dataUpdateCount: state.dataUpdateCount + 1,
            ...!action.manual && {
              fetchStatus: "idle",
              fetchFailureCount: 0,
              fetchFailureReason: null
            }
          };
          this.#revertState = action.manual ? newState : void 0;
          return newState;
        case "error":
          const error = action.error;
          return {
            ...state,
            error,
            errorUpdateCount: state.errorUpdateCount + 1,
            errorUpdatedAt: Date.now(),
            fetchFailureCount: state.fetchFailureCount + 1,
            fetchFailureReason: error,
            fetchStatus: "idle",
            status: "error",
            isInvalidated: true
          };
        case "invalidate":
          return {
            ...state,
            isInvalidated: true
          };
        case "setState":
          return {
            ...state,
            ...action.state
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.observers.slice().forEach((observer) => {
        observer.onQueryUpdate();
      });
      this.#cache.notify({
        query: this,
        type: "updated",
        action
      });
    });
  }
};
function fetchState(data, options2) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: canFetch(options2.networkMode) ? "fetching" : "paused",
    ...data === void 0 && {
      error: null,
      status: "pending"
    }
  };
}
function successState(data, dataUpdatedAt) {
  return {
    data,
    dataUpdatedAt: dataUpdatedAt ?? Date.now(),
    error: null,
    isInvalidated: false,
    status: "success"
  };
}
function getDefaultState$1(options2) {
  const data = typeof options2.initialData === "function" ? options2.initialData() : options2.initialData;
  const hasData = data !== void 0;
  const initialDataUpdatedAt = hasData ? typeof options2.initialDataUpdatedAt === "function" ? options2.initialDataUpdatedAt() : options2.initialDataUpdatedAt : 0;
  return {
    data,
    dataUpdateCount: 0,
    dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
    error: null,
    errorUpdateCount: 0,
    errorUpdatedAt: 0,
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchMeta: null,
    isInvalidated: false,
    status: hasData ? "success" : "pending",
    fetchStatus: "idle"
  };
}
var Mutation = class extends Removable {
  #client;
  #observers;
  #mutationCache;
  #retryer;
  constructor(config) {
    super();
    this.#client = config.client;
    this.mutationId = config.mutationId;
    this.#mutationCache = config.mutationCache;
    this.#observers = [];
    this.state = config.state || getDefaultState();
    this.setOptions(config.options);
    this.scheduleGc();
  }
  /**
  * Replaces the mutation's options and applies their `gcTime`.
  * @internal
  * @param options - The new mutation options.
  */
  setOptions(options2) {
    this.options = options2;
    this.updateGcTime(this.options.gcTime);
  }
  /**
  * The `meta` object passed in the mutation's options, if any.
  * @returns The mutation's `meta`, or `undefined` if none was set.
  */
  get meta() {
    return this.options.meta;
  }
  /**
  * Subscribes an observer to the mutation and stops its garbage collection.
  * @internal
  * @param observer - The observer to add. Adding an observer that is already subscribed does
  * nothing.
  */
  addObserver(observer) {
    if (!this.#observers.includes(observer)) {
      this.#observers.push(observer);
      this.clearGcTimeout();
      this.#mutationCache.notify({
        type: "observerAdded",
        mutation: this,
        observer
      });
    }
  }
  /**
  * Unsubscribes an observer from the mutation.
  * @internal
  * @param observer - The observer to remove. Garbage collection is scheduled afterwards.
  */
  removeObserver(observer) {
    this.#observers = this.#observers.filter((x2) => x2 !== observer);
    this.scheduleGc();
    this.#mutationCache.notify({
      type: "observerRemoved",
      mutation: this,
      observer
    });
  }
  optionalRemove() {
    if (!this.#observers.length) {
      if (this.state.status === "pending") this.scheduleGc();
      else this.#mutationCache.remove(this);
    }
  }
  /**
  * Resumes a mutation that is currently paused or was restored from a
  * dehydrated, still-`pending` state.
  *
  * - If this mutation has an active retryer (it paused mid-attempt, e.g. due
  *   to the network mode or scope-based queuing), its retryer is resumed.
  * - Otherwise, if the mutation's status is still `pending` (e.g. it was
  *   dehydrated while an attempt was in flight and never got a retryer in
  *   this instance), `execute` is called again with the last known variables.
  * - Otherwise the mutation has already settled and this resolves immediately
  *   without running anything again.
  * @returns A promise that settles with the resumed mutation: it rejects if the mutation fails.
  * It resolves immediately if the mutation has already settled.
  * @see {@link Mutation#execute}
  * @example
  * ```ts
  * // typically driven by reconnect handling, e.g. queryClient.resumePausedMutations()
  * const mutation = mutationCache.find({ mutationKey: ['addPost'] })
  * await mutation?.continue()
  * ```
  */
  continue() {
    return this.#retryer?.continue() ?? (this.state.status === "pending" ? this.execute(this.state.variables) : Promise.resolve());
  }
  /**
  * Runs the mutation function for the given variables through a retryer, and
  * drives the mutation's state and lifecycle callbacks through to settlement.
  *
  * If this mutation's state is already `pending` when `execute` is called
  * (i.e. it was restored, still in-flight, from a dehydrated state), the
  * `onMutate` step is skipped and a `continue` action is dispatched to
  * unpause it; otherwise a `pending` action is dispatched first, then the
  * mutation cache's `onMutate` and the mutation's own `onMutate` option are
  * awaited in that order, and the resulting context is stored.
  *
  * The mutation function is then run (subject to `retry`/`retryDelay`/
  * `networkMode`, and to the mutation cache's scope-based serialization).
  * On success, the cache's `onSuccess`/`onSettled` callbacks run before the
  * mutation's own `onSuccess`/`onSettled` options, a `success` action is
  * dispatched, and the resolved data is returned. On failure, the same
  * cache-then-option ordering is used for `onError`/`onSettled`, but each of
  * those four callbacks is individually caught so that a throwing callback
  * cannot mask the original error; an `error` action is then dispatched and
  * the original error is re-thrown.
  * @param variables - The variables passed to the `mutationFn`.
  * @returns A promise that resolves with the mutation's data, or rejects with its error.
  * @see {@link Mutation#continue}
  * @example
  * ```ts
  * // Called internally by `MutationObserver.mutate` and `Mutation.continue` —
  * // applications normally trigger mutations through those, not this method.
  * const data = await mutation.execute(variables)
  * ```
  */
  async execute(variables) {
    const onContinue = () => {
      this.#dispatch({ type: "continue" });
    };
    const mutationFnContext = {
      client: this.#client,
      meta: this.options.meta,
      mutationKey: this.options.mutationKey
    };
    const retryer = this.#retryer = createRetryer({
      fn: () => {
        if (!this.options.mutationFn) return Promise.reject(/* @__PURE__ */ new Error("No mutationFn found"));
        return this.options.mutationFn(variables, mutationFnContext);
      },
      onFail: (failureCount, error) => {
        this.#dispatch({
          type: "failed",
          failureCount,
          error
        });
      },
      onPause: () => {
        this.#dispatch({ type: "pause" });
      },
      onContinue,
      retry: this.options.retry ?? 0,
      retryDelay: this.options.retryDelay,
      networkMode: this.options.networkMode,
      canRun: () => this.#mutationCache.canRun(this)
    });
    const restored = this.state.status === "pending";
    const isPaused = !retryer.canStart();
    try {
      if (restored) onContinue();
      else {
        this.#dispatch({
          type: "pending",
          variables,
          isPaused
        });
        if (this.#mutationCache.config.onMutate) await this.#mutationCache.config.onMutate(variables, this, mutationFnContext);
        const context = await this.options.onMutate?.(variables, mutationFnContext);
        if (context !== this.state.context) this.#dispatch({
          type: "pending",
          context,
          variables,
          isPaused
        });
      }
      if (this.state.isPaused && retryer.canStart()) onContinue();
      const data = await retryer.start();
      await this.#mutationCache.config.onSuccess?.(data, variables, this.state.context, this, mutationFnContext);
      await this.options.onSuccess?.(data, variables, this.state.context, mutationFnContext);
      await this.#mutationCache.config.onSettled?.(data, null, this.state.variables, this.state.context, this, mutationFnContext);
      await this.options.onSettled?.(data, null, variables, this.state.context, mutationFnContext);
      this.#dispatch({
        type: "success",
        data
      });
      return data;
    } catch (error) {
      try {
        await this.#mutationCache.config.onError?.(error, variables, this.state.context, this, mutationFnContext);
      } catch (e) {
        Promise.reject(e);
      }
      try {
        await this.options.onError?.(error, variables, this.state.context, mutationFnContext);
      } catch (e) {
        Promise.reject(e);
      }
      try {
        await this.#mutationCache.config.onSettled?.(void 0, error, this.state.variables, this.state.context, this, mutationFnContext);
      } catch (e) {
        Promise.reject(e);
      }
      try {
        await this.options.onSettled?.(void 0, error, variables, this.state.context, mutationFnContext);
      } catch (e) {
        Promise.reject(e);
      }
      this.#dispatch({
        type: "error",
        error
      });
      throw error;
    } finally {
      if (this.#retryer === retryer) this.#retryer = void 0;
      this.#mutationCache.runNext(this);
    }
  }
  #dispatch(action) {
    const reducer = (state) => {
      switch (action.type) {
        case "failed":
          return {
            ...state,
            failureCount: action.failureCount,
            failureReason: action.error
          };
        case "pause":
          return {
            ...state,
            isPaused: true
          };
        case "continue":
          return {
            ...state,
            isPaused: false
          };
        case "pending":
          return {
            ...state,
            context: action.context,
            data: void 0,
            failureCount: 0,
            failureReason: null,
            error: null,
            isPaused: action.isPaused,
            status: "pending",
            variables: action.variables,
            submittedAt: Date.now()
          };
        case "success":
          return {
            ...state,
            data: action.data,
            failureCount: 0,
            failureReason: null,
            error: null,
            status: "success",
            isPaused: false
          };
        case "error":
          return {
            ...state,
            data: void 0,
            error: action.error,
            failureCount: state.failureCount + 1,
            failureReason: action.error,
            isPaused: false,
            status: "error"
          };
      }
    };
    this.state = reducer(this.state);
    notifyManager.batch(() => {
      this.#observers.forEach((observer) => {
        observer.onMutationUpdate(action);
      });
      this.#mutationCache.notify({
        mutation: this,
        type: "updated",
        action
      });
    });
  }
};
function getDefaultState() {
  return {
    context: void 0,
    data: void 0,
    error: null,
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    status: "idle",
    variables: void 0,
    submittedAt: 0
  };
}
var MutationCache = class extends Subscribable {
  #mutations;
  #scopes;
  #mutationId;
  constructor(config = {}) {
    super();
    this.config = config;
    this.#mutations = /* @__PURE__ */ new Set();
    this.#scopes = /* @__PURE__ */ new Map();
    this.#mutationId = 0;
  }
  /**
  * Creates a mutation and adds it to the cache.
  * @internal
  * @param client - The client the mutation belongs to, used to default its options.
  * @param options - The mutation options. They are defaulted with {@link
  * QueryClient#defaultMutationOptions}.
  * @param state - The initial state of the mutation, e.g. when restoring a dehydrated mutation.
  * @returns The new mutation, already added to the cache.
  */
  build(client, options2, state) {
    const mutation = new Mutation({
      client,
      mutationCache: this,
      mutationId: ++this.#mutationId,
      options: client.defaultMutationOptions(options2),
      state
    });
    this.add(mutation);
    return mutation;
  }
  /**
  * Adds a mutation to the cache.
  * @internal
  * @param mutation - The mutation to add. If it has a `scope`, it is queued in that scope.
  */
  add(mutation) {
    this.#mutations.add(mutation);
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const scopedMutations = this.#scopes.get(scope);
      if (scopedMutations) scopedMutations.push(mutation);
      else this.#scopes.set(scope, [mutation]);
    }
    this.notify({
      type: "added",
      mutation
    });
  }
  /**
  * Removes a mutation from the cache.
  * @internal
  * @param mutation - The mutation to remove, also from its scope's queue.
  */
  remove(mutation) {
    if (this.#mutations.delete(mutation)) {
      const scope = scopeFor(mutation);
      if (typeof scope === "string") {
        const scopedMutations = this.#scopes.get(scope);
        if (scopedMutations) {
          if (scopedMutations.length > 1) {
            const index = scopedMutations.indexOf(mutation);
            if (index !== -1) scopedMutations.splice(index, 1);
          } else if (scopedMutations[0] === mutation) this.#scopes.delete(scope);
        }
      }
    }
    this.notify({
      type: "removed",
      mutation
    });
  }
  /**
  * Checks whether a mutation can run now, given the other mutations in its `scope`.
  * @internal
  * @param mutation - The mutation to check.
  * @returns `true` if the mutation has no `scope`, or no other mutation in its scope is pending
  * ahead of it.
  */
  canRun(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const firstPendingMutation = this.#scopes.get(scope)?.find((m2) => m2.state.status === "pending");
      return !firstPendingMutation || firstPendingMutation === mutation;
    } else return true;
  }
  /**
  * Continues the next paused mutation in the same `scope` after a mutation finishes.
  * @internal
  * @param mutation - The mutation that finished.
  * @returns A promise that resolves once the next paused mutation in the same scope has continued,
  * or immediately if there is none.
  */
  runNext(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") return this.#scopes.get(scope)?.find((m2) => m2 !== mutation && m2.state.isPaused)?.continue() ?? Promise.resolve();
    else return Promise.resolve();
  }
  /**
  * Removes all mutations from the cache.
  * @example
  * ```ts
  * const mutationCache = queryClient.getMutationCache()
  *
  * mutationCache.clear()
  * ```
  */
  clear() {
    notifyManager.batch(() => {
      const mutations = this.getAll();
      this.#mutations.clear();
      this.#scopes.clear();
      mutations.forEach((mutation) => {
        this.notify({
          type: "removed",
          mutation
        });
      });
    });
  }
  /**
  * Returns all mutations within the cache.
  *
  * This is not typically needed for most applications, but can come in handy when needing more
  * information about a mutation in rare scenarios.
  * @returns Every mutation in the cache.
  * @example
  * ```ts
  * const mutationCache = queryClient.getMutationCache()
  *
  * const mutations = mutationCache.getAll()
  * ```
  */
  getAll() {
    return Array.from(this.#mutations);
  }
  /**
  * A slightly more advanced method that can be used to get an existing mutation instance from
  * the cache. If the mutation does not exist, `undefined` is returned.
  *
  * This is not typically needed for most applications, but can come in handy when needing more
  * information about a mutation in rare scenarios.
  * @param filters - The filters to match. `exact` defaults to `true`.
  * @returns The first matching mutation, or `undefined`.
  * @see {@link MutationCache#findAll}
  * @example
  * ```ts
  * const mutationCache = queryClient.getMutationCache()
  *
  * const mutation = mutationCache.find({ mutationKey: ['addPost'] })
  * ```
  */
  find(filters) {
    const defaultedFilters = {
      exact: true,
      ...filters
    };
    return this.getAll().find((mutation) => matchMutation(defaultedFilters, mutation));
  }
  /**
  * An even more advanced method that can be used to get existing mutation instances from the
  * cache that match the given filters. If no mutations match, an empty array is returned.
  *
  * This is not typically needed for most applications, but can come in handy when needing more
  * information about mutations in rare scenarios.
  * @param filters - The filters to match. Without filters, every mutation is returned.
  * @returns The matching mutations.
  * @see {@link MutationCache#find}
  * @example
  * ```ts
  * const mutationCache = queryClient.getMutationCache()
  *
  * const mutations = mutationCache.findAll({ mutationKey: ['addPost'] })
  * ```
  */
  findAll(filters = {}) {
    return this.getAll().filter((mutation) => matchMutation(filters, mutation));
  }
  /**
  * Notifies every cache listener of an event, in one batch.
  * @internal
  * @param event - The event passed to every listener.
  */
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  /**
  * Continues every paused mutation, e.g. when the app comes back online.
  * @internal
  * @returns A promise that resolves once every paused mutation has continued and settled.
  */
  resumePausedMutations() {
    const pausedMutations = this.getAll().filter((x2) => x2.state.isPaused);
    return notifyManager.batch(() => Promise.all(pausedMutations.map((mutation) => mutation.continue().catch(noop))));
  }
};
function scopeFor(mutation) {
  return mutation.options.scope?.id;
}
var QueryCache = class extends Subscribable {
  #queries;
  constructor(config = {}) {
    super();
    this.config = config;
    this.#queries = /* @__PURE__ */ new Map();
  }
  /**
  * Returns the existing `Query` instance for the given options' `queryKey`/`queryHash`, or
  * builds and adds a new one to the cache if none exists yet. Used by framework adapters and
  * plugins (e.g. broadcast/persistence) that need to get-or-create a `Query` directly, bypassing
  * the reactive `QueryObserver` machinery.
  * @param client - The client the query belongs to, used to default its options.
  * @param options - The query options, including the `queryKey`. A new query is created with the
  * options defaulted by {@link QueryClient#defaultQueryOptions}.
  * @param state - The initial state of a newly created query, e.g. when hydrating. Ignored if the
  * query already exists.
  * @returns The existing or newly created query.
  * @example
  * ```ts
  * const queryCache = queryClient.getQueryCache()
  *
  * const query = queryCache.build(queryClient, {
  *   queryKey: ['posts'],
  *   queryFn: fetchPosts,
  * })
  * ```
  */
  build(client, options2, state) {
    const queryKey = options2.queryKey;
    const queryHash = options2.queryHash ?? hashQueryKeyByOptions(queryKey, options2);
    let query = this.get(queryHash);
    if (!query) {
      query = new Query({
        client,
        queryKey,
        queryHash,
        options: client.defaultQueryOptions(options2),
        state,
        defaultOptions: client.getQueryDefaults(queryKey)
      });
      this.add(query);
    }
    return query;
  }
  /**
  * Adds a query to the cache.
  * @internal
  * @param query - The query to add. If a query with the same hash is already cached, nothing
  * happens.
  */
  add(query) {
    if (!this.#queries.has(query.queryHash)) {
      this.#queries.set(query.queryHash, query);
      this.notify({
        type: "added",
        query
      });
    }
  }
  /**
  * Destroys the given `Query` and removes it from the cache, notifying subscribers with a
  * `'removed'` event. A no-op if the query is no longer the one currently stored under its hash
  * (e.g. it was already replaced). Used by plugins (e.g. the broadcast client) that mirror
  * removals across `QueryCache` instances.
  * @param query - The query to remove.
  * @example
  * ```ts
  * const queryCache = queryClient.getQueryCache()
  * const query = queryCache.find({ queryKey: ['posts'] })
  *
  * if (query) {
  *   queryCache.remove(query)
  * }
  * ```
  */
  remove(query) {
    if (this.#queries.get(query.queryHash) === query) {
      query.destroy();
      this.#queries.delete(query.queryHash);
      this.notify({
        type: "removed",
        query
      });
    }
  }
  /**
  * Removes all queries from the cache.
  * @example
  * ```ts
  * const queryCache = queryClient.getQueryCache()
  *
  * queryCache.clear()
  * ```
  */
  clear() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        this.remove(query);
      });
    });
  }
  /**
  * Returns the `Query` instance stored under the given `queryHash`, or `undefined` if none
  * exists. Unlike {@link QueryCache#find}, this looks up by the already-computed hash rather
  * than by `QueryFilters`. Used by plugins (e.g. broadcast/hydration) that already have a hash
  * to look up directly.
  * @param queryHash - The hash of the query to look up.
  * @returns The query stored under the hash, or `undefined`.
  * @example
  * ```ts
  * const queryCache = queryClient.getQueryCache()
  * const queryHash = hashKey(['posts'])
  *
  * const query = queryCache.get(queryHash)
  * ```
  */
  get(queryHash) {
    return this.#queries.get(queryHash);
  }
  /**
  * Returns all queries within the cache.
  * @returns Every query in the cache.
  * @example
  * ```ts
  * const queryCache = queryClient.getQueryCache()
  *
  * const queries = queryCache.getAll()
  * ```
  */
  getAll() {
    return [...this.#queries.values()];
  }
  /**
  * A slightly more advanced method that can be used to get an existing query instance from the
  * cache. This instance not only contains all the state for the query, but all of the instances,
  * and underlying guts of the query as well. If the query does not exist, `undefined` is
  * returned.
  *
  * This is not typically needed for most applications, but can come in handy when needing more
  * information about a query in rare scenarios (e.g. looking at `query.state.dataUpdatedAt` to
  * decide whether a query is fresh enough to be used as an initial value).
  * @param filters - The filters to match, including the required `queryKey`. `exact` defaults to
  * `true`.
  * @returns The first matching query, or `undefined`.
  * @see {@link QueryCache#findAll}
  * @example
  * ```ts
  * const queryCache = queryClient.getQueryCache()
  *
  * const query = queryCache.find({ queryKey: ['posts'] })
  * ```
  */
  find(filters) {
    const defaultedFilters = {
      exact: true,
      ...filters
    };
    return this.getAll().find((query) => matchQuery(defaultedFilters, query));
  }
  /**
  * An even more advanced method that can be used to get existing query instances from the cache
  * that partially match a query key. If no queries match, an empty array is returned.
  *
  * This is not typically needed for most applications, but can come in handy when needing more
  * information about queries in rare scenarios.
  * @param filters - The filters to match. Without filters, every query is returned.
  * @returns The matching queries.
  * @see {@link QueryCache#find}
  * @example
  * ```ts
  * const queryCache = queryClient.getQueryCache()
  *
  * const queries = queryCache.findAll({ queryKey: ['posts'] })
  * ```
  */
  findAll(filters = {}) {
    const queries = this.getAll();
    return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
  }
  /**
  * Notifies every cache listener of an event, in one batch.
  * @internal
  * @param event - The event passed to every listener.
  */
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  /**
  * Calls {@link Query#onFocus} on every cached query, in one batch.
  * @internal
  */
  onFocus() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onFocus();
      });
    });
  }
  /**
  * Calls {@link Query#onOnline} on every cached query, in one batch.
  * @internal
  */
  onOnline() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onOnline();
      });
    });
  }
};
var QueryClient = class {
  #queryCache;
  #mutationCache;
  #defaultOptions;
  #queryDefaults;
  #mutationDefaults;
  #mountCount;
  #unsubscribeFocus;
  #unsubscribeOnline;
  constructor(config = {}) {
    this.#queryCache = config.queryCache || new QueryCache();
    this.#mutationCache = config.mutationCache || new MutationCache();
    this.#defaultOptions = config.defaultOptions || {};
    this.#queryDefaults = /* @__PURE__ */ new Map();
    this.#mutationDefaults = /* @__PURE__ */ new Map();
    this.#mountCount = 0;
  }
  /**
  * Called by a framework adapter's `QueryClientProvider`-equivalent when it mounts, to start
  * listening for focus/online events and resume paused mutations. Ref-counted via an internal
  * mount count, so nested or multiple providers sharing the same `QueryClient` don't tear down
  * the shared listeners until the last one unmounts.
  */
  mount() {
    this.#mountCount++;
    if (this.#mountCount !== 1) return;
    this.#unsubscribeFocus = focusManager.subscribe(async (focused) => {
      if (focused) {
        await this.resumePausedMutations();
        this.#queryCache.onFocus();
      }
    });
    this.#unsubscribeOnline = onlineManager.subscribe(async (online) => {
      if (online) {
        await this.resumePausedMutations();
        this.#queryCache.onOnline();
      }
    });
  }
  /**
  * The inverse of {@link QueryClient#mount} — called by a framework adapter's
  * `QueryClientProvider`-equivalent when it unmounts. Only tears down the focus/online
  * listeners once the mount count returns to `0`.
  */
  unmount() {
    this.#mountCount--;
    if (this.#mountCount !== 0) return;
    this.#unsubscribeFocus?.();
    this.#unsubscribeFocus = void 0;
    this.#unsubscribeOnline?.();
    this.#unsubscribeOnline = void 0;
  }
  /**
  * Returns the number of queries in the cache that are currently fetching, optionally
  * matching a set of filters. This includes background-fetching, loading new pages, and
  * loading more infinite query results.
  * @param filters - Narrows down which fetching queries are counted. Without filters, every
  * fetching query is counted.
  * @returns The number of matching queries whose `fetchStatus` is `'fetching'`.
  * @example
  * ```ts
  * if (queryClient.isFetching()) {
  *   console.log('At least one query is fetching!')
  * }
  * ```
  */
  isFetching(filters) {
    return this.#queryCache.findAll({
      ...filters,
      fetchStatus: "fetching"
    }).length;
  }
  /**
  * Returns the number of mutations in the cache that are currently pending, optionally
  * matching a set of filters.
  * @param filters - Narrows down which pending mutations are counted. Without filters, every
  * pending mutation is counted.
  * @returns The number of matching mutations whose `status` is `'pending'`.
  * @example
  * ```ts
  * if (queryClient.isMutating()) {
  *   console.log('At least one mutation is pending!')
  * }
  * ```
  */
  isMutating(filters) {
    return this.#mutationCache.findAll({
      ...filters,
      status: "pending"
    }).length;
  }
  /**
  * Imperative (non-reactive) way to retrieve data for a QueryKey.
  * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
  *
  * Hint: Do not use this function inside a component, because it won't receive updates.
  * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
  * @param queryKey - The query key of the query to read.
  * @returns The cached data for the query, or `undefined` if no query with this key has been observed yet.
  * @see {@link QueryClient#getQueriesData}
  */
  getQueryData(queryKey) {
    const options2 = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(options2.queryHash)?.state.data;
  }
  /**
  * Returns the cached data of a query, or fetches it if there is none. With `revalidateIfStale`,
  * stale cached data is also refetched in the background.
  * @param options - The query options. If the query has no cached data yet, it is fetched with
  * these options.
  * @returns A promise that resolves to the cached data, or to the fetched data if nothing was
  * cached yet.
  * @deprecated Use queryClient.query({ ...options, staleTime: 'static' }) instead. This method will be removed in the next major version.
  */
  ensureQueryData(options2) {
    const defaultedOptions = this.defaultQueryOptions(options2);
    const query = this.#queryCache.build(this, defaultedOptions);
    const cachedData = query.state.data;
    if (cachedData === void 0) return this.fetchQuery(options2);
    if (options2.revalidateIfStale && query.isStaleByTime(resolveQueryValue(defaultedOptions.staleTime, query))) this.prefetchQuery(defaultedOptions);
    return Promise.resolve(cachedData);
  }
  /**
  * Imperative (non-reactive) way to retrieve the cached data of multiple queries at once.
  * Only queries matching the given filters are returned; if none match, an empty array is
  * returned.
  *
  * Because the matched queries can hold data of different shapes (e.g. a broad filter can match
  * queries with unrelated data types), the `TQueryFnData` generic defaults to `unknown` rather
  * than being inferred. Passing a more specific type is a convenience for call sites that know
  * every matched query holds the same shape — it is not checked against the actual cache
  * contents.
  * @param filters - The filters that select which queries to read.
  * @returns An array of query key and data pairs. The data is `undefined` for a query with no cached data.
  * @see {@link QueryClient#getQueryData}
  * @example
  * ```ts
  * const data = queryClient.getQueriesData({ queryKey: ['posts'] })
  * ```
  */
  getQueriesData(filters) {
    return this.#queryCache.findAll(filters).map(({ queryKey, state }) => {
      return [queryKey, state.data];
    });
  }
  /**
  * Synchronous way to immediately update a query's cached data. If the updater (or the value
  * passed) resolves to `undefined`, the cache is left untouched and no query is created;
  * otherwise, if the query does not exist yet, it will be created. To update multiple queries
  * at once by partially matching query keys, use {@link QueryClient#setQueriesData} instead.
  *
  * Updates must be performed immutably: do not mutate `oldData`, or data previously retrieved
  * via {@link QueryClient#getQueryData}, in place.
  * @param queryKey - The query key to set data for.
  * @param updater - Either the new data, or a function that receives the current data (which
  * may be `undefined`) and returns the new data.
  * @param options - Set `updatedAt` to override the timestamp the written data is recorded with.
  * @returns The data that was written, or `undefined` if the updater returned `undefined` — in that case
  * the write is skipped and the cache is left unchanged.
  * @example
  * ```ts
  * queryClient.setQueryData(['posts'], newPosts)
  *
  * // Or, using an updater function that receives the current data:
  * queryClient.setQueryData(['posts'], (oldPosts) => [...oldPosts, newPost])
  * ```
  */
  setQueryData(queryKey, updater, options2) {
    const defaultedOptions = this.defaultQueryOptions({ queryKey });
    const prevData = this.#queryCache.get(defaultedOptions.queryHash)?.state.data;
    const data = functionalUpdate(updater, prevData);
    if (data === void 0) return;
    return this.#queryCache.build(this, defaultedOptions).setData(data, {
      ...options2,
      manual: true
    });
  }
  /**
  * Synchronous way to immediately update the cached data of multiple queries at once, using
  * filters or partial query key matching. Only queries that already exist and match the given
  * filters are updated; no new cache entries are created. Internally this calls
  * {@link QueryClient#setQueryData} for each matching query.
  * @param filters - The filters that select which existing queries to update.
  * @param updater - Either the new data, or a function that receives each matched query's current
  * data (which may be `undefined`) and returns the new data.
  * @param options - Set `updatedAt` to override the timestamp the written data is recorded with.
  * @returns One `[queryKey, data]` tuple per matched query, in the same shape and with the same
  * `undefined` case as {@link QueryClient#setQueryData}.
  * @example
  * ```ts
  * queryClient.setQueriesData({ queryKey: ['posts'] }, (oldPosts) =>
  *   oldPosts ? oldPosts.filter((post) => post.id !== deletedId) : oldPosts,
  * )
  * ```
  */
  setQueriesData(filters, updater, options2) {
    return notifyManager.batch(() => this.#queryCache.findAll(filters).map(({ queryKey }) => [queryKey, this.setQueryData(queryKey, updater, options2)]));
  }
  /**
  * Imperative (non-reactive) way to retrieve an existing query's state. If the query does not
  * exist, `undefined` is returned.
  * @param queryKey - The query key of the query to read.
  * @returns The query's state, or `undefined` if no query with this key exists.
  * @example
  * ```ts
  * const state = queryClient.getQueryState(['posts'])
  * console.log(state?.dataUpdatedAt)
  * ```
  */
  getQueryState(queryKey) {
    const options2 = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(options2.queryHash)?.state;
  }
  /**
  * Removes queries from the cache that match the given filters. Unlike
  * {@link QueryClient#invalidateQueries} or {@link QueryClient#refetchQueries}, this removes
  * matching queries from the cache instead of refetching them. Without filters, every query in
  * the cache is removed.
  * @param filters - The filters that select which queries to remove. Without filters, every query
  * is removed.
  * @example
  * ```ts
  * queryClient.removeQueries({ queryKey: ['posts'], exact: true })
  * ```
  */
  removeQueries(filters) {
    const queryCache = this.#queryCache;
    notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        queryCache.remove(query);
      });
    });
  }
  /**
  * Resets queries matching the given filters back to their initial state (e.g. any
  * `initialData`), notifying subscribers rather than removing them. Active queries among the
  * matched set are then refetched, and the returned promise resolves once that refetch settles.
  * @param filters - The filters that select which queries to reset. Without filters, every query
  * is reset.
  * @param options - Passed to the refetch of the active matched queries, e.g. `cancelRefetch` and
  * `throwOnError`.
  * @returns A promise that resolves once the refetch of the active matched queries settles.
  * @example
  * ```ts
  * await queryClient.resetQueries({ queryKey: ['posts'], exact: true })
  * ```
  */
  resetQueries(filters, options2) {
    const queryCache = this.#queryCache;
    return notifyManager.batch(() => {
      const matched = queryCache.findAll(filters);
      const queriesToRefetch = new Set(matched);
      matched.forEach((query) => {
        query.reset();
      });
      return this.refetchQueries({
        type: "active",
        predicate: (query) => queriesToRefetch.has(query)
      }, options2);
    });
  }
  /**
  * Cancels outgoing fetches for queries matching the given filters. Most useful when performing
  * optimistic updates, since any outgoing refetch that resolves afterwards would otherwise
  * overwrite the optimistic update. By default (`revert: true`), a cancelled query's data is
  * reverted to its state before the outgoing fetch started.
  *
  * The returned promise never rejects, even if individual cancellations fail.
  * @param filters - The filters that select which queries to cancel. Without filters, every query
  * is cancelled.
  * @param cancelOptions - Passed to each matched query's cancellation. `revert` defaults to
  * `true`.
  * @returns A promise that resolves once every cancellation has settled.
  * @example
  * ```ts
  * await queryClient.cancelQueries({ queryKey: ['posts'], exact: true })
  * ```
  */
  cancelQueries(filters, cancelOptions = {}) {
    const defaultedCancelOptions = {
      revert: true,
      ...cancelOptions
    };
    const promises = notifyManager.batch(() => this.#queryCache.findAll(filters).map((query) => query.cancel(defaultedCancelOptions)));
    return Promise.all(promises).then(noop).catch(noop);
  }
  /**
  * Marks queries matching the given filters as invalidated. Unlike
  * {@link QueryClient#removeQueries}, invalidated queries stay in the cache.
  *
  * Unless `filters.refetchType` is `'none'`, matching queries are then refetched via
  * {@link QueryClient#refetchQueries}, using `filters.refetchType` if set, otherwise
  * `filters.type`, otherwise `'active'`.
  * @param filters - The filters that select which queries to invalidate, plus `refetchType` to
  * control which of them to refetch afterwards. Without filters, every query is invalidated.
  * @param options - Passed to {@link QueryClient#refetchQueries}, e.g. `cancelRefetch` and
  * `throwOnError`.
  * @returns A promise that resolves once the refetch settles, or immediately if `refetchType` is
  * `'none'`.
  * @example
  * ```ts
  * await queryClient.invalidateQueries({ queryKey: ['posts'], refetchType: 'active' })
  * ```
  */
  invalidateQueries(filters, options2 = {}) {
    return notifyManager.batch(() => {
      this.#queryCache.findAll(filters).forEach((query) => {
        query.invalidate();
      });
      if (filters?.refetchType === "none") return Promise.resolve();
      return this.refetchQueries({
        ...filters,
        type: filters?.refetchType ?? filters?.type ?? "active"
      }, options2);
    });
  }
  /**
  * Refetches queries matching the given filters, regardless of whether they are stale. Without
  * filters, every query in the cache is refetched. Queries that are disabled, or static (only
  * have observers with a static `staleTime`), are never refetched.
  *
  * By default (`cancelRefetch: true`), a currently running fetch is cancelled before the new
  * one starts. The returned promise does not reject on individual query failures unless
  * `throwOnError` is `true`.
  *
  * Initially paused fetches do not delay the returned promise. Their later errors are handled
  * even when `throwOnError` is `true`.
  * @param filters - The filters that select which queries to refetch. Without filters, every query
  * in the cache is included.
  * @param options - Set `cancelRefetch` to `false` to keep a running fetch instead of cancelling
  * it, and `throwOnError` to `true` to reject when a refetch that was not initially paused fails.
  * @returns A promise that resolves once all matching refetches that were not initially paused
  * have settled.
  * @example
  * ```ts
  * // refetch all active queries partially matching a query key:
  * await queryClient.refetchQueries({ queryKey: ['posts'], type: 'active' })
  * ```
  */
  refetchQueries(filters, options2 = {}) {
    const fetchOptions = {
      ...options2,
      cancelRefetch: options2.cancelRefetch ?? true
    };
    const promises = notifyManager.batch(() => this.#queryCache.findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
      let promise = query.fetch(void 0, fetchOptions);
      const isPaused = query.state.fetchStatus === "paused";
      if (!fetchOptions.throwOnError || isPaused) promise = promise.catch(noop);
      return isPaused ? Promise.resolve() : promise;
    }));
    return Promise.all(promises).then(noop);
  }
  /**
  * Asynchronous method to fetch and cache a query, resolving with the data or throwing with
  * the error.
  *
  * If the query already exists in the cache and its data is not stale (per the given
  * `staleTime`), the cached data is returned without fetching. Otherwise, the query is fetched
  * and the promise resolves once the fetch settles. If a `select` function is provided, it is
  * applied to the data in both cases (cached or freshly fetched) before it is returned.
  *
  * Unlike a reactive observer, retries are disabled by default here (`retry: false`) unless
  * explicitly configured, since there is no component to catch a thrown error and retry through
  * re-render.
  *
  * The accepted options are `QueryObserverOptions` minus the fields that only make sense for a
  * reactive observer — `enabled`, `refetchInterval`, `refetchIntervalInBackground`,
  * `refetchOnWindowFocus`, `refetchOnReconnect`, `refetchOnMount`, `retryOnMount`,
  * `notifyOnChangeProps`, `throwOnError`, `suspense`, and `placeholderData` are not part of this
  * method's options.
  *
  * This method replaces the deprecated `fetchQuery`, and — combined with
  * `{ staleTime: 'static' }` — the deprecated `ensureQueryData`.
  * @param options - The query options, including the `queryKey` and the `queryFn` used if the
  * query needs to fetch.
  * @returns A promise that resolves to the data, or to the result of `select` if provided. It
  * rejects with the error from the fetch or from `select`.
  * @example
  * ```ts
  * try {
  *   const data = await queryClient.query({ queryKey, queryFn, staleTime: 10000 })
  * } catch (error) {
  *   console.log(error)
  * }
  * ```
  */
  async query(options2) {
    const defaultedOptions = this.defaultQueryOptions(options2);
    if (defaultedOptions.retry === void 0) defaultedOptions.retry = false;
    const query = this.#queryCache.build(this, defaultedOptions);
    const queryData = query.isStaleByTime(resolveQueryValue(defaultedOptions.staleTime, query)) ? await query.fetch(defaultedOptions) : query.state.data;
    const select = defaultedOptions.select;
    if (select) return select(queryData);
    return queryData;
  }
  /**
  * Fetches and caches a query, or returns its cached data if it isn't stale. Unlike in observers,
  * the fetch isn't retried unless `retry` is set.
  * @param options - The query options, including the `queryKey` and the `queryFn` used if the
  * query needs to fetch.
  * @returns A promise that resolves to the cached or fetched data, or rejects with the fetch
  * error.
  * @deprecated Use queryClient.query(options) instead. This method will be removed in the next major version.
  */
  fetchQuery(options2) {
    const defaultedOptions = this.defaultQueryOptions(options2);
    if (defaultedOptions.retry === void 0) defaultedOptions.retry = false;
    const query = this.#queryCache.build(this, defaultedOptions);
    return query.isStaleByTime(resolveQueryValue(defaultedOptions.staleTime, query)) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }
  /**
  * Fetches and caches a query like {@link QueryClient#fetchQuery}, but ignores the result and any
  * error.
  * @param options - The query options, including the `queryKey` and the `queryFn` used if the
  * query needs to fetch.
  * @returns A promise that resolves once the fetch settles. It never rejects.
  * @deprecated Use queryClient.query(options) instead. You can swallow errors with `.catch(noop)`. This method will be removed in the next major version.
  */
  prefetchQuery(options2) {
    return this.fetchQuery(options2).then(noop).catch(noop);
  }
  /**
  * Asynchronous method to fetch and cache an infinite query, resolving with an
  * {@link InfiniteData} object or throwing with the error.
  *
  * Behaves like {@link QueryClient#query}, accepting the same options (minus
  * `initialPageParam`), plus the required `initialPageParam`, and an optional `pages` /
  * `getNextPageParam` pair used to refetch a fixed number of pages from the start.
  *
  * This method replaces the deprecated `fetchInfiniteQuery`, and — combined with
  * `{ staleTime: 'static' }` — the deprecated `ensureInfiniteQueryData`.
  * @param options - The infinite query options, including the `queryKey`, the `queryFn`, and the
  * `initialPageParam`.
  * @returns A promise that resolves to the {@link InfiniteData}, or to the result of `select` if
  * provided. It rejects with the error from the fetch or from `select`.
  * @example
  * ```ts
  * try {
  *   const data = await queryClient.infiniteQuery({ queryKey, queryFn, initialPageParam: 0 })
  *   console.log(data.pages)
  * } catch (error) {
  *   console.log(error)
  * }
  * ```
  */
  infiniteQuery(options2) {
    options2._type = "infinite";
    return this.query(options2);
  }
  /**
  * Fetches and caches an infinite query, or returns its cached data if it isn't stale.
  * @param options - The infinite query options, including the `queryKey`, the `queryFn`, and the
  * `initialPageParam`.
  * @returns A promise that resolves to the cached or fetched {@link InfiniteData}, or rejects with
  * the fetch error.
  * @deprecated Use queryClient.infiniteQuery(options) instead. This method will be removed in the next major version.
  */
  fetchInfiniteQuery(options2) {
    options2._type = "infinite";
    return this.fetchQuery(options2);
  }
  /**
  * Fetches and caches an infinite query like {@link QueryClient#fetchInfiniteQuery}, but ignores
  * the result and any error.
  * @param options - The infinite query options, including the `queryKey`, the `queryFn`, and the
  * `initialPageParam`.
  * @returns A promise that resolves once the fetch settles. It never rejects.
  * @deprecated Use queryClient.infiniteQuery(options) instead. You can swallow errors with `.catch(noop)`. This method will be removed in the next major version.
  */
  prefetchInfiniteQuery(options2) {
    return this.fetchInfiniteQuery(options2).then(noop).catch(noop);
  }
  /**
  * Returns the cached data of an infinite query, or fetches it if there is none. With
  * `revalidateIfStale`, stale cached data is also refetched in the background.
  * @param options - The infinite query options. If the query has no cached data yet, it is fetched
  * with these options.
  * @returns A promise that resolves to the cached {@link InfiniteData}, or to the fetched data if
  * nothing was cached yet.
  * @deprecated Use queryClient.infiniteQuery({ ...options, staleTime: 'static' }) instead. This method will be removed in the next major version.
  */
  ensureInfiniteQueryData(options2) {
    options2._type = "infinite";
    return this.ensureQueryData(options2);
  }
  /**
  * Resumes mutations that were paused because there was no network connection. Does nothing
  * (resolving immediately) if the client is currently offline.
  * @returns A promise that resolves once the resumed mutations have settled.
  * @example
  * ```ts
  * import { QueryClient } from '@tanstack/query-core'
  *
  * const queryClient = new QueryClient()
  * await queryClient.resumePausedMutations()
  * ```
  */
  resumePausedMutations() {
    if (onlineManager.isOnline()) return this.#mutationCache.resumePausedMutations();
    return Promise.resolve();
  }
  /**
  * Returns the query cache this client is connected to.
  * @returns The {@link QueryCache} instance.
  * @example
  * ```ts
  * import { QueryClient } from '@tanstack/query-core'
  *
  * const queryClient = new QueryClient()
  * const queryCache = queryClient.getQueryCache()
  * const queries = queryCache.findAll({ queryKey: ['posts'] })
  * ```
  */
  getQueryCache() {
    return this.#queryCache;
  }
  /**
  * Returns the mutation cache this client is connected to.
  * @returns The {@link MutationCache} instance.
  * @example
  * ```ts
  * import { QueryClient } from '@tanstack/query-core'
  *
  * const queryClient = new QueryClient()
  * const mutationCache = queryClient.getMutationCache()
  * const mutations = mutationCache.findAll({ status: 'pending' })
  * ```
  */
  getMutationCache() {
    return this.#mutationCache;
  }
  /**
  * Returns the default options that were set when creating the client, or via
  * {@link QueryClient#setDefaultOptions}.
  * @returns The client's current default options.
  * @example
  * ```ts
  * import { QueryClient } from '@tanstack/query-core'
  *
  * const queryClient = new QueryClient()
  * const defaultOptions = queryClient.getDefaultOptions()
  * ```
  */
  getDefaultOptions() {
    return this.#defaultOptions;
  }
  /**
  * Dynamically sets the default options for this client, overwriting any previously defined
  * default options.
  * @param options - The new default options for queries and mutations.
  * @see {@link QueryClient#getDefaultOptions}
  * @example
  * ```ts
  * import { QueryClient } from '@tanstack/query-core'
  *
  * const queryClient = new QueryClient()
  * queryClient.setDefaultOptions({
  *   queries: {
  *     staleTime: Infinity,
  *   },
  * })
  * ```
  */
  setDefaultOptions(options2) {
    this.#defaultOptions = options2;
  }
  /**
  * Sets default options for queries whose query key partially matches the given `queryKey`.
  *
  * If several registered query defaults match a given query key, they are merged together in
  * registration order by {@link QueryClient#getQueryDefaults}, so register defaults from the
  * most generic key to the least generic one — more specific defaults should be registered
  * after more generic ones so they take precedence.
  * @param queryKey - The query key that query keys are partially matched against.
  * @param options - The default options applied to matching queries.
  * @example
  * ```ts
  * queryClient.setQueryDefaults(['posts'], { queryFn: fetchPosts })
  *
  * await queryClient.query({ queryKey: ['posts'] })
  * ```
  */
  setQueryDefaults(queryKey, options2) {
    this.#queryDefaults.set(hashKey(queryKey), {
      queryKey,
      defaultOptions: options2
    });
  }
  /**
  * Returns the default options registered for queries whose query key partially matches the
  * given `queryKey`, via {@link QueryClient#setQueryDefaults}. If multiple registered defaults
  * match, they are merged together in registration order.
  * @param queryKey - The query key to look up registered defaults for.
  * @returns The merged default options of every registration that matches, or an empty object if
  * none match.
  * @example
  * ```ts
  * const defaultOptions = queryClient.getQueryDefaults(['posts'])
  * ```
  */
  getQueryDefaults(queryKey) {
    const defaults = [...this.#queryDefaults.values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(queryKey, queryDefault.queryKey)) Object.assign(result, queryDefault.defaultOptions);
    });
    return result;
  }
  /**
  * Sets default options for mutations whose mutation key partially matches the given
  * `mutationKey`. As with {@link QueryClient#setQueryDefaults}, the order of registration
  * matters when several registered defaults match the same mutation key.
  * @param mutationKey - The mutation key that mutation keys are partially matched against.
  * @param options - The default options applied to matching mutations.
  * @see {@link QueryClient#getMutationDefaults}
  * @example
  * ```ts
  * queryClient.setMutationDefaults(['addPost'], { mutationFn: addPost })
  * ```
  */
  setMutationDefaults(mutationKey, options2) {
    this.#mutationDefaults.set(hashKey(mutationKey), {
      mutationKey,
      defaultOptions: options2
    });
  }
  /**
  * Returns the default options registered for mutations whose mutation key partially matches
  * the given `mutationKey`, via {@link QueryClient#setMutationDefaults}. If multiple registered
  * defaults match, they are merged together in registration order.
  * @param mutationKey - The mutation key to look up registered defaults for.
  * @returns The merged default options of every registration that matches, or an empty object if
  * none match.
  * @example
  * ```ts
  * const defaultOptions = queryClient.getMutationDefaults(['addPost'])
  * ```
  */
  getMutationDefaults(mutationKey) {
    const defaults = [...this.#mutationDefaults.values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(mutationKey, queryDefault.mutationKey)) Object.assign(result, queryDefault.defaultOptions);
    });
    return result;
  }
  /**
  * Called by framework adapters (e.g. inside `useQuery`) to resolve the options passed by the
  * caller into their final, defaulted form: merging the client's own `defaultOptions.queries`,
  * then `queryClient.setQueryDefaults` for the given `queryKey`, then the caller's options on
  * top. A no-op if the options are already defaulted (`_defaulted: true`).
  * @param options - The query options passed by the caller.
  * @returns The defaulted options, with `queryHash` and dependent defaults (e.g.
  * `refetchOnReconnect`) filled in.
  */
  defaultQueryOptions(options2) {
    if (options2._defaulted) return options2;
    const defaultedOptions = {
      ...this.#defaultOptions.queries,
      ...this.getQueryDefaults(options2.queryKey),
      ...options2,
      _defaulted: true
    };
    if (!defaultedOptions.queryHash) defaultedOptions.queryHash = hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
    if (defaultedOptions.refetchOnReconnect === void 0) defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
    if (defaultedOptions.throwOnError === void 0) defaultedOptions.throwOnError = !!defaultedOptions.suspense;
    if (!defaultedOptions.networkMode && defaultedOptions.persister) defaultedOptions.networkMode = "offlineFirst";
    if (defaultedOptions.queryFn === skipToken) defaultedOptions.enabled = false;
    return defaultedOptions;
  }
  /**
  * The mutation counterpart of {@link QueryClient#defaultQueryOptions}. Called by framework
  * adapters (e.g. inside `useMutation`) to merge the client's `defaultOptions.mutations`, then
  * `queryClient.setMutationDefaults` for the given `mutationKey`, then the caller's options on
  * top. A no-op if the options are already defaulted (`_defaulted: true`).
  * @param options - The mutation options passed by the caller.
  * @returns The defaulted options.
  */
  defaultMutationOptions(options2) {
    if (options2?._defaulted) return options2;
    return {
      ...this.#defaultOptions.mutations,
      ...options2?.mutationKey && this.getMutationDefaults(options2.mutationKey),
      ...options2,
      _defaulted: true
    };
  }
  /**
  * Clears both the query cache and the mutation cache this client is connected to.
  * @example
  * ```ts
  * import { QueryClient } from '@tanstack/query-core'
  *
  * const queryClient = new QueryClient()
  * queryClient.clear()
  * ```
  */
  clear() {
    this.#queryCache.clear();
    this.#mutationCache.clear();
  }
};
/**
 * @remix-run/router v1.23.4
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$2() {
  return _extends$2 = Object.assign ? Object.assign.bind() : function(n2) {
    for (var e = 1; e < arguments.length; e++) {
      var t2 = arguments[e];
      for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n2[r2] = t2[r2]);
    }
    return n2;
  }, _extends$2.apply(null, arguments);
}
var Action;
(function(Action2) {
  Action2["Pop"] = "POP";
  Action2["Push"] = "PUSH";
  Action2["Replace"] = "REPLACE";
})(Action || (Action = {}));
const PopStateEventType = "popstate";
function createHashHistory(options2) {
  if (options2 === void 0) {
    options2 = {};
  }
  function createHashLocation(window2, globalHistory) {
    let {
      pathname = "/",
      search = "",
      hash = ""
    } = parsePath(window2.location.hash.substr(1));
    if (!pathname.startsWith("/") && !pathname.startsWith(".")) {
      pathname = "/" + pathname;
    }
    return createLocation(
      "",
      {
        pathname,
        search,
        hash
      },
      // state defaults to `null` because `window.history.state` does
      globalHistory.state && globalHistory.state.usr || null,
      globalHistory.state && globalHistory.state.key || "default"
    );
  }
  function createHashHref(window2, to) {
    let base = window2.document.querySelector("base");
    let href = "";
    if (base && base.getAttribute("href")) {
      let url = window2.location.href;
      let hashIndex = url.indexOf("#");
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }
    return href + "#" + (typeof to === "string" ? to : createPath(to));
  }
  function validateHashLocation(location, to) {
    warning(location.pathname.charAt(0) === "/", "relative pathnames are not supported in hash history.push(" + JSON.stringify(to) + ")");
  }
  return getUrlBasedHistory(createHashLocation, createHashHref, validateHashLocation, options2);
}
function invariant(value, message) {
  if (value === false || value === null || typeof value === "undefined") {
    throw new Error(message);
  }
}
function warning(cond, message) {
  if (!cond) {
    if (typeof console !== "undefined") console.warn(message);
    try {
      throw new Error(message);
    } catch (e) {
    }
  }
}
function createKey() {
  return Math.random().toString(36).substr(2, 8);
}
function getHistoryState(location, index) {
  return {
    usr: location.state,
    key: location.key,
    idx: index
  };
}
function createLocation(current, to, state, key) {
  if (state === void 0) {
    state = null;
  }
  let location = _extends$2({
    pathname: typeof current === "string" ? current : current.pathname,
    search: "",
    hash: ""
  }, typeof to === "string" ? parsePath(to) : to, {
    state,
    // TODO: This could be cleaned up.  push/replace should probably just take
    // full Locations now and avoid the need to run through this flow at all
    // But that's a pretty big refactor to the current test suite so going to
    // keep as is for the time being and just let any incoming keys take precedence
    key: to && to.key || key || createKey()
  });
  return location;
}
function createPath(_ref) {
  let {
    pathname = "/",
    search = "",
    hash = ""
  } = _ref;
  if (search && search !== "?") pathname += search.charAt(0) === "?" ? search : "?" + search;
  if (hash && hash !== "#") pathname += hash.charAt(0) === "#" ? hash : "#" + hash;
  return pathname;
}
function parsePath(path) {
  let parsedPath = {};
  if (path) {
    let hashIndex = path.indexOf("#");
    if (hashIndex >= 0) {
      parsedPath.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }
    let searchIndex = path.indexOf("?");
    if (searchIndex >= 0) {
      parsedPath.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }
    if (path) {
      parsedPath.pathname = path;
    }
  }
  return parsedPath;
}
function getUrlBasedHistory(getLocation, createHref, validateLocation, options2) {
  if (options2 === void 0) {
    options2 = {};
  }
  let {
    window: window2 = document.defaultView,
    v5Compat = false
  } = options2;
  let globalHistory = window2.history;
  let action = Action.Pop;
  let listener = null;
  let index = getIndex();
  if (index == null) {
    index = 0;
    globalHistory.replaceState(_extends$2({}, globalHistory.state, {
      idx: index
    }), "");
  }
  function getIndex() {
    let state = globalHistory.state || {
      idx: null
    };
    return state.idx;
  }
  function handlePop() {
    action = Action.Pop;
    let nextIndex = getIndex();
    let delta = nextIndex == null ? null : nextIndex - index;
    index = nextIndex;
    if (listener) {
      listener({
        action,
        location: history.location,
        delta
      });
    }
  }
  function push(to, state) {
    action = Action.Push;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);
    index = getIndex() + 1;
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    try {
      globalHistory.pushState(historyState, "", url);
    } catch (error) {
      if (error instanceof DOMException && error.name === "DataCloneError") {
        throw error;
      }
      window2.location.assign(url);
    }
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 1
      });
    }
  }
  function replace(to, state) {
    action = Action.Replace;
    let location = createLocation(history.location, to, state);
    if (validateLocation) validateLocation(location, to);
    index = getIndex();
    let historyState = getHistoryState(location, index);
    let url = history.createHref(location);
    globalHistory.replaceState(historyState, "", url);
    if (v5Compat && listener) {
      listener({
        action,
        location: history.location,
        delta: 0
      });
    }
  }
  function createURL(to) {
    let base = window2.location.origin !== "null" ? window2.location.origin : window2.location.href;
    let href = typeof to === "string" ? to : createPath(to);
    href = href.replace(/ $/, "%20");
    invariant(base, "No window.location.(origin|href) available to create URL for href: " + href);
    return new URL(href, base);
  }
  let history = {
    get action() {
      return action;
    },
    get location() {
      return getLocation(window2, globalHistory);
    },
    listen(fn) {
      if (listener) {
        throw new Error("A history only accepts one active listener");
      }
      window2.addEventListener(PopStateEventType, handlePop);
      listener = fn;
      return () => {
        window2.removeEventListener(PopStateEventType, handlePop);
        listener = null;
      };
    },
    createHref(to) {
      return createHref(window2, to);
    },
    createURL,
    encodeLocation(to) {
      let url = createURL(to);
      return {
        pathname: url.pathname,
        search: url.search,
        hash: url.hash
      };
    },
    push,
    replace,
    go(n2) {
      return globalHistory.go(n2);
    }
  };
  return history;
}
var ResultType;
(function(ResultType2) {
  ResultType2["data"] = "data";
  ResultType2["deferred"] = "deferred";
  ResultType2["redirect"] = "redirect";
  ResultType2["error"] = "error";
})(ResultType || (ResultType = {}));
function matchRoutes(routes, locationArg, basename) {
  if (basename === void 0) {
    basename = "/";
  }
  return matchRoutesImpl(routes, locationArg, basename);
}
function matchRoutesImpl(routes, locationArg, basename, allowPartial) {
  let location = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  let pathname = stripBasename(location.pathname || "/", basename);
  if (pathname == null) {
    return null;
  }
  let branches = flattenRoutes(routes);
  rankRouteBranches(branches);
  let matches = null;
  let decoded = decodePath(pathname);
  for (let i = 0; matches == null && i < branches.length; ++i) {
    matches = matchRouteBranch(branches[i], decoded);
  }
  return matches;
}
function flattenRoutes(routes, branches, parentsMeta, parentPath) {
  if (branches === void 0) {
    branches = [];
  }
  if (parentsMeta === void 0) {
    parentsMeta = [];
  }
  if (parentPath === void 0) {
    parentPath = "";
  }
  let flattenRoute = (route, index, relativePath) => {
    let meta = {
      relativePath: relativePath === void 0 ? route.path || "" : relativePath,
      caseSensitive: route.caseSensitive === true,
      childrenIndex: index,
      route
    };
    if (meta.relativePath.startsWith("/")) {
      invariant(meta.relativePath.startsWith(parentPath), 'Absolute route path "' + meta.relativePath + '" nested under path ' + ('"' + parentPath + '" is not valid. An absolute child route path ') + "must start with the combined path of all its parent routes.");
      meta.relativePath = meta.relativePath.slice(parentPath.length);
    }
    let path = joinPaths([parentPath, meta.relativePath]);
    let routesMeta = parentsMeta.concat(meta);
    if (route.children && route.children.length > 0) {
      invariant(
        // Our types know better, but runtime JS may not!
        // @ts-expect-error
        route.index !== true,
        "Index routes must not have child routes. Please remove " + ('all child routes from route path "' + path + '".')
      );
      flattenRoutes(route.children, branches, routesMeta, path);
    }
    if (route.path == null && !route.index) {
      return;
    }
    branches.push({
      path,
      score: computeScore(path, route.index),
      routesMeta
    });
  };
  routes.forEach((route, index) => {
    var _route$path;
    if (route.path === "" || !((_route$path = route.path) != null && _route$path.includes("?"))) {
      flattenRoute(route, index);
    } else {
      for (let exploded of explodeOptionalSegments(route.path)) {
        flattenRoute(route, index, exploded);
      }
    }
  });
  return branches;
}
function explodeOptionalSegments(path) {
  let segments = path.split("/");
  if (segments.length === 0) return [];
  let [first, ...rest] = segments;
  let isOptional = first.endsWith("?");
  let required = first.replace(/\?$/, "");
  if (rest.length === 0) {
    return isOptional ? [required, ""] : [required];
  }
  let restExploded = explodeOptionalSegments(rest.join("/"));
  let result = [];
  result.push(...restExploded.map((subpath) => subpath === "" ? required : [required, subpath].join("/")));
  if (isOptional) {
    result.push(...restExploded);
  }
  return result.map((exploded) => path.startsWith("/") && exploded === "" ? "/" : exploded);
}
function rankRouteBranches(branches) {
  branches.sort((a, b) => a.score !== b.score ? b.score - a.score : compareIndexes(a.routesMeta.map((meta) => meta.childrenIndex), b.routesMeta.map((meta) => meta.childrenIndex)));
}
const paramRe = /^:[\w-]+$/;
const dynamicSegmentValue = 3;
const indexRouteValue = 2;
const emptySegmentValue = 1;
const staticSegmentValue = 10;
const splatPenalty = -2;
const isSplat = (s) => s === "*";
function computeScore(path, index) {
  let segments = path.split("/");
  let initialScore = segments.length;
  if (segments.some(isSplat)) {
    initialScore += splatPenalty;
  }
  if (index) {
    initialScore += indexRouteValue;
  }
  return segments.filter((s) => !isSplat(s)).reduce((score, segment) => score + (paramRe.test(segment) ? dynamicSegmentValue : segment === "" ? emptySegmentValue : staticSegmentValue), initialScore);
}
function compareIndexes(a, b) {
  let siblings = a.length === b.length && a.slice(0, -1).every((n2, i) => n2 === b[i]);
  return siblings ? (
    // If two routes are siblings, we should try to match the earlier sibling
    // first. This allows people to have fine-grained control over the matching
    // behavior by simply putting routes with identical paths in the order they
    // want them tried.
    a[a.length - 1] - b[b.length - 1]
  ) : (
    // Otherwise, it doesn't really make sense to rank non-siblings by index,
    // so they sort equally.
    0
  );
}
function matchRouteBranch(branch, pathname, allowPartial) {
  let {
    routesMeta
  } = branch;
  let matchedParams = {};
  let matchedPathname = "/";
  let matches = [];
  for (let i = 0; i < routesMeta.length; ++i) {
    let meta = routesMeta[i];
    let end = i === routesMeta.length - 1;
    let remainingPathname = matchedPathname === "/" ? pathname : pathname.slice(matchedPathname.length) || "/";
    let match = matchPath({
      path: meta.relativePath,
      caseSensitive: meta.caseSensitive,
      end
    }, remainingPathname);
    let route = meta.route;
    if (!match) {
      return null;
    }
    Object.assign(matchedParams, match.params);
    matches.push({
      // TODO: Can this as be avoided?
      params: matchedParams,
      pathname: joinPaths([matchedPathname, match.pathname]),
      pathnameBase: normalizePathname(joinPaths([matchedPathname, match.pathnameBase])),
      route
    });
    if (match.pathnameBase !== "/") {
      matchedPathname = joinPaths([matchedPathname, match.pathnameBase]);
    }
  }
  return matches;
}
function matchPath(pattern, pathname) {
  if (typeof pattern === "string") {
    pattern = {
      path: pattern,
      caseSensitive: false,
      end: true
    };
  }
  let [matcher, compiledParams] = compilePath(pattern.path, pattern.caseSensitive, pattern.end);
  let match = pathname.match(matcher);
  if (!match) return null;
  let matchedPathname = match[0];
  let pathnameBase = matchedPathname.replace(/(.)\/+$/, "$1");
  let captureGroups = match.slice(1);
  let params = compiledParams.reduce((memo, _ref, index) => {
    let {
      paramName,
      isOptional
    } = _ref;
    if (paramName === "*") {
      let splatValue = captureGroups[index] || "";
      pathnameBase = matchedPathname.slice(0, matchedPathname.length - splatValue.length).replace(/(.)\/+$/, "$1");
    }
    const value = captureGroups[index];
    if (isOptional && !value) {
      memo[paramName] = void 0;
    } else {
      memo[paramName] = (value || "").replace(/%2F/g, "/");
    }
    return memo;
  }, {});
  return {
    params,
    pathname: matchedPathname,
    pathnameBase,
    pattern
  };
}
function compilePath(path, caseSensitive, end) {
  if (caseSensitive === void 0) {
    caseSensitive = false;
  }
  if (end === void 0) {
    end = true;
  }
  warning(path === "*" || !path.endsWith("*") || path.endsWith("/*"), 'Route path "' + path + '" will be treated as if it were ' + ('"' + path.replace(/\*$/, "/*") + '" because the `*` character must ') + "always follow a `/` in the pattern. To get rid of this warning, " + ('please change the route path to "' + path.replace(/\*$/, "/*") + '".'));
  let params = [];
  let regexpSource = "^" + path.replace(/\/*\*?$/, "").replace(/^\/*/, "/").replace(/[\\.*+^${}|()[\]]/g, "\\$&").replace(/\/:([\w-]+)(\?)?/g, (_, paramName, isOptional) => {
    params.push({
      paramName,
      isOptional: isOptional != null
    });
    return isOptional ? "/?([^\\/]+)?" : "/([^\\/]+)";
  });
  if (path.endsWith("*")) {
    params.push({
      paramName: "*"
    });
    regexpSource += path === "*" || path === "/*" ? "(.*)$" : "(?:\\/(.+)|\\/*)$";
  } else if (end) {
    regexpSource += "\\/*$";
  } else if (path !== "" && path !== "/") {
    regexpSource += "(?:(?=\\/|$))";
  } else ;
  let matcher = new RegExp(regexpSource, caseSensitive ? void 0 : "i");
  return [matcher, params];
}
function decodePath(value) {
  try {
    return value.split("/").map((v2) => decodeURIComponent(v2).replace(/\//g, "%2F")).join("/");
  } catch (error) {
    warning(false, 'The URL path "' + value + '" could not be decoded because it is is a malformed URL segment. This is probably due to a bad percent ' + ("encoding (" + error + ")."));
    return value;
  }
}
function stripBasename(pathname, basename) {
  if (basename === "/") return pathname;
  if (!pathname.toLowerCase().startsWith(basename.toLowerCase())) {
    return null;
  }
  let startIndex = basename.endsWith("/") ? basename.length - 1 : basename.length;
  let nextChar = pathname.charAt(startIndex);
  if (nextChar && nextChar !== "/") {
    return null;
  }
  return pathname.slice(startIndex) || "/";
}
function resolvePath(to, fromPathname) {
  if (fromPathname === void 0) {
    fromPathname = "/";
  }
  let {
    pathname: toPathname,
    search = "",
    hash = ""
  } = typeof to === "string" ? parsePath(to) : to;
  let pathname;
  if (toPathname) {
    toPathname = removeDoubleSlashes(toPathname);
    if (toPathname.startsWith("/")) {
      pathname = resolvePathname(toPathname.substring(1), "/");
    } else {
      pathname = resolvePathname(toPathname, fromPathname);
    }
  } else {
    pathname = fromPathname;
  }
  return {
    pathname,
    search: normalizeSearch(search),
    hash: normalizeHash(hash)
  };
}
function resolvePathname(relativePath, fromPathname) {
  let segments = fromPathname.replace(/\/+$/, "").split("/");
  let relativeSegments = relativePath.split("/");
  relativeSegments.forEach((segment) => {
    if (segment === "..") {
      if (segments.length > 1) segments.pop();
    } else if (segment !== ".") {
      segments.push(segment);
    }
  });
  return segments.length > 1 ? segments.join("/") : "/";
}
function getInvalidPathError(char, field, dest, path) {
  return "Cannot include a '" + char + "' character in a manually specified " + ("`to." + field + "` field [" + JSON.stringify(path) + "].  Please separate it out to the ") + ("`to." + dest + "` field. Alternatively you may provide the full path as ") + 'a string in <Link to="..."> and the router will parse it for you.';
}
function getPathContributingMatches(matches) {
  return matches.filter((match, index) => index === 0 || match.route.path && match.route.path.length > 0);
}
function getResolveToMatches(matches, v7_relativeSplatPath) {
  let pathMatches = getPathContributingMatches(matches);
  if (v7_relativeSplatPath) {
    return pathMatches.map((match, idx) => idx === pathMatches.length - 1 ? match.pathname : match.pathnameBase);
  }
  return pathMatches.map((match) => match.pathnameBase);
}
function resolveTo(toArg, routePathnames, locationPathname, isPathRelative) {
  if (isPathRelative === void 0) {
    isPathRelative = false;
  }
  let to;
  if (typeof toArg === "string") {
    to = parsePath(toArg);
  } else {
    to = _extends$2({}, toArg);
    invariant(!to.pathname || !to.pathname.includes("?"), getInvalidPathError("?", "pathname", "search", to));
    invariant(!to.pathname || !to.pathname.includes("#"), getInvalidPathError("#", "pathname", "hash", to));
    invariant(!to.search || !to.search.includes("#"), getInvalidPathError("#", "search", "hash", to));
  }
  let isEmptyPath = toArg === "" || to.pathname === "";
  let toPathname = isEmptyPath ? "/" : to.pathname;
  let from;
  if (toPathname == null) {
    from = locationPathname;
  } else {
    let routePathnameIndex = routePathnames.length - 1;
    if (!isPathRelative && toPathname.startsWith("..")) {
      let toSegments = toPathname.split("/");
      while (toSegments[0] === "..") {
        toSegments.shift();
        routePathnameIndex -= 1;
      }
      to.pathname = toSegments.join("/");
    }
    from = routePathnameIndex >= 0 ? routePathnames[routePathnameIndex] : "/";
  }
  let path = resolvePath(to, from);
  let hasExplicitTrailingSlash = toPathname && toPathname !== "/" && toPathname.endsWith("/");
  let hasCurrentTrailingSlash = (isEmptyPath || toPathname === ".") && locationPathname.endsWith("/");
  if (!path.pathname.endsWith("/") && (hasExplicitTrailingSlash || hasCurrentTrailingSlash)) {
    path.pathname += "/";
  }
  return path;
}
const removeDoubleSlashes = (path) => path.replace(/\/\/+/g, "/");
const joinPaths = (paths) => removeDoubleSlashes(paths.join("/"));
const normalizePathname = (pathname) => pathname.replace(/\/+$/, "").replace(/^\/*/, "/");
const normalizeSearch = (search) => !search || search === "?" ? "" : search.startsWith("?") ? search : "?" + search;
const normalizeHash = (hash) => !hash || hash === "#" ? "" : hash.startsWith("#") ? hash : "#" + hash;
function isRouteErrorResponse(error) {
  return error != null && typeof error.status === "number" && typeof error.statusText === "string" && typeof error.internal === "boolean" && "data" in error;
}
const validMutationMethodsArr = ["post", "put", "patch", "delete"];
new Set(validMutationMethodsArr);
const validRequestMethodsArr = ["get", ...validMutationMethodsArr];
new Set(validRequestMethodsArr);
/**
 * React Router v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends$1() {
  return _extends$1 = Object.assign ? Object.assign.bind() : function(n2) {
    for (var e = 1; e < arguments.length; e++) {
      var t2 = arguments[e];
      for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n2[r2] = t2[r2]);
    }
    return n2;
  }, _extends$1.apply(null, arguments);
}
const DataRouterContext = /* @__PURE__ */ reactExports.createContext(null);
const DataRouterStateContext = /* @__PURE__ */ reactExports.createContext(null);
const NavigationContext = /* @__PURE__ */ reactExports.createContext(null);
const LocationContext = /* @__PURE__ */ reactExports.createContext(null);
const RouteContext = /* @__PURE__ */ reactExports.createContext({
  outlet: null,
  matches: [],
  isDataRoute: false
});
const RouteErrorContext = /* @__PURE__ */ reactExports.createContext(null);
function useHref(to, _temp) {
  let {
    relative
  } = _temp === void 0 ? {} : _temp;
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    basename,
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    hash,
    pathname,
    search
  } = useResolvedPath(to, {
    relative
  });
  let joinedPathname = pathname;
  if (basename !== "/") {
    joinedPathname = pathname === "/" ? basename : joinPaths([basename, pathname]);
  }
  return navigator2.createHref({
    pathname: joinedPathname,
    search,
    hash
  });
}
function useInRouterContext() {
  return reactExports.useContext(LocationContext) != null;
}
function useLocation() {
  !useInRouterContext() ? invariant(false) : void 0;
  return reactExports.useContext(LocationContext).location;
}
function useIsomorphicLayoutEffect(cb2) {
  let isStatic = reactExports.useContext(NavigationContext).static;
  if (!isStatic) {
    reactExports.useLayoutEffect(cb2);
  }
}
function useNavigate() {
  let {
    isDataRoute
  } = reactExports.useContext(RouteContext);
  return isDataRoute ? useNavigateStable() : useNavigateUnstable();
}
function useNavigateUnstable() {
  !useInRouterContext() ? invariant(false) : void 0;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  let {
    basename,
    future,
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to, options2) {
    if (options2 === void 0) {
      options2 = {};
    }
    if (!activeRef.current) return;
    if (typeof to === "number") {
      navigator2.go(to);
      return;
    }
    let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, options2.relative === "path");
    if (dataRouterContext == null && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
    }
    (!!options2.replace ? navigator2.replace : navigator2.push)(path, options2.state, options2);
  }, [basename, navigator2, routePathnamesJson, locationPathname, dataRouterContext]);
  return navigate;
}
function useResolvedPath(to, _temp2) {
  let {
    relative
  } = _temp2 === void 0 ? {} : _temp2;
  let {
    future
  } = reactExports.useContext(NavigationContext);
  let {
    matches
  } = reactExports.useContext(RouteContext);
  let {
    pathname: locationPathname
  } = useLocation();
  let routePathnamesJson = JSON.stringify(getResolveToMatches(matches, future.v7_relativeSplatPath));
  return reactExports.useMemo(() => resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, relative === "path"), [to, routePathnamesJson, locationPathname, relative]);
}
function useRoutes(routes, locationArg) {
  return useRoutesImpl(routes, locationArg);
}
function useRoutesImpl(routes, locationArg, dataRouterState, future) {
  !useInRouterContext() ? invariant(false) : void 0;
  let {
    navigator: navigator2
  } = reactExports.useContext(NavigationContext);
  let {
    matches: parentMatches
  } = reactExports.useContext(RouteContext);
  let routeMatch = parentMatches[parentMatches.length - 1];
  let parentParams = routeMatch ? routeMatch.params : {};
  routeMatch ? routeMatch.pathname : "/";
  let parentPathnameBase = routeMatch ? routeMatch.pathnameBase : "/";
  routeMatch && routeMatch.route;
  let locationFromContext = useLocation();
  let location;
  if (locationArg) {
    var _parsedLocationArg$pa;
    let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
    !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? invariant(false) : void 0;
    location = parsedLocationArg;
  } else {
    location = locationFromContext;
  }
  let pathname = location.pathname || "/";
  let remainingPathname = pathname;
  if (parentPathnameBase !== "/") {
    let parentSegments = parentPathnameBase.replace(/^\//, "").split("/");
    let segments = pathname.replace(/^\//, "").split("/");
    remainingPathname = "/" + segments.slice(parentSegments.length).join("/");
  }
  let matches = matchRoutes(routes, {
    pathname: remainingPathname
  });
  let renderedMatches = _renderMatches(matches && matches.map((match) => Object.assign({}, match, {
    params: Object.assign({}, parentParams, match.params),
    pathname: joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator2.encodeLocation ? navigator2.encodeLocation(match.pathname).pathname : match.pathname
    ]),
    pathnameBase: match.pathnameBase === "/" ? parentPathnameBase : joinPaths([
      parentPathnameBase,
      // Re-encode pathnames that were decoded inside matchRoutes
      navigator2.encodeLocation ? navigator2.encodeLocation(match.pathnameBase).pathname : match.pathnameBase
    ])
  })), parentMatches, dataRouterState, future);
  if (locationArg && renderedMatches) {
    return /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
      value: {
        location: _extends$1({
          pathname: "/",
          search: "",
          hash: "",
          state: null,
          key: "default"
        }, location),
        navigationType: Action.Pop
      }
    }, renderedMatches);
  }
  return renderedMatches;
}
function DefaultErrorComponent() {
  let error = useRouteError();
  let message = isRouteErrorResponse(error) ? error.status + " " + error.statusText : error instanceof Error ? error.message : JSON.stringify(error);
  let stack = error instanceof Error ? error.stack : null;
  let lightgrey = "rgba(200,200,200, 0.5)";
  let preStyles = {
    padding: "0.5rem",
    backgroundColor: lightgrey
  };
  let devInfo = null;
  return /* @__PURE__ */ reactExports.createElement(reactExports.Fragment, null, /* @__PURE__ */ reactExports.createElement("h2", null, "Unexpected Application Error!"), /* @__PURE__ */ reactExports.createElement("h3", {
    style: {
      fontStyle: "italic"
    }
  }, message), stack ? /* @__PURE__ */ reactExports.createElement("pre", {
    style: preStyles
  }, stack) : null, devInfo);
}
const defaultErrorElement = /* @__PURE__ */ reactExports.createElement(DefaultErrorComponent, null);
class RenderErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      revalidation: props.revalidation,
      error: props.error
    };
  }
  static getDerivedStateFromError(error) {
    return {
      error
    };
  }
  static getDerivedStateFromProps(props, state) {
    if (state.location !== props.location || state.revalidation !== "idle" && props.revalidation === "idle") {
      return {
        error: props.error,
        location: props.location,
        revalidation: props.revalidation
      };
    }
    return {
      error: props.error !== void 0 ? props.error : state.error,
      location: state.location,
      revalidation: props.revalidation || state.revalidation
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("React Router caught the following error during render", error, errorInfo);
  }
  render() {
    return this.state.error !== void 0 ? /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
      value: this.props.routeContext
    }, /* @__PURE__ */ reactExports.createElement(RouteErrorContext.Provider, {
      value: this.state.error,
      children: this.props.component
    })) : this.props.children;
  }
}
function RenderedRoute(_ref) {
  let {
    routeContext,
    match,
    children
  } = _ref;
  let dataRouterContext = reactExports.useContext(DataRouterContext);
  if (dataRouterContext && dataRouterContext.static && dataRouterContext.staticContext && (match.route.errorElement || match.route.ErrorBoundary)) {
    dataRouterContext.staticContext._deepestRenderedBoundaryId = match.route.id;
  }
  return /* @__PURE__ */ reactExports.createElement(RouteContext.Provider, {
    value: routeContext
  }, children);
}
function _renderMatches(matches, parentMatches, dataRouterState, future) {
  var _dataRouterState;
  if (parentMatches === void 0) {
    parentMatches = [];
  }
  if (dataRouterState === void 0) {
    dataRouterState = null;
  }
  if (future === void 0) {
    future = null;
  }
  if (matches == null) {
    var _future;
    if (!dataRouterState) {
      return null;
    }
    if (dataRouterState.errors) {
      matches = dataRouterState.matches;
    } else if ((_future = future) != null && _future.v7_partialHydration && parentMatches.length === 0 && !dataRouterState.initialized && dataRouterState.matches.length > 0) {
      matches = dataRouterState.matches;
    } else {
      return null;
    }
  }
  let renderedMatches = matches;
  let errors = (_dataRouterState = dataRouterState) == null ? void 0 : _dataRouterState.errors;
  if (errors != null) {
    let errorIndex = renderedMatches.findIndex((m2) => m2.route.id && (errors == null ? void 0 : errors[m2.route.id]) !== void 0);
    !(errorIndex >= 0) ? invariant(false) : void 0;
    renderedMatches = renderedMatches.slice(0, Math.min(renderedMatches.length, errorIndex + 1));
  }
  let renderFallback = false;
  let fallbackIndex = -1;
  if (dataRouterState && future && future.v7_partialHydration) {
    for (let i = 0; i < renderedMatches.length; i++) {
      let match = renderedMatches[i];
      if (match.route.HydrateFallback || match.route.hydrateFallbackElement) {
        fallbackIndex = i;
      }
      if (match.route.id) {
        let {
          loaderData,
          errors: errors2
        } = dataRouterState;
        let needsToRunLoader = match.route.loader && loaderData[match.route.id] === void 0 && (!errors2 || errors2[match.route.id] === void 0);
        if (match.route.lazy || needsToRunLoader) {
          renderFallback = true;
          if (fallbackIndex >= 0) {
            renderedMatches = renderedMatches.slice(0, fallbackIndex + 1);
          } else {
            renderedMatches = [renderedMatches[0]];
          }
          break;
        }
      }
    }
  }
  return renderedMatches.reduceRight((outlet, match, index) => {
    let error;
    let shouldRenderHydrateFallback = false;
    let errorElement = null;
    let hydrateFallbackElement = null;
    if (dataRouterState) {
      error = errors && match.route.id ? errors[match.route.id] : void 0;
      errorElement = match.route.errorElement || defaultErrorElement;
      if (renderFallback) {
        if (fallbackIndex < 0 && index === 0) {
          warningOnce("route-fallback");
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = null;
        } else if (fallbackIndex === index) {
          shouldRenderHydrateFallback = true;
          hydrateFallbackElement = match.route.hydrateFallbackElement || null;
        }
      }
    }
    let matches2 = parentMatches.concat(renderedMatches.slice(0, index + 1));
    let getChildren = () => {
      let children;
      if (error) {
        children = errorElement;
      } else if (shouldRenderHydrateFallback) {
        children = hydrateFallbackElement;
      } else if (match.route.Component) {
        children = /* @__PURE__ */ reactExports.createElement(match.route.Component, null);
      } else if (match.route.element) {
        children = match.route.element;
      } else {
        children = outlet;
      }
      return /* @__PURE__ */ reactExports.createElement(RenderedRoute, {
        match,
        routeContext: {
          outlet,
          matches: matches2,
          isDataRoute: dataRouterState != null
        },
        children
      });
    };
    return dataRouterState && (match.route.ErrorBoundary || match.route.errorElement || index === 0) ? /* @__PURE__ */ reactExports.createElement(RenderErrorBoundary, {
      location: dataRouterState.location,
      revalidation: dataRouterState.revalidation,
      component: errorElement,
      error,
      children: getChildren(),
      routeContext: {
        outlet: null,
        matches: matches2,
        isDataRoute: true
      }
    }) : getChildren();
  }, null);
}
var DataRouterHook$1 = /* @__PURE__ */ function(DataRouterHook2) {
  DataRouterHook2["UseBlocker"] = "useBlocker";
  DataRouterHook2["UseRevalidator"] = "useRevalidator";
  DataRouterHook2["UseNavigateStable"] = "useNavigate";
  return DataRouterHook2;
}(DataRouterHook$1 || {});
var DataRouterStateHook$1 = /* @__PURE__ */ function(DataRouterStateHook2) {
  DataRouterStateHook2["UseBlocker"] = "useBlocker";
  DataRouterStateHook2["UseLoaderData"] = "useLoaderData";
  DataRouterStateHook2["UseActionData"] = "useActionData";
  DataRouterStateHook2["UseRouteError"] = "useRouteError";
  DataRouterStateHook2["UseNavigation"] = "useNavigation";
  DataRouterStateHook2["UseRouteLoaderData"] = "useRouteLoaderData";
  DataRouterStateHook2["UseMatches"] = "useMatches";
  DataRouterStateHook2["UseRevalidator"] = "useRevalidator";
  DataRouterStateHook2["UseNavigateStable"] = "useNavigate";
  DataRouterStateHook2["UseRouteId"] = "useRouteId";
  return DataRouterStateHook2;
}(DataRouterStateHook$1 || {});
function useDataRouterContext$1(hookName) {
  let ctx = reactExports.useContext(DataRouterContext);
  !ctx ? invariant(false) : void 0;
  return ctx;
}
function useDataRouterState(hookName) {
  let state = reactExports.useContext(DataRouterStateContext);
  !state ? invariant(false) : void 0;
  return state;
}
function useRouteContext(hookName) {
  let route = reactExports.useContext(RouteContext);
  !route ? invariant(false) : void 0;
  return route;
}
function useCurrentRouteId(hookName) {
  let route = useRouteContext();
  let thisRoute = route.matches[route.matches.length - 1];
  !thisRoute.route.id ? invariant(false) : void 0;
  return thisRoute.route.id;
}
function useRouteError() {
  var _state$errors;
  let error = reactExports.useContext(RouteErrorContext);
  let state = useDataRouterState();
  let routeId = useCurrentRouteId();
  if (error !== void 0) {
    return error;
  }
  return (_state$errors = state.errors) == null ? void 0 : _state$errors[routeId];
}
function useNavigateStable() {
  let {
    router
  } = useDataRouterContext$1(DataRouterHook$1.UseNavigateStable);
  let id2 = useCurrentRouteId(DataRouterStateHook$1.UseNavigateStable);
  let activeRef = reactExports.useRef(false);
  useIsomorphicLayoutEffect(() => {
    activeRef.current = true;
  });
  let navigate = reactExports.useCallback(function(to, options2) {
    if (options2 === void 0) {
      options2 = {};
    }
    if (!activeRef.current) return;
    if (typeof to === "number") {
      router.navigate(to);
    } else {
      router.navigate(to, _extends$1({
        fromRouteId: id2
      }, options2));
    }
  }, [router, id2]);
  return navigate;
}
const alreadyWarned$1 = {};
function warningOnce(key, cond, message) {
  if (!alreadyWarned$1[key]) {
    alreadyWarned$1[key] = true;
  }
}
function logV6DeprecationWarnings(renderFuture, routerFuture) {
  if ((renderFuture == null ? void 0 : renderFuture.v7_startTransition) === void 0) ;
  if ((renderFuture == null ? void 0 : renderFuture.v7_relativeSplatPath) === void 0 && true) ;
}
function Route(_props) {
  invariant(false);
}
function Router(_ref5) {
  let {
    basename: basenameProp = "/",
    children = null,
    location: locationProp,
    navigationType = Action.Pop,
    navigator: navigator2,
    static: staticProp = false,
    future
  } = _ref5;
  !!useInRouterContext() ? invariant(false) : void 0;
  let basename = basenameProp.replace(/^\/*/, "/");
  let navigationContext = reactExports.useMemo(() => ({
    basename,
    navigator: navigator2,
    static: staticProp,
    future: _extends$1({
      v7_relativeSplatPath: false
    }, future)
  }), [basename, future, navigator2, staticProp]);
  if (typeof locationProp === "string") {
    locationProp = parsePath(locationProp);
  }
  let {
    pathname = "/",
    search = "",
    hash = "",
    state = null,
    key = "default"
  } = locationProp;
  let locationContext = reactExports.useMemo(() => {
    let trailingPathname = stripBasename(pathname, basename);
    if (trailingPathname == null) {
      return null;
    }
    return {
      location: {
        pathname: trailingPathname,
        search,
        hash,
        state,
        key
      },
      navigationType
    };
  }, [basename, pathname, search, hash, state, key, navigationType]);
  if (locationContext == null) {
    return null;
  }
  return /* @__PURE__ */ reactExports.createElement(NavigationContext.Provider, {
    value: navigationContext
  }, /* @__PURE__ */ reactExports.createElement(LocationContext.Provider, {
    children,
    value: locationContext
  }));
}
function Routes(_ref6) {
  let {
    children,
    location
  } = _ref6;
  return useRoutes(createRoutesFromChildren(children), location);
}
new Promise(() => {
});
function createRoutesFromChildren(children, parentPath) {
  if (parentPath === void 0) {
    parentPath = [];
  }
  let routes = [];
  reactExports.Children.forEach(children, (element, index) => {
    if (!/* @__PURE__ */ reactExports.isValidElement(element)) {
      return;
    }
    let treePath = [...parentPath, index];
    if (element.type === reactExports.Fragment) {
      routes.push.apply(routes, createRoutesFromChildren(element.props.children, treePath));
      return;
    }
    !(element.type === Route) ? invariant(false) : void 0;
    !(!element.props.index || !element.props.children) ? invariant(false) : void 0;
    let route = {
      id: element.props.id || treePath.join("-"),
      caseSensitive: element.props.caseSensitive,
      element: element.props.element,
      Component: element.props.Component,
      index: element.props.index,
      path: element.props.path,
      loader: element.props.loader,
      action: element.props.action,
      errorElement: element.props.errorElement,
      ErrorBoundary: element.props.ErrorBoundary,
      hasErrorBoundary: element.props.ErrorBoundary != null || element.props.errorElement != null,
      shouldRevalidate: element.props.shouldRevalidate,
      handle: element.props.handle,
      lazy: element.props.lazy
    };
    if (element.props.children) {
      route.children = createRoutesFromChildren(element.props.children, treePath);
    }
    routes.push(route);
  });
  return routes;
}
/**
 * React Router DOM v6.30.6
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function(n2) {
    for (var e = 1; e < arguments.length; e++) {
      var t2 = arguments[e];
      for (var r2 in t2) ({}).hasOwnProperty.call(t2, r2) && (n2[r2] = t2[r2]);
    }
    return n2;
  }, _extends.apply(null, arguments);
}
function _objectWithoutPropertiesLoose(r2, e) {
  if (null == r2) return {};
  var t2 = {};
  for (var n2 in r2) if ({}.hasOwnProperty.call(r2, n2)) {
    if (-1 !== e.indexOf(n2)) continue;
    t2[n2] = r2[n2];
  }
  return t2;
}
function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}
function shouldProcessLinkClick(event, target) {
  return event.button === 0 && // Ignore everything but left clicks
  (!target || target === "_self") && // Let browser handle "target=_blank" etc.
  !isModifiedEvent(event);
}
const _excluded = ["onClick", "relative", "reloadDocument", "replace", "state", "target", "to", "preventScrollReset", "viewTransition"], _excluded2 = ["aria-current", "caseSensitive", "className", "end", "style", "to", "viewTransition", "children"];
const REACT_ROUTER_VERSION = "6";
try {
  window.__reactRouterVersion = REACT_ROUTER_VERSION;
} catch (e) {
}
const ViewTransitionContext = /* @__PURE__ */ reactExports.createContext({
  isTransitioning: false
});
const START_TRANSITION = "startTransition";
const startTransitionImpl = React$1[START_TRANSITION];
function HashRouter(_ref5) {
  let {
    basename,
    children,
    future,
    window: window2
  } = _ref5;
  let historyRef = reactExports.useRef();
  if (historyRef.current == null) {
    historyRef.current = createHashHistory({
      window: window2,
      v5Compat: true
    });
  }
  let history = historyRef.current;
  let [state, setStateImpl] = reactExports.useState({
    action: history.action,
    location: history.location
  });
  let {
    v7_startTransition
  } = future || {};
  let setState = reactExports.useCallback((newState) => {
    v7_startTransition && startTransitionImpl ? startTransitionImpl(() => setStateImpl(newState)) : setStateImpl(newState);
  }, [setStateImpl, v7_startTransition]);
  reactExports.useLayoutEffect(() => history.listen(setState), [history, setState]);
  reactExports.useEffect(() => logV6DeprecationWarnings(future), [future]);
  return /* @__PURE__ */ reactExports.createElement(Router, {
    basename,
    children,
    location: state.location,
    navigationType: state.action,
    navigator: history,
    future
  });
}
const isBrowser = typeof window !== "undefined" && typeof window.document !== "undefined" && typeof window.document.createElement !== "undefined";
const ABSOLUTE_URL_REGEX = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const Link$1 = /* @__PURE__ */ reactExports.forwardRef(function LinkWithRef(_ref7, ref) {
  let {
    onClick,
    relative,
    reloadDocument,
    replace: replace2,
    state,
    target,
    to,
    preventScrollReset,
    viewTransition
  } = _ref7, rest = _objectWithoutPropertiesLoose(_ref7, _excluded);
  let {
    basename
  } = reactExports.useContext(NavigationContext);
  let absoluteHref;
  let isExternal = false;
  if (typeof to === "string" && ABSOLUTE_URL_REGEX.test(to)) {
    absoluteHref = to;
    if (isBrowser) {
      try {
        let currentUrl = new URL(window.location.href);
        let targetUrl = to.startsWith("//") ? new URL(currentUrl.protocol + to) : new URL(to);
        let path = stripBasename(targetUrl.pathname, basename);
        if (targetUrl.origin === currentUrl.origin && path != null) {
          to = path + targetUrl.search + targetUrl.hash;
        } else {
          isExternal = true;
        }
      } catch (e) {
      }
    }
  }
  let href = useHref(to, {
    relative
  });
  let internalOnClick = useLinkClickHandler(to, {
    replace: replace2,
    state,
    target,
    preventScrollReset,
    relative,
    viewTransition
  });
  function handleClick(event) {
    if (onClick) onClick(event);
    if (!event.defaultPrevented) {
      internalOnClick(event);
    }
  }
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    /* @__PURE__ */ reactExports.createElement("a", _extends({}, rest, {
      href: absoluteHref || href,
      onClick: isExternal || reloadDocument ? onClick : handleClick,
      ref,
      target
    }))
  );
});
const NavLink = /* @__PURE__ */ reactExports.forwardRef(function NavLinkWithRef(_ref8, ref) {
  let {
    "aria-current": ariaCurrentProp = "page",
    caseSensitive = false,
    className: classNameProp = "",
    end = false,
    style: styleProp,
    to,
    viewTransition,
    children
  } = _ref8, rest = _objectWithoutPropertiesLoose(_ref8, _excluded2);
  let path = useResolvedPath(to, {
    relative: rest.relative
  });
  let location = useLocation();
  let routerState = reactExports.useContext(DataRouterStateContext);
  let {
    navigator: navigator2,
    basename
  } = reactExports.useContext(NavigationContext);
  let isTransitioning = routerState != null && // Conditional usage is OK here because the usage of a data router is static
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useViewTransitionState(path) && viewTransition === true;
  let toPathname = navigator2.encodeLocation ? navigator2.encodeLocation(path).pathname : path.pathname;
  let locationPathname = location.pathname;
  let nextLocationPathname = routerState && routerState.navigation && routerState.navigation.location ? routerState.navigation.location.pathname : null;
  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    nextLocationPathname = nextLocationPathname ? nextLocationPathname.toLowerCase() : null;
    toPathname = toPathname.toLowerCase();
  }
  if (nextLocationPathname && basename) {
    nextLocationPathname = stripBasename(nextLocationPathname, basename) || nextLocationPathname;
  }
  const endSlashPosition = toPathname !== "/" && toPathname.endsWith("/") ? toPathname.length - 1 : toPathname.length;
  let isActive = locationPathname === toPathname || !end && locationPathname.startsWith(toPathname) && locationPathname.charAt(endSlashPosition) === "/";
  let isPending = nextLocationPathname != null && (nextLocationPathname === toPathname || !end && nextLocationPathname.startsWith(toPathname) && nextLocationPathname.charAt(toPathname.length) === "/");
  let renderProps = {
    isActive,
    isPending,
    isTransitioning
  };
  let ariaCurrent = isActive ? ariaCurrentProp : void 0;
  let className;
  if (typeof classNameProp === "function") {
    className = classNameProp(renderProps);
  } else {
    className = [classNameProp, isActive ? "active" : null, isPending ? "pending" : null, isTransitioning ? "transitioning" : null].filter(Boolean).join(" ");
  }
  let style = typeof styleProp === "function" ? styleProp(renderProps) : styleProp;
  return /* @__PURE__ */ reactExports.createElement(Link$1, _extends({}, rest, {
    "aria-current": ariaCurrent,
    className,
    ref,
    style,
    to,
    viewTransition
  }), typeof children === "function" ? children(renderProps) : children);
});
var DataRouterHook;
(function(DataRouterHook2) {
  DataRouterHook2["UseScrollRestoration"] = "useScrollRestoration";
  DataRouterHook2["UseSubmit"] = "useSubmit";
  DataRouterHook2["UseSubmitFetcher"] = "useSubmitFetcher";
  DataRouterHook2["UseFetcher"] = "useFetcher";
  DataRouterHook2["useViewTransitionState"] = "useViewTransitionState";
})(DataRouterHook || (DataRouterHook = {}));
var DataRouterStateHook;
(function(DataRouterStateHook2) {
  DataRouterStateHook2["UseFetcher"] = "useFetcher";
  DataRouterStateHook2["UseFetchers"] = "useFetchers";
  DataRouterStateHook2["UseScrollRestoration"] = "useScrollRestoration";
})(DataRouterStateHook || (DataRouterStateHook = {}));
function useDataRouterContext(hookName) {
  let ctx = reactExports.useContext(DataRouterContext);
  !ctx ? invariant(false) : void 0;
  return ctx;
}
function useLinkClickHandler(to, _temp) {
  let {
    target,
    replace: replaceProp,
    state,
    preventScrollReset,
    relative,
    viewTransition
  } = _temp === void 0 ? {} : _temp;
  let navigate = useNavigate();
  let location = useLocation();
  let path = useResolvedPath(to, {
    relative
  });
  return reactExports.useCallback((event) => {
    if (shouldProcessLinkClick(event, target)) {
      event.preventDefault();
      let replace2 = replaceProp !== void 0 ? replaceProp : createPath(location) === createPath(path);
      navigate(to, {
        replace: replace2,
        state,
        preventScrollReset,
        relative,
        viewTransition
      });
    }
  }, [location, navigate, path, replaceProp, state, target, to, preventScrollReset, relative, viewTransition]);
}
function useViewTransitionState(to, opts) {
  if (opts === void 0) {
    opts = {};
  }
  let vtContext = reactExports.useContext(ViewTransitionContext);
  !(vtContext != null) ? invariant(false) : void 0;
  let {
    basename
  } = useDataRouterContext(DataRouterHook.useViewTransitionState);
  let path = useResolvedPath(to, {
    relative: opts.relative
  });
  if (!vtContext.isTransitioning) {
    return false;
  }
  let currentPath = stripBasename(vtContext.currentLocation.pathname, basename) || vtContext.currentLocation.pathname;
  let nextPath = stripBasename(vtContext.nextLocation.pathname, basename) || vtContext.nextLocation.pathname;
  return matchPath(path.pathname, nextPath) != null || matchPath(path.pathname, currentPath) != null;
}
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string?.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
function toLucideIconData(iconName, iconNode, aliases = []) {
  if (iconNode == null) {
    throw new Error("[lucide]: iconNode is required when icon name is used");
  }
  return {
    name: toKebabCase(iconName),
    size: 24,
    node: iconNode,
    ...aliases.length > 0 ? { aliases } : {}
  };
}
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toCamelCase = (string) => {
  let out = "";
  let upperNext = false;
  for (const ch2 of string) {
    if (ch2 === "-" || ch2 === "_" || ch2 <= " ") {
      upperNext = out.length > 0;
      continue;
    }
    if (out.length === 0) {
      out += ch2.toLowerCase();
    } else {
      out += upperNext ? ch2.toUpperCase() : ch2;
    }
    upperNext = false;
  }
  return out;
};
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toPascalCase = (string) => {
  const camelCase = toCamelCase(string);
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": 2,
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
};
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
function isDefined(value) {
  return value !== null && value !== void 0;
}
function buildLucideIconNode(icon, params = {}) {
  const attributeNames = params.attributeNames ?? {};
  const getAttributeName = (attributeName) => attributeNames[attributeName] ?? attributeName;
  const viewBoxWidth = icon.size ?? icon.width ?? defaultAttributes["width"];
  const viewBoxHeight = icon.size ?? icon.height ?? defaultAttributes["height"];
  const aliasClassNames = icon.aliases?.filter((alias) => typeof alias === "string" && alias.trim() !== "").map((alias) => `lucide-${alias}`) ?? [];
  const iconClassNames = [...icon.name ? [`lucide-${icon.name}`] : [], ...aliasClassNames];
  const classNamesFromClassName = params.className?.split(" ").filter(Boolean) ?? [];
  const className = params.includeDefaultClasses === false ? mergeClasses(...classNamesFromClassName) : mergeClasses("lucide", ...iconClassNames, ...classNamesFromClassName);
  const calculatedStrokeWidth = params.absoluteStrokeWidth ? Number(params.strokeWidth ?? defaultAttributes["stroke-width"]) * Number(icon.size ?? icon.width ?? defaultAttributes["width"]) / Number(params.size ?? params.width ?? defaultAttributes["width"]) : params.strokeWidth ?? defaultAttributes["stroke-width"];
  const attributes = {
    ...Object.entries(defaultAttributes).reduce((attrs, [attrName, value]) => {
      attrs[getAttributeName(attrName)] = value;
      return attrs;
    }, {}),
    ..."color" in params && params.color && {
      [getAttributeName("stroke")]: params.color
    },
    ..."size" in params && isDefined(params.size) && {
      [getAttributeName("width")]: params.size,
      [getAttributeName("height")]: params.size
    },
    ..."width" in params && isDefined(params.width) && {
      [getAttributeName("width")]: params.width
    },
    ..."height" in params && isDefined(params.height) && {
      [getAttributeName("height")]: params.height
    },
    [getAttributeName("stroke-width")]: calculatedStrokeWidth,
    ...className && {
      [getAttributeName("class")]: className
    },
    [getAttributeName("viewBox")]: `0 0 ${viewBoxWidth} ${viewBoxHeight}`,
    ...params.hasA11yProp === false ? {
      [getAttributeName("aria-hidden")]: "true"
    } : {},
    ..."attributes" in params && params.attributes
  };
  return [
    "svg",
    attributes,
    icon.node.map((child) => {
      const [name, attrs, children] = child;
      const nextAttrs = params.nonScalingStroke ? { [getAttributeName("vector-effect")]: "non-scaling-stroke", ...attrs } : attrs;
      return children ? [name, nextAttrs, children] : [name, nextAttrs];
    })
  ];
}
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
function buildLucideIconForReact(icon, params = {}) {
  return buildLucideIconNode(icon, {
    ...params,
    attributeNames: {
      ...params.attributeNames,
      class: "className",
      "stroke-width": "strokeWidth",
      "stroke-linecap": "strokeLinecap",
      "stroke-linejoin": "strokeLinejoin",
      "vector-effect": "vectorEffect"
    }
  });
}
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const hasA11yProp = (props) => {
  for (const prop in props) {
    if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
      return true;
    }
  }
  return false;
};
const LucideContext = reactExports.createContext({});
const useLucideContext = () => reactExports.useContext(LucideContext);
const Icon = reactExports.forwardRef(
  ({
    color,
    size,
    width,
    height,
    strokeWidth,
    absoluteStrokeWidth,
    nonScalingStroke,
    className = "",
    children,
    iconNode = [],
    icon = {
      node: iconNode,
      aliases: [],
      size: 24
    },
    ...rest
  }, ref) => {
    const {
      size: contextSize = 24,
      strokeWidth: contextStrokeWidth = 2,
      absoluteStrokeWidth: contextAbsoluteStrokeWidth = false,
      nonScalingStroke: contextNonScalingStroke = false,
      color: contextColor = "currentColor",
      className: contextClass = ""
    } = useLucideContext() ?? {};
    const hasAccessibleProp = Boolean(children) || hasA11yProp(rest);
    const [name, svgAttributes, builtIconNode = []] = buildLucideIconForReact(icon, {
      color: color ?? contextColor,
      width: width ?? size ?? contextSize,
      height: height ?? size ?? contextSize,
      strokeWidth: strokeWidth ?? contextStrokeWidth,
      absoluteStrokeWidth: absoluteStrokeWidth ?? contextAbsoluteStrokeWidth,
      nonScalingStroke: nonScalingStroke ?? contextNonScalingStroke,
      className: mergeClasses(contextClass, className),
      hasA11yProp: hasAccessibleProp,
      attributes: rest
    });
    return reactExports.createElement(
      name,
      {
        ref,
        ...svgAttributes
      },
      [
        ...builtIconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
function createLucideIcon(iconDataOrName, iconNode = [], aliases = []) {
  const iconData = typeof iconDataOrName === "string" ? toLucideIconData(iconDataOrName, iconNode, aliases) : iconDataOrName;
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      icon: iconData,
      className,
      ...props
    })
  );
  if (iconData.name) {
    Component.displayName = toPascalCase(iconData.name);
  }
  return Component;
}
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$10 = {
  name: "battery",
  size: 24,
  node: [
    ["path", { d: "M 22 14 L 22 10", key: "nqc4tb" }],
    ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2", key: "13zb55" }]
  ]
};
__iconData$10.node;
const Battery = createLucideIcon(__iconData$10);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$$ = {
  name: "bot",
  size: 24,
  node: [
    ["path", { d: "M12 8V4H8", key: "hb8ula" }],
    ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
    ["path", { d: "M2 14h2", key: "vft8re" }],
    ["path", { d: "M20 14h2", key: "4cs60a" }],
    ["path", { d: "M15 13v2", key: "1xurst" }],
    ["path", { d: "M9 13v2", key: "rq6x2g" }]
  ]
};
__iconData$$.node;
const Bot = createLucideIcon(__iconData$$);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$_ = {
  name: "bug",
  size: 24,
  node: [
    ["path", { d: "M12 20v-9", key: "1qisl0" }],
    ["path", { d: "M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z", key: "uouzyp" }],
    ["path", { d: "M14.12 3.88 16 2", key: "qol33r" }],
    ["path", { d: "M21 21a4 4 0 0 0-3.81-4", key: "1b0z45" }],
    ["path", { d: "M21 5a4 4 0 0 1-3.55 3.97", key: "5cxbf6" }],
    ["path", { d: "M22 13h-4", key: "1jl80f" }],
    ["path", { d: "M3 21a4 4 0 0 1 3.81-4", key: "1fjd4g" }],
    ["path", { d: "M3 5a4 4 0 0 0 3.55 3.97", key: "1d7oge" }],
    ["path", { d: "M6 13H2", key: "82j7cp" }],
    ["path", { d: "m8 2 1.88 1.88", key: "fmnt4t" }],
    ["path", { d: "M9 7.13V6a3 3 0 1 1 6 0v1.13", key: "1vgav8" }]
  ]
};
__iconData$_.node;
const Bug = createLucideIcon(__iconData$_);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$Z = {
  name: "chevron-down",
  size: 24,
  node: [["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]]
};
__iconData$Z.node;
const ChevronDown = createLucideIcon(__iconData$Z);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$Y = {
  name: "chevron-right",
  size: 24,
  node: [["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]]
};
__iconData$Y.node;
const ChevronRight = createLucideIcon(__iconData$Y);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$X = {
  name: "circle-check-big",
  size: 24,
  node: [
    ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335", key: "yps3ct" }],
    ["path", { d: "m9 11 3 3L22 4", key: "1pflzl" }]
  ],
  aliases: ["check-circle"]
};
__iconData$X.node;
const CircleCheckBig = createLucideIcon(__iconData$X);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$W = {
  name: "circle-exclamation-point",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
    ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
  ],
  aliases: ["alert-circle", "circle-alert"]
};
__iconData$W.node;
const CircleExclamationPoint = createLucideIcon(__iconData$W);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$V = {
  name: "circle-x",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
    ["path", { d: "m9 9 6 6", key: "z0biqf" }]
  ],
  aliases: ["x-circle"]
};
__iconData$V.node;
const CircleX = createLucideIcon(__iconData$V);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$U = {
  name: "clock",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
  ]
};
__iconData$U.node;
const Clock = createLucideIcon(__iconData$U);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$T = {
  name: "cloud",
  size: 24,
  node: [["path", { d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z", key: "p7xjir" }]]
};
__iconData$T.node;
const Cloud = createLucideIcon(__iconData$T);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$S = {
  name: "copy",
  size: 24,
  node: [
    ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
    ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
  ]
};
__iconData$S.node;
const Copy = createLucideIcon(__iconData$S);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$R = {
  name: "cpu",
  size: 24,
  node: [
    ["path", { d: "M12 20v2", key: "1lh1kg" }],
    ["path", { d: "M12 2v2", key: "tus03m" }],
    ["path", { d: "M17 20v2", key: "1rnc9c" }],
    ["path", { d: "M17 2v2", key: "11trls" }],
    ["path", { d: "M2 12h2", key: "1t8f8n" }],
    ["path", { d: "M2 17h2", key: "7oei6x" }],
    ["path", { d: "M2 7h2", key: "asdhe0" }],
    ["path", { d: "M20 12h2", key: "1q8mjw" }],
    ["path", { d: "M20 17h2", key: "1fpfkl" }],
    ["path", { d: "M20 7h2", key: "1o8tra" }],
    ["path", { d: "M7 20v2", key: "4gnj0m" }],
    ["path", { d: "M7 2v2", key: "1i4yhu" }],
    ["rect", { x: "4", y: "4", width: "16", height: "16", rx: "2", key: "1vbyd7" }],
    ["rect", { x: "8", y: "8", width: "8", height: "8", rx: "1", key: "z9xiuo" }]
  ]
};
__iconData$R.node;
const Cpu = createLucideIcon(__iconData$R);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$Q = {
  name: "database",
  size: 24,
  node: [
    ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
    ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5", key: "1wlel7" }],
    ["path", { d: "M3 12A9 3 0 0 0 21 12", key: "mv7ke4" }]
  ]
};
__iconData$Q.node;
const Database = createLucideIcon(__iconData$Q);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$P = {
  name: "download",
  size: 24,
  node: [
    ["path", { d: "M12 15V3", key: "m9g1x1" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
    ["path", { d: "m7 10 5 5 5-5", key: "brsn70" }]
  ]
};
__iconData$P.node;
const Download = createLucideIcon(__iconData$P);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$O = {
  name: "eraser",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21",
        key: "g5wo59"
      }
    ],
    ["path", { d: "m5.082 11.09 8.828 8.828", key: "1wx5vj" }]
  ]
};
__iconData$O.node;
const Eraser = createLucideIcon(__iconData$O);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$N = {
  name: "external-link",
  size: 24,
  node: [
    ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
    ["path", { d: "M10 14 21 3", key: "gplh6r" }],
    ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
  ]
};
__iconData$N.node;
const ExternalLink = createLucideIcon(__iconData$N);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$M = {
  name: "factory",
  size: 24,
  node: [
    ["path", { d: "M12 16h.01", key: "1drbdi" }],
    ["path", { d: "M16 16h.01", key: "1f9h7w" }],
    [
      "path",
      {
        d: "M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z",
        key: "1iv0i2"
      }
    ],
    ["path", { d: "M8 16h.01", key: "18s6g9" }]
  ]
};
__iconData$M.node;
const Factory = createLucideIcon(__iconData$M);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$L = {
  name: "file-text",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
        key: "1oefj6"
      }
    ],
    ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
    ["path", { d: "M10 9H8", key: "b1mrlr" }],
    ["path", { d: "M16 13H8", key: "t4e002" }],
    ["path", { d: "M16 17H8", key: "z1uh3a" }]
  ]
};
__iconData$L.node;
const FileText = createLucideIcon(__iconData$L);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$K = {
  name: "file",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
        key: "1oefj6"
      }
    ],
    ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }]
  ]
};
__iconData$K.node;
const File = createLucideIcon(__iconData$K);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$J = {
  name: "folder-open",
  size: 24,
  node: [
    [
      "path",
      {
        d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
        key: "usdka0"
      }
    ]
  ]
};
__iconData$J.node;
const FolderOpen = createLucideIcon(__iconData$J);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$I = {
  name: "globe",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20", key: "13o1zl" }],
    ["path", { d: "M2 12h20", key: "9i4pu4" }]
  ]
};
__iconData$I.node;
const Globe = createLucideIcon(__iconData$I);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$H = {
  name: "grid-3x3",
  size: 24,
  node: [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
    ["path", { d: "M3 9h18", key: "1pudct" }],
    ["path", { d: "M3 15h18", key: "5xshup" }],
    ["path", { d: "M9 3v18", key: "fh3hqa" }],
    ["path", { d: "M15 3v18", key: "14nvp0" }]
  ],
  aliases: ["grid", "grid-3-x-3"]
};
__iconData$H.node;
const Grid3x3 = createLucideIcon(__iconData$H);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$G = {
  name: "hard-drive-download",
  size: 24,
  node: [
    ["path", { d: "M12 2v8", key: "1q4o3n" }],
    ["path", { d: "m16 6-4 4-4-4", key: "6wukr" }],
    ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2", key: "w68u3i" }],
    ["path", { d: "M6 18h.01", key: "uhywen" }],
    ["path", { d: "M10 18h.01", key: "h775k" }]
  ]
};
__iconData$G.node;
const HardDriveDownload = createLucideIcon(__iconData$G);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$F = {
  name: "hard-drive",
  size: 24,
  node: [
    ["path", { d: "M10 16h.01", key: "1bzywj" }],
    [
      "path",
      {
        d: "M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
        key: "18tbho"
      }
    ],
    ["path", { d: "M21.946 12.013H2.054", key: "zqlbp7" }],
    ["path", { d: "M6 16h.01", key: "1pmjb7" }]
  ]
};
__iconData$F.node;
const HardDrive = createLucideIcon(__iconData$F);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$E = {
  name: "house",
  size: 24,
  node: [
    ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
    [
      "path",
      {
        d: "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        key: "r6nss1"
      }
    ]
  ],
  aliases: ["home"]
};
__iconData$E.node;
const House = createLucideIcon(__iconData$E);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$D = {
  name: "info",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
    ["path", { d: "M12 16v-4", key: "1dtifu" }],
    ["path", { d: "M12 8h.01", key: "e9boi3" }]
  ]
};
__iconData$D.node;
const Info = createLucideIcon(__iconData$D);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$C = {
  name: "key",
  size: 24,
  node: [
    ["path", { d: "m2 21 9.6-9.6", key: "9l79m3" }],
    [
      "path",
      { d: "m7.5 15.5 2.3 2.3a1 1 0 0 1 0 1.4l-2.1 2.1a1 1 0 0 1-1.4 0L4 19", key: "fw8biw" }
    ],
    ["circle", { cx: "15.5", cy: "7.5", r: "5.5", key: "4wxmhb" }]
  ]
};
__iconData$C.node;
const Key = createLucideIcon(__iconData$C);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$B = {
  name: "link",
  size: 24,
  node: [
    ["path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71", key: "1cjeqo" }],
    ["path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71", key: "19qd67" }]
  ]
};
__iconData$B.node;
const Link = createLucideIcon(__iconData$B);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$A = {
  name: "loader-circle",
  size: 24,
  node: [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]],
  aliases: ["loader-2"]
};
__iconData$A.node;
const LoaderCircle = createLucideIcon(__iconData$A);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$z = {
  name: "maximize",
  size: 24,
  node: [
    ["path", { d: "M8 3H5a2 2 0 0 0-2 2v3", key: "1dcmit" }],
    ["path", { d: "M21 8V5a2 2 0 0 0-2-2h-3", key: "1e4gt3" }],
    ["path", { d: "M3 16v3a2 2 0 0 0 2 2h3", key: "wsl5sc" }],
    ["path", { d: "M16 21h3a2 2 0 0 0 2-2v-3", key: "18trek" }]
  ]
};
__iconData$z.node;
const Maximize = createLucideIcon(__iconData$z);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$y = {
  name: "message-square",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
        key: "18887p"
      }
    ]
  ]
};
__iconData$y.node;
const MessageSquare = createLucideIcon(__iconData$y);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$x = {
  name: "minimize",
  size: 24,
  node: [
    ["path", { d: "M8 3v3a2 2 0 0 1-2 2H3", key: "hohbtr" }],
    ["path", { d: "M21 8h-3a2 2 0 0 1-2-2V3", key: "5jw1f3" }],
    ["path", { d: "M3 16h3a2 2 0 0 1 2 2v3", key: "198tvr" }],
    ["path", { d: "M16 21v-3a2 2 0 0 1 2-2h3", key: "ph8mxp" }]
  ]
};
__iconData$x.node;
const Minimize = createLucideIcon(__iconData$x);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$w = {
  name: "minus",
  size: 24,
  node: [["path", { d: "M5 12h14", key: "1ays0h" }]]
};
__iconData$w.node;
const Minus = createLucideIcon(__iconData$w);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$v = {
  name: "monitor-play",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M15.033 9.44a.647.647 0 0 1 0 1.12l-4.065 2.352a.645.645 0 0 1-.968-.56V7.648a.645.645 0 0 1 .967-.56z",
        key: "vbtd3f"
      }
    ],
    ["path", { d: "M12 17v4", key: "1riwvh" }],
    ["path", { d: "M8 21h8", key: "1ev6f3" }],
    ["rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", key: "x3v2xh" }]
  ]
};
__iconData$v.node;
const MonitorPlay = createLucideIcon(__iconData$v);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$u = {
  name: "monitor",
  size: 24,
  node: [
    ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2", key: "48i651" }],
    ["line", { x1: "8", x2: "16", y1: "21", y2: "21", key: "1svkeh" }],
    ["line", { x1: "12", x2: "12", y1: "17", y2: "21", key: "vw1qmm" }]
  ]
};
__iconData$u.node;
const Monitor = createLucideIcon(__iconData$u);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$t = {
  name: "package",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
        key: "1a0edw"
      }
    ],
    ["path", { d: "M12 22V12", key: "d0xqtd" }],
    ["polyline", { points: "3.29 7 12 12 20.71 7", key: "ousv84" }],
    ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
  ]
};
__iconData$t.node;
const Package = createLucideIcon(__iconData$t);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$s = {
  name: "pause",
  size: 24,
  node: [
    ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
    ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
  ]
};
__iconData$s.node;
const Pause = createLucideIcon(__iconData$s);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$r = {
  name: "pen-line",
  size: 24,
  node: [
    ["path", { d: "M13 21h8", key: "1jsn5i" }],
    [
      "path",
      {
        d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
        key: "1a8usu"
      }
    ]
  ],
  aliases: ["edit-3"]
};
__iconData$r.node;
const PenLine = createLucideIcon(__iconData$r);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$q = {
  name: "play",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
        key: "10ikf1"
      }
    ]
  ]
};
__iconData$q.node;
const Play = createLucideIcon(__iconData$q);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$p = {
  name: "plus",
  size: 24,
  node: [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }]
  ]
};
__iconData$p.node;
const Plus = createLucideIcon(__iconData$p);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$o = {
  name: "power",
  size: 24,
  node: [
    ["path", { d: "M12 2v10", key: "mnfbl" }],
    ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04", key: "obofu9" }]
  ]
};
__iconData$o.node;
const Power = createLucideIcon(__iconData$o);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$n = {
  name: "puzzle",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z",
        key: "w46dr5"
      }
    ]
  ]
};
__iconData$n.node;
const Puzzle = createLucideIcon(__iconData$n);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$m = {
  name: "refresh-cw",
  size: 24,
  node: [
    ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
    ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
    ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
    ["path", { d: "M8 16H3v5", key: "1cv678" }]
  ]
};
__iconData$m.node;
const RefreshCw = createLucideIcon(__iconData$m);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$l = {
  name: "rocket",
  size: 24,
  node: [
    ["path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5", key: "qeys4" }],
    [
      "path",
      {
        d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09",
        key: "u4xsad"
      }
    ],
    [
      "path",
      {
        d: "M9 12a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.4 22.4 0 0 1-4 2z",
        key: "676m9"
      }
    ],
    ["path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 .05 5 .05", key: "92ym6u" }]
  ]
};
__iconData$l.node;
const Rocket = createLucideIcon(__iconData$l);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$k = {
  name: "rotate-ccw",
  size: 24,
  node: [
    ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
    ["path", { d: "M3 3v5h5", key: "1xhq8a" }]
  ]
};
__iconData$k.node;
const RotateCcw = createLucideIcon(__iconData$k);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$j = {
  name: "save",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
        key: "1c8476"
      }
    ],
    ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
    ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
  ]
};
__iconData$j.node;
const Save = createLucideIcon(__iconData$j);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$i = {
  name: "search",
  size: 24,
  node: [
    ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
    ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
  ]
};
__iconData$i.node;
const Search = createLucideIcon(__iconData$i);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$h = {
  name: "send",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
        key: "1ffxy3"
      }
    ],
    ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
  ]
};
__iconData$h.node;
const Send = createLucideIcon(__iconData$h);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$g = {
  name: "settings",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
        key: "1i5ecw"
      }
    ],
    ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
  ]
};
__iconData$g.node;
const Settings = createLucideIcon(__iconData$g);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$f = {
  name: "shield-check",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y"
      }
    ],
    ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
  ]
};
__iconData$f.node;
const ShieldCheck = createLucideIcon(__iconData$f);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$e = {
  name: "shield",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y"
      }
    ]
  ]
};
__iconData$e.node;
const Shield = createLucideIcon(__iconData$e);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$d = {
  name: "smartphone",
  size: 24,
  node: [
    ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2", key: "1yt0o3" }],
    ["path", { d: "M12 18h.01", key: "mhygvu" }]
  ]
};
__iconData$d.node;
const Smartphone = createLucideIcon(__iconData$d);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$c = {
  name: "square",
  size: 24,
  node: [["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]]
};
__iconData$c.node;
const Square = createLucideIcon(__iconData$c);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$b = {
  name: "sun",
  size: 24,
  node: [
    ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
    ["path", { d: "M12 2v2", key: "tus03m" }],
    ["path", { d: "M12 20v2", key: "1lh1kg" }],
    ["path", { d: "m4.93 4.93 1.41 1.41", key: "149t6j" }],
    ["path", { d: "m17.66 17.66 1.41 1.41", key: "ptbguv" }],
    ["path", { d: "M2 12h2", key: "1t8f8n" }],
    ["path", { d: "M20 12h2", key: "1q8mjw" }],
    ["path", { d: "m6.34 17.66-1.41 1.41", key: "1m8zz5" }],
    ["path", { d: "m19.07 4.93-1.41 1.41", key: "1shlcs" }]
  ]
};
__iconData$b.node;
const Sun = createLucideIcon(__iconData$b);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$a = {
  name: "terminal",
  size: 24,
  node: [
    ["path", { d: "M12 19h8", key: "baeox8" }],
    ["path", { d: "m4 17 6-6-6-6", key: "1yngyt" }]
  ]
};
__iconData$a.node;
const Terminal = createLucideIcon(__iconData$a);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$9 = {
  name: "toggle-left",
  size: 24,
  node: [
    ["circle", { cx: "9", cy: "12", r: "3", key: "u3jwor" }],
    ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "7", key: "g7kal2" }]
  ]
};
__iconData$9.node;
const ToggleLeft = createLucideIcon(__iconData$9);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$8 = {
  name: "toggle-right",
  size: 24,
  node: [
    ["circle", { cx: "15", cy: "12", r: "3", key: "1afu0r" }],
    ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "7", key: "g7kal2" }]
  ]
};
__iconData$8.node;
const ToggleRight = createLucideIcon(__iconData$8);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$7 = {
  name: "trash",
  size: 24,
  node: [
    ["path", { d: "M10 11v6", key: "nco0om" }],
    ["path", { d: "M14 11v6", key: "outv1u" }],
    ["path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6", key: "miytrc" }],
    ["path", { d: "M3 6h18", key: "d0wm0j" }],
    ["path", { d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2", key: "e791ji" }]
  ],
  aliases: ["trash-2"]
};
__iconData$7.node;
const Trash = createLucideIcon(__iconData$7);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$6 = {
  name: "triangle-exclamation-point",
  size: 24,
  node: [
    [
      "path",
      {
        d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
        key: "wmoenq"
      }
    ],
    ["path", { d: "M12 9v4", key: "juzpu7" }],
    ["path", { d: "M12 17h.01", key: "p32p05" }]
  ],
  aliases: ["alert-triangle", "triangle-alert"]
};
__iconData$6.node;
const TriangleExclamationPoint = createLucideIcon(__iconData$6);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$5 = {
  name: "upload",
  size: 24,
  node: [
    ["path", { d: "M12 3v12", key: "1x0j5s" }],
    ["path", { d: "m17 8-5-5-5 5", key: "7q97r8" }],
    ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }]
  ]
};
__iconData$5.node;
const Upload = createLucideIcon(__iconData$5);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$4 = {
  name: "wifi-off",
  size: 24,
  node: [
    ["path", { d: "M12 20h.01", key: "zekei9" }],
    ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }],
    ["path", { d: "M5 12.859a10 10 0 0 1 5.17-2.69", key: "1dl1wf" }],
    ["path", { d: "M19 12.859a10 10 0 0 0-2.007-1.523", key: "4k23kn" }],
    ["path", { d: "M2 8.82a15 15 0 0 1 4.177-2.643", key: "1grhjp" }],
    ["path", { d: "M22 8.82a15 15 0 0 0-11.288-3.764", key: "z3jwby" }],
    ["path", { d: "m2 2 20 20", key: "1ooewy" }]
  ]
};
__iconData$4.node;
const WifiOff = createLucideIcon(__iconData$4);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$3 = {
  name: "wifi",
  size: 24,
  node: [
    ["path", { d: "M12 20h.01", key: "zekei9" }],
    ["path", { d: "M2 8.82a15 15 0 0 1 20 0", key: "dnpr2z" }],
    ["path", { d: "M5 12.859a10 10 0 0 1 14 0", key: "1x1e6c" }],
    ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }]
  ]
};
__iconData$3.node;
const Wifi = createLucideIcon(__iconData$3);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$2 = {
  name: "wrench",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",
        key: "1ngwbx"
      }
    ]
  ]
};
__iconData$2.node;
const Wrench = createLucideIcon(__iconData$2);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData$1 = {
  name: "x",
  size: 24,
  node: [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
  ]
};
__iconData$1.node;
const X = createLucideIcon(__iconData$1);
/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconData = {
  name: "zap",
  size: 24,
  node: [
    [
      "path",
      {
        d: "M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z",
        key: "1v7up4"
      }
    ]
  ]
};
__iconData.node;
const Zap = createLucideIcon(__iconData);
const api = window.api;
function TitleBar({ title = "iMooAgentTool" }) {
  const [isMaximized, setIsMaximized] = reactExports.useState(false);
  reactExports.useEffect(() => {
    api.system.windowIsMaximized().then(setIsMaximized).catch(() => {
    });
    const unsub = api.system.onWindowState((maximized) => setIsMaximized(maximized));
    return () => unsub();
  }, []);
  const handleMinimize = reactExports.useCallback(() => {
    void api.system.windowMinimize();
  }, []);
  const handleToggleMaximize = reactExports.useCallback(() => {
    void api.system.windowToggleMaximize();
  }, []);
  const handleClose = reactExports.useCallback(() => {
    void api.system.windowClose();
  }, []);
  const drag = { WebkitAppRegion: "drag" };
  const noDrag = { WebkitAppRegion: "no-drag" };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center h-10 bg-slate-900/95 border-b border-slate-700/50 select-none", style: drag, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-4 flex-1", style: drag, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3 rounded-full bg-blue-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-slate-300 tracking-wide", children: title })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full", style: noDrag, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleMinimize, className: "h-full px-4 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Minus, { size: 16 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleToggleMaximize, className: "h-full px-4 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-colors", children: isMaximized ? /* @__PURE__ */ jsxRuntimeExports.jsx(Minimize, { size: 16 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize, { size: 16 }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleClose, className: "h-full px-4 text-slate-400 hover:text-white hover:bg-red-600 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 }) })
    ] })
  ] });
}
const appIcon = "" + new URL("icon-ClTDAJzK.png", import.meta.url).href;
const menuItems = [
  { id: "home", label: "主页", icon: Smartphone, path: "/", category: "设备工具" },
  { id: "reboot", label: "重启模式", icon: RefreshCw, path: "/reboot", category: "设备工具" },
  { id: "cloud", label: "资源管理", icon: Cloud, path: "/cloud", category: "设备工具" },
  { id: "root", label: "Root 工具", icon: Shield, path: "/root", category: "设备工具" },
  { id: "files", label: "文件管理", icon: File, path: "/files", category: "文件管理" },
  { id: "apps", label: "应用管理", icon: Grid3x3, path: "/apps", category: "文件管理" },
  { id: "tools", label: "工具箱", icon: Wrench, path: "/tools", category: "系统工具" },
  { id: "cast", label: "投屏控制", icon: MonitorPlay, path: "/cast", category: "系统工具" },
  { id: "magisk", label: "Magisk", icon: Database, path: "/magisk", category: "系统工具" },
  { id: "backup", label: "备份恢复", icon: HardDrive, path: "/backup", category: "系统工具" },
  { id: "edl-partitions", label: "EDL 分区", icon: Terminal, path: "/edl-partitions", category: "其他" },
  { id: "settings", label: "设置", icon: Settings, path: "/settings", category: "其他" },
  { id: "logs", label: "日志", icon: Terminal, path: "/logs", category: "其他" }
];
const categories = ["设备工具", "文件管理", "系统工具", "其他"];
const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api2 = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api2);
  return api2;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
const identity = (arg) => arg;
function useStore(api2, selector = identity) {
  const slice = React.useSyncExternalStore(
    api2.subscribe,
    React.useCallback(() => selector(api2.getState()), [api2, selector]),
    () => selector(api2.getInitialState())
  );
  React.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api2 = createStore(createState);
  const useBoundStore = (selector) => useStore(api2, selector);
  Object.assign(useBoundStore, api2);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;
const useDeviceStore = create((set) => ({
  currentDevice: null,
  isMonitoring: false,
  setDevice: (device) => set({ currentDevice: device }),
  startMonitoring: () => set({ isMonitoring: true }),
  stopMonitoring: () => set({ isMonitoring: false })
}));
function useDevice() {
  const currentDevice = useDeviceStore((s) => s.currentDevice);
  const setDevice = useDeviceStore((s) => s.setDevice);
  reactExports.useEffect(() => {
    api.device.current().then(setDevice).catch(() => setDevice(null));
    const unsub = api.device.onChange((info) => setDevice(info));
    return () => unsub();
  }, [setDevice]);
  return currentDevice;
}
const modelMap = {
  I13: { displayName: "Z6", platform: "otherpass" },
  I13C: { displayName: "Z6C", platform: "otherpass" },
  I18: { displayName: "Z6", platform: "otherpass" },
  I20: { displayName: "Z7 3G", platform: "otherpass" },
  I25: { displayName: "Z7", platform: "otherpass" },
  I25C: { displayName: "Z7A", platform: "otherpass" },
  I25D: { displayName: "Z7S", platform: "otherpass" },
  I32: { displayName: "Z8", platform: "otherpass" },
  I33: { displayName: "Z8 Pro", platform: "otherpass" },
  ND01: { displayName: "Z9", platform: "v3pash" },
  ND03: { displayName: "Z10", platform: "z10" },
  ND07: { displayName: "Z10", platform: "z10" },
  ND08: { displayName: "Z11", platform: "z10" },
  ND09: { displayName: "Z11", platform: "z10" }
};
function getDisplayName(innermodel) {
  return modelMap[innermodel]?.displayName ?? innermodel;
}
function getAllModels() {
  return Object.entries(modelMap);
}
const deviceTypeColors = {
  adb: "text-green-400",
  fastboot: "text-blue-400",
  qcom_edl: "text-purple-400",
  sprd_edl: "text-purple-400",
  emulator: "text-yellow-400",
  unauthorized: "text-orange-400",
  offline: "text-red-400"
};
const deviceTypeLabels = {
  adb: "ADB",
  fastboot: "Fastboot",
  qcom_edl: "EDL (QCOM)",
  sprd_edl: "EDL (SPRD)",
  emulator: "模拟器",
  unauthorized: "未授权",
  offline: "离线"
};
function Sidebar() {
  const device = useDevice();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-56 flex flex-col bg-slate-900/80 border-r border-slate-700/50 h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-16 flex items-center gap-2 px-4 border-b border-slate-700/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: appIcon, alt: "iMooAgentTool", className: "w-8 h-8 rounded-lg object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-white truncate", children: "iMooAgentTool" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-slate-500", children: "XTC Toolbox" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto scrollbar-thin py-2", children: categories.map((category) => {
      const items = menuItems.filter((m2) => m2.category === category);
      if (items.length === 0) return null;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500", children: category }),
        items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          NavLink,
          {
            to: item.path,
            end: item.path === "/",
            className: ({ isActive }) => `flex items-center gap-3 px-4 py-2 mx-2 rounded-lg text-sm transition-colors ${isActive ? "bg-blue-600/20 text-blue-400 font-medium" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { size: 18 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
            ]
          },
          item.id
        ))
      ] }, category);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-slate-700/50 p-3", children: device ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 18, className: deviceTypeColors[device.type] ?? "text-slate-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${device.type === "adb" ? "bg-green-500" : "bg-yellow-500"}` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-slate-300 truncate", children: getDisplayName(device.innermodel ?? "") || device.model || device.serial }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-slate-500 truncate", children: [
          deviceTypeLabels[device.type] ?? device.type,
          " - ",
          device.serial?.slice(0, 8),
          "..."
        ] })
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-slate-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { size: 16 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: "未检测到设备" })
    ] }) })
  ] });
}
function AppShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-screen w-screen flex flex-col bg-[#0f0f1a] overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TitleBar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto scrollbar-thin bg-[#0f0f1a]", children })
    ] })
  ] });
}
function SplashScreen({ message = "加载中..." }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-[#0f0f1a] flex flex-col items-center justify-center z-[9999]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 h-20 rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center shadow-lg shadow-blue-500/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: appIcon, alt: "iMooAgentTool", className: "w-full h-full object-cover" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "text-white animate-spin" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white tracking-wide", children: "iMooAgentTool" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mt-1", children: "XTC 电话手表工具箱" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-slate-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { size: 14, className: "animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: message })
    ] })
  ] }) });
}
function DisclaimerModal({ onAccept, onDecline }) {
  const [accepted, setAccepted] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-content max-w-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleExclamationPoint, { size: 22, className: "text-yellow-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-white", children: "免责声明" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900/50 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto scrollbar-thin text-sm text-slate-300 leading-relaxed space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "本软件 (iMooAgentTool) 是一款用于 XTC 电话手表的工具箱软件，由社区开发者提供。 使用本软件可能对设备进行系统级操作，包括但不限于获取 Root 权限、修改系统分区、 刷写固件等操作。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { className: "text-yellow-400", children: "重要提示：" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "使用本软件可能导致设备保修失效" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "操作不当可能导致设备变砖、数据丢失" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "请确保您已备份重要数据" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "请确保设备电量充足（建议 50% 以上）" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "请自行承担操作风险" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "继续使用本软件即表示您已阅读、理解并同意以上条款。 作者及贡献者对因使用本软件造成的任何损失概不负责。" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "checkbox",
          checked: accepted,
          onChange: (e) => setAccepted(e.target.checked),
          className: "w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-300", children: "我已阅读并同意以上声明，愿自行承担所有风险" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
      onDecline && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onDecline, className: "btn-secondary", children: "退出" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onAccept, disabled: !accepted, className: "btn-primary", children: "同意并继续" })
    ] })
  ] }) }) });
}
function EulaModal({ onAccept, onDecline }) {
  const [accepted, setAccepted] = reactExports.useState(false);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-content max-w-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 22, className: "text-blue-400" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-white", children: "最终用户许可协议" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-900/50 rounded-lg p-4 mb-4 max-h-64 overflow-y-auto scrollbar-thin text-sm text-slate-300 leading-relaxed space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "iMooAgentTool 最终用户许可协议 (EULA)" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "版本 1.0 | 最后更新: 2026-06-18" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "1. 许可授予" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "本软件基于 GPL-3.0 开源协议发布。您可以自由使用、修改和分发本软件， 但必须遵守 GPL-3.0 协议的相关条款。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "2. 免责条款" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: '本软件按"现状"提供，不提供任何明示或暗示的担保。 在适用法律允许的最大范围内，作者不对因使用或无法使用本软件所造成的任何损害承担责任。' }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "3. 使用限制" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc pl-5 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "禁止将本软件用于非法目的" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "禁止移除或修改本软件的版权声明" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "禁止将本软件用于任何侵犯第三方权益的行为" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "4. 知识产权" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "本软件及其所有相关组件的知识产权归原作者所有。 本协议不授予任何商标或版权所有权。" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "checkbox",
          checked: accepted,
          onChange: (e) => setAccepted(e.target.checked),
          className: "w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-300", children: "我已阅读并同意本许可协议" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-end", children: [
      onDecline && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onDecline, className: "btn-secondary", children: "拒绝" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onAccept, disabled: !accepted, className: "btn-primary", children: "同意" })
    ] })
  ] }) }) });
}
const ToastContext = reactExports.createContext(null);
const icons = {
  success: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { size: 20, className: "text-green-400" }),
  error: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { size: 20, className: "text-red-400" }),
  info: /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { size: 20, className: "text-blue-400" })
};
const bgColors = {
  success: "border-green-500/30 bg-green-500/10",
  error: "border-red-500/30 bg-red-500/10",
  info: "border-blue-500/30 bg-blue-500/10"
};
function ToastItem({ toast: t2, onDismiss }) {
  reactExports.useEffect(() => {
    if (t2.duration === 0) return;
    const timer = setTimeout(() => onDismiss(t2.id), t2.duration ?? 4e3);
    return () => clearTimeout(timer);
  }, [t2, onDismiss]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `flex items-start gap-3 p-4 rounded-lg border backdrop-blur-md shadow-lg ${bgColors[t2.type]} animate-in slide-in-from-right`,
      style: { animation: "slideIn 0.3s ease-out" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-0.5", children: icons[t2.type] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-slate-200", children: t2.title }),
          t2.message && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: t2.message })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onDismiss(t2.id), className: "flex-shrink-0 text-slate-500 hover:text-slate-300 transition-colors", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 16 }) })
      ]
    }
  );
}
function Toaster({ children }) {
  const [toasts, setToasts] = reactExports.useState([]);
  const dismiss = reactExports.useCallback((id2) => {
    setToasts((prev) => prev.filter((t2) => t2.id !== id2));
  }, []);
  const addToast = reactExports.useCallback((type, title, message, duration) => {
    const id2 = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id: id2, type, title, message, duration }]);
  }, []);
  const toast = {
    toast: addToast,
    success: (title, message) => addToast("success", title, message),
    error: (title, message) => addToast("error", title, message),
    info: (title, message) => addToast("info", title, message)
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(ToastContext.Provider, { value: toast, children: [
    children,
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed top-14 right-4 z-[9999] flex flex-col gap-2 w-80 pointer-events-none", children: toasts.map((t2) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ToastItem, { toast: t2, onDismiss: dismiss }) }, t2.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100%); }
          to { opacity: 1; transform: translateX(0); }
        }
      ` })
  ] });
}
class ErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.handleRetry = () => {
      this.setState({ hasError: false, error: null });
    };
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full min-h-[200px]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card p-6 max-w-md mx-auto text-center space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleExclamationPoint, { className: "w-10 h-10 text-red-400 mx-auto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white", children: "请求异常" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 break-all", children: this.state.error?.message || "未知错误" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: this.handleRetry, className: "btn-primary inline-flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
          "重试"
        ] })
      ] }) });
    }
    return this.props.children;
  }
}
class AppErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.handleReload = () => {
      window.location.reload();
    };
    this.handleReset = () => {
      this.setState({ hasError: false, error: null, errorInfo: null });
    };
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    this.setState({ errorInfo: info });
    console.error("AppErrorBoundary:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-slate-900 flex items-center justify-center z-[99999]", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-lg mx-4 text-center space-y-5 shadow-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bug, { className: "w-8 h-8 text-red-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-white", children: "应用发生错误" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "应用程序遇到了意外错误，请尝试刷新页面或重启应用。" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-900/50 rounded-lg p-3 text-left max-h-24 overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-red-300 font-mono break-all", children: [
          this.state.error?.name,
          ": ",
          this.state.error?.message
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 justify-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: this.handleReset, className: "btn-secondary inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
            "重试"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: this.handleReload, className: "btn-primary inline-flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
            "刷新页面"
          ] })
        ] })
      ] }) });
    }
    return this.props.children;
  }
}
async function searchFeatures(query) {
  return window.api.agent.search(query);
}
async function getAgentConfig() {
  return window.api.agent.getConfig();
}
async function setAgentConfig(config) {
  return window.api.agent.setConfig(config);
}
async function testAgentConnection() {
  return window.api.agent.testConnection();
}
async function chatWithAI(messages) {
  return window.api.agent.chat(messages);
}
const useAgentStore = create((set, get) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  modelName: "",
  mode: "search",
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setMode: (mode) => set({ mode, messages: [] }),
  sendMessage: async (content) => {
    const userMsg = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content
    };
    get().addMessage(userMsg);
    set({ isLoading: true });
    const mode = get().mode;
    try {
      if (mode === "search") {
        const result = await searchFeatures(content);
        const assistantMsg = {
          id: `msg-${Date.now()}-assistant`,
          role: "assistant",
          content: result.matches.length > 0 ? `我找到了 ${result.matches.length} 个相关功能：` : "抱歉，没有找到与您查询相关的功能。请尝试其他关键词。",
          features: result.matches.map((m2) => ({
            featurePath: m2.path,
            featureName: m2.name,
            explanation: m2.explanation,
            confidence: m2.confidence
          })),
          aiPowered: result.aiPowered,
          modelName: result.aiPowered ? get().modelName : void 0
        };
        get().addMessage(assistantMsg);
      } else {
        const messages = get().messages.map((m2) => ({
          role: m2.role,
          content: m2.content
        }));
        const result = await chatWithAI(messages);
        const assistantMsg = {
          id: `msg-${Date.now()}-assistant`,
          role: "assistant",
          content: result.reply
        };
        get().addMessage(assistantMsg);
      }
    } catch (err) {
      get().addMessage({
        id: `msg-${Date.now()}-error`,
        role: "assistant",
        content: err.message || "操作时出现错误，请稍后重试。"
      });
    }
    set({ isLoading: false });
  },
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
  loadModelName: async () => {
    try {
      const cfg = await getAgentConfig();
      set({ modelName: cfg.agentModel || "" });
    } catch {
      set({ modelName: "" });
    }
  }
}));
function AgentButton() {
  const { isOpen, toggle } = useAgentStore();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick: toggle,
      className: `fixed bottom-4 right-4 z-[9999] w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${isOpen ? "bg-blue-600 hover:bg-blue-700 ring-2 ring-blue-400/50" : "bg-slate-700 hover:bg-slate-600 border border-slate-600"}`,
      title: "AI 助手",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-5 h-5 text-white" })
    }
  );
}
function AgentPanel() {
  const navigate = useNavigate();
  const { isOpen, messages, isLoading, mode, close, sendMessage, clearMessages, loadModelName, modelName, setMode } = useAgentStore();
  const inputRef = reactExports.useRef(null);
  const listRef = reactExports.useRef(null);
  const [draft, setDraft] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);
  reactExports.useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);
  reactExports.useEffect(() => {
    loadModelName();
  }, [loadModelName]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const val = draft.trim();
    if (!val || isLoading) return;
    sendMessage(val);
    setDraft("");
  };
  const handleNavigate = (path) => {
    navigate(path);
    close();
  };
  const handleGoSettings = () => {
    navigate("/settings");
    close();
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed bottom-20 right-4 z-[9998] w-80 sm:w-96", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-5 h-5 text-blue-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-semibold text-white", children: "AI 助手" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: clearMessages, className: "text-xs text-slate-500 hover:text-slate-300 px-2 py-1 rounded hover:bg-slate-700/50", children: "清除" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: close, className: "text-slate-500 hover:text-slate-300 p-1 rounded hover:bg-slate-700/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex border-b border-slate-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setMode("search"),
          className: `flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${mode === "search" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-500 hover:text-slate-300"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-3.5 h-3.5" }),
            "搜索功能"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setMode("chat"),
          className: `flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium transition-colors ${mode === "chat" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-500 hover:text-slate-300"}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MessageSquare, { className: "w-3.5 h-3.5" }),
            "自由对话"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: listRef, className: "flex-1 overflow-y-auto p-3 space-y-3 min-h-[280px] max-h-[360px]", children: [
      messages.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-10 h-10 text-slate-600 mx-auto mb-3" }),
        mode === "search" ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "输入关键词搜索功能" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "例如：重启、备份、Root" })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "开始与 AI 自由对话" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-600 mt-1", children: "询问任何关于 iMooAgentTool 的问题" })
        ] }),
        !modelName && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleGoSettings,
            className: "mt-4 flex items-center gap-1.5 mx-auto px-3 py-1.5 rounded-lg text-xs bg-slate-700/50 text-blue-400 hover:text-blue-300 hover:bg-slate-700 transition-colors",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-3.5 h-3.5" }),
              "配置 AI Agent"
            ]
          }
        )
      ] }),
      messages.map((msg) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `max-w-[85%] ${msg.role === "user" ? "bg-blue-500/20 border border-blue-500/20" : "bg-slate-700/50 border border-slate-600/30"} rounded-lg p-3`, children: [
        msg.role === "assistant" && msg.features && msg.features.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 mb-2", children: msg.aiPowered ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/20", children: "AI" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-600/50 text-slate-400 border border-slate-500/30", children: "关键词" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-200 whitespace-pre-wrap", children: msg.content }),
        msg.features && msg.features.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 space-y-2", children: msg.features.map((f2, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-slate-800/80 rounded-lg p-2.5 border border-slate-600/30", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-blue-300", children: f2.featureName }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => handleNavigate(f2.featurePath),
                className: "text-xs text-blue-400 hover:text-blue-300 flex items-center gap-0.5",
                children: [
                  "前往 ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" })
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-1", children: f2.explanation }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: `h-full rounded-full transition-all ${f2.confidence >= 70 ? "bg-green-500" : f2.confidence >= 40 ? "bg-yellow-500" : "bg-slate-500"}`,
                style: { width: `${f2.confidence}%` }
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500", children: [
              f2.confidence,
              "%"
            ] })
          ] })
        ] }, i)) }),
        msg.role === "assistant" && msg.aiPowered && msg.modelName && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-600", children: [
          "Powered by ",
          msg.modelName
        ] }) })
      ] }) }, msg.id)),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-start", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-slate-700/50 border border-slate-600/30 rounded-lg p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 text-blue-400 animate-spin" }) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("form", { onSubmit: handleSubmit, className: "p-3 border-t border-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          ref: inputRef,
          type: "text",
          placeholder: mode === "search" ? "搜索功能..." : "输入消息...",
          className: "flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50",
          disabled: isLoading,
          value: draft,
          onChange: (e) => setDraft(e.target.value)
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "submit",
          disabled: isLoading || !draft.trim(),
          className: "bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg px-3 py-2 transition-colors",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4" })
        }
      )
    ] }) })
  ] }) });
}
const DEFAULT_SETTINGS = {
  windowOpacity: 100,
  speedStart: false,
  checkUpdateTime: 1,
  detailedLog: false,
  infoEn: false,
  onUserDebug: false,
  showDisclaimerOnStart: true,
  agentApiUrl: "",
  agentApiKey: "",
  agentModel: "gpt-4o-mini",
  agentEnabled: false
};
const APP_META = {
  version: "1.1.1",
  copyright: "Copyright (C) 2026 J1ao",
  basedOn: "AllToolBox 1.3.8fix1（业务逻辑参考）"
};
const useSettingsStore = create((set, get) => ({
  settings: { ...DEFAULT_SETTINGS },
  loaded: false,
  load: async () => {
    try {
      const result = await api.system.getSettings();
      if (result && result.error) {
        set({ settings: { ...DEFAULT_SETTINGS }, loaded: true });
        return;
      }
      set({ settings: result, loaded: true });
    } catch {
      set({ settings: { ...DEFAULT_SETTINGS }, loaded: true });
    }
  },
  update: async (partial) => {
    const current = get().settings;
    const merged = { ...current, ...partial };
    try {
      const result = await api.system.setSettings(partial);
      if (result && result.error) {
        set({ settings: merged });
        return;
      }
      set({ settings: result });
    } catch {
      set({ settings: merged });
    }
  },
  reset: async () => {
    try {
      const result = await api.system.setSettings({ ...DEFAULT_SETTINGS });
      if (result && result.error) {
        set({ settings: { ...DEFAULT_SETTINGS } });
        return;
      }
      set({ settings: result });
    } catch {
      set({ settings: { ...DEFAULT_SETTINGS } });
    }
  }
}));
function formatBytes(bytes) {
  if (!bytes) return "未知";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(1)} ${units[i]}`;
}
function Home() {
  const device = useDevice();
  const navigate = useNavigate();
  const [disk, setDisk] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!device?.serial) {
      setDisk(null);
      return;
    }
    api.file.diskInfo(device.serial, "/sdcard").then(setDisk).catch(() => setDisk(null));
  }, [device?.serial]);
  const actions = [
    { label: "文件管理", icon: FolderOpen, path: "/files" },
    { label: "应用管理", icon: Grid3x3, path: "/apps" },
    { label: "Root 工具", icon: Zap, path: "/root" },
    { label: "Magisk", icon: Database, path: "/magisk" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-white", children: "iMooAgentTool" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400 mt-1", children: "XTC 电话手表工具箱" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { size: 20, className: "text-blue-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white", children: "设备状态" }),
        device && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-success ml-auto", children: device.type })
      ] }),
      device ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "型号" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200", children: getDisplayName(device.innermodel ?? "") || device.model || "未知" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "内部型号" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200", children: device.innermodel || "-" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "序列号" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200 font-mono", children: device.serial })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "Android / SDK" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-200", children: [
            device.androidVersion || "-",
            " / ",
            device.sdkVersion || "-"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "软件版本" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200", children: device.softVersion || "-" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Battery, { className: "w-3.5 h-3.5" }),
            "电量"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200", children: device.batteryLevel != null ? `${device.batteryLevel}%` : "未知" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-3.5 h-3.5" }),
            "存储"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200", children: disk ? `${formatBytes(disk.used)} / ${formatBytes(disk.total)}` : "未知" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "w-3.5 h-3.5" }),
            "ABI"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200", children: device.cpuAbi || "-" })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "未检测到设备。请连接设备后重试。" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3", children: actions.map((action) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => navigate(action.path),
        className: "card flex items-center gap-3 hover:bg-slate-700/50 transition-colors text-left",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(action.icon, { className: "w-5 h-5 text-blue-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-200", children: action.label })
        ]
      },
      action.path
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white mb-2", children: "关于" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 text-sm text-slate-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "版本: ",
          APP_META.version
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: APP_META.copyright }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "业务逻辑参考 ",
          APP_META.basedOn
        ] })
      ] })
    ] })
  ] });
}
const options = [
  { mode: "system", title: "重启至系统", description: "正常重启并回到 Android 系统", icon: Power },
  { mode: "bootloader", title: "重启至 Bootloader", description: "进入 Fastboot / Bootloader 模式", icon: Wrench },
  { mode: "recovery", title: "重启至 Recovery", description: "进入设备 Recovery 分区", icon: RotateCcw },
  { mode: "edl", title: "重启至 EDL 9008", description: "进入高通 9008 深度刷机模式", icon: HardDriveDownload },
  { mode: "twrp-temp", title: "临时启动 TWRP", description: "不刷入，临时引导 TWRP Recovery", icon: Zap },
  { mode: "qmmi", title: "QMMI 诊断模式", description: "通过 misc 分区进入 QMMI", icon: Monitor },
  { mode: "ffbm", title: "FFBM 工厂模式", description: "通过 misc 分区进入工厂模式", icon: Factory },
  { mode: "wipe-data", title: "清除数据", description: "进入 Recovery 并清除 data 分区", icon: CircleX, danger: true },
  { mode: "fastbootd", title: "FastbootD", description: "进入用户空间 FastbootD 模式", icon: CircleCheckBig }
];
function Reboot() {
  const { currentDevice } = useDeviceStore();
  const [running, setRunning] = reactExports.useState(null);
  const [message, setMessage] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const handleReboot = async (option) => {
    if (!currentDevice) return;
    if (option.danger && !confirm(`${option.title} 会清除设备数据，继续？`)) return;
    setRunning(option.mode);
    setError("");
    setMessage("");
    try {
      const result = await api.reboot.execute(option.mode);
      if (result && typeof result === "object" && "error" in result) {
        setError(String(result.error));
      } else {
        setMessage(`${option.title} 指令已发送`);
      }
    } catch (e) {
      setError(e.message);
    }
    setRunning(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 overflow-y-auto h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-6 h-6 text-blue-400" }),
      "重启模式"
    ] }),
    currentDevice ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "w-5 h-5 text-green-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-medium", children: currentDevice.innermodel || currentDevice.model || "已连接设备" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "|" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: currentDevice.serial }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-success ml-auto", children: currentDevice.type })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm text-yellow-400 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleExclamationPoint, { className: "w-4 h-4" }),
      "未连接设备"
    ] }),
    message && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card text-sm text-green-400", children: message }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card text-sm text-red-400", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: options.map((option) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => handleReboot(option),
        disabled: !currentDevice || !!running,
        className: `card text-left flex items-start gap-3 hover:bg-slate-700/40 transition-colors disabled:opacity-50 ${option.danger ? "border-red-700/50" : ""}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${option.danger ? "bg-red-500/15 text-red-400" : "bg-blue-500/15 text-blue-400"}`, children: running === option.mode ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-5 h-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(option.icon, { className: "w-5 h-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-white", children: option.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-1", children: option.description })
          ] })
        ]
      },
      option.mode
    )) })
  ] });
}
function CloudPage() {
  const [resources, setResources] = reactExports.useState([]);
  const [updates, setUpdates] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [downloading, setDownloading] = reactExports.useState(null);
  const [progress, setProgress] = reactExports.useState(null);
  const [search, setSearch] = reactExports.useState("");
  const [category, setCategory] = reactExports.useState("全部");
  const [message, setMessage] = reactExports.useState("");
  const load = async () => {
    setLoading(true);
    try {
      const list = await api.cloud.list();
      setResources(Array.isArray(list) ? list : []);
    } catch (e) {
      setMessage(e.message);
    }
    setLoading(false);
  };
  reactExports.useEffect(() => {
    load();
    const unsub = api.cloud.onProgress(setProgress);
    return () => unsub();
  }, []);
  const handleDownload = async (resource) => {
    setDownloading(resource.name);
    setProgress({ current: 0, total: 100, file: resource.filename });
    try {
      const result = await api.cloud.download(resource);
      if (result && typeof result === "object" && "error" in result) {
        setMessage(String(result.error));
      } else {
        setMessage(`已下载 ${resource.name}`);
        await load();
      }
    } catch (e) {
      setMessage(e.message);
    }
    setDownloading(null);
  };
  const handleCheckUpdates = async () => {
    setLoading(true);
    try {
      const result = await api.cloud.checkUpdates();
      setUpdates(Array.isArray(result) ? result : []);
      setMessage(`检测完成：${result.filter((r2) => r2.updateAvailable).length} 项可更新`);
    } catch (e) {
      setMessage(e.message);
    }
    setLoading(false);
  };
  const categories2 = ["全部", ...Array.from(new Set(resources.map((r2) => r2.category).filter(Boolean)))];
  const filtered = resources.filter((r2) => {
    if (category !== "全部" && r2.category !== category) return false;
    if (!search.trim()) return true;
    const q2 = search.toLowerCase();
    return r2.name.toLowerCase().includes(q2) || r2.description.toLowerCase().includes(q2);
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 overflow-y-auto h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, { className: "w-6 h-6 text-blue-400" }),
        "资源管理"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleCheckUpdates, disabled: loading, className: "btn-secondary text-sm flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-4 h-4 ${loading ? "animate-spin" : ""}` }),
          "检查更新"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: load, disabled: loading, className: "btn-primary text-sm flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
          "刷新列表"
        ] })
      ] })
    ] }),
    message && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card text-sm text-slate-300", children: message }),
    progress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-300", children: progress.file }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-slate-700 rounded-full h-2 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-500 h-full rounded-full transition-all", style: { width: `${Math.min(100, progress.current)}%` } }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 min-w-[220px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 text-slate-500 absolute left-3 top-2.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input pl-9", placeholder: "搜索资源...", value: search, onChange: (e) => setSearch(e.target.value) })
      ] }),
      categories2.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setCategory(cat),
          className: `px-3 py-1.5 rounded-lg text-xs font-medium ${category === cat ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`,
          children: cat
        },
        cat
      ))
    ] }),
    loading && resources.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-6 h-6 animate-spin text-blue-400" }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card text-center py-10 text-slate-500 text-sm", children: "没有找到资源。" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: filtered.map((resource) => {
      const update = updates.find((u2) => u2.resource.name === resource.name)?.updateAvailable;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex flex-col gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-white", children: resource.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: resource.filename })
          ] }),
          resource.required ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-error", children: "必需" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-info", children: resource.category })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 flex-1", children: resource.description }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-500 space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "本地版本: ",
            resource.localVersion || "未下载"
          ] }),
          resource.cloudVersion && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "云端版本: ",
            resource.cloudVersion
          ] }),
          update && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-yellow-400 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleExclamationPoint, { className: "w-3 h-3" }),
            "有更新"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => handleDownload(resource),
              disabled: downloading === resource.name,
              className: "btn-primary text-xs flex items-center gap-1",
              children: [
                downloading === resource.name ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5" }),
                resource.localVersion ? "重新下载" : "下载"
              ]
            }
          ),
          resource.localVersion && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-green-400 flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5" }),
            "已就绪"
          ] })
        ] })
      ] }, resource.name);
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-xs text-slate-500 flex items-start gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-4 h-4 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "资源会下载并解压到应用目录；首次使用 Root、TWRP、驱动或 Xposed 前，请先在此下载对应资源。" })
    ] })
  ] });
}
function Apps() {
  const { currentDevice } = useDeviceStore();
  const [apps, setApps] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [search, setSearch] = reactExports.useState("");
  const [thirdPartyOnly, setThirdPartyOnly] = reactExports.useState(true);
  const [operating, setOperating] = reactExports.useState(null);
  const [unlockSteps, setUnlockSteps] = reactExports.useState([]);
  const [unlockResult, setUnlockResult] = reactExports.useState("");
  const serial = currentDevice?.serial ?? "";
  const loadApps = reactExports.useCallback(async () => {
    if (!serial) {
      setApps([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = thirdPartyOnly ? await api.app.list(serial) : await api.app.listAll(serial);
      setApps(Array.isArray(result) ? result : []);
    } catch (e) {
      setError(e.message);
      setApps([]);
    }
    setLoading(false);
  }, [serial, thirdPartyOnly]);
  reactExports.useEffect(() => {
    loadApps();
  }, [loadApps]);
  const handleInstall = async () => {
    if (!serial) return;
    try {
      const file = await api.system.pickFile({ kind: "open", filter: "apk" });
      if (!file) return;
      setOperating("install");
      const result = await api.app.install(serial, file);
      if (!result.success) setError(result.error || "安装失败");
      await loadApps();
    } catch (e) {
      setError(e.message);
    }
    setOperating(null);
  };
  const handleUninstall = async (pkg) => {
    if (!serial) return;
    if (!confirm(`卸载 ${pkg}？`)) return;
    setOperating(`uninstall:${pkg}`);
    try {
      const result = await api.app.uninstall(serial, pkg, false);
      if (!result.success) setError(result.error || "卸载失败");
      await loadApps();
    } catch (e) {
      setError(e.message);
    }
    setOperating(null);
  };
  const handleLaunch = async (pkg) => {
    if (!serial) return;
    setOperating(`launch:${pkg}`);
    try {
      await api.app.launch(serial, pkg);
    } catch (e) {
      setError(e.message);
    }
    setOperating(null);
  };
  const handleForceStop = async (pkg) => {
    if (!serial) return;
    setOperating(`stop:${pkg}`);
    try {
      await api.app.forceStop(serial, pkg);
    } catch (e) {
      setError(e.message);
    }
    setOperating(null);
  };
  const handleClearData = async (pkg) => {
    if (!serial) return;
    if (!confirm(`清除 ${pkg} 的全部数据？`)) return;
    setOperating(`clear:${pkg}`);
    try {
      await api.app.clearData(serial, pkg);
    } catch (e) {
      setError(e.message);
    }
    setOperating(null);
  };
  const handleUnlockZ10 = async () => {
    if (!serial) return;
    if (!confirm("Z10 解锁会修改桌面数据库并重启 zygote，继续？")) return;
    setOperating("unlock");
    setUnlockSteps([]);
    setUnlockResult("");
    try {
      const result = await api.app.unlockZ10();
      setUnlockSteps(result.steps || []);
      setUnlockResult(result.success ? "解锁完成" : result.error || "解锁失败");
    } catch (e) {
      setUnlockResult(e.message);
    }
    setOperating(null);
  };
  const handleAutostart = async () => {
    if (!serial) return;
    setOperating("autostart");
    try {
      const result = await api.app.defaultAutostart(true);
      setError(result.success ? "" : "部分应用自启动设置失败");
    } catch (e) {
      setError(e.message);
    }
    setOperating(null);
  };
  const filtered = apps.filter((app) => {
    if (!search.trim()) return true;
    const q2 = search.toLowerCase();
    return app.package.toLowerCase().includes(q2) || app.name.toLowerCase().includes(q2);
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 overflow-y-auto h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "w-6 h-6 text-blue-400" }),
        "应用管理"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: loadApps, disabled: !serial || loading, className: "btn-secondary flex items-center gap-1.5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-4 h-4 ${loading ? "animate-spin" : ""}` }),
          "刷新"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleInstall, disabled: !serial || !!operating, className: "btn-primary flex items-center gap-1.5 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
          "安装 APK"
        ] })
      ] })
    ] }),
    currentDevice ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "w-5 h-5 text-green-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-medium", children: currentDevice.innermodel || currentDevice.model || "已连接设备" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "|" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: serial }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-success ml-auto", children: currentDevice.type })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm text-yellow-400 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleExclamationPoint, { className: "w-4 h-4" }),
      "未连接设备"
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card text-red-400 text-sm", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-slate-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4" }),
          "Z10 安装限制解锁"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "替换桌面 switch.db、打开 adb 安装开关并安装配套 APK。" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleUnlockZ10, disabled: !serial || !!operating, className: "btn-primary text-sm flex items-center gap-1.5", children: [
          operating === "unlock" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Rocket, { className: "w-4 h-4" }),
          "开始解锁"
        ] }),
        unlockResult && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-300", children: unlockResult }),
        unlockSteps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 max-h-44 overflow-y-auto", children: unlockSteps.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
          step.status === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5 text-green-400" }) : step.status === "failed" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 text-red-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-3.5 h-3.5 rounded-full border border-slate-600" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300", children: step.name }),
          step.message && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 truncate", children: step.message })
        ] }, i)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-slate-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4" }),
          "开机自启"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "为 QQ、微信等常用应用设置 XTC 桌面自启动。" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleAutostart, disabled: !serial || !!operating, className: "btn-secondary text-sm flex items-center gap-1.5", children: [
          operating === "autostart" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4" }),
          "设置 QQ / 微信自启动"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4 border-b border-slate-700/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 text-slate-500 absolute left-3 top-2.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input pl-9", placeholder: "搜索应用名或包名...", value: search, onChange: (e) => setSearch(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-400 whitespace-nowrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: thirdPartyOnly, onChange: (e) => setThirdPartyOnly(e.target.checked), className: "accent-blue-500" }),
          "仅第三方"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500", children: [
          filtered.length,
          " 个"
        ] })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-6 h-6 animate-spin text-blue-400" }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-10 text-slate-500 text-sm", children: "没有找到应用。" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-slate-700/40 max-h-[520px] overflow-y-auto", children: filtered.map((app) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3 hover:bg-slate-700/20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-4 h-4 text-blue-400 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-200 truncate", children: app.name }),
            app.version && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-slate-500", children: [
              "v",
              app.version
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 font-mono truncate", children: app.package })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleLaunch(app.package), disabled: !!operating, title: "启动", className: "p-1.5 hover:bg-slate-600 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-3.5 h-3.5 text-green-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleForceStop(app.package), disabled: !!operating, title: "强制停止", className: "p-1.5 hover:bg-slate-600 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "w-3.5 h-3.5 text-yellow-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleClearData(app.package), disabled: !!operating, title: "清除数据", className: "p-1.5 hover:bg-slate-600 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eraser, { className: "w-3.5 h-3.5 text-purple-400" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleUninstall(app.package), disabled: !!operating, title: "卸载", className: "p-1.5 hover:bg-slate-600 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "w-3.5 h-3.5 text-red-400" }) })
      ] }, app.package)) })
    ] })
  ] });
}
function Files() {
  const { currentDevice } = useDeviceStore();
  const [files, setFiles] = reactExports.useState([]);
  const [currentPath, setCurrentPath] = reactExports.useState("/sdcard");
  const [quickPaths, setQuickPaths] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [searchResults, setSearchResults] = reactExports.useState([]);
  const [searching, setSearching] = reactExports.useState(false);
  const [transfer, setTransfer] = reactExports.useState(null);
  const [renameTarget, setRenameTarget] = reactExports.useState(null);
  const [newName, setNewName] = reactExports.useState("");
  const [showMkdir, setShowMkdir] = reactExports.useState(false);
  const [mkdirName, setMkdirName] = reactExports.useState("");
  const serial = currentDevice?.serial ?? "";
  const loadFiles = async (path) => {
    if (!serial) {
      setFiles([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await api.file.list(path, serial);
      setFiles(Array.isArray(result) ? result : []);
    } catch (e) {
      setError(e.message);
      setFiles([]);
    }
    setLoading(false);
  };
  reactExports.useEffect(() => {
    api.file.quickPaths().then(setQuickPaths).catch(() => {
    });
    const unsub = api.file.onTransferProgress(setTransfer);
    return () => unsub();
  }, []);
  reactExports.useEffect(() => {
    loadFiles(currentPath);
  }, [currentPath, serial]);
  const navigateTo = (path) => {
    setCurrentPath(path);
    setSearchResults([]);
    setSearchQuery("");
  };
  const navigateUp = () => {
    const parent = currentPath.replace(/\/+$/, "").split("/").slice(0, -1).join("/") || "/";
    navigateTo(parent);
  };
  const handleUpload = async () => {
    if (!serial) return;
    try {
      const file = await api.system.pickFile({ kind: "open" });
      if (!file) return;
      await api.file.push(file, currentPath, serial);
      await loadFiles(currentPath);
    } catch (e) {
      setError(e.message);
    }
  };
  const handleDownload = async (entry) => {
    if (!serial) return;
    try {
      const dir = await api.system.pickFile({ kind: "folder" });
      if (!dir) return;
      await api.file.pull(entry.path, dir, serial);
    } catch (e) {
      setError(e.message);
    }
  };
  const handleDelete = async (entry) => {
    if (!serial) return;
    if (!confirm(`删除 ${entry.name}？`)) return;
    try {
      await api.file.remove(entry.path, serial);
      await loadFiles(currentPath);
    } catch (e) {
      setError(e.message);
    }
  };
  const handleRename = async (oldPath) => {
    if (!serial || !newName.trim()) return;
    try {
      const dir = oldPath.split("/").slice(0, -1).join("/");
      await api.file.rename(oldPath, `${dir}/${newName.trim()}`, serial);
      setRenameTarget(null);
      setNewName("");
      await loadFiles(currentPath);
    } catch (e) {
      setError(e.message);
    }
  };
  const handleMkdir = async () => {
    if (!serial || !mkdirName.trim()) return;
    try {
      await api.file.mkdir(`${currentPath}/${mkdirName.trim()}`, serial);
      setShowMkdir(false);
      setMkdirName("");
      await loadFiles(currentPath);
    } catch (e) {
      setError(e.message);
    }
  };
  const handleChmod = async (entry) => {
    if (!serial) return;
    const mode = prompt("权限 (例如 755):", "755");
    if (!mode) return;
    try {
      await api.file.chmod(entry.path, mode, serial);
      await loadFiles(currentPath);
    } catch (e) {
      setError(e.message);
    }
  };
  const handleSearch = async () => {
    if (!serial || !searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await api.file.search(currentPath, searchQuery.trim(), serial);
      setSearchResults(Array.isArray(results) ? results : []);
    } catch (e) {
      setError(e.message);
    }
    setSearching(false);
  };
  const handleInstallApk = async (entry) => {
    if (!serial) return;
    try {
      const result = await api.file.installApk(entry.path, serial);
      if (!result.success) setError(result.error || "安装失败");
    } catch (e) {
      setError(e.message);
    }
  };
  const formatSize = (bytes) => {
    if (!bytes) return "-";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let size = bytes;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
  };
  const displayEntries = searchResults.length > 0 ? searchResults : files;
  const crumbs = currentPath.split("/").filter(Boolean);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4 overflow-y-auto h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-6 h-6 text-blue-400" }),
        "文件管理"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => loadFiles(currentPath), disabled: !serial, className: "btn-secondary flex items-center gap-1 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `w-4 h-4 ${loading ? "animate-spin" : ""}` }),
          "刷新"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setShowMkdir(true), disabled: !serial, className: "btn-secondary flex items-center gap-1 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
          "新建目录"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleUpload, disabled: !serial, className: "btn-primary flex items-center gap-1 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
          "上传"
        ] })
      ] })
    ] }),
    !currentDevice && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm text-yellow-400 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleExclamationPoint, { className: "w-4 h-4" }),
      "未连接设备"
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card text-red-400 text-sm", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-slate-400 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "w-4 h-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigateTo("/"), className: "hover:text-white", children: "/" }),
      crumbs.map((crumb, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-3 h-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => navigateTo("/" + crumbs.slice(0, i + 1).join("/")), className: "hover:text-white", children: crumb })
      ] }, i)),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: navigateUp, className: "ml-auto btn-secondary text-xs", children: "上一级" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 flex-wrap", children: quickPaths.map((q2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => navigateTo(q2.path),
        className: `px-2.5 py-1 rounded-lg text-xs ${currentPath === q2.path ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400 hover:text-white"}`,
        children: q2.name
      },
      q2.path
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4 text-slate-500 absolute left-3 top-2.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "input pl-9",
            placeholder: "在当前目录搜索...",
            value: searchQuery,
            onChange: (e) => setSearchQuery(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && handleSearch()
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSearch, disabled: searching || !searchQuery.trim(), className: "btn-secondary text-sm", children: searching ? "搜索中..." : "搜索" })
    ] }),
    transfer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-300", children: transfer.file }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-slate-700 rounded-full h-2 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-500 h-full rounded-full", style: { width: `${transfer.total > 0 ? Math.min(100, transfer.bytes / transfer.total * 100) : 0}%` } }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-2 px-4 py-2 text-xs font-medium text-slate-400 bg-slate-800/80 border-b border-slate-700/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-5", children: "名称" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-right", children: "大小" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-3", children: "修改时间" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-1", children: "权限" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-1" })
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-5 h-5 animate-spin text-blue-400" }) }) : displayEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-slate-500 text-sm", children: "空目录" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-slate-700/50", children: displayEntries.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-2 px-4 py-2.5 text-sm hover:bg-slate-700/30 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-5 flex items-center gap-2 min-w-0", children: [
          entry.isDir ? /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-4 h-4 text-yellow-400 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-4 h-4 text-blue-400 shrink-0" }),
          renameTarget === entry.path ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                className: "input py-0.5 text-xs",
                value: newName,
                onChange: (e) => setNewName(e.target.value),
                onKeyDown: (e) => e.key === "Enter" && handleRename(entry.path),
                autoFocus: true
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRename(entry.path), className: "text-xs text-blue-400", children: "OK" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => entry.isDir && navigateTo(entry.path), className: "truncate text-slate-200 hover:text-white", title: entry.path, children: entry.name })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-right text-slate-400 text-xs", children: entry.isDir ? "-" : formatSize(entry.size) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-3 text-xs text-slate-500 truncate", children: entry.mtime || "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-1 text-xs text-slate-500", children: entry.perms?.slice(-3) || "-" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-1 flex items-center gap-1 justify-end", children: [
          !entry.isDir && entry.name.toLowerCase().endsWith(".apk") && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleInstallApk(entry), className: "p-1 hover:bg-slate-600 rounded", title: "安装 APK", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-3.5 h-3.5 text-green-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDownload(entry), className: "p-1 hover:bg-slate-600 rounded", title: "下载", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5 text-blue-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            setRenameTarget(entry.path);
            setNewName(entry.name);
          }, className: "p-1 hover:bg-slate-600 rounded", title: "重命名", children: /* @__PURE__ */ jsxRuntimeExports.jsx(PenLine, { className: "w-3.5 h-3.5 text-yellow-400" }) }),
          entry.isDir && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleChmod(entry), className: "p-1 hover:bg-slate-600 rounded", title: "修改权限", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: "w-3.5 h-3.5 text-purple-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleDelete(entry), className: "p-1 hover:bg-slate-600 rounded", title: "删除", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "w-3.5 h-3.5 text-red-400" }) })
        ] })
      ] }, entry.path)) })
    ] }),
    showMkdir && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "modal-overlay", onClick: () => setShowMkdir(false), children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-content p-6", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-bold text-white mb-4", children: "新建目录" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          className: "input mb-4",
          placeholder: "目录名称",
          value: mkdirName,
          onChange: (e) => setMkdirName(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && handleMkdir(),
          autoFocus: true
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setShowMkdir(false), className: "btn-secondary", children: "取消" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleMkdir, className: "btn-primary", children: "创建" })
      ] })
    ] }) })
  ] });
}
function EdlPartitions() {
  const { currentDevice } = useDeviceStore();
  const [loaders, setLoaders] = reactExports.useState([]);
  const [selectedLoader, setSelectedLoader] = reactExports.useState("");
  const [partitions, setPartitions] = reactExports.useState([]);
  const [history, setHistory] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [edlFound, setEdlFound] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(null);
  const [operating, setOperating] = reactExports.useState(null);
  const init = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.edlPartition.listLoaders();
      const list = Array.isArray(result) ? result : [];
      setLoaders(list);
      if (list.length > 0 && !selectedLoader) setSelectedLoader(list[0].path);
      const edl = await api.edlPartition.checkEdlDevice();
      setEdlFound(!!edl.found);
      setHistory(await api.edlPartition.getHistory());
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };
  reactExports.useEffect(() => {
    init();
    const unsub = api.edlPartition.onProgress(setProgress);
    return () => unsub();
  }, []);
  const handlePrintGpt = async () => {
    if (!selectedLoader) return;
    setLoading(true);
    setError("");
    try {
      const result = await api.edlPartition.printGpt(selectedLoader);
      setPartitions(result.partitions || []);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };
  const pickSavePath = async (label) => {
    const dir = await api.system.pickFile({ kind: "folder" });
    if (!dir || Array.isArray(dir)) return null;
    return `${dir}\\${label}_${Date.now()}.img`;
  };
  const handleBackup = async (label) => {
    const outputFile = await pickSavePath(label);
    if (!outputFile) return;
    setOperating(`backup:${label}`);
    setError("");
    try {
      const result = await api.edlPartition.backupPartition({ loader: selectedLoader, label, outputFile });
      if (!result.success) setError(result.error || "备份失败");
    } catch (e) {
      setError(e.message);
    }
    setOperating(null);
    setHistory(await api.edlPartition.getHistory());
  };
  const handleRestore = async (label) => {
    const file = await api.system.pickFile({ kind: "open" });
    if (!file || Array.isArray(file)) return;
    setOperating(`restore:${label}`);
    setError("");
    try {
      const dir = await api.system.pickFile({ kind: "folder" });
      if (!dir || Array.isArray(dir)) return;
      const result = await api.edlPartition.restorePartition({
        loader: selectedLoader,
        label,
        inputFile: file,
        backupBeforeRestore: true,
        backupOutputDir: dir
      });
      if (!result.success) setError(result.error || "恢复失败");
    } catch (e) {
      setError(e.message);
    }
    setOperating(null);
    setHistory(await api.edlPartition.getHistory());
  };
  const handleErase = async (label) => {
    if (!confirm(`擦除分区 "${label}"？此操作不可撤销。`)) return;
    setOperating(`erase:${label}`);
    setError("");
    try {
      const result = await api.edlPartition.erasePartition({ loader: selectedLoader, label });
      if (!result.success) setError(result.error || "擦除失败");
    } catch (e) {
      setError(e.message);
    }
    setOperating(null);
    setHistory(await api.edlPartition.getHistory());
  };
  const handleVerify = async (label) => {
    const file = await api.system.pickFile({ kind: "open" });
    if (!file || Array.isArray(file)) return;
    setOperating(`verify:${label}`);
    setError("");
    try {
      const result = await api.edlPartition.verifyPartition({ loader: selectedLoader, label, filePath: file });
      if (!result.success) setError(result.error || "校验失败");
      else if (!result.matched) setError(`分区 ${label} 与文件不一致`);
    } catch (e) {
      setError(e.message);
    }
    setOperating(null);
    setHistory(await api.edlPartition.getHistory());
  };
  const handleReset = async () => {
    if (!confirm("重置设备？设备将从 EDL 模式重启。")) return;
    setError("");
    try {
      const result = await api.edlPartition.resetDevice(selectedLoader);
      if (!result.success) setError(result.error || "重启失败");
    } catch (e) {
      setError(e.message);
    }
  };
  const formatSize = (bytes) => {
    if (!bytes) return "-";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let size = bytes;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(1)} ${units[i]}`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 overflow-y-auto h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-6 h-6 text-blue-400" }),
      "EDL 分区管理"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `flex items-center gap-1.5 ${edlFound ? "text-green-400" : "text-red-400"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleExclamationPoint, { className: "w-4 h-4" }),
        "EDL 设备：",
        edlFound ? "已找到" : "未找到"
      ] }),
      currentDevice && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-500 flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "w-3.5 h-3.5" }),
        currentDevice.serial
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: init, className: "btn-secondary text-xs ml-auto flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3" }),
        "刷新"
      ] })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card text-red-400 text-sm", children: error }),
    progress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-300", children: [
        progress.stage,
        ": ",
        progress.message
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-slate-700 rounded-full h-2 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-500 h-full rounded-full", style: { width: `${Math.min(100, progress.percent)}%` } }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[260px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "Firehose Loader" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: "select", value: selectedLoader, onChange: (e) => setSelectedLoader(e.target.value), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "-- 选择加载器 --" }),
          loaders.map((loader) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: loader.path, children: [
            loader.name,
            " — ",
            loader.description
          ] }, loader.path))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handlePrintGpt, disabled: !selectedLoader || loading, className: "btn-primary flex items-center gap-2", children: [
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4" }),
        "读取 GPT"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleReset, disabled: !selectedLoader, className: "btn-danger flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" }),
        "重置设备"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card p-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-2 px-4 py-2 text-xs font-medium text-slate-400 bg-slate-800/80 border-b border-slate-700/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-5", children: "分区名" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-right", children: "大小" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-right", children: "起始 LBA" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-3 text-right", children: "操作" })
      ] }),
      partitions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-8 text-slate-500 text-sm", children: "读取 GPT 后显示分区列表。" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-slate-700/50 max-h-[480px] overflow-y-auto", children: partitions.map((part) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-12 gap-2 px-4 py-2.5 text-sm hover:bg-slate-700/30 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-5 text-slate-200 font-mono truncate", children: part.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-right text-slate-400 text-xs", children: formatSize(part.sizeBytes) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "col-span-2 text-right text-slate-400 text-xs", children: part.firstLba }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-3 flex justify-end gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleBackup(part.label), disabled: !!operating, title: "备份", className: "p-1.5 hover:bg-slate-600 rounded", children: operating === `backup:${part.label}` ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3.5 h-3.5 text-blue-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleRestore(part.label), disabled: !!operating, title: "恢复", className: "p-1.5 hover:bg-slate-600 rounded", children: operating === `restore:${part.label}` ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3.5 h-3.5 text-green-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleErase(part.label), disabled: !!operating, title: "擦除", className: "p-1.5 hover:bg-slate-600 rounded", children: operating === `erase:${part.label}` ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "w-3.5 h-3.5 text-red-400" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleVerify(part.label), disabled: !!operating, title: "校验", className: "p-1.5 hover:bg-slate-600 rounded", children: operating === `verify:${part.label}` ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5 text-yellow-400" }) })
        ] })
      ] }, `${part.lun ?? 0}:${part.label}`)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
        "操作历史"
      ] }),
      history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-sm", children: "暂无历史记录。" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 max-h-44 overflow-y-auto", children: history.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-600", children: new Date(item.timestamp).toLocaleString() }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: item.success ? "text-green-400" : "text-red-400", children: [
          "[",
          item.type,
          "]"
        ] }),
        " ",
        item.label,
        " — ",
        item.message
      ] }, i)) })
    ] })
  ] });
}
function Tools() {
  const { currentDevice } = useDeviceStore();
  const [wifiHost, setWifiHost] = reactExports.useState("");
  const [wifiPort, setWifiPort] = reactExports.useState("5555");
  const [pairPort, setPairPort] = reactExports.useState("");
  const [pairCode, setPairCode] = reactExports.useState("");
  const [otaZip, setOtaZip] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(null);
  const [buildProps, setBuildProps] = reactExports.useState(null);
  const [drivers, setDrivers] = reactExports.useState(null);
  const [atbmods, setAtbmods] = reactExports.useState([]);
  const [message, setMessage] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const serial = currentDevice?.serial ?? "";
  reactExports.useEffect(() => {
    if (currentDevice) {
      setWifiHost(currentDevice.serial?.includes(":") ? currentDevice.serial.split(":")[0] : "");
    }
  }, [currentDevice]);
  const run = async (key, fn, successText) => {
    setLoading(key);
    setError("");
    setMessage("");
    try {
      const result = await fn();
      if (result && typeof result === "object" && "error" in result && result.error) {
        setError(String(result.error));
      } else {
        setMessage(successText);
      }
      return result;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(null);
    }
  };
  const handleReadBuildProps = async () => {
    const result = await run("buildprops", () => api.tools.readBuildProps(serial), "属性已读取");
    if (typeof result === "string") {
      const props = {};
      for (const line of result.split("\n")) {
        const m2 = line.match(/^\[([^\]]+)\]:\s*\[([^\]]*)\]$/);
        if (m2) props[m2[1]] = m2[2];
      }
      setBuildProps(props);
    }
  };
  const handleWifiEnable = async () => {
    await run("wifienable", () => api.tools.wifiEnable(serial), "已切换 ADB 到 TCP 模式，请用设备 IP 连接");
  };
  const handleWifiConnect = async () => {
    if (!wifiHost) return;
    await run("wificonnect", () => api.tools.wifiConnect(wifiHost, parseInt(wifiPort, 10) || 5555), "WiFi ADB 已连接");
  };
  const handleWifiDisconnect = async () => {
    if (!wifiHost) return;
    await run("wifidisconnect", () => api.tools.wifiDisconnect(wifiHost, parseInt(wifiPort, 10) || 5555), "WiFi ADB 已断开");
  };
  const handleWifiPair = async () => {
    const port = parseInt(pairPort, 10);
    if (!wifiHost || !port || !pairCode) {
      setError("请填写配对端口和配对码");
      return;
    }
    await run("wifipair", () => api.tools.wifiPair(wifiHost, port, pairCode), "无线调试配对成功");
  };
  const handleSelectOtaZip = async () => {
    const file = await api.system.pickFile({ kind: "open", filter: "zip" });
    if (file) setOtaZip(file);
  };
  const handleOtaStart = async () => {
    if (!otaZip) return;
    await run("ota", () => api.tools.otaStart(serial, otaZip), "离线 OTA 已启动");
  };
  const handleRootPro = async () => {
    await run("rootpro", () => api.tools.rootPro({ installApks: true, installDesktop: true, installMods: true }), "Root 后优化完成");
  };
  const handleCheckDrivers = async () => {
    const result = await run("drivers", () => api.tools.checkDrivers(), "驱动检查完成");
    if (Array.isArray(result)) setDrivers(result);
  };
  const handleInstallDrivers = async () => {
    await run("installdrivers", () => api.tools.installDrivers(), "驱动安装完成");
    await handleCheckDrivers();
  };
  const handleAtbmodScan = async () => {
    const result = await run("atbscan", () => api.tools.atbmodScan(), "ATBMod 扫描完成");
    if (Array.isArray(result)) {
      const list = await api.tools.atbmodList();
      setAtbmods(Array.isArray(list) ? list : []);
    }
  };
  const handleAtbmodInstall = async () => {
    const file = await api.system.pickFile({ kind: "open", filter: "atbmod" });
    if (!file) return;
    const result = await run("atbmodinstall", () => api.tools.atbmodInstall(file), "ATBMod 安装完成");
    if (result) await handleAtbmodScan();
  };
  const handleAtbmodUninstall = async (modid) => {
    await run(`atbmoduninstall:${modid}`, () => api.tools.atbmodUninstall(modid), "ATBMod 已卸载");
    await handleAtbmodScan();
  };
  const handleCheckAppUpdate = async () => {
    const result = await run("update", () => api.tools.checkAppUpdate(), "");
    if (result && typeof result === "object" && "hasUpdate" in result) {
      const update = result;
      if (update.hasUpdate) {
        setMessage(`发现新版本 v${update.latestVersion}`);
        if (update.releaseUrl) await api.system.openExternal(update.releaseUrl);
      } else {
        setMessage("当前已是最新版本");
      }
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 overflow-y-auto h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "w-6 h-6 text-blue-400" }),
      "工具箱"
    ] }),
    message && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card text-sm text-green-400", children: message }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card text-sm text-red-400", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: [
      { key: "charge", title: "开启充电常亮", icon: Battery, desc: "保持充电时屏幕常亮", action: () => run("charge", () => api.tools.openCharge(serial), "已开启充电常亮"), disabled: !serial },
      { key: "buildprops", title: "读取系统属性", icon: FileText, desc: "读取设备 build.prop 属性", action: handleReadBuildProps, disabled: !serial },
      { key: "rootpro", title: "Root 后优化", icon: Shield, desc: "Android 8.1 扩展与模块", action: handleRootPro, disabled: !serial },
      { key: "drivers", title: "检查驱动", icon: Settings, desc: "检测 ADB / 9008 / VC 运行库", action: handleCheckDrivers, disabled: false },
      { key: "installdrivers", title: "安装驱动", icon: Settings, desc: "安装或重装 USB 驱动", action: handleInstallDrivers, disabled: false },
      { key: "update", title: "检查应用更新", icon: RefreshCw, desc: "从 GitHub Releases 检查更新", action: handleCheckAppUpdate, disabled: false }
    ].map((tool) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: tool.action,
        disabled: tool.disabled || loading === tool.key,
        className: "card flex flex-col items-center text-center gap-3 py-5 hover:bg-slate-700/60 transition-colors disabled:opacity-40",
        children: [
          loading === tool.key ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-8 h-8 text-blue-400 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(tool.icon, { className: "w-8 h-8 text-blue-400" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-white", children: tool.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-slate-400", children: tool.desc })
        ]
      },
      tool.key
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-slate-300 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "w-4 h-4" }),
        "无线 ADB"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "设备 IP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", placeholder: "192.168.x.x", value: wifiHost, onChange: (e) => setWifiHost(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "ADB 端口" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", value: wifiPort, onChange: (e) => setWifiPort(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleWifiEnable, disabled: !serial, className: "btn-secondary text-sm", children: "切换 TCP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleWifiConnect, disabled: !wifiHost, className: "btn-primary text-sm", children: "连接" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleWifiDisconnect, disabled: !wifiHost, className: "btn-danger text-sm", children: "断开" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-700/50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "配对端口" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", placeholder: "从无线调试页面获取", value: pairPort, onChange: (e) => setPairPort(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "配对码" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", placeholder: "6 位配对码", value: pairCode, onChange: (e) => setPairCode(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleWifiPair, disabled: !wifiHost || !pairPort || !pairCode, className: "btn-secondary text-sm flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "w-4 h-4" }),
          "配对"
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-slate-300 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
        "离线 OTA"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-end", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "OTA ZIP 文件" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: "input", placeholder: "选择 OTA zip 文件...", value: otaZip, readOnly: true })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSelectOtaZip, className: "btn-secondary text-sm", children: "浏览" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleOtaStart, disabled: !otaZip || !serial, className: "btn-primary text-sm", children: "开始 OTA" })
      ] })
    ] }),
    buildProps && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-slate-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4" }),
          "系统属性"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setBuildProps(null), className: "text-xs text-slate-500 hover:text-white", children: "关闭" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-56 overflow-y-auto space-y-0.5", children: Object.entries(buildProps).map(([key, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs font-mono", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-400", children: key }),
        "=",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300", children: value })
      ] }, key)) })
    ] }),
    drivers && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-slate-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-4 h-4" }),
          "驱动状态"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDrivers(null), className: "text-xs text-slate-500 hover:text-white", children: "关闭" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: drivers.map((driver) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm", children: [
        driver.installed ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4 text-green-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-4 h-4 text-red-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300", children: driver.name }),
        driver.version && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500", children: [
          "v",
          driver.version
        ] })
      ] }, driver.name)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-slate-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "w-4 h-4" }),
          "ATBMod 模块"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleAtbmodScan, disabled: !!loading, className: "btn-secondary text-xs", children: "扫描" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleAtbmodInstall, disabled: !!loading, className: "btn-primary text-xs", children: "安装 .atbmod" })
        ] })
      ] }),
      atbmods.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "未找到已安装模块，点击扫描刷新。" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divide-y divide-slate-700/50", children: atbmods.map((mod) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between py-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200", children: mod.prop?.modname || mod.modid }),
          mod.prop?.modversion && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500 ml-2", children: [
            "v",
            mod.prop.modversion
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleAtbmodUninstall(mod.modid), disabled: !!loading, className: "text-xs text-red-400 hover:text-red-300", children: "卸载" })
      ] }, mod.modid)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-xs text-slate-500 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Monitor, { className: "w-4 h-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "投屏请前往「投屏控制」页面；资源缺失时先到「资源管理」下载对应包。" })
    ] })
  ] });
}
function Cast() {
  const { currentDevice } = useDeviceStore();
  const [running, setRunning] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState("");
  const [options2, setOptions] = reactExports.useState({
    stayAwake: true,
    turnScreenOff: false,
    alwaysOnTop: false,
    fullscreen: false,
    showTouches: false,
    noControl: false,
    maxFps: 60,
    maxSize: 0
  });
  const load = async () => {
    try {
      const result = await api.scrcpy.list();
      setRunning(Array.isArray(result) ? result : []);
    } catch (e) {
      setError(e.message);
    }
  };
  reactExports.useEffect(() => {
    load();
    const unsub = api.scrcpy.onProcessChange(() => load());
    return () => unsub();
  }, []);
  const handleLaunch = async () => {
    if (!currentDevice?.serial) return;
    setLoading(true);
    setError("");
    try {
      const result = await api.scrcpy.launch(currentDevice.serial, {
        stayAwake: options2.stayAwake,
        turnScreenOff: options2.turnScreenOff,
        alwaysOnTop: options2.alwaysOnTop,
        fullscreen: options2.fullscreen,
        showTouches: options2.showTouches,
        noControl: options2.noControl,
        maxFps: options2.maxFps || void 0,
        maxSize: options2.maxSize || void 0,
        windowTitle: `iMooAgentTool - ${currentDevice.innermodel || currentDevice.serial}`
      });
      if (typeof result !== "number" || result <= 0) throw new Error("scrcpy 启动失败");
      await load();
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };
  const handleStop = async (pid) => {
    try {
      await api.scrcpy.stop(pid);
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  const handleStopAll = async () => {
    try {
      await api.scrcpy.stopAll();
      await load();
    } catch (e) {
      setError(e.message);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 overflow-y-auto h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MonitorPlay, { className: "w-6 h-6 text-blue-400" }),
        "投屏控制"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: load, className: "btn-secondary text-sm flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4" }),
        "刷新"
      ] })
    ] }),
    currentDevice ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "w-5 h-5 text-green-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-medium", children: currentDevice.innermodel || currentDevice.model || "已连接设备" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "|" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: currentDevice.serial }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-success ml-auto", children: currentDevice.type })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card text-sm text-yellow-400", children: "未连接设备" }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card text-sm text-red-400", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-slate-300", children: "启动选项" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-3 text-sm", children: [
        ["stayAwake", "保持设备唤醒"],
        ["turnScreenOff", "启动时关闭屏幕"],
        ["alwaysOnTop", "窗口置顶"],
        ["fullscreen", "全屏启动"],
        ["showTouches", "显示触摸点"],
        ["noControl", "仅观看不控制"]
      ].map(([key, label]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-slate-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: options2[key],
            onChange: (e) => setOptions((prev) => ({ ...prev, [key]: e.target.checked })),
            className: "accent-blue-500"
          }
        ),
        label
      ] }, key)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "最大帧率" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "input",
              type: "number",
              value: options2.maxFps,
              onChange: (e) => setOptions((prev) => ({ ...prev, maxFps: parseInt(e.target.value, 10) || 0 }))
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "最大画面尺寸（0 = 不限制）" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              className: "input",
              type: "number",
              value: options2.maxSize,
              onChange: (e) => setOptions((prev) => ({ ...prev, maxSize: parseInt(e.target.value, 10) || 0 }))
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleLaunch, disabled: !currentDevice || loading, className: "btn-primary flex items-center gap-2", children: [
        loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4" }),
        "启动投屏"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-semibold text-slate-300", children: "运行中的窗口" }),
        running.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleStopAll, className: "btn-danger text-xs flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "w-3 h-3" }),
          "全部停止"
        ] })
      ] }),
      running.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500", children: "当前没有投屏窗口。" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: running.map((session) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 bg-slate-900/40 rounded-lg px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MonitorPlay, { className: "w-4 h-4 text-blue-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-200 truncate", children: session.serial || "设备" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500", children: [
            "PID ",
            session.pid,
            " · ",
            new Date(session.startedAt).toLocaleTimeString()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handleStop(session.pid), className: "btn-secondary text-xs", children: "停止" })
      ] }, session.pid)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-xs text-slate-500 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-4 h-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "投屏由 scrcpy 提供。若启动失败，请确认设备已授权 USB 调试，且 resources/bin/scrcpy.exe 存在。" })
    ] })
  ] });
}
function Magisk() {
  const { currentDevice } = useDeviceStore();
  const [modules, setModules] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState("");
  const [tab, setTab] = reactExports.useState("modules");
  const [storeQuery, setStoreQuery] = reactExports.useState("");
  const [storeResults, setStoreResults] = reactExports.useState([]);
  const [searching, setSearching] = reactExports.useState(false);
  const [operating, setOperating] = reactExports.useState(null);
  const loadModules = reactExports.useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await api.magisk.list();
      if (result && typeof result === "object" && "error" in result) {
        throw new Error(String(result.error));
      }
      setModules(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(String(err));
      setModules([]);
    }
    setLoading(false);
  }, [currentDevice]);
  reactExports.useEffect(() => {
    loadModules();
  }, [loadModules]);
  const handleInstall = async (method) => {
    try {
      const file = await api.system.pickFile({ kind: "open", filter: "ZIP files (*.zip)", multi: false });
      if (file) {
        setOperating(`install:${method}`);
        await api.magisk.install(file, method);
        loadModules();
      }
    } catch (err) {
      console.error(err);
    }
    setOperating(null);
  };
  const handleUninstall = async (id2, method) => {
    setOperating(`uninstall:${id2}:${method}`);
    try {
      await api.magisk.uninstall(id2, method);
      loadModules();
    } catch (err) {
      console.error(err);
    }
    setOperating(null);
  };
  const handleToggle = async (mod) => {
    setOperating(`toggle:${mod.id}`);
    try {
      if (mod.status === "enabled") {
        await api.magisk.disable(mod.id);
      } else {
        await api.magisk.enable(mod.id);
      }
      loadModules();
    } catch (err) {
      console.error(err);
    }
    setOperating(null);
  };
  const handleStoreSearch = async () => {
    if (!storeQuery.trim()) return;
    setSearching(true);
    try {
      const results = await api.magisk.storeSearch(storeQuery);
      setStoreResults(Array.isArray(results) ? results : []);
    } catch (err) {
      console.error(err);
    }
    setSearching(false);
  };
  const handleStoreInstall = async (mod) => {
    setOperating(`store:${mod.id}`);
    try {
      await api.magisk.storeInstall(mod);
      loadModules();
    } catch (err) {
      console.error(err);
    }
    setOperating(null);
  };
  const installMethods = ["magisk", "shinst", "peremptory"];
  const uninstallMethods = ["mark", "direct", "script"];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 overflow-y-auto h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Database, { className: "w-6 h-6 text-blue-400" }),
      "Magisk 模块管理"
    ] }),
    currentDevice ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "w-5 h-5 text-green-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-medium", children: currentDevice.serial }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-success ml-auto", children: currentDevice.type })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card text-sm text-yellow-400", children: "未连接设备" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 border-b border-slate-700", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setTab("modules"),
          className: `px-4 py-2 text-sm font-medium transition-colors ${tab === "modules" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400 hover:text-white"}`,
          children: "模块"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setTab("store"),
          className: `px-4 py-2 text-sm font-medium transition-colors ${tab === "store" ? "text-blue-400 border-b-2 border-blue-400" : "text-slate-400 hover:text-white"}`,
          children: "商店"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card text-red-400 text-sm", children: error }),
    tab === "modules" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-400 self-center mr-2", children: "安装：" }),
        installMethods.map((m2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => handleInstall(m2),
            disabled: !!operating || !currentDevice,
            className: "btn-primary text-xs flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-3 h-3" }),
              m2
            ]
          },
          m2
        ))
      ] }),
      loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-6 h-6 animate-spin text-blue-400" }) }) : modules.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card text-center py-8 text-slate-500", children: "未安装模块。" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: modules.map((mod) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-white", children: mod.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-400", children: [
              "v",
              mod.version
            ] }),
            mod.status === "enabled" ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-success", children: "已启用" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-error", children: "已禁用" })
          ] }),
          mod.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-1 line-clamp-2", children: mod.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 mt-1", children: [
            mod.author,
            " · ",
            mod.id
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => handleToggle(mod),
              disabled: operating === `toggle:${mod.id}`,
              className: "p-1.5 hover:bg-slate-600 rounded",
              title: mod.status === "enabled" ? "禁用" : "启用",
              children: mod.status === "enabled" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRight, { className: "w-4 h-4 text-green-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleLeft, { className: "w-4 h-4 text-slate-400" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative group", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "p-1.5 hover:bg-slate-600 rounded", title: "卸载", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "w-4 h-4 text-red-400" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-0 top-full mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl hidden group-hover:block z-10", children: uninstallMethods.map((m2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleUninstall(mod.id, m2),
                disabled: operating === `uninstall:${mod.id}:${m2}`,
                className: "block w-full text-left px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700 whitespace-nowrap",
                children: m2
              },
              m2
            )) })
          ] })
        ] })
      ] }, mod.id)) })
    ] }),
    tab === "store" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "input flex-1",
            placeholder: "搜索 Magisk 模块商店...",
            value: storeQuery,
            onChange: (e) => setStoreQuery(e.target.value),
            onKeyDown: (e) => e.key === "Enter" && handleStoreSearch()
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleStoreSearch, disabled: searching, className: "btn-primary flex items-center gap-2", children: [
          searching ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "w-4 h-4" }),
          "搜索"
        ] })
      ] }),
      storeResults.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: storeResults.map((mod) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex items-start gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-white", children: mod.name }),
          mod.version && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-400 ml-2", children: [
            "v",
            mod.version
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-400 mt-1", children: mod.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 mt-1", children: mod.author })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => handleStoreInstall(mod),
            disabled: operating === `store:${mod.id}`,
            className: "btn-success text-xs flex items-center gap-1 shrink-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-3 h-3" }),
              "安装"
            ]
          }
        )
      ] }, mod.id)) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 text-center py-8", children: searching ? "搜索中..." : "在 Magisk 模块商店中搜索模块。" })
    ] })
  ] });
}
const tabs = [
  { id: "dcim", label: "相册备份" },
  { id: "adbdd", label: "ADB-dd 分区" },
  { id: "edl", label: "EDL 9008" },
  { id: "super", label: "超级恢复" },
  { id: "twrp", label: "TWRP" },
  { id: "xposed", label: "Xposed" }
];
function Backup() {
  const { currentDevice } = useDeviceStore();
  const [activeTab, setActiveTab] = reactExports.useState("dcim");
  const [loading, setLoading] = reactExports.useState(null);
  const [progress, setProgress] = reactExports.useState(null);
  const [message, setMessage] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  reactExports.useEffect(() => {
    const unsub = api.backup.onProgress(setProgress);
    return () => unsub();
  }, []);
  const run = async (key, fn, successText) => {
    setLoading(key);
    setError("");
    setMessage("");
    try {
      const result = await fn();
      if (result && typeof result === "object" && "error" in result && result.error) {
        setError(String(result.error));
      } else {
        setMessage(successText);
      }
    } catch (e) {
      setError(e.message);
    }
    setLoading(null);
  };
  const pickFolder = async () => {
    const result = await api.system.pickFile({ kind: "folder" });
    return result;
  };
  const pickZip = async () => {
    const result = await api.system.pickFile({ kind: "open", filter: "zip" });
    return result;
  };
  const handleDcimBackup = async () => {
    const folder = await pickFolder();
    if (!folder) return;
    await run("dcim-backup", () => api.backup.dcimBackup(folder), "相册备份完成");
  };
  const handleDcimRecover = async () => {
    const folder = await pickFolder();
    if (!folder) return;
    await run("dcim-recover", () => api.backup.dcimRecover(folder), "相册恢复完成");
  };
  const handleAdbddBackup = async () => {
    const folder = await pickFolder();
    if (!folder) return;
    await run("adbdd-backup", () => api.backup.adbddBackup(folder), "ADB-dd 分区备份完成");
  };
  const handleAdbddRecover = async () => {
    const zip = await pickZip();
    if (!zip) return;
    await run("adbdd-recover", () => api.backup.adbddRecover(zip), "ADB-dd 分区恢复完成");
  };
  const handleEdlBackup = async () => {
    const folder = await pickFolder();
    if (!folder) return;
    const xmlFiles = [];
    setError("EDL 备份需要选择 rawprogram XML 文件，当前版本请使用 EDL 分区管理逐个备份。");
    setLoading(null);
    return xmlFiles;
  };
  const handleEdlRecover = async () => {
    setError("EDL 恢复需要 rawprogram XML 文件，当前版本请使用 EDL 分区管理逐个恢复。");
  };
  const handleSuperRecovery = async () => {
    setError("超级恢复需要按机型准备 XML 文件组，当前版本请使用 EDL 分区管理逐分区恢复。");
  };
  const handleTwrp = async () => {
    if (!currentDevice?.innermodel) {
      setError("未检测到设备内部型号");
      return;
    }
    await run("twrp", () => api.backup.autoFlashTwrp(currentDevice.innermodel), "TWRP 刷入完成");
  };
  const handleXposed = async () => {
    await run("xposed", () => api.backup.xposedInstall(), "Xposed 安装完成");
  };
  const disabled = !currentDevice && (activeTab === "dcim" || activeTab === "adbdd" || activeTab === "twrp");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 overflow-y-auto h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-6 h-6 text-blue-400" }),
      "备份与恢复"
    ] }),
    currentDevice ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "w-5 h-5 text-green-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-medium", children: currentDevice.innermodel || currentDevice.model || "已连接设备" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500", children: "|" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: currentDevice.serial }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-success ml-auto", children: currentDevice.type })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm text-yellow-400 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleExclamationPoint, { className: "w-4 h-4" }),
      "未连接设备"
    ] }),
    message && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm text-green-400 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" }),
      message
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm text-red-400 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleExclamationPoint, { className: "w-4 h-4" }),
      error
    ] }),
    progress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-300", children: [
        progress.stage,
        " — ",
        progress.message
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-slate-700 rounded-full h-2 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-blue-500 h-full rounded-full transition-all", style: { width: `${Math.min(100, progress.percent)}%` } }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 border-b border-slate-700 pb-2", children: tabs.map((tab) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => setActiveTab(tab.id),
        className: `px-3 py-1.5 rounded-lg text-sm ${activeTab === tab.id ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800"}`,
        children: tab.label
      },
      tab.id
    )) }),
    activeTab === "dcim" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-5 h-5 text-blue-400" }),
        "相册备份 / 恢复"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "把设备 DCIM 目录拉取到本地，或从本地 DCIM 目录恢复。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleDcimBackup, disabled: disabled || loading === "dcim-backup", className: "btn-primary flex items-center gap-2", children: [
          loading === "dcim-backup" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
          "备份相册"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleDcimRecover, disabled: disabled || loading === "dcim-recover", className: "btn-secondary flex items-center gap-2", children: [
          loading === "dcim-recover" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
          "恢复相册"
        ] })
      ] })
    ] }),
    activeTab === "adbdd" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "w-5 h-5 text-blue-400" }),
        "ADB-dd 分区备份"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "需要 Root。备份时自动跳过 userdata，并在完成后校验 MD5。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleAdbddBackup, disabled: disabled || loading === "adbdd-backup", className: "btn-primary flex items-center gap-2", children: [
          loading === "adbdd-backup" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
          "备份分区"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleAdbddRecover, disabled: disabled || loading === "adbdd-recover", className: "btn-secondary flex items-center gap-2", children: [
          loading === "adbdd-recover" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
          "恢复分区"
        ] })
      ] })
    ] }),
    activeTab === "edl" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-5 h-5 text-blue-400" }),
        "EDL 9008"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "EDL 批量备份/恢复需要 rawprogram XML。可前往「EDL 分区管理」逐分区操作，或在此选择 XML 文件。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleEdlBackup, className: "btn-primary flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
          "EDL 备份"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleEdlRecover, className: "btn-secondary flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
          "EDL 恢复"
        ] })
      ] })
    ] }),
    activeTab === "super" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-blue-400" }),
        "超级恢复"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "按机型资源包中的 XML 序列执行恢复。资源下载完成后可在这里一键执行。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSuperRecovery, className: "btn-primary flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4" }),
        "开始超级恢复"
      ] })
    ] }),
    activeTab === "twrp" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-5 h-5 text-blue-400" }),
        "TWRP"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "使用当前设备内部型号自动匹配并刷入 TWRP 镜像。请先在资源管理下载 TWRP。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleTwrp, disabled: disabled || loading === "twrp", className: "btn-primary flex items-center gap-2", children: [
        loading === "twrp" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4" }),
        "刷入 TWRP"
      ] })
    ] }),
    activeTab === "xposed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-lg font-semibold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Puzzle, { className: "w-5 h-5 text-blue-400" }),
        "Xposed"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-400", children: "自动识别 SDK 19/25 并安装对应 Xposed 框架。请先在资源管理下载 apks 与 xp 资源。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleXposed, disabled: disabled || loading === "xposed", className: "btn-primary flex items-center gap-2", children: [
        loading === "xposed" ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" }),
        "安装 Xposed"
      ] })
    ] })
  ] });
}
const sdkBranches = [
  { value: 19, label: "SDK 19" },
  { value: 25, label: "SDK 25" },
  { value: 27, label: "SDK 27" },
  { value: "nd03", label: "ND03" },
  { value: "nd08", label: "ND08" }
];
function Root() {
  const { currentDevice } = useDeviceStore();
  const [options2, setOptions] = reactExports.useState({});
  const [taskId, setTaskId] = reactExports.useState(null);
  const [context, setContext] = reactExports.useState(null);
  const [running, setRunning] = reactExports.useState(false);
  const [showModels, setShowModels] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (currentDevice?.innermodel) {
      setOptions((prev) => ({ ...prev, innermodel: currentDevice.innermodel }));
    }
  }, [currentDevice]);
  reactExports.useEffect(() => {
    const unsub = api.root.onStageChange((ctx) => {
      setContext(ctx);
    });
    return () => unsub();
  }, []);
  const pollContext = reactExports.useCallback(async (id2) => {
    try {
      const ctx = await api.root.getContext(id2);
      setContext(ctx);
      if (!ctx || ctx.error) setRunning(false);
    } catch {
    }
  }, []);
  reactExports.useEffect(() => {
    if (!taskId || !running) return;
    const interval = setInterval(() => pollContext(taskId), 1e3);
    return () => clearInterval(interval);
  }, [taskId, running, pollContext]);
  const handleStart = async () => {
    try {
      const effectiveOptions = {
        ...options2,
        innermodel: options2.modelChoice || options2.innermodel || currentDevice?.innermodel,
        sdkBranch: options2.sdkBranch || Number(currentDevice?.sdkVersion) || 25,
        softVersion: currentDevice?.softVersion
      };
      if (!effectiveOptions.innermodel) {
        throw new Error("请先选择型号");
      }
      const id2 = await api.root.start(effectiveOptions);
      if (typeof id2 !== "string") throw new Error("启动 Root 任务失败");
      setTaskId(id2);
      setRunning(true);
      setContext(null);
    } catch (err) {
      console.error("Root start failed:", err);
    }
  };
  const handleCancel = async () => {
    if (!taskId) return;
    try {
      await api.root.cancel(taskId);
      setRunning(false);
      setTaskId(null);
    } catch (err) {
      console.error(err);
    }
  };
  const handlePause = async () => {
    if (!taskId) return;
    try {
      await api.root.pause(taskId);
    } catch (err) {
      console.error(err);
    }
  };
  const handleResume = async () => {
    if (!taskId) return;
    try {
      await api.root.resume(taskId);
    } catch (err) {
      console.error(err);
    }
  };
  const models = getAllModels();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 overflow-y-auto h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-6 h-6 text-blue-400" }),
      "Root 工具"
    ] }),
    currentDevice ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "w-5 h-5 text-green-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-green-400 font-medium", children: getDisplayName(currentDevice.innermodel ?? "") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: "|" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400", children: currentDevice.serial }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400", children: [
        "SDK ",
        currentDevice.sdkVersion
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge-success ml-auto", children: currentDevice.type })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card text-sm text-yellow-400 flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleExclamationPoint, { className: "w-4 h-4" }),
      "未连接设备"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-white", children: "Root 选项" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "SDK 分支" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: sdkBranches.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setOptions((prev) => ({ ...prev, sdkBranch: b.value })),
            className: `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${options2.sdkBranch === b.value ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`,
            children: b.label
          },
          String(b.value)
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "型号选择" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setShowModels(!showModels),
            className: "input flex items-center justify-between",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: options2.modelChoice ? getDisplayName(options2.modelChoice) : "自动检测" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "w-4 h-4 text-slate-400" })
            ]
          }
        ),
        showModels && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute z-10 mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg max-h-48 overflow-y-auto shadow-xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                setOptions((prev) => ({ ...prev, modelChoice: void 0 }));
                setShowModels(false);
              },
              className: "w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700",
              children: [
                "自动检测 (",
                currentDevice?.innermodel ? getDisplayName(currentDevice.innermodel) : "无",
                ")"
              ]
            }
          ),
          models.map(([key, entry]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                setOptions((prev) => ({ ...prev, modelChoice: key }));
                setShowModels(false);
              },
              className: "w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700",
              children: [
                entry.displayName,
                " (",
                key,
                ")"
              ]
            },
            key
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: !!options2.nouserdata,
              onChange: (e) => setOptions((prev) => ({ ...prev, nouserdata: e.target.checked })),
              className: "rounded bg-slate-700 border-slate-500"
            }
          ),
          "nouserdata（保留用户数据）"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", children: "SDK 25 方案" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: ["boot", "recovery"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setOptions((prev) => ({ ...prev, sdk25Scheme: s })),
              className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${options2.sdk25Scheme === s ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"}`,
              children: s
            },
            s
          )) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleStart,
          disabled: running || !currentDevice,
          className: "btn-success flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4" }),
            " 开始"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handlePause,
          disabled: !running,
          className: "btn-secondary flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-4 h-4" }),
            " 暂停"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleResume,
          disabled: !running,
          className: "btn-primary flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "w-4 h-4" }),
            " 继续"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleCancel,
          disabled: !taskId,
          className: "btn-danger flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "w-4 h-4" }),
            " 取消"
          ]
        }
      )
    ] }),
    context && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300", children: context.stage }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-400", children: [
            context.progress,
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full bg-slate-700 rounded-full h-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full transition-all",
            style: { width: `${context.progress}%` }
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-slate-400 space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "阶段：",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200", children: context.stage })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "内部型号：",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200", children: context.innermodel })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "是否 V3：",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200", children: String(context.isV3) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "SMode：",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-200", children: String(context.smodel) })
        ] })
      ] }),
      context.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-red-900/30 border border-red-700/50 rounded-lg p-3 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-red-400 font-medium mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleExclamationPoint, { className: "w-4 h-4" }),
          "错误阶段：",
          context.error.stage
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-red-300", children: context.error.message }),
        context.error.recoverable && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-yellow-400 text-xs mt-1", children: "此错误可以恢复。" })
      ] })
    ] }),
    context && context.logs.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-4 h-4" }),
        "Root 日志"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-60 overflow-y-auto space-y-0.5 font-mono text-xs bg-black/40 rounded-lg p-3", children: context.logs.map((log, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `${log.level === "error" ? "text-red-400" : log.level === "warn" ? "text-yellow-400" : log.level === "info" ? "text-blue-300" : "text-slate-400"}`, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-600", children: [
          "[",
          new Date(log.ts).toLocaleTimeString(),
          "]"
        ] }),
        " ",
        log.msg
      ] }, i)) })
    ] })
  ] });
}
const checkUpdateOptions = [
  { value: 0, label: "从不" },
  { value: 1, label: "1 小时" },
  { value: 6, label: "6 小时" },
  { value: 12, label: "12 小时" },
  { value: 24, label: "24 小时" }
];
function SettingsPage() {
  const storeSettings = useSettingsStore((s) => s.settings);
  const storeLoaded = useSettingsStore((s) => s.loaded);
  const storeUpdate = useSettingsStore((s) => s.update);
  const [settings, setSettings] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [verifyResults, setVerifyResults] = reactExports.useState(null);
  const [verifying, setVerifying] = reactExports.useState(false);
  const [version, setVersion] = reactExports.useState("...");
  const [saving, setSaving] = reactExports.useState(false);
  const [agentUrl, setAgentUrl] = reactExports.useState("");
  const [agentKey, setAgentKey] = reactExports.useState("");
  const [agentModel, setAgentModel] = reactExports.useState("gpt-4o-mini");
  const [agentEnabled, setAgentEnabled] = reactExports.useState(false);
  const [connectionStatus, setConnectionStatus] = reactExports.useState(null);
  const [testing, setTesting] = reactExports.useState(false);
  const [agentSaving, setAgentSaving] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const load = async () => {
      try {
        const s = storeLoaded ? storeSettings : await api.system.getSettings();
        const v2 = await api.system.getVersion();
        setSettings(s);
        setVersion(v2.version);
        setAgentUrl(s.agentApiUrl || "");
        setAgentKey(s.agentApiKey || "");
        setAgentModel(s.agentModel || "gpt-4o-mini");
        setAgentEnabled(s.agentEnabled || false);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    load();
  }, [storeLoaded, storeSettings]);
  const updateSetting = async (key, value) => {
    if (!settings) return;
    setSaving(true);
    try {
      await storeUpdate({ [key]: value });
      const updated = { ...settings, [key]: value };
      setSettings(updated);
      if (key === "windowOpacity") {
        await api.system.setWindowOpacity(value / 100);
      }
    } catch (err) {
      console.error(err);
    }
    setSaving(false);
  };
  const handleVerify = async () => {
    setVerifying(true);
    try {
      const results = await api.system.verifyResources();
      setVerifyResults(results);
    } catch (err) {
      console.error(err);
    }
    setVerifying(false);
  };
  const handleSaveAgent = async () => {
    setAgentSaving(true);
    try {
      await setAgentConfig({
        agentApiUrl: agentUrl,
        agentApiKey: agentKey,
        agentModel,
        agentEnabled
      });
    } catch (err) {
      console.error(err);
    }
    setAgentSaving(false);
  };
  const handleTestConnection = async () => {
    setTesting(true);
    setConnectionStatus(null);
    try {
      await setAgentConfig({
        agentApiUrl: agentUrl,
        agentApiKey: agentKey,
        agentModel
      });
      const result = await testAgentConnection();
      setConnectionStatus(result);
    } catch (err) {
      setConnectionStatus({ success: false, message: err.message || "连接失败" });
    }
    setTesting(false);
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-8 h-8 animate-spin text-blue-400" }) });
  }
  if (!settings) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 text-red-400", children: "加载设置失败。" });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-6 overflow-y-auto h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { className: "w-6 h-6 text-blue-400" }),
      "设置"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "label flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Sun, { className: "w-4 h-4" }),
          "窗口透明度 (",
          settings.windowOpacity,
          "%)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "range",
            min: 20,
            max: 100,
            value: settings.windowOpacity,
            onChange: (e) => updateSetting("windowOpacity", parseInt(e.target.value)),
            className: "w-full accent-blue-500"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-slate-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "20%" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "100%" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-sm text-slate-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
            "快速启动"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: settings.speedStart,
              onChange: (e) => updateSetting("speedStart", e.target.checked),
              className: "rounded bg-slate-700 border-slate-500 w-5 h-5 accent-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-sm text-slate-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "w-4 h-4" }),
            "详细日志"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: settings.detailedLog,
              onChange: (e) => updateSetting("detailedLog", e.target.checked),
              className: "rounded bg-slate-700 border-slate-500 w-5 h-5 accent-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-sm text-slate-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "w-4 h-4" }),
            "英文模式"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: settings.infoEn,
              onChange: (e) => updateSetting("infoEn", e.target.checked),
              className: "rounded bg-slate-700 border-slate-500 w-5 h-5 accent-blue-500"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-sm text-slate-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bug, { className: "w-4 h-4" }),
            "用户调试模式"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: settings.onUserDebug,
              onChange: (e) => updateSetting("onUserDebug", e.target.checked),
              className: "rounded bg-slate-700 border-slate-500 w-5 h-5 accent-blue-500"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "label flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "w-4 h-4" }),
          "检查更新间隔"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            className: "select",
            value: settings.checkUpdateTime,
            onChange: (e) => updateSetting("checkUpdateTime", parseInt(e.target.value)),
            children: checkUpdateOptions.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: o.value, children: o.label }, o.value))
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-slate-300 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { className: "w-4 h-4" }),
        "AI Agent 配置"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2 text-sm text-slate-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "w-4 h-4" }),
          "启用 AI Agent"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: agentEnabled,
            onChange: (e) => setAgentEnabled(e.target.checked),
            className: "rounded bg-slate-700 border-slate-500 w-5 h-5 accent-blue-500"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-300 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { className: "w-4 h-4" }),
          "API 地址"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: agentUrl,
            onChange: (e) => setAgentUrl(e.target.value),
            placeholder: "https://api.openai.com/v1",
            className: "w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-300 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Key, { className: "w-4 h-4" }),
          "API Key"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "password",
            value: agentKey,
            onChange: (e) => setAgentKey(e.target.value),
            placeholder: "sk-...",
            className: "w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm text-slate-300 mb-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "w-4 h-4" }),
          "模型名称"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: agentModel,
            onChange: (e) => setAgentModel(e.target.value),
            placeholder: "gpt-4o-mini",
            className: "w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500/50"
          }
        )
      ] }),
      connectionStatus && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `flex items-center gap-2 text-xs px-3 py-2 rounded-lg ${connectionStatus.success ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`, children: [
        connectionStatus.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleExclamationPoint, { className: "w-3.5 h-3.5" }),
        connectionStatus.message
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleTestConnection,
            disabled: testing || !agentUrl || !agentKey,
            className: "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed",
            children: [
              testing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3.5 h-3.5" }),
              "测试连接"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleSaveAgent,
            disabled: agentSaving,
            className: "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed",
            children: [
              agentSaving ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-3.5 h-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "w-3.5 h-3.5" }),
              "保存配置"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-sm font-semibold text-slate-300 flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-4 h-4" }),
          "资源验证"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleVerify,
            disabled: verifying,
            className: "btn-primary text-xs flex items-center gap-1",
            children: [
              verifying ? /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-3 h-3" }),
              "验证"
            ]
          }
        )
      ] }),
      verifyResults && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1 max-h-48 overflow-y-auto", children: verifyResults.map((r2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
        r2.missing ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 text-red-400 shrink-0" }) : r2.ok ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "w-3.5 h-3.5 text-green-400 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "w-3.5 h-3.5 text-yellow-400 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-300 truncate", children: r2.file }),
        !r2.ok && !r2.missing && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-500 shrink-0", children: "MD5 不匹配" }),
        r2.missing && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-red-400 shrink-0", children: "缺失" })
      ] }, r2.file)) }),
      verifyResults && verifyResults.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500", children: "所有资源已验证通过。" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card flex items-center gap-4 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-5 h-5 text-blue-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white font-medium", children: "iMooAgentTool" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-slate-400", children: [
          "版本 ",
          version
        ] })
      ] })
    ] })
  ] });
}
const useLogStore = create((set) => ({
  logs: [],
  subscribed: false,
  addLog: (entry) => set((state) => ({
    logs: [...state.logs.slice(-4999), entry]
  })),
  clearLogs: () => set({ logs: [] }),
  setSubscribed: (subscribed) => set({ subscribed })
}));
const levelColors = {
  debug: "text-slate-400",
  info: "text-blue-400",
  warn: "text-yellow-400",
  error: "text-red-400"
};
const levelBg = {
  debug: "hover:bg-slate-800/30",
  info: "hover:bg-blue-900/20",
  warn: "hover:bg-yellow-900/20",
  error: "hover:bg-red-900/20"
};
function Logs() {
  const { logs, addLog, clearLogs, subscribed, setSubscribed } = useLogStore();
  const [filterLevel, setFilterLevel] = reactExports.useState("all");
  const [searchText, setSearchText] = reactExports.useState("");
  const [autoScroll, setAutoScroll] = reactExports.useState(true);
  const bottomRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!subscribed) {
      api.log.subscribe().then(() => setSubscribed(true)).catch(console.error);
    }
    const unsub = api.log.onLine((entry) => {
      addLog(entry);
    });
    return () => {
      unsub();
    };
  }, [subscribed, setSubscribed, addLog]);
  reactExports.useEffect(() => {
    if (autoScroll && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);
  const filteredLogs = logs.filter((entry) => {
    if (filterLevel !== "all" && entry.level !== filterLevel) return false;
    if (searchText && !entry.message.toLowerCase().includes(searchText.toLowerCase()) && !entry.source.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });
  const handleCopy = () => {
    const text = filteredLogs.map((e) => `[${new Date(e.ts).toISOString()}] [${e.level.toUpperCase()}] [${e.source}] ${e.message}`).join("\n");
    navigator.clipboard.writeText(text).catch(console.error);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 h-full flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-2xl font-bold text-white flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "w-6 h-6 text-blue-400" }),
        "日志查看器"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-slate-500", children: [
        logs.length,
        " 条记录"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-4 shrink-0 flex-wrap", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 bg-slate-800 rounded-lg p-1", children: ["all", "debug", "info", "warn", "error"].map((level) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setFilterLevel(level),
          className: `px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${filterLevel === level ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`,
          children: level.toUpperCase()
        },
        level
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            className: "input pl-8 py-1.5 text-xs",
            placeholder: "搜索日志...",
            value: searchText,
            onChange: (e) => setSearchText(e.target.value)
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1.5 text-xs text-slate-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: autoScroll,
            onChange: (e) => setAutoScroll(e.target.checked),
            className: "rounded bg-slate-700 border-slate-500 w-3.5 h-3.5"
          }
        ),
        "自动滚动"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleCopy, className: "btn-secondary text-xs px-2 py-1.5 flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "w-3.5 h-3.5" }),
        " 复制"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: clearLogs, className: "btn-danger text-xs px-2 py-1.5 flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash, { className: "w-3.5 h-3.5" }),
        " 清除"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 card p-0 overflow-hidden flex flex-col min-h-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-[auto_auto_1fr] gap-2 px-4 py-2 text-xs font-medium text-slate-500 bg-slate-800/80 border-b border-slate-700/50 shrink-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-20", children: "时间" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-12", children: "级别" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "消息" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto scrollbar-thin font-mono text-xs", children: [
        filteredLogs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center h-full text-slate-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "w-4 h-4 mr-2 animate-spin" }),
          "等待日志..."
        ] }) : filteredLogs.map((entry, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `grid grid-cols-[auto_auto_1fr] gap-2 px-4 py-1.5 ${levelBg[entry.level]} transition-colors`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-20 text-slate-500 shrink-0", children: new Date(entry.ts).toLocaleTimeString() }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `w-12 shrink-0 font-semibold ${levelColors[entry.level]}`, children: entry.level.toUpperCase() }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-300 truncate min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-slate-600", children: [
                  "[",
                  entry.source,
                  "]"
                ] }),
                " ",
                entry.message
              ] })
            ]
          },
          i
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: bottomRef })
      ] })
    ] })
  ] });
}
function ShortcutHandler() {
  const navigate = useNavigate();
  const toggle = useAgentStore((s) => s.toggle);
  reactExports.useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        e.preventDefault();
        toggle();
      }
      if (e.ctrlKey && e.key === ",") {
        e.preventDefault();
        navigate("/settings");
      }
      if (e.ctrlKey && e.key.toLowerCase() === "l") {
        e.preventDefault();
        navigate("/logs");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [navigate, toggle]);
  return null;
}
function App() {
  const [showSplash, setShowSplash] = reactExports.useState(true);
  const [showDisclaimer, setShowDisclaimer] = reactExports.useState(false);
  const [showEula, setShowEula] = reactExports.useState(false);
  const loadSettings = useSettingsStore((s) => s.load);
  const setDevice = useDeviceStore((s) => s.setDevice);
  reactExports.useEffect(() => {
    const init = async () => {
      await loadSettings();
      const settings = useSettingsStore.getState().settings;
      if (settings.showDisclaimerOnStart) setShowDisclaimer(true);
      api.device.current().then(setDevice).catch(() => {
      });
      const splashTimer = setTimeout(() => setShowSplash(false), 1200);
      return () => clearTimeout(splashTimer);
    };
    init();
  }, []);
  const handleDisclaimerAccept = async () => {
    setShowDisclaimer(false);
    setShowEula(true);
  };
  const handleEulaAccept = async () => {
    setShowEula(false);
    await useSettingsStore.getState().update({ showDisclaimerOnStart: false });
  };
  if (showSplash) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SplashScreen, { message: "正在初始化..." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Toaster, { children: [
    showDisclaimer && /* @__PURE__ */ jsxRuntimeExports.jsx(DisclaimerModal, { onAccept: handleDisclaimerAccept, onDecline: () => window.close() }),
    showEula && /* @__PURE__ */ jsxRuntimeExports.jsx(EulaModal, { onAccept: handleEulaAccept, onDecline: () => window.close() }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Home, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/reboot", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Reboot, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/cloud", element: /* @__PURE__ */ jsxRuntimeExports.jsx(CloudPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/apps", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Apps, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/files", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Files, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/edl-partitions", element: /* @__PURE__ */ jsxRuntimeExports.jsx(EdlPartitions, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/tools", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Tools, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/cast", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Cast, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/magisk", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Magisk, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/backup", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Backup, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/root", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Root, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/settings", element: /* @__PURE__ */ jsxRuntimeExports.jsx(SettingsPage, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/logs", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Logs, {}) })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ShortcutHandler, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AgentButton, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AgentPanel, {})
  ] }) });
}
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});
createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(HashRouter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) }) }) })
);
