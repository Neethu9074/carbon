/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Tr, Td } from '@instana/components';

import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { getLinkToProfiles } from 'in-components/Profiling/navigation/paths';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import { getSnapshot, getSnapshotVersions } from 'in-stores/snapshot';
import EntityLink from 'in-components/EntityLink/EntityLink';

export default function Row({ item }) {
  const { processSnapshotId, time, entityLabel, entityPlugin, hostSnapshotPreview } = item;
  if (entityLabel === null) {
    return <RowLabelResolver item={item} />;
  }

  return (
    <Tr size="compact">
      <Td ellipsis="50vw">
        <EntityLink href$={getLinkToProfiles({ processSnapshotId, time })} plugin={entityPlugin} label={entityLabel} />
      </Td>

      <Td noWrap>
        <HostInformation hostSnapshotPreview={hostSnapshotPreview} />
      </Td>
    </Tr>
  );
}

function HostInformation({ hostSnapshotPreview }) {
  if (!hostSnapshotPreview) {
    return valueMissingPlaceholder;
  }

  return (
    <EntityLink
      plugin={hostSnapshotPreview.plugin}
      label={hostSnapshotPreview.label}
      href$={getDashboardLink(hostSnapshotPreview.id, { pathname: '/physical/dashboard' })}
    />
  );
}

function RowLabelResolver({ item }) {
  const { processSnapshotId, time } = item;
  const snapshot = useObservable(getSnapshotVersionsObservable, [processSnapshotId, time]);

  return (
    <Row
      item={{
        ...item,
        entityLabel: snapshot ? snapshot.get('label') : 'Unknown',
        entityPlugin: snapshot ? snapshot.get('plugin') : undefined
      }}
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

function getSnapshotVersionsObservable([processSnapshotId, time]) {
  return getSnapshotVersions(processSnapshotId)
    .filter(Boolean)
    .flatMap(versionList =>
      getSnapshot(processSnapshotId, getTimeConfigForSnapshot(getTimeForSnapshot(versionList.get(0)) || time))
    );
}
