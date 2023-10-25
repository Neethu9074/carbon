/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { List } from 'immutable';

import { Observable } from '@instana/observables';
import { TimeConfig } from '@instana/types';

export type SnapshotData = { [index: string]: any };

export function getSnapshot(snapshotId: string, timeConfig?: TimeConfig): Observable<SnapshotData>;

export function isEntityOnline(snapshotId: string): Observable<boolean>;

export function getPhysicalHierarchy(opts: {
  snapshotId: string;
  timeConfig: TimeConfig;
  includeCluster?: boolean;
  includeKubernetes?: boolean;
}): Observable<List<string>>;
