'use strict';

const decorator = getStory => getStory();

exports.withKnobs = (...args) => {
  // Used without options as .addDecorator(decorator)
  if (typeof args[0] === 'function') {
    return decorator(args[0]);
  }

  return (...innerArgs) => {
    return decorator(innerArgs[0]);
  };
};

exports.text = (name, value) => value;
exports.boolean = (name, value) => value;
exports.number = (name, value) => value;
exports.color = (name, value) => value;
exports.object = (name, value) => value;
exports.select = (name, options, value) => value;
exports.radios = (name, options, value) => value;
exports.array = (name, value) => value;
exports.date = (name, value) => value;
exports.button = (name, callback) => callback;
exports.files = (name, accept, value) => value;
exports.optionsKnob = (name, valuesObj, value, optionsObj) => value;
