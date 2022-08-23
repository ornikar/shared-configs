# babel-preset-kitt-universal

## Features

This preset is for using kitt-universal with styled-components and linaria, for both web and native with react-native.

## Install

```bash
npm install --save-dev --save-exact @ornikar/babel-preset-kitt-universal
```

## Usage

### Via `babel.config.json`

```json
{
  "presets": [["@ornikar/babel-preset-kitt-universal", { "isWeb": true }]]
}
```

```json
{
  "presets": [["@ornikar/babel-preset-kitt-universal", { "isWeb": true, "styledComponentsOptions": { "ssr": false } }]]
}
```
