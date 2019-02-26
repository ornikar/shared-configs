'use strict';

module.exports = {
  rules: {
    /* added rules */

    // Prevent direct mutation of this.state
    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/no-direct-mutation-state.md
    'react/no-direct-mutation-state': 'error',

    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md
    'react/jsx-sort-props': [
      'error',
      {
        noSortAlphabetically: true,
        reservedFirst: true,
        shorthandFirst: true,
        callbacksLast: true,
      },
    ],

    // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-sort-props.md
    'react/sort-prop-types': [
      'error',
      {
        noSortAlphabetically: true,
        requiredFirst: false,
        callbacksLast: true,
      },
    ],

    /* changed rules */

    // https://github.com/yannickcr/eslint-plugin-react/blob/843d71a432baf0f01f598d7cf1eea75ad6896e4b/docs/rules/sort-comp.md
    'react/sort-comp': [
      'error',
      {
        order: [
          'react-statics',
          'static-methods',
          'instance-variables',
          'lifecycle',
          'getters',
          'setters',
          'instance-methods',
          '/^(on|handle).+$/',
          'everything-else',
          'rendering',
        ],
        groups: {
          'react-statics': ['propTypes', 'defaultProps'],
          lifecycle: [
            'state',
            'constructor',
            'getDerivedStateFromProps',
            'componentWillMount',
            'UNSAFE_componentWillMount',
            'componentDidMount',
            'componentWillReceiveProps',
            'UNSAFE_componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'UNSAFE_componentWillUpdate',
            'getSnapshotBeforeUpdate',
            'componentDidUpdate',
            'componentDidCatch',
            'componentWillUnmount',
          ],
          rendering: ['/^render.+$/', 'render'],
        },
      },
    ],

    /* disabled rules */

    // https://github.com/yannickcr/eslint-plugin-react/issues/1009
    'react/require-default-props': 'off',

    // disable force destructuring for state and props
    'react/destructuring-assignment': 'off',

    // project should use babel-plugin-transform-react-remove-prop-types
    'react/forbid-foreign-prop-types': 'off',

    // autofix handles quotes incorrectly
    'react/jsx-curly-brace-presence': 'off',
  },
};
