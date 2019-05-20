import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import { number } from 'in-services/formatters/number';
import { compareIgnoreCase } from 'in-services/util/string';
import { getCassandraWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import {
  hostTableCols,
  volumeTableCols,
  getDataMountRows,
  getHostDetails,
  getFsDetails
} from 'in-internal/monitoringUnit/sre/datastores';

export default connectTo(
  {
    timeConfig: timeConfig$,
    spansNodes: getCassandraWithContext('entity.host.name:"spans-cassandra-*"')
  },
  function Overview({ spansNodes, timeConfig }) {
    if (spansNodes.length === 0) {
      return <LoadingIndicator type="dark" />;
    }

    spansNodes = sort(spansNodes);
    const spansNodeLabels = getLabels(spansNodes, /^(spans-cassandra-\d+).*$/i);

    return (
      <div>
        <h2>Spans Cassandra ({spansNodes.length} nodes)</h2>

        <DashboardSection title={`Writes`}>
          <Chart
            snapshotIds={spansNodes.map(r => r.cassandra.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.perSecond.compact,
              metrics: spansNodes.map(() => `clientrequests.write.count`),
              labels: spansNodeLabels,
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`Reads`}>
          <Chart
            snapshotIds={spansNodes.map(r => r.cassandra.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.perSecond.compact,
              metrics: spansNodes.map(() => `clientrequests.read.count`),
              labels: spansNodeLabels,
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Pending Compactions">
          <Chart
            snapshotIds={spansNodes.map(r => r.cassandra.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              metrics: spansNodes.map(() => `compaction.pending`),
              labels: spansNodeLabels,
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`CPU load`}>
          <Chart
            snapshotIds={spansNodes.map(r => r.host.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.detailed,
              tooltipFormatter: number.detailed,
              metrics: spansNodes.map(() => 'load.1min'),
              labels: spansNodeLabels,
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`CPU usage`}>
          <Table cols={hostTableCols} rows={spansNodes} getRowDetails={getHostDetails} maxItemsPerPage={15} />
        </DashboardSection>

        <DashboardSection title="Data mounts">
          <Table
            cols={volumeTableCols}
            rows={getDataMountRows(spansNodes, timeConfig)}
            getRowDetails={getFsDetails}
            maxItemsPerPage={15}
          />
        </DashboardSection>
      </div>
    );
  }
);

function sort(rows) {
  return rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
}

function getLabels(rows, regexp) {
  return rows.map(r => r.host.get('label').replace(regexp, '$1'));
}
