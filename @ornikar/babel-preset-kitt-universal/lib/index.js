'use strict';

const checkIsWebOption = (opts) => {
  ['isWeb'].forEach((optionName) => {
    if (opts[optionName] !== undefined && typeof opts[optionName] !== 'boolean') {
      throw new Error(`Preset kitt-universal '${optionName}' option must be a boolean.`);
    }
  });
};

module.exports = function preset(context, opts = {}) {
  checkIsWebOption(opts);
  const { isWeb } = opts;

  return {
    plugins: [isWeb && ['babel-plugin-react-native', { OS: 'web' }]].filter(Boolean),
  };
};
