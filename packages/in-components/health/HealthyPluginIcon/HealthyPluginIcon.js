import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import WithHealthIndication from 'in-components/health/WithHealthIndication';
import PluginIcon from 'in-components/PluginIcon';

export default function HealthyPluginIcon({ className, dimension = 16, snapshotId, plugin, snapshot }) {
  return (
    <WithInfrastructureHealthIndicationBehaviour
      snapshotId={snapshotId}
      render={healthInfo => (
        <WithHealthIndication size={dimension} healthInfo={healthInfo}>
          <PluginIcon className={className} dimension={dimension} plugin={plugin} snapshot={snapshot} />
        </WithHealthIndication>
      )}
    />
  );
}
