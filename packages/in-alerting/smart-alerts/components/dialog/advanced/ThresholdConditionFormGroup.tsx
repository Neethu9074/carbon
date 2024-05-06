/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup.mless';

interface ThresholdConditionFormGroupPros {
  children?: ReactNode;
  iconType?: string;
  label?: string;
  shouldIncreaseColumns?: boolean;
  hasWhiteBackground?: boolean;
}
export default function ThresholdConditionFormGroup({
  children,
  iconType = 'lib_alerting_threshold_icon',
  label = t('in-alerting:smartAlerts.components.smartAlertDialog.labelThreshold'),
  shouldIncreaseColumns = false,
  hasWhiteBackground = false
}: ThresholdConditionFormGroupPros) {
  return (
    <div
      className={classNames({
        [locals.thresholdConditionItem]: true,
        [locals.increasedColumns]: shouldIncreaseColumns,
        [locals.whiteBackground]: hasWhiteBackground
      })}
    >
      <SvgIcon className={locals.icon} type={iconType} />
      <span className={locals.label}>{label}</span>
      <div className={locals.content}>{children}</div>
    </div>
  );
}
