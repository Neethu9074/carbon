/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

//import { percentageDetailed } from 'in-stores/metric/formatters';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { bytesTwoDecimalPlaces, number, percentage, seconds } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { formatDateTime } from 'in-services/formatters/date';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

interface ServiceDetailsStatsRow {
  key: string;
  snapshotId: string;
  serviceDetailsStats: Map<string, object>;
}

interface ServiceDetailsStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-forge:plugins.sapHana.dashboard.host'),
    type: 'string',
    typeArgs: {
      getValue(row: ServiceDetailsStatsRow) {
        return row.serviceDetailsStats.get('host');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.serviceName'),
    type: 'string',
    typeArgs: {
      getValue(row: ServiceDetailsStatsRow) {
        return row.serviceDetailsStats.get('serviceName');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.status'),
    type: 'string',
    typeArgs: {
      getValue(row: ServiceDetailsStatsRow) {
        return row.serviceDetailsStats.get('activeStatus');
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.startTime'),
    type: 'string',
    typeArgs: {
      getValue(row: ServiceDetailsStatsRow) {
        return row.serviceDetailsStats.get('startTime');
      }
    },
    getContent: formatDateTime
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.processCpuPerc'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: ServiceDetailsStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: ServiceDetailsStatsRow) {
        return `serviceDetailsStats.${row.key}.processCpu`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.sapHana.dashboard.openFileCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: ServiceDetailsStatsRow) {
        return row.snapshotId;
      },
      getMetricName(row: ServiceDetailsStatsRow) {
        return `serviceDetailsStats.${row.key}.openFileCount`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function ServiceDetailsStatsList({ snapshotId, timeConfig }: ServiceDetailsStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'serviceDetailsStats'), [snapshotId]);
  const serviceDetailsStat = data ? (data as SnapshotData).get('raw_payload', []) : null;
  const rows: ServiceDetailsStatsRow[] = serviceDetailsStat
    ? serviceDetailsStat
        .keySeq()
        .toArray()
        .map((key: string) => {
          const serviceDetailsStats = serviceDetailsStat.get(key);
          return {
            key,
            snapshotId,
            timeConfig,
            serviceDetailsStats
          };
        })
    : [];
  function getDetails(row: ServiceDetailsStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`serviceDetailsStats.${row.key}.processCpu`],
                labels: [t('in-forge:plugins.sapHana.dashboard.processCpuPerc')],
                type: 'line',
                formatter: percentage.detailed
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`serviceDetailsStats.${row.key}.processCpuTime`],
                labels: [t('in-forge:plugins.sapHana.dashboard.processCpuTime')],
                type: 'line',
                formatter: seconds.detailed
              }}
              renderPostChartContent={PluginDashboardsMarkerLanes}
            />
          </DashboardSection>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [
                  `serviceDetailsStats.${row.key}.processPhysicalMemory`,
                  `serviceDetailsStats.${row.key}.processMemory`
                ],
                labels: [
                  t('in-forge:plugins.sapHana.dashboard.processPhysicalMemory'),
                  t('in-forge:plugins.sapHana.dashboard.processMemory')
                ],
                type: 'line',
                formatter: bytesTwoDecimalPlaces
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
      cardTitle={t('in-forge:plugins.sapHana.dashboard.serviceDetailsStats')}
      cols={cols}
      rows={rows}
      initialSortColumn={4}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
