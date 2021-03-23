/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import React from 'react';

import InfrastructureEntityLink from 'in-analyze/TraceDetail/components/CallDetails/components/InfrastructureEntityLink';
import { shouldStayInCurrentTimeModeForNavigationToSnapshot } from 'in-stores/snapshot';
import { getPhysicalHierarchy } from 'in-stores/snapshot';
import Skeleton from 'in-new-components/Loading/Skeleton';
import Hierarchy from 'in-components/Link/Hierarchy';
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
  const stickyTimeConfig = useObservable(getStickyTimeConfig, [snapshotId, timeConfig]);
  const hierarchy = useObservable(getHierarchy, [snapshotId, timeConfig, calculateHierarchy]);

  if (!hierarchy) {
    return <Skeleton />;
  }
  if (hierarchy.size < 2) {
    return (
      <div>
        <InfrastructureEntityLink
          entity={entity}
          plugin={plugin}
          snapshotId={snapshotId}
          physicalContext={physicalContext}
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
      timeConfig={stickyTimeConfig ?? timeConfig}
    />
  );
}

function getStickyTimeConfig([snapshotId, timeConfig]) {
  return shouldStayInCurrentTimeModeForNavigationToSnapshot(snapshotId).map(stay => (stay ? undefined : timeConfig), [
    snapshotId
  ]);
}

function getHierarchy([snapshotId, timeConfig, calculateHierarchy]) {
  return calculateHierarchy && getPhysicalHierarchy({ snapshotId, includeCluster: false, timeConfig });
}
