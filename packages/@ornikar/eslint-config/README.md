# @ornikar/eslint-config

Ornikar eslint config

Based on Airbnb.

### base

1. `npm install --save-dev eslint @ornikar/eslint-config eslint-plugin-prettier eslint-plugin-import`
2. Add `"extends": "@ornikar"` to your eslint config

### babel

Lint with babel parser

1. `npm install --save-dev eslint babel-eslint @ornikar/eslint-config eslint-plugin-prettier eslint-plugin-import`
2. Add `"extends": "@ornikar/eslint-config/babel"` to your eslint config

### react

Lint with babel parser and with react

1. `npm install --save-dev eslint babel-eslint @ornikar/eslint-config eslint-config-airbnb eslint-plugin-prettier eslint-plugin-import eslint-plugin-react eslint-plugin-jsx-a11y`
2. Add `"extends": ["@ornikar/eslint-config/babel", "@ornikar/eslint-config/react"]` to your eslint config

### react-native

Lint with babel parser and with react for react-native

1. `npm install --save-dev eslint babel-eslint @ornikar/eslint-config eslint-config-airbnb eslint-plugin-prettier eslint-plugin-import eslint-plugin-react eslint-plugin-jsx-a11y`
2. Add `"extends": ["@ornikar/eslint-config/babel", "@ornikar/eslint-config/react-native"]` to your eslint config

### node without babel

1. `npm install --save-dev eslint @ornikar/eslint-config eslint-plugin-prettier eslint-plugin-node`
2. Add `"extends": ["@ornikar", "@ornikar/eslint-config/node"]` to your eslint config
