/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { InfraAlertRuleUnion, StaticThresholdConfig, ThresholdConfigUnion } from '@instana/types';

import { AlertThresholdInfos } from 'in-alerting/smart-alerts/infrastructure/details/AlertThresholdInfos';
import { t } from 'in-i18n';

describe('in-alerting/smart-alerts/infrastructure/details/AlertThresholdInfos.tsx', () => {
  test('renders correct information for static threshold', async () => {
    // GIVEN
    const threshold = {
      type: 'staticThreshold',
      operator: '>=',
      value: 0.01,
      lastUpdated: 0
    } as ThresholdConfigUnion & StaticThresholdConfig;
    const rule = {
      metricName: 'mem.time_in_gcn',
      entityType: 'clrRuntimePlatform'
    } as InfraAlertRuleUnion;
    const metricLabel = '% Time in GC';

    // WHEN
    render(<AlertThresholdInfos threshold={threshold} rule={rule} metricLabel={metricLabel} />);

    // THEN
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold'))
    ).toBeInTheDocument();
    await expect(screen.getByText('% Time in GC ≥ 1%')).toBeInTheDocument();
  });

  test('renders correct information for percentage threshold', async () => {
    // GIVEN
    const threshold = {
      lastUpdated: 0,
      operator: '>=',
      type: 'staticThreshold',
      value: 2
    } as ThresholdConfigUnion & StaticThresholdConfig;
    const rule = {
      entityType: 'netCoreRuntimePlatform',
      metricName: 'metrics.contentionCount'
    } as InfraAlertRuleUnion;
    const metricLabel = 'Contention Count';

    // WHEN
    render(<AlertThresholdInfos threshold={threshold} rule={rule} metricLabel={metricLabel} />);

    // THEN
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold'))
    ).toBeInTheDocument();
    await expect(screen.getByText('Contention Count ≥ 2')).toBeInTheDocument();
  });
});
