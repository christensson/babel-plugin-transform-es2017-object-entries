# babel-plugin-transform-es2017-object-entries
Babel plugin for transforming ES2017 features Object.entries and Object.keys.

This plugin replaces calls to `Object.entries()` and `Object.values()` with calls to generated functions. The generated functions are ES5 compliant.

## Example `.babelrc` configuration
```
{
  "plugins": ["transform-es2017-object-entries"]
}
```

## Related work
Other plugins exist, like [babel-plugin-transform-object-entries](https://www.npmjs.com/package/babel-plugin-transform-object-entries) which only deals with `Object.entries()` and instead imports implementation from core-js.
