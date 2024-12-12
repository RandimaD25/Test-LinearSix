function projectObject(src, proto) {
  if (!src || typeof src !== "object" || !proto || typeof proto !== "object") {
    return null;
  }

  const result = {};

  for (const key in proto) {
    if (!(key in src)) {
      continue;
    }

    if (proto[key] === null) {
      result[key] = JSON.parse(JSON.stringify(src[key]));
      continue;
    }

    if (typeof proto[key] === "object" && typeof src[key] === "object") {
      const projectedChild = projectObject(src[key], proto[key]);
      if (projectedChild !== null) {
        result[key] = projectedChild;
      }
    } else if (typeof proto[key] === typeof src[key]) {
      result[key] = src[key];
    }
  }

  return result;
}

const src = {
  prop11: {
    prop21: 21,
    prop22: {
      prop31: 31,
      prop32: 32,
    },
  },
  prop12: 12,
};

const proto = {
  prop11: {
    prop22: null,
  },
};

console.log("Source:", JSON.stringify(src, null, 2));
console.log("Prototype:", JSON.stringify(proto, null, 2));
console.log("Result:", JSON.stringify(projectObject(src, proto), null, 2));
