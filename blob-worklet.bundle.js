(() => {
  // node_modules/@georgedoescode/generative-utils/src/spline.js
  function formatPoints(points, close) {
    points = [...points];
    if (!Array.isArray(points[0])) {
      points = points.map(({ x, y }) => [x, y]);
    }
    if (close) {
      const lastPoint = points[points.length - 1];
      const secondToLastPoint = points[points.length - 2];
      const firstPoint = points[0];
      const secondPoint = points[1];
      points.unshift(lastPoint);
      points.unshift(secondToLastPoint);
      points.push(firstPoint);
      points.push(secondPoint);
    }
    return points.flat();
  }
  function spline(points = [], tension = 1, close = false, cb) {
    points = formatPoints(points, close);
    const size = points.length;
    const last = size - 4;
    const startPointX = close ? points[2] : points[0];
    const startPointY = close ? points[3] : points[1];
    let path = "M" + [startPointX, startPointY];
    cb && cb("MOVE", [startPointX, startPointY]);
    const startIteration = close ? 2 : 0;
    const maxIteration = close ? size - 4 : size - 2;
    const inc = 2;
    for (let i = startIteration; i < maxIteration; i += inc) {
      const x0 = i ? points[i - 2] : points[0];
      const y0 = i ? points[i - 1] : points[1];
      const x1 = points[i + 0];
      const y1 = points[i + 1];
      const x2 = points[i + 2];
      const y2 = points[i + 3];
      const x3 = i !== last ? points[i + 4] : x2;
      const y3 = i !== last ? points[i + 5] : y2;
      const cp1x = x1 + (x2 - x0) / 6 * tension;
      const cp1y = y1 + (y2 - y0) / 6 * tension;
      const cp2x = x2 - (x3 - x1) / 6 * tension;
      const cp2y = y2 - (y3 - y1) / 6 * tension;
      path += "C" + [cp1x, cp1y, cp2x, cp2y, x2, y2];
      cb && cb("CURVE", [cp1x, cp1y, cp2x, cp2y, x2, y2]);
    }
    return path;
  }

  // node_modules/@georgedoescode/generative-utils/src/map.js
  function map(n, start1, end1, start2, end2) {
    return (n - start1) / (end1 - start1) * (end2 - start2) + start2;
  }

  // blob-worklet.js
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
      return ["--blob-seed", "--blob-points", "--blob-variance"];
    }
    paint(ctx, geometry, props) {
      const seed = props.get("--blob-seed").toString().trim();
      const numPoints = parseInt(props.get("--blob-points").toString());
      const variance = parseFloat(props.get("--blob-variance").toString());
      const random2 = mulberry32(seed);
      const radius = Math.min(geometry.width, geometry.height) / 2;
      const points = [];
      const angleStep = Math.PI * 2 / numPoints;
      const center = {
        x: geometry.width / 2,
        y: geometry.height / 2
      };
      for (let i = 1; i <= numPoints; i++) {
        const theta = i * angleStep;
        const point = {
          x: geometry.width / 2 + Math.cos(theta) * radius,
          y: geometry.height / 2 + Math.sin(theta) * radius
        };
        const lerpPosition = map(random2(), 0, 1, 0, variance);
        points.push(lerp(point, center, lerpPosition));
      }
      ctx.beginPath();
      spline(points, 1, true, (CMD, data) => {
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
