/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { createMetricWithThresholdLabel } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { getDescription } from 'in-alerting/smart-alerts/components/dialog/timeThresholdDescriptionText';
import AlertConfiguration from 'in-alerting/smart-alerts/logs/details/AlertConfiguration';
import { alertConfig } from 'in-alerting/smart-alerts/logs/data/alertConfigData.json';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

describe('AlertConfiguration : in-alerting/smart-alerts/logs/details/AlertConfiguration', () => {
  it('should render correctly and display alert configuration title', () => {
    render(<AlertConfiguration alertConfig={alertConfig} />);
    expect(screen.getByText(t('in-alerting:smartAlerts.logs.alertDetails.alertConfiguration'))).toBeInTheDocument();
    expect(screen.getByText(alertConfig.name)).toBeInTheDocument();
  });

  it('should render detail section and threshold info:', () => {
    render(<AlertConfiguration alertConfig={alertConfig} />);
    expect(screen.getByText(t('in-alerting:smartAlerts.details.header'))).toBeInTheDocument();
    if (alertConfig.threshold.type === 'staticThreshold') {
      expect(
        screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold'))
      ).toBeInTheDocument();
    }

    const metricWithThresholdLabel = createMetricWithThresholdLabel(
      t('in-alerting:smartAlerts.logs.alertDetails.metricName'),
      alertConfig.threshold.type,
      alertConfig.threshold.value,
      number.forcedCompact,
      alertConfig.threshold.operator
    );

    expect(screen.getByText(metricWithThresholdLabel)).toBeInTheDocument();
  });

  it('Verify if Chart section is rendered:', () => {
    render(<AlertConfiguration alertConfig={alertConfig} />);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleTrigger'))
    ).toBeInTheDocument();
  });

  it('Verify if Scope section is rendered:', () => {
    render(<AlertConfiguration alertConfig={alertConfig} />);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleScope'))
    ).toBeInTheDocument();

    if (alertConfig.groupBy.length > 0) {
      expect(screen.getByText(t('in-alerting:components.groupBy'))).toBeInTheDocument();
    }
  });

  it('No filters and groupby in Scope section', () => {
    alertConfig.tagFilterExpression = {
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: []
    };
    alertConfig.groupBy = [];

    render(<AlertConfiguration alertConfig={alertConfig} />);
    expect(screen.getByText(t('in-alerting:smartAlerts.logs.alertDetails.noScopeSelected'))).toBeInTheDocument();
  });

  it('Verify if Time Threshold section is rendered:', () => {
    render(<AlertConfiguration alertConfig={alertConfig} />);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleTimeThreshold'))
    ).toBeInTheDocument();

    expect(screen.getByText(getDescription(alertConfig.timeThreshold, alertConfig.granularity))).toBeInTheDocument();
  });

  it('Verify if Alert channel section is rendered:', () => {
    render(<AlertConfiguration alertConfig={alertConfig} />);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleAlertChannels'))
    ).toBeInTheDocument();
    if (alertConfig.alertChannelIds.length == 0) {
      expect(screen.getByText(t('in-alerting:components.noChannelSelectedText'))).toBeInTheDocument();
    }
  });

  it('Verify if Custom Payload section is rendered:', () => {
    render(<AlertConfiguration alertConfig={alertConfig} />);
    const title = t('in-alerting:components.customPayload.additionalCustomPayloadTitle', {
      count: alertConfig?.customPayloadFields?.length
    });
    expect(screen.getByText(title)).toBeInTheDocument();
    if (alertConfig.customPayloadFields.length == 0) {
      expect(screen.getByText(t('in-alerting:components.customPayload.noCustomPayloadConfigured'))).toBeInTheDocument();
    }
  });

  it('Verify if Alert Properties section is rendered:', () => {
    render(<AlertConfiguration alertConfig={alertConfig} />);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.logs.alertDetails.alertConfigurationTitleAlertProperties'))
    ).toBeInTheDocument();
    expect(screen.getByText(alertConfig.name)).toBeInTheDocument();
    expect(screen.getByText(alertConfig.description)).toBeInTheDocument();
  });
});
