import { spline } from "@georgedoescode/generative-utils";

// source: https://github.com/bryc/code/blob/master/jshash/PRNGs.md
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
    return [
      "--blob-seed",
      "--blob-num-points",
      "--blob-variance",
      "--blob-smoothness",
      "--blob-fill",
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
      y: geometry.height / 2,
    };

    const angleStep = (Math.PI * 2) / numPoints;

    for (let i = 1; i <= numPoints; i++) {
      const angle = i * angleStep;
      const point = {
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
      };

      points.push(lerp(point, center, variance * random()));
    }

    ctx.fillStyle = fill;

    ctx.beginPath();
    spline(points, smoothness, true, (CMD, data) => {
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
