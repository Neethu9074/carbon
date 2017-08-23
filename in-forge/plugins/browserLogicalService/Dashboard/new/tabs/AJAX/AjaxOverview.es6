import { combineLatest } from 'reactive-observables';
import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import { number, millis, percentage } from 'in-services/formatters/number';
import getLogicalConnections from 'in-stores/graph/getLogicalConnections';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import NoXMessage from 'in-sdk/components/dashboard/NoXMessage';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshot } from 'in-stores/snapshot';
import { plugins } from 'in-forge/constants';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';

const cols = [
  {
    title: 'Target',
    type: 'link',
    typeArgs: {
      comparator: compareIgnoreCase,
      showLoadingIndicator: true,
      get$(row) {
        const snapshot$ = getSnapshot(row.otherSideSnapshotId);
        const href$ = getSubDashboardLink(`/ajax/${encodeURIComponent(row.connectionSnapshotId)}`);
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
  },
  {
    title: 'Error Rate',
    type: 'sparkChart',
    typeArgs: {
      forceTimeWindowAggregation: true,
      getSnapshotId(row) {
        return row.connectionSnapshotId;
      },
      getMetricName() {
        return 'error_rate';
      },
      getContent: percentage.detailed,
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
          <DashboardTile title="Call Targets">
            <LoadingIndicator type="dark" />
          </DashboardTile>
        </MaxWidthFullscreenContainer>
      );
    }

    const onlyAjaxConnections = connections.filter(
      connection => connection.connectionPlugin === plugins.logicalHttpConnection
    );

    if (onlyAjaxConnections.length === 0) {
      return (
        <NoXMessage centered>
          No call targets at the focused moment.
        </NoXMessage>
      );
    }

    const rows = onlyAjaxConnections.map(connection => {
      return {
        key: connection.connectionSnapshotId,
        connectionSnapshotId: connection.connectionSnapshotId,
        otherSideSnapshotId: connection.otherSideSnapshotId,
        timeframe
      };
    });

    return (
      <MaxWidthFullscreenContainer>
        <DashboardTile title={`Call Targets (${onlyAjaxConnections.length})`}>
          <Table cols={cols} rows={rows} initialSortColumn={0} initialSortDirection="asc" />
        </DashboardTile>
      </MaxWidthFullscreenContainer>
    );
  }
);
