import { combineLatest } from '@instana/observables';
import { compose, withState } from 'recompose';

import { getSnapshot, shouldStayInCurrentTimeModeForNavigationToSnapshot } from 'in-stores/snapshot';
import { getLinkToSnapshotInCurrentView } from 'in-stores/navigation/paths/dashboardPaths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getPhysicalHierarchy } from 'in-stores/snapshot';
import HierarchicalLinkPresenter from 'in-components/Link/HierarchicalLinkPresenter';
import { alwaysNull } from 'in-services/fixedStreams';
import connect from 'in-hoc/connectTo';

export default compose(
  connect(({ snapshot, timeConfig }) => ({
    timeConfig: shouldStayInCurrentTimeModeForNavigationToSnapshot({ snapshotId: snapshot.get('id') }).map(stay =>
      stay ? undefined : timeConfig
    )
  })),
  connect(
    ({ snapshot, timeConfig, useSnapshotLink, pathname, calculateHierarchy, useSnapshotFromHierarchyCallback }) => {
      const snapshotId = snapshot.get('id');

      const observables = {
        href: useSnapshotLink
          ? getLinkToSnapshotInCurrentView(snapshotId, { timeConfig: timeConfig })
          : getDashboardLink(snapshotId, {
              pathname: pathname,
              timeConfig: timeConfig
            }),
        hierarchy: calculateHierarchy
          ? getPhysicalHierarchy({ snapshotId, includeCluster: false, timeConfig })
          : alwaysNull
      };
      if (useSnapshotFromHierarchyCallback) {
        observables.hierarchySnapshots = observables.hierarchy.flatMap(hierarchy =>
          combineLatest(hierarchy.toArray().map(id => getSnapshot(id, timeConfig)))
        );
      }
      return observables;
    }
  ),
  withState('isExpanded', 'setExpanded', false)
)(HierarchicalLinkPresenter);
