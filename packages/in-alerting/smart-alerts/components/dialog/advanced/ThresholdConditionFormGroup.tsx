/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import { SvgIcon } from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/dialog/advanced/ThresholdConditionFormGroup.mless';

interface ThresholdConditionFormGroupPros {
  children?: ReactNode;
  iconType?: string;
  label?: string;
}
export default function ThresholdConditionFormGroup({
  children,
  iconType = 'lib_alerting_threshold_icon',
  label = t('in-alerting:smartAlerts.components.smartAlertDialog.labelThreshold')
}: ThresholdConditionFormGroupPros) {
  return (
    <div className={locals.thresholdConditionItem}>
      <SvgIcon className={locals.icon} type={iconType} />
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
