import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
import { number, millis, percentage } from 'in-services/formatters/number';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getClusterMembers } from 'in-stores/clusterMembers';
import { compareIgnoreCase } from 'in-services/util/string';
import Table from 'in-sdk/components/dashboard/Table';
import { getSnapshots } from 'in-stores/snapshot';
import { getLabel } from 'in-sdk/snapshot';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

const cols = [
  {
    title: 'Name',
    type: 'custom',
    typeArgs: {
      comparator: compareIgnoreCase,
      get(row) {
        const label = getLabel(row.serviceInstance);
        return {
          value: label,
          content: <Link href$={getSubDashboardLink(`/instances/${row.key}`)}>{label}</Link>
        };
      }
    }
  },
  {
    title: 'Calls (sum)',
    type: 'sparkChart',
    typeArgs: {
      forceTimeWindowAggregation: true,
      getSnapshotId(row) {
        return row.key;
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
    title: 'Latency (avg)',
    type: 'sparkChart',
    typeArgs: {
      forceTimeWindowAggregation: true,
      getSnapshotId(row) {
        return row.key;
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
    title: 'Error Rate (avg)',
    type: 'sparkChart',
    typeArgs: {
      forceTimeWindowAggregation: true,
      getSnapshotId(row) {
        return row.key;
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
      serviceInstances: getClusterMembers(props.snapshot.get('id')).flatMap(getSnapshots)
    };
  },
  function ServiceInstanceOverview({ snapshot, serviceInstances }) {
    if (!snapshot || !serviceInstances) {
      return (
        <MaxWidthFullscreenContainer>
          <LoadingIndicator type="dark" />
        </MaxWidthFullscreenContainer>
      );
    }

    const rows = serviceInstances.map(serviceInstance => {
      return {
        key: serviceInstance.get('id'),
        serviceInstance
      };
    });

    return (
      <MaxWidthFullscreenContainer>
        <DashboardTile title="Instances">
          <Table cols={cols} rows={rows} />
        </DashboardTile>
      </MaxWidthFullscreenContainer>
    );
  }
);
