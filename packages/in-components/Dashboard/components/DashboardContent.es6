import { timeout, combineLatest } from 'reactive-observables';
import React from 'react';

import { selectedSnapshot$, selectedSnapshotId$, getSnapshotVersions } from 'in-stores/snapshot';
import DetailPopupPresenter from 'in-components/DetailPopupPresenter/DetailPopupPresenter';
import DashboardJumpLabels from 'in-components/Dashboard/components/DashboardJumpLabels';
import { alwaysFalse, alwaysEmptyImmutableList } from 'in-services/fixedStreams';
import DashboardHeader from 'in-components/Dashboard/components/DashboardHeader';
import SidebarContent from 'in-components/MapSidebar/components/SidebarContent';
import NotFoundDialog from 'in-components/Dashboard/components/NotFoundDialog';
import { timeframe$, focusedMoment$ } from 'in-stores/timeline';
import getForgeComponent from 'in-services/getForgeComponent';
import LoadingIndicator from 'in-components/LoadingIndicator';
import { getLabel, isNewDashboard } from 'in-sdk/snapshot';
import { getSingular } from 'in-sdk/pluginName';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import Jail from 'in-components/Jail';

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
          <LoadingIndicator type="dark" />
        </div>
      );
    } else if (!snapshot && showVersionSelector) {
      return (
        <div className="in-dashboard">
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
    const plugin = snapshot.get('plugin');

    const dashboardTitle = `${getSingular(plugin)} Dashboard`;

    if (isNewDashboard(plugin)) {
      const DashboardImpl = getForgeComponent(`./${plugin}/Dashboard/Dashboard.es6`);

      return (
        <div className="in-dashboard in-dashboard--without-custom-scrolling">
          <Title title={dashboardTitle} dynamic={getLabel(snapshot)} />
          <Jail component={DashboardImpl} props={{ snapshot, timeframe }} />
        </div>
      );
    }

    const DashboardImpl = getForgeComponent(`./${plugin}/Dashboard/Content.es6`);
    const SidebarImpl = getForgeComponent(`./${plugin}/Dashboard/Sidebar.es6`);

    return (
      <Sticky>
        <div className="in-dashboard">
          <Title title={dashboardTitle} dynamic={getLabel(snapshot)} />
          <div className={block}>
            <DetailPopupPresenter />
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
        </div>
      </Sticky>
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
