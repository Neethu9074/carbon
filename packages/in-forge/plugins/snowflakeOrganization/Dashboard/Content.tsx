/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
//import { SnapshotData } from 'in-stores/snapshot/snapshot';
import MetricValue from 'in-components/MetricValue';
import BillingAccounts from 'in-forge/plugins/snowflakeOrganization/Dashboard/BillingAccounts';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { KpiSection, KpiKeyValue } from 'in-sdk/components/dashboard/KpiSection';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytes, number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default function SnowflakeOrganizationDashboard({
  snapshot,
  timeConfig
}: {
  snapshot: SnapshotData;
  timeConfig: TimeConfig;
}) {
  const snapshotId: string = snapshot.get('id');
  function CurrencyFromatter(value: number): string {
    const data: any = useObservable(
      () => getRawPayloadWithTimestamp(snapshotId, 'organization_usage.remaining_balance.currency', timeConfig),
      [snapshotId, timeConfig]
    );
    if (!data) {
      //console.log('data currency is null');
      return '232342';
    }
    //console.log('data currency is:' , data);
    const currency: any = (data as SnapshotData).get('raw_payload');

    // let currency: string = data.get('organization_usage.remaining_balance.currency');

    //console.log("currency: ",currency);
    // if(currency ===null){
    //   currency = "";
    // }
    return value.toString() + ' ' + currency;
  }
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
        <KpiKeyValue label={t('in-forge:plugins.snowflakeOrganization.dashboard.usageInCurrency')}>
          <MetricValue
            snapshotId={snapshotId}
            metric="organization_usage.usage_in_currency"
            formatter={number.compact}
          />
        </KpiKeyValue>
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
      <BillingAccounts snapshotId={snapshotId} timeConfig={timeConfig} />
      <DashboardSection title={t('in-forge:plugins.snowflakeOrganization.dashboard.remainingBalanceInCurrency')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            metrics: ['organization_usage.remaining_balance.capacity_balance'],
            labels: [t('in-forge:plugins.snowflakeOrganization.dashboard.balance')],
            type: 'line',
            formatter: CurrencyFromatter
          }}
        />
      </DashboardSection>
    </div>
  );
}
