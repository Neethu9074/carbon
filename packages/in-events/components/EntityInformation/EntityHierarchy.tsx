/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { List } from 'immutable';
import React from 'react';

import { combineLatest } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { TimeConfig } from '@instana/types';

import EntityHierarchicalLink from 'in-events/components/EntityInformation/EntityHierarchialLink';
import { getSnapshot, SnapshotData } from 'in-stores/snapshot';

interface EntityHierarchyProps {
  hierarchy: List<string>;
  useSnapshotLink?: boolean;
  kind?: string;
  pathname?: string;
  timeConfig: TimeConfig;
  onClose: () => void;
  isCveRedirect?: boolean;
  filterId?: string;
}

export default function EntityHierarchy({
  hierarchy,
  useSnapshotLink,
  kind,
  pathname,
  timeConfig,
  onClose,
  isCveRedirect,
  filterId
}: EntityHierarchyProps) {
  const snapshots$ = combineLatest(hierarchy.toArray().map((id: string) => getSnapshot(id, timeConfig)));

  const snapshots = useObservable(snapshots$.startWith(null), []);

  if (!snapshots) {
    return null;
  }

  return (
    <>
      {snapshots.map((snapshot: SnapshotData) => {
        return (
          snapshot.get('id') != filterId && (
            <EntityHierarchicalLink
              snapshot={snapshot}
              kind={kind}
              useSnapshotLink={useSnapshotLink}
              pathname={pathname}
              timeConfig={timeConfig}
              isCveRedirect={isCveRedirect}
              onClose={onClose}
            />
          )
        );
      })}
    </>
  );
}
