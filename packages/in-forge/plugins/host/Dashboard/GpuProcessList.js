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
          pid: row.key,
          hostSnapshot: row.hostSnapshot
        });
      },
      withHierarchy: true,
      getFallbackContent(row) {
        return <span className={locals.label}>{row.gpuProcess.get('name')}</span>;
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
        return row.key;
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
        return 'GPU ' + row.gpuProcess.get('gpu');
      }
    }
  },
  {
    title: 'Memory',
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.gpuProcess.get('memory');
      },
      getContent: bytesTwoDecimalPlaces
    }
  }
];

export default connectTo(
  props => {
    return {
      rawPayloadWithTimestamp: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'gpuProcesses')
    };
  },
  function GpuProcessList({ snapshot, timeConfig, rawPayloadWithTimestamp }) {
    if (!rawPayloadWithTimestamp || !rawPayloadWithTimestamp.get('raw_payload')) {
      return null;
    }

    const gpuProcesses = rawPayloadWithTimestamp.get('raw_payload');
    if (gpuProcesses.size === 0) {
      return null;
    }

    const rows = gpuProcesses
      .keySeq()
      .toArray()
      .map(pid => {
        const gpuProcess = gpuProcesses.get(pid);
        return {
          key: String(pid),
          gpuProcess,
          timeConfig,
          hostSnapshot: snapshot,
          hostSnapshotId: snapshot.get('id')
        };
      });

    return <Table cardTitle={'GPU Memory/Process'} withoutPadding cols={cols} rows={rows} getRowDetails={getDetails} />;
  }
);

function getDetails(row) {
  return (
    <Chart
      snapshotId={row.hostSnapshotId}
      timeConfig={row.timeConfig}
      y1={{
        min: 0,
        formatter: bytesTwoDecimalPlaces,
        metrics: ['gpuProcesses.' + row.key + '.memory'],
        labels: ['Memory'],
        type: 'line'
      }}
    />
  );
}
