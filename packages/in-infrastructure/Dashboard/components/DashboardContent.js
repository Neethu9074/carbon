/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { fromPromise, combineLatest, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import AgentMonitoringIssueNotifications from 'in-infrastructure/Dashboard/components/AgentMonitoringIssueNotifications';
import { selectedSnapshot$, selectedSnapshotId$, getSnapshotVersions } from 'in-stores/snapshot';
import DefaultDashboard from 'in-infrastructure/Dashboard/components/DefaultDashboard';
import DashboardHeader from 'in-infrastructure/Dashboard/components/DashboardHeader';
import SidebarContent from 'in-map/components/MapSidebar/components/SidebarContent';
import NotFoundDialog from 'in-infrastructure/Dashboard/components/NotFoundDialog';
import DefaultSidebar from 'in-infrastructure/Dashboard/components/DefaultSidebar';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { timeConfig$, getTimeConfigAtMoment } from 'in-stores/time/config';
import { alwaysEmptyImmutableList } from 'in-services/fixedStreams';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { getForgeComponent } from 'in-sdk/getForgeComponent';
import { scrollToTopSmoothly } from 'in-services/util/dom';
import { pageNames } from 'in-services/tracking/pageNames';
import { nonServicePlugins } from 'in-forge/constants';
import { getPluginName } from 'in-sdk/pluginName';
import { getLabel } from 'in-sdk/snapshot';
import decamelize from 'in-sdk/decamelize';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import Title from 'in-components/Title';
import Jail from 'in-components/Jail';
import { t } from 'in-i18n';

import locals from './DashboardContent.mless';

export default connectTo(
  {
    snapshotId: selectedSnapshotId$.tap(scrollToTopSmoothly),
    snapshot: selectedSnapshot$,
    timeConfig: timeConfig$,
    showVersionSelector: combineLatest([selectedSnapshotId$, selectedSnapshot$]).map(
      ([snapshotId]) => snapshotId != null
    ),

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
    const rawPlugin = snapshot?.get('plugin');
    const plugin = nonServicePlugins[rawPlugin];
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
        <Title title={t('in-infrastructure:dashboard.infrastructure')} />
        <ViewTrackingMeta
          data={{
            productArea: productAreas.infrastructure,
            pageRootName: pageNames.infrastructure_dashboard
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
                title={getPluginName(plugin, 1) ?? decamelize(rawPlugin)}
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
  return plugin ? fromPromise(getForgeComponent(`./${plugin}/Dashboard/Content`)) : just(DefaultDashboard);
}

function getSidebarImpl([plugin]) {
  return plugin ? fromPromise(getForgeComponent(`./${plugin}/Dashboard/Sidebar`)) : just(DefaultSidebar);
}
