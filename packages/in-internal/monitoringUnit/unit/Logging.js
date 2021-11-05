/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { Fragment } from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function LoggingStatistics({ timeConfig, tenantUnitId }) {
  return (
    <Fragment>
      <DashboardSection title={t('in-internal:monitoringUnit.unit.logging.logByteRateLimitAccepted')}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            formatter: bytesTwoDecimalPlaces,
            metrics: [`acceptor.logByteRateLimitAccepted`],
            labels: [t('in-internal:monitoringUnit.unit.logging.logByteRateLimitAccepted')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title={t('in-internal:monitoringUnit.unit.logging.logByteRateLimitDropped')}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            formatter: bytesTwoDecimalPlaces,
            metrics: [`acceptor.logByteRateLimitDropped`],
            labels: [t('in-internal:monitoringUnit.unit.logging.logByteRateLimitDropped')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </Fragment>
  );
}
