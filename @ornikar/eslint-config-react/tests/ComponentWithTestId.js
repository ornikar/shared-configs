import React from 'react';
import PropTypes from 'prop-types';

export function ComponentWithTestId({ 'data-testid': dataTestId }) {
  return <div data-testid={dataTestId} />;
}

ComponentWithTestId.propTypes = {
  'data-testid': PropTypes.string,
};

export function ComponentUsingComponentWithTestId() {
  return <ComponentUsingComponentWithTestId data-testid="testid" />;
}
