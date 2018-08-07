import { combineLatest } from 'reactive-observables';
import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { getSnapshots, getPhysicalHierarchy } from 'in-stores/snapshot';
import { number, percentage } from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Table from 'in-sdk/components/dashboard/Table';
import { emptyArray } from 'in-services/fixedObjects';
import { timeConfig$ } from 'in-stores/time/config';
import search from 'in-subscription/search';
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
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo({
  timeConfig: timeConfig$,
  rows: timeConfig$
    .flatMap(timeConfig =>
      search({
        query: 'entity.label:filler*',
        view: 'TABLE',
        timeConfig,
        restrictResultEntityType: 'dropwizardApplicationContainer'
      })
        .flatMap(getSnapshots)
        .flatMap(dropwizardSnapshots =>
          combineLatest(
            dropwizardSnapshots.map(dropwizard =>
              getPhysicalHierarchy(dropwizard.get('id'), false)
                .flatMap(getSnapshots)
                .map(snapshots => {
                  return {
                    key: dropwizard.get('id'),
                    host: snapshots.find(s => s.getIn(['plugin']) === 'host'),
                    container: snapshots.find(s => s.getIn(['plugin']) === 'docker'),
                    dropwizard
                  };
                })
                .filter(row => row.host != null && row.container != null)
            )
          )
        )
    )
    .startWith(emptyArray)
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
