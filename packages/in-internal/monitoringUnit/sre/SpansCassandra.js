/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

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
import { t } from 'in-i18n';

export default connectTo(
  {
    timeConfig: timeConfig$,
    spansNodes: getCassandraWithContext('entity.host.name:"spans-cassandra-*"')
  },
  function Overview({ spansNodes, timeConfig }) {
    if (spansNodes.length === 0) {
      return <LoadingIndicator />;
    }

    spansNodes = sort(spansNodes);
    const spansNodeLabels = getLabels(spansNodes, /^(spans-cassandra-\d+).*$/i);

    let maxNodesPerBucket = 5;
    let spansNodesBuckets = Math.ceil(spansNodes.length / maxNodesPerBucket);

    let clientrequestsWriteCount = [];
    let clientrequestsReadCount = [];
    let pendingCompations = [];
    let networkDataReceived = [];
    let networkDataTransmitted = [];
    let cpuLoad = [];

    for (let i = 0; i < spansNodesBuckets; i++) {
      let itemsList = spansNodes.slice(i * maxNodesPerBucket, (i + 1) * maxNodesPerBucket);
      let itemsLabelList = spansNodeLabels.slice(i * maxNodesPerBucket, (i + 1) * maxNodesPerBucket);

      clientrequestsWriteCount.push(
        <Col xs={6} key={'clientrequests.write.count' + i}>
          <Chart
            snapshotIds={itemsList.map(r => r.cassandra.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.perSecond.compact,
              metrics: itemsList.map(() => `clientrequests.write.count`),
              labels: itemsLabelList,
              type: 'line'
            }}
          />
        </Col>
      );

      clientrequestsReadCount.push(
        <Col xs={6} key={'clientrequests.read.count' + i}>
          <Chart
            snapshotIds={itemsList.map(r => r.cassandra.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              formatter: number.perSecond.compact,
              metrics: itemsList.map(() => `clientrequests.read.count`),
              labels: itemsLabelList,
              type: 'line'
            }}
          />
        </Col>
      );

      pendingCompations.push(
        <Col xs={6} key={'compaction.pending' + i}>
          <Chart
            snapshotIds={itemsList.map(r => r.cassandra.get('id'))}
            timeConfig={timeConfig}
            minRollup={5000}
            y1={{
              min: 0,
              metrics: itemsList.map(() => `compaction.pending`),
              labels: itemsLabelList,
              type: 'line'
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
        <h2>{t('in-internal:monitoringUnit.sre.commonCassandra.spansCassandraNode', { count: spansNodes.length })}</h2>

        <DashboardSection title={t('in-internal:monitoringUnit.sre.commonCassandra.writes')}>
          <Row>{clientrequestsWriteCount}</Row>
        </DashboardSection>

        <DashboardSection title={t('in-internal:monitoringUnit.sre.commonCassandra.reads')}>
          <Row>{clientrequestsReadCount}</Row>
        </DashboardSection>

        <DashboardSection title={t('in-internal:monitoringUnit.sre.commonCassandra.pendingCompactions')}>
          <Row>{pendingCompations}</Row>
        </DashboardSection>

        <DashboardSection title={t('in-internal:monitoringUnit.sre.commonCassandra.networkDataRecv')}>
          <Row>{networkDataReceived}</Row>
        </DashboardSection>

        <DashboardSection title={t('in-internal:monitoringUnit.sre.commonCassandra.networkDataTransmit')}>
          <Row>{networkDataTransmitted}</Row>
        </DashboardSection>

        <DashboardSection title={t('in-internal:monitoringUnit.sre.commonCassandra.cpuLoad')}>
          <Row>{cpuLoad}</Row>
        </DashboardSection>

        <DashboardSection title={t('in-internal:monitoringUnit.sre.commonCassandra.cpuUsage')}>
          <Table cols={hostTableCols} rows={spansNodes} getRowDetails={getHostDetails} maxItemsPerPage={15} />
        </DashboardSection>

        <DashboardSection title={t('in-internal:monitoringUnit.sre.commonCassandra.dataMount')}>
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
