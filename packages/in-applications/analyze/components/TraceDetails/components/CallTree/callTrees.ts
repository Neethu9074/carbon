/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { TraceActivityTreeNode } from '@instana/types';

import {
  LazyCallTree,
  CallNode
} from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';
import { limitVisibleNestingLevelsInTraceEnabled } from 'in-services/featureFlags';
import { Result } from 'in-types';

export const MAX_VISIBLE_NESTING_LEVELS = 10;

export const CALL_ID_HIDDEN_PARENTS = 'hidden_parents';

export function isParenWithHiddenNestingLevel(node: CallNode | TraceActivityTreeNodeWithParentId) {
  return node.id === CALL_ID_HIDDEN_PARENTS;
}

export function isHiddenNestingLevel(depth: number) {
  return limitVisibleNestingLevelsInTraceEnabled && depth > MAX_VISIBLE_NESTING_LEVELS;
}

export function isVisibleNestingLevel(depth: number) {
  return !isHiddenNestingLevel(depth);
}

/**
 * Extends a node in eagerly loaded call tree, by adding a reference to the parent node.
 */
export interface TraceActivityTreeNodeWithParentId extends Writeable<TraceActivityTreeNode> {
  parentId?: string;
}

export interface LazyCallTreeResult extends CallTreeResult<CallNode> {
  lazyCallTree?: LazyCallTree;
}

export type EagerCallTreeResult = CallTreeResult<TraceActivityTreeNodeWithParentId>;

export interface CallTreeResult<T extends CallNode | TraceActivityTreeNodeWithParentId> extends Result<T> {
  /** Must be set when request was successful. */
  searchIndex?: SearchIndex<T>;
}

/**
 * Represents a successful CallTreeResult (lazy or eager) with populated search index and data.
 */
export interface SuccessfulCallTreeResult<T extends CallNode | TraceActivityTreeNodeWithParentId>
  extends CallTreeResult<T> {
  searchIndex: SearchIndex<T>;
  data: T;
}

export type SearchIndex<T extends CallNode | TraceActivityTreeNodeWithParentId> = Map<string, T>;

export type Writeable<T> = { -readonly [P in keyof T]: Writeable<T[P]> };
