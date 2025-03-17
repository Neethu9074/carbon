/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack } from '@instana/components';

import ThresholdConditionFormGroupImp from 'in-custom-dashboards/widgets/_shared/Threshold/ThresholdConditionFormGroup';
import ThresholdOperatorDropdownImp from 'in-custom-dashboards/widgets/_shared/Threshold/ThresholdOperatorDropDown';
import ThresholdCondition from 'in-custom-dashboards/widgets/_shared/Threshold/ThresholdCondition';
import ThresholdForm from 'in-custom-dashboards/widgets/_shared/Threshold/ThresholdForm';

export default {
  component: ThresholdForm
};

export const ThresholdConditionWarning = {
  render: () => (
    <ThresholdCondition
      type="warning"
      operator=">"
      label="Warning"
      field={{
        value: '1',
        valid: true,
        touched: false
      }}
      onChange={() => {}}
      formatterId="number"
    />
  ),

  name: 'ThresholdCondition - warning'
};

export const ThresholdConditionError = {
  render: () => (
    <ThresholdCondition
      type="critical"
      operator="<="
      label="Critical"
      field={{
        value: '1',
        valid: true,
        touched: false
      }}
      onChange={() => {}}
      formatterId="number"
    />
  ),

  name: 'ThresholdCondition - error'
};

export const ThresholdOperatorDropdown = {
  render: () => (
    <Stack direction="vertical" align="start">
      <ThresholdOperatorDropdownImp
        field={{
          value: '>',
          valid: true,
          touched: false
        }}
        onChange={() => {}}
      />
    </Stack>
  ),

  name: 'ThresholdOperatorDropdown'
};

export const ThresholdConditionFormGroup = {
  render: () => (
    <ThresholdConditionFormGroupImp label="Condition">
      <label
        style={{
          padding: '0.5em'
        }}
      >
        Limit:
      </label>
      <input name="limit" placeholder="minimum value of xxx" />
    </ThresholdConditionFormGroupImp>
  ),

  name: 'ThresholdConditionFormGroup'
};
