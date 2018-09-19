import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getDropwizardWithContext } from 'in-internal/dataRetrieval';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { number } from 'in-services/formatters/number';
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
    title: 'Total Traces Subscriptions',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return 'metrics.meters.established.subscriptions: TracesSubscribeEvent';
      },
      getContent: number.detailed,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: 'Total Trace Subscriptions',
    type: 'metric',
    typeArgs: {
      getSnapshotId(row) {
        return row.dropwizard.get('id');
      },
      getMetricName() {
        return 'metrics.meters.established.subscriptions: TraceSubscribeEvent';
      },
      getContent: number.detailed,
      forceTimeWindowAggregation: true,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  }
];

export default connectTo({
  timeConfig: timeConfig$,
  rows: getDropwizardWithContext('entity.label:ui-backend*')
})(function FillerSpanProcessingStats({ rows }) {
  if (rows.length === 0) {
    return <LoadingIndicator type="dark" />;
  }

  return (
    <div>
      <DashboardSection title={`ui-backends (${rows.length})`}>
        <Table cols={cols} rows={rows} maxItemsPerPage={50} />
      </DashboardSection>
    </div>
  );
});
