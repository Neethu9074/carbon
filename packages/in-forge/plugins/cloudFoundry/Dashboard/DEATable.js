/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import { zeroDecimalPlaces, percentageTwoDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleAvailableDiskRatio'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'dea.dea_available_disk_ratio';
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleAvailableMemoryRatio'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'dea.dea_available_memory_ratio';
      },
      getContent: percentageTwoDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleBorn'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'dea.dea_registry_born';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleCrashed'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'dea.dea_registry_crashed';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleEvacuating'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'dea.dea_registry_evacuating';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleRunning'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'dea.dea_registry_running';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleStarting'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'dea.dea_registry_starting';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleStopped'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'dea.dea_registry_stopped';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function DEATable({ snapshot, timeConfig }) {
  const deaComponents = [''];

  const rows = deaComponents.map(component => {
    return {
      key: component,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.cloudFoundry.dashboard.titleDEACount', { deaCount: rows.length })}
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
      <DashboardSection title={t('in-forge:plugins.cloudFoundry.dashboard.titleResources')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: percentageTwoDecimalPlaces,
            tooltipFormatter: percentageTwoDecimalPlaces,
            metrics: ['dea.dea_available_disk_ratio', 'dea.dea_available_memory_ratio'],
            labels: [
              t('in-forge:plugins.cloudFoundry.dashboard.labelAvailableDiskRatio'),
              t('in-forge:plugins.cloudFoundry.dashboard.labelAvailableMemoryRatio')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.cloudFoundry.dashboard.titleRegistry')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [
              'dea.dea_registry_born',
              'dea.dea_registry_crashed',
              'dea.dea_registry_evacuating',
              'dea.dea_registry_running',
              'dea.dea_registry_starting',
              'dea.dea_registry_stopped'
            ],
            labels: [
              t('in-forge:plugins.cloudFoundry.dashboard.labelBorn'),
              t('in-forge:plugins.cloudFoundry.dashboard.labelCrashed'),
              t('in-forge:plugins.cloudFoundry.dashboard.labelEvacuating'),
              t('in-forge:plugins.cloudFoundry.dashboard.labelRunning'),
              t('in-forge:plugins.cloudFoundry.dashboard.labelStarting'),
              t('in-forge:plugins.cloudFoundry.dashboard.labelStopped')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
