import { compose } from 'recompose';
import React from 'react';

import InfrastructureEntityLink from 'in-analyze/TraceDetail/components/CallDetails/components/InfrastructureEntityLink';
import { shouldStayInCurrentTimeModeForNavigationToSnapshot } from 'in-stores/snapshot';
import { getPhysicalHierarchy } from 'in-stores/snapshot';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { alwaysNull } from 'in-services/fixedStreams';
import Hierarchy from 'in-components/Link/Hierarchy';
import connectTo from 'in-hoc/connectTo';

import locals from './InfrastructureHierarchy.mless';

export default compose(
  connectTo(({ snapshotId, timeConfig }) => ({
    timeConfig: shouldStayInCurrentTimeModeForNavigationToSnapshot(snapshotId).map(stay =>
      stay ? undefined : timeConfig
    )
  })),
  connectTo(({ snapshotId, timeConfig, calculateHierarchy }) => {
    const observables = {
      hierarchy: calculateHierarchy
        ? getPhysicalHierarchy({ snapshotId, includeCluster: false, timeConfig })
        : alwaysNull
    };
    return observables;
  })
)(HierarchicalLink);

function HierarchicalLink({
  hierarchySnapshots,
  hierarchy,
  kind,
  pathname,
  timeConfig,
  useSnapshotLink,
  entity,
  plugin,
  snapshotId,
  physicalContext
}) {
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
        <div className={locals.noRelation}>No other relations found.</div>
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
      timeConfig={timeConfig}
    />
  );
}
