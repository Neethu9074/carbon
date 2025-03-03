/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { Severity, SmartAlertThresholdRuleUnion } from '@instana/types';

import { AlertThresholdInfos } from 'in-alerting/smart-alerts/logs/details/AlertThresholdInfos';
import { t } from 'in-i18n';

describe('AlertThresholdInfos : in-alerting/smart-alerts/logs/details/AlertThresholdInfos', () => {
  it('should render correctly and display threshold title and metric title', () => {
    const thresholdsMap: { [P in Severity]?: SmartAlertThresholdRuleUnion } = {
      WARNING: {
        type: 'staticThreshold',
        value: 20
      }
    };
    render(
      <AlertThresholdInfos
        thresholdOperator={'>='}
        thresholdsMap={thresholdsMap}
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
    const thresholdsMap: { [P in Severity]?: SmartAlertThresholdRuleUnion } = {
      WARNING: {
        type: 'staticThreshold',
        value: 20
      }
    };
    render(
      <AlertThresholdInfos
        thresholdOperator={'>='}
        thresholdsMap={thresholdsMap}
        metricLabel={t('in-alerting:smartAlerts.logs.alertDetails.metricName')}
      />
    );

    expect(screen.getByText(t('in-alerting:smartAlerts.details.warningThresholdLabel') + ': ≥ 20')).toBeInTheDocument();
  });
});
