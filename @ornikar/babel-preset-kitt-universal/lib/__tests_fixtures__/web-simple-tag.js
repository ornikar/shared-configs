'use strict';

exports.presetOptions = {
  isWeb: true,
  enableStyledComponentsReactNativeImport: true,
  styledComponentsOptions: { ssr: false },
};

exports.actual = `
import styled from 'styled-components/native';
const Button = styled.View\`
  display: flex;
\`;
`;

exports.expected = `
import * as BabelPluginStyledComponentsReactNative from "react-native";
import styled from 'styled-components/native';
const Button = /*#__PURE__*/styled(BabelPluginStyledComponentsReactNative.View).withConfig({
  displayName: "web-simple-tag__Button"
})(["display:flex;"]);
`;
