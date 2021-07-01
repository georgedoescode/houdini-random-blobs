(() => {
  // node_modules/@georgedoescode/generative-utils/dist/index.js
  var T = Object.create;
  var m = Object.defineProperty;
  var O = Object.getOwnPropertyDescriptor;
  var S = Object.getOwnPropertyNames;
  var C = Object.getPrototypeOf;
  var E = Object.prototype.hasOwnProperty;
  var G = (t) => m(t, "__esModule", { value: true });
  var B = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports);
  var N = (t, e, n) => {
    if (e && typeof e == "object" || typeof e == "function")
      for (let r of S(e))
        !E.call(t, r) && r !== "default" && m(t, r, { get: () => e[r], enumerable: !(n = O(e, r)) || n.enumerable });
    return t;
  };
  var V = (t) => N(G(m(t != null ? T(C(t)) : {}, "default", t && t.__esModule && "default" in t ? { get: () => t.default, enumerable: true } : { value: t, enumerable: true })), t);
  var p = B((ot, x) => {
    (function() {
      function t(e, n, r, s) {
        this.max_objects = n || 10, this.max_levels = r || 4, this.level = s || 0, this.bounds = e, this.objects = [], this.nodes = [];
      }
      t.prototype.split = function() {
        var e = this.level + 1, n = this.bounds.width / 2, r = this.bounds.height / 2, s = this.bounds.x, i = this.bounds.y;
        this.nodes[0] = new t({ x: s + n, y: i, width: n, height: r }, this.max_objects, this.max_levels, e), this.nodes[1] = new t({ x: s, y: i, width: n, height: r }, this.max_objects, this.max_levels, e), this.nodes[2] = new t({ x: s, y: i + r, width: n, height: r }, this.max_objects, this.max_levels, e), this.nodes[3] = new t({ x: s + n, y: i + r, width: n, height: r }, this.max_objects, this.max_levels, e);
      }, t.prototype.getIndex = function(e) {
        var n = [], r = this.bounds.x + this.bounds.width / 2, s = this.bounds.y + this.bounds.height / 2, i = e.y < s, h = e.x < r, c = e.x + e.width > r, d = e.y + e.height > s;
        return i && c && n.push(0), h && i && n.push(1), h && d && n.push(2), c && d && n.push(3), n;
      }, t.prototype.insert = function(e) {
        var n = 0, r;
        if (this.nodes.length) {
          for (r = this.getIndex(e), n = 0; n < r.length; n++)
            this.nodes[r[n]].insert(e);
          return;
        }
        if (this.objects.push(e), this.objects.length > this.max_objects && this.level < this.max_levels) {
          for (this.nodes.length || this.split(), n = 0; n < this.objects.length; n++) {
            r = this.getIndex(this.objects[n]);
            for (var s = 0; s < r.length; s++)
              this.nodes[r[s]].insert(this.objects[n]);
          }
          this.objects = [];
        }
      }, t.prototype.retrieve = function(e) {
        var n = this.getIndex(e), r = this.objects;
        if (this.nodes.length)
          for (var s = 0; s < n.length; s++)
            r = r.concat(this.nodes[n[s]].retrieve(e));
        return r = r.filter(function(i, h) {
          return r.indexOf(i) >= h;
        }), r;
      }, t.prototype.clear = function() {
        this.objects = [];
        for (var e = 0; e < this.nodes.length; e++)
          this.nodes.length && this.nodes[e].clear();
        this.nodes = [];
      }, typeof x != "undefined" && typeof x.exports != "undefined" ? x.exports = t : window.Quadtree = t;
    })();
  });
  function W(t, e) {
    if (t = [...t], Array.isArray(t[0]) || (t = t.map(({ x: n, y: r }) => [n, r])), e) {
      let n = t[t.length - 1], r = t[t.length - 2], s = t[0], i = t[1];
      t.unshift(n), t.unshift(r), t.push(s), t.push(i);
    }
    return t.flat();
  }
  function X(t = [], e = 1, n = false, r) {
    t = W(t, n);
    let s = t.length, i = s - 4, h = n ? t[2] : t[0], c = n ? t[3] : t[1], d = "M" + [h, c];
    r && r("MOVE", [h, c]);
    let I = n ? 2 : 0, Q = n ? s - 4 : s - 2, P = 2;
    for (let o = I; o < Q; o += P) {
      let _ = o ? t[o - 2] : t[0], A = o ? t[o - 1] : t[1], l = t[o + 0], g = t[o + 1], u = t[o + 2], f = t[o + 3], M = o !== i ? t[o + 4] : u, L = o !== i ? t[o + 5] : f, y = l + (u - _) / 6 * e, j = g + (f - A) / 6 * e, v = u - (M - l) / 6 * e, w = f - (L - g) / 6 * e;
      d += "C" + [y, j, v, w, u, f], r && r("CURVE", [y, j, v, w, u, f]);
    }
    return d;
  }
  var b = V(p());

  // worklet.js
  function mulberry32(a) {
    return function() {
      a |= 0;
      a = a + 1831565813 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function lerp(position, target, amt) {
    return {
      x: position.x += (target.x - position.x) * amt,
      y: position.y += (target.y - position.y) * amt
    };
  }
  var Blob = class {
    static get inputProperties() {
      return [
        "--blob-seed",
        "--blob-num-points",
        "--blob-variance",
        "--blob-smoothness",
        "--blob-fill"
      ];
    }
    constructor() {
      console.log(`My seed value is ${Math.random()}`);
    }
    propToString(prop) {
      return prop.toString().trim();
    }
    propToNumber(prop) {
      return parseFloat(prop);
    }
    paint(ctx, geometry, properties) {
      const seed = this.propToNumber(properties.get("--blob-seed"));
      const numPoints = this.propToNumber(properties.get("--blob-num-points"));
      const variance = this.propToNumber(properties.get("--blob-variance"));
      const smoothness = this.propToNumber(properties.get("--blob-smoothness"));
      const fill = this.propToString(properties.get("--blob-fill"));
      const random = mulberry32(seed);
      const radius = Math.min(geometry.width, geometry.height) / 2;
      const points = [];
      const center = {
        x: geometry.width / 2,
        y: geometry.height / 2
      };
      const angleStep = Math.PI * 2 / numPoints;
      for (let i = 1; i <= numPoints; i++) {
        const angle = i * angleStep;
        const point = {
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius
        };
        points.push(lerp(point, center, variance * random()));
      }
      ctx.fillStyle = fill;
      ctx.beginPath();
      X(points, smoothness, true, (CMD, data) => {
        if (CMD === "MOVE") {
          ctx.moveTo(...data);
        } else {
          ctx.bezierCurveTo(...data);
        }
      });
      ctx.fill();
    }
  };
  registerPaint("blob", Blob);
})();
/**
 * quadtree-js
 * @version 1.2.4
 * @license MIT
 * @author Timo Hausmann
 */
