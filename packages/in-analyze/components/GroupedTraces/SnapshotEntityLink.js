import { just } from '@instana/observables';
import React from 'react';

import { shouldStayInCurrentTimeModeForNavigationToSnapshot, getSnapshot } from 'in-stores/snapshot';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { getTimeConfigAtMoment } from 'in-stores/time/config';
import connectTo from 'in-hoc/connectTo';

export default connectTo(({ snapshotId, time }) => ({
  snapshot: snapshotId == null ? just(null) : getSnapshot(snapshotId, getTimeConfigAtMoment(time))
}))(function SnapshotEntityLink({ snapshot, snapshotId, time }) {
  if (!snapshot) {
    return null;
  }

  return (
    <EntityLink
      snapshot={snapshot}
      label={snapshot.get('label')}
      href$={shouldStayInCurrentTimeModeForNavigationToSnapshot(snapshotId).flatMap(stay =>
        stay
          ? getDashboardLink(snapshotId, { pathname: '/physical/dashboard' })
          : getDashboardLink(snapshotId, {
              pathname: '/physical/dashboard',
              to: time,
              focusedMoment: time,
              autoRefresh: false
            })
      )}
    />
  );
});
