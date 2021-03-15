/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { number, millis, hitRateZeroDecimalPlaces } from 'in-services/formatters/number';
import PluginDashboardsMarkerLanes from 'in-forge/PluginDashboardsMarkerLanes';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Columize from 'in-sdk/components/dashboard/Columize';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { t } from 'in-i18n';

const cols = [
  {
    title: t('in-forge:plugins.solr.dashboard.core'),
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  },
  {
    title: t('in-forge:plugins.solr.dashboard.requests'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `core_stats.${row.key}.requests`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.solr.dashboard.requestTime'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `core_stats.${row.key}.avg_time_request`;
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.solr.dashboard.cacheHitRate'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `core_stats.${row.key}.hitratio`;
      },
      getContent: hitRateZeroDecimalPlaces,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.solr.dashboard.evictions'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `core_stats.${row.key}.evictions`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: t('in-forge:plugins.solr.dashboard.errors'),
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.snapshotId;
      },
      getMetricName(row) {
        return `core_stats.${row.key}.errors`;
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default function CoresTable({ snapshot, timeConfig }) {
  const snapshotId = snapshot.get('id');
  const rows = snapshot
    .getIn(['data', 'core_names'], emptyList)
    .toArray()
    .map(name => {
      return {
        key: name,
        timeConfig,
        snapshotId
      };
    });

  if (rows.length === 0) {
    return null;
  }

  return (
    <Table
      withoutPadding
      cardTitle={t('in-forge:plugins.solr.dashboard.coresWithCount', {
        count: rows.length
      })}
      cols={cols}
      rows={rows}
      getRowDetails={getRowDetails}
    />
  );
}

function getRowDetails(row) {
  return (
    <div>
      <Columize>
        <DashboardSection title={t('in-forge:plugins.solr.dashboard.requests')}>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.requests'],
              labels: [t('in-forge:plugins.solr.dashboard.requests')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.solr.dashboard.requestTime')}>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.avg_time_request'],
              labels: [t('in-forge:plugins.solr.dashboard.averageRequestTime')],
              type: 'line',
              formatter: millis.detailed
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.solr.dashboard.cacheLookups')}>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.lookups'],
              labels: [t('in-forge:plugins.solr.dashboard.lookups')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.solr.dashboard.cacheHitRate')}>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.hitratio'],
              labels: ['Hit-rate'],
              type: 'line',
              formatter: hitRateZeroDecimalPlaces
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.solr.dashboard.insertions')}>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.inserts'],
              labels: [t('in-forge:plugins.solr.dashboard.inserts')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.solr.dashboard.evictions')}>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.evictions'],
              labels: [t('in-forge:plugins.solr.dashboard.evictions')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <Columize>
        <DashboardSection title={t('in-forge:plugins.solr.dashboard.errors')}>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.errors'],
              labels: [t('in-forge:plugins.solr.dashboard.errors')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
        <DashboardSection title={t('in-forge:plugins.solr.dashboard.timeouts')}>
          <Chart
            snapshotId={row.snapshotId}
            timeConfig={row.timeConfig}
            y1={{
              min: 0,
              metrics: ['core_stats.' + row.key + '.timeouts'],
              labels: [t('in-forge:plugins.solr.dashboard.timeouts')],
              type: 'line',
              formatter: number.compact
            }}
            renderPostChartContent={PluginDashboardsMarkerLanes}
          />
        </DashboardSection>
      </Columize>

      <DashboardSection title={t('in-forge:plugins.solr.dashboard.documents')}>
        <Chart
          snapshotId={row.snapshotId}
          timeConfig={row.timeConfig}
          y1={{
            min: 0,
            metrics: ['core_stats.' + row.key + '.docs_added', 'core_stats.' + row.key + '.docs_pending'],
            labels: [
              t('in-forge:plugins.solr.dashboard.documentsAdded'),
              t('in-forge:plugins.solr.dashboard.documentsPending')
            ],
            type: 'line',
            formatter: number.compact
          }}
          renderPostChartContent={PluginDashboardsMarkerLanes}
        />
      </DashboardSection>
    </div>
  );
}
