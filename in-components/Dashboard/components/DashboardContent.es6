import { timeout, combineLatest } from 'reactive-observables';
import React from 'react';

import { selectedSnapshot$, selectedSnapshotId$, getSnapshotVersions } from 'in-stores/snapshot';
import DashboardJumpLabels from 'in-components/Dashboard/components/DashboardJumpLabels';
import { alwaysFalse, alwaysEmptyImmutableList } from 'in-services/fixedStreams';
import DashboardHeader from 'in-components/Dashboard/components/DashboardHeader';
import SidebarContent from 'in-components/MapSidebar/components/SidebarContent';
import NotFoundDialog from 'in-components/Dashboard/components/NotFoundDialog';
import { timeframe$, focusedMoment$ } from 'in-stores/timeline';
import getForgeComponent from 'in-services/getForgeComponent';
import LoadingIndicator from 'in-components/LoadingIndicator';
import connectTo from 'in-hoc/connectTo';
import Jail from 'in-components/Jail';

import './DashboardContent.less';

const block = 'in-dashboard-content';

export default connectTo(
  {
    snapshotId: selectedSnapshotId$,
    // hide temporary unavailability due to loading lag
    snapshot: selectedSnapshot$,
    timeframe: timeframe$,
    showVersionSelector: combineLatest([selectedSnapshotId$, focusedMoment$, selectedSnapshot$]).flatMap(([
      snapshotId
    ]) => {
      if (snapshotId == null) {
        return alwaysFalse;
      }

      return timeout(5000).map(() => true).startWith(false);
    }),

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
      return <LoadingIndicator type="dark" />;
    } else if (!snapshot && showVersionSelector) {
      return (
        <NotFoundDialog
          snapshotId={snapshotId}
          versionsForFocusedMoment={versionsForFocusedMoment}
          versionsForLive={versionsForLive}
        />
      );
    }

    // Protect against race conditions: Use the snapshotId from the snapshot. This can happen
    // when the dashboard is closed and the selectedSnapshotId store is already cleared while
    // the selectedSnapshot store is not.
    snapshotId = snapshot.get('id');

    const plugin = snapshot.get('plugin');
    const DashboardImpl = getForgeComponent(`./${plugin}/Dashboard/Content.es6`);
    const SidebarImpl = getForgeComponent(`./${plugin}/Dashboard/Sidebar.es6`);

    return (
      <div className={block}>
        <DashboardHeader snapshotId={snapshotId} />
        <DashboardJumpLabels snapshotId={snapshotId} />

        <div className={`${block}__wrapper`}>
          <div className={`${block}__sidebar`}>
            <SidebarContent snapshot={snapshot} ForgeDetailsComponent={SidebarImpl} />
          </div>
          <div className={`${block}__content`}>
            <Jail component={DashboardImpl} props={{ snapshot, timeframe }} />
          </div>
        </div>
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
