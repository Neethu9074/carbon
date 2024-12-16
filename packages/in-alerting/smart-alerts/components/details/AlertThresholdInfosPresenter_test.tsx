/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { AlertThresholdInfosPresenter } from 'in-alerting/smart-alerts/components/details/AlertThresholdInfosPresenter';
import { ThresholdInfo } from 'in-alerting/smart-alerts/infrastructure/details/AlertThresholdInfos';
import { t } from 'in-i18n';

describe('in-alerting/components/AlertThresholdInfosPresenter', () => {
  it('renders component correctly', () => {
    const props = {
      thresholdTypeLabel: 'Static threshold',
      metricLabel: 'CPU Total',
      scopeLabel: 'Foo',
      threshold: (
        <ThresholdInfo
          thresholdOperator={'>'}
          thresholdsMap={{ WARNING: { type: 'staticThreshold', value: 5 } }}
          rule={{
            alertType: 'genericRule',
            metricName: 'cpu\\.(nice|user|sys|wait)',
            entityType: 'host',
            aggregation: 'MEAN',
            crossSeriesAggregation: 'SUM',
            regex: true
          }}
        />
      )
    };

    render(<AlertThresholdInfosPresenter {...props} />);

    expect(screen.getByText(t('in-alerting:smartAlerts.details.thresholdTypeTitle'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.thresholdTypeOptionStaticThreshold'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.details.threshold'))).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.details.warningThresholdLabel') + ': > 5')).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.details.metricTitle'))).toBeInTheDocument();
    expect(screen.getByText('CPU Total')).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.details.entityTitle'))).toBeInTheDocument();
    expect(screen.getByText('Foo')).toBeInTheDocument();
  });
});
