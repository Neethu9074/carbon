import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import Table from 'in-sdk/components/dashboard/Table';
import { getCassandraWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import { compareIgnoreCase } from 'in-services/util/string';
import { timeConfig$ } from 'in-stores/time/config';
import { number, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
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
    metricsNodes: getCassandraWithContext('entity.host.name:"cassandra-*" OR entity.host.name:"metrics-cassandra-*"')
  },
  function Overview({ metricsNodes, timeConfig }) {
    if (metricsNodes.length === 0) {
      return <LoadingIndicator type="dark" />;
    }

    metricsNodes = sort(metricsNodes);
    const metricsNodeLabels = getLabels(metricsNodes, /^((cassandra|metrics-cassandra)-\d+).*$/i);

    return (
      <div>
        <h2>Metrics Cassandra ({metricsNodes.length} nodes)</h2>

        <DashboardSection title={`Writes`}>
          <Chart
            snapshotIds={metricsNodes.map(r => r.cassandra.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.perSecond.compact,
              metrics: metricsNodes.map(() => `clientrequests.write.count`),
              labels: metricsNodeLabels,
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`Reads`}>
          <Chart
            snapshotIds={metricsNodes.map(r => r.cassandra.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.perSecond.compact,
              metrics: metricsNodes.map(() => `clientrequests.read.count`),
              labels: metricsNodeLabels,
              type: 'stackedArea'
            }}
          />
        </DashboardSection>

        <DashboardSection title="Pending Compactions">
          <Chart
            snapshotIds={metricsNodes.map(r => r.cassandra.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              metrics: metricsNodes.map(() => `compaction.pending`),
              labels: metricsNodeLabels,
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`Network - data received`}>
          <Chart
            snapshotIds={metricsNodes.map(r => r.host.get('id'))}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesZeroDecimalPlaces,
              metrics: metricsNodes.map(() => `ifs.eth0.rx.bytes`),
              labels: metricsNodeLabels,
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`Network - data transmitted`}>
          <Chart
            snapshotIds={metricsNodes.map(r => r.host.get('id'))}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesZeroDecimalPlaces,
              metrics: metricsNodes.map(() => `ifs.eth0.tx.bytes`),
              labels: metricsNodeLabels,
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`CPU load`}>
          <Chart
            snapshotIds={metricsNodes.map(r => r.host.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.detailed,
              tooltipFormatter: number.detailed,
              metrics: metricsNodes.map(() => 'load.1min'),
              labels: metricsNodeLabels,
              type: 'line'
            }}
          />
        </DashboardSection>

        <DashboardSection title={`CPU Usage`}>
          <Table cols={hostTableCols} rows={metricsNodes} getRowDetails={getHostDetails} maxItemsPerPage={15} />
        </DashboardSection>

        <DashboardSection title="Data mounts">
          <Table
            cols={volumeTableCols}
            rows={getDataMountRows(metricsNodes, timeConfig)}
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
