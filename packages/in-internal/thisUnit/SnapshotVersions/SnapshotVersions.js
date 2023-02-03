/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import diff from 'deep-diff';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';

import createSnapshotVersionsInTimeframeObservable from 'in-subscription/snapshotVersionsInTimeframe';
import VersionTimeline from 'in-components/VersionTimeline';
import { alwaysNull } from 'in-services/fixedStreams';
import { timeConfig$ } from 'in-stores/time/config';
import useUrlState from 'in-hooks/useUrlState';
import Input from 'in-components/form/Input';
import Code from 'in-components/Code';
import { t } from 'in-i18n';

import locals from './SnapshotVersions.mless';

export default function SnapshotVersions() {
  const [selectedSnapshot, setSelectedSnapshot] = useState(null);

  const urlStateConfig = {
    bind: [
      {
        path: '/snapshotVersions',
        name: 'snapshotId',
        as: 'snapshotId',
        initialState: ''
      }
    ],
    replaceHistory: false
  };
  const [{ snapshotId }, setSnapshotId] = useUrlState(urlStateConfig);
  const [signal, setSignal] = useState(true);

  const snapshotVersionsResponse = useObservable(
    timeConfig$
      .debounce(100)
      .flatMap(timeConfig => (!signal || !snapshotId ? alwaysNull : getSnapshotVersions(snapshotId, timeConfig)))
      .filter(res => res && res.snapshotVersions),
    [snapshotId, signal]
  );
  return (
    <div className={locals.view}>
      <div className={locals.header}>
        <Input
          className={locals.input}
          type="text"
          id="snapshotId-value"
          placeholder={t('in-internal:thisUnit.snapshotVersions.snapshotId')}
          value={snapshotId}
          onChange={e => {
            setSignal(false);
            setSnapshotId({ snapshotId: e.target.value });
          }}
          autoFocus
        />
        <Button onClick={() => setSignal(true)}>{t('in-internal:thisUnit.snapshotVersions.refresh')}</Button>
      </div>

      <div className={locals.content}>
        {snapshotVersionsResponse && (
          <VersionTimeline
            versions={snapshotVersionsResponse.snapshotVersions}
            from={
              (snapshotVersionsResponse.timeConfig.to || Date.now()) - snapshotVersionsResponse.timeConfig.windowSize
            }
            to={snapshotVersionsResponse.timeConfig.to || Date.now()}
            onVersionClick={version => setSelectedSnapshot(selectedSnapshot === version ? null : version)}
            selectedVersion={selectedSnapshot}
            getTooltip={snapshot => <DiffTootltipContent snapshot={snapshot} />}
          />
        )}
        {selectedSnapshot && (
          <div className={locals.codeWrapper}>
            <Code code={JSON.stringify(selectedSnapshot, 0, 2)} lang="json" />
          </div>
        )}
      </div>
    </div>
  );
}

export function getSnapshotVersions(snapshotId, timeConfig) {
  return createSnapshotVersionsInTimeframeObservable({ snapshotId, timeConfig })
    .map(enrichDiffs)
    .map(_snapshotVersions => ({
      timeConfig: { ...timeConfig, to: timeConfig.to || Date.now() },
      snapshotVersions: _snapshotVersions
    }));
}

function enrichDiffs(snapshots) {
  if (!snapshots || snapshots.length <= 1) {
    return snapshots;
  }

  snapshots.sort((s1, s2) => s1.from - s2.from);

  const differences = [];
  for (let i = 1; i < snapshots.length; i++) {
    differences[i] = difference(snapshots[i - 1], snapshots[i]);
  }

  for (let i = 0; i < differences.length; i++) {
    snapshots[i].__difference = differences[i];
  }
  return snapshots;
}

function difference(lhs, rhs) {
  const mask = ['timestamp', 'from', 'to'];
  return diff(lhs, rhs, (path, key) => path.length === 0 && ~mask.indexOf(key));
}

function DiffTootltipContent({ snapshot }) {
  if (!snapshot.__difference) {
    return null;
  }
  return <Code code={JSON.stringify(snapshot.__difference, 0, 2)} lang="json" />;
}
