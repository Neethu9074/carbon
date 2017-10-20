import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import { getSubDashboardLink } from 'in-sdk/components/dashboard/TabView/links';
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
      comparator: () => compareIgnoreCase,
      get(row) {
        const label = getLabel(row.serviceInstance);
        return {
          value: label,
          content: <Link href$={getSubDashboardLink(`/serviceInstances/${row.key}`)}>{label}</Link>
        };
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
        <DashboardTile title="Service Instances">
          <Table cols={cols} rows={rows} />
        </DashboardTile>
      </MaxWidthFullscreenContainer>
    );
  }
);
