import React from 'react';

import {
  hostTableCols,
  volumeTableCols,
  getDataMountRows,
  getHostDetails,
  getFsDetails
} from 'in-internal/monitoringUnit/sre/datastores';
import { number, timeByMicroTwoDecimalPlaces, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { getElasticWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import ChartExplanation from 'in-sdk/components/dashboard/ChartExplanation';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { getPhysicalStack } from 'in-internal/components/dataRetrieval';
import Columize from 'in-sdk/components/dashboard/Columize';
import { compareIgnoreCase } from 'in-services/util/string';
import { Row, Col } from 'in-new-components/layout/Grid';
import Table from 'in-sdk/components/dashboard/Table';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    timeConfig: timeConfig$,
    metaEsNgNodes: getElasticWithContext('entity.host.name:"ng-elastic-*"'),
    jvmNodes: timeConfig$.flatMap(timeConfig =>
      getPhysicalStack({
        searchQuery: 'entity.host.name:"ng-elastic-*"',
        timeConfig,
        restrictResultEntityType: 'jvmRuntimePlatform'
      })
    )
  },
  function Overview({ metaEsNgNodes, jvmNodes, timeConfig }) {
    if (!metaEsNgNodes || !jvmNodes) {
      return <LoadingIndicator />;
    }

    if (metaEsNgNodes.length < 1) {
      return <div>Statistics provider not found.</div>;
    }
    if (jvmNodes.length < 1) {
      return <div>Statistics provider not found.</div>;
    }

    metaEsNgNodes = sort(metaEsNgNodes);
    const metaEsNgNodeLabels = getLabels(metaEsNgNodes, /^(ng-elastic-\d+).*$/i);

    let maxNodesPerBucket = 5;
    let esNodesBuckets = Math.ceil(metaEsNgNodes.length / maxNodesPerBucket);

    let indicesQueryCount = [];
    let addedDocuments = [];
    let networkDataReceived = [];
    let networkDataTransmitted = [];
    let cpuLoad = [];

    for (let i = 0; i < esNodesBuckets; i++) {
      let itemsList = metaEsNgNodes.slice(i * maxNodesPerBucket, (i + 1) * maxNodesPerBucket);
      let itemsLabelList = metaEsNgNodeLabels.slice(i * maxNodesPerBucket, (i + 1) * maxNodesPerBucket);

      indicesQueryCount.push(
        <Col xs={6} key={'indices.query_count' + i}>
          <Chart
            snapshotIds={itemsList.map(r => r.elastic.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.perSecond.compact,
              metrics: itemsList.map(() => `indices.query_count`),
              labels: itemsLabelList,
              type: 'stackedArea'
            }}
          />
        </Col>
      );

      addedDocuments.push(
        <Col xs={6} key={'indices.index_count' + i}>
          <Chart
            snapshotIds={itemsList.map(r => r.elastic.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.perSecond.compact,
              metrics: itemsList.map(() => `indices.index_count`),
              labels: itemsLabelList,
              type: 'stackedArea'
            }}
          />
        </Col>
      );

      networkDataReceived.push(
        <Col xs={6} key={'ifs.eth0.rx.bytes' + i}>
          <Chart
            snapshotIds={itemsList.map(r => r.host.get('id'))}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesZeroDecimalPlaces,
              metrics: itemsList.map(() => `ifs.eth0.rx.bytes`),
              labels: itemsLabelList,
              type: 'line'
            }}
          />
        </Col>
      );

      networkDataTransmitted.push(
        <Col xs={6} key={'ifs.eth0.tx.bytes' + i}>
          <Chart
            snapshotIds={itemsList.map(r => r.host.get('id'))}
            timeConfig={timeConfig}
            y1={{
              min: 0,
              formatter: bytesZeroDecimalPlaces,
              metrics: itemsList.map(() => `ifs.eth0.tx.bytes`),
              labels: itemsLabelList,
              type: 'line'
            }}
          />
        </Col>
      );

      cpuLoad.push(
        <Col xs={6} key={'load.1min' + i}>
          <Chart
            snapshotIds={itemsList.map(r => r.host.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.detailed,
              tooltipFormatter: number.detailed,
              metrics: itemsList.map(() => 'load.1min'),
              labels: itemsLabelList,
              type: 'line'
            }}
          />
        </Col>
      );
    }

    return (
      <div>
        <h2>Meta Elastic NG({metaEsNgNodes.length} nodes)</h2>
        <DashboardSection title={`# of queries`}>
          <Row>{indicesQueryCount}</Row>
        </DashboardSection>

        <DashboardSection title={`Added documents`}>
          <Row>{addedDocuments}</Row>
        </DashboardSection>

        <DashboardSection title={`Network - data received`}>
          <Row>{networkDataReceived}</Row>
        </DashboardSection>

        <DashboardSection title={`Network - data transmitted`}>
          <Row>{networkDataTransmitted}</Row>
        </DashboardSection>

        <DashboardSection title={`CPU load`}>
          <Row>{cpuLoad}</Row>
        </DashboardSection>

        <Columize>
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
                labels: metaEsNgNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>
        </Columize>

        <Columize>
          <DashboardSection title="Data mounts">
            <Table
              cols={volumeTableCols}
              rows={getDataMountRows(metaEsNgNodes, timeConfig)}
              getRowDetails={getFsDetails}
              maxItemsPerPage={15}
            />
          </DashboardSection>
          <DashboardSection title={`CPU Usage`}>
            <Table cols={hostTableCols} rows={metaEsNgNodes} getRowDetails={getHostDetails} maxItemsPerPage={15} />
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
