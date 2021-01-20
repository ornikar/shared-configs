# @ornikar/postcss-config

Ornikar postcss config

## Usage

Configure browserslist with `@ornikar/browserslist-config`.

Create `postcss.config.js`:

```js
const plugins = require('@ornikar/postcss-config');

module.exports = ({ options }) => ({
  plugins: [
    ...plugins.syntaxPlugins(),

    plugins.themePlugin({
      importFrom: 'path/to/theme.css',
      preserve: process.env.NODE_ENV !== 'production',
    }),

    plugins.customMediaPlugin({
      importFrom: 'path/to/breakpoints.css',
      preserve: process.env.NODE_ENV !== 'production',
    }),

    plugins.autoprefixerPlugin(),

    // add other plugins if you need to :)

    // production
    ...(process.env.NODE_ENV === 'production' ? plugins.productionPlugins() : []),
  ],
});
```
