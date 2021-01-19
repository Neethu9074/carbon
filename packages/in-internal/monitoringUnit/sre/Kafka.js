/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import {
  millis,
  zeroDecimalPlaces,
  twoDecimalPlaces,
  bytesZeroDecimalPlaces,
  bytesTwoDecimalPlaces,
  percentageZeroDecimalPlaces,
  timeByMicroTwoDecimalPlaces
} from 'in-services/formatters/number';
import {
  hostTableCols,
  volumeTableCols,
  getDataMountRows,
  getHostDetails,
  getFsDetails
} from 'in-internal/monitoringUnit/sre/datastores';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getPhysicalStack } from 'in-internal/components/dataRetrieval';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    timeConfig: timeConfig$,
    kafkaNodes: timeConfig$.flatMap(timeConfig =>
      getPhysicalStack({
        searchQuery: 'entity.host.name:"kafka-*"',
        timeConfig,
        restrictResultEntityType: 'kafka'
      })
    ),
    jvmNodes: timeConfig$.flatMap(timeConfig =>
      getPhysicalStack({
        searchQuery: 'entity.host.name:"kafka-*"',
        timeConfig,
        restrictResultEntityType: 'jvmRuntimePlatform'
      })
    )
  },
  function Overview({ kafkaNodes, jvmNodes, timeConfig }) {
    if (!kafkaNodes || !jvmNodes) {
      return <LoadingIndicator />;
    }

    if (kafkaNodes.length < 1) {
      return <div>Statistics provider not found.</div>;
    }
    if (jvmNodes.length < 1) {
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
          <DashboardSection title="Network Processor Idle">
            <Chart
              snapshotIds={kafkaNodes.map(r => r.kafka.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: percentageZeroDecimalPlaces,
                tooltipFormatter: percentageZeroDecimalPlaces,
                metrics: kafkaNodes.map(() => `broker.networkProcessorIdle`),
                labels: kafkaNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title="Request Handler Idle">
            <Chart
              snapshotIds={kafkaNodes.map(r => r.kafka.get('id'))}
              timeConfig={timeConfig}
              y1={{
                formatter: percentageZeroDecimalPlaces,
                tooltipFormatter: percentageZeroDecimalPlaces,
                metrics: kafkaNodes.map(() => `broker.requestHandlerIdle`),
                labels: kafkaNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={`G1 Young Generation`}>
            <Chart
              snapshotIds={jvmNodes.map(r => r.jvmRuntimePlatform.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: millis.compact,
                metrics: jvmNodes.map(() => 'gc.G1 Young Generation.time'),
                labels: kafkaNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
          <DashboardSection title="Suspension">
            <ChartExplanation>
              Suspension is an indication of how much application execution might have been delayed by the JVM, OS or
              CPU during the last second. This is predominantly caused by GC activations.
            </ChartExplanation>
            <Chart
              snapshotIds={jvmNodes.map(r => r.jvmRuntimePlatform.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: timeByMicroTwoDecimalPlaces,
                metrics: jvmNodes.map(() => 'suspension.time'),
                labels: kafkaNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={`Network - data received`}>
            <Chart
              snapshotIds={kafkaNodes.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytesZeroDecimalPlaces,
                metrics: kafkaNodes.map(() => `ifs.eth0.rx.bytes`),
                labels: kafkaNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Network - data transmitted`}>
            <Chart
              snapshotIds={kafkaNodes.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytesZeroDecimalPlaces,
                metrics: kafkaNodes.map(() => `ifs.eth0.tx.bytes`),
                labels: kafkaNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title={`CPU Usage`}>
            <Table
              cols={hostTableCols}
              rows={kafkaNodes.map(node => ({ key: node.kafka.get('id'), timeConfig, ...node }))}
              getRowDetails={getHostDetails}
              maxItemsPerPage={15}
            />
          </DashboardSection>
          <DashboardSection title="Data mounts">
            <Table
              cols={volumeTableCols}
              rows={getDataMountRows(
                kafkaNodes.map(node => ({ key: node.kafka.get('id'), ...node })),
                timeConfig
              )}
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
