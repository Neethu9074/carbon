/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import AlertThresholdConfigItemContainer from 'in-new-components/Alerting/advanced/TimeThresholdConfig/AlertThresholdConfigItemContainer';
import React from 'react';

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
  <AlertThresholdConfigItemContainer iconType="lib_datetime_timerange" hasExtraColumnOnRight={true}>
    <span>column 1</span>
    <span>column 2</span>
    <span>column 3</span>
  </AlertThresholdConfigItemContainer>
);
