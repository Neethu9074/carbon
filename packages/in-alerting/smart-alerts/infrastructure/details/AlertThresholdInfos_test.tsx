/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { InfraAlertRuleUnion, Severity, SmartAlertThresholdRuleUnion } from '@instana/types';

import { AlertThresholdInfos } from 'in-alerting/smart-alerts/infrastructure/details/AlertThresholdInfos';
import { t } from 'in-i18n';

describe('in-alerting/smart-alerts/infrastructure/details/AlertThresholdInfos.tsx', () => {
  test('renders correct information for static threshold', async () => {
    // GIVEN
    const rule = {
      metricName: 'mem.time_in_gcn',
      entityType: 'clrRuntimePlatform'
    } as InfraAlertRuleUnion;
    const metricLabel = '% Time in GC';
    const thresholdsMap: { [P in Severity]?: SmartAlertThresholdRuleUnion } = {
      WARNING: {
        type: 'staticThreshold',
        value: 0.01
      }
    };

    // WHEN
    render(
      <AlertThresholdInfos
        thresholdOperator={'>='}
        thresholdsMap={thresholdsMap}
        rule={rule}
        metricLabel={metricLabel}
      />
    );

    // THEN
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold'))
    ).toBeInTheDocument();
    await expect(screen.getByText('% Time in GC')).toBeInTheDocument();
    await expect(
      screen.getByText(t('in-alerting:smartAlerts.details.warningThresholdLabel') + ': ≥ 1%')
    ).toBeInTheDocument();
  });

  test('renders correct information for percentage threshold', async () => {
    // GIVEN
    const rule = {
      entityType: 'netCoreRuntimePlatform',
      metricName: 'metrics.contentionCount'
    } as InfraAlertRuleUnion;
    const metricLabel = 'Contention Count';
    const thresholdsMap: { [P in Severity]?: SmartAlertThresholdRuleUnion } = {
      CRITICAL: {
        type: 'staticThreshold',
        value: 2
      }
    };

    // WHEN
    render(
      <AlertThresholdInfos
        thresholdOperator={'>='}
        thresholdsMap={thresholdsMap}
        rule={rule}
        metricLabel={metricLabel}
      />
    );

    // THEN
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold'))
    ).toBeInTheDocument();
    await expect(screen.getByText('Contention Count')).toBeInTheDocument();
    await expect(
      screen.getByText(t('in-alerting:smartAlerts.details.criticalThresholdLabel') + ': ≥ 2')
    ).toBeInTheDocument();
  });
});
