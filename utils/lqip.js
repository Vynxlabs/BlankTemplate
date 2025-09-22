const sharp = require("sharp");
const ColorThief = require("colorthief");

async function generateLQIP(imagePath) {
  const theSharp = sharp(imagePath, { failOnError: false });
  const stats = await theSharp.stats();

  const opaque = stats.isOpaque;
  console.log(opaque);
  if (!opaque) {
    return {
      opaque: false,
    };
  }

  //This is to deal with a bug caused in jpgs by Samsung Galaxy s9 phones, and any other corrupt images.
  let dominantColor;
  try {
    dominantColor = await ColorThief.getPalette(imagePath, 4, 10).then((palette) => palette[0]);
  } catch (err) {
    console.warn("ColorThief failed, falling back to sharp.stats().dominant:", err.message);
    dominantColor = [
      Math.round(stats.dominant.r),
      Math.round(stats.dominant.g),
      Math.round(stats.dominant.b),
    ];
  }

  const previewBuffer = await theSharp
    .resize(3, 2, { fit: "fill" })
    .sharpen({ sigma: 1 })
    .removeAlpha()
    .toFormat("raw", { bitdepth: 8 })
    .toBuffer();

  const {
    L: rawBaseL,
    a: rawBaseA,
    b: rawBaseB,
  } = rgbToOkLab({
    r: dominantColor[0],
    g: dominantColor[1],
    b: dominantColor[2],
  });
  const { ll, aaa, bbb } = findOklabBits(rawBaseL, rawBaseA, rawBaseB);
  const { L: baseL, a: baseA, b: baseB } = bitsToLab(ll, aaa, bbb);
  console.log(
    "dominant rgb",
    dominantColor,
    "lab",
    Number(rawBaseL.toFixed(4)),
    Number(rawBaseA.toFixed(4)),
    Number(rawBaseB.toFixed(4)),
    "compressed",
    Number(baseL.toFixed(4)),
    Number(baseA.toFixed(4)),
    Number(baseB.toFixed(4)),
  );

  const cells = Array.from({ length: 6 }, (_, index) => {
    const r = previewBuffer.readUint8(index * 3);
    const g = previewBuffer.readUint8(index * 3 + 1);
    const b = previewBuffer.readUint8(index * 3 + 2);
    return rgbToOkLab({ r, g, b });
  });

  const values = cells.map(({ L }) => clamp(0.5 + L - baseL, 0, 1));
  const ca = Math.round(values[0] * 0b11);
  const cb = Math.round(values[1] * 0b11);
  const cc = Math.round(values[2] * 0b11);
  const cd = Math.round(values[3] * 0b11);
  const ce = Math.round(values[4] * 0b11);
  const cf = Math.round(values[5] * 0b11);
  const lqip =
    -(2 ** 19) +
    ((ca & 0b11) << 18) +
    ((cb & 0b11) << 16) +
    ((cc & 0b11) << 14) +
    ((cd & 0b11) << 12) +
    ((ce & 0b11) << 10) +
    ((cf & 0b11) << 8) +
    ((ll & 0b11) << 6) +
    ((aaa & 0b111) << 3) +
    (bbb & 0b111);
  return `--lqip:${lqip.toFixed(0)}`;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

// find the best bit configuration that would produce a color closest to target
function findOklabBits(targetL, targetA, targetB) {
  const targetChroma = Math.hypot(targetA, targetB);
  const scaledTargetA = scaleComponentForDiff(targetA, targetChroma);
  const scaledTargetB = scaleComponentForDiff(targetB, targetChroma);

  let bestBits = [0, 0, 0];
  let bestDifference = Infinity;

  for (let lli = 0; lli <= 0b11; lli++) {
    for (let aaai = 0; aaai <= 0b111; aaai++) {
      for (let bbbi = 0; bbbi <= 0b111; bbbi++) {
        const { L, a, b } = bitsToLab(lli, aaai, bbbi);
        const chroma = Math.hypot(a, b);
        const scaledA = scaleComponentForDiff(a, chroma);
        const scaledB = scaleComponentForDiff(b, chroma);

        const difference = Math.hypot(
          L - targetL,
          scaledA - scaledTargetA,
          scaledB - scaledTargetB,
        );

        if (difference < bestDifference) {
          bestDifference = difference;
          bestBits = [lli, aaai, bbbi];
        }
      }
    }
  }

  return { ll: bestBits[0], aaa: bestBits[1], bbb: bestBits[2] };
}
function rgbToOkLab(c) {
  const r = gamma_inv(c.r / 255);
  const g = gamma_inv(c.g / 255);
  const b = gamma_inv(c.b / 255);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  return {
    L: l * +0.2104542553 + m * +0.793617785 + s * -0.0040720468,
    a: l * +1.9779984951 + m * -2.428592205 + s * +0.4505937099,
    b: l * +0.0259040371 + m * +0.7827717662 + s * -0.808675766,
  };
}

function gamma_inv(x) {
  return x >= 0.04045 ? Math.pow((x + 0.055) / 1.055, 2.4) : x / 12.92;
}

// Scales a or b of Oklab to move away from the center
// so that euclidean comparison won't be biased to the center
function scaleComponentForDiff(x, chroma) {
  return x / (1e-6 + Math.pow(chroma, 0.5));
}

function bitsToLab(ll, aaa, bbb) {
  const L = (ll / 0b11) * 0.6 + 0.2;
  const a = (aaa / 0b1000) * 0.7 - 0.35;
  const b = ((bbb + 1) / 0b1000) * 0.7 - 0.35;
  return { L, a, b };
}

module.exports = {
  generateLQIP
};