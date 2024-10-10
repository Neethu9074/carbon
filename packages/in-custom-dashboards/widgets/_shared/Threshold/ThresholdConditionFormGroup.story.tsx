/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import ThresholdConditionFormGroup from 'in-custom-dashboards/widgets/_shared/Threshold/ThresholdConditionFormGroup';

export default {
  component: ThresholdConditionFormGroup
};

const somePadding = { padding: '0.5em' };

export const simple = () => {
  return (
    <ThresholdConditionFormGroup label="Condition">
      <label style={somePadding}>Limit:</label>
      <input name="limit" placeholder="minimum value of xxx" />
    </ThresholdConditionFormGroup>
  );
};
