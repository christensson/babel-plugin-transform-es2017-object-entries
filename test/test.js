"use strict";
const mocha = require("mocha");
const { assert } = require("chai");
const wrapper = require("./transpiled_wrapper")

describe("test", function() {
  const testObjs = [
    {
      id: "flat object",
      data: {
        a: "1",
        b: 2,
        c: "test"
      }
    },
    {
      id: "complex object",
      data: {
        a: true,
        b: false,
        c: {
          ab: { a: "b" },
          cd: [ 1, 2, 3]
        },
        d: [ true, false ]
      }
    },
    {
      id: "empty object",
      data: {}
    },
  ];

  describe("Object.values", function() {
    for (const obj of testObjs) {
      it("shall work according to reference with data " + obj.id, function() {
        assert.deepEqual(wrapper.objectValues(obj.data), Object.values(obj.data));
      });
    }
  });

  describe("Object.entries", function() {
    for (const obj of testObjs) {
      it("shall work according to reference with data " + obj.id, function() {
        assert.deepEqual(wrapper.objectEntries(obj.data), Object.entries(obj.data));
      });
    }
  });
});
