/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection/DashboardSection';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import Table from 'in-sap/Dashboards/SapAbapInstanceSensor/tabs/Table';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import { t } from 'in-i18n';

interface RequestQueueRow {
  key: string;
  snapshotId: string;
  requestsStats: Map<string, object>;
}

interface RequestQueueProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.processType'),
    type: 'string',
    typeArgs: {
      getValue(row: RequestQueueRow) {
        return row.requestsStats.get('processType');
      }
    }
  },
  {
    title: t('in-sap:dashboards.requestsWritten'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: RequestQueueRow) {
        return row.snapshotId;
      },
      getMetricName(row: RequestQueueRow) {
        return `requestQueueList.${row.key}.requestsWritten`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.requestsRead'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: RequestQueueRow) {
        return row.snapshotId;
      },
      getMetricName(row: RequestQueueRow) {
        return `requestQueueList.${row.key}.requestsRead`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function RequestQueue({ snapshotId, timeConfig }: RequestQueueProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'requestQueueList', timeConfig),
    [snapshotId, timeConfig]
  );
  if (!data) {
    return null;
  }
  const requestsStat = (data as SnapshotData).get('raw_payload', []);
  const rows: RequestQueueRow[] = requestsStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const requestsStats = requestsStat.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        requestsStats
      };
    });

  function getDetails(row: RequestQueueRow) {
    return (
      <div>
        <Columize>
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [
                `requestQueueList.${row.key}.requestsWaiting`,
                `requestQueueList.${row.key}.maxRequestsWaiting`
              ],
              labels: [t('in-sap:dashboards.requestsWaiting'), t('in-sap:dashboards.maxRequestsWaiting')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
          <Chart
            snapshotId={snapshotId}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: number.compact,
              metrics: [`requestQueueList.${row.key}.requestsRead`, `requestQueueList.${row.key}.requestsWritten`],
              labels: [t('in-sap:dashboards.requestsRead'), t('in-sap:dashboards.requestsWritten')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      </div>
    );
  }
  return (
    <DashboardSection title={t('in-sap:dashboards.dispatcherRequestQueues')}>
      <Chart
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        y1={{
          min: 0,
          metrics: [
            'queueStats.dialogWait',
            'queueStats.updateWait',
            'queueStats.enqueueWait',
            'queueStats.btcWait',
            'queueStats.spoolWait',
            'queueStats.update2Wait',
            'queueStats.nowpWait'
          ],
          labels: [
            t('in-sap:dashboards.dialogWait'),
            t('in-sap:dashboards.updateWait'),
            t('in-sap:dashboards.enqueue'),
            t('in-sap:dashboards.background'),
            t('in-sap:dashboards.spoolWait'),
            t('in-sap:dashboards.update2Wait'),
            t('in-sap:dashboards.nowpWait')
          ],
          type: 'line',
          formatter: number.compact
        }}
      />
      <Table
        withoutPadding
        cardTitle=""
        cols={cols}
        rows={rows}
        initialSortColumn={0}
        initialSortDirection="asc"
        getRowDetails={getDetails}
      />
    </DashboardSection>
  );
}
