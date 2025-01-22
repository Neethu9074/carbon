/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { bytesTwoDecimalPlaces } from 'in-services/formatters/number';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.host.dashboard.volumeGroupName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.vol.get('volume_group_name');
      }
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.totalSize'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.vol.get('total_size');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.usedSize'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.vol.get('used_size');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.freeSize'),
    type: 'number',
    typeArgs: {
      getValue(row) {
        return row.vol.get('free_size');
      },
      getContent: bytesTwoDecimalPlaces
    }
  },
  {
    title: t('in-forge:plugins.host.dashboard.volumeGrpState'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.vol.get('vg_state');
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      rawPayloadWithTimestamp: getRawPayloadWithTimestamp(props.snapshot.get('id'), 'volumeGroups')
    };
  },
  function VolumeGroups({ snapshot, timeConfig, rawPayloadWithTimestamp }) {
    if (!rawPayloadWithTimestamp || !rawPayloadWithTimestamp.get('raw_payload')) {
      return null;
    }

    const volumeGroups = rawPayloadWithTimestamp.get('raw_payload', []);
    if (volumeGroups.size === 0) {
      return null;
    }
    const rows = volumeGroups
      .keySeq()
      .toArray()
      .map(key => {
        const vol = volumeGroups.get(key);
        return {
          key: String(key),
          vol,
          timeConfig,
          hostSnapshot: snapshot,
          hostSnapshotId: snapshot.get('id')
        };
      });

    return (
      <Table
        cardTitle={t('in-forge:plugins.host.dashboard.volumeGroups')}
        withoutPadding
        cols={cols}
        rows={rows}
        getRowDetails={getDetails}
      />
    );
  }
);

function getDetails(row) {
  return (
    <Columize>
      <Chart
        snapshotId={row.hostSnapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: bytesTwoDecimalPlaces,
          metrics: ['volumeGroups.' + row.key + '.total_size'],
          labels: ['total size'],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.hostSnapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          formatter: bytesTwoDecimalPlaces,
          metrics: ['volumeGroups.' + row.key + '.free_size'],
          labels: ['free size'],
          type: 'line'
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </Columize>
  );
}
