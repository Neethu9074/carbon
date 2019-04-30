import React, { Fragment } from 'react';

import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import { number } from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

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
      title: 'Successful predictions',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.dropwizard.get('id');
        },
        getMetricName() {
          return `metrics.meters.${fqn}.successful-predictions`;
        },
        getContent: number.compact,
        forceTimeWindowAggregation: true,
        getTimeWindowAggregation() {
          return 'sum';
        }
      }
    },
    {
      title: 'Failed predictions (multi-labels)',
      type: 'metric',
      typeArgs: {
        getSnapshotId(row) {
          return row.dropwizard.get('id');
        },
        getMetricName() {
          return `metrics.meters.${fqn}.failed-predictions-caused-by-multiple-labels`;
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
})(function FillerSpanProcessingStats({ rows }) {
  if (rows.length === 0) {
    return <LoadingIndicator type="dark" />;
  }

  return (
    <div>
      <DashboardSection title="Application Mapping">
        <Table
          cols={getCols('com.instana.spanprocessing.stream.serviceextraction.ServiceClassifier')}
          rows={rows}
          maxItemsPerPage={20}
          getRowDetails={row =>
            getRowDetails(row, 'com.instana.spanprocessing.stream.serviceextraction.ServiceClassifier')
          }
        />
      </DashboardSection>
      <DashboardSection title="Service Mapping">
        <Table
          cols={getCols('com.instana.spanprocessing.stream.applicationextraction.ApplicationClassifier')}
          rows={rows}
          maxItemsPerPage={20}
          getRowDetails={row =>
            getRowDetails(row, 'com.instana.spanprocessing.stream.applicationextraction.ApplicationClassifier')
          }
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
            `metrics.meters.${fqn}.successful-predictions`,
            `metrics.meters.${fqn}.failed-predictions-caused-by-multiple-labels`
          ],
          labels: ['Sucessful predictions', 'Failed predictions caused by multiple labels'],
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
          metrics: [`metrics.meters.${fqn}.expired-classifications-because-cache-full`],
          labels: ['Evictions because of cache full'],
          type: 'line'
        }}
      />
    </Fragment>
  );
}
