import { withKnobs, select } from '@storybook/addon-knobs';
import React from 'react';

import KeyValue, { themes } from 'in-new-components/lists/KeyValue';

export default {
  title: 'Atoms|Key Value',
  component: KeyValue,
  decorators: [withKnobs]
};

export const regular = () => {
  return (
    <KeyValue
      label="This is Ä g key"
      value="This is Ä g value"
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
