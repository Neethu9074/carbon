import React from 'react';

import ResourceCaching from 'in-forge/plugins/pageResourceLogicalService/Dashboard/ResourceCaching';
import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import getLogicalConnections from 'in-stores/graph/getLogicalConnections';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import Notification from 'in-sdk/components/dashboard/Notification';
import { millis, number } from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { always } from 'in-services/fixedStreams';
import { getSnapshot } from 'in-stores/snapshot';
import { Row, Col } from 'in-components/Grid';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';
import Title from 'in-components/Title';

const notFoundIndicator = {};

export default connectTo(connector, ResourceDetails);

function connector({ snapshot, match }) {
  const connection$ = getLogicalConnections({ snapshotId: snapshot.get('id') })
    .startWith(null)
    .map(connections => {
      if (connections == null) {
        return null;
      }

      let connection;
      for (let i = 0; i < connections.length && connection == null; i++) {
        if (connections[i].connectionSnapshotId === match.params.resourceHostId) {
          connection = connections[i];
        }
      }

      if (!connection) {
        return notFoundIndicator;
      }

      return connection;
    })
    .nextFrame();

  const connectedSnapshot$ = connection$.flatMap(connection => {
    if (connection && connection.otherSideSnapshotId) {
      return getSnapshot(connection.otherSideSnapshotId);
    }
    return always(connection);
  });

  return {
    connection: connection$,
    connectedSnapshot: connectedSnapshot$
  };
}

function ResourceDetails({ connection, connectedSnapshot, timeframe }) {
  if (connection == null || connectedSnapshot == null) {
    return <LoadingIndicator type="dark" />;
  } else if (connection === notFoundIndicator || connectedSnapshot === notFoundIndicator) {
    return (
      <Notification type="warning">
        <strong>Failed to retrieve resource details.</strong> Please refresh the page or contact customer support should
        this issue persist.
      </Notification>
    );
  }

  const label = getLabel(connectedSnapshot);
  return (
    <div>
      <Title title="Resource Details" dynamic={label} />
      <BackButton label="Back to resource list" href$={getSubDashboardLink(`/resources`)} />

      <DashboardTile>
        <DescriptionList>
          <DescriptionItem title="Resource Host">{label}</DescriptionItem>
        </DescriptionList>
      </DashboardTile>

      <Row>
        <Col cols={6}>
          <DashboardTile title="Views vs Page Load Time">
            <Chart
              snapshotId={connection.connectionSnapshotId}
              timeframe={timeframe}
              height={200}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['count'],
                labels: ['views'],
                type: 'bar',
                aggregation: 'sum'
              }}
              y2={{
                min: 0,
                formatter: millis.fixedCompact,
                metrics: ['duration.mean'],
                labels: ['load time'],
                type: 'line',
                aggregation: 'mean'
              }}
            />
          </DashboardTile>
        </Col>
        <Col cols={6}>
          <DashboardTile title="Load Time Breakdown">
            <Chart
              snapshotId={connection.connectionSnapshotId}
              timeframe={timeframe}
              height={200}
              y1={{
                min: 0,
                formatter: millis.fixedCompact,
                metrics: ['duration.50th', 'duration.90th', 'duration.95th', 'duration.98th', 'duration.99th'],
                labels: ['50th', '90th', '95th', '98th', '99th'],
                type: 'line',
                aggregation: 'mean'
              }}
            />
          </DashboardTile>
        </Col>
      </Row>

      <DashboardTile title="Caching">
        <ResourceCaching snapshotId={connection.connectionSnapshotId} timeframe={timeframe} />
      </DashboardTile>
    </div>
  );
}
