/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { t } from 'in-i18n';

import SvgIcon from 'in-components/SvgIcon/SvgIcon';

import locals from './ThresholdConditionFormGroup.mless';

export default function ThresholdConditionFormGroup({
  children,
  iconType = 'lib_alerting_threshold_icon',
  label = t('in-new-components:alerting.advanced.labelThreshold')
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
  iconType: SvgIcon.propTypes.type,
  label: PropTypes.string
};
