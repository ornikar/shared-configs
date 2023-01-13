'use strict';

exports.presetOptions = {
  isWeb: true,
  enableStyledComponentsReactNativeImport: true,
  styledComponentsOptions: { ssr: false },
};

exports.babelPresets = [
  ['@babel/preset-react', { runtime: 'automatic' }],
  [
    '@linaria/babel-preset',
    {
      babelOptions: {
        configFile: false,
        babelrc: false,
        browserslistConfigFile: false,
        presets: [['@babel/preset-react', { runtime: 'automatic' }]],
        plugins: [['babel-plugin-react-native', { OS: 'web' }]],
      },
    },
  ],
];

exports.actual = `
import { Platform } from 'react-native';
import { styled as styledLinaria } from '@linaria/react';

const PressableIconButtonWebWrapper = withTheme(styledLinaria.div\`
  & > *:hover,
  .kitt-hover & > * {
    @media (hover: none) and (pointer: coarse) {
      transform: scale(\${({ theme, $isDisabled }) => ($isDisabled ? 1 : theme.kitt.iconButton.scale.base.hover)});
    }
  }
\`);
const StyledPressableIconButton = styled.Pressable\`
  position: relative;
  background-color: transparent;

  \${({ theme, disabled }) => {
    const { iconButton } = theme.kitt;

    if (Platform.OS !== 'web') {
      return undefined;
    }

    return \`
      transition: all 200ms ease;
    \`;
  }};
  \`;


function TestComponentUsingButton() {
  return <PressableIconButtonWebWrapper />;
}
`;

exports.expected = `
import { styled as styledLinaria } from '@linaria/react';
import { jsx as _jsx } from "react/jsx-runtime";
const PressableIconButtonWebWrapper = withTheme(styledLinaria.div\`
  & > *:hover,
  .kitt-hover & > * {
    @media (hover: none) and (pointer: coarse) {
      transform: scale(\${({
  theme,
  $isDisabled
}) => $isDisabled ? 1 : theme.kitt.iconButton.scale.base.hover});
    }
  }
\`);
const StyledPressableIconButton = styled.Pressable\`
  position: relative;
  background-color: transparent;

  \${({
  theme,
  disabled
}) => {
  const {
    iconButton
  } = theme.kitt;
  if ("web" !== 'web') {
    return undefined;
  }
  return \`
      transition: all 200ms ease;
    \`;
}};
  \`;
function TestComponentUsingButton() {
  return /*#__PURE__*/_jsx(PressableIconButtonWebWrapper, {});
}
`;
