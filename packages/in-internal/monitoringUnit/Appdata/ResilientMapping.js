/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { Fragment } from 'react';
import { t } from 'in-i18n';

import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

function getCols(fqn) {
  return [
    {
      title: t('in-internal:monitoringUnit.appdata.resilientMapping.customer'),
      type: 'string',
      typeArgs: {
        getValue(row) {
          return row.container.get('label');
        }
      }
    },
    {
      title: 'appdata-processor',
      type: 'snapshotLink',
      typeArgs: {
        pathname: physicalDashboardPath,
        getSnapshotId(row) {
          return row.dropwizard.get('id');
        }
      }
    },
    {
      title: t('in-internal:monitoringUnit.appdata.resilientMapping.firstLevelCacheHits'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.dropwizard.get('id');
        },
        getMetricName() {
          return `metrics.meters.${fqn}.cache-hits`;
        },
        getContent: number.compact,
        forceTimeWindowAggregation: true,
        getTimeWindowAggregation() {
          return 'sum';
        }
      }
    },
    {
      title: t('in-internal:monitoringUnit.appdata.resilientMapping.secondLevelCacheHits'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.dropwizard.get('id');
        },
        getMetricName() {
          return `metrics.meters.${fqn}.cache-hits-with-disambiguation`;
        },
        getContent: number.compact,
        forceTimeWindowAggregation: true,
        getTimeWindowAggregation() {
          return 'sum';
        }
      }
    },
    {
      title: t('in-internal:monitoringUnit.appdata.resilientMapping.cacheMissesMulti'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.dropwizard.get('id');
        },
        getMetricName() {
          return `metrics.meters.${fqn}.cache-misses-caused-by-multiple-entities`;
        },
        getContent: number.compact,
        forceTimeWindowAggregation: true,
        getTimeWindowAggregation() {
          return 'sum';
        }
      }
    },
    {
      title: t('in-internal:monitoringUnit.appdata.resilientMapping.cacheSize'),
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.dropwizard.get('id');
        },
        getMetricName() {
          return `metrics.gauges.${fqn}.cache-size`;
        },
        getContent: number.compact,
        forceTimeWindowAggregation: true,
        getTimeWindowAggregation() {
          return 'mean';
        }
      }
    }
  ];
}

export default connectTo({
  timeConfig: timeConfig$,
  rows: getDropwizardWithContext('entity.label:appdata-processor*')
})(function ResilientMapping({ rows }) {
  if (rows.length === 0) {
    return <LoadingIndicator />;
  }

  return (
    <div>
      <DashboardSection title={t('in-internal:monitoringUnit.appdata.resilientMapping.appMapping')}>
        <Table
          cols={getCols('com.instana.spanprocessing.stream.mapping.application.ApplicationCache')}
          rows={rows}
          maxItemsPerPage={10}
          getRowDetails={row =>
            getRowDetails(row, 'com.instana.spanprocessing.stream.mapping.application.ApplicationCache')
          }
        />
      </DashboardSection>
      <DashboardSection title={t('in-internal:monitoringUnit.appdata.resilientMapping.serviceMapping')}>
        <Table
          cols={getCols('com.instana.spanprocessing.stream.mapping.service.ServiceCache')}
          rows={rows}
          maxItemsPerPage={10}
          getRowDetails={row => getRowDetails(row, 'com.instana.spanprocessing.stream.mapping.service.ServiceCache')}
        />
      </DashboardSection>
    </div>
  );
});

function getRowDetails(row, fqn) {
  return (
    <Fragment>
      <Chart
        snapshotId={row.dropwizard.get('id')}
        timeConfig={row.timeConfig}
        minRollup={5000}
        y1={{
          min: 0,
          formatter: number.detailed,
          metrics: [
            `metrics.meters.${fqn}.cache-hits`,
            `metrics.meters.${fqn}.cache-hits-with-disambiguation``metrics.meters.${fqn}.cache-misses-caused-by-multiple-entities`
          ],
          labels: [
            t('in-internal:monitoringUnit.appdata.resilientMapping.firstLevelCacheHits'),
            t('in-internal:monitoringUnit.appdata.resilientMapping.secondLevelCacheHits'),
            t('in-internal:monitoringUnit.appdata.resilientMapping.cacheMissMultiple')
          ],
          type: 'line'
        }}
      />
      <Chart
        snapshotId={row.dropwizard.get('id')}
        timeConfig={row.timeConfig}
        minRollup={5000}
        y1={{
          min: 0,
          formatter: number.detailed,
          metrics: [`metrics.gauges.${fqn}.cache-size`],
          labels: [t('in-internal:monitoringUnit.appdata.resilientMapping.cacheSize')],
          type: 'line'
        }}
      />
      <Chart
        snapshotId={row.dropwizard.get('id')}
        timeConfig={row.timeConfig}
        minRollup={5000}
        y1={{
          min: 0,
          formatter: number.detailed,
          metrics: [`metrics.meters.${fqn}.expired-entries-because-cache-full`],
          labels: [t('in-internal:monitoringUnit.appdata.resilientMapping.evictionsCacheFull')],
          type: 'line'
        }}
      />
    </Fragment>
  );
}
