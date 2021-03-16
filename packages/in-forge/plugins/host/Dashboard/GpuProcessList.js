/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import getProcessSnapshotIdForPid from 'in-subscription/processSnapshotIdForPid';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Table from 'in-sdk/components/dashboard/Table';
import { shorten } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './ProcessTopList.mless';

const cols = [
  {
    title: t('in-forge:plugins.host.dashboard.pid'),
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
    title: t('in-forge:plugins.host.dashboard.processName'),
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
        const processName = row.gpuProcess.get('name');
        return (
          <Tooltip content={processName}>
            <span className={locals.label}>{shorten(processName, 100)}</span>
          </Tooltip>
        );
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
    title: t('in-forge:plugins.host.dashboard.gpu'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return 'GPU ' + row.gpuProcess.get('gpu');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.memory'),
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
        labels: [t('in-forge:plugins.host.dashboard.memory')],
        type: 'line'
      }}
      renderPostChartContent={PluginDashboardsMarkerLanes}
    />
  );
}
