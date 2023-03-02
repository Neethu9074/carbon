/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { number, micros, percentageZeroDecimalPlaces } from 'in-services/formatters/number';
import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.zIms.dependentRegion.regionName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.dependentRegion.type'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.dependentRegionJob.get('type');
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.dependentRegion.regionStatus'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.dependentRegionJob.get('region_status');
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.dependentRegion.regionOccupancyPercentage'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `dependent_region_statistics.${row.key}.region_occupancy_percentage`;
      },
      getContent: percentageZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.dependentRegion.regionIdentifier'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.dependentRegionJob.get('region_identifier') + '';
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.dependentRegion.transactionName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.dependentRegionJob.get('transaction_name');
      }
    }
  },
  {
    title: t('in-forge:plugins.zIms.dependentRegion.psbName'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.dependentRegionJob.get('psb_name');
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'DependentRegionRawData', props.timeConfig)
    };
  },
  function dependentRegionTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const dependentRegionJobs = data.get('raw_payload');
    if (dependentRegionJobs.size === 0) {
      return null;
    }

    const rows = dependentRegionJobs
      .map((dependentRegionJob, key) => {
        return {
          key,
          dependentRegionJob,
          snapshotId,
          timeConfig
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.zIms.dependentRegion.title')}
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
            metrics: ['dependent_region_statistics.' + row.key + '.transaction_elapsed_time'],
            labels: [t('in-forge:plugins.zIms.dependentRegion.transactionElapsedTime')],
            type: 'line',
            formatter: micros.detailed
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: ['dependent_region_statistics.' + row.key + '.external_subsystem_calls'],
            labels: [t('in-forge:plugins.zIms.dependentRegion.externalSubsystemCalls')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: ['dependent_region_statistics.' + row.key + '.locks_held_count'],
            labels: [t('in-forge:plugins.zIms.dependentRegion.locksHeldCount')],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </Columize>
    </div>
  );
}
