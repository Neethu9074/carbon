import React from 'react';

import ComponentStatusTable from 'in-kubernetes/Dashboards/Cluster/tabs/ComponentStatusTable';

export default function Details({ data: cluster }) {
  return <ComponentStatusTable cluster={cluster} />;
}
