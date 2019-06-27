import React from 'react';

import ServerTableWithUrlBoundState from 'in-components/tables/ServerTable/ServerTableWithUrlBoundState';
import deploymentConfigsTable from 'in-kubernetes/Dashboards/commonComponents/deploymentConfigsTable';

const pathSegment = '/deploymentconfigs';
const matrixPrefix = 'deploymentConfig.';

const Table = deploymentConfigsTable(ServerTableWithUrlBoundState);

export default function DeploymentConfigs(props) {
  return <Table pathSegment={pathSegment} matrixPrefix={matrixPrefix} {...props} />;
}
