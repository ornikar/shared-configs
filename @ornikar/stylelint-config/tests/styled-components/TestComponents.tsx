import styled from 'styled-components/native';

// Create a Title component that'll render an <h1> tag with some styles
const Title = styled.h1`
  /* stylelint-disable-next-line declaration-property-value-allowed-list */
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`;

// Create a Wrapper component that'll render a <section> tag with some styles
const Wrapper = styled.section`
  font-size: inherit;
  padding: 4em;
  background: papayawhip;
  /* stylelint-disable-next-line declaration-block-no-duplicate-properties */
  background: papayawhip;

  padding-vertical: 4em;
`;

const StyledTypography = styled.Text`
  ${({ theme, isHeader, type, variant }) => {
    const { headers, bodies } = theme.typography.types;
    return `
  font-family: ${isHeader ? headers.fontFamily[variant] : bodies.fontFamily[variant]};
  font-size: ${isHeader ? headers.configs[type].baseAndSmall.fontSize : bodies.configs[type].baseAndSmall.fontSize};
  font-weight: ${isHeader ? headers.fontWeight : bodies.fontWeight[variant]};
  line-height: ${
    isHeader ? headers.configs[type].baseAndSmall.lineHeight : bodies.configs[type].baseAndSmall.lineHeight
  };
  font-style: ${isHeader ? headers.fontStyle : bodies.fontStyle[variant]};
      `;
  }}
  color: ${({ theme, color }) => theme.typography.colors[color]};
  text-decoration-color: ${({ theme, color }) => theme.typography.colors[color]};
`;
