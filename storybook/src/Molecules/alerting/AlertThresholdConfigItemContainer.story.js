/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import React from 'react';

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import AlertThresholdConfigItemContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';

export default {
  title: 'Molecules|alerting/advanced/AlertThresholdConfigItemContainer',
  component: AlertThresholdConfigItemContainer
};

export const simple = () => (
  <AlertThresholdConfigItemContainer>
    <span>column 1</span>
    <span>column 2</span>
  </AlertThresholdConfigItemContainer>
);
export const noIcon = () => (
  <AlertThresholdConfigItemContainer noIcon>
    <span>column 1</span>
    <span>column 2</span>
  </AlertThresholdConfigItemContainer>
);
export const ThreeColumns = () => (
  <AlertThresholdConfigItemContainer iconType="lib_datetime_timerange">
    <span>column 1</span>
    <span>column 2</span>
  </AlertThresholdConfigItemContainer>
);
export const FourColumns = () => (
  <AlertThresholdConfigItemContainer iconType="lib_datetime_timerange" hasExtraColumnOnRight>
    <span>column 1</span>
    <span>column 2</span>
    <span>column 3</span>
  </AlertThresholdConfigItemContainer>
);
