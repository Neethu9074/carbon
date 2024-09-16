/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ThresholdOperator } from '@instana/types';
import { Dropdown } from '@instana/components';

import locals from 'in-alerting/smart-alerts/slo/components/OperatorDropdown.mless';

const SLO_ALERT_OPERATORS: ThresholdOperator[] = ['>', '>=', '<', '<='];

interface OperatorDropdownProps {
  value: ThresholdOperator;
  onChange: (operator: ThresholdOperator) => void;
}

export default function OperatorDropdown({ value, onChange }: OperatorDropdownProps) {
  return (
    <div className={locals.dropdownContainer}>
      <Dropdown
        items={SLO_ALERT_OPERATORS.map(operator => ({
          label: operator,
          value: operator
        }))}
        onChange={option => {
          if (!option) return;

          onChange(option);
        }}
        value={value}
      />
    </div>
  );
}

export function isSloAlertOperator(operator: string): operator is ThresholdOperator {
  return SLO_ALERT_OPERATORS.includes(operator as ThresholdOperator);
}
