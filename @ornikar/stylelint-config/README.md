# @ornikar/stylelint-config

DEPRECATED: with kitt-universal, use css in js which is linted by eslint and typescript.

Ornikar stylelint config

## styled-components for the web

Add a `.stylelintrc.json`:

```json
{
  "extends": "@ornikar/stylelint-config/styled-components.js",
  "reportNeedlessDisables": true
}
```

## styled-components for the react-native

Add a `.stylelintrc.json`:

```json
{
  "extends": "@ornikar/stylelint-config/styled-components-native.js",
  "reportNeedlessDisables": true
}
```

## CSS Modules (legacy)

Add a `.stylelintrc.json`:

```json
{
  "extends": "@ornikar/stylelint-config/css-modules.js",
  "reportNeedlessDisables": true
}
```

## Target CSS Modules and styled-components

You can have two config files and for each target different files. Check the examples in tests directory and "scripts" in package.json.
