"use strict";

const OBJECT_ENTRIES = 'ObjectEntries';
const OBJECT_VALUES = 'ObjectValues';

function toLowerCaseFirstLetter(str) {
  return str[0].toLowerCase() + str.slice(1);
};

function genForeachArray(t, loopVar, arrayVar, loopStatement) {
  return t.forStatement(
    t.variableDeclaration("var", [ t.variableDeclarator(loopVar, t.numericLiteral(0)) ]),
    t.binaryExpression("<", loopVar, t.memberExpression(arrayVar, t.identifier("length"))),
    t.updateExpression("++", loopVar),
    loopStatement
  );
}

function genObjectMemberCall(t, objName, memberName, args) {
  return t.callExpression(
    t.memberExpression(t.identifier(objName), t.identifier(memberName)),
    args
  );
}

function genVariableDeclaration(t, varName, init) {
  return t.variableDeclaration("var", [ t.variableDeclarator(t.identifier(varName), init) ]);
}

function genArrayGetIndex(t, arrayName, index) {
  return t.memberExpression(t.identifier(arrayName), index, true)
}

module.exports = function({ types: t }) {
  return {
    visitor: {
      Program: {
        enter(path, {file}) {
          file.set(OBJECT_ENTRIES, false);
          file.set(OBJECT_VALUES, false);
        },

        exit(path, {file, opts}) {
          const objectEntriesId = file.get(OBJECT_ENTRIES);
          const objectValuesId = file.get(OBJECT_VALUES);
          if (!objectEntriesId && !objectValuesId && !path.scope.hasBinding(opts)) {
            return;
          }

          if (objectEntriesId) {
            const obj = t.identifier("obj");
            const declar = t.functionExpression(objectEntriesId, [ obj ],
              t.blockStatement([
                genVariableDeclaration(t, "entries", t.arrayExpression()),
                genVariableDeclaration(t, "keys", genObjectMemberCall(t, "Object", "keys", [ obj ])),
                genForeachArray(t, t.identifier("k"), t.identifier("keys"),
                  t.expressionStatement(
                    genObjectMemberCall(t, "entries", "push", [
                        t.arrayExpression([
                          genArrayGetIndex(t, "keys", t.identifier("k")),
                          genArrayGetIndex(t, "obj", genArrayGetIndex(t, "keys", t.identifier("k")))
                        ])
                    ])
                  )
                ),
                t.returnStatement(
                  t.identifier("entries")
                )
              ])
            );
            path.node.body.unshift(declar);
          }
          if (objectValuesId) {
            const obj = t.identifier("obj");
            const declar = t.functionExpression(objectValuesId, [ obj ],
              t.blockStatement([
                genVariableDeclaration(t, "values", t.arrayExpression()),
                genVariableDeclaration(t, "keys", genObjectMemberCall(t, "Object", "keys", [ obj ])),
                genForeachArray(t, t.identifier("k"), t.identifier("keys"),
                  t.expressionStatement(
                    genObjectMemberCall(t, "values", "push", [
                        t.memberExpression(t.identifier("obj"), t.memberExpression(t.identifier("keys"), t.identifier("k"), true), true)
                    ])
                  )
                ),
                t.returnStatement(
                  t.identifier("values")
                )
              ])
            );
            path.node.body.unshift(declar);
          }
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
