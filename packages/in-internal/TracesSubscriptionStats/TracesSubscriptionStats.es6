import { compose, withState } from 'recompose';
import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getDropwizardWithContext } from 'in-internal/dataRetrieval';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { containsIgnoreCase } from 'in-services/util/string';
import { number } from 'in-services/formatters/number';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import Input from 'in-components/form/Input/Input';
import connect from 'in-hoc/connectTo';

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

export default compose(
  withState('query', 'setQuery', ''),
  connect(props => ({
    timeConfig: timeConfig$,
    rows: getDropwizardWithContext('entity.label:ui-backend*').map(rows =>
      rows.filter(row => containsIgnoreCase(row.container.get('label'), props.query))
    )
  }))
)(({ rows, query, setQuery }) => {
  return (
    <div>
      <DashboardSection title={`ui-backends (${rows.length})`}>
        <Input type="text" id="value" value={query} autoComplete="off" onChange={e => setQuery(e.target.value)} />
        <TracesSubscriptionStats rows={rows} />
      </DashboardSection>
    </div>
  );
});

function TracesSubscriptionStats({ rows }) {
  if (rows.length === 0) {
    return <LoadingIndicator type="dark" />;
  }

  return <Table cols={cols} rows={rows} maxItemsPerPage={50} />;
}
