import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import deploymentsTable from 'in-kubernetes/Dashboards/commonComponents/deploymentsTable';

const pathSegment = '/deployments';
const matrixPrefix = 'deployment.';

const Table = deploymentsTable(ServerTableWithUrlBoundState);

export default function Deployments(props) {
  return <Table pathSegment={pathSegment} matrixPrefix={matrixPrefix} {...props} />;
}
