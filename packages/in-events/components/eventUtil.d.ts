/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Snapshot, TimeConfig } from '@instana/types';

import { EventOrMap } from 'in-events/types';

export declare function hasManualCloseFields(event: EventOrMap): boolean;

export declare function getEventStateBadge(event: EventOrMap): JSX;

export declare function getTimeConfigForSnapshotRetrieval(
  event: EventOrMap,
  latestSnapshot: Snapshot
): TimeConfig | null;
