/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { t } from 'in-i18n';

import locals from './ThresholdConditionFormGroup.mless';

interface ThresholdConditionFormGroupPros {
  children?: ReactNode;
  label?: string;
}
export default function ThresholdConditionFormGroup({
  children,
  label = t('in-alerting:smartAlerts.components.smartAlertDialog.labelThreshold')
}: ThresholdConditionFormGroupPros) {
  return (
    <div
      className={classNames({
        [locals.thresholdConditionItem]: true,
        [locals.displayInTwoColumns]: true
      })}
    >
      <span className={locals.label}>{label}</span>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center'
        }}
      >
        {children}
      </div>
    </div>
  );
}
