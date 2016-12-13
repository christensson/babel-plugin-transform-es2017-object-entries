const OBJECT_ENTRIES = 'ObjectEntries';
const OBJECT_VALUES = 'ObjectValues';

function toLowerCaseFirstLetter(str) {
  return str[0].toLowerCase() + str.slice(1);
};

module.exports = function({ types: t }) {
  return {
    visitor: {
      Program: {
        enter(path, {file}) {
          file.set(OBJECT_ENTRIES, false);
          file.set(OBJECT_VALUES, false);
        },

        exit(path, {file, opts}) {
          if (!file.get(OBJECT_VALUES) && !path.scope.hasBinding(opts)) {
            return;
          }

          // TODO: Replace declar with function implementation...
          const declar = t.identifier("ping");

          path.node.body.unshift(declar);
        }
      },
      CallExpression(path, {file}) {
        let key = false;
        if (path.get('callee').matchesPattern('Object.values')) {
          key = OBJECT_VALUES;
        } else if (path.get('callee').matchesPattern('Object.entries')) {
          key = OBJECT_ENTRIES;
        }

        if (key) {
          if (!file.get(key)) {
            file.set(key, path.scope.generateUidIdentifier(toLowerCaseFirstLetter(key)));
          }

          path.node.callee = file.get(key);
        }
      },
    }
  };
}
