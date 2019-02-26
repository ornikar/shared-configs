# @ornikar/eslint-config-node

Ornikar node eslint config

Based on Airbnb.

Also see:

- [@ornikar/eslint-config](https://github.com/ornikar/shared-configs/tree/master/%40ornikar/eslint-config)
- [@ornikar/eslint-config-babel](https://github.com/ornikar/shared-configs/tree/master/%40ornikar/eslint-config-babel)
- [@ornikar/eslint-config-react](https://github.com/ornikar/shared-configs/tree/master/%40ornikar/eslint-config-react)
- [@ornikar/eslint-config-typescript](https://github.com/ornikar/shared-configs/tree/master/%40ornikar/eslint-config-typescript)
- [@ornikar/eslint-config-typescript-react](https://github.com/ornikar/shared-configs/tree/master/%40ornikar/eslint-config-typescript-react)

### node without babel or typescript

1. `npm install --save-dev eslint @ornikar/eslint-config eslint-plugin-filenames eslint-plugin-prettier eslint-plugin-unicorn @ornikar/eslint-config-node eslint-plugin-node`
2. Add `"extends": ["@ornikar", "@ornikar/eslint-config/node"]` to your eslint config

### node with babel

1. `npm install --save-dev eslint @ornikar/eslint-config-babel eslint-plugin-filenames eslint-plugin-import eslint-plugin-prettier eslint-plugin-unicorn @ornikar/eslint-config-node eslint-plugin-node`
2. Add `"extends": ["@ornikar/eslint-config-babel", "@ornikar/eslint-config-node""]` to your eslint config

### node with typescript

1. `npm install --save-dev eslint @ornikar/eslint-config-typescript eslint-plugin-filenames eslint-plugin-import eslint-plugin-prefer-class-properties eslint-plugin-prettier eslint-plugin-unicorn @typescript-eslint/eslint-plugin @typescript-eslint/parser @ornikar/eslint-config-node eslint-plugin-node`
2. Add `"extends": ["@ornikar/eslint-config-typescript", "@ornikar/eslint-config-node""]` to your eslint config
