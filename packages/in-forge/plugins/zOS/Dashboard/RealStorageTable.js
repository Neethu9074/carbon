/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import Chart from 'in-infrastructure/components/InfrastructureMetricChartBehavior';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import { getRawPayloadWithTimestamp } from 'in-stores/snapshot';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.zOS.realStorage.job'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.zOS.realStorage.totalFrames'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `Real_Storage_Utilization_History.${row.key}.total_frames`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zOS.realStorage.activeFrames'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `Real_Storage_Utilization_History.${row.key}.active_frames`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.zOS.realStorage.idleFrames'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `Real_Storage_Utilization_History.${row.key}.idle_frames`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      data: getRawPayloadWithTimestamp(props.snapshotId, 'RealStorageRawData', props.timeConfig)
    };
  },
  function RealStorageTable({ data, snapshotId, timeConfig }) {
    if (!data || !data.get('raw_payload')) {
      return null;
    }

    const realStorageJobs = data.get('raw_payload');
    if (realStorageJobs.size === 0) {
      return null;
    }

    const rows = realStorageJobs
      .map((realStorageJob, key) => {
        return {
          key,
          snapshotId,
          timeConfig
        };
      })
      .valueSeq()
      .toArray();

    return (
      <Table
        withoutPadding
        cardTitle={t('in-forge:plugins.zOS.realStorage.title')}
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
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: [
            'Real_Storage_Utilization_History.' + row.key + '.total_frames',
            'Real_Storage_Utilization_History.' + row.key + '.active_frames',
            'Real_Storage_Utilization_History.' + row.key + '.idle_frames',
            'Real_Storage_Utilization_History.' + row.key + '.auxiliary_storage_slots',
            'Real_Storage_Utilization_History.' + row.key + '.memory_objects_allocated'
          ],
          labels: [
            t('in-forge:plugins.zOS.realStorage.totalFrames'),
            t('in-forge:plugins.zOS.realStorage.activeFrames'),
            t('in-forge:plugins.zOS.realStorage.idleFrames'),
            t('in-forge:plugins.zOS.realStorage.auxStorageSlots'),
            t('in-forge:plugins.zOS.realStorage.memoryObjectsAllocated')
          ],
          type: 'line',
          formatter: number.detailed
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: [
            'Real_Storage_Utilization_History.' + row.key + '.one_meg_frames_in_real',
            'Real_Storage_Utilization_History.' + row.key + '.active_frames_working_set',
            'Real_Storage_Utilization_History.' + row.key + '.active_frames_fixed',
            'Real_Storage_Utilization_History.' + row.key + '.active_frames_div'
          ],
          labels: [
            t('in-forge:plugins.zOS.realStorage.oneMegFramesInReal'),
            t('in-forge:plugins.zOS.realStorage.activeFramesWorkingSet'),
            t('in-forge:plugins.zOS.realStorage.activeFramesFixed'),
            t('in-forge:plugins.zOS.realStorage.activeFramesDiv')
          ],
          type: 'line',
          formatter: number.detailed
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
      <Chart
        snapshotId={row.snapshotId}
        timeConfig={row.timeConfig}
        y1={{
          min: 0,
          metrics: [
            'Real_Storage_Utilization_History.' + row.key + '.page_in_rate',
            'Real_Storage_Utilization_History.' + row.key + '.shared_page_in_rate',
            'Real_Storage_Utilization_History.' + row.key + '.shared_pages_total_views',
            'Real_Storage_Utilization_History.' + row.key + '.shared_pages_total_valid',
            'Real_Storage_Utilization_History.' + row.key + '.shared_pages_validation_rate'
          ],
          labels: [
            t('in-forge:plugins.zOS.realStorage.pageInRage'),
            t('in-forge:plugins.zOS.realStorage.sharedPageInRate'),
            t('in-forge:plugins.zOS.realStorage.sharedPagesTotalViews'),
            t('in-forge:plugins.zOS.realStorage.sharedPagesTotalValid'),
            t('in-forge:plugins.zOS.realStorage.sharedPagesValidationRate')
          ],
          type: 'line',
          formatter: number.detailed
        }}
        renderPostChartContent={PluginDashboardsMarkerLanes}
      />
    </div>
  );
}
