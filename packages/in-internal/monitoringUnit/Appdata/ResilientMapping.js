import React, { Fragment } from 'react';

import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import { number } from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';

function getCols(fqn) {
  return [
    {
      title: 'Customer',
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
      title: 'Cache Hits',
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
      title: 'Cache misses (multi-labels)',
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
      title: 'Cache size',
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
    return <LoadingIndicator type="dark" />;
  }

  return (
    <div>
      <DashboardSection title="Application Mapping">
        <Table
          cols={getCols('com.instana.spanprocessing.stream.mapping.application.ApplicationCache')}
          rows={rows}
          maxItemsPerPage={20}
          getRowDetails={row =>
            getRowDetails(row, 'com.instana.spanprocessing.stream.mapping.application.ApplicationCache')
          }
        />
      </DashboardSection>
      <DashboardSection title="Service Mapping">
        <Table
          cols={getCols('com.instana.spanprocessing.stream.mapping.service.ServiceCache')}
          rows={rows}
          maxItemsPerPage={20}
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
            `metrics.meters.${fqn}.cache-misses-caused-by-multiple-entities`
          ],
          labels: ['Cache Hits', 'Cache misses caused by multiple entities'],
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
          labels: ['Cache size'],
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
          labels: ['Evictions because of cache full'],
          type: 'line'
        }}
      />
    </Fragment>
  );
}
