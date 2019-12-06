'use strict';

module.exports = {
  extends: [
    'eslint-config-airbnb-base',
    '@ornikar/eslint-config/plugins/filenames',
    '@ornikar/eslint-config/plugins/prettier',
    '@ornikar/eslint-config/plugins/unicorn',
    './plugins/prefer-class-properties',
    '@ornikar/eslint-config/rules/best-practices',
    '@ornikar/eslint-config/rules/code-quality',
    '@ornikar/eslint-config/rules/style',
    '@ornikar/eslint-config/rules/expert',
  ].map(require.resolve),

  parserOptions: {
    sourceType: 'module',
  },

  rules: {
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-commonjs.md
    // disallow require when using babel
    'import/no-commonjs': 'error',

    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/import/no-extraneous-dependencies.md
    // override default airbnb exceptions
    'import/no-extraneous-dependencies': ['error', { devDependencies: false }],

    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-anonymous-default-export.md
    // Empeche de créer des composants et de les exporter sans les nommer.
    // Exemple: `export default () => { return <Logo color="black" />; };`
    // Ce qu'il faut faire: `export default function BlackLogo() { return <Logo color="black" /> };`
    // Lorsque des componsants n'ont pas de noms, react nous envoie des erreurs avec une stack pas explicite.
    // Les noms disparaissent lors de la minification du bundle, lorsqu'il ne sont pas utilisés et que ce sont des default.
    'import/no-anonymous-default-export': [
      'error',
      {
        allowArray: true,
        allowArrowFunction: false,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowCallExpression: true,
        allowLiteral: true,
        allowObject: true,
      },
    ],
  },
};
