/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { zeroDecimalPlaces } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleRequestsCompleted'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cloud_controller.cc_requests_completed';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleRequestsOutstanding'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cloud_controller.cc_requests_outstanding';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleTotalUsers'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cloud_controller.cc_total_users';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleThreadCount'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cloud_controller.cc_thread_count';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleTotalFailedJobs'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName() {
        return 'cloud_controller.cc_total_failed_job_count';
      },
      getContent: zeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CloudControllerTable({ snapshot, timeConfig }) {
  const ccComponents = [''];

  const rows = ccComponents.map(app => {
    return {
      key: app,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.cloudFoundry.dashboard.titleCloudControllerCount', { cloudCount: rows.length })}
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
      <DashboardSection title={t('in-forge:plugins.cloudFoundry.dashboard.titleRequests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: ['cloud_controller.cc_requests_completed', 'cloud_controller.cc_requests_outstanding'],
            labels: [
              t('in-forge:plugins.cloudFoundry.dashboard.labelRequestsCompleted'),
              t('in-forge:plugins.cloudFoundry.dashboard.labelRequestsOutstanding')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
      <DashboardSection title={t('in-forge:plugins.cloudFoundry.dashboard.titleStatistics')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: [
              'cloud_controller.cc_total_users',
              'cloud_controller.cc_thread_count',
              'cloud_controller.cc_total_failed_job_count'
            ],
            labels: [
              t('in-forge:plugins.cloudFoundry.dashboard.labelTotalUsers'),
              t('in-forge:plugins.cloudFoundry.dashboard.labelThreadCount'),
              t('in-forge:plugins.cloudFoundry.dashboard.labelTotalFailedJobs')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
