import React from 'react';

import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import LoadingIndicator from 'in-components/LoadingIndicator';
import Columize from 'in-sdk/components/dashboard/Columize';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';
import Table from 'in-sdk/components/dashboard/Table';
import { getPhysicalStack } from 'in-internal/components/dataRetrieval';
import { compareIgnoreCase } from 'in-services/util/string';
import { timeConfig$ } from 'in-stores/time/config';
import {
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces
} from 'in-services/formatters/number';
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
    kafkaNodes: timeConfig$.flatMap(timeConfig =>
      getPhysicalStack({
        searchQuery: 'entity.host.name:"kafka-*"',
        timeConfig,
        restrictResultEntityType: 'kafka'
      })
    )
  },
  function Overview({ kafkaNodes, timeConfig }) {
    if (!kafkaNodes) {
      return <LoadingIndicator type="dark" />;
    }

    if (kafkaNodes.length < 1) {
      return <div>Statistics provider not found.</div>;
    }

    kafkaNodes = sort(kafkaNodes);
    const kafkaNodeLabels = getLabels(kafkaNodes, /^((kafka)-\d+).*$/i);

    return (
      <div>
        <h2>Kafka ({kafkaNodes.length} nodes)</h2>

        <Columize>
          <DashboardSection title={`Broker Traffic Bytes In`}>
            <Chart
              snapshotIds={kafkaNodes.map(r => r.kafka.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesZeroDecimalPlaces,
                tooltipFormatter: bytesTwoDecimalPlaces,
                metrics: kafkaNodes.map(() => `broker.bytesIn`),
                labels: kafkaNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Broker Traffic Bytes Out`}>
            <Chart
              snapshotIds={kafkaNodes.map(r => r.kafka.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesZeroDecimalPlaces,
                tooltipFormatter: bytesTwoDecimalPlaces,
                metrics: kafkaNodes.map(() => `broker.bytesOut`),
                labels: kafkaNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Broker Traffic Bytes Rejected`}>
            <Chart
              snapshotIds={kafkaNodes.map(r => r.kafka.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: bytesZeroDecimalPlaces,
                tooltipFormatter: bytesTwoDecimalPlaces,
                metrics: kafkaNodes.map(() => `broker.bytesRejected`),
                labels: kafkaNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={`Messages In`}>
            <Chart
              snapshotIds={kafkaNodes.map(r => r.kafka.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: zeroDecimalPlaces,
                tooltipFormatter: twoDecimalPlaces,
                metrics: kafkaNodes.map(() => `broker.messagesIn`),
                labels: kafkaNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Produce Requests`}>
            <Chart
              snapshotIds={kafkaNodes.map(r => r.kafka.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: zeroDecimalPlaces,
                tooltipFormatter: twoDecimalPlaces,
                metrics: kafkaNodes.map(() => `broker.produceRequests`),
                labels: kafkaNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={`CPU Usage`}>
            <Table
              cols={hostTableCols}
              rows={kafkaNodes.map(node => ({ key: node.kafka.get('id'), ...node }))}
              getRowDetails={getHostDetails}
              maxItemsPerPage={15}
            />
          </DashboardSection>

          <DashboardSection title="Data mounts">
            <Table
              cols={volumeTableCols}
              rows={getDataMountRows(kafkaNodes.map(node => ({ key: node.kafka.get('id'), ...node })), timeConfig)}
              getRowDetails={getFsDetails}
              maxItemsPerPage={15}
            />
          </DashboardSection>
        </Columize>
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
