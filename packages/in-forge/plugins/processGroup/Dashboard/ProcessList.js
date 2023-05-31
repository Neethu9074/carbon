/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { percentageZeroDecimalPlaces, bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.processGroup.pid'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.processGroup.executable'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.process.get('exec');
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.processGroup.parentid'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.process.get('ppid');
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: t('in-forge:plugins.processGroup.cpuUsage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `pid.${row.key}.cpu.sys`;
      },
      getContent: percentageZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.processGroup.memory'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `pid.${row.key}.mem.resident`;
      },
      getContent: bytesTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'ProcessGroupRawData', props.timeConfig)
    };
  },
  function processesTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const processes = data.get('raw_payload');
    if (processes.size === 0) {
      return null;
    }

    const rows = processes
      .map((process, key) => {
        return {
          key,
          process,
          snapshotId,
          timeConfig
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.processGroup.title')}
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);

function getDetails(row) {
  return (
    <div>
      <Columize>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: ['pid.' + row.key + '.cpu.sys'],
            labels: [t('in-forge:plugins.processGroup.system')],
            type: 'line',
            formatter: percentageZeroDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: ['pid.' + row.key + '.mem.resident'],
            labels: [t('in-forge:plugins.processGroup.resident')],
            type: 'line',
            formatter: bytesTwoDecimalPlaces
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
    </div>
  );
}
