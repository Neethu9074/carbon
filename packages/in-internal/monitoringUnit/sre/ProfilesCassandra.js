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

export default connectTo(
  {
    timeConfig: timeConfig$,
    profilesNodes: getCassandraWithContext('entity.host.name:"profiles-cassandra-*"')
  },
  function Overview({ profilesNodes, timeConfig }) {
    if (profilesNodes.length === 0) {
      return <LoadingIndicator />;
    }

    profilesNodes = sort(profilesNodes);
    const profilesNodeLabels = getLabels(profilesNodes, /^((profiles-cassandra)-\d+).*$/i);

    return (
      <Row>
        <Col xs={12}>
          <h2>Profiles Cassandra ({profilesNodes.length} nodes)</h2>

          <DashboardSection title={`Writes`}>
            <Chart
              snapshotIds={profilesNodes.map(r => r.cassandra.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: profilesNodes.map(() => `clientrequests.write.count`),
                labels: profilesNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Reads`}>
            <Chart
              snapshotIds={profilesNodes.map(r => r.cassandra.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.perSecond.compact,
                metrics: profilesNodes.map(() => `clientrequests.read.count`),
                labels: profilesNodeLabels,
                type: 'stackedArea'
              }}
            />
          </DashboardSection>

          <DashboardSection title="Pending Compactions">
            <Chart
              snapshotIds={profilesNodes.map(r => r.cassandra.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                metrics: profilesNodes.map(() => `compaction.pending`),
                labels: profilesNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Network - data received`}>
            <Chart
              snapshotIds={profilesNodes.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytesZeroDecimalPlaces,
                metrics: profilesNodes.map(() => `ifs.eth0.rx.bytes`),
                labels: profilesNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`Network - data transmitted`}>
            <Chart
              snapshotIds={profilesNodes.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              y1={{
                min: 0,
                formatter: bytesZeroDecimalPlaces,
                metrics: profilesNodes.map(() => `ifs.eth0.tx.bytes`),
                labels: profilesNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`CPU load`}>
            <Chart
              snapshotIds={profilesNodes.map(r => r.host.get('id'))}
              timeConfig={timeConfig}
              minRollup={5000}
              y1={{
                min: 0,
                formatter: number.detailed,
                tooltipFormatter: number.detailed,
                metrics: profilesNodes.map(() => 'load.1min'),
                labels: profilesNodeLabels,
                type: 'line'
              }}
            />
          </DashboardSection>

          <DashboardSection title={`CPU Usage`}>
            <Table cols={hostTableCols} rows={profilesNodes} getRowDetails={getHostDetails} maxItemsPerPage={15} />
          </DashboardSection>

          <DashboardSection title="Data mounts">
            <Table
              cols={volumeTableCols}
              rows={getDataMountRows(profilesNodes, timeConfig)}
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
