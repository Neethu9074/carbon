import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import deploymentsTable from 'in-kubernetes/Dashboards/commonComponents/deploymentsTable';

const pathSegment = '/deployments';
const matrixPrefix = 'deployment.';

const Table = deploymentsTable(ServerTableWithUrlBoundState);

export default function Deployments({ timeConfig, namespaceId, clusterId }) {
  return (
    <Table
      cardTitle="Deployments"
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      timeConfig={timeConfig}
      clusterId={clusterId}
      namespaceId={namespaceId}
    />
  );
}

