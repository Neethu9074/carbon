/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { bytes, number } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface FioriCallStatsRow {
  key: string;
  snapshotId: string;
  fioriCallStats: Map<string, object>;
}

interface FioriCallStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.client'),
    type: 'string',
    typeArgs: {
      getValue(row: FioriCallStatsRow) {
        return row.fioriCallStats.get('client');
      }
    }
  },
  {
    title: t('in-sap:dashboards.userName'),
    type: 'string',
    typeArgs: {
      getValue(row: FioriCallStatsRow) {
        return row.fioriCallStats.get('account');
      }
    }
  },
  {
    title: t('in-sap:dashboards.host'),
    type: 'string',
    typeArgs: {
      getValue(row: FioriCallStatsRow) {
        return row.fioriCallStats.get('host');
      }
    }
  },
  {
    title: t('in-sap:dashboards.counter'),
    type: 'number',
    typeArgs: {
      getValue(row: FioriCallStatsRow) {
        return Number(row.fioriCallStats.get('counter'));
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.path'),
    type: 'string',
    typeArgs: {
      getValue(row: FioriCallStatsRow) {
        return row.fioriCallStats.get('path');
      }
    }
  },
  {
    title: t('in-sap:dashboards.dataSend'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: FioriCallStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: FioriCallStatsRow) {
        return `fioriCallMetrics.${row.key}.dataSend`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.dataReceived'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: FioriCallStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: FioriCallStatsRow) {
        return `fioriCallMetrics.${row.key}.dataReceive`;
      },
      getContent: bytes.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function FioriPageVisit({ snapshotId, timeConfig }: FioriCallStatsProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'fioriCallMetrics', timeConfig),
    [snapshotId, timeConfig]
  );
  const fioriCallStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: FioriCallStatsRow[] = fioriCallStat
    ? fioriCallStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const fioriCallStats = fioriCallStat.get(key);

          return {
            key,
            snapshotId,
            timeConfig,
            fioriCallStats
          };
        })
    : [];

  function getDetails(row: FioriCallStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`fioriCallMetrics.${row.key}.dataSend`, `fioriCallMetrics.${row.key}.dataReceive`],
                labels: [t('in-sap:dashboards.dataSend'), t('in-sap:dashboards.dataReceived')],
                type: 'line',
                formatter: bytes.compact
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
        </Columize>
      </div>
    );
  }
  return (
    <Table
      withoutPadding
      cardTitle={t('in-sap:dashboards.pageFrequency')}
      cols={cols}
      rows={rows}
      initialSortColumn={3}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
