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

export const loadRootCallClickedTracker: (e: Record<string, unknown>) => void;
export const loadChildCallClickedTracker: (e: Record<string, unknown>) => void;
export const retryCallClickedTracker: (e: Record<string, unknown>) => void;
export const analyzeCallsOfTraceClickedTracker: (e: Record<string, unknown>) => void;
export const downloadTraceClickedTracker: (e: Record<string, unknown>) => void;
export const downloadCallDetailsClickedTracker: (e: Record<string, unknown>) => void;
export const ua2ExpandCollapseGroupedListItem: (e: Record<string, unknown>) => void;
export const traceViewTrackIfLargeTrace: (e: Record<string, unknown>) => void;

export { ua2GroupChangedTracker, ua2NestingDepthTracker, ua2QueryBuilderFilterAddedTracker };
