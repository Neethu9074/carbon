import React from 'react';

import {
  hostTableCols,
  volumeTableCols,
  getDataMountRows,
  getHostDetails,
  getFsDetails
} from 'in-internal/monitoringUnit/sre/datastores';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { getCassandraWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import { number, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { compareIgnoreCase } from 'in-services/util/string';
import { Row, Col } from 'in-new-components/layout/Grid';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    timeConfig: timeConfig$,
    stateNodes: getCassandraWithContext('entity.host.name:"state-cassandra-*"')
  },
  function Overview({ stateNodes, timeConfig }) {
    if (stateNodes.length === 0) {
      return <LoadingIndicator />;
    }

    stateNodes = sort(stateNodes);
    const stateNodeLabels = getLabels(stateNodes, /^((state-cassandra)-\d+).*$/i);

    return (
      <Row>
        <Col xs={12}>
          <h2>State Cassandra ({stateNodes.length} nodes)</h2>

          <DashboardSection title={`Writes`}>
            <Chart
              snapshotIds={stateNodes.map(r => r.cassandra.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: stateNodes.map(() => `clientrequests.write.count`),
                labels: stateNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Reads`}>
            <Chart
              snapshotIds={stateNodes.map(r => r.cassandra.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: stateNodes.map(() => `clientrequests.read.count`),
                labels: stateNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title="Pending Compactions">
            <Chart
              snapshotIds={stateNodes.map(r => r.cassandra.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                metrics: stateNodes.map(() => `compaction.pending`),
                labels: stateNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Network - data received`}>
            <Chart
              snapshotIds={stateNodes.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytesZeroDecimalPlaces,
                metrics: stateNodes.map(() => `ifs.eth0.rx.bytes`),
                labels: stateNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Network - data transmitted`}>
            <Chart
              snapshotIds={stateNodes.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytesZeroDecimalPlaces,
                metrics: stateNodes.map(() => `ifs.eth0.tx.bytes`),
                labels: stateNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`CPU load`}>
            <Chart
              snapshotIds={stateNodes.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.detailed,
                tooltipFormatter: number.detailed,
                metrics: stateNodes.map(() => 'load.1min'),
                labels: stateNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`CPU Usage`}>
            <Table cols={hostTableCols} rows={stateNodes} getRowDetails={getHostDetails} maxItemsPerPage={15} />
          </DashboardSection>

          <DashboardSection title="Data mounts">
            <Table
              cols={volumeTableCols}
              rows={getDataMountRows(stateNodes, timeConfig)}
              getRowDetails={getFsDetails}
              maxItemsPerPage={15}
            />
          </DashboardSection>
        </Col>
      </Row>
    );
  }
);

function sort(rows) {
  return rows.slice().sort((a, b) => compareIgnoreCase(a.host.get('label'), b.host.get('label')));
}

function getLabels(rows, regexp) {
  return rows.map(r => r.host.get('label').replace(regexp, '$1'));
}
