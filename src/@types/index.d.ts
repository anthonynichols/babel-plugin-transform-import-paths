interface NodeJSGlobal extends NodeJS.Global {
  rootPath?: string,
}

interface ImportDeclarationPath {
  node: import('@babel/types').ImportDeclaration,
}

interface ImportDeclarationState {
  opts: any, // For now...
}
