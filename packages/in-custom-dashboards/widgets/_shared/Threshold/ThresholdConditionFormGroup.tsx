/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import IconButton from 'in-components/IconButton/IconButton';

import locals from './ThresholdConditionFormGroup.mless';

interface ThresholdConditionFormGroupPros {
  children?: ReactNode;
  label: string;
  hasWhiteBackground?: boolean;
}
export default function ThresholdConditionFormGroup({
  children,
  label,
  hasWhiteBackground = false
}: ThresholdConditionFormGroupPros) {
  return (
    <div
      className={classNames({
        [locals.thresholdConditionItem]: true,
        [locals.increasedColumns]: true,
        [locals.whiteBackground]: hasWhiteBackground
      })}
    >
      <IconButton type="lib_alerting_threshold_icon" kind="info" className={locals.icon} />
      <span className={locals.label}>{label}</span>
      <div
        className={classNames({
          [locals.content]: true,
          [locals.extraGap]: true
        })}
      >
        {children}
      </div>
    </div>
  );
}
