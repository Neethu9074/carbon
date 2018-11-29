import React from 'react';

import deploymentsTable from 'in-kubernetes/Dashboards/commonComponents/deploymentsTable';
import ServerTable from 'in-components/tables/ServerTable';

const Table = deploymentsTable(ServerTable);

export default function MatchingDeploymentsList({ timeConfig, serviceId }) {
  return <Table cardTitle="Matching Deployments" timeConfig={timeConfig} serviceId={serviceId} defaultPageSize={5} />;
}
