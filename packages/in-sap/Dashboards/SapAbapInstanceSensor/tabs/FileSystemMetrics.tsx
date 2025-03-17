/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

// @ts-expect-error Module needs to be translated to TS
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
// @ts-expect-error needs TS migration
import { SnapshotData, getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { megaBytes, percentage } from 'in-services/formatters/number';
import Columize from 'in-sdk/components/dashboard/Columize';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import { t } from 'in-i18n';

interface FileSystemRow {
  key: string;
  snapshotId: string;
  fileSystem: Map<string, object>;
}

interface FileSystemProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const cols = [
  {
    title: t('in-sap:dashboards.serialNo'),
    type: 'number',
    typeArgs: {
      getValue(row: FileSystemRow) {
        return row.fileSystem.get('SERIALNR');
      },
      getContent: number.compact
    }
  },
  {
    title: t('in-sap:dashboards.fileType'),
    type: 'string',
    typeArgs: {
      getValue(row: FileSystemRow) {
        return row.fileSystem.get('TYPE');
      }
    }
  },
  {
    title: t('in-sap:dashboards.fileSubTytpe'),
    type: 'string',
    typeArgs: {
      getValue(row: FileSystemRow) {
        return row.fileSystem.get('SUBTYPE');
      }
    }
  },
  {
    title: t('in-sap:dashboards.fileSystemName'),
    type: 'string',
    typeArgs: {
      getValue(row: FileSystemRow) {
        return shorten(row.fileSystem.get('FSYSNAME') as any, 64);
      }
    }
  },
  {
    title: t('in-sap:dashboards.capacity'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: FileSystemRow) {
        return row.snapshotId;
      },
      getMetricName(row: FileSystemRow) {
        return `fileSystemStats.${row.key}.CAPACITY`;
      },
      getContent: megaBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.free'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: FileSystemRow) {
        return row.snapshotId;
      },
      getMetricName(row: FileSystemRow) {
        return `fileSystemStats.${row.key}.FREE`;
      },
      getContent: megaBytes.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-sap:dashboards.usage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row: FileSystemRow) {
        return row.snapshotId;
      },
      getMetricName(row: FileSystemRow) {
        return `fileSystemStats.${row.key}.USED_PERCENTAGE`;
      },
      getContent: percentage.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function FileSystemMetrics({ snapshotId, timeConfig }: FileSystemProps) {
  const data = useObservable(
    () => getRawPayloadWithTimestamp(snapshotId, 'fileSystemStats', timeConfig),
    [snapshotId, timeConfig]
  );
  if (!data) {
    return null;
  }
  const fileSystemList = (data as SnapshotData).get('raw_payload', []);
  const rows: FileSystemRow[] = fileSystemList
    .keySeq()
    .toArray()
    .map((key: string) => {
      const fileSystem = fileSystemList.get(key);
      return {
        key,
        snapshotId,
        timeConfig,
        fileSystem
      };
    });

  function getDetails(row: FileSystemRow) {
    return (
      <div>
        <Columize>
          <DashboardSection>
            <Chart
              snapshotId={snapshotId}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: megaBytes.detailed,
                metrics: [`fileSystemStats.${row.key}.CAPACITY`, `fileSystemStats.${row.key}.FREE`],
                labels: [t('in-sap:dashboards.capacity'), t('in-sap:dashboards.free')],
                type: 'line'
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
                formatter: percentage.detailed,
                metrics: [`fileSystemStats.${row.key}.USED_PERCENTAGE`],
                labels: [t('in-sap:dashboards.usage')],
                type: 'line',
                // @ts-expect-error Module needs to be translated to TS
                colors: [themes.default.ids.color.option.purple['500']]
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
      cardTitle={t('in-sap:dashboards.fileSystemMetrics')}
      cols={cols}
      rows={rows}
      initialSortColumn={6}
      initialSortDirection="desc"
      getRowDetails={getDetails}
    />
  );
}
