import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getDropwizardWithContext } from 'in-internal/dataRetrieval';
import { number, percentage } from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

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
    title: 'Host CPU load',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.host.get('id');
      },
      getMetricName() {
        return `load.1min`;
      },
      getContent: number.detailed,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Dropped Spans (span_messages.error_rate)',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.gauges.KPI.incoming.span_messages.error_rate`;
      },
      getContent: percentage.detailed,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  },
  {
    title: 'Total spans (Call extraction)',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.com.instana.spanprocessing.stream.calls.TraceWithRawCallExtractor.total-spans`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: 'Intermediate spans (Call extraction)',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.com.instana.spanprocessing.stream.calls.TraceWithRawCallExtractor.intermediate-spans`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: 'Entry span missing parent (Call extraction)',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return `metrics.meters.com.instana.spanprocessing.stream.calls.TraceWithRawCallExtractor.entry-spans-missing-parent`;
      },
      getContent: number.compact,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
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
        <Table cols={cols} rows={rows} maxItemsPerPage={200} />
      </DashboardSection>
    </div>
  );
});
