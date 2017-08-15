import React from 'react';

import DashboardTile from 'in-components/Dashboard/components/DashboardTile';
import getLogicalConnections from 'in-stores/graph/getLogicalConnections';
import { twoDecimalPlaces } from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { plugins } from 'in-forge/constants';
import connectTo from 'in-hoc/connectTo';
import Chart from 'in-components/Chart';

export default function AJAX({ snapshot, timeframe }) {
  const snapshotId = snapshot.get('id');

  return (
    <div>
      <DashboardTile title="XHR / AJAX">
        <Chart
          snapshotId={snapshotId}
          timeframe={timeframe}
          margins={{
            left: 80,
            right: 80
          }}
          y1={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['xhrCalls'],
            labels: ['Calls'],
            type: 'line'
          }}
          y2={{
            min: 0,
            formatter: twoDecimalPlaces,
            metrics: ['xhrErrors'],
            labels: ['Errors'],
            type: 'line'
          }}
        />
      </DashboardTile>
      <OutgoingConnections snapshotId={snapshotId} timeframe={timeframe} />
    </div>
  );
}

const OutgoingConnections = connectTo(
  props => {
    return {
      connections: getLogicalConnections({ snapshotId: props.snapshotId })
    };
  },
  function OutgoingConnections({ connections }) {
    if (connections == null) {
      return (
        <DashboardTile title="Call Targets">
          <LoadingIndicator type="dark" />
        </DashboardTile>
      );
    }

    const onlyAjaxConnections = connections.filter(
      connection => connection.connectionPlugin === plugins.logicalHttpConnection
    );
    if (onlyAjaxConnections.length === 0) {
      // TODO MAKE THIS LOOK NICE!
      return (
        <DashboardTile title="Call Targets">
          No AJAX endpoints found.
        </DashboardTile>
      );
    }

    // TODO TAKE CARE OF RENDERING THIS
    return (
      <DashboardTile title="Call Targets">
        TODO Render da connections
      </DashboardTile>
    );
  }
);
