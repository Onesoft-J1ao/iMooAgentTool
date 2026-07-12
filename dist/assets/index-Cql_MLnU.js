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
const ReactExports = /* @__PURE__ */ getDefaultExportFromCjs(reactExports);
const React$2 = /* @__PURE__ */ _mergeNamespaces({
  __proto__: null,
  default: ReactExports
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
var Subscribable = class {
  constructor() {
    this.listeners = /* @__PURE__ */ new Set();
    this.subscribe = this.subscribe.bind(this);
  }
  subscribe(listener) {
    this.listeners.add(listener);
    this.onSubscribe();
    return () => {
      this.listeners.delete(listener);
      this.onUnsubscribe();
    };
  }
  hasListeners() {
    return this.listeners.size > 0;
  }
  onSubscribe() {
  }
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
      return;
    };
  }
  onSubscribe() {
    if (!this.#cleanup) {
      this.setEventListener(this.#setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#cleanup?.();
      this.#cleanup = void 0;
    }
  }
  setEventListener(setup) {
    this.#setup = setup;
    this.#cleanup?.();
    this.#cleanup = setup((focused) => {
      if (typeof focused === "boolean") {
        this.setFocused(focused);
      } else {
        this.onFocus();
      }
    });
  }
  setFocused(focused) {
    const changed = this.#focused !== focused;
    if (changed) {
      this.#focused = focused;
      this.onFocus();
    }
  }
  onFocus() {
    const isFocused = this.isFocused();
    this.listeners.forEach((listener) => {
      listener(isFocused);
    });
  }
  isFocused() {
    if (typeof this.#focused === "boolean") {
      return this.#focused;
    }
    return globalThis.document?.visibilityState !== "hidden";
  }
};
var focusManager = new FocusManager();
var defaultTimeoutProvider = {
  // We need the wrapper function syntax below instead of direct references to
  // global setTimeout etc.
  //
  // BAD: `setTimeout: setTimeout`
  // GOOD: `setTimeout: (cb, delay) => setTimeout(cb, delay)`
  //
  // If we use direct references here, then anything that wants to spy on or
  // replace the global setTimeout (like tests) won't work since we'll already
  // have a hard reference to the original implementation at the time when this
  // file was imported.
  setTimeout: (callback, delay) => setTimeout(callback, delay),
  clearTimeout: (timeoutId) => clearTimeout(timeoutId),
  setInterval: (callback, delay) => setInterval(callback, delay),
  clearInterval: (intervalId) => clearInterval(intervalId)
};
var TimeoutManager = class {
  // We cannot have TimeoutManager<T> as we must instantiate it with a concrete
  // type at app boot; and if we leave that type, then any new timer provider
  // would need to support the default provider's concrete timer ID, which is
  // infeasible across environments.
  //
  // We settle for type safety for the TimeoutProvider type, and accept that
  // this class is unsafe internally to allow for extension.
  #provider = defaultTimeoutProvider;
  #providerCalled = false;
  setTimeoutProvider(provider) {
    this.#provider = provider;
  }
  setTimeout(callback, delay) {
    return this.#provider.setTimeout(callback, delay);
  }
  clearTimeout(timeoutId) {
    this.#provider.clearTimeout(timeoutId);
  }
  setInterval(callback, delay) {
    return this.#provider.setInterval(callback, delay);
  }
  clearInterval(intervalId) {
    this.#provider.clearInterval(intervalId);
  }
};
var timeoutManager = new TimeoutManager();
function systemSetTimeoutZero(callback) {
  setTimeout(callback, 0);
}
var isServer = typeof window === "undefined" || "Deno" in globalThis;
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
function resolveStaleTime(staleTime, query) {
  return typeof staleTime === "function" ? staleTime(query) : staleTime;
}
function resolveQueryBoolean(option, query) {
  return typeof option === "function" ? option(query) : option;
}
function matchQuery(filters, query) {
  const {
    type = "all",
    exact,
    fetchStatus,
    predicate,
    queryKey,
    stale
  } = filters;
  if (queryKey) {
    if (exact) {
      if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
        return false;
      }
    } else if (!partialMatchKey(query.queryKey, queryKey)) {
      return false;
    }
  }
  if (type !== "all") {
    const isActive = query.isActive();
    if (type === "active" && !isActive) {
      return false;
    }
    if (type === "inactive" && isActive) {
      return false;
    }
  }
  if (typeof stale === "boolean" && query.isStale() !== stale) {
    return false;
  }
  if (fetchStatus && fetchStatus !== query.state.fetchStatus) {
    return false;
  }
  if (predicate && !predicate(query)) {
    return false;
  }
  return true;
}
function matchMutation(filters, mutation) {
  const { exact, status, predicate, mutationKey } = filters;
  if (mutationKey) {
    if (!mutation.options.mutationKey) {
      return false;
    }
    if (exact) {
      if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) {
        return false;
      }
    } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
      return false;
    }
  }
  if (status && mutation.state.status !== status) {
    return false;
  }
  if (predicate && !predicate(mutation)) {
    return false;
  }
  return true;
}
function hashQueryKeyByOptions(queryKey, options) {
  const hashFn = options?.queryKeyHashFn || hashKey;
  return hashFn(queryKey);
}
function hashKey(queryKey) {
  return JSON.stringify(
    queryKey,
    (_, val) => isPlainObject(val) ? Object.keys(val).sort().reduce((result, key) => {
      result[key] = val[key];
      return result;
    }, {}) : val
  );
}
function partialMatchKey(a, b) {
  if (a === b) {
    return true;
  }
  if (typeof a !== typeof b) {
    return false;
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    return Object.keys(b).every((key) => partialMatchKey(a[key], b[key]));
  }
  return false;
}
var hasOwn = Object.prototype.hasOwnProperty;
function replaceEqualDeep(a, b, depth = 0) {
  if (a === b) {
    return a;
  }
  if (depth > 500) return b;
  const array = isPlainArray(a) && isPlainArray(b);
  if (!array && !(isPlainObject(a) && isPlainObject(b))) return b;
  const aItems = array ? a : Object.keys(a);
  const aSize = aItems.length;
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
  if (!hasObjectPrototype(o)) {
    return false;
  }
  const ctor = o.constructor;
  if (ctor === void 0) {
    return true;
  }
  const prot = ctor.prototype;
  if (!hasObjectPrototype(prot)) {
    return false;
  }
  if (!prot.hasOwnProperty("isPrototypeOf")) {
    return false;
  }
  if (Object.getPrototypeOf(o) !== Object.prototype) {
    return false;
  }
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
function replaceData(prevData, data, options) {
  if (typeof options.structuralSharing === "function") {
    return options.structuralSharing(prevData, data);
  } else if (options.structuralSharing !== false) {
    return replaceEqualDeep(prevData, data);
  }
  return data;
}
function addToEnd(items, item, max = 0) {
  const newItems = [...items, item];
  return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
  const newItems = [item, ...items];
  return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
var skipToken = /* @__PURE__ */ Symbol();
function ensureQueryFn(options, fetchOptions) {
  if (!options.queryFn && fetchOptions?.initialPromise) {
    return () => fetchOptions.initialPromise;
  }
  if (!options.queryFn || options.queryFn === skipToken) {
    return () => Promise.reject(new Error(`Missing queryFn: '${options.queryHash}'`));
  }
  return options.queryFn;
}
function addConsumeAwareSignal(object, getSignal, onCancelled) {
  let consumed = false;
  let signal;
  Object.defineProperty(object, "signal", {
    enumerable: true,
    get: () => {
      signal ??= getSignal();
      if (consumed) {
        return signal;
      }
      consumed = true;
      if (signal.aborted) {
        onCancelled();
      } else {
        signal.addEventListener("abort", onCancelled, { once: true });
      }
      return signal;
    }
  });
  return object;
}
var environmentManager = /* @__PURE__ */ (() => {
  let isServerFn = () => isServer;
  return {
    /**
     * Returns whether the current runtime should be treated as a server environment.
     */
    isServer() {
      return isServerFn();
    },
    /**
     * Overrides the server check globally.
     */
    setIsServer(isServerValue) {
      isServerFn = isServerValue;
    }
  };
})();
function pendingThenable() {
  let resolve;
  let reject;
  const thenable = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  thenable.status = "pending";
  thenable.catch(() => {
  });
  function finalize(data) {
    Object.assign(thenable, data);
    delete thenable.resolve;
    delete thenable.reject;
  }
  thenable.resolve = (value) => {
    finalize({
      status: "fulfilled",
      value
    });
    resolve(value);
  };
  thenable.reject = (reason) => {
    finalize({
      status: "rejected",
      reason
    });
    reject(reason);
  };
  return thenable;
}
var defaultScheduler = systemSetTimeoutZero;
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
    if (transactions) {
      queue.push(callback);
    } else {
      scheduleFn(() => {
        notifyFn(callback);
      });
    }
  };
  const flush = () => {
    const originalQueue = queue;
    queue = [];
    if (originalQueue.length) {
      scheduleFn(() => {
        batchNotifyFn(() => {
          originalQueue.forEach((callback) => {
            notifyFn(callback);
          });
        });
      });
    }
  };
  return {
    batch: (callback) => {
      let result;
      transactions++;
      try {
        result = callback();
      } finally {
        transactions--;
        if (!transactions) {
          flush();
        }
      }
      return result;
    },
    /**
     * All calls to the wrapped function will be batched.
     */
    batchCalls: (callback) => {
      return (...args) => {
        schedule(() => {
          callback(...args);
        });
      };
    },
    schedule,
    /**
     * Use this method to set a custom notify function.
     * This can be used to for example wrap notifications with `React.act` while running tests.
     */
    setNotifyFunction: (fn) => {
      notifyFn = fn;
    },
    /**
     * Use this method to set a custom function to batch notifications together into a single tick.
     * By default React Query will use the batch function provided by ReactDOM or React Native.
     */
    setBatchNotifyFunction: (fn) => {
      batchNotifyFn = fn;
    },
    setScheduler: (fn) => {
      scheduleFn = fn;
    }
  };
}
var notifyManager = createNotifyManager();
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
      return;
    };
  }
  onSubscribe() {
    if (!this.#cleanup) {
      this.setEventListener(this.#setup);
    }
  }
  onUnsubscribe() {
    if (!this.hasListeners()) {
      this.#cleanup?.();
      this.#cleanup = void 0;
    }
  }
  setEventListener(setup) {
    this.#setup = setup;
    this.#cleanup?.();
    this.#cleanup = setup(this.setOnline.bind(this));
  }
  setOnline(online) {
    const changed = this.#online !== online;
    if (changed) {
      this.#online = online;
      this.listeners.forEach((listener) => {
        listener(online);
      });
    }
  }
  isOnline() {
    return this.#online;
  }
};
var onlineManager = new OnlineManager();
function defaultRetryDelay(failureCount) {
  return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
  return (networkMode ?? "online") === "online" ? onlineManager.isOnline() : true;
}
var CancelledError = class extends Error {
  constructor(options) {
    super("CancelledError");
    this.revert = options?.revert;
    this.silent = options?.silent;
  }
};
function createRetryer(config) {
  let isRetryCancelled = false;
  let failureCount = 0;
  let continueFn;
  const thenable = pendingThenable();
  const isResolved = () => thenable.status !== "pending";
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
      thenable.resolve(value);
    }
  };
  const reject = (value) => {
    if (!isResolved()) {
      continueFn?.();
      thenable.reject(value);
    }
  };
  const pause = () => {
    return new Promise((continueResolve) => {
      continueFn = (value) => {
        if (isResolved() || canContinue()) {
          continueResolve(value);
        }
      };
      config.onPause?.();
    }).then(() => {
      continueFn = void 0;
      if (!isResolved()) {
        config.onContinue?.();
      }
    });
  };
  const run = () => {
    if (isResolved()) {
      return;
    }
    let promiseOrValue;
    const initialPromise = failureCount === 0 ? config.initialPromise : void 0;
    try {
      promiseOrValue = initialPromise ?? config.fn();
    } catch (error) {
      promiseOrValue = Promise.reject(error);
    }
    Promise.resolve(promiseOrValue).then(resolve).catch((error) => {
      if (isResolved()) {
        return;
      }
      const retry = config.retry ?? (environmentManager.isServer() ? 0 : 3);
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
        return canContinue() ? void 0 : pause();
      }).then(() => {
        if (isRetryCancelled) {
          reject(error);
        } else {
          run();
        }
      });
    });
  };
  return {
    promise: thenable,
    status: () => thenable.status,
    cancel,
    continue: () => {
      continueFn?.();
      return thenable;
    },
    cancelRetry,
    continueRetry,
    canStart,
    start: () => {
      if (canStart()) {
        run();
      } else {
        pause().then(run);
      }
      return thenable;
    }
  };
}
var Removable = class {
  #gcTimeout;
  destroy() {
    this.clearGcTimeout();
  }
  scheduleGc() {
    this.clearGcTimeout();
    if (isValidTimeout(this.gcTime)) {
      this.#gcTimeout = timeoutManager.setTimeout(() => {
        this.optionalRemove();
      }, this.gcTime);
    }
  }
  updateGcTime(newGcTime) {
    this.gcTime = Math.max(
      this.gcTime || 0,
      newGcTime ?? (environmentManager.isServer() ? Infinity : 5 * 60 * 1e3)
    );
  }
  clearGcTimeout() {
    if (this.#gcTimeout !== void 0) {
      timeoutManager.clearTimeout(this.#gcTimeout);
      this.#gcTimeout = void 0;
    }
  }
};
function infiniteQueryBehavior(pages) {
  return {
    onFetch: (context, query) => {
      const options = context.options;
      const direction = context.fetchOptions?.meta?.fetchMore?.direction;
      const oldPages = context.state.data?.pages || [];
      const oldPageParams = context.state.data?.pageParams || [];
      let result = { pages: [], pageParams: [] };
      let currentPage = 0;
      const fetchFn = async () => {
        let cancelled = false;
        const addSignalProperty = (object) => {
          addConsumeAwareSignal(
            object,
            () => context.signal,
            () => cancelled = true
          );
        };
        const queryFn = ensureQueryFn(context.options, context.fetchOptions);
        const fetchPage = async (data, param, previous) => {
          if (cancelled) {
            return Promise.reject(context.signal.reason);
          }
          if (param == null && data.pages.length) {
            return Promise.resolve(data);
          }
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
          const param = pageParamFn(options, oldData);
          result = await fetchPage(oldData, param, previous);
        } else {
          const remainingPages = pages ?? oldPages.length;
          do {
            const param = currentPage === 0 ? oldPageParams[0] ?? options.initialPageParam : getNextPageParam(options, result);
            if (currentPage > 0 && param == null) {
              break;
            }
            result = await fetchPage(result, param);
            currentPage++;
          } while (currentPage < remainingPages);
        }
        return result;
      };
      if (context.options.persister) {
        context.fetchFn = () => {
          return context.options.persister?.(
            fetchFn,
            {
              client: context.client,
              queryKey: context.queryKey,
              meta: context.options.meta,
              signal: context.signal
            },
            query
          );
        };
      } else {
        context.fetchFn = fetchFn;
      }
    }
  };
}
function getNextPageParam(options, { pages, pageParams }) {
  const lastIndex = pages.length - 1;
  return pages.length > 0 ? options.getNextPageParam(
    pages[lastIndex],
    pages,
    pageParams[lastIndex],
    pageParams
  ) : void 0;
}
function getPreviousPageParam(options, { pages, pageParams }) {
  return pages.length > 0 ? options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams) : void 0;
}
var Query = class extends Removable {
  #queryType;
  #initialState;
  #revertState;
  #cache;
  #client;
  #retryer;
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
  get meta() {
    return this.options.meta;
  }
  get queryType() {
    return this.#queryType;
  }
  get promise() {
    return this.#retryer?.promise;
  }
  setOptions(options) {
    this.options = { ...this.#defaultOptions, ...options };
    if (options?._type) {
      this.#queryType = options._type;
    }
    this.updateGcTime(this.options.gcTime);
    if (this.state && this.state.data === void 0) {
      const defaultState = getDefaultState$1(this.options);
      if (defaultState.data !== void 0) {
        this.setState(
          successState(defaultState.data, defaultState.dataUpdatedAt)
        );
        this.#initialState = defaultState;
      }
    }
  }
  optionalRemove() {
    if (!this.observers.length && this.state.fetchStatus === "idle") {
      this.#cache.remove(this);
    }
  }
  setData(newData, options) {
    const data = replaceData(this.state.data, newData, this.options);
    this.#dispatch({
      data,
      type: "success",
      dataUpdatedAt: options?.updatedAt,
      manual: options?.manual
    });
    return data;
  }
  setState(state) {
    this.#dispatch({ type: "setState", state });
  }
  cancel(options) {
    const promise = this.#retryer?.promise;
    this.#retryer?.cancel(options);
    return promise ? promise.then(noop).catch(noop) : Promise.resolve();
  }
  destroy() {
    super.destroy();
    this.cancel({ silent: true });
  }
  get resetState() {
    return this.#initialState;
  }
  reset() {
    this.destroy();
    this.setState(this.resetState);
  }
  isActive() {
    return this.observers.some(
      (observer) => resolveQueryBoolean(observer.options.enabled, this) !== false
    );
  }
  isDisabled() {
    if (this.getObserversCount() > 0) {
      return !this.isActive();
    }
    return this.options.queryFn === skipToken || !this.isFetched();
  }
  isFetched() {
    return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
  }
  isStatic() {
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer) => resolveStaleTime(observer.options.staleTime, this) === "static"
      );
    }
    return false;
  }
  isStale() {
    if (this.getObserversCount() > 0) {
      return this.observers.some(
        (observer) => observer.getCurrentResult().isStale
      );
    }
    return this.state.data === void 0 || this.state.isInvalidated;
  }
  isStaleByTime(staleTime = 0) {
    if (this.state.data === void 0) {
      return true;
    }
    if (staleTime === "static") {
      return false;
    }
    if (this.state.isInvalidated) {
      return true;
    }
    return !timeUntilStale(this.state.dataUpdatedAt, staleTime);
  }
  onFocus() {
    const observer = this.observers.find((x2) => x2.shouldFetchOnWindowFocus());
    observer?.refetch({ cancelRefetch: false });
    this.#retryer?.continue();
  }
  onOnline() {
    const observer = this.observers.find((x2) => x2.shouldFetchOnReconnect());
    observer?.refetch({ cancelRefetch: false });
    this.#retryer?.continue();
  }
  addObserver(observer) {
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      this.clearGcTimeout();
      this.#cache.notify({ type: "observerAdded", query: this, observer });
    }
  }
  removeObserver(observer) {
    if (this.observers.includes(observer)) {
      this.observers = this.observers.filter((x2) => x2 !== observer);
      if (!this.observers.length) {
        if (this.#retryer) {
          if (this.#abortSignalConsumed || this.#isInitialPausedFetch()) {
            this.#retryer.cancel({ revert: true });
          } else {
            this.#retryer.cancelRetry();
          }
        }
        this.scheduleGc();
      }
      this.#cache.notify({ type: "observerRemoved", query: this, observer });
    }
  }
  getObserversCount() {
    return this.observers.length;
  }
  #isInitialPausedFetch() {
    return this.state.fetchStatus === "paused" && this.state.status === "pending";
  }
  invalidate() {
    if (!this.state.isInvalidated) {
      this.#dispatch({ type: "invalidate" });
    }
  }
  async fetch(options, fetchOptions) {
    if (this.state.fetchStatus !== "idle" && // If the promise in the retryer is already rejected, we have to definitely
    // re-start the fetch; there is a chance that the query is still in a
    // pending state when that happens
    this.#retryer?.status() !== "rejected") {
      if (this.state.data !== void 0 && fetchOptions?.cancelRefetch) {
        this.cancel({ silent: true });
      } else if (this.#retryer) {
        this.#retryer.continueRetry();
        return this.#retryer.promise;
      }
    }
    if (options) {
      this.setOptions(options);
    }
    if (!this.options.queryFn) {
      const observer = this.observers.find((x2) => x2.options.queryFn);
      if (observer) {
        this.setOptions(observer.options);
      }
    }
    const abortController = new AbortController();
    const addSignalProperty = (object) => {
      Object.defineProperty(object, "signal", {
        enumerable: true,
        get: () => {
          this.#abortSignalConsumed = true;
          return abortController.signal;
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
      if (this.options.persister) {
        return this.options.persister(
          queryFn,
          queryFnContext,
          this
        );
      }
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
    const behavior = this.#queryType === "infinite" ? infiniteQueryBehavior(
      this.options.pages
    ) : this.options.behavior;
    behavior?.onFetch(context, this);
    this.#revertState = this.state;
    if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) {
      this.#dispatch({ type: "fetch", meta: context.fetchOptions?.meta });
    }
    this.#retryer = createRetryer({
      initialPromise: fetchOptions?.initialPromise,
      fn: context.fetchFn,
      onCancel: (error) => {
        if (error instanceof CancelledError && error.revert) {
          this.setState({
            ...this.#revertState,
            fetchStatus: "idle"
          });
        }
        abortController.abort();
      },
      onFail: (failureCount, error) => {
        this.#dispatch({ type: "failed", failureCount, error });
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
    try {
      const data = await this.#retryer.start();
      if (data === void 0) {
        if (false) ;
        throw new Error(`${this.queryHash} data is undefined`);
      }
      this.setData(data);
      this.#cache.config.onSuccess?.(data, this);
      this.#cache.config.onSettled?.(
        data,
        this.state.error,
        this
      );
      return data;
    } catch (error) {
      if (error instanceof CancelledError) {
        if (error.silent) {
          return this.#retryer.promise;
        } else if (error.revert) {
          if (this.state.data === void 0) {
            throw error;
          }
          return this.state.data;
        }
      }
      this.#dispatch({
        type: "error",
        error
      });
      this.#cache.config.onError?.(
        error,
        this
      );
      this.#cache.config.onSettled?.(
        this.state.data,
        error,
        this
      );
      throw error;
    } finally {
      this.scheduleGc();
    }
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
            // flag existing data as invalidated if we get a background error
            // note that "no data" always means stale so we can set unconditionally here
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
      this.observers.forEach((observer) => {
        observer.onQueryUpdate();
      });
      this.#cache.notify({ query: this, type: "updated", action });
    });
  }
};
function fetchState(data, options) {
  return {
    fetchFailureCount: 0,
    fetchFailureReason: null,
    fetchStatus: canFetch(options.networkMode) ? "fetching" : "paused",
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
function getDefaultState$1(options) {
  const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
  const hasData = data !== void 0;
  const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
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
  setOptions(options) {
    this.options = options;
    this.updateGcTime(this.options.gcTime);
  }
  get meta() {
    return this.options.meta;
  }
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
      if (this.state.status === "pending") {
        this.scheduleGc();
      } else {
        this.#mutationCache.remove(this);
      }
    }
  }
  continue() {
    return this.#retryer?.continue() ?? // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
    this.execute(this.state.variables);
  }
  async execute(variables) {
    const onContinue = () => {
      this.#dispatch({ type: "continue" });
    };
    const mutationFnContext = {
      client: this.#client,
      meta: this.options.meta,
      mutationKey: this.options.mutationKey
    };
    this.#retryer = createRetryer({
      fn: () => {
        if (!this.options.mutationFn) {
          return Promise.reject(new Error("No mutationFn found"));
        }
        return this.options.mutationFn(variables, mutationFnContext);
      },
      onFail: (failureCount, error) => {
        this.#dispatch({ type: "failed", failureCount, error });
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
    const isPaused = !this.#retryer.canStart();
    try {
      if (restored) {
        onContinue();
      } else {
        this.#dispatch({ type: "pending", variables, isPaused });
        if (this.#mutationCache.config.onMutate) {
          await this.#mutationCache.config.onMutate(
            variables,
            this,
            mutationFnContext
          );
        }
        const context = await this.options.onMutate?.(
          variables,
          mutationFnContext
        );
        if (context !== this.state.context) {
          this.#dispatch({
            type: "pending",
            context,
            variables,
            isPaused
          });
        }
      }
      const data = await this.#retryer.start();
      await this.#mutationCache.config.onSuccess?.(
        data,
        variables,
        this.state.context,
        this,
        mutationFnContext
      );
      await this.options.onSuccess?.(
        data,
        variables,
        this.state.context,
        mutationFnContext
      );
      await this.#mutationCache.config.onSettled?.(
        data,
        null,
        this.state.variables,
        this.state.context,
        this,
        mutationFnContext
      );
      await this.options.onSettled?.(
        data,
        null,
        variables,
        this.state.context,
        mutationFnContext
      );
      this.#dispatch({ type: "success", data });
      return data;
    } catch (error) {
      try {
        await this.#mutationCache.config.onError?.(
          error,
          variables,
          this.state.context,
          this,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await this.options.onError?.(
          error,
          variables,
          this.state.context,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await this.#mutationCache.config.onSettled?.(
          void 0,
          error,
          this.state.variables,
          this.state.context,
          this,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      try {
        await this.options.onSettled?.(
          void 0,
          error,
          variables,
          this.state.context,
          mutationFnContext
        );
      } catch (e) {
        void Promise.reject(e);
      }
      this.#dispatch({ type: "error", error });
      throw error;
    } finally {
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
  constructor(config = {}) {
    super();
    this.config = config;
    this.#mutations = /* @__PURE__ */ new Set();
    this.#scopes = /* @__PURE__ */ new Map();
    this.#mutationId = 0;
  }
  #mutations;
  #scopes;
  #mutationId;
  build(client, options, state) {
    const mutation = new Mutation({
      client,
      mutationCache: this,
      mutationId: ++this.#mutationId,
      options: client.defaultMutationOptions(options),
      state
    });
    this.add(mutation);
    return mutation;
  }
  add(mutation) {
    this.#mutations.add(mutation);
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const scopedMutations = this.#scopes.get(scope);
      if (scopedMutations) {
        scopedMutations.push(mutation);
      } else {
        this.#scopes.set(scope, [mutation]);
      }
    }
    this.notify({ type: "added", mutation });
  }
  remove(mutation) {
    if (this.#mutations.delete(mutation)) {
      const scope = scopeFor(mutation);
      if (typeof scope === "string") {
        const scopedMutations = this.#scopes.get(scope);
        if (scopedMutations) {
          if (scopedMutations.length > 1) {
            const index = scopedMutations.indexOf(mutation);
            if (index !== -1) {
              scopedMutations.splice(index, 1);
            }
          } else if (scopedMutations[0] === mutation) {
            this.#scopes.delete(scope);
          }
        }
      }
    }
    this.notify({ type: "removed", mutation });
  }
  canRun(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const mutationsWithSameScope = this.#scopes.get(scope);
      const firstPendingMutation = mutationsWithSameScope?.find(
        (m2) => m2.state.status === "pending"
      );
      return !firstPendingMutation || firstPendingMutation === mutation;
    } else {
      return true;
    }
  }
  runNext(mutation) {
    const scope = scopeFor(mutation);
    if (typeof scope === "string") {
      const foundMutation = this.#scopes.get(scope)?.find((m2) => m2 !== mutation && m2.state.isPaused);
      return foundMutation?.continue() ?? Promise.resolve();
    } else {
      return Promise.resolve();
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.#mutations.forEach((mutation) => {
        this.notify({ type: "removed", mutation });
      });
      this.#mutations.clear();
      this.#scopes.clear();
    });
  }
  getAll() {
    return Array.from(this.#mutations);
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (mutation) => matchMutation(defaultedFilters, mutation)
    );
  }
  findAll(filters = {}) {
    return this.getAll().filter((mutation) => matchMutation(filters, mutation));
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  resumePausedMutations() {
    const pausedMutations = this.getAll().filter((x2) => x2.state.isPaused);
    return notifyManager.batch(
      () => Promise.all(
        pausedMutations.map((mutation) => mutation.continue().catch(noop))
      )
    );
  }
};
function scopeFor(mutation) {
  return mutation.options.scope?.id;
}
var QueryCache = class extends Subscribable {
  constructor(config = {}) {
    super();
    this.config = config;
    this.#queries = /* @__PURE__ */ new Map();
  }
  #queries;
  build(client, options, state) {
    const queryKey = options.queryKey;
    const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
    let query = this.get(queryHash);
    if (!query) {
      query = new Query({
        client,
        queryKey,
        queryHash,
        options: client.defaultQueryOptions(options),
        state,
        defaultOptions: client.getQueryDefaults(queryKey)
      });
      this.add(query);
    }
    return query;
  }
  add(query) {
    if (!this.#queries.has(query.queryHash)) {
      this.#queries.set(query.queryHash, query);
      this.notify({
        type: "added",
        query
      });
    }
  }
  remove(query) {
    const queryInMap = this.#queries.get(query.queryHash);
    if (queryInMap) {
      query.destroy();
      if (queryInMap === query) {
        this.#queries.delete(query.queryHash);
      }
      this.notify({ type: "removed", query });
    }
  }
  clear() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        this.remove(query);
      });
    });
  }
  get(queryHash) {
    return this.#queries.get(queryHash);
  }
  getAll() {
    return [...this.#queries.values()];
  }
  find(filters) {
    const defaultedFilters = { exact: true, ...filters };
    return this.getAll().find(
      (query) => matchQuery(defaultedFilters, query)
    );
  }
  findAll(filters = {}) {
    const queries = this.getAll();
    return Object.keys(filters).length > 0 ? queries.filter((query) => matchQuery(filters, query)) : queries;
  }
  notify(event) {
    notifyManager.batch(() => {
      this.listeners.forEach((listener) => {
        listener(event);
      });
    });
  }
  onFocus() {
    notifyManager.batch(() => {
      this.getAll().forEach((query) => {
        query.onFocus();
      });
    });
  }
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
  unmount() {
    this.#mountCount--;
    if (this.#mountCount !== 0) return;
    this.#unsubscribeFocus?.();
    this.#unsubscribeFocus = void 0;
    this.#unsubscribeOnline?.();
    this.#unsubscribeOnline = void 0;
  }
  isFetching(filters) {
    return this.#queryCache.findAll({ ...filters, fetchStatus: "fetching" }).length;
  }
  isMutating(filters) {
    return this.#mutationCache.findAll({ ...filters, status: "pending" }).length;
  }
  /**
   * Imperative (non-reactive) way to retrieve data for a QueryKey.
   * Should only be used in callbacks or functions where reading the latest data is necessary, e.g. for optimistic updates.
   *
   * Hint: Do not use this function inside a component, because it won't receive updates.
   * Use `useQuery` to create a `QueryObserver` that subscribes to changes.
   */
  getQueryData(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(options.queryHash)?.state.data;
  }
  ensureQueryData(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    const query = this.#queryCache.build(this, defaultedOptions);
    const cachedData = query.state.data;
    if (cachedData === void 0) {
      return this.fetchQuery(options);
    }
    if (options.revalidateIfStale && query.isStaleByTime(resolveStaleTime(defaultedOptions.staleTime, query))) {
      void this.prefetchQuery(defaultedOptions);
    }
    return Promise.resolve(cachedData);
  }
  getQueriesData(filters) {
    return this.#queryCache.findAll(filters).map(({ queryKey, state }) => {
      const data = state.data;
      return [queryKey, data];
    });
  }
  setQueryData(queryKey, updater, options) {
    const defaultedOptions = this.defaultQueryOptions({ queryKey });
    const query = this.#queryCache.get(
      defaultedOptions.queryHash
    );
    const prevData = query?.state.data;
    const data = functionalUpdate(updater, prevData);
    if (data === void 0) {
      return void 0;
    }
    return this.#queryCache.build(this, defaultedOptions).setData(data, { ...options, manual: true });
  }
  setQueriesData(filters, updater, options) {
    return notifyManager.batch(
      () => this.#queryCache.findAll(filters).map(({ queryKey }) => [
        queryKey,
        this.setQueryData(queryKey, updater, options)
      ])
    );
  }
  getQueryState(queryKey) {
    const options = this.defaultQueryOptions({ queryKey });
    return this.#queryCache.get(
      options.queryHash
    )?.state;
  }
  removeQueries(filters) {
    const queryCache = this.#queryCache;
    notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        queryCache.remove(query);
      });
    });
  }
  resetQueries(filters, options) {
    const queryCache = this.#queryCache;
    return notifyManager.batch(() => {
      queryCache.findAll(filters).forEach((query) => {
        query.reset();
      });
      return this.refetchQueries(
        {
          type: "active",
          ...filters
        },
        options
      );
    });
  }
  cancelQueries(filters, cancelOptions = {}) {
    const defaultedCancelOptions = { revert: true, ...cancelOptions };
    const promises = notifyManager.batch(
      () => this.#queryCache.findAll(filters).map((query) => query.cancel(defaultedCancelOptions))
    );
    return Promise.all(promises).then(noop).catch(noop);
  }
  invalidateQueries(filters, options = {}) {
    return notifyManager.batch(() => {
      this.#queryCache.findAll(filters).forEach((query) => {
        query.invalidate();
      });
      if (filters?.refetchType === "none") {
        return Promise.resolve();
      }
      return this.refetchQueries(
        {
          ...filters,
          type: filters?.refetchType ?? filters?.type ?? "active"
        },
        options
      );
    });
  }
  refetchQueries(filters, options = {}) {
    const fetchOptions = {
      ...options,
      cancelRefetch: options.cancelRefetch ?? true
    };
    const promises = notifyManager.batch(
      () => this.#queryCache.findAll(filters).filter((query) => !query.isDisabled() && !query.isStatic()).map((query) => {
        let promise = query.fetch(void 0, fetchOptions);
        if (!fetchOptions.throwOnError) {
          promise = promise.catch(noop);
        }
        return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
      })
    );
    return Promise.all(promises).then(noop);
  }
  fetchQuery(options) {
    const defaultedOptions = this.defaultQueryOptions(options);
    if (defaultedOptions.retry === void 0) {
      defaultedOptions.retry = false;
    }
    const query = this.#queryCache.build(this, defaultedOptions);
    return query.isStaleByTime(
      resolveStaleTime(defaultedOptions.staleTime, query)
    ) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
  }
  prefetchQuery(options) {
    return this.fetchQuery(options).then(noop).catch(noop);
  }
  fetchInfiniteQuery(options) {
    options._type = "infinite";
    return this.fetchQuery(options);
  }
  prefetchInfiniteQuery(options) {
    return this.fetchInfiniteQuery(options).then(noop).catch(noop);
  }
  ensureInfiniteQueryData(options) {
    options._type = "infinite";
    return this.ensureQueryData(options);
  }
  resumePausedMutations() {
    if (onlineManager.isOnline()) {
      return this.#mutationCache.resumePausedMutations();
    }
    return Promise.resolve();
  }
  getQueryCache() {
    return this.#queryCache;
  }
  getMutationCache() {
    return this.#mutationCache;
  }
  getDefaultOptions() {
    return this.#defaultOptions;
  }
  setDefaultOptions(options) {
    this.#defaultOptions = options;
  }
  setQueryDefaults(queryKey, options) {
    this.#queryDefaults.set(hashKey(queryKey), {
      queryKey,
      defaultOptions: options
    });
  }
  getQueryDefaults(queryKey) {
    const defaults = [...this.#queryDefaults.values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(queryKey, queryDefault.queryKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  setMutationDefaults(mutationKey, options) {
    this.#mutationDefaults.set(hashKey(mutationKey), {
      mutationKey,
      defaultOptions: options
    });
  }
  getMutationDefaults(mutationKey) {
    const defaults = [...this.#mutationDefaults.values()];
    const result = {};
    defaults.forEach((queryDefault) => {
      if (partialMatchKey(mutationKey, queryDefault.mutationKey)) {
        Object.assign(result, queryDefault.defaultOptions);
      }
    });
    return result;
  }
  defaultQueryOptions(options) {
    if (options._defaulted) {
      return options;
    }
    const defaultedOptions = {
      ...this.#defaultOptions.queries,
      ...this.getQueryDefaults(options.queryKey),
      ...options,
      _defaulted: true
    };
    if (!defaultedOptions.queryHash) {
      defaultedOptions.queryHash = hashQueryKeyByOptions(
        defaultedOptions.queryKey,
        defaultedOptions
      );
    }
    if (defaultedOptions.refetchOnReconnect === void 0) {
      defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
    }
    if (defaultedOptions.throwOnError === void 0) {
      defaultedOptions.throwOnError = !!defaultedOptions.suspense;
    }
    if (!defaultedOptions.networkMode && defaultedOptions.persister) {
      defaultedOptions.networkMode = "offlineFirst";
    }
    if (defaultedOptions.queryFn === skipToken) {
      defaultedOptions.enabled = false;
    }
    return defaultedOptions;
  }
  defaultMutationOptions(options) {
    if (options?._defaulted) {
      return options;
    }
    return {
      ...this.#defaultOptions.mutations,
      ...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
      ...options,
      _defaulted: true
    };
  }
  clear() {
    this.#queryCache.clear();
    this.#mutationCache.clear();
  }
};
var QueryClientContext = reactExports.createContext(
  void 0
);
var QueryClientProvider = ({
  client,
  children
}) => {
  reactExports.useEffect(() => {
    client.mount();
    return () => {
      client.unmount();
    };
  }, [client]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientContext.Provider, { value: client, children });
};
/**
 * @remix-run/router v1.23.3
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
function createHashHistory(options) {
  if (options === void 0) {
    options = {};
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
  return getUrlBasedHistory(createHashLocation, createHashHref, validateHashLocation, options);
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
function getUrlBasedHistory(getLocation, createHref, validateLocation, options) {
  if (options === void 0) {
    options = {};
  }
  let {
    window: window2 = document.defaultView,
    v5Compat = false
  } = options;
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
const ABSOLUTE_URL_REGEX$1 = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;
const isAbsoluteUrl = (url) => ABSOLUTE_URL_REGEX$1.test(url);
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
    if (isAbsoluteUrl(toPathname)) {
      pathname = toPathname;
    } else {
      if (toPathname.includes("//")) {
        let oldPathname = toPathname;
        toPathname = removeDoubleSlashes(toPathname);
        warning(false, "Pathnames cannot have embedded double slashes - normalizing " + (oldPathname + " -> " + toPathname));
      }
      if (toPathname.startsWith("/")) {
        pathname = resolvePathname(toPathname.substring(1), "/");
      } else {
        pathname = resolvePathname(toPathname, fromPathname);
      }
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
 * React Router v6.30.4
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
  let navigate = reactExports.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current) return;
    if (typeof to === "number") {
      navigator2.go(to);
      return;
    }
    let path = resolveTo(to, JSON.parse(routePathnamesJson), locationPathname, options.relative === "path");
    if (dataRouterContext == null && basename !== "/") {
      path.pathname = path.pathname === "/" ? basename : joinPaths([basename, path.pathname]);
    }
    (!!options.replace ? navigator2.replace : navigator2.push)(path, options.state, options);
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
  let navigate = reactExports.useCallback(function(to, options) {
    if (options === void 0) {
      options = {};
    }
    if (!activeRef.current) return;
    if (typeof to === "number") {
      router.navigate(to);
    } else {
      router.navigate(to, _extends$1({
        fromRouteId: id2
      }, options));
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
 * React Router DOM v6.30.4
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
const startTransitionImpl = React$2[START_TRANSITION];
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
const Link = /* @__PURE__ */ reactExports.forwardRef(function LinkWithRef(_ref7, ref) {
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
  return /* @__PURE__ */ reactExports.createElement(Link, _extends({}, rest, {
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
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Icon = reactExports.forwardRef(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return reactExports.createElement(
      "svg",
      {
        ref,
        ...defaultAttributes,
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: mergeClasses("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => reactExports.createElement(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const createLucideIcon = (iconName, iconNode) => {
  const Component = reactExports.forwardRef(
    ({ className, ...props }, ref) => reactExports.createElement(Icon, {
      ref,
      iconNode,
      className: mergeClasses(`lucide-${toKebabCase(iconName)}`, className),
      ...props
    })
  );
  Component.displayName = `${iconName}`;
  return Component;
};
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AppWindow = createLucideIcon("AppWindow", [
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2", key: "izxlao" }],
  ["path", { d: "M10 4v4", key: "pp8u80" }],
  ["path", { d: "M2 8h20", key: "d11cs7" }],
  ["path", { d: "M6 4v4", key: "1svtjw" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowDownToLine = createLucideIcon("ArrowDownToLine", [
  ["path", { d: "M12 17V3", key: "1cwfxf" }],
  ["path", { d: "m6 11 6 6 6-6", key: "12ii2o" }],
  ["path", { d: "M19 21H5", key: "150jfl" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUp = createLucideIcon("ArrowUp", [
  ["path", { d: "m5 12 7-7 7 7", key: "hav0vg" }],
  ["path", { d: "M12 19V5", key: "x0mq9r" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ban = createLucideIcon("Ban", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m4.9 4.9 14.2 14.2", key: "1m5liu" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BatteryCharging = createLucideIcon("BatteryCharging", [
  ["path", { d: "M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2", key: "1sdynx" }],
  ["path", { d: "M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1", key: "1gkd3k" }],
  ["path", { d: "m11 7-3 5h4l-3 5", key: "b4a64w" }],
  ["line", { x1: "22", x2: "22", y1: "11", y2: "13", key: "4dh1rd" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookmarkPlus = createLucideIcon("BookmarkPlus", [
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z", key: "1fy3hk" }],
  ["line", { x1: "12", x2: "12", y1: "7", y2: "13", key: "1cppfj" }],
  ["line", { x1: "15", x2: "9", y1: "10", y2: "10", key: "1gty7f" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bookmark = createLucideIcon("Bookmark", [
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z", key: "1fy3hk" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Boxes = createLucideIcon("Boxes", [
  [
    "path",
    {
      d: "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z",
      key: "lc1i9w"
    }
  ],
  ["path", { d: "m7 16.5-4.74-2.85", key: "1o9zyk" }],
  ["path", { d: "m7 16.5 5-3", key: "va8pkn" }],
  ["path", { d: "M7 16.5v5.17", key: "jnp8gn" }],
  [
    "path",
    {
      d: "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z",
      key: "8zsnat"
    }
  ],
  ["path", { d: "m17 16.5-5-3", key: "8arw3v" }],
  ["path", { d: "m17 16.5 4.74-2.85", key: "8rfmw" }],
  ["path", { d: "M17 16.5v5.17", key: "k6z78m" }],
  [
    "path",
    {
      d: "M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z",
      key: "1xygjf"
    }
  ],
  ["path", { d: "M12 8 7.26 5.15", key: "1vbdud" }],
  ["path", { d: "m12 8 4.74-2.85", key: "3rx089" }],
  ["path", { d: "M12 13.5V8", key: "1io7kd" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Check = createLucideIcon("Check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronDown = createLucideIcon("ChevronDown", [
  ["path", { d: "m6 9 6 6 6-6", key: "qrunsl" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronLeft = createLucideIcon("ChevronLeft", [
  ["path", { d: "m15 18-6-6 6-6", key: "1wnfg3" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronRight = createLucideIcon("ChevronRight", [
  ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleAlert = createLucideIcon("CircleAlert", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleCheck = createLucideIcon("CircleCheck", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClipboardPaste = createLucideIcon("ClipboardPaste", [
  [
    "path",
    { d: "M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1Z", key: "1pp7kr" }
  ],
  [
    "path",
    {
      d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2M16 4h2a2 2 0 0 1 2 2v2M11 14h10",
      key: "2ik1ml"
    }
  ],
  ["path", { d: "m17 10 4 4-4 4", key: "vp2hj1" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Copy = createLucideIcon("Copy", [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cpu = createLucideIcon("Cpu", [
  ["rect", { width: "16", height: "16", x: "4", y: "4", rx: "2", key: "14l7u7" }],
  ["rect", { width: "6", height: "6", x: "9", y: "9", rx: "1", key: "5aljv4" }],
  ["path", { d: "M15 2v2", key: "13l42r" }],
  ["path", { d: "M15 20v2", key: "15mkzm" }],
  ["path", { d: "M2 15h2", key: "1gxd5l" }],
  ["path", { d: "M2 9h2", key: "1bbxkp" }],
  ["path", { d: "M20 15h2", key: "19e6y8" }],
  ["path", { d: "M20 9h2", key: "19tzq7" }],
  ["path", { d: "M9 2v2", key: "165o2o" }],
  ["path", { d: "M9 20v2", key: "i2bqo8" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DatabaseBackup = createLucideIcon("DatabaseBackup", [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3", key: "msslwz" }],
  ["path", { d: "M3 12a9 3 0 0 0 5 2.69", key: "1ui2ym" }],
  ["path", { d: "M21 9.3V5", key: "6k6cib" }],
  ["path", { d: "M3 5v14a9 3 0 0 0 6.47 2.88", key: "i62tjy" }],
  ["path", { d: "M12 12v4h4", key: "1bxaet" }],
  [
    "path",
    {
      d: "M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16",
      key: "1f4ei9"
    }
  ]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Download = createLucideIcon("Download", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "7 10 12 15 17 10", key: "2ggqvy" }],
  ["line", { x1: "12", x2: "12", y1: "15", y2: "3", key: "1vk2je" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ExternalLink = createLucideIcon("ExternalLink", [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FilePlus = createLucideIcon("FilePlus", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M9 15h6", key: "cctwl0" }],
  ["path", { d: "M12 18v-6", key: "17g6i2" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileText = createLucideIcon("FileText", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const File = createLucideIcon("File", [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z", key: "1rqfz7" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4", key: "tnqrlb" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderOpen = createLucideIcon("FolderOpen", [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderPlus = createLucideIcon("FolderPlus", [
  ["path", { d: "M12 10v6", key: "1bos4e" }],
  ["path", { d: "M9 13h6", key: "1uhe8q" }],
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Folder = createLucideIcon("Folder", [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HardDriveDownload = createLucideIcon("HardDriveDownload", [
  ["path", { d: "M12 2v8", key: "1q4o3n" }],
  ["path", { d: "m16 6-4 4-4-4", key: "6wukr" }],
  ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2", key: "w68u3i" }],
  ["path", { d: "M6 18h.01", key: "uhywen" }],
  ["path", { d: "M10 18h.01", key: "h775k" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HardDrive = createLucideIcon("HardDrive", [
  ["line", { x1: "22", x2: "2", y1: "12", y2: "12", key: "1y58io" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z",
      key: "oot6mr"
    }
  ],
  ["line", { x1: "6", x2: "6.01", y1: "16", y2: "16", key: "sgf278" }],
  ["line", { x1: "10", x2: "10.01", y1: "16", y2: "16", key: "1l4acy" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const History = createLucideIcon("History", [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const House = createLucideIcon("House", [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8", key: "5wwlr5" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
      key: "1d0kgt"
    }
  ]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Info = createLucideIcon("Info", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LayoutGrid = createLucideIcon("LayoutGrid", [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1", key: "1g98yp" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1", key: "6d4xhi" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1", key: "nxv5o0" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1", key: "1bb6yr" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Link2 = createLucideIcon("Link2", [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2", key: "8i5ue5" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2", key: "1b9ql8" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12", key: "1jonct" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const List = createLucideIcon("List", [
  ["path", { d: "M3 12h.01", key: "nlz23k" }],
  ["path", { d: "M3 18h.01", key: "1tta3j" }],
  ["path", { d: "M3 6h.01", key: "1rqtza" }],
  ["path", { d: "M8 12h13", key: "1za7za" }],
  ["path", { d: "M8 18h13", key: "1lx6n3" }],
  ["path", { d: "M8 6h13", key: "ik3vkj" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LoaderCircle = createLucideIcon("LoaderCircle", [
  ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lock = createLucideIcon("Lock", [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4", key: "fwvmzm" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MonitorSmartphone = createLucideIcon("MonitorSmartphone", [
  ["path", { d: "M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8", key: "10dyio" }],
  ["path", { d: "M10 19v-3.96 3.15", key: "1irgej" }],
  ["path", { d: "M7 19h5", key: "qswx4l" }],
  ["rect", { width: "6", height: "10", x: "16", y: "12", rx: "2", key: "1egngj" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Network = createLucideIcon("Network", [
  ["rect", { x: "16", y: "16", width: "6", height: "6", rx: "1", key: "4q2zg0" }],
  ["rect", { x: "2", y: "16", width: "6", height: "6", rx: "1", key: "8cvhb9" }],
  ["rect", { x: "9", y: "2", width: "6", height: "6", rx: "1", key: "1egb70" }],
  ["path", { d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3", key: "1jsf9p" }],
  ["path", { d: "M12 12V8", key: "2874zd" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Package = createLucideIcon("Package", [
  [
    "path",
    {
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z",
      key: "1a0edw"
    }
  ],
  ["path", { d: "M12 22V12", key: "d0xqtd" }],
  ["path", { d: "m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7", key: "yx3hmr" }],
  ["path", { d: "m7.5 4.27 9 5.15", key: "1c824w" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelLeftClose = createLucideIcon("PanelLeftClose", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }],
  ["path", { d: "m16 15-3-3 3-3", key: "14y99z" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelLeft = createLucideIcon("PanelLeft", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }],
  ["path", { d: "M9 3v18", key: "fh3hqa" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pause = createLucideIcon("Pause", [
  ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", key: "zuxfzm" }],
  ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", key: "1okwgv" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pencil = createLucideIcon("Pencil", [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Play = createLucideIcon("Play", [
  ["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Power = createLucideIcon("Power", [
  ["path", { d: "M12 2v10", key: "mnfbl" }],
  ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04", key: "obofu9" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RefreshCw = createLucideIcon("RefreshCw", [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RotateCw = createLucideIcon("RotateCw", [
  ["path", { d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8", key: "1p45f6" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Scissors = createLucideIcon("Scissors", [
  ["circle", { cx: "6", cy: "6", r: "3", key: "1lh9wr" }],
  ["path", { d: "M8.12 8.12 12 12", key: "1alkpv" }],
  ["path", { d: "M20 4 8.12 15.88", key: "xgtan2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["path", { d: "M14.8 14.8 20 20", key: "ptml3r" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ScrollText = createLucideIcon("ScrollText", [
  ["path", { d: "M15 12h-5", key: "r7krc0" }],
  ["path", { d: "M15 8h-5", key: "1khuty" }],
  ["path", { d: "M19 17V5a2 2 0 0 0-2-2H4", key: "zz82l3" }],
  [
    "path",
    {
      d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3",
      key: "1ph1d7"
    }
  ]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Search = createLucideIcon("Search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
  ["path", { d: "m21 21-4.3-4.3", key: "1qie3q" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Settings$1 = createLucideIcon("Settings", [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldAlert = createLucideIcon("ShieldAlert", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "M12 8v4", key: "1got3b" }],
  ["path", { d: "M12 16h.01", key: "1drbdi" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldCheck = createLucideIcon("ShieldCheck", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Shield = createLucideIcon("Shield", [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Smartphone = createLucideIcon("Smartphone", [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2", key: "1yt0o3" }],
  ["path", { d: "M12 18h.01", key: "mhygvu" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareTerminal = createLucideIcon("SquareTerminal", [
  ["path", { d: "m7 11 2-2-2-2", key: "1lz0vl" }],
  ["path", { d: "M11 13h4", key: "1p7l4v" }],
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Square = createLucideIcon("Square", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Store = createLucideIcon("Store", [
  ["path", { d: "m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7", key: "ztvudi" }],
  ["path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8", key: "1b2hhj" }],
  ["path", { d: "M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4", key: "2ebpfo" }],
  ["path", { d: "M2 7h20", key: "1fcdvo" }],
  [
    "path",
    {
      d: "M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7",
      key: "6c3vgh"
    }
  ]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Terminal = createLucideIcon("Terminal", [
  ["polyline", { points: "4 17 10 11 4 5", key: "akl6gq" }],
  ["line", { x1: "12", x2: "20", y1: "19", y2: "19", key: "q2wloq" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ToggleRight = createLucideIcon("ToggleRight", [
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "6", ry: "6", key: "f2vt7d" }],
  ["circle", { cx: "16", cy: "12", r: "2", key: "4ma0v8" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Trash2 = createLucideIcon("Trash2", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17", key: "1uufr5" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17", key: "xtxkd" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TriangleAlert = createLucideIcon("TriangleAlert", [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Upload = createLucideIcon("Upload", [
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4", key: "ih7n3h" }],
  ["polyline", { points: "17 8 12 3 7 8", key: "t8dd8p" }],
  ["line", { x1: "12", x2: "12", y1: "3", y2: "15", key: "widbto" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Usb = createLucideIcon("Usb", [
  ["circle", { cx: "10", cy: "7", r: "1", key: "dypaad" }],
  ["circle", { cx: "4", cy: "20", r: "1", key: "22iqad" }],
  ["path", { d: "M4.7 19.3 19 5", key: "1enqfc" }],
  ["path", { d: "m21 3-3 1 2 2Z", key: "d3ov82" }],
  ["path", { d: "M9.26 7.68 5 12l2 5", key: "1esawj" }],
  ["path", { d: "m10 14 5 2 3.5-3.5", key: "v8oal5" }],
  ["path", { d: "m18 12 1-1 1 1-1 1Z", key: "1bh22v" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WifiOff = createLucideIcon("WifiOff", [
  ["path", { d: "M12 20h.01", key: "zekei9" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0", key: "1bycff" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 5.17-2.69", key: "1dl1wf" }],
  ["path", { d: "M19 12.859a10 10 0 0 0-2.007-1.523", key: "4k23kn" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 4.177-2.643", key: "1grhjp" }],
  ["path", { d: "M22 8.82a15 15 0 0 0-11.288-3.764", key: "z3jwby" }],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wrench = createLucideIcon("Wrench", [
  [
    "path",
    {
      d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
      key: "cbrjhi"
    }
  ]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const X = createLucideIcon("X", [
  ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
  ["path", { d: "m6 6 12 12", key: "d8bk6v" }]
]);
/**
 * @license lucide-react v0.456.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zap = createLucideIcon("Zap", [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
      key: "1xq2db"
    }
  ]
]);
const __vite_import_meta_env__$1 = {};
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
  const destroy = () => {
    if ((__vite_import_meta_env__$1 ? "production" : void 0) !== "production") {
      console.warn(
        "[DEPRECATED] The `destroy` method will be unsupported in a future version. Instead use unsubscribe function returned by subscribe. Everything will be garbage-collected if store is garbage-collected."
      );
    }
    listeners.clear();
  };
  const api2 = { setState, getState, getInitialState, subscribe, destroy };
  const initialState = state = createState(setState, getState, api2);
  return api2;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;
var withSelector = { exports: {} };
var withSelector_production = {};
var shim$2 = { exports: {} };
var useSyncExternalStoreShim_production = {};
/**
 * @license React
 * use-sync-external-store-shim.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React$1 = reactExports;
function is$1(x2, y2) {
  return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
var objectIs$1 = "function" === typeof Object.is ? Object.is : is$1, useState = React$1.useState, useEffect$1 = React$1.useEffect, useLayoutEffect = React$1.useLayoutEffect, useDebugValue$2 = React$1.useDebugValue;
function useSyncExternalStore$2(subscribe, getSnapshot) {
  var value = getSnapshot(), _useState = useState({ inst: { value, getSnapshot } }), inst = _useState[0].inst, forceUpdate = _useState[1];
  useLayoutEffect(
    function() {
      inst.value = value;
      inst.getSnapshot = getSnapshot;
      checkIfSnapshotChanged(inst) && forceUpdate({ inst });
    },
    [subscribe, value, getSnapshot]
  );
  useEffect$1(
    function() {
      checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      return subscribe(function() {
        checkIfSnapshotChanged(inst) && forceUpdate({ inst });
      });
    },
    [subscribe]
  );
  useDebugValue$2(value);
  return value;
}
function checkIfSnapshotChanged(inst) {
  var latestGetSnapshot = inst.getSnapshot;
  inst = inst.value;
  try {
    var nextValue = latestGetSnapshot();
    return !objectIs$1(inst, nextValue);
  } catch (error) {
    return true;
  }
}
function useSyncExternalStore$1(subscribe, getSnapshot) {
  return getSnapshot();
}
var shim$1 = "undefined" === typeof window || "undefined" === typeof window.document || "undefined" === typeof window.document.createElement ? useSyncExternalStore$1 : useSyncExternalStore$2;
useSyncExternalStoreShim_production.useSyncExternalStore = void 0 !== React$1.useSyncExternalStore ? React$1.useSyncExternalStore : shim$1;
{
  shim$2.exports = useSyncExternalStoreShim_production;
}
var shimExports = shim$2.exports;
/**
 * @license React
 * use-sync-external-store-shim/with-selector.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var React = reactExports, shim = shimExports;
function is(x2, y2) {
  return x2 === y2 && (0 !== x2 || 1 / x2 === 1 / y2) || x2 !== x2 && y2 !== y2;
}
var objectIs = "function" === typeof Object.is ? Object.is : is, useSyncExternalStore = shim.useSyncExternalStore, useRef = React.useRef, useEffect = React.useEffect, useMemo = React.useMemo, useDebugValue$1 = React.useDebugValue;
withSelector_production.useSyncExternalStoreWithSelector = function(subscribe, getSnapshot, getServerSnapshot, selector, isEqual) {
  var instRef = useRef(null);
  if (null === instRef.current) {
    var inst = { hasValue: false, value: null };
    instRef.current = inst;
  } else inst = instRef.current;
  instRef = useMemo(
    function() {
      function memoizedSelector(nextSnapshot) {
        if (!hasMemo) {
          hasMemo = true;
          memoizedSnapshot = nextSnapshot;
          nextSnapshot = selector(nextSnapshot);
          if (void 0 !== isEqual && inst.hasValue) {
            var currentSelection = inst.value;
            if (isEqual(currentSelection, nextSnapshot))
              return memoizedSelection = currentSelection;
          }
          return memoizedSelection = nextSnapshot;
        }
        currentSelection = memoizedSelection;
        if (objectIs(memoizedSnapshot, nextSnapshot)) return currentSelection;
        var nextSelection = selector(nextSnapshot);
        if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
          return memoizedSnapshot = nextSnapshot, currentSelection;
        memoizedSnapshot = nextSnapshot;
        return memoizedSelection = nextSelection;
      }
      var hasMemo = false, memoizedSnapshot, memoizedSelection, maybeGetServerSnapshot = void 0 === getServerSnapshot ? null : getServerSnapshot;
      return [
        function() {
          return memoizedSelector(getSnapshot());
        },
        null === maybeGetServerSnapshot ? void 0 : function() {
          return memoizedSelector(maybeGetServerSnapshot());
        }
      ];
    },
    [getSnapshot, getServerSnapshot, selector, isEqual]
  );
  var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
  useEffect(
    function() {
      inst.hasValue = true;
      inst.value = value;
    },
    [value]
  );
  useDebugValue$1(value);
  return value;
};
{
  withSelector.exports = withSelector_production;
}
var withSelectorExports = withSelector.exports;
const useSyncExternalStoreExports = /* @__PURE__ */ getDefaultExportFromCjs(withSelectorExports);
const __vite_import_meta_env__ = {};
const { useDebugValue } = ReactExports;
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;
let didWarnAboutEqualityFn = false;
const identity = (arg) => arg;
function useStore(api2, selector = identity, equalityFn) {
  if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && equalityFn && !didWarnAboutEqualityFn) {
    console.warn(
      "[DEPRECATED] Use `createWithEqualityFn` instead of `create` or use `useStoreWithEqualityFn` instead of `useStore`. They can be imported from 'zustand/traditional'. https://github.com/pmndrs/zustand/discussions/1937"
    );
    didWarnAboutEqualityFn = true;
  }
  const slice = useSyncExternalStoreWithSelector(
    api2.subscribe,
    api2.getState,
    api2.getServerState || api2.getInitialState,
    selector,
    equalityFn
  );
  useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  if ((__vite_import_meta_env__ ? "production" : void 0) !== "production" && typeof createState !== "function") {
    console.warn(
      "[DEPRECATED] Passing a vanilla store will be unsupported in a future version. Instead use `import { useStore } from 'zustand'`."
    );
  }
  const api2 = typeof createState === "function" ? createStore(createState) : createState;
  const useBoundStore = (selector, equalityFn) => useStore(api2, selector, equalityFn);
  Object.assign(useBoundStore, api2);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;
const useDeviceStore = create((set) => ({
  current: null,
  loading: false,
  error: null,
  setCurrent: (info) => set({ current: info, error: null }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error })
}));
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
function formatTime(ts) {
  const d = new Date(ts);
  const pad = (n2, l2 = 2) => n2.toString().padStart(l2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`;
}
function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
function formatDeviceType(type) {
  const map = {
    adb: "ADB",
    fastboot: "Fastboot",
    qcom_edl: "9008 (EDL)",
    sprd_edl: "展锐 EDL",
    emulator: "模拟器",
    unauthorized: "未授权",
    offline: "离线"
  };
  return map[type] ?? type;
}
const api = window.api;
function WindowControls() {
  const [maximized, setMaximized] = reactExports.useState(false);
  reactExports.useEffect(() => {
    api.system.windowIsMaximized().then(setMaximized).catch(() => {
    });
    const unsub = api.system.onWindowState((state) => setMaximized(state.maximized));
    return unsub;
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group flex items-center gap-3 ml-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => api.system.windowMinimize().catch(() => {
        }),
        className: "relative flex h-3.5 w-3.5 items-center justify-center rounded-full border border-traffic-yellow/40 bg-traffic-yellow/20 transition-colors hover:bg-traffic-yellow hover:border-traffic-yellow",
        title: "最小化",
        "aria-label": "最小化",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "svg",
          {
            className: "absolute h-2 w-2 opacity-0 transition-opacity group-hover:opacity-100",
            viewBox: "0 0 8 8",
            fill: "none",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "1.5", y1: "4", x2: "6.5", y2: "4", stroke: "#4d3500", strokeWidth: "1.6", strokeLinecap: "round" })
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => api.system.windowToggleMaximize().catch(() => {
        }),
        className: "relative flex h-3.5 w-3.5 items-center justify-center rounded-full border border-traffic-green/40 bg-traffic-green/20 transition-colors hover:bg-traffic-green hover:border-traffic-green",
        title: maximized ? "还原" : "最大化",
        "aria-label": maximized ? "还原" : "最大化",
        children: maximized ? (
          /* 还原:两个对角三角形(Mac 风格) */
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              className: "absolute h-2 w-2 opacity-0 transition-opacity group-hover:opacity-100",
              viewBox: "0 0 8 8",
              fill: "none",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2 2 L6 2 L2 6 Z", fill: "#0a3d0a" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 6 L2 6 L6 2 Z", fill: "#0a3d0a", opacity: "0.7" })
              ]
            }
          )
        ) : (
          /* 最大化:左上+右下两个三角形(Mac 风格) */
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "svg",
            {
              className: "absolute h-2 w-2 opacity-0 transition-opacity group-hover:opacity-100",
              viewBox: "0 0 8 8",
              fill: "none",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M2 2 L2 5 L5 2 Z", fill: "#0a3d0a" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M6 6 L6 3 L3 6 Z", fill: "#0a3d0a" })
              ]
            }
          )
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => api.system.windowClose().catch(() => {
        }),
        className: "relative flex h-3.5 w-3.5 items-center justify-center rounded-full border border-traffic-red/40 bg-traffic-red/20 transition-colors hover:bg-traffic-red hover:border-traffic-red",
        title: "关闭",
        "aria-label": "关闭",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "svg",
          {
            className: "absolute h-2 w-2 opacity-0 transition-opacity group-hover:opacity-100",
            viewBox: "0 0 8 8",
            fill: "none",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "2", y1: "2", x2: "6", y2: "6", stroke: "#4d0000", strokeWidth: "1.4", strokeLinecap: "round" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "6", y1: "2", x2: "2", y2: "6", stroke: "#4d0000", strokeWidth: "1.4", strokeLinecap: "round" })
            ]
          }
        )
      }
    )
  ] });
}
const DEFAULT_SETTINGS = {
  windowOpacity: 100,
  speedStart: false,
  checkUpdateTime: 1,
  detailedLog: false,
  infoEn: false,
  onUserDebug: false,
  showDisclaimerOnStart: true
};
const APP_META = {
  name: "iMooAgentTool",
  version: "1.1.0",
  buildDate: "2026-06-18",
  // 作者信息
  author: "J1ao",
  authorQQ: "1987800833",
  authorQQGroup: "",
  // 交流 QQ 群(留空)
  authorWebsite: "",
  // GitHub 仓库地址(留空)
  authorEmail: "1987800833@qq.com",
  // 参考的项目(业务逻辑参考,非代码衍生)
  basedOn: "AllToolBox 1.3.8fix1(业务逻辑参考)"
};
const iconUrl = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJpTW9vIERlc2t0b3AiPg0KICA8ZGVmcz4NCiAgICA8IS0tIEJsdWUgZGlhZ29uYWwgZ3JhZGllbnQ6IGxpZ2h0ZXIgdG9wLWxlZnQg4oaSIGRlZXBlciBib3R0b20tcmlnaHQgLS0+DQogICAgPGxpbmVhckdyYWRpZW50IGlkPSJiZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+DQogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNjBhNWZhIi8+DQogICAgICA8c3RvcCBvZmZzZXQ9IjU1JSIgc3RvcC1jb2xvcj0iIzNiODJmNiIvPg0KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjMjU2M2ViIi8+DQogICAgPC9saW5lYXJHcmFkaWVudD4NCiAgICA8IS0tIFN1YnRsZSB0b3AgZ2xvc3MgZm9yIGRlcHRoIC0tPg0KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ2xvc3MiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj4NCiAgICAgIDxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZmZmZmYiIHN0b3Atb3BhY2l0eT0iMC4yMiIvPg0KICAgICAgPHN0b3Agb2Zmc2V0PSI1NSUiIHN0b3AtY29sb3I9IiNmZmZmZmYiIHN0b3Atb3BhY2l0eT0iMCIvPg0KICAgIDwvbGluZWFyR3JhZGllbnQ+DQogICAgPCEtLSBTb2Z0IGRyb3Agc2hhZG93IHVuZGVyIHRoZSB3YXRjaCBjYXNlIC0tPg0KICAgIDxmaWx0ZXIgaWQ9IndhdGNoU2hhZG93IiB4PSItMjAlIiB5PSItMjAlIiB3aWR0aD0iMTQwJSIgaGVpZ2h0PSIxNDAlIj4NCiAgICAgIDxmZUdhdXNzaWFuQmx1ciBpbj0iU291cmNlQWxwaGEiIHN0ZERldmlhdGlvbj0iNiIvPg0KICAgICAgPGZlT2Zmc2V0IGR4PSIwIiBkeT0iOCIgcmVzdWx0PSJvZmYiLz4NCiAgICAgIDxmZUNvbXBvbmVudFRyYW5zZmVyPjxmZUZ1bmNBIHR5cGU9ImxpbmVhciIgc2xvcGU9IjAuMjgiLz48L2ZlQ29tcG9uZW50VHJhbnNmZXI+DQogICAgICA8ZmVNZXJnZT4NCiAgICAgICAgPGZlTWVyZ2VOb2RlLz4NCiAgICAgICAgPGZlTWVyZ2VOb2RlIGluPSJTb3VyY2VHcmFwaGljIi8+DQogICAgICA8L2ZlTWVyZ2U+DQogICAgPC9maWx0ZXI+DQogIDwvZGVmcz4NCg0KICA8IS0tIEJhY2tncm91bmQgc3F1aXJjbGUgKGlPUy1zdHlsZSB+MjIuNSUgcmFkaXVzKSAtLT4NCiAgPHJlY3Qgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiIHJ4PSIxMTYiIGZpbGw9InVybCgjYmcpIi8+DQogIDxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iMTE2IiBmaWxsPSJ1cmwoI2dsb3NzKSIvPg0KDQogIDwhLS0gV2F0Y2ggc3RyYXBzOiByb3VuZGVkIHdoaXRlIGJhcnMsIHRvcCAmIGJvdHRvbSAtLT4NCiAgPHJlY3QgeD0iMjAwIiB5PSI5MiIgIHdpZHRoPSIxMTIiIGhlaWdodD0iNjgiIHJ4PSIyMiIgZmlsbD0iI2ZmZmZmZiIvPg0KICA8cmVjdCB4PSIyMDAiIHk9IjM1MiIgd2lkdGg9IjExMiIgaGVpZ2h0PSI2OCIgcng9IjIyIiBmaWxsPSIjZmZmZmZmIi8+DQogIDwhLS0gU3RpdGNoIGFjY2VudCBvbiBzdHJhcHMgKHN1YnRsZSBibHVlIG9uIHdoaXRlKSAtLT4NCiAgPHJlY3QgeD0iMjIwIiB5PSIxMTYiIHdpZHRoPSI3MiIgaGVpZ2h0PSI2IiByeD0iMyIgZmlsbD0iIzNiODJmNiIgb3BhY2l0eT0iMC4zNSIvPg0KICA8cmVjdCB4PSIyMjAiIHk9IjM5MCIgd2lkdGg9IjcyIiBoZWlnaHQ9IjYiIHJ4PSIzIiBmaWxsPSIjM2I4MmY2IiBvcGFjaXR5PSIwLjM1Ii8+DQoNCiAgPCEtLSBXYXRjaCBjYXNlOiB3aGl0ZSBvdXRlciByaW5nICsgZGVlcC1ibHVlIGRpYWwgLS0+DQogIDxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMTI4IiBmaWxsPSIjZmZmZmZmIiBmaWx0ZXI9InVybCgjd2F0Y2hTaGFkb3cpIi8+DQogIDxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgcj0iMTA0IiBmaWxsPSIjMWUzYThhIi8+DQoNCiAgPCEtLSBUaWNrIG1hcmtzIGF0IDEyIC8gMyAvIDYgLyA5IC0tPg0KICA8cmVjdCB4PSIyNTIiIHk9IjE2OCIgd2lkdGg9IjgiICBoZWlnaHQ9IjIwIiByeD0iMiIgZmlsbD0iI2ZmZmZmZiIvPg0KICA8cmVjdCB4PSIyNTIiIHk9IjMyNCIgd2lkdGg9IjgiICBoZWlnaHQ9IjIwIiByeD0iMiIgZmlsbD0iI2ZmZmZmZiIvPg0KICA8cmVjdCB4PSIxNjgiIHk9IjI1MiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjgiICByeD0iMiIgZmlsbD0iI2ZmZmZmZiIvPg0KICA8cmVjdCB4PSIzMjQiIHk9IjI1MiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjgiICByeD0iMiIgZmlsbD0iI2ZmZmZmZiIvPg0KDQogIDwhLS0gSG91ciBoYW5kIOKGkiAxMCBvJ2Nsb2NrOyBNaW51dGUgaGFuZCDihpIgMiBvJ2Nsb2NrIChjbGFzc2ljIDEwOjEwIHBvc2UpIC0tPg0KICA8bGluZSB4MT0iMjU2IiB5MT0iMjU2IiB4Mj0iMjA2IiB5Mj0iMjE2IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMTQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPg0KICA8bGluZSB4MT0iMjU2IiB5MT0iMjU2IiB4Mj0iMzE2IiB5Mj0iMjI2IiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMTIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPg0KDQogIDwhLS0gQ2VudGVyIHBpbiAtLT4NCiAgPGNpcmNsZSBjeD0iMjU2IiBjeT0iMjU2IiByPSIxMCIgZmlsbD0iI2ZmZmZmZiIvPg0KICA8Y2lyY2xlIGN4PSIyNTYiIGN5PSIyNTYiIHI9IjQiICBmaWxsPSIjMWUzYThhIi8+DQo8L3N2Zz4NCg==";
function TopBar() {
  const device = useDeviceStore((s) => s.current);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "header",
    {
      className: "flex h-12 shrink-0 items-center gap-3 border-b border-zinc-800/60 bg-zinc-950/70 px-3 backdrop-blur-xl",
      style: { WebkitAppRegion: "drag" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5 pl-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: iconUrl, alt: "iMooAgentTool", className: "h-7 w-7 rounded-md" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px] font-semibold tracking-tight text-zinc-100", children: "iMooAgentTool" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-medium text-zinc-600", children: [
              "v",
              APP_META.version
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-px bg-zinc-800/80" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: { WebkitAppRegion: "no-drag" },
            className: "flex items-center gap-2",
            children: [
              device === null ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 rounded-md border border-zinc-800/80 bg-zinc-900/40 px-2.5 py-1 text-xs text-zinc-500", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "未连接" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: cn(
                    "flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs",
                    device.type === "adb" && "border-blue-700/40 bg-blue-950/40 text-blue-300",
                    device.type === "fastboot" && "border-amber-700/40 bg-amber-950/40 text-amber-300",
                    device.type === "qcom_edl" && "border-purple-700/40 bg-purple-950/40 text-purple-300",
                    !["adb", "fastboot", "qcom_edl"].includes(device.type) && "border-zinc-800/80 bg-zinc-900/40 text-zinc-400"
                  ),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DeviceIcon$2, { type: device.type }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                      formatDeviceType(device.type),
                      device.port ? ` · ${device.port}` : ""
                    ] }),
                    device.innermodel && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-700", children: "|" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-zinc-400", children: [
                        device.model ?? device.innermodel,
                        device.androidVersion ? ` · ${device.androidVersion}` : ""
                      ] })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(WindowControls, {})
            ]
          }
        )
      ]
    }
  );
}
function DeviceIcon$2({ type }) {
  switch (type) {
    case "adb":
    case "emulator":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-3.5 w-3.5" });
    case "fastboot":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-3.5 w-3.5" });
    case "qcom_edl":
    case "sprd_edl":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-3.5 w-3.5" });
    case "unauthorized":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3.5 w-3.5" });
    case "offline":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "h-3.5 w-3.5" });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-3.5 w-3.5" });
  }
}
const useUIStore = create((set) => ({
  sidebarCollapsed: true,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed })
}));
const navGroups = [
  {
    title: "主功能",
    items: [
      { to: "/", label: "主菜单", icon: House },
      { to: "/root", label: "一键 Root", icon: ShieldCheck }
    ]
  },
  {
    title: "工具",
    items: [
      { to: "/reboot", label: "高级重启", icon: RotateCw },
      { to: "/cloud", label: "资源下载", icon: Download },
      { to: "/apps", label: "应用管理", icon: AppWindow },
      { to: "/files", label: "文件管理", icon: FolderOpen },
      { to: "/edl-partitions", label: "EDL 分区", icon: HardDrive },
      { to: "/tools", label: "其他工具", icon: Wrench },
      { to: "/magisk", label: "Magisk 模块", icon: Boxes },
      { to: "/backup", label: "备份恢复", icon: DatabaseBackup }
    ]
  }
];
const bottomItems = [
  { to: "/logs", label: "日志查看", icon: ScrollText },
  { to: "/settings", label: "设置", icon: Settings$1 }
];
function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggle = useUIStore((s) => s.toggleSidebar);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "aside",
    {
      className: cn(
        "flex h-full shrink-0 flex-col border-r border-zinc-800/60 bg-zinc-950/40 backdrop-blur-xl transition-[width] duration-200 ease-in-out",
        collapsed ? "w-16" : "w-60"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 shrink-0 items-center border-b border-zinc-800/60 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: toggle,
            className: cn(
              "flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-800/60 hover:text-blue-400",
              collapsed && "mx-auto"
            ),
            title: collapsed ? "展开侧栏" : "折叠侧栏",
            "aria-label": collapsed ? "展开侧栏" : "折叠侧栏",
            children: collapsed ? /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLeft, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(PanelLeftClose, { className: "h-4 w-4" })
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex flex-1 flex-col gap-5 overflow-y-auto py-4", children: navGroups.map((group, groupIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5", children: [
          !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600", children: group.title }),
          collapsed && groupIdx > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-3 my-2 h-px bg-zinc-800/60" }),
          group.items.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(NavItemView, { item, collapsed }, item.to))
        ] }, group.title)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 border-t border-zinc-800/60 pt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-0.5 pb-2", children: bottomItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(NavItemView, { item, collapsed }, item.to)) }),
          !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-zinc-800/60 px-5 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] text-zinc-600", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              "v",
              APP_META.version
            ] })
          ] }) })
        ] })
      ]
    }
  );
}
function NavItemView({
  item,
  collapsed
}) {
  const Icon2 = item.icon;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    NavLink,
    {
      to: item.to,
      end: item.to === "/",
      className: ({ isActive }) => cn(
        "group relative flex items-center text-[13px] transition-colors",
        collapsed ? "mx-2 justify-center p-2.5 rounded-lg" : "mx-2 gap-3 px-3 py-2 rounded-lg",
        isActive ? "bg-blue-500/10 text-blue-300" : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200",
        item.disabled && "cursor-not-allowed opacity-50 hover:bg-transparent hover:text-zinc-400"
      ),
      onClick: (e) => {
        if (item.disabled) e.preventDefault();
      },
      title: collapsed ? item.label : void 0,
      children: ({ isActive }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        isActive && !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-blue-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Icon2,
          {
            className: cn(
              "h-4 w-4 shrink-0 transition-colors",
              isActive && "text-blue-400"
            )
          }
        ),
        !collapsed && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("flex-1 truncate", isActive && "font-medium"), children: item.label }),
          item.disabled ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-zinc-800/80 px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wide text-zinc-500", children: item.milestone }) : isActive && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-blue-500" })
        ] })
      ] })
    }
  );
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "shrink-0 border-t border-zinc-800 bg-zinc-950 px-4 py-2 text-xs text-zinc-500", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "iMooAgentTool v",
        APP_META.version
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-700", children: "|" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "by ",
        APP_META.author
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "仅供学习交流" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-700", children: "|" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "严禁用于商业用途与手表强制解绑" })
    ] })
  ] }) });
}
const MAX_LOGS = 5e3;
const useLogStore = create((set, get) => ({
  logs: [],
  enabled: { debug: false, info: true, warn: true, error: true },
  filterTaskId: null,
  autoScroll: true,
  addLog: (entry) => {
    set((state) => {
      const logs = [...state.logs, entry];
      if (logs.length > MAX_LOGS) {
        logs.splice(0, logs.length - MAX_LOGS);
      }
      return { logs };
    });
  },
  clear: () => set({ logs: [] }),
  toggleLevel: (level) => set((state) => ({
    enabled: { ...state.enabled, [level]: !state.enabled[level] }
  })),
  setFilterTaskId: (taskId) => set({ filterTaskId: taskId }),
  setAutoScroll: (autoScroll) => set({ autoScroll }),
  getFiltered: () => {
    const { logs, enabled, filterTaskId } = get();
    return logs.filter((l2) => {
      if (!enabled[l2.level]) return false;
      if (filterTaskId && l2.taskId !== filterTaskId) return false;
      return true;
    });
  }
}));
const LEVEL_COLORS$1 = {
  debug: "text-zinc-500",
  info: "text-blue-400",
  warn: "text-amber-400",
  error: "text-red-400"
};
const LEVEL_LABELS = {
  debug: "DEBUG",
  info: "INFO",
  warn: "WARN",
  error: "ERROR"
};
function LogConsole() {
  const [expanded, setExpanded] = reactExports.useState(true);
  const [width, setWidth] = reactExports.useState(420);
  const logs = useLogStore((s) => s.logs);
  const enabled = useLogStore((s) => s.enabled);
  const autoScroll = useLogStore((s) => s.autoScroll);
  const toggleLevel = useLogStore((s) => s.toggleLevel);
  const clear = useLogStore((s) => s.clear);
  const setAutoScroll = useLogStore((s) => s.setAutoScroll);
  const containerRef = reactExports.useRef(null);
  const filteredLogs = logs.filter((l2) => enabled[l2.level]);
  reactExports.useEffect(() => {
    if (autoScroll && expanded && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [filteredLogs, autoScroll, expanded]);
  const onResizeStart = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;
    const onMove = (ev) => {
      const delta = startX - ev.clientX;
      setWidth(Math.max(240, Math.min(640, startWidth + delta)));
    };
    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };
  const handleExport = () => {
    const text = filteredLogs.map((l2) => `[${formatTime(l2.ts)}] [${l2.level.toUpperCase()}] [${l2.source}] ${l2.message}`).join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `imoodesktop-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };
  if (!expanded) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex h-full w-10 shrink-0 flex-col items-center gap-3 border-l border-zinc-800/80 bg-zinc-950/50 py-3 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setExpanded(true),
          className: "rounded p-1.5 text-zinc-500 hover:bg-zinc-900 hover:text-blue-400",
          title: "展开日志",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4" })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 items-center justify-center text-xs text-zinc-600 [writing-mode:vertical-lr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "mb-2 h-3.5 w-3.5" }),
        "日志 ",
        filteredLogs.length
      ] })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative flex h-full shrink-0 flex-col border-l border-zinc-800/80 bg-zinc-950/50 backdrop-blur",
      style: { width },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute left-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-600",
            onMouseDown: onResizeStart
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-9 shrink-0 items-center gap-2 border-b border-zinc-800/80 px-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Terminal, { className: "h-3.5 w-3.5 text-blue-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-zinc-300", children: "日志" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded bg-zinc-800/80 px-1.5 py-0.5 text-[10px] text-zinc-400", children: [
            filteredLogs.length,
            "/",
            logs.length
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setAutoScroll(!autoScroll),
              className: cn(
                "rounded p-1 transition-colors",
                autoScroll ? "bg-blue-500/15 text-blue-400" : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
              ),
              title: autoScroll ? "自动滚动:开" : "自动滚动:关",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDownToLine, { className: "h-3 w-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: handleExport,
              className: "rounded p-1 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300",
              title: "导出日志",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3 w-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: clear,
              className: "rounded p-1 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300",
              title: "清空日志",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setExpanded(false),
              className: "rounded p-1 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300",
              title: "收起日志",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex shrink-0 items-center gap-1 border-b border-zinc-800/80 px-3 py-1.5", children: Object.keys(enabled).map((level) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => toggleLevel(level),
            className: cn(
              "rounded px-1.5 py-0.5 text-[10px] font-medium transition-colors",
              enabled[level] ? LEVEL_COLORS$1[level] + " bg-zinc-800/80" : "text-zinc-600 hover:bg-zinc-900"
            ),
            children: LEVEL_LABELS[level]
          },
          level
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: containerRef,
            className: "log-console flex-1 overflow-y-auto px-2 py-1.5 font-mono text-[11px] leading-relaxed",
            children: filteredLogs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center text-zinc-600", children: "暂无日志" }) : filteredLogs.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1.5 py-0.5 hover:bg-zinc-900/40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("shrink-0 font-semibold", LEVEL_COLORS$1[log.level]), children: [
                "[",
                LEVEL_LABELS[log.level],
                "]"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-all text-zinc-300", children: log.message })
            ] }, log.ts))
          }
        )
      ]
    }
  );
}
let idCounter = 0;
const useToastStore = create((set, get) => ({
  toasts: [],
  add: (kind, msg, duration = 3e3) => {
    const id2 = ++idCounter;
    const item = { id: id2, kind, msg, duration };
    set((state) => ({ toasts: [...state.toasts, item] }));
    if (duration > 0) {
      window.setTimeout(() => {
        get().remove(id2);
      }, duration);
    }
  },
  remove: (id2) => set((state) => ({ toasts: state.toasts.filter((t2) => t2.id !== id2) })),
  clear: () => set({ toasts: [] })
}));
const toast = {
  ok: (msg, duration) => useToastStore.getState().add("ok", msg, duration),
  err: (msg, duration) => useToastStore.getState().add("err", msg, duration ?? 5e3),
  info: (msg, duration) => useToastStore.getState().add("info", msg, duration)
};
const KIND_STYLE = {
  ok: {
    color: "border-green-800/50 bg-green-950/20 text-green-300",
    icon: CircleCheck
  },
  err: {
    color: "border-red-800/50 bg-red-950/20 text-red-300",
    icon: TriangleAlert
  },
  info: {
    color: "border-blue-800/50 bg-blue-950/20 text-blue-300",
    icon: Info
  }
};
function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  const remove = useToastStore((s) => s.remove);
  if (toasts.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2", children: toasts.map((t2) => {
    const style = KIND_STYLE[t2.kind];
    const Icon2 = style.icon;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "pointer-events-auto flex max-w-[480px] items-center gap-2 rounded-md border px-4 py-2 text-sm shadow-lg",
          style.color
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { className: "h-4 w-4 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-all", children: t2.msg }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => remove(t2.id),
              className: "ml-1 shrink-0 rounded p-0.5 opacity-60 hover:opacity-100",
              "aria-label": "关闭",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
            }
          )
        ]
      },
      t2.id
    );
  }) });
}
function AppShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-screen flex-col overflow-hidden rounded-[10px] bg-zinc-950 text-zinc-200", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TopBar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-950 to-blue-950/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Sidebar, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 overflow-y-auto px-8 py-6", children }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(LogConsole, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {})
  ] });
}
function EulaModal() {
  const [visible, setVisible] = reactExports.useState(false);
  const [eulaText, setEulaText] = reactExports.useState("");
  const [agreed, setAgreed] = reactExports.useState(false);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    api.system.getSettings().then((settings) => {
      if (!settings) return;
      if (settings.showDisclaimerOnStart) {
        setVisible(true);
        fetch("../resources/data/EULA.txt").then((res) => res.text()).then((text) => {
          setEulaText(text);
          setLoading(false);
        }).catch(() => {
          setEulaText("EULA 文件加载失败");
          setLoading(false);
        });
      }
    }).catch(() => {
    });
  }, []);
  if (!visible) return null;
  const handleAgree = async () => {
    await api.system.setSettings({ showDisclaimerOnStart: false });
    setVisible(false);
  };
  const handleDisagree = () => {
    api.system.windowClose();
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg border border-zinc-700 bg-zinc-950 shadow-2xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center justify-between border-b border-zinc-800 px-6 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "title-icon" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-semibold", children: "最终用户许可协议" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-zinc-600", children: "v1.1" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-6 py-4", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 text-center text-zinc-500", children: "加载中..." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { className: "whitespace-pre-wrap break-words font-sans text-xs leading-relaxed text-zinc-400", children: eulaText }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "shrink-0 border-t border-zinc-800 px-6 py-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "mb-3 flex items-center gap-2 text-sm text-zinc-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: agreed,
            onChange: (e) => setAgreed(e.target.checked),
            className: "h-4 w-4 accent-blue-600"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "我已阅读并同意上述《最终用户许可协议及免责声明》的全部条款" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleDisagree,
            className: "flex items-center gap-1.5 rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-900",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
              "不同意,退出"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleAgree,
            disabled: !agreed,
            className: cn(
              "flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium text-white transition-colors",
              agreed ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-zinc-800 text-zinc-600"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }),
              "同意并继续"
            ]
          }
        )
      ] })
    ] })
  ] }) });
}
function SplashScreen() {
  const [visible, setVisible] = reactExports.useState(true);
  const [fading, setFading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1200);
    const hideTimer = setTimeout(() => setVisible(false), 1700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);
  if (!visible) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `fixed inset-0 z-[100] flex flex-col items-center justify-center bg-zinc-950 transition-opacity duration-500 ${fading ? "opacity-0" : "opacity-100"}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute h-64 w-64 rounded-full bg-blue-600/10 blur-3xl" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: iconUrl, alt: "iMooAgentTool", className: "h-20 w-20 rounded-2xl shadow-2xl shadow-blue-900/40" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "relative text-xl font-bold tracking-tight text-zinc-100", children: "iMooAgentTool" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "relative mt-1 text-xs text-zinc-500", children: "XTC 电话手表工具箱" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-6 h-1 w-32 overflow-hidden rounded-full bg-zinc-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-1/2 animate-[splash_1.2s_ease-in-out_infinite] rounded-full bg-blue-500" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "relative mt-4 text-[10px] text-zinc-700", children: "v1.0.0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes splash {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      ` })
      ]
    }
  );
}
function useDevice() {
  const setCurrent = useDeviceStore((s) => s.setCurrent);
  reactExports.useEffect(() => {
    api.device.current().then(setCurrent).catch(() => {
    });
    const unsub = api.device.onChange((info) => {
      setCurrent(info);
    });
    return unsub;
  }, [setCurrent]);
}
function useLogs() {
  const addLog = useLogStore((s) => s.addLog);
  reactExports.useEffect(() => {
    api.log.subscribe().catch(() => {
    });
    const unsub = api.log.onLine((entry) => {
      addLog(entry);
    });
    return () => {
      unsub();
      api.log.unsubscribe().catch(() => {
      });
    };
  }, [addLog]);
}
const useSettingsStore = create((set) => ({
  ...DEFAULT_SETTINGS,
  loaded: false,
  load: async () => {
    const settings = await api.system.getSettings();
    set({ ...settings, loaded: true });
  },
  update: async (settings) => {
    const updated = await api.system.setSettings(settings);
    set(updated);
  }
}));
const MAIN_MENU = [
  {
    value: "1",
    label: "一键 Root 设备",
    description: "通过 ADB 或 EDL (9008) 模式 Root 手表",
    icon: ShieldAlert,
    danger: true,
    to: "/root"
  },
  {
    value: "2",
    label: "在此处打开 CMD",
    description: "打开含 adb 环境的命令行",
    icon: SquareTerminal
  },
  {
    value: "3",
    label: "关于脚本",
    description: "版本信息与作者",
    icon: Info,
    to: "/settings"
  },
  {
    value: "4",
    label: "常用功能",
    description: "scrcpy 投屏、充电、无线 ADB 等",
    icon: Wrench,
    to: "/tools"
  },
  {
    value: "5",
    label: "高级重启",
    description: "9 种重启模式(系统/Bootloader/Recovery/9008 等)",
    icon: RotateCw,
    to: "/reboot"
  },
  {
    value: "6",
    label: "下载功能所需资源",
    description: "从云端拉取 userdata/apks/xtcpatch 等资源",
    icon: Download,
    to: "/cloud"
  },
  {
    value: "7",
    label: "应用管理",
    description: "安装/卸载应用、开机自启管理",
    icon: AppWindow,
    to: "/apps"
  },
  {
    value: "7a",
    label: "文件管理",
    description: "浏览设备文件、推送/拉取、安装 APK",
    icon: FolderOpen,
    to: "/files"
  },
  {
    value: "7b",
    label: "EDL 分区管理",
    description: "9008 模式下备份/恢复/擦除分区",
    icon: HardDrive,
    to: "/edl-partitions"
  },
  {
    value: "8",
    label: "Magisk 模块管理",
    description: "模块安装/卸载/列表/商店",
    icon: Boxes,
    to: "/magisk"
  },
  {
    value: "9",
    label: "其他功能",
    description: "型号对照、本地 root 导入、读手表信息",
    icon: Wrench,
    to: "/tools"
  },
  {
    value: "10",
    label: "工具箱设置",
    description: "快速启动、版本、检查更新、窗口设置",
    icon: Settings$1,
    to: "/settings"
  }
];
function Home() {
  const navigate = useNavigate();
  const device = useDeviceStore((s) => s.current);
  const [refreshing, setRefreshing] = reactExports.useState(false);
  const handleClick = async (item) => {
    if (item.disabled) {
      return;
    }
    if (item.to) {
      navigate(item.to);
    } else if (item.value === "2") {
      const res = await api.system.openTerminal();
      if (!res.success) {
        toast.err(`打开终端失败: ${res.error}`);
      }
    }
  };
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const info = await api.device.current();
      useDeviceStore.getState().setCurrent(info);
    } finally {
      setTimeout(() => setRefreshing(false), 500);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden rounded-xl border border-zinc-800/80 bg-gradient-to-br from-blue-950/40 via-zinc-900 to-zinc-950 p-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-600/10 blur-3xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight text-zinc-50", children: "iMooAgentTool" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm text-zinc-400", children: [
          "XTC 电话手表工具箱 · v",
          APP_META.version
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-xs text-zinc-500", children: "仅供学习交流,严禁用于商业用途与手表强制解绑" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xs font-semibold uppercase tracking-wider text-zinc-500", children: "设备状态" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleRefresh,
            disabled: refreshing,
            className: "flex items-center gap-1.5 rounded-md border border-zinc-800 px-2.5 py-1 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-3 w-3", refreshing && "animate-spin") }),
              "刷新"
            ]
          }
        )
      ] }),
      device === null ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyDevice, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx(DeviceCard, { device }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ConnectionGuide, {})
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500", children: "主菜单" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3", children: MAIN_MENU.map((item) => {
        const Icon2 = item.icon ?? Info;
        const isRoot = item.danger;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => handleClick(item),
            className: cn(
              "group flex items-center gap-4 rounded-lg border p-4 text-left transition-all",
              isRoot ? "border-red-900/40 bg-red-950/10 hover:border-red-700/60 hover:bg-red-950/20 hover:shadow-[0_0_20px_-5px] hover:shadow-red-900/40" : "border-zinc-800/80 bg-zinc-900/30 hover:border-blue-600/60 hover:bg-blue-950/20 hover:shadow-[0_0_20px_-5px] hover:shadow-blue-900/40",
              item.disabled && "cursor-not-allowed opacity-60 hover:border-zinc-800/80 hover:bg-zinc-900/30 hover:shadow-none"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isRoot ? "bg-red-600/15 text-red-400 group-hover:bg-red-600/25" : "bg-blue-600/15 text-blue-400 group-hover:bg-blue-600 group-hover:text-white"
                  ),
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { className: "h-5 w-5" })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: cn(
                      "flex items-center gap-2 font-medium",
                      isRoot ? "text-red-200" : "text-zinc-100"
                    ),
                    children: [
                      item.label,
                      item.disabled && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] font-medium text-zinc-500", children: "未开放" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 truncate text-xs text-zinc-500", children: item.description ?? "点击进入" })
              ] })
            ]
          },
          item.value
        );
      }) })
    ] })
  ] });
}
function DeviceCard({ device }) {
  const storageStr = device.storageTotal !== void 0 && device.storageAvailable !== void 0 ? `${formatBytes(device.storageAvailable)} / ${formatBytes(device.storageTotal)}` : void 0;
  const rows = [
    { label: "设备类型", value: formatDeviceType(device.type) },
    { label: "序列号", value: device.serial },
    { label: "COM 端口", value: device.port },
    { label: "型号", value: device.innermodelName },
    { label: "内部型号", value: device.innermodel },
    { label: "产品型号", value: device.model },
    { label: "Android 版本", value: device.androidVersion },
    { label: "SDK 版本", value: device.sdkVersion },
    { label: "软件版本", value: device.softVersion },
    { label: "V3 协议", value: device.isV3 === void 0 ? void 0 : device.isV3 ? "是" : "否" },
    { label: "平台", value: device.platform },
    { label: "CPU 架构", value: device.cpuAbi },
    { label: "屏幕密度", value: device.density ? `${device.density} dpi` : void 0 },
    { label: "电量", value: device.batteryLevel !== void 0 ? `${device.batteryLevel}%` : void 0 },
    { label: "存储可用", value: storageStr },
    { label: "Build ID", value: device.buildId },
    { label: "构建时间", value: device.buildDate },
    { label: "连接时间", value: device.connectedAt ? formatTime(device.connectedAt) : void 0 }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/30", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "flex items-center gap-3 px-4 py-2.5",
          device.type === "adb" && "bg-blue-950/30",
          device.type === "fastboot" && "bg-amber-950/30",
          device.type === "qcom_edl" && "bg-purple-950/30"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DeviceIcon$1, { type: device.type }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium text-zinc-100", children: [
              device.innermodelName ?? formatDeviceType(device.type),
              device.port ? ` · ${device.port}` : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-zinc-500", children: [
              device.serial,
              device.batteryLevel !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-zinc-600", children: [
                "电量 ",
                device.batteryLevel,
                "%"
              ] })
            ] })
          ] }),
          device.batteryLevel !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(BatteryBadge, { level: device.batteryLevel })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2", children: rows.map(
      (row) => row.value !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between border-b border-zinc-800/60 px-4 py-2 text-xs",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500", children: row.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 truncate font-mono text-zinc-200", title: row.value, children: row.value })
          ]
        },
        row.label
      )
    ) })
  ] });
}
function BatteryBadge({ level }) {
  const color = level > 50 ? "text-green-400" : level > 20 ? "text-amber-400" : "text-red-400";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("shrink-0 text-xs font-medium", color), children: [
    level,
    "%"
  ] });
}
function EmptyDevice() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-800 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "h-10 w-10 text-zinc-600" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-zinc-400", children: "未检测到设备" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-md text-center text-xs text-zinc-500", children: "请连接手表到电脑,并确保已开启 ADB 调试。详见下方连接引导。" })
  ] });
}
function DeviceIcon$1({ type }) {
  switch (type) {
    case "adb":
    case "emulator":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4" });
    case "fastboot":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4" });
    case "qcom_edl":
    case "sprd_edl":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4" });
    case "unauthorized":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" });
    case "offline":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "h-4 w-4" });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4" });
  }
}
function ConnectionGuide() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-lg border border-zinc-800/80 bg-zinc-900/20 p-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "mb-2 flex items-center gap-1.5 text-xs font-medium text-zinc-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3 w-3 text-blue-500" }),
      "连接引导"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-xs text-zinc-400", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-300", children: "方式一:" }),
        "在手表上打开拨号盘,输入",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-zinc-800 px-1.5 py-0.5 text-blue-300", children: "*#0769651#*" }),
        " ",
        "打开 ADB 开关,随后用数据线连接电脑。"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-300", children: "方式二:" }),
        "打开手表卡槽,用金属物品短接触点,随后用数据线连接电脑。"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded bg-amber-950/20 p-2 text-[11px] text-amber-300/80", children: "注意:Z2、Z3、Z5A、Z5Q、Z6 请使用方式一连接,输入无反应需断网恢复出厂设置重试,Z2 v3.3.5 需超降级。" })
    ] })
  ] });
}
function Settings() {
  const settings = useSettingsStore();
  const [verifyResult, setVerifyResult] = reactExports.useState(null);
  const [verifying, setVerifying] = reactExports.useState(false);
  const handleVerify = async () => {
    setVerifying(true);
    try {
      const results = await api.system.verifyResources();
      const failed = results.filter((r2) => !r2.ok);
      if (results.length === 0) {
        setVerifyResult("manifest.json 不存在,跳过校验(开发模式正常)");
      } else if (failed.length === 0) {
        setVerifyResult(`校验通过(${results.length} 个文件)`);
      } else {
        setVerifyResult(`校验失败 ${failed.length}/${results.length}:${failed.map((f2) => f2.file).join(", ")}`);
      }
    } catch (e) {
      setVerifyResult(`校验异常: ${e.message}`);
    } finally {
      setVerifying(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "page-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Settings$1, { className: "title-icon" }),
      "设置"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-lg border border-zinc-800 bg-zinc-900/30 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-4 flex items-center gap-2 text-base font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-blue-500" }),
        "工具箱设置"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToggleRow,
          {
            label: "快速启动",
            description: "跳过启动时的更新检查和资源校验",
            checked: settings.speedStart,
            onChange: (v2) => settings.update({ speedStart: v2 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToggleRow,
          {
            label: "详细日志",
            description: "记录更详细的调试日志(对应原 detailedlog.txt)",
            checked: settings.detailedLog,
            onChange: (v2) => settings.update({ detailedLog: v2 })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ToggleRow,
          {
            label: "启动时显示免责声明",
            description: "每次启动显示免责声明弹窗",
            checked: settings.showDisclaimerOnStart,
            onChange: (v2) => settings.update({ showDisclaimerOnStart: v2 })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-lg border border-zinc-800 bg-zinc-900/30 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-4 flex items-center gap-2 text-base font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4 text-blue-500" }),
        "资源完整性"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleVerify,
            disabled: verifying,
            className: "flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: `h-4 w-4 ${verifying ? "animate-spin" : ""}` }),
              verifying ? "校验中..." : "校验资源完整性"
            ]
          }
        ),
        verifyResult && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded bg-zinc-900 p-3 font-mono text-sm text-zinc-300", children: verifyResult })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-lg border border-zinc-800 bg-zinc-900/30 p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-4 flex items-center gap-2 text-base font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-4 w-4 text-blue-500" }),
        "关于"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "应用名称", value: APP_META.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "版本", value: `v${APP_META.version} (${APP_META.buildDate})` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "作者", value: APP_META.author }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "QQ", value: APP_META.authorQQ }),
        APP_META.authorQQGroup,
        APP_META.authorWebsite,
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "反馈邮箱", value: APP_META.authorEmail }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "参考", value: APP_META.basedOn })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded bg-amber-950/30 p-3 text-xs text-amber-300", children: "本工具仅供学习交流,严禁用于商业用途与手表强制解绑。拾取他人手表请归还失主或联系 110。" })
    ] })
  ] });
}
function ToggleRow({
  label,
  description,
  checked,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-zinc-100", children: label }),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-zinc-500", children: description })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        role: "switch",
        "aria-checked": checked,
        onClick: () => onChange(!checked),
        className: `relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-blue-600" : "bg-zinc-700"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: `absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${checked ? "left-6" : "left-1"}`
          }
        )
      }
    )
  ] });
}
function Row({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-400", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-zinc-100", children: value })
  ] });
}
const LEVEL_COLORS = {
  debug: "text-zinc-500",
  info: "text-blue-400",
  warn: "text-amber-400",
  error: "text-red-400"
};
function Logs() {
  const logs = useLogStore((s) => s.logs);
  const clear = useLogStore((s) => s.clear);
  const handleExport = () => {
    const text = logs.map((l2) => `[${formatTime(l2.ts)}] [${l2.level.toUpperCase()}] [${l2.source}] ${l2.message}`).join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `imoodesktop-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.log`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold", children: "日志查看器" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleExport,
            className: "flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4" }),
              "导出"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: clear,
            className: "flex items-center gap-2 rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-900",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
              "清空"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs", children: logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-20 text-center text-zinc-600", children: "暂无日志" }) : logs.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 py-0.5 hover:bg-zinc-900/50", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-zinc-600", children: formatTime(log.ts) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("shrink-0 font-semibold", LEVEL_COLORS[log.level]), children: log.level.toUpperCase().padEnd(5) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 text-zinc-500", children: [
        "[",
        log.source,
        "]"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-all text-zinc-300", children: log.message })
    ] }, log.ts)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-zinc-500", children: [
      "共 ",
      logs.length,
      " 条日志"
    ] })
  ] });
}
const MODELS = [
  // Z 系列(otherpash)
  { innermodel: "I12", model: "Z2", series: "Z", platform: "otherpash" },
  { innermodel: "IB", model: "Z3", series: "Z", platform: "otherpash" },
  { innermodel: "I13C", model: "Z5A", series: "Z", platform: "otherpash" },
  { innermodel: "I13", model: "Z5/Z5Q", series: "Z", platform: "otherpash" },
  { innermodel: "I19", model: "Z5Pro", series: "Z", platform: "otherpash" },
  { innermodel: "I18", model: "Z6", series: "Z", platform: "otherpash" },
  // Z 系列(v3pash)
  { innermodel: "I20", model: "Z6巅峰版", series: "Z", platform: "v3pash" },
  { innermodel: "I25", model: "Z7", series: "Z", platform: "v3pash" },
  { innermodel: "I25C", model: "Z7A", series: "Z", platform: "v3pash" },
  { innermodel: "I25D", model: "Z7S", series: "Z", platform: "v3pash" },
  { innermodel: "I32", model: "Z8", series: "Z", platform: "v3pash" },
  { innermodel: "ND07", model: "Z8A", series: "Z", platform: "v3pash" },
  { innermodel: "ND01", model: "Z9", series: "Z", platform: "v3pash" },
  // Z 系列(z10)
  { innermodel: "ND03", model: "Z10", series: "Z", platform: "z10" },
  { innermodel: "ND08", model: "Z11", series: "Z", platform: "z10" }
];
const FASTBOOTD_MODELS = MODELS.filter((m2) => m2.platform === "z10");
const REBOOT_ITEMS = [
  {
    value: "1",
    mode: "system",
    label: "重启至系统",
    description: "正常重启设备",
    icon: Power
  },
  {
    value: "2",
    mode: "bootloader",
    label: "重启至 Bootloader/Fastboot",
    description: "进入 Fastboot 模式",
    icon: Cpu
  },
  {
    value: "3",
    mode: "recovery",
    label: "重启至 Recovery",
    description: "进入 Recovery 模式",
    icon: RefreshCw,
    needsModelForFastboot: true
  },
  {
    value: "4",
    mode: "edl",
    label: "重启至 9008 (EDL)",
    description: "进入 Qualcomm 紧急下载模式",
    icon: Cpu,
    danger: true,
    needsModelForFastboot: true
  },
  {
    value: "5",
    mode: "twrp-temp",
    label: "临时启动 TWRP",
    description: "不刷入,仅临时启动 TWRP Recovery",
    icon: HardDriveDownload,
    needsModel: true
  },
  {
    value: "6",
    mode: "qmmi",
    label: "misc 进入 QMMI",
    description: "写 misc 分区(ffbm-02),进入 QMMI 工厂模式",
    icon: ToggleRight,
    needsModel: true
  },
  {
    value: "7",
    mode: "ffbm",
    label: "misc 进入 FFBM",
    description: "写 misc 分区(ffbm-01),进入 Fast Factory Boot Mode",
    icon: ToggleRight,
    needsModel: true
  },
  {
    value: "8",
    mode: "wipe-data",
    label: "misc 进入 Recovery 并清除 data",
    description: "写 misc 分区(boot-recovery),重启后恢复出厂设置",
    icon: Trash2,
    danger: true,
    needsModel: true
  },
  {
    value: "9",
    mode: "fastbootd",
    label: "misc 进入 fastbootd",
    description: "写 misc 分区(boot-fastbootd),仅 Z10/Z11",
    icon: ToggleRight,
    needsModel: true,
    fastbootdOnly: true
  }
];
function Reboot() {
  const device = useDeviceStore((s) => s.current);
  const [selected, setSelected] = reactExports.useState(null);
  const [model, setModel] = reactExports.useState(null);
  const [executing, setExecuting] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const handleClick = (item) => {
    setSelected(item);
    setResult(null);
    setModel(null);
    const needModel = item.needsModel || item.needsModelForFastboot && device?.type === "fastboot";
    if (!needModel) {
      void execute(item);
    }
  };
  const execute = async (item, selectedModel) => {
    setExecuting(true);
    setResult(null);
    try {
      const opts = {
        mode: item.mode
      };
      if (item.needsModel && selectedModel) {
        opts.innermodel = selectedModel.innermodel;
        opts.platform = selectedModel.platform;
      }
      if (item.needsModelForFastboot && selectedModel) {
        opts.innermodel = selectedModel.innermodel;
      }
      const res = await api.reboot.execute(opts);
      if (res.success) {
        setResult({ success: true, message: "指令已发送" });
      } else {
        setResult({ success: false, message: res.error ?? "未知错误" });
      }
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setExecuting(false);
    }
  };
  const handleConfirmModel = () => {
    if (!selected || !model) return;
    void execute(selected, model);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "page-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCw, { className: "title-icon" }),
        "高级重启"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-desc", children: "选择重启模式。危险操作会高亮提示。" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: REBOOT_ITEMS.map((item) => {
      const Icon2 = item.icon;
      const isActive = selected?.value === item.value;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => handleClick(item),
          disabled: executing,
          className: cn(
            "flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
            isActive ? "border-blue-600 bg-blue-950/30" : "border-zinc-800/80 bg-zinc-900/30 hover:border-blue-600/60 hover:bg-blue-950/20",
            item.danger && !isActive && "border-red-900/40 bg-red-950/10 hover:border-red-700/60 hover:bg-red-950/20",
            item.danger && isActive && "border-red-600 bg-red-950/30",
            executing && "cursor-not-allowed opacity-50"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                  item.danger ? "bg-red-600/15 text-red-400" : "bg-blue-600/15 text-blue-400"
                ),
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { className: "h-4 w-4" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cn(
                    "text-sm font-medium",
                    item.danger ? "text-red-200" : "text-zinc-100"
                  ),
                  children: item.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-xs text-zinc-500", children: item.description })
            ] }),
            item.needsModel && /* @__PURE__ */ jsxRuntimeExports.jsx(
              ChevronRight,
              {
                className: cn(
                  "h-4 w-4 shrink-0 transition-transform",
                  isActive && "rotate-90"
                )
              }
            )
          ]
        },
        item.value
      );
    }) }),
    selected && (selected.needsModel || selected.needsModelForFastboot && device?.type === "fastboot") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-3 flex items-center gap-2 text-sm font-medium", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-amber-500" }),
        "选择型号",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-normal text-zinc-500", children: [
          "(",
          selected.fastbootdOnly ? "仅 Z10/Z11 支持" : "全部型号",
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4", children: (selected.fastbootdOnly ? FASTBOOTD_MODELS : MODELS).map((m2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setModel(m2),
          disabled: executing,
          className: cn(
            "rounded-md border px-3 py-2 text-left text-xs transition-colors",
            model?.innermodel === m2.innermodel ? "border-blue-600 bg-blue-950/40 text-blue-200" : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-blue-600/40 hover:bg-zinc-900/50"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: m2.model }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-zinc-500", children: m2.innermodel })
          ]
        },
        m2.innermodel
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleConfirmModel,
            disabled: !model || executing,
            className: cn(
              "rounded-md px-4 py-2 text-sm font-medium text-white transition-colors",
              selected.danger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700",
              (!model || executing) && "cursor-not-allowed opacity-50"
            ),
            children: executing ? "执行中..." : `确认${selected.danger ? "(危险)" : "执行"}`
          }
        ),
        model && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-zinc-500", children: [
          "已选:",
          model.model,
          " (",
          model.innermodel,
          ") · ",
          model.platform
        ] })
      ] })
    ] }),
    result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "rounded-lg border p-4 text-sm",
          result.success ? "alert-ok-color" : "alert-err-color"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            result.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: result.success ? "成功" : "失败" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs opacity-80", children: result.message })
        ]
      }
    )
  ] });
}
function Cloud() {
  const [grouped, setGrouped] = reactExports.useState({});
  const [loading, setLoading] = reactExports.useState(true);
  const [downloading, setDownloading] = reactExports.useState(null);
  const [progress, setProgress] = reactExports.useState({});
  const [results, setResults] = reactExports.useState({});
  const load = async () => {
    setLoading(true);
    try {
      const data = await api.cloud.listByCategory();
      setGrouped(data);
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    load();
    const unsub = api.cloud.onProgress((data) => {
      setProgress((prev) => ({ ...prev, [data.name]: data.percent }));
    });
    return unsub;
  }, []);
  const handleDownload = async (name) => {
    setDownloading(name);
    setProgress((prev) => ({ ...prev, [name]: 0 }));
    setResults((prev) => ({ ...prev, [name]: { success: false, message: void 0 } }));
    try {
      const res = await api.cloud.download(name);
      setResults((prev) => ({ ...prev, [name]: { success: res.success, message: res.error } }));
      if (res.success) {
        await load();
      }
    } catch (e) {
      setResults((prev) => ({ ...prev, [name]: { success: false, message: e.message } }));
    } finally {
      setDownloading(null);
    }
  };
  const handleDownloadCategory = async (category) => {
    const resources = grouped[category] ?? [];
    for (const r2 of resources) {
      await handleDownload(r2.name);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-20 text-zinc-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "加载资源列表..." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "page-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "title-icon" }),
          "资源下载"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-desc", children: "从云端下载功能所需资源(4 镜像自适应)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: load,
          className: "flex items-center gap-1.5 rounded-md border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3" }),
            "刷新"
          ]
        }
      )
    ] }),
    Object.entries(grouped).map(([category, resources]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-xs font-semibold uppercase tracking-wider text-zinc-500", children: [
          category,
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-2 text-zinc-600", children: [
            "(",
            resources.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => handleDownloadCategory(category),
            disabled: downloading !== null,
            className: "rounded border border-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 disabled:opacity-50",
            children: "全部下载"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3", children: resources.map((r2) => {
        const isDownloading = downloading === r2.name;
        const pct = progress[r2.name] ?? 0;
        const result = results[r2.name];
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "flex flex-col rounded-lg border p-3",
              result?.success ? "border-green-800/40 bg-green-950/10" : result?.success === false ? "border-red-800/40 bg-red-950/10" : "border-zinc-800/80 bg-zinc-900/30"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Package,
                  {
                    className: cn(
                      "mt-0.5 h-4 w-4 shrink-0",
                      r2.required ? "text-blue-400" : "text-zinc-500"
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-sm font-medium text-zinc-100", children: [
                    r2.name,
                    r2.required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-blue-500/15 px-1 py-0.5 text-[9px] text-blue-400", children: "必需" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-xs text-zinc-500", children: r2.description }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 truncate font-mono text-[10px] text-zinc-600", children: r2.filename })
                ] })
              ] }),
              isDownloading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 overflow-hidden rounded-full bg-zinc-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "h-full bg-blue-600 transition-all",
                    style: { width: `${pct}%` }
                  }
                ) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-right text-[10px] text-zinc-500", children: [
                  pct,
                  "%"
                ] })
              ] }),
              result?.success && !isDownloading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-1 text-xs text-green-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "已下载" }),
                r2.localVersion && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted", children: [
                  "· ",
                  r2.localVersion
                ] })
              ] }),
              result?.success === false && !isDownloading && result.message && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-1 text-xs text-red-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: result.message })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => handleDownload(r2.name),
                  disabled: isDownloading || downloading !== null,
                  className: cn(
                    "mt-2 flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium transition-colors",
                    isDownloading ? "bg-zinc-800 text-zinc-500" : "bg-blue-600/15 text-blue-400 hover:bg-blue-600 hover:text-white"
                  ),
                  children: [
                    isDownloading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3 w-3" }),
                    isDownloading ? `${pct}%` : "下载"
                  ]
                }
              )
            ]
          },
          r2.name
        );
      }) })
    ] }, category))
  ] });
}
function ApkPreviewDialog({ apkPath, onConfirm, onClose }) {
  const [loading, setLoading] = reactExports.useState(false);
  const [info, setInfo] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    if (!apkPath) {
      setInfo(null);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    setInfo(null);
    api.file.parseApk(apkPath).then((result) => setInfo(result)).catch(() => {
    }).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, [apkPath]);
  if (!apkPath) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-h-[85vh] w-[480px] overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-2xl",
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "flex items-center gap-2 text-sm font-semibold text-zinc-200", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4 text-blue-400" }),
            "APK 信息"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }) })
        ] }),
        info && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-zinc-700 bg-zinc-800", children: [
            info.iconBase64 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: `data:${info.iconMime ?? "image/png"};base64,${info.iconBase64}`,
                alt: "应用图标",
                className: "h-16 w-16 object-contain",
                onError: (e) => {
                  e.target.style.display = "none";
                  const fallback = e.target.nextElementSibling;
                  if (fallback) fallback.style.display = "flex";
                }
              }
            ) : null,
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Package,
              {
                className: cn("h-8 w-8 text-zinc-500", info.iconBase64 && "hidden")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-base font-medium text-zinc-100", children: info.label ?? info.packageName }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 truncate font-mono text-xs text-zinc-500", title: info.packageName, children: info.packageName }),
            info.versionName && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 text-xs text-zinc-400", children: [
              "v",
              info.versionName,
              info.versionCode ? ` (${info.versionCode})` : ""
            ] })
          ] })
        ] }),
        (!info || loading) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-zinc-500", children: "文件" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 truncate text-sm text-zinc-300", title: apkPath, children: apkPath.split(/[\\/]/).pop() })
        ] }),
        loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-8 text-sm text-zinc-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "解析中..." })
        ] }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-md border border-red-800/50 bg-red-950/20 p-3 text-sm text-red-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "解析失败: ",
            error
          ] })
        ] }),
        info && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              InfoCell,
              {
                label: "最低 SDK",
                value: info.minSdkVersion ? `API ${info.minSdkVersion}` : "-"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              InfoCell,
              {
                label: "目标 SDK",
                value: info.targetSdkVersion ? `API ${info.targetSdkVersion}` : "-"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 rounded-md border border-zinc-800 bg-zinc-900/30 p-3 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "h-3.5 w-3.5 text-zinc-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500", children: "APK 大小:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-zinc-300", children: formatBytes(info.apkSize) })
            ] }),
            info.dexSize !== void 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5 text-zinc-500" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500", children: "DEX:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-zinc-300", children: formatBytes(info.dexSize) })
            ] }),
            info.signer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-green-400" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500", children: "已签名:" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-zinc-300", children: info.signer })
            ] })
          ] }),
          info.abis.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-3.5 w-3.5 text-zinc-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500", children: "CPU 架构:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-zinc-300", children: info.abis.join(", ") })
          ] }),
          info.permissions.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-center gap-1.5 text-xs font-medium text-zinc-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3.5 w-3.5 text-amber-400" }),
              "权限(",
              info.permissions.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-40 overflow-y-auto rounded-md border border-zinc-800 bg-zinc-950/50 p-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: info.permissions.map((perm) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400",
                children: perm
              },
              perm
            )) }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onClose,
              className: "rounded-md border border-zinc-800 px-4 py-1.5 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200",
              children: "取消"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => onConfirm(apkPath),
              disabled: loading || !!error,
              className: "flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5" }),
                "安装"
              ]
            }
          )
        ] })
      ]
    }
  ) });
}
function InfoCell({ label, value, mono }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-zinc-800 bg-zinc-900/30 px-3 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-zinc-500", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("mt-0.5 truncate text-xs text-zinc-200", mono && "font-mono"), title: value, children: value })
  ] });
}
function Apps() {
  const device = useDeviceStore((s) => s.current);
  const [packages, setPackages] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [search, setSearch] = reactExports.useState("");
  const [thirdParty, setThirdParty] = reactExports.useState(true);
  const [installResult, setInstallResult] = reactExports.useState(null);
  const [uninstallResult, setUninstallResult] = reactExports.useState(null);
  const loadPackages = reactExports.useCallback(async () => {
    if (!device || device.type !== "adb") {
      setPackages([]);
      return;
    }
    setLoading(true);
    try {
      const list = await api.app.list(thirdParty);
      setPackages(list);
    } finally {
      setLoading(false);
    }
  }, [device, thirdParty]);
  reactExports.useEffect(() => {
    void loadPackages();
  }, [loadPackages]);
  const [apkPreviewPath, setApkPreviewPath] = reactExports.useState(null);
  const handleInstall = async () => {
    const files = await api.system.pickFile({
      kind: "open",
      filter: "APK 文件|*.apk;所有文件|*.*",
      multi: false
    });
    if (!files) return;
    const apkPath = Array.isArray(files) ? files[0] : files;
    setApkPreviewPath(apkPath);
  };
  const handleConfirmInstall = async (apkPath) => {
    setApkPreviewPath(null);
    setInstallResult(null);
    const res = await api.app.install(apkPath);
    setInstallResult({
      success: res.success,
      message: res.success ? `安装成功: ${apkPath.split(/[\\/]/).pop()}` : `安装失败: ${res.error}`
    });
    await loadPackages();
  };
  const handleUninstall = async (pkg) => {
    if (!window.confirm(`确定卸载 ${pkg}?`)) return;
    const res = await api.app.uninstall(pkg);
    setUninstallResult({
      success: res.success,
      message: res.success ? `已卸载: ${pkg}` : `卸载失败: ${res.error}`
    });
    if (res.success) {
      await loadPackages();
    }
  };
  const filtered = packages.filter((p2) => p2.toLowerCase().includes(search.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "page-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AppWindow, { className: "title-icon" }),
        "应用管理"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-desc", children: "安装/卸载应用" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleInstall,
          className: "flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
            "安装应用"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: loadPackages,
          disabled: loading,
          className: "flex items-center gap-1.5 rounded-md border border-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-3.5 w-3.5", loading && "animate-spin") }),
            "刷新"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setThirdParty(!thirdParty),
          className: "rounded-md border border-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
          children: thirdParty ? "显示全部" : "仅第三方"
        }
      )
    ] }),
    installResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "flex items-center gap-2 rounded-md border p-3 text-sm",
          installResult.success ? "alert-ok-color" : "alert-err-color"
        ),
        children: [
          installResult.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: installResult.message })
        ]
      }
    ),
    uninstallResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "flex items-center gap-2 rounded-md border p-3 text-sm",
          uninstallResult.success ? "alert-ok-color" : "alert-err-color"
        ),
        children: [
          uninstallResult.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: uninstallResult.message })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              placeholder: "搜索包名...",
              className: "w-full rounded-md border border-zinc-800 bg-zinc-900/50 py-1.5 pl-8 pr-3 text-xs text-zinc-200 placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-zinc-500", children: [
          "共 ",
          filtered.length,
          " 个"
        ] })
      ] }),
      !device || device.type !== "adb" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-800 py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "h-10 w-10 text-zinc-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-zinc-400", children: !device ? "未检测到设备" : "应用管理需要 ADB 模式设备" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-md text-center text-xs text-zinc-500", children: "请连接手表并开启 ADB 调试后查看应用列表" })
      ] }) : loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-10 text-zinc-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "加载中..." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-96 overflow-y-auto rounded-lg border border-zinc-800", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-10 text-center text-sm text-zinc-500", children: "无应用" }) : filtered.map((pkg) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between border-b border-zinc-800/60 px-3 py-2 last:border-0 hover:bg-zinc-900/40",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs text-zinc-300", children: pkg }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleUninstall(pkg),
                className: "rounded p-1 text-zinc-500 hover:bg-red-600 hover:text-white",
                title: "卸载",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
              }
            )
          ]
        },
        pkg
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Z10Unlock, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AutoStart, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ApkPreviewDialog,
      {
        apkPath: apkPreviewPath,
        onConfirm: (path) => void handleConfirmInstall(path),
        onClose: () => setApkPreviewPath(null)
      }
    )
  ] });
}
function Z10Unlock() {
  const device = useDeviceStore((s) => s.current);
  const [executing, setExecuting] = reactExports.useState(false);
  const [expanded, setExpanded] = reactExports.useState(true);
  const [result, setResult] = reactExports.useState(null);
  const handleExecute = async () => {
    if (!device || device.type !== "adb") return;
    if (!window.confirm(
      "请确认手表已进入 QMMI 模式并已降级。\n\n本操作将:\n1. 推送 switch.db\n2. adb root\n3. 写入 setprop 解除限制\n4. 软重启 zygote\n5. 安装 z10apk.Apk + z10apk1.Apk\n\n是否继续?"
    ))
      return;
    setExecuting(true);
    setResult(null);
    try {
      const r2 = await api.app.unlockZ10();
      setResult(r2);
    } catch (e) {
      setResult({
        success: false,
        steps: [],
        error: e.message
      });
    } finally {
      setExecuting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "section-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setExpanded(!expanded),
        className: "flex items-center gap-2 hover:text-zinc-300",
        children: [
          expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
          "Z10 解除安装限制"
        ]
      }
    ) }),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-3 text-xs text-zinc-400", children: [
        "对应 z10openinst.bat:推送 switch.db → adb root → setprop adb_port/adb.install=1 → cp switch.db → 软重启 zygote → 安装 z10apk.Apk / z10apk1.Apk。",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-1 block text-amber-300", children: "要求:手表已进 QMMI 并降级,否则 adb root 会失败。" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleExecute,
          disabled: executing || !device || device.type !== "adb",
          className: "flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
          children: [
            executing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
            executing ? "执行中..." : "Z10 解除安装限制"
          ]
        }
      ),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
        result.error && !result.steps.length && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "alert-err-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: result.error })
        ] }),
        result.steps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-zinc-800 p-2", children: result.steps.map((step) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-2 border-b border-zinc-800/60 px-1 py-1.5 last:border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: step.status === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-green-400" }) : step.status === "failed" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 text-red-400" }) : step.status === "running" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-blue-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3.5 w-3.5 rounded-full border border-zinc-700" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-zinc-300", children: step.name }),
                step.message && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[10px] text-zinc-500", children: step.message })
              ] })
            ]
          },
          step.name
        )) }),
        result.success && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "alert-ok-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Z10 安装限制已解除" })
        ] })
      ] })
    ] })
  ] });
}
function AutoStart() {
  const device = useDeviceStore((s) => s.current);
  const [executing, setExecuting] = reactExports.useState(false);
  const [expanded, setExpanded] = reactExports.useState(true);
  const [result, setResult] = reactExports.useState(null);
  const handleExecute = async () => {
    if (!device || device.type !== "adb") return;
    setExecuting(true);
    setResult(null);
    try {
      const r2 = await api.app.enableAutoStart();
      setResult(r2);
    } catch (e) {
      setResult({
        success: false,
        results: [],
        error: e.message
      });
    } finally {
      setExecuting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "section-title", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setExpanded(!expanded),
        className: "flex items-center gap-2 hover:text-zinc-300",
        children: [
          expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRight, { className: "h-3.5 w-3.5" }),
          "QQ/微信开机自启"
        ]
      }
    ) }),
    expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-xs text-zinc-400", children: "对应 qqwxautestart.bat:调用 content call com.xtc.launcher.self.start,默认包名:" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mb-3 list-inside list-disc space-y-0.5 text-[11px] text-zinc-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "com.tencent.qqlite(轻量 QQ)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "com.tencent.qqwatch(QQ 手表版)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "com.tencent.wechatkids(微信少儿版)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleExecute,
          disabled: executing || !device || device.type !== "adb",
          className: "flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
          children: [
            executing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ToggleRight, { className: "h-3.5 w-3.5" }),
            executing ? "执行中..." : "设置开机自启"
          ]
        }
      ),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-2", children: [
        result.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "alert-err-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: result.error })
        ] }),
        result.results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-zinc-800 p-2", children: result.results.map((r2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between border-b border-zinc-800/60 px-1 py-1.5 last:border-0",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] text-zinc-300", children: r2.pkg }),
              r2.success ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] text-green-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }),
                " 成功"
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1 text-[10px] text-red-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
                " ",
                r2.error ?? "失败"
              ] })
            ]
          },
          r2.pkg
        )) }),
        result.success && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "alert-ok-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "操作完成!" })
        ] })
      ] })
    ] })
  ] });
}
function Tools() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "page-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Wrench, { className: "title-icon" }),
        "其他工具"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-desc", children: "scrcpy 投屏、充电、无线 ADB、设备信息、OTA 升级、驱动检测、.atbmod 模块" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ScrcpyLauncher, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OpenCharge, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(WifiAdb, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ReadBuildProps, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(OtaUpgrade, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DriverCheck, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AtbmodManager, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(RootProOptimize, {})
  ] });
}
function OpenCharge() {
  const device = useDeviceStore((s) => s.current);
  const [executing, setExecuting] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const handleExecute = async () => {
    setExecuting(true);
    setResult(null);
    try {
      const res = await api.tools.openCharge();
      setResult({
        success: res.success,
        message: res.success ? "充电可用已开启" : res.error ?? "失败"
      });
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setExecuting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "section-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(BatteryCharging, { className: "h-3.5 w-3.5" }),
      "充电可用"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-xs text-zinc-400", children: "开启后设备可在充电时使用(需 root 权限)。对应 setprop persist.sys.charge.usable true" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleExecute,
          disabled: executing || !device || device.type !== "adb",
          className: "flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
          children: [
            executing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(BatteryCharging, { className: "h-3.5 w-3.5" }),
            executing ? "执行中..." : "开启充电可用"
          ]
        }
      ),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "mt-3 flex items-center gap-2 text-xs",
            result.success ? "text-green-400" : "text-red-400"
          ),
          children: [
            result.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: result.message })
          ]
        }
      )
    ] })
  ] });
}
function WifiAdb() {
  const device = useDeviceStore((s) => s.current);
  const [ip, setIp] = reactExports.useState("");
  const [port, setPort] = reactExports.useState("5555");
  const [executing, setExecuting] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const handleEnable = async () => {
    setExecuting(true);
    setResult(null);
    try {
      const res = await api.tools.wifiEnable();
      setResult({
        success: res.success,
        message: res.success ? "已切换到无线模式(端口 5555),请拔掉 USB 后用 IP 连接" : res.error ?? "失败"
      });
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setExecuting(false);
    }
  };
  const handleConnect = async () => {
    if (!ip) {
      setResult({ success: false, message: "请输入设备 IP" });
      return;
    }
    setExecuting(true);
    setResult(null);
    try {
      const res = await api.tools.wifiConnect(ip, Number(port) || 5555);
      setResult({
        success: res.success,
        message: res.success ? `已连接 ${ip}:${port}` : res.error ?? `连接 ${ip}:${port} 失败`
      });
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setExecuting(false);
    }
  };
  const handleDisconnect = async () => {
    if (!ip) return;
    setExecuting(true);
    try {
      await api.tools.wifiDisconnect(ip, Number(port) || 5555);
      setResult({ success: true, message: `已断开 ${ip}:${port}` });
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setExecuting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "section-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Network, { className: "h-3.5 w-3.5" }),
      "无线调试 (ADB)"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex flex-wrap items-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-[10px] text-zinc-500", children: "设备 IP" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: ip,
              onChange: (e) => setIp(e.target.value),
              placeholder: "如 192.168.1.100",
              className: "w-40 rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 placeholder-zinc-600"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-[10px] text-zinc-500", children: "端口" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: port,
              onChange: (e) => setPort(e.target.value),
              className: "w-16 rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleConnect,
            disabled: executing || !ip,
            className: "rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50",
            children: "连接"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleDisconnect,
            disabled: executing || !ip,
            className: "rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50",
            children: "断开"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleEnable,
          disabled: executing || !device || device.type !== "adb",
          className: "flex items-center gap-1.5 rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50",
          children: [
            executing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Network, { className: "h-3 w-3" }),
            "切换到无线模式(需 USB 连接)"
          ]
        }
      ),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "mt-3 flex items-center gap-2 text-xs",
            result.success ? "text-green-400" : "text-red-400"
          ),
          children: [
            result.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: result.message })
          ]
        }
      )
    ] })
  ] });
}
function ReadBuildProps() {
  const device = useDeviceStore((s) => s.current);
  const [loading, setLoading] = reactExports.useState(false);
  const [props, setProps] = reactExports.useState([]);
  const [search, setSearch] = reactExports.useState("");
  const load = async () => {
    setLoading(true);
    try {
      const res = await api.tools.readBuildProps();
      if (res.success) {
        setProps(res.props);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };
  reactExports.useEffect(() => {
    if (device?.type === "adb") {
      load();
    } else {
      setProps([]);
    }
  }, [device]);
  const filtered = props.filter(
    (p2) => p2.label.toLowerCase().includes(search.toLowerCase()) || p2.key.toLowerCase().includes(search.toLowerCase()) || p2.value.toLowerCase().includes(search.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "h-3.5 w-3.5" }),
        "设备信息"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: load,
          disabled: loading || !device || device.type !== "adb",
          className: "rounded border border-zinc-800 px-2 py-0.5 text-[10px] text-zinc-400 hover:bg-zinc-900 disabled:opacity-50",
          children: "刷新"
        }
      )
    ] }),
    !device || device.type !== "adb" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-800 py-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "h-8 w-8 text-zinc-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-zinc-500", children: "需要 ADB 模式设备" })
    ] }) : loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-10 text-zinc-500", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "读取中..." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 relative max-w-xs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-zinc-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "text",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            placeholder: "搜索属性...",
            className: "w-full rounded border border-zinc-800 bg-zinc-900/50 py-1 pl-7 pr-2 text-xs text-zinc-200 placeholder-zinc-600"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-80 overflow-y-auto rounded-lg border border-zinc-800", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-6 text-center text-xs text-zinc-500", children: "无数据" }) : filtered.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "border-b border-zinc-800/60 px-3 py-1.5 last:border-0 hover:bg-zinc-900/40",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-zinc-500", children: p2.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-zinc-600", children: p2.key }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-mono text-xs text-zinc-200", children: p2.value })
            ] })
          ]
        },
        p2.key
      )) })
    ] })
  ] });
}
function ScrcpyLauncher() {
  const device = useDeviceStore((s) => s.current);
  const [opts, setOpts] = reactExports.useState({
    noControl: false,
    turnScreenOff: false,
    stayAwake: true,
    noAudio: false,
    showTouches: false,
    fullscreen: false,
    alwaysOnTop: false
  });
  const [launching, setLaunching] = reactExports.useState(false);
  const [running, setRunning] = reactExports.useState([]);
  const [result, setResult] = reactExports.useState(null);
  const refreshRunning = async () => {
    setRunning(await api.scrcpy.list());
  };
  reactExports.useEffect(() => {
    refreshRunning();
    void api.scrcpy.subscribe();
    const unsub = api.scrcpy.onProcessChange(() => {
      void refreshRunning();
    });
    return unsub;
  }, []);
  const handleLaunch = async () => {
    if (!device || device.type !== "adb") {
      setResult({ success: false, message: "投屏需要 ADB 模式设备" });
      return;
    }
    setLaunching(true);
    setResult(null);
    try {
      const res = await api.scrcpy.launch(opts);
      if (res.success && res.pid) {
        setResult({ success: true, message: `已启动 (pid=${res.pid})` });
        await refreshRunning();
      } else {
        setResult({ success: false, message: res.error ?? "启动失败" });
      }
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setLaunching(false);
    }
  };
  const handleStop = async (pid) => {
    await api.scrcpy.stop(pid);
    await refreshRunning();
  };
  const toggle = (key) => {
    setOpts((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const checkboxes = [
    { key: "noControl", label: "禁用控制(仅观看)" },
    { key: "turnScreenOff", label: "关闭屏幕" },
    { key: "stayAwake", label: "保持唤醒" },
    { key: "noAudio", label: "禁用音频" },
    { key: "audio", label: "启用音频(实验)" },
    { key: "showTouches", label: "显示触摸" },
    { key: "alwaysOnTop", label: "窗口置顶" },
    { key: "fullscreen", label: "全屏" },
    { key: "windowBorderless", label: "无边框" },
    { key: "noClipboardAutosync", label: "禁用剪贴板同步" },
    { key: "legacyPaste", label: "旧版粘贴" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "section-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MonitorSmartphone, { className: "h-3.5 w-3.5" }),
      "scrcpy 投屏"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      (!device || device.type !== "adb") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2 rounded-md border border-amber-800/40 bg-amber-950/20 px-3 py-2 text-xs text-amber-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          !device ? "未检测到设备" : "投屏需要 ADB 模式设备",
          "。请连接手表并开启 ADB 调试。"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4", children: checkboxes.map(({ key, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          className: "flex items-center gap-1.5 text-xs text-zinc-400 cursor-pointer",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: Boolean(opts[key]),
                onChange: () => toggle(key),
                className: "h-3 w-3 accent-blue-600"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
          ]
        },
        String(key)
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NumInput,
          {
            label: "最大帧率",
            value: opts.maxFps,
            onChange: (v2) => setOpts((prev) => ({ ...prev, maxFps: v2 })),
            placeholder: "如 60"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NumInput,
          {
            label: "比特率(Kbps)",
            value: opts.bitRate,
            onChange: (v2) => setOpts((prev) => ({ ...prev, bitRate: v2 })),
            placeholder: "如 8000"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NumInput,
          {
            label: "最大尺寸",
            value: opts.maxSize,
            onChange: (v2) => setOpts((prev) => ({ ...prev, maxSize: v2 })),
            placeholder: "如 1024"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-[10px] text-zinc-500", children: "录屏格式" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: opts.recordFormat ?? "",
              onChange: (e) => setOpts((prev) => ({
                ...prev,
                recordFormat: e.target.value || void 0
              })),
              className: "w-full rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "不录屏" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "mp4", children: "MP4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "mkv", children: "MKV" })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleLaunch,
            disabled: launching,
            className: "flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
            children: [
              launching ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3.5 w-3.5" }),
              launching ? "启动中..." : "启动投屏"
            ]
          }
        ),
        result && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("text-xs", result.success ? "text-green-400" : "text-red-400"), children: result.message })
      ] }),
      running.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 border-t border-zinc-800 pt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 text-[10px] text-zinc-500", children: [
          "运行中 (",
          running.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: running.map((r2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between rounded bg-zinc-900/50 px-3 py-1.5 text-xs",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-zinc-400", children: [
                "pid=",
                r2.pid
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => handleStop(r2.pid),
                  className: "flex items-center gap-1 rounded px-2 py-0.5 text-red-400 hover:bg-red-600 hover:text-white",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Square, { className: "h-3 w-3" }),
                    "停止"
                  ]
                }
              )
            ]
          },
          r2.pid
        )) })
      ] })
    ] })
  ] });
}
function NumInput({
  label,
  value,
  onChange,
  placeholder
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-[10px] text-zinc-500", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "number",
        value: value ?? "",
        onChange: (e) => onChange(e.target.value ? Number(e.target.value) : void 0),
        placeholder,
        className: "w-full rounded border border-zinc-800 bg-zinc-900 px-2 py-1 text-xs text-zinc-200 placeholder-zinc-600"
      }
    )
  ] });
}
function OtaUpgrade() {
  const device = useDeviceStore((s) => s.current);
  const [executing, setExecuting] = reactExports.useState(false);
  const [zipPath, setZipPath] = reactExports.useState(null);
  const [steps, setSteps] = reactExports.useState([]);
  const [result, setResult] = reactExports.useState(null);
  const handlePick = async () => {
    const files = await api.system.pickFile({
      kind: "open",
      filter: "OTA 包|*.zip;所有文件|*.*",
      multi: false
    });
    if (!files) return;
    setZipPath(Array.isArray(files) ? files[0] : files);
  };
  const handleExecute = async () => {
    if (!zipPath) {
      setResult({ success: false, message: "请先选择 OTA zip" });
      return;
    }
    setExecuting(true);
    setResult(null);
    setSteps([]);
    try {
      const r2 = await api.tools.otaStart(zipPath);
      setSteps(r2.steps);
      setResult({
        success: r2.success,
        message: r2.success ? r2.scrcpyStarted ? 'OTA 已推送,请在手表上点击"开始升级"(已启动 scrcpy 投屏)' : 'OTA 已推送,请在手表上点击"开始升级"' : r2.error ?? "失败"
      });
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setExecuting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "section-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(HardDriveDownload, { className: "h-3.5 w-3.5" }),
      "离线 OTA 升级"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-xs text-zinc-400", children: '对应 ota.bat:检测 ADB 设备 → 读 innermodel/softversion → isv3 检测(V3 不支持离线 OTA) → adb root(必须含 "restarting",否则不在 QMMI)→ rm -rf /data/ota* → 推送 OTA zip 到 /sdcard/xtc/ota_f_vota.zip → am start OfflineOtaActivity → 启动 scrcpy 引导点击"开始升级"。' }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handlePick,
            disabled: executing,
            className: "flex items-center gap-1.5 rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
              "选择 OTA zip"
            ]
          }
        ),
        zipPath && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-xs text-zinc-500", title: zipPath, children: zipPath })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleExecute,
          disabled: executing || !zipPath || !device || device.type !== "adb",
          className: "flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
          children: [
            executing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(HardDriveDownload, { className: "h-3.5 w-3.5" }),
            executing ? "执行中..." : "开始 OTA 升级"
          ]
        }
      ),
      steps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-md border border-zinc-800 p-2", children: steps.map((step) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 border-b border-zinc-800/60 px-1 py-1.5 last:border-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: step.status === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-green-400" }) : step.status === "failed" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 text-red-400" }) : step.status === "running" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-blue-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3.5 w-3.5 rounded-full border border-zinc-700" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-zinc-300", children: step.name }),
              step.message && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[10px] text-zinc-500", children: step.message })
            ] })
          ]
        },
        step.name
      )) }),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "mt-3 flex items-center gap-2 rounded-md border p-3 text-xs",
            result.success ? "alert-ok-color" : "alert-err-color"
          ),
          children: [
            result.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: result.message })
          ]
        }
      )
    ] })
  ] });
}
function RootProOptimize() {
  const device = useDeviceStore((s) => s.current);
  const [executing, setExecuting] = reactExports.useState(false);
  const [opts, setOpts] = reactExports.useState({ installApks: false, installDesktop: false, installMods: false });
  const [result, setResult] = reactExports.useState(null);
  const handleExecute = async () => {
    setExecuting(true);
    setResult(null);
    try {
      const r2 = await api.tools.rootpro(opts);
      setResult(r2);
    } catch (e) {
      setResult({
        success: false,
        supported: false,
        steps: [],
        error: e.message
      });
    } finally {
      setExecuting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "section-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
      "Android 8.1 Root 后优化"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-xs text-zinc-400", children: "对应 rootpro.bat:仅支持 SDK=27(Android 8.1)。读取 innermodel/softversion → isv3 检测 → pm path com.android.systemui → 可选安装拓展应用包/禁用模式切换桌面/拓展 magisk 模块。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs text-zinc-300 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: opts.installApks,
              onChange: (e) => setOpts({ ...opts, installApks: e.target.checked }),
              className: "h-3.5 w-3.5 accent-blue-600"
            }
          ),
          "安装拓展应用包(读 rootproapks/rootproapks.txt)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs text-zinc-300 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: opts.installDesktop,
              onChange: (e) => setOpts({ ...opts, installDesktop: e.target.checked }),
              className: "h-3.5 w-3.5 accent-blue-600"
            }
          ),
          "安装禁用模式切换桌面(isv3+havesystemui → 130510_D;isv3+!havesystemui → 121750_D;!isv3 → 116100_D)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs text-zinc-300 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: opts.installMods,
              onChange: (e) => setOpts({ ...opts, installMods: e.target.checked }),
              className: "h-3.5 w-3.5 accent-blue-600"
            }
          ),
          "刷拓展 magisk 模块(读 magiskmod/rootpromods.txt)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleExecute,
          disabled: executing || !device || device.type !== "adb",
          className: "flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
          children: [
            executing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5" }),
            executing ? "执行中..." : "开始 Root 后优化"
          ]
        }
      ),
      result && (result.innermodel || result.sdkVersion) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-md border border-zinc-800 bg-zinc-900/40 p-3 text-[11px] text-zinc-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "innermodel: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-zinc-200", children: result.innermodel || "未知" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "SDK: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-zinc-200", children: result.sdkVersion || "未知" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "isV3: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-zinc-200", children: String(result.isV3) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          "haveSystemUI: ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-zinc-200", children: String(result.haveSystemUI) })
        ] })
      ] }),
      result && result.steps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 rounded-md border border-zinc-800 p-2", children: result.steps.map((step) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 border-b border-zinc-800/60 px-1 py-1.5 last:border-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: step.status === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-green-400" }) : step.status === "failed" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 text-red-400" }) : step.status === "running" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-blue-400" }) : step.status === "skipped" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3.5 w-3.5 rounded-full bg-zinc-700" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3.5 w-3.5 rounded-full border border-zinc-700" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-zinc-300", children: step.name }),
              step.message && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[10px] text-zinc-500", children: step.message })
            ] })
          ]
        },
        step.name
      )) }),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "mt-3 flex items-center gap-2 rounded-md border p-3 text-xs",
            result.success ? "alert-ok-color" : "alert-err-color"
          ),
          children: [
            result.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: result.success ? "优化全部完成" : result.error ?? "优化失败" })
          ]
        }
      )
    ] })
  ] });
}
function DriverCheck() {
  const [checking, setChecking] = reactExports.useState(false);
  const [installing, setInstalling] = reactExports.useState(false);
  const [status, setStatus] = reactExports.useState(null);
  const [installSteps, setInstallSteps] = reactExports.useState([]);
  const [result, setResult] = reactExports.useState(null);
  const handleCheck = async () => {
    setChecking(true);
    setResult(null);
    try {
      const r2 = await api.tools.checkDrivers();
      if (r2.success) {
        setStatus(r2.status);
        if (r2.allInstalled) {
          setResult({ success: true, message: "所有驱动已安装" });
        }
      } else {
        setResult({ success: false, message: r2.error ?? "检测失败" });
      }
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setChecking(false);
    }
  };
  const handleInstall = async () => {
    setInstalling(true);
    setResult(null);
    setInstallSteps([]);
    try {
      const r2 = await api.tools.installDrivers();
      setInstallSteps(r2.steps);
      setResult({
        success: r2.success,
        message: r2.success ? "驱动和环境配置完毕,部分更改可能需要重启电脑以完成安装" : r2.error ?? "安装过程出错"
      });
      await handleCheck();
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setInstalling(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "section-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-3.5 w-3.5" }),
      "驱动检测"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-xs text-zinc-400", children: "对应 checkdriver.bat:检查 Qualcomm 9008 / ADB / VC 运行库驱动是否已安装,缺失时自动安装。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleCheck,
            disabled: checking || installing,
            className: "flex items-center gap-1.5 rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50",
            children: [
              checking ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
              "检测驱动"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleInstall,
            disabled: checking || installing,
            className: "flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50",
            children: [
              installing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
              "下载并安装缺失驱动"
            ]
          }
        )
      ] }),
      status && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 grid grid-cols-1 gap-2 sm:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DriverCard,
          {
            label: "Qualcomm 9008",
            desc: "EDL 模式驱动",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4" }),
            ok: status.qualcomm
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DriverCard,
          {
            label: "ADB",
            desc: "通用 ADB 驱动",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Usb, { className: "h-4 w-4" }),
            ok: status.adb
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          DriverCard,
          {
            label: "VC 运行库",
            desc: "mfc100/110/120",
            icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-4 w-4" }),
            ok: status.vcRuntime
          }
        )
      ] }),
      installSteps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 rounded-md border border-zinc-800 p-2", children: installSteps.map((step) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 border-b border-zinc-800/60 px-1 py-1.5 last:border-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: step.status === "success" ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-green-400" }) : step.status === "failed" ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 text-red-400" }) : step.status === "running" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-blue-400" }) : step.status === "skipped" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3.5 w-3.5 rounded-full bg-zinc-700" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3.5 w-3.5 rounded-full border border-zinc-700" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-zinc-300", children: step.name }),
              step.message && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[10px] text-zinc-500", children: step.message })
            ] })
          ]
        },
        step.name
      )) }),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "flex items-center gap-2 rounded-md border p-3 text-xs",
            result.success ? "alert-ok-color" : "alert-err-color"
          ),
          children: [
            result.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: result.message })
          ]
        }
      )
    ] })
  ] });
}
function DriverCard({
  label,
  desc,
  icon,
  ok: ok2
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "rounded-md border p-3",
        ok2 ? "border-green-800/50 bg-green-950/10" : "border-red-800/50 bg-red-950/10"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "flex h-7 w-7 items-center justify-center rounded-md",
                ok2 ? "bg-green-600/15 text-green-400" : "bg-red-600/15 text-red-400"
              ),
              children: icon
            }
          ),
          ok2 ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-green-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 text-red-400" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-sm font-medium text-zinc-200", children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] text-zinc-500", children: desc }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("mt-1 text-[10px]", ok2 ? "text-green-400" : "text-red-400"), children: ok2 ? "已安装" : "未安装" })
      ]
    }
  );
}
function AtbmodManager() {
  const [scanning, setScanning] = reactExports.useState(false);
  const [files, setFiles] = reactExports.useState([]);
  const [installingFile, setInstallingFile] = reactExports.useState(null);
  const [installed, setInstalled] = reactExports.useState([]);
  const [result, setResult] = reactExports.useState(null);
  const loadFiles = async () => {
    setScanning(true);
    try {
      const r2 = await api.tools.atbmodScan();
      if (r2.success) setFiles(r2.files);
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setScanning(false);
    }
  };
  const loadInstalled = async () => {
    try {
      const r2 = await api.tools.atbmodList();
      if (r2.success) setInstalled(r2.installed);
    } catch {
    }
  };
  reactExports.useEffect(() => {
    loadFiles();
    loadInstalled();
  }, []);
  const handleInstall = async (file) => {
    if (!window.confirm(`确认安装 atbmod 模块「${file.filename}」?`)) return;
    setInstallingFile(file.path);
    setResult(null);
    try {
      const r2 = await api.tools.atbmodInstall(file.path);
      setResult({
        success: r2.success,
        message: r2.success ? `模块安装成功: ${r2.modid ?? file.filename}` : `安装失败: ${r2.error ?? "未知错误"}`
      });
      await loadFiles();
      await loadInstalled();
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setInstallingFile(null);
    }
  };
  const handleUninstall = async (modid) => {
    if (!window.confirm(`确认卸载 atbmod 模块「${modid}」?`)) return;
    try {
      const r2 = await api.tools.atbmodUninstall(modid);
      setResult({
        success: r2.success,
        message: r2.success ? `已卸载: ${modid}` : `卸载失败: ${r2.error ?? "未知错误"}`
      });
      await loadInstalled();
    } catch (e) {
      setResult({ success: false, message: e.message });
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "section-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5" }),
      ".atbmod 模块"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-xs text-zinc-400", children: "对应 Loadatbmod.bat:扫描 resources/bin/*.atbmod 文件 → 7z 解压 → 读 atbmod.prop → 执行 install.bat/install.exe → 重命名为 mod/<modid>/。" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: loadFiles,
          disabled: scanning,
          className: "flex items-center gap-1.5 rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50",
          children: [
            scanning ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
            "重新扫描"
          ]
        }
      ) }),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "mb-3 flex items-center gap-2 rounded-md border p-2.5 text-xs",
            result.success ? "alert-ok-color" : "alert-err-color"
          ),
          children: [
            result.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: result.message })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 text-[10px] uppercase tracking-wider text-zinc-500", children: [
          "待安装文件 (",
          files.length,
          ")"
        ] }),
        files.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-dashed border-zinc-800 py-6 text-center text-xs text-zinc-500", children: "无 .atbmod 文件(请将 .atbmod 包放入 resources/bin/ 目录)" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-48 space-y-1 overflow-y-auto rounded-md border border-zinc-800 p-2", children: files.map((f2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between rounded bg-zinc-900/40 px-2 py-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-xs text-zinc-200", children: f2.filename }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-zinc-500", children: [
                  (f2.size / 1024).toFixed(1),
                  " KB"
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => handleInstall(f2),
                  disabled: installingFile === f2.path,
                  className: "flex shrink-0 items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-blue-700 disabled:opacity-50",
                  children: [
                    installingFile === f2.path ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3 w-3" }),
                    "安装"
                  ]
                }
              )
            ]
          },
          f2.path
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 text-[10px] uppercase tracking-wider text-zinc-500", children: [
          "已安装模块 (",
          installed.length,
          ")"
        ] }),
        installed.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-dashed border-zinc-800 py-4 text-center text-xs text-zinc-500", children: "暂无已安装的 atbmod 模块" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: installed.map((mod) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/40 p-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-xs text-zinc-200", children: mod.prop?.modname || mod.modid }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "truncate text-[10px] text-zinc-500", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: mod.modid }),
                  mod.prop?.modversion && ` · v${mod.prop.modversion}`,
                  mod.prop?.modtype && ` · ${mod.prop.modtype}`
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => handleUninstall(mod.modid),
                  className: "rounded p-1 text-zinc-500 hover:bg-red-600 hover:text-white",
                  title: "卸载",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" })
                }
              )
            ]
          },
          mod.modid
        )) })
      ] })
    ] })
  ] });
}
const INSTALL_METHODS = [
  { value: "magisk", label: "Magisk 安装", description: "调用 magisk --install-module(官方)" },
  { value: "shinst", label: "脚本安装", description: "调用 module_installer.sh(Magisk util_functions)" },
  { value: "peremptory", label: "强制安装", description: "调用 magisk_force_install.sh(强制解压,禁 exit/abort)" }
];
const UNINSTALL_METHODS = [
  { value: "mark", label: "标记卸载", description: "touch remove,重启后清除" },
  { value: "direct", label: "直接卸载", description: "touch disable + sleep 1 + rm -rf" },
  { value: "script", label: "脚本卸载", description: "执行 uninstall.sh + rm -rf" }
];
function Magisk() {
  const device = useDeviceStore((s) => s.current);
  const [modules, setModules] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const [installMethod, setInstallMethod] = reactExports.useState("magisk");
  const [uninstallMethod, setUninstallMethod] = reactExports.useState("mark");
  const [executing, setExecuting] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  const [pendingAction, setPendingAction] = reactExports.useState(null);
  const loadModules = reactExports.useCallback(async () => {
    if (!device || device.type !== "adb") {
      setModules([]);
      return;
    }
    setLoading(true);
    try {
      const r2 = await api.magisk.list();
      if (r2.success && r2.modules) {
        setModules(r2.modules);
      } else {
        setModules([]);
        if (r2.error) {
          setResult({ success: false, message: r2.error });
        }
      }
    } finally {
      setLoading(false);
    }
  }, [device]);
  reactExports.useEffect(() => {
    void loadModules();
  }, [loadModules]);
  const handleInstall = async () => {
    const files = await api.system.pickFile({
      kind: "open",
      filter: "Magisk 模块|*.zip;所有文件|*.*",
      multi: false
    });
    if (!files) return;
    const zip = Array.isArray(files) ? files[0] : files;
    setPendingAction({ type: "install" });
    setExecuting(true);
    setResult(null);
    try {
      const r2 = await api.magisk.install(zip, installMethod);
      setResult({
        success: r2.success,
        message: r2.success ? `模块安装成功(${installMethod}): ${zip}` : `安装失败: ${r2.error ?? "未知错误"}`
      });
      if (r2.success) {
        await loadModules();
      }
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setExecuting(false);
      setPendingAction(null);
    }
  };
  const handleUninstall = async (mod) => {
    if (!window.confirm(`确认卸载模块「${mod.name || mod.id}」(方式: ${uninstallMethod})?`)) {
      return;
    }
    setPendingAction({ type: "uninstall", moduleId: mod.id, moduleName: mod.name });
    setExecuting(true);
    setResult(null);
    try {
      const r2 = await api.magisk.uninstall(mod.id, uninstallMethod);
      setResult({
        success: r2.success,
        message: r2.success ? `模块已卸载(${uninstallMethod}): ${mod.name || mod.id}` : `卸载失败: ${r2.error ?? "未知错误"}`
      });
      if (r2.success) {
        await loadModules();
      }
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setExecuting(false);
      setPendingAction(null);
    }
  };
  const handleToggle = async (mod, enable) => {
    setPendingAction({
      type: enable ? "enable" : "disable",
      moduleId: mod.id,
      moduleName: mod.name
    });
    setExecuting(true);
    setResult(null);
    try {
      const r2 = enable ? await api.magisk.enable(mod.id) : await api.magisk.disable(mod.id);
      setResult({
        success: r2.success,
        message: r2.success ? `${enable ? "启用" : "禁用"}成功: ${mod.name || mod.id}` : `${enable ? "启用" : "禁用"}失败: ${r2.error ?? "未知错误"}`
      });
      if (r2.success) {
        await loadModules();
      }
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setExecuting(false);
      setPendingAction(null);
    }
  };
  const isDisabled = (status) => {
    return status.includes("禁用") || status.toLowerCase().includes("disabled");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "page-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Boxes, { className: "title-icon" }),
          "Magisk 模块管理"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-desc", children: "模块安装/卸载/启用/禁用/列表/商店" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: loadModules,
          disabled: loading || !device || device.type !== "adb",
          className: "flex items-center gap-1.5 rounded-md border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-3 w-3", loading && "animate-spin") }),
            "刷新"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ModuleStore, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "section-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
        "安装模块"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 text-[10px] text-zinc-500", children: "安装方式(对应 instmodule.bat)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-3", children: INSTALL_METHODS.map((m2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setInstallMethod(m2.value),
              disabled: executing,
              className: cn(
                "rounded-md border p-2 text-left text-xs transition-colors",
                installMethod === m2.value ? "border-blue-600 bg-blue-950/40 text-blue-200" : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-blue-600/40 hover:bg-zinc-900/50"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: m2.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-[10px] text-zinc-500", children: m2.description })
              ]
            },
            m2.value
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleInstall,
            disabled: executing || !device || device.type !== "adb",
            className: "flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
            children: [
              executing && pendingAction?.type === "install" ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
              executing && pendingAction?.type === "install" ? "安装中..." : "选择 zip 安装"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "section-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
        "卸载方式(应用于下方模块列表)"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-3", children: UNINSTALL_METHODS.map((m2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setUninstallMethod(m2.value),
          disabled: executing,
          className: cn(
            "rounded-md border p-2 text-left text-xs transition-colors",
            uninstallMethod === m2.value ? "border-blue-600 bg-blue-950/40 text-blue-200" : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-blue-600/40 hover:bg-zinc-900/50"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: m2.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-[10px] text-zinc-500", children: m2.description })
          ]
        },
        m2.value
      )) }) })
    ] }),
    result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "flex items-center gap-2 rounded-md border p-3 text-sm",
          result.success ? "alert-ok-color" : "alert-err-color"
        ),
        children: [
          result.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: result.message })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 flex items-center justify-between", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5" }),
        "已安装模块",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted", children: [
          "(",
          modules.length,
          ")"
        ] })
      ] }) }),
      !device || device.type !== "adb" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-800 py-16", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "h-10 w-10 text-zinc-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-zinc-400", children: "需要 ADB 模式设备" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-md text-center text-xs text-zinc-500", children: "请连接手表并开启 ADB 调试,且设备需已 Root" })
      ] }) : loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-10 text-zinc-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "加载模块列表..." })
      ] }) : modules.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-dashed border-zinc-800 py-10 text-center text-sm text-zinc-500", children: "无已安装模块" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[28rem] space-y-2 overflow-y-auto rounded-lg border border-zinc-800 p-2", children: modules.map((mod) => {
        const expanded = expandedId === mod.id;
        const disabled = isDisabled(mod.status);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "rounded-md border bg-zinc-900/30 transition-colors",
              expanded ? "border-blue-600/40" : "border-zinc-800/60"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => setExpandedId(expanded ? null : mod.id),
                  disabled: executing,
                  className: "flex w-full items-center gap-3 p-3 text-left",
                  children: [
                    expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5 shrink-0 text-zinc-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 shrink-0 text-zinc-500" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                          disabled ? "bg-zinc-800 text-zinc-500" : "bg-blue-600/15 text-blue-400"
                        ),
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5" })
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-sm font-medium text-zinc-100", children: mod.name || mod.id }),
                        mod.version && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400", children: [
                          "v",
                          mod.version
                        ] }),
                        disabled && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-amber-900/30 px-1.5 py-0.5 text-[10px] text-amber-400", children: "已禁用" })
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 truncate text-[10px] text-zinc-500", children: [
                        "ID: ",
                        mod.id,
                        mod.author && ` · 作者: ${mod.author}`
                      ] })
                    ] })
                  ]
                }
              ),
              expanded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-zinc-800/60 px-3 py-3", children: [
                mod.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 text-xs text-zinc-400", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: "描述:" }),
                  " ",
                  mod.description
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 grid grid-cols-2 gap-1 text-[10px] text-zinc-500 sm:grid-cols-4", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: "状态:" }),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-400", children: mod.status || "未知" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: "版本:" }),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-400", children: mod.version || "未知" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: "内部版本:" }),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-400", children: mod.versionCode || "未知" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "truncate", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: "作者:" }),
                    " ",
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-400", children: mod.author || "未知" })
                  ] })
                ] }),
                mod.updateJson && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 truncate text-[10px] text-zinc-500", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: "更新地址:" }),
                  " ",
                  mod.updateJson
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => handleToggle(mod, disabled),
                      disabled: executing || pendingAction?.type === "enable" && pendingAction.moduleId === mod.id || pendingAction?.type === "disable" && pendingAction.moduleId === mod.id,
                      className: cn(
                        "flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs transition-colors",
                        disabled ? "border-blue-600/60 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white" : "border-amber-700/60 bg-amber-900/10 text-amber-400 hover:bg-amber-700 hover:text-white"
                      ),
                      children: [
                        executing && (pendingAction?.type === "enable" || pendingAction?.type === "disable") && pendingAction.moduleId === mod.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : disabled ? /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-3 w-3" }),
                        disabled ? "启用" : "禁用"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "button",
                    {
                      onClick: () => handleUninstall(mod),
                      disabled: executing || pendingAction?.type === "uninstall" && pendingAction.moduleId === mod.id,
                      className: "flex items-center gap-1 rounded-md border border-red-700/60 bg-red-900/10 px-2.5 py-1 text-xs text-red-400 hover:bg-red-700 hover:text-white disabled:opacity-50",
                      children: [
                        executing && pendingAction?.type === "uninstall" && pendingAction.moduleId === mod.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }),
                        "卸载(",
                        uninstallMethod,
                        ")"
                      ]
                    }
                  )
                ] })
              ] })
            ]
          },
          mod.id
        );
      }) })
    ] })
  ] });
}
function ModuleStore() {
  const device = useDeviceStore((s) => s.current);
  const [query, setQuery] = reactExports.useState("");
  const [searching, setSearching] = reactExports.useState(false);
  const [modules, setModules] = reactExports.useState([]);
  const [installingId, setInstallingId] = reactExports.useState(null);
  const [result, setResult] = reactExports.useState(null);
  const [searched, setSearched] = reactExports.useState(false);
  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    setResult(null);
    try {
      const r2 = await api.magisk.storeSearch(query);
      setModules(r2.modules);
      setSearched(true);
      if (!r2.success) {
        setResult({ success: false, message: r2.modules.length === 0 ? "搜索失败或无结果" : "" });
      } else if (r2.modules.length === 0) {
        setResult({ success: true, message: "未找到匹配模块(API 可能不可用)" });
      }
    } catch (e) {
      setResult({ success: false, message: e.message });
      setModules([]);
    } finally {
      setSearching(false);
    }
  };
  const handleInstall = async (mod) => {
    if (!device || device.type !== "adb") {
      setResult({ success: false, message: "需要 ADB 模式设备" });
      return;
    }
    if (!window.confirm(`确认从商店安装模块「${mod.name || mod.id}」?`)) return;
    setInstallingId(mod.id);
    setResult(null);
    try {
      const r2 = await api.magisk.storeInstall(mod);
      setResult({
        success: r2.success,
        message: r2.success ? `模块安装成功: ${mod.name || mod.id}` : `安装失败: ${r2.error ?? "未知错误"}`
      });
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setInstallingId(null);
    }
  };
  const noDevice = !device || device.type !== "adb";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "section-title", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3.5 w-3.5" }),
      "模块商店"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
      noDevice && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2 rounded-md border border-amber-800/40 bg-amber-950/20 px-3 py-2 text-xs text-amber-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "h-3.5 w-3.5 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "模块商店安装需要 ADB 模式设备(搜索可离线)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-md", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "text",
              value: query,
              onChange: (e) => setQuery(e.target.value),
              onKeyDown: (e) => e.key === "Enter" && handleSearch(),
              placeholder: "搜索模块名称/描述/作者...",
              className: "w-full rounded-md border border-zinc-800 bg-zinc-900/50 py-2 pl-8 pr-3 text-xs text-zinc-200 placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleSearch,
            disabled: searching || !query.trim(),
            className: "flex items-center gap-1.5 rounded-md bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50",
            children: [
              searching ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-3.5 w-3.5" }),
              "搜索"
            ]
          }
        )
      ] }),
      result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "mt-3 flex items-center gap-2 rounded-md border p-2.5 text-xs",
            result.success ? "alert-ok-color" : "alert-err-color"
          ),
          children: [
            result.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: result.message })
          ]
        }
      ),
      searched && modules.length === 0 && !searching ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 py-6 text-center text-xs text-zinc-500", children: "未找到匹配模块。模块商店 API 可能不可用,可尝试用关键词搜索或改用本地 zip 安装。" }) : modules.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 max-h-96 space-y-2 overflow-y-auto rounded-md border border-zinc-800 p-2", children: modules.map((mod) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "rounded-md border border-zinc-800/60 bg-zinc-900/40 p-3 hover:border-blue-600/40",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5 shrink-0 text-blue-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-sm font-medium text-zinc-100", children: mod.name || mod.id || "(未命名)" }),
                mod.version && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-400", children: [
                  "v",
                  mod.version
                ] })
              ] }),
              mod.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 line-clamp-2 text-xs text-zinc-400", children: mod.description }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-zinc-500", children: [
                mod.author && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "作者: ",
                  mod.author
                ] }),
                mod.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono", children: [
                  "ID: ",
                  mod.id
                ] }),
                mod.lastUpdate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "更新: ",
                  mod.lastUpdate
                ] }),
                mod.homepage && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "a",
                  {
                    href: mod.homepage,
                    target: "_blank",
                    rel: "noreferrer",
                    className: "inline-flex items-center gap-0.5 text-blue-400 hover:underline",
                    children: [
                      "主页 ",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-2.5 w-2.5" })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => handleInstall(mod),
                disabled: noDevice || installingId === mod.id,
                className: "flex shrink-0 items-center gap-1 rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50",
                children: [
                  installingId === mod.id ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3 w-3" }),
                  "安装"
                ]
              }
            )
          ] })
        },
        mod.id || mod.downloadUrl
      )) }) : null
    ] })
  ] });
}
const BACKUP_ITEMS = [
  {
    id: "dcim-backup",
    title: "DCIM 备份",
    description: "adb pull /storage/emulated/0/DCIM(对应 backup.bat :DCIM-backup)",
    icon: Upload,
    mode: "adb"
  },
  {
    id: "dcim-recover",
    title: "DCIM 恢复",
    description: "adb push <dir>/DCIM /storage/emulated/0/(对应 backup.bat :DCIM-recover)",
    icon: Download,
    mode: "adb"
  },
  {
    id: "edl-backup",
    title: "9008 备份",
    description: "fh_loader 读取全分区 → 7z 打包(对应 backup.bat :9008-backup-run)",
    icon: HardDriveDownload,
    mode: "edl"
  },
  {
    id: "edl-recover",
    title: "9008 恢复",
    description: "7z 解压 → fh_loader 刷 rawprogram0.xml(对应 backup.bat :9008-recover)",
    icon: HardDriveDownload,
    mode: "edl",
    danger: true
  },
  {
    id: "adbdd-backup",
    title: "ADB-dd 备份",
    description: "su -c dd 逐分区读取(不含 userdata,需 root)→ 7z 打包(对应 backup.bat :adb-dd-backup)",
    icon: DatabaseBackup,
    mode: "adb"
  },
  {
    id: "adbdd-recover",
    title: "ADB-dd 恢复",
    description: "7z 解压 → 匹配设备分区 → dd 写入(对应 backup.bat :adb-dd-recover,危险)",
    icon: DatabaseBackup,
    mode: "adb",
    danger: true
  },
  {
    id: "super-recovery",
    title: "超级恢复",
    description: "自动检测 loader + 逐个刷 rawprogram0/1/2 + patch0(对应 super_recovery.bat)",
    icon: HardDriveDownload,
    mode: "edl",
    danger: true
  },
  {
    id: "flash-twrp",
    title: "TWRP 刷入",
    description: "EDL 模式刷入 TWRP recovery(对应 pashtwrp.bat,需先选型号)",
    icon: HardDriveDownload,
    mode: "edl"
  },
  {
    id: "auto-flash-twrp",
    title: "开机自刷 TWRP",
    description: "推送 recovery.img + auto_flash_recovery.sh 到 /data/adb/service.d/(对应 pashtwrppro.bat)",
    icon: Power,
    mode: "adb"
  },
  {
    id: "xposed-install",
    title: "Xposed 安装",
    description: "根据 SDK 版本(SDK19/25)安装 Xposed 框架(对应 Xposed.bat)",
    icon: Package,
    mode: "adb"
  }
];
function Backup() {
  const device = useDeviceStore((s) => s.current);
  const [executingId, setExecutingId] = reactExports.useState(null);
  const [result, setResult] = reactExports.useState({});
  const [progressLines, setProgressLines] = reactExports.useState([]);
  const [expandedId, setExpandedId] = reactExports.useState(null);
  const [selectedModel, setSelectedModel] = reactExports.useState(null);
  const [adbddMatch, setAdbddMatch] = reactExports.useState(null);
  const [adbddExtractDir, setAdbddExtractDir] = reactExports.useState(null);
  const progressEndRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const unsub = api.backup.onProgress((data) => {
      setProgressLines((prev) => [...prev.slice(-200), data.msg]);
    });
    return unsub;
  }, []);
  reactExports.useEffect(() => {
    progressEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [progressLines]);
  reactExports.useEffect(() => {
    setSelectedModel(null);
    setExpandedId(null);
    setAdbddMatch(null);
    setAdbddExtractDir(null);
  }, [device]);
  const clearProgress = () => setProgressLines([]);
  const handleExecute = async (item) => {
    if ((item.id === "edl-backup" || item.id === "flash-twrp" || item.id === "auto-flash-twrp") && !selectedModel) {
      setExpandedId(item.id);
      return;
    }
    setExecutingId(item.id);
    setResult((prev) => ({ ...prev, [item.id]: { success: false, message: "执行中..." } }));
    clearProgress();
    try {
      let r2;
      switch (item.id) {
        case "dcim-backup": {
          const outputDir = await api.system.pickFile({ kind: "folder" });
          if (!outputDir) {
            setResult((prev) => ({ ...prev, [item.id]: { success: false, message: "已取消" } }));
            return;
          }
          const dir = Array.isArray(outputDir) ? outputDir[0] : outputDir;
          r2 = await api.backup.dcimBackup(dir);
          break;
        }
        case "dcim-recover": {
          const inputDir = await api.system.pickFile({ kind: "folder" });
          if (!inputDir) {
            setResult((prev) => ({ ...prev, [item.id]: { success: false, message: "已取消" } }));
            return;
          }
          const dir = Array.isArray(inputDir) ? inputDir[0] : inputDir;
          r2 = await api.backup.dcimRecover(dir);
          break;
        }
        case "edl-backup": {
          if (!selectedModel) {
            r2 = { success: false, error: "请先选择型号" };
            break;
          }
          const outputDir = await api.system.pickFile({ kind: "folder" });
          if (!outputDir) {
            setResult((prev) => ({ ...prev, [item.id]: { success: false, message: "已取消" } }));
            return;
          }
          const dir = Array.isArray(outputDir) ? outputDir[0] : outputDir;
          r2 = await api.backup.edlBackup({
            innermodel: selectedModel.innermodel,
            softVersion: device?.softVersion,
            outputDir: dir
          });
          break;
        }
        case "edl-recover": {
          const file = await api.system.pickFile({
            kind: "open",
            filter: "备份文件|*.zip;所有文件|*.*"
          });
          if (!file) {
            setResult((prev) => ({ ...prev, [item.id]: { success: false, message: "已取消" } }));
            return;
          }
          const zip = Array.isArray(file) ? file[0] : file;
          r2 = await api.backup.edlRecover(zip);
          break;
        }
        case "adbdd-backup": {
          const outputDir = await api.system.pickFile({ kind: "folder" });
          if (!outputDir) {
            setResult((prev) => ({ ...prev, [item.id]: { success: false, message: "已取消" } }));
            return;
          }
          const dir = Array.isArray(outputDir) ? outputDir[0] : outputDir;
          r2 = await api.backup.adbddBackup(dir);
          break;
        }
        case "adbdd-recover": {
          const file = await api.system.pickFile({
            kind: "open",
            filter: "备份文件|*.zip;所有文件|*.*"
          });
          if (!file) {
            setResult((prev) => ({ ...prev, [item.id]: { success: false, message: "已取消" } }));
            return;
          }
          const zip = Array.isArray(file) ? file[0] : file;
          const prep = await api.backup.adbddPrepare(zip);
          if (!prep.success || !prep.extractDir || !prep.match) {
            r2 = { success: false, error: prep.error ?? "准备失败" };
            break;
          }
          setAdbddMatch(prep.match);
          setAdbddExtractDir(prep.extractDir);
          setExpandedId("adbdd-recover");
          setResult((prev) => ({
            ...prev,
            [item.id]: {
              success: true,
              message: `匹配 ${prep.match.matched.length} 个分区,跳过 ${prep.match.skipped.length} 个,请确认后执行`
            }
          }));
          return;
        }
        case "super-recovery": {
          const folder = await api.system.pickFile({ kind: "folder" });
          if (!folder) {
            setResult((prev) => ({ ...prev, [item.id]: { success: false, message: "已取消" } }));
            return;
          }
          const dir = Array.isArray(folder) ? folder[0] : folder;
          r2 = await api.backup.superRecovery(dir);
          break;
        }
        case "flash-twrp": {
          if (!selectedModel) {
            r2 = { success: false, error: "请先选择型号" };
            break;
          }
          r2 = await api.backup.flashTwrp(selectedModel.innermodel);
          break;
        }
        case "auto-flash-twrp": {
          if (!selectedModel) {
            r2 = { success: false, error: "请先选择型号" };
            break;
          }
          r2 = await api.backup.autoFlashTwrp(selectedModel.innermodel);
          break;
        }
        case "xposed-install": {
          r2 = await api.backup.xposedInstall();
          break;
        }
        default:
          r2 = { success: false, error: "未知操作" };
      }
      setResult((prev) => ({
        ...prev,
        [item.id]: {
          success: r2.success,
          message: r2.success ? r2.zipPath ? `操作成功,文件: ${r2.zipPath}` : "操作成功" : r2.error ?? "操作失败"
        }
      }));
    } catch (e) {
      setResult((prev) => ({
        ...prev,
        [item.id]: { success: false, message: e.message }
      }));
    } finally {
      setExecutingId(null);
    }
  };
  const handleAdbddConfirm = async () => {
    if (!adbddExtractDir || !adbddMatch) return;
    setExecutingId("adbdd-recover");
    try {
      const r2 = await api.backup.adbddExecute(adbddExtractDir, adbddMatch.matched);
      setResult((prev) => ({
        ...prev,
        "adbdd-recover": {
          success: r2.success,
          message: r2.success ? "ADB-dd 恢复完成" : r2.error ?? "恢复失败"
        }
      }));
      if (r2.success) {
        setAdbddMatch(null);
        setAdbddExtractDir(null);
      }
    } catch (e) {
      setResult((prev) => ({
        ...prev,
        "adbdd-recover": { success: false, message: e.message }
      }));
    } finally {
      setExecutingId(null);
    }
  };
  const handleAdbddCancel = () => {
    setAdbddMatch(null);
    setAdbddExtractDir(null);
    setResult((prev) => ({
      ...prev,
      "adbdd-recover": { success: false, message: "已取消" }
    }));
  };
  const isModeOk = (item) => {
    if (item.mode === "adb") return device?.type === "adb";
    return true;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "page-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DatabaseBackup, { className: "title-icon" }),
        "备份恢复"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-desc", children: "DCIM / 9008 / ADB-dd 备份恢复 + 超级恢复 + TWRP 刷入 + Xposed 安装" })
    ] }),
    progressLines.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-zinc-800 bg-zinc-950/40 p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] uppercase tracking-wider text-zinc-500", children: "实时日志" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: clearProgress,
            className: "rounded px-2 py-0.5 text-[10px] text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300",
            children: "清空"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-32 overflow-y-auto font-mono text-[10px] leading-relaxed text-zinc-400", children: [
        progressLines.map((line, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "truncate", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted", children: [
            "[",
            (/* @__PURE__ */ new Date()).toLocaleTimeString(),
            "]"
          ] }),
          " ",
          line
        ] }, `${i}-${line.slice(0, 20)}`)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: progressEndRef })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: BACKUP_ITEMS.map((item) => {
      const Icon2 = item.icon;
      const expanded = expandedId === item.id;
      const needsModel = item.id === "edl-backup" || item.id === "flash-twrp" || item.id === "auto-flash-twrp";
      const isExecuting = executingId === item.id;
      const itemResult = result[item.id];
      const modeOk = isModeOk(item);
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: cn(
            "rounded-lg border p-3 transition-all",
            expanded ? "border-blue-600 bg-blue-950/20" : "border-zinc-800/80 bg-zinc-900/30",
            item.danger && !expanded && "border-red-900/40 bg-red-950/10"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => {
                  if (needsModel && !selectedModel) {
                    setExpandedId(expanded ? null : item.id);
                    return;
                  }
                  if (item.id === "adbdd-recover" && adbddMatch) {
                    setExpandedId(expanded ? null : item.id);
                    return;
                  }
                  void handleExecute(item);
                },
                disabled: isExecuting || !modeOk,
                className: "flex w-full items-center gap-3 text-left disabled:cursor-not-allowed",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        item.danger ? "bg-red-600/15 text-red-400" : "bg-blue-600/15 text-blue-400"
                      ),
                      children: isExecuting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { className: "h-4 w-4" })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: cn(
                          "text-sm font-medium",
                          item.danger ? "text-red-200" : "text-zinc-100"
                        ),
                        children: item.title
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-xs text-zinc-500", children: item.description })
                  ] }),
                  needsModel && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px]",
                        selectedModel ? "bg-blue-500/15 text-blue-400" : "bg-zinc-800 text-zinc-500"
                      ),
                      children: selectedModel ? selectedModel.model : "选型号"
                    }
                  ),
                  needsModel && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0", children: expanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5 text-zinc-500" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 text-zinc-500" }) })
                ]
              }
            ),
            itemResult && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: cn(
                  "mt-2 flex items-center gap-1.5 rounded px-2 py-1 text-[10px]",
                  itemResult.success ? "text-green-400" : itemResult.message === "已取消" ? "text-zinc-500" : "text-red-400"
                ),
                children: [
                  itemResult.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 shrink-0" }) : itemResult.message === "已取消" ? null : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3 shrink-0" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: itemResult.message })
                ]
              }
            ),
            expanded && needsModel && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 border-t border-zinc-800/60 pt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-1.5 text-[10px] text-zinc-500", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-3 w-3" }),
                "选择型号(对应原 pashtwrp.json / backup_9008.json)"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-1 sm:grid-cols-3", children: MODELS.map((m2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => {
                    setSelectedModel(m2);
                    setExpandedId(null);
                  },
                  className: cn(
                    "rounded border px-2 py-1 text-left text-[10px] transition-colors",
                    selectedModel?.innermodel === m2.innermodel ? "border-blue-600 bg-blue-950/40 text-blue-200" : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-blue-600/40 hover:bg-zinc-900/50"
                  ),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: m2.model }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[9px] text-zinc-600", children: m2.innermodel })
                  ]
                },
                m2.innermodel
              )) })
            ] }),
            expanded && item.id === "adbdd-recover" && adbddMatch && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 border-t border-zinc-800/60 pt-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-1.5 text-xs font-medium text-amber-400", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }),
                "确认恢复以下分区?"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 text-[10px] text-zinc-500", children: [
                "匹配 ",
                adbddMatch.matched.length,
                " 个,跳过 ",
                adbddMatch.skipped.length,
                " 个"
              ] }),
              adbddMatch.matched.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 max-h-32 overflow-y-auto rounded border border-zinc-800 bg-zinc-950/40 p-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 text-[10px] text-zinc-500", children: "将恢复:" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: adbddMatch.matched.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-amber-900/30 px-1.5 py-0.5 font-mono text-[10px] text-amber-300", children: p2 }, p2)) })
              ] }),
              adbddMatch.skipped.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 max-h-24 overflow-y-auto rounded border border-zinc-800 bg-zinc-950/40 p-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-1 text-[10px] text-zinc-500", children: "跳过(设备无此分区):" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: adbddMatch.skipped.map((p2) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-zinc-800 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500", children: p2 }, p2)) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: handleAdbddConfirm,
                    disabled: isExecuting,
                    className: "flex items-center gap-1 rounded-md bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50",
                    children: [
                      isExecuting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3 w-3" }),
                      "确认恢复(危险)"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: handleAdbddCancel,
                    disabled: isExecuting,
                    className: "rounded-md border border-zinc-700 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-800 disabled:opacity-50",
                    children: "取消"
                  }
                )
              ] })
            ] })
          ]
        },
        item.id
      );
    }) }),
    (!device || device.type !== "adb") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-lg border border-amber-800/40 bg-amber-950/20 p-3 text-xs text-amber-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "当前无 ADB 模式设备。DCIM / ADB-dd / 开机自刷 TWRP / Xposed 安装需要 ADB 模式。" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-amber-400/80", children: "9008 备份/恢复 / 超级恢复 / TWRP 刷入 需要设备进入 9008 EDL 模式,功能执行时会自动等待 9008 设备。" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "section-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-3.5 w-3.5" }),
        "风险提示"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-red-900/40 bg-red-950/10 p-4 text-xs text-red-300/90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "mr-1 inline h-3 w-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "9008 恢复 / ADB-dd 恢复 / 超级恢复" }),
          "是高风险操作,可能使设备变砖。 请确保备份来源可靠,并仔细核对匹配分区后再确认执行。"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "mr-1 inline h-3 w-3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "开机自刷 TWRP" }),
          "会在设备每次开机时尝试刷入 recovery, 若镜像与设备不匹配会导致 bootloop,操作前请确认型号选择正确。"
        ] })
      ] })
    ] })
  ] });
}
const STAGE_META = {
  idle: { label: "空闲", group: "prepare" },
  "preparing-resources": { label: "准备资源", group: "prepare" },
  "showing-disclaimer": { label: "显示免责声明", group: "prepare" },
  "detecting-device": { label: "检测设备", group: "prepare" },
  "selecting-model": { label: "选择型号", group: "prepare" },
  "entering-edl": { label: "进入 EDL", group: "prepare" },
  "waiting-adb-after-edl": { label: "EDL 后等待 ADB", group: "prepare" },
  "reading-device-info": { label: "读取设备信息", group: "prepare" },
  "detecting-v3": { label: "检测 V3 协议", group: "prepare" },
  "extracting-root-zip": { label: "解压 Root 资源包", group: "prepare" },
  "routing-by-sdk": { label: "SDK 路由", group: "prepare" },
  // SDK19
  "sdk19-backup-dcim": { label: "[SDK19] 备份相册", group: "sdk19" },
  "sdk19-flash-boot": { label: "[SDK19] 刷入 boot", group: "sdk19" },
  "sdk19-install-magisk": { label: "[SDK19] 安装 Magisk", group: "sdk19" },
  "sdk19-install-xtcpatch": { label: "[SDK19] 刷入 xtcpatch", group: "sdk19" },
  "sdk19-restore-dcim": { label: "[SDK19] 恢复相册", group: "sdk19" },
  "sdk19-reboot": { label: "[SDK19] 重启", group: "sdk19" },
  // SDK25
  "sdk25-backup-dcim": { label: "[SDK25] 备份相册", group: "sdk25" },
  "sdk25-select-scheme": { label: "[SDK25] 选择方案", group: "sdk25" },
  "sdk25-entering-edl": { label: "[SDK25] 进入 EDL", group: "sdk25" },
  "sdk25-reading-boot": { label: "[SDK25] 读取 boot", group: "sdk25" },
  "sdk25-patching-boot": { label: "[SDK25] 修补 boot", group: "sdk25" },
  "sdk25-flashing": { label: "[SDK25] 刷入", group: "sdk25" },
  "sdk25-rebooting": { label: "[SDK25] 重启", group: "sdk25" },
  "sdk25-waiting-boot": { label: "[SDK25] 等待开机", group: "sdk25" },
  "sdk25-install-magisk": { label: "[SDK25] 安装 Magisk", group: "sdk25" },
  "sdk25-install-xtcpatch": { label: "[SDK25] 刷入 xtcpatch", group: "sdk25" },
  "sdk25-boot-scheme-second-edl": { label: "[SDK25] 二次 EDL", group: "sdk25" },
  "sdk25-restore-dcim": { label: "[SDK25] 恢复相册 + 检查 Magisk", group: "sdk25" },
  // SDK27
  "sdk27-backup-dcim": { label: "[SDK27] 备份相册", group: "sdk27" },
  "sdk27-entering-edl": { label: "[SDK27] 进入 EDL", group: "sdk27" },
  "sdk27-reading-boot": { label: "[SDK27] 读取 boot", group: "sdk27" },
  "sdk27-patching-boot": { label: "[SDK27] 修补 boot", group: "sdk27" },
  "sdk27-flashing-rawprogram": { label: "[SDK27] 刷入 rawprogram", group: "sdk27" },
  "sdk27-rebooting-to-fastboot": { label: "[SDK27] 重启至 Fastboot", group: "sdk27" },
  "sdk27-fastboot-flash-boot": { label: "[SDK27] Fastboot 刷 boot", group: "sdk27" },
  "sdk27-fastboot-flash-userdata": { label: "[SDK27] Fastboot 刷 userdata", group: "sdk27" },
  "sdk27-fastboot-flash-misc": { label: "[SDK27] Fastboot 刷 misc", group: "sdk27" },
  "sdk27-waiting-boot": { label: "[SDK27] 等待开机", group: "sdk27" },
  "sdk27-install-preinstall": { label: "[SDK27] 安装预装", group: "sdk27" },
  "sdk27-enable-charge": { label: "[SDK27] 开启充电可用", group: "sdk27" },
  "sdk27-auto-grant-magisk": { label: "[SDK27] 自动授予 Magisk", group: "sdk27" },
  "sdk27-activate-systemplus": { label: "[SDK27] 激活 SystemPlus", group: "sdk27" },
  "sdk27-install-xtcpatch": { label: "[SDK27] 刷入 xtcpatch", group: "sdk27" },
  "sdk27-install-systemui": { label: "[SDK27] 安装 SystemUI", group: "sdk27" },
  "sdk27-install-preinstall-apk": { label: "[SDK27] 安装预装 APK", group: "sdk27" },
  "sdk27-erase-misc-reboot": { label: "[SDK27] 擦除 misc 重启", group: "sdk27" },
  "sdk27-install-bundled-apks": { label: "[SDK27] 安装捆绑 APK", group: "sdk27" },
  "sdk27-compile-packages": { label: "[SDK27] 编译包", group: "sdk27" },
  "sdk27-restore-dcim": { label: "[SDK27] 恢复相册", group: "sdk27" },
  // ND03
  "nd03-download-zip": { label: "[ND03] 下载 zip", group: "nd03" },
  "nd03-extract": { label: "[ND03] 解压", group: "nd03" },
  "nd03-entering-edl": { label: "[ND03] 进入 EDL", group: "nd03" },
  "nd03-flash-281-recovery": { label: "[ND03] 刷 281 恢复固件", group: "nd03" },
  "nd03-flash-root-firmware": { label: "[ND03] 刷 root 固件", group: "nd03" },
  "nd03-erase-boot": { label: "[ND03] 擦除 boot", group: "nd03" },
  "nd03-reboot-to-fastboot": { label: "[ND03] 重启至 Fastboot", group: "nd03" },
  "nd03-fastboot-flash-boot": { label: "[ND03] Fastboot 刷 boot", group: "nd03" },
  "nd03-boot-recovery": { label: "[ND03] 启动 Recovery", group: "nd03" },
  "nd03-sideload-dm": { label: "[ND03] Sideload dm", group: "nd03" },
  "nd03-flash-misc-reboot": { label: "[ND03] 刷 misc 重启", group: "nd03" },
  "nd03-wait-3-reboots": { label: "[ND03] 等待 3 次重启", group: "nd03" },
  "nd03-auto-grant-magisk": { label: "[ND03] 自动授予 Magisk", group: "nd03" },
  "nd03-install-xtcpatch": { label: "[ND03] 刷入 xtcpatch", group: "nd03" },
  "nd03-install-toolkit": { label: "[ND03] 安装 toolkit", group: "nd03" },
  "nd03-activate-lsposed": { label: "[ND03] 激活 LSPosed", group: "nd03" },
  "nd03-install-preinstall": { label: "[ND03] 安装预装", group: "nd03" },
  "nd03-compile-packages": { label: "[ND03] 编译包", group: "nd03" },
  // 终态
  completed: { label: "已完成", group: "final" },
  failed: { label: "已失败", group: "final" },
  cancelled: { label: "已取消", group: "final" }
};
const SDK25_SCHEMES = [
  {
    value: "boot",
    label: "BOOT 方案",
    description: "如果已经降级请选择此方案(刷入 boot 分区)"
  },
  {
    value: "recovery",
    label: "Recovery 方案",
    description: "最新系统可使用此方案(刷入 recovery + misc 分区)"
  }
];
function Root() {
  const device = useDeviceStore((s) => s.current);
  const [disclaimerAgreed, setDisclaimerAgreed] = reactExports.useState(false);
  const [simCardRemoved, setSimCardRemoved] = reactExports.useState(false);
  const [modelSearch, setModelSearch] = reactExports.useState("");
  const [selectedModel, setSelectedModel] = reactExports.useState(null);
  const [nouserdata, setNouserdata] = reactExports.useState(false);
  const [sdk25Scheme, setSdk25Scheme] = reactExports.useState("boot");
  const [taskId, setTaskId] = reactExports.useState(null);
  const [ctx, setCtx] = reactExports.useState(null);
  const [starting, setStarting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const logRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [ctx?.logs.length]);
  reactExports.useEffect(() => {
    const unsub = api.root.onStageChange((newCtx) => {
      setCtx(newCtx);
      if (newCtx.stage === "failed" || newCtx.stage === "cancelled" || newCtx.stage === "completed") {
        setStarting(false);
      }
    });
    return unsub;
  }, []);
  const filteredModels = reactExports.useMemo(() => {
    const q2 = modelSearch.trim().toLowerCase();
    if (!q2) return MODELS;
    return MODELS.filter(
      (m2) => m2.model.toLowerCase().includes(q2) || m2.innermodel.toLowerCase().includes(q2) || m2.series.toLowerCase().includes(q2)
    );
  }, [modelSearch]);
  const canStart = disclaimerAgreed && simCardRemoved && (device?.type === "adb" || device?.type === "qcom_edl") && !starting;
  const handleStart = async () => {
    setError(null);
    setStarting(true);
    try {
      const options = {
        nouserdata,
        sdk25Scheme,
        modelChoice: selectedModel?.innermodel
      };
      const r2 = await api.root.start(options);
      if (!r2.success || !r2.taskId) {
        setError(r2.error ?? "启动失败");
        setStarting(false);
        return;
      }
      setTaskId(r2.taskId);
    } catch (e) {
      setError(e.message);
      setStarting(false);
    }
  };
  const handlePause = async () => {
    if (!taskId) return;
    await api.root.pause(taskId);
  };
  const handleResume = async () => {
    if (!taskId) return;
    await api.root.resume(taskId);
  };
  const handleCancel = async () => {
    if (!taskId) return;
    if (!window.confirm("确认取消 Root 流程?已刷入的分区不会回滚,但会尝试恢复 DCIM 相册。")) {
      return;
    }
    await api.root.cancel(taskId);
  };
  const isRunning = ctx !== null && !["completed", "failed", "cancelled"].includes(ctx.stage);
  const isPaused = ctx?.paused ?? false;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "page-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "title-icon" }),
        "一键 Root"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-desc", children: "通过 ADB 或 EDL (9008) 模式 Root 手表。支持 SDK 19/25/27 全流程。" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-lg border border-red-900/40 bg-red-950/10 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 text-amber-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-sm font-medium text-red-200", children: "Root 操作风险声明(必读)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-xs leading-relaxed text-zinc-400", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-zinc-300", children: "数据丢失:" }),
          "Root 操作会恢复出厂设置,设备上的全部本地数据(照片、视频、聊天记录等)将被清除。请提前备份。"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-zinc-300", children: "保修失效:" }),
          "设备自进入 9008 模式起即刻丧失官方保修资格,且无法恢复。"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-zinc-300", children: "设备风险:" }),
          "Root 过程中可能出现设备变砖、系统崩溃、功能异常等问题。刷机属于您个人自愿行为, 因刷机导致的任何直接或间接损失(包括但不限于设备损坏、数据丢失、功能异常、保修失效、账号封禁等), 开发者不承担任何责任。"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-zinc-300", children: "注意事项:" }),
          "设备进入长续航/睡眠等禁用模式时, 可滑动到最后一页点击「应用列表」绕过。请勿卸载 SystemPlus 和 XTCPatch, 请勿删除 Magisk 内置模块,否则设备将无法启动。"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-red-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "严禁解绑:" }),
          "本工具严禁用于手表强制解绑。如拾获他人设备,请联系公安机关(110)归还失主, 切勿尝试通过任何手段解除挂失锁。手表解绑属于违法行为,可能构成犯罪。"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-zinc-500", children: "继续操作即表示您已阅读并同意《最终用户许可协议及免责声明》的全部条款。" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-2 text-xs text-zinc-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: disclaimerAgreed,
              onChange: (e) => setDisclaimerAgreed(e.target.checked),
              className: "mt-0.5 h-3.5 w-3.5 rounded border-zinc-600 text-blue-600 focus:ring-blue-500"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "我已仔细阅读并完全理解上述声明,自愿承担全部风险及责任" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-2 text-xs text-zinc-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: simCardRemoved,
              onChange: (e) => setSimCardRemoved(e.target.checked),
              className: "mt-0.5 h-3.5 w-3.5 rounded border-zinc-600 text-blue-600 focus:ring-blue-500"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "我已确认手表已拔出 SIM 卡" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500", children: "设备状态" }),
      !device ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-800 py-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "h-8 w-8 text-zinc-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-zinc-400", children: "未检测到设备" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-md text-center text-xs text-zinc-500", children: "请连接手表并开启 ADB 调试。也可让手表进入 9008 EDL 模式。" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg border border-zinc-800 bg-zinc-900/30 p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DeviceIcon, { type: device.type }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm font-medium text-zinc-100", children: [
            device.type === "adb" && "ADB 模式",
            device.type === "fastboot" && "Fastboot 模式",
            device.type === "qcom_edl" && `9008 EDL 模式${device.port ? ` · ${device.port}` : ""}`
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[11px] text-zinc-500", children: [
            "serial: ",
            device.serial,
            device.innermodel && ` · innermodel: ${device.innermodel}`,
            device.sdkVersion && ` · SDK: ${device.sdkVersion}`
          ] })
        ] })
      ] }) })
    ] }),
    !isRunning && !ctx && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      device?.type === "qcom_edl" && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500", children: "选择型号(EDL 模式)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                placeholder: "搜索型号或 innermodel...",
                value: modelSearch,
                onChange: (e) => setModelSearch(e.target.value),
                className: "w-full rounded-md border border-zinc-800 bg-zinc-950/50 py-2 pl-9 pr-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-72 overflow-y-auto rounded-md border border-zinc-800/60", children: filteredModels.map((m2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setSelectedModel(m2),
              className: cn(
                "flex w-full items-center gap-3 border-b border-zinc-800/40 px-3 py-2 text-left text-xs transition-colors last:border-b-0",
                selectedModel?.innermodel === m2.innermodel ? "bg-blue-600/15 text-blue-200" : "text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-3.5 w-3.5 shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: m2.model }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-zinc-500", children: [
                    m2.innermodel,
                    " · ",
                    m2.platform
                  ] })
                ] }),
                selectedModel?.innermodel === m2.innermodel && /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 text-blue-400" })
              ]
            },
            m2.innermodel
          )) }),
          selectedModel && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-xs text-zinc-500", children: [
            "已选: ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-blue-300", children: selectedModel.model }),
            "(",
            selectedModel.innermodel,
            ")"
          ] })
        ] })
      ] }),
      (!device || device.type === "qcom_edl" || device.type === "adb" && device.sdkVersion === "25") && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500", children: "SDK25 方案(Android 7.1)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 gap-2 sm:grid-cols-2", children: SDK25_SCHEMES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setSdk25Scheme(s.value),
            disabled: starting,
            className: cn(
              "rounded-md border p-3 text-left text-xs transition-colors",
              sdk25Scheme === s.value ? "border-blue-600 bg-blue-950/40 text-blue-200" : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-blue-600/40 hover:bg-zinc-900/50"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: s.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[10px] text-zinc-500", children: s.description })
            ]
          },
          s.value
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/30 p-3 text-xs text-zinc-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "checkbox",
            checked: nouserdata,
            onChange: (e) => setNouserdata(e.target.checked),
            className: "mt-0.5 h-3.5 w-3.5 rounded border-zinc-600 text-blue-600 focus:ring-blue-500"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-zinc-200", children: "不刷 userdata" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 text-[10px] text-zinc-500", children: "对应原 root.bat 的 nouserdata 参数。可能导致设备出现问题,谨慎选择。" })
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleStart,
            disabled: !canStart,
            className: cn(
              "flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium text-white transition-colors",
              canStart ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-zinc-800 text-zinc-500"
            ),
            children: [
              starting ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4" }),
              starting ? "启动中..." : "开始 Root"
            ]
          }
        ),
        !disclaimerAgreed && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-amber-400", children: "请先同意免责声明" }),
        disclaimerAgreed && !simCardRemoved && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-amber-400", children: "请确认已拔出 SIM 卡" }),
        disclaimerAgreed && simCardRemoved && (!device || device.type !== "adb" && device.type !== "qcom_edl") && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-amber-400", children: "需要 ADB 或 9008 EDL 模式设备" })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-md border border-red-800/50 bg-red-950/20 p-3 text-sm text-red-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: error })
      ] })
    ] }),
    (isRunning || ctx) && ctx && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(StageIcon, { stage: ctx.stage }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-medium text-zinc-100", children: STAGE_META[ctx.stage]?.label ?? ctx.stage }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[10px] text-zinc-500", children: [
                "task: ",
                ctx.taskId.slice(0, 24),
                "..."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-zinc-400", children: "进度" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-lg font-semibold text-blue-400", children: [
              ctx.progress,
              "%"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 overflow-hidden rounded-full bg-zinc-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "h-full rounded-full transition-all duration-500",
              ctx.stage === "failed" ? "bg-red-600" : ctx.stage === "cancelled" ? "bg-zinc-600" : ctx.stage === "completed" ? "bg-green-600" : "bg-blue-600"
            ),
            style: { width: `${ctx.progress}%` }
          }
        ) }),
        (ctx.innermodel || ctx.sdkVersion) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-2 gap-2 text-[10px] text-zinc-500 sm:grid-cols-4", children: [
          ctx.innermodel && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: "innermodel:" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-300", children: ctx.innermodel })
          ] }),
          ctx.sdkVersion && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: "SDK:" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-300", children: ctx.sdkVersion })
          ] }),
          ctx.androidVersion && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: "Android:" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-300", children: ctx.androidVersion })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: "V3:" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-300", children: ctx.isV3 ? "是" : "否" })
          ] }),
          ctx.edlPort && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: "EDL:" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-300", children: ctx.edlPort })
          ] }),
          ctx.sdk25Scheme && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted", children: "SDK25 方案:" }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-300", children: ctx.sdk25Scheme })
          ] })
        ] })
      ] }),
      isRunning && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "flex items-center gap-2", children: [
        isPaused ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleResume,
            className: "flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "h-3 w-3" }),
              "恢复"
            ]
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handlePause,
            className: "flex items-center gap-1.5 rounded-md border border-amber-700/60 bg-amber-900/10 px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-700 hover:text-white",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "h-3 w-3" }),
              "暂停"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleCancel,
            className: "flex items-center gap-1.5 rounded-md border border-red-700/60 bg-red-900/10 px-3 py-1.5 text-xs text-red-400 hover:bg-red-700 hover:text-white",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" }),
              "取消"
            ]
          }
        )
      ] }),
      ctx.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-md border border-red-800/50 bg-red-950/20 p-3 text-sm text-red-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "Root 失败" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs opacity-80", children: ctx.error.message }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 text-[10px] opacity-60", children: [
            "失败 stage: ",
            ctx.error.stage
          ] })
        ] })
      ] }),
      ctx.stage === "completed" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 rounded-md border border-green-800/50 bg-green-950/20 p-3 text-sm text-green-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium", children: "Root 完成" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-xs opacity-80", children: "您的手表已 ROOT 完毕。提示:如果需要在手表上安装应用,请在手表端选择弦-安装器,点击始终。" })
        ] })
      ] }),
      ctx.stage === "completed" && ctx.sdkVersion === "27" && /* @__PURE__ */ jsxRuntimeExports.jsx(RootProPrompt, { taskId: ctx.taskId }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-3.5 w-3.5" }),
          "实时日志",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-normal text-zinc-600", children: [
            "(",
            ctx.logs.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            ref: logRef,
            className: "max-h-96 overflow-y-auto rounded-md border border-zinc-800 bg-zinc-950/80 p-3 font-mono text-[11px] leading-relaxed",
            children: ctx.logs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-muted", children: "暂无日志" }) : ctx.logs.map((log) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: cn(
                  "flex gap-2",
                  log.level === "error" && "text-red-400",
                  log.level === "warn" && "text-amber-400",
                  log.level === "info" && "text-zinc-300"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-zinc-600", children: formatTime(log.ts) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 break-all", children: log.msg })
                ]
              },
              log.ts
            ))
          }
        )
      ] }),
      (ctx.stage === "completed" || ctx.stage === "failed" || ctx.stage === "cancelled") && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            setCtx(null);
            setTaskId(null);
            setStarting(false);
            setError(null);
          },
          className: "flex items-center gap-1.5 rounded-md border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-900",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" }),
            "重新开始"
          ]
        }
      ) })
    ] }),
    !ctx && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-lg border border-blue-900/40 bg-blue-950/10 p-3 text-xs text-blue-200", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "连接方式:" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-blue-300/80", children: [
          "1. 手表打开拨号盘输入 ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("code", { className: "rounded bg-blue-950/60 px-1 py-0.5 text-blue-200", children: "*#0769651#*" }),
          " 打开 ADB 开关"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-blue-300/80", children: "2. 打开手表卡槽,用金属物品短接触点进入 9008 EDL 模式" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-blue-300/60", children: "Z2/Z3/Z5A/Z5Q/Z6 请使用方式一,Z2 v3.3.5 需超降级。" })
      ] })
    ] }) })
  ] });
}
function DeviceIcon({ type }) {
  switch (type) {
    case "adb":
    case "emulator":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4 text-blue-400" });
    case "fastboot":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "h-4 w-4 text-amber-400" });
    case "qcom_edl":
    case "sprd_edl":
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-4 w-4 text-purple-400" });
    default:
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Smartphone, { className: "h-4 w-4 text-zinc-400" });
  }
}
function StageIcon({ stage }) {
  if (stage === "completed") return /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-5 w-5 text-green-400" });
  if (stage === "failed") return /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5 text-red-400" });
  if (stage === "cancelled") return /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5 text-zinc-400" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-5 w-5 animate-spin text-blue-400" });
}
function RootProPrompt({ taskId: _taskId }) {
  const [dismissed, setDismissed] = reactExports.useState(false);
  const [opts, setOpts] = reactExports.useState({ installApks: true, installDesktop: true, installMods: false });
  const [executing, setExecuting] = reactExports.useState(false);
  const [result, setResult] = reactExports.useState(null);
  if (dismissed) return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {});
  const handleExecute = async () => {
    setExecuting(true);
    setResult(null);
    try {
      const r2 = await api.tools.rootpro(opts);
      setResult({ success: r2.success, supported: r2.supported, error: r2.error });
    } catch (e) {
      setResult({
        success: false,
        supported: false,
        error: e.message
      });
    } finally {
      setExecuting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-blue-800/50 bg-blue-950/10 p-4 text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-2 font-medium text-blue-200", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4 shrink-0" }),
      "是否进行预装优化?"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-xs text-blue-300/70", children: "对应 root-SDK27.bat 末尾的 yesno 菜单:包括拓展应用包、禁用模式切换桌面、拓展 magisk 模块。 期间需要多次选择(此处用复选框代替)。" }),
    !result && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 space-y-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs text-blue-200 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: opts.installApks,
              onChange: (e) => setOpts({ ...opts, installApks: e.target.checked }),
              className: "h-3.5 w-3.5 accent-blue-600"
            }
          ),
          "安装拓展应用包(rootproapks.txt)"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs text-blue-200 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: opts.installDesktop,
              onChange: (e) => setOpts({ ...opts, installDesktop: e.target.checked }),
              className: "h-3.5 w-3.5 accent-blue-600"
            }
          ),
          "安装禁用模式切换桌面"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs text-blue-200 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: opts.installMods,
              onChange: (e) => setOpts({ ...opts, installMods: e.target.checked }),
              className: "h-3.5 w-3.5 accent-blue-600"
            }
          ),
          "刷拓展 magisk 模块(rootpromods.txt)"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleExecute,
            disabled: executing,
            className: "flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50",
            children: [
              executing ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3 w-3 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-3 w-3" }),
              executing ? "执行中..." : "是,进行预装优化"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setDismissed(true),
            disabled: executing,
            className: "rounded-md border border-blue-800/50 px-3 py-1.5 text-xs text-blue-200 hover:bg-blue-900/30 disabled:opacity-50",
            children: "否,跳过"
          }
        )
      ] })
    ] }),
    result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: result.success ? "flex items-center gap-2 rounded-md border border-green-800/50 bg-green-950/20 p-2.5 text-xs text-green-300" : "flex items-center gap-2 rounded-md border border-red-800/50 bg-red-950/20 p-2.5 text-xs text-red-300",
        children: [
          result.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: result.success ? "预装优化完成" : result.error ?? "预装优化失败(可在“其他工具”页重试)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setDismissed(true),
              className: "ml-auto rounded px-2 py-0.5 text-xs hover:bg-zinc-800",
              children: "关闭"
            }
          )
        ]
      }
    )
  ] });
}
const QUICK_ICON_MAP = {
  home: House,
  image: File,
  download: Download,
  music: File,
  film: File,
  file: File,
  drive: HardDrive,
  terminal: ChevronRight,
  database: HardDrive
};
const BOOKMARKS_KEY = "iMooAgentTool.fileBookmarks";
function Files() {
  const device = useDeviceStore((s) => s.current);
  const [cwd, setCwd] = reactExports.useState("/sdcard");
  const [entries, setEntries] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [disk, setDisk] = reactExports.useState(null);
  const [addressValue, setAddressValue] = reactExports.useState("/sdcard");
  const [editingAddress, setEditingAddress] = reactExports.useState(false);
  const [quickPaths, setQuickPaths] = reactExports.useState([]);
  const [devices, setDevices] = reactExports.useState([]);
  const [selectedSerial, setSelectedSerial] = reactExports.useState(void 0);
  const [selected, setSelected] = reactExports.useState(/* @__PURE__ */ new Set());
  const [lastSelected, setLastSelected] = reactExports.useState(null);
  const [searchQuery, setSearchQuery] = reactExports.useState("");
  const [sortKey, setSortKey] = reactExports.useState("name");
  const [sortDir, setSortDir] = reactExports.useState("asc");
  const [dirsFirst, setDirsFirst] = reactExports.useState(true);
  const [viewMode, setViewMode] = reactExports.useState("list");
  const [bookmarks, setBookmarks] = reactExports.useState([]);
  const [clipboard, setClipboard] = reactExports.useState(null);
  const [compatMode, setCompatMode] = reactExports.useState(false);
  const [keepMtime, setKeepMtime] = reactExports.useState(false);
  const [transfer, setTransfer] = reactExports.useState(null);
  const [history, setHistory] = reactExports.useState(["/sdcard"]);
  const [histIdx, setHistIdx] = reactExports.useState(0);
  const [newFolderOpen, setNewFolderOpen] = reactExports.useState(false);
  const [newFolderName, setNewFolderName] = reactExports.useState("");
  const [newFileOpen, setNewFileOpen] = reactExports.useState(false);
  const [newFileName, setNewFileName] = reactExports.useState("");
  const [newFileContent, setNewFileContent] = reactExports.useState("");
  const [renameTarget, setRenameTarget] = reactExports.useState(null);
  const [editorTarget, setEditorTarget] = reactExports.useState(null);
  const [chmodTarget, setChmodTarget] = reactExports.useState(null);
  const [ctxMenu, setCtxMenu] = reactExports.useState(null);
  const listAbortRef = reactExports.useRef(0);
  reactExports.useEffect(() => {
    api.file.quickPaths().then((r2) => {
      if (r2.success) {
        if (r2.success) setQuickPaths(r2.paths);
      }
    });
    try {
      const raw = localStorage.getItem(BOOKMARKS_KEY);
      if (raw) setBookmarks(JSON.parse(raw));
    } catch {
    }
  }, []);
  const refreshDevices = reactExports.useCallback(async () => {
    const r2 = await api.file.listDevices();
    if (r2.success) {
      setDevices(r2.devices);
      if (selectedSerial && !r2.devices.find((d) => d.serial === selectedSerial)) {
        setSelectedSerial(void 0);
      }
    }
  }, [selectedSerial]);
  reactExports.useEffect(() => {
    void refreshDevices();
    const unsub = api.device.onChange(() => {
      void refreshDevices();
    });
    return unsub;
  }, [refreshDevices]);
  reactExports.useEffect(() => {
    const unsub = api.file.onTransferProgress((p2) => {
      setTransfer(p2);
      if (p2.percent >= 100) {
        window.setTimeout(() => setTransfer(null), 800);
      }
    });
    return unsub;
  }, []);
  reactExports.useEffect(() => {
    void api.file.setCompatMode(compatMode);
  }, [compatMode]);
  reactExports.useEffect(() => {
    void api.file.setKeepMtime(keepMtime);
  }, [keepMtime]);
  const loadDir = reactExports.useCallback(
    async (path, pushHistory = true) => {
      if (!device || device.type !== "adb") {
        setEntries([]);
        setError(null);
        return;
      }
      const myToken = ++listAbortRef.current;
      setLoading(true);
      setError(null);
      setSelected(/* @__PURE__ */ new Set());
      setLastSelected(null);
      setSearchQuery("");
      try {
        const res = await api.file.list(path, selectedSerial);
        if (myToken !== listAbortRef.current) return;
        if (res.success) {
          setEntries(res.entries);
          setCwd(path);
          setAddressValue(path);
        } else {
          setError(res.error ?? "读取目录失败");
          setEntries([]);
        }
      } catch (e) {
        if (myToken !== listAbortRef.current) return;
        setError(e.message);
        setEntries([]);
      } finally {
        if (myToken === listAbortRef.current) setLoading(false);
      }
      if (pushHistory) {
        setHistory((prev) => {
          const next = prev.slice(0, histIdx + 1);
          next.push(path);
          return next;
        });
        setHistIdx((i) => i + 1);
      }
      if (path.startsWith("/sdcard") || path.startsWith("/storage")) {
        api.file.diskInfo(path).then((r2) => {
          if (r2.success && r2.info) setDisk(r2.info);
        }).catch(() => {
        });
      }
    },
    [device, histIdx, selectedSerial]
  );
  reactExports.useEffect(() => {
    if (device?.type === "adb") {
      void loadDir(cwd, false);
    } else {
      setEntries([]);
      setDisk(null);
      setError(null);
    }
  }, [device, selectedSerial]);
  const crumbs = reactExports.useMemo(() => {
    const parts = cwd.split("/").filter(Boolean);
    const list = [{ name: "根", path: "/" }];
    let acc = "";
    for (const p2 of parts) {
      acc += "/" + p2;
      list.push({ name: p2, path: acc });
    }
    return list;
  }, [cwd]);
  const displayEntries = reactExports.useMemo(() => {
    let list = entries;
    if (searchQuery.trim()) {
      const q2 = searchQuery.toLowerCase();
      list = list.filter((e) => e.name.toLowerCase().includes(q2));
    }
    const sorted = [...list].sort((a, b) => {
      if (dirsFirst && a.isDir !== b.isDir) return a.isDir ? -1 : 1;
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
          break;
        case "size":
          cmp = a.size - b.size;
          break;
        case "mtime":
          cmp = a.mtime.localeCompare(b.mtime);
          break;
        case "ext":
          cmp = a.ext.localeCompare(b.ext);
          if (cmp === 0) cmp = a.name.toLowerCase().localeCompare(b.name.toLowerCase());
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [entries, searchQuery, sortKey, sortDir, dirsFirst]);
  const goUp = () => {
    const idx = cwd.lastIndexOf("/");
    const parent = idx <= 0 ? "/" : cwd.slice(0, idx);
    void loadDir(parent);
  };
  const goBack = () => {
    if (histIdx > 0) {
      const newIdx = histIdx - 1;
      setHistIdx(newIdx);
      void loadDir(history[newIdx], false);
    }
  };
  const goForward = () => {
    if (histIdx < history.length - 1) {
      const newIdx = histIdx + 1;
      setHistIdx(newIdx);
      void loadDir(history[newIdx], false);
    }
  };
  const goHome = () => void loadDir("/sdcard");
  const selectOnly = (path) => {
    setSelected(/* @__PURE__ */ new Set([path]));
    setLastSelected(path);
  };
  const toggleSelect = (path) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
    setLastSelected(path);
  };
  const rangeSelect = (path) => {
    if (!lastSelected) {
      selectOnly(path);
      return;
    }
    const startIdx = displayEntries.findIndex((e) => e.path === lastSelected);
    const endIdx = displayEntries.findIndex((e) => e.path === path);
    if (startIdx < 0 || endIdx < 0) {
      selectOnly(path);
      return;
    }
    const [from, to] = startIdx < endIdx ? [startIdx, endIdx] : [endIdx, startIdx];
    const next = new Set(selected);
    for (let i = from; i <= to; i++) {
      next.add(displayEntries[i].path);
    }
    setSelected(next);
    setLastSelected(path);
  };
  const selectAll = () => {
    setSelected(new Set(displayEntries.map((e) => e.path)));
  };
  const clearSelection = () => {
    setSelected(/* @__PURE__ */ new Set());
    setLastSelected(null);
  };
  const openEntry = (entry) => {
    if (entry.isDir) {
      void loadDir(entry.path);
    } else if (entry.ext === "apk") {
      void handleInstallApk(entry);
    } else if (isTextFile(entry)) {
      void handleEditText(entry);
    }
  };
  const isTextFile = (e) => {
    const textExts = ["txt", "log", "md", "json", "xml", "sh", "conf", "cfg", "properties", "ini", "yaml", "yml", "csv"];
    return textExts.includes(e.ext) || !e.ext && e.size < 65536 && e.size > 0;
  };
  const handleNewFolder = async () => {
    const name = newFolderName.trim();
    if (!name) return;
    const newPath = joinPath(cwd, name);
    const res = await api.file.mkdir(newPath, true);
    if (res.success) {
      toast.ok(`已创建文件夹: ${name}`);
      setNewFolderOpen(false);
      setNewFolderName("");
      await loadDir(cwd, false);
    } else {
      toast.err(`创建失败: ${res.error}`);
    }
  };
  const handleNewFile = async () => {
    const name = newFileName.trim();
    if (!name) return;
    const newPath = joinPath(cwd, name);
    const res = await api.file.createFile(newPath, newFileContent);
    if (res.success) {
      toast.ok(`已创建文件: ${name}`);
      setNewFileOpen(false);
      setNewFileName("");
      setNewFileContent("");
      await loadDir(cwd, false);
    } else {
      toast.err(`创建失败: ${res.error}`);
    }
  };
  const handleUpload = async (filePaths) => {
    let files = filePaths;
    if (!files) {
      const picked = await api.system.pickFile({ kind: "open", multi: true });
      if (!picked) return;
      files = Array.isArray(picked) ? picked : [picked];
    }
    for (const f2 of files) {
      const name = f2.split(/[\\/]/).pop() ?? "file";
      const remote = joinPath(cwd, name);
      const res = await api.file.push(f2, remote, selectedSerial);
      if (res.success) {
        toast.ok(`已上传: ${name}`);
      } else {
        toast.err(`上传失败: ${name} - ${res.error}`);
      }
    }
    await loadDir(cwd, false);
  };
  const handleDownload = async (entry) => {
    const picked = await api.system.pickFile({ kind: "folder" });
    if (!picked || Array.isArray(picked)) return;
    const local = picked.endsWith("\\") || picked.endsWith("/") ? picked + entry.name : picked + "/" + entry.name;
    const res = await api.file.pull(entry.path, local, selectedSerial);
    if (res.success) {
      toast.ok(`已下载到: ${local}`);
    } else {
      toast.err(`下载失败: ${res.error}`);
    }
  };
  const handleBatchDownload = async () => {
    const picked = await api.system.pickFile({ kind: "folder" });
    if (!picked || Array.isArray(picked)) return;
    const targets = entries.filter((e) => selected.has(e.path));
    for (const entry of targets) {
      if (entry.isDir) continue;
      const local = picked.endsWith("\\") || picked.endsWith("/") ? picked + entry.name : picked + "/" + entry.name;
      const res = await api.file.pull(entry.path, local, selectedSerial);
      if (!res.success) {
        toast.err(`下载失败: ${entry.name} - ${res.error}`);
      }
    }
    toast.ok(`批量下载完成(${targets.filter((e) => !e.isDir).length} 个文件)`);
  };
  const handleDelete = async (entry) => {
    if (!window.confirm(`确定删除 "${entry.name}"?${entry.isDir ? " (目录将递归删除)" : ""}`)) return;
    const res = await api.file.remove(entry.path, true);
    if (res.success) {
      toast.ok(`已删除: ${entry.name}`);
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(entry.path);
        return next;
      });
      await loadDir(cwd, false);
    } else {
      toast.err(`删除失败: ${res.error}`);
    }
  };
  const handleBatchDelete = async () => {
    const targets = entries.filter((e) => selected.has(e.path));
    if (targets.length === 0) return;
    if (!window.confirm(`确定删除选中的 ${targets.length} 项?(目录将递归删除)`)) return;
    const res = await api.file.batchRemove(targets.map((e) => e.path), true);
    if (res.success) {
      const okCount = res.deleted.length;
      const failCount = res.failed.length;
      if (failCount === 0) {
        toast.ok(`已删除 ${okCount} 项`);
      } else {
        toast.err(`成功 ${okCount} 项,失败 ${failCount} 项`);
      }
      clearSelection();
      await loadDir(cwd, false);
    } else {
      toast.err(`批量删除失败: ${res.error}`);
    }
  };
  const handleRename = async () => {
    if (!renameTarget) return;
    const newName = renameTarget.newName.trim();
    if (!newName || newName === renameTarget.entry.name) {
      setRenameTarget(null);
      return;
    }
    const newPath = joinPath(cwd, newName);
    const res = await api.file.rename(renameTarget.entry.path, newPath);
    if (res.success) {
      toast.ok(`已重命名为: ${newName}`);
      setRenameTarget(null);
      await loadDir(cwd, false);
    } else {
      toast.err(`重命名失败: ${res.error}`);
    }
  };
  const handleInstallApk = async (entry) => {
    if (!window.confirm(`安装设备上的 APK: ${entry.name}?`)) return;
    toast.ok(`正在安装: ${entry.name}...`);
    const res = await api.file.installApk(entry.path);
    if (res.success) {
      toast.ok(`安装成功: ${entry.name}`);
    } else {
      toast.err(`安装失败: ${res.error}`);
    }
  };
  const [localApkPreview, setLocalApkPreview] = reactExports.useState(null);
  const handleInstallLocalApk = async () => {
    const picked = await api.system.pickFile({
      kind: "open",
      filter: "APK 文件|*.apk;所有文件|*.*"
    });
    if (!picked) return;
    const apkPath = Array.isArray(picked) ? picked[0] : picked;
    setLocalApkPreview(apkPath);
  };
  const handleConfirmLocalInstall = async (apkPath) => {
    setLocalApkPreview(null);
    toast.ok("正在安装...");
    const res = await api.app.install(apkPath);
    if (res.success) {
      toast.ok(`安装成功`);
    } else {
      toast.err(`安装失败: ${res.error}`);
    }
  };
  const handleEditText = async (entry) => {
    setEditorTarget({ entry, content: "", loading: true, dirty: false });
    const res = await api.file.readText(entry.path);
    if (res.success) {
      setEditorTarget({ entry, content: res.content, loading: false, dirty: false });
    } else {
      toast.err(`读取失败: ${res.error}`);
      setEditorTarget(null);
    }
  };
  const handleSaveText = async () => {
    if (!editorTarget) return;
    const res = await api.file.writeFile(editorTarget.entry.path, editorTarget.content);
    if (res.success) {
      toast.ok(`已保存: ${editorTarget.entry.name}`);
      setEditorTarget({ ...editorTarget, dirty: false });
    } else {
      toast.err(`保存失败: ${res.error}`);
    }
  };
  const handleChmod = async () => {
    if (!chmodTarget) return;
    const res = await api.file.chmod(chmodTarget.entry.path, chmodTarget.mode, chmodTarget.recursive);
    if (res.success) {
      toast.ok(`权限已修改: ${chmodTarget.mode}`);
      setChmodTarget(null);
      await loadDir(cwd, false);
    } else {
      toast.err(`修改失败: ${res.error}`);
    }
  };
  const handleCopy = () => {
    const targets = entries.filter((e) => selected.has(e.path)).map((e) => e.path);
    if (targets.length === 0) return;
    setClipboard({ paths: targets, mode: "copy" });
    toast.ok(`已复制 ${targets.length} 项`);
  };
  const handleCut = () => {
    const targets = entries.filter((e) => selected.has(e.path)).map((e) => e.path);
    if (targets.length === 0) return;
    setClipboard({ paths: targets, mode: "cut" });
    toast.ok(`已剪切 ${targets.length} 项`);
  };
  const handlePaste = async () => {
    if (!clipboard || clipboard.paths.length === 0) return;
    for (const src of clipboard.paths) {
      const name = src.split("/").pop() ?? "item";
      const dst = joinPath(cwd, name);
      try {
        if (clipboard.mode === "copy") {
          await api.file.copy(src, dst, true);
        } else {
          await api.file.rename(src, dst);
        }
      } catch (e) {
        toast.err(`粘贴失败: ${name} - ${e.message}`);
      }
    }
    toast.ok(`已粘贴 ${clipboard.paths.length} 项`);
    if (clipboard.mode === "cut") setClipboard(null);
    clearSelection();
    await loadDir(cwd, false);
  };
  const addBookmark = () => {
    const name = cwd.split("/").pop() || cwd;
    const next = bookmarks.filter((b) => b.path !== cwd);
    next.push({ label: name, path: cwd });
    setBookmarks(next);
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
    } catch {
    }
    toast.ok(`已添加书签: ${name}`);
  };
  const removeBookmark = (path) => {
    const next = bookmarks.filter((b) => b.path !== path);
    setBookmarks(next);
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
    } catch {
    }
  };
  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;
    for (const f2 of files) {
      const remote = joinPath(cwd, f2.name);
      const res = await api.file.push(f2.path, remote, selectedSerial);
      if (!res.success) {
        toast.err(`上传失败: ${f2.name} - ${res.error}`);
      }
    }
    toast.ok(`已上传 ${files.length} 个文件`);
    await loadDir(cwd, false);
  };
  reactExports.useEffect(() => {
    const handler = (e) => {
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (newFolderOpen || newFileOpen || renameTarget || editorTarget || chmodTarget) return;
      if (e.key === "Backspace" && device?.type === "adb" && cwd !== "/") {
        e.preventDefault();
        goUp();
      } else if (e.key === "Delete" && selected.size > 0) {
        e.preventDefault();
        void handleBatchDelete();
      } else if (e.key === "F2" && selected.size === 1) {
        e.preventDefault();
        const entry = entries.find((x2) => selected.has(x2.path));
        if (entry) setRenameTarget({ entry, newName: entry.name });
      } else if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        selectAll();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        handleCopy();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "x") {
        handleCut();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "v" && clipboard) {
        e.preventDefault();
        void handlePaste();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [cwd, selected, entries, device, clipboard, newFolderOpen, newFileOpen, renameTarget, editorTarget, chmodTarget]);
  const onContextMenu = (e, entry) => {
    e.preventDefault();
    if (entry && !selected.has(entry.path)) {
      selectOnly(entry.path);
    }
    setCtxMenu({ x: e.clientX, y: e.clientY, entry });
  };
  reactExports.useEffect(() => {
    if (!ctxMenu) return;
    const close = () => setCtxMenu(null);
    window.addEventListener("click", close);
    window.addEventListener("scroll", close, true);
    return () => {
      window.removeEventListener("click", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [ctxMenu]);
  const hasDevice = device?.type === "adb";
  const canBack = histIdx > 0;
  const canForward = histIdx < history.length - 1;
  const selectedCount = selected.size;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", onDrop: handleDrop, onDragOver: (e) => e.preventDefault(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "page-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "title-icon" }),
          "文件管理"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-desc", children: "浏览/传输/管理设备文件" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: selectedSerial ?? "",
            onChange: (e) => setSelectedSerial(e.target.value || void 0),
            disabled: devices.length === 0,
            className: "rounded-md border border-zinc-800 bg-zinc-900/50 px-2 py-1.5 text-xs text-zinc-300 focus:border-blue-600 focus:outline-none disabled:opacity-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "默认设备" }),
              devices.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: d.serial, children: [
                d.model ? `${d.model} (${d.serial})` : d.serial,
                d.state !== "device" ? ` [${d.state}]` : ""
              ] }, d.serial))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => void loadDir(cwd, false),
            disabled: !hasDevice || loading,
            className: "flex items-center gap-1.5 rounded-md border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 disabled:opacity-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: cn("h-3 w-3", loading && "animate-spin") }),
              "刷新"
            ]
          }
        )
      ] })
    ] }),
    !hasDevice && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-zinc-800 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-10 w-10 text-zinc-600" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-zinc-400", children: "需要 ADB 设备连接后才能浏览文件" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-md text-center text-xs text-zinc-500", children: "请连接手表并开启 ADB 调试后使用文件管理" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: goBack,
          disabled: !canBack || !hasDevice,
          className: "btn-secondary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-3.5 w-3.5" }),
            " 后退"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: goForward,
          disabled: !canForward || !hasDevice,
          className: "btn-secondary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" }),
            " 前进"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: goUp,
          disabled: !hasDevice || cwd === "/",
          className: "btn-secondary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "h-3.5 w-3.5" }),
            " 上一级"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: goHome,
          disabled: !hasDevice,
          className: "btn-secondary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(House, { className: "h-3.5 w-3.5" }),
            " 主页"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setNewFolderOpen(true),
          disabled: !hasDevice,
          className: "btn-primary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderPlus, { className: "h-3.5 w-3.5" }),
            " 新建文件夹"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setNewFileOpen(true),
          disabled: !hasDevice,
          className: "btn-primary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FilePlus, { className: "h-3.5 w-3.5" }),
            " 新建文件"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => void handleUpload(),
          disabled: !hasDevice,
          className: "btn-primary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
            " 上传"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-1 h-5 w-px bg-zinc-800" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => void handleBatchDownload(),
          disabled: !hasDevice || selectedCount === 0,
          className: "btn-secondary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-3.5 w-3.5" }),
            " 下载"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            const e = entries.find((x2) => selected.has(x2.path));
            if (e) setRenameTarget({ entry: e, newName: e.name });
          },
          disabled: !hasDevice || selectedCount !== 1,
          className: "btn-secondary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }),
            " 重命名"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => void handleBatchDelete(),
          disabled: !hasDevice || selectedCount === 0,
          className: "flex items-center gap-1.5 rounded-md border border-red-900/50 px-3 py-1.5 text-sm text-red-400 hover:bg-red-950/30 disabled:opacity-50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }),
            " 删除"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-1 h-5 w-px bg-zinc-800" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleCopy,
          disabled: selectedCount === 0,
          className: "btn-secondary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-3.5 w-3.5" }),
            " 复制"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleCut,
          disabled: selectedCount === 0,
          className: "btn-secondary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "h-3.5 w-3.5" }),
            " 剪切"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => void handlePaste(),
          disabled: !clipboard || !hasDevice,
          className: "btn-secondary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardPaste, { className: "h-3.5 w-3.5" }),
            " 粘贴"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-1 h-5 w-px bg-zinc-800" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleInstallLocalApk,
          disabled: !hasDevice,
          className: "btn-secondary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5" }),
            " 安装 APK"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            const e = entries.find((x2) => selected.has(x2.path));
            if (e) setChmodTarget({ entry: e, mode: "644", recursive: e.isDir });
          },
          disabled: !hasDevice || selectedCount !== 1,
          className: "btn-secondary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3.5 w-3.5" }),
            " 权限"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: addBookmark,
          disabled: !hasDevice,
          className: "btn-secondary",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkPlus, { className: "h-3.5 w-3.5" }),
            " 书签"
          ]
        }
      )
    ] }),
    transfer && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-md border border-blue-800/50 bg-blue-950/20 p-3 text-sm", children: [
      transfer.direction === "push" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 text-blue-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 text-blue-400" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-blue-300", children: [
        transfer.direction === "push" ? "上传" : "下载",
        ": ",
        transfer.remote.split("/").pop()
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-1.5 min-w-[120px] flex-1 overflow-hidden rounded-full bg-zinc-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "absolute inset-y-0 left-0 rounded-full bg-blue-500 transition-all",
          style: { width: `${transfer.percent}%` }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "tabular-nums text-blue-400", children: [
        transfer.percent,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "section-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "h-3.5 w-3.5" }),
        "文件列表 ",
        selectedCount > 0 && `(已选 ${selectedCount} 项)`
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                value: searchQuery,
                onChange: (e) => setSearchQuery(e.target.value),
                placeholder: "搜索当前目录...",
                className: "w-full rounded-md border border-zinc-800 bg-zinc-900/50 py-1.5 pl-8 pr-3 text-xs text-zinc-200 placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "select",
            {
              value: sortKey,
              onChange: (e) => setSortKey(e.target.value),
              className: "rounded-md border border-zinc-800 bg-zinc-900/50 px-2 py-1.5 text-xs text-zinc-300 focus:border-blue-600 focus:outline-none",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "name", children: "名称" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "size", children: "大小" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "mtime", children: "修改时间" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ext", children: "类型" })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setSortDir((d) => d === "asc" ? "desc" : "asc"),
              className: "rounded-md border border-zinc-800 px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
              title: sortDir === "asc" ? "升序" : "降序",
              children: sortDir === "asc" ? "↑ 升序" : "↓ 降序"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1 text-xs text-zinc-500", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: dirsFirst,
                onChange: (e) => setDirsFirst(e.target.checked),
                className: "h-3 w-3"
              }
            ),
            "目录优先"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-1 h-4 w-px bg-zinc-800" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setViewMode("list"),
              className: cn(
                "rounded-md border px-2 py-1.5 text-xs",
                viewMode === "list" ? "border-blue-600 bg-blue-950/40 text-blue-300" : "border-zinc-800 text-zinc-400 hover:bg-zinc-900"
              ),
              title: "列表视图",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setViewMode("grid"),
              className: cn(
                "rounded-md border px-2 py-1.5 text-xs",
                viewMode === "grid" ? "border-blue-600 bg-blue-950/40 text-blue-300" : "border-zinc-800 text-zinc-400 hover:bg-zinc-900"
              ),
              title: "网格视图",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutGrid, { className: "h-3.5 w-3.5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-1 h-4 w-px bg-zinc-800" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1 text-xs text-zinc-500", title: "旧 Android 不支持 ls -lA", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: compatMode,
                onChange: (e) => setCompatMode(e.target.checked),
                className: "h-3 w-3"
              }
            ),
            "兼容模式"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-1 text-xs text-zinc-500", title: "推送时保留修改时间", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: keepMtime,
                onChange: (e) => setKeepMtime(e.target.checked),
                className: "h-3 w-3"
              }
            ),
            "保留 mtime"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900/50 px-2 py-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "h-3.5 w-3.5 shrink-0 text-zinc-500" }),
          editingAddress ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              autoFocus: true,
              value: addressValue,
              onChange: (e) => setAddressValue(e.target.value),
              onBlur: () => {
                setEditingAddress(false);
                if (addressValue.trim() && addressValue !== cwd) {
                  void loadDir(addressValue.trim());
                } else {
                  setAddressValue(cwd);
                }
              },
              onKeyDown: (e) => {
                if (e.key === "Enter") e.target.blur();
                else if (e.key === "Escape") {
                  setAddressValue(cwd);
                  setEditingAddress(false);
                }
              },
              className: "min-w-0 flex-1 bg-transparent px-1 text-xs text-zinc-200 focus:outline-none"
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto",
              onClick: () => setEditingAddress(true),
              children: crumbs.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center", children: [
                i > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3 text-zinc-600" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: (e) => {
                      e.stopPropagation();
                      void loadDir(c.path);
                    },
                    className: cn(
                      "rounded px-1.5 py-0.5 text-xs transition-colors hover:bg-zinc-800",
                      i === crumbs.length - 1 ? "font-medium text-blue-300" : "text-zinc-400"
                    ),
                    children: c.name
                  }
                )
              ] }, c.path))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 text-xs text-zinc-500", children: [
            displayEntries.length,
            " 项"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "hidden w-40 shrink-0 space-y-3 sm:block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-zinc-800 bg-zinc-900/30 p-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-1 pb-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-500", children: "快捷访问" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-0.5", children: quickPaths.map((qp) => {
                const Icon2 = QUICK_ICON_MAP[qp.icon] ?? Folder;
                const active = cwd === qp.path;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => void loadDir(qp.path),
                    disabled: !hasDevice,
                    className: cn(
                      "flex items-center gap-2 rounded px-1.5 py-1.5 text-left text-xs transition-colors disabled:opacity-40",
                      active ? "bg-blue-500/10 text-blue-300" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                    ),
                    title: qp.path,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { className: "h-3.5 w-3.5 shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: qp.label })
                    ]
                  },
                  qp.path
                );
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-zinc-800 bg-zinc-900/30 p-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-1 pb-1.5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-zinc-500", children: "书签" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: addBookmark,
                    disabled: !hasDevice,
                    title: "添加当前目录",
                    className: "text-zinc-500 hover:text-blue-400 disabled:opacity-40",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookmarkPlus, { className: "h-3 w-3" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-0.5", children: bookmarks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-1 py-1.5 text-xs text-zinc-600", children: "暂无书签" }) : bookmarks.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group flex items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: () => void loadDir(b.path),
                    disabled: !hasDevice,
                    className: cn(
                      "flex flex-1 items-center gap-2 rounded px-1.5 py-1.5 text-left text-xs transition-colors disabled:opacity-40",
                      cwd === b.path ? "bg-blue-500/10 text-blue-300" : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
                    ),
                    title: b.path,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Bookmark, { className: "h-3.5 w-3.5 shrink-0" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: b.label })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => removeBookmark(b.path),
                    className: "ml-0.5 hidden shrink-0 text-zinc-600 hover:text-red-400 group-hover:block",
                    title: "移除书签",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
                  }
                )
              ] }, b.path)) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "min-w-0 flex-1",
              onContextMenu: (e) => onContextMenu(e, null),
              children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-10 text-zinc-500", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "读取目录中..." })
              ] }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2 py-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-8 w-8 text-red-400" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-red-400", children: error }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => void loadDir(cwd, false),
                    className: "mt-2 rounded-md border border-zinc-800 px-3 py-1 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
                    children: "重试"
                  }
                )
              ] }) : displayEntries.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2 py-10 text-zinc-500", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "h-8 w-8 text-zinc-600" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: searchQuery ? "无匹配结果" : "空目录" })
              ] }) : viewMode === "list" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[calc(100vh-420px)] min-h-[280px] overflow-y-auto rounded-md border border-zinc-800", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-10 grid grid-cols-[24px_1fr_90px_140px_90px] gap-2 border-b border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 backdrop-blur", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "名称" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "大小" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "修改时间" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "权限" })
                ] }),
                displayEntries.map((entry) => {
                  const isSel = selected.has(entry.path);
                  const Icon2 = entry.isDir ? Folder : entry.isLink ? Link2 : File;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      onClick: (e) => {
                        if (e.ctrlKey || e.metaKey) toggleSelect(entry.path);
                        else if (e.shiftKey) rangeSelect(entry.path);
                        else selectOnly(entry.path);
                      },
                      onDoubleClick: () => openEntry(entry),
                      onContextMenu: (e) => onContextMenu(e, entry),
                      className: cn(
                        "grid cursor-pointer grid-cols-[24px_1fr_90px_140px_90px] items-center gap-2 border-b border-zinc-800/60 px-3 py-2 text-xs transition-colors last:border-0",
                        isSel ? "bg-blue-500/10 text-blue-100" : "text-zinc-300 hover:bg-zinc-900/40"
                      ),
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: isSel,
                            onChange: () => toggleSelect(entry.path),
                            onClick: (e) => e.stopPropagation(),
                            className: "h-3 w-3"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex min-w-0 items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Icon2,
                            {
                              className: cn(
                                "h-4 w-4 shrink-0",
                                entry.isDir ? "text-blue-400" : entry.isLink ? "text-purple-400" : "text-zinc-500"
                              )
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: entry.name }),
                          entry.ext === "apk" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded bg-green-900/40 px-1 py-0.5 text-xs text-green-400", children: "APK" })
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right tabular-nums text-zinc-500", children: entry.isDir ? "-" : formatBytes(entry.size) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-500", children: entry.mtime }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate font-mono text-xs text-zinc-600", children: entry.perms })
                      ]
                    },
                    entry.path
                  );
                })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid max-h-[calc(100vh-420px)] min-h-[280px] grid-cols-3 gap-2 overflow-y-auto sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8", children: displayEntries.map((entry) => {
                const isSel = selected.has(entry.path);
                const Icon2 = entry.isDir ? Folder : entry.isLink ? Link2 : File;
                return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    onClick: (e) => {
                      if (e.ctrlKey || e.metaKey) toggleSelect(entry.path);
                      else if (e.shiftKey) rangeSelect(entry.path);
                      else selectOnly(entry.path);
                    },
                    onDoubleClick: () => openEntry(entry),
                    onContextMenu: (e) => onContextMenu(e, entry),
                    className: cn(
                      "flex cursor-pointer flex-col items-center gap-1 rounded-md border p-2 text-center transition-colors",
                      isSel ? "border-blue-600 bg-blue-950/40" : "border-zinc-800 hover:bg-zinc-900/40"
                    ),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        Icon2,
                        {
                          className: cn(
                            "h-8 w-8",
                            entry.isDir ? "text-blue-400" : entry.isLink ? "text-purple-400" : "text-zinc-500"
                          )
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-clamp-2 w-full text-xs text-zinc-300", title: entry.name, children: entry.name }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-zinc-600", children: entry.isDir ? "" : formatBytes(entry.size) })
                    ]
                  },
                  entry.path
                );
              }) })
            }
          )
        ] }),
        disk && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-3 border-t border-zinc-800 pt-3 text-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "h-3.5 w-3.5 shrink-0 text-zinc-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-zinc-400", children: disk.path }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-1.5 min-w-[120px] flex-1 overflow-hidden rounded-full bg-zinc-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "absolute inset-y-0 left-0 rounded-full",
                disk.usagePercent > 90 ? "bg-red-500" : "bg-blue-500"
              ),
              style: { width: `${Math.min(disk.usagePercent, 100)}%` }
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 tabular-nums text-zinc-400", children: [
            formatBytes(disk.used),
            " / ",
            formatBytes(disk.total),
            " (",
            disk.usagePercent,
            "%)"
          ] })
        ] })
      ] })
    ] }),
    newFolderOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      ModalDialog$1,
      {
        title: "新建文件夹",
        onClose: () => {
          setNewFolderOpen(false);
          setNewFolderName("");
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              autoFocus: true,
              value: newFolderName,
              onChange: (e) => setNewFolderName(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") void handleNewFolder();
                if (e.key === "Escape") {
                  setNewFolderOpen(false);
                  setNewFolderName("");
                }
              },
              placeholder: "文件夹名称",
              className: "w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  setNewFolderOpen(false);
                  setNewFolderName("");
                },
                className: "rounded-md border border-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
                children: "取消"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleNewFolder,
                disabled: !newFolderName.trim(),
                className: "rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
                children: "创建"
              }
            )
          ] })
        ]
      }
    ),
    newFileOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      ModalDialog$1,
      {
        title: "新建文件",
        wide: true,
        onClose: () => {
          setNewFileOpen(false);
          setNewFileName("");
          setNewFileContent("");
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              autoFocus: true,
              value: newFileName,
              onChange: (e) => setNewFileName(e.target.value),
              placeholder: "文件名(如 note.txt)",
              className: "w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: newFileContent,
              onChange: (e) => setNewFileContent(e.target.value),
              placeholder: "文件内容(可选)",
              rows: 8,
              className: "mt-3 w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 font-mono text-xs text-zinc-200 placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  setNewFileOpen(false);
                  setNewFileName("");
                  setNewFileContent("");
                },
                className: "rounded-md border border-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
                children: "取消"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleNewFile,
                disabled: !newFileName.trim(),
                className: "rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
                children: "创建"
              }
            )
          ] })
        ]
      }
    ),
    renameTarget && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      ModalDialog$1,
      {
        title: `重命名: ${renameTarget.entry.name}`,
        onClose: () => setRenameTarget(null),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              autoFocus: true,
              value: renameTarget.newName,
              onChange: (e) => setRenameTarget({ ...renameTarget, newName: e.target.value }),
              onKeyDown: (e) => {
                if (e.key === "Enter") void handleRename();
                if (e.key === "Escape") setRenameTarget(null);
              },
              className: "w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-200 focus:border-blue-600 focus:outline-none"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setRenameTarget(null),
                className: "rounded-md border border-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
                children: "取消"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleRename,
                disabled: !renameTarget.newName.trim() || renameTarget.newName.trim() === renameTarget.entry.name,
                className: "rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
                children: "重命名"
              }
            )
          ] })
        ]
      }
    ),
    editorTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModalDialog$1,
      {
        title: `编辑: ${editorTarget.entry.name}${editorTarget.dirty ? " *" : ""}`,
        wide: true,
        onClose: () => {
          if (editorTarget.dirty && !window.confirm("有未保存的修改,确定关闭?")) return;
          setEditorTarget(null);
        },
        children: editorTarget.loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-8 text-sm text-zinc-500", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
          " 读取中..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "textarea",
            {
              value: editorTarget.content,
              onChange: (e) => setEditorTarget({ ...editorTarget, content: e.target.value, dirty: true }),
              rows: 16,
              className: "w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 font-mono text-xs text-zinc-200 focus:border-blue-600 focus:outline-none"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-zinc-600", children: [
              editorTarget.content.length,
              " 字符"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setEditorTarget(null),
                  className: "rounded-md border border-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
                  children: "关闭"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: handleSaveText,
                  disabled: !editorTarget.dirty,
                  className: "rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
                  children: "保存"
                }
              )
            ] })
          ] })
        ] })
      }
    ),
    chmodTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModalDialog$1,
      {
        title: `修改权限: ${chmodTarget.entry.name}`,
        onClose: () => setChmodTarget(null),
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-xs text-zinc-400", children: "权限模式(八进制,如 644 / 755 / 600)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                autoFocus: true,
                value: chmodTarget.mode,
                onChange: (e) => setChmodTarget({
                  ...chmodTarget,
                  mode: e.target.value.replace(/[^0-7]/g, "").slice(0, 4)
                }),
                onKeyDown: (e) => {
                  if (e.key === "Enter") void handleChmod();
                  if (e.key === "Escape") setChmodTarget(null);
                },
                placeholder: "644",
                className: "w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 font-mono text-sm text-zinc-200 placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
              }
            )
          ] }),
          chmodTarget.entry.isDir && /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-xs text-zinc-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "checkbox",
                checked: chmodTarget.recursive,
                onChange: (e) => setChmodTarget({ ...chmodTarget, recursive: e.target.checked }),
                className: "h-3 w-3"
              }
            ),
            "递归应用到子文件"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setChmodTarget(null),
                className: "rounded-md border border-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
                children: "取消"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: handleChmod,
                disabled: !/^[0-7]{3,4}$/.test(chmodTarget.mode),
                className: "rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
                children: "应用"
              }
            )
          ] })
        ] })
      }
    ),
    ctxMenu && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "fixed z-50 min-w-[160px] rounded-md border border-zinc-800 bg-zinc-900 py-1 shadow-xl",
        style: {
          left: Math.min(ctxMenu.x, window.innerWidth - 180),
          top: Math.min(ctxMenu.y, window.innerHeight - 320)
        },
        onClick: (e) => e.stopPropagation(),
        children: ctxMenu.entry ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CtxItem,
            {
              icon: FolderOpen,
              label: ctxMenu.entry.isDir ? "进入目录" : "打开",
              onClick: () => {
                openEntry(ctxMenu.entry);
                setCtxMenu(null);
              }
            }
          ),
          ctxMenu.entry.ext === "apk" && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CtxItem,
            {
              icon: Package,
              label: "安装此 APK",
              onClick: () => {
                void handleInstallApk(ctxMenu.entry);
                setCtxMenu(null);
              }
            }
          ),
          !ctxMenu.entry.isDir && isTextFile(ctxMenu.entry) && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CtxItem,
            {
              icon: Pencil,
              label: "编辑文本",
              onClick: () => {
                void handleEditText(ctxMenu.entry);
                setCtxMenu(null);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CtxItem,
            {
              icon: Download,
              label: "下载到电脑",
              onClick: () => {
                void handleDownload(ctxMenu.entry);
                setCtxMenu(null);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CtxItem,
            {
              icon: Pencil,
              label: "重命名 (F2)",
              onClick: () => {
                setRenameTarget({ entry: ctxMenu.entry, newName: ctxMenu.entry.name });
                setCtxMenu(null);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CtxItem,
            {
              icon: Lock,
              label: "修改权限",
              onClick: () => {
                setChmodTarget({
                  entry: ctxMenu.entry,
                  mode: "644",
                  recursive: ctxMenu.entry.isDir
                });
                setCtxMenu(null);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-1 h-px bg-zinc-800" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CtxItem,
            {
              icon: Trash2,
              label: "删除 (Delete)",
              danger: true,
              onClick: () => {
                void handleDelete(ctxMenu.entry);
                setCtxMenu(null);
              }
            }
          )
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CtxItem,
            {
              icon: FolderPlus,
              label: "新建文件夹",
              onClick: () => {
                setNewFolderOpen(true);
                setCtxMenu(null);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CtxItem,
            {
              icon: FilePlus,
              label: "新建文件",
              onClick: () => {
                setNewFileOpen(true);
                setCtxMenu(null);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CtxItem,
            {
              icon: Upload,
              label: "上传文件",
              onClick: () => {
                void handleUpload();
                setCtxMenu(null);
              }
            }
          ),
          clipboard && /* @__PURE__ */ jsxRuntimeExports.jsx(
            CtxItem,
            {
              icon: ClipboardPaste,
              label: `粘贴 ${clipboard.paths.length} 项`,
              onClick: () => {
                void handlePaste();
                setCtxMenu(null);
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "my-1 h-px bg-zinc-800" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            CtxItem,
            {
              icon: RefreshCw,
              label: "刷新",
              onClick: () => {
                void loadDir(cwd, false);
                setCtxMenu(null);
              }
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ApkPreviewDialog,
      {
        apkPath: localApkPreview,
        onConfirm: (path) => void handleConfirmLocalInstall(path),
        onClose: () => setLocalApkPreview(null)
      }
    )
  ] });
}
function joinPath(base, name) {
  if (base.endsWith("/")) return base + name;
  return base + "/" + name;
}
function CtxItem({
  icon: Icon2,
  label,
  onClick,
  danger
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      onClick,
      className: cn(
        "flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors",
        danger ? "text-red-400 hover:bg-red-950/30" : "text-zinc-300 hover:bg-zinc-800 hover:text-blue-300"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { className: "h-3.5 w-3.5" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label })
      ]
    }
  );
}
function ModalDialog$1({
  title,
  onClose,
  children,
  wide
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-2xl",
        wide ? "w-[600px]" : "w-[360px]"
      ),
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "flex items-center gap-2 text-sm font-semibold text-zinc-200", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onClose,
              className: "rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
            }
          )
        ] }),
        children
      ]
    }
  ) });
}
const CRITICAL_PARTITIONS = [
  "boot",
  "system",
  "modem",
  "recovery",
  "xbl",
  "sbl",
  "aboot",
  "tz",
  "rpm",
  "hyp",
  "modemst1",
  "modemst2",
  "fsg",
  "fsc",
  "ssd",
  "DDR",
  "pad"
];
function EdlPartitions() {
  const [loaders, setLoaders] = reactExports.useState([]);
  const [selectedLoader, setSelectedLoader] = reactExports.useState("");
  const [partitions, setPartitions] = reactExports.useState([]);
  const [loadingPartitions, setLoadingPartitions] = reactExports.useState(false);
  const [inEdl, setInEdl] = reactExports.useState(false);
  const [edlPort, setEdlPort] = reactExports.useState();
  const [search, setSearch] = reactExports.useState("");
  const [executing, setExecuting] = reactExports.useState(false);
  const [progressMsg, setProgressMsg] = reactExports.useState(null);
  const [transferProgress, setTransferProgress] = reactExports.useState(null);
  const [result, setResult] = reactExports.useState(null);
  const [eraseTarget, setEraseTarget] = reactExports.useState(null);
  const [eraseConfirmInput, setEraseConfirmInput] = reactExports.useState("");
  const [restoreTarget, setRestoreTarget] = reactExports.useState(null);
  const [restoreBackupBefore, setRestoreBackupBefore] = reactExports.useState(true);
  const [restoreVerifyAfter, setRestoreVerifyAfter] = reactExports.useState(false);
  const [restoreSelectedFile, setRestoreSelectedFile] = reactExports.useState(null);
  const [history, setHistory] = reactExports.useState([]);
  const [historyExpanded, setHistoryExpanded] = reactExports.useState(false);
  const loadLoaders = reactExports.useCallback(async () => {
    const r2 = await api.edlPartition.listLoaders();
    if (r2.success && r2.loaders.length > 0) {
      setLoaders(r2.loaders);
      if (!selectedLoader) {
        setSelectedLoader(r2.loaders[0].path);
      }
    }
  }, [selectedLoader]);
  const loadPartitions = reactExports.useCallback(async (loader) => {
    if (!loader) {
      setPartitions([]);
      return;
    }
    setLoadingPartitions(true);
    setResult(null);
    try {
      const r2 = await api.edlPartition.printGpt(loader);
      if (r2.success) {
        setPartitions(r2.partitions);
      } else {
        setPartitions([]);
        setResult({ success: false, message: r2.error ?? "读取 GPT 失败" });
      }
    } finally {
      setLoadingPartitions(false);
    }
  }, []);
  const checkDevice = reactExports.useCallback(async () => {
    const r2 = await api.edlPartition.checkEdlDevice();
    setInEdl(r2.inEdl);
    setEdlPort(r2.port);
  }, []);
  const refreshHistory = reactExports.useCallback(async () => {
    const r2 = await api.edlPartition.getHistory();
    if (r2.success) setHistory(r2.history);
  }, []);
  reactExports.useEffect(() => {
    void loadLoaders();
    void checkDevice();
    void refreshHistory();
    const unsub = api.device.onChange(() => {
      void checkDevice();
    });
    return unsub;
  }, [loadLoaders, checkDevice, refreshHistory]);
  reactExports.useEffect(() => {
    const unsub1 = api.edlPartition.onProgress((data) => {
      setProgressMsg(data.msg);
    });
    const unsub2 = api.edlPartition.onTransferProgress((p2) => {
      setTransferProgress(p2);
      if (p2.percent >= 100) {
        window.setTimeout(() => setTransferProgress(null), 800);
      }
    });
    return () => {
      unsub1();
      unsub2();
    };
  }, []);
  const handleBackup = async (p2) => {
    if (!inEdl) {
      setResult({ success: false, message: "需要设备处于 9008 (EDL) 模式" });
      return;
    }
    const picked = await api.system.pickFile({ kind: "folder" });
    if (!picked || Array.isArray(picked)) return;
    const outputFile = `${picked.replace(/[\\/]$/, "")}/${p2.label}.img`;
    setExecuting(true);
    setResult(null);
    setProgressMsg("开始备份...");
    setTransferProgress(null);
    try {
      const r2 = await api.edlPartition.backupPartition({
        loader: selectedLoader,
        label: p2.label,
        outputFile
      });
      setResult({
        success: r2.success,
        message: r2.success ? `备份成功: ${outputFile}` : `备份失败: ${r2.error}`
      });
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setExecuting(false);
      setProgressMsg(null);
      setTransferProgress(null);
      void refreshHistory();
    }
  };
  const handleSelectRestoreFile = async () => {
    if (!restoreTarget) return;
    const picked = await api.system.pickFile({
      kind: "open",
      filter: `分区镜像|*.img;所有文件|*.*`
    });
    if (!picked) return;
    const file = Array.isArray(picked) ? picked[0] : picked;
    setRestoreSelectedFile(file);
  };
  const handleRestore = async () => {
    if (!restoreTarget || !restoreSelectedFile) return;
    let backupOutputDir;
    if (restoreBackupBefore) {
      const picked = await api.system.pickFile({ kind: "folder" });
      if (!picked || Array.isArray(picked)) return;
      backupOutputDir = picked.replace(/[\\/]$/, "");
    }
    setExecuting(true);
    setResult(null);
    setProgressMsg("开始恢复...");
    setTransferProgress(null);
    try {
      const r2 = await api.edlPartition.restorePartition({
        loader: selectedLoader,
        label: restoreTarget.label,
        inputFile: restoreSelectedFile,
        backupBeforeRestore: restoreBackupBefore,
        backupOutputDir,
        verifyAfterRestore: restoreVerifyAfter
      });
      let message = r2.success ? `恢复成功: ${restoreTarget.label}` : `恢复失败: ${r2.error}`;
      if (r2.backupPath) {
        message += `(原数据已备份: ${r2.backupPath})`;
      }
      setResult({ success: r2.success, message });
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setExecuting(false);
      setProgressMsg(null);
      setTransferProgress(null);
      setRestoreTarget(null);
      setRestoreSelectedFile(null);
      void refreshHistory();
    }
  };
  const handleErase = async () => {
    if (!eraseTarget) return;
    const isCritical2 = CRITICAL_PARTITIONS.includes(eraseTarget.label);
    if (isCritical2 && eraseConfirmInput !== eraseTarget.label) {
      return;
    }
    setExecuting(true);
    setResult(null);
    setProgressMsg("开始擦除...");
    setTransferProgress(null);
    try {
      const r2 = await api.edlPartition.erasePartition({
        loader: selectedLoader,
        label: eraseTarget.label
      });
      setResult({
        success: r2.success,
        message: r2.success ? `擦除成功: ${eraseTarget.label}` : `擦除失败: ${r2.error}`
      });
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setExecuting(false);
      setProgressMsg(null);
      setTransferProgress(null);
      setEraseTarget(null);
      setEraseConfirmInput("");
      void refreshHistory();
    }
  };
  const handleReset = async () => {
    if (!inEdl) {
      setResult({ success: false, message: "需要设备处于 9008 (EDL) 模式" });
      return;
    }
    setExecuting(true);
    setResult(null);
    setProgressMsg("正在重启...");
    try {
      const r2 = await api.edlPartition.resetDevice(selectedLoader);
      setResult({
        success: r2.success,
        message: r2.success ? "重启指令已发送,设备将重启回系统" : `重启失败: ${r2.error}`
      });
    } catch (e) {
      setResult({ success: false, message: e.message });
    } finally {
      setExecuting(false);
      setProgressMsg(null);
      void refreshHistory();
    }
  };
  const filtered = partitions.filter(
    (p2) => p2.label.toLowerCase().includes(search.toLowerCase())
  );
  const totalSize = partitions.reduce((sum, p2) => sum + p2.sizeBytes, 0);
  const isCritical = (label) => CRITICAL_PARTITIONS.includes(label);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "page-title", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "title-icon" }),
          "EDL 分区管理"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-desc", children: "9008 模式下实时读取 GPT、备份/恢复/擦除分区(基于 edl-ng)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: cn(
              "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs",
              inEdl ? "border-green-700/50 bg-green-950/20 text-green-300" : "border-zinc-800 bg-zinc-900/50 text-zinc-500"
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("h-1.5 w-1.5 rounded-full", inEdl ? "bg-green-500" : "bg-zinc-600") }),
              inEdl ? `9008 已连接${edlPort ? ` (${edlPort})` : ""}` : "未检测到 9008"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: checkDevice,
            className: "flex items-center gap-1.5 rounded-md border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3 w-3" }),
              " 刷新"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-md border border-amber-700/40 bg-amber-900/10 p-3 text-xs text-amber-300", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "h-4 w-4 shrink-0" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "恢复/擦除操作有变砖风险。恢复默认会先备份原分区,关键分区擦除需输入分区名确认。edl-ng 对老芯片(MSM8909W)支持未经验证,只读操作安全,写操作需谨慎。" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "section-title", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Cpu, { className: "h-3.5 w-3.5" }),
        "设备 & Loader"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: selectedLoader,
              onChange: (e) => setSelectedLoader(e.target.value),
              className: "select-field",
              children: loaders.map((l2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: l2.path, children: [
                l2.name,
                "(",
                l2.description,
                ")"
              ] }, l2.path))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => selectedLoader && void loadPartitions(selectedLoader),
              disabled: loadingPartitions || !inEdl || executing,
              className: "btn-primary",
              children: [
                loadingPartitions ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { className: "h-3.5 w-3.5" }),
                "读取分区表(printgpt)"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-zinc-500", children: partitions.length > 0 ? `已读取 ${partitions.length} 个分区` : "未读取" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-xs text-zinc-600", children: "Z10/ND03 选 prog_firehose_ddr.elf;Z2-Z6 非 V3 选 msm8909w.mbn;V3 机型(Z6+/Z7+)选 msm8937.mbn" })
      ] })
    ] }),
    result && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "flex items-start gap-2 rounded-md border p-3 text-sm",
          result.success ? "alert-ok-color" : "alert-err-color"
        ),
        children: [
          result.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-all", children: result.message })
        ]
      }
    ),
    (executing || transferProgress) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      executing && progressMsg && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-md border border-blue-800/50 bg-blue-950/20 p-3 text-sm text-blue-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "break-all", children: progressMsg })
      ] }),
      transferProgress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-md border border-blue-800/50 bg-blue-950/20 p-3 text-sm text-blue-300", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0", children: [
          transferProgress.operation,
          ":"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 font-medium", children: [
          transferProgress.percent.toFixed(1),
          "%"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 text-blue-400/70", children: [
          transferProgress.transferredMiB.toFixed(2),
          " / ",
          transferProgress.totalMiB.toFixed(2),
          " MiB"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 text-blue-400/70", children: [
          "[",
          transferProgress.speed,
          "]"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative h-1.5 min-w-[80px] flex-1 overflow-hidden rounded-full bg-zinc-800", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "absolute inset-y-0 left-0 rounded-full bg-blue-500 transition-all",
            style: { width: `${transferProgress.percent}%` }
          }
        ) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-xs", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: search,
              onChange: (e) => setSearch(e.target.value),
              placeholder: "搜索分区名...",
              className: "w-full rounded-md border border-zinc-800 bg-zinc-900/50 py-1.5 pl-8 pr-3 text-xs text-zinc-200 placeholder-zinc-500 focus:border-blue-600 focus:outline-none"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-zinc-500", children: [
          "共 ",
          filtered.length,
          " 个分区,总大小 ",
          formatBytes(totalSize)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: handleReset,
            disabled: !inEdl || executing,
            className: "ml-auto flex items-center gap-1.5 rounded-md border border-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 disabled:opacity-50",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "h-3.5 w-3.5" }),
              " 重启设备"
            ]
          }
        )
      ] }),
      loadingPartitions ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-10 text-zinc-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "正在读取 GPT 分区表..." })
      ] }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center gap-2 py-10 text-zinc-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(HardDrive, { className: "h-8 w-8 text-zinc-600" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: partitions.length === 0 ? '点击上方"读取分区表"获取分区列表' : "无匹配分区" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-h-[calc(100vh-520px)] min-h-[280px] overflow-y-auto rounded-lg border border-zinc-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "sticky top-0 z-10 grid grid-cols-[1fr_100px_140px_80px_180px] gap-2 border-b border-zinc-800 bg-zinc-900/80 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 backdrop-blur", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "分区名" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "大小" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "LBA 范围" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right", children: "LUN" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-center", children: "操作" })
        ] }),
        filtered.map((p2) => {
          const critical = isCritical(p2.label);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "grid grid-cols-[1fr_100px_140px_80px_180px] items-center gap-2 border-b border-zinc-800/60 px-3 py-2 text-xs last:border-0 hover:bg-zinc-900/40",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    HardDrive,
                    {
                      className: cn(
                        "h-3.5 w-3.5 shrink-0",
                        critical ? "text-amber-400" : "text-zinc-500"
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-zinc-300", children: p2.label }),
                  critical && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded bg-amber-900/40 px-1 py-0.5 text-xs text-amber-400", children: "关键" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right tabular-nums text-zinc-400", children: formatBytes(p2.sizeBytes) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-zinc-500", children: [
                  p2.firstLba,
                  "-",
                  p2.lastLba
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-right font-mono tabular-nums text-zinc-500", children: p2.lun }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center justify-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ActionButton,
                    {
                      icon: Download,
                      title: "备份",
                      disabled: !inEdl || executing,
                      onClick: () => void handleBackup(p2),
                      variant: "default"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ActionButton,
                    {
                      icon: Upload,
                      title: "恢复",
                      disabled: !inEdl || executing,
                      onClick: () => {
                        setRestoreTarget(p2);
                        setRestoreSelectedFile(null);
                        setRestoreBackupBefore(true);
                        setRestoreVerifyAfter(false);
                      },
                      variant: "default"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    ActionButton,
                    {
                      icon: Trash2,
                      title: critical ? "关键分区,擦除需输入名称确认" : "擦除",
                      disabled: !inEdl || executing,
                      onClick: () => {
                        setEraseTarget(p2);
                        setEraseConfirmInput("");
                      },
                      variant: "danger"
                    }
                  )
                ] })
              ]
            },
            `${p2.label}-${p2.lun}`
          );
        })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setHistoryExpanded(!historyExpanded),
          className: "flex w-full items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/30 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-zinc-500 hover:bg-zinc-900/50",
          children: [
            historyExpanded ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(History, { className: "h-3.5 w-3.5" }),
            "操作历史(",
            history.length,
            ")",
            history.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                onClick: (e) => {
                  e.stopPropagation();
                  void api.edlPartition.clearHistory().then(() => void refreshHistory()).catch(() => {
                  });
                },
                className: "ml-auto rounded px-2 py-0.5 text-zinc-500 hover:bg-zinc-800 hover:text-red-400",
                children: "清空"
              }
            )
          ]
        }
      ),
      historyExpanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 max-h-64 overflow-y-auto rounded-md border border-zinc-800", children: history.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-6 text-center text-xs text-zinc-600", children: "暂无操作记录" }) : history.map((h) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 border-b border-zinc-800/60 px-3 py-2 text-xs last:border-0",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn(
                  "shrink-0 rounded px-1.5 py-0.5 font-medium",
                  h.type === "printgpt" && "bg-cyan-900/40 text-cyan-300",
                  h.type === "backup" && "bg-blue-900/40 text-blue-300",
                  h.type === "restore" && "bg-purple-900/40 text-purple-300",
                  h.type === "erase" && "bg-red-900/40 text-red-300",
                  h.type === "verify" && "bg-green-900/40 text-green-300",
                  h.type === "reset" && "bg-zinc-700/40 text-zinc-300"
                ),
                children: h.type
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 font-mono text-zinc-400", children: h.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 truncate text-zinc-500", children: h.message }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-zinc-600", children: new Date(h.timestamp).toLocaleTimeString() }),
            h.success ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3 w-3 shrink-0 text-green-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3 w-3 shrink-0 text-red-400" })
          ]
        },
        h.id
      )) })
    ] }),
    eraseTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModalDialog,
      {
        title: `擦除分区: ${eraseTarget.label}`,
        onClose: () => {
          setEraseTarget(null);
          setEraseConfirmInput("");
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-red-800/50 bg-red-950/20 p-3 text-sm text-red-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-medium", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4" }),
              "警告:此操作不可逆"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1 text-xs text-red-300/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                "分区名: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold", children: eraseTarget.label })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                "大小: ",
                formatBytes(eraseTarget.sizeBytes)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                "LBA 范围: ",
                eraseTarget.firstLba,
                "-",
                eraseTarget.lastLba
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                "LUN: ",
                eraseTarget.lun
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "擦除方式: edl-ng erase-part(原生 firehose erase)" }),
              isCritical(eraseTarget.label) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 rounded bg-red-900/30 p-2 text-red-400", children: [
                '这是关键分区,擦除后设备可能无法启动!如需继续,请在下方输入分区名 "',
                eraseTarget.label,
                '" 确认。'
              ] })
            ] })
          ] }),
          isCritical(eraseTarget.label) ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-sm text-zinc-400", children: "输入分区名确认(区分大小写):" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                autoFocus: true,
                value: eraseConfirmInput,
                onChange: (e) => setEraseConfirmInput(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter" && eraseConfirmInput === eraseTarget.label) {
                    void handleErase();
                  }
                  if (e.key === "Escape") {
                    setEraseTarget(null);
                    setEraseConfirmInput("");
                  }
                },
                placeholder: eraseTarget.label,
                className: "w-full rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 font-mono text-sm text-zinc-200 focus:border-red-600 focus:outline-none"
              }
            )
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-zinc-400", children: "点击下方按钮确认擦除。" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  setEraseTarget(null);
                  setEraseConfirmInput("");
                },
                className: "rounded-md border border-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
                children: "取消"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => void handleErase(),
                disabled: executing || isCritical(eraseTarget.label) && eraseConfirmInput !== eraseTarget.label,
                className: "rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50",
                children: executing ? "擦除中..." : "擦除"
              }
            )
          ] })
        ] })
      }
    ),
    restoreTarget && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ModalDialog,
      {
        title: `恢复分区: ${restoreTarget.label}`,
        wide: true,
        onClose: () => {
          setRestoreTarget(null);
          setRestoreSelectedFile(null);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-md border border-zinc-800 bg-zinc-900/30 p-3 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 font-medium text-zinc-300", children: "目标分区信息(实时 GPT)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-2 text-zinc-500", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                "名称: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-zinc-300", children: restoreTarget.label })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                "大小: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-zinc-300", children: formatBytes(restoreTarget.sizeBytes) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                "LBA: ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-zinc-300", children: [
                  restoreTarget.firstLba,
                  "-",
                  restoreTarget.lastLba
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                "LUN: ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-zinc-300", children: restoreTarget.lun })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1 block text-sm text-zinc-400", children: "镜像文件" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  onClick: () => void handleSelectRestoreFile(),
                  disabled: executing,
                  className: "btn-secondary",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3.5 w-3.5" }),
                    " 选择文件"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 truncate text-xs text-zinc-500", children: restoreSelectedFile ?? "未选择" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 rounded-md border border-zinc-800 bg-zinc-900/30 p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex items-center gap-1.5 text-xs font-medium text-zinc-300", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3.5 w-3.5 text-blue-400" }),
              "安全选项"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-2 text-sm text-zinc-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: restoreBackupBefore,
                  onChange: (e) => setRestoreBackupBefore(e.target.checked),
                  className: "mt-0.5 h-3.5 w-3.5"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "恢复前先备份当前分区(推荐)",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs text-zinc-600", children: "恢复失败时可用备份还原,需选择备份目录" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-start gap-2 text-sm text-zinc-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: restoreVerifyAfter,
                  onChange: (e) => setRestoreVerifyAfter(e.target.checked),
                  className: "mt-0.5 h-3.5 w-3.5"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "恢复后读回校验(耗时)",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block text-xs text-zinc-600", children: "逐字节比对读回数据与镜像,确保写入正确" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => {
                  setRestoreTarget(null);
                  setRestoreSelectedFile(null);
                },
                className: "rounded-md border border-zinc-800 px-3 py-1.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200",
                children: "取消"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => void handleRestore(),
                disabled: executing || !restoreSelectedFile,
                className: "rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
                children: executing ? "恢复中..." : "开始恢复"
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
function ActionButton({
  icon: Icon2,
  title,
  disabled,
  onClick,
  variant = "default"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      title,
      onClick,
      disabled,
      className: cn(
        "flex h-7 w-7 items-center justify-center rounded transition-colors disabled:cursor-not-allowed disabled:opacity-30",
        variant === "danger" ? "text-red-400 hover:bg-red-950/40" : "text-zinc-400 hover:bg-zinc-800 hover:text-blue-300"
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon2, { className: "h-3.5 w-3.5" })
    }
  );
}
function ModalDialog({
  title,
  onClose,
  children,
  wide
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "max-h-[90vh] overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-2xl",
        wide ? "w-[560px]" : "w-[420px]"
      ),
      onClick: (e) => e.stopPropagation(),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "flex items-center gap-2 text-sm font-semibold text-zinc-200", children: title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onClose,
              className: "rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
            }
          )
        ] }),
        children
      ]
    }
  ) });
}
function App() {
  const loadSettings = useSettingsStore((s) => s.load);
  useDevice();
  useLogs();
  reactExports.useEffect(() => {
    loadSettings();
  }, [loadSettings]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Routes, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Home, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/reboot", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Reboot, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/cloud", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Cloud, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/apps", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Apps, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/files", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Files, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/edl-partitions", element: /* @__PURE__ */ jsxRuntimeExports.jsx(EdlPartitions, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/tools", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Tools, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/magisk", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Magisk, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/backup", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Backup, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/root", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Root, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/settings", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, {}) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Route, { path: "/logs", element: /* @__PURE__ */ jsxRuntimeExports.jsx(Logs, {}) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(EulaModal, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(SplashScreen, {})
  ] });
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
