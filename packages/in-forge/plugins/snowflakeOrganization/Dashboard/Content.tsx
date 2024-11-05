/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { TimeConfig } from '@instana/types';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytes, number } from 'in-services/formatters/number';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

export default function SnowflakeOrganisationDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId: string = snapshot.get('id');
  return (
    <div>
      <KpiSection>
        <KpiKeyValue label={t('in-forge:plugins.snowflakeOrganization.dashboard.overallCreditUsage')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="organization_usage.overall_credit_usage"
            formatter={number.compact}
          />
        </KpiKeyValue>
        <KpiKeyValue label={t('in-forge:plugins.snowflakeOrganization.dashboard.totalStorageBytes')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="organization_usage.total_storage_bytes"
            formatter={bytes.compact}
          />
        </KpiKeyValue>
        {/* <KpiKeyValue label={t('in-forge:plugins.snowflakeOrganization.dashboard.availableBalance')}>
          <MetricValue snapshotId={snapshotId} metric="organization_usage.top_billing_accounts.credits" formatter={number.compact} />
        </KpiKeyValue> */}
      </KpiSection>
      {/* <DashboardSection title={t('in-forge:plugins.snowflakeOrganization.dashboard.topFiveBillingAccountsByCreditUsage')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['txnBeginCount', 'txnCommitCount', 'txnRollbackCount'],
            labels: [
              t('in-forge:plugins.tibcoASDataGrid.txnBeginCount'),
              t('in-forge:plugins.tibcoASDataGrid.txnCommitCount'),
              t('in-forge:plugins.tibcoASDataGrid.txnRollbackCount')
            ],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection> */}
      <DashboardSection title={t('in-forge:plugins.snowflakeOrganization.dashboard.availableBalanceInCurrency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['organization_usage.usage_in_currency'],
            labels: [t('in-forge:plugins.snowflakeOrganization.dashboard.balance')],
            type: 'line',
            formatter: number.compact
          }}
        />
      </DashboardSection>
    </div>
  );
}
