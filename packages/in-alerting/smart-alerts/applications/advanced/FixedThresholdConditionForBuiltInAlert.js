/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';

import thresholdConditionLocals from 'in-alerting/smart-alerts/components/smart-alert-dialog/shared-styles/ThresholdCondition.mless';

export default function FixedThresholdConditionForBuiltInAlert({
  metricLabel,
  aggregationLabel,
  operatorLabel,
  configuredThreshold
}) {
  return (
    <HorizontalFlexWrapper className={thresholdConditionLocals.thresholdConditionForBuiltInAlert}>
      <span>{metricLabel}</span>
      {aggregationLabel && <span>{aggregationLabel}</span>}
      {operatorLabel && <span>{operatorLabel}</span>}
      {configuredThreshold && <span>{configuredThreshold}</span>}
    </HorizontalFlexWrapper>
  );
}

FixedThresholdConditionForBuiltInAlert.propTypes = {
  metricLabel: PropTypes.string.isRequired,
  aggregationLabel: PropTypes.string,
  operatorLabel: PropTypes.string,
  configuredThreshold: PropTypes.string
};
