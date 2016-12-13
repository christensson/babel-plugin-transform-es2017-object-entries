const obj1 = {
  k1: "v1",
  k2: "v2",
  complex: {
    "a1": "b1",
    "a2": "b2"
  }
};
console.log("keys", Object.keys(obj1));
console.log("values", Object.values(obj1));
console.log("entries", Object.entries(obj1));
