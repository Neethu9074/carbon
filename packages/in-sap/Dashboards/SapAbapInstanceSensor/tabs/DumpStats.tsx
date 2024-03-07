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
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

import locals from './RawTableFormat.mless';

interface DumpStatsRow {
  key: string;
  snapshotId: string;
  dumpStats: Map<string, object>;
}

interface DumpStatsProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:abapsensor.date'),
    type: 'string',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('E2E_DATE');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:abapsensor.time'),
    type: 'string',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('E2E_TIME');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:abapsensor.user'),
    type: 'string',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('E2E_USER');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:abapsensor.severity'),
    type: 'number',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('E2E_SEVERITY');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:abapsensor.errorId'),
    type: 'string',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('ERROR_ID');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:abapsensor.pgmName'),
    type: 'string',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('PGM_NAME');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:abapsensor.host'),
    type: 'string',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('E2E_HOST');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  },
  {
    title: t('in-sap:abapsensor.desc'),
    type: 'string',
    typeArgs: {
      getValue(row: DumpStatsRow) {
        return row.dumpStats.get('DESC');
      },
      getContent(args: any) {
        return <Args args={shorten(args, 128)} />;
      }
    }
  }
];

export default function DumpStats({ snapshotId, timeConfig }: DumpStatsProps) {
  const data = useObservable(() => getRawPayloadWithTimestamp(snapshotId, 'abapdumpstats'), [snapshotId]);
  if (!data) {
    return null;
  }
  const dumpStat = (data as SnapshotData).get('raw_payload', []);
  if (dumpStat.size === 0) {
    return null;
  }
  const rows: DumpStatsRow[] = dumpStat
    .keySeq()
    .toArray()
    .map((key: string) => {
      const dumpStats = dumpStat.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        dumpStats
      };
    });

  function getDetails(row: DumpStatsRow) {
    return (
      <div>
        <Columize>
          <DashboardSection title={t('in-sap:dashboards.abapdumpstats')}>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                metrics: [`abapdumpstats.${row.key}.E2E_SEVERITY`],
                labels: [t('in-sap:abapsensor.severity')],
                type: 'line',
                formatter: number.compact
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
      cardTitle={t('in-sap:dashboards.abapdumpstats')}
      cols={cols}
      rows={rows}
      initialSortColumn={0}
      initialSortDirection="asc"
      getRowDetails={getDetails}
    />
  );
}

function Args({ args }: any) {
  return <code className={locals.statement}>{args}</code>;
}
