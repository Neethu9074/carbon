/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { zeroDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleRoutines'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'hm.hm_api_num_go_routines';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleAllocated'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'hm.hm_api_bytes_allocated';
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleAllocatedHeap'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'hm.hm_api_bytes_allocated_heap';
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleAllocatedStack'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'hm.hm_api_bytes_allocated_stack';
      },
      getContent: bytesZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleCrashedIndices'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'hm.hm_analyzer_num_crashed_indices';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleCrashedInstances'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'hm.hm_analyzer_num_crashed_instances';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleMissingIndices'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'hm.hm_analyzer_num_missing_indices';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleRunningInstances'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'hm.hm_analyzer_num_running_instances';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function HealthManagerTable({ snapshot, timeConfig }) {
  const hmComponents = [''];

  const rows = hmComponents.map(component => {
    return {
      key: component,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.cloudFoundry.dashboard.titleHealthManagerCount', { healthCount: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  const snapshotId = row.snapshotId;
  return (
    <div>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.cloudFoundry.dashboard.titleRoutines')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              formatter: zeroDecimalPlaces,
              tooltipFormatter: zeroDecimalPlaces,
              metrics: ['hm.hm_api_num_go_routines'],
              labels: [t('in-forge:plugins.cloudFoundry.dashboard.labelGoRoutines')],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>

        <DashboardSection title={t('in-forge:plugins.cloudFoundry.dashboard.titleMemory')}>
          <Chart
            snapshotId={snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              formatter: bytesZeroDecimalPlaces,
              tooltipFormatter: bytesZeroDecimalPlaces,
              metrics: [
                'hm.hm_api_bytes_allocated',
                'hm.hm_api_bytes_allocated_heap',
                'hm.hm_api_bytes_allocated_stack'
              ],
              labels: [
                t('in-forge:plugins.cloudFoundry.dashboard.labelAllocated'),
                t('in-forge:plugins.cloudFoundry.dashboard.labelAllocatedHeap'),
                t('in-forge:plugins.cloudFoundry.dashboard.labelAllocatedStack')
              ],
              type: 'line'
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>
      <DashboardSection title={t('in-forge:plugins.cloudFoundry.dashboard.titleHealthManagerAnalyzer')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [
              'hm.hm_analyzer_num_crashed_indices',
              'hm.hm_analyzer_num_crashed_instances',
              'hm.hm_analyzer_num_missing_indices',
              'hm.hm_analyzer_num_running_instances'
            ],
            labels: [
              t('in-forge:plugins.cloudFoundry.dashboard.titleCrashedIndices'),
              t('in-forge:plugins.cloudFoundry.dashboard.titleCrashedInstances'),
              t('in-forge:plugins.cloudFoundry.dashboard.titleMissingIndices'),
              t('in-forge:plugins.cloudFoundry.dashboard.titleRunningInstances')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
