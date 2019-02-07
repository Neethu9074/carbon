import React from 'react';

import servicesTable from 'in-kubernetes/Dashboards/commonComponents/servicesTable';
import ServerTable from 'in-components/tables/ServerTable';

const Table = servicesTable(ServerTable);

export default function MatchingServicesList({ timeConfig, deploymentId }) {
  return (
    <Table cardTitle="Matching Services" timeConfig={timeConfig} deploymentId={deploymentId} defaultPageSize={5} />
  );
}
