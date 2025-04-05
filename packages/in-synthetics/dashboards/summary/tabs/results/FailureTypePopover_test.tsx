/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import FailureTypePopover from 'in-synthetics/dashboards/summary/tabs/results/FailureTypePopover';
import { getResultErrorMessage } from 'in-synthetics/dashboards/details/utils';

const dummyDNSCustomMetrics = {
  metrics: {
    response_size: [[1716448782519, 57427]],
    start_time: [[1716448782519, 1716448782519]],
    status: [[1716448782519, 0]]
  },
  testResultCommonProperties: {
    clientId: 'saas_instana_test',
    id: '969eaddc-7703-47ba-ad92-f4f283475808',
    locationDisplayLabel: 'DemoPoP1(Fyre)',
    locationId: 'RtmxRMdmlakWX497YeZN',
    testId: 'CmIJOrkyB2bHTifXyvqe',
    testName: 'api-simple-demo-test'
  }
};
const dummyDNSCustomMetrics1 = {
  metrics: {
    response_size: [[1716448782519, 57427]],
    start_time: [[1716448782519, 1716448782519]],
    status: [[1716448782519, 0]]
  },
  testResultCommonProperties: {
    clientId: 'saas_instana_test',
    id: '969eaddc-7703-47ba-ad92-f4f283475808',
    locationDisplayLabel: 'DemoPoP1(Fyre)',
    locationId: 'RtmxRMdmlakWX497YeZN',
    testId: 'CmIJOrkyB2bHTifXyvqe',
    testName: 'api-simple-demo-test',
    errors: ['error1']
  }
};
const dummyDNSCustomMetrics2 = {
  metrics: {
    response_size: [[1716448782519, 57427]],
    start_time: [[1716448782519, 1716448782519]],
    status: [[1716448782519, 0]]
  },
  testResultCommonProperties: {
    clientId: 'saas_instana_test',
    id: '969eaddc-7703-47ba-ad92-f4f283475808',
    locationDisplayLabel: 'DemoPoP1(Fyre)',
    locationId: 'RtmxRMdmlakWX497YeZN',
    testId: 'CmIJOrkyB2bHTifXyvqe',
    testName: 'api-simple-demo-test',
    errors: ['error1', 'error2', 'error3']
  }
};
jest.mock('in-synthetics/dashboards/details/utils', () => ({
  getResultErrorMessage: jest.fn()
}));
const mockedGetResultErrorMessage = getResultErrorMessage as jest.Mock;
describe('FailureTypePopover', () => {
  it('should render a N/A if success', () => {
    render(<FailureTypePopover resultItem={dummyDNSCustomMetrics} />);
    expect(screen.getByText('N/A')).toBeVisible();
  });
  it('should render error message if one error', () => {
    mockedGetResultErrorMessage.mockReturnValueOnce('Error Message 1');
    const { container } = render(<FailureTypePopover resultItem={dummyDNSCustomMetrics1} />);
    expect(container.getElementsByClassName('cds--tag__label').length).toBeGreaterThanOrEqual(1);
    expect(container.getElementsByClassName('cds--tag__label')[0]).toHaveTextContent('Error Message 1');
  });
  it('should render error message on buttons if more than one error', () => {
    mockedGetResultErrorMessage.mockReturnValueOnce('Error Message 1');
    mockedGetResultErrorMessage.mockReturnValueOnce('Error Message 1');
    mockedGetResultErrorMessage.mockReturnValueOnce('Error Message 2');
    mockedGetResultErrorMessage.mockReturnValueOnce('Error Message 3');
    const { container } = render(<FailureTypePopover resultItem={dummyDNSCustomMetrics2} />);
    expect(container.getElementsByClassName('cds--tag__label').length).toBeGreaterThan(1);
    expect(container.getElementsByClassName('cds--tag__label')[0]).toHaveTextContent('Error Message 1');
    expect(container.getElementsByClassName('cds--contained-list-item')[1]).toHaveTextContent('Error Message 2');
  });
});
