import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import servicesTable from 'in-kubernetes/Dashboards/commonComponents/servicesTable';

const pathSegment = '/services';
const matrixPrefix = 'service.';

const Table = servicesTable(ServerTableWithUrlBoundState);

export default function Services(props) {
  return <Table cardTitle="Services" pathSegment={pathSegment} matrixPrefix={matrixPrefix} {...props} />;
}
