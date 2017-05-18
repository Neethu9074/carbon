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
      <Table cols={cols} rows={rows} getRowDetails={getRowDetails} />
    </DashboardSection>
  );
}

function getRowDetails(row) {
  const rule = row.entity;
  return (
    <DescriptionList>
      <DescriptionItem title="comment">
        {rule.get('comment')}
      </DescriptionItem>
      <DescriptionItem title="match specification path">
        {rule.getIn(['matchSpecification', 'path'])}
      </DescriptionItem>
      <DescriptionItem title="match specification host">
        {rule.getIn(['matchSpecification', 'host'])}
      </DescriptionItem>
      <DescriptionItem title="extract specification label">
        {rule.getIn(['extractSpecification', 'label'])}
      </DescriptionItem>
    </DescriptionList>
  );
}
