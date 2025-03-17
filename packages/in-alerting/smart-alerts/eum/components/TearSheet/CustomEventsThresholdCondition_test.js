/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import CustomEventsThresholdCondition from 'in-alerting/smart-alerts/eum/components/TearSheet/CustomEventsThresholdCondition';
import alertFormDefinition from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition.ts';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { website } from 'in-alerting/smart-alerts/eum/data/alertConfig.json';
import { t } from 'in-i18n';

describe('CustomEventsThresholdCondition : in-alerting/smart-alerts/eum/components/TearSheet/CustomEventsThresholdCondition', () => {
  const updateForm = jest.fn();
  const blueprintConfig = getBlueprintConfig('throughput');
  const form = alertFormDefinition(website);
  it('render CustomEventsThresholdCondition', async () => {
    render(
      <CustomEventsThresholdCondition
        form={form}
        updateForm={updateForm}
        blueprintConfig={blueprintConfig}
        editMode={false}
        eumType={'website'}
        getMetricUnitPostfix={jest.fn()}
        isPercentageMetric={jest.fn()}
        onChartViewConfigChange={jest.fn()}
      />
    );
    expect(screen.getByText(t('in-alerting:smartAlerts.details.metricTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.websites.data.pageLoads'))).toBeInTheDocument();

    expect(getThresholdValueElement(t('in-alerting:smartAlerts.websites.advanced.thresholdValue'))).toBeInTheDocument();

    function getThresholdValueElement(value) {
      const valueElements = screen.getAllByText(value);
      return valueElements[valueElements.length - 1];
    }
  });
});
