import React from 'react';

import ClusterSummary from 'in-forge/plugins/kafkaCluster/ClusterSummary';

export default function KafkaClusterDashboard({snapshot}) {
  return (
    <div>
      <ClusterSummary snapshot={snapshot} />
    </div>
  );
}
