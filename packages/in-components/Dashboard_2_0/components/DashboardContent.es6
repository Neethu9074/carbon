import { timeout, combineLatest } from 'reactive-observables';
import React from 'react';

import { selectedSnapshot$, selectedSnapshotId$, getSnapshotVersions } from 'in-stores/snapshot';
import { alwaysFalse, alwaysEmptyImmutableList } from 'in-services/fixedStreams';
import NotFoundDialog from 'in-components/Dashboard/components/NotFoundDialog';
import { timeframe$, focusedMoment$ } from 'in-stores/timeline';
import LoadingIndicator from 'in-components/LoadingIndicator';
import LegacyView from 'in-components/LegacyView';
import connectTo from 'in-hoc/connectTo';

import './DashboardContent.less';

const block = 'in-dashboard-content';

export default connectTo(
  {
    snapshotId: selectedSnapshotId$,
    // hide temporary unavailability due to loading lag
    snapshot: selectedSnapshot$,
    timeframe: timeframe$,
    showVersionSelector: combineLatest([selectedSnapshotId$, focusedMoment$, selectedSnapshot$]).flatMap(
      ([snapshotId]) => {
        if (snapshotId == null) {
          return alwaysFalse;
        }

        return timeout(5000)
          .map(() => true)
          .startWith(false);
      }
    ),

    // snapshot versions
    versionsForFocusedMoment: getSnapshotVersionsByTime(),
    versionsForLive: getSnapshotVersionsByTime(null)
  },
  function DashboardContent({
    snapshot,
    timeframe,
    showVersionSelector,
    snapshotId,
    versionsForFocusedMoment,
    versionsForLive
  }) {
    if ((!snapshot && !showVersionSelector) || (snapshot && snapshotId !== snapshot.get('id'))) {
      return (
        <div className="in-dashboard">
          <LegacyView />
          <LoadingIndicator type="dark" />
        </div>
      );
    } else if (!snapshot && showVersionSelector) {
      return (
        <div className="in-dashboard">
          <LegacyView />
          <NotFoundDialog
            snapshotId={snapshotId}
            versionsForFocusedMoment={versionsForFocusedMoment}
            versionsForLive={versionsForLive}
          />
        </div>
      );
    }

    // Protect against race conditions: Use the snapshotId from the snapshot. This can happen
    // when the dashboard is closed and the selectedSnapshotId store is already cleared while
    // the selectedSnapshot store is not.
    snapshotId = snapshot.get('id');

    //check if new dashboard implementation is needed
    return (
      <div className={block}>
        `hello new dashboard for ${snapshotId} at ${timeframe.to}`{' '}
      </div>
    );
  }
);

function getSnapshotVersionsByTime(time) {
  return selectedSnapshotId$.flatMap(snapshotId => {
    if (!snapshotId) {
      return alwaysEmptyImmutableList;
    }

    return getSnapshotVersions(snapshotId, time).startWith(null);
  });
}
