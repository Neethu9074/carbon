/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { LoadingSkeleton } from '@instana/components';
import { useObservable } from '@instana/hooks';

import InfrastructureEntityLink from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/InfrastructureEntityLink';
import { extendTimeConfigToInclude } from 'in-applications/metrics';
import { getPhysicalHierarchy } from 'in-stores/snapshot';
import Hierarchy from 'in-components/Link/Hierarchy';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './InfrastructureHierarchy.mless';

export default function InfrastructureHierarchy({
  hierarchySnapshots,
  kind,
  pathname,
  useSnapshotLink,
  calculateHierarchy,
  entity,
  plugin,
  snapshotId,
  timeConfig,
  physicalContext
}) {
  const hierarchy = useObservable(getHierarchy, [snapshotId, timeConfig, calculateHierarchy]);
  const currentTimeConfig = useTimeConfig();

  if (!hierarchy) {
    return <LoadingSkeleton />;
  }
  const resolvedTimeConfig = timeConfig || extendTimeConfigToInclude(currentTimeConfig, entity?.time, false);
  if (hierarchy.size < 2) {
    return (
      <div>
        <InfrastructureEntityLink
          entity={entity}
          plugin={plugin}
          snapshotId={snapshotId}
          physicalContext={physicalContext}
          timeConfig={resolvedTimeConfig}
        />
        <div className={locals.noRelation}>
          {t('in-analyze:traceDetail.components.callDetails.noOtherRelationsFound')}
        </div>
      </div>
    );
  }

  return (
    <Hierarchy
      hierarchy={hierarchy}
      kind={kind}
      hierarchySnapshots={hierarchySnapshots}
      useSnapshotLink={useSnapshotLink}
      pathname={pathname}
      timeConfig={resolvedTimeConfig}
    />
  );
}

function getHierarchy([snapshotId, timeConfig, calculateHierarchy]) {
  return (
    calculateHierarchy && getPhysicalHierarchy({ snapshotId, includeCluster: false, timeConfig, extendTimeframe: true })
  );
}
