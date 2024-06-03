/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { ThresholdOperator } from '@instana/types';
import { t } from '@instana/i18n-react';

import ComboBox, { Option, Options } from 'in-components/ComboBox/ComboBox';

import locals from './OperatorDropdown.mless';

const OPERATOR_NAMES = Object.freeze<Record<ThresholdOperator, string>>({
  '>': 'more',
  '>=': 'more-or-equal',
  '<': 'less',
  '<=': 'less-or-equal'
} as const);

export const SLO_ALERT_OPERATORS = Object.keys(OPERATOR_NAMES) as ThresholdOperator[];

interface OperatorDropdownProps {
  value: ThresholdOperator;
  onChange: (operator: ThresholdOperator) => void;
}

export default function OperatorDropdown({ value, onChange }: OperatorDropdownProps) {
  return (
    <ComboBox
      className={locals.dropdown}
      options={SLO_ALERT_OPERATORS.map(operator => ({
        label: t('in-alerting:smartAlerts.slo.components.operatorDropdown', {
          context: getSloAlertOperatorContext(operator)
        }),
        value: operator
      }))}
      onChange={option => {
        if (!option) return;

        const value = getOption(option).value as ThresholdOperator;
        onChange(value);
      }}
      value={value}
      placeholder={value}
      isClearable={false}
      isSearchable={false}
    />
  );
}

export function isSloAlertOperator(operator: string): operator is ThresholdOperator {
  return SLO_ALERT_OPERATORS.includes(operator as ThresholdOperator);
}

export function getSloAlertOperatorContext(operator: string): string | undefined {
  if (!isSloAlertOperator(operator)) return;

  return OPERATOR_NAMES[operator];
}

function getOption(option: Option | Options): Option {
  return Array.isArray(option) ? option[0] : option;
}
