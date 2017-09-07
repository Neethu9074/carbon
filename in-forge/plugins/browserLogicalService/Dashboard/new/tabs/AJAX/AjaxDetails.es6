import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import { percentage, millis, number } from 'in-services/formatters/number';
import { instanaInternalFeaturesEnabled } from 'in-services/featureFlags';
import getLogicalConnections from 'in-stores/graph/getLogicalConnections';
import BackButton from 'in-sdk/components/dashboard/TabView/BackButton';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getSnapshot } from 'in-stores/snapshot';
import { always } from 'in-services/fixedStreams';
import { Row, Col } from 'in-components/Grid';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

const notFoundIndicator = {};

export default connectTo(connector, AjaxDetails);

function connector({ snapshot, match }) {
  const connection$ = getLogicalConnections({ snapshotId: snapshot.get('id') })
    .startWith(null)
    .map(connections => {
      if (connections == null) {
        return null;
      }

      let connection;
      for (let i = 0; i < connections.length && connection == null; i++) {
        if (connections[i].connectionSnapshotId === match.params.ajaxCallTargetId) {
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

function AjaxDetails({ connection, connectedSnapshot, timeframe }) {
  if (connection == null || connectedSnapshot == null) {
    return <LoadingIndicator type="dark" />;
  } else if (connection === notFoundIndicator || connectedSnapshot === notFoundIndicator) {
    return (
      <Notification type="warning">
        <strong>Failed to retrieve details.</strong> Please refresh the page or contact customer{' '}
        support should this issue persist.
      </Notification>
    );
  }

  return (
    <div>
      <BackButton label="Back to list" href$={getSubDashboardLink(`/ajax`)} />

      <DashboardTile>
        <DescriptionList>
          <DescriptionItem title="Call Target">
            {getLabel(connectedSnapshot)}
          </DescriptionItem>
          {instanaInternalFeaturesEnabled
            ? <DescriptionItem title="TODO">
                <strong style={{ color: 'darkred' }}>
                  how do we link to the web service in general, i.e. without the context of this website?
                </strong>
              </DescriptionItem>
            : null}
        </DescriptionList>
      </DashboardTile>

      <Row>
        <Col cols={6}>
          <DashboardTile title="Calls vs Latency">
            <Chart
              snapshotId={connection.connectionSnapshotId}
              timeframe={timeframe}
              height={200}
              margins={{
                left: 60,
                right: 60
              }}
              y1={{
                min: 0,
                formatter: number.compact,
                metrics: ['count'],
                labels: ['calls'],
                type: 'bar',
                aggregation: 'sum'
              }}
              y2={{
                min: 0,
                formatter: millis.fixedCompact,
                metrics: ['duration.mean'],
                labels: ['latency'],
                type: 'line',
                aggregation: 'mean'
              }}
            />
          </DashboardTile>
        </Col>
        <Col cols={6}>
          <DashboardTile title="Errors">
            <Chart
              snapshotId={connection.connectionSnapshotId}
              timeframe={timeframe}
              height={200}
              margins={{
                left: 60
              }}
              y1={{
                min: 0,
                formatter: percentage.detailed,
                metrics: ['error_rate'],
                labels: ['Errors'],
                type: 'stackedArea',
                aggregation: 'mean'
              }}
            />
          </DashboardTile>
        </Col>
      </Row>

      <DashboardTile title="Latency Breakdown">
        <Chart
          snapshotId={connection.connectionSnapshotId}
          timeframe={timeframe}
          height={200}
          margins={{
            left: 60
          }}
          y1={{
            min: 0,
            formatter: millis.fixedCompact,
            metrics: [
              'duration.min',
              'duration.25th',
              'duration.50th',
              'duration.75th',
              'duration.95th',
              'duration.98th',
              'duration.99th',
              'duration.max'
            ],
            labels: ['min', '25th', '50th', '75th', '95th', '98th', '99th', 'max'],
            type: 'integral',
            aggregation: 'mean'
          }}
        />
      </DashboardTile>
    </div>
  );
}
