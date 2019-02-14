import React, { Fragment } from 'react';

import { physicalDashboardPath } from 'in-stores/navigation/paths/mainPaths';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getDropwizardWithContext } from 'in-internal/dataRetrieval';
import { number, percentage } from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

const cols = [
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
    title: 'Prediction success rate',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.gauges.com.instana.spanprocessing.stream.serviceextraction.ServiceClassifier.predictions.error_rate`;
      },
      getContent: percentage.detailed,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'mean';
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
        return `metrics.gauges.com.instana.spanprocessing.stream.serviceextraction.ServiceClassifier.cache-size`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo({
  timeConfig: timeConfig$,
  rows: getDropwizardWithContext('entity.label:appdata-processor*')
})(function FillerSpanProcessingStats({ rows }) {
  if (rows.length === 0) {
    return <LoadingIndicator type="dark" />;
  }

  return (
    <div>
      <DashboardSection title={`appdata-processors (${rows.length})`}>
        <Table cols={cols} rows={rows} maxItemsPerPage={20} getRowDetails={getRowDetails} />
      </DashboardSection>
    </div>
  );
});

function getRowDetails(row) {
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
            `metrics.meters.com.instana.spanprocessing.stream.serviceextraction.ServiceClassifier.predictions.calls`,
            `metrics.meters.com.instana.spanprocessing.stream.serviceextraction.ServiceClassifier.predictions.errors`
          ],
          labels: ['Sucessful predictions', 'Failed predictions'],
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
          metrics: [`metrics.gauges.com.instana.spanprocessing.stream.serviceextraction.ServiceClassifier.cache-size`],
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
          metrics: [
            `metrics.meters.com.instana.spanprocessing.stream.serviceextraction.ServiceClassifier.expired-classifications-because-cache-full`
          ],
          labels: ['Evictions because of cache full'],
          type: 'line'
        }}
      />
    </Fragment>
  );
}
