import { timeout, combineLatest } from 'reactive-observables';
import React from 'react';

import { selectedSnapshot$, selectedSnapshotId$, getSnapshotVersions } from 'in-stores/snapshot';
import DetailPopupPresenter from 'in-components/DetailPopupPresenter/DetailPopupPresenter';
import { alwaysFalse, alwaysEmptyImmutableList } from 'in-services/fixedStreams';
import DashboardHeader from 'in-components/Dashboard/components/DashboardHeader';
import SidebarContent from 'in-components/MapSidebar/components/SidebarContent';
import NotFoundDialog from 'in-components/Dashboard/components/NotFoundDialog';
import { timeConfig$, getTimeConfigAtMoment } from 'in-stores/time/config';
import getForgeComponent from 'in-services/getForgeComponent';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { scrollToTopSmoothly } from 'in-services/util/dom';
import { getSingular } from 'in-sdk/pluginName';
import { getLabel } from 'in-sdk/snapshot';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import Jail from 'in-components/Jail';

import locals from './DashboardContent.mless';

export default connectTo(
  {
    snapshotId: selectedSnapshotId$.tap(scrollToTopSmoothly),
    // hide temporary unavailability due to loading lag
    snapshot: selectedSnapshot$,
    timeConfig: timeConfig$,
    showVersionSelector: combineLatest([selectedSnapshotId$, selectedSnapshot$]).flatMap(([snapshotId]) => {
      if (snapshotId == null) {
        return alwaysFalse;
      }

      return timeout(5000)
        .map(() => true)
        .startWith(false);
    }),

    // snapshot versions
    versionsForFocusedMoment: getSnapshotVersionsByTime(),
    versionsForLive: getSnapshotVersionsByTime(getTimeConfigAtMoment(null))
  },
  function DashboardContent({
    snapshot,
    timeConfig,
    showVersionSelector,
    snapshotId,
    versionsForFocusedMoment,
    versionsForLive
  }) {
    if ((!snapshot && !showVersionSelector) || (snapshot && snapshotId !== snapshot.get('id'))) {
      return (
        <div className="in-dashboard">
          <LoadingIndicator type="dark" />
        </div>
      );
    } else if (!snapshot && showVersionSelector) {
      return (
        <div className="in-dashboard">
          <div className={locals.notFoundDialog}>
            <NotFoundDialog
              snapshotId={snapshotId}
              versionsForFocusedMoment={versionsForFocusedMoment}
              versionsForLive={versionsForLive}
            />
          </div>
        </div>
      );
    }

    // Protect against race conditions: Use the snapshotId from the snapshot. This can happen
    // when the dashboard is closed and the selectedSnapshotId store is already cleared while
    // the selectedSnapshot store is not.
    snapshotId = snapshot.get('id');

    //check if new dashboard implementation is needed
    const plugin = snapshot.get('plugin');

    const DashboardImpl = getForgeComponent(`./${plugin}/Dashboard/Content.es6`);
    const SidebarImpl = getForgeComponent(`./${plugin}/Dashboard/Sidebar.es6`);

    return (
      <div className="in-dashboard">
        <div className={locals.mainContent}>
          <DetailPopupPresenter />
          <Sticky
            header={
              <DashboardHeader
                snapshotId={snapshotId}
                snapshot={snapshot}
                timeConfig={timeConfig}
                plugin={plugin}
                title={getSingular(plugin)}
                getLabel={() => getLabel(snapshot)}
              />
            }
          >
            <div className={locals.wrapper}>
              <div className={locals.sidebar}>
                <SidebarContent snapshot={snapshot} ForgeDetailsComponent={SidebarImpl} />
              </div>
              <div className={locals.content}>
                <Jail component={DashboardImpl} props={{ snapshot, timeConfig }} />
              </div>
            </div>
          </Sticky>
        </div>
      </div>
    );
  }
);

function getSnapshotVersionsByTime(timeConfig) {
  return selectedSnapshotId$.flatMap(snapshotId => {
    if (!snapshotId) {
      return alwaysEmptyImmutableList;
    }

    return getSnapshotVersions(snapshotId, timeConfig).startWith(null);
  });
}
