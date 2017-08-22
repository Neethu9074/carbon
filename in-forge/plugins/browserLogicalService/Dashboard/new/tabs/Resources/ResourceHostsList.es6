import { combineLatest } from 'reactive-observables';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import getLogicalConnections from 'in-stores/graph/getLogicalConnections';
import { number, millis } from 'in-services/formatters/number';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import { plugins } from 'in-forge/constants';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'Host',
    type: 'link',
    typeArgs: {
      comparator: compareIgnoreCase,
      showLoadingIndicator: true,
      get$(row) {
        const snapshot$ = getSnapshot(row.otherSideSnapshotId);
        const href$ = getSubDashboardLink(`/resources/${encodeURIComponent(row.connectionSnapshotId)}`);
        return combineLatest([snapshot$, href$]).map(([snapshot, href]) => {
          return {
            label: getLabel(snapshot),
            value: getLabel(snapshot),
            href
          };
        });
      }
    }
  },
  {
    title: 'Calls',
    type: 'sparkChart',
    typeArgs: {
      forceTimeWindowAggregation: true,
      getSnapshotId(row) {
        return row.connectionSnapshotId;
      },
      getMetricName() {
        return 'count';
      },
      getContent: number.compact,
      getTimeWindowAggregation() {
        return 'sum';
      }
    }
  },
  {
    title: 'Load Time',
    type: 'sparkChart',
    typeArgs: {
      forceTimeWindowAggregation: true,
      getSnapshotId(row) {
        return row.connectionSnapshotId;
      },
      getMetricName() {
        return 'duration.mean';
      },
      getContent: millis.detailed,
      getTimeWindowAggregation() {
        return 'mean';
      }
    }
  }
];

export default connectTo(
  props => {
    return {
      connections: getLogicalConnections({ snapshotId: props.snapshot.get('id') })
    };
  },
  function Resources({ connections, timeframe }) {
    if (connections == null) {
      return (
        <MaxWidthFullscreenContainer>
          <DashboardTile title="Resource Hosts">
            <LoadingIndicator type="dark" />
          </DashboardTile>
        </MaxWidthFullscreenContainer>
      );
    }

    const onlyResourceConnections = connections.filter(
      connection => connection.connectionPlugin === plugins.pageResourceLogicalConnection
    );

    if (onlyResourceConnections.length === 0) {
      // TODO MAKE THIS LOOK NICE!
      return (
        <MaxWidthFullscreenContainer>
          <DashboardTile title="Resource Hosts">
            No resources at the focused moment.
          </DashboardTile>
        </MaxWidthFullscreenContainer>
      );
    }

    const rows = onlyResourceConnections.map(connection => {
      return {
        key: connection.connectionSnapshotId,
        connectionSnapshotId: connection.connectionSnapshotId,
        otherSideSnapshotId: connection.otherSideSnapshotId,
        timeframe
      };
    });

    return (
      <MaxWidthFullscreenContainer>
        <DashboardTile title={`Resource Hosts (${onlyResourceConnections.length})`}>
          <Table cols={cols} rows={rows} initialSortColumn={2} initialSortDirection="desc" />
        </DashboardTile>
      </MaxWidthFullscreenContainer>
    );
  }
);
