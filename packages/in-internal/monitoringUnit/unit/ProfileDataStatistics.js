/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { t } from 'in-i18n';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';

export default function ProfileDataStatistics({ timeConfig, tenantUnitId }) {
  return (
    <Fragment>
      <DashboardSection title={t('in-internal:monitoringUnit.unit.profileDataStatistic.acceptorAcceptProfile')}>
        <Chart
          snapshotId={tenantUnitId}
          timeConfig={timeConfig}
          y1={{
            formatter: number.compact,
            metrics: [`acceptor.acceptedProfiles`],
            labels: [t('in-internal:monitoringUnit.unit.profileDataStatistic.acceptorAcceptProfile')],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>
    </Fragment>
  );
}
