import React, { Fragment } from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { number, percentage, millis } from 'in-services/formatters/number';
import { getDropwizardWithContext } from 'in-internal/dataRetrieval';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { compareIgnoreCase } from 'in-services/util/string';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

const cols = [
  {
    title: 'Method',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.method;
      }
    }
  },
  {
    title: 'Calls',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName(row) {
        return `metrics.meters.grpc.outgoing.perMethod.${row.method}.calls`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: 'Error Rate',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName(row) {
        return `metrics.gauges.grpc.outgoing.perMethod.${row.method}.error_rate`;
      },
      getContent: percentage.detailed,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Latency 50th',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName(row) {
        return `metrics.timers.grpc.outgoing.perMethod.${row.method}.timer.50th`;
      },
      getContent: millis.fixedDetailed,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Latency 99th',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName(row) {
        return `metrics.timers.grpc.outgoing.perMethod.${row.method}.timer.99th`;
      },
      getContent: millis.fixedDetailed,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo({
  timeConfig: timeConfig$,
  rows: getDropwizardWithContext('entity.label:"appdata-reader"')
})(function AppdataWriterStatistics({ rows }) {
  if (rows.length === 0) {
    return <LoadingIndicator type="dark" />;
  }

  const process = rows[0];
  rows = process.dropwizard
    .getIn(['data', 'metrics.timers'], emptyList)
    .toJS()
    .filter(k => k.indexOf('grpc.outgoing.perMethod.') === 0)
    .map(k => {
      const method = k.replace(/^grpc\.outgoing\.perMethod\.(.+)\.timer/, '$1');
      return {
        ...process,
        key: method,
        method
      };
    })
    .sort(compareIgnoreCase);

  return (
    <div>
      <h1>appdata-reader</h1>

      <p>
        All the columns within the table show sums/averages across the selected time window, i.e. total number of calls
        in time window or average 99th percentile in time window.
      </p>

      <p>
        <strong>
          Warning: This dashboard only works as long as there is one appdata-reader deployed per region (it only shows
          the metric for the first appdata-reader).
        </strong>
      </p>

      <DashboardSection title={`Methods (${rows.length})`}>
        <Table
          cols={cols}
          rows={rows}
          getRowDetails={getRowDetails}
          initialSortColumn={1}
          initialSortDirection="desc"
          maxItemsPerPage={25}
        />
      </DashboardSection>
    </div>
  );
});

function getRowDetails(row) {
  return (
    <Fragment>
      <DashboardSection title="Calls">
        <Chart
          snapshotId={row.dropwizard.get('id')}
          timeConfig={row.timeConfig}
          minRollup={5000}
          y1={{
            min: 0,
            formatter: number.detailed,
            metrics: [`metrics.meters.grpc.outgoing.perMethod.${row.method}.calls`],
            labels: ['Calls'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Errors">
        <Chart
          snapshotId={row.dropwizard.get('id')}
          timeConfig={row.timeConfig}
          minRollup={5000}
          y1={{
            min: 0,
            max: 1,
            formatter: percentage.detailed,
            metrics: [`metrics.gauges.grpc.outgoing.perMethod.${row.method}.error_rate`],
            labels: ['Error Rate'],
            type: 'stackedArea'
          }}
        />
      </DashboardSection>

      <DashboardSection title="Latency">
        <Chart
          snapshotId={row.dropwizard.get('id')}
          timeConfig={row.timeConfig}
          minRollup={5000}
          y1={{
            min: 0,
            formatter: millis.fixedDetailed,
            metrics: [
              `metrics.timers.grpc.outgoing.perMethod.${row.method}.timer.mean`,
              `metrics.timers.grpc.outgoing.perMethod.${row.method}.timer.50th`,
              `metrics.timers.grpc.outgoing.perMethod.${row.method}.timer.99th`
            ],
            labels: ['Mean', '50th', '90th'],
            type: 'line'
          }}
        />
      </DashboardSection>
    </Fragment>
  );
}
