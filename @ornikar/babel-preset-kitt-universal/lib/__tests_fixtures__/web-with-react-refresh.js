/* eslint-disable no-useless-escape */

'use strict';

exports.presetOptions = {
  isWeb: true,
  enableStyledComponentsReactNativeImport: true,
  styledComponentsOptions: { ssr: false },
};

exports.babelPresets = [['@babel/preset-react', { runtime: 'automatic' }]];

exports.babelPlugins = [['react-refresh/babel', { skipEnvCheck: true }]];

exports.actual = `
import styled from 'styled-components/native';
const Button = styled.View\`
  display: flex;
\`;

function TestComponentUsingButton() {
  return <Button />;
}
`;

exports.expected = `
import * as BabelPluginStyledComponentsReactNative from "react-native";
import styled from 'styled-components/native';
import { jsx as _jsx } from "react/jsx-runtime";
const Button = /*#__PURE__*/styled(BabelPluginStyledComponentsReactNative.View).withConfig({
  displayName: "web-with-react-refresh__Button"
})(["display:flex;"]);
_c = Button;

function TestComponentUsingButton() {
  return /*#__PURE__*/_jsx(Button, {});
}

_c2 = TestComponentUsingButton;

var _c, _c2;

$RefreshReg\$(_c, "Button");
$RefreshReg\$(_c2, "TestComponentUsingButton");
`;
