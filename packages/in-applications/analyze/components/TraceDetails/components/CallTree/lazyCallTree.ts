/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { CallDetails, CallDetailsItem, IngestionOffsetCursor, Relation, TraceActivityTreeNode } from '@instana/types';

import getRelatedCallsDetails, {
  GetRelatedCallsDetailsResult
} from 'in-applications/subscriptions/getRelatedCallsDetails';
import { GetCallDetailsResult } from 'in-applications/subscriptions/getCallDetails';
import { hasError } from 'in-services/util/result';

/**
 * Number of children or siblings to fetch in a single batch.
 */
const RETRIEVAL_SIZE = 1;

export function getRelatedCallsDetailsWithCursor({
  traceId,
  callId,
  relation,
  cursor
}: {
  traceId: string;
  callId: string;
  relation: Relation;
  cursor?: IngestionOffsetCursor;
}) {
  return getRelatedCallsDetails({
    traceId,
    callId,
    relation,
    pagination: {
      cursor,
      retrievalSize: RETRIEVAL_SIZE
    }
  });
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
}

export type CallNode = LazyParentNode | LazyChildNode | LazySiblingNode | LazyNode | CallDetailsNode;

export interface CallDetailsNode extends CallDetails {
  children: CallNode[];
}

export interface LazyCallTree {
  root: CallNode;
  searchIndex: Map<string, CallNode>;
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
  const searchIndex = new Map<string, CallNode>();
  searchIndex.set(node.id, node);
  return { root: node, searchIndex, traceId };
}

export function updateLazyCallTreeWithRelatedCalls(
  lazyCallTree: LazyCallTree,
  callId: string,
  relation: Relation,
  relatedCalls: GetRelatedCallsDetailsResult
): LazyCallTree {
  if (hasError(relatedCalls)) {
    // TODO: create retry lazy nodes for failed queries
    return lazyCallTree;
  }

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
    relatedCallsParentNode = refreshAllParentNodesToForcePropsChange(newLazyCallTree, call.parentId) as CallDetailsNode;
  }

  if (relatedCallsParentNode == null) {
    return newLazyCallTree;
  }

  const lazyNodeType = toLazyNodeType(relation);

  // remove old lazy node
  const oldLazyChildNodeId = getLazyNodeId(call.id, lazyNodeType);
  newLazyCallTree.searchIndex.delete(oldLazyChildNodeId);

  const existingSiblingNodes = relatedCallsParentNode.children.filter(node => node.id !== oldLazyChildNodeId);
  relatedCallsParentNode.children = [...existingSiblingNodes];

  addLazyRelatedCallNodes(
    callId,
    relation,
    lazyNodeType,
    relatedCallsParentNode.children,
    relatedCalls,
    newLazyCallTree
  );

  return newLazyCallTree;
}

export function updateLazyCallTreeWithParentAndSiblingCalls(
  lazyCallTree: LazyCallTree,
  callId: string,
  parentCallResult: GetCallDetailsResult,
  siblingCallsBeforeResult: GetRelatedCallsDetailsResult,
  siblingCallsAfterResult: GetRelatedCallsDetailsResult
): LazyCallTree {
  // TODO: consume successful results and create retry lazy nodes for failed queries

  let call = lazyCallTree.searchIndex.get(callId);

  const parentCallDetails = parentCallResult.data;
  if (!call || !parentCallDetails) {
    return lazyCallTree;
  }

  const newLazyCallTree: LazyCallTree = {
    ...lazyCallTree
  };

  const oldLazyParentNodeId = getLazyNodeId(parentCallDetails.id, LazyNodeType.PARENT);
  newLazyCallTree.searchIndex.delete(oldLazyParentNodeId);

  const children = [call];
  addLazyRelatedCallNodes(
    callId,
    Relations.SIBLINGS_BEFORE,
    LazyNodeType.SIBLINGS_BEFORE,
    children,
    siblingCallsBeforeResult,
    newLazyCallTree
  );
  addLazyRelatedCallNodes(
    callId,
    Relations.SIBLINGS_AFTER,
    LazyNodeType.SIBLINGS_AFTER,
    children,
    siblingCallsAfterResult,
    newLazyCallTree
  );

  const newParentNode: CallDetailsNode = {
    ...parentCallDetails,
    children
  };

  newLazyCallTree.searchIndex.set(newParentNode.id, newParentNode);
  newLazyCallTree.root = newParentNode;

  const lazyGrandParentNode = toLazyParentNode(newParentNode, newLazyCallTree);
  if (lazyGrandParentNode) {
    newLazyCallTree.root = lazyGrandParentNode;
  }

  return newLazyCallTree;
}

function addLazyRelatedCallNodes(
  callId: string,
  relation: Relation,
  lazyNodeType: LazyNodeType,
  existingCallNodes: CallNode[],
  relatedCallsResult: GetRelatedCallsDetailsResult,
  lazyCallTree: LazyCallTree
): void {
  const data = relatedCallsResult.data;
  if (!data) {
    return;
  }

  const newRelatedCallNodes = relatedCallsResult.data.items.map(item => toCallDetailsNode(item, lazyCallTree));

  const addBefore = relation === Relations.SIBLINGS_BEFORE;
  if (addBefore) {
    existingCallNodes.unshift(...newRelatedCallNodes.reverse());
  } else {
    existingCallNodes.push(...newRelatedCallNodes.reverse());
  }

  if (data?.canLoadMore) {
    const callWithLastCursor: CallDetailsItem = data.items.slice(addBefore ? 0 : -1)[0];

    const lazyRelatedCallNode = {
      id: getLazyNodeId(callId, lazyNodeType),
      lazyNodeType,
      parentId: callWithLastCursor.parentId,
      callId: callId,
      traceId: lazyCallTree.traceId,
      relation: relation,
      cursor: callWithLastCursor.cursor,
      children: []
    };
    lazyCallTree.searchIndex.set(lazyRelatedCallNode.id, lazyRelatedCallNode);

    if (addBefore) {
      existingCallNodes.unshift(lazyRelatedCallNode);
    } else {
      existingCallNodes.push(lazyRelatedCallNode);
    }
  }
}

function toLazyParentNode(childNode: CallDetailsNode, lazyCallTree: LazyCallTree): LazyParentNode | null {
  if (childNode.parentId) {
    const node: LazyParentNode = {
      id: getLazyNodeId(childNode.parentId, LazyNodeType.PARENT),
      lazyNodeType: LazyNodeType.PARENT,
      parentId: childNode.parentId,
      callId: childNode.id, // this is needed to load siblings
      traceId: lazyCallTree.traceId,
      children: [childNode]
    };

    lazyCallTree.searchIndex.set(node.id, node);
    return node;
  }
  return null;
}

function toCallDetailsNode(callDetails: CallDetails, lazyCallTree: LazyCallTree): CallDetailsNode {
  const node: CallDetailsNode = { ...callDetails, children: [] };
  lazyCallTree.searchIndex.set(node.id, node);
  if (node.hasChildren) {
    const lazyChildNode: LazyChildNode = {
      id: getLazyNodeId(node.id, LazyNodeType.CHILDREN),
      lazyNodeType: LazyNodeType.CHILDREN,
      parentId: callDetails.id,
      callId: callDetails.id,
      traceId: lazyCallTree.traceId,
      relation: Relations.CHILDREN,
      children: []
    };
    lazyCallTree.searchIndex.set(lazyChildNode.id, lazyChildNode);
    node.children.push(lazyChildNode);
  }
  return node;
}

function refreshAllParentNodesToForcePropsChange(lazyCallTree: LazyCallTree, callId?: string): CallNode | null {
  if (!callId) {
    return null;
  }

  let node =
    lazyCallTree.searchIndex.get(callId) ?? lazyCallTree.searchIndex.get(getLazyNodeId(callId, LazyNodeType.PARENT));
  if (!node) {
    return null;
  }

  let parentNodeCopy: any = null;
  if (node.parentId && !isLazyParentNode(node)) {
    parentNodeCopy = refreshAllParentNodesToForcePropsChange(lazyCallTree, node.parentId);
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
