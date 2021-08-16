/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { just } from '@instana/observables';

import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import getProfilesAvailable from 'in-components/Profiling/subscriptions/getProfilesAvailable';
import EntityVersionDialog from 'in-infrastructure/Dashboard/components/EntityVersionDialog';
import { getDashboardHeaderActions, getAnalyzeLogsHref$ } from 'in-sdk/snapshot';
import { getLinkToProfiles } from 'in-components/Profiling/navigation/paths';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { jumpToLogs } from 'in-logging/analyze/AnalyzeView/tracker';
import { containerLogsEnabled } from 'in-services/featureFlags';
import { MoreMenuCollapser } from 'in-components/MoreMenu';
import { getPhysicalHierarchy } from 'in-stores/snapshot';
import { getSnapshots } from 'in-stores/snapshot';
import { plugins } from 'in-forge/constants';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  ({ snapshot, snapshotId, timeConfig }) => {
    const processSnapshotId$ =
      snapshot.get('plugin') === plugins.process ? just(snapshotId) : getProcessSnapshotId(snapshotId, timeConfig);
    return {
      processSnapshotId: processSnapshotId$,
      isInternalVisible: isInternalVisible$,
      analyzeLogsHref: containerLogsEnabled && getAnalyzeLogsHref$({ snapshot, timeConfig }),
      profilesAvailable: processSnapshotId$.flatMap(processSnapshotId =>
        getProfilesAvailable({
          processSnapshotId,
          timeConfig
        }).map(result => result.data && result.data.containsProfiles)
      )
    };
  },
  function DashboardHeaderButtonSection(props) {
    const {
      isInternalVisible,
      snapshot,
      snapshotId,
      processSnapshotId,
      analyzeLogsHref,
      timeConfig,
      profilesAvailable
    } = props;

    return (
      <MoreMenuCollapser
        items={[
          ...getDashboardHeaderActions(props),
          isInternalVisible && {
            label: t('in-infrastructure:dashboard.snapshotVersions'),
            icon: 'lib_views_list',
            onClick: ({ snapshotId, timeConfig }) =>
              addActiveDialog(<EntityVersionDialog snapshotId={snapshotId} timeConfig={timeConfig} />)
          },
          profilesAvailable && {
            label: t('in-infrastructure:dashboard.analyzeProfiles'),
            icon: 'lib_profiling',
            href$: getLinkToProfiles({ processSnapshotId })
          },
          analyzeLogsHref && {
            label: t('in-infrastructure:dashboard.analyzeLogs'),
            icon: 'lib_analyze',
            href: analyzeLogsHref,
            onClick: ({ snapshotId, snapshot }) =>
              jumpToLogs({ source: 'analyze logs from infra dashboard', plugin: snapshot.get('plugin'), snapshotId })
          }
        ].filter(Boolean)}
        snapshot={snapshot}
        snapshotId={snapshotId}
        timeConfig={timeConfig}
      />
    );
  }
);

export function getProcessSnapshotId(snapshotId, timeConfig) {
  return getPhysicalHierarchy({ snapshotId, timeConfig, includeCluster: false, includeKubernetes: false })
    .flatMap(getSnapshots)
    .map(snapshots => snapshots.filter(snapshot => snapshot.get('plugin') === plugins.process))
    .map(snapshots => (snapshots.length > 0 ? snapshots[0].get('id') : undefined));
}
