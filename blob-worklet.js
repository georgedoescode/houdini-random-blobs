import { spline, map } from "@georgedoescode/generative-utils";

function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    var t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function lerp(position, target, amt) {
  return {
    x: (position.x += (target.x - position.x) * amt),
    y: (position.y += (target.y - position.y) * amt),
  };
}

class Blob {
  static get inputProperties() {
    return ["--blob-seed", "--blob-points", "--blob-variance"];
  }

  paint(ctx, geometry, props) {
    // parse props, when any of these changes, the blob will re-render
    const seed = props.get("--blob-seed").toString().trim();
    const numPoints = parseInt(props.get("--blob-points").toString());
    const variance = parseFloat(props.get("--blob-variance").toString());

    /* 
      "reset" our random number generator each time paint() is run,
      this will ensure our blob does not change unless it's input properties do.
    */
    const random = mulberry32(seed);

    // ensure the blob always fits the element
    const radius = Math.min(geometry.width, geometry.height) / 2;

    // plot points around a circle, "pull" each point a towards the center a random amount
    const points = [];
    const angleStep = (Math.PI * 2) / numPoints;

    const center = {
      x: geometry.width / 2,
      y: geometry.height / 2,
    };

    for (let i = 1; i <= numPoints; i++) {
      const theta = i * angleStep;
      const point = {
        x: geometry.width / 2 + Math.cos(theta) * radius,
        y: geometry.height / 2 + Math.sin(theta) * radius,
      };

      const lerpPosition = map(random(), 0, 1, 0, variance);

      points.push(lerp(point, center, lerpPosition));
    }

    // blob-render-time!

    // ensure our blob is good for masking
    ctx.fillStyle = "#000";

    ctx.beginPath();
    // draw a catmull-rom spline through each point
    spline(points, 1, true, (CMD, data) => {
      if (CMD === "MOVE") {
        ctx.moveTo(...data);
      } else {
        ctx.bezierCurveTo(...data);
      }
    });
    ctx.fill();
  }
}

registerPaint("blob", Blob);
