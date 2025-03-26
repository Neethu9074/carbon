/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo, useState } from 'react';

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import { useGetDashboardLink, useGetLinkToSnapshotInCurrentView } from 'in-stores/navigation/paths/dashboardPaths';
import { getSnapshot, shouldStayInCurrentTimeModeForNavigationToSnapshot } from 'in-stores/snapshot';
import HealthyPluginIcon from 'in-components/health/HealthyPluginIcon';
import { noop, stopPropagation } from 'in-services/util/function';
import { getLabel as getSnapshotLabel } from 'in-sdk/snapshot';
import { getPhysicalHierarchy } from 'in-stores/snapshot';
import { alwaysNull } from 'in-services/fixedStreams';
import Hierarchy from 'in-components/Link/Hierarchy';

import locals from './HierarchicalLink.mless';

export default function HierarchicalLink({
  useSnapshotFromHierarchyCallback: getSnapshotFromHierarchyCallback,
  getLabel,
  kind,
  pathname,
  timeConfig: originalTimeConfig,
  snapshot,
  useSnapshotLink,
  calculateHierarchy,
  onClose,
  isCveRedirect
}) {
  const [isExpanded, setExpanded] = useState(false);
  const snapshotId = snapshot.get('id');
  const timeConfig = useObservable(
    () =>
      shouldStayInCurrentTimeModeForNavigationToSnapshot({ snapshotId, timeConfig: originalTimeConfig }).map(stay =>
        stay ? originalTimeConfig : undefined
      ),
    [snapshotId, originalTimeConfig]
  );

  const dashboardLink = useGetDashboardLink()(snapshotId, { pathname, timeConfig });
  const snapshotLink = useGetLinkToSnapshotInCurrentView(snapshotId, { timeConfig: timeConfig });

  const href = useSnapshotLink ? snapshotLink : dashboardLink;

  const $hierarchy = useMemo(
    () => (calculateHierarchy ? getPhysicalHierarchy({ snapshotId, includeCluster: false, timeConfig }) : alwaysNull),
    [snapshotId, timeConfig, calculateHierarchy]
  );

  const hierarchy = useObservable($hierarchy, [snapshotId, timeConfig, calculateHierarchy]);

  const hierarchySnapshots = useObservable(() => {
    if (getSnapshotFromHierarchyCallback) {
      return $hierarchy.flatMap(item => combineLatest(item.toArray().map(id => getSnapshot(id, timeConfig))));
    }
  }, [snapshotId, timeConfig, getSnapshotFromHierarchyCallback, $hierarchy]);

  if (getSnapshotFromHierarchyCallback) {
    snapshot = getSnapshotFromHierarchyCallback(snapshot, hierarchySnapshots);
  }

  const label = getSnapshotLabel(snapshot);

  const close = e => {
    onClose();
    stopPropagation(e);
  };

  const link = (
    <Link href={href} onClick={e => (isCveRedirect ? close(e) : noop)} className={locals.link}>
      <HealthyPluginIcon className={locals.pluginIcon} snapshot={snapshot} size="xs" />
      {getLabel ? getLabel(label) : label}
    </Link>
  );

  if (!hierarchy || hierarchy.size < 2) {
    return link;
  }
  return (
    <div className={locals.link}>
      <SvgIcon
        className={locals.infoIcon}
        onClick={e => {
          stopPropagation(e);
          setExpanded(!isExpanded);
        }}
        type={isExpanded ? 'lib_openclose_remove_circle_outline' : 'lib_openclose_add_circle_outline'}
        size="xs"
      />
      {isExpanded ? (
        <Hierarchy
          hierarchy={hierarchy}
          kind={kind}
          hierarchySnapshots={hierarchySnapshots}
          useSnapshotLink={useSnapshotLink}
          pathname={pathname}
          timeConfig={timeConfig}
          isCveRedirect={isCveRedirect}
          onClose={onClose}
        />
      ) : (
        link
      )}
    </div>
  );
}
