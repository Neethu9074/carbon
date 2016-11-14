import {timeout} from 'reactive-observables';
import React from 'react';

import {selectedSnapshot$, selectedSnapshotId$, getSnapshotVersions} from 'in-stores/snapshot';
import DashboardJumpLabels from 'in-components/Dashboard/components/DashboardJumpLabels';
import DashboardHeader from 'in-components/Dashboard/components/DashboardHeader';
import SidebarContent from 'in-components/MapSidebar/components/SidebarContent';
import NotFoundDialog from 'in-components/Dashboard/components/NotFoundDialog';
import {alwaysFalse, alwaysEmptyImmutableList} from 'in-services/fixedStreams';
import getForgeComponent from 'in-services/getForgeComponent';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {timeframe$} from 'in-stores/timeline';
import connectTo from 'in-hoc/connectTo';
import Jail from 'in-components/Jail';

import './DashboardContent.less';

const block = 'in-dashboard-content';

export default connectTo({
  selectedSnapshotId: selectedSnapshotId$,
  snapshot: selectedSnapshot$,
  timeframe: timeframe$,
  showVersionSelector: selectedSnapshotId$
    .flatMap(snapshotId => {
      if (snapshotId == null) {
        return alwaysFalse;
      }

      return timeout(5000)
        .map(() => true)
        .startWith(false);
    }),
  versionsForFocusedMoment: selectedSnapshotId$.flatMap(snapshotId => {
    if (!snapshotId) {
      return alwaysEmptyImmutableList;
    }

    return getSnapshotVersions(snapshotId)
      .startWith(alwaysEmptyImmutableList);
  }),
  versionsForLive: selectedSnapshotId$.flatMap(snapshotId => {
    if (!snapshotId) {
      return alwaysEmptyImmutableList;
    }

    return getSnapshotVersions(snapshotId, null)
      .startWith(alwaysEmptyImmutableList);
  })
}, function DashboardContent({snapshot, timeframe, showVersionSelector, snapshotId,
    versionsForFocusedMoment, versionsForLive}) {
  if (!snapshot && !showVersionSelector) {
    return <LoadingIndicator type='dark' />;
  } else if (!snapshot && showVersionSelector) {
    return (
      <NotFoundDialog snapshotId={snapshotId}
                      versionsForFocusedMoment={versionsForFocusedMoment}
                      versionsForLive={versionsForLive} />
    );
  }

  const plugin = snapshot.get('plugin');
  const DashboardImpl = getForgeComponent(`./${plugin}/Dashboard/Content.es6`);
  const SidebarImpl = getForgeComponent(`./${plugin}/Dashboard/Sidebar.es6`);

  return (
    <div className={block}>
      <DashboardHeader snapshotId={snapshotId} />
      <DashboardJumpLabels snapshotId={snapshotId} />

      <div className={`${block}__wrapper`}>
        <div className={`${block}__sidebar`}>
          <SidebarContent snapshot={snapshot}
                          ForgeDetailsComponent={SidebarImpl} />
        </div>
        <div className={`${block}__content`}>
          <Jail component={DashboardImpl}
                props={{snapshot, timeframe}}/>
        </div>
      </div>
    </div>
  );
});
