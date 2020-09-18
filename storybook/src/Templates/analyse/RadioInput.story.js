import React from 'react';

import RadioGroup from 'in-analyze/components/RadioButtons/RadioGroup';

export default {
  title: 'Templates/analyze/RadioGroup',
  component: RadioGroup
};

export function Default(sourceEntityAvailability) {
  return <RadioGroup sourceEntityAvailability={sourceEntityAvailability} />;
}

export function DestinationActive(sourceEntityAvailability) {
  return <RadioGroup value="DESTINATION" sourceEntityAvailability={sourceEntityAvailability} />;
}

export function SourceEntityDisabled(sourceEntityAvailability) {
  return <RadioGroup value="SOURCE" sourceEntityAvailability={sourceEntityAvailability} disabled />;
}

export function Disabled(sourceEntityAvailability) {
  return <RadioGroup value="NOT_APPLICABLE" disabled sourceEntityAvailability={sourceEntityAvailability} />;
}

export function SourceEntityNotAvailable(sourceEntityAvailability) {
  return <RadioGroup value="NOT_APPLICABLE" sourceEntityAvailability={!sourceEntityAvailability} />;
}
