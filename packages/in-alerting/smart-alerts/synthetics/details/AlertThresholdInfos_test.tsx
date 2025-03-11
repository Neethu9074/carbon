/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow } from 'enzyme';
import React from 'react';

import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/synthetics/details/AlertThresholdInfosPresenter';
import { AlertThresholdInfosProps } from 'in-alerting/smart-alerts/synthetics/details/AlertConfiguration';
import { AlertThresholdInfos } from 'in-alerting/smart-alerts/synthetics/details/AlertThresholdInfos';

const thresholdInfos: AlertThresholdInfosProps = {
  thresholdType: 'Number of failure',
  failureThreshold: '1 failures',
  aggregation: 'Per Location'
};

describe('in-alerting/smart-alerts/synthetics/details/AlertThresholdInfos.tsx', () => {
  it('renders AlertThresholdInfos correctly', () => {
    const wrapper = shallow(<AlertThresholdInfos thresholdInfos={thresholdInfos} />);

    expect(wrapper.find(AlertThresholdInfosPresenter).prop('thresholdTypeLabel')).toBe('Number of failure');
    expect(wrapper.find(AlertThresholdInfosPresenter).prop('metricLabel')).toBe('1 failures');
    expect(wrapper.find(AlertThresholdInfosPresenter).prop('scopeLabel')).toBe('Per location');
  });
});
