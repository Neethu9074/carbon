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
    title: t('in-forge:plugins.cloudFoundry.dashboard.titleComponent'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  }
];

export default function DiegoTable({ snapshot, timeConfig }) {
  const diegoComponents = ['auctioneer', 'stager', 'fileserver'];

  const rows = diegoComponents.map(component => {
    return {
      key: component,
      snapshotId: snapshot.get('id'),
      timeConfig
    };
  });

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.cloudFoundry.diegoWithCount', { len: rows.length })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  if (row.key === 'auctioneer') {
    return auctioneerCharts(row);
  } else if (row.key === 'stager') {
    return stagerCharts(row);
  } else {
    return fileserverCharts(row);
  }
}

function auctioneerCharts(row) {
  const snapshotId = row.snapshotId;
  return (
    <Columize>
      <DashboardSection title={t('in-forge:plugins.cloudFoundry.dashboard.titleRoutines')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: ['diego.auctioneer_num_go_routines'],
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
              'diego.auctioneer_bytes_allocated',
              'diego.auctioneer_bytes_allocated_heap',
              'diego.auctioneer_bytes_allocated_stack'
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
  );
}

function stagerCharts(row) {
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
              metrics: ['diego.stager_num_go_routines'],
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
                'diego.stager_bytes_allocated',
                'diego.stager_bytes_allocated_heap',
                'diego.stager_bytes_allocated_stack'
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
      <DashboardSection title={t('in-forge:plugins.cloudFoundry.dashboard.titleRequests')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: ['diego.stager_staging_req_failed', 'diego.stager_staging_req_succeeded'],
            labels: [
              t('in-forge:plugins.cloudFoundry.dashboard.labelRequestsFailed'),
              t('in-forge:plugins.cloudFoundry.dashboard.labelRequestsSucceeded')
            ],
            type: 'line'
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}

function fileserverCharts(row) {
  const snapshotId = row.snapshotId;
  return (
    <Columize>
      <DashboardSection title={t('in-forge:plugins.cloudFoundry.dashboard.titleRoutines')}>
        <Chart
          snapshotId={snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            formatter: zeroDecimalPlaces,
            tooltipFormatter: zeroDecimalPlaces,
            metrics: ['diego.fs_num_go_routines'],
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
            metrics: ['diego.fs_bytes_allocated', 'diego.fs_bytes_allocated_heap', 'diego.fs_bytes_allocated_stack'],
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
  );
}
