import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getDropwizardWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
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
    title: 'Dropped Spans',
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
  }
];

export default connectTo({
  timeConfig: timeConfig$,
  rows: getDropwizardWithContext('entity.label:filler*')
})(function FillerSpanProcessingStats({ rows }) {
  if (rows.length === 0) {
    return <LoadingIndicator type="dark" />;
  }

  return (
    <div>
      <DashboardSection title={`fillers (${rows.length})`}>
        <Table cols={cols} rows={rows} maxItemsPerPage={200} />
      </DashboardSection>
    </div>
  );
});
