import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import DashboardSection from 'in-sdk/components/dashboard/DashboardSection';
import { emptyList } from 'in-services/fixedImmutables';
import Table from 'in-sdk/components/dashboard/Table';

const cols = [
  {
    title: 'name',
    type: 'string',
    typeArgs: {
      getValue(row) {
        return row.key;
      }
    }
  }
];

export default function ServiceEndpointTable({ snapshot }) {
  const rows = snapshot.getIn(['data', 'service_endpoints'], emptyList).toArray().map(endpointName => {
    return {
      key: endpointName
    };
  });

  return (
    <DashboardSection title="Service Endpoints">
      <Table cols={cols} rows={rows} />
    </DashboardSection>
  );
}
