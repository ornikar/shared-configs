'use strict';

exports.makeDecorator = ({ name, parameterName, wrapper, skipIfNoParametersOrOptions = false }) => {
  const decorator = (options) => (storyFn, context) => {
    const parameters = context.parameters && context.parameters[parameterName];

    if (parameters && parameters.disable) {
      return storyFn(context);
    }

    if (skipIfNoParametersOrOptions && !options && !parameters) {
      return storyFn(context);
    }

    return wrapper(storyFn, context, {
      options,
      parameters,
    });
  };

  return (...args) => {
    if (typeof args[0] === 'function') {
      return decorator()(...args);
    }

    return (...innerArgs) => {
      if (innerArgs.length > 1) {
        if (args.length > 1) {
          return decorator(args)(...innerArgs);
        }
        return decorator(...args)(...innerArgs);
      }

      throw new Error(
        `Passing stories directly into ${name}() is not allowed,
        instead use addDecorator(${name}) and pass options with the '${parameterName}' parameter`,
      );
    };
  };
};
