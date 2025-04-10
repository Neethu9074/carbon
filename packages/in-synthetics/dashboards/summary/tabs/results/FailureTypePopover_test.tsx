/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fireEvent, render, screen, within } from '@testing-library/react';
import React from 'react';

import FailureTypePopover from 'in-synthetics/dashboards/summary/tabs/results/FailureTypePopover';

const dummyDNSCustomMetricsWithoutErrors = {
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
    testName: 'dns-demo-test'
  }
};
const dummyDNSCustomMetricsWithOneError = {
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
    testName: 'dns-demo-test',
    errors: [
      '{timeStamp=1743842474084, errorType=Exception, errorMessage=Resolution DNS query failed: SERVFAIL (Server failed to complete the DNS request)}'
    ]
  }
};
const dummyDNSCustomMetricsWithTwoErrors = {
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
    testName: 'dns-demo-test',
    errors: [
      '{timeStamp=1743842474084, errorType=Exception, errorMessage=Resolution DNS query failed: SERVFAIL (Server failed to complete the DNS request)}',
      '{timeStamp=1743842474084, errorType=Assertion, errorMessage=No exact match found for CNAME: e7817.dscx.akamaiedge.net}'
    ]
  }
};

describe(FailureTypePopover, () => {
  it('should render a N/A if success', () => {
    render(<FailureTypePopover resultItem={dummyDNSCustomMetricsWithoutErrors} />);
    expect(screen.getByText('N/A')).toBeVisible();
  });
  it('Should correctly render extracted error messages when single error is present', () => {
    const { container } = render(<FailureTypePopover resultItem={dummyDNSCustomMetricsWithOneError} />);
    const failureTypeTags = container.getElementsByClassName('cds--tag__label');
    expect(failureTypeTags.length).toBe(1);
    expect(failureTypeTags[0].innerHTML).toContain('Resolution DNS query failed: SERVFA...');
  });
  it('Should correctly render extracted error messages when multiple errors are present', () => {
    const { container } = render(<FailureTypePopover resultItem={dummyDNSCustomMetricsWithTwoErrors} />);

    const failureTypeTags = container.getElementsByClassName('cds--tag__label');
    expect(failureTypeTags.length).toBe(2);
    expect(failureTypeTags[0]).toHaveTextContent('Resolution DNS query failed: SERVFA...');

    expect(failureTypeTags[1]).toHaveTextContent('1 +');
    fireEvent.click(failureTypeTags[1]);
    expect(
      within(screen.getByRole('list')).getByText(content =>
        content.includes('No exact match found for CNAME: e7817.dscx.akamaiedge.net')
      )
    ).toBeInTheDocument();
  });
});
