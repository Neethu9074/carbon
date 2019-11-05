import RadioGroup from 'in-analyze/components/RadioButtons/RadioGroup';
import { storiesOf } from '@storybook/react';
import React from 'react';

storiesOf('Analyse/RadioGroup', module)
  .add('Default', sourceEntityAvailability => <RadioGroup sourceEntityAvailability={sourceEntityAvailability} />)
  .add('Destination Active', sourceEntityAvailability => (
    <RadioGroup value="DESTINATION" sourceEntityAvailability={sourceEntityAvailability} />
  ))
  .add('Disabled', sourceEntityAvailability => (
    <RadioGroup value="NOT_APPLICABLE" disabled sourceEntityAvailability={sourceEntityAvailability} />
  ))
  .add('Source entity not available', sourceEntityAvailability => (
    <RadioGroup value="NOT_APPLICABLE" sourceEntityAvailability={!sourceEntityAvailability} />
  ));
