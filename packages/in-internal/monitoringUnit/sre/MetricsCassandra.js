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
import { getCassandraWithContext } from 'in-internal/monitoringUnit/dataRetrieval';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { number, bytesZeroDecimalPlaces } from 'in-services/formatters/number';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import Chart from 'in-components/Chart/InfrastructureMetricChartBehavior';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { Row, Col } from 'in-components/layout/Grid';
import { timeConfig$ } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    timeConfig: timeConfig$,
    metricsNodes: getCassandraWithContext('entity.host.name:"cassandra-*" OR entity.host.name:"metrics-cassandra-*"')
  },
  function Overview({ metricsNodes, timeConfig }) {
    if (metricsNodes.length === 0) {
      return <LoadingIndicator />;
    }

    metricsNodes = sort(metricsNodes);
    const metricsNodeLabels = getLabels(metricsNodes, /^((cassandra|metrics-cassandra)-\d+).*$/i);

    return (
      <Row>
        <Col xs={12}>
          <h2>
            {t('in-internal:monitoringUnit.sre.commonCassandra.metricsCassandraNode', { count: metricsNodes.length })}
          </h2>

          <DashboardSection title={t('in-internal:monitoringUnit.sre.commonCassandra.writes')}>
            <Chart
              snapshotIds={metricsNodes.map(r => r.cassandra.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: metricsNodes.map(() => `clientrequests.write.count`),
                labels: metricsNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.sre.commonCassandra.reads')}>
            <Chart
              snapshotIds={metricsNodes.map(r => r.cassandra.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: metricsNodes.map(() => `clientrequests.read.count`),
                labels: metricsNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.sre.commonCassandra.pendingCompactions')}>
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

          <DashboardSection title={t('in-internal:monitoringUnit.sre.commonCassandra.networkDataRecv')}>
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

          <DashboardSection title={t('in-internal:monitoringUnit.sre.commonCassandra.networkDataTransmit')}>
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

          <DashboardSection title={t('in-internal:monitoringUnit.sre.commonCassandra.cpuLoad')}>
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

          <DashboardSection title={t('in-internal:monitoringUnit.sre.commonCassandra.cpuUsage')}>
            <Table cols={hostTableCols} rows={metricsNodes} getRowDetails={getHostDetails} maxItemsPerPage={15} />
          </DashboardSection>

          <DashboardSection title={t('in-internal:monitoringUnit.sre.commonCassandra.dataMount')}>
            <Table
              cols={volumeTableCols}
              rows={getDataMountRows(metricsNodes, timeConfig)}
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
