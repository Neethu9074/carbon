/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { TraceActivityListNode } from '@instana/types/typeDefinitions';

export type GeneratedNodeType = GeneratedNode | FakeRootNode | undefined;

export interface TreeResult {
  tree: GeneratedNodeType;
  canLoadMore?: boolean;
  totalHits?: number;
  totalRepresentedItemCount?: number;
  totalRetainedItemCount?: number;
}

interface FakeRootNode {
  id: string;
  label: string;
  parentId: undefined;
  children: GeneratedNode[] | undefined;
}

export interface GeneratedNode extends TraceActivityListNode {
  children: GeneratedNode[] | undefined;
  parentId?: string;
}

interface ListNodeWithParent extends TraceActivityListNode {
  parentId?: string;
}

interface DataObject {
  items: ListNodeWithParent[];
  canLoadMore?: boolean;
  totalHits?: number;
  totalRepresentedItemCount?: number;
  totalRetainedItemCount?: number;
}

export default function buildTraceActivityTree(list: DataObject): TreeResult | undefined {
  const { items, totalHits, canLoadMore, totalRepresentedItemCount, totalRetainedItemCount } = list;

  let hashMap = buildHashMap(items);
  const treeResult: TreeResult = {
    tree: undefined,
    totalHits,
    canLoadMore,
    totalRepresentedItemCount,
    totalRetainedItemCount
  };

  if (!hashMap) {
    return undefined;
  }

  items.forEach(({ id }) => {
    const item = hashMap?.get(id)!;

    if (item.parentId) {
      const parentCall = hashMap?.get(item.parentId);

      // If the parent is missing, attach to the rootCall
      if (!parentCall) {
        if (treeResult.tree) {
          attachNodeToRoot(treeResult.tree, item);
        } else {
          treeResult.tree = attachFakeRootNode(item);
        }
      } else {
        mergeItemWithChildren(parentCall, item);
      }
    } else {
      treeResult.tree = item;
    }
  });

  return treeResult;
}

type MapType = Map<string, GeneratedNode>;

function buildHashMap(items: TraceActivityListNode[]): MapType | undefined {
  const hashMap: MapType = new Map();

  if (items.length === 0) {
    return undefined;
  }

  for (const item of items) {
    hashMap.set(item.id, {
      ...item,
      children: []
    });
  }

  return hashMap;
}

function attachNodeToRoot(rootCall: GeneratedNode | FakeRootNode, item: GeneratedNode) {
  rootCall.children!.push(item);
}

function attachFakeRootNode(item: GeneratedNode): FakeRootNode {
  return {
    id: 'fake_root',
    label: 'Root Call not Received yet',
    parentId: undefined,
    children: [item]
  };
}

function mergeItemWithChildren(parentCall: GeneratedNode, item: GeneratedNode) {
  if (parentCall.children?.some(node => node.id === item.id)) {
    parentCall.children = parentCall.children?.filter(node => node.id !== item.id);
  }

  parentCall.children?.push(item);
}
