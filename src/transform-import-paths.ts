import Types, {Identifier} from '@babel/types';
import {Visitor} from '@babel/traverse';

import {getArg, getPath} from './helpers';

type PluginTypes = {types: typeof Types};

export default function ({types: t}: PluginTypes) {
  const visitor: Visitor<any> = {
    CallExpression(path, state) {
      if ((path.node.callee as Identifier).name !== 'require') return;

      const args = path.node.arguments;

      if (!args.length) return;

      const firstArg = getArg(t, args[0]);

      if (firstArg) {
        firstArg.value = getPath(firstArg.value, state.opts, state.file.opts.filename);
      }
    },
    ImportDeclaration(path, state) {
      path.node.source.value = getPath(path.node.source.value, state.opts, state.file.opts.filename);
    },
    ExportNamedDeclaration(path, state) {
      if (path.node.source) {
        path.node.source.value = getPath(path.node.source.value, state.opts, state.file.opts.filename);
      }
    },
    ExportAllDeclaration(path, state) {
      if (path.node.source) {
        path.node.source.value = getPath(path.node.source.value, state.opts, state.file.opts.filename);
      }
    }
  };

  return {
    visitor: {
      Program(path, state) {
        path.traverse(visitor, state);
      }
    },
  }
}
