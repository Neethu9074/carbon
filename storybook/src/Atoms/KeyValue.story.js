import { withKnobs, select } from '@storybook/addon-knobs';
import React from 'react';

import KeyValue, { themes } from 'in-new-components/KeyValue/KeyValue';

export default {
  title: 'Atoms|Key Value',
  component: KeyValue,
  decorators: [withKnobs]
};

export const regular = () => {
  return (
    <KeyValue
      label="key"
      value="value"
      inverted={select(
        'Inverted',
        {
          yes: true,
          no: false
        },
        false
      )}
      accentuated={select(
        'Accentuated',
        {
          yes: true,
          no: false
        },
        false
      )}
      theme={select(
        'Theme',
        {
          default: themes.default,
          blue: themes.blue
        },
        themes.default
      )}
    />
  );
};
