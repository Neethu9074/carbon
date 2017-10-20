import React from 'react';

import MaxWidthFullscreenContainer from 'in-components/layout/MaxWidthFullscreenContainer';
import DashboardTile from 'in-sdk/components/dashboard/DashboardTile';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'Name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  }
];

export default function EndpointOverview({ snapshot }) {
  if (!snapshot) {
    return (
      <MaxWidthFullscreenContainer>
        <LoadingIndicator type="dark" />
      </MaxWidthFullscreenContainer>
    );
  }

  const rows = snapshot
    .getIn(['data', 'service_endpoints'], emptyList)
    .toArray()
    .map(endpoint => {
      return {
        key: endpoint,
        endpoint
      };
    });

  return (
    <MaxWidthFullscreenContainer>
      <DashboardTile title="Endpoints">
        <Table cols={cols} rows={rows} />
      </DashboardTile>
    </MaxWidthFullscreenContainer>
  );
}
