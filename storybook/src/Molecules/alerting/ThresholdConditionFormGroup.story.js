/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ThresholdConditionFormGroup from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup';

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
