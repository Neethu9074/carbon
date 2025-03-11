/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { getSnapshot, getSnapshotVersions } from 'in-stores/snapshot';
import EntityLink from 'in-components/EntityLink/EntityLink';

export function HostInformation({ hostSnapshotPreview }) {
  const getDashboardLink = useGetDashboardLink();
  if (!hostSnapshotPreview) {
    return valueMissingPlaceholder;
  }

  return (
    <EntityLink
      plugin={hostSnapshotPreview.plugin}
      label={hostSnapshotPreview.label}
      href={getDashboardLink(hostSnapshotPreview.id, { pathname: '/physical/dashboard' })}
    />
  );
}

function getTimeForSnapshot(version) {
  if (!version) {
    return null;
  }
  return version.get('to') - (version.get('to') - version.get('from')) / 2;
}

function getTimeConfigForSnapshot(to) {
  return {
    to,
    focusedMoment: to,
    windowSize: 1,
    autoRefresh: false
  };
}

export function getSnapshotVersionsObservable([processSnapshotId, time]) {
  return getSnapshotVersions(processSnapshotId)
    .filter(Boolean)
    .flatMap(versionList =>
      getSnapshot(processSnapshotId, getTimeConfigForSnapshot(getTimeForSnapshot(versionList.get(0)) || time))
    );
}
