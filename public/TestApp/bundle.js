/*! For license information please see bundle.js.LICENSE.txt */
var e = {
    626: (e, t, n) => {
      n.d(t, { A: () => i });
      var r = n(601),
        o = n.n(r),
        a = n(314),
        u = n.n(a)()(o());
      u.push([
        e.id,
        ".App {\n  padding: 20px;\n}\n\n.form {\n  max-width: 500px;\n  margin: 0 auto;\n}\n\n.form-group {\n  display: flex;\n  align-items: center;\n  margin-bottom: 15px;\n  text-align: left;\n}\n\n.form-group label {\n  width: 120px;\n  margin-right: 10px;\n}\n\n.form-group input {\n  flex: 1;\n  padding: 8px;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n}\n.form-footer{\n  display: flex;\n  justify-content: center;\n}\n\n.submit-button {\n  margin-top: 20px;\n  margin-left:10px;\n  padding: 10px 20px;\n  background-color: #007bff;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}\n\n.submit-button:hover {\n  background-color: #0056b3;\n}\n.reset-button{\n  margin-top: 20px;\n  padding: 10px 20px;\n  background-color: lightgray;\n  color: black;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n}\n.reset-button:hover {\n  background-color:gray;\n}\n.ml-10{\n  margin-left: 10px;\n}",
        "",
      ]);
      const i = u;
    },
    314: (e) => {
      e.exports = function (e) {
        var t = [];
        return (
          (t.toString = function () {
            return this.map(function (t) {
              var n = "",
                r = void 0 !== t[5];
              return (
                t[4] && (n += "@supports (".concat(t[4], ") {")),
                t[2] && (n += "@media ".concat(t[2], " {")),
                r &&
                  (n += "@layer".concat(
                    t[5].length > 0 ? " ".concat(t[5]) : "",
                    " {"
                  )),
                (n += e(t)),
                r && (n += "}"),
                t[2] && (n += "}"),
                t[4] && (n += "}"),
                n
              );
            }).join("");
          }),
          (t.i = function (e, n, r, o, a) {
            "string" == typeof e && (e = [[null, e, void 0]]);
            var u = {};
            if (r)
              for (var i = 0; i < this.length; i++) {
                var c = this[i][0];
                null != c && (u[c] = !0);
              }
            for (var s = 0; s < e.length; s++) {
              var l = [].concat(e[s]);
              (r && u[l[0]]) ||
                (void 0 !== a &&
                  (void 0 === l[5] ||
                    (l[1] = "@layer"
                      .concat(l[5].length > 0 ? " ".concat(l[5]) : "", " {")
                      .concat(l[1], "}")),
                  (l[5] = a)),
                n &&
                  (l[2]
                    ? ((l[1] = "@media ".concat(l[2], " {").concat(l[1], "}")),
                      (l[2] = n))
                    : (l[2] = n)),
                o &&
                  (l[4]
                    ? ((l[1] = "@supports ("
                        .concat(l[4], ") {")
                        .concat(l[1], "}")),
                      (l[4] = o))
                    : (l[4] = "".concat(o))),
                t.push(l));
            }
          }),
          t
        );
      };
    },
    601: (e) => {
      e.exports = function (e) {
        return e[1];
      };
    },
    869: (e, t) => {
      var n = Symbol.for("react.transitional.element"),
        r = Symbol.for("react.portal"),
        o = Symbol.for("react.fragment"),
        a = Symbol.for("react.strict_mode"),
        u = Symbol.for("react.profiler"),
        i = Symbol.for("react.consumer"),
        c = Symbol.for("react.context"),
        s = Symbol.for("react.forward_ref"),
        l = Symbol.for("react.suspense"),
        f = Symbol.for("react.memo"),
        p = Symbol.for("react.lazy"),
        d = Symbol.iterator,
        m = {
          isMounted: function () {
            return !1;
          },
          enqueueForceUpdate: function () {},
          enqueueReplaceState: function () {},
          enqueueSetState: function () {},
        },
        y = Object.assign,
        h = {};
      function v(e, t, n) {
        (this.props = e),
          (this.context = t),
          (this.refs = h),
          (this.updater = n || m);
      }
      function b() {}
      function g(e, t, n) {
        (this.props = e),
          (this.context = t),
          (this.refs = h),
          (this.updater = n || m);
      }
      (v.prototype.isReactComponent = {}),
        (v.prototype.setState = function (e, t) {
          if ("object" != typeof e && "function" != typeof e && null != e)
            throw Error(
              "takes an object of state variables to update or a function which returns an object of state variables."
            );
          this.updater.enqueueSetState(this, e, t, "setState");
        }),
        (v.prototype.forceUpdate = function (e) {
          this.updater.enqueueForceUpdate(this, e, "forceUpdate");
        }),
        (b.prototype = v.prototype);
      var E = (g.prototype = new b());
      (E.constructor = g), y(E, v.prototype), (E.isPureReactComponent = !0);
      var S = Array.isArray,
        x = { H: null, A: null, T: null, S: null },
        _ = Object.prototype.hasOwnProperty;
      function w(e, t, r, o, a, u) {
        return (
          (r = u.ref),
          {
            $$typeof: n,
            type: e,
            key: t,
            ref: void 0 !== r ? r : null,
            props: u,
          }
        );
      }
      function R(e) {
        return "object" == typeof e && null !== e && e.$$typeof === n;
      }
      var k = /\/+/g;
      function T(e, t) {
        return "object" == typeof e && null !== e && null != e.key
          ? ((n = "" + e.key),
            (r = { "=": "=0", ":": "=2" }),
            "$" +
              n.replace(/[=:]/g, function (e) {
                return r[e];
              }))
          : t.toString(36);
        var n, r;
      }
      function C() {}
      function j(e, t, o, a, u) {
        var i = typeof e;
        ("undefined" !== i && "boolean" !== i) || (e = null);
        var c,
          s,
          l = !1;
        if (null === e) l = !0;
        else
          switch (i) {
            case "bigint":
            case "string":
            case "number":
              l = !0;
              break;
            case "object":
              switch (e.$$typeof) {
                case n:
                case r:
                  l = !0;
                  break;
                case p:
                  return j((l = e._init)(e._payload), t, o, a, u);
              }
          }
        if (l)
          return (
            (u = u(e)),
            (l = "" === a ? "." + T(e, 0) : a),
            S(u)
              ? ((o = ""),
                null != l && (o = l.replace(k, "$&/") + "/"),
                j(u, t, o, "", function (e) {
                  return e;
                }))
              : null != u &&
                (R(u) &&
                  ((c = u),
                  (s =
                    o +
                    (null == u.key || (e && e.key === u.key)
                      ? ""
                      : ("" + u.key).replace(k, "$&/") + "/") +
                    l),
                  (u = w(c.type, s, void 0, 0, 0, c.props))),
                t.push(u)),
            1
          );
        l = 0;
        var f,
          m = "" === a ? "." : a + ":";
        if (S(e))
          for (var y = 0; y < e.length; y++)
            l += j((a = e[y]), t, o, (i = m + T(a, y)), u);
        else if (
          "function" ==
          typeof (y =
            null === (f = e) || "object" != typeof f
              ? null
              : "function" == typeof (f = (d && f[d]) || f["@@iterator"])
              ? f
              : null)
        )
          for (e = y.call(e), y = 0; !(a = e.next()).done; )
            l += j((a = a.value), t, o, (i = m + T(a, y++)), u);
        else if ("object" === i) {
          if ("function" == typeof e.then)
            return j(
              (function (e) {
                switch (e.status) {
                  case "fulfilled":
                    return e.value;
                  case "rejected":
                    throw e.reason;
                  default:
                    switch (
                      ("string" == typeof e.status
                        ? e.then(C, C)
                        : ((e.status = "pending"),
                          e.then(
                            function (t) {
                              "pending" === e.status &&
                                ((e.status = "fulfilled"), (e.value = t));
                            },
                            function (t) {
                              "pending" === e.status &&
                                ((e.status = "rejected"), (e.reason = t));
                            }
                          )),
                      e.status)
                    ) {
                      case "fulfilled":
                        return e.value;
                      case "rejected":
                        throw e.reason;
                    }
                }
                throw e;
              })(e),
              t,
              o,
              a,
              u
            );
          throw (
            ((t = String(e)),
            Error(
              "Objects are not valid as a React child (found: " +
                ("[object Object]" === t
                  ? "object with keys {" + Object.keys(e).join(", ") + "}"
                  : t) +
                "). If you meant to render a collection of children, use an array instead."
            ))
          );
        }
        return l;
      }
      function A(e, t, n) {
        if (null == e) return e;
        var r = [],
          o = 0;
        return (
          j(e, r, "", "", function (e) {
            return t.call(n, e, o++);
          }),
          r
        );
      }
      function H(e) {
        if (-1 === e._status) {
          var t = e._result;
          (t = t()).then(
            function (t) {
              (0 !== e._status && -1 !== e._status) ||
                ((e._status = 1), (e._result = t));
            },
            function (t) {
              (0 !== e._status && -1 !== e._status) ||
                ((e._status = 2), (e._result = t));
            }
          ),
            -1 === e._status && ((e._status = 0), (e._result = t));
        }
        if (1 === e._status) return e._result.default;
        throw e._result;
      }
      var N =
        "function" == typeof reportError
          ? reportError
          : function (e) {
              if (
                "object" == typeof window &&
                "function" == typeof window.ErrorEvent
              ) {
                var t = new window.ErrorEvent("error", {
                  bubbles: !0,
                  cancelable: !0,
                  message:
                    "object" == typeof e &&
                    null !== e &&
                    "string" == typeof e.message
                      ? String(e.message)
                      : String(e),
                  error: e,
                });
                if (!window.dispatchEvent(t)) return;
              } else if (
                "object" == typeof process &&
                "function" == typeof process.emit
              )
                return void process.emit("uncaughtException", e);
              console.error(e);
            };
      function I() {}
      (t.Children = {
        map: A,
        forEach: function (e, t, n) {
          A(
            e,
            function () {
              t.apply(this, arguments);
            },
            n
          );
        },
        count: function (e) {
          var t = 0;
          return (
            A(e, function () {
              t++;
            }),
            t
          );
        },
        toArray: function (e) {
          return (
            A(e, function (e) {
              return e;
            }) || []
          );
        },
        only: function (e) {
          if (!R(e))
            throw Error(
              "React.Children.only expected to receive a single React element child."
            );
          return e;
        },
      }),
        (t.Component = v),
        (t.Fragment = o),
        (t.Profiler = u),
        (t.PureComponent = g),
        (t.StrictMode = a),
        (t.Suspense = l),
        (t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = x),
        (t.act = function () {
          throw Error(
            "act(...) is not supported in production builds of React."
          );
        }),
        (t.cache = function (e) {
          return function () {
            return e.apply(null, arguments);
          };
        }),
        (t.cloneElement = function (e, t, n) {
          if (null == e)
            throw Error(
              "The argument must be a React element, but you passed " + e + "."
            );
          var r = y({}, e.props),
            o = e.key;
          if (null != t)
            for (a in (t.ref, void 0 !== t.key && (o = "" + t.key), t))
              !_.call(t, a) ||
                "key" === a ||
                "__self" === a ||
                "__source" === a ||
                ("ref" === a && void 0 === t.ref) ||
                (r[a] = t[a]);
          var a = arguments.length - 2;
          if (1 === a) r.children = n;
          else if (1 < a) {
            for (var u = Array(a), i = 0; i < a; i++) u[i] = arguments[i + 2];
            r.children = u;
          }
          return w(e.type, o, void 0, 0, 0, r);
        }),
        (t.createContext = function (e) {
          return (
            ((e = {
              $$typeof: c,
              _currentValue: e,
              _currentValue2: e,
              _threadCount: 0,
              Provider: null,
              Consumer: null,
            }).Provider = e),
            (e.Consumer = { $$typeof: i, _context: e }),
            e
          );
        }),
        (t.createElement = function (e, t, n) {
          var r,
            o = {},
            a = null;
          if (null != t)
            for (r in (void 0 !== t.key && (a = "" + t.key), t))
              _.call(t, r) &&
                "key" !== r &&
                "__self" !== r &&
                "__source" !== r &&
                (o[r] = t[r]);
          var u = arguments.length - 2;
          if (1 === u) o.children = n;
          else if (1 < u) {
            for (var i = Array(u), c = 0; c < u; c++) i[c] = arguments[c + 2];
            o.children = i;
          }
          if (e && e.defaultProps)
            for (r in (u = e.defaultProps)) void 0 === o[r] && (o[r] = u[r]);
          return w(e, a, void 0, 0, 0, o);
        }),
        (t.createRef = function () {
          return { current: null };
        }),
        (t.forwardRef = function (e) {
          return { $$typeof: s, render: e };
        }),
        (t.isValidElement = R),
        (t.lazy = function (e) {
          return {
            $$typeof: p,
            _payload: { _status: -1, _result: e },
            _init: H,
          };
        }),
        (t.memo = function (e, t) {
          return { $$typeof: f, type: e, compare: void 0 === t ? null : t };
        }),
        (t.startTransition = function (e) {
          var t = x.T,
            n = {};
          x.T = n;
          try {
            var r = e(),
              o = x.S;
            null !== o && o(n, r),
              "object" == typeof r &&
                null !== r &&
                "function" == typeof r.then &&
                r.then(I, N);
          } catch (e) {
            N(e);
          } finally {
            x.T = t;
          }
        }),
        (t.unstable_useCacheRefresh = function () {
          return x.H.useCacheRefresh();
        }),
        (t.use = function (e) {
          return x.H.use(e);
        }),
        (t.useActionState = function (e, t, n) {
          return x.H.useActionState(e, t, n);
        }),
        (t.useCallback = function (e, t) {
          return x.H.useCallback(e, t);
        }),
        (t.useContext = function (e) {
          return x.H.useContext(e);
        }),
        (t.useDebugValue = function () {}),
        (t.useDeferredValue = function (e, t) {
          return x.H.useDeferredValue(e, t);
        }),
        (t.useEffect = function (e, t) {
          return x.H.useEffect(e, t);
        }),
        (t.useId = function () {
          return x.H.useId();
        }),
        (t.useImperativeHandle = function (e, t, n) {
          return x.H.useImperativeHandle(e, t, n);
        }),
        (t.useInsertionEffect = function (e, t) {
          return x.H.useInsertionEffect(e, t);
        }),
        (t.useLayoutEffect = function (e, t) {
          return x.H.useLayoutEffect(e, t);
        }),
        (t.useMemo = function (e, t) {
          return x.H.useMemo(e, t);
        }),
        (t.useOptimistic = function (e, t) {
          return x.H.useOptimistic(e, t);
        }),
        (t.useReducer = function (e, t, n) {
          return x.H.useReducer(e, t, n);
        }),
        (t.useRef = function (e) {
          return x.H.useRef(e);
        }),
        (t.useState = function (e) {
          return x.H.useState(e);
        }),
        (t.useSyncExternalStore = function (e, t, n) {
          return x.H.useSyncExternalStore(e, t, n);
        }),
        (t.useTransition = function () {
          return x.H.useTransition();
        }),
        (t.version = "19.0.0");
    },
    540: (e, t, n) => {
      e.exports = n(869);
    },
    72: (e) => {
      var t = [];
      function n(e) {
        for (var n = -1, r = 0; r < t.length; r++)
          if (t[r].identifier === e) {
            n = r;
            break;
          }
        return n;
      }
      function r(e, r) {
        for (var a = {}, u = [], i = 0; i < e.length; i++) {
          var c = e[i],
            s = r.base ? c[0] + r.base : c[0],
            l = a[s] || 0,
            f = "".concat(s, " ").concat(l);
          a[s] = l + 1;
          var p = n(f),
            d = {
              css: c[1],
              media: c[2],
              sourceMap: c[3],
              supports: c[4],
              layer: c[5],
            };
          if (-1 !== p) t[p].references++, t[p].updater(d);
          else {
            var m = o(d, r);
            (r.byIndex = i),
              t.splice(i, 0, { identifier: f, updater: m, references: 1 });
          }
          u.push(f);
        }
        return u;
      }
      function o(e, t) {
        var n = t.domAPI(t);
        return (
          n.update(e),
          function (t) {
            if (t) {
              if (
                t.css === e.css &&
                t.media === e.media &&
                t.sourceMap === e.sourceMap &&
                t.supports === e.supports &&
                t.layer === e.layer
              )
                return;
              n.update((e = t));
            } else n.remove();
          }
        );
      }
      e.exports = function (e, o) {
        var a = r((e = e || []), (o = o || {}));
        return function (e) {
          e = e || [];
          for (var u = 0; u < a.length; u++) {
            var i = n(a[u]);
            t[i].references--;
          }
          for (var c = r(e, o), s = 0; s < a.length; s++) {
            var l = n(a[s]);
            0 === t[l].references && (t[l].updater(), t.splice(l, 1));
          }
          a = c;
        };
      };
    },
    659: (e) => {
      var t = {};
      e.exports = function (e, n) {
        var r = (function (e) {
          if (void 0 === t[e]) {
            var n = document.querySelector(e);
            if (
              window.HTMLIFrameElement &&
              n instanceof window.HTMLIFrameElement
            )
              try {
                n = n.contentDocument.head;
              } catch (e) {
                n = null;
              }
            t[e] = n;
          }
          return t[e];
        })(e);
        if (!r)
          throw new Error(
            "Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid."
          );
        r.appendChild(n);
      };
    },
    159: (e) => {
      e.exports = function (e) {
        var t = document.createElement("style");
        return e.setAttributes(t, e.attributes), e.insert(t, e.options), t;
      };
    },
    56: (e, t, n) => {
      e.exports = function (e) {
        var t = n.nc;
        t && e.setAttribute("nonce", t);
      };
    },
    825: (e) => {
      e.exports = function (e) {
        if ("undefined" == typeof document)
          return { update: function () {}, remove: function () {} };
        var t = e.insertStyleElement(e);
        return {
          update: function (n) {
            !(function (e, t, n) {
              var r = "";
              n.supports && (r += "@supports (".concat(n.supports, ") {")),
                n.media && (r += "@media ".concat(n.media, " {"));
              var o = void 0 !== n.layer;
              o &&
                (r += "@layer".concat(
                  n.layer.length > 0 ? " ".concat(n.layer) : "",
                  " {"
                )),
                (r += n.css),
                o && (r += "}"),
                n.media && (r += "}"),
                n.supports && (r += "}");
              var a = n.sourceMap;
              a &&
                "undefined" != typeof btoa &&
                (r +=
                  "\n/*# sourceMappingURL=data:application/json;base64,".concat(
                    btoa(unescape(encodeURIComponent(JSON.stringify(a)))),
                    " */"
                  )),
                t.styleTagTransform(r, e, t.options);
            })(t, e, n);
          },
          remove: function () {
            !(function (e) {
              if (null === e.parentNode) return !1;
              e.parentNode.removeChild(e);
            })(t);
          },
        };
      };
    },
    113: (e) => {
      e.exports = function (e, t) {
        if (t.styleSheet) t.styleSheet.cssText = e;
        else {
          for (; t.firstChild; ) t.removeChild(t.firstChild);
          t.appendChild(document.createTextNode(e));
        }
      };
    },
  },
  t = {};
function n(r) {
  var o = t[r];
  if (void 0 !== o) return o.exports;
  var a = (t[r] = { id: r, exports: {} });
  return e[r](a, a.exports, n), a.exports;
}
(n.n = (e) => {
  var t = e && e.__esModule ? () => e.default : () => e;
  return n.d(t, { a: t }), t;
}),
  (n.d = (e, t) => {
    for (var r in t)
      n.o(t, r) &&
        !n.o(e, r) &&
        Object.defineProperty(e, r, { enumerable: !0, get: t[r] });
  }),
  (n.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
  (n.nc = void 0);
var r = n(540),
  o = n(72),
  a = n.n(o),
  u = n(825),
  i = n.n(u),
  c = n(659),
  s = n.n(c),
  l = n(56),
  f = n.n(l),
  p = n(159),
  d = n.n(p),
  m = n(113),
  y = n.n(m),
  h = n(626),
  v = {};
(v.styleTagTransform = y()),
  (v.setAttributes = f()),
  (v.insert = s().bind(null, "head")),
  (v.domAPI = i()),
  (v.insertStyleElement = d()),
  a()(h.A, v),
  h.A && h.A.locals && h.A.locals,
  (window.TestApp = function (e) {
    return r.createElement(
      "div",
      { className: "App" },
      r.createElement(
        "form",
        {
          onSubmit: (t) => {
            t.preventDefault();
            const n = new FormData(t.target),
              r = {
                target: "samplepage",
                data: {
                  hostURL: n.get("hostURL"),
                  Path: n.get("path"),
                  tokenURL: n.get("tokenURL"),
                  clientID: n.get("clientID"),
                  clientSecret: n.get("clientSecret"),
                  grantType: n.get("grantType"),
                },
              };
            e.onSave
              ? e.onSave(r)
              : console.warn("onSave callback is not available");
          },
          className: "form",
        },
        r.createElement(
          "div",
          { className: "form-group" },
          r.createElement("label", { htmlFor: "hostURL" }, "Host URL:"),
          r.createElement("input", {
            type: "text",
            id: "hostURL",
            name: "hostURL",
            defaultValue: "",
          })
        ),
        r.createElement(
          "div",
          { className: "form-group" },
          r.createElement("label", { htmlFor: "path" }, "Path:"),
          r.createElement("input", {
            type: "text",
            id: "path",
            name: "path",
            defaultValue: "",
          })
        ),
        r.createElement(
          "div",
          { className: "form-group" },
          r.createElement("label", { htmlFor: "tokenURL" }, "Token URL:"),
          r.createElement("input", {
            type: "text",
            id: "tokenURL",
            name: "tokenURL",
            defaultValue: "",
          })
        ),
        r.createElement(
          "div",
          { className: "form-group" },
          r.createElement("label", { htmlFor: "clientID" }, "Client ID:"),
          r.createElement("input", {
            type: "text",
            id: "clientID",
            name: "clientID",
            defaultValue: "",
          })
        ),
        r.createElement(
          "div",
          { className: "form-group" },
          r.createElement(
            "label",
            { htmlFor: "clientSecret" },
            "Client Secret:"
          ),
          r.createElement("input", {
            type: "password",
            id: "clientSecret",
            name: "clientSecret",
            defaultValue: "",
          })
        ),
        r.createElement(
          "div",
          { className: "form-group" },
          r.createElement("label", { htmlFor: "grantType" }, "Grant Type:"),
          r.createElement("input", {
            type: "text",
            id: "grantType",
            name: "grantType",
            defaultValue: "",
          })
        ),
        r.createElement(
          "div",
          { className: "form-footer" },
          r.createElement(
            "button",
            { type: "reset", className: "reset-button" },
            "Clear"
          ),
          r.createElement(
            "button",
            { type: "submit", className: "submit-button ml-10" },
            "Save"
          )
        )
      )
    );
  });
