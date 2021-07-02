! function t(e, n, i) {
    function o(r, a) {
        if (!n[r]) {
            if (!e[r]) {
                var c = "function" == typeof require && require;
                if (!a && c) return c(r, !0);
                if (s) return s(r, !0);
                throw new Error("Cannot find module '" + r + "'")
            }
            var u = n[r] = {
                exports: {}
            };
            e[r][0].call(u.exports, function(t) {
                var n = e[r][1][t];
                return o(n ? n : t)
            }, u, u.exports, t, e, n, i)
        }
        return n[r].exports
    }
    for (var s = "function" == typeof require && require, r = 0; r < i.length; r++) o(i[r]);
    return o
}({
    1: [function(t, e, n) {
        "function" == typeof Object.create ? e.exports = function(t, e) {
            t.super_ = e, t.prototype = Object.create(e.prototype, {
                constructor: {
                    value: t,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            })
        } : e.exports = function(t, e) {
            t.super_ = e;
            var n = function() {};
            n.prototype = e.prototype, t.prototype = new n, t.prototype.constructor = t
        }
    }, {}],
    2: [function(t, e, n) {
        function i() {}
        var o = e.exports = {};
        o.nextTick = function() {
            var t = "undefined" != typeof window && window.setImmediate,
                e = "undefined" != typeof window && window.postMessage && window.addEventListener;
            if (t) return function(t) {
                return window.setImmediate(t)
            };
            if (e) {
                var n = [];
                return window.addEventListener("message", function(t) {
                    var e = t.source;
                    if ((e === window || null === e) && "process-tick" === t.data && (t.stopPropagation(), n.length > 0)) {
                        var i = n.shift();
                        i()
                    }
                }, !0),
                    function(t) {
                        n.push(t), window.postMessage("process-tick", "*")
                    }
            }
            return function(t) {
                setTimeout(t, 0)
            }
        }(), o.title = "browser", o.browser = !0, o.env = {}, o.argv = [], o.on = i, o.addListener = i, o.once = i, o.off = i, o.removeListener = i, o.removeAllListeners = i, o.emit = i, o.binding = function(t) {
            throw new Error("process.binding is not supported")
        }, o.cwd = function() {
            return "/"
        }, o.chdir = function(t) {
            throw new Error("process.chdir is not supported")
        }
    }, {}],
    3: [function(t, e, n) {
        e.exports = function(t) {
            return t && "object" == typeof t && "function" == typeof t.copy && "function" == typeof t.fill && "function" == typeof t.readUInt8
        }
    }, {}],
    4: [function(t, e, n) {
        (function(e, i) {
            function o(t, e) {
                var i = {
                    seen: [],
                    stylize: r
                };
                return arguments.length >= 3 && (i.depth = arguments[2]), arguments.length >= 4 && (i.colors = arguments[3]), g(e) ? i.showHidden = e : e && n._extend(i, e), k(i.showHidden) && (i.showHidden = !1), k(i.depth) && (i.depth = 2), k(i.colors) && (i.colors = !1), k(i.customInspect) && (i.customInspect = !0), i.colors && (i.stylize = s), c(i, t, i.depth)
            }

            function s(t, e) {
                var n = o.styles[e];
                return n ? "[" + o.colors[n][0] + "m" + t + "[" + o.colors[n][1] + "m" : t
            }

            function r(t, e) {
                return t
            }

            function a(t) {
                var e = {};
                return t.forEach(function(t, n) {
                    e[t] = !0
                }), e
            }

            function c(t, e, i) {
                if (t.customInspect && e && _(e.inspect) && e.inspect !== n.inspect && (!e.constructor || e.constructor.prototype !== e)) {
                    var o = e.inspect(i, t);
                    return w(o) || (o = c(t, o, i)), o
                }
                var s = u(t, e);
                if (s) return s;
                var r = Object.keys(e),
                    g = a(r);
                if (t.showHidden && (r = Object.getOwnPropertyNames(e)), E(e) && (r.indexOf("message") >= 0 || r.indexOf("description") >= 0)) return p(e);
                if (0 === r.length) {
                    if (_(e)) {
                        var y = e.name ? ": " + e.name : "";
                        return t.stylize("[Function" + y + "]", "special")
                    }
                    if (b(e)) return t.stylize(RegExp.prototype.toString.call(e), "regexp");
                    if (O(e)) return t.stylize(Date.prototype.toString.call(e), "date");
                    if (E(e)) return p(e)
                }
                var m = "",
                    v = !1,
                    x = ["{", "}"];
                if (f(e) && (v = !0, x = ["[", "]"]), _(e)) {
                    var k = e.name ? ": " + e.name : "";
                    m = " [Function" + k + "]"
                }
                if (b(e) && (m = " " + RegExp.prototype.toString.call(e)), O(e) && (m = " " + Date.prototype.toUTCString.call(e)), E(e) && (m = " " + p(e)), 0 === r.length && (!v || 0 == e.length)) return x[0] + m + x[1];
                if (i < 0) return b(e) ? t.stylize(RegExp.prototype.toString.call(e), "regexp") : t.stylize("[Object]", "special");
                t.seen.push(e);
                var M;
                return M = v ? d(t, e, i, g, r) : r.map(function(n) {
                    return l(t, e, i, g, n, v)
                }), t.seen.pop(), h(M, m, x)
            }

            function u(t, e) {
                if (k(e)) return t.stylize("undefined", "undefined");
                if (w(e)) {
                    var n = "'" + JSON.stringify(e).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
                    return t.stylize(n, "string")
                }
                return v(e) ? t.stylize("" + e, "number") : g(e) ? t.stylize("" + e, "boolean") : y(e) ? t.stylize("null", "null") : void 0
            }

            function p(t) {
                return "[" + Error.prototype.toString.call(t) + "]"
            }

            function d(t, e, n, i, o) {
                for (var s = [], r = 0, a = e.length; r < a; ++r) z(e, String(r)) ? s.push(l(t, e, n, i, String(r), !0)) : s.push("");
                return o.forEach(function(o) {
                    o.match(/^\d+$/) || s.push(l(t, e, n, i, o, !0))
                }), s
            }

            function l(t, e, n, i, o, s) {
                var r, a, u;
                if (u = Object.getOwnPropertyDescriptor(e, o) || {
                    value: e[o]
                }, u.get ? a = u.set ? t.stylize("[Getter/Setter]", "special") : t.stylize("[Getter]", "special") : u.set && (a = t.stylize("[Setter]", "special")), z(i, o) || (r = "[" + o + "]"), a || (t.seen.indexOf(u.value) < 0 ? (a = y(n) ? c(t, u.value, null) : c(t, u.value, n - 1), a.indexOf("\n") > -1 && (a = s ? a.split("\n").map(function(t) {
                    return "  " + t
                }).join("\n").substr(2) : "\n" + a.split("\n").map(function(t) {
                    return "   " + t
                }).join("\n"))) : a = t.stylize("[Circular]", "special")), k(r)) {
                    if (s && o.match(/^\d+$/)) return a;
                    r = JSON.stringify("" + o), r.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (r = r.substr(1, r.length - 2), r = t.stylize(r, "name")) : (r = r.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), r = t.stylize(r, "string"))
                }
                return r + ": " + a
            }

            function h(t, e, n) {
                var i = 0,
                    o = t.reduce(function(t, e) {
                        return i++, e.indexOf("\n") >= 0 && i++, t + e.replace(/\u001b\[\d\d?m/g, "").length + 1
                    }, 0);
                return o > 60 ? n[0] + ("" === e ? "" : e + "\n ") + " " + t.join(",\n  ") + " " + n[1] : n[0] + e + " " + t.join(", ") + " " + n[1]
            }

            function f(t) {
                return Array.isArray(t)
            }

            function g(t) {
                return "boolean" == typeof t
            }

            function y(t) {
                return null === t
            }

            function m(t) {
                return null == t
            }

            function v(t) {
                return "number" == typeof t
            }

            function w(t) {
                return "string" == typeof t
            }

            function x(t) {
                return "symbol" == typeof t
            }

            function k(t) {
                return void 0 === t
            }

            function b(t) {
                return M(t) && "[object RegExp]" === S(t)
            }

            function M(t) {
                return "object" == typeof t && null !== t
            }

            function O(t) {
                return M(t) && "[object Date]" === S(t)
            }

            function E(t) {
                return M(t) && ("[object Error]" === S(t) || t instanceof Error)
            }

            function _(t) {
                return "function" == typeof t
            }

            function C(t) {
                return null === t || "boolean" == typeof t || "number" == typeof t || "string" == typeof t || "symbol" == typeof t || "undefined" == typeof t
            }

            function S(t) {
                return Object.prototype.toString.call(t)
            }

            function j(t) {
                return t < 10 ? "0" + t.toString(10) : t.toString(10)
            }

            function D() {
                var t = new Date,
                    e = [j(t.getHours()), j(t.getMinutes()), j(t.getSeconds())].join(":");
                return [t.getDate(), $[t.getMonth()], e].join(" ")
            }

            function z(t, e) {
                return Object.prototype.hasOwnProperty.call(t, e)
            }
            var W = /%[sdj%]/g;
            n.format = function(t) {
                if (!w(t)) {
                    for (var e = [], n = 0; n < arguments.length; n++) e.push(o(arguments[n]));
                    return e.join(" ")
                }
                for (var n = 1, i = arguments, s = i.length, r = String(t).replace(W, function(t) {
                    if ("%%" === t) return "%";
                    if (n >= s) return t;
                    switch (t) {
                        case "%s":
                            return String(i[n++]);
                        case "%d":
                            return Number(i[n++]);
                        case "%j":
                            try {
                                return JSON.stringify(i[n++])
                            } catch (t) {
                                return "[Circular]"
                            }
                        default:
                            return t
                    }
                }), a = i[n]; n < s; a = i[++n]) r += y(a) || !M(a) ? " " + a : " " + o(a);
                return r
            }, n.deprecate = function(t, o) {
                function s() {
                    if (!r) {
                        if (e.throwDeprecation) throw new Error(o);
                        e.traceDeprecation ? console.trace(o) : console.error(o), r = !0
                    }
                    return t.apply(this, arguments)
                }
                if (k(i.process)) return function() {
                    return n.deprecate(t, o).apply(this, arguments)
                };
                if (e.noDeprecation === !0) return t;
                var r = !1;
                return s
            };
            var N, I = {};
            n.debuglog = function(t) {
                if (k(N) && (N = e.env.NODE_DEBUG || ""), t = t.toUpperCase(), !I[t])
                    if (new RegExp("\\b" + t + "\\b", "i").test(N)) {
                        var i = e.pid;
                        I[t] = function() {
                            var e = n.format.apply(n, arguments);
                            console.error("%s %d: %s", t, i, e)
                        }
                    } else I[t] = function() {};
                return I[t]
            }, n.inspect = o, o.colors = {
                bold: [1, 22],
                italic: [3, 23],
                underline: [4, 24],
                inverse: [7, 27],
                white: [37, 39],
                grey: [90, 39],
                black: [30, 39],
                blue: [34, 39],
                cyan: [36, 39],
                green: [32, 39],
                magenta: [35, 39],
                red: [31, 39],
                yellow: [33, 39]
            }, o.styles = {
                special: "cyan",
                number: "yellow",
                boolean: "yellow",
                undefined: "grey",
                null: "bold",
                string: "green",
                date: "magenta",
                regexp: "red"
            }, n.isArray = f, n.isBoolean = g, n.isNull = y, n.isNullOrUndefined = m, n.isNumber = v, n.isString = w, n.isSymbol = x, n.isUndefined = k, n.isRegExp = b, n.isObject = M, n.isDate = O, n.isError = E, n.isFunction = _, n.isPrimitive = C, n.isBuffer = t("./support/isBuffer");
            var $ = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            n.log = function() {
                console.log("%s - %s", D(), n.format.apply(n, arguments))
            }, n.inherits = t("inherits"), n._extend = function(t, e) {
                if (!e || !M(e)) return t;
                for (var n = Object.keys(e), i = n.length; i--;) t[n[i]] = e[n[i]];
                return t
            }
        }).call(this, t("pBGvAp"), "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
        "./support/isBuffer": 3,
        inherits: 1,
        pBGvAp: 2
    }],
    5: [function(t, e, n) {
        "use strict";

        function i(t) {
            i.super_.call(this, "City", t), this.places = [], this.companies = [], this.news = [], this.excursions = []
        }
        var o = t("./geoobject.class"),
            s = t("util").inherits,
            r = t("./place.class"),
            a = t("./company.class"),
            c = t("./news.class"),
            u = t("./excursion.class");
        s(i, o), i.prototype.getZoom = function() {
            return 15
        }, i.prototype.getPlaces = function(t) {
            switch (t) {
                default:
                    return this.places
            }
        }, i.prototype.getEvents = function() {
            var t = [];
            return this.getPlaces().map(function(e) {
                e.getEvents().map(function(e) {
                    t.push(e)
                })
            }), t
        }, i.prototype.getCompanies = function(t) {
            switch (t) {
                default:
                    return this.companies
            }
        }, i.prototype.getVacancies = function(t) {
            var e = [];
            return this.getCompanies().map(function(t) {
                t.getVacancies().map(function(t) {
                    e.push(t)
                })
            }), e
        }, i.prototype.getNews = function(t) {
            switch (t) {
                default:
                    return this.news
            }
        }, i.prototype.getExcursions = function(t) {
            switch (t) {
                default:
                    return this.excursions
            }
        }, i.prototype.data_placesCount = function() {
            return this.getPlaces().length
        }, i.prototype.data_companiesCount = function() {
            return this.getCompanies().length
        }, i.prototype.data_vacanciesCount = function() {
            return this.getVacancies().length
        }, i.prototype.data_newsCount = function() {
            return this.getNews().length
        }, i.prototype.data_excursionsCount = function() {
            return this.getExcursions().length
        }, i.prototype.addPlace = function(t) {
            var e;
            e = "Place" === t.className ? t : new r(t);
            var n = this.places.indexOf(e);
            return -1 === n ? this.places.push(e) : this.places[n] = e, e.city = this, e
        }, i.prototype.addCompany = function(t) {
            var e;
            e = "Company" === t.className ? t : new a(t);
            var n = this.companies.indexOf(e);
            return -1 === n ? this.companies.push(e) : this.companies[n] = e, e.city = this, e
        }, i.prototype.addNews = function(t) {
            var e;
            e = "News" === t.className ? t : new c(t);
            var n = this.news.indexOf(e);
            return -1 === n ? this.news.push(e) : this.news[n] = e, e.city = this, e
        }, i.prototype.addExcursion = function(t) {
            var e;
            e = "Excursion" === t.className ? t : new u(t);
            var n = this.excursions.indexOf(e);
            return -1 === n ? this.excursions.push(e) : this.excursions[n] = e, e.city = this, e
        }, i.prototype.createMarker = function(t, e) {
            var n = {
                latitude: this.data("latitude"),
                longitude: this.data("longitude"),
                icon: "img/pins/marker.png",
                infoWindow: {
                    contentString: '<div class="left citypin"><h3>' + this.data("name") + "</h3></div>",
                    pixelOffset: new google.maps.Size(20, 30)
                }
            };
            return e = $.extend(n, e), this.marker = t.addMarker(e), this.marker
        }, e.exports = i
    }, {
        "./company.class": 6,
        "./excursion.class": 9,
        "./geoobject.class": 10,
        "./news.class": 11,
        "./place.class": 12,
        util: 4
    }],
    6: [function(t, e, n) {
        "use strict";

        function i(t) {
            i.super_.call(this, "Company", t), this.vacancies = [], this.data("type", t.type), this.data("description", t.description), this.data("tags", t.tags), this.data("address", t.address)
        }
        var o = t("./geoobject.class"),
            s = t("util").inherits,
            r = t("./vacancy.class");
        s(i, o), i.prototype.getZoom = function() {
            return 19
        }, i.prototype.getVacancies = function(t) {
            switch (t) {
                default:
                    return this.vacancies
            }
        }, i.prototype.data_VacanciesCount = function() {
            return this.getVacancies().length
        }, i.prototype.addVacancy = function(t) {
            var e;
            e = "Vacancy" === t.className ? t : new r(t);
            var n = this.vacancies.indexOf(e);
            return -1 === n ? this.vacancies.push(e) : this.vacancies[n] = e, e.company = this, e
        }, e.exports = i
    }, {
        "./geoobject.class": 10,
        "./vacancy.class": 13,
        util: 4
    }],
    7: [function(t, e, n) {
        "use strict";

        function i(t) {
            i.super_.call(this, "Country", t), this.cities = []
        }
        var o = t("./geoobject.class"),
            s = t("util").inherits,
            r = t("./city.class");
        s(i, o), i.prototype.addCity = function(t) {
            var e;
            e = "City" === t.className ? t : new r(t);
            var n = this.cities.indexOf(e);
            return -1 === n ? this.cities.push(e) : this.cities[n] = e, e.country = this, e
        }, i.prototype.getCities = function(t) {
            switch (t) {
                default:
                    return this.cities
            }
        }, i.prototype.data_citiesCount = function() {
            return this.getCities().length
        }, i.prototype.createMarker = function(t, e) {
            var n = {
                latitude: this.data("latitude"),
                longitude: this.data("longitude"),
                icon: "img/pins/" + this.data("code") + ".png",
                infoWindow: {
                    contentString: '<div class="right counpin"><h3>' + this.data("name") + '</h3><span class="rating">' + this.data("rating") + "</span></div>",
                    pixelOffset: new google.maps.Size(40, 60)
                }
            };
            return e = $.extend(n, e), this.marker = t.addMarker(e), this.marker
        }, e.exports = i
    }, {
        "./city.class": 5,
        "./geoobject.class": 10,
        util: 4
    }],
    8: [function(t, e, n) {
        "use strict";

        function i(t) {
            i.super_.call(this, "Event", t), this.data("description", t.description), this.data("datetime", t.datetime), this.data("currency", t.currency), this.data("price", t.price), this.data("tags", t.tags)
        }
        var o = t("./geoobject.class"),
            s = t("util").inherits;
        s(i, o), i.prototype.getZoom = function() {
            return 19
        }, i.prototype.data = function(t, e) {
            return "latitude" === t && "undefined" == typeof e ? this.place.data(t) : "longitude" === t && "undefined" == typeof e ? this.place.data(t) : i.super_.prototype.data.apply(this, arguments)
        }, i.prototype.createMarker = function(t, e) {
            var n = {
                latitude: this.data("latitude"),
                longitude: this.data("longitude"),
                icon: "img/pins/" + this.place.data("type") + ".png",
                infoWindow: {
                    contentString: '<div class="left citypin"><h3>' + this.data("name") + "</h3></div>",
                    pixelOffset: new google.maps.Size(30, 50)
                }
            };
            return e = $.extend(n, e), this.marker = t.addMarker(e), this.marker
        }, e.exports = i
    }, {
        "./geoobject.class": 10,
        util: 4
    }],
    9: [function(t, e, n) {
        "use strict";

        function i(t) {
            i.super_.call(this, "Excursion", t), this.data("title", t.name), this.data("description", t.description), this.data("currency", t.currency), this.data("price", t.price), this.data("language", t.language), this.data("duration", t.duration), this.data("guide", t.guide), this.data("latitudeOrigin", t.latitudeOrigin), this.data("longitudeOrigin", t.longitudeOrigin), this.data("latitudeDestination", t.latitudeDestination), this.data("longitudeDestination", t.longitudeDestination)
        }
        var o = t("./geoobject.class"),
            s = t("util").inherits;
        t("./../map/marker.class");
        s(i, o), i.prototype.getZoom = function() {
            return 19
        }, i.prototype.createRoute = function(t, e) {
            this.markers = {};
            var n = {
                latitude: this.data("latitudeOrigin"),
                longitude: this.data("longitudeOrigin"),
                icon: "img/pins/route.png"
            };
            "undefined" != typeof e && (n = $.extend(n, e.markers)), this.markers.origin = t.addMarker(n);
            var i = {
                latitude: this.data("latitudeDestination"),
                longitude: this.data("longitudeDestination"),
                icon: "img/pins/route.png"
            };
            "undefined" != typeof e && (i = $.extend(i, e.markers)), this.markers.destination = t.addMarker(i);
            var o = {};
            return e = $.extend(o, e), this.route = t.addRoute(this.markers.origin, this.markers.destination, e), this.route.show(), this.route
        }, e.exports = i
    }, {
        "./../map/marker.class": 17,
        "./geoobject.class": 10,
        util: 4
    }],
    10: [function(t, e, n) {
        "use strict";

        function i(t, e) {
            this.id = e.id, this.name = e.name, this._data = {}, this.className = t, this.marker = !1, "undefined" != typeof e.code && this.data("code", e.code), "undefined" != typeof e.name && this.data("name", e.name), "undefined" != typeof e.latitude && this.data("latitude", e.latitude), "undefined" != typeof e.longitude && this.data("longitude", e.longitude)
        }
        i.prototype.data = function(t, e) {
            return "function" == typeof this["data_" + t] ? this["data_" + t]() : "undefined" == typeof e ? ("undefined" == typeof this._data[t] && (console.group("Empty paramValue"), console.log(this.className), console.log(this), console.log(t), console.groupEnd()), this._data[t]) : (this._data[t] = e, this._data[t])
        }, i.prototype.getInfoWindowOptions = function() {
            return {
                contentString: this.data("name")
            }
        }, i.prototype.createMarker = function(t, e) {
            if (this.data("latitude") && this.data("longitude")) {
                var n = {
                    latitude: this.data("latitude"),
                    longitude: this.data("longitude"),
                    label: this.data("name")
                };
                return e = $.extend(n, e), !0 !== e.suppressInfoWindow && (e.infoWindow = this.getInfoWindowOptions()), this.marker = t.addMarker(e), this.marker
            }
        }, i.prototype.getZoom = function() {
            return 3
        }, i.prototype.createMap = function(t, e) {
            var n = {
                latitude: this.data("latitude"),
                longitude: this.data("longitude"),
                zoom: this.getZoom()
            };
            return e = $.extend(n, e), new MyWorld.Map(t, e)
        }, i.prototype.output = function(t) {
            var e, n = this;
            $(t).find("[data-value]").each(function(t, i) {
                e = $(i), e.html(n.data(e.data("value")))
            })
        }, e.exports = i
    }, {}],
    11: [function(t, e, n) {
        "use strict";
        var i = t("./geoobject.class"),
            o = t("util").inherits,
            s = function(t) {
                s.super_.call(this, "News", t), this.data("title", t.name), this.data("datetime", t.datetime), this.data("description", t.description), this.data("tags", t.tags)
            };
        o(s, i), s.prototype.getZoom = function() {
            return 19
        }, s.prototype.data = function(t, e) {
            return "latitude" === t && "undefined" == typeof e ? "undefined" !== this._data.latitude && this._data.latitude : "longitude" === t && "undefined" == typeof e ? "undefined" !== this._data.longitude && this._data.longitude : s.super_.prototype.data.apply(this, arguments)
        }, s.prototype.createMarker = function(t, e) {
            if (!this.data("latitude") || !this.data("longitude")) return this.marker = !1, this.marker;
            var n = {
                latitude: this.data("latitude"),
                longitude: this.data("longitude"),
                icon: "img/pins/route.png",
                infoWindow: {
                    contentString: '<div class="left citypin"><h3>' + this.data("title") + "</h3></div>",
                    pixelOffset: new google.maps.Size(30, 50)
                }
            };
            return e = $.extend(n, e), this.marker = t.addMarker(e), this.marker
        }, e.exports = s
    }, {
        "./geoobject.class": 10,
        util: 4
    }],
    12: [function(t, e, n) {
        "use strict";

        function i(t) {
            i.super_.call(this, "Place", t), this.events = [], this.data("type", t.type), this.data("description", t.description), this.data("tags", t.tags), this.data("address", t.address)
        }
        var o = t("./geoobject.class"),
            s = t("util").inherits,
            r = t("./event.class");
        s(i, o), i.prototype.getZoom = function() {
            return 19
        }, i.prototype.getEvents = function(t) {
            switch (t) {
                default:
                    return this.events
            }
        }, i.prototype.data_EventsCount = function() {
            return this.getEvents().length
        }, i.prototype.addEvent = function(t) {
            var e;
            e = "Event" === t.className ? t : new r(t);
            var n = this.events.indexOf(e);
            return -1 === n ? this.events.push(e) : this.events[n] = e, e.place = this, e
        }, i.prototype.createMarker = function(t, e) {
            var n = {
                latitude: this.data("latitude"),
                longitude: this.data("longitude"),
                icon: "img/pins/" + this.data("type") + ".png",
                infoWindow: {
                    contentString: '<div class="left citypin"><h3>' + this.data("name") + "</h3></div>",
                    pixelOffset: new google.maps.Size(30, 50)
                }
            };
            return e = $.extend(n, e), this.marker = t.addMarker(e), this.marker
        }, e.exports = i
    }, {
        "./event.class": 8,
        "./geoobject.class": 10,
        util: 4
    }],
    13: [function(t, e, n) {
        "use strict";

        function i(t) {
            i.super_.call(this, "Vacancy", t), this.data("salary", t.salary), this.data("currency", t.currency), this.data("description", t.description), this.data("tags", t.tags)
        }
        var o = t("./geoobject.class"),
            s = t("util").inherits;
        s(i, o), i.prototype.getZoom = function() {
            return 19
        }, i.prototype.data = function(t, e) {
            return "latitude" === t && "undefined" == typeof e ? this.company.data(t) : "longitude" === t && "undefined" == typeof e ? this.company.data(t) : i.super_.prototype.data.apply(this, arguments)
        }, i.prototype.createMarker = function(t, e) {
            var n = {
                latitude: this.data("latitude"),
                longitude: this.data("longitude"),
                icon: "img/pins/" + this.company.data("type") + ".png",
                infoWindow: {
                    contentString: '<div class="left citypin"><h3>' + this.data("name") + "</h3></div>",
                    pixelOffset: new google.maps.Size(30, 50)
                }
            };
            return e = $.extend(n, e), this.marker = t.addMarker(e), this.marker
        }, e.exports = i
    }, {
        "./geoobject.class": 10,
        util: 4
    }],
    14: [function(t, e, n) {
        "use strict";
        var i = window.MyWorld || {};
        i.Map = t("./map/map.class"), i.Map.Marker = t("./map/marker.class"), i.Map.InfoWindow = t("./map/infowindow.class"), i.Map.Route = t("./map/route.class"), i.Country = t("./entities/country.class"), i.City = t("./entities/city.class"), i.Place = t("./entities/place.class"), i.Company = t("./entities/company.class"), i.Vacancy = t("./entities/vacancy.class"), i.Event = t("./entities/event.class"), i.News = t("./entities/news.class"), i.Excursion = t("./entities/excursion.class"), window.MyWorld = i
    }, {
        "./entities/city.class": 5,
        "./entities/company.class": 6,
        "./entities/country.class": 7,
        "./entities/event.class": 8,
        "./entities/excursion.class": 9,
        "./entities/news.class": 11,
        "./entities/place.class": 12,
        "./entities/vacancy.class": 13,
        "./map/infowindow.class": 15,
        "./map/map.class": 16,
        "./map/marker.class": 17,
        "./map/route.class": 18
    }],
    15: [function(t, e, n) {
        "use strict";

        function i(t, e) {
            this.extend(google.maps.OverlayView, i);
            var n = {};
            this.options = $.extend(n, e), this.marker = t, this.position = {
                left: 0,
                top: 0
            }, this.build(), this.setValues(this.options)
        }
        i.prototype.extend = function(t, e) {
            return function(t) {
                for (var e in t.prototype) this.prototype[e] = t.prototype[e];
                return this
            }.apply(e, [t])
        }, i.prototype.build = function() {
            this.window = document.createElement("div"), this.window.className = "markinfo dark", this.window.style.display = "none"
        }, i.prototype.px = function(t) {
            return t ? t + "px" : t
        }, i.prototype.addEvents = function() {
            var t = this,
                e = ["mousedown", "mousemove", "mouseover", "mouseout", "mouseup", "mousewheel", "DOMMouseScroll", "touchstart", "touchend", "touchmove", "dblclick", "contextmenu", "click"];
            this.listeners = [];
            for (var n, i = 0; n = e[i]; i++) this.listeners.push(google.maps.event.addDomListener(t.window, n, function(t) {
                t.cancelBubble = !0, t.stopPropagation && t.stopPropagation()
            }))
        }, i.prototype.onAdd = function() {
            this.window || this.build(), this.addEvents();
            var t = this.getPanes();
            t && t.floatPane.appendChild(this.window), google.maps.event.trigger(this, "domready")
        }, i.prototype.onRemove = function() {
            this.window && this.window.parentNode && this.window.parentNode.removeChild(this.window);
            for (var t, e = 0; t = this.listeners[e]; e++) google.maps.event.removeListener(t)
        }, i.prototype.htmlToDocumentFragment = function(t) {
            t = t.replace(/^\s*([\S\s]*)\b\s*$/, "$1");
            var e = document.createElement("div");
            if (e.innerHTML = t, 1 == e.childNodes.length) return e.removeChild(e.firstChild);
            for (var n = document.createDocumentFragment(); e.firstChild;) n.appendChild(e.firstChild);
            return n
        }, i.prototype.draw = function() {
            var t = this.getProjection();
            if (t) {
                var e = t.fromLatLngToDivPixel(this.marker.instance.position);
                this.position = {
                    left: e.x,
                    top: e.y
                }, this.options.pixelOffset && (this.position.left += this.options.pixelOffset.width, this.position.top -= this.options.pixelOffset.height), this.removeChildren(this.window);
                var n = this.options.contentString;
                n && this.window.appendChild("string" == typeof n ? this.htmlToDocumentFragment(n) : n), this.window.style.left = this.px(this.position.left), this.window.style.top = this.px(this.position.top)
            }
        }, i.prototype.removeChildren = function(t) {
            if (t)
                for (var e; e = t.firstChild;) t.removeChild(e)
        }, i.prototype.show = function(t) {
            !1 !== t && this.marker.map.hideInfoWindows(), this.draw(), this.setMap(this.marker.map.instance), this.set("anchor", this.marker.instance), this.bindTo("anchorPoint", this.marker.instance), this.bindTo("position", this.marker.instance), this.window.style.display = "", this.marker.map.activeInfoWindows.push(this)
        }, i.prototype.hide = function() {
            this.window && (this.window.style.display = "none")
        }, e.exports = i
    }, {}],
    16: [function(t, e, n) {
        "use strict";

        function i(t, e) {
            var n = this;
            n.markers = [], n.routes = [], n.activeInfoWindows = [];
            var i = {
                center: {
                    lat: e.latitude,
                    lng: e.longitude
                },
                zoom: 3,
                disableDefaultUI: !0,
                rebuildMapOnResize: !0
            };
            n.options = $.extend(i, e), delete n.options.latitude, delete n.options.longitude, n.instance = new google.maps.Map($(t)[0], n.options), !1 !== n.options.rebuildMapOnResize && google.maps.event.addDomListener(window, "resize", n.recenter.bind(n)), google.maps.event.addListenerOnce(n.instance, "idle", n.resize.bind(n)), setTimeout(n.resize.bind(n), 50)
        }
        i.prototype.center = function(t, e) {
            var n = new google.maps.LatLng(t, e);
            return this.instance.panTo(n), this
        }, i.prototype.panTo = function(t) {
            return t.data("latitude") && t.data("longitude") && this.center(t.data("latitude"), t.data("longitude")), this
        }, i.prototype.resize = function() {
            google.maps.event.trigger(this.instance, "resize"), this.recenter()
        }, i.prototype.recenter = function() {
            this.instance.getCenter();
            this.instance.setCenter(this.options.center)
        }, i.prototype.on = function(t, e) {
            return google.maps.event.addListener(this.instance, t, e), this
        }, i.prototype.off = function(t) {
            return google.maps.event.clearListeners(this.instance, t), this
        }, i.prototype.autoZoom = function(t) {
            if (!1 === t) return this.instance.setZoom(this.options.zoom), this;
            var e = new google.maps.LatLngBounds;
            this.markers.map(function(t) {
                e.extend(new google.maps.LatLng(t.position.latitude, t.position.longitude))
            }), this.instance.fitBounds(e)
        }, i.prototype.hideInfoWindows = function() {
            this.activeInfoWindows.forEach(function(t) {
                t.hide()
            })
        }, i.prototype.clearMarkers = function() {
            this.hideInfoWindows(), this.markers.map(function(t) {
                t.setMap(null)
            }), this.markers = []
        }, i.prototype.addMarker = function(t) {
            var e = new MyWorld.Map.Marker(t);
            return e.setMap(this), e
        }, i.prototype.enableMarkersEvent = function(t) {
            this.markers.map(function(e) {
                e.enableEvent(t)
            })
        }, i.prototype.disableMarkersEvent = function(t) {
            this.markers.map(function(e) {
                e.disableEvent(t)
            })
        }, i.prototype.addRoute = function(t, e, n) {
            var i = new MyWorld.Map.Route(t, e, n);
            return i.setMap(this), i
        }, e.exports = i
    }, {}],
    17: [function(t, e, n) {
        "use strict";

        function i(t) {
            var e = {
                position: {
                    lat: t.latitude,
                    lng: t.longitude
                },
                draggable: !1
            };
            this.options = $.extend(e, t), this._events = {}, this.position = {
                latitude: t.latitude,
                longitude: t.longitude
            }, delete this.options.latitude, delete this.options.longitude, delete this.options.infoWindow, this.instance = new google.maps.Marker(this.options), this.instance._owner = this, "undefined" != typeof t.infoWindow && this.createInfoWindow(t.infoWindow)
        }
        i.prototype.setMap = function(t) {
            return this.map = t, t && t.markers.push(this), this.instance.setMap(t ? t.instance : null), this
        }, i.prototype.on = function(t, e) {
            return this._events[t] = e, google.maps.event.addListener(this.instance, t, e), this
        }, i.prototype.off = function(t, e) {
            return google.maps.event.clearListeners(this.instance, t), !0 !== e && (this._events[t] = function() {}), this
        }, i.prototype.enableEvent = function(t) {
            if ("undefined" != typeof this._events[t]) return this.on(t, this._events[t])
        }, i.prototype.disableEvent = function(t) {
            return this.off(t, !0)
        }, i.prototype.executeEvent = function(t) {
            "undefined" != typeof this._events[t] && this._events[t].call(this)
        }, i.prototype.createInfoWindow = function(t) {
            if (this.infoWindow = new MyWorld.Map.InfoWindow(this, t), !0 !== t.disableEvents) {
                var e = this;
                this.on("mouseover", function() {
                    e.infoWindow.show()
                }).on("mouseout", function() {
                    e.infoWindow.hide()
                })
            }
        }, i.prototype.setIcon = function(t) {
            this.instance.setIcon(t)
        }, e.exports = i
    }, {}],
    18: [function(t, e, n) {
        "use strict";

        function i(t, e, n) {
            var i = {
                suppressMarkers: !0,
                polylineOptions: {
                    strokeColor: "#0A161E"
                },
                travelMode: google.maps.TravelMode.WALKING
            };
            n = $.extend(i, n), this.markers = {
                origin: t,
                destination: e
            }, this.instance = {
                markerOrigin: this.markers.origin,
                markerDestination: this.markers.destination,
                directionsService: new google.maps.DirectionsService,
                directionsDisplay: new google.maps.DirectionsRenderer({
                    suppressMarkers: n.suppressMarkers,
                    polylineOptions: n.polylineOptions
                })
            };
            var o = this;
            this.instance.directionsService.route({
                origin: {
                    lat: o.markers.origin.position.latitude,
                    lng: o.markers.origin.position.longitude
                },
                destination: {
                    lat: o.markers.destination.position.latitude,
                    lng: o.markers.destination.position.longitude
                },
                travelMode: n.travelMode
            }, function(t, e) {
                e === google.maps.DirectionsStatus.OK ? o.instance.directionsDisplay.setDirections(t) : console.error("Directions request failed due to " + e)
            })
        }
        i.prototype.setMap = function(t) {
            return this.map = t, t && t.routes.push(this), this
        }, i.prototype.show = function() {
            this.instance.directionsDisplay.setMap(this.map.instance)
        }, i.prototype.update = function(t) {
            this.markers.origin.instance.setIcon(t.markers.icon), this.markers.destination.instance.setIcon(t.markers.icon), this.instance.directionsDisplay.setOptions(t), this.show()
        }, e.exports = i
    }, {}]
}, {}, [14]);
