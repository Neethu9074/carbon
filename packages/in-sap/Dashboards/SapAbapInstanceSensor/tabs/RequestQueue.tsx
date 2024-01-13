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
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
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
    type: 'number',
    typeArgs: {
      getValue(row: RequestQueueRow) {
        return row.requestsStats.get('requestsWritten');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.requestsRead'),
    type: 'number',
    typeArgs: {
      getValue(row: RequestQueueRow) {
        return row.requestsStats.get('requestsRead');
      },
      getContent: number.compact
    }
  }
];

export default function RequestQueue({ snapshotId, timeConfig }: RequestQueueProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'requestQueueList'), [snapshotId]);
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
        <Chart
          snapshotId={snapshotId}
          timeConfig={timeConfig}
          y1={{
            min: 0,
            formatter: number.compact,
            metrics: [`requestQueueList.${row.key}.requestsWaiting`, `requestQueueList.${row.key}.maxRequestsWaiting`],
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
            metrics: [`requestQueueList.${row.key}.requestsWritten`, `requestQueueList.${row.key}.requestsRead`],
            labels: [t('in-sap:dashboards.requestsWritten'), t('in-sap:dashboards.requestsRead')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </div>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.requestQueueInfo')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
      getRowDetails={getDetails}
    />
  );
}
