/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { percentage, bytes, kiloBytes, withSiMultiplyPrefixThreeDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { isLinux, isWindows } from 'in-forge/plugins/host/hostUtils';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import { emptyMap } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { getMaxValue } from 'in-sdk/metrics';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

const deviceColumn = {
  title: t('in-forge:plugins.host.dashboard.device'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.key;
    }
  }
};
const mountsColumn = {
  title: t('in-forge:plugins.host.dashboard.mounts'),
  type: 'custom',
  typeArgs: {
    comparator: compareIgnoreCase,
    get(row) {
      const mount = row.filesystem.get('mount');
      const mounts = row.filesystem.get('mounts');

      if (mounts == null || mounts.size === 1) {
        return {
          value: mount,
          content: mount
        };
      }

      const mountsArray = mounts.toJS();
      return {
        value: mount,
        content: (
          <Tooltip content={mountsArray.join(', ')} delay={500}>
            <span>{`${mount} (+${mountsArray.length - 1})`}</span>
          </Tooltip>
        )
      };
    }
  }
};
const optionsColumn = {
  title: t('in-forge:plugins.host.dashboard.options'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.filesystem.get('options');
    }
  }
};
const typeColumn = {
  title: t('in-forge:plugins.host.dashboard.type'),
  type: 'string',
  typeArgs: {
    getValue(row) {
      return row.filesystem.get('systype');
    }
  }
};
const capacityColumn = {
  title: t('in-forge:plugins.host.dashboard.capacity'),
  type: 'number',
  typeArgs: {
    getValue(row) {
      return row.filesystem.get('capacity');
    },
    getContent: kiloBytes.detailed
  }
};
const usedColumn = {
  title: t('in-forge:plugins.host.dashboard.used'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return `fs.${row.key}.used`;
    },
    getContent: percentage.compact,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};
const leakedColumn = {
  title: t('in-forge:plugins.host.dashboard.leaked'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return `fs.${row.key}.leaked`;
    },
    getContent: kiloBytes.detailed,
    getTimeWindowAggregation() {
      return 'mean';
    }
  }
};

const iNodeUsageColumn = {
  title: t('in-forge:plugins.host.dashboard.inodeUsage'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return `fs.${row.key}.inodeUsage`;
    },
    getContent: percentage.compact,
    getTimeWindowAggregation() {
      return 'mean';
    },
    getFallbackContent() {
      return 'N/A';
    }
  }
};

const totalUtilizationColumn = {
  title: t('in-forge:plugins.host.dashboard.totalUtilization'),
  type: 'metric',
  typeArgs: {
    getSnapshotId(row) {
      return row.snapshotId;
    },
    getMetricName(row) {
      return `fs.${row.key}.totalUtilization`;
    },
    getContent: percentage.compact,
    getTimeWindowAggregation() {
      return 'mean';
    },
    getFallbackContent() {
      return 'N/A';
    }
  }
};

export default function FilesystemsTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const windows = isWindows(snapshot);
  const linux = isLinux(snapshot);
  const rows = snapshot
    .getIn(['data', 'filesystems'], emptyMap)
    .map((filesystem, name) => {
      return {
        key: name,
        filesystem,
        timeConfig,
        snapshotId,
        snapshot,
        windows,
        linux
      };
    })
    .valueSeq()
    .toArray();

  if (rows.length === 0) {
    return null;
  }

  const cols = [deviceColumn, optionsColumn, typeColumn, capacityColumn, usedColumn, leakedColumn];

  if (!windows) {
    cols.splice(1, 0, mountsColumn);
    cols.push(iNodeUsageColumn);
  }

  if (linux) {
    cols.push(totalUtilizationColumn);
  }

  return (
    <Table
      cardTitle={t('in-forge:plugins.host.dashboard.filesystems')}
      withoutPadding
      cols={cols}
      rows={rows}
      getRowDetails={getDetails}
      initialSortDirection="desc"
      initialSortColumn={cols.indexOf(usedColumn)}
    />
  );
}

function getDetails(row) {
  return (
    <>
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            max: getMaxValue('fs.' + row.key + '.free', row.snapshot),
            formatter: kiloBytes.detailed,
            tooltipFormatter: kiloBytes.detailed,
            metrics: ['fs.' + row.key + '.free', 'fs.' + row.key + '.leaked'],
            labels: [t('in-forge:plugins.host.dashboard.free'), t('in-forge:plugins.host.dashboard.leaked')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        {!row.windows && row.filesystem.get('icapacity') && (
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              max: getMaxValue('fs.' + row.key + '.inodeUsage', row.snapshot),
              metrics: ['fs.' + row.key + '.inodeUsage'],
              labels: [t('in-forge:plugins.host.dashboard.inodeUsage2')],
              type: 'line',
              formatter: percentage,
              tooltipFormatter: percentage.compact
            }}
            y2={{
              min: 0,
              max: getMaxValue('fs.' + row.key + '.ifree', row.snapshot),
              metrics: ['fs.' + row.key + '.ifree'],
              labels: [t('in-forge:plugins.host.dashboard.inodeFree')],
              type: 'line',
              formatter: withSiMultiplyPrefixThreeDecimalPlaces,
              tooltipFormatter: withSiMultiplyPrefixThreeDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        )}
      </Columize>
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: withSiMultiplyPrefixThreeDecimalPlaces,
            tooltipFormatter: withSiMultiplyPrefixThreeDecimalPlaces,
            metrics: ['fs.' + row.key + '.reads', 'fs.' + row.key + '.writes'],
            labels: [t('in-forge:plugins.host.dashboard.readsS'), t('in-forge:plugins.host.dashboard.writesS')],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            formatter: bytes.detailed,
            tooltipFormatter: bytes.detailed,
            metrics: ['fs.' + row.key + '.readBytes', 'fs.' + row.key + '.writeBytes'],
            labels: [
              t('in-forge:plugins.host.dashboard.bytesReadS'),
              t('in-forge:plugins.host.dashboard.bytesWrittenS')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
      {row.linux && (
        <Columize>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              metrics: [
                'fs.' + row.key + '.totalUtilization',
                'fs.' + row.key + '.readUtilization',
                'fs.' + row.key + '.writeUtilization'
              ],
              labels: [
                t('in-forge:plugins.host.dashboard.totalUtilization'),
                t('in-forge:plugins.host.dashboard.readUtilization'),
                t('in-forge:plugins.host.dashboard.writeUtilization')
              ],
              type: 'line',
              min: 0,
              formatter: percentage,
              tooltipFormatter: percentage.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </Columize>
      )}
    </>
  );
}
