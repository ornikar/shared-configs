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

1. `npm install --save-dev eslint @ornikar/eslint-config @ornikar/eslint-config-node`
2. Add `"extends": ["@ornikar/eslint-config", "@ornikar/eslint-config-node"]` to your eslint config

### node with babel

1. `npm install --save-dev eslint @ornikar/eslint-config-babel @ornikar/eslint-config-node`
2. Add `"extends": ["@ornikar/eslint-config-babel", "@ornikar/eslint-config-node""]` to your eslint config

### node with typescript

1. `npm install --save-dev eslint @ornikar/eslint-config-typescript @ornikar/eslint-config-node`
2. Add `"extends": ["@ornikar/eslint-config-typescript", "@ornikar/eslint-config-node"]` to your eslint config

### module override

```json
{
  "extends": ["@ornikar/eslint-config-typescript", "@ornikar/eslint-config-node"],
  "overrides": [
    {
      "files": ["test-setup.js"],
      "extends": ["@ornikar/eslint-config-node/module-override"]
    }
  ]
}
```
