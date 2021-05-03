/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { SvgIcon } from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/ThresholdConditionFormGroup.mless';

export default function ThresholdConditionFormGroup({
  children,
  iconType = 'lib_alerting_threshold_icon',
  label = t('in-alerting:smartAlerts.components.smartAlertDialog.labelThreshold')
}) {
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

ThresholdConditionFormGroup.propTypes = {
  children: PropTypes.node,
  iconType: PropTypes.string,
  label: PropTypes.string
};
