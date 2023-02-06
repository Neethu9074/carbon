/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TagFilter } from '@instana/types';

export type FilterAddedTrackingPayload = { dataSource: string; tagName: string; tagFilter?: TagFilter };
declare const ua2GroupChangedTracker: (e: { dataSource: string; tagName: string }) => void;
declare const ua2NestingDepthTracker: (e: { dataSource: string; nestingDepth: number }) => void;
declare const ua2QueryBuilderFilterAddedTracker: (e: { dataSource: string; tagName: string }) => void;

export { ua2GroupChangedTracker, ua2NestingDepthTracker, ua2QueryBuilderFilterAddedTracker };
