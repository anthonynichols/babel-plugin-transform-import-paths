const path = require('path');
const {
  transformSync,
  transformFileSync,
} = require('@babel/core');
const slash = require('slash');

const transformImportPaths = require('../src/transform-import-paths');

describe('Babel Plugin Transform Import Paths', () => {
  let pluginOptions = {
    plugins: [
      [transformImportPaths, {
        '_': 'src',
      }],
    ],
  };

  let pluginOptionsForMocks = {
    plugins: [
      [transformImportPaths, {
        '_': 'tests/mocks/src',
      }],
    ],
  };

  it('should transform an import path', () => {
    let code = slash('import { Menu } from "_/components"');
    let expectedImport = slash('import { Menu } from "./src/components"');
    let transformed = transformSync(code, pluginOptions);

    expect(transformed.code).toContain(expectedImport);
  });

  it('shold transform multiple import paths', () => {
    let code = slash('' +
      'import { Menu } from "_/components";' + '\n' +
      'import Foo from "~/models/foo";'
    );
    let expectedImport = slash('' +
      'import { Menu } from "./src/components";' + '\n' +
      'import Foo from "./src/something/else/models/foo";'
    );
    let transformed = transformSync(code, {
      plugins: [
        [transformImportPaths, {
          '_': 'src',
          '~': 'src/something/else',
        }],
      ],
    });

    expect(transformed.code).toContain(expectedImport);
  });

  it('should transform an import path in a file', () => {
    let file = path.resolve('tests/mocks/src/foo/bar/baz/baz-file.js');
    let expectedImport = slash('import foo from "../../foo-file";');
    let transformed = transformFileSync(file, pluginOptionsForMocks)

    expect(transformed.code).toContain(expectedImport);
  });

  it('shold transform multiple import paths in a file', () => {
    let file = path.resolve('tests/mocks/src/foo/bar/baz/blarg-file.js');
    let expectedImport = slash('' +
      'import foo from "../../foo-file";' + '\n' +
      'import bar from "../bar-file";'
    );
    let transformed = transformFileSync(file, {
      plugins: [
        [transformImportPaths, {
          '_': 'tests/mocks/src',
          '~': 'tests/mocks/src/foo/bar',
        }],
      ],
    });

    expect(transformed.code).toContain(expectedImport);
  });

  it('should transform an export path', () => {
    let code = slash('export * from "_/components"');
    let expectedCode = slash('export * from "./src/components";');
    let transformed = transformSync(code, pluginOptions);

    expect(transformed.code).toContain(expectedCode);
  });

  it('should transform an export path in a file', () => {
    let file = path.resolve('tests/mocks/src/foo/bar/baz/quux-file.js');
    let expectedCode = slash('export { Menu } from "../../foo-file";');
    let transformed = transformFileSync(file, pluginOptionsForMocks);

    expect(transformed.code).toContain(expectedCode);
  });

  it('should transform a require path', () => {
    let code = slash('const Menu = require("_/components");');
    let expectedImport = slash('const Menu = require("./src/components");');
    let transformed = transformSync(code, pluginOptions);

    expect(transformed.code).toContain(expectedImport);
  });

  it('should transform a require path in a file', () => {
    let file = path.resolve('tests/mocks/src/foo/bar/baz/baz-require-file.js');
    let expectedFileImport = slash('const foo = require("../../foo-file");');
    let transformedFile = transformFileSync(file, pluginOptionsForMocks);

    expect(transformedFile.code).toContain(expectedFileImport);
  });
});
