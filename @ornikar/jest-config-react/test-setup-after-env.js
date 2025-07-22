/* eslint-env jest */

'use strict';

const failOnConsole = require('jest-fail-on-console');

const deprecatedReactLifeCycleMethods = [
  'componentWillMount',
  'componentWillUnmount',
  'componentWillUpdate',
  'componentWillReceiveProps',
];

failOnConsole({
  silenceMessage: (message) => {
    // setNativeProps is used by @react-spring, so we can't do anything about it
    if (message.includes('setNativeProps is deprecated. Please update props using React state instead.')) {
      return true;
    }

    // Silence a warning from react-native-reanimated to "avoid confusion" (see https://docs.swmansion.com/react-native-reanimated/docs/guides/troubleshooting/#reduced-motion-setting-is-enabled-on-this-device).
    if (message.includes('[Reanimated] Reduced motion setting is enabled on this device.')) {
      return true;
    }

    // Do not ignore the act / await warning anymore once we are on React 18
    if (message.includes('You called act(async () => ...) without await')) return true;

    // Warning from @react-aria/ssr
    if (message.startsWith('In React 18, SSRProvider is not necessary')) return true;

    // Deprecated lifecycle methods are forbidden in our eslint config. This means any related warning is due to a dependency and can be ignored in tests.
    if (
      deprecatedReactLifeCycleMethods.some((lifecycleMethod) =>
        message.includes(`${lifecycleMethod} has been renamed, and is not recommended for use.`),
      )
    ) {
      return true;
    }

    // Native base is setting these props, which are deprecated by react-native-web
    if (message.startsWith('"shadow*" style props are deprecated. Use "boxShadow"')) return true;
    if (message.startsWith('accessibilityLabel is deprecated. Use aria-label.')) return true;
    if (message.startsWith('editable is deprecated. Use readOnly.')) return true;
    if (message.startsWith('props.pointerEvents is deprecated. Use style.pointerEvents')) return true;
    if (/"transform" style array value is deprecated/.test(message)) return true;
    // Native base does not support role prop and needs accessibilityRole which is deprecated by react-native-web
    if (message.startsWith('accessibilityRole is deprecated. Use role.')) return true;

    return false;
  },
  // TODO [react@>=19]: Remove this when we upgrade to React 19
  allowMessage: (message, methodName, context) => {
    // React 18.3 deprecation warning to prepare migration on React 19
    if (
      message.includes('is deprecated and will be removed in the next major release') &&
      message.includes('https://reactjs.org')
    ) {
      return true;
    }

    return false;
  },
});
