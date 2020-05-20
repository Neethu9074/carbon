import React from 'react';

import ThresholdConditionFormGroup from 'in-new-components/Alerting/advanced/ThresholdConditionFormGroup';

export default {
  title: 'Molecules|alerting/advanced/ThresholdConditionFormGroup',
  component: ThresholdConditionFormGroup
};

const somePadding = { padding: '0.5em' };

export const simple = () => {
  return (
    <ThresholdConditionFormGroup iconType="lib_datetime_timerange" label="Condition">
      <label style={somePadding}>Limit:</label>
      <input name="limit" placeholder="minimum value of xxx" />
    </ThresholdConditionFormGroup>
  );
};
