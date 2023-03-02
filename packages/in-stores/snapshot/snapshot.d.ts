/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Observable } from '@instana/observables';
import { TimeConfig } from '@instana/types';

export type SnapshotData = { [index: string]: any };

export function getSnapshot(snapshotId: string, timeConfig?: TimeConfig): Observable<SnapshotData>;
