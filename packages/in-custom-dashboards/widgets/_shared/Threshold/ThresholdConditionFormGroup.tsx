/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import { t } from 'in-i18n';

import locals from './ThresholdConditionFormGroup.mless';

interface ThresholdConditionFormGroupPros {
  children?: ReactNode;
  iconType?: string;
  label?: string;
  shouldIncreaseColumns?: boolean;
  hasWhiteBackground?: boolean;
  showLabel?: boolean;
}
export default function ThresholdConditionFormGroup({
  children,
  iconType = 'lib_alerting_threshold_icon',
  label = t('in-custom-dashboards:threshold.label'),
  shouldIncreaseColumns = false,
  hasWhiteBackground = false,
  showLabel = true
}: ThresholdConditionFormGroupPros) {
  return (
    <div
      className={classNames({
        [locals.thresholdConditionItem]: true,
        [locals.increasedColumns]: shouldIncreaseColumns,
        [locals.whiteBackground]: hasWhiteBackground
      })}
    >
      {<SvgIcon className={locals.icon} type={iconType} />}
      {showLabel && <span className={locals.label}>{label}</span>}
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
