import RadioGroup from 'in-analyze/components/RadioButtons/RadioGroup';
import { storiesOf } from '@storybook/react';
import React from 'react';

storiesOf('Analyse/RadioGroup', module)
  .add('Default', () => <RadioGroup />)
  .add('Destination Active', () => <RadioGroup value="DESTINATION" />)
  .add('Disabled', () => <RadioGroup value="NOT_APPLICABLE" disabled />);
