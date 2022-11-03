/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { SnapshotPreview, TimeConfig } from '@instana/types';
import { Observable } from '@instana/observables';

export function getSnapshot(snapshotId: string, timeConfig?: TimeConfig): Observable<SnapshotPreview>;
