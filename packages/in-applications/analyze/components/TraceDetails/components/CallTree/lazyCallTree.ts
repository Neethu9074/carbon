/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import invariant from 'invariant';

import {
  CallDetails,
  CallDetailsItem,
  Endpoint,
  EndpointType,
  Error,
  IngestionOffsetCursor,
  Relation,
  TraceActivityTreeNode
} from '@instana/types';
import { createLogger } from '@instana/logger';

import { isFakeRootCall } from 'in-applications/analyze/components/TraceDetails/components/callHelper';
import { GetRelatedCallsDetailsResult } from 'in-applications/subscriptions/getRelatedCallsDetails';
import { GetCallDetailsResult } from 'in-applications/subscriptions/getCallDetails';
import { hasError, isLoading } from 'in-services/util/result';
import { t } from 'in-i18n';

const logger = createLogger('in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree');

export const FAKE_ROOT_CALL_ID = 'fake_root';

// Exposed for testing only
export const FAKE_PARENT_CALL_FOREIGN: CallDetails = {
  id: FAKE_ROOT_CALL_ID,
  label: t('in-applications:traceDetail.foreignRootCall'),
  start: 0,
  waitingTime: 0,
  duration: 0,
  errorCount: 0,
  selfTime: 0,
  type: 'UNDEFINED',
  batchCount: 1,
  hasChildren: true,
  endpoint: {
    id: 'UNKNOWN',
    label: 'Unspecified',
    serviceId: '',
    type: 'UNDEFINED',
    technologies: []
  },
  service: {
    id: 'UNKNOWN',
    label: 'Unspecified',
    snapshotIds: [],
    technologies: [],
    types: ['UNDEFINED']
  }
};

// Exposed for testing only
export const FAKE_PARENT_CALL_NOT_YET_ARRIVED = {
  ...FAKE_PARENT_CALL_FOREIGN,
  label: t('in-applications:traceDetail.notYetReceivedRootCall')
};

export enum FakeRootType {
  PARENT_NOT_YET_ARRIVED,
  FOREIGN_PARENT
}

export enum LazyNodeType {
  PARENT = 'PARENT',
  SIBLINGS_BEFORE = 'SIBLINGS_BEFORE',
  SIBLINGS_AFTER = 'SIBLINGS_AFTER',
  CHILDREN = 'CHILDREN'
}

export enum Relations {
  SIBLINGS_BEFORE = 'SIBLINGS_BEFORE',
  SIBLINGS_AFTER = 'SIBLINGS_AFTER',
  CHILDREN = 'CHILDREN'
}

function toLazyNodeType(relation: Relation): LazyNodeType {
  switch (relation) {
    case Relations.SIBLINGS_BEFORE:
      return LazyNodeType.SIBLINGS_BEFORE;
    case Relations.SIBLINGS_AFTER:
      return LazyNodeType.SIBLINGS_AFTER;
  }
  return LazyNodeType.CHILDREN;
}

export interface LazyParentNode extends LazyNode {
  lazyNodeType: LazyNodeType.PARENT;
  parentId: string;
  children: CallNode[];
}

export interface LazyChildNode extends LazyNode {
  lazyNodeType: LazyNodeType.CHILDREN;
  cursor?: IngestionOffsetCursor;
  relation: Relation;
  parentId: string;
}

export interface LazySiblingNode extends LazyNode {
  lazyNodeType: LazyNodeType.SIBLINGS_BEFORE | LazyNodeType.SIBLINGS_AFTER;
  cursor: IngestionOffsetCursor;
  relation: Relation;
}

export interface LazyNode {
  lazyNodeType: LazyNodeType;
  id: string;
  traceId: string;
  callId: string;
  parentId?: string;
  children: CallNode[];
  /**
   * Errors of the last failed loading attempt.
   */
  errors?: Error[];
}

type FakeRootCall = {
  id: string;
  label: string;
  children: CallNode[];
  start: number;
  batchCount: number;
  duration: number;
  errorCount: number;
  hasChildren: boolean;
  selfTime?: number;
  type: EndpointType;
  waitingTime: number;
  parentId: null;
  endpoint: Endpoint;
};

export type CallNode = LazyParentNode | LazyChildNode | LazySiblingNode | LazyNode | CallDetailsNode | FakeRootCall;

export interface CallDetailsNode extends Writeable<CallDetails> {
  children: CallNode[];
}

export type SearchIndexType = Map<string, CallNode>;

export interface LazyCallTree {
  root: CallNode;
  searchIndex: SearchIndexType;
  traceId: string;
}

export function isLazyNode(node: CallNode | TraceActivityTreeNode): node is LazyNode {
  return (node as LazyNode).lazyNodeType != null;
}

export function isCallNode(node: CallNode | TraceActivityTreeNode): node is CallDetailsNode | TraceActivityTreeNode {
  return !isLazyNode(node);
}

export function isLazyParentNode(node: CallNode | TraceActivityTreeNode): node is LazyParentNode {
  return isLazyNode(node) && node.lazyNodeType === LazyNodeType.PARENT;
}

export function initLazyCallTree({
  callDetails,
  traceId
}: {
  callDetails: CallDetails;
  traceId: string;
}): LazyCallTree {
  const node = { ...callDetails, children: [] };

  const searchIndex = new Map<string, CallDetailsNode | LazyNode>();
  searchIndex.set(node.id, node);

  return { root: node, searchIndex, traceId };
}

export function updateLazyCallTreeWithRelatedCalls(
  lazyCallTree: LazyCallTree,
  callId: string,
  relation: Relation,
  relatedCalls: GetRelatedCallsDetailsResult
): LazyCallTree {
  let call: CallDetailsNode = lazyCallTree.searchIndex.get(callId) as CallDetailsNode;

  if (!call || !relatedCalls.data?.items) {
    return lazyCallTree;
  }

  const newLazyCallTree = {
    ...lazyCallTree
  };

  let relatedCallsParentNode: CallDetailsNode;
  if (relation === Relations.CHILDREN) {
    relatedCallsParentNode = refreshAllParentNodesToForcePropsChange(newLazyCallTree, callId) as CallDetailsNode;
  } else {
    relatedCallsParentNode = refreshAllParentNodesToForcePropsChange(
      newLazyCallTree,
      call.parentId!
    ) as CallDetailsNode;
  }

  if (relatedCallsParentNode == null) {
    if (__DEV__) {
      logger.warn(
        'Related calls parent node not found',
        lazyCallTree.root,
        Array.from(lazyCallTree.searchIndex.entries()),
        callId,
        relation,
        relatedCalls
      );
    }
    return newLazyCallTree;
  }

  const lazyNodeType = toLazyNodeType(relation);

  // remove old lazy node
  const oldLazyChildNodeId = getLazyNodeId(call.id, lazyNodeType);
  const oldLazyNode = newLazyCallTree.searchIndex.get(oldLazyChildNodeId) as LazySiblingNode | LazyChildNode;
  newLazyCallTree.searchIndex.delete(oldLazyChildNodeId);

  const existingSiblingNodes = relatedCallsParentNode.children.filter(node => node.id !== oldLazyChildNodeId);
  relatedCallsParentNode.children = [...existingSiblingNodes];

  addLazyRelatedCallNodes(
    newLazyCallTree,
    call,
    relation,
    lazyNodeType,
    relatedCallsParentNode.children,
    relatedCalls,
    oldLazyNode?.cursor
  );

  if (isFakeRootCall(relatedCallsParentNode)) {
    // if children of the fake root call got update, we have to update the computed fields
    const [start, duration] = computeParentsStartAndDuration(relatedCallsParentNode.children);
    relatedCallsParentNode.start = start;
    relatedCallsParentNode.duration = duration;
  }

  return newLazyCallTree;
}

export function updateLazyCallTreeWithParentAndSiblingCalls(
  lazyCallTree: LazyCallTree,
  callId: string,
  parentCallResult: GetCallDetailsResult,
  siblingCallsBeforeResult: GetRelatedCallsDetailsResult,
  siblingCallsAfterResult: GetRelatedCallsDetailsResult
): LazyCallTree {
  const callNode = lazyCallTree.searchIndex.get(callId) as CallDetailsNode;
  if (!callNode) {
    if (__DEV__) {
      logger.warn(
        `The call with callId ${callId} should be present in the call tree`,
        lazyCallTree.root,
        Array.from(lazyCallTree.searchIndex.entries())
      );
    }
    return lazyCallTree;
  }

  const newLazyCallTree = { ...lazyCallTree };

  const oldLazyParentNodeId = getLazyNodeId(callId, LazyNodeType.PARENT);
  newLazyCallTree.searchIndex.delete(oldLazyParentNodeId);

  if (hasError(parentCallResult) && !isMissingParentNotYetArrived(parentCallResult)) {
    // If loading of the parent call failed, do not process the related calls results even if
    // they might have been successful. This is in order to keep things simple. Otherwise, we
    // would have to adjust the hook which fetches to parent call and siblings calls before and
    // after.
    createLazyParentNode(newLazyCallTree, callNode, parentCallResult.errors);
    return newLazyCallTree;
  }

  const children = [callNode];
  addLazyRelatedCallNodes(
    newLazyCallTree,
    callNode,
    Relations.SIBLINGS_BEFORE,
    LazyNodeType.SIBLINGS_BEFORE,
    children,
    siblingCallsBeforeResult
  );

  addLazyRelatedCallNodes(
    newLazyCallTree,
    callNode,
    Relations.SIBLINGS_AFTER,
    LazyNodeType.SIBLINGS_AFTER,
    children,
    siblingCallsAfterResult
  );

  if (isMissingForeignParent(parentCallResult)) {
    createFakeRootCall(newLazyCallTree, children, FakeRootType.FOREIGN_PARENT);
  } else if (isMissingParentNotYetArrived(parentCallResult)) {
    createFakeRootCall(newLazyCallTree, children, FakeRootType.PARENT_NOT_YET_ARRIVED);
  } else {
    createParentCallNode(newLazyCallTree, parentCallResult, children);
  }

  return newLazyCallTree;
}

function createParentCallNode(
  newLazyCallTree: LazyCallTree,
  parentCallResult: GetCallDetailsResult,
  children: CallDetailsNode[]
) {
  const parentNode = {
    ...parentCallResult.data,
    children
  } as CallDetailsNode;

  newLazyCallTree.root = parentNode;
  newLazyCallTree.searchIndex.set(parentNode.id, parentNode);

  if (parentNode.parentId) {
    createLazyParentNode(newLazyCallTree, parentNode);
  } else if (parentNode.foreignParentId) {
    createFakeRootCall(newLazyCallTree, [parentNode], FakeRootType.FOREIGN_PARENT);
  }
}

function addLazyRelatedCallNodes(
  lazyCallTree: LazyCallTree,
  call: CallDetailsNode,
  relation: Relation,
  lazyNodeType: LazyNodeType,
  existingCallNodes: CallNode[],
  relatedCallsResult: GetRelatedCallsDetailsResult,
  lastCursor?: IngestionOffsetCursor
) {
  const addBefore = relation === Relations.SIBLINGS_BEFORE;

  if (hasError(relatedCallsResult)) {
    createLazyRelatedCall(
      lazyCallTree,
      call.id,
      existingCallNodes,
      relation,
      lazyNodeType,
      addBefore,
      call.parentId,
      lastCursor,
      relatedCallsResult.errors
    );
    return;
  }

  const data = relatedCallsResult.data;
  if (!data) {
    return;
  }

  const newRelatedCallNodes = relatedCallsResult.data.items.map(item => createCallDetailsNode(item, lazyCallTree));

  if (addBefore) {
    existingCallNodes.unshift(...newRelatedCallNodes.reverse());
  } else {
    existingCallNodes.push(...newRelatedCallNodes.reverse());
  }

  if (data.canLoadMore) {
    const callWithLastCursor: CallDetailsItem = data.items.slice(addBefore ? 0 : -1)[0];
    createLazyRelatedCall(
      lazyCallTree,
      call.id,
      existingCallNodes,
      relation,
      lazyNodeType,
      addBefore,
      call.parentId,
      callWithLastCursor.cursor
    );
  }
}

function createLazyRelatedCall(
  lazyCallTree: LazyCallTree,
  callId: string,
  existingCalls: CallNode[],
  relation: Relation,
  lazyNodeType: LazyNodeType,
  addBefore: boolean,
  parentId?: string,
  cursor?: IngestionOffsetCursor,
  errors?: Error[]
) {
  const lazyRelatedCallNode = {
    id: getLazyNodeId(callId, lazyNodeType),
    lazyNodeType,
    callId,
    parentId,
    traceId: lazyCallTree.traceId,
    relation: relation,
    children: [],
    ...(parentId && { parentId }),
    ...(cursor && { cursor }),
    ...(errors && { errors })
  };

  lazyCallTree.searchIndex.set(lazyRelatedCallNode.id, lazyRelatedCallNode);

  if (addBefore) {
    existingCalls.unshift(lazyRelatedCallNode);
  } else {
    existingCalls.push(lazyRelatedCallNode);
  }
}

function createLazyParentNode(lazyCallTree: LazyCallTree, callNode: CallDetailsNode, errors?: Error[]) {
  if (__DEV__) {
    invariant(callNode.parentId != null, 'A lazy parent node can be created only for calls with parentId != null');
  }

  const lazyParentNode: LazyParentNode = {
    id: getLazyNodeId(callNode.id, LazyNodeType.PARENT),
    lazyNodeType: LazyNodeType.PARENT,
    parentId: callNode.parentId!,
    callId: callNode.id, // this is needed to load siblings
    traceId: lazyCallTree.traceId,
    children: [callNode],
    errors
  };

  lazyCallTree.root = lazyParentNode;
  lazyCallTree.searchIndex.set(lazyParentNode.id, lazyParentNode);
}

function createFakeRootCall(lazyCallTree: LazyCallTree, children: CallNode[], fakeRootType: FakeRootType) {
  const [start, duration] = computeParentsStartAndDuration(children);

  const fakeRootNode: CallDetailsNode = {
    ...(fakeRootType === FakeRootType.FOREIGN_PARENT ? FAKE_PARENT_CALL_FOREIGN : FAKE_PARENT_CALL_NOT_YET_ARRIVED),
    start,
    duration,
    children
  };

  children.forEach((child: any) => (child.parentId = fakeRootNode.id));

  lazyCallTree.root = fakeRootNode;
  lazyCallTree.searchIndex.set(fakeRootNode.id, fakeRootNode);
}

function computeParentsStartAndDuration(children: CallNode[]) {
  const start = Math.min(...children.map(c => (isCallNode(c) ? c.start : Number.MAX_VALUE)));
  const end = Math.max(...children.map(c => (isCallNode(c) ? c.start + c.duration : 0)));
  return [start, end - start];
}

function createCallDetailsNode(callDetailsItem: CallDetailsItem, lazyCallTree: LazyCallTree): CallDetailsNode {
  // discard the cursor, which we do not need to keep in the call tree
  const { cursor, ...node } = { ...callDetailsItem, children: [] as CallNode[] };

  lazyCallTree.searchIndex.set(node.id, node);

  if (node.hasChildren) {
    const lazyChildNode = {
      id: getLazyNodeId(node.id, LazyNodeType.CHILDREN),
      lazyNodeType: LazyNodeType.CHILDREN,
      parentId: callDetailsItem.id,
      callId: callDetailsItem.id,
      traceId: lazyCallTree.traceId,
      relation: Relations.CHILDREN,
      children: []
    } as LazyChildNode;

    lazyCallTree.searchIndex.set(lazyChildNode.id, lazyChildNode);
    node.children.push(lazyChildNode);
  }
  return node;
}

function isMissingForeignParent(parentCallResult: GetCallDetailsResult): boolean {
  return parentCallResult == null || isLoading(parentCallResult);
}

function isMissingParentNotYetArrived(parentCallResult: GetCallDetailsResult): boolean {
  return hasError(parentCallResult) && parentCallResult.errors.some(error => error.code === 'NOT_FOUND');
}

// visible for testing only
export function refreshAllParentNodesToForcePropsChange(lazyCallTree: LazyCallTree, callId: string): CallNode | null {
  let node = lazyCallTree.searchIndex.get(callId);
  if (!node) {
    if (__DEV__) {
      logger.warn(
        `The call with callId ${callId} should be present in the call tree`,
        lazyCallTree.root,
        Array.from(lazyCallTree.searchIndex.entries())
      );
    }
    return null;
  }

  let parentNodeCopy: any = null;
  const hasParent = node.parentId && !isLazyParentNode(node);
  if (hasParent) {
    let parentId: string = node.parentId!;
    if (!lazyCallTree.searchIndex.has(parentId)) {
      parentId = getLazyNodeId(node.id, LazyNodeType.PARENT);
    }
    if (!lazyCallTree.searchIndex.has(parentId)) {
      parentId = FAKE_ROOT_CALL_ID;
    }
    parentNodeCopy = refreshAllParentNodesToForcePropsChange(lazyCallTree, parentId);
  }

  const nodeCopy = { ...node };
  lazyCallTree.searchIndex.set(node.id, nodeCopy);

  if (parentNodeCopy) {
    var index = parentNodeCopy.children.indexOf(node);
    if (index > -1) {
      parentNodeCopy.children[index] = nodeCopy;
    }
  } else {
    lazyCallTree.root = nodeCopy;
  }

  return nodeCopy;
}

function getLazyNodeId(callId: string, lazyNodeType: LazyNodeType): string {
  return lazyNodeType + ':' + callId;
}

type Writeable<T> = { -readonly [P in keyof T]: Writeable<T[P]> };
