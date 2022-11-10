/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { Link } from '@instana/components';

import { getSnapshot, shouldStayInCurrentTimeModeForNavigationToSnapshot } from 'in-stores/snapshot';
import { getLinkToSnapshotInCurrentView } from 'in-stores/navigation/paths/dashboardPaths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import HealthyPluginIcon from 'in-components/health/HealthyPluginIcon';
import { getLabel as getSnapshotLabel } from 'in-sdk/snapshot';
import { stopPropagation } from 'in-services/util/function';
import { getPhysicalHierarchy } from 'in-stores/snapshot';
import { pendingResult } from 'in-services/fixedObjects';
import { alwaysNull } from 'in-services/fixedStreams';
import Hierarchy from 'in-components/Link/Hierarchy';

import locals from './HierarchicalLink.mless';

export default function HierarchicalLink({
  useSnapshotFromHierarchyCallback: getSnapshotFromHierarchyCallback,
  getLabel,
  kind,
  pathname,
  timeConfig,
  snapshot,
  useSnapshotLink,
  calculateHierarchy,
  useSnapshotFromHierarchyCallback
}) {
  const [isExpanded, setExpanded] = useState(false);
  const snapshotId = snapshot.get('id');
  timeConfig =
    useObservable(() => {
      shouldStayInCurrentTimeModeForNavigationToSnapshot({ snapshotId: snapshot.get('id') }).map(stay =>
        stay ? undefined : timeConfig
      );
    }, [snapshot, timeConfig]) ?? pendingResult;

  const href =
    useObservable(() => {
      return useSnapshotLink
        ? getLinkToSnapshotInCurrentView(snapshotId, { timeConfig: timeConfig })
        : getDashboardLink(snapshotId, {
            pathname: pathname,
            timeConfig: timeConfig
          });
    }, [snapshotId, pathname, timeConfig]) ?? pendingResult;
  const hierarchy =
    useObservable(() => {
      return calculateHierarchy ? getPhysicalHierarchy({ snapshotId, includeCluster: false, timeConfig }) : alwaysNull;
    }, [snapshotId, timeConfig]) ?? pendingResult;

  const hierarchySnapshots =
    useObservable(() => {
      if (useSnapshotFromHierarchyCallback) {
        return hierarchy.flatMap(item => combineLatest(item.toArray().map(id => getSnapshot(id, timeConfig))));
      }
    }, [snapshotId, timeConfig]) ?? pendingResult;

  if (getSnapshotFromHierarchyCallback) {
    snapshot = getSnapshotFromHierarchyCallback(snapshot, hierarchySnapshots);
  }

  const label = getSnapshotLabel(snapshot);

  const link = (
    <Link href={href} onClick={stopPropagation} className={locals.link}>
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
        />
      ) : (
        link
      )}
    </div>
  );
}
