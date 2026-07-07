'use strict';

const nodeConfig = require('@ornikar/eslint-config/node');
const rootConfig = require('@ornikar/eslint-config/root');
const testsOverride = require('@ornikar/eslint-config/tests-override');
// eslint-disable-next-line import/no-unresolved -- `eslint/config` subpath export is not seen by the import resolver
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  // Global ignores — translated from .eslintignore (+ rollup-config `ignorePatterns`).
  {
    ignores: [
      '**/node_modules/**',
      '**/*.d.ts',
      '.yarn/**',
      '@ornikar/stylelint-config/tests/**',
      '@ornikar/rollup-config/__fixtures__/**',
    ],
  },

  // Repo-root JS files (lint-staged.config.js, scripts/**) → root config (allows dev deps).
  {
    files: ['*.{js,cjs,mjs}', 'scripts/**/*.{js,cjs,mjs}'],
    extends: [rootConfig],
  },

  // ===== @ornikar/babel-preset-base =====
  {
    files: ['@ornikar/babel-preset-base/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
  },

  // ===== @ornikar/babel-preset-kitt-universal =====
  {
    files: ['@ornikar/babel-preset-kitt-universal/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
  },
  {
    files: ['@ornikar/babel-preset-kitt-universal/**/*.test.js'],
    extends: [testsOverride],
  },

  // ===== @ornikar/babel-preset-react =====
  {
    files: ['@ornikar/babel-preset-react/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
  },

  // ===== @ornikar/browserslist-config =====
  {
    files: ['@ornikar/browserslist-config/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
  },

  // ===== @ornikar/commitlint-config =====
  {
    files: ['@ornikar/commitlint-config/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
  },

  // ===== @ornikar/graphql-config =====
  {
    files: ['@ornikar/graphql-config/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
  },

  // ===== @ornikar/intl-config =====
  {
    files: ['@ornikar/intl-config/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-non-literal-require': 'off',
    },
  },

  // ===== @ornikar/jest-config =====
  {
    files: ['@ornikar/jest-config/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-non-literal-require': 'off',
    },
  },

  // ===== @ornikar/jest-config-react =====
  {
    files: ['@ornikar/jest-config-react/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-non-literal-require': 'off',
    },
  },

  // ===== @ornikar/jest-config-react-native =====
  {
    files: ['@ornikar/jest-config-react-native/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
  },

  // ===== @ornikar/jest-config-react-native-web =====
  {
    files: ['@ornikar/jest-config-react-native-web/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
  },

  // ===== @ornikar/monorepo-config =====
  {
    files: ['@ornikar/monorepo-config/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-non-literal-require': 'off',
    },
  },

  // ===== @ornikar/postcss-config =====
  {
    files: ['@ornikar/postcss-config/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
  },

  // ===== @ornikar/prettier-config =====
  {
    files: ['@ornikar/prettier-config/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
  },

  // ===== @ornikar/renovate-config =====
  {
    files: ['@ornikar/renovate-config/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
  },

  // ===== @ornikar/repo-config =====
  {
    files: ['@ornikar/repo-config/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-non-literal-require': 'off',
    },
  },

  // ===== @ornikar/repo-config-react =====
  {
    files: ['@ornikar/repo-config-react/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
    },
  },

  // ===== @ornikar/repo-config-react-legacy-css =====
  {
    files: ['@ornikar/repo-config-react-legacy-css/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
    },
  },

  // ===== @ornikar/rollup-config =====
  {
    files: ['@ornikar/rollup-config/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-non-literal-require': 'off',
    },
  },
  {
    files: ['@ornikar/rollup-config/**/*.test.js'],
    extends: [testsOverride],
  },

  // ===== @ornikar/storybook-config =====
  {
    files: ['@ornikar/storybook-config/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
    rules: {
      'security/detect-non-literal-fs-filename': 'off',
      'security/detect-non-literal-require': 'off',
    },
  },

  // ===== @ornikar/stylelint-config =====
  {
    files: ['@ornikar/stylelint-config/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
  },

  // ===== @ornikar/webpack-config =====
  {
    files: ['@ornikar/webpack-config/**/*.{js,cjs,mjs}'],
    extends: [nodeConfig],
  },
]);
