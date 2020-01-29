import React from 'react';

import getProcessSnapshotIdForPid from 'in-subscription/processSnapshotIdForPid';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';

import locals from './ProcessTopList.mless';

const cols = [
  {
    title: 'Process',
    type: 'snapshotLink',
    typeArgs: {
      getSnapshotId$(row) {
        return getProcessSnapshotIdForPid({
          pid: row.process.get('pid'),
          hostSnapshot: row.host
        });
      },
      withHierarchy: true,
      getFallbackContent(row) {
        return <span className={locals.label}>{row.process.get('name')}</span>;
      },
      useSnapshotFromHierarchyCallback(snapshot, hierarchy) {
        if (hierarchy && hierarchy.length > 0) {
          return hierarchy[0];
        }
        return snapshot;
      }
    }
  },
  {
    title: 'PID',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.process.get('pid');
      },
      getContent(value) {
        return value;
      }
    }
  },
  {
    title: 'GPU',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return 'GPU ' + row.process.get('gpu');
      }
    }
  },
  {
    title: 'Memory',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.process.get('memory');
      },
      getContent: bytesTwoDecimalPlaces
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'gpuProcesses')
    };
  },
  function ProcessTopList({ snapshot, data }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const gpuProcesses = data.get('raw_payload');
    if (gpuProcesses.size === 0) {
      return null;
    }

    const timeConfig = data.get('timestamp');
    const rows = gpuProcesses.toArray().map(process => {
      return {
        key: String(process.get('pid')),
        process,
        timeConfig,
        host: snapshot
      };
    });

    return (
      <Table cardTitle={'GPU Memory/Process'} withoutPadding cols={cols} rows={rows} getRowDetails={getRowDetails} />
    );
  }
);

function getRowDetails(row) {
  return (
    <Chart
      snapshotId={row.snapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: bytesTwoDecimalPlaces,
        metric: 'memory',
        label: 'Memory',
        type: 'line'
      }}
    />
  );
}
