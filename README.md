# Babel Plugin Transform Import Paths
Similar to Webpack's [`resolve.alias`](https://webpack.js.org/configuration/resolve/#resolve-alias), this plugin transforms `import`, `export`, and `require` paths.

>This plugin is inspired by [`babel-plugin-root-imports`](https://github.com/entwicklerstube/babel-plugin-root-import)

- Babel v7 has changed their plugin options API, which broke configuring multiple path in `babel-plugin-root-imports`.
- I wanted a succinct syntax similar to Webpack's `resolve.alias` configuration.
- Typescript doesn't support transforming paths during compile (despite supporting the `baseUrl` and `paths` configuration options for resolving modules). This will allow using Babel v7 to transpile Typescript and transforming paths. Or, you can transpile using Typescript and then run Babel on the Typescript-transpiled code just to transform the paths.

## Install
**npm**
```
npm install --save-dev babel-plugin-transform-import-paths
```
**yarn**
```
yarn add --dev babel-plugin-transform-import-paths
```

## Usage
In your `.baberc` or `.babelrc.js` file:
```javascript
{
  "plugins": [
    ["babel-plugin-transform-import-paths", {
      "~": "src",
    }]
  ]
}
```

## Example

```javascript
// Before
import { Menu } from "~/components";
// After
import { Menu } from "../../../components";
```

Pass multiple paths
```javascript
// .babelrc or .babelrc.js
{
  "plugins": [
    ["babel-plugin-transform-import-paths", {
      "~": "src",
      "_": "src/something/nested",
      "MyFiles": "src/my-files"
    }]
  ]
}

// src/some/nested/file/index.js
import Foo from "~/location-of-foo";
import Bar from "_/location-of-bar";
import Baz from "MyFiles";

// After
import Foo from "../../location-of-foo";
import Bar from "../../something/nested/location-of-bar";
import Baz from "../../my-files";
```

