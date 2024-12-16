/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { shallow } from 'enzyme';
import React from 'react';

import { Select } from '@instana/components';

import ThresholdTypeSelection from 'in-alerting/smart-alerts/components/tearSheet/ThresholdCondition/ThresholdTypeSelection';
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

describe('ThresholdTypeSelection', () => {
  let props;
  beforeEach(() => {
    props = {
      form: createSmartAlertForm(alertConfig, true, true),
      updateForm: jest.fn(),
      blueprintConfig: blueprintConfig,
      editMode: false,
      isGlobalSmartAlert: false,
      thresholdTypeOptions: blueprintConfig.getThresholdTypeOptions()
    };
  });

  it('test Local SA ', () => {
    const localSAProps = {
      ...props,
      thresholdTypeOptions: [
        {
          value: 'staticThreshold',
          label: 'Static Threshold'
        },
        {
          value: 'historicBaseline.DAILY',
          label: 'Static Daily Seasonality'
        },
        {
          value: 'historicBaseline.WEEKLY',
          label: 'Static Weekly Seasonality'
        },
        {
          value: 'adaptiveBaseline',
          label: 'Adaptive Threshold'
        }
      ]
    };

    const wrapper = shallow(<ThresholdTypeSelection {...localSAProps} />);

    wrapper.find(Select).simulate('change', { target: { value: 'staticThreshold' } });
    expect(props.updateForm).toHaveBeenCalled();

    wrapper.find(Select).simulate('change', { target: { value: 'adaptiveBaseline' } });
    expect(props.updateForm).toHaveBeenCalled();
  });
});
