import path from 'path';
import slash from 'slash';
import Types, {CallExpression, Expression} from 'babel-types';

export function getArg(t: typeof Types, arg: CallExpression['arguments'] | Expression) {
  if (t.isStringLiteral(arg)) {
    return arg;
  }

  if (t.isBinaryExpression(arg)) {
    return getArg(t, arg.left);
  }

  return;
}

export function getPath(importPath: string, options = {}, sourceFile = '') {
  for (let prop in options) {
    if (hasPrefix(prop, importPath)) {
      return transformPath(importPath, prop, options[prop], slash(sourceFile))
    }
  }
}

export function hasPrefix(prefix: string, importPath = '') {
  if (importPath.substring(0, prefix.length) === prefix) {
    return true;
  }

  if (importPath.substring(0, prefix.length + 1) === `${prefix}/`) {
    return true;
  }

  return false;
}

export function isRootPath(importPath: string) {
  return (importPath.substring(0, 1) === '/') ? true : false;
}

export function withoutRootPathPrefix(importPath: string) {
  return isRootPath(importPath)
    ? importPath.substring(1, importPath.length)
    : importPath;
}

export function transformPath(importPath: string, prop: string, value: string, sourceFile = '') {
  let replacedPath = importPath.replace(prop, value);
  let absolutePath = path.resolve(`./${replacedPath}`);
  let sourcePath = sourceFile.substring(0, sourceFile.lastIndexOf('/'));
  let relativePath = slash(path.relative(sourcePath, absolutePath));

  if (relativePath.indexOf('../') !== 0) {
    relativePath = './' + relativePath;
  }

  if (importPath[importPath.length - 1] === '/') {
    relativePath += '/';
  }

  return relativePath;
}
