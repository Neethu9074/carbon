/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { EntityType, entityTypes, TAG_TYPES } from 'in-analyze/applicationFilter';
import { compareIgnoreCase } from 'in-services/util/string';
import { Nullish, TagFilter, TagType } from 'in-types';
import { deepCopy } from 'in-services/util/object';
import { role } from 'in-stores/user';

export const defaultGroupings = {
  calls: {
    groupbyTag: 'endpoint.name',
    groupbyTagEntity: 'DESTINATION'
  },
  traces: {
    groupbyTag: 'trace.endpoint.name'
  }
} as const;

export const callAnalysisDisabledTags = [
  'trace.id',
  'trace.name',
  'trace.endpoint.name',
  'trace.service.name',
  'trace.latency',
  'trace.erroneous',
  'call.inbound_of_application'
] as const;

export const traceAnalysisDisabledTags = ['call.latency'] as const;

const disabledLists = {
  general: (() => {
    const disabledList: Record<string, boolean> = {
      'application.id': !role?.canSeeInternalTags,
      'boundary.application.id': !role?.canSeeInternalTags,
      'service.id': !role?.canSeeInternalTags,
      'service.rule_id': !role?.canSeeInternalTags,
      'endpoint.id': !role?.canSeeInternalTags,
      'endpoint.type': !role?.canSeeInternalTags,
      'process.id': true,
      'docker.container.id': true,
      'containerd.container.id': true,
      'garden.container.id': true,
      'crio.container.id': true,
      'podman.container.id': true,
      'host.snapshotId': !role?.canSeeInternalTags,
      'container.snapshotId': !role?.canSeeInternalTags,
      'process.snapshotId': !role?.canSeeInternalTags,
      'cluster.snapshotId': !role?.canSeeInternalTags,
      'cloud.snapshotId': !role?.canSeeInternalTags,
      'call.span_type': !role?.canSeeInternalTags,
      'call.http.hostCapturedFromSource': !role?.canSeeInternalTags,
      'call.meta_tags': !role?.canSeeInternalTags,
      'call.ingestion_time': !role?.canSeeInternalTags,
      'log.span_type': !role?.canSeeInternalTags,
      'related.infra.entity.snapshotId': !role?.canSeeInternalTags,
      'related.infra.entity.pluginId': !role?.canSeeInternalTags,
      'eum.correlation.id': !role?.canSeeInternalTags,
      'eum.correlation.type': !role?.canSeeInternalTags,
      'trace.service.id': !role?.canSeeInternalTags,
      'call.id': !role?.canSeeInternalTags
    };
    return (tag?: string) => !!tag && disabledList[tag];
  })(),
  callGroup: (() => {
    const disabledList = callAnalysisDisabledTags.reduce((agg: Partial<Record<string, boolean>>, k) => {
      agg[k] = true;
      return agg;
    }, {});
    return (tag?: string): boolean => !!tag && (disabledList[tag] || isBeaconTag(tag));
  })(),
  analyzeFilter: isBeaconTag
};

function isBeaconTag(tag?: string): boolean {
  return tag?.indexOf('beacon.') === 0 || tag?.indexOf('mobileBeacon.') === 0;
}

const latencyTags = ['call.latency', 'trace.latency', 'beacon.duration'];

export function isLatencyTag(tag: string): boolean {
  return latencyTags.includes(tag);
}

export const getTraceGroupTagKeys = () => ['trace.endpoint.name', 'trace.service.name'];

export const getCallGroupTagKeys = () =>
  getTagTree()
    .getChildren({ isTagOnDisabledList: disabledLists.callGroup })
    .map(node => node.name);

export const getAnalyzeFilterTagKeys = () =>
  getTagTree()
    .getChildren({ isTagOnDisabledList: disabledLists.analyzeFilter })
    .map(node => node.name);

export function getApplicationCreationTagKeys(): string[] {
  const applicationCreationDisabledlist: Record<string, boolean> = {
    'host.mac': true,
    'docker.container.name': true,
    'crio.container.name': true,
    'podman.container.name': true,
    'aws.service.type': true,
    'application.id': true,
    'application.name': true,
    'call.name': true,
    'trace.id': true,
    'trace.service.name': true,
    'trace.endpoint.name': true,
    'trace.name': true,
    'log.level': true,
    'log.message': true,
    'call.error.message': true,
    'cloudfoundry.container.garden.id': true
  };
  getTagTree();
  let tagKeys: string[] = [];
  Object.keys(tagMap!).forEach(item => {
    const tag = tagMap![item];
    if (
      tag.type &&
      (tag.type === TAG_TYPES.STRING.technicalName ||
        tag.type === TAG_TYPES.KEY_VALUE_PAIR.technicalName ||
        tag.name === 'call.http.status') &&
      !applicationCreationDisabledlist[tag.fullyQualifiedName] &&
      !isBeaconTag(tag.fullyQualifiedName)
    ) {
      tagKeys.push(tag.fullyQualifiedName);
    }
  });
  return tagKeys;
}

interface TagKey {
  fullyQualifiedName?: string;
  name?: string;
}

function isDisabled(serverTag: TagKey, isTagOnDisabledList: (tagName?: string) => boolean): boolean {
  return isTagOnDisabledList(serverTag.fullyQualifiedName) || isTagOnDisabledList(serverTag.name);
}

let tagTree: TagTreeNode | null = null;
let tagMap: Record<string, TagTreeNode> | null = null;

export function getTagTree(): TagTreeNode {
  if (tagTree == null) {
    buildTagTree();
  }

  return tagTree!; // buildTagTree will ensure TagTree has been generated before
}

export function getTagMap(): Record<string, TagTreeNode> {
  if (tagMap == null) {
    buildTagTree();
  }

  return tagMap!; // buildTagTree will ensure TagTree has been generated before
}

function buildTagTree() {
  const rootNode = createNode('root');
  tagTree = rootNode;
  tagMap = {};

  let tags = window?.instana?.tags ?? [];

  tags = deepCopy(tags)
    .filter(tag => !isDisabled(tag, disabledLists.general))
    // @ts-expect-error The backend type is missing annotations, which makes the name optional. This is very hard to deal with for sorting purposes, because a fallback cannot be defined without changing sort order. I.e. and empty string is sorted differently from undefined
    .sort((a, b) => compareIgnoreCase(a.name, b.name));

  tags.forEach(tag => {
    const node = createNode(tag.name ?? '', {
      fullyQualifiedName: tag.name,
      parentNode: rootNode
    });

    tagMap![node.fullyQualifiedName] = node;
    node.type = tag.type;
    node.canApplyToSource = tag.canApplyToSource;
    node.canApplyToDestination = tag.canApplyToDestination;
    node.sourceValueAvailableFrom = tag.sourceValueAvailableFrom;
    rootNode.addChild(node);
  });
}

interface GetChildrenArgs {
  isTagOnDisabledList?: (tagName?: string) => boolean;
}

interface TagTreeNodeProps {
  children?: TagTreeNode[];
  parentNode?: TagTreeNode;
  fullyQualifiedName?: string;
}

type TagTreeNode = {
  name: string;
  parentNode?: TagTreeNode;
  fullyQualifiedName: string;
  getChildren: (args: GetChildrenArgs) => TagTreeNode[];
  addChild: (child: TagTreeNode) => void;
  type?: TagType;
  canApplyToSource?: boolean;
  canApplyToDestination?: boolean;
  sourceValueAvailableFrom?: number;
};

function createNode(name: string, props: TagTreeNodeProps = {}): TagTreeNode {
  let children = props.children || [];
  return {
    name,
    parentNode: props.parentNode,
    fullyQualifiedName: props.fullyQualifiedName ?? '',
    getChildren({ isTagOnDisabledList } = {}) {
      let _children = children;
      if (isTagOnDisabledList) {
        _children = _children.filter(tag => !isDisabled(tag, isTagOnDisabledList));
      }
      return _children;
    },
    addChild(child) {
      children.push(child);
    }
  };
}

export function findSubTreeByFullyQualifiedName(fullyQualifiedName: string): TagTreeNode {
  getTagTree();
  return tagMap![fullyQualifiedName];
}

export function requiresSecondLevelName(fullyQualifiedName: string): boolean {
  const node = findSubTreeByFullyQualifiedName(fullyQualifiedName);
  return node && node.type === TAG_TYPES.KEY_VALUE_PAIR.technicalName;
}

export function getTagType(fullyQualifiedName: string): TagType | Nullish {
  const definition = findSubTreeByFullyQualifiedName(fullyQualifiedName);
  return definition ? definition.type : null;
}

export function getTagEntity(fullyQualifiedName: string): EntityType {
  const definition = findSubTreeByFullyQualifiedName(fullyQualifiedName);
  if (definition && definition.canApplyToDestination && definition.canApplyToSource) {
    return entityTypes.SOURCE_AND_DESTINATION;
  } else if (definition && definition.canApplyToDestination && !definition.canApplyToSource) {
    return entityTypes.DESTINATION;
  } else if (definition && !definition.canApplyToDestination && definition.canApplyToSource) {
    return entityTypes.SOURCE;
  } else {
    return entityTypes.NOT_APPLICABLE;
  }
}

export function getTagFromList(tagFilter: TagFilter[], _tag: TagFilter): TagFilter | null {
  for (const tag of tagFilter) {
    if (_tag.name && _tag.name !== tag.name) {
      continue;
    }
    if (_tag.value && _tag.value !== tag.value) {
      continue;
    }
    if (_tag.operator && _tag.operator !== tag.operator) {
      continue;
    }

    return tag;
  }

  return null;
}

export function getMultipleTagFromList(tagFilter: TagFilter[], _tag: TagFilter): TagFilter[] {
  const result: TagFilter[] = [];

  tagFilter.forEach(tag => {
    if (_tag.name && _tag.name !== tag.name) {
      return;
    }
    if (_tag.value && _tag.value !== tag.value) {
      return;
    }
    if (_tag.operator && _tag.operator !== tag.operator) {
      return;
    }

    result.push(tag);
  });

  return result;
}

export function getKeyValuePairTag(_tag: string): TagTreeNode | null {
  const tagMap = getTagMap();
  const tags = Object.keys(tagMap).map(key => tagMap[key]);
  for (let i = 0; i < tags.length; i++) {
    const tag = tags[i];
    if (tag.type === TAG_TYPES.KEY_VALUE_PAIR.technicalName) {
      if (_tag.indexOf(tag.fullyQualifiedName) === 0) {
        return tag;
      }
    }
  }
  return null;
}

export function isIdTag(tagName: string): boolean {
  return tagName.endsWith('.id') || tagName.endsWith('.snapshotId');
}
