/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { fromPromise, timeout, combineLatest } from '@instana/observables';
import React from 'react';

import AgentMonitoringIssueNotifications from 'in-infrastructure/Dashboard/components/AgentMonitoringIssueNotifications';
import { selectedSnapshot$, selectedSnapshotId$, getSnapshotVersions } from 'in-stores/snapshot';
import LoadingIndicator from 'in-new-components/LoadingIndicators/LoadingIndicator';
import { alwaysFalse, alwaysEmptyImmutableList } from 'in-services/fixedStreams';
import DashboardHeader from 'in-infrastructure/Dashboard/components/DashboardHeader';
import SidebarContent from 'in-map/components/MapSidebar/components/SidebarContent';
import NotFoundDialog from 'in-infrastructure/Dashboard/components/NotFoundDialog';
import { timeConfig$, getTimeConfigAtMoment } from 'in-stores/time/config';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import { getForgeComponent } from 'in-services/getForgeComponent';
import { scrollToTopSmoothly } from 'in-services/util/dom';
import useObservable from 'in-hooks/useObservable';
import { getSingular } from 'in-sdk/pluginName';
import { getLabel } from 'in-sdk/snapshot';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
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
    const plugin = snapshot?.get('plugin');
    const DashboardImpl = useObservable(getDashboardImpl, [plugin]);
    const SidebarImpl = useObservable(getSidebarImpl, [plugin]);

    if (
      (!snapshot && !showVersionSelector) ||
      (snapshot && snapshotId !== snapshot.get('id')) ||
      (snapshot && (!DashboardImpl || !SidebarImpl))
    ) {
      return (
        <div className={locals.loadingIndicatorWrapper}>
          <LoadingIndicator />
        </div>
      );
    } else if (!snapshot && showVersionSelector) {
      return (
        <div>
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

    return (
      <div>
        <Title title="Infrastructure" />
        <ViewTrackingMeta
          data={{
            productArea: 'Infrastructure',
            pageRootName: 'Infrastructure'
          }}
        />

        <div className={locals.mainContent}>
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
                <AgentMonitoringIssueNotifications snapshot={snapshot} timeConfig={timeConfig} />
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

function getDashboardImpl([plugin]) {
  return plugin && fromPromise(getForgeComponent(`./${plugin}/Dashboard/Content.js`));
}

function getSidebarImpl([plugin]) {
  return plugin && fromPromise(getForgeComponent(`./${plugin}/Dashboard/Sidebar.js`));
}
