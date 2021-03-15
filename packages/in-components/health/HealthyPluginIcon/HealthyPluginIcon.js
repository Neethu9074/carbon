/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import WithInfrastructureHealthIndicationBehaviour from 'in-components/health/WithHealthIndication/WithInfrastructureHealthIndicationBehaviour';
import WithHealthIndication from 'in-components/health/WithHealthIndication';
import PluginIcon from 'in-components/PluginIcon';

export default function HealthyPluginIcon({ className, size, snapshotId, plugin, snapshot }) {
  return (
    <WithInfrastructureHealthIndicationBehaviour
      snapshotId={snapshotId}
      render={healthInfo => (
        <WithHealthIndication healthInfo={healthInfo}>
          <PluginIcon className={className} size={size} plugin={plugin} snapshot={snapshot} />
        </WithHealthIndication>
      )}
    />
  );
}
