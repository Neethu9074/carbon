/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import React from 'react';

import { Select } from '@instana/components';

import MetricDropdown from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/MetricDropdown';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { alertConfig } from 'in-alerting/smart-alerts/applications/data/alertConfigData.json';

export const blueprintConfig = {
  type: 'errors',
  getMaxMetricValue: () => 9007199254740991,
  getThresholdTypeOptions: () => [{ label: 'Static Threshold', value: 'staticThreshold' }],
  name: 'Erroneous Calls',
  headline: 'Automatic Alerts for Erroneous Calls',
  text: 'Receive an alert when the rate or count of erroneous calls for selected services and endpoints of this Application Perspective is higher than normal.',
  baselineEnabled: false,
  defaultMetric: 'errors',
  isCustomRateMetric: jest.fn(),
  getMetricsRequest: jest.fn(),
  getAlertsPreviewRequest: jest.fn(),
  getThresholdSuggestionRequest: jest.fn(),
  thresholdDefaults: { operator: '>=' },
  isBeta: false,
  enrichWithDefaultThresholdValues: jest.fn(),
  getEntityTagFilterFormModel: jest.fn(),
  getRuleTagFilterFormModel: jest.fn(),
  getExtraAnalyzeLinkTagFilterFormModel: jest.fn(),
  tearSheetHeadline: 'Automatic alerts for erroneous calls',
  tearSheetDescription:
    'Receive an alert when the rate or count of erroneous calls for selected services and endpoints of this Application Perspective exceeds the threshold value.',
  getMetricName: jest.fn(),
  getMetricLabel: jest.fn(),
  getMetricFormat: jest.fn(),
  getAggregation: jest.fn(),
  isRuleComplete: jest.fn()
};

describe('MetricDropdown', () => {
  let props;

  it('test slowness BP', () => {
    const slownessAlertConfig = {
      ...alertConfig,
      rules: [{ rule: { aggregation: 'P90', alertType: 'slowness', metricName: 'latency' } }]
    };

    props = {
      alertType: 'slowness',
      form: createSmartAlertForm(slownessAlertConfig, true, true),
      updateForm: jest.fn(),
      blueprintConfig: blueprintConfig
    };
    const wrapper = shallow(<MetricDropdown {...props} />);

    wrapper.find(Select).simulate('change', { target: { value: 'MIN' } });
    expect(props.updateForm).toHaveBeenCalled();
  });

  it('test errors BP', () => {
    props = {
      alertType: 'errors',
      form: createSmartAlertForm(alertConfig, true, true),
      updateForm: jest.fn(),
      blueprintConfig: blueprintConfig
    };
    const wrapper = shallow(<MetricDropdown {...props} />);

    wrapper.find(Select).simulate('change', { target: { value: 'erroneousCalls' } });
    expect(props.updateForm).toHaveBeenCalled();
  });

  it('test logs BP', () => {
    props = {
      alertType: 'logs',
      form: createSmartAlertForm(alertConfig, true, true),
      updateForm: jest.fn(),
      blueprintConfig: blueprintConfig
    };
    render(<MetricDropdown {...props} />);
  });

  it('test Status code BP', () => {
    props = {
      alertType: 'statusCode',
      form: createSmartAlertForm(alertConfig, true, true),
      updateForm: jest.fn(),
      blueprintConfig: blueprintConfig
    };
    const wrapper = shallow(<MetricDropdown {...props} />);

    wrapper.find(Select).simulate('change', { target: { value: 'callRate' } });
    expect(props.updateForm).toHaveBeenCalled();
  });

  it('test throughput BP', () => {
    props = {
      alertType: 'throughput',
      form: createSmartAlertForm(alertConfig, true, true),
      updateForm: jest.fn(),
      blueprintConfig: blueprintConfig
    };
    render(<MetricDropdown {...props} />);
  });
});
