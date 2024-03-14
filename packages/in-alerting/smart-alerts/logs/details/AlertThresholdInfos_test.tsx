/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { StaticThresholdConfig, ThresholdConfigUnion, ThresholdOperator, ThresholdType } from '@instana/types';

import { createMetricWithThresholdLabel } from 'in-alerting/smart-alerts/components/utils/metricWithThresholdLabel';
import { AlertThresholdInfos } from 'in-alerting/smart-alerts/logs/details/AlertThresholdInfos';
import { alertConfig } from 'in-alerting/smart-alerts/logs/data/testData.json';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

describe('AlertThresholdInfos : in-alerting/smart-alerts/logs/details/AlertThresholdInfos', () => {
  it('should render correctly and display threshold title and metric title', () => {
    render(
      <AlertThresholdInfos
        threshold={alertConfig.threshold as ThresholdConfigUnion & StaticThresholdConfig}
        metricLabel={t('in-alerting:smartAlerts.logs.alertDetails.metricName')}
      />
    );
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.details.thresholdTypeTitle'))).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.details.metricTitle'))).toBeInTheDocument();
  });

  it('should render AlertThresholdInfos and display metric and conditions as per alert config.', () => {
    render(
      <AlertThresholdInfos
        threshold={alertConfig.threshold as ThresholdConfigUnion & StaticThresholdConfig}
        metricLabel={t('in-alerting:smartAlerts.logs.alertDetails.metricName')}
      />
    );
    const metricWithThresholdLabel = createMetricWithThresholdLabel(
      t('in-alerting:smartAlerts.logs.alertDetails.metricName'),
      alertConfig.threshold.type as ThresholdType,
      alertConfig.threshold.value,
      number.forcedCompact,
      alertConfig.threshold.operator as ThresholdOperator
    );

    expect(screen.getByText(metricWithThresholdLabel)).toBeInTheDocument();
  });
});
